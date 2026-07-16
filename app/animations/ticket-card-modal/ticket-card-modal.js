import React, { useEffect } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import styles from "./styles";

const TicketCardModal = ({ visible, onClose, ticket }) => {
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);
  const backdrop = useSharedValue(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateX.value = 0;
      translateY.value = 0;

      backdrop.value = withTiming(1, { duration: 150 });
      opacity.value = withTiming(1, { duration: 150 });

      scale.value = withSpring(1, {
        damping: 18,
        stiffness: 160,
      });
    } else {
      backdrop.value = withTiming(0, { duration: 120 });
      opacity.value = withTiming(0, { duration: 120 });
      scale.value = withTiming(0.95, { duration: 120 });
    }
  }, [visible]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0, {
        damping: 18,
        stiffness: 260,
        mass: 0.6,
      });

      translateY.value = withSpring(0, {
        damping: 18,
        stiffness: 260,
        mass: 0.6,
      });
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
    pointerEvents: backdrop.value === 0 ? "none" : "auto",
  }));

  const handlePrint = () => {
    Alert.alert("Ticket printed");
  };

  return (
    <View style={styles.container}>
      {/* BACKDROP */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.appName}>ALCKLAST</Text>

            <Text style={styles.subtitle}>Here is your ticket number</Text>

            <View style={styles.ticketBox}>
              <Text style={styles.ticketNumber}>
                {ticket?.number || "Y1H11"}
              </Text>
            </View>

            <View style={styles.stats}>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>10</Text>
                <Text style={styles.statLabel}>people ahead of you</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.statBlock}>
                <Text style={styles.statValue}>3h 20min</Text>
                <Text style={styles.statLabel}>to wait</Text>
              </View>
            </View>
          </View>

          {/* BODY */}
          <View style={styles.body}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Queue</Text>
              <Text style={styles.value}>thesmart</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Service</Text>
              <Text style={styles.value}>yeah1</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Joined</Text>
              <Text style={styles.value}>Apr 30, 2026 12:38 PM</Text>
            </View>
          </View>

          {/* ✅ FOOTER BUTTONS */}
          <View style={styles.footer}>
            <Pressable style={styles.backButton} onPress={onClose}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>

            <Pressable style={styles.printButton} onPress={handlePrint}>
              <Text style={styles.printText}>Print</Text>
            </Pressable>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default TicketCardModal;
