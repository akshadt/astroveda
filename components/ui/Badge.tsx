type BadgeProps = {
  status: "paid" | "pending" | "completed" | "failed";
};

export default function Badge({ status }: BadgeProps) {
  const variants: Record<string, string> = {
    paid: "bg-green-100 text-green-700 border border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    failed: "bg-red-100 text-red-700 border border-red-200",
    completed: "bg-blue-100 text-blue-700 border border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
        variants[status] || variants.pending
      }`}
    >
      {status}
    </span>
  );
}
