import { combineReducers } from "@reduxjs/toolkit";
import mode from "features/mode/modeSlice";
import username from "features/auth/authSlice";
import error from "features/error/errorSlice";
import journals from "features/journal/journalSlice";
import safety from "features/safety/safetySlice";

const rootReducer = combineReducers({
  mode,
  username,
  error,
  journals,
  safety,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
