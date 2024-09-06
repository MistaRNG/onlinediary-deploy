import React from 'react';
import { render } from '@testing-library/react';
import Error from '../../features/error/Error';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import errorReducer from '../../features/error/errorSlice';
import { describe, it, expect } from '@jest/globals';

const mockStore = configureStore({
  reducer: {
    error: errorReducer,
  },
});

describe('Error Component Snapshot Tests', () => {
  it('should render the Error component correctly', () => {
    // ARRANGE & ACT
    const { asFragment } = render(
      <Provider store={mockStore}>
        <Error />
      </Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
