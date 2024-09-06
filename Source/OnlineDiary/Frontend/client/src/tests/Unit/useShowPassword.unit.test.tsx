import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import useShowPassword from '../../common/hooks/useShowPassword';
import { describe, it, expect } from '@jest/globals';

const TestComponent = () => {
  const { showPassword, toggleShowPassword } = useShowPassword();
  return (
    <div>
      <span data-testid="password-visibility">
        {showPassword ? 'visible' : 'hidden'}
      </span>
      <button onClick={toggleShowPassword} data-testid="toggle-button">
        Toggle Password Visibility
      </button>
    </div>
  );
};

describe('useShowPassword Hook', () => {
  it('should initialize with password hidden', () => {
    // ARRANGE
    render(<TestComponent />);

    // ASSERT
    expect(screen.getByTestId('password-visibility').textContent).toBe('hidden');
  });

  it('should toggle password visibility when button is clicked', () => {
    // ARRANGE
    render(<TestComponent />);

    // ACT
    fireEvent.click(screen.getByTestId('toggle-button'));

    // ASSERT
    expect(screen.getByTestId('password-visibility').textContent).toBe('visible');

    // ACT
    fireEvent.click(screen.getByTestId('toggle-button'));

    // ASSERT
    expect(screen.getByTestId('password-visibility').textContent).toBe('hidden');
  });
});
