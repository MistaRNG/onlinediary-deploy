import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isTimeUp } from "common/helpers";
import { lock, unlock, CHECK_LOCK_INTERVAL } from "features/safety/safetySlice";
import { RootState } from "app/store";
import { AppDispatch } from "app/store";

const useSafety = () => {
  const { alarm, locked, username } = useSelector((state: RootState) => {
    return { alarm: state.safety.alarm, locked: state.safety.locked, username: state.username };
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (username === "") dispatch(unlock());

  }, [username]);

  useEffect(() => {
    if (!locked && username) {
      const t = setInterval(() => {
        if (isTimeUp(alarm)) dispatch(lock);
      }, CHECK_LOCK_INTERVAL);
      return () => clearInterval(t);
    }
  }, [locked, alarm, username]);

  return locked;
};

export default useSafety;
