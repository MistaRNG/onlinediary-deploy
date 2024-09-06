import React from 'react';
import { render } from '@testing-library/react';
import LongDateDisplay from '../../features/journal/components/Editor/Date';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';

describe('LongDateDisplay Component Snapshot Tests', () => {
  it('should render the LongDateDisplay component correctly', () => {
    // ARRANGE & ACT
    const { asFragment } = render(<LongDateDisplay date={new Date('2024-09-06')} />);

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
