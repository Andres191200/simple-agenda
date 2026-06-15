import { useEffect, useState } from "react";
import "./HourAxis.scss";

const FULL_LABELS = [0, 3, 6, 9, 12, 15, 18, 21, 24];
const MOBILE_BREAKPOINT = 640; // px

/**
 * Hour axis header. Full set of labels on desktop; only 00:00 / 12:00 / 24:00
 * on narrow viewports so the axis stays legible. See specs/agenda-view.
 */
export function HourAxis() {
  const [isNarrow, setIsNarrow] = useState(
    () =>
      typeof window !== "undefined" &&
      window.innerWidth < MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const hours = isNarrow ? [0, 12, 24] : FULL_LABELS;

  return (
    <div className="hour-axis">
      <div className="hour-axis__spacer" />
      <div className="hour-axis__track">
        {hours.map((hour) => (
          <span
            key={hour}
            className="hour-axis__label"
            style={{ left: `${(hour / 24) * 100}%` }}
          >
            {String(hour).padStart(2, "0")}:00
          </span>
        ))}
      </div>
    </div>
  );
}
