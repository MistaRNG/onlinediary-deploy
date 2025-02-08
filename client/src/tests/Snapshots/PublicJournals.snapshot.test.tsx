import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import PublicJournals from '../../features/journal/PublicJournals';
import journalReducer from '../../features/journal/journalSlice';
import { describe, it, expect } from '@jest/globals';

const mockStore = configureStore({
  reducer: {
    journals: journalReducer,
  },
  preloadedState: {
    journals: {
      data: {
        '2024-09-06': {
          id: 1,
          content: { blocks: [], entityMap: {} },
          title: 'Test Journal',
          text: 'Test Content',
          isPublic: true,
        },
      },
      gotData: true,
      saved: null,
      editCount: 0,
      prevDates: [],
    },
  },
});

describe('PublicJournals Component Snapshot Test', () => {
  it('renders correctly', () => {
    // ACT
    const { asFragment } = render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <PublicJournals />
        </BrowserRouter>
      </Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
