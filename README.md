# bvh
[Bounding volume hierarchy](https://en.wikipedia.org/wiki/Bounding_volume_hierarchy) data structure library written in TypeScript. Specifically implemented for 3-dimensional points.

## Demo

[GitHub Pages Demo Site](https://zerrien.github.io/bvh/public/)

## Use

```javascript
const { BVHBuilderAsync, BVHVector3 } = require("BVH");

// Have an array of faces (array of stride 9)
const faceArray = [
  0.0, 0.0, 0.0, // Normal triangle
  0.0, 0.0, 1.0,
  1.0, 0.0, 0.0,
];

// Generate  the Bounding Volume Hierachy from an array of faces
const maxTrianglesPerNode = 5;
const BVH = BVHBuilderAsync(faceArray, maxTrianglesPerNode, function({trianglesLeafed}) { // Warning: Computationally expensive, may take a bit.
	console.log("Progress", trianglesLeafed / (faceArray.length / 9)); // Progress callback for user feedback.
}); 

// Find ray intersections
const intersections = BVH.intersectRay(new BVHVector3(0.25, 1, 0.25), new BVHVector3(0, -1, 0));
```

### Considerations

Bounding Volume Hierarchies trade memory for ray intersection computation speed.
- If you are not memory bound, you will want a low maxTrianglesPerNode to minimize intersection speed.
- As you decrease maxTrianglesPerNode, a log/log relationship vs the number of nodes created is observed.
- At 1 maxTrianglesPerNode you get the fastest ray intersection speed, but have the highest memory overhead.

## Development

`npm install`
`npm start`
Navigate to: `http://localhost:8080/` to see a local copy of the GitHub Pages.

### Goals

- Be asyncronous when possible.
- Be efficient with memory.
- Be fast when intersecting.

## License

Original Copyright (c) 2015 Ben Raziel.

Modified Copyright (c) 2018 Josh Callebaut.

MIT License
