/**
 * App store: single source of truth for activities + selected month.
 * Loads from localStorage on init and persists on every activity mutation.
 * See design.md D6.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Activity } from "./types";
import { loadActivities, saveActivities } from "./lib/storage";

export interface MonthCursor {
  year: number;
  /** 0-based month. */
  month0: number;
}

interface State {
  activities: Activity[];
  cursor: MonthCursor;
}

type Action =
  | { type: "add"; activity: Activity }
  | { type: "update"; activity: Activity }
  | { type: "delete"; id: string }
  | { type: "setMonth"; cursor: MonthCursor }
  | { type: "stepMonth"; delta: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add":
      return { ...state, activities: [...state.activities, action.activity] };
    case "update":
      return {
        ...state,
        activities: state.activities.map((a) =>
          a.id === action.activity.id ? action.activity : a,
        ),
      };
    case "delete":
      return {
        ...state,
        activities: state.activities.filter((a) => a.id !== action.id),
      };
    case "setMonth":
      return { ...state, cursor: action.cursor };
    case "stepMonth": {
      const next = new Date(
        state.cursor.year,
        state.cursor.month0 + action.delta,
        1,
      );
      return {
        ...state,
        cursor: { year: next.getFullYear(), month0: next.getMonth() },
      };
    }
    default:
      return state;
  }
}

interface StoreValue extends State {
  addActivity: (activity: Activity) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  setMonth: (cursor: MonthCursor) => void;
  stepMonth: (delta: number) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function initState(now: Date): State {
  return {
    activities: loadActivities(),
    cursor: { year: now.getFullYear(), month0: now.getMonth() },
  };
}

export function StoreProvider({
  children,
  now = new Date(),
}: {
  children: ReactNode;
  now?: Date;
}) {
  const [state, dispatch] = useReducer(reducer, now, initState);

  // Persist whenever the activity list changes.
  useEffect(() => {
    saveActivities(state.activities);
  }, [state.activities]);

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      addActivity: (activity) => dispatch({ type: "add", activity }),
      updateActivity: (activity) => dispatch({ type: "update", activity }),
      deleteActivity: (id) => dispatch({ type: "delete", id }),
      setMonth: (cursor) => dispatch({ type: "setMonth", cursor }),
      stepMonth: (delta) => dispatch({ type: "stepMonth", delta }),
    }),
    [state],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within a StoreProvider");
  return value;
}
