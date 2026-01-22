/**
 * クライアント側のストレージヘルパー
 * サーバー側のstoragePutを呼び出してS3にファイルをアップロードする
 */

export async function storagePut(
  key: string,
  file: File,
  contentType: string
): Promise<{ url: string; key: string }> {
  // ファイルをBase64に変換
  const arrayBuffer = await file.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  );

  // サーバー側のAPIを呼び出す
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
      data: base64,
      contentType,
    }),
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return await response.json();
}
