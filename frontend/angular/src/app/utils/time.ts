export function minutesToString(totalMinutes: number): string {
  if (!totalMinutes)
    return '';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (!minutes)
    return `${hours}h`;
  else if (!hours)
    return `${minutes}m`
  else
    return `${hours}h ${minutes}m`;
}