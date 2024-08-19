interface ErrorState {
  error: string | null;
  trackErrorChange: boolean;
}

interface DisplayErrorAction {
  type: typeof DISPLAY_ERROR;
  payload: { error: string };
}

interface RemoveErrorAction {
  type: typeof REMOVE_ERROR;
}

type ErrorActionTypes = DisplayErrorAction | RemoveErrorAction;

const initState: ErrorState = { error: null, trackErrorChange: true };

const DISPLAY_ERROR = "error/DISPLAY_ERROR" as const;
const REMOVE_ERROR = "error/REMOVE_ERROR" as const;

export const displayError = (error: string): DisplayErrorAction => {
  return {
    type: DISPLAY_ERROR,
    payload: { error },
  };
};

export const removeError: RemoveErrorAction = { type: REMOVE_ERROR };

const reducer = (state = initState, action: ErrorActionTypes): ErrorState => {
  switch (action.type) {
    case DISPLAY_ERROR:
      const {
        payload: { error },
      } = action;
      const { trackErrorChange } = state;
      return {
        ...state,
        error,
        trackErrorChange: !trackErrorChange,
      };
    case REMOVE_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

export default reducer;
