import Link from 'next/link';
import styles from './ProductTags.module.scss';

export default function ProductTags({
  tags = []
}: {
  tags: any[] | null
}) {


  return (
    <div className={`${styles.productTags}`}>
      <strong className="me-2">Tags: </strong>
      {
        tags !== null && tags.length > 0 &&
        <ul className="list-inline">
        {
          tags.map((tag: any, index: number) => (
            <li key={`tag_item_${tag?.tagId}`} className="list-inline-item"><Link href="/">{tag?.tag?.name}</Link></li>
          ))
        }
        </ul>
      }
    </div>
  )
}