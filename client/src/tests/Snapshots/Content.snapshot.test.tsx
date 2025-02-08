import React from 'react';
import { render } from '@testing-library/react';
import Content from '../../features/journal/components/Main';
import '@testing-library/jest-dom';
import { describe, it, expect, jest } from '@jest/globals';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('../../features/journal/components/Editor', () => () => <div>Editor Mock</div>);

const mockReducer = () => ({
  journals: {
    data: {},
  },
});

const mockStore = configureStore({
  reducer: {
    journals: mockReducer,
  },
});

describe('Content Component Snapshot Tests', () => {
  it('should render the Content component correctly', () => {
    // ARRANGE
    const mockDisabledDays = () => false;
    const mockMinDate = null;
    const mockValue = null;
    const mockDate = '';
    const mockDates = [];

    // ACT
    const { asFragment } = render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Content
            disabledDays={mockDisabledDays}
            minDate={mockMinDate}
            value={mockValue}
            date={mockDate}
            dates={mockDates}
          />
        </BrowserRouter>
      </Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
