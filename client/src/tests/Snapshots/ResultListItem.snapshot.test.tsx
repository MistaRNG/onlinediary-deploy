import React from 'react';
import { render } from '@testing-library/react';
import ResultListItem from '../../features/journal/components/Search/Result/ResultListItem';
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

describe('ResultListItem Component Snapshot Tests', () => {
  it('should render the ResultListItem component correctly', () => {
    // ARRANGE
    const mockDate = '2024-09-06';
    const mockTitle = 'First Journal Entry';

    // ACT
    const { asFragment } = render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <ResultListItem date={mockDate} title={mockTitle} />
        </BrowserRouter>
      </Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the ResultListItem component with no title', () => {
    // ARRANGE
    const mockDate = '2024-09-06';

    // ACT
    const { asFragment } = render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <ResultListItem date={mockDate} />
        </BrowserRouter>
      </Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
