import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../components/MyPagination/MyPagination';
import * as CategoryService from '../services/categoryService';
import UpsertCategory from '../components/Category/UpsetCategory';

export default function Category() {

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [categories, setCategories] = useState([]);
  const [actionForm, setActionForm] = useState('CREATE');
  const [selectedData, setSelectedData] = useState({
    id: null,
    name: null,
    description: null,
  });
  const [selectedOrderBy, setSelectedOrderBy] = useState(''); // createdAt, name, haveProduct
  const [orderBy, setOrderBy] = useState('desc');
  const [deleteCategoriesId, setDeleteCategoriesId] = useState([]);

  useEffect(() => {
    getAllCategory();
  }, [refresh]);

  const getAllCategory = async () => {
    setLoading(true);
    await CategoryService.getCategories()
      .then((res) => {
        //console.log(res.RESULT_DATA);
        setCategories(res.RESULT_DATA);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false))
  }

  const handleRefreshData = () => setRefresh(prevState => prevState + 1);

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    
    // ใช้ Intl.DateTimeFormat เพื่อจัดรูปแบบวันที่
    const formatter = new Intl.DateTimeFormat('th', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    return formatter.format(date);
  }

  const renderUser = (data) => {
    if(data !== null) {
      return "by " + data.email.split('@')[0];
    }
    return "-";
  }

  const handlerClickCreate = () => {
    setSelectedData({
      id: null,
      name: null,
      description: null,
    });
    setActionForm('CREATE');
  }

  const handlerClickUpdate = (id, name, description) => {
    setSelectedData({
      id: id,
      name: name,
      description: description,
    });
    setActionForm('UPDATE');
  }

  const renderIconOrderBy = (target) => {
    if(selectedOrderBy === target) {
      if(orderBy === 'desc') return <FontAwesomeIcon icon={faArrowUp} />
      else <FontAwesomeIcon icon={faArrowDown} />
    }
    else return <FontAwesomeIcon icon={faMinus} />
  }

  const handleClickSelectOrderBy = (target) => {
    if(selectedOrderBy === target) {
      if(orderBy === 'desc') {
        setOrderBy('asc');
      }
      else if(orderBy === 'asc') {
        setSelectedOrderBy('')
        setOrderBy('');
      }
    }
    else {
      setSelectedOrderBy(target)
      setOrderBy('desc');
    }
  }

  const checkIsSelectDelete = (id) => {
    const findId = deleteCategoriesId.find(i => parseInt(i) === id);
    if(findId) return true;
    return false;
  }

  const handleSelectCategory = (e) => {
    const tempResult = [...deleteCategoriesId];
    const findThisId = tempResult.find(i => i === e.target.value);
    if(!findThisId) {
      tempResult.push(e.target.value);
      setDeleteCategoriesId(tempResult);
    }
    else {
      const removeIdResult = tempResult.filter(i => i !== e.target.value);
      setDeleteCategoriesId(removeIdResult);
    }
  }

  return (
    <div>
      
      <div className="row">
        <header className="col-12 d-flex justify-content-between align-items-center">
          <h1>Category</h1>
          <div>
            <button className='btn btn-primary' onClick={handlerClickCreate}>+ Create New Category</button>
          </div>
        </header>
        <div className="col-12 mt-4">
          <div className="row">
            <div className="col-sm-8">
              <div className='card mb-3'>
                <div className='card-body'>
                  <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div>
                      <button className='btn btn-danger'>Deletes</button>
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
                        <th>Category Name <button className='btn btn-link p-0' onClick={() => handleClickSelectOrderBy('name')}>{renderIconOrderBy('name')}</button></th>
                        <th>Customer Click</th>
                        <th>Have Products On <button className='btn btn-link p-0' onClick={() => handleClickSelectOrderBy('haveProduct')}>{renderIconOrderBy('haveProduct')}</button></th>
                        <th>Created At <button className='btn btn-link p-0' onClick={() => handleClickSelectOrderBy('createdAt')}>{renderIconOrderBy('createdAt')}</button></th>
                        <th>Last Updated</th>
                        <th>Manage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        categories.map((i, index) => (
                          <tr key={`category_row_${index + 1}`}>
                            <td>
                              <Form.Check
                                type={"checkbox"}
                                id={`select-category-${index + 1}`}
                                label={``}
                                name={`deleteCategoryId`}
                                value={i.id}
                                checked={checkIsSelectDelete(i.id)}
                                onChange={(e) => handleSelectCategory(e)}
                              />
                            </td>
                            <td>{i.name}</td>
                            <td>coming soon...</td>
                            <td>{i.products.length}</td>
                            <td>{formatTimestamp(i.createdAt)}<br /><small>{renderUser(i.createdBy)}</small></td>
                            <td>{formatTimestamp(i.updatedAt)}<br /><small>{renderUser(i.updatedBy)}</small></td>
                            <td>
                              <div className='d-flex'>
                                <button 
                                  className='btn btn-primary me-2'
                                  onClick={() => handlerClickUpdate(i.id, i.name, i.description)}
                                ><FontAwesomeIcon icon={faEdit} /></button>
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
                  <UpsertCategory
                    action={actionForm}
                    currentData={selectedData}
                    handleRefreshData={handleRefreshData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}