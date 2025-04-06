export const renderLabelInput = (
  text: string, 
  isRequired?: boolean
) : React.ReactNode => (
  <>
    {text}
    {isRequired && <span className="text-danger">*</span>}
  </>
)