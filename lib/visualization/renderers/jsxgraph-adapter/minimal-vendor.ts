// Production Unit 2B needs only a constrained point, two lines, one segment,
// one dependent point, and text. Importing JSXGraph's package root would also
// register unrelated charts, 3D, parsers, controls, and specialist elements.
// This adapter-owned entry keeps the package lazy while registering only the
// reviewed 2D construction surface used by the sliding-ladder scene.
import JXG from "@bvlp-jsxgraph-src/jxg.js";
import "@bvlp-jsxgraph-src/base/constants.js";
import "@bvlp-jsxgraph-src/utils/type.js";
import "@bvlp-jsxgraph-src/utils/event.js";
import "@bvlp-jsxgraph-src/math/math.js";
import "@bvlp-jsxgraph-src/math/geometry.js";
import "@bvlp-jsxgraph-src/renderer/abstract.js";
import "@bvlp-jsxgraph-src/base/board.js";
import "@bvlp-jsxgraph-src/options.js";
import "@bvlp-jsxgraph-src/jsxgraph.js";
import "@bvlp-jsxgraph-src/base/element.js";
import "@bvlp-jsxgraph-src/base/coords.js";
import "@bvlp-jsxgraph-src/base/coordselement.js";
import "@bvlp-jsxgraph-src/base/point.js";
import "@bvlp-jsxgraph-src/base/line.js";
import "@bvlp-jsxgraph-src/base/text.js";
import "@bvlp-jsxgraph-src/renderer/svg.js";

export const JSXGraph = JXG.JSXGraph;
export default JXG;
