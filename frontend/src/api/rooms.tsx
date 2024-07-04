import useApi from "./useApi";
import Room from "../type/room";

const method = "get";
const path = "/room";
const eagerLoad = true;

interface Input {}

// eslint-disable-next-line react-refresh/only-export-components, react-hooks/rules-of-hooks
export default useApi<Room[], Input>({
  path,
  method,
  eagerLoad,
});
