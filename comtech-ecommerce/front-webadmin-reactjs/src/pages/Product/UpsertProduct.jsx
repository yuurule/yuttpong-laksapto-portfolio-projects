import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faClose, faBars, faPlus } from '@fortawesome/free-solid-svg-icons';
import * as ProductService from '../../services/productService';
import * as BrandService from '../../services/brandService';
import * as CategoryService from '../../services/categoryService';
import * as TagService from '../../services/tagService';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { decodeJWT } from '../../utils/utils';

const formSchema = z.object({
  brandId: z.coerce.number().min(1, {message: 'Required'}),
  name: z.string().min(1, {message: 'Required'}),
  //price: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number({message: 'Required'}).positive()),
  price: z.coerce.number().min(1, {message: 'Required'}).positive(),
  description: z.string().min(1, {message: 'Required'}),
  screen_size: z.string().min(1, {message: 'Required'}),
  processor: z.string().min(1, {message: 'Required'}),
  display: z.string().min(1, {message: 'Required'}),
  memory: z.string().min(1, {message: 'Required'}),
  storage: z.string().min(1, {message: 'Required'}),
  graphic: z.string().min(1, {message: 'Required'}),
  operating_system: z.string().min(1, {message: 'Required'}),
  camera: z.string().min(1, {message: 'Required'}),
  optical_drive: z.string().min(1, {message: 'Required'}),
  connection_ports: z.string().min(1, {message: 'Required'}),
  wireless: z.string().min(1, {message: 'Required'}),
  battery: z.string().min(1, {message: 'Required'}),
  color: z.string().min(1, {message: 'Required'}),
  width: z.coerce.number().min(1, {message: 'Required'}).positive(),
  height: z.coerce.number().min(1, {message: 'Required'}).positive(),
  depth: z.coerce.number().min(1, {message: 'Required'}).positive(),
  weight: z.string().min(1, {message: 'Required'}),
  warranty: z.string().min(1, {message: 'Required'}),
  option: z.string().min(1, {message: 'Required'}),
});

