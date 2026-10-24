/** Faint classical-palace line drawing shown beneath the venue map. */
export function PalaceLineArt({ className = "" }: { className?: string }) {
  const columns = [118, 134, 150, 166, 234, 250, 266, 282];
  const windows = [36, 58, 80, 312, 334, 356];
  return (
    <svg
      viewBox="0 0 400 170"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinejoin="round"
    >
      {/* dome and lantern */}
      <path d="M200 8 v10 M196 18 h8 v8 h-8z M170 62 C 170 38, 230 38, 230 62" />
      <path d="M176 62 v-4 h48 v4 M186 50 C 190 40, 210 40, 214 50" />
      {/* central pediment */}
      <path d="M104 92 L200 62 L296 92 Z M124 88 L200 68 L276 88" />
      <circle cx="200" cy="80" r="5" />
      <path d="M100 92 h200 v6 h-200z" />
      {/* columns */}
      {columns.map((x) => (
        <path key={x} d={`M${x - 4} 98 h8 M${x - 3} 101 v42 M${x + 3} 101 v42 M${x - 4} 143 h8`} />
      ))}
      {/* central door */}
      <path d="M186 143 v-28 a14 14 0 0 1 28 0 v28" />
      {/* wings */}
      <path d="M20 104 h80 M300 104 h80 M20 104 v39 M380 104 v39 M16 100 h84 M300 100 h84" />
      {windows.map((x) => (
        <path key={x} d={`M${x - 6} 136 v-18 a6 6 0 0 1 12 0 v18 z`} />
      ))}
      {/* balustrade and steps */}
      <path d="M8 143 h384 M8 149 h384 M150 149 l-10 6 h120 l-10 -6 M130 155 l-10 6 h160 l-10 -6" />
      <path d="M40 166 h320" strokeDasharray="2 4" />
    </svg>
  );
}
