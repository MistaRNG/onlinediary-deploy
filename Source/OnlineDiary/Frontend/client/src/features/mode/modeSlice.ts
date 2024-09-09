import axios from "axios";
import { displayError } from "features/error/errorSlice";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../../app/store";

export const TOGGLE_MODE = "mode/TOGGLE_MODE" as const;

type ModeState = boolean;

const initState: ModeState = true;

type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

/**
 * Toggles the application's dark mode state by making a request to the backend and updating the Redux state accordingly.
 * 
 * @returns {AppThunk} A thunk action that toggles the dark mode state.
 */
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

/**
 * Fetches the current mode state (dark or light) from the backend and updates the Redux state if necessary.
 * 
 * @returns {AppThunk} A thunk action that fetches the current mode state.
 */
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

/**
 * A reducer that manages the state of the application's mode (dark or light).
 * 
 * @param {ModeState} state - The current state of the mode.
 * @param {AnyAction} action - The dispatched action.
 * @returns {ModeState} The updated state based on the action type.
 */
const reducer = (state: ModeState = initState, action: AnyAction): ModeState => {
  switch (action.type) {
    case TOGGLE_MODE:
      return !state;
    default:
      return state;
  }
};

export default reducer;
