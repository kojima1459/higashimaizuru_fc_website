import { Helmet } from "react-helmet-async";

interface StructuredDataProps {
  data: object;
}

/**
 * 構造化データ（JSON-LD）をページに追加するコンポーネント
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}

/**
 * 組織情報の構造化データ
 */
export function OrganizationStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "name": "東舞鶴フットボールクラブ",
    "alternateName": ["東舞鶴F.C", "東舞鶴FC", "Higashi Maizuru FC"],
    "url": "https://www.higashimaizurufc.com",
    "logo": "https://www.higashimaizurufc.com/logo.jpeg",
    "description": "舞鶴市、高浜、南舞鶴、小浜市対応のサッカー少年団。U7からU12までの子どもたちがサッカーを通じて成長できる環境を提供。体験練習・入団説明会開催中。",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "朝来中545-1",
      "addressLocality": "舞鶴市",
      "addressRegion": "京都府",
      "postalCode": "625-0005",
      "addressCountry": "JP"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "35.4756",
      "longitude": "135.3868"
    },
    "areaServed": [
      { "@type": "City", "name": "舞鶴市" },
      { "@type": "City", "name": "高浜町" },
      { "@type": "City", "name": "小浜市" },
      { "@type": "AdministrativeArea", "name": "南舞鶴" },
      { "@type": "AdministrativeArea", "name": "東舞鶴" },
      { "@type": "AdministrativeArea", "name": "西舞鶴" }
    ],
    "sameAs": [
      "https://www.instagram.com/higashimaizurufc"
    ],
    "sport": "サッカー"
  };

  return <StructuredData data={data} />;
}

/**
 * パンくずリストの構造化データ
 */
export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return <StructuredData data={data} />;
}

/**
 * スポーツイベントの構造化データ
 */
export function SportsEventStructuredData({
  name,
  startDate,
  endDate,
  location,
  description,
  homeTeam,
  awayTeam,
  score
}: {
  name: string;
  startDate: string;
  endDate?: string;
  location: string;
  description?: string;
  homeTeam?: string;
  awayTeam?: string;
  score?: { home: number; away: number };
}) {
  const data: any = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": name,
    "startDate": startDate,
    "location": {
      "@type": "Place",
      "name": location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "舞鶴市",
        "addressRegion": "京都府",
        "addressCountry": "JP"
      }
    },
    "organizer": {
      "@type": "SportsOrganization",
      "name": "東舞鶴フットボールクラブ",
      "url": "https://www.higashimaizurufc.com"
    }
  };

  if (endDate) {
    data.endDate = endDate;
  }

  if (description) {
    data.description = description;
  }

  if (homeTeam && awayTeam) {
    data.homeTeam = {
      "@type": "SportsTeam",
      "name": homeTeam
    };
    data.awayTeam = {
      "@type": "SportsTeam",
      "name": awayTeam
    };
  }

  if (score) {
    data.competitor = [
      {
        "@type": "SportsTeam",
        "name": homeTeam,
        "score": score.home.toString()
      },
      {
        "@type": "SportsTeam",
        "name": awayTeam,
        "score": score.away.toString()
      }
    ];
  }

  return <StructuredData data={data} />;
}

/**
 * FAQページの構造化データ
 */
export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return <StructuredData data={data} />;
}
