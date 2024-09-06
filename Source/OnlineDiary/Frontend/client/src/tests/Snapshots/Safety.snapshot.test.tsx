import React from 'react';
import { render } from '@testing-library/react';
import Safety from '../../features/safety/Safety';
import '@testing-library/jest-dom';
import { describe, it, jest, beforeEach, expect } from '@jest/globals';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import safetyReducer from '../../features/safety/safetySlice';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../common/hooks/useCurrentUser', () => ({
  __esModule: true,
  default: jest.fn(() => ({ username: 'testuser' })),
}));

jest.mock('../../common/hooks/useShowPassword', () => ({
  __esModule: true,
  default: jest.fn(() => ({ showPassword: false, toggleShowPassword: jest.fn() })),
}));

const mockStore = configureStore({
  reducer: {
    safety: safetyReducer,
  },
});

describe('Safety Component Snapshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches the snapshot when login method is not GitLab', () => {
    // ARRANGE
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(null);

    // ACT
    const { asFragment } = render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Safety />
        </MemoryRouter>
      </Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches the snapshot when login method is GitLab', () => {
    // ARRANGE
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('gitlab');

    // ACT
    const { asFragment } = render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Safety />
        </MemoryRouter>
      </Provider>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
