export function fmtMonthDay(dateStr: string | null): string {
  if (!dateStr) return "—";

  const [y, m, d] = dateStr.split("-").map(Number);

  return new Date(y, m - 1, d).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
  });
}