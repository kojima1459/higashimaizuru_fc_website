import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  keywords?: string;
}

export default function SEOHead({
  title = "東舞鶴FC | 舞鶴市・高浜・小浜の小学生サッカークラブ",
  description = "京都府舞鶴市の小学生サッカークラブ「東舞鶴フットボールクラブ」公式サイト。舞鶴市・南舞鶴・高浜・小浜エリアから通える少年サッカーチームです。初心者歓迎・体験無料。",
  image = "/logo.jpeg",
  url,
  type = "website",
  keywords = "舞鶴市 サッカー,舞鶴 サッカー 小学生,東舞鶴FC,東舞鶴F.C,高浜 サッカー,小浜 サッカー,南舞鶴 サッカー,舞鶴南 サッカー,舞鶴 サッカークラブ,少年サッカー,ジュニアサッカー,サッカー 小学生,スポーツ少年団,京都 サッカー 小学生",
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

    // Twitter Cardタグを設定
    updateMetaTagName("twitter:card", "summary_large_image");
    updateMetaTagName("twitter:title", title);
    updateMetaTagName("twitter:description", description);
    updateMetaTagName("twitter:image", absoluteImageUrl);

    // 通常のメタタグも設定
    updateMetaTagName("description", description);
    updateMetaTagName("keywords", keywords);
  }, [title, description, image, url, type, keywords]);

  return null;
}
