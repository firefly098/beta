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
    size === "sm" ? "h-11 w-[6.75rem]" : size === "md" ? "h-14 w-36" : "h-[4.5rem] w-48";

  return (
    <div
      className={`flex ${dims} items-center justify-center rounded-lg border border-black/10 p-2.5`}
      style={{ backgroundColor: background || "#0a0a0a" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`${name} logo`} className="max-h-full max-w-full object-contain" />
    </div>
  );
}
