import styles from './Homepage.module.scss';
import HeroSlide from '@/components/Homepage/HeroSlide/HeroSlide';
import OurServices from '@/components/Homepage/OurServices/OurServices';
import TopSelling from '@/components/Homepage/TopSelling/TopSelling';
import NewArrival from '@/components/Homepage/NewArrival/NewArrival';

export default function HomePage() {

  // Fecth api here..

  return (
    <main className={`${styles.homepage}`}>
      <div className='container'>
        <HeroSlide />
        <OurServices />
        <TopSelling />
        <NewArrival />
      </div>
    </main>
  );
}
