"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Exercise } from "@/app/types";

interface SelectedExerciseContextType {
  selectedExercise: Exercise | null;
  setSelectedExercise: (exercise: Exercise | null) => void;
}

const SelectedExerciseContext = createContext<
  SelectedExerciseContextType | undefined
>(undefined);

export const SelectedExerciseProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  return (
    <SelectedExerciseContext.Provider
      value={{ selectedExercise, setSelectedExercise }}
    >
      {children}
    </SelectedExerciseContext.Provider>
  );
};

export const useSelectedExercise = () => {
  const context = useContext(SelectedExerciseContext);
  if (!context) {
    throw new Error(
      "useSelectedExercise must be used within a SelectedExerciseProvider",
    );
  }
  return context;
};
