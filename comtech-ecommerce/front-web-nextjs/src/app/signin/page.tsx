import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import SignInForm from "@/components/SignIn/SignInForm";
import SignUpForm from "@/components/SignIn/SignUpForm";
import Link from "next/link";

export default function SignInPage() {

  return (
    <main className="">
      <Breadcrumbs />
      <div className='container'>
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-around">
            <div>
              <SignInForm />
            </div>
            <div className="d-flex align-items-center">
              <div>- Or -</div>
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