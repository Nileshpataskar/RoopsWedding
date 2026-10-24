import { Heart } from "./Heart";

type HeartDividerProps = {
  className?: string;
  width?: string;
};

/** Fine line — tiny heart — fine line. */
export function HeartDivider({ className = "", width = "w-40" }: HeartDividerProps) {
  return (
    <div
      role="presentation"
      className={`mx-auto flex items-center justify-center gap-2 text-antique ${width} ${className}`}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-champagne" />
      <span className="h-1 w-1 rotate-45 bg-champagne/70" />
      <Heart className="h-2.5 w-2.5 text-antique" />
      <span className="h-1 w-1 rotate-45 bg-champagne/70" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-champagne" />
    </div>
  );
}
