"use client";

import React, { useState, useEffect, useRef } from "react";
import { useVirtualizer, Virtualizer, VirtualItem } from "@tanstack/react-virtual";
import { Exercise } from "@/app/types";
import { useSelectedExercise } from "@/app/context/SelectedExerciseContext";
import { useSearchParams, useRouter } from "next/navigation";
import FilterIcon from "@/app/components/FilterIcon";
import Modal from "@/app/components/Modal";

export default function ExerciseList({ exercises }: { exercises: Exercise[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedExercise, setSelectedExercise } = useSelectedExercise();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const previousFilteredExercises = useRef<Exercise[] | null>(null);

  const muscleGroupOptions = [
    "Abs",
    "Biceps",
    "Calves",
    "Chest",
    "Glutes",
    "Hamstrings",
    "Lats",
    "Lower Back",
    "Middle Back",
    "Obliques",
    "Quads",
    "Shoulders",
    "Traps",
    "Triceps",
  ];

  const equipmentOptions = [
    "Dumbbell",
    "Yoga Mat",
    "Barbell",
    "Kettlebell",
    "Box",
    "Medicine Ball",
    "Cable Resistance Machine",
    "Resistance Band",
    "Stability Ball",
    "Treadmill",
    "Jump Rope",
    "Elliptical",
    "Suspension Trainer",
    "Foam Roll",
    "Pull-Up Bar",
    "Bench",
    "Plate",
  ];

  const toggleModal = () => setModalOpen((prev) => !prev);

  const handleMuscleGroupChange = (group: string) => {
    setSelectedMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleEquipmentChange = (equipment: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipment)
        ? prev.filter((e) => e !== equipment)
        : [...prev, equipment]
    );
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearchQuery = exercise.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesMuscleGroups =
      selectedMuscleGroups.length === 0 ||
      selectedMuscleGroups.every((group) => {
        return exercise.muscle_groups?.includes(group);
      });

    const matchesEquipment =
      selectedEquipment.length === 0 ||
      exercise.equipment_required === null ||
      selectedEquipment.some((equipment) =>
        exercise.equipment_required?.includes(equipment)
      );

    return matchesSearchQuery && matchesMuscleGroups && matchesEquipment;
  });

  useEffect(() => {
    const exerciseId = searchParams.get("exerciseId");
    const selectedFromUrl =
      exerciseId && exercises.find((exercise) => exercise.id === exerciseId);

    if (selectedFromUrl && selectedFromUrl !== selectedExercise) {
      setSelectedExercise(selectedFromUrl);
    } else if (!selectedFromUrl && filteredExercises.length > 0) {
      setSelectedExercise(exercises[0]);
    }
  }, []);

  useEffect(() => {
    const currentId = searchParams.get("exerciseId");
    if (selectedExercise && currentId !== String(selectedExercise.id)) {
      router.push(`?exerciseId=${selectedExercise.id}`);
    }
  }, [selectedExercise, searchParams, router]);

  useEffect(() => {
    if (!previousFilteredExercises.current) {
      previousFilteredExercises.current = filteredExercises;
      return;
    }

    if (
      JSON.stringify(previousFilteredExercises.current) !==
      JSON.stringify(filteredExercises)
    ) {
      if (filteredExercises.length > 0) {
        setSelectedExercise(filteredExercises[0]);
      } else {
        setSelectedExercise(null);
      }
    }

    previousFilteredExercises.current = filteredExercises;
  }, [filteredExercises]);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement> = useVirtualizer({
    count: filteredExercises.length, 
    getScrollElement: () => parentRef.current, 
    estimateSize: () => 110, 
  });

  return (
    <>
      <div className="flex gap-x-2 p-3 mx-auto w-full border-b-[1px] border-gray-300">
        <input
          placeholder="Search"
          className="border rounded grow h-10 pl-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={toggleModal}>
          <FilterIcon />
        </button>
      </div>
      <div
        ref={parentRef}
        className="overflow-y-auto h-[calc(100%-64px)] bg-gray-100 shadow-sm"
      >
        {filteredExercises.length > 0 ? (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`, 
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
              const exercise = filteredExercises[virtualRow.index];

              return (
                <div
                  key={exercise.id}
                  ref={rowVirtualizer.measureElement}  
                  data-index={virtualRow.index}              
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: `translateY(${virtualRow.start}px)`,
                    width: "100%",
                  }}
                  className={`flex flex-col justify-start text-left p-3 shadow-sm border-t-[1px] hover:bg-gray-50 ${
                    selectedExercise?.id === exercise.id ? 'bg-gray-100' : 'bg-white'
                  }`}
                  onClick={() => setSelectedExercise(exercise)}
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
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>No results found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
      {/* Filter Modal */}
      {isModalOpen && (
        <Modal onClick={toggleModal}>
          <h2 className="text-lg font-bold">Filter Options</h2>
          <h3 className="uppercase text-xs font-semibold mt-8">
            Muscle Groups
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {muscleGroupOptions.map((group) => (
              <div key={group}>
                <label>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedMuscleGroups.includes(group)}
                    onChange={() => handleMuscleGroupChange(group)}
                  />
                  {group}
                </label>
              </div>
            ))}
          </div>
          <h3 className="uppercase text-xs font-semibold mt-8">
            Available Equipment
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {equipmentOptions.map((equipment) => (
              <div key={equipment}>
                <label>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedEquipment.includes(equipment)}
                    onChange={() => handleEquipmentChange(equipment)}
                  />
                  {equipment}
                </label>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
