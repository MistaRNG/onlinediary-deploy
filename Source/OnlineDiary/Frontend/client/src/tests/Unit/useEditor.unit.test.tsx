import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useCurrentUser from '../../common/hooks/useCurrentUser';
import authReducer, { getCurrentUser } from '../../features/auth/authSlice';
import { act } from 'react-dom/test-utils';
import { describe, it, expect } from '@jest/globals';

const mockStore = configureStore({
  reducer: {
    username: authReducer,
  },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={mockStore}>{children}</Provider>
);

const TestComponent = () => {
  const { hasCheckedUsername, username } = useCurrentUser();
  return (
    <div>
      <span data-testid="hasCheckedUsername">{`${hasCheckedUsername}`}</span>
      <span data-testid="username">{username ?? 'null'}</span>
    </div>
  );
};

describe('useCurrentUser', () => {
  it('should return initial state when username is not set', () => {
    // ARRANGE
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // ASSERT
    expect(screen.getByTestId('hasCheckedUsername').textContent).toBe('false');
    expect(screen.getByTestId('username').textContent).toBe('null');
  });

  it('should dispatch getCurrentUser when username has not been checked', () => {
    // ARRANGE
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // ACT
    act(() => {
      mockStore.dispatch(getCurrentUser());
    });

    // ASSERT
    expect(mockStore.getState().username).toEqual(expect.any(Object));
  });
});
