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
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Nilesh Kute - Home Loan Consultant Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
