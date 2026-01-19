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
  title = "東舞鶴F.C ウェブサイト",
  description = "京都府舞鶴市を拠点とするサッカースポーツ少年団です。子どもたちの健全な育成とサッカーを通じた仲間づくりを大切にしています。",
  image = "/logo.png",
  url,
  type = "website",
  keywords = "東舞鶴F.C,東舞鶴FC,舞鶴,サッカー,スポーツ少年団,京都,少年サッカー,ジュニアサッカー,サッカークラブ,サッカーチーム",
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
