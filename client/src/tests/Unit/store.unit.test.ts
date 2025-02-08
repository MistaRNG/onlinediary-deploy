import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect } from '@jest/globals';

const dummyReducer = (state = {}, action: any) => state;
const store = configureStore({ reducer: dummyReducer });

describe('Redux Store', () => {
  it('should initialize correctly', () => {
    // ACT
    const state = store.getState();

    // ASSERT
    expect(state).toEqual({});
  });
});
