import React, { useEffect } from "react";
import Router from "./route";
import useVerifyToken from "./api/verify-token";
import { useCookies } from "react-cookie";
import { useGlobalState, useGlobalUpdate } from "./states/auth.hook";

import "./index.css";

const Wrapper = () => {
  const verifyToken = useVerifyToken();

  const [cookies] = useCookies();
  const setState = useGlobalUpdate();

  useEffect(() => {
    (async () => {
      const result = await verifyToken.execute();
      if (result instanceof Error) return;
      setState({ isLoggedIn: true, userId: result.id });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies]);

  return <Router />;
};

export default Wrapper;
