import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MicButton({ onPress, recording = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        recording && styles.buttonRecording,
        pressed && styles.pressed,
      ]}
      hitSlop={8}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={recording ? 'stop' : 'mic'}
          size={26}
          color={recording ? '#fff' : '#111'}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F1F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buttonRecording: {
    backgroundColor: '#111111',
  },
  pressed: {
    opacity: 0.85,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
