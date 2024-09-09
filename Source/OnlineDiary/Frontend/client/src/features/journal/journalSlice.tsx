import axios from "axios";
import { displayError } from "../error/errorSlice";
import { formatJournals, removeContent, getText } from "common/helpers";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../../app/store";

interface JournalDataForDashboard {
  id: number;
  content: any;
  title: string;
  text: string;
  isPublic: boolean;
  date: string;
}

interface JournalData {
  id: number;
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

/**
 * Fetches public journals from the API and dispatches them to the state.
 * @returns {AppThunk} A thunk action that fetches public journals.
 */
export const getPublicJournals = (): AppThunk => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("http://localhost:3005/api/journals/public", { withCredentials: true });
      dispatch({ type: GET_PUBLIC_JOURNALS, payload: { data } });
    } catch (e: any) {
      dispatch(displayError(e.response?.data || "Error fetching public journals"));
    }
  };
};

/**
 * Saves a journal entry to the API and updates the state accordingly.
 * 
 * @param {any} content - The content of the journal.
 * @param {string} date - The date of the journal entry.
 * @param {string} title - The title of the journal.
 * @param {boolean} isPublic - Whether the journal is public.
 * @returns {AppThunk} A thunk action that saves a journal.
 */
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
          await axios.post("http://localhost:3005/api/journals", { content, date, title, is_public: isPublic }, { withCredentials: true });
          dispatch({ type: UPDATE_SAVED });
        }
      }, saveTimeout);
    } catch (e: any) {
      dispatch(displayError(e.response?.data || "Error saving journal"));
    }
  };
};

/**
 * Fetches all journals for the current user from the API and dispatches them to the state.
 * 
 * @returns {AppThunk} A thunk action that fetches user journals.
 */
export const getJournals = (): AppThunk => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("http://localhost:3005/api/journals", {
        withCredentials: true,
      });
      dispatch({ type: GET_JOURNALS, payload: { data } });
    } catch (e: any) {
      dispatch(displayError(e.response?.data || "Error fetching journals"));
    }
  };
};

/**
 * Deletes a journal entry based on the provided date and updates the state.
 * 
 * @param {string} date - The date of the journal to be deleted.
 * @returns {AppThunk} A thunk action that deletes a journal.
 */
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
          await axios.delete("http://localhost:3005/api/journals", { data: { date } });
          dispatch({ type: UPDATE_SAVED });
        }
      }, saveTimeout);
    } catch (e: any) {
      dispatch(displayError(e.response?.data || "Error deleting journal"));
    }
  };
};

/**
 * The reducer function that manages the state changes for journals based on the action types.
 * 
 * @param {JournalState} state - The current state of the journal.
 * @param {AnyAction} action - The dispatched action.
 * @returns {JournalState} The updated state based on the action type.
 */
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
      const formattedData = receivedData.reduce((acc, journal) => {
        const { id, content, title, is_public: isPublic, date } = journal;
        acc[id] = { id, content, title, text: getText(content), isPublic, date };
        return acc;
      }, {} as Record<string, JournalDataForDashboard>);
      return { ...state, data: formattedData, gotData: true };
    }
    default:
      return state;
  }
};

export default reducer;
