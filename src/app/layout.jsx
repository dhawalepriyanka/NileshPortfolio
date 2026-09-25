import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  metadataBase: new URL("https://www.loanwithnilesh.co.in"),
  title: "Nilesh Kute | Expert Home Loan Consultant in Belapur",
  description: "Get personalized guidance for Home Loans, Balance Transfer, Top-Up Loans, and more with Nilesh Kute. 11+ years of experience turning dreams into reality.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    title: "Nilesh Kute | Expert Home Loan Consultant in Belapur",
    description: "Get personalized guidance for Home Loans, Balance Transfer, Top-Up Loans, and more with Nilesh Kute.",
    url: "https://www.loanwithnilesh.co.in",
    siteName: "Nilesh Kute - Home Loan Consultant",
    images: [
      {
        url: "https://www.loanwithnilesh.co.in/logo.png",
        width: 1024,
        height: 1024,
        alt: "Nilesh Kute Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nilesh Kute | Expert Home Loan Consultant in Belapur",
    description: "Get personalized guidance for Home Loans, Balance Transfer, Top-Up Loans, and more with Nilesh Kute.",
    images: ["https://www.loanwithnilesh.co.in/logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FinancialService",
      "@id": "https://www.loanwithnilesh.co.in/#organization",
      "name": "Nilesh Kute - Home Loan Consultant",
      "url": "https://www.loanwithnilesh.co.in",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.loanwithnilesh.co.in/#logo",
        "url": "https://www.loanwithnilesh.co.in/logo.png",
        "contentUrl": "https://www.loanwithnilesh.co.in/logo.png",
        "caption": "Nilesh Kute Logo",
        "width": 1024,
        "height": 1024
      },
      "image": "https://www.loanwithnilesh.co.in/logo.png",
      "description": "Expert Home Loan and Financial Consultant in Belapur, Navi Mumbai. Providing Home Loans, Balance Transfers, Top-Up Loans, and LAP.",
      "telephone": "+918356008675",
      "email": "nileshkute43@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Belapur",
        "addressLocality": "Navi Mumbai",
        "addressRegion": "Maharashtra",
        "postalCode": "400614",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://youtube.com/@nileshkute"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.loanwithnilesh.co.in/#website",
      "url": "https://www.loanwithnilesh.co.in",
      "name": "Nilesh Kute - Home Loan Consultant",
      "publisher": {
        "@id": "https://www.loanwithnilesh.co.in/#organization"
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-48.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
