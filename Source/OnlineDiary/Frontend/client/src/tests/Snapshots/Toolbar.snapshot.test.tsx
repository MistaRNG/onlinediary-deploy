import React from 'react';
import { render } from '@testing-library/react';
import Toolbar from '../../features/journal/components/Editor/Toolbar';
import '@testing-library/jest-dom';
import { jest, describe, it, expect } from '@jest/globals';

describe('Toolbar Component Snapshot Tests', () => {
  it('should render the Toolbar component correctly', () => {
    // ARRANGE
    const mockMouseDownHandler = (style: string, isList?: boolean) => jest.fn();
    const mockStyles = ['bold', 'italic', 'underline'];
    const mockLists = [
      { style: 'unordered-list-item', icon: 'list' },
      { style: 'ordered-list-item', icon: 'numbered-list' },
    ];
    const mockSaved = true;
    const mockWordCount = 42;

    // ACT
    const { asFragment } = render(
      <Toolbar
        saved={mockSaved}
        mouseDownHandler={mockMouseDownHandler}
        styles={mockStyles}
        lists={mockLists}
        wordCount={mockWordCount}
      />
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
