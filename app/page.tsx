import { Exercise } from '@/app/types';
import List from '@/app/components/List'
import { SelectedExerciseProvider } from "@/app/context/SelectedExerciseContext";



interface HomeProps {
  exercises: Exercise[];
}

async function fetchExercises() {
  const res = await fetch(" https://candidate.staging.future.co/sandbox/api/exercises", { cache: "no-store" }); // cache: "no-store" ensures SSR
  if (!res.ok) {
    throw new Error("Failed to fetch exercises");
  }
  return res.json();
}

export default async function Page() {
  const exercises = await fetchExercises();

  return (
    <div className="flex sm:flex-col-reverse lg:flex-row h-full w-full">
    <div className="left-pane w-full sm:h-1/2 lg:h-full lg:w-1/3 2xl:w-1/4">
      <SelectedExerciseProvider>
          <List exercises={exercises} />
      </SelectedExerciseProvider>
    </div>
    <div className="right-pane hidden sm:block sm:h-1/2 lg:h-full bg-slate-600 grow"></div>
  </div>
  );
}
