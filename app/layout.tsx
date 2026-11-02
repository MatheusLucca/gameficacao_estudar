import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Passo — aprender com calma, evoluir todo dia",
  description: "Aulas guiadas, prática e progresso salvo na sua conta.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
