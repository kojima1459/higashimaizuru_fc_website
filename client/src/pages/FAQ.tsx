import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, Swords, HelpCircle, Award, Calendar } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AnimatedTitle from "@/components/AnimatedTitle";
import { FAQStructuredData } from "@/components/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: { question: string; answer: string }[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "入団・体験について",
    icon: <UserPlus className="h-5 w-5" />,
    color: "blue",
    items: [
      {
        question: "サッカー初心者でも大丈夫ですか？",
        answer:
          "はい、もちろん大丈夫です！東舞鶴FCでは初心者のお子様も大歓迎しています。ボールの蹴り方や止め方など基礎から丁寧に指導しますので、サッカーが初めてでも安心してご参加ください。実際に入団後にメキメキ上達するお子さんもたくさんいます。",
      },
      {
        question: "何歳から入れますか？対象年齢を教えてください。",
        answer:
          "年長（U6）から小学6年生（U12）までが対象です。学年ごとにカテゴリー（U6〜U8、U9、U10、U11、U12）を分けて活動しているので、年齢に合った練習を受けることができます。",
      },
      {
        question: "体験練習はできますか？費用はかかりますか？",
        answer:
          "体験練習は随時受け付けており、無料です。見学だけでもOKです。お問い合わせフォーム、お電話（090-9624-9395）、またはLINEでお気軽にご連絡ください。運動できる服装・トレーニングシューズ（スパイク不可）・水筒・タオルをお持ちいただければ、すぐに参加できます。",
      },
      {
        question: "年度の途中からでも入団できますか？",
        answer:
          "はい、年中いつでも入団可能です。学年の途中や学期の途中からでも問題ありません。お子様のペースに合わせて無理なくチームに馴染めるよう、コーチがサポートします。",
      },
      {
        question: "入団の手続きはどうすればよいですか？",
        answer:
          "入団までの流れは3ステップです。まず体験練習にご参加いただき、お子様が楽しめるか確認していただきます。入団をご希望の場合は入団申込書をご提出いただき、手続き完了後すぐに活動に参加できます。まずはお気軽に体験にお越しください。",
      },
      {
        question: "女の子でも入れますか？",
        answer:
          "もちろん大歓迎です！性別に関係なく、サッカーが好きなお子様はどなたでもご参加いただけます。",
      },
    ],
  },
  {
    title: "練習・活動について",
    icon: <Calendar className="h-5 w-5" />,
    color: "green",
    items: [
      {
        question: "練習はいつ・どこでやっていますか？",
        answer:
          "毎週土曜・日曜の9時〜12時に、舞鶴市立朝来小学校のグラウンドで練習しています。祝日や長期休暇中はスケジュールが変わることがありますので、詳しくはスケジュールページをご確認ください。",
      },
      {
        question: "練習は週に何回ありますか？平日もありますか？",
        answer:
          "通常は週末（土曜・日曜）の練習が中心です。試合や大会の予定により変更になる場合があります。平日の練習は現在行っておりません。",
      },
      {
        question: "雨の日の練習はどうなりますか？",
        answer:
          "雨天時は原則として練習を中止します。中止の場合は当日の午前中までに保護者の方へ連絡します。天候が不安定な場合は、事前にお問い合わせください。",
      },
      {
        question: "試合や大会にはどのくらい参加しますか？",
        answer:
          "年間を通じて、地域のリーグ戦や各種大会に参加しています。また、他のクラブチームとの練習試合も定期的に行っており、実戦経験を積む機会を多く設けています。試合結果はサイトの試合結果ページで公開しています。",
      },
      {
        question: "練習時の持ち物は何が必要ですか？",
        answer:
          "運動できる服装、トレーニングシューズ（スパイク不可）、水筒、タオルが必要です。ボールはクラブで用意しています。入団後はクラブのユニフォームを着用して練習・試合に参加します。",
      },
    ],
  },
  {
    title: "費用について",
    icon: <Award className="h-5 w-5" />,
    color: "amber",
    items: [
      {
        question: "月々の費用はどのくらいですか？",
        answer:
          "月額クラブ費用は学年によって異なります。1〜2年生は月額1,500円、3〜4年生は月額2,000円、5年生は月額2,500円、6年生は月額3,500円です。地域の中でもリーズナブルな金額に設定しています。",
      },
      {
        question: "月額以外に必要な費用はありますか？",
        answer:
          "年会費（1年生1,000円〜6年生6,000円）がかかります。年会費は備品・登録・保険等に充当されます。その他、入団時にユニフォーム代、年1回のスポーツ保険料、大会ごとの参加費が必要です。詳しくはチーム情報ページをご確認ください。",
      },
      {
        question: "兄弟割引はありますか？",
        answer:
          "兄弟でご入団される場合の費用については、お問い合わせフォームまたはお電話でご相談ください。",
      },
    ],
  },
  {
    title: "練習試合について（対外チーム向け）",
    icon: <Swords className="h-5 w-5" />,
    color: "emerald",
    items: [
      {
        question: "練習試合の申し込み方法を教えてください。",
        answer:
          "お問い合わせページの「練習試合」タブから申し込みいただけます。チーム名、カテゴリー（U7〜U12）、希望日時、希望場所を入力して送信してください。通常2〜3日以内にお返事いたします。お急ぎの場合はお電話（090-9624-9395）でも受け付けています。",
      },
      {
        question: "対応しているカテゴリーは何ですか？",
        answer:
          "U7 / U8 / U9 / U10 / U11 / U12 の各カテゴリーで対応可能です。複数カテゴリーでの同時開催もご相談ください。",
      },
      {
        question: "練習試合の会場はどこですか？",
        answer:
          "ホームグラウンドは舞鶴市立朝来小学校（土グラウンド）です。そちらの会場での開催も対応可能ですので、申し込み時にご希望をお伝えください。",
      },
      {
        question: "練習試合の対応可能な日時は？",
        answer:
          "主に土曜・日曜に対応しています。具体的な日時はスケジュールとの調整になりますので、希望日を含めてお問い合わせください。",
      },
    ],
  },
  {
    title: "保護者の方へ",
    icon: <HelpCircle className="h-5 w-5" />,
    color: "purple",
    items: [
      {
        question: "保護者の当番や係はありますか？",
        answer:
          "試合や遠征時に保護者の方にサポートをお願いすることがありますが、負担が大きくならないよう配慮しています。保護者同士で協力し合いながら、無理のない範囲で子どもたちの活動を支えています。",
      },
      {
        question: "送迎は必要ですか？",
        answer:
          "練習場所（舞鶴市立朝来小学校）までの送迎は保護者の方にお願いしています。遠方の方や送迎が難しい場合は、保護者同士で相乗りをされているケースもあります。お気軽にご相談ください。",
      },
      {
        question: "練習の見学はできますか？",
        answer:
          "はい、いつでも見学歓迎です。事前にご連絡いただければ当日の練習内容などをお伝えできますが、連絡なしで直接お越しいただいても構いません。お子様と一緒に雰囲気を見に来てください。",
      },
      {
        question: "連絡手段は何を使っていますか？",
        answer:
          "練習の中止連絡やスケジュール変更などは、保護者の方へLINEやメールでお知らせしています。当サイトのスケジュールページでも最新の予定を確認できます。",
      },
    ],
  },
];

