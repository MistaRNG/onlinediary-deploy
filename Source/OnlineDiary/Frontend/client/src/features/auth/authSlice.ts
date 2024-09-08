import axios from "axios";
import { displayError } from "features/error/errorSlice";

const RECEIVE_USER = "user/RECEIVE_USER";
const initState: any = null;

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
