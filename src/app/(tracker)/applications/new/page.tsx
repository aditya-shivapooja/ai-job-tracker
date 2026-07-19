import Link from "next/link";

import { createApplication } from "@/app/(tracker)/actions";
import { APPLICATION_STATUSES } from "@/lib/application-status";

export default function NewApplicationPage() {
  return (
    <section className="space-y-6">
      <div>
        <Link
          className="text-sm font-semibold text-[#2f6f73] hover:text-[#25595c]"
          href="/applications"
        >
          Back to applications
        </Link>
        <h1 className="mt-3 text-3xl font-semibold">Add application</h1>
      </div>

      <form
        action={createApplication}
        className="grid gap-5 rounded-lg border border-[#d9dee8] bg-white p-6 shadow-sm"
      >
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-[#374151]" htmlFor="company">
            Company
          </label>
          <input
            className="h-11 rounded-md border border-[#cfd6e3] px-3 text-sm outline-none transition focus:border-[#2f6f73]"
            id="company"
            name="company"
            required
            type="text"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-[#374151]" htmlFor="role">
            Role
          </label>
          <input
            className="h-11 rounded-md border border-[#cfd6e3] px-3 text-sm outline-none transition focus:border-[#2f6f73]"
            id="role"
            name="role"
            required
            type="text"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-[#374151]" htmlFor="status">
            Status
          </label>
          <select
            className="h-11 rounded-md border border-[#cfd6e3] bg-white px-3 text-sm outline-none transition focus:border-[#2f6f73]"
            defaultValue="Applied"
            id="status"
            name="status"
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label
            className="text-sm font-semibold text-[#374151]"
            htmlFor="jobDescription"
          >
            Job Description
          </label>
          <textarea
            className="min-h-32 rounded-md border border-[#cfd6e3] px-3 py-2 text-sm outline-none transition focus:border-[#2f6f73]"
            id="jobDescription"
            name="jobDescription"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-[#374151]" htmlFor="notes">
            Notes
          </label>
          <textarea
            className="min-h-28 rounded-md border border-[#cfd6e3] px-3 py-2 text-sm outline-none transition focus:border-[#2f6f73]"
            id="notes"
            name="notes"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#cfd6e3] bg-white px-4 text-sm font-semibold text-[#111827] transition hover:bg-[#f3f4f6]"
            href="/applications"
          >
            Cancel
          </Link>
          <button
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#2f6f73] px-4 text-sm font-semibold text-white transition hover:bg-[#25595c]"
            type="submit"
          >
            Save Application
          </button>
        </div>
      </form>
    </section>
  );
}

