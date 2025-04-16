"use client"

import { useState, useEffect } from 'react';
import styles from './DealOfTheDay.module.scss';

export default function TimeCountDown({
  endDateTime
}: {
  endDateTime: string
}) {

  const calculateTimeLeft = () => {
    let timeLeft: any = {};
    
    if(endDateTime) {
      const difference = +new Date(endDateTime) - +new Date();
      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
    }
    
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className={`${styles.timeCountDown}`}>
      <div className={`${styles.timeBox}`}>
        <strong className={`${styles.timeDigit}`}>
          {timeLeft.days || '0'}
        </strong><span>Days</span></div>
      <div className={`${styles.timeBox}`}>
        <strong className={`${styles.timeDigit}`}>
          {timeLeft.hours || '0'}
        </strong><span>Hours</span></div>
      <div className={`${styles.timeBox}`}>
        <strong className={`${styles.timeDigit}`}>
          {timeLeft.minutes || '0'}
        </strong><span>Mins</span></div>
      <div className={`${styles.timeBox}`}>
        <strong className={`${styles.timeDigit}`}>
          {timeLeft.seconds || '0'}
        </strong><span>Secs</span></div>
      {
        Object.keys(timeLeft).length === 0 && <div className={styles.timerComplete}>หมดเวลาแล้ว!</div>
      }
    </div>
  )
}