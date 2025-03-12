import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../components/MyPagination/MyPagination';
import * as CategoryService from '../services/categoryService';
import UpsertCategory from '../components/Category/UpsetCategory';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import { useSelector } from 'react-redux';
import { formatTimestamp } from '../utils/utils';
import { toast } from 'react-toastify';

export default function Category() {

  const authUser = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [categories, setCategories] = useState([]);
  const [actionForm, setActionForm] = useState('CREATE');
  const [selectedData, setSelectedData] = useState({
    id: null,
    name: '',
    description: '',
  });
  const [selectedOrderBy, setSelectedOrderBy] = useState(''); // createdAt, name, haveProduct
  const [orderBy, setOrderBy] = useState('desc');
  const [deleteCategoriesId, setDeleteCategoriesId] = useState([]);
  const [confirmDeletesDialog, setConfirmDeletesDialog] = useState(false);
  const [selectDeleteCategory, setSelectDeleteCategory] = useState(null);
  const [deleteType, setDeleteType] = useState('single'); // 'single', 'multiple'

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

  const handleResetToCreate = () => {
    setActionForm('CREATE');
    setSelectedData({
      id: null,
      name: '',
      description: '',
    });
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
      else return <FontAwesomeIcon icon={faArrowDown} />
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

  /**
   * Delete category
   */
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
  const openConfirmDeleteDailog = (deleteType) => {
    if(deleteType === 'multiple') {
      if(deleteCategoriesId.length === 0) {
        alert('Please select some catagory')
      }
      else setConfirmDeletesDialog(true);
    }
    else {
      setConfirmDeletesDialog(true);
    }
  }
  const closeConfirmDeleteDialog = () => {
    setConfirmDeletesDialog(false);
    setSelectDeleteCategory(null);
    setDeleteCategoriesId([]);
  }
  const renderCategoryName = (id) => {
    if(id !== null) {
      return categories.find(i => i.id === id)?.name;
    }
  }
  const renderMutipleCategoryName = (ids) => {
    let result = "[";
    ids.map((i, index) => {
      const category = categories.find(x => x.id === parseInt(i))?.name;
      result += `"${category}"${index < ids.length - 1 ? ', ' : ''}`;
    });
    result += "]";
    return result;
  }
  const handleDeleteCategories = async () => {
    setOnSubmit(true);
    try {
      const categoriesId = deleteCategoriesId.map(i => parseInt(i));
      const requestData = {
        userId: authUser.id,
        categoriesId: deleteType === 'multiple' ? categoriesId : [parseInt(selectDeleteCategory)]
      }

      await CategoryService.deleteCategories(requestData)
        .then(res => {
          console.log(`Delete categories is successfully! : ${res.RESULT_DATA}`);
          handleRefreshData();
          setOnSubmit(false);
          setConfirmDeletesDialog(false);
          setSelectDeleteCategory(null);
          setDeleteCategoriesId([]);
          handleResetToCreate();
          toast.success(`Delete categories is successfully!`);
        })
        .catch(error => {
          throw new Error(`Delete categories failed due to: ${error.response.data}`);
        })
    }
    catch(error) {
      console.log(error);
      toast.error(error);
    }
    finally {
      setOnSubmit(false);
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
                      <button 
                        className='btn btn-danger'
                        onClick={() => {
                          setDeleteType('multiple');
                          openConfirmDeleteDailog('multiple');
                        }}  
                      >Delete categories</button>
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
                            <td>
                              {i.name}<br />
                              <small className='opacity-50'>{i.description}</small>
                            </td>
                            <td>coming soon...</td>
                            <td>{i.products.length}</td>
                            <td>
                              {formatTimestamp(i.createdAt)}<br />
                              <small className='opacity-50'>{i.createdBy?.displayName}</small>
                            </td>
                            <td>
                              {formatTimestamp(i.updatedAt)}<br />
                              <small className='opacity-50'>{i.updatedBy?.displayName}</small></td>
                            <td>
                              <div className='d-flex'>
                                <button 
                                  type="button"
                                  className='btn btn-primary me-2'
                                  onClick={() => handlerClickUpdate(i.id, i.name, i.description)}
                                ><FontAwesomeIcon icon={faEdit} /></button>
                                <button 
                                  type="button"
                                  className='btn btn-danger'
                                  onClick={() => {
                                    setSelectDeleteCategory(i.id);
                                    setDeleteType('single');
                                    openConfirmDeleteDailog('single');
                                  }}
                                ><FontAwesomeIcon icon={faTrash} /></button>
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
                    handleResetToCreate={handleResetToCreate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {
        !loading &&
        <Dialog open={confirmDeletesDialog}>
          <DialogContent style={{minWidth: 450}}>
            <div className='text-center pt-3'>
              <p className='h3'>
                { deleteType === 'single' && `Delete category "${renderCategoryName(selectDeleteCategory)}"`}
                { deleteType === 'multiple' && <>Delete categories<br />{renderMutipleCategoryName(deleteCategoriesId)}</>}
              </p>
              <p>Do you confirm this action?</p>
            </div>
          </DialogContent>
          <DialogActions className='text-center px-4 pb-3'>
            <button
              className='btn btn-primary w-50'
              onClick={handleDeleteCategories}
            >{onSubmit ? 'Processing...' : 'Confirm Delete'}</button>
            <button
              className='btn btn-secondary w-50'
              onClick={closeConfirmDeleteDialog}
            >Cancel</button>
          </DialogActions>
        </Dialog>
      }

    </div>
  )
}