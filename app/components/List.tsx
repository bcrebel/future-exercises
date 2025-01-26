'use client';

import React, { useState } from "react";

interface Exercise {
  id: number;
  name: string;
  description?: string;
  muscle_groups?: string;
  equipment_required?: string;
  movement_patterns?: string;
  synonyms?: string[];
  side?: string;
  is_alternating?: boolean;
  video?: {
    is_flipped?: boolean;
    url?: string;
  };
  audio?: {
    url?: string;
  };
}

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

export default function List({ exercises }: { exercises: Exercise[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  
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
  
    return (
      <>
        {/* Search and Filter UI */}
        <div className="flex gap-x-2 py-3 mx-auto w-[90%]">
          <input
            placeholder="Search"
            className="border rounded grow h-10 pl-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={toggleModal}>Filter</button>
        </div>
        {/* Filtered Exercises */}
        <div className="overflow-y-auto h-[calc(100%-130px)] shadow-sm">
          <div className="list flex flex-col gap-y-3 mx-auto items-center">
            {filteredExercises.map((exercise) => (
              <button
                className="flex flex-col justify-start text-left p-3 border rounded w-[90%]"
                key={exercise.id}
              >
                <p className="text-l font-bold">{exercise.name}</p>
                <div className="flex gap-x-1 mt-2">
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
          </div>
        </div>
        {/* Filter Modal */}
        {isModalOpen && (<div role="dialog">
            <div className="scrim top-0 fixed w-full h-full bg-black bg-opacity-50"/>
            <div className="absolute top-0 bottom-0 flex items-end sm:justify-center sm:items-center w-full h-full">
                <div className="overflow-scroll relative bg-white w-full h-[90%] sm:w-2/3 sm:h-3/4 lg:w-1/2 p-8 rounded-md shadow-lg ">
                    <button
                        onClick={toggleModal}
                        className="sticky text-right w-full right-0 top-0"
                    >
                        Close
                    </button>
                    <h2 className="text-lg font-bold">Filter Options</h2>
                    <h3 className="text-md font-semibold mt-4">Muscle Groups</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2">
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
                    <h3 className="text-md font-semibold mt-4">Available Equipment</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2">
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
        </div>)}
      </>
    );
  }
  
