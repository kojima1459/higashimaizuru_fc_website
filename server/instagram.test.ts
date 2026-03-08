import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchInstagramPosts, getInstagramPostsCached, clearInstagramCache, InstagramPost } from './instagram';

// Mock fetch
global.fetch = vi.fn();

describe('Instagram API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearInstagramCache();
  });

  describe('fetchInstagramPosts', () => {
    it('should return empty array when access token is not configured', async () => {
      const originalToken = process.env.INSTAGRAM_ACCESS_TOKEN;
      delete process.env.INSTAGRAM_ACCESS_TOKEN;

      const posts = await fetchInstagramPosts();
      expect(posts).toEqual([]);

      process.env.INSTAGRAM_ACCESS_TOKEN = originalToken;
    });

    it('should fetch posts from Instagram Graph API', async () => {
      const mockPosts: InstagramPost[] = [
        {
          id: '123',
          caption: 'Test post',
          media_type: 'IMAGE',
          media_url: 'https://example.com/image.jpg',
          timestamp: '2024-01-01T00:00:00+0000',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockPosts }),
      });

      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-token';
      const posts = await fetchInstagramPosts(1);

      expect(posts).toEqual(mockPosts);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://graph.instagram.com/me/media')
      );
    });

    it('should handle API errors gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ error: { message: 'Invalid token' } }),
      });

      process.env.INSTAGRAM_ACCESS_TOKEN = 'invalid-token';
      const posts = await fetchInstagramPosts();

      expect(posts).toEqual([]);
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-token';
      const posts = await fetchInstagramPosts();

      expect(posts).toEqual([]);
    });
  });

  describe('getInstagramPostsCached', () => {
    it('should cache posts and return cached data on subsequent calls', async () => {
      const mockPosts: InstagramPost[] = [
        {
          id: '123',
          caption: 'Test post',
          media_type: 'IMAGE',
          media_url: 'https://example.com/image.jpg',
          timestamp: '2024-01-01T00:00:00+0000',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockPosts }),
      });

      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-token';

      // First call should fetch from API
      const posts1 = await getInstagramPostsCached(1);
      expect(posts1).toEqual(mockPosts);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second call should return cached data
      const posts2 = await getInstagramPostsCached(1);
      expect(posts2).toEqual(mockPosts);
      expect(global.fetch).toHaveBeenCalledTimes(1); // No additional API call
    });

    it('should clear cache when clearInstagramCache is called', async () => {
      const mockPosts: InstagramPost[] = [
        {
          id: '123',
          caption: 'Test post',
          media_type: 'IMAGE',
          media_url: 'https://example.com/image.jpg',
          timestamp: '2024-01-01T00:00:00+0000',
        },
      ];

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockPosts }),
      });

      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-token';

      // First call
      await getInstagramPostsCached(1);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Clear cache
      clearInstagramCache();

      // Second call should fetch again
      await getInstagramPostsCached(1);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
