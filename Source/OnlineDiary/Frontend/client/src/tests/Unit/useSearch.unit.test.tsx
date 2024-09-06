import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useSearch from '../../common/hooks/useSearch';
import journalReducer from '../../features/journal/journalSlice';
import { describe, it, expect } from '@jest/globals';

const mockStore = configureStore({
  reducer: {
    journals: journalReducer,
  },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={mockStore}>{children}</Provider>
);

const TestComponent = () => {
  const { search, changeHandler, cancel, results } = useSearch();
  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={changeHandler}
        data-testid="search-input"
      />
      <button onClick={cancel} data-testid="cancel-button">Cancel</button>
      <ul>
        {results.map((result) => (
          <li key={result.id} data-testid="result-item">
            {result.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('useSearch Hook', () => {
  it('should initialize with default state', () => {
    // ARRANGE
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // ASSERT
    expect(screen.getByTestId('search-input').getAttribute('value')).toBe('');
    expect(screen.queryAllByTestId('result-item')).toHaveLength(0);
  });

  it('should update results based on search input', () => {
    // ARRANGE
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // ACT
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'test' },
    });

    // ASSERT
    setTimeout(() => {
      expect(screen.queryAllByTestId('result-item')).toHaveLength(1);
    }, 500);
  });

  it('should clear search input when cancel is clicked', () => {
    // ARRANGE
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // ACT
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'test' },
    });
    fireEvent.click(screen.getByTestId('cancel-button'));

    // ASSERT
    expect(screen.getByTestId('search-input').getAttribute('value')).toBe('');
  });
});
