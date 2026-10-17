import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    let trailId = 0;
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);

      // Add trail particles
      setTrail((prev) => {
        const newTrail = [
          ...prev,
          { x: e.clientX - 4, y: e.clientY - 4, id: trailId++ },
        ];
        return newTrail.slice(-8);
      });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveElement = target.closest('a, button, [role="button"], input, textarea, select');
      
      if (interactiveElement) {
        setIsHovering(true);
        setHoveredElement(interactiveElement as HTMLElement);
        // Add magnifying class
        interactiveElement.classList.add('cursor-magnify');
      } else {
        setIsHovering(false);
        if (hoveredElement) {
          hoveredElement.classList.remove('cursor-magnify');
        }
        setHoveredElement(null);
      }
    };

    const handleMouseLeave = () => {
      if (hoveredElement) {
        hoveredElement.classList.remove('cursor-magnify');
        setHoveredElement(null);
      }
      setIsHovering(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, hoveredElement]);

  return (
    <>
      {/* Hide default cursor & add magnifying effect */}
      <style>{`
        * {
          cursor: none !important;
        }
        
        .cursor-magnify {
          transform: scale(1.05) !important;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        
        .cursor-magnify:active {
          transform: scale(0.98) !important;
        }
      `}</style>

      {/* Trail Particles */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed pointer-events-none z-[9997]"
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            left: point.x,
            top: point.y,
            width: 8 - index * 0.5,
            height: 8 - index * 0.5,
            background: `rgba(${isClicking ? '21, 128, 61' : isHovering ? '22, 163, 74' : '34, 197, 94'}, ${0.6 - index * 0.075})`,
            borderRadius: '50%',
            boxShadow: `0 0 ${10 - index}px rgba(34, 197, 94, 0.5)`,
          }}
        />
      ))}

      {/* Main Leaf Cursor */}
      <motion.div
        className="fixed pointer-events-none z-[10000]"
        style={{ 
          x: cursorX, 
          y: cursorY,
          width: 40,
          height: 40,
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.7 : isHovering ? 1.6 : 1,
            rotate: isClicking ? 180 : isHovering ? 25 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
          >
            {/* Main leaf shape - Darker greens */}
            <path
              d="M20 3C20 3 10 10 10 20C10 30 20 37 20 37C20 37 30 30 30 20C30 10 20 3 20 3Z"
              fill={isClicking ? 'url(#leafGradientClick)' : isHovering ? 'url(#leafGradientHover)' : 'url(#leafGradientDefault)'}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="0.5"
            />

            {/* Central vein - BLACK */}
            <motion.line
              x1="20"
              y1="5"
              x2="20"
              y2="35"
              stroke="#000000"
              strokeWidth={isHovering ? '1.5' : '1'}
              strokeLinecap="round"
              opacity="0.6"
              animate={{
                strokeOpacity: isHovering ? [0.4, 0.8, 0.4] : 0.6,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />

            {/* Left veins - BLACK */}
            <path
              d="M20 12C17 14, 14 16, 13 19"
              stroke="#000000"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M20 18C18 20, 15 22, 13 24"
              stroke="#000000"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M20 24C18 26, 16 28, 15 30"
              stroke="#000000"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />

            {/* Right veins - BLACK */}
            <path
              d="M20 12C23 14, 26 16, 27 19"
              stroke="#000000"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M20 18C22 20, 25 22, 27 24"
              stroke="#000000"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M20 24C22 26, 24 28, 25 30"
              stroke="#000000"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />

            <defs>
              {/* Default - darker green */}
              <linearGradient id="leafGradientDefault" x1="10" y1="3" x2="30" y2="37">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="35%" stopColor="#22c55e" />
                <stop offset="70%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>

              {/* Hover - medium green */}
              <linearGradient id="leafGradientHover" x1="10" y1="3" x2="30" y2="37">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="35%" stopColor="#4ade80" />
                <stop offset="70%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>

              {/* Click - deepest green */}
              <linearGradient id="leafGradientClick" x1="10" y1="3" x2="30" y2="37">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="35%" stopColor="#16a34a" />
                <stop offset="70%" stopColor="#15803d" />
                <stop offset="100%" stopColor="#166534" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Glow effect - darker green glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full -z-10"
          style={{
            background: isClicking 
              ? 'radial-gradient(circle, rgba(21, 128, 61, 0.5) 0%, transparent 70%)'
              : isHovering 
              ? 'radial-gradient(circle, rgba(22, 163, 74, 0.6) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%)',
            filter: 'blur(12px)',
          }}
          animate={{
            scale: isHovering ? [1, 1.3, 1] : 1,
            opacity: isHovering ? [0.5, 1, 0.5] : 0.3,
          }}
          transition={{
            duration: 2,
            repeat: isHovering ? Infinity : 0,
          }}
        />
      </motion.div>

      {/* Floating particles on hover */}
      {isHovering && (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="fixed pointer-events-none z-[9999]"
              style={{ 
                left: cursorX.get() + 20,
                top: cursorY.get() + 20,
              }}
              animate={{
                x: Math.cos((i * Math.PI) / 3) * 40,
                y: Math.sin((i * Math.PI) / 3) * 40,
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #22c55e, #16a34a)',
                  boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)',
                }}
              />
            </motion.div>
          ))}
        </>
      )}
    </>
  );
};
