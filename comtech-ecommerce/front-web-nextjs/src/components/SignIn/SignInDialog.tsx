"use client";

import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import TextInput from "@/components/FormInput/TextInput";
import { renderLabelInput } from "@/utils/rendering";
import { signIn } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function SignInDialog({
  show=false,
  handleClose=() => {},
  action='signin'
}: {
  show: boolean,
  handleClose: Function,
  action?: string 
}) {

  const url = usePathname();
  const router = useRouter();
  const [actionType, setActionType] = useState(action);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  const handlerOnSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("")

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      setError(result.error)
    } else {
      handleClose();
      router.push(url);
    }
  }

  return (
    <Modal show={show} onHide={() => handleClose()}>
      <Modal.Header closeButton>
        <Modal.Title>Sign in is required</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { 
          actionType === 'signin' &&
          <form 
            onSubmit={(e: any) => handlerOnSubmit(e)}
            className="form-design form-float-label"
          >
            <div className="card-body">
              <strong className="h4 text-center d-block mb-4">Sign In</strong>
              <div className="row px-4">
                <div className="col-12">
                  <TextInput
                    type="email"
                    labelText={renderLabelInput("Your Email", true)}
                    handleOnChange={(value:any) => setEmail(value)}
                  />
                </div>
                <div className="col-12">
                  <TextInput
                    type="password"
                    labelText={renderLabelInput("Password", true)}
                    handleOnChange={(value:any) => setPassword(value)}
                  />
                </div>
              </div>
            </div>
            <button 
              type="submit"
              className="btn design-btn w-100 py-2"
            >SIGN IN</button>
            <p className='text-center'>Not have account yet? <button className='btn btn-link p-0'> New sign up</button></p>
          </form>
        }
        { 
          actionType === 'signup' &&
          <></>
        }
      </Modal.Body>
    </Modal>
  )
}