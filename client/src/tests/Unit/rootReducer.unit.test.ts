import rootReducer, { RootState } from '../../app/rootReducer';
import modeReducer from '../../features/mode/modeSlice';
import usernameReducer from '../../features/auth/authSlice';
import errorReducer from '../../features/error/errorSlice';
import journalsReducer from '../../features/journal/journalSlice';
import safetyReducer from '../../features/safety/safetySlice';
import { describe, it, expect } from '@jest/globals';

const INIT_ACTION = { type: '@@INIT' } as any;

describe('rootReducer', () => {
  it('should combine all reducers into one root reducer', () => {
    // ARRANGE
    const initialState: RootState = {
      mode: modeReducer(undefined, INIT_ACTION),
      username: usernameReducer(undefined, INIT_ACTION),
      error: errorReducer(undefined, INIT_ACTION),
      journals: journalsReducer(undefined, INIT_ACTION),
      safety: safetyReducer(undefined, INIT_ACTION),
    };

    // ACT
    const state = rootReducer(undefined, INIT_ACTION);

    // ASSERT
    expect(state).toEqual(initialState);
  });

  it('should handle actions for each slice correctly', () => {
    // ARRANGE
    const testAction = { type: 'mode/toggleDarkMode' };

    // ACT
    const state = rootReducer(undefined, testAction);

    // ASSERT
    expect(state.mode).toEqual(modeReducer(undefined, testAction));
  });
});
