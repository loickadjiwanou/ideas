import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import Orb from './components/Orb';
import MicButton from './components/MicButton';
import RecordingsList from './components/RecordingsList';
import { useVoiceRecording } from './hooks/useVoiceRecording';
import triggerHaptic from '../../../utils/haptics';

export default function VoiceChatOrb({
  onRecordingComplete,
  recordingLabel = 'Je t’écoute…',
  showRecordingsList = true,
}) {
  const { isRecording, start, stop } = useVoiceRecording();
  const [error, setError] = useState(null);
  const [recordings, setRecordings] = useState([]);

  const handlePress = useCallback(async () => {
    setError(null);
    try {
      if (!isRecording) {
        await start();
      } else {
        const { uri, durationMillis } = await stop();
        if (uri) {
          const newRecording = {
            id: Date.now().toString(),
            uri,
            durationMillis,
            createdAt: Date.now(),
          };
          setRecordings((prev) => [newRecording, ...prev]);
          onRecordingComplete?.(newRecording);
        }
      }
    } catch (e) {
      setError(e?.message ?? "Erreur pendant l'enregistrement");
    }
  }, [isRecording, start, stop, onRecordingComplete]);

  const handleDelete = useCallback((id) => {
    // TODO: add real file and audio deletion
    Alert.alert(
      "Suppression",
      "Voulez-vous supprimer cet enregistrement ?",
      [
        {
          text: "Annuler",
          style: "cancel",
          onPress: () => { },
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            triggerHaptic("medium");
            setRecordings((prev) => prev.filter((r) => r.id !== id));
          },
        },
      ]
    );
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader title="Voice Chat Orb" />

      <ScrollView style={{ flex: 1, marginTop: 110 }}>
        {showRecordingsList && (
          <RecordingsList recordings={recordings} onDelete={handleDelete} />
        )}
      </ScrollView>


      <View style={styles.bottomSection}>
        {isRecording && (
          <View style={styles.orbWrap}>
            <Orb size={180} active />
            <Text style={styles.hint}>{recordingLabel}</Text>
          </View>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.bottomBar}>
          <MicButton onPress={handlePress} recording={isRecording} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: "#000"
  },
  bottomSection: {
    marginTop: 'auto',
    paddingTop: 10,
    height: 370,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  orbWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  hint: {
    marginTop: 16,
    color: '#8A8A8E',
    fontSize: 14,
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  bottomBar: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
  },
});
