import { forwardRef } from "react";
import type { Activity } from "../types";
import { dayParts } from "../lib/time";
import { packDay } from "../lib/packing";
import { ActivityBar, BAR_HEIGHT, SUB_ROW_GAP } from "./ActivityBar";

interface Props {
  dayKey: string;
  activities: Activity[];
  isToday: boolean;
  onSelectActivity: (activity: Activity) => void;
  onCreateAt: (dayKey: string) => void;
}

/**
 * One day-row: a label plus a 00:00–24:00 track. Activities are greedily
 * packed into sub-rows; the track height grows to fit. Clicking empty track
 * space opens the create form prefilled with this day. See specs/agenda-view.
 */
export const DayRow = forwardRef<HTMLDivElement, Props>(function DayRow(
  { dayKey, activities, isToday, onSelectActivity, onCreateAt },
  ref,
) {
  const { items, subRowCount } = packDay(activities);
  const rows = Math.max(subRowCount, 1);
  const trackHeight = rows * BAR_HEIGHT + (rows - 1) * SUB_ROW_GAP;
  const { weekday, dayNum } = dayParts(dayKey);

  return (
    <div
      ref={ref}
      className={`day-row${isToday ? " day-row--today" : ""}`}
    >
      <div className="day-row__label">
        <span className="day-row__weekday">{weekday}</span>
        <span className="day-row__daynum">{dayNum}</span>
      </div>
      <div
        className="day-row__track"
        style={{ height: `${trackHeight}px` }}
        onClick={() => onCreateAt(dayKey)}
      >
        {items.map(({ activity, subRow }) => (
          <ActivityBar
            key={activity.id}
            activity={activity}
            subRow={subRow}
            onSelect={onSelectActivity}
          />
        ))}
      </div>
    </div>
  );
});
