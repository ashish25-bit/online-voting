import { useEffect } from "react";

export default function useTitle(title) {
  useEffect(() => {
    console.log('use effect title')
    const prevTitle = document.title;
    document.title = title;
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
