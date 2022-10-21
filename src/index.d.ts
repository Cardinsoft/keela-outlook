type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

declare var fabric: typeof import("office-ui-fabric-js/dist/js/fabric.js").fabric;
