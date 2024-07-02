import * as crypto from "./crypto";
import * as jwt from "./jwt";

export async function getToken(
  email: string,
  PRIVATE_KEY: string
): Promise<string> {
  const jwtPayload = {
    email,
  };

  const importPrivateKey = await crypto.importPrivateKey(PRIVATE_KEY);

  const token = await jwt.signRS256(jwtPayload, importPrivateKey);

  return token;
}

export async function verifyToken(token: string, publicKey: string) {
  const importPublicKey = await crypto.importPublicKey(publicKey);

  const result = await jwt.verifyRS256(token, importPublicKey);

  return result;
}
