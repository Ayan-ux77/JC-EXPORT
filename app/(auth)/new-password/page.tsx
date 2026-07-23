import { redirect } from "next/navigation";

type NewPasswordPageProps = {
  searchParams: Promise<{ key?: string }>;
};

export default async function NewPasswordPage({
  searchParams,
}: NewPasswordPageProps) {
  const { key = "" } = await searchParams;
  redirect(`/reset-password${key ? `?key=${encodeURIComponent(key)}` : ""}`);
}
