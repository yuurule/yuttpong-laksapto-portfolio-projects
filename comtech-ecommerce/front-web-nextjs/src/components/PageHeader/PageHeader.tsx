import styles from './PageHeader.module.scss';

export default function PageHeader({ pageTitle } : { pageTitle: string }) {


  return (
    <h1 className={`${styles.pageTitle}`}>{pageTitle}</h1>
  )
}