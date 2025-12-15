export default function displayWeight(weight: number) {
  if (weight > 0) {
    return weight.toFixed(2) + "kg";
  } else {
    return "Bodyweight";
  }
}
