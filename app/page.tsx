import { Exercise } from "@/app/types";
import List from "@/app/components/List";
import DetailView from "@/app/components/DetailView";
import { SelectedExerciseProvider } from "@/app/context/SelectedExerciseContext";

async function fetchExercises() {
  const res = await fetch(
    " https://candidate.staging.future.co/sandbox/api/exercises",
    { cache: "no-store" },
  );
  if (!res.ok) {
    throw new Error("Failed to fetch exercises");
  }
  return res.json();
}

export default async function Page() {
  const exercises: Exercise[] = await fetchExercises();

  return (
    <div className="flex flex-col-reverse lg:flex-row h-[calc(100%-64px)] w-full">
      <SelectedExerciseProvider>
        <div className="left-pane w-full h-2/3 sm:h-1/2 lg:h-full lg:w-1/3 2xl:w-1/4">
          <List exercises={exercises} />
        </div>
        <div className="right-pane w-full h-1/3 sm:h-1/2 lg:h-full">
          <DetailView />
        </div>
      </SelectedExerciseProvider>
    </div>
  );
}
