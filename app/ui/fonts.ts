import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "../../public/fonts/Inter-LatinExt-roman.woff2",
      weight: "400 600",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

export const spaceGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/SpaceGrotesk-LatinExt-500-700.woff2",
      weight: "500 700",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

export const jetBrainsMono = localFont({
  src: [
    {
      path: "../../public/fonts/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/JetBrainsMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});
