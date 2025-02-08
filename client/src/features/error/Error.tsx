import { Toaster, Toast } from "@blueprintjs/core";
import useError from "common/hooks/useError";
import React from "react";

const Error: React.FC = () => {
  const { displayedError, dismissHandler } = useError();

  return (
    displayedError && (
      <Toaster>
        <Toast
          onDismiss={dismissHandler}
          message={displayedError}
          intent="danger"
        />
      </Toaster>
    )
  );
};

export default Error;
