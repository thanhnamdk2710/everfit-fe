import Providers from "./providers";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import "../styles/globals.css";

export const metadata = {
  title: "Metric tracking system",
  description: "Metric tracking system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
