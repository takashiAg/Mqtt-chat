import useApi from "./useApi";

const method = "put";
const path = "/user";
const eagerLoad = false;

interface Input {
  name: string;
}

// eslint-disable-next-line react-refresh/only-export-components, react-hooks/rules-of-hooks
export default useApi<unknown, Input>({
  path,
  method,
  eagerLoad,
});
