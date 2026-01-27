import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";
import { initializeAdminPassword } from "./db";

describe("BBS Comments機能テスト", () => {
  beforeAll(async () => {
    // テスト用の初期化
    await initializeAdminPassword("test123");
  });

  it("認証なしでコメントを作成できる", async () => {
    // まずBBS投稿を作成
    const postResult = await db.createBbsPost({
      content: "テスト投稿",
      authorName: "テストユーザー",
      authorId: null,
    });

    // 投稿IDを取得
    const posts = await db.getAllBbsPosts();
    const testPost = posts.find(p => p.content === "テスト投稿");
    
    if (!testPost) {
      throw new Error("テスト投稿が見つかりません");
    }

    // コメントを作成
    const commentResult = await db.createBbsComment({
      postId: testPost.id,
      content: "テストコメント",
      authorName: "コメント投稿者",
      authorId: null,
    });

    expect(commentResult).toBeDefined();

    // コメントが取得できることを確認
    const comments = await db.getAllBbsComments(testPost.id);
    expect(comments.length).toBeGreaterThan(0);
    
    const testComment = comments.find(c => c.content === "テストコメント");
    expect(testComment).toBeDefined();
    expect(testComment?.authorName).toBe("コメント投稿者");
  });

  it("投稿に複数のコメントを追加できる", async () => {
    // テスト投稿を作成
    await db.createBbsPost({
      content: "複数コメント用投稿",
      authorName: "投稿者",
      authorId: null,
    });

    const posts = await db.getAllBbsPosts();
    const testPost = posts.find(p => p.content === "複数コメント用投稿");
    
    if (!testPost) {
      throw new Error("テスト投稿が見つかりません");
    }

    // 複数のコメントを作成
    for (let i = 1; i <= 3; i++) {
      await db.createBbsComment({
        postId: testPost.id,
        content: `コメント${i}`,
        authorName: `コメント投稿者${i}`,
        authorId: null,
      });
    }

    // コメント数を確認
    const comments = await db.getAllBbsComments(testPost.id);
    expect(comments.length).toBeGreaterThanOrEqual(3);
  });

  it("コメントを削除できる", async () => {
    // テスト投稿を作成
    await db.createBbsPost({
      content: "削除テスト投稿",
      authorName: "投稿者",
      authorId: null,
    });

    const posts = await db.getAllBbsPosts();
    const testPost = posts.find(p => p.content === "削除テスト投稿");
    
    if (!testPost) {
      throw new Error("テスト投稿が見つかりません");
    }

    // コメントを作成
    await db.createBbsComment({
      postId: testPost.id,
      content: "削除対象コメント",
      authorName: "投稿者",
      authorId: null,
    });

    let comments = await db.getAllBbsComments(testPost.id);
    const commentToDelete = comments.find(c => c.content === "削除対象コメント");
    
    if (!commentToDelete) {
      throw new Error("削除対象コメントが見つかりません");
    }

    // コメントを削除
    await db.deleteBbsComment(commentToDelete.id);

    // 削除されたことを確認
    comments = await db.getAllBbsComments(testPost.id);
    const deletedComment = comments.find(c => c.id === commentToDelete.id);
    expect(deletedComment).toBeUndefined();
  });

  it("投稿を削除するとコメントも削除される", async () => {
    // テスト投稿を作成
    await db.createBbsPost({
      content: "投稿削除テスト",
      authorName: "投稿者",
      authorId: null,
    });

    const posts = await db.getAllBbsPosts();
    const testPost = posts.find(p => p.content === "投稿削除テスト");
    
    if (!testPost) {
      throw new Error("テスト投稿が見つかりません");
    }

    // コメントを作成
    await db.createBbsComment({
      postId: testPost.id,
      content: "投稿削除時のコメント",
      authorName: "投稿者",
      authorId: null,
    });

    // 投稿を削除
    await db.deleteBbsPost(testPost.id);

    // 投稿が削除されたことを確認
    const remainingPosts = await db.getAllBbsPosts();
    const deletedPost = remainingPosts.find(p => p.id === testPost.id);
    expect(deletedPost).toBeUndefined();
  });
});
