type StatusBadgeProps = {
  status: "Available" | "Issued";
};

function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[90px] h-7 rounded-full text-xs font-medium ${
        status === "Available"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-orange-100 text-orange-700"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;