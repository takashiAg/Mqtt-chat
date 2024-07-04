import useAuth from "./useAuth";

const method = "post";
const path = "/signin";
const eagerLoad = true;

interface Input {
  email: string;
  password: string;
}

// eslint-disable-next-line react-refresh/only-export-components, react-hooks/rules-of-hooks
export default useAuth<unknown, Input>({
  path,
  method,
  eagerLoad,
});
