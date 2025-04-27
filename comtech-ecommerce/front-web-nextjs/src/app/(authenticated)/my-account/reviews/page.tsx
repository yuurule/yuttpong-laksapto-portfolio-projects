import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PageHeader from "@/components/PageHeader/PageHeader";
import MyAccountMenu from "@/components/MyAccount/MyAccountMenu";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export default function ReviewsPage() {



  return (
    <main>
      <Breadcrumbs />
      <div className='container'>
        <div className="row">
          <header className="col-12">
            <PageHeader pageTitle="My Review" />
          </header>
          <div className="col-sm-3">
            <MyAccountMenu />
          </div>
          <div className="col-sm-9">
            <table className={`table table-design`}>
              <thead>
                <tr>
                  <th>Review</th>
                  <th>Rating</th>
                  <th>On Product</th>
                  <th>Review At</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>"Lorem ipslum dolor sitamet"</td>
                  <td>4</td>
                  <td>Asus Rog cv7260RF</td>
                  <td>20 Mar 2025</td>
                  <td>
                    <Link href="/" className="btn btn-primary btn-sm">
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}