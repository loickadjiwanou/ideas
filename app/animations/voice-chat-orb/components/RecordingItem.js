import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

function formatDuration(millis = 0) {
  const totalSeconds = Math.max(0, Math.round(millis / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RecordingItem({ recording, onDelete }) {
  const player = useAudioPlayer(recording.uri);
  const status = useAudioPlayerStatus(player);

  const isPlaying = status.playing;

  useEffect(() => {
    if (status.didJustFinish) {
      player.seekTo(0);
    }
  }, [status.didJustFinish, player]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleStop = () => {
    player.pause();
    player.seekTo(0);
  };

  return (
    <View style={styles.row}>
      <Pressable
        onPress={handleTogglePlay}
        style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}
        hitSlop={6}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={16}
          color="#EDEDF2"
          style={!isPlaying ? styles.playIconOffset : undefined}
        />
      </Pressable>

      <View style={styles.info}>
        <Text style={styles.title}>Enregistrement</Text>
        <Text style={styles.subtitle}>
          {formatTime(recording.createdAt)} · {formatDuration(recording.durationMillis)}
        </Text>
      </View>

      <Pressable
        onPress={handleStop}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        hitSlop={6}
        disabled={!isPlaying}
      >
        <Ionicons
          name="stop"
          size={16}
          color={isPlaying ? '#EDEDF2' : '#4A4A52'}
        />
      </Pressable>

      <Pressable
        onPress={() => onDelete(recording.id)}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        hitSlop={6}
      >
        <Ionicons name="trash-outline" size={16} color="#E5484D" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 10,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconOffset: {
    marginLeft: 2,
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#EDEDF2',
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    color: '#8A8A93',
    fontSize: 12,
    marginTop: 2,
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
