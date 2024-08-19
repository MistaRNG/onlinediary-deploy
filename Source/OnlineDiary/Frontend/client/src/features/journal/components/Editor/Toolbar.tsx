import EditorButtons from "./EditorButtons";
import { getStatusStr } from "common/helpers";

interface ToolbarProps {
  saved: boolean;
  mouseDownHandler: (style: string, isList?: boolean) => (event: React.MouseEvent<HTMLButtonElement>) => void;
  styles: string[];
  lists: { style: string; icon: string }[];
  wordCount: number;
}

const Toolbar: React.FC<ToolbarProps> = ({ saved, mouseDownHandler, styles, lists, wordCount }) => {
  return (
    <div className="Editor-Toolbar">
      <EditorButtons {...{ mouseDownHandler, styles, lists }} />
      <div>{getStatusStr(saved)}</div>
      <div>{wordCount}</div>
    </div>
  );
};

export default Toolbar;
