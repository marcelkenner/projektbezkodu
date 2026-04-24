import Image from "next/image";

const LOGO_SIZES = "(max-width: 768px) 120px, 128px";

export function BrandLogo() {
  return (
    <Image
      className="site-header__wordmark"
      src="/projektbezkodu_logo.png"
      alt="ProjektBezKodu"
      width={128}
      height={38}
      quality={60}
      decoding="async"
      sizes={LOGO_SIZES}
    />
  );
}
