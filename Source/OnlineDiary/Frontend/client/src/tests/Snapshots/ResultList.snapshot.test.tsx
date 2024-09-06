import React from 'react';
import { render } from '@testing-library/react';
import Result from '../../features/journal/components/Search/Result/ResultList';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockReducer = (state = {}, action: any) => state;

const mockStore = configureStore({
  reducer: {
    mock: mockReducer,
  },
});

describe('Result Component Snapshot Tests', () => {
  it('should render the Result component correctly with results', () => {
    // ARRANGE
    const mockResults = [
      { id: '1', title: 'First Journal', date: '2024-09-06' },
      { id: '2', title: 'Second Journal', date: '2024-09-07' },
    ];

    // ACT
    const { asFragment } = render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Result results={mockResults} />
        </BrowserRouter>
      </Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the Result component correctly with no results', () => {
    // ARRANGE
    const mockResults: Array<{ id: string; title: string; date: string }> = [];

    // ACT
    const { asFragment } = render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Result results={mockResults} />
        </BrowserRouter>
      </Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
