import React from 'react';
import { render } from '@testing-library/react';
import Loading from '../../features/loading/Loading';
import { describe, it, expect } from '@jest/globals';

describe('Loading Component', () => {
  it('should match snapshot', () => {
    // ACT
    const { asFragment } = render(<Loading />);

    // ASSERT
    expect(asFragment()).toMatchSnapshot();
  });
});
