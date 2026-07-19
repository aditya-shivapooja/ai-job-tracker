import Link from "next/link";

import { updateApplicationStatus } from "@/app/(tracker)/actions";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/lib/application-status";
import { requireUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { StatusSelect } from "@/components/status-select";

type ApplicationsPageProps = {
  searchParams: Promise<{
    company?: string;
    date?: string;
    q?: string;
    status?: string;
  }>;
};

function getAppliedDateRange(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }

  const start = new Date(`${date}T00:00:00`);

  if (Number.isNaN(start.getTime())) {
    return null;
  }

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

function toApplicationStatus(status: string): ApplicationStatus {
  if (APPLICATION_STATUSES.includes(status as ApplicationStatus)) {
    return status as ApplicationStatus;
  }

  return "Applied";
}

export default async function ApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const user = await requireUser();
  const { company, date, q, status } = await searchParams;
  const companyFilter = (company ?? q)?.trim() ?? "";
  const dateFilter = date?.trim() ?? "";
  const statusFilter = APPLICATION_STATUSES.includes(status as ApplicationStatus)
    ? (status as ApplicationStatus)
    : "";
  const appliedDateRange = dateFilter ? getAppliedDateRange(dateFilter) : null;
  const hasFilters = Boolean(companyFilter || statusFilter || dateFilter);
  const applications = await prisma.application.findMany({
    where: {
      userId: user.id,
      ...(companyFilter
        ? {
            company: {
              contains: companyFilter,
              mode: "insensitive",
            },
          }
        : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(appliedDateRange
        ? {
            dateApplied: {
              gte: appliedDateRange.start,
              lt: appliedDateRange.end,
            },
          }
        : {}),
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

      <form
        action="/applications"
        className="grid gap-4 rounded-lg border border-[#d9dee8] bg-white p-4 shadow-sm lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]"
      >
        <div className="grid gap-2">
          <label
            className="text-sm font-semibold text-[#374151]"
            htmlFor="company-filter"
          >
            Company
          </label>
          <input
            className="h-11 rounded-md border border-[#cfd6e3] px-3 text-sm outline-none transition placeholder:text-[#9ca3af] focus:border-[#2f6f73]"
            defaultValue={companyFilter}
            id="company-filter"
            name="company"
            placeholder="Filter by company"
            type="search"
          />
        </div>

        <div className="grid gap-2">
          <label
            className="text-sm font-semibold text-[#374151]"
            htmlFor="status-filter"
          >
            Status
          </label>
          <select
            className="h-11 rounded-md border border-[#cfd6e3] bg-white px-3 text-sm outline-none transition focus:border-[#2f6f73]"
            defaultValue={statusFilter}
            id="status-filter"
            name="status"
          >
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((applicationStatus) => (
              <option key={applicationStatus} value={applicationStatus}>
                {applicationStatus}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label
            className="text-sm font-semibold text-[#374151]"
            htmlFor="date-filter"
          >
            Date Applied
          </label>
          <input
            className="h-11 rounded-md border border-[#cfd6e3] px-3 text-sm outline-none transition focus:border-[#2f6f73]"
            defaultValue={dateFilter}
            id="date-filter"
            name="date"
            type="date"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#263244]"
            type="submit"
          >
            Filter
          </button>
          {hasFilters ? (
            <Link
              className="inline-flex h-11 items-center justify-center rounded-md border border-[#cfd6e3] bg-white px-4 text-sm font-semibold text-[#111827] transition hover:bg-[#f3f4f6]"
              href="/applications"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>

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
                    {hasFilters
                      ? "No applications match the selected filters."
                      : "No applications yet."}
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
