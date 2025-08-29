"use client";


import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Influencer, UGC & Podcast Campaigns | GrandeApp USA, LATAM & Beyond',
  description:
    'GrandeApp helps brands and agencies launch influencer campaigns, UGC creator collaborations, and podcast partnerships. Powered by AI, we scale your marketing across the USA, LATAM, and beyond—without the overhead.',
  keywords: [
    // Core pillars
    'influencer marketing',
    'ugc creators',
    'podcast partnerships',
    'creator economy',
    'brand deals',
    'ai marketing',
    'scale with creators',
    'creator campaigns USA',
    'creator campaigns LATAM',
    'GrandeApp platform',

    // Venezuela
    'creator campaigns venezuela',
    'marketing de influencers en venezuela',
    'influencers en venezuela',
    'ugc creadores en venezuela',
    'campañas con influencers en venezuela',
    'campañas con ugc creadores en venezuela',
    'podcast marketing venezuela',

    // Uruguay
    'creator campaigns uruguay',
    'marketing de influencers en uruguay',
    'influencers en uruguay',
    'ugc creadores en uruguay',
    'campañas con influencers en uruguay',
    'campañas con ugc creadores en uruguay',
    'podcast marketing uruguay',

    // República Dominicana
    'creator campaigns republica dominicana',
    'marketing de influencers en republica dominicana',
    'influencers en republica dominicana',
    'ugc creadores en republica dominicana',
    'campañas con influencers en republica dominicana',
    'campañas con ugc creadores en republica dominicana',
    'podcast marketing republica dominicana',

    // Paraguay
    'creator campaigns paraguay',
    'marketing de influencers en paraguay',
    'influencers en paraguay',
    'ugc creadores en paraguay',
    'campañas con influencers en paraguay',
    'campañas con ugc creadores en paraguay',
    'podcast marketing paraguay',

    // Colombia
    'creator campaigns colombia',
    'marketing de influencers en colombia',
    'influencers en colombia',
    'ugc creadores en colombia',
    'campañas con influencers en colombia',
    'campañas con ugc creadores en colombia',
    'podcast marketing colombia',

    // Chile
    'creator campaigns chile',
    'marketing de influencers en chile',
    'influencers en chile',
    'ugc creadores en chile',
    'campañas con influencers en chile',
    'campañas con ugc creadores en chile',
    'podcast marketing chile',

    // Argentina
    'creator campaigns argentina',
    'marketing de influencers en argentina',
    'influencers en argentina',
    'ugc creadores en argentina',
    'campañas con influencers en argentina',
    'campañas con ugc creadores en argentina',
    'podcast marketing argentina',

    // Mexico
    'creator campaigns mexico',
    'marketing de influencers en mexico',
    'influencers en mexico',
    'ugc creadores en mexico',
    'campañas con influencers en mexico',
    'campañas con ugc creadores en mexico',
    'podcast marketing mexico',

    // El Salvador
    'creator campaigns el salvador',
    'marketing de influencers en el salvador',
    'influencers en el salvador',
    'ugc creadores en el salvador',
    'campañas con influencers en el salvador',
    'campañas con ugc creadores en el salvador',
    'podcast marketing el salvador',

    // Brazil
    'creator campaigns brazil',
    'marketing de influencers en brazil',
    'influencers en brazil',
    'ugc creadores en brazil',
    'campañas con influencers en brazil',
    'campañas con ugc creadores en brazil',
    'podcast marketing brazil',
  ],
  authors: [{ name: 'GrandeApp' }],
  alternates: {
    canonical: 'https://c.grandeapp.com',
  },
  openGraph: {
    title: 'Influencer, UGC & Podcast Creator Campaigns | GrandeApp',
    description:
      'GrandeApp connects brands with influencers, UGC creators, and podcast talent worldwide. Powered by AI, we help you launch high-performing campaigns across the USA, LATAM, and beyond.',
    url: 'https://c.grandeapp.com',
    siteName: 'GrandeApp',
    images: [
      {
        url: 'https://c.grandeapp.com/images/logoo.png',
        width: 1200,
        height: 630,
        alt: 'GrandeApp Creator Marketing Platform',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Influencer, UGC & Podcast Campaigns | GrandeApp',
    description:
      'GrandeApp helps brands grow with influencers, UGC creators, and podcast partnerships—powered by AI.',
    images: ['https://c.grandeapp.com/images/logoo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function SignUp() {
  return <SignUpForm />;
}
