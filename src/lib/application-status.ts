export const APPLICATION_STATUSES = [
  "Applied",
  "OA",
  "Interview",
  "Final Round",
  "Offer",
  "Rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export function isApplicationStatus(
  value: FormDataEntryValue | null,
): value is ApplicationStatus {
  return (
    typeof value === "string" &&
    APPLICATION_STATUSES.includes(value as ApplicationStatus)
  );
}
