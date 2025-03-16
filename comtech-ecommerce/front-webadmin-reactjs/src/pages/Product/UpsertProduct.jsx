import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faClose, faBars } from '@fortawesome/free-solid-svg-icons';
import * as ProductService from '../../services/productService';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

const categorySchema = z.object({
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
  const navigate = useNavigate();
  
  const [loadData, setLoadData] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [brandList, setBrandList] = useState([]);
  const [submitType, setSubmitType] = useState('INSERT'); // 'INSERT', 'UPDATE'

  const [cacheCategories, setCacheCategories] = useState([]); 
  const [cacheTags, setCacheTags] = useState([]);
  const [updateCategoies, setUpdateCategories] = useState([]);
  const [updateTags, setUpdateTags] = useState([]);

  useEffect(() => {
    const findProduct = async () => {
      setLoadData(true);
      try {
        const findProduct = await ProductService.getOneProduct(id);
        const productData = findProduct.data.RESULT_DATA;
        setProduct(productData);
        const dimension = (productData.specs.dimension).split(' x ');
        const productDataForm = {
          brandId: productData.brandId,
          name: productData.name,
          price: productData.price,
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
          width: parseFloat(dimension[0]),
          height: parseFloat(dimension[1]),
          depth: parseFloat(dimension[2]),
          weight: productData.specs.weight,
          warranty: productData.specs.warranty,
          option: productData.specs.option,
        }
        reset(productDataForm);
        setCacheCategories(productData.categories);
        setCacheTags(productData.tags);
        setUpdateCategories(productData.categories);
        setUpdateTags(productData.tags);
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
    resolver: zodResolver(categorySchema)
  });

  useEffect(() => {
    fecthProductBrand();
  }, []);

  const fecthProductBrand = async () => {
    setLoadData(true);
    try {
      const fetchBrands = await ProductService.getBrands();
      setBrandList(fetchBrands.data.RESULT_DATA);
    }
    catch(error) {
      console.log(error.message);
      toast.error(error.message);
    }
    finally {
      setLoadData(false);
    }
  }

  const onSubmit = async (data) => {
    //console.log(data)

    let categoriesData;
    let tagsData;
    let imagesData;

    if(submitType === 'INSERT') {
      categoriesData = [
        { categoryId: 1 }
      ];
      tagsData = [
        //{ tagId: 1 }
      ];
      imagesData = [
        //{ url_path: "http://www.testimage.com/test_image_1.jpg" }
      ];
    }
    else if(submitType === 'UPDATE') {
      categoriesData = {
        connect: [
            //{ "categoryId": 3 }
        ],
        disconnect: [
            //{ "categoryId": 1 }
        ]
      };
      tagsData = {
        connect: [
            //{ "tagId": 3 }
        ],
        disconnect: [
            // { "tagId": 1 },
            // { "tagId": 2 }
        ]
      };
      imagesData = {
        create: [
            // { 
            //     "url_path": "http://www.testimage.com/test_image_3.jpg",
            //     "sequence_order": 3
            // }
        ],
        delete: [
            //{ "id": 5 }
        ],
        update: [
            // { 
            //     "id": 5,
            //     "url_path": "http://www.testimage.com/test_image_3.jpg",
            //     "sequence_order": 3
            // }
        ]
      };
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
        dimemsion: `${data.width}x${data.height}x${data.depth}`,
        weight: data.weight,
        warranty: data.warranty,
        option: data.option
      },
      images: imagesData
    }

    if(submitType === 'INSERT') {
      try {
        await ProductService.addNewProduct(requestData)
        toast.success(`Add new product is successfully!`);
        navigate('/product', { replace: true });
      }
      catch(error) {
        console.log(error.message);
        toast.error(`Add new product is failed due to: ${error.message}`);
      }
    }
    else if(submitType === 'UPDATE') {
      try {
        await ProductService.updateProduct(id, requestData)
        toast.success(`Update product is successfully!`);
        navigate('/product', { replace: true });
      }
      catch(error) {
        console.log(error.message);
        toast.error(`Update product is failed due to: ${error.message}`);
      }
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
    <div className={`page`}>
      
      <form onSubmit={handleSubmit(onSubmit)} className="row">

        <header className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1>{submitType === 'INSERT' && 'Add New'} {submitType === 'UPDATE' && 'Update'} Product</h1>
            {submitType === 'UPDATE' && <p className='mb-0'>SKU: {product?.sku}</p>}
          </div>
          <div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className='btn btn-success px-5 py-2'
            >{isSubmitting ? 'Processing...' : <><FontAwesomeIcon icon={faSave} className='me-2' />Save</> }</button>
          </div>
        </header>

        <div className='col-sm-12'>
          <div className='row'>
            <div className='col-sm-3'>
              <div className='card mb-3'>
                <div className='card-body'>
                  <figure className='text-center'>
                    <img src="/images/dummy-product.jpg" style={{width: 300}} />
                  </figure>

                  {
                    [...Array(3)].map((i, index) => (
                      <div 
                        key={`product_image_input_${index + 1}`} 
                        className='d-flex justify-content-between align-items-center mb-2 px-3 py-1'
                        style={{border: '1px solid rgba(0,0,0,0.3)', borderRadius: 6}}
                      >
                        <div className='d-flex align-items-center'>
                          <FontAwesomeIcon icon={faBars} className='me-2' />
                          <figure className='mb-0 me-3'>
                            <img src="/images/dummy-product.jpg" style={{width: 75}} className='' />
                          </figure>
                          { index === 0 && <span className='badge text-bg-primary'>Primary</span> }
                        </div>
                        <div>
                          <button className='btn btn-primary me-2'><FontAwesomeIcon icon={faEdit} /></button>
                          <button className='btn btn-danger'><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                      </div>
                    ))
                  }

                  <div className='text-center'>
                    <button className='btn btn-primary px-4 mt-2'>+ Add New Image</button>
                  </div>

                </div>
              </div>
            </div>
            <div className='col-sm-5'>
              <div className='card'>
                <div className='card-body'>
                  <header>
                    <h5>Product Specifications</h5>
                    <hr />
                  </header>

                  <dl className='row mb-4'>
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
            <div className='col-sm-4'>
              <div className='card mb-3'>
                <div className='card-body'>
                  <div className="form-group">
                    <label className='form-label'>Product Detail</label>
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
                <div className='card-body'>
                  <header className='d-flex justify-content-between align-items-center mb-3'>
                    <h5>Category</h5>
                    <button className='btn btn-primary'><small>+ Add</small></button>
                  </header>
                  <div className='d-flex mb-2' style={{border: '1px solid rgba(0,0,0,0.3)', borderRadius: 4, padding: 15}}>
                    {
                      updateCategoies.map((cat, index) => (
                        <button 
                          key={`category_${cat.category.id}`}
                          type="button"
                          className='btn btn-secondary me-2'
                          onClick={() => {}}
                        ><small>{cat.category.name} <FontAwesomeIcon icon={faClose} /></small></button>
                      ))
                    }
                  </div>
                </div>
              </div>
              <div className='card'>
                <div className='card-body'>
                  <header className='d-flex justify-content-between align-items-center mb-3'>
                    <h5>Tag</h5>
                    <button className='btn btn-primary'><small>+ Add</small></button>
                  </header>
                  <div className='d-flex mb-2' style={{border: '1px solid rgba(0,0,0,0.3)', borderRadius: 4, padding: 15}}>
                    {
                      updateTags.map((tag, index) => (
                        <button 
                          key={`tag_${tag.tag.id}`}
                          type="button"
                          className='btn btn-secondary me-2'
                          onClick={() => {}}
                        ><small>{tag.tag.name} <FontAwesomeIcon icon={faClose} /></small></button>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  )
}