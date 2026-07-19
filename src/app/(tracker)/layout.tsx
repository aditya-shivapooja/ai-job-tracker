import Link from "next/link";

import { signOut } from "@/auth";
import { requireUser } from "@/lib/current-user";

export default async function TrackerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-[#111827]">
      <header className="border-b border-[#d9dee8] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link className="text-lg font-semibold" href="/dashboard">
              AI Job Tracker
            </Link>
            <p className="text-sm text-[#6b7280]">
              {user.name ?? user.email ?? "Signed in"}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium text-[#374151] transition hover:bg-[#f3f4f6]"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium text-[#374151] transition hover:bg-[#f3f4f6]"
              href="/applications"
            >
              Applications
            </Link>
            <Link
              className="rounded-md bg-[#2f6f73] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#25595c]"
              href="/applications/new"
            >
              Add Application
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                className="rounded-md border border-[#cfd6e3] bg-white px-3 py-2 text-sm font-semibold text-[#111827] transition hover:bg-[#f3f4f6]"
                type="submit"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </main>
  );
}

