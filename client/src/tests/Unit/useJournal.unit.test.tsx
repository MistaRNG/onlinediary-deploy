import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useJournal from '../../common/hooks/useJournal';
import journalReducer from '../../features/journal/journalSlice';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, jest } from '@jest/globals';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

const mockNavigate = useNavigate as jest.Mock;

const mockStore = configureStore({
  reducer: {
    journals: journalReducer,
  },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={mockStore}>{children}</Provider>
);

const TestComponent = ({ date }: { date: string }) => {
  const { validDate, minDate, dates, css } = useJournal(date);
  return (
    <div>
      <span data-testid="validDate">{`${validDate}`}</span>
      <span data-testid="minDate">{minDate.toString()}</span>
      <span data-testid="dates">{dates.join(', ')}</span>
      <span data-testid="css">{css}</span>
    </div>
  );
};

describe('useJournal Hook', () => {
  it('should initialize with default state', () => {
    // ARRANGE
    render(
      <Wrapper>
        <TestComponent date="2024-09-06" />
      </Wrapper>
    );

    // ASSERT
    expect(screen.getByTestId('validDate').textContent).toBe('true');
    expect(screen.getByTestId('minDate').textContent).not.toBe('');
    expect(screen.getByTestId('dates').textContent).toBe('');
    expect(screen.getByTestId('css').textContent).toBe('');
  });

  it('should dispatch getJournals on mount', () => {
    // ARRANGE
    const spy = jest.spyOn(mockStore, 'dispatch');
    render(
      <Wrapper>
        <TestComponent date="2024-09-06" />
      </Wrapper>
    );

    // ASSERT
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('should navigate to today\'s date if no valid date is provided', () => {
    // ARRANGE
    mockNavigate.mockImplementation(() => {});
    render(
      <Wrapper>
        <TestComponent date="" />
      </Wrapper>
    );

    // ASSERT
    expect(mockNavigate).toHaveBeenCalled();
  });
});
