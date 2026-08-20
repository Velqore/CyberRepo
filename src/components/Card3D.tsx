import React, { useRef, useState, useCallback } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
  depth?: number;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  maxTilt = 10,
  glareOpacity = 0.15,
  depth = 20,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const ry = ((x - cx) / cx) * maxTilt;
      const rx = -((y - cy) / cy) * maxTilt;

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setTilt({ rx, ry });
      setGlarePos({ x: glareX, y: glareY });
    },
    [maxTilt]
  );

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div className="perspective-1000 w-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className={`card-3d relative rounded-2xl transition-all ${className}`}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${isHovered ? depth : 0}px)`,
          boxShadow: isHovered
            ? '0 20px 40px -15px rgba(0,0,0,0.8), 0 0 30px -5px rgba(34,211,238,0.18)'
            : '0 4px 14px -3px rgba(0,0,0,0.5)',
        }}
      >
        {/* Dynamic Specular Glare */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 z-10"
            style={{
              background: `radial-gradient(circle 220px at ${glarePos.x}% ${glarePos.y}%, rgba(34, 211, 238, ${glareOpacity}), transparent 75%)`,
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
};
