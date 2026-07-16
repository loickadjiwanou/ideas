import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RecordingItem from './RecordingItem';

export default function RecordingsList({ recordings, onDelete }) {
  if (!recordings || recordings.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enregistrements</Text>
      <View style={styles.list}>
        {recordings.map((recording, index) => {
          const isLast = index === recordings.length - 1;

          return (
            <View
              key={recording.id}
              style={isLast && { paddingBottom: 120 }}
            >
              <RecordingItem
                recording={recording}
                onDelete={onDelete}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    color: '#8A8A93',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  list: {
    gap: 8,
  },
});
