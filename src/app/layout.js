import localFont from "next/font/local";
import "./globals.css";
import { Inter } from 'next/font/google'

const instrumentSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-sans',
})
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "BlockView",
  description: "View real time block formation of Ethereum, Solana and Base",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
