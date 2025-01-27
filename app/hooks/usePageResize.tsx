'use client';

import { useState, useEffect } from "react";
import throttle from "lodash.throttle";

function usePageResize(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = throttle(() => {
      setIsMobile(window.innerWidth <= 1024);
    }, 200);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
}

export default usePageResize;
