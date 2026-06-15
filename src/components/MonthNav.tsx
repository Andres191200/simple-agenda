import { monthTitle } from "../lib/time";
import type { MonthCursor } from "../store";

interface Props {
  cursor: MonthCursor;
  onStep: (delta: number) => void;
}

/** Centered month title with ◀ / ▶ controls. See specs/agenda-view. */
export function MonthNav({ cursor, onStep }: Props) {
  return (
    <div className="month-nav">
      <button
        type="button"
        className="month-nav__btn"
        aria-label="Previous month"
        onClick={() => onStep(-1)}
      >
        ◀
      </button>
      <h1 className="month-nav__title">
        {monthTitle(cursor.year, cursor.month0)}
      </h1>
      <button
        type="button"
        className="month-nav__btn"
        aria-label="Next month"
        onClick={() => onStep(1)}
      >
        ▶
      </button>
    </div>
  );
}
