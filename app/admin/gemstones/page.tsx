import { redirect } from "next/navigation";

export default function LegacyGemstonesAdminRedirect() {
  redirect("/admin/products");
}
