import Session from "../lib/session";

declare module "hono" {
  interface ContextVariableMap {
    session: Session;
  }
}
