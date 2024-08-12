import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { AuthProvider } from "./components/useAuth";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });
const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MTGN24",
  description: "Official website for Mottagningen 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={"max-w-full " + rubik.className}>
          <Header />
          {children}
          <Footer/>
        </body>
      </html>
    </AuthProvider>
  );
}
