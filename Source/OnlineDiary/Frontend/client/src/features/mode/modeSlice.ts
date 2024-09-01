import axios from "axios";
import { displayError } from "features/error/errorSlice";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../../app/store";

export const TOGGLE_MODE = "mode/TOGGLE_MODE" as const;

type ModeState = boolean;

const initState: ModeState = true;

type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

export const toggleMode = (): AppThunk => {
  return async (dispatch, getState) => {
    try {
      const { mode: darkMode } = getState();
      const { data } = await axios.post("http://localhost:3006/api/mode", { darkMode });
      if (data !== darkMode) dispatch({ type: TOGGLE_MODE });
    } catch (e: any) {
      const errorMessage = e.response?.data?.error || "An error occurred while toggling the mode.";
      dispatch(displayError({ error: errorMessage }));
    }
  };
};

export const getMode = (): AppThunk => {
  return async (dispatch, getState) => {
    try {
      const { mode: prevDarkMode } = getState();
      const { data: darkMode } = await axios.get("http://localhost:3006/api/mode");
      if (prevDarkMode !== darkMode) dispatch({ type: TOGGLE_MODE });
    } catch (e: any) {
      const errorMessage = e.response?.data?.error || "An error occurred while fetching the mode.";
      dispatch(displayError({ error: errorMessage }));
    }
  };
};

const reducer = (state: ModeState = initState, action: AnyAction): ModeState => {
  switch (action.type) {
    case TOGGLE_MODE:
      return !state;
    default:
      return state;
  }
};

export default reducer;
