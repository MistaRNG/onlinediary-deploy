import { useState, useRef, useEffect } from "react";
import { EditorState, RichUtils, DraftInlineStyleType } from "draft-js";
import {
  saveJournal,
  deleteJournal,
  clearStatus,
  showSavedTimeout,
} from "features/journal/journalSlice";
import { useDispatch, useSelector } from "react-redux";
import { convertFromRaw, convertToRaw, RawDraftContentState } from "draft-js";

import { countWords } from "common/helpers";
import { RootState, AppDispatch } from "app/store";

interface ListStyle {
  style: string;
  icon: string;
}

const styles: DraftInlineStyleType[] = ["BOLD", "ITALIC", "UNDERLINE"];
const lists: ListStyle[] = [
  { style: "ordered-list-item", icon: "numbered-list" },
  { style: "unordered-list-item", icon: "properties" },
];

/**
 * Custom hook for managing the state and behavior of a text editor component.
 * 
 * This hook handles various editor functionalities, including state management for
 * editor content, title, word count, and save/delete actions. It also provides utility 
 * functions to handle editor state updates, focus events, and other editor-specific tasks.
 * 
 * @param {string} date - The date associated with the journal entry, used to load/save content.
 * 
 * @returns {Object} - An object containing:
 * - `focusEditor`: Function to focus the editor.
 * - `editor`: Ref object pointing to the editor state.
 * - `editorState`: The current state of the editor.
 * - `onChange`: Function to handle changes in the editor state.
 * - `mouseDownHandler`: Function to toggle inline and block styles.
 * - `styles`: Array of inline styles (BOLD, ITALIC, UNDERLINE).
 * - `lists`: Array of list styles for ordered and unordered lists.
 * - `wordCount`: The current word count in the editor.
 * - `titleRef`: Ref object for the title input field.
 * - `titleKeyDownHandler`: Function to handle key down events in the title field.
 * - `titleKeyUpHandler`: Function to handle key up events in the title field.
 * - `saved`: Boolean indicating if the journal entry is saved.
 * - `isPublic`: Boolean indicating if the journal entry is public.
 * - `toggleIsPublic`: Function to toggle the public state of the journal entry.
 */
const useEditor = (date: string) => {
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const toggleIsPublic = () => {
    const newIsPublic = !isPublic;
    setIsPublic(newIsPublic);
  
    const content = editorState.getCurrentContent();
    const isEmpty = !content.hasText();
    const title = titleRef.current?.value || "";
  
    if (!isEmpty || title) {
      const rawContent = convertToRaw(content);
      dispatch(
        saveJournal(rawContent, date, title, newIsPublic)
      );
    }
  };

  const { data, saved } = useSelector((state: RootState) => ({
    data: state.journals.data,
    saved: state.journals.saved,
  }));

  const titleRef = useRef<HTMLTextAreaElement | null>(null);

  const titleKeyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const titleKeyUpHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const val = e.currentTarget.value;
    if (titleRef.current) {
      titleRef.current.value = val.replace(/\n/g, " ");
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
    onChange();
  };

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [wordCount, setWordCount] = useState<number>(
    countWords(editorState.getCurrentContent().getPlainText())
  );

  const updateWordCount = (state?: EditorState) => {
    if (state) {
      setWordCount(countWords(state.getCurrentContent().getPlainText()));
    } else {
      setWordCount(0);
    }
  };

  useEffect(() => {
    if (date in data) {
      const content = convertFromRaw(data[date].content as RawDraftContentState);
      const state = EditorState.createWithContent(content);
      setEditorState(state);
      updateWordCount(state);
      updateTitle(data[date].title);
      setIsPublic(data[date].isPublic || false);
    } else {
      setEditorState(EditorState.createEmpty());
      updateWordCount();
      updateTitle("");
      setIsPublic(false);
    }
    // eslint-disable-next-line
  }, [date]);

  const editor = useRef<EditorState | null>(null);

  const focusEditor = () => editor.current?.focus();
  const dispatch: AppDispatch = useDispatch();

  const onChange = (s?: EditorState) => {
    const state = s || editorState;
    const content = state.getCurrentContent();
    const isEmpty = !content.hasText();
    const title = titleRef.current?.value || "";

    if (isEmpty && !title) {
      dispatch(deleteJournal(date));
    } else {
      const rawContent = convertToRaw(content);
      dispatch(
        saveJournal(rawContent, date, title, isPublic)
      );
    }
    setEditorState(state);
    updateWordCount(state);
  };

  const updateTitle = (str: string) => {
    if (titleRef.current) {
      titleRef.current.value = str;
    }
  };

  const mouseDownHandler = (style: DraftInlineStyleType, list?: boolean) => {
    if (!list) {
      return () => {
        setEditorState((prev) => RichUtils.toggleInlineStyle(prev, style));
      };
    }

    return () => {
      setEditorState((prev) => RichUtils.toggleBlockType(prev, style));
    };
  };

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => dispatch(clearStatus), showSavedTimeout);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line
  }, [saved]);

  return {
    focusEditor,
    editor,
    editorState,
    onChange,
    mouseDownHandler,
    styles,
    lists,
    wordCount,
    titleRef,
    titleKeyDownHandler,
    titleKeyUpHandler,
    saved,
    isPublic,          
    toggleIsPublic,    
  };
};

export default useEditor;
