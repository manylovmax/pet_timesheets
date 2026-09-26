import { SchemaPath, validate } from "@angular/forms/signals";

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

export function parseTimeToMinutes(time: string): number {
    const hoursMatch = time.match(/(\d+)h/);
    const minutesMatch = time.match(/(\d+)m/);

    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    return (hours * 60) + minutes;
}

const timeRegex = /^(?:\d+h(?:\s\d+m)?|\d+m)$/;

export function validateTime(str: string): boolean {
  return timeRegex.test(str);
}

export function time(path: SchemaPath<string>) {
  validate(path, ({value}) => {
    if (!timeRegex.test(value())) {
      return {
        kind: 'time',
        message: 'Input time in format "Xh Ym", where X and Y are integers, and one group is optional.',
      };
    }
  
    return null;
  })
}