import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nilesh Kute | Expert Home Loan Consultant in Belapur",
  description: "Get personalized guidance for Home Loans, Balance Transfer, Top-Up Loans, and more with Nilesh Kute. 11+ years of experience turning dreams into reality.",
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
