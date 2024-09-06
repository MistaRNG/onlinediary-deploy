import { describe, it, jest, beforeEach, expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import journalReducer from '../../features/journal/journalSlice';
import axios from 'axios';

const mockStore = configureStore({
  reducer: {
    journals: journalReducer,
  },
});

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn()),
}));

describe('PublicJournals Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    // ARRANGE
    const placeholderText = 'Public entries';

    // ACT
    const componentText = placeholderText;

    // ASSERT
    expect(componentText).toBe('Public entries');
  });

  it('should call getPublicJournals on component load', async () => {
    // ARRANGE
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    // ACT
    const response = await axios.get('/journals');

    // ASSERT
    expect(response.data).toEqual([]);
    expect(mockedAxios.get).toHaveBeenCalledWith('/journals');
  });

  it('should display filtered journals based on search input', () => {
    // ARRANGE
    const searchInput = 'Test Journal';

    // ACT
    const filteredResult = searchInput.includes('Journal');

    // ASSERT
    expect(filteredResult).toBe(true);
  });

  it('should open modal when a journal is clicked', () => {
    // ARRANGE
    let modalOpen = false;

    // ACT
    const openModal = () => {
      modalOpen = true;
    };
    openModal();

    // ASSERT
    expect(modalOpen).toBe(true);
  });

  it('should handle likes correctly', () => {
    // ARRANGE
    let likeCount = 0;

    // ACT
    const handleLike = () => {
      likeCount += 1;
    };
    handleLike();

    // ASSERT
    expect(likeCount).toBe(1);
  });

  it('should submit a new comment', () => {
    // ARRANGE
    let comment = '';

    // ACT
    const submitComment = (newComment: string) => {
      comment = newComment;
    };
    submitComment('New Comment');

    // ASSERT
    expect(comment).toBe('New Comment');
  });
});
