export interface Exercise {
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