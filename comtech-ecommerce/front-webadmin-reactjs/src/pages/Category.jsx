import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faClose, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../components/MyPagination/MyPagination';
import * as CategoryService from '../services/categoryService';
import UpsertCategory from '../components/Category/UpsetCategory';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import { useSelector } from 'react-redux';
import { decodeJWT, formatTimestamp } from '../utils/utils';
import { toast } from 'react-toastify';
import OrderByBtn from '../components/OrderByBtn/OrderByBtn';

export default function Category() {

  const authUser = useSelector(state => state.auth.user)
  const authToken = useSelector(state => state.auth.accessToken)
  const userRole = authToken ? decodeJWT(authToken).role : ''
  
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
  const [deleteCategoriesId, setDeleteCategoriesId] = useState([]);
  const [confirmDeletesDialog, setConfirmDeletesDialog] = useState(false);
  const [selectDeleteCategory, setSelectDeleteCategory] = useState(null);
  const [deleteType, setDeleteType] = useState('single'); // 'single', 'multiple'

  const setPageSize = 8;
  const [paramsQuery, setParamsQuery] = useState({
    page: 1,
    pageSize: setPageSize,
    orderBy: 'createdAt',
    orderDir: 'desc',
    search: null,
    productAmount: null
  });
  const [orderBy, setOrderBy] = useState([
    { column: 'name', value: null },
    { column: 'productAmount', value: null },
    { column: 'createdAt', value: null },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(null);
  const [useSearchQuery, setUseSearchQuery] = useState(null);

  useEffect(() => {
    getAllCategory();
  }, [refresh, paramsQuery]);

  const getAllCategory = async () => {
    setLoading(true);
    await CategoryService.getStatisticCategories(paramsQuery)
      .then((res) => {
        //console.log(res.data.RESULT_DATA);
        setCategories(res.data.RESULT_DATA);
        setCurrentPage(res.data.RESULT_META.currentPage);
        setTotalPage(res.data.RESULT_META.totalPages);
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

  const handleChangeOrderBy = (columnName) => {
    const tempResult = [...orderBy];
    let newValue = null;
    tempResult.map(i => {
      if(i.column === columnName) {
        if(i.value === null) {
          i.value = 'desc';
          newValue = 'desc';
        }
        else if(i.value === 'desc') {
          i.value = 'asc';
          newValue = 'asc';
        }
        else if(i.value === 'asc') {
          i.value = null;
          newValue = null;
        }
      }
      else {
        i.value = null;
      }
    });

    const tempParamsQuery = handleResetParamsQuery();
    switch(columnName) {
      case 'name':
        if(newValue !== null) {
          tempParamsQuery.orderBy = 'name';
          tempParamsQuery.orderDir = newValue;
        }
        break;
      case 'productAmount':
        tempParamsQuery.productAmount = newValue;
        break;
      case 'createdAt':
        if(newValue !== null) {
          tempParamsQuery.orderBy = 'createdAt';
          tempParamsQuery.orderDir = newValue;
        }
        break;
    }

    setParamsQuery(tempParamsQuery);
    setOrderBy(tempResult);
  }
  const handleSearchQuery = () => {
    if(searchQuery !== null && searchQuery.trim() !== '') {
      const tempParamsQuery = handleResetParamsQuery();
      tempParamsQuery.search = searchQuery;
      setUseSearchQuery(searchQuery);
      setParamsQuery(tempParamsQuery);
    }
  }
  const handleClearSearchQuery = () => {
    setSearchQuery(null);
    setUseSearchQuery(null);
    const tempParamsQuery = handleResetParamsQuery();
    tempParamsQuery.search = null;
    setParamsQuery(tempParamsQuery);
  }
  const handleResetParamsQuery = () => {
    return {
      page: 1,
      pageSize: setPageSize,
      orderBy: 'createdAt',
      orderDir: 'desc',
      search: useSearchQuery,
      productAmount: null
    }
  }
  const handleSelectPage = (pageNumber) => {
    const tempParamsQuery = {...paramsQuery};
    tempParamsQuery.page = pageNumber;
    setParamsQuery(tempParamsQuery);
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
    let result = "";
    ids.map((i, index) => {
      const category = categories.find(x => x.id === parseInt(i))?.name;
      result += `"${category}"${index < ids.length - 1 ? ', ' : ''}`;
    });
    //result += "";
    return result;
  }
  const handleDeleteCategories = async () => {
    if(userRole === 'ADMIN') {
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
        toast.error(`${error}`);
      }
      finally {
        setOnSubmit(false);
      }
    }
    else {
      toast.error(`You are in "Guest" mode, this action is not authorize.`)
    }
  }

  if(loading) return <div>กำลังโหลด...</div>

  return (
    <div className={`page categories-page page-padding-btn`}>
      <header className="page-title">
        <h1>Category</h1>
        <p>All product category</p>
      </header>

      <div className="row">
        <div className="col-12 mb-3">
          <div className="d-flex justify-content-end align-items-center">
            <button 
              className='btn my-btn purple-btn big-btn' 
              type="button"
              onClick={handlerClickCreate}
            >+ Create New Category</button>
          </div>
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-lg-8 mb-3">
              <div className='card'>
                <div className='card-body'>
                  <div className='utils-head-table'>
                    <div className='utils-btn-group'>
                      <button 
                        className='btn my-btn narrow-btn red-btn'
                        onClick={() => {
                          setDeleteType('multiple');
                          openConfirmDeleteDailog('multiple');
                        }}  
                      >Delete categories</button>
                    </div>
                    <div className="search-input">
                      <InputGroup>
                        <Form.Control
                          value={searchQuery}
                          placeholder="Search category"
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                          }}
                        />
                        {
                          (searchQuery !== null && (searchQuery.trim()) !== '') &&
                          <Button
                            type="button"
                            style={{borderRight: 'none'}}
                            title="clear search"
                            onClick={handleClearSearchQuery}
                          >
                            <FontAwesomeIcon icon={faClose} />
                          </Button>
                        }
                        <Button
                          type="button"
                          onClick={handleSearchQuery}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Button>
                      </InputGroup>
                    </div>
                  </div>
                  <div className='table-responsive'>
                    <table className="table">
                      <thead>
                        <tr>
                          <th className='selectRow'></th>
                          <th>
                            Category Name 
                            <OrderByBtn 
                              currentStatus={orderBy[0].value}
                              handleOnClick={() => handleChangeOrderBy('name')}
                            />
                          </th>
                          <th>Customer Click</th>
                          <th>
                            Have Products On 
                            <OrderByBtn 
                              currentStatus={orderBy[1].value}
                              handleOnClick={() => handleChangeOrderBy('productAmount')}
                            />
                          </th>
                          <th>
                            Created At 
                            <OrderByBtn 
                              currentStatus={orderBy[2].value}
                              handleOnClick={() => handleChangeOrderBy('createdAt')}
                            />
                          </th>
                          <th>Last Updated</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          categories.map((i, index) => (
                            <tr key={`category_row_${index + 1}`}>
                              <td className='selectRow'>
                                <div className='flexCenterXY'>
                                  <Form.Check
                                    type={"checkbox"}
                                    id={`select-category-${index + 1}`}
                                    label={``}
                                    name={`deleteCategoryId`}
                                    value={i.id}
                                    checked={checkIsSelectDelete(i.id)}
                                    onChange={(e) => handleSelectCategory(e)}
                                  />
                                </div>
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
                                    className='btn my-btn narrow-btn blue-btn px-3'
                                    onClick={() => handlerClickUpdate(i.id, i.name, i.description)}
                                  ><FontAwesomeIcon icon={faEdit} /></button>
                                  {/* <button 
                                    type="button"
                                    className='btn btn-link p-0 btn-lg text-danger'
                                    onClick={() => {
                                      setSelectDeleteCategory(i.id);
                                      setDeleteType('single');
                                      openConfirmDeleteDailog('single');
                                    }}
                                  ><FontAwesomeIcon icon={faTrash} /></button> */}
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                  <div className='d-flex justify-content-center'>
                    <MyPagination
                      currentPage={currentPage}
                      totalPage={totalPage}
                      handleSelectPage={handleSelectPage}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-3">
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
        <Dialog open={confirmDeletesDialog} className='custom-dialog confirm-dialog'>
          <DialogContent>
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
              className='btn my-btn big-btn green-btn w-50'
              onClick={handleDeleteCategories}
            >{onSubmit ? 'Processing...' : <><FontAwesomeIcon icon={faTrashAlt} className='me-2' />Yes, confirm</>}</button>
            <button
              className='btn my-btn big-btn red-btn w-50'
              onClick={closeConfirmDeleteDialog}
            ><FontAwesomeIcon icon={faClose} className='me-2' />No, Cancel</button>
          </DialogActions>
        </Dialog>
      }

    </div>
  )
}