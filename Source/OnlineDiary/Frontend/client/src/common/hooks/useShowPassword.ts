import { useState } from "react";

/**
 * Custom hook to manage the visibility state of password input fields.
 * 
 * This hook provides a simple mechanism to toggle the visibility of a password field,
 * allowing the user to view or hide their input.
 * 
 * @returns {Object} - An object containing:
 * - `showPassword`: A boolean indicating whether the password is currently visible.
 * - `toggleShowPassword`: A function to toggle the visibility state of the password.
 */
const useShowPassword = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return { showPassword, toggleShowPassword };
};

export default useShowPassword;
