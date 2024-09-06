import {
    compareDate,
    formatDate,
    getAlarm,
    getFormattedDate,
    getLongDate,
    getNextDay,
    removeContent,
    countWords,
    getText,
    formatJournals,
    getStatusStr,
  } from '../../common/helpers';
  import moment from 'moment';
  import { RawDraftContentState } from 'draft-js';
  import { describe, it, expect } from '@jest/globals';
  
  describe('helpers functions', () => {
    it('should format date correctly', () => {
      // ARRANGE
      const date = '2024-09-06';
  
      // ASSERT
      expect(formatDate(date)).toBe('2024-09-06');
    });
  
    it('should compare two dates correctly', () => {
      // ARRANGE & ASSERT
      expect(compareDate('2024-09-06', '2024-09-07')).toBe(true);
      expect(compareDate('2024-09-08', '2024-09-07')).toBe(false);
    });
  
    it('should get alarm time correctly', () => {
      // ASSERT
      expect(moment(getAlarm()).isAfter(moment())).toBe(true);
    });
  
    it('should get formatted date or false if invalid', () => {
      // ARRANGE & ASSERT
      expect(getFormattedDate('2024-09-06')).toBe('2024-09-06');
      expect(getFormattedDate('invalid-date')).toBe(false);
    });
  
    it('should get long date format', () => {
      // ARRANGE
      const date = '2024-09-06';
  
      // ASSERT
      expect(getLongDate(date)).toBe('Friday, September 6, 2024');
    });
  
    it('should get the next day correctly', () => {
      // ARRANGE
      const date = '2024-09-06';
  
      // ASSERT
      expect(getNextDay(date)).toBe('2024-09-07');
    });
  
    it('should remove content by date', () => {
      // ARRANGE
      const journals = { '2024-09-06': { id: 1, title: 'Test', content: {}, text: 'Test', isPublic: true } };
  
      // ASSERT
      expect(removeContent(journals, '2024-09-06')).toEqual({});
    });
  
    it('should count words correctly', () => {
      // ARRANGE
      const text = 'This is a test string with 7 words.';
  
      // ASSERT
      expect(countWords(text)).toBe(8);
    });
  
    it('should get text from content state', () => {
      // ARRANGE
      const contentState: RawDraftContentState = {
        blocks: [{ text: 'Hello, world!', type: 'unstyled', key: '1', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }],
        entityMap: {},
      };
  
      // ASSERT
      expect(getText(contentState)).toBe('Hello, world!');
    });
  
    it('should format journals correctly', () => {
      // ARRANGE
      const data = [
        {
          id: 1,
          date: '2024-09-06',
          content: { blocks: [{ text: 'Test', type: 'unstyled', key: '1', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }], entityMap: {} },
          title: 'Test Title',
          is_public: true,
        },
      ];
  
      // ACT
      const [formattedJournals, dates] = formatJournals(data);
  
      // ASSERT
      expect(formattedJournals['2024-09-06']).toEqual({
        id: 1,
        title: 'Test Title',
        content: { blocks: [{ text: 'Test', type: 'unstyled', key: '1', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }], entityMap: {} },
        text: 'Test',
        isPublic: true,
      });
      expect(dates).toEqual(['2024-09-06']);
    });
  
    it('should get status string based on saved state', () => {
      // ASSERT
      expect(getStatusStr(true)).toBe('Saved');
      expect(getStatusStr(false)).toBe('Saving...');
      expect(getStatusStr(null)).toBe(false);
    });
  });
  