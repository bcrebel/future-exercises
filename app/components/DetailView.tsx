'use client';

import { useState, useEffect } from 'react';
import { useSelectedExercise } from '@/app/context/SelectedExerciseContext';
import usePageResize from '../hooks/usePageResize';
import { Exercise } from '../types';

const MobilePreview = ({exercise}: {exercise: Exercise}) => {
    return <div className="bg-black w-full h-full">
        {exercise.video && <video controls className="h-full m-auto" src={exercise.video.url} />}
    </div>
}
 

const DetailViewScreen = () => {
    return <p>Desktop or fs mobile</p>
}

export default function DetailView() {
    const [ fullscreen, setFullscreen ] = useState<boolean>(false);
    const { selectedExercise } = useSelectedExercise();
    const isMobile = usePageResize();

 

    if(!selectedExercise) return <p>Loading...</p>

    if(isMobile) {
        return <>
            {fullscreen ? <DetailViewScreen /> : <MobilePreview exercise={selectedExercise} />}
        </>
    } 

    return <DetailViewScreen />
}