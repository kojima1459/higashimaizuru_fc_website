import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import { storagePut } from "@/lib/storage";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminPhotos() {
  useAdminAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    category: "練習風景" as "練習風景" | "試合" | "イベント" | "その他",
    year: new Date().getFullYear(),
    eventType: "練習" as "練習" | "試合" | "大会" | "交流試合" | "イベント" | "その他",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number} | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("全て");
  const [yearFilter, setYearFilter] = useState<string>("全て");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("全て");

  const { data: photos, refetch } = trpc.photos.list.useQuery({ 
    category: categoryFilter === "全て" ? undefined : categoryFilter,
    year: yearFilter === "全て" ? undefined : parseInt(yearFilter),
    eventType: eventTypeFilter === "全て" ? undefined : eventTypeFilter
  });
  
  const uploadMutation = trpc.photos.upload.useMutation({
    onSuccess: () => {
      toast.success("写真をアップロードしました");
      refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
      setIsUploading(false);
    },
  });

  const deleteMutation = trpc.photos.delete.useMutation({
    onSuccess: () => {
      toast.success("写真を削除しました");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      caption: "",
      category: "練習風景",
      year: new Date().getFullYear(),
      eventType: "練習",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsUploading(false);
  };

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // ファイルサイズチェック（10MB以下）
    const invalidFiles = files.filter(f => f.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length}件のファイルが10MBを超えています`);
      return;
    }

    // ファイルタイプチェック
    const invalidTypes = files.filter(f => !f.type.startsWith("image/"));
    if (invalidTypes.length > 0) {
      toast.error(`${invalidTypes.length}件のファイルが画像ではありません`);
      return;
    }

    setSelectedFiles(files);
    toast.success(`${files.length}件のファイルを選択しました`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ファイルサイズチェック（10MB以下）
      if (file.size > 10 * 1024 * 1024) {
        toast.error("ファイルサイズは10MB以下にしてください");
        return;
      }

      // ファイルタイプチェック
      if (!file.type.startsWith("image/")) {
        toast.error("画像ファイルを選択してください");
        return;
      }

      setSelectedFile(file);
      
      // プレビュー生成
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("写真を選択してください");
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: selectedFiles.length });

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress({ current: i + 1, total: selectedFiles.length });

        // ファイルをS3にアップロード
        const fileExtension = file.name.split('.').pop();
        const randomSuffix = Math.random().toString(36).substring(2, 15);
        const fileKey = `photos/${Date.now()}-${randomSuffix}.${fileExtension}`;
        
        const { url, key } = await storagePut(fileKey, file, file.type);

        // データベースに保存
        await uploadMutation.mutateAsync({
          title: formData.title || file.name.replace(/\.[^/.]+$/, ""),
          caption: formData.caption || undefined,
          imageUrl: url,
          imageKey: key,
          category: formData.category,
          year: formData.year,
          eventType: formData.eventType,
        });
      }

      toast.success(`${selectedFiles.length}件の写真をアップロードしました`);
      setSelectedFiles([]);
      setUploadProgress(null);
      refetch();
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.error("一括アップロードに失敗しました");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("写真を選択してください");
      return;
    }

    setIsUploading(true);

    try {
      // ファイルをS3にアップロード
      const fileExtension = selectedFile.name.split('.').pop();
      const randomSuffix = Math.random().toString(36).substring(2, 15);
      const fileKey = `photos/${Date.now()}-${randomSuffix}.${fileExtension}`;
      
      const { url, key } = await storagePut(fileKey, selectedFile, selectedFile.type);

      // データベースに保存
      await uploadMutation.mutateAsync({
        title: formData.title || undefined,
        caption: formData.caption || undefined,
        imageUrl: url,
        imageKey: key,
        category: formData.category,
        year: formData.year,
        eventType: formData.eventType,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("アップロードに失敗しました");
      setIsUploading(false);
    }
  };

  return (
    <div className="container py-8">
      <SEOHead
        title="写真管理 - 東舞鶴F.C"
        description="東舞鶴F.Cの写真ギャラリー管理"
      />
      <h1 className="text-3xl font-bold mb-8">写真ギャラリー管理</h1>

      {/* 一括アップロード */}
      <Card className="mb-8 border-2 border-amber-400/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-amber-500" />
            一括アップロード（複数ファイル）
          </CardTitle>
          <CardDescription>複数の写真を一度にアップロードできます</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-files">写真ファイル（複数選択可）</Label>
              <Input
                id="bulk-files"
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleFilesChange}
                disabled={isUploading}
              />
              <p className="text-sm text-muted-foreground mt-1">
                ファイルサイズ: 各10MB以下 • 複数選択可能
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">
                  選択中: {selectedFiles.length}件のファイル
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedFiles.map((file, index) => (
                    <p key={index} className="text-xs text-muted-foreground truncate">
                      {index + 1}. {file.name}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>カテゴリー</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="練習風景">練習風景</SelectItem>
                    <SelectItem value="試合">試合</SelectItem>
                    <SelectItem value="イベント">イベント</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>年度</Label>
                <Select
                  value={formData.year.toString()}
                  onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025年</SelectItem>
                    <SelectItem value="2024">2024年</SelectItem>
                    <SelectItem value="2023">2023年</SelectItem>
                    <SelectItem value="2022">2022年</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>イベント種別</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value) => setFormData({ ...formData, eventType: value as any })}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="練習">練習</SelectItem>
                    <SelectItem value="試合">試合</SelectItem>
                    <SelectItem value="大会">大会</SelectItem>
                    <SelectItem value="交流試合">交流試合</SelectItem>
                    <SelectItem value="イベント">イベント</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {uploadProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>アップロード中...</span>
                  <span>{uploadProgress.current} / {uploadProgress.total}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleBulkUpload} 
                disabled={isUploading || selectedFiles.length === 0}
                className="bg-amber-500 hover:bg-amber-600"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? `アップロード中 (${uploadProgress?.current}/${uploadProgress?.total})` : `${selectedFiles.length}件をアップロード`}
              </Button>
              {selectedFiles.length > 0 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSelectedFiles([])} 
                  disabled={isUploading}
                >
                  クリア
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アップロードフォーム */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>写真をアップロード</CardTitle>
          <CardDescription>練習風景や試合の写真を追加できます</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="file">写真ファイル *</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                ファイルサイズ: 10MB以下
              </p>
            </div>

            {previewUrl && (
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium mb-2">プレビュー:</p>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-full h-auto max-h-64 rounded-lg object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">カテゴリー *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="練習風景">練習風景</SelectItem>
                    <SelectItem value="試合">試合</SelectItem>
                    <SelectItem value="イベント">イベント</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="year">年度 *</Label>
                <Select
                  value={formData.year.toString()}
                  onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025年</SelectItem>
                    <SelectItem value="2024">2024年</SelectItem>
                    <SelectItem value="2023">2023年</SelectItem>
                    <SelectItem value="2022">2022年</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="eventType">イベント種別 *</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value) => setFormData({ ...formData, eventType: value as any })}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="練習">練習</SelectItem>
                    <SelectItem value="試合">試合</SelectItem>
                    <SelectItem value="大会">大会</SelectItem>
                    <SelectItem value="交流試合">交流試合</SelectItem>
                    <SelectItem value="イベント">イベント</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">タイトル（任意）</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="例: 2024年春季大会"
                disabled={isUploading}
              />
            </div>

            <div>
              <Label htmlFor="caption">キャプション（任意）</Label>
              <Textarea
                id="caption"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="写真の説明を入力してください"
                rows={3}
                disabled={isUploading}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isUploading || !selectedFile}>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "アップロード中..." : "アップロード"}
              </Button>
              {(selectedFile || formData.title || formData.caption) && (
                <Button type="button" variant="outline" onClick={resetForm} disabled={isUploading}>
                  キャンセル
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* フィルター */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <Label>カテゴリー</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
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

        <div>
          <Label>年度</Label>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全て">全て</SelectItem>
              <SelectItem value="2025">2025年</SelectItem>
              <SelectItem value="2024">2024年</SelectItem>
              <SelectItem value="2023">2023年</SelectItem>
              <SelectItem value="2022">2022年</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>イベント種別</Label>
          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全て">全て</SelectItem>
              <SelectItem value="練習">練習</SelectItem>
              <SelectItem value="試合">試合</SelectItem>
              <SelectItem value="大会">大会</SelectItem>
              <SelectItem value="交流試合">交流試合</SelectItem>
              <SelectItem value="イベント">イベント</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 写真一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos?.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img 
                src={photo.imageUrl} 
                alt={photo.title || "写真"} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-base">
                    {photo.title || "無題"}
                  </CardTitle>
                  <CardDescription>
                    {photo.category} • {photo.year}年 • {photo.eventType}
                  </CardDescription>
                  <CardDescription className="text-xs mt-1">
                    {new Date(photo.createdAt).toLocaleDateString("ja-JP")}
                  </CardDescription>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm("この写真を削除しますか？")) {
                      deleteMutation.mutate({ id: photo.id });
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            {photo.caption && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{photo.caption}</p>
              </CardContent>
            )}
          </Card>
        ))}
        {!photos || photos.length === 0 && (
          <div className="col-span-full text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">写真がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
