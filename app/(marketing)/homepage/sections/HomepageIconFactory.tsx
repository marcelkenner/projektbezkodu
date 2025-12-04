import type { ReactNode } from "react";
import {
  ArrowRight,
  ChartLineUp,
  ChatsCircle,
  Clock,
  Database,
  Flask,
  FlowArrow,
  Folders,
  Gauge,
  Kanban,
  Lightning,
  Notebook,
  PlugsConnected,
  Sparkle,
  SquaresFour,
  Stack,
  Target,
  Toolbox,
} from "@phosphor-icons/react/dist/ssr";

export type PillarIconName =
  | "bolt"
  | "spark"
  | "workflow"
  | "target"
  | "layers"
  | "speed"
  | "database"
  | "experiment";

export type ResourcePromoIconName =
  | "guides"
  | "tools"
  | "templates"
  | "comparisons"
  | "cases"
  | "automation"
  | "downloads";

export class HomepageIconFactory {
  static arrow(className = "homepage-pillars__arrow"): ReactNode {
    return (
      <ArrowRight aria-hidden="true" className={className} weight="bold" />
    );
  }

  static clock(className = "homepage-articles__icon"): ReactNode {
    return <Clock aria-hidden="true" className={className} weight="bold" />;
  }

  static pillar(name: PillarIconName, className = "homepage-pillars__icon"): ReactNode {
    switch (name) {
      case "bolt":
        return <Lightning aria-hidden="true" className={className} weight="fill" />;
      case "spark":
        return <Sparkle aria-hidden="true" className={className} weight="fill" />;
      case "workflow":
        return <FlowArrow aria-hidden="true" className={className} weight="fill" />;
      case "target":
        return <Target aria-hidden="true" className={className} weight="fill" />;
      case "layers":
        return <Stack aria-hidden="true" className={className} weight="fill" />;
      case "speed":
        return <Gauge aria-hidden="true" className={className} weight="fill" />;
      case "database":
        return <Database aria-hidden="true" className={className} weight="fill" />;
      case "experiment":
        return <Flask aria-hidden="true" className={className} weight="fill" />;
      default:
        return <Sparkle aria-hidden="true" className={className} weight="fill" />;
    }
  }

  static resource(
    name: ResourcePromoIconName,
    className = "homepage-resources__icon",
  ): ReactNode {
    switch (name) {
      case "guides":
        return <Notebook aria-hidden="true" className={className} weight="fill" />;
      case "tools":
        return <Toolbox aria-hidden="true" className={className} weight="fill" />;
      case "templates":
        return <SquaresFour aria-hidden="true" className={className} weight="fill" />;
      case "comparisons":
        return <ChartLineUp aria-hidden="true" className={className} weight="fill" />;
      case "cases":
        return <Kanban aria-hidden="true" className={className} weight="fill" />;
      case "automation":
        return <PlugsConnected aria-hidden="true" className={className} weight="fill" />;
      case "downloads":
        return <Folders aria-hidden="true" className={className} weight="fill" />;
      default:
        return <ChatsCircle aria-hidden="true" className={className} weight="fill" />;
    }
  }
}
