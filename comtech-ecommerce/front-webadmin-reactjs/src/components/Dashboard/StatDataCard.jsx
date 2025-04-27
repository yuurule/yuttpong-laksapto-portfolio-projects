import styles from './StatDataCard.module.scss';

export default function StatDataCard({
  title,
  icon,
  dataValue,
  valueColor='var(--main-orange)'
}) {


  return (
    <div className={`card ${styles.statDataCard}`}>
      <div className={`card-body ${styles.body}`}>
        <div className='h-100 d-flex justify-content-around align-items-center'>
          <div className='text-center'>
            {icon}
            <strong className={`${styles.title}`}>{title}</strong>
          </div>
          <strong 
            className={`${styles.dataValue}`}
            style={{
              color: `${valueColor}`
            }}
          >{dataValue}
          </strong>
        </div>
      </div>
    </div>
  )
}