import { useState, useEffect } from 'react';
import { Share2, Facebook, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
  title?: string;
  description?: string;
  url?: string;
  className?: string;
}

export default function ShareButtons({
  title = '東舞鶴F.C ウェブサイト',
  description = 'スポーツ少年団の東舞鶴F.C公式ウェブサイト',
  url: initialUrl,
  className = '',
}: ShareButtonsProps) {
  const [url, setUrl] = useState<string>(initialUrl || '');

  useEffect(() => {
    if (!initialUrl && typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, [initialUrl]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  // X (Twitter) シェアリンク
  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;

  // Facebook シェアリンク
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  // LINE シェアリンク
  const lineShareUrl = `https://line.me/R/msg/text/?${encodedTitle}%0A${encodedDescription}%0A${encodedUrl}`;

  return (
    <div className={`flex gap-3 items-center ${className}`}>
      <span className="text-sm font-medium text-gray-600">シェア:</span>
      
      {/* X (Twitter) シェアボタン */}
      <Button
        variant="outline"
        size="sm"
        asChild
        className="hover:bg-black hover:text-white transition-colors"
      >
        <a
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Xでシェア"
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.627l-5.1-6.47-5.85 6.47H2.556l7.73-8.835L1.75 2.25h6.969l4.557 6.03L17.464 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X</span>
        </a>
      </Button>

      {/* Facebook シェアボタン */}
      <Button
        variant="outline"
        size="sm"
        asChild
        className="hover:bg-blue-600 hover:text-white transition-colors"
      >
        <a
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Facebookでシェア"
          className="flex items-center gap-2"
        >
          <Facebook className="w-4 h-4" />
          <span>Facebook</span>
        </a>
      </Button>

      {/* LINE シェアボタン */}
      <Button
        variant="outline"
        size="sm"
        asChild
        className="hover:bg-green-500 hover:text-white transition-colors"
      >
        <a
          href={lineShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="LINEでシェア"
          className="flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>LINE</span>
        </a>
      </Button>
    </div>
  );
}
