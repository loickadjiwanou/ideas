import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { TabIcon } from "./tab-icon";
import { HOME_ITEMS, NOTIFICATION_ITEMS, SEARCH_OPTIONS } from "../utils/constants";
import { popupBodyStyles as styles } from "../utils/popup-body-styles";

function HomePopupBody({ colors }) {
  return (
    <View style={[styles.menuPad, { minWidth: 240 }]}>
      {HOME_ITEMS.map((item) => (
        <Pressable
          key={item.text}
          style={({ pressed }) => [
            styles.menuRow,
            { backgroundColor: pressed ? colors.hover : "transparent" },
          ]}
        >
          <TabIcon name={item.icon} size={20} color={colors.muted} />
          <Text style={[styles.menuText, { color: colors.foreground }]}>
            {item.text}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function SearchPopupBody({ colors }) {
  return (
    <View style={[styles.menuPad, { minWidth: 280 }]}>
      <View
        style={[
          styles.searchInput,
          { backgroundColor: colors.input, borderColor: colors.border },
        ]}
      >
        <TabIcon name="search" size={16} color={colors.muted} />
        <TextInput
          placeholder="Search anything..."
          placeholderTextColor={colors.muted}
          style={[styles.searchText, { color: colors.foreground }]}
        />
      </View>
      <View style={styles.searchRow}>
        {SEARCH_OPTIONS.map((item) => (
          <Pressable
            key={item.text}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: pressed ? colors.hover : colors.input,
                borderColor: colors.border,
              },
            ]}
          >
            <TabIcon name={item.icon} size={14} color={colors.muted} />
            <Text style={[styles.menuText, { color: colors.foreground }]}>
              {item.text}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ProfilePopupBody({ colors }) {
  return (
    <View style={[styles.menuPad, { minWidth: 240 }]}>
      {NOTIFICATION_ITEMS.map((item) => (
        <Pressable
          key={item.text}
          style={({ pressed }) => [
            styles.menuRow,
            { backgroundColor: pressed ? colors.hover : "transparent" },
          ]}
        >
          <TabIcon name={item.icon} size={20} color={colors.muted} />
          <Text style={[styles.menuText, { color: colors.foreground }]}>
            {item.text}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function PopupBody(context) {
  if (context.route.name === "home") return <HomePopupBody {...context} />;
  if (context.route.name === "search") return <SearchPopupBody {...context} />;
  return <ProfilePopupBody {...context} />;
}
