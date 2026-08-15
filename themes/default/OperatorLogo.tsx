export function OperatorLogo({
  name,
  src,
  background,
  size = "lg",
}: {
  name: string;
  src?: string | null;
  background?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  if (!src) return null;

  const dims =
    size === "sm"
      ? "h-12 w-[7.5rem]"
      : size === "md"
        ? "h-16 w-40"
        : "h-20 w-52 md:h-24 md:w-64";

  return (
    <div
      className={`flex ${dims} items-center justify-center rounded-2xl border border-black/10 p-3 shadow-[var(--shadow)]`}
      style={{ backgroundColor: background || "#0e1525" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`${name} logo`} className="max-h-full max-w-full object-contain" />
    </div>
  );
}
