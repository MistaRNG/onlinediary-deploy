import React from 'react';
import { render } from '@testing-library/react';
import Search from '../../features/journal/components/Search';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

const mockReducer = (state = { data: [], saved: false }, action: any) => state;

const mockStore = configureStore({
  reducer: {
    journals: mockReducer,
  },
});

describe('Search Component Snapshot Tests', () => {
  it('should render the Search component correctly', () => {
    // ACT
    const { asFragment } = render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Search />
        </BrowserRouter>
      </Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
