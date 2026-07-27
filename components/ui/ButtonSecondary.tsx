export default function ButtonSecondary({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        inline-flex items-center justify-center gap-2
        rounded-md border border-stone-200
        px-5 py-3 text-sm font-semibold text-stone-950
        transition hover:bg-stone-50
      "
    >
      {label}
    </button>
  );
}
