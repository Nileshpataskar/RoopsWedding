type HeartProps = {
  className?: string;
  filled?: boolean;
};

export const HEART_PATH =
  "M12 21s-7.5-4.6-9.6-9.3C.9 8.3 2.8 4.5 6.4 4.1c2.1-.2 4 1 5.6 3 1.6-2 3.5-3.2 5.6-3 3.6.4 5.5 4.2 4 7.6C19.5 16.4 12 21 12 21z";

export function Heart({ className = "h-3 w-3", filled = true }: HeartProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d={HEART_PATH}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.2}
      />
    </svg>
  );
}
