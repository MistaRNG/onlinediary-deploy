import "./Editor.css";
import useEditor from "common/hooks/useEditor";
import Toolbar from "./Toolbar";
import Main from "./Main";

interface JournalEditorProps {
  date: string | Date;
}

const JournalEditor: React.FC<JournalEditorProps> = ({ date }) => {
  const formattedDate = typeof date === 'string' ? date : date.toISOString().split('T')[0];

  const {
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
  } = useEditor(formattedDate);
  
  return (
    <div className="Editor">
      <Main
        {...{
          onChange,
          editorState,
          editor,
          focusEditor,
          date,
          titleRef,
          titleKeyDownHandler,
          titleKeyUpHandler,
          isPublic,
          toggleIsPublic,
        }}
      />
      <Toolbar {...{ saved, mouseDownHandler, styles, lists, wordCount }} />
    </div>
  );
};

export default JournalEditor;
