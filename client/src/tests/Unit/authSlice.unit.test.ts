import axios from 'axios';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import reducer, { getCurrentUser, logIn, logout, register } from '../../features/auth/authSlice';
import { displayError } from '../../features/error/errorSlice';
import { AnyAction } from 'redux';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('../../features/error/errorSlice', () => ({
  displayError: jest.fn(),
}));

describe('authSlice', () => {
  const initialState = null;
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      // ASSERT
      expect(reducer(undefined, {} as AnyAction)).toBeNull();
    });

    it('should handle RECEIVE_USER with valid username', () => {
      // ARRANGE
      const action = { type: 'user/RECEIVE_USER', payload: { username: 'testuser' } };

      // ASSERT
      expect(reducer(initialState, action)).toBe('testuser');
    });

    it('should handle RECEIVE_USER with invalid username', () => {
      // ARRANGE
      const action = { type: 'user/RECEIVE_USER', payload: { username: 123 } };

      // ASSERT
      expect(reducer(initialState, action)).toBe('');
    });
  });

  describe('getCurrentUser', () => {
    it('should dispatch RECEIVE_USER with valid username', async () => {
      // ARRANGE
      mockedAxios.get.mockResolvedValue({ data: { username: 'testuser' } });

      // ACT
      await getCurrentUser()(mockDispatch);

      // ASSERT
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'user/RECEIVE_USER', payload: { username: 'testuser' } });
    });

    it('should handle error and dispatch RECEIVE_USER with null username', async () => {
      // ARRANGE
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      // ACT
      await getCurrentUser()(mockDispatch);

      // ASSERT
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'user/RECEIVE_USER', payload: { username: null } });
    });
  });

  describe('logIn', () => {
    it('should log in successfully and dispatch RECEIVE_USER', async () => {
      // ARRANGE
      mockedAxios.post.mockResolvedValue({ data: { username: 'testuser' } });
      const successFn = jest.fn();

      // ACT
      await logIn('testuser', 'password', jest.fn(), successFn)(mockDispatch);

      // ASSERT
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'user/RECEIVE_USER', payload: { username: 'testuser' } });
      expect(successFn).toHaveBeenCalled();
    });

    it('should handle login error and dispatch displayError', async () => {
      // ARRANGE
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Login failed' } } });

      // ACT
      await logIn('testuser', 'password', jest.fn(), jest.fn())(mockDispatch);

      // ASSERT
      expect(displayError).toHaveBeenCalledWith('Login failed');
    });
  });

  describe('logout', () => {
    it('should log out successfully and dispatch RECEIVE_USER with null', async () => {
      // ARRANGE
      mockedAxios.post.mockResolvedValue({});

      // ACT
      await logout()(mockDispatch);

      // ASSERT
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'user/RECEIVE_USER', payload: { username: null } });
    });

    it('should handle logout error and dispatch displayError', async () => {
      // ARRANGE
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Logout failed' } } });

      // ACT
      await logout()(mockDispatch);

      // ASSERT
      expect(displayError).toHaveBeenCalledWith('Logout failed');
    });
  });

  describe('register', () => {
    it('should register successfully and dispatch RECEIVE_USER', async () => {
      // ARRANGE
      mockedAxios.post.mockResolvedValue({ data: { username: 'newuser' } });

      // ACT
      await register('newuser', 'password', 'password', jest.fn())(mockDispatch);

      // ASSERT
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'user/RECEIVE_USER', payload: { username: 'newuser' } });
    });

    it('should handle registration error and dispatch displayError', async () => {
      // ARRANGE
      mockedAxios.post.mockRejectedValue({ response: { data: { message: 'Registration failed' } } });

      // ACT
      await register('newuser', 'password', 'password', jest.fn())(mockDispatch);

      // ASSERT
      expect(displayError).toHaveBeenCalledWith('Registration failed');
    });
  });
});
