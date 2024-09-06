import React from 'react';
import { render } from '@testing-library/react';
import Register from '../../features/auth/Register';
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

describe('Register Component Snapshot Tests', () => {
  it('should render the Register component correctly', () => {
    // ARRANGE & ACT
    const { asFragment } = render(
      <Provider store={mockStore}>
        <Router>
          <Register />
        </Router>
      </Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
