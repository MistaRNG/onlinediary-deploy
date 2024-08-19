import { InputGroup } from "@blueprintjs/core";
import CancelButton from "./CancelButton";
import React from "react";

interface SearchInputProps {
  search: string;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  cancel: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ search, changeHandler, cancel }) => {
  return (
    <InputGroup
      large={true}
      placeholder="Search..."
      value={search}
      onChange={changeHandler}
      rightElement={<CancelButton search={!!search} cancel={cancel} />}
    />
  );
};

export default SearchInput;
