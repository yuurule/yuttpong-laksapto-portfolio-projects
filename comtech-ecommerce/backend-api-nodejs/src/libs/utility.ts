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

// ฟังก์ชันสำหรับแปลง string เป็น boolean
export function parseBoolean(value: string) {
  const truthy = ['true', 't', 'yes', 'y', 'on', '1'];
  const falsy = ['false', 'f', 'no', 'n', 'off', '0'];
  
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return Boolean(value);
  
  value = value.trim().toLowerCase();
  
  if (truthy.includes(value)) return true;
  if (falsy.includes(value)) return false;
  
  // กรณีไม่ใช่ค่าที่รู้จัก
  return null;
}