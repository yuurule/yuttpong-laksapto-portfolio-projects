"use client"

import { Form } from 'react-bootstrap';
import { TextInputProps } from '@/types/PropsType';

export default function TextInput({  
  handleOnChange=() => {},
  type="text",
  labelText="",
  isRequired=false,
  placeHolder="",
  isDisable=false,
  isTextArea=false,
  rows=4,
  min=0,
  max=null
} : TextInputProps) {


  return (
    <Form.Group className="position-relative mb-3">
      { labelText !== "" && <Form.Label>{labelText}</Form.Label> }
      <Form.Control 
        type={type}
        required={isRequired}
        placeholder={placeHolder} 
        disabled={isDisable}
        as={isTextArea ? "textarea" : undefined}
        rows={rows}
        onChange={(e) => handleOnChange(e.target.value)}
      />
    </Form.Group>
  )
}