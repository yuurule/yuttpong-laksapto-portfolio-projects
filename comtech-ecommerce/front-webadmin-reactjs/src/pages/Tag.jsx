import { useState, useEffect } from 'react';
import { Form, InputGroup, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowUp, faArrowDown, faMinus } from '@fortawesome/free-solid-svg-icons';
import MyPagination from '../components/MyPagination/MyPagination';
import * as TagService from '../services/tagService';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { formatTimestamp } from '../utils/utils';
import UpsertTag from '../components/Tag/UpsertTag';
import OrderByBtn from '../components/OrderByBtn/OrderByBtn';

export default function Tag() {

  const authUser = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [tags, setTags] = useState([]);
  const [actionForm, setActionForm] = useState('CREATE');
  const [selectedData, setSelectedData] = useState({ id: null,name: '' });
  const [selectedOrderBy, setSelectedOrderBy] = useState(''); // createdAt, name, haveProduct
  //const [orderBy, setOrderBy] = useState('desc');
  const [deleteTagsId, setDeleteTagsId] = useState([]);
  const [confirmDeletesDialog, setConfirmDeletesDialog] = useState(false);
  const [selectDeleteTag, setSelectDeleteTag] = useState(null);
  const [deleteType, setDeleteType] = useState('single'); // 'single', 'multiple'

  const [paramsQuery, setParamsQuery] = useState({
    page: 1,
    pageSize: 8,
    orderBy: 'createdAt',
    orderDir: 'desc',
    search: null,
    productAmount: null
  });
  const [orderBy, setOrderBy] = useState([
    { column: 'name', value: null },
    { column: 'products', value: null },
    { column: 'createdAt', value: null },
  ]);

  useEffect(() => {
    getAllTag();
  }, [refresh, paramsQuery]);
  
  const getAllTag = async () => {
    setLoading(true);
    await TagService.getStatisticTags(paramsQuery)
      .then((res) => {
        //console.log(res.data.RESULT_DATA);
        setTags(res.data.RESULT_DATA);
      })
      .catch((error) => {
        console.log(error);
        toast.error(`getAllTag api error due to: ${error}`)
      })
      .finally(() => setLoading(false))
  }

  const handleRefreshData = () => setRefresh(prevState => prevState + 1);
  const handleResetToCreate = () => {
    setActionForm('CREATE');
    setSelectedData({id: null,name: ''});
  }
  const handlerClickCreate = () => {
    setSelectedData({ id: null, name: null });
    setActionForm('CREATE');
  }
  const handlerClickUpdate = (id, name) => {
    setSelectedData({
      id: id,
      name: name
    });
    setActionForm('UPDATE');
  }
  // const renderIconOrderBy = (target) => {
  //   if(selectedOrderBy === target) {
  //     if(orderBy === 'desc') return <FontAwesomeIcon icon={faArrowUp} />
  //     else return <FontAwesomeIcon icon={faArrowDown} />
  //   }
  //   else return <FontAwesomeIcon icon={faMinus} />
  // }
  // const handleClickSelectOrderBy = (target) => {
  //   if(selectedOrderBy === target) {
  //     if(orderBy === 'desc') {
  //       setOrderBy('asc');
  //     }
  //     else if(orderBy === 'asc') {
  //       setSelectedOrderBy('')
  //       setOrderBy('');
  //     }
  //   }
  //   else {
  //     setSelectedOrderBy(target)
  //     setOrderBy('desc');
  //   }
  // }
  const handleChangeOrderBy = (columnName) => {
    const tempResult = [...orderBy];
    tempResult.map(i => {
      if(i.column === columnName) {
        if(i.value === null) i.value = 'desc';
        else if(i.value === 'desc') i.value = 'asc';
        else if(i.value === 'asc') i.value = null;
      }
      else {
        i.value = null;
      }
    });
    setOrderBy(tempResult);
  }

  /**
   * Delete tag
   */
  const checkIsSelectDelete = (id) => {
    const findId = deleteTagsId.find(i => parseInt(i) === id);
    if(findId) return true;
    return false;
  }
  const handleSelectTag = (e) => {
    const tempResult = [...deleteTagsId];
    const findThisId = tempResult.find(i => i === e.target.value);
    if(!findThisId) {
      tempResult.push(e.target.value);
      setDeleteTagsId(tempResult);
    }
    else {
      const removeIdResult = tempResult.filter(i => i !== e.target.value);
      setDeleteTagsId(removeIdResult);
    }
  }
  const openConfirmDeleteDailog = (deleteType) => {
    if(deleteType === 'multiple') {
      if(deleteTagsId.length === 0) {
        alert('Please select some tag')
      }
      else setConfirmDeletesDialog(true);
    }
    else {
      setConfirmDeletesDialog(true);
    }
  }
  const closeConfirmDeleteDialog = () => {
    setConfirmDeletesDialog(false);
    setSelectDeleteTag(null);
    setDeleteTagsId([]);
  }
  const renderTagName = (id) => {
    if(id !== null) {
      return tags.find(i => i.id === id)?.name;
    }
  }
  const renderMutipleTagName = (ids) => {
    let result = "[";
    ids.map((i, index) => {
      const tag = tags.find(x => x.id === parseInt(i))?.name;
      result += `"${tag}"${index < ids.length - 1 ? ', ' : ''}`;
    });
    result += "]";
    return result;
  }
  const handleDeleteTags = async () => {
    setOnSubmit(true);
    try {
      const tagsId = deleteTagsId.map(i => parseInt(i));
      const requestData = {
        userId: authUser.id,
        tagsId: deleteType === 'multiple' ? tagsId : [parseInt(selectDeleteTag)]
      }

      //console.log(requestData)

      await TagService.deleteTags(requestData)
        .then(res => {
          console.log(`Delete tags is successfully! : ${res.RESULT_DATA}`);
          handleRefreshData();
          setOnSubmit(false);
          setConfirmDeletesDialog(false);
          setSelectDeleteTag(null);
          setDeleteTagsId([]);
          handleResetToCreate();
          toast.success(`Delete tags is successfully!`);
        })
        .catch(error => {
          throw new Error(`Delete tags failed due to: ${error.response.data}`);
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
    <div className={`page`}>
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
            >+ Create New Tag</button>
          </div>
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-sm-8">
              <div className='card mb-3'>
                <div className='card-body'>
                  <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div>
                      <button 
                        className='btn my-btn narrow-btn red-btn'
                        onClick={() => {
                          setDeleteType('multiple');
                          openConfirmDeleteDailog('multiple');
                        }}  
                      >Delete tags</button>
                    </div>
                    <div className="search-input">
                      <InputGroup className="">
                        <Form.Control
                          placeholder="Search tag"
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
                        <th className='selectRow'></th>
                        <th>
                          Tag Name
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
                            handleOnClick={() => handleChangeOrderBy('products')}
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
                        tags.map((i, index) => (
                          <tr key={`tag_row_${index + 1}`}>
                            <td className='selectRow'>
                              <div className='flexCenterXY'>
                                <Form.Check
                                  type={"checkbox"}
                                  id={`select-tag-${index + 1}`}
                                  label={``}
                                  name={`deleteTagId`}
                                  value={i.id}
                                  checked={checkIsSelectDelete(i.id)}
                                  onChange={(e) => handleSelectTag(e)}
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
                              <small className='opacity-50'>{i.updatedBy?.displayName}</small>
                            </td>
                            <td>
                              <button 
                                type="button"
                                className='btn btn-link p-0 btn-lg'
                                onClick={() => handlerClickUpdate(i.id, i.name, i.description)}
                              ><FontAwesomeIcon icon={faEdit} /></button>
                              {/* <button 
                                type="button"
                                className='btn btn-danger'
                                onClick={() => {
                                  setSelectDeleteTag(i.id);
                                  setDeleteType('single');
                                  openConfirmDeleteDailog('single');
                                }}
                              ><FontAwesomeIcon icon={faTrash} /></button> */}
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
                  <UpsertTag
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
                { deleteType === 'single' && `Delete tag "${renderTagName(selectDeleteTag)}"`}
                { deleteType === 'multiple' && <>Delete tags<br />{renderMutipleTagName(deleteTagsId)}</>}
              </p>
              <p>Do you confirm this action?</p>
            </div>
          </DialogContent>
          <DialogActions className='text-center px-4 pb-3'>
            <button
              className='btn btn-primary w-50'
              onClick={handleDeleteTags}
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