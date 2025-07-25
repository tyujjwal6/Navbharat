// src/components/Reveal.jsx

import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The `y` prop now acts as a default for larger screens.
const Reveal = ({ children, y = 75 }) => {
  const el = useRef(null);

  useLayoutEffect(() => {
    const element = el.current;
    
    // Use GSAP Context for proper cleanup, which is essential with React's lifecycle.
    const ctx = gsap.context(() => {
      
      // <<< KEY CHANGE FOR RESPONSIVENESS
      // Use matchMedia to create different animations for different screen sizes.
      ScrollTrigger.matchMedia({
        
        // --- Desktop Animation (screens wider than 768px) ---
        "(min-width: 768px)": function() {
          gsap.fromTo(
            element.children,
            { y: y, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: element,
                start: 'top 90%',
                end: 'bottom 85%',
                scrub: 1.5,
              },
            }
          );
        },

        // --- Mobile Animation (screens 767px or less) ---
        "(max-width: 767px)": function() {
          // Use a smaller 'y' value for a more subtle effect on mobile.
          gsap.fromTo(
            element.children,
            { y: 50, opacity: 0 }, // Reduced from 75 to 50
            {
              y: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: element,
                start: 'top 95%', // Start a little later on mobile
                end: 'bottom 90%',
                scrub: 1.5,
              },
            }
          );
        },
      });

    }, el); // Scope the context to the component's root element

    // Cleanup function to revert all animations within the context
    return () => ctx.revert();

  }, [y]); // The dependency array is still useful

  // The overflow-hidden wrapper is crucial for the masking effect.
  return (
    <div ref={el} className="overflow-hidden py-1">
      {children}
    </div>
  );
};

export default Reveal;