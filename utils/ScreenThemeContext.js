import React, { createContext, useCallback, useContext, useState } from "react";
import { useFocusEffect } from "expo-router";

const ScreenThemeContext = createContext({
  theme: "light",
  setTheme: () => { },
});

export function ScreenThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");

  const setTheme = useCallback((t) => {
    setThemeState(t);
  }, []);

  return (
    <ScreenThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ScreenThemeContext.Provider>
  );
}

export function useScreenTheme() {
  return useContext(ScreenThemeContext);
}

/**
 * Call this in a screen to declare its background theme.
 * "light" = dark background → white icons/text
 * "dark"  = light background → black icons/text
 */
export default function useSetScreenTheme(screenTheme) {
  const { setTheme } = useScreenTheme();

  useFocusEffect(
    useCallback(() => {
      setTheme(screenTheme);
      return () => {
        setTheme("light");
      };
    }, [screenTheme, setTheme]),
  );
}
