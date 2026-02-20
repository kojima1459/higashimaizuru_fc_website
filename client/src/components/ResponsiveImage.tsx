import { ImgHTMLAttributes } from 'react';

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /**
   * WebP画像のURL
   */
  webpSrc: string;
  
  /**
   * フォールバック用の元画像URL（JPEG/PNG）
   */
  fallbackSrc: string;
  
  /**
   * 画像の説明（alt属性）
   */
  alt: string;
  
  /**
   * レスポンシブ画像のサイズ設定（オプション）
   * 例: { mobile: 320, tablet: 768, desktop: 1200 }
   */
  sizes?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  
  /**
   * 遅延読み込み設定（デフォルト: "lazy"）
   */
  loading?: 'lazy' | 'eager';
}

/**
 * WebP形式とフォールバック画像に対応したレスポンシブ画像コンポーネント
 * 
 * - WebP対応ブラウザではWebP画像を表示
 * - 非対応ブラウザでは元画像（JPEG/PNG）を表示
 * - srcset属性でレスポンシブ対応
 * - 遅延読み込み（lazy loading）に対応
 */
export function ResponsiveImage({
  webpSrc,
  fallbackSrc,
  alt,
  sizes,
  loading = 'lazy',
  className,
  ...props
}: ResponsiveImageProps) {
  // srcset文字列を生成
  const generateSrcSet = (baseSrc: string) => {
    if (!sizes) return undefined;
    
    const srcSetParts: string[] = [];
    if (sizes.mobile) srcSetParts.push(`${baseSrc} ${sizes.mobile}w`);
    if (sizes.tablet) srcSetParts.push(`${baseSrc} ${sizes.tablet}w`);
    if (sizes.desktop) srcSetParts.push(`${baseSrc} ${sizes.desktop}w`);
    
    return srcSetParts.length > 0 ? srcSetParts.join(', ') : undefined;
  };

  // sizes属性を生成
  const sizesAttr = sizes
    ? `(max-width: ${sizes.mobile || 320}px) ${sizes.mobile || 320}px, ` +
      `(max-width: ${sizes.tablet || 768}px) ${sizes.tablet || 768}px, ` +
      `${sizes.desktop || 1200}px`
    : undefined;

  return (
    <picture>
      {/* WebP画像（対応ブラウザ用） */}
      <source
        type="image/webp"
        srcSet={generateSrcSet(webpSrc) || webpSrc}
        sizes={sizesAttr}
      />
      
      {/* フォールバック画像（非対応ブラウザ用） */}
      <source
        type={fallbackSrc.endsWith('.png') ? 'image/png' : 'image/jpeg'}
        srcSet={generateSrcSet(fallbackSrc) || fallbackSrc}
        sizes={sizesAttr}
      />
      
      {/* img要素（最終的なフォールバック） */}
      <img
        src={fallbackSrc}
        alt={alt}
        loading={loading}
        className={className}
        {...props}
      />
    </picture>
  );
}
