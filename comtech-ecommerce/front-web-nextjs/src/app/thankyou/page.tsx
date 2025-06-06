import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Link from "next/link";

export default function ThankyouPage() {



  return (
    <main className="">
      <div className='container'>
        <div className="row">
          <div className="col-12">
            <div className="w-100 d-flex justify-content-center align-items-center py-5">
              <div className="text-center w-50">
                <h1>Payment Success!!</h1>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad minima laboriosam quae. Minus, unde earum, exercitationem quaerat modi.</p>
                <div className="d-flex justify-content-center mt-4">
                  <Link href="/" className="btn design-btn gradient-btn px-4 me-3">Back to homepage</Link>
                  <Link href="/" className="btn design-btn gradient-btn px-4 me-3">More shopping</Link>
                  <Link href="/" className="btn design-btn gradient-btn px-4">View to my order</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}