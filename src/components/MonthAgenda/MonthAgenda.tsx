import { useEffect, useMemo, useRef } from "react";
import type { Activity } from "../../types";
import type { MonthCursor } from "../../store";
import {
  daysInMonth,
  toDayKey,
  dayFractionFromDate,
} from "../../lib/time";
import { DayRow } from "../DayRow";
import { HourAxis } from "../HourAxis";
import { AgendaRows } from "../AgendaRows";
import "./MonthAgenda.scss";

interface Props {
  cursor: MonthCursor;
  activities: Activity[];
  now: Date;
  onSelectActivity: (activity: Activity) => void;
  onCreateAt: (dayKey: string) => void;
}

/**
 * Renders one DayRow per day of the selected month (including empty days).
 * When the current month is shown, auto-scrolls to today on mount and passes
 * the now-line fraction to today's row only. See specs/agenda-view.
 */
export function MonthAgenda({
  cursor,
  activities,
  now,
  onSelectActivity,
  onCreateAt,
}: Props) {
  const todayKey = toDayKey(now);
  const isCurrentMonth =
    now.getFullYear() === cursor.year && now.getMonth() === cursor.month0;

  const dayKeys = useMemo(
    () => daysInMonth(cursor.year, cursor.month0),
    [cursor.year, cursor.month0],
  );

  const byDay = useMemo(() => {
    const map = new Map<string, Activity[]>();
    for (const activity of activities) {
      const list = map.get(activity.day);
      if (list) list.push(activity);
      else map.set(activity.day, [activity]);
    }
    return map;
  }, [activities]);

  const todayRef = useRef<HTMLDivElement>(null);
  // Auto-scroll to today when viewing the current month.
  useEffect(() => {
    if (isCurrentMonth && todayRef.current) {
      todayRef.current.scrollIntoView({ block: "center" });
    }
  }, [isCurrentMonth, cursor.year, cursor.month0]);

  const nowFraction = dayFractionFromDate(now);

  return (
    <div className="agenda">
      <HourAxis />
      <AgendaRows>
        {/* Single global now-line spanning all rows, current month only. */}
        {isCurrentMonth && (
          <div
            className="now-line-global"
            style={{
              left: `calc(var(--label-width) + (100% - var(--label-width)) * ${nowFraction})`,
            }}
            aria-hidden
          />
        )}
        {dayKeys.map((dayKey) => {
          const isToday = isCurrentMonth && dayKey === todayKey;
          return (
            <DayRow
              key={dayKey}
              ref={isToday ? todayRef : undefined}
              dayKey={dayKey}
              activities={byDay.get(dayKey) ?? []}
              isToday={isToday}
              onSelectActivity={onSelectActivity}
              onCreateAt={onCreateAt}
            />
          );
        })}
      </AgendaRows>
    </div>
  );
}
