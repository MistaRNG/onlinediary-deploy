import { Button } from "@blueprintjs/core";
import React from "react";

interface CancelButtonProps {
  search: boolean;
  cancel: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ search, cancel }) => {
  return search ? <Button icon="cross" minimal={true} onClick={cancel} /> : null;
};

export default CancelButton;
