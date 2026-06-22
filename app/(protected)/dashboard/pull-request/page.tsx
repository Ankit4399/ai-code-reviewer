/**
 * Pull requests list page (`/dashboard/pull-requests`).
 *
 * Groups AI-reviewed PRs by repository. Requires a GitHub App installation;
 * otherwise shows a prompt to connect GitHub first.
 */


import { Button } from "@/components/ui/button";
import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { getUserInstallationId } from "@/features/github/server/installation";
import { PullRequestsList } from "@/features/pull-requests/components/pull-requests-list";
import { getPullRequestsByRepo } from "@/features/pull-requests/server/get-pull-requests";
import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
    title: "Pull Requests · Dashboard",
};

/**
 * Empty state when GitHub App is not installed.
 *
 * @returns Centered message with link to GitHub App settings.
 */
function PullRequestsNotConnected() {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <p className="text-sm text-muted-foreground">
          Install the GitHub App first to see AI-reviewed pull requests.
        </p>
        <Button nativeButton={false} render={<Link href={DASHBOARD_ROUTES.github} />}>
          Go to GitHub App
        </Button>
      </div>
    );
}

export default async function DashboardPullRequestPage(){
    const session = await requireAuth();
    const installationId = await getUserInstallationId(session.user.id);

    const header = (
        <DashboardHeader
          title="Pull Requests"
          description="Every pull request the AI reviewer has picked up, with its review."
        />
      );
    
      if (!installationId) {
        return (
          <>
            {header}
            <PullRequestsNotConnected />
          </>
        );
      }
    
      const repos = await getPullRequestsByRepo(installationId);
    
      return (
        <>
          {header}
          <PullRequestsList repos={repos} />
        </>
      );
}