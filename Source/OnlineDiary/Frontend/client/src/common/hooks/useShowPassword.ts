import { useState } from "react";

const useShowPassword = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return { showPassword, toggleShowPassword };
};

export default useShowPassword;
