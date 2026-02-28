import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Loader2, Search, X, ChevronDown, ChevronUp, Calendar, SortAsc, SortDesc, Rss } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AnimatedTitle from "@/components/AnimatedTitle";
import { useState } from "react";

const mainCategories = ["全ての記事", "練習", "試合", "連絡事項", "その他"];
const subCategories = ["全て", "U7", "U8", "U9", "U10", "U11", "U12", "全体", "その他"];

export default function News() {
  const [selectedMainCategory, setSelectedMainCategory] = useState("全ての記事");
  const [selectedSubCategory, setSelectedSubCategory] = useState("全て");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const itemsPerPage = 10;
  
  const { data: newsList, isLoading } = trpc.news.list.useQuery({
    mainCategory: selectedMainCategory === "全ての記事" ? undefined : selectedMainCategory,
    subCategory: selectedSubCategory === "全て" ? undefined : selectedSubCategory,
  });

  // フィルタリングとソート
  const filteredNews = newsList?.filter((news) => {
    const matchesSearch = searchQuery === "" || 
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const newsDate = new Date(news.createdAt);
    const matchesStartDate = startDate === "" || newsDate >= new Date(startDate);
    const matchesEndDate = endDate === "" || newsDate <= new Date(endDate);
    
    return matchesSearch && matchesStartDate && matchesEndDate;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  }) || [];

  // ページネーション
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReset = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setSelectedMainCategory("全ての記事");
    setSelectedSubCategory("全て");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = 
    searchQuery !== "" || 
    startDate !== "" || 
    endDate !== "" || 
    selectedMainCategory !== "全ての記事" || 
    selectedSubCategory !== "全て";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="お知らせ - 東舞鶴フットボールクラブ"
        description="東舞鶴フットボールクラブの練習や試合の最新情報、連絡事項をお知らせします。"
        image="/logo.jpeg"
        type="website"
      />
      {/* プレミアムページヘッダー */}
      <div className="relative w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black py-16 overflow-hidden premium-section">
        <div className="absolute inset-0 opacity-30 geometric-pattern" />
        <div className="relative z-10 container">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg hero-title">
            <AnimatedTitle text="お知らせ" staggerDelay={60} />
          </h1>
          <div className="premium-divider w-32" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            <p className="text-lg text-amber-300">東舞鶴フットボールクラブの最新情報</p>
            <div className="flex gap-2">
              <a
                href="/api/rss"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 hover:border-amber-400/50 rounded-full text-amber-300 hover:text-amber-200 transition-all duration-300 text-sm font-medium"
              >
                <Rss className="w-4 h-4" />
                RSS
              </a>
              <a
                href="/api/atom"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 hover:border-amber-400/50 rounded-full text-amber-300 hover:text-amber-200 transition-all duration-300 text-sm font-medium"
              >
                <Rss className="w-4 h-4" />
                Atom
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {/* 検索・フィルターUI - モバイル折りたたみ対応 */}
        <Card className="mb-6">
          <CardHeader
            className="cursor-pointer md:cursor-default"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <CardTitle className="text-lg flex items-center justify-between">
              <span>検索・フィルター</span>
              <span className="md:hidden">
                {filtersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className={`${filtersOpen ? 'block' : 'hidden'} md:block`}>
            {/* 検索バー */}
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-2 block">
                キーワード検索
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="タイトルや内容で検索..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* 日付範囲フィルター */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  開始日
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  終了日
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* メインカテゴリフィルター */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-3 text-foreground">カテゴリ</h3>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {mainCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedMainCategory === category ? "default" : "outline"}
                    onClick={() => {
                      setSelectedMainCategory(category);
                      setCurrentPage(1);
                    }}
                    className={`text-xs md:text-sm px-2 md:px-4 py-2 min-h-10 md:min-h-12 ${selectedMainCategory === category ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black" : ""}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* サブカテゴリフィルター */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-3 text-foreground">学年</h3>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {subCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedSubCategory === category ? "default" : "outline"}
                    onClick={() => {
                      setSelectedSubCategory(category);
                      setCurrentPage(1);
                    }}
                    className={`text-xs md:text-sm px-2 md:px-4 py-2 min-h-10 md:min-h-12 ${selectedSubCategory === category ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black" : ""}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* ソート・リセットボタン */}
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                variant="outline"
                className="flex items-center justify-center gap-2 min-h-10 md:min-h-12 text-sm md:text-base w-full sm:w-auto"
              >
                {sortOrder === "desc" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                {sortOrder === "desc" ? "新着順" : "古い順"}
              </Button>
              {hasActiveFilters && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex items-center justify-center gap-2 min-h-10 md:min-h-12 text-sm md:text-base w-full sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  リセット
                </Button>
              )}
            </div>

            {/* アクティブフィルター表示 */}
            {hasActiveFilters && (
              <div className="mt-4 text-sm text-muted-foreground">
                {searchQuery && <span className="mr-4">検索: {searchQuery}</span>}
                {selectedMainCategory !== "全ての記事" && <span className="mr-4">カテゴリ: {selectedMainCategory}</span>}
                {selectedSubCategory !== "全て" && <span className="mr-4">学年: {selectedSubCategory}</span>}
                {startDate && <span className="mr-4">開始日: {new Date(startDate).toLocaleDateString("ja-JP")}</span>}
                {endDate && <span>終了日: {new Date(endDate).toLocaleDateString("ja-JP")}</span>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* セクションセパレーター */}
        <div className="section-separator" />

        {/* お知らせ一覧 */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : paginatedNews.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredNews.length}件のお知らせ（{currentPage}/{totalPages}ページ）
            </div>
            <div className="grid gap-6 premium-section">
              {paginatedNews.map((news) => (
                <Link key={news.id} href={`/news/${news.id}`}>
                  <Card className="cursor-pointer hover:border-primary transition-all hover:shadow-lg hover:shadow-amber-400/20 dark:hover:shadow-amber-400/10">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground">
                          {news.mainCategory}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                          {news.subCategory}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(news.createdAt).toLocaleDateString("ja-JP")}
                        </span>
                      </div>
                      <CardTitle>{news.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {news.content}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  前へ
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // 最初の2ページ、最後の2ページ、現在のページ周辺を表示
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black" : ""}
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  次へ
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {hasActiveFilters ? "検索条件に一致するお知らせが見つかりませんでした" : "お知らせはまだありません"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
