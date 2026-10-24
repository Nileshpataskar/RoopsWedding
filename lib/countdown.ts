export type TimeParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the target moment has been reached. */
  done: boolean;
};

export function getTimeParts(targetMs: number, nowMs: number): TimeParts {
  const diff = Math.max(0, targetMs - nowMs);
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    done: diff === 0,
  };
}
