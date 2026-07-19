import Link from "next/link";

import { updateApplicationStatus } from "@/app/(tracker)/actions";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/lib/application-status";
import { requireUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { StatusSelect } from "@/components/status-select";

function toApplicationStatus(status: string): ApplicationStatus {
  if (APPLICATION_STATUSES.includes(status as ApplicationStatus)) {
    return status as ApplicationStatus;
  }

  return "Applied";
}

export default async function ApplicationsPage() {
  const user = await requireUser();
  const applications = await prisma.application.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      dateApplied: "desc",
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2f6f73]">
            Applications
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Your pipeline</h1>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#2f6f73] px-4 text-sm font-semibold text-white transition hover:bg-[#25595c]"
          href="/applications/new"
        >
          Add Application
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#d9dee8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-[#f3f4f6] text-xs uppercase tracking-[0.12em] text-[#6b7280]">
              <tr>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Date Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {applications.map((application) => (
                <tr key={application.id}>
                  <td className="px-4 py-4 font-medium text-[#111827]">
                    {application.company}
                  </td>
                  <td className="px-4 py-4 text-[#374151]">
                    {application.role}
                  </td>
                  <td className="px-4 py-4">
                    <StatusSelect
                      applicationId={application.id}
                      currentStatus={toApplicationStatus(application.status)}
                      updateStatus={updateApplicationStatus}
                    />
                  </td>
                  <td className="px-4 py-4 text-[#374151]">
                    {application.dateApplied.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {applications.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-10 text-center text-[#6b7280]"
                    colSpan={4}
                  >
                    No applications yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

