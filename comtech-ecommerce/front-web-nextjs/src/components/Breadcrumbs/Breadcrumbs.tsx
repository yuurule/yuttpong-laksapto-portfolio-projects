import { Fragment } from 'react';
import styles from './Breadcrumbs.module.scss';
import Link from 'next/link';

interface UrlListProps {
  text: string;
  url: string | null;
}

export default function Breadcrumbs({ urlList } : { urlList: UrlListProps[] }) {

  return (
    <div className={`${styles.breadcrumbs}`}>
      <div className={`container ${styles.container}`}>
        {
          urlList.map((i: { text: string, url: string | null }, index: number) => {
            if(index < urlList.length - 1) {
              return (
                <Fragment key={`breadcrumb_list_${index + 1}`}>
                  <Link href={`${i.url}`}>{i.text}</Link>
                  <span className={`${styles.divider}`}>/</span>
                </Fragment>
              )
            }
            else {
              return (
                <span key={`breadcrumb_list_${index + 1}`} className='mx-0'>{i.text}</span>
              )
            }
          })
        }
      </div>
    </div>
  )
}