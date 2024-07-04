async function hashWithSalt(
  password: string,
  salt: ArrayBuffer,
): Promise<string[]> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256, // 256ビットのハッシュを生成
  );

  // Uint8ArrayをBase64エンコーディング
  const hashedPassword = base64Encode(new Uint8Array(derivedBits));

  // ソルトもBase64エンコーディング
  const encodedSalt = base64Encode(new Uint8Array(salt));
  return [hashedPassword, encodedSalt];
}

function base64Encode(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary); // Base64エンコード
}

export async function hash(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16)); // ソルトをランダムに生成
  const [hashedPassword, encodedSalt] = await hashWithSalt(password, salt);
  // ハッシュとソルトをピリオドで結合
  return `${hashedPassword}.${encodedSalt}`;
}
function base64Decode(base64: string): ArrayBuffer {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function compare(
  hashedPasswordWithSolt: string,
  password: string,
): Promise<boolean> {
  // ストアされたハッシュからハッシュとソルトを抽出
  const [hashedPassword, encodedSalt] = hashedPasswordWithSolt.split(".");
  const salt = base64Decode(encodedSalt);

  // 現在のパスワードからハッシュを生成
  const [currentHash] = await hashWithSalt(password, salt);
  return hashedPassword === currentHash;
}
