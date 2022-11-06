import { createContext, RefObject } from 'react';
import { Params } from './hooks/useParams';
import { ObjectData, Point3D } from './types';

interface AppContext {
  canvasRef: RefObject<HTMLCanvasElement>;
  setErrorText: (text: string) => void;
  forceRerender: () => void;
  readFile: (file: Blob) => void;
  objectData: ObjectData | undefined;
  lightPosition: Point3D;
  params: Params;
}

const appContextDefaultValue: AppContext = {
  canvasRef: { current: null },
  setErrorText: () => {},
  forceRerender: () => {},
  readFile: () => {},
  objectData: undefined,
  lightPosition: { x: 0, y: 0, z: 0 },
  params: {
    kd: 0,
    setKd: () => {},
    ks: 0,
    setKs: () => {},
    m: 0,
    setM: () => {},
  },
};

export const AppContext = createContext<AppContext>(appContextDefaultValue);
