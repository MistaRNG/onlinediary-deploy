import React from 'react';
import { render } from '@testing-library/react';
import Calendar from '../../features/journal/components/Calendar';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';

describe('Calendar Component Snapshot Tests', () => {
  it('should render the Calendar component correctly', () => {
    // ARRANGE & ACT
    const { asFragment } = render(
      <MemoryRouter>
        <Calendar
          value={new Date()}
          disabledDays={() => false}
          minDate={new Date()}
          dates={[new Date()]}
        />
      </MemoryRouter>
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
