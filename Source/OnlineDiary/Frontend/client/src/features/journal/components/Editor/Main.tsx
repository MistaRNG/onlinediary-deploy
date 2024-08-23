import { Editor, EditorState } from "draft-js";
import Title from "./Title";
import DateComponent from "./Date";
import { Switch } from "@blueprintjs/core";

interface MainProps {
  onChange: (editorState: EditorState) => void;
  editorState: EditorState;
  editor: React.RefObject<Editor>;
  focusEditor: () => void;
  date: string | Date;
  titleRef: React.RefObject<HTMLTextAreaElement>;
  titleKeyDownHandler: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  titleKeyUpHandler: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isPublic: boolean;
  toggleIsPublic: () => void;
}

const Main: React.FC<MainProps> = ({
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
}) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  return (
    <div>
      <Switch
        checked={isPublic}
        label="Public"
        onChange={toggleIsPublic}
        style={{ marginBottom: "1em" }}
      />
      <DateComponent date={parsedDate} />
      <Title
        {...{
          titleRef,
          keyDownHandler: titleKeyDownHandler,
          keyUpHandler: titleKeyUpHandler,
        }}
      />
      <Editor
        {...{
          onChange,
          editorState,
          ref: editor,
          placeholder: "How was your day?",
          onClick: focusEditor,
        }}
      />
    </div>
  );
};

export default Main;
