import { useCallback, useRef, useState } from 'react';
import {
  useAudioRecorder,
  useAudioRecorderState,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
} from 'expo-audio';

export default function useVoiceRecording() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 100);
  const [isRecording, setIsRecording] = useState(false);
  const startedAtRef = useRef(null);

  const start = useCallback(async () => {
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) {
      throw new Error("Permission d'enregistrement audio refusée");
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });

    await recorder.prepareToRecordAsync();
    recorder.record();
    startedAtRef.current = Date.now();
    setIsRecording(true);
  }, [recorder]);

  const stop = useCallback(async () => {
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false });
    setIsRecording(false);

    const durationMillis = startedAtRef.current
      ? Date.now() - startedAtRef.current
      : 0;
    startedAtRef.current = null;

    return { uri: recorder.uri, durationMillis };
  }, [recorder]);

  return {
    isRecording,
    start,
    stop,
    meterLevel: recorderState.metering,
  };
}
