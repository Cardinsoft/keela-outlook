type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

interface Window {
  // required to access action callback functions
  [x: string]: unknown;
  CardServiceConfig: typeof import("./gas-js/services/card/service").CardServiceConfig;
}

declare var fabric: typeof import("office-ui-fabric-js/dist/js/fabric.js").fabric;
