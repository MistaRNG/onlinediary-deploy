import React from 'react';
import { render } from '@testing-library/react';
import LockButton from '../../features/auth/LockButton';
import '@testing-library/jest-dom';
import { jest, describe, it, expect } from '@jest/globals';

describe('LockButton Snapshot Tests', () => {
  it('should render locked state correctly', () => {
    // ARRANGE & ACT
    const { asFragment } = render(
      <LockButton showPassword={false} toggleShowPassword={jest.fn()} />
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render unlocked state correctly', () => {
    // ARRANGE & ACT
    const { asFragment } = render(
      <LockButton showPassword={true} toggleShowPassword={jest.fn()} />
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
