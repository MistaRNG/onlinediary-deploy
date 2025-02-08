import React from 'react';
import { render } from '@testing-library/react';
import JournalEditor from '../../features/journal/components/Editor';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

const mockJournalReducer = (state = { data: {}, saved: false }, action: any) => state;

const mockStore = configureStore({
  reducer: {
    journals: mockJournalReducer,
  },
});

describe('JournalEditor Component Snapshot Tests', () => {
  it('should render the JournalEditor component correctly', () => {
    // ARRANGE & ACT
    const { asFragment, container } = render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <JournalEditor date="2024-09-06" />
        </BrowserRouter>
      </Provider>
    );

    container.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    container.querySelectorAll('[aria-describedby]').forEach((el) => el.removeAttribute('aria-describedby'));
    container.querySelectorAll('[data-editor]').forEach((el) => el.removeAttribute('data-editor'));
    container.querySelectorAll('[data-offset-key]').forEach((el) => el.removeAttribute('data-offset-key'));

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
