export const metadata = {
  title: "旅行工程ジェネレーター",
  description: "東京発・王道・複数人向け。AIが70%完成で言い切る。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}