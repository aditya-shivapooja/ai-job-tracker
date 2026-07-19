"use client";

import { useTransition } from "react";

import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/lib/application-status";

type StatusSelectProps = {
  applicationId: string;
  currentStatus: ApplicationStatus;
  updateStatus: (formData: FormData) => Promise<void>;
};

export function StatusSelect({
  applicationId,
  currentStatus,
  updateStatus,
}: StatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <form>
      <input name="applicationId" type="hidden" value={applicationId} />
      <select
        aria-label="Application status"
        className="h-9 rounded-md border border-[#cfd6e3] bg-white px-2 text-sm font-medium text-[#111827] outline-none transition hover:border-[#9aa6ba] focus:border-[#2f6f73] disabled:cursor-not-allowed disabled:bg-[#f3f4f6]"
        defaultValue={currentStatus}
        disabled={isPending}
        name="status"
        onChange={(event) => {
          const form = event.currentTarget.form;

          if (!form) {
            return;
          }

          const formData = new FormData(form);

          startTransition(() => {
            void updateStatus(formData);
          });
        }}
      >
        {APPLICATION_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </form>
  );
}
