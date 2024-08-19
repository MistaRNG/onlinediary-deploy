import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { removeError } from "features/error/errorSlice";
import { RootState } from "../../app/store";

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
