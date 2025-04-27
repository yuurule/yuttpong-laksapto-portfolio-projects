import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MyAccountForm() {


  return (
    <form className="ps-5">

      <div className="box-label mb-5">
        <strong className="box-label-header">My Infomation</strong>
        <dl className="row">

          <dt className="col-sm-3">Email Address</dt>
          <dd className="col-sm-9">
            <input 
              className="form-control w-50 mb-2" 
              defaultValue={'user@email.com'}
              disabled={true}
            />
          </dd>

          <dt className="col-sm-3">Display Name</dt>
          <dd className="col-sm-9">
            <input 
              className="form-control w-50 mb-2" 
              defaultValue={'Johndoh2025'}
            />
          </dd>

          <dt className="col-sm-3">First name</dt>
          <dd className="col-sm-9">
            <input 
              className="form-control w-50 mb-2" 
              defaultValue={'First name'}
            />
          </dd>

          <dt className="col-sm-3">Last Name</dt>
          <dd className="col-sm-9">
            <input 
              className="form-control w-50 mb-2" 
              defaultValue={'Last Name'}
            />
          </dd>

          <dt className="col-sm-3">Phone</dt>
          <dd className="col-sm-9">
            <input 
              className="form-control w-50 mb-2" 
              defaultValue={'Phone'}
            />
          </dd>

          <dt className="col-sm-3">Line ID</dt>
          <dd className="col-sm-9">
            <input 
              className="form-control w-50 mb-2" 
              defaultValue={'Line ID'}
            />
          </dd>

        </dl>
      </div>

      <div className="box-label mb-3">
        <strong className="box-label-header">Address</strong>
        <dl className="row">

          <dt className="col-sm-3">Address</dt>
          <dd className="col-sm-9">
            <input 
              className="form-control w-50 mb-2" 
              defaultValue={'Address'}
            />
          </dd>

          <dt className="col-sm-3">Street</dt>
          <dd className="col-sm-9">
            <input 
              className="form-control w-50 mb-2" 
              defaultValue={'Last Name'}
            />
          </dd>

          <dt className="col-sm-3">City</dt>
          <dd className="col-sm-9">
            <input 
              className="form-control w-50 mb-2" 
              defaultValue={'City'}
            />
          </dd>

          <dt className="col-sm-3">Post Code</dt>
          <dd className="col-sm-9">
            <input 
              className="form-control w-50 mb-2" 
              defaultValue={'Post Code'}
            />
          </dd>

          <dt className="col-sm-3">Country</dt>
          <dd className="col-sm-9">
            <input 
              className="form-control w-50 mb-2" 
              defaultValue={'Country'}
            />
          </dd>

        </dl>
      </div>

      <div className="d-flex justify-content-end">
        <button
          className="btn design-btn px-5"
        >
          <FontAwesomeIcon icon={faSave} className="me-2" />Save
        </button>
      </div>
    </form>
  )
}