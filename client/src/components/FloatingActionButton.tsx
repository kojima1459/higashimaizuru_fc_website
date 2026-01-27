import { useState } from "react";
import { MessageCircle, Mail, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10">
      {/* アクションメニュー */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2 animate-fade-in-up">
          {/* お問い合わせ */}
          <Link href="/contact">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full bg-background shadow-lg hover:scale-110 transition-transform"
              title="お問い合わせ"
            >
              <Mail className="h-5 w-5" />
            </Button>
          </Link>

          {/* 電話 */}
          <a href="tel:090-9624-9395">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full bg-background shadow-lg hover:scale-110 transition-transform"
              title="電話する"
            >
              <Phone className="h-5 w-5" />
            </Button>
          </a>

          {/* LINE */}
          <a
            href="https://line.me/ti/p/sanky13"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full bg-background shadow-lg hover:scale-110 transition-transform"
              title="LINEで連絡"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </a>
        </div>
      )}

      {/* メインボタン */}
      <Button
        onClick={toggleMenu}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        size="icon"
        className={`h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-all bg-orange-500 hover:bg-orange-600 text-white ${
          isOpen ? "rotate-45" : ""
        }`}
        title={isOpen ? "閉じる" : "お問い合わせメニュー"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className={`h-6 w-6 ${isHovering ? "icon-rotate" : ""}`} />
        )}
      </Button>
    </div>
  );
}
