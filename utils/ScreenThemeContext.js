import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { useFocusEffect } from "expo-router";

const ScreenThemeContext = createContext({
  theme: "light",
  setTheme: () => { },
});

export const ScreenThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState("light");

  const setTheme = useCallback((t) => {
    setThemeState(t);
  }, []);

  return (
    <ScreenThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ScreenThemeContext.Provider>
  );
};

export const useScreenTheme = () => {
  return useContext(ScreenThemeContext);
};

export const useSetScreenTheme = (screenTheme) => {
  const { setTheme } = useScreenTheme();

  useFocusEffect(
    useCallback(() => {
      setTheme(screenTheme);

      return () => {
        setTheme("light");
      };
    }, [screenTheme, setTheme])
  );
};