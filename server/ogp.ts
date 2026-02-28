// OGP画像生成ユーティリティ

export interface OGPGenerationParams {
  title: string;
  description: string;
  pageType: "about" | "contact" | "news" | "gallery" | "schedule" | "results";
  imageUrl?: string;
}

/**
 * OGP画像を生成するエンドポイント
 * Gemini APIを使用して、テキストベースのOGP画像を生成
 */
export async function generateOGPImage(params: OGPGenerationParams): Promise<string> {
  const { title, description, pageType } = params;

  // ページタイプに応じたカラースキーム
  const colorSchemes: Record<string, { bg: string; accent: string; text: string }> = {
    about: { bg: "#1a1a2e", accent: "#fbbf24", text: "#ffffff" },
    contact: { bg: "#0f172a", accent: "#ec4899", text: "#ffffff" },
    news: { bg: "#1e3a8a", accent: "#60a5fa", text: "#ffffff" },
    gallery: { bg: "#7c2d12", accent: "#fb923c", text: "#ffffff" },
    schedule: { bg: "#1e40af", accent: "#3b82f6", text: "#ffffff" },
    results: { bg: "#1f2937", accent: "#10b981", text: "#ffffff" },
  };

  const colors = colorSchemes[pageType] || colorSchemes.about;

  // SVG形式のOGP画像を生成
  const svgContent = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:0.1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#grad)"/>
      
      <!-- Accent bar -->
      <rect width="1200" height="8" fill="${colors.accent}"/>
      
      <!-- Logo/Brand -->
      <text x="60" y="80" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${colors.accent}">
        東舞鶴F.C
      </text>
      
      <!-- Title -->
      <text x="60" y="200" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="${colors.text}" text-anchor="start">
        ${title.substring(0, 30)}
      </text>
      ${title.length > 30 ? `<text x="60" y="270" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="${colors.text}" text-anchor="start">${title.substring(30, 60)}</text>` : ""}
      
      <!-- Description -->
      <text x="60" y="380" font-family="Arial, sans-serif" font-size="24" fill="${colors.text}" opacity="0.9" text-anchor="start">
        ${description.substring(0, 50)}
      </text>
      ${description.length > 50 ? `<text x="60" y="420" font-family="Arial, sans-serif" font-size="24" fill="${colors.text}" opacity="0.9" text-anchor="start">${description.substring(50, 100)}</text>` : ""}
      
      <!-- Footer -->
      <text x="60" y="580" font-family="Arial, sans-serif" font-size="18" fill="${colors.text}" opacity="0.7">
        www.higashimaizurufc.com
      </text>
    </svg>
  `;

  return svgContent;
}

/**
 * OGP画像をPNG形式に変換
 * （実装時はSharp等のライブラリを使用）
 */
export async function convertSVGToPNG(svgContent: string): Promise<Buffer> {
  // 注：実装時にはSharpライブラリを使用してSVGをPNGに変換
  // ここではプレースホルダーとして実装
  return Buffer.from(svgContent);
}
