"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Exercise, SelectedExerciseContextType } from "@/app/types";

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
