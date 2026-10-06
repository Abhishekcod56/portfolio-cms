import "./globals.css";

export const metadata = {
  title: "Portfolio CMS",
  description: "Portfolio Admin CMS"
};

export default function RootLayout({
  children
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}