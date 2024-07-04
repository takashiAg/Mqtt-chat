import useApi from "./useApi";
import { message } from "../../../api/src/schema";

const method = "post";
const path = "/room";
const eagerLoad = false;

interface Input {
  name: string;
}
interface Output {
  roomId: number;
  message: string;
}

// eslint-disable-next-line react-refresh/only-export-components, react-hooks/rules-of-hooks
export default useApi<Output, Input>({
  path,
  method,
  eagerLoad,
});
