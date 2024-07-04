// 鍵ペアの生成例
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: "SHA-256" },
    },
    true,
    ["sign", "verify"]
  );
  return keyPair as CryptoKeyPair;
}
export async function exportPrivateKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("pkcs8", key);
  const exportedAsString = String.fromCharCode.apply(
    null,
    new Uint8Array(exported)
  );
  const exportedAsBase64 = btoa(exportedAsString);
  const exportedAsPem = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64
    .match(/.{1,64}/g)
    ?.join("\n")}\n-----END PRIVATE KEY-----`;

  return exportedAsPem;
}

export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("spki", key);
  const exportedAsString = String.fromCharCode.apply(
    null,
    new Uint8Array(exported)
  );
  const exportedAsBase64 = btoa(exportedAsString);
  const exportedAsPem = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64
    .match(/.{1,64}/g)
    ?.join("\n")}\n-----END PUBLIC KEY-----`;

  return exportedAsPem;
}

export async function generateStringKeyPair(): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  const keyPair = await generateKeyPair();
  const privateKey = await exportPrivateKey(keyPair.privateKey);
  const publicKey = await exportPublicKey(keyPair.publicKey);
  return { privateKey, publicKey };
}
// PEM形式の公開鍵をCryptoKeyに変換する関数
export async function importPublicKey(pem: string): Promise<CryptoKey> {
  // PEMヘッダーとフッターを削除
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/"/g, "")
    .replace(/\n/g, "")
    .replace(/\r/g, "")
    .replace(/\\n/g, "")
    .replace(/\s+/g, "");

  const binaryDerString = atob(pemContents);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }
  return await crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ["verify"]
  );
}

export async function importPrivateKey(pem: string): Promise<CryptoKey> {
  // PEMヘッダーとフッターを削除
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = pem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/"/g, "")
    .replace(/\n/g, "")
    .replace(/\r/g, "")
    .replace(/\\n/g, "")
    .replace(/\s+/g, "");

  const binaryDerString = atob(pemContents);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }
  return await crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ["sign"]
  );
}
