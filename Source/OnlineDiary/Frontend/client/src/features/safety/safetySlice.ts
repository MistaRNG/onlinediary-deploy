import { getAlarm } from "common/helpers";

interface SafetyState {
  alarm: string | null;
  locked: boolean;
}

const initState: SafetyState = { alarm: null, locked: true };

export const CHECK_LOCK_INTERVAL = 1000;

const LOCK = "safety/LOCK" as const;
const UNLOCK = "safety/UNLOCK" as const;
const UPDATE_ALARM = "safety/UPDATE_ALARM" as const;

interface LockAction {
  type: typeof LOCK;
}

interface UnlockAction {
  type: typeof UNLOCK;
  payload: { alarm: string };
}

interface UpdateAlarmAction {
  type: typeof UPDATE_ALARM;
  payload: { alarm: string };
}

type SafetyActions = LockAction | UnlockAction | UpdateAlarmAction;

export const lock: LockAction = { type: LOCK };
export const unlock = (): UnlockAction => {
  return { type: UNLOCK, payload: { alarm: getAlarm() } };
};
export const updateAlarm = (): UpdateAlarmAction => {
  return {
    type: UPDATE_ALARM,
    payload: { alarm: getAlarm() },
  };
};

/**
 * Reducer that manages the safety state, including locked status and alarm time.
 * 
 * @param {SafetyState} state - The current safety state.
 * @param {SafetyActions} action - The dispatched action.
 * @returns {SafetyState} The updated safety state.
 */
const reducer = (state: SafetyState = initState, action: SafetyActions): SafetyState => {
  switch (action.type) {
    case LOCK:
      return { ...state, locked: true };
    case UNLOCK:
      return { ...state, locked: false, alarm: action.payload.alarm };
    case UPDATE_ALARM:
      if (state.locked) return state;
      return { ...state, alarm: action.payload.alarm };
    default:
      return state;
  }
};

export default reducer;
