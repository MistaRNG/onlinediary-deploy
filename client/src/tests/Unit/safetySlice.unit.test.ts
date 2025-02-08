import reducer, { lock, unlock, updateAlarm } from '../../features/safety/safetySlice';
import { getAlarm } from '../../common/helpers';
import { describe, it, jest, expect, beforeEach } from '@jest/globals';

jest.mock('../../common/helpers', () => ({
  getAlarm: jest.fn(() => '2024-09-06T12:00:00.000Z'),
}));

describe('Safety Slice Unit Tests', () => {
  let initialState;

  beforeEach(() => {
    initialState = { alarm: null, locked: true };
  });

  it('should return the initial state when an empty action is dispatched', () => {
    // ACT
    const result = reducer(undefined, {} as any);

    // ASSERT
    expect(result).toEqual(initialState);
  });

  it('should handle LOCK action', () => {
    // ACT
    const result = reducer(initialState, lock);

    // ASSERT
    expect(result).toEqual({ ...initialState, locked: true });
  });

  it('should handle UNLOCK action and set alarm', () => {
    // ACT
    const result = reducer(initialState, unlock());

    // ASSERT
    expect(result).toEqual({ ...initialState, locked: false, alarm: '2024-09-06T12:00:00.000Z' });
    expect(getAlarm).toHaveBeenCalled();
  });

  it('should handle UPDATE_ALARM action when unlocked', () => {
    // ARRANGE
    const state = { ...initialState, locked: false, alarm: '2024-09-05T12:00:00.000Z' };

    // ACT
    const result = reducer(state, updateAlarm());

    // ASSERT
    expect(result).toEqual({ ...state, alarm: '2024-09-06T12:00:00.000Z' });
    expect(getAlarm).toHaveBeenCalled();
  });

  it('should not update alarm when locked', () => {
    // ACT
    const result = reducer(initialState, updateAlarm());

    // ASSERT
    expect(result).toEqual(initialState);
    expect(getAlarm).toHaveBeenCalled();
  });
});
