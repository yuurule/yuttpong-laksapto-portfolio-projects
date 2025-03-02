"use client";
import TextInput from "@/components/FormInput/TextInput";
import { renderLabelInput } from "@/utils/rendering";

export default function SignUpForm() {

  const handlerOnSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Sign Up!!")
  }

  return (
    <div className="card" style={{width: 380}}>
      <form 
        onSubmit={(e: any) => handlerOnSubmit(e)}
        className="form-design form-float-label"
      >
        <div className="card-body">
          <strong className="h4 text-center d-block mb-4">New Sign Up</strong>
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
            <div className="col-12">
              <TextInput
                labelText={renderLabelInput("Comfirmed Password", true)}
              />
            </div>
          </div>
        </div>
        <button 
          type="submit"
          className="btn design-btn gradient-btn w-100 py-2"
        >SIGN UP</button>
      </form>
    </div>
  )
}