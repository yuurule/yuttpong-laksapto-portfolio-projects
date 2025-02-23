
export default function ProductListSorting() {

  return (
    <div className="d-flex justify-content-end">
      <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          Show product on sales only
        </label>
      </div>
      <div className="d-flex">
        <span>Sortby:</span> 
        <select className={`form-select`} aria-label="Default select example">
          <option value="0">All Category</option>
          <option value="1">Notebook</option>
          <option value="2">Desktop</option>
          <option value="3">Mobile phone</option>
        </select>
      </div>
      <div className="d-flex">
        <span>Show:</span>
        <select className={`form-select`} aria-label="Default select example">
          <option value="0">All Category</option>
          <option value="1">Notebook</option>
          <option value="2">Desktop</option>
          <option value="3">Mobile phone</option>
        </select>
      </div>
    </div>
  )
}