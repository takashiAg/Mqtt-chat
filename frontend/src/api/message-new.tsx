import useApi from "./useApi";

const method = "post";
const path = "/message";
const eagerLoad = false;

interface Input {
  message: string;
  roomId: number;
}
interface Output {
  messageId: number;
  message: string;
}

// eslint-disable-next-line react-refresh/only-export-components, react-hooks/rules-of-hooks
export default useApi<Output, Input>({
  path,
  method,
  eagerLoad,
});
