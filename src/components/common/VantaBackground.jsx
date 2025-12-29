import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';

const VantaBackground = ({ theme }) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        CLOUDS({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          // Start with dark theme defaults as it's the most common entry
          backgroundColor: theme === 'dark' ? 0x050515 : 0xffffff,
          skyColor: theme === 'dark' ? 0x0a0a2a : 0x89bae0,
          cloudColor: theme === 'dark' ? 0x2a2a5e : 0xadc3d1,
          cloudShadowColor: theme === 'dark' ? 0x020210 : 0x1d3a54,
          sunColor: theme === 'dark' ? 0x7e3ac2 : 0xff9900,
          sunGlareColor: theme === 'dark' ? 0x9c59db : 0xff6600,
          sunlightColor: theme === 'dark' ? 0x7e3ac2 : 0xffcc00,
          speed: 1.0,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  useEffect(() => {
    if (vantaEffect) {
      if (theme === 'dark') {
        vantaEffect.setOptions({
          backgroundColor: 0x050515,
          skyColor: 0x0a0a2a,
          cloudColor: 0x2a2a5e,
          cloudShadowColor: 0x020210,
          sunColor: 0x7e3ac2,
          sunGlareColor: 0x9c59db,
          sunlightColor: 0x7e3ac2,
        });
      } else {
        vantaEffect.setOptions({
          backgroundColor: 0xfafafa,
          skyColor: 0x98c3e8,
          cloudColor: 0xdce8f2,
          cloudShadowColor: 0x4a6a8c,
          sunColor: 0x7e3ac2,
          sunGlareColor: 0x8959cb,
          sunlightColor: 0x6d28d9,
        });
      }
    }
  }, [theme, vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0 w-full h-full"
      style={{ filter: theme === 'dark' ? 'brightness(1.5)' : 'brightness(0.8)' }}
    />
  );
};

export default VantaBackground;
