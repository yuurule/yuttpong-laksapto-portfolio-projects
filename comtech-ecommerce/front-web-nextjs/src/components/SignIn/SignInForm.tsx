"use client";

import React, { useState } from "react";
import TextInput from "@/components/FormInput/TextInput";
import { renderLabelInput } from "@/utils/rendering";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInForm() {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("")

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
      router.push("/");
    }
  }

  return (
    <div className="card" style={{width: 380}}>
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
      </form>
    </div>
  )
}