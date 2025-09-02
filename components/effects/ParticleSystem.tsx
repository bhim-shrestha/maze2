import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface ParticleSystemProps {
  trigger: boolean;
  type: 'powerup' | 'levelup' | 'accident';
  position: { x: number; y: number };
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ trigger, type, position }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const newParticles: Particle[] = [];
    const particleCount = type === 'levelup' ? 20 : type === 'powerup' ? 10 : 15;
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Math.random(),
        x: position.x,
        y: position.y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        maxLife: 1,
        color: type === 'powerup' ? '#10b981' : type === 'levelup' ? '#f59e0b' : '#ef4444',
        size: Math.random() * 6 + 2,
      });
    }

    setParticles(newParticles);

    // Animate particles
    const animateParticles = () => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.02,
          vy: p.vy + 0.1, // Gravity
        })).filter(p => p.life > 0)
      );
    };

    const interval = setInterval(animateParticles, 16);
    
    setTimeout(() => {
      clearInterval(interval);
      setParticles([]);
    }, 2000);

    return () => clearInterval(interval);
  }, [trigger, type, position]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: `translate(-50%, -50%)`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleSystem;
