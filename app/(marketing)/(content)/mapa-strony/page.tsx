import { permanentRedirect } from "next/navigation";

import { SitemapRedirectCoordinator } from "@/app/lib/navigation/SitemapRedirectCoordinator";

const coordinator = new SitemapRedirectCoordinator();

export default function SitemapRedirectPage() {
  permanentRedirect(coordinator.resolveRedirectPath());
}