export default function UpsertProduct() {

  const { id } = useParams();
  const authUser = useSelector(state => state.auth.user);
  const authToken = useSelector(state => state.auth.accessToken)
  const userRole = authToken ? decodeJWT(authToken).role : ''
  const navigate = useNavigate();
  
  const [loadData, setLoadData] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [brandList, setBrandList] = useState([]);
  const [submitType, setSubmitType] = useState('INSERT'); // 'INSERT', 'UPDATE'

  const [categoryList, setCategoryList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [cacheCategories, setCacheCategories] = useState([]); 
  const [cacheTags, setCacheTags] = useState([]);
  const [updateCategoies, setUpdateCategories] = useState([]);
  const [updateTags, setUpdateTags] = useState([]);

  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const findProduct = async () => {
      setLoadData(true);
      try {
        const findProduct = await ProductService.getOneProduct(id);
        const categories = await CategoryService.getCategories();
        const tags = await TagService.getTags();

        const productData = findProduct.data.RESULT_DATA;
        //console.log(productData);

        setProduct(productData);
        const dimension = (productData.specs.dimension).split('x');
        const productDataForm = {
          brandId: productData.brandId,
          name: productData.name,
          price: parseFloat(productData.price),
          description: productData.description,
          screen_size: productData.specs.screen_size,
          processor: productData.specs.processor,
          display: productData.specs.display,
          memory: productData.specs.memory,
          storage: productData.specs.storage,
          graphic: productData.specs.graphic,
          operating_system: productData.specs.operating_system,
          camera: productData.specs.camera,
          optical_drive: productData.specs.optical_drive,
          connection_ports: productData.specs.connection_ports,
          wireless: productData.specs.wireless,
          battery: productData.specs.battery,
          color: productData.specs.color,
          width: dimension[0],
          height: dimension[1],
          depth: dimension[2],
          weight: productData.specs.weight,
          warranty: productData.specs.warranty,
          option: productData.specs.option,
        }
        reset(productDataForm);
        const resultCacheCategories = productData.categories.map(i => {
          const findCategory = categories.data.RESULT_DATA.find(x => x.id === i.category.id);
          return findCategory;
        });
        const resultCategoryList = [];
        categories.data.RESULT_DATA.map(i => {
          const findCategory = productData.categories.filter(x => x.category.id === i.id);
          if(findCategory.length === 0) {
            resultCategoryList.push(i);
          }
        });
        const resultCacheTags = productData.tags.map(i => {
          const findTag = tags.data.RESULT_DATA.find(x => x.id === i.tag.id);
          return findTag;
        });
        const resultTagList = [];
        tags.data.RESULT_DATA.map(i => {
          const findTag = productData.tags.filter(x => x.tag.id === i.id);
          if(findTag.length === 0) {
            resultTagList.push(i);
          }
        });

        setImages(productData.images);
        if(productData.images.length > 0) {
          setPreviewImage(import.meta.env.VITE_API_URL + '/' + productData.images[0].path);
        }
        setCacheCategories(resultCacheCategories);
        setUpdateCategories(resultCacheCategories);
        setCategoryList(resultCategoryList);
        setCacheTags(resultCacheTags);
        setUpdateTags(resultCacheTags);
        setTagList(resultTagList);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('ไม่พบข้อมูลที่ต้องการ');
        } else {
          setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
        }
        console.log(error.message);
      }
      finally {
        setLoadData(false);
      }
    }

    if(id) {
      setSubmitType('UPDATE');
      findProduct();
    }
  }, [id]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    fecthMasterData();
  }, []);

  const fecthMasterData = async () => {
    setLoadData(true);
    try {
      const fetchBrands = await BrandService.getBrands();
      const categories = await CategoryService.getCategories();
      const tags = await TagService.getTags();

      setBrandList(fetchBrands.data.RESULT_DATA);
      setCategoryList(categories.data.RESULT_DATA);
      setTagList(tags.data.RESULT_DATA);
    }
    catch(error) {
      console.log(error.message);
      toast.error(error.message);
    }
    finally {
      setLoadData(false);
    }
  }

  const handleSelectAddCategory = (newCategory) => {
    const currentSelectCategories = [...updateCategoies];
    const currentCategoryList = [...categoryList];
    currentSelectCategories.push(newCategory);
    const resultCategoryList = currentCategoryList.filter(i => i.id !== newCategory.id);
    setUpdateCategories(currentSelectCategories);
    setCategoryList(resultCategoryList);
  }
  const handleRemoveCategory = (removeCategory) => {
    const currentSelectCategories = [...updateCategoies];
    const currentCategoryList = [...categoryList];
    currentCategoryList.push(removeCategory);
    const resultSelectCategories = currentSelectCategories.filter(i => i.id !== removeCategory.id);
    setUpdateCategories(resultSelectCategories);
    setCategoryList(currentCategoryList);
  }
  const handleSelectAddTag = (newTag) => {
    const currentSelectTags = [...updateTags];
    const currentTagList = [...tagList];
    currentSelectTags.push(newTag);
    const resultTagList = currentTagList.filter(i => i.id !== newTag.id);
    setUpdateTags(currentSelectTags);
    setTagList(resultTagList);
  }
  const handleRemoveTag = (removeTag) => {
    const currentSelectTags = [...updateTags];
    const currentTagList = [...tagList];
    currentTagList.push(removeTag);
    const resultSelectTags = currentSelectTags.filter(i => i.id !== removeTag.id);
    setUpdateTags(resultSelectTags);
    setTagList(currentTagList);
  }

  const addUploadImages = (e) => {
    const temp = [...uploadedImages];
    const filesArray = Array.from(e.target.files);
    filesArray.map(i => temp.push(i))
    if(images.length === 0 && uploadedImages.length === 0) {
      setPreviewImage(URL.createObjectURL(temp[0]))
    }
    setUploadedImages(temp);
  }

  const onSubmit = async (data) => {
    //console.log(data)
    let categoriesData;
    let tagsData;
    let imagesData;

    if(userRole === 'ADMIN') {
      if(submitType === 'INSERT') {
        categoriesData = updateCategoies.map(i => ({ categoryId: i.id }));
        tagsData = updateTags.map(i => ({ tagId: i.id }));
        imagesData = [
          //{ url_path: "http://www.testimage.com/test_image_1.jpg" }
        ];
      }
      else if(submitType === 'UPDATE') {
        categoriesData = {
          connect: [],
          disconnect: []
        };
        tagsData = {
          connect: [],
          disconnect: []
        };
        imagesData = {
          create: [
              // { 
              //     "url_path": "http://www.testimage.com/test_image_3.jpg",
              //     "sequence_order": 3
              // }
          ],
          delete: [
            // { "id": 5 }
          ],
          update: [
              // { 
              //     "id": 5,
              //     "url_path": "http://www.testimage.com/test_image_3.jpg",
              //     "sequence_order": 3
              // }
          ]
        };

        updateCategoies.filter(i => {
          const newCategory = cacheCategories.find(x => x.id === i.id);
          if(!newCategory) { // not found in cache categories that's mean it's new
            categoriesData.connect.push({ categoryId: i.id });
          }
        });
        cacheCategories.filter(i => {
          const removeCategory = updateCategoies.find(x => x.id === i.id);
          if(!removeCategory) { // not found in updateCategoies that's mean it's must remove
            categoriesData.disconnect.push({ categoryId: i.id });
          }
        });
        updateTags.filter(i => {
          const newTag = cacheTags.find(x => x.id === i.id);
          if(!newTag) { // not found in cache tags that's mean it's new
            tagsData.connect.push({ tagId: i.id });
          }
        });
        cacheTags.filter(i => {
          const removeTag = updateTags.find(x => x.id === i.id);
          if(!removeTag) { // not found in updateTags that's mean it's must remove
            tagsData.disconnect.push({ tagId: i.id });
          }
        })
      }

      const requestData = {
        userId: authUser.id,
        name: data.name,
        description: data.description,
        brandId: data.brandId,
        price: data.price,
        publish: true,
        categories: categoriesData,
        tags: tagsData,
        specs: {
          screen_size: data.screen_size,
          processor: data.processor,
          display: data.display,
          memory: data.memory,
          storage: data.storage,
          graphic: data.graphic,
          operating_system: data.operating_system,
          camera: data.camera,
          optical_drive: data.optical_drive,
          connection_ports: data.connection_ports,
          wireless: data.wireless,
          battery: data.battery,
          color: data.color,
          dimension: `${data.width}x${data.height}x${data.depth}`,
          weight: data.weight,
          warranty: data.warranty,
          option: data.option
        },
        images: imagesData
      }

      const formData = new FormData();

      formData.append('userId', authUser.id);
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('brandId', data.brandId);
      formData.append('price', data.price);
      formData.append('categories', JSON.stringify(categoriesData));
      formData.append('tags', JSON.stringify(tagsData));
      formData.append('specs', JSON.stringify(requestData.specs));
      uploadedImages.map(i => {
        formData.append('images', i);
      });

      //console.log(requestData)

      if(submitType === 'INSERT') {

        formData.append('publish', true);

        try {
          await ProductService.addNewProduct(formData)
          toast.success(`Add new product is successfully!`);
          navigate('/product', { replace: true });
        }
        catch(error) {
          console.log(error.message);
          toast.error(`Add new product is failed due to: ${error.message}`);
        }
      }
      else if(submitType === 'UPDATE') {

        formData.append('imagesUpdate', JSON.stringify({"delete": deleteImages}));

        try {
          await ProductService.updateProduct(id, formData)
          toast.success(`Update product is successfully!`);
          navigate('/product', { replace: true });
        }
        catch(error) {
          console.log(error.message);
          toast.error(`Update product is failed due to: ${error.message}`);
        }
      }
    }
    else {
      toast.error(`You are in "Guest" mode, this action is not authorize.`)
    }
  }

  if(loadData) return <div>กำลังโหลด...</div>;
  if(error) return (
    <div>
      <h1>Something wrong</h1>
      <p>เกิดข้อผิดพลาด: {error}</p>
    </div>
  );

  return (
    <div className={`page upsert-product-page`}>
      <header className="page-title">
        <h1>{submitType === 'INSERT' && 'Add New'} {submitType === 'UPDATE' && 'Edit'} Product</h1>
        {submitType === 'INSERT' && <p className='mb-0'>Add new product to your stock</p>}
        {submitType === 'UPDATE' && <p className='mb-0'>SKU: {product?.sku}</p>}
      </header>
      
      <form onSubmit={handleSubmit(onSubmit)} className="row">

        <header className="col-12 hidden-phone">
          <div className='d-flex justify-content-end align-items-center mb-3'>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className='btn my-btn blue-btn big-btn px-5'
            >{isSubmitting ? 'Processing...' : <><FontAwesomeIcon icon={faSave} className='me-2' />Save</> }</button>
          </div>
        </header>

        <div className='col-sm-12'>
          <div className='row'>
            <div className='col-lg-4 mb-3'>
              <div className='card mb-3'>
                <div className='card-body px-5'>
                  <header>
                    <h5>Product Images<span></span></h5>
                  </header>
                
                  {
                    images.length === 0 && uploadedImages.length === 0
                    ?
                    <p className='text-center my-5 opacity-50 h5'>Not have image</p>
                    :
                    <>
                    <figure className='text-center mt-4 p-4 border-soft-light'>
                      <img 
                        src={previewImage} 
                        className='img-fluid'
                      />
                    </figure>
                    <div className='row mb-4 px-2'>
                    {
                      images.map((image, index) => {
                        return (
                          <div 
                            key={`old_image_${index + 1}`} 
                            className='col-6 col-md-4 mb-3 px-2'
                          >
                            <div className={`product-image-item border-soft-light ${activeImage === index ? 'active' : ''}`}>
                              <img 
                                src={`${import.meta.env.VITE_API_URL}/${image.path}`} 
                                className='img-fluid' 
                                style={{
                                  maxHeight: 60
                                }}
                                onClick={() => {
                                  setPreviewImage(`${import.meta.env.VITE_API_URL}/${image.path}`);
                                  setActiveImage(index);
                                }}
                              />
                              <div className='btn-delete'>
                                <button 
                                  type="button" 
                                  className='btn btn-link p-0 text-light btn-sm'
                                  onClick={() => {
                                    if(previewImage === index) {
                                      setPreviewImage(0);
                                    }
                                    const tempImages = [...images];
                                    const tempDeleteImages = [...deleteImages];
                                    const removeResult = tempImages.filter((_, thisIndex) => thisIndex !== index);
                                    tempDeleteImages.push(image.id)

                                    setDeleteImages(tempDeleteImages);
                                    setImages(removeResult);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                    {
                      uploadedImages.map((image, index) => {
                        return (
                          <div 
                            key={`upload_image_${index + 1}`} 
                            className='col-6 col-md-4 mb-3 px-2'
                          >
                            <div className={`product-image-item border-soft-light ${activeImage === (images.length + index) ? 'active' : ''}`}>
                              <img 
                                src={URL.createObjectURL(image)} 
                                className='img-fluid' 
                                style={{
                                  maxHeight: 60
                                }}
                                onClick={() => {
                                  setPreviewImage(URL.createObjectURL(image))
                                  setActiveImage(images.length + index);
                                }}
                              />
                              <div className='btn-delete'>
                                <button 
                                  type="button" 
                                  className='btn btn-link p-0 text-light btn-sm'
                                  onClick={() => {
                                    if(previewImage === index) {
                                      setPreviewImage(0);
                                    }
                                    const tempUploadImages = [...uploadedImages];
                                    const removeResult = tempUploadImages.filter((_, thisIndex) => thisIndex !== index);
                                    setUploadedImages(removeResult);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                    </div>
                    </>
                  }

                  <div className='text-center'>
                    <label 
                      htmlFor="image-upload" 
                      className="btn my-btn pruple-btn narrow-btn mt-2"
                    >+ Add Images</label>
                    <input 
                      id="image-upload" 
                      type="file" 
                      multiple={true}
                      style={{display: 'none'}} 
                      onChange={(e) => {
                        addUploadImages(e)
                        e.target.value = null;
                      }}
                    />
                  </div>

                </div>
              </div>
            </div>
            <div className='col-lg-8 mb-3'>
              <div className='col-12 mb-3'>
                <div className='card'>
                  <div className='card-body px-5'>
                    <header>
                      <h5>Product Specifications<span></span></h5>
                    </header>

                    <dl className='row my-4'>
                      <dt className='col-sm-3 mb-3'>Product Brand</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <select 
                            {...register('brandId')}
                            className={`form-control ${errors.brandId ? 'is-invalid' : ''}`}
                          >
                            <option value="">--Select brand--</option>
                            {
                              brandList.map((brand) => (
                                <option key={`product_brand_${brand.id}`} value={brand.id}>
                                  {brand.name}
                                </option>
                              ))
                            }
                          </select>
                          {errors.brandId && <small className="invalid-feedback">{errors.brandId.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Name</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('name')}
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          />
                          {errors.name && <small className="invalid-feedback">{errors.name.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Price</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            {...register('price')}
                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                          />
                          {errors.price && <small className="invalid-feedback">{errors.price.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Screen Size</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('screen_size')}
                            className={`form-control ${errors.screen_size ? 'is-invalid' : ''}`}
                          />
                          {errors.screen_size && <small className="invalid-feedback">{errors.screen_size.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Processor</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <textarea
                            rows={1}
                            {...register('processor')}
                            className={`form-control ${errors.processor ? 'is-invalid' : ''}`}
                          ></textarea>
                          {errors.processor && <small className="invalid-feedback">{errors.processor.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Display</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('display')}
                            className={`form-control ${errors.display ? 'is-invalid' : ''}`}
                          />
                          {errors.display && <small className="invalid-feedback">{errors.display.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Memory</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('memory')}
                            className={`form-control ${errors.memory ? 'is-invalid' : ''}`}
                          />
                          {errors.memory && <small className="invalid-feedback">{errors.memory.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Storage</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('storage')}
                            className={`form-control ${errors.storage ? 'is-invalid' : ''}`}
                          />
                          {errors.storage && <small className="invalid-feedback">{errors.storage.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Graphics</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('graphic')}
                            className={`form-control ${errors.graphic ? 'is-invalid' : ''}`}
                          />
                          {errors.graphic && <small className="invalid-feedback">{errors.graphic.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Operating System</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('operating_system')}
                            className={`form-control ${errors.operating_system ? 'is-invalid' : ''}`}
                          />
                          {errors.operating_system && <small className="invalid-feedback">{errors.operating_system.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Camera</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('camera')}
                            className={`form-control ${errors.camera ? 'is-invalid' : ''}`}
                          />
                          {errors.camera && <small className="invalid-feedback">{errors.camera.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Optical Drive</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('optical_drive')}
                            className={`form-control ${errors.optical_drive ? 'is-invalid' : ''}`}
                          />
                          {errors.optical_drive && <small className="invalid-feedback">{errors.optical_drive.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Connection Ports</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <textarea
                            rows={1}
                            {...register('connection_ports')}
                            className={`form-control ${errors.connection_ports ? 'is-invalid' : ''}`}
                          ></textarea>
                          {errors.connection_ports && <small className="invalid-feedback">{errors.connection_ports.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Wireless</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <textarea
                            rows={1}
                            {...register('wireless')}
                            className={`form-control ${errors.wireless ? 'is-invalid' : ''}`}
                          ></textarea>
                          {errors.wireless && <small className="invalid-feedback">{errors.wireless.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Battery</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('battery')}
                            className={`form-control ${errors.battery ? 'is-invalid' : ''}`}
                          />
                          {errors.battery && <small className="invalid-feedback">{errors.battery.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Color</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('color')}
                            className={`form-control ${errors.color ? 'is-invalid' : ''}`}
                          />
                          {errors.color && <small className="invalid-feedback">{errors.color.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Dimension (WxDxH)</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className='row'>
                          <div className='col-sm-4'>
                            <div className="form-group">
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                {...register('width')}
                                className={`form-control ${errors.width ? 'is-invalid' : ''}`}
                              />
                              {errors.width && <small className="invalid-feedback">{errors.width.message}</small>}
                            </div>
                          </div>
                          <div className='col-sm-4'>
                            <div className="form-group">
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                {...register('height')}
                                className={`form-control ${errors.height ? 'is-invalid' : ''}`}
                              />
                              {errors.height && <small className="invalid-feedback">{errors.height.message}</small>}
                            </div>
                          </div>
                          <div className='col-sm-4'>
                            <div className="form-group">
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                {...register('depth')}
                                className={`form-control ${errors.depth ? 'is-invalid' : ''}`}
                              />
                              {errors.depth && <small className="invalid-feedback">{errors.depth.message}</small>}
                            </div>
                          </div>
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Weight</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('weight')}
                            className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
                          />
                          {errors.weight && <small className="invalid-feedback">{errors.weight.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Warranty</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('warranty')}
                            className={`form-control ${errors.warranty ? 'is-invalid' : ''}`}
                          />
                          {errors.warranty && <small className="invalid-feedback">{errors.warranty.message}</small>}
                        </div>
                      </dd>
                      <dt className='col-sm-3 mb-3'>Option</dt>
                      <dd className='col-sm-9 mb-3'>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register('option')}
                            className={`form-control ${errors.option ? 'is-invalid' : ''}`}
                          />
                          {errors.option && <small className="invalid-feedback">{errors.option.message}</small>}
                        </div>
                      </dd>
                    </dl>

                  </div>
                </div>
              </div>
              <div className='col-12'>
                <div className='card mb-3'>
                  <div className='card-body px-5'>
                    <header>
                      <h5>Product Detail<span></span></h5>
                    </header>
                    <div className="form-group mt-4">
                      <textarea
                        rows={8}
                        {...register('description')}
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      ></textarea>
                      {errors.description && <small className="invalid-feedback">{errors.description.message}</small>}
                    </div>
                  </div>
                </div>
                <div className='card mb-3'>
                  <div className='card-body px-5'>
                    <header className='d-flex justify-content-between align-items-center mb-3'>
                      <h5>Category<span></span></h5>
                      <div className="dropdown dropup">
                        <button 
                          className={`btn my-btn narrow-btn purple-btn`} 
                          type="button" 
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="false"
                        ><small>+ Add</small></button>
                        <ul className="dropdown-menu dropdown-menu-lg-end">
                          {
                            categoryList.map((i, index) => {
                              return (
                                <button 
                                  key={`category_dropdown_item_${i.id}`}
                                  className='dropdown-item d-flex justify-content-between align-items-center'
                                  type='button'
                                  onClick={() => handleSelectAddCategory(i)}
                                >
                                  {i.name}
                                  <FontAwesomeIcon icon={faPlus} />  
                                </button>
                              )
                            })
                          }
                        </ul>
                      </div>
                    </header>
                    <div className='d-flex mb-2'>
                      {
                        updateCategoies.map((i, index) => (
                          <button 
                            key={`category_${i.id}`}
                            type="button"
                            className='btn btn-secondary me-2'
                            onClick={() => handleRemoveCategory(i)}
                          ><small>{i.name} <FontAwesomeIcon icon={faClose} /></small></button>
                        ))
                      }
                    </div>
                  </div>
                </div>
                <div className='card'>
                  <div className='card-body px-5'>
                    <header className='d-flex justify-content-between align-items-center mb-3'>
                      <h5>Tag<span></span></h5>
                      <div className="dropdown dropup">
                        <button 
                          className={`btn my-btn narrow-btn purple-btn`} 
                          type="button" 
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="false"
                        ><small>+ Add</small></button>
                        <ul className="dropdown-menu dropdown-menu-lg-end">
                          {
                            tagList.map((i, index) => {
                              return (
                                <button 
                                  key={`tag_dropdown_item_${i.id}`}
                                  className='dropdown-item d-flex justify-content-between align-items-center'
                                  type='button'
                                  onClick={() => handleSelectAddTag(i)}
                                >
                                  {i.name}
                                  <FontAwesomeIcon icon={faPlus} />  
                                </button>
                              )
                            })
                          }
                        </ul>
                      </div>
                    </header>
                    <div className='d-flex mb-2'>
                      {
                        updateTags.map((i, index) => (
                          <button 
                            key={`tag_${i.id}`}
                            type="button"
                            className='btn btn-secondary me-2'
                            onClick={() => handleRemoveTag(i)}
                          ><small>{i.name} <FontAwesomeIcon icon={faClose} /></small></button>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <div className='show-phone'>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className='btn my-btn blue-btn big-btn w-100'
          >{isSubmitting ? 'Processing...' : <><FontAwesomeIcon icon={faSave} className='me-2' />Save</> }</button>
        </div>

      </form>
    </div>
  )
}