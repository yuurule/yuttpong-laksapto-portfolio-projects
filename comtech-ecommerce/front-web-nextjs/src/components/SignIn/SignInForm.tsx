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
      <div className="card-body">
        <strong className="h3 text-center d-block">Sign In</strong>
        <hr />
        <form 
          onSubmit={(e: any) => handlerOnSubmit(e)}
          className="row"
        >
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
          <div className="col-12">
            <button 
              type="submit"
              className="btn btn-primary w-100"
            >Sign In</button>
          </div>
        </form>
      </div>
    </div>
  )
}