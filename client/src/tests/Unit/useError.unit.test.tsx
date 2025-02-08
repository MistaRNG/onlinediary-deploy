import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useError from '../../common/hooks/useError';
import errorReducer from '../../features/error/errorSlice';
import { act } from 'react-dom/test-utils';
import { describe, it, expect } from '@jest/globals';

const mockStore = configureStore({
  reducer: {
    error: errorReducer,
  },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={mockStore}>{children}</Provider>
);

const TestComponent = () => {
  const { displayedError, dismissHandler } = useError();
  return (
    <div>
      <span data-testid="displayedError">{displayedError ?? 'null'}</span>
      <button onClick={dismissHandler}>Dismiss</button>
    </div>
  );
};

describe('useError Hook', () => {
  it('should return initial state with no error', () => {
    // ARRANGE
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // ASSERT
    expect(screen.getByTestId('displayedError').textContent).toBe('null');
  });

  it('should clear displayedError on dismiss', () => {
    // ARRANGE
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // ACT
    act(() => {
      mockStore.dispatch({ type: 'error/setError', payload: { error: 'Test Error' } });
      fireEvent.click(screen.getByText('Dismiss'));
    });

    // ASSERT
    expect(mockStore.getState().error.error).toBeNull();
  });
});
