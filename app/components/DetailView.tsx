'use client';

import React, { useState, useCallback, useEffect, } from 'react';
import { useSelectedExercise } from '@/app/context/SelectedExerciseContext';
import usePageResize from '../hooks/usePageResize';
import { Exercise } from '../types';
import { capitalizeWords } from '../utils';

const MobilePreview = ({ exercise, onClick }: {exercise: Exercise, onClick: () => void}) => {
    return <div className="bg-black h-full w-full">
        {exercise.video && <div className="relative h-full m-auto">
            <button onClick={onClick}className="bg-black px-3 py-1 text-white w-fit rounded-xl z-10 absolute left-0 right-0 top-5 m-auto">Expand</button>
            <video className="h-full m-auto w-full object-cover" controls src={exercise.video.url} />
        </div>}
    </div>
}

const CloseIcon = () => (
    <svg width="20" height="20" opacity="1" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.10547 18.4453C1.20703 18.5469 1.32422 18.6133 1.45703 18.6445C1.59766 18.6836 1.73438 18.6836 1.86719 18.6445C2 18.6133 2.11719 18.5469 2.21875 18.4453L10 10.6758L17.7695 18.4453C17.8633 18.5469 17.9766 18.6133 18.1094 18.6445C18.25 18.6836 18.3867 18.6875 18.5195 18.6562C18.6602 18.625 18.7812 18.5547 18.8828 18.4453C18.9844 18.3438 19.0508 18.2266 19.082 18.0938C19.1133 17.9609 19.1133 17.8281 19.082 17.6953C19.0508 17.5547 18.9844 17.4336 18.8828 17.332L11.1133 9.5625L18.8828 1.78125C18.9844 1.67969 19.0508 1.5625 19.082 1.42969C19.1211 1.29688 19.1211 1.16406 19.082 1.03125C19.0508 0.890625 18.9844 0.773438 18.8828 0.679688C18.7734 0.570313 18.6523 0.5 18.5195 0.46875C18.3867 0.429688 18.25 0.429688 18.1094 0.46875C17.9766 0.5 17.8633 0.570313 17.7695 0.679688L10 8.44922L2.21875 0.679688C2.11719 0.570313 1.99609 0.5 1.85547 0.46875C1.72266 0.429688 1.58984 0.429688 1.45703 0.46875C1.32422 0.5 1.20703 0.570313 1.10547 0.679688C1.00391 0.773438 0.933594 0.890625 0.894531 1.03125C0.863281 1.16406 0.863281 1.29688 0.894531 1.42969C0.933594 1.5625 1.00391 1.67969 1.10547 1.78125L8.875 9.5625L1.10547 17.332C1.00391 17.4336 0.933594 17.5547 0.894531 17.6953C0.863281 17.8281 0.863281 17.9609 0.894531 18.0938C0.925781 18.2266 0.996094 18.3438 1.10547 18.4453Z" fill="#010703"></path></svg>
)

const DetailViewScreen = function({fullscreen, exercise, back }: {fullscreen: boolean, exercise: Exercise, back?: () => void}) {
    const [difficulty, setDifficulty] = useState(null)

    useEffect(() => {
        async function fetchDifficulty() {
            const response = await fetch(`/api/exercises/${exercise.id}/predictions`);
            if (!response.ok) {
                throw new Error('Failed to fetch exercise difficulty');
            }
            const { skill_level } = await response.json();
            setDifficulty(skill_level);
        }

        fetchDifficulty()
    }, [exercise.id])

        return <div className={`bg-white flex flex-col w-full h-full ${fullscreen && 'fixed top-0 h-screen'}`}>
        {fullscreen && <button className="absolute right-5 top-5 bg-white rounded-full p-3 z-20" onClick={back}><CloseIcon /></button>}
        <div className="bg-black w-full sm:h-1/2">
            <video className="h-full w-full object-cover m-auto lg:w-1/2" controls src={exercise.video?.url} />
        </div>
        <div className="p-5 overflow-y-auto">
            <h2 className="text-3xl font-bold my-3">{exercise.name}</h2>
            {!difficulty ? <p>Loading difficulty</p> : <p><span className="font-bold">Difficulty: </span>{`${difficulty['level']}/${difficulty['max_level']}`}</p> }
            {exercise.synonyms && <p><span className="font-bold">Also known as: </span>{exercise.synonyms?.split(',').join(', ')}</p>}
            {exercise.muscle_groups && <p><span className="font-bold">Muscle Groups: </span>{exercise.muscle_groups?.split(',').join(', ')}</p>}
            {exercise.equipment_required && <p><span className="font-bold">Equipment required: </span>{exercise.equipment_required?.split(',').join(', ')}</p>}
            {exercise.side && <p><span className="font-bold">Side: </span>{capitalizeWords(exercise.side.split('_')).join(' ')}</p>}
            <p className="mt-2">{exercise.description}</p>
        </div>
    </div>
}

export default function DetailView() {
    const [ fullscreen, setFullscreen ] = useState<boolean>(false);
    const { selectedExercise } = useSelectedExercise();
    const isMobile = usePageResize();

    const toggleFullscreen = () => setFullscreen((prev) => !prev)

    if(!selectedExercise) return <p className="text-center">Loading...</p>

    if(isMobile) {
        return <>
            {fullscreen ? <DetailViewScreen back={toggleFullscreen} exercise={selectedExercise} fullscreen={fullscreen} /> : <MobilePreview exercise={selectedExercise} onClick={toggleFullscreen} />}
        </>
    } 

    return <DetailViewScreen exercise={selectedExercise} fullscreen={isMobile && fullscreen}/>
}