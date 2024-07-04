import useApi from "./useApi";
import { message } from "../../../api/src/schema";

const method = "post";
const path = "/verify-token";
const eagerLoad = false;

interface Input {}
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
