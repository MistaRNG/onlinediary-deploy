import axios from "axios";
import { displayError } from "features/error/errorSlice";

const RECEIVE_USER = "user/RECEIVE_USER";
const initState: any = null;

/**
 * Asynchronously fetches the current user from the backend and dispatches the user data.
 *
 * @returns {Function} - A Redux thunk that fetches the current user and dispatches the result.
 */
export const getCurrentUser = () => {
  return async (dispatch: any) => {
    try {
      const response = await axios.get("http://localhost:3004/api/users", {
        withCredentials: true,
      });

      const { username } = response.data;

      if (typeof username === 'string') {
        dispatch({ type: RECEIVE_USER, payload: { username } });
      } else {
        console.warn('Received username is not a string:', username);
        dispatch({ type: RECEIVE_USER, payload: { username: null } });
      }
    } catch (e: any) {
      console.error('Error fetching current user:', e.response?.data || e.message);
      dispatch({ type: RECEIVE_USER, payload: { username: null } });
    }
  };
};

/**
 * Logs in a user by sending a request to the backend, then dispatches the user data and executes callbacks.
 *
 * @param {string} id - The username or identifier of the user.
 * @param {string} password - The user's password.
 * @param {Function} fn - A callback function to execute after the attempt to log in.
 * @param {Function} successFn - A callback function to execute if the login is successful.
 * @returns {Function} - A Redux thunk that handles user login and error dispatching.
 */
export const logIn = (id, password, fn, successFn) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post("http://localhost:3004/api/users/login", {
        username: id,
        password,
      });

      const { username } = data;
      dispatch({ type: RECEIVE_USER, payload: { username } });

      if (successFn) successFn();
    } catch (e) {
      const errorMessage = e.response?.data?.message || "Error logging in";
      dispatch(displayError(errorMessage));
    }
    fn();
  };
};

/**
 * Logs out the current user by sending a request to the backend and updates the state.
 *
 * @returns {Function} - A Redux thunk that handles user logout and error dispatching.
 */
export const logout = () => {
  return async (dispatch) => {
    try {
      await axios.post("http://localhost:3004/api/users/logout");
      dispatch({ type: RECEIVE_USER, payload: { username: null } });
    } catch (e) {
      const errorMessage = e.response?.data?.message || "Error logging out";
      dispatch(displayError(errorMessage));
    }
  };
};

/**
 * Registers a new user by sending the user details to the backend, then dispatches the user data.
 *
 * @param {string} id - The username to register.
 * @param {string} password - The password for the new user.
 * @param {string} confirmPassword - Confirmation of the user's password.
 * @param {Function} fn - A callback function to execute after the registration attempt.
 * @returns {Function} - A Redux thunk that handles user registration and error dispatching.
 */
export const register = (id, password, confirmPassword, fn) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post("http://localhost:3004/api/users/register", {
        username: id,
        password,
        confirmPassword,
      });

      const { username, message } = data;
      dispatch({ type: RECEIVE_USER, payload: { username } });
      if (message) console.log(message);
    } catch (e) {
      console.error("Registrierungsfehler:", e.response?.data || e.message);
      const errorMessage = e.response?.data?.message || "Error registering";
      dispatch(displayError(errorMessage));
    }
    fn();
  };
};

/**
 * Reducer function that manages the user state based on dispatched actions.
 *
 * @param {any} state - The current state of the user (default is null).
 * @param {any} action - The action dispatched to the reducer.
 * @returns {any} - The updated state based on the action.
 */
const reducer = (state: any = initState, action: any): any => {
  switch (action.type) {
    case RECEIVE_USER:
      const { payload } = action;
      const username = payload?.username;

      if (!username || typeof username !== 'string') {
        console.warn('Username is missing or not a string:', username);
        return "";
      }
      return username;
    default:
      return state;
  }
};

export default reducer;
