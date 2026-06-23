/**
 * Dashboard-specific layout — sidebar shell and React Query provider.
 *
 * Runs after the parent `(protected)` layout auth check. Loads subscription
 * plan label for the sidebar user menu and wraps pages in `DashboardShell`.
 */

import { QueryProvider } from "@/components/providers/query-provider";
import {  requireAuth } from "@/features/auth/actions";
import { getUserSubscription } from "@/features/billings/server/subscription";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { PLAN_DETAILS } from "@/features/settings/lib/plan-details";


/**
 * Layout for all `/dashboard/*` routes.
 *
 * @param children - Dashboard page content inside the main inset area.
 * @returns Sidebar layout with query client and user session context.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  const subscription = await getUserSubscription(session.user.id);
  const planLabel = PLAN_DETAILS[subscription.plan].label;

  return (
    <QueryProvider>
      <DashboardShell user={session.user} plan={planLabel}>
        {children}
      </DashboardShell>
    </QueryProvider>
  );
}