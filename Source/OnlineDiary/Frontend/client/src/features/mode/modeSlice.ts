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
      const { data } = await axios.post("/api/mode", { darkMode });
      if (data !== darkMode) dispatch({ type: TOGGLE_MODE });
    } catch (e: any) {
      dispatch(displayError(e.response?.data));
    }
  };
};

export const getMode = (): AppThunk => {
  return async (dispatch, getState) => {
    try {
      const { mode: prevDarkMode } = getState();
      const { data: darkMode } = await axios.get("/api/mode");
      if (prevDarkMode !== darkMode) dispatch({ type: TOGGLE_MODE });
    } catch (e: any) {
      dispatch(displayError(e.response?.data));
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
