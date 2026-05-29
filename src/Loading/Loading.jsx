import React from "react";
import Spinner from "react-bootstrap/Spinner";
function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center w-100 vh-100">
      <Spinner animation="border" role="status"></Spinner>
    </div>
  );
}

export default Loading;
