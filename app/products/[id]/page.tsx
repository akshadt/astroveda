import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

/** Canonical product detail lives at /shop/[id]; this path keeps shareable /products/... URLs working. */
export default async function ProductDetailAlias({ params }: Props) {
  const { id } = await params;
  redirect(`/shop/${id}`);
}
