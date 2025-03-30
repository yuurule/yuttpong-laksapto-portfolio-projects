import styles from './ProductBox.module.scss';
import Link from 'next/link';
import ProductCategory from '../ProductCategory/ProductCategory';
import StarRating from './StarRating/StarRating';

export default function ProductBox({ 
  data,
  previewStyle = "vertical", 
} : { 
  data: any,
  previewStyle?: string 
}) {

  const calculateRating = () => {
    if(data && data.reviews.length > 0) {
      let sumRating = 0;
      data.reviews.map((i:any) => sumRating += parseInt(i.rating));
      return Math.floor(sumRating / data.reviews.length);
    }
    else {
      return 0;
    }
  }

  const calculatePriceDiscount = () => {
    let realPriceResult : number | string = 0;
    let discountPriceResult : number | string = 0;

    if(data) {
      let price = parseFloat(data.price);
      realPriceResult = '฿' + price.toLocaleString('th-TH');

      if(data.campaignProducts.length > 0) {
        let discount = parseFloat(data.campaignProducts[0].campaign.discount)
        discountPriceResult = '฿' + Math.floor((price - ((price * discount) / 100))).toLocaleString('th-TH');
      }
    }

    return {
      realPriceResult,
      discountPriceResult
    }
  }

  return (
    <div className={`${styles.productBox} ${previewStyle === "horizontal" ? styles.horizontal : ''}`}>
      <Link href={`/products/${data?.id}`} style={{width: `${previewStyle === "horizontal" ? 200 : 'auto'}`}}>
        <img src="/images/dummy-product.jpg" className='img-fluid' />
      </Link>
      <div className={`${styles.content}`}>
        <ProductCategory categories={data?.categories} />
        <header className={`${styles.title}`}>
          <strong className={`${styles.productName}`}>
            <Link href={`/products/${data?.id}`}>{data?.name}</Link>
          </strong>
          {/* <StarRating rating={calculateRating()} /> */}
          <footer className={`${styles.price}`}>
            {
              data?.campaignProducts.length > 0
              ?
              <>
              <p>{calculatePriceDiscount().discountPriceResult}</p>
              <small><s>{calculatePriceDiscount().realPriceResult}</s></small>
              </>
              :
              <p>{calculatePriceDiscount().realPriceResult}</p>
            }
          </footer>
        </header>
      </div>
    </div>
  )
}