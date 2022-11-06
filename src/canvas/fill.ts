import { Params } from '../hooks/useParams';
import { ObjectData, Point3D, Vertex } from '../types';
import { fillPolygon } from './fillPolygon';

export function fill(
  objectData: ObjectData,
  ctx: CanvasRenderingContext2D,
  lightPosition: Point3D,
  params: Params
): number {
  const t0 = performance.now();

  calculateVertexColors(objectData, lightPosition, params);

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  if (canvasHeight === 0 || canvasWidth === 0) return 0;
  const imageData = ctx.createImageData(canvasWidth, canvasHeight);
  objectData.faces.forEach((face) =>
    fillPolygon(face, imageData.data, canvasWidth, canvasHeight)
  );
  ctx.putImageData(imageData, 0, 0);

  const t1 = performance.now();

  return t1 - t0;
}

function calculateVertexColors(
  objectData: ObjectData,
  lightPosition: Point3D,
  params: Params
) {
  for (const rowIndex in objectData.vertices) {
    const row = objectData.vertices[parseInt(rowIndex)];
    for (const vertexIndex in row) {
      const vertex = row[parseInt(vertexIndex)];
      calculateColor(vertex, lightPosition, params);
    }
  }
}

const IL = [1, 1, 1];
const IO = [1, 1, 0];

function calculateColor(
  vertex: Vertex,
  lightPosition: Point3D,
  params: Params
) {
  const L = calculateL(vertex, lightPosition);
  const prodNL = prod(vertex.vector, L);
  const cosNL = Math.max(prodNL, 0);

  const Rz = 2 * prodNL * (vertex.vector.z - L.z);
  const cosVR = Math.max(Rz, 0);

  vertex.color = [
    (calculateColorAtIndex(0, cosNL, cosVR, params) * 255) << 0,
    (calculateColorAtIndex(1, cosNL, cosVR, params) * 255) << 0,
    (calculateColorAtIndex(2, cosNL, cosVR, params) * 255) << 0,
    255,
  ];
}

function calculateColorAtIndex(
  i: number,
  cosNL: number,
  cosVR: number,
  params: Params
) {
  const I1 = params.kd * IL[i] * IO[i] * cosNL;
  const I2 = params.ks * IL[i] * IL[i] * Math.pow(cosVR, params.m);
  return I1 + I2;
}

function prod(p1: Point3D, p2: Point3D) {
  const res = p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
  return res;
}

function calculateL(vertex: Vertex, lightPosition: Point3D): Point3D {
  const v: Point3D = {
    x: lightPosition.x - vertex.original.x,
    y: lightPosition.y - vertex.original.y,
    z: lightPosition.z - vertex.original.z,
  };
  const len = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}