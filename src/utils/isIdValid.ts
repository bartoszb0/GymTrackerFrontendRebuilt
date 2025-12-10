export default function isIdValid(id: string | undefined) {
  const safeId = Number(id);
  const isValid = !isNaN(safeId) && safeId > 0;

  return { safeId, isValid };
}
