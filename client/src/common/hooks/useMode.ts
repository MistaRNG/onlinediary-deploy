import { useDispatch, useSelector } from "react-redux";
import { toggleMode, getMode } from "features/mode/modeSlice";
import { useEffect } from "react";
import { RootState } from "app/store";
import { AppDispatch } from "app/store";

/**
 * Custom hook to manage and toggle the dark mode state of the application.
 * 
 * This hook fetches the current mode from the Redux state and provides a toggle function 
 * to switch between light and dark modes. It uses an effect to initially load the mode state.
 * 
 * @returns {Object} - An object containing:
 * - `darkMode`: The current mode state (true for dark mode, false otherwise).
 * - `toggleDarkMode`: A function to toggle the mode between dark and light.
 */
const useMode = () => {
  const dispatch = useDispatch<AppDispatch>();

  const darkMode = useSelector((state: RootState) => state.mode);

  const toggleDarkMode = () => dispatch(toggleMode());

  useEffect(() => {
    dispatch(getMode());
  }, [dispatch]);

  return { darkMode, toggleDarkMode };
};

export default useMode;
