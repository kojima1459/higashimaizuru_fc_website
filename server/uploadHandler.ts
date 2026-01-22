import { Request, Response } from 'express';
import { storagePut } from './storage';

export async function handleUpload(req: Request, res: Response) {
  try {
    const { key, data, contentType } = req.body;

    if (!key || !data || !contentType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Base64をBufferに変換
    const buffer = Buffer.from(data, 'base64');

    // S3にアップロード
    const result = await storagePut(key, buffer, contentType);

    res.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}
