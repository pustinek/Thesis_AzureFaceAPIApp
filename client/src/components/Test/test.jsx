import React from "react";
import { useDispatch, useGlobal } from "reactn";

const test = () => {
  const [user, setUser] = useGlobal("user");

  return <div>{user.name}</div>;
};

export default test;
