import "./ToggleDarkModeButton.css";
import { Button } from "@blueprintjs/core";
import React from "react";

interface ToggleDarkModeButtonProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ToggleDarkModeButton: React.FC<ToggleDarkModeButtonProps> = ({ darkMode, toggleDarkMode }) => {
  const icon = darkMode ? "flash" : "moon";
  return (
    <div className="DarkModeButton">
      <Button onClick={toggleDarkMode} icon={icon} />
    </div>
  );
};

export default ToggleDarkModeButton;
