export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscle_groups?: string;
  equipment_required?: string;
  movement_patterns?: string;
  synonyms?: string;
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

export interface SelectedExerciseContextType {
  selectedExercise: Exercise | null;
  setSelectedExercise: (exercise: Exercise | null) => void;
}
