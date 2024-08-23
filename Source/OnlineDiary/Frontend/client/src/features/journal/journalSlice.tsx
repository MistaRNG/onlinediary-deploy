import axios from "axios";
import { displayError } from "../error/errorSlice";
import { formatJournals, removeContent, getText } from "common/helpers";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../../app/store";

interface JournalData {
  content: any;
  title: string;
  text: string;
  isPublic: boolean;
}

interface JournalState {
  data: Record<string, JournalData>;
  gotData: boolean;
  saved: boolean | null;
  editCount: number;
  prevDates: string[];
}

const initState: JournalState = {
  data: {},
  gotData: false,
  saved: null,
  editCount: 0,
  prevDates: [],
};

const SAVE_JOURNAL = "journal/SAVE_JOURNAL" as const;
const GET_JOURNALS = "journal/GET_JOURNALS" as const;
const DELETE_JOURNAL = "journal/DELETE_JOURNAL" as const;
const UPDATE_SAVED = "journal/UPDATE_SAVED" as const;
const REMOVE_SAVED = "journal/REMOVE_SAVED" as const;
const GET_PUBLIC_JOURNALS = "journal/GET_PUBLIC_JOURNALS" as const;

export const showSavedTimeout = 3000;
const saveTimeout = 3000;

export const clearStatus = { type: REMOVE_SAVED } as const;

type AppThunk = ThunkAction<void, RootState, unknown, AnyAction>;

export const getPublicJournals = (): AppThunk => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/journals/public");
      dispatch({ type: GET_PUBLIC_JOURNALS, payload: { data } });
    } catch (e: any) {
      dispatch(displayError(e.response?.data || "Error fetching public journals"));
    }
  };
};

export const saveJournal = (
  content: any,
  date: string,
  title: string,
  isPublic: boolean
): AppThunk => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: SAVE_JOURNAL, payload: { date, content, title, isPublic } });
      const {
        journals: { editCount: oldCount },
      } = getState();
      setTimeout(async () => {
        const {
          journals: { editCount: newCount },
        } = getState();
        if (oldCount === newCount) {
          await axios.post("/api/journals", { content, date, title, is_public: isPublic });
          dispatch({ type: UPDATE_SAVED });
        }
      }, saveTimeout);
    } catch (e: any) {
      dispatch(displayError(e.response?.data || "Error saving journal"));
    }
  };
};

export const getJournals = (): AppThunk => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/journals");
      dispatch({ type: GET_JOURNALS, payload: { data } });
    } catch (e: any) {
      dispatch(displayError(e.response?.data || "Error fetching journals"));
    }
  };
};

export const deleteJournal = (date: string): AppThunk => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: DELETE_JOURNAL, payload: { date } });
      const {
        journals: { editCount: oldCount },
      } = getState();
      setTimeout(async () => {
        const {
          journals: { editCount: newCount },
        } = getState();
        if (oldCount === newCount) {
          await axios.delete("/api/journals", { data: { date } });
          dispatch({ type: UPDATE_SAVED });
        }
      }, saveTimeout);
    } catch (e: any) {
      dispatch(displayError(e.response?.data || "Error deleting journal"));
    }
  };
};

const reducer = (state = initState, action: AnyAction): JournalState => {
  const { data: prevData, editCount } = state;
  switch (action.type) {
    case SAVE_JOURNAL: {
      const {
        payload: { date, content, title, isPublic },
      } = action;
      const text = getText(content);
      const newData = { ...prevData, [date]: { content, title, text, isPublic } };
      return {
        ...state,
        data: newData,
        editCount: editCount + 1,
        saved: false,
      };
    }
    case GET_JOURNALS: {
      const {
        payload: { data: receivedData },
      } = action;
      const [formattedData, prevDates] = formatJournals(receivedData);
      return { ...state, prevDates, data: formattedData, gotData: true };
    }
    case DELETE_JOURNAL: {
      const {
        payload: { date: dateToBeClear },
      } = action;
      const data = removeContent(prevData, dateToBeClear);
      return { ...state, data, editCount: editCount + 1 };
    }
    case UPDATE_SAVED:
      return { ...state, saved: true };
    case REMOVE_SAVED:
      return { ...state, saved: null };
    case GET_PUBLIC_JOURNALS: {
      const {
        payload: { data: receivedData },
      } = action;
      const [formattedData, prevDates] = formatJournals(receivedData);
      return { ...state, prevDates, data: formattedData, gotData: true };
    }
    default:
      return state;
  }
};

export default reducer;
