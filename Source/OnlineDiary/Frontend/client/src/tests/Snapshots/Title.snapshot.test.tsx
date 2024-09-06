import React from 'react';
import { render } from '@testing-library/react';
import Title from '../../features/journal/components/Editor/Title';
import '@testing-library/jest-dom';
import { describe, it, expect, jest } from '@jest/globals';

describe('Title Component Snapshot Tests', () => {
  it('should render the Title component correctly', () => {
    // ARRANGE
    const mockTitleRef = React.createRef<HTMLTextAreaElement>();
    const mockKeyUpHandler = jest.fn();
    const mockKeyDownHandler = jest.fn();

    // ACT
    const { asFragment } = render(
      <Title
        titleRef={mockTitleRef}
        keyUpHandler={mockKeyUpHandler}
        keyDownHandler={mockKeyDownHandler}
      />
    );

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
