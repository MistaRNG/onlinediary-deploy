import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isTimeUp } from "common/helpers";
import { lock, unlock, CHECK_LOCK_INTERVAL } from "features/safety/safetySlice";
import { RootState } from "app/store";
import { AppDispatch } from "app/store";

/**
 * Custom hook that manages the safety lock state based on user activity and alarm triggers.
 * 
 * This hook monitors the user's session and automatically locks the app when the alarm time is up 
 * and the user is inactive. It also unlocks the app when no username is detected.
 * 
 * @returns {boolean} - A boolean indicating if the app is currently locked.
 */
const useSafety = () => {
  const { alarm, locked, username } = useSelector((state: RootState) => {
    return { alarm: state.safety.alarm, locked: state.safety.locked, username: state.username };
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (username === "") dispatch(unlock());
    // eslint-disable-next-line
  }, [username]);

  useEffect(() => {
    if (!locked && username) {
      const t = setInterval(() => {
        if (isTimeUp(alarm)) dispatch(lock);
      }, CHECK_LOCK_INTERVAL);
      return () => clearInterval(t);
    }
    // eslint-disable-next-line
  }, [locked, alarm, username]);

  return locked;
};

export default useSafety;
