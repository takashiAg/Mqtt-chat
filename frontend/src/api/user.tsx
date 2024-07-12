import useApi from "./useApi";
import IUser from "../type/user";

const method = "get";
const path = "/user/:userId";
const eagerLoad = true;

interface Input {}

// eslint-disable-next-line react-refresh/only-export-components, react-hooks/rules-of-hooks
export default useApi<IUser, Input>({
  path,
  method,
  eagerLoad,
});
