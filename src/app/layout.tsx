import "./globals.css";
import { Pangolin } from "next/font/google";

const pangolin = Pangolin({ subsets: ["latin"], weight: "400" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={pangolin.className}>{children}</body>
    </html>
  );
}
