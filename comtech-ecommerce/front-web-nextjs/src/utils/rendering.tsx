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