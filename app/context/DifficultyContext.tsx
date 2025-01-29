"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Difficulty = {
  level: number;
  max_level: number;
};

type DifficultyContextType = {
  difficultyCache: Map<string, Difficulty> | null;
  setDifficultyCache: React.Dispatch<
    React.SetStateAction<Map<string, Difficulty>>
  >;
};

export const DifficultyContext = createContext<DifficultyContextType | null>(
  null,
);

const DifficultyProvider = ({ children }: { children: ReactNode }) => {
  const [difficultyCache, setDifficultyCache] = useState(
    new Map<string, Difficulty>(null),
  );

  return (
    <DifficultyContext.Provider value={{ difficultyCache, setDifficultyCache }}>
      {children}
    </DifficultyContext.Provider>
  );
};

const useDifficulty = () => {
  const context = useContext(DifficultyContext);
  if (!context) {
    throw new Error("useDifficulty must be used within a DifficultyProvider");
  }
  return context;
};

export { DifficultyProvider, useDifficulty };
