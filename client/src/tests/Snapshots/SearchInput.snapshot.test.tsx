import React from 'react';
import { render } from '@testing-library/react';
import SearchInput from '../../features/journal/components/Search/Input/';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import { jest } from '@jest/globals';

describe('SearchInput Component Snapshot Tests', () => {
  it('should render the SearchInput component correctly with search text', () => {
    // ARRANGE
    const mockChangeHandler = jest.fn();
    const mockCancel = jest.fn();
    const mockSearch = 'Sample search';

    // ACT
    const { asFragment } = render(
      <SearchInput
        search={mockSearch}
        changeHandler={mockChangeHandler}
        cancel={mockCancel}
      />
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the SearchInput component correctly without search text', () => {
    // ARRANGE
    const mockChangeHandler = jest.fn();
    const mockCancel = jest.fn();
    const mockSearch = '';

    // ACT
    const { asFragment } = render(
      <SearchInput
        search={mockSearch}
        changeHandler={mockChangeHandler}
        cancel={mockCancel}
      />
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
