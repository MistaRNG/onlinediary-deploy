import axios from "axios";
import { displayError } from "features/error/errorSlice";

const RECEIVE_USER = "user/RECEIVE_USER";
const initState: any = null;

export const getCurrentUser = () => {
  return async (dispatch: any) => {
    try {
      const { data: username }: any = await axios.get("/api/users");
      dispatch({ type: RECEIVE_USER, payload: { username } });
    } catch (e: any) {
      dispatch(displayError(e.response?.data || "Error fetching user"));
      dispatch({ type: RECEIVE_USER, payload: { username: null } });
    }
  };
};

export const logIn = (
  id: any,
  password: any,
  fn: any,
  successFn?: any
) => {
  return async (dispatch: any) => {
    try {
      const { data: username }: any = await axios.post("/api/users", {
        username: id,
        password,
      });
      dispatch({ type: RECEIVE_USER, payload: { username } });
      if (successFn) successFn();
    } catch (e: any) {
      dispatch(displayError(e.response?.data || "Error logging in"));
    }
    fn();
  };
};

export const logout = () => {
  return async (dispatch: any) => {
    try {
      const { data: username }: any = await axios.post("/api/users/logout");
      dispatch({ type: RECEIVE_USER, payload: { username } });
    } catch (e: any) {
      dispatch(displayError(e.response?.data || "Error logging out"));
    }
  };
};

export const register = (
  id: any,
  password: any,
  confirmPassword: any,
  fn: any
) => {
  return async (dispatch: any) => {
    try {
      const result: any = await axios.post("/api/users/register", {
        username: id,
        password,
        confirmPassword,
      });
      const { data: username }: any = result;
      dispatch({ type: RECEIVE_USER, payload: { username } });
    } catch (e: any) {
      dispatch(displayError(e.response?.data || "Error registering"));
    }
    fn();
  };
};

const reducer = (state: any = initState, action: any): any => {
  switch (action.type) {
    case RECEIVE_USER:
      const {
        payload: { username },
      } = action;
      if (!username) return "";
      return username;
    default:
      return state;
  }
};

export default reducer;
