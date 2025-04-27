"use client"

import { faHeart, faMessage, faShoppingBag, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MyAccountMenu() {

  const pathName = usePathname();

  return (
    <ul className="list-unstyled">
      <li>
        <Link href="/my-account" className={`btn design-btn soft-btn ${pathName === '/my-account' ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faUser} className="me-3" />
          Account Infomation
        </Link>
      </li>
      <li>
        <Link href="/my-account/orders" className={`btn design-btn soft-btn ${pathName === '/my-account/orders' ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faShoppingBag} className="me-3" />
          Orders
        </Link>
      </li>
      <li>
        <Link href="/my-account/wishlists" className={`btn design-btn soft-btn ${pathName === '/my-account/wishlists' ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faHeart} className="me-3" />
          Wishlist
        </Link>
      </li>
      <li>
        <Link href="/my-account/reviews" className={`btn design-btn soft-btn ${pathName === '/my-account/reviews' ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faMessage} className="me-3" />
          Reviews
        </Link>
      </li>
    </ul>
  )
}