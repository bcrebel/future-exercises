import useSWR from "swr";
import { Exercise } from '@/app/types'

interface Difficulty {
    exercise_id: string;
    predicted_at: string,
    skill_level: {
        level: number;
        max_level: number;
        prediction_confidence: null | number;
    },
    prediction_time_cost_millis: number;
}

const fetcher = async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return response.json();
  };

export default function useDifficulty (id: Exercise['id']) {
    const { data, error, isLoading } = useSWR(`/api/exercises/${id}/predictions`, fetcher<Difficulty>);
   
    return {
      difficulty: data?.skill_level,
      isLoading,
      isError: error
    }
  }