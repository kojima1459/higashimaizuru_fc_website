import SEOHead from "@/components/SEOHead";
import AnimatedTitle from "@/components/AnimatedTitle";
import { FAQStructuredData } from "@/components/StructuredData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "入団の条件はありますか？",
    answer: "東舞鶴フットボールクラブでは、サッカーが好きで、チームワークを大切にできるお子様であれば、経験の有無に関わらず入団していただけます。小学1年生から6年生までが対象です。"
  },
  {
    question: "練習は週に何回ありますか？",
    answer: "通常、週2回の練習を行っています。平日の夕方と週末に練習を実施しており、学年やレベルに応じて練習時間が異なります。詳しい練習スケジュールはお問い合わせください。"
  },
  {
    question: "入団費用はどのくらいかかりますか？",
    answer: "入団時には入会金と年会費が必要です。また、月会費として練習費用をいただいております。詳細な金額については、お問い合わせフォームからご連絡いただければ、個別にご案内いたします。"
  },
  {
    question: "保護者の当番はありますか？",
    answer: "試合や遠征時には保護者の方にサポートをお願いすることがありますが、負担が大きくならないよう配慮しています。保護者同士で協力し合いながら、子どもたちの活動を支えています。"
  },
  {
    question: "体験練習は可能ですか？",
    answer: "はい、体験練習は随時受け付けています。事前にお問い合わせフォームまたはお電話でご連絡いただければ、体験練習の日程を調整いたします。運動ができる服装とシューズをご持参ください。"
  },
  {
    question: "試合や大会への参加はありますか？",
    answer: "年間を通じて、地域の大会やリーグ戦に参加しています。また、他のクラブチームとの練習試合も定期的に行っており、実戦経験を積む機会を多く設けています。"
  },
  {
    question: "雨天時の練習はどうなりますか？",
    answer: "雨天時は原則として練習を中止いたします。中止の場合は、当日の午前中までに保護者の方へ連絡網やメールでお知らせします。天候が不安定な場合は、事前にご確認ください。"
  },
  {
    question: "送迎はどうすればよいですか？",
    answer: "練習場所までの送迎は保護者の方にお願いしています。遠方の方や送迎が難しい場合は、保護者同士で相乗りをお願いすることもあります。詳しくはご相談ください。"
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="よくある質問 - 東舞鶴F.C"
        description="東舞鶴フットボールクラブに関するよくある質問をまとめました。入団条件、練習頻度、費用、体験練習などについてご確認いただけます。"
        image="/logo.jpeg"
        type="website"
      />
      
      {/* FAQ構造化データ */}
      <FAQStructuredData faqs={faqs} />
      
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <AnimatedTitle>よくある質問</AnimatedTitle>
          <p className="text-center text-muted-foreground mb-12">
            東舞鶴フットボールクラブに関するよくある質問をまとめました
          </p>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>
                入団や練習に関する疑問にお答えします
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              その他のご質問がございましたら、お気軽にお問い合わせください。
            </p>
            <a href="/contact" className="text-primary hover:underline">
              お問い合わせフォームはこちら →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
