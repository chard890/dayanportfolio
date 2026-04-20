import "./globals.css";

export const metadata = {
  title: "Dayanara Gutierrez | Medical Virtual Assistant",
  description:
    "Modern medical virtual assistant portfolio for Dayanara Gutierrez featuring healthcare support experience, training, and core skills.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
