import { useCallback, useEffect, useRef, useState } from "react";

// Small pill notification at the bottom of the screen.
//   const { message, showToast } = useToast();
//   showToast("Saved!", 3000);
export default function useToast() {
  const [message, setMessage] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback((text, duration = 4200) => {
    clearTimeout(timer.current);
    setMessage(text);
    timer.current = setTimeout(() => setMessage(null), duration);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { message, showToast };
}
