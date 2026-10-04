import { ThemeContext } from "./useTheme";
import { useState, type ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext value={{ darkMode, toggleTheme }}>{children}</ThemeContext>
  );
}
