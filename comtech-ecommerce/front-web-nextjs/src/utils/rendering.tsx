export const renderLabelInput = (
  text: string, 
  isRequired?: boolean
) : React.ReactNode => (
  <>
    {text}
    {isRequired && <span className="text-danger">*</span>}
  </>
);

export const moneyFormat = (value: number, minFraction: number, maxFraction: number) => {
  return value.toLocaleString('th-TH', {
    minimumFractionDigits: minFraction,
    maximumFractionDigits: maxFraction,
  })
}

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  
  // ใช้ Intl.DateTimeFormat เพื่อจัดรูปแบบวันที่
  const formatter = new Intl.DateTimeFormat('th', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  return formatter.format(date);
}