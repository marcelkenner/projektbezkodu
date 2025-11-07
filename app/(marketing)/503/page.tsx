import {
  StatusPage,
  createStatusMetadata,
} from "@/app/(marketing)/status/StatusPage";

const retryTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();

export const metadata = createStatusMetadata("503", retryTime);

export default function MaintenancePage() {
  return <StatusPage status="503" retryTime={retryTime} />;
}
