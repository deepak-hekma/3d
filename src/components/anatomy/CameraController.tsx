import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useAnatomyStore } from '../../stores/anatomy-store';

export function CameraController() {
  const { camera, controls } = useThree();
  const { cameraPosition, cameraTarget } = useAnatomyStore();

  useLayoutEffect(() => {
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    const orbit = controls as OrbitControls | null;
    if (orbit && 'target' in orbit) {
      orbit.target.set(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
      orbit.update();
      camera.lookAt(orbit.target);
    } else {
      camera.lookAt(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
    }
  }, [camera, cameraPosition, cameraTarget, controls]);

  return null;
};
