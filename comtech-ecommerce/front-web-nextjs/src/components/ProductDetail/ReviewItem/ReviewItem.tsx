import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function ReviewItem() {



  return (
    <div className="d-flex">
      <div>
        <img src="/dummy-reviewer.png" />
      </div>
      <div>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis quia pariatur, dignissimos incidunt maiores magni ut ipsam consequatur impedit porro unde nesciunt distinctio vel iure fugiat harum quasi, vero architecto.</p>

        <footer>
          <strong>John Doh</strong>
          <span>Mar 24 2025</span>
          <div className="d-flex">
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
          </div>
        </footer>
      </div>
    </div>
  )
}
