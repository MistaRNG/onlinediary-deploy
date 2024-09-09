import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "features/auth/authSlice";
import { RootState, AppDispatch } from "app/store";

/**
 * Custom hook that manages the current user's state by checking and fetching the username.
 * 
 * This hook uses Redux to check if the username has been retrieved. If not, it triggers
 * a dispatch to fetch the current user information. The hook returns the status of the
 * username check and the username itself.
 *
 * @returns {Object} - An object containing:
 * - `hasCheckedUsername`: A boolean indicating if the username has been checked.
 * - `username`: The username of the current user, or null if not available.
 */
const useCurrentUser = () => {
  const dispatch: AppDispatch = useDispatch();

  const { hasCheckedUsername, username } = useSelector((state: RootState) => {
    const username = typeof state.username === 'string' ? state.username : null;
    return { hasCheckedUsername: username !== null, username };
  });

  useEffect(() => {
    if (!hasCheckedUsername) {
      dispatch(getCurrentUser());
    }
  }, [hasCheckedUsername, dispatch]);

  return { hasCheckedUsername, username };
};

export default useCurrentUser;