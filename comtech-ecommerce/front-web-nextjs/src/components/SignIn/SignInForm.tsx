"use client";
import React from "react";
import TextInput from "@/components/FormInput/TextInput";
import { renderLabelInput } from "@/utils/rendering";

export default function SignInForm() {

  const handlerOnSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Sign In!!")
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
                labelText={renderLabelInput("Your Email", true)}
              />
            </div>
            <div className="col-12">
              <TextInput
                labelText={renderLabelInput("Password", true)}
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