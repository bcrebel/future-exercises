'use client';

import { Suspense, use, useState, useEffect } from 'react';
import { useSelectedExercise } from '@/app/context/SelectedExerciseContext';
import usePageResize from '../hooks/usePageResize';
import { Exercise } from '../types';

function capitalizeWords(words: string[]): string[] {
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

async function fetchExerciseDifficulty(exerciseId: string): Promise<string> {
    const response = await fetch(
      `https://candidate.staging.future.co/sandbox/api/exercises/${exerciseId}/predictions`);
    if (!response.ok) {
      throw new Error('Failed to fetch exercise difficulty');
    }
    const data = await response.json();
    return data.skill_level.level;
  }
  
  const ExerciseDifficulty = ({ exerciseId }: { exerciseId: string }) => {
    const difficulty = use(fetchExerciseDifficulty(exerciseId));
    return <p>Difficulty: {difficulty}</p>;
  };

const MobilePreview = ({ exercise, onClick }: {exercise: Exercise, onClick: () => void}) => {
    return <div className="bg-black h-full w-full">
        {exercise.video && <div className="relative h-full w-fit m-auto">
            <button onClick={onClick}className="z-10 absolute left-0 right-0 top-5 m-auto">Expand</button>
            <video className="h-full m-auto" controls src={exercise.video.url} />
        </div>}
    </div>
}
 

const DetailViewScreen = ({fullscreen, exercise, back }: {fullscreen: boolean, exercise: Exercise, back?: () => void}) => {
    return <div className={`bg-white ${fullscreen && 'fixed top-0 w-full h-screen'}`}>
        {fullscreen && <div className='w-full'><button onClick={back}>Back</button></div>}
        <h2>{exercise.name}</h2>
        <video controls src={exercise.video?.url} />
        <Suspense fallback={<p>Loading difficulty...</p>}>
            <ExerciseDifficulty exerciseId={exercise.id} />
        </Suspense>
        <p>{exercise.description}</p>
        {exercise.synonyms && <p>Also known as: {exercise.synonyms?.split(',').join(', ')}</p>}
        {exercise.muscle_groups && <p>Muscle Groups: {exercise.muscle_groups?.split(',').join(', ')}</p>}
        {exercise.equipment_required && <p>Equipment required: {exercise.equipment_required?.split(',').join(', ')}</p>}
        {exercise.side && <p>Side: {capitalizeWords(exercise.side.split('_')).join(' ')}</p>}
        
    </div>
}

export default function DetailView() {
    const [ fullscreen, setFullscreen ] = useState<boolean>(false);
    const { selectedExercise } = useSelectedExercise();
    const isMobile = usePageResize();

    const toggleFullscreen = () => {
        setFullscreen((prev) => !prev)
    }

    if(!selectedExercise) return <p>Loading...</p>

    if(isMobile) {
        return <>
            {fullscreen ? <DetailViewScreen back={toggleFullscreen} exercise={selectedExercise} fullscreen={fullscreen} /> : <MobilePreview exercise={selectedExercise} onClick={toggleFullscreen} />}
        </>
    } 

    return <DetailViewScreen  exercise={selectedExercise} fullscreen={isMobile && fullscreen}/>
}