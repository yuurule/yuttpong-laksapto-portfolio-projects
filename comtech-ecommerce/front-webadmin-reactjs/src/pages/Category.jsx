import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../components/MyPagination/MyPagination';

export default function Category() {

  return (
    <div>
      
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center">
          <h1>Category</h1>
          <div>
            <button className='btn btn-primary'>+ Create New Category</button>
          </div>
        </header>
        <div className="col-12 mt-4">
          <div className="row">
            <div className="col-sm-8">
              <div className='card mb-3'>
                <div className='card-body'>
                  <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div>
                      <button className='btn btn-danger'>Delete</button>
                    </div>
                    <div>
                      <InputGroup className="">
                        <Form.Control
                          placeholder="Search category"
                          aria-label="Recipient's username"
                          aria-describedby="basic-addon2"
                        />
                        <Button variant="primary" id="button-addon2">
                          <FontAwesomeIcon icon={faSearch} />
                        </Button>
                      </InputGroup>
                    </div>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Category Name <FontAwesomeIcon icon={faArrowUp} /></th>
                        <th>Customer Click <FontAwesomeIcon icon={faArrowUp} /></th>
                        <th>Have Products On <FontAwesomeIcon icon={faArrowDown} /></th>
                        <th>Created At <FontAwesomeIcon icon={faMinus} /></th>
                        <th>Last Updated <FontAwesomeIcon icon={faMinus} /></th>
                        <th>Manage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        [...Array(8)].map((i, index) => (
                          <tr key={`category_row_${index + 1}`}>
                            <td>
                              <Form.Check
                                type={"checkbox"}
                                id={`select-category`}
                                label={``}
                              />
                            </td>
                            <td>Working</td>
                            <td>234</td>
                            <td>12</td>
                            <td>12 Jan 2025<br /><small>By Webadmin</small></td>
                            <td>12 Jan 2025<br /><small>By Webadmin</small></td>
                            <td>
                              <div className='d-flex'>
                                <button className='btn btn-primary me-2'><FontAwesomeIcon icon={faEdit} /></button>
                                <button className='btn btn-danger'><FontAwesomeIcon icon={faTrash} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  <div className='d-flex justify-content-center'>
                    <MyPagination />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className='card'>
                <div className='card-body'>
                  <header>
                    <stong className="h5">Create New Category</stong>
                    <hr />
                  </header>
                  <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Category Name</Form.Label>
                      <Form.Control />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Description</Form.Label>
                      <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                    <div className='d-flex justify-content-end'>
                      <button className='btn btn-primary px-4'>Create</button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}