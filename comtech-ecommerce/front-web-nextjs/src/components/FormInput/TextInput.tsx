"use client"
import { Form } from 'react-bootstrap';
import { TextInputProps } from '@/types/PropsType';

export default function TextInput({  
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
        required={isRequired}
        placeholder={placeHolder} 
        disabled={isDisable}
        as={isTextArea ? "textarea" : undefined}
        rows={rows}
        onChange={() => {}}
      />
    </Form.Group>
  )
}