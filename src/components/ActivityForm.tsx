import { useState } from "react";
import { ACTIVITY_COLORS, type Activity } from "../types";
import { validateDraft } from "../lib/validation";

/**
 * What the form was opened with: either an existing activity (edit mode) or a
 * day to prefill (create mode). See specs/activity-management.
 */
export type FormTarget =
  | { mode: "create"; day: string }
  | { mode: "edit"; activity: Activity };

interface Props {
  target: FormTarget;
  onSave: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `a_${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
}

export function ActivityForm({ target, onSave, onDelete, onCancel }: Props) {
  const existing = target.mode === "edit" ? target.activity : null;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [day, setDay] = useState(
    target.mode === "edit" ? target.activity.day : target.day,
  );
  const [start, setStart] = useState(existing?.start ?? "09:00");
  const [end, setEnd] = useState(existing?.end ?? "10:00");
  const [color, setColor] = useState(existing?.color ?? ACTIVITY_COLORS[0]);
  const [description, setDescription] = useState(existing?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const draft = { title, day, start, end };
    const message = validateDraft(draft);
    if (message) {
      setError(message);
      return;
    }
    onSave({
      id: existing?.id ?? newId(),
      title: title.trim(),
      description: description.trim(),
      color,
      day,
      start,
      end,
    });
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <form
        className="activity-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className="activity-form__heading">
          {existing ? "Edit activity" : "New activity"}
        </h2>

        <label className="field">
          <span>Title</span>
          <input
            type="text"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Standup"
          />
        </label>

        <label className="field">
          <span>Day</span>
          <input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Start</span>
            <input
              type="time"
              step={900}
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>
          <label className="field">
            <span>End</span>
            <input
              type="time"
              step={900}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
        </div>

        <fieldset className="field swatches">
          <legend>Color</legend>
          {ACTIVITY_COLORS.map((c) => (
            <button
              type="button"
              key={c}
              className={`swatch${c === color ? " swatch--active" : ""}`}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
              aria-pressed={c === color}
              onClick={() => setColor(c)}
            />
          ))}
        </fieldset>

        <label className="field">
          <span>Notes</span>
          <textarea
            value={description}
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        {error && <p className="activity-form__error">{error}</p>}

        <div className="activity-form__actions">
          {existing && (
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => onDelete(existing.id)}
            >
              Delete
            </button>
          )}
          <span className="spacer" />
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
