import { useEffect, useRef } from "react";
import CloseIcon from "@/app/components/CloseIcon";

export default function Modal({
  children,
  onClick,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div role="dialog">
      <div className="scrim top-0 fixed w-full h-full bg-black bg-opacity-50 z-10" />
      <div className="absolute top-0 bottom-0 flex items-end sm:justify-center sm:items-center w-full h-full z-20">
        <div
          ref={modalRef}
          className="overflow-scroll relative bg-white w-full h-[90%] sm:w-2/3 sm:h-3/4 lg:w-1/2 p-8 rounded-md shadow-lg "
        >
          <button onClick={onClick} className="absolute right-5 top-5">
            <CloseIcon />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
