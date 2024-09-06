import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useMode from '../../common/hooks/useMode';
import modeReducer from '../../features/mode/modeSlice';
import { describe, it, expect, jest } from '@jest/globals';

const mockStore = configureStore({
  reducer: {
    mode: modeReducer,
  },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={mockStore}>{children}</Provider>
);

const TestComponent = () => {
  const { darkMode, toggleDarkMode } = useMode();
  return (
    <div>
      <span data-testid="darkMode">{darkMode ? 'true' : 'false'}</span>
      <button onClick={toggleDarkMode}>Toggle Mode</button>
    </div>
  );
};

describe('useMode Hook', () => {
  it('should initialize with default mode state', () => {
    // ARRANGE
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // ASSERT
    expect(screen.getByTestId('darkMode').textContent).toBe('true');
  });

  it('should dispatch getMode on mount', () => {
    // ARRANGE
    const spy = jest.spyOn(mockStore, 'dispatch');
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // ASSERT
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('should toggle mode state when button is clicked', () => {
    // ARRANGE
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // ACT
    fireEvent.click(screen.getByText('Toggle Mode'));

    // ASSERT
    expect(screen.getByTestId('darkMode').textContent).toBe('true');
  });
});
