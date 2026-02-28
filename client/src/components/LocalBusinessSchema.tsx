import { Helmet } from "react-helmet-async";

export default function LocalBusinessSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "東舞鶴F.C",
    description: "京都府舞鶴市のスポーツ少年団。U7からU12までの子どもたちがサッカーを通じて成長できる環境を提供しています。",
    url: "https://www.higashimaizurufc.com",
    image: "https://www.higashimaizurufc.com/logo.png",
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: "京都府",
      addressLocality: "舞鶴市",
    },
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
