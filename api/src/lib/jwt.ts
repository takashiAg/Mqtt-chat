type JWTPayload = {
  email: string;
  [key: string]: string;
};

// JWTにHS256で署名する関数
export async function signHS256(payload: JWTPayload, secret: string) {
  const encoder = new TextEncoder();

  // JWTヘッダー
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  // エンコード
  function base64UrlEncode(str: string) {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // シグネチャを作成
  const signatureData = encoder.encode(encodedHeader + "." + encodedPayload);
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, signatureData);
  const encodedSignature = base64UrlEncode(
    String.fromCharCode.apply(null, new Uint8Array(signature))
  );

  return encodedHeader + "." + encodedPayload + "." + encodedSignature;
}

// JWTにRS256署名する関数
export async function signRS256(payload: JWTPayload, privateKey: CryptoKey) {
  const encoder = new TextEncoder();

  // JWTヘッダー
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  // エンコード
  function base64UrlEncode(str: string) {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // シグネチャを作成
  const signatureData = encoder.encode(encodedHeader + "." + encodedPayload);

  const signature = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    privateKey,
    signatureData
  );

  const encodedSignature = base64UrlEncode(
    String.fromCharCode.apply(null, new Uint8Array(signature))
  );

  return encodedHeader + "." + encodedPayload + "." + encodedSignature;
}

// JWTを検証する関数(RS256用)
export async function verifyRS256(
  token: string,
  publicKey: CryptoKey
): Promise<JWTPayload> {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");

  // デコード
  function base64UrlDecode(str: string) {
    return atob(str.replace(/-/g, "+").replace(/_/g, "/"));
  }

  const header = JSON.parse(base64UrlDecode(encodedHeader));
  if (header.alg !== "RS256") {
    throw new Error("アルゴリズムが一致しません。");
  }

  const signatureData = new TextEncoder().encode(
    `${encodedHeader}.${encodedPayload}`
  );
  const signature = new Uint8Array(
    Array.from(base64UrlDecode(encodedSignature)).map((char) =>
      char.charCodeAt(0)
    )
  );

  const isValid = await crypto.subtle.verify(
    { name: "RSASSA-PKCS1-v1_5" },
    publicKey,
    signature,
    signatureData
  );

  if (!isValid) throw new Error("署名が一致しません。");

  const payload = JSON.parse(base64UrlDecode(encodedPayload));

  return payload;
}
