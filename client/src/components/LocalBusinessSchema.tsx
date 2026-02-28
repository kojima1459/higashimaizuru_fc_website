import { Helmet } from "react-helmet-async";

export default function LocalBusinessSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsOrganization"],
    "@id": "https://www.higashimaizurufc.com",
    name: "東舞鶴F.C",
    alternateName: ["東舞鶴フットボールクラブ", "東舞鶴FC", "Higashi Maizuru FC"],
    description: "舞鶴市、高浜、南舞鶴、小浜市対応のサッカー少年団。U7からU12までの子どもたちがサッカーを通じて成長できる環境を提供しています。体験練習・入団説明会随時開催中。",
    url: "https://www.higashimaizurufc.com",
    image: "https://www.higashimaizurufc.com/logo.jpeg",
    logo: "https://www.higashimaizurufc.com/logo.jpeg",
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: "京都府",
      addressLocality: "舞鶴市",
      postalCode: "625-0000",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 35.4858,
      longitude: 135.1833,
    },
    areaServed: [
      { "@type": "City", name: "舞鶴市", sameAs: "https://ja.wikipedia.org/wiki/舞鶴市" },
      { "@type": "City", name: "高浜町" },
      { "@type": "City", name: "小浜市" },
      { "@type": "AdministrativeArea", name: "南舞鶴" },
      { "@type": "AdministrativeArea", name: "東舞鶴" },
      { "@type": "AdministrativeArea", name: "西舞鶴" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "higashimaidurufc@gmail.com",
      availableLanguage: "Japanese",
    },
    sport: "サッカー",
    memberOf: {
      "@type": "SportsOrganization",
      name: "京都府サッカー協会",
    },
    keywords: "舞鶴市 サッカー,高浜 サッカー,南舞鶴 サッカー,小浜 サッカー,少年サッカー,スポーツ少年団",
    sameAs: [
      "https://twitter.com/higashimaizurufc",
      "https://www.facebook.com/higashimaizurufc",
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
}
