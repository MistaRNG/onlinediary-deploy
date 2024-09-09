import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { removeError } from "features/error/errorSlice";
import { RootState } from "../../app/store";

/**
 * Custom hook that manages error state and provides a handler to dismiss errors.
 * 
 * This hook uses Redux to retrieve the current error state and tracks any changes 
 * to update the displayed error. It also provides a function to dismiss the error.
 *
 * @returns {Object} - An object containing:
 * - `displayedError`: The currently displayed error message, or null if none.
 * - `dismissHandler`: A function to remove the current error from the state.
 */
const useError = () => {
  const dispatch = useDispatch();
  
  const { error, trackErrorChange } = useSelector((state: RootState) => {
    return { 
      error: state.error.error, 
      trackErrorChange: state.error.trackErrorChange 
    };
  });

  const [displayedError, setDisplayedError] = useState<string | null>(error);

  useEffect(() => {
    if (error && displayedError) {
      setDisplayedError(null);
      const t = setTimeout(() => setDisplayedError(error), 1);
      return () => clearTimeout(t);
    }

    setDisplayedError(error);
    // eslint-disable-next-line
  }, [trackErrorChange, error]);

  const dismissHandler = () => dispatch(removeError);

  return { displayedError, dismissHandler };
};

export default useError;
