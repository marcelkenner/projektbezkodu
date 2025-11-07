import {
  StatusPage,
  createStatusMetadata,
} from "@/app/(marketing)/status/StatusPage";

export const metadata = createStatusMetadata("410");

export default function GonePage() {
  return <StatusPage status="410" />;
}
