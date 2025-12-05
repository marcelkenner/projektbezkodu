import Image from "next/image";
import Link from "next/link";
import "../ui.css";
import styles from "./AuthorCard.module.css";

interface AuthorProfile {
  name: string;
  role: string;
  bio: string;
  avatarSrc: string;
  avatarAlt: string;
  linkedinUrl: string;
}

const AUTHOR_PROFILE: AuthorProfile = {
  name: "Marcel Kenner",
  role: "Business / System Analyst",
  bio: "Business/System Analyst z 5+ latami doświadczenia w wytwarzaniu oprogramowania. Łączę wymagania biznesowe z rozwiązaniami no-code i automatyzacją, dbając o czytelną dokumentację i mierzalne efekty.",
  avatarSrc: "/img/authors/marcel_kenner_image.webp",
  avatarAlt: "Zdjęcie Marcela Kennera",
  linkedinUrl: "https://www.linkedin.com/in/marcel-kenner/",
};

export function AuthorCard() {
  return (
    <section className={`${styles.author} ${styles.tocSiblingSpacing}`}>
      <div className={styles.header}>
        <Image
          className={styles.avatar}
          src={AUTHOR_PROFILE.avatarSrc}
          alt={AUTHOR_PROFILE.avatarAlt}
          width={72}
          height={72}
          loading="lazy"
          decoding="async"
        />
        <div>
          <p className={styles.metaLabel}>Autor</p>
          <p className={styles.name}>{AUTHOR_PROFILE.name}</p>
          <p className={styles.meta}>{AUTHOR_PROFILE.role}</p>
        </div>
      </div>
      <p className={styles.meta}>{AUTHOR_PROFILE.bio}</p>
      <Link
        className={styles.link}
        href={AUTHOR_PROFILE.linkedinUrl}
        rel="noopener"
      >
        LinkedIn
      </Link>
    </section>
  );
}
