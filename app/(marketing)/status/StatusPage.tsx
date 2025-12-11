import Link from "next/link";
import type { Metadata } from "next";
import { getCopy } from "@/app/lib/copy";
import styles from "./status.module.css";

type StatusCode = "410" | "451" | "503";

const copy = getCopy("system-status");

interface StatusAction {
  label: string;
  href: string;
}

interface StatusPageProps {
  status: StatusCode;
  retryTime?: string;
}

export function createStatusMetadata(
  status: StatusCode,
  retryTime?: string,
): Metadata {
  const page = copy.pages[status];
  const description =
    status === "503" && retryTime
      ? page.seo.description.replace("{time}", formatDisplayTime(retryTime))
      : page.seo.description;
  return {
    title: page.seo.title,
    description,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export function StatusPage({ status, retryTime }: StatusPageProps) {
  const viewModel = new StatusPageViewModel(status, retryTime);
  const hero = viewModel.getHero();
  const actions = viewModel.getActions();
  const code = viewModel.getMetaCode();

  return (
    <section className={`${styles.statusPage} section section--surface`} id="content">
      <div className={`pbk-container ${styles.statusPage__card}`}>
        <div className={styles.statusPage__icon} aria-hidden="true">
          <span>⚠️</span>
        </div>
        <h1>{hero.title}</h1>
        {viewModel.getMessage()}
        {code ? <p className={styles.statusPage__code}>{code}</p> : null}
        {actions.length ? (
          <nav className={styles.statusPage__actions} aria-label="Nawigacja awaryjna">
            {actions.map((action) => (
              <Link
                key={action.href}
                className="pbk-button pbk-button--secondary"
                href={action.href}
              >
                {action.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </section>
  );
}

class StatusPageViewModel {
  private readonly pageCopy = copy.pages[this.status];

  constructor(
    private readonly status: StatusCode,
    private readonly retryTime?: string,
  ) {}

  getHero() {
    return this.pageCopy.hero;
  }

  getActions(): StatusAction[] {
    if ("actions" in this.pageCopy && Array.isArray(this.pageCopy.actions)) {
      return this.pageCopy.actions;
    }
    return [];
  }

  getMetaCode() {
    if ("meta" in this.pageCopy && this.pageCopy.meta?.code) {
      return this.pageCopy.meta.code;
    }
    return null;
  }

  getMessage() {
    const template = this.pageCopy.hero.message;
    if (!template.includes("{time}") || !this.retryTime) {
      return <p>{template}</p>;
    }
    const [prefix, suffix] = template.split("{time}");
    return (
      <p>
        {prefix}
        <time dateTime={this.retryTime}>
          {formatDisplayTime(this.retryTime)}
        </time>
        {suffix}
      </p>
    );
  }
}

function formatDisplayTime(isoString: string) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  return date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
