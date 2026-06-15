import { useState } from "react";
import { useStore } from "./store";
import { useNow } from "./hooks/useNow";
import type { Activity } from "./types";
import { MonthNav } from "./components/MonthNav";
import { MonthAgenda } from "./components/MonthAgenda";
import { ActivityForm, type FormTarget } from "./components/ActivityForm";
import "./App.scss";

export default function App() {
  const {
    activities,
    cursor,
    stepMonth,
    addActivity,
    updateActivity,
    deleteActivity,
  } = useStore();
  const now = useNow();

  const [formTarget, setFormTarget] = useState<FormTarget | null>(null);

  function handleCreateAt(day: string) {
    setFormTarget({ mode: "create", day });
  }

  function handleSelectActivity(activity: Activity) {
    setFormTarget({ mode: "edit", activity });
  }

  function handleSave(activity: Activity) {
    if (formTarget?.mode === "edit") updateActivity(activity);
    else addActivity(activity);
    setFormTarget(null);
  }

  function handleDelete(id: string) {
    deleteActivity(id);
    setFormTarget(null);
  }

  return (
    <div className="app">
      <header className="app__header">
        <MonthNav cursor={cursor} onStep={stepMonth} />
      </header>

      <main className="app__main">
        <MonthAgenda
          cursor={cursor}
          activities={activities}
          now={now}
          onSelectActivity={handleSelectActivity}
          onCreateAt={handleCreateAt}
        />
      </main>

      {formTarget && (
        <ActivityForm
          target={formTarget}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={() => setFormTarget(null)}
        />
      )}
    </div>
  );
}
