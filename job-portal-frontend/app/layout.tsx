import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import { Toaster } from "react-hot-toast";
import { AppProvider } from "@/context/AppProvider";
import { Header } from "@/components/header";
//add nav bar componet
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online Job Portal",
  description: "Generated  ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <Header />
          <Toaster />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
