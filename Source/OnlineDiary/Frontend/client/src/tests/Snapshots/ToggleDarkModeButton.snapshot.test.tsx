import React from 'react';
import { render } from '@testing-library/react';
import ToggleDarkModeButton from '../../features/mode/ToggleDarkModeButton';
import { describe, it, jest, expect } from '@jest/globals';

describe('ToggleDarkModeButton', () => {
  it('matches the snapshot when darkMode is true', () => {
    // ARRANGE & ACT
    const { asFragment } = render(
      <ToggleDarkModeButton darkMode={true} toggleDarkMode={jest.fn()} />
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches the snapshot when darkMode is false', () => {
    // ARRANGE & ACT
    const { asFragment } = render(
      <ToggleDarkModeButton darkMode={false} toggleDarkMode={jest.fn()} />
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
