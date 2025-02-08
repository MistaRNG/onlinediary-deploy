import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Safety from '../../features/safety/Safety';
import '@testing-library/jest-dom';
import { describe, it, jest, beforeEach, expect } from '@jest/globals';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import safetyReducer from '../../features/safety/safetySlice';
import { logIn } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

jest.mock('../../common/hooks/useCurrentUser', () => ({
  __esModule: true,
  default: jest.fn(() => ({ username: 'testuser' })),
}));

jest.mock('../../common/hooks/useShowPassword', () => ({
  __esModule: true,
  default: jest.fn(() => ({ showPassword: false, toggleShowPassword: jest.fn() })),
}));

jest.mock('../../features/auth/authSlice', () => ({
  logIn: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

const mockStore = configureStore({
  reducer: {
    safety: safetyReducer,
  },
});

describe('Safety Component Unit Tests', () => {
  let dispatch: jest.Mock;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.spyOn(mockStore, 'dispatch').mockImplementation(dispatch);
  });

  it('should submit the form and dispatch logIn action', () => {
    // ARRANGE
    render(
      <Provider store={mockStore}>
        <Safety />
      </Provider>
    );

    // ACT
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    if (passwordInput) {
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    }
    fireEvent.click(screen.getByRole('button', { name: /unlock/i }));

    // ASSERT
    expect(logIn).toHaveBeenCalledWith('testuser', 'password123', expect.any(Function), expect.any(Function));
  });

  it('should call handleGitLabLogin and navigate to /journal on successful login', async () => {
    // ARRANGE
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('gitlab');
    jest.spyOn(window, 'open').mockImplementation(() => ({} as Window));

    render(
      <Provider store={mockStore}>
        <Safety />
      </Provider>
    );

    // ACT
    fireEvent.click(screen.getByRole('button', { name: /re-login with gitlab/i }));

    window.postMessage({ token: 'dummyToken' }, 'http://localhost:3001');

    // ASSERT
    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'safety/UNLOCK' }));
      expect(mockNavigate).toHaveBeenCalledWith('/journal');
    });
  });
});
