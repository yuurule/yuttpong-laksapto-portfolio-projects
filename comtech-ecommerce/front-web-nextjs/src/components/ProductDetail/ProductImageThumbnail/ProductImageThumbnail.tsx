import styles from './ProductImageThumbnail.module.scss';

export default function ProductImageThumbnail({
  images
}: {
  images: any[]
}) {


  return (
    <div className={`${styles.productImageThumbnail}`}>
      {
        images.length > 0
        ?
        <>
        <figure className={`${styles.mainImage}`}>
          <img src={`${process.env.NEXT_PUBLIC_API_URL}/${images[0].path}`} className='img-fluid' />
        </figure>
        {
          images.length > 1 &&
          <ul className='list-inline'>
            {
              images.map((image: any, index: number) => {
                if(index > 0) {
                  return (
                    <li key={`product_image_${index + 1}`} className='list-inline-item'>
                      <div className={`${styles.subImageBox}`}>
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/${image.path}`} className='img-fluid' />
                      </div>
                    </li>
                  )
                }
              })
            }
          </ul>
        }
        </>
        :
        <figure className={`${styles.mainImage}`}>
          <img src="https://placehold.co/400x320" className='img-fluid' />
        </figure>
      }
    </div>
  )
}