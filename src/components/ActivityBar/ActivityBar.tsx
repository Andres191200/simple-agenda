import type { Activity } from "../../types";
import { dayFraction } from "../../lib/time";
import { barGradient } from "../../lib/color";
import "./ActivityBar.scss";

const BAR_HEIGHT = 40; // px, must match $bar-height in styles/globals.scss
const SUB_ROW_GAP = 6; // px

interface Props {
  activity: Activity;
  subRow: number;
  onSelect: (activity: Activity) => void;
}

/**
 * A single activity rendered as a colored bar, positioned by start/end as a
 * percentage of the day. A CSS min-width keeps very short / zero-duration
 * activities visible and clickable. See specs/agenda-view.
 */
export function ActivityBar({ activity, subRow, onSelect }: Props) {
  const left = dayFraction(activity.start) * 100;
  const width = (dayFraction(activity.end) - dayFraction(activity.start)) * 100;
  const top = subRow * (BAR_HEIGHT + SUB_ROW_GAP);

  return (
    <button
      type="button"
      className="activity-bar"
      style={{
        left: `${left}%`,
        width: `${width}%`,
        top: `${top}px`,
        background: barGradient(activity.color),
      }}
      title={`${activity.title} (${activity.start}–${activity.end})`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(activity);
      }}
    >
      <span className="activity-bar__label">
        {activity.title}{" "}
        <span className="activity-bar__range">
          {activity.start}–{activity.end}
        </span>
      </span>
    </button>
  );
}

export { BAR_HEIGHT, SUB_ROW_GAP };
