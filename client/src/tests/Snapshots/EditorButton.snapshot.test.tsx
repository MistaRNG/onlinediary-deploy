import React from 'react';
import { render } from '@testing-library/react';
import EditorButtons from '../../features/journal/components/Editor/EditorButtons';
import '@testing-library/jest-dom';
import { jest, describe, it, expect } from '@jest/globals';

describe('EditorButtons Component Snapshot Tests', () => {
  it('should render the EditorButtons component correctly', () => {
    // ARRANGE
    const mockMouseDownHandler = (style: string, isList?: boolean) => jest.fn((event: React.MouseEvent<HTMLButtonElement>) => {});

    const mockStyles = ['bold', 'italic', 'underline'];
    const mockLists = [
      { style: 'unordered-list-item', icon: 'list' },
      { style: 'ordered-list-item', icon: 'numbered-list' },
    ];

    // ACT
    const { asFragment } = render(
      <EditorButtons
        mouseDownHandler={mockMouseDownHandler}
        styles={mockStyles}
        lists={mockLists}
      />
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
