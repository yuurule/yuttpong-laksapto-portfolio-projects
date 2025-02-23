import Link from 'next/link';

export default function ProductCategory() {



  return (
    <div className="d-flex">
      <Link href="/">MSI</Link>
      <span>|</span>
      <Link href="/">Gaming</Link>
    </div>
  )
}