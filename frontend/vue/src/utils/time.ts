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

export function validateTimeString(str: string): boolean {
  const timeRegex = /^(?:\d+h(?:\s\d+m)?|\d+m)$/;
  return Boolean(str.match(timeRegex));
}

export function parseTime(str: string): number {
  const hoursMatch = str.match(/(\d+)h/);
  const minutesMatch = str.match(/(\d+)m/);

  const hours = hoursMatch  && hoursMatch[1] ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch && minutesMatch[1] ? parseInt(minutesMatch[1], 10) : 0;

  return (hours * 60) + minutes;
}
