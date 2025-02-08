import React from 'react';
import { render } from '@testing-library/react';
import Journal from '../../features/journal/components';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockReducer = (state = { data: [], saved: false }, action: any) => state;

const mockStore = configureStore({
  reducer: {
    journals: mockReducer,
  },
});

describe('Journal Component Snapshot Tests', () => {
  it('should render the Journal component correctly', () => {
    // ACT
    const { asFragment } = render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/journal/2024-09-06']}>
          <Journal />
        </MemoryRouter>
      </Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
