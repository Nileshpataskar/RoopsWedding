type BotanicalSprigProps = {
  className?: string;
};

/** Low-contrast horizontal leaf garland used at section boundaries. */
export function BotanicalSprig({ className = "" }: BotanicalSprigProps) {
  const leaves = [-1, 1].flatMap((side) =>
    [18, 34, 50, 66].map((x, i) => ({ side, x, i })),
  );
  return (
    <svg
      viewBox="0 0 200 40"
      aria-hidden="true"
      className={`mx-auto h-8 w-44 text-leaf ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={0.8}
    >
      <path d="M20 20 C 60 14, 140 14, 180 20" opacity={0.7} />
      {leaves.map(({ side, x, i }) => {
        const cx = 100 + side * x;
        const up = i % 2 === 0 ? -1 : 1;
        return (
          <path
            key={`${side}-${x}`}
            d={`M${cx} ${17.5} q ${side * 6} ${up * 7} ${side * 13} ${up * 6} q ${-side * 7} ${-up * 4} ${-side * 13} ${-up * 6}z`}
            fill="currentColor"
            fillOpacity={0.35}
          />
        );
      })}
      <circle cx="100" cy="16.5" r="3.6" fill="#e8892a" stroke="#d6ad5c" />
      <circle cx="100" cy="16.5" r="1.6" fill="#f6c75a" stroke="none" />
      <circle cx="20" cy="20" r="2" fill="#e8892a" stroke="none" />
      <circle cx="180" cy="20" r="2" fill="#e8892a" stroke="none" />
    </svg>
  );
}
