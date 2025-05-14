import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function CalendarCard() {


  return (
    <div className="card">
      <div className="card-body calendar-card">
        <header className='d-flex justify-content-between align-items-center'>
          <h5 className='mb-0'>Calendar<span></span></h5>
        </header>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar className='w-100' />
        </LocalizationProvider>
      </div>
    </div>
  )
}