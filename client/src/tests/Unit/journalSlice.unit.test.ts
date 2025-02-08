import reducer from '../../features/journal/journalSlice';
import { JournalData } from '../../common/helpers';
import { describe, it, expect, jest } from '@jest/globals';

jest.mock('../../common/helpers', () => ({
  getText: jest.fn(() => 'Mocked Text'),
  removeContent: jest.fn((data: Record<string, JournalData>, date: string) => {
    const newData: Record<string, JournalData> = Object.assign({}, data);
    delete newData[date];
    return newData;
  }),
}));

describe('journalSlice Reducer', () => {
  const initialState = {
    data: {},
    gotData: false,
    saved: null,
    editCount: 0,
    prevDates: [],
  };

  it('should handle SAVE_JOURNAL action', () => {
    // ARRANGE
    const action = {
      type: 'journal/SAVE_JOURNAL',
      payload: {
        date: '2024-09-06',
        content: { blocks: [], entityMap: {} },
        title: 'Test Journal',
        isPublic: true,
      },
    };

    const expectedState = {
      data: {
        '2024-09-06': {
          content: { blocks: [], entityMap: {} },
          title: 'Test Journal',
          text: 'Mocked Text',
          isPublic: true,
        },
      },
      gotData: false,
      saved: false,
      editCount: 1,
      prevDates: [],
    };

    // ACT
    const newState = reducer({ ...initialState }, action);

    // ASSERT
    expect(newState).toEqual(expectedState);
  });

  it('should handle DELETE_JOURNAL action', () => {
    // ARRANGE
    const state = {
      data: {
        '2024-09-06': {
          id: 1,
          content: { blocks: [], entityMap: {} },
          title: 'Test Journal',
          text: 'Mocked Text',
          isPublic: true,
        },
      },
      gotData: false,
      saved: null,
      editCount: 1,
      prevDates: [],
    };

    const action = {
      type: 'journal/DELETE_JOURNAL',
      payload: {
        date: '2024-09-06',
      },
    };

    const expectedState = {
      data: {},
      gotData: false,
      saved: null,
      editCount: 2,
      prevDates: [],
    };

    // ACT
    const newState = reducer(Object.assign({}, state), action);

    // ASSERT
    expect(newState).toEqual(expectedState);
  });

  it('should handle UPDATE_SAVED action', () => {
    // ARRANGE
    const action = { type: 'journal/UPDATE_SAVED' };
    const state = { ...initialState, saved: false };
    const expectedState = { ...state, saved: true };

    // ACT
    const newState = reducer(Object.assign({}, state), action);

    // ASSERT
    expect(newState).toEqual(expectedState);
  });
});
