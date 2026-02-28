import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  keywords?: string;
}

// 地域キーワードを含むデフォルトキーワード
const DEFAULT_KEYWORDS =
  "東舞鶴F.C,東舞鶴FC,舞鶴,舞鶴市,サッカー,スポーツ少年団,京都,少年サッカー,ジュニアサッカー,サッカークラブ,サッカーチーム," +
  "高浜,高浜町,南舞鶴,小浜,小浜市,東舞鶴,西舞鶴,サッカー小学生,小学生サッカー,U12,U10,U8,U7," +
  "舞鶴市 サッカー,高浜 サッカー,南舞鶴 サッカー,小浜 サッカー,体験練習,入団";

export default function SEOHead({
  title = "東舞鶴F.C - 舞鶴市のサッカー少年団 | 高浜・南舞鶴・小浜対応",
  description = "舞鶴市のサッカー少年団『東舞鶴F.C』。U7からU12までの少年サッカー。高浜、南舞鶴、小浜、小浜市対応。体験練習・入団説明会開催中。",
  image = "/logo.jpeg",
  url,
  type = "website",
  keywords = DEFAULT_KEYWORDS,
}: SEOHeadProps) {
  useEffect(() => {
    // ページタイトルを設定
    document.title = title;

    // 現在のURLを取得
    const currentUrl = url || window.location.href;

    // 画像URLを絶対URLに変換
    const absoluteImageUrl = image.startsWith("http")
      ? image
      : `${window.location.origin}${image}`;

    // メタタグを更新する関数
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const updateMetaTagName = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // OGPタグを設定
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:image", absoluteImageUrl);
    updateMetaTag("og:url", currentUrl);
    updateMetaTag("og:type", type);
    updateMetaTag("og:site_name", "東舞鶴F.C");
    updateMetaTag("og:locale", "ja_JP");

    // Twitter Cardタグを設定
    updateMetaTagName("twitter:card", "summary_large_image");
    updateMetaTagName("twitter:title", title);
    updateMetaTagName("twitter:description", description);
    updateMetaTagName("twitter:image", absoluteImageUrl);
    updateMetaTagName("twitter:site", "@higashimaizurufc");

    // 通常のメタタグも設定
    updateMetaTagName("description", description);
    updateMetaTagName("keywords", keywords);

    // Canonical URLを更新
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl);
  }, [title, description, image, url, type, keywords]);

  return null;
}
