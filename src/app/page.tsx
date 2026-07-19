import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-[#171717]">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-12">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2f6f73]">
              AI Job Tracker
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#111827] sm:text-5xl">
              Track every application from first click to final offer.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#4b5563]">
              Sign in to keep your student and job applications organized,
              searchable, and ready for the next follow-up.
            </p>
          </div>

          <div className="rounded-lg border border-[#d9dee8] bg-white p-6 shadow-sm">
            {session?.user ? (
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-[#6b7280]">
                    Signed in as
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-[#111827]">
                    {session.user.name ?? session.user.email ?? "Your account"}
                  </h2>
                  {session.user.email ? (
                    <p className="mt-1 text-sm text-[#6b7280]">
                      {session.user.email}
                    </p>
                  ) : null}
                </div>

                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    className="w-full rounded-md bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#263244]"
                    type="submit"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-[#111827]">
                    Welcome
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                    Use GitHub to create your account or return to your tracker.
                  </p>
                </div>

                <form
                  action={async () => {
                    "use server";
                    await signIn("github", { redirectTo: "/" });
                  }}
                >
                  <button
                    className="w-full rounded-md bg-[#2f6f73] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#25595c]"
                    type="submit"
                  >
                    Sign up with GitHub
                  </button>
                </form>

                <form
                  action={async () => {
                    "use server";
                    await signIn("github", { redirectTo: "/" });
                  }}
                >
                  <button
                    className="w-full rounded-md border border-[#cfd6e3] bg-white px-4 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#f3f4f6]"
                    type="submit"
                  >
                    Sign in with GitHub
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
