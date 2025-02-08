import { TextArea } from "@blueprintjs/core";
import React from "react";

interface TitleProps {
  titleRef: React.RefObject<HTMLTextAreaElement>;
  keyUpHandler: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  keyDownHandler: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const Title: React.FC<TitleProps> = ({ titleRef, keyUpHandler, keyDownHandler }) => {
  return (
    <TextArea
      large={true}
      placeholder="Title"
      maxLength={60}
      inputRef={titleRef}
      onKeyDown={keyDownHandler}
      onKeyUp={keyUpHandler}
    />
  );
};

export default Title;