// 構造化データ用にフラットなFAQリストを生成
const allFaqs = faqCategories.flatMap((cat) => cat.items);

const colorMap: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/20",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    iconBg: "bg-green-100 dark:bg-green-900/30",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
  },
};

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="よくある質問 - 東舞鶴F.C"
        description="東舞鶴フットボールクラブに関するよくある質問をまとめました。入団・体験、練習、費用、練習試合の申し込み方法など、気になる疑問にお答えします。"
        image="/logo.jpeg"
        type="website"
      />

      {/* FAQ構造化データ */}
      <FAQStructuredData faqs={allFaqs} />

      {/* プレミアムページヘッダー */}
      <div className="relative w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black py-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(251, 191, 36, 0.1) 35px, rgba(251, 191, 36, 0.1) 70px)",
          }}
        />
        <div className="relative z-10 container">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            <AnimatedTitle text="よくある質問" staggerDelay={60} />
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full" />
          <p className="text-lg text-amber-300 mt-4">
            入団・体験、費用、練習試合など、よくある疑問にお答えします
          </p>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-3xl mx-auto">
          {/* カテゴリ目次 */}
          <Card className="mb-10 border-0 shadow-lg">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold text-muted-foreground mb-4">カテゴリから探す</p>
              <div className="flex flex-wrap gap-2">
                {faqCategories.map((cat) => {
                  const colors = colorMap[cat.color];
                  return (
                    <a
                      key={cat.title}
                      href={`#${cat.title}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${colors.bg} ${colors.text} hover:opacity-80`}
                    >
                      {cat.icon}
                      {cat.title}
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* FAQ カテゴリ別表示 */}
          {faqCategories.map((cat) => {
            const colors = colorMap[cat.color];
            return (
              <div key={cat.title} id={cat.title} className="mb-10 scroll-mt-24">
                <div className={`flex items-center gap-3 mb-4 pb-3 border-b-2 ${colors.border}`}>
                  <div className={`rounded-full p-2 ${colors.iconBg}`}>
                    <span className={colors.text}>{cat.icon}</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{cat.title}</h2>
                  <span className="text-sm text-muted-foreground ml-auto">{cat.items.length}件</span>
                </div>
                <Card className="border-0 shadow-md">
                  <CardContent className="pt-2 pb-2">
                    <Accordion type="single" collapsible className="w-full">
                      {cat.items.map((faq, index) => (
                        <AccordionItem key={index} value={`${cat.title}-${index}`}>
                          <AccordionTrigger className="text-left text-[15px] leading-relaxed">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed text-[14px]">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            );
          })}

          {/* CTA セクション */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
              <CardContent className="pt-6 text-center">
                <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-2">入団・体験のお問い合わせ</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  体験練習は無料です。お気軽にどうぞ。
                </p>
                <Link href="/contact">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    体験に申し込む
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20">
              <CardContent className="pt-6 text-center">
                <Swords className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-2">練習試合のお申し込み</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  U7〜U12で対戦相手を募集中。
                </p>
                <Link href="/contact">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    練習試合を申し込む
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              こちらに載っていないご質問がございましたら、お気軽にお問い合わせください。
            </p>
            <Link href="/contact">
              <span className="text-primary hover:underline cursor-pointer">
                お問い合わせフォームはこちら →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
