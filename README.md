# bvh
[Bounding volume hierarchy](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy) data structure library written in TypeScript. Specifically implemented for 3-dimensional points.

## Demo

TODO: Hook up GitHub pages to a docs folder

## Use

```javascript
const { BVHBuilder, BVHVector3 } = require("BVH");

// Have an array of faces (array of stride 9)
const faceArray = [
  0.0, 0.0, 0.0, // Normal triangle
  0.0, 0.0, 1.0,
  1.0, 0.0, 0.0,
];
// Generate  the Bounding Volume Hierachy from an array of faces
const maxTrianglesPerNode = 1;
const BVH = BVHBuilder(faceArray, maxTrianglesPerNode); // Warning: Computational expensive, may take a bit.
// Find ray intersections
const intersections = BVH.intersectRay(new BVHVector3(0.25, 1, 0.25), new BVHVector3(0, -1, 0));
```

### Considerations

Bounding Volume Hierarchies trade memory for intersection computation speed.
- If you are not memory bound, you will want a low maxTrianglesPerNode, (1 is best for speed.)
- As you increase maxTrianglesPerNode, a log/log relationship vs the number of nodes created is observed.

## Development

### Goals

#### Usage

- Have an easy to use interface

#### Technical

- Be asyncronous when possible.
- Be efficient with memory.
- Be fast when intersecting.

## License

Original Copyright (c) 2015 Ben Raziel.

Modified Copyright (c) 2018 Josh Callebaut.

MIT License
