import useAuth from "./useAuth";

const method = "post";
const path = "/signup";
const eagerLoad = false;

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
