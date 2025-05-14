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
        <div className='h-100 d-flex align-items-center'>
          <div>
            <strong 
              className={`${styles.dataValue}`}
              style={{
                color: `${valueColor}`
              }}
            >{dataValue}
            </strong>
            <div className='d-flex align-items-center'>
              {icon} <strong className={`${styles.title}`}>{title}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}