import React from 'react';
import { render } from '@testing-library/react';
import Redirect from '../../features/redirect/Redirect';
import { useNavigate } from 'react-router-dom';
import useCurrentUser from '../../common/hooks/useCurrentUser';
import '@testing-library/jest-dom';
import { describe, it, jest, beforeEach, expect } from '@jest/globals';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../common/helpers', () => ({
  getTodayDate: jest.fn(() => '2024-09-06'),
}));

jest.mock('../../common/hooks/useCurrentUser', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../features/loading/Loading', () => () => <div>Loading...</div>);

describe('Redirect Component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('should navigate to the journal page when the user is logged in', () => {
    // ARRANGE
    (useCurrentUser as jest.Mock).mockReturnValue({ username: 'testuser' });

    // ACT
    render(<Redirect />);

    // ASSERT
    expect(mockNavigate).toHaveBeenCalledWith('/journal/2024-09-06');
  });

  it('should navigate to the login page when the user is not logged in', () => {
    // ARRANGE
    (useCurrentUser as jest.Mock).mockReturnValue({ username: null });

    // ACT
    render(<Redirect />);

    // ASSERT
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('matches the snapshot', () => {
    // ARRANGE
    (useCurrentUser as jest.Mock).mockReturnValue({ username: null });

    // ACT
    const { asFragment } = render(<Redirect />);

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
