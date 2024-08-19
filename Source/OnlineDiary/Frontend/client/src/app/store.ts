import { configureStore } from "@reduxjs/toolkit";
import reducer from "app/rootReducer";
import thunk, { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

const store = configureStore({ reducer, middleware: [thunk] });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

export default store;
