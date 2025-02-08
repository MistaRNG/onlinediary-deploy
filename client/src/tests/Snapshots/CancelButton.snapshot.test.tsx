import React from 'react';
import { render } from '@testing-library/react';
import CancelButton from '../../features/journal/components/Search/Input/CancelButton';
import '@testing-library/jest-dom';
import { jest, describe, it, expect } from '@jest/globals';

describe('CancelButton Component Snapshot Tests', () => {
  it('should render the CancelButton component correctly when search is true', () => {
    // ARRANGE
    const mockCancel = jest.fn();
    
    // ACT
    const { asFragment } = render(<CancelButton search={true} cancel={mockCancel} />);
    
    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });

  it('should not render the CancelButton component when search is false', () => {
    // ARRANGE
    const mockCancel = jest.fn();
    
    // ACT
    const { asFragment } = render(<CancelButton search={false} cancel={mockCancel} />);
    
    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
