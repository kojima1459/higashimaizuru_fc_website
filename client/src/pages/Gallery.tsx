import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Image as ImageIcon } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function Gallery() {
  const [categoryFilter, setCategoryFilter] = useState<string>("全て");
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  const { data: photos, isLoading } = trpc.photos.list.useQuery({ 
    category: categoryFilter === "全て" ? undefined : categoryFilter 
  });

  return (
    <div className="container py-12">
      <SEOHead
        title="写真ギャラリー - 東舞鶴F.C"
        description="東舞鶴F.Cの練習風景や試合の写真ギャラリー"
      />
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">写真ギャラリー</h1>
        <p className="text-muted-foreground">
          練習風景や試合の様子をご覧ください
        </p>
      </div>

      {/* カテゴリーフィルター */}
      <div className="mb-8 flex items-center gap-4">
        <span className="text-sm font-medium">カテゴリー:</span>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全て">全て</SelectItem>
            <SelectItem value="練習風景">練習風景</SelectItem>
            <SelectItem value="試合">試合</SelectItem>
            <SelectItem value="イベント">イベント</SelectItem>
            <SelectItem value="その他">その他</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 写真グリッド */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      ) : photos && photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-muted"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.imageUrl}
                alt={photo.title || "写真"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-4">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-semibold text-sm">{photo.title || "無題"}</p>
                  <p className="text-xs text-white/80">{photo.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">写真がありません</p>
        </div>
      )}

      {/* 写真拡大表示モーダル */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          <div
            className="max-w-6xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.title || "写真"}
              className="w-full h-full object-contain rounded-lg"
            />
            {(selectedPhoto.title || selectedPhoto.caption) && (
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                {selectedPhoto.title && (
                  <h3 className="text-xl font-bold mb-2">{selectedPhoto.title}</h3>
                )}
                {selectedPhoto.caption && (
                  <p className="text-sm text-white/80">{selectedPhoto.caption}</p>
                )}
                <p className="text-xs text-white/60 mt-2">
                  {selectedPhoto.category} • {new Date(selectedPhoto.createdAt).toLocaleDateString("ja-JP")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
