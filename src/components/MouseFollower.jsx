import { useEffect, useRef } from 'react';
import './MouseFollower.css';

// Smooth, slow trailing cursor: a small orange dot that tracks the pointer
// and a larger ring that lerps behind it. Disabled on touch devices and
// when the user prefers reduced motion.
const MouseFollower = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('has-mouse-follower');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf;
    let visible = false;

    const EASE = 0.09; // lower = slower, smoother trail

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onOver = (e) => {
      const interactive = e.target.closest('a, button, [role="button"], input, textarea, select, .project-row-media');
      ring.classList.toggle('is-active', Boolean(interactive));
    };

    const loop = () => {
      ringX += (mouseX - ringX) * EASE;
      ringY += (mouseY - ringY) * EASE;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('has-mouse-follower');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="mouse-follower-ring" aria-hidden="true" />
      <div ref={dotRef} className="mouse-follower-dot" aria-hidden="true" />
    </>
  );
};

export default MouseFollower;
