"use client";

import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function SignInDialog({
  show=false,
  handleClose=() => {},
  action='signin'
}: {
  show: boolean,
  handleClose: () => void,
  action?: string 
}) {

  const [actionType, setActionType] = useState(action);

  const handleSetActionType = (value: string) => setActionType(value);

  return (
    <Modal show={show} onHide={() => handleClose()}>
      <Modal.Header closeButton>
        {/* <Modal.Title>
          {actionType === 'signin' && 'Sign In'}
          {actionType === 'signup' && 'Sign Up'}
        </Modal.Title> */}
      </Modal.Header>
      <Modal.Body>
        { 
          actionType === 'signin' &&
          <SignIn 
            handleClose={handleClose} 
            handleSetActionType={handleSetActionType}  
          />
        }
        { 
          actionType === 'signup' &&
          <SignUp 
            handleClose={handleClose} 
            handleSetActionType={handleSetActionType}
          />
        }
      </Modal.Body>
    </Modal>
  )
}