import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "features/auth/authSlice";
import { RootState, AppDispatch } from "app/store";

const useCurrentUser = () => {
  const dispatch: AppDispatch = useDispatch();

  const { hasCheckedUsername, username } = useSelector((state: RootState) => {
    const username = state.username;
    return { hasCheckedUsername: username !== null, username };
  });

  useEffect(() => {
    if (!hasCheckedUsername) {
      dispatch(getCurrentUser());
    }
  }, [hasCheckedUsername]);

  return { hasCheckedUsername, username };
};

export default useCurrentUser;
