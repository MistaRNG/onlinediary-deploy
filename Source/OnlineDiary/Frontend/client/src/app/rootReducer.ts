import { combineReducers } from "@reduxjs/toolkit";
import mode from "features/mode/modeSlice";
import username from "features/auth/authSlice";
import error from "features/error/errorSlice";
import journals from "features/journal/journalSlice";
import safety from "features/safety/safetySlice";

/**
 * Combines all individual reducers into a single root reducer.
 * This root reducer manages the global state of the application by
 * delegating actions to the corresponding feature reducers.
 */
const rootReducer = combineReducers({
  mode,
  username,
  error,
  journals,
  safety,
});

/**
 * Represents the shape of the entire Redux state managed by the root reducer.
 */
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
