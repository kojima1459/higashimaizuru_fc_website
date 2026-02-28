import { Helmet } from "react-helmet-async";

export default function LocalBusinessSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.higashimaizurufc.com",
    name: "東舞鶴F.C",
    description: "舞鶴市、高浜、南舞鶴、小浜市対応のサッカー少年団。U7からU12までの子どもたちがサッカーを通じて成長できる環境を提供しています。",
    url: "https://www.higashimaizurufc.com",
    image: "https://www.higashimaizurufc.com/logo.png",
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: "京都府",
      addressLocality: "舞鶴市",
    },
    areaServed: [
      { "@type": "City", name: "舞鶴市" },
      { "@type": "City", name: "高浜市" },
      { "@type": "City", name: "小浜市" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "higashimaidurufc@gmail.com",
    },
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
