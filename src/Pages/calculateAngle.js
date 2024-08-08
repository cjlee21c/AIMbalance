//You have to use the concepts of vector and trigonometry to calculate the angle of three points.
// Calculating the angle between two vectors
// cos(angle) = (A * B) / (|A|*|B|)
// A => one of two vectors, B => another vector
// A * B is dotproduct

const calculateAngle = (a, b, c) => {
    //getting vectors
    const vectorA = { x: b.x - a.x, y: b.y - a.y };
    const vectorB = { x: c.x - b.x, y: c.y - b.y };
  
    const dotProduct = (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y);
    
    const magnitudeA = Math.sqrt(vectorA.x ** 2 + vectorA.y ** 2);
    const magnitudeB = Math.sqrt(vectorB.x ** 2 + vectorB.y ** 2);
    
    // dotProduct indicates (A * B), (magnitudeA * magnitudeB) indicates (|A|*|B|)
    const angleRadians = Math.acos(dotProduct / (magnitudeA * magnitudeB));
    // convert Radians to Degrees
    const angleDegrees = angleRadians * (180 / Math.PI);
    return 180 - angleDegrees;
  };
  
export default calculateAngle;