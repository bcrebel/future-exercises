"use client";

import React, { useState, useEffect } from "react";
import { useSelectedExercise } from "@/app/context/SelectedExerciseContext";
import usePageResize from "../hooks/usePageResize";
import { Exercise } from "../types";
import { capitalizeWords } from "../utils";
import CloseIcon from "../components/CloseIcon";

const MobilePreview = ({
  exercise,
  onClick,
}: {
  exercise: Exercise;
  onClick: () => void;
}) => {
  return (
    <div className="bg-black h-full w-full">
      {exercise.video && (
        <div className="relative h-full m-auto">
          <button
            onClick={onClick}
            className="bg-black px-3 py-1 text-white w-fit rounded-xl z-10 absolute left-0 right-0 top-5 m-auto"
          >
            Expand
          </button>
          <video
            className="h-full m-auto w-full object-cover"
            controls
            src={exercise.video.url}
          />
        </div>
      )}
    </div>
  );
};

const DetailViewScreen = function ({
  fullscreen,
  exercise,
  back,
}: {
  fullscreen: boolean;
  exercise: Exercise;
  back?: () => void;
}) {
  const [difficulty, setDifficulty] = useState(null);

  useEffect(() => {
    async function fetchDifficulty() {
      const response = await fetch(`/api/exercises/${exercise.id}/predictions`);
      if (!response.ok) {
        throw new Error("Failed to fetch exercise difficulty");
      }
      const { skill_level } = await response.json();
      setDifficulty(skill_level);
    }

    fetchDifficulty();

    return () => setDifficulty(null);
  }, [exercise.id]);

  return (
    <div
      className={`bg-white flex flex-col w-full h-full ${fullscreen && "fixed top-0 h-screen"}`}
    >
      {fullscreen && (
        <button
          className="absolute right-5 top-5 bg-white rounded-full p-3 z-20"
          onClick={back}
        >
          <CloseIcon />
        </button>
      )}
      <div className="bg-black w-full sm:h-1/2">
        <video
          className="h-full w-full object-cover m-auto lg:w-1/2"
          controls
          src={exercise.video?.url}
        />
      </div>
      <div className="p-5 overflow-y-auto">
        <h2 className="text-3xl font-bold my-3">{exercise.name}</h2>
        {!difficulty ? (
          <p>Loading difficulty...</p>
        ) : (
          <p>
            <span className="font-bold">Difficulty: </span>
            {`${difficulty["level"]}/${difficulty["max_level"]}`}
          </p>
        )}
        {exercise.synonyms && (
          <p>
            <span className="font-bold">Also known as: </span>
            {exercise.synonyms?.split(",").join(", ")}
          </p>
        )}
        {exercise.muscle_groups && (
          <p>
            <span className="font-bold">Muscle Groups: </span>
            {exercise.muscle_groups?.split(",").join(", ")}
          </p>
        )}
        {exercise.equipment_required && (
          <p>
            <span className="font-bold">Equipment required: </span>
            {exercise.equipment_required?.split(",").join(", ")}
          </p>
        )}
        {exercise.side && (
          <p>
            <span className="font-bold">Side: </span>
            {capitalizeWords(exercise.side.split("_")).join(" ")}
          </p>
        )}
        <p className="mt-2">{exercise.description}</p>
      </div>
    </div>
  );
};

export default function DetailView() {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const { selectedExercise } = useSelectedExercise();
  const isMobile = usePageResize();

  const toggleFullscreen = () => setFullscreen((prev) => !prev);

  if (!selectedExercise) return <p className="text-center">Loading...</p>;

  if (isMobile) {
    return (
      <>
        {fullscreen ? (
          <DetailViewScreen
            back={toggleFullscreen}
            exercise={selectedExercise}
            fullscreen={fullscreen}
          />
        ) : (
          <MobilePreview
            exercise={selectedExercise}
            onClick={toggleFullscreen}
          />
        )}
      </>
    );
  }

  return (
    <DetailViewScreen
      exercise={selectedExercise}
      fullscreen={isMobile && fullscreen}
    />
  );
}
