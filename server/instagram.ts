import { ENV } from './_core/env';

export interface InstagramPost {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  media_url: string;
  timestamp: string;
  permalink?: string;
}

export interface InstagramMediaResponse {
  data: InstagramPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

/**
 * Instagram Graph API から投稿を取得
 */
export async function fetchInstagramPosts(limit: number = 12): Promise<InstagramPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.warn('[Instagram] Access token not configured');
    return [];
  }

  try {
    const url = new URL('https://graph.instagram.com/me/media');
    url.searchParams.append('fields', 'id,caption,media_type,media_url,timestamp,permalink');
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('access_token', accessToken);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error(`[Instagram] API error: ${response.status} ${response.statusText}`);
      const errorData = await response.json().catch(() => ({}));
      console.error('[Instagram] Error details:', errorData);
      return [];
    }

    const data: InstagramMediaResponse = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      console.warn('[Instagram] Unexpected response format');
      return [];
    }

    return data.data;
  } catch (error) {
    console.error('[Instagram] Failed to fetch posts:', error);
    return [];
  }
}

/**
 * 投稿キャッシュ（メモリ内）
 * 本番環境ではRedisなどを使用することを推奨
 */
let cachedPosts: InstagramPost[] = [];
let lastFetchTime: number = 0;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1時間

/**
 * キャッシュ付きで投稿を取得
 */
export async function getInstagramPostsCached(limit: number = 12): Promise<InstagramPost[]> {
  const now = Date.now();
  
  // キャッシュが有効な場合は返す
  if (cachedPosts.length > 0 && now - lastFetchTime < CACHE_DURATION_MS) {
    return cachedPosts;
  }

  // キャッシュが無効な場合は新しく取得
  const posts = await fetchInstagramPosts(limit);
  cachedPosts = posts;
  lastFetchTime = now;
  
  return posts;
}

/**
 * キャッシュをクリア
 */
export function clearInstagramCache(): void {
  cachedPosts = [];
  lastFetchTime = 0;
}
