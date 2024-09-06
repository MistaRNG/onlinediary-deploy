import React from 'react';
import { render } from '@testing-library/react';
import LogIn from '../../features/auth/LogIn';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect } from '@jest/globals';

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
  },
});

describe('LogIn Component Snapshot Tests', () => {
  it('should render the LogIn component correctly', () => {
    // ARRANGE & ACT
    const { asFragment } = render(
      <Provider store={mockStore}>
        <Router>
          <LogIn />
        </Router>
      </Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
