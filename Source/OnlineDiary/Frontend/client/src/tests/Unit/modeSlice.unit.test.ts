import { toggleMode, getMode, TOGGLE_MODE } from '../../features/mode/modeSlice';
import axios, { AxiosResponse } from 'axios';
import { displayError } from '../../features/error/errorSlice';
import { describe, it, jest, beforeEach, expect } from '@jest/globals';
import { RootState } from '../../app/store';

jest.mock('axios');
jest.mock('../../features/error/errorSlice', () => ({
  displayError: jest.fn((error) => ({ type: 'DISPLAY_ERROR', payload: error })),
}));

describe('Mode Slice', () => {
  let dispatch: jest.Mock;
  let getState: jest.Mock<() => RootState>;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn(() => ({
      mode: true,
      username: '',
      error: { error: '', trackErrorChange: false },
      journals: { entries: [] },
      safety: { status: 'safe' },
    } as unknown as RootState));
    jest.clearAllMocks();
  });

  describe('toggleMode', () => {
    it('should toggle the mode when the server response is different', async () => {
      // ARRANGE
      (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValueOnce({ data: false } as AxiosResponse);

      // ACT
      await toggleMode()(dispatch, getState, null);

      // ASSERT
      expect(dispatch).toHaveBeenCalledWith({ type: TOGGLE_MODE });
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3006/api/mode', { darkMode: true });
    });

    it('should display an error when the request fails', async () => {
      // ARRANGE
      const error = { response: { data: { error: 'Error toggling mode' } } };
      (axios.post as jest.MockedFunction<typeof axios.post>).mockRejectedValueOnce(error);

      // ACT
      await toggleMode()(dispatch, getState, null);

      // ASSERT
      expect(dispatch).toHaveBeenCalledWith(displayError({ error: 'Error toggling mode' }));
    });
  });

  describe('getMode', () => {
    it('should toggle the mode when the server response is different', async () => {
      // ARRANGE
      (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({ data: false } as AxiosResponse);

      // ACT
      await getMode()(dispatch, getState, null);

      // ASSERT
      expect(dispatch).toHaveBeenCalledWith({ type: TOGGLE_MODE });
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3006/api/mode');
    });

    it('should display an error when the request fails', async () => {
      // ARRANGE
      const error = { response: { data: { error: 'Error fetching mode' } } };
      (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValueOnce(error);

      // ACT
      await getMode()(dispatch, getState, null);

      // ASSERT
      expect(dispatch).toHaveBeenCalledWith(displayError({ error: 'Error fetching mode' }));
    });
  });
});
