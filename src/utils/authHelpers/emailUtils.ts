export function extractUniversityIdFromEmail(email: string): string | null {
  const match = email.match(/^s(\d+)@stu\.najah\.edu$/);
  return match ? match[1] : null;
}