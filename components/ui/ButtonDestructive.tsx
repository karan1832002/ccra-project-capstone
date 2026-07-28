export default function ButtonDestructive({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        inline-flex items-center gap-2
        rounded-md px-3 py-2 text-sm font-semibold
        text-red-700 transition hover:bg-red-50
      "
    >
      {label}
    </button>
  );
}
