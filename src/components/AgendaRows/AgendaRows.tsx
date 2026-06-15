import { useState, type ReactNode, type MouseEvent } from "react";
import "./AgendaRows.scss";

/**
 * Wraps the day-rows and shows a cursor-following "New activity" hint while
 * hovering empty track space. Hint state lives here (not in MonthAgenda) so a
 * mouse move doesn't re-render the row list / re-run packing. The rows are
 * passed as `children`, so they stay referentially stable across hint updates.
 */
export function AgendaRows({ children }: { children: ReactNode }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  function handleMove(e: MouseEvent) {
    const target = e.target as HTMLElement;
    // Don't show the create hint while hovering an existing activity bar.
    if (target.closest(".activity-bar")) {
      setPos(null);
      return;
    }
    if (target.closest(".day-row__track")) {
      setPos({ x: e.clientX, y: e.clientY });
    } else {
      setPos(null);
    }
  }

  return (
    <div
      className="agenda__rows"
      onMouseMove={handleMove}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {pos && (
        <div
          className="hover-hint"
          style={{ left: pos.x, top: pos.y }}
          aria-hidden
        >
          New activity
        </div>
      )}
    </div>
  );
}
