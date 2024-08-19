import { useDispatch, useSelector } from "react-redux";
import { toggleMode, getMode } from "features/mode/modeSlice";
import { useEffect } from "react";
import { RootState } from "app/store";
import { AppDispatch } from "app/store";

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
