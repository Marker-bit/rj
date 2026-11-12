"use client";

import { useStreakEvents } from "./streak-context";
import StreakBlock from "./streak-block";

export function StreakInfo() {
  return <StreakBlock events={useStreakEvents()} />;
}
