"use client";

import React, { useState } from 'react';
import styles from './Pagination.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faBackward, faCaretRight, faForward } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import { usePathname, useSearchParams  } from 'next/navigation';

export default function Pagination({
  totalPages = 1,
  currentPage = 1
}: {
  totalPages: number,
  currentPage: number,
}) {

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  const fullUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const renderHref = (dirType: 'prev' | 'next' | 'none', pageNumber?: number) => {
    const urlSplit = fullUrl.split(`&page=${currentPage}`);
    let resultNewPage = '&page=';
    switch(dirType) {
      case 'none':
        resultNewPage += pageNumber;
        break;
      case 'prev':
        resultNewPage += currentPage - 1;
        break;
      case 'next':
        resultNewPage += currentPage + 1;
        break;
    }

    return urlSplit[0] + resultNewPage;
  }

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div className={`${styles.pagination}`}>
      {/* <strong>Page 1/10</strong> */}
      <nav aria-label="Page navigation example">
        <ul className={`pagination ${styles.customPagination}`}>
          {/* <li className={`page-item ${styles.pageItem}`}>
            <Link href="/" className={`page-link ${styles.pageLink}`}>
              <FontAwesomeIcon icon={faBackward} />
            </Link>
          </li> */}
          <li className={`page-item ${styles.pageItem}`}>
            {
              currentPage > 1
              ?
              <Link href={renderHref('prev')} className={`page-link ${styles.pageLink}`}>
                <FontAwesomeIcon icon={faCaretLeft} />
              </Link>
              :
              <button type='button' disabled={true} className={`page-link ${styles.pageLink}`}>
                <FontAwesomeIcon icon={faCaretLeft} />
              </button>
            }
            
          </li>
          {/* <li className={`page-item active ${styles.pageItem} ${styles.active}`}><Link href="/" className={`page-link ${styles.pageLink}`}>1</Link></li>
          <li className={`page-item ${styles.pageItem}`}><Link href="/" className={`page-link ${styles.pageLink}`}>2</Link></li>
          <li className={`page-item ${styles.pageItem}`}><Link href="/" className={`page-link ${styles.pageLink}`}>3</Link></li>
          <li className={`page-item ${styles.pageItem}`}><Link href="/" className={`page-link ${styles.pageLink}`}>...</Link></li> */}

          <li className={`page-item  dropdown-no-icon ${styles.pageItem} mx-5`}>
            <Dropdown 
              show={show} 
              onToggle={(isOpen) => setShow(isOpen)}
              drop='up'
            >
              <Dropdown.Toggle 
                className={`px-0 btn btn-link text-dark d-flex align-items-center`} 
                style={{textDecoration: 'none', backgroundColor: 'transparent'}}
                id="dropdown-pagination"
              >
                Page {currentPage} / {totalPages}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {
                  [...Array(totalPages)].map((i, index) => {
                    if(currentPage === index + 1) {
                      return (
                        <button 
                          key={`dropdown-pagination-item-${index + 1}`}
                          className='dropdown-item' 
                          disabled={true}
                        >{index + 1}</button>
                      )
                    }
                    else {
                      return (
                        <Link 
                          key={`dropdown-pagination-item-${index + 1}`}
                          href={renderHref('none', index + 1)} 
                          className='dropdown-item'
                          onClick={handleClose}
                        >{index + 1}</Link>
                      )
                    }
                  })
                }
              </Dropdown.Menu>
            </Dropdown>
            
          </li>

          <li className={`page-item ${styles.pageItem}`}>
            {
              currentPage < totalPages
              ?
              <Link href={renderHref('next')} className={`page-link ${styles.pageLink}`}>
                <FontAwesomeIcon icon={faCaretRight} />
              </Link>
              :
              <button type='button' disabled={true} className={`page-link ${styles.pageLink}`}>
                <FontAwesomeIcon icon={faCaretRight} />
              </button>
            }
          </li>
          {/* <li className={`page-item ${styles.pageItem}`}>
            <Link href="/" className={`page-link ${styles.pageLink}`}>
              <FontAwesomeIcon icon={faForward} />
            </Link>
          </li> */}
        </ul>
      </nav>
    </div>
  )
}