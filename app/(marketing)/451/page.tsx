import {
  StatusPage,
  createStatusMetadata,
} from "@/app/(marketing)/status/StatusPage";

export const metadata = createStatusMetadata("451");

export default function UnavailableForLegalReasonsPage() {
  return <StatusPage status="451" />;
}
