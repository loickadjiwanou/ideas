import React, { useState, useCallback } from "react";
import { View, Button } from "react-native";
import TicketCardModal from "./ticket-card-modal";
import { useFocusEffect } from "expo-router";
import { useSetScreenTheme } from "../../../utils/ScreenThemeContext";

const TicketCardExample = () => {
  useSetScreenTheme("dark");
  const [visible, setVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {};
    }, []),
  );

  const ticket = {
    number: "A123",
    service: "Paiement",
    date: "30 Avril 2026",
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

      {!visible && (
        <Button title="Afficher le ticket" onPress={() => setVisible(true)} />
      )}

      <TicketCardModal
        visible={visible}
        onClose={() => setVisible(false)}
        ticket={ticket}
      />
    </View>
  );
};

export default TicketCardExample;
