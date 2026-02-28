import { getAllNews } from "./db";

export async function generateRSSFeed() {
  const news = await getAllNews();
  const baseUrl = process.env.VITE_FRONTEND_FORGE_API_URL || "https://www.higashimaizurufc.com";
  
  const rssItems = news.slice(0, 20).map((item) => {
    const pubDate = new Date(item.createdAt).toUTCString();
    const link = `${baseUrl}/news/${item.id}`;
    
    return `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${item.content.substring(0, 200)}...]]></description>
      <category><![CDATA[${item.mainCategory}]]></category>
    </item>`;
  }).join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>東舞鶴フットボールクラブ お知らせ</title>
    <link>${baseUrl}</link>
    <description>京都府舞鶴市を拠点とする小学生を中心としたフットボールクラブの最新情報</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return rss;
}

export async function generateAtomFeed() {
  const news = await getAllNews();
  const baseUrl = process.env.VITE_FRONTEND_FORGE_API_URL || "https://www.higashimaizurufc.com";
  
  const atomEntries = news.slice(0, 20).map((item) => {
    const updated = new Date(item.createdAt).toISOString();
    const link = `${baseUrl}/news/${item.id}`;
    
    return `
  <entry>
    <title><![CDATA[${item.title}]]></title>
    <link href="${link}" />
    <id>${link}</id>
    <updated>${updated}</updated>
    <summary><![CDATA[${item.content.substring(0, 200)}...]]></summary>
    <category term="${item.mainCategory}" />
  </entry>`;
  }).join("");

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>東舞鶴フットボールクラブ お知らせ</title>
  <link href="${baseUrl}" />
  <link href="${baseUrl}/api/atom" rel="self" />
  <id>${baseUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <subtitle>京都府舞鶴市を拠点とする小学生を中心としたフットボールクラブの最新情報</subtitle>
  ${atomEntries}
</feed>`;

  return atom;
}
