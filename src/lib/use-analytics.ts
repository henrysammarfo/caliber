import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Records a labelled route_visit for a console page. The root tracker records
 * raw path visits; this adds the named surface for dashboard reporting.
 */
export function usePageView(page: string, surface: "console" | "site" = "console") {
  useEffect(() => {
    void track("route_visit", { label: page, metadata: { surface } });
  }, [page, surface]);
}
