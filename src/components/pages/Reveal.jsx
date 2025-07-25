// src/components/Reveal.jsx

import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// <<< The `delay` and `duration` props are less relevant for scrub animations,
// so we can simplify the component's API.
const Reveal = ({ children, y = 75 }) => {
  const el = useRef(null);

  useLayoutEffect(() => {
    const element = el.current;
    
    // Animate the element's children
    gsap.fromTo(
      element.children,
      {
        y: y,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        ease: 'none', // Use 'none' for a linear feel that matches scroll speed
        scrollTrigger: {
          trigger: element,
          start: 'top 90%', // When the top of the element hits 90% down the viewport
          end: 'bottom 85%', // When the bottom of the element hits 85% down the viewport
          
          // <<< KEY CHANGE HERE
          // This links the animation directly to the scrollbar.
          // A value of 1.5 adds a 1.5-second smoothing "lag", which makes it feel deliberate and slow.
          scrub: 1.5,
        },
      }
    );
  }, [y]);

  // The overflow-hidden wrapper is crucial for the masking effect.
  // Adding a little padding can prevent visual clipping at the start/end of the animation.
  return (
    <div ref={el} className="overflow-hidden py-1">
      {children}
    </div>
  );
};

export default Reveal;