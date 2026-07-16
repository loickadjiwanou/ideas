import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Orb from './components/Orb';
import MicButton from './components/MicButton';
import RecordingsList from './components/RecordingsList';
import { useVoiceRecording } from './hooks/useVoiceRecording';


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
        setRecordings((prev) => prev.filter((r) => r.id !== id));
    }, []);

    return (
        <View style={styles.container}>
            {showRecordingsList && (
                <RecordingsList recordings={recordings} onDelete={handleDelete} />
            )}

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
    },
    bottomSection: {
        marginTop: 'auto',
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
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 14,
    },
});
