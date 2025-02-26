import { v4 as uuidv4 } from 'uuid';

export function generateUuidBasedSku(prefix: string): string {
  const uuid = uuidv4();
  const shortUuid = uuid.replace(/-/g, '').substring(0, 8).toUpperCase();
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const shortDate = `${year}${month}${day}`;

  // ตัวอย่างผลลัพธ์: ABC-1A2B3C4D-230426
  return `${prefix}-${shortUuid}-${shortDate}`;
}