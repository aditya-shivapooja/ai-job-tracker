import Link from "next/link";

import { requireUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

const dashboardStatuses = ["Applied", "Interview", "Offer", "Rejected"] as const;

function getDashboardStatus(status: string) {
  if (status === "Offer" || status === "Rejected") {
    return status;
  }

  if (status === "Interview" || status === "Final Round") {
    return "Interview";
  }

  return "Applied";
}

export default async function DashboardPage() {
  const user = await requireUser();

  const groupedApplications = await prisma.application.groupBy({
    by: ["status"],
    where: {
      userId: user.id,
    },
    _count: {
      _all: true,
    },
  });

  const counts = Object.fromEntries(dashboardStatuses.map((status) => [status, 0]));

  for (const application of groupedApplications) {
    counts[getDashboardStatus(application.status)] += application._count._all;
  }

  const totalApplications = dashboardStatuses.reduce(
    (total, status) => total + counts[status],
    0,
  );

  const statCards = [
    { label: "Applications", value: totalApplications },
    ...dashboardStatuses.map((status) => ({
      label: status === "Applied" ? "Applied" : status,
      value: counts[status],
    })),
  ];

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2f6f73]">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Application overview</h1>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#2f6f73] px-4 text-sm font-semibold text-white transition hover:bg-[#25595c]"
          href="/applications/new"
        >
          Add Application
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <div
            className="rounded-lg border border-[#d9dee8] bg-white p-5 shadow-sm"
            key={stat.label}
          >
            <p className="text-sm font-medium text-[#6b7280]">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-[#111827]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
