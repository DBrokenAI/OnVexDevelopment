import { listTasks } from "@/lib/tasks";
import { Calendar } from "@/components/tasks/calendar";

type SearchParams = Promise<{ y?: string; m?: string }>;

function parseMonth(sp: { y?: string; m?: string }): { year: number; month: number } {
  const now = new Date();
  const year = sp.y ? Number(sp.y) : now.getFullYear();
  const monthOneIndexed = sp.m ? Number(sp.m) : now.getMonth() + 1;
  const safeYear = Number.isFinite(year) ? year : now.getFullYear();
  const safeMonth = Number.isFinite(monthOneIndexed) ? monthOneIndexed : now.getMonth() + 1;
  return { year: safeYear, month: Math.min(12, Math.max(1, safeMonth)) - 1 };
}

export default async function CalendarPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const { year, month } = parseMonth(sp);
  const tasks = await listTasks();

  return <Calendar tasks={tasks} year={year} month={month} />;
}
