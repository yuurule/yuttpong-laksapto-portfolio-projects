import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SignInForm from "@/components/SignIn/SignInForm";
import SignUpForm from "@/components/SignIn/SignUpForm";

export default function SignInPage() {

  return (
    <main className="">
      <div className='container mt-5'>
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-center mb-5">
            <div>
              <SignInForm />
            </div>
            <div className="d-flex align-items-center mx-5">
              <div>OR</div>
            </div>
            <div>
              <SignUpForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}