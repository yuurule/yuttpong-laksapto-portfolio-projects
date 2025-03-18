import { ClassSharp } from "@mui/icons-material";

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  
  // ใช้ Intl.DateTimeFormat เพื่อจัดรูปแบบวันที่
  const formatter = new Intl.DateTimeFormat('th', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  return formatter.format(date);
}

export function formatMoney(value) {
  let parse = parseFloat(value);
  return parse.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}