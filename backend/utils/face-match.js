import * as faceapi from "face-api.js";

// Compare two face descriptors using Euclidean distance
export function isFaceMatch(desc1, desc2, threshold = 0.6) {
  const distance = faceapi.euclideanDistance(desc1, desc2);
  return distance < threshold;
}
