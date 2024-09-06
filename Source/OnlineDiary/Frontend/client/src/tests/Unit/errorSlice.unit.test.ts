import reducer, { displayError, removeError } from '../../features/error/errorSlice';
import { describe, it, expect } from '@jest/globals';

describe('errorSlice Reducer and Actions', () => {
  it('should return the initial state', () => {
    // ARRANGE
    const initialState = { error: null, trackErrorChange: true };

    // ACT
    const result = reducer(initialState, { type: 'UNKNOWN_ACTION' } as any);

    // ASSERT
    expect(result).toEqual(initialState);
  });

  it('should handle DISPLAY_ERROR action', () => {
    // ARRANGE
    const initialState = { error: null, trackErrorChange: true };
    const action = displayError('Test Error');

    // ACT
    const result = reducer(initialState, action);

    // ASSERT
    expect(result).toEqual({ error: 'Test Error', trackErrorChange: false });
  });

  it('should handle REMOVE_ERROR action', () => {
    // ARRANGE
    const initialState = { error: 'Test Error', trackErrorChange: false };

    // ACT
    const result = reducer(initialState, removeError);

    // ASSERT
    expect(result).toEqual({ error: null, trackErrorChange: false });
  });
});
