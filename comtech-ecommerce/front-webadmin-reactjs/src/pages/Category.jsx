import { Form, Pagination  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Category() {



  return (
    <div className={`page`}>
      
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center">
          <h1>Category</h1>
          <div>
            <button className='btn btn-danger me-3'>Delete</button>
            <button className='btn btn-primary'>Create New</button>
          </div>
        </header>
        <div className="col-12 mt-4">
          <div className="row">
            <div className="col-sm-8">
              <div className='card mb-3'>
                <div className='card-body'>
                  <table className="table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Category Name</th>
                        <th>Have Products On</th>
                        <th>Created At</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        [...Array(10)].map((i, index) => (
                          <tr key={`category_row_${index + 1}`}>
                            <td>
                              <Form.Check
                                type={"checkbox"}
                                id={`select-category`}
                                label={``}
                              />
                            </td>
                            <td>Working</td>
                            <td>12</td>
                            <td>12 Jan 2025</td>
                            <td>
                              <button className='btn btn-primary me-2'><FontAwesomeIcon icon={faEdit} /></button>
                              <button className='btn btn-danger'><FontAwesomeIcon icon={faTrash} /></button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <Pagination>
                  <Pagination.First />
                  <Pagination.Prev />
                  <Pagination.Item>{1}</Pagination.Item>
                  <Pagination.Ellipsis />

                  <Pagination.Item>{10}</Pagination.Item>
                  <Pagination.Item>{11}</Pagination.Item>
                  <Pagination.Item active>{12}</Pagination.Item>
                  <Pagination.Item>{13}</Pagination.Item>
                  <Pagination.Item disabled>{14}</Pagination.Item>

                  <Pagination.Ellipsis />
                  <Pagination.Item>{20}</Pagination.Item>
                  <Pagination.Next />
                  <Pagination.Last />
                </Pagination>
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