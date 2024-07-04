import useApi from "./useApi";
import Message from "../type/message";

const method = "get";
const path = "/message";
const eagerLoad = true;

interface Input {
  roomId: number;
}

// eslint-disable-next-line react-refresh/only-export-components, react-hooks/rules-of-hooks
export default useApi<Message[], Input>({
  path,
  method,
  eagerLoad,
});
