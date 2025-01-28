import { useRef } from "react";
import { Exercise } from "@/app/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { SelectedExerciseContextType } from "@/app/types";

type ExerciseVirtualizerProps = {
  exercises: Exercise[];
  selectedExercise: SelectedExerciseContextType["selectedExercise"];
  onClick: SelectedExerciseContextType["setSelectedExercise"];
};

export default function ExerciseVirtualizer({
  exercises,
  onClick,
  selectedExercise,
}: ExerciseVirtualizerProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: exercises.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 90,
  });

  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      style={{ contain: "strict" }}
      className="relative overflow-y-auto h-[calc(100%-64px)] bg-gray-100 shadow-sm"
    >
      <div
        style={{
          height: "virtualizer.getTotalSize()",
          width: "100%",
          position: "relative",
        }}
      >
        <p className="absolute w-full text-center mt-3">Loading...</p>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${items[0]?.start ?? 0}px)`,
          }}
        >
          {items.map((virtualRow) => {
            const exercise: Exercise = exercises[virtualRow.index];

            return (
              <div
                key={virtualRow.key}
                ref={virtualizer.measureElement}
                data-index={virtualRow.index}
                className={`flex flex-col justify-start text-left p-3 shadow-sm border-t-[1px] hover:bg-gray-50 ${
                  selectedExercise?.id === exercise.id
                    ? "bg-gray-100"
                    : "bg-white"
                }`}
                onClick={() => onClick(exercise)}
              >
                <p className="text-l font-bold">{exercise.name}</p>
                <div className="flex flex-wrap gap-x-1 mt-2">
                  {exercise.muscle_groups?.split(",").map((group, idx) => (
                    <p
                      className="text-sm border rounded p-1 px-2 lowercase"
                      key={idx}
                    >
                      {group}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
