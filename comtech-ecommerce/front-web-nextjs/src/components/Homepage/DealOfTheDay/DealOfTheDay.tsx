import styles from './DealOfTheDay.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ProductCategory from '@/components/ProductCategory/ProductCategory';
import StarRating from '@/components/ProductBox/StarRating/StarRating';
import { productService } from '@/services';
import { moneyFormat } from '@/utils/rendering';
import TimeCountDown from './TimeCountDown';
import Link from 'next/link';

export default async function DealOfTheDay() {
  try {
    const product = await productService.getOneProduct('3');
    const result = product.RESULT_DATA;

    const calculatePrice = () => {
      let realPrice = parseFloat(result.price);
      let sellPrice = 0;
      if(result.campaignProducts.length > 0 && (result.campaignProducts[0].campaign.startAt && result.campaignProducts[0].campaign.endAt)) {
        sellPrice = realPrice - ((realPrice * result.campaignProducts[0].campaign.discount) / 100);
      }
      else {
        sellPrice = realPrice
      }

      return { realPrice, sellPrice }
    }

    const calculateSellQuantity = () => {
      let totalSaleQuantity = 0;
      result.orderItems.map((i: any) => {
        totalSaleQuantity += i.quantity;
      });

      const inStockTotal = result.inStock.inStock;
      const salePercent = (totalSaleQuantity * inStockTotal) / 100;

      return { totalSaleQuantity, salePercent };
    }

    const calculateReview = () => {
      if(result.reviews.length > 0) {
        let resultReview = 0;
        result.reviews.map((i: any) => resultReview += i.rating);
        return resultReview / result.reviews.length;
      }
      else {
        return 0;
      }
    }

    return (
      <div className={`${styles.dealOfTheDay}`}>
        <Link href={`/products/${result.id}`}>
          <figure className='text-center'>
            <img src="/images/dummy-product.jpg" className='img-fluid' />
          </figure>
        </Link>
        <div className={`${styles.content}`}>
          {
            result.campaignProducts.length > 0 && (result.campaignProducts[0].campaign.startAt && result.campaignProducts[0].campaign.endAt) &&
            <div className='d-flex'>
              <span>-{result.campaignProducts[0].campaign.discount}%</span>
              <span>HOT</span>
            </div>
          }
          <ProductCategory categories={result.categories} />
          <header className={`${styles.title}`}>
            <Link href={`/products/${result.id}`} className='text-dark'><strong className={`${styles.productName}`}>{result.name}</strong></Link>
          </header>
          {/* <StarRating rating={calculateReview()} /> */}
          <div className={`${styles.price} mb-2`}>
            <p>฿{moneyFormat(calculatePrice().sellPrice, 2, 2)}</p>
            {
              result.campaignProducts.length > 0 && (result.campaignProducts[0].campaign.startAt && result.campaignProducts[0].campaign.endAt) &&
              <small><s>฿{moneyFormat(calculatePrice().realPrice, 2, 2)}</s></small>
            }
          </div>
          <div className={`${styles.soldAmount}`}>
            <small>Sold : {calculateSellQuantity().totalSaleQuantity}/{result.inStock.inStock}</small>
            <div className="progress mt-1">
              <div className="progress-bar" style={{width: `${calculateSellQuantity().salePercent}%`}}></div>
            </div>
          </div>
          <TimeCountDown 
            endDateTime={result.campaignProducts[0].campaign.endAt}
          />
        </div>
      </div>
    )
  } catch(error) {
    console.log('Failed to fetch product:', error);
    return <div>เกิดข้อผิดพลาด ไม่สามารถดึงข้อมูลสินค้าได้</div>;
  }
}