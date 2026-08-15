import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const callbackUrl = String(formData.get("callbackUrl") || "/admin");
    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect(`/admin/login?error=CredentialsSignin&callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
      throw error;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        action={login}
        className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold tracking-tight">Admin login</h1>
        <p className="mt-1 text-sm text-zinc-500">Sign in to manage content</p>
        <input type="hidden" name="callbackUrl" value={params.callbackUrl || "/admin"} />
        <label className="mt-6 block text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            defaultValue="admin@example.com"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        {params.error ? (
          <p className="mt-3 text-sm text-red-600">Invalid email or password</p>
        ) : null}
        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
