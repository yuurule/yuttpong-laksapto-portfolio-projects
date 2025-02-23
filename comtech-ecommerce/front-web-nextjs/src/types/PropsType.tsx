export interface TextInputProps {
  labelText?: string | React.ReactNode,
  isRequired?: boolean,
  placeHolder?: string,
  isDisable?: boolean,
  isTextArea?: boolean,
  rows?: number,
  min?: number,
  max?: number | null,
}

export interface ProductListOptionProps {
  title: string,
  options: {
    name: string,
    inStock?: number | null
  }[]
}