import { redirect } from "next/navigation";

type NewPasswordPageProps = {
  searchParams: Promise<{ email?: string }>;
};

// Frappe's flow linked here with a one-time `key`; jc-portal has no such
// link, so any old bookmark or emailed link pointing at this route now goes
// through the code-based recovery flow instead of a dead parameter.
export default async function NewPasswordPage({
  searchParams,
}: NewPasswordPageProps) {
  const { email = "" } = await searchParams;
  redirect(`/reset-password${email ? `?email=${encodeURIComponent(email)}` : ""}`);
}
