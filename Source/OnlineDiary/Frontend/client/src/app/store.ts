import { configureStore } from "@reduxjs/toolkit";
import reducer from "app/rootReducer";
import thunk, { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

/**
 * Configures the Redux store with the root reducer and middleware.
 * The store manages the state of the entire application, allowing components
 * to access and update the state using actions and reducers.
 */
const store = configureStore({ reducer, middleware: [thunk] });

/**
 * Represents the shape of the state managed by the Redux store.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type definition for the Redux dispatch function, which allows dispatching
 * thunk actions that can perform asynchronous tasks.
 */
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

export default store;
