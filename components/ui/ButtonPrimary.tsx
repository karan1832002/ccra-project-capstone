interface ButtonPrimaryProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function ButtonPrimary({ label, onClick, disabled = false }: ButtonPrimaryProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        inline-flex items-center justify-center gap-2
        rounded-md bg-orange-600 px-5 py-3
        text-sm font-semibold text-white
        transition hover:bg-orange-700
        disabled:opacity-60
      "
    >
      {label}
    </button>
  );
}
