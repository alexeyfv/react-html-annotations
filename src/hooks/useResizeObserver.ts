import { useLayoutEffect } from "react";

export default function useResizeObserver(
  id: string,
  callback: (p: { w: number; h: number }) => void
) {
  useLayoutEffect(() => {
    const element = document.getElementById(id);
    if (element == null) return;
    const observer = new ResizeObserver(() => {
      callback({ w: element.offsetWidth, h: element.offsetHeight });
    });
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [id, callback]);
}
