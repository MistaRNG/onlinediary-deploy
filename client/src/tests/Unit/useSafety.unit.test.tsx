import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useSafety from '../../common/hooks/useSafety';
import safetyReducer from '../../features/safety/safetySlice';
import { describe, it, expect, jest } from '@jest/globals';

const mockStore = configureStore({
  reducer: {
    safety: safetyReducer,
    username: () => 'testuser',
  },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={mockStore}>{children}</Provider>
);

const TestComponent = () => {
  const locked = useSafety();
  return <span data-testid="locked">{locked ? 'true' : 'false'}</span>;
};

describe('useSafety Hook', () => {
  it('should initialize with default state', () => {
    // ARRANGE
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // ASSERT
    expect(screen.getByTestId('locked').textContent).toBe('true');
  });

  it('should unlock when username is empty', () => {
    // ARRANGE
    const customStore = configureStore({
      reducer: {
        safety: safetyReducer,
        username: () => '',
      },
    });
    render(
      <Provider store={customStore}>
        <TestComponent />
      </Provider>
    );

    // ASSERT
    expect(customStore.getState().safety.locked).toBe(false);
  });

  it('should lock when time is up', () => {
    // ARRANGE
    jest.useFakeTimers();
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // ACT
    jest.advanceTimersByTime(60000);

    // ASSERT
    expect(mockStore.getState().safety.locked).toBe(true);
    jest.useRealTimers();
  });
});
