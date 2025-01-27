'use client';
import React, { useState, useEffect, useRef } from "react";
import { Exercise } from "@/app/types";
import { useSelectedExercise } from "@/app/context/SelectedExerciseContext";
import { useSearchParams, useRouter } from "next/navigation"; 

export default function List({ exercises }: { exercises: Exercise[] }) {
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
      selectedMuscleGroups.some((group) =>
        exercise.muscle_groups?.split(",").map((g) => g.trim()).includes(group)
      );

    const matchesEquipment =
      selectedEquipment.length === 0 ||
      exercise.equipment_required === null ||
      selectedEquipment.some((equipment) =>
        exercise.equipment_required
          ?.split(",")
          .map((e) => e.trim())
          .includes(equipment)
      );

    return matchesSearchQuery && matchesMuscleGroups && matchesEquipment;
  });

  useEffect(() => {
    console.log('first')
    const exerciseId = searchParams.get("exerciseId");
    const selectedFromUrl =
      exerciseId &&
      exercises.find((exercise) => exercise.id === exerciseId);

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
    if(!previousFilteredExercises.current) {
        previousFilteredExercises.current = filteredExercises;
        return
    }

    if (
        JSON.stringify(previousFilteredExercises.current) !== JSON.stringify(filteredExercises)
    ) {
      if (filteredExercises.length > 0) {
        setSelectedExercise(filteredExercises[0]);
      } else {
        setSelectedExercise(null);
      }
    }

    previousFilteredExercises.current = filteredExercises;
  }, [filteredExercises]);

  return (
    <>
      <div className="flex gap-x-2 py-3 mx-auto w-[90%]">
        <input
          placeholder="Search"
          className="border rounded grow h-10 pl-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={toggleModal}>Filter</button>
      </div>
      <div className="overflow-y-auto h-[calc(100%-112px)] bg-gray-100 py-3 shadow-sm">
        {filteredExercises.length > 0 ? (<div className="list flex flex-col gap-y-3 mx-auto items-center">
          {filteredExercises.map((exercise) => (
            <button
              className={`flex flex-col bg-white justify-start text-left p-3 shadow-sm rounded w-[90%] hover:outline ${
                selectedExercise?.id === exercise.id ? "outline outline-blue-500" : "hover:outline-blue-200"
              }`}
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)} 
            >
              <p className="text-l font-bold">{exercise.name}</p>
              <div className="flex flex-wrap gap-x-1 mt-2">
                {exercise.muscle_groups
                  ?.split(",")
                  .map((group, idx) => (
                    <p
                      className="text-sm border rounded p-1 px-2 lowercase"
                      key={idx}
                    >
                      {group}
                    </p>
                  ))}
              </div>
            </button>
          ))}
        </div>) : (
            <div className="text-center text-gray-500 py-10">
                <p>No results found. Try adjusting your search or filters.</p>
            </div>
        )}
      </div>
      {/* Filter Modal */}
        {isModalOpen && (<div role="dialog">
            <div className="scrim top-0 fixed w-full h-full bg-black bg-opacity-50 z-10"/>
            <div className="absolute top-0 bottom-0 flex items-end sm:justify-center sm:items-center w-full h-full z-20">
                <div className="overflow-scroll relative bg-white w-full h-[90%] sm:w-2/3 sm:h-3/4 lg:w-1/2 p-8 rounded-md shadow-lg ">
                    <button
                       onClick={toggleModal}
                        className="sticky text-right w-full right-0 top-0"
                    >
                        Close
                    </button>
                    <h2 className="text-lg font-bold">Filter Options</h2>
                    <h3 className="uppercase text-xs font-semibold mt-8">Muscle Groups</h3>
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
                    <h3 className="uppercase text-xs font-semibold mt-8">Available Equipment</h3>
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
                </div>
            </div>
        </div>)};
    </>
  );
}
