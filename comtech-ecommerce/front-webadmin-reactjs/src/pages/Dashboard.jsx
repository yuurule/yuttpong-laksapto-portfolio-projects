import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faMoneyBillWave, faOilWell, faUsers } from '@fortawesome/free-solid-svg-icons';
import CalendarCard from '../components/Dashboard/CalendarCard';
import LatestOrdersCard from '../components/Dashboard/LatestOrdersCard';
import ActiveCampaignCard from '../components/Dashboard/ActiveCampaignCard';
import StatDataCard from '../components/Dashboard/StatDataCard';
import * as OrderService from '../services/orderService';
import * as CustomerService from '../services/customerService';
import { toast } from 'react-toastify';
import { formatTimestamp, formatMoney } from '../utils/utils';
import IncomeLineChart from '../components/Dashboard/IncomeLineChart';
import BestSellerPieChart from '../components/Dashboard/BestSellerPieChart';

export default function Dashboard() {

  const [loadData, setLoadData] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);

  useEffect(() => {
    const fecthOrders = async () => {
      setLoadData(true);
      try {
        const orders = await OrderService.getOrders({
          paymentStatus: 'PAID'
        });
        const customers = await CustomerService.getCustomers();
        const activeCustomer = customers.data.RESULT_DATA.filter(i => i.onDelete === null)

        let tempTotalIncome = 0;
        orders.data.RESULT_DATA.map(i => tempTotalIncome += parseFloat(i.total));

        setTotalIncome(tempTotalIncome);
        setTotalCustomer(activeCustomer.length);
      }
      catch(error) {
        console.log(error);
        toast.error(`Fetch order is failed due to reason: ${error}`);
      }
      finally {
        setLoadData(false);
      }
    }

    fecthOrders();
  }, []);

  return (
    <div className={`page`}>
      
      <header className="page-title">
        <h1>Dashboard</h1>
        <p>Welcome to webadmin</p>
      </header>

      <div className="row mt-4">
        
        <div className="col-sm-9">
          <div className="row">
            <div className='col-12'>
              <div className='row'>
                <div className="col-sm-3 mb-3">
                  <StatDataCard
                    title={<>Total< br />Income</>}
                    icon={<FontAwesomeIcon icon={faMoneyBillWave} />}
                    dataValue={<>฿{formatMoney(totalIncome)}</>}
                  />
                </div>
                <div className="col-sm-3 mb-3">
                  <StatDataCard
                    title={<>Total< br />Customer</>}
                    icon={<FontAwesomeIcon icon={faUsers} />}
                    dataValue={totalCustomer.toLocaleString('th-TH')}
                    valueColor={'var(--main-purple)'}
                  />
                </div>
                <div className="col-sm-3 mb-3">
                  <StatDataCard
                    title={'Traffic'}
                    icon={<FontAwesomeIcon icon={faDoorOpen} />}
                    dataValue={`12,503`}
                    valueColor={'var(--light-blue)'}
                  />
                </div>
                <div className="col-sm-3 mb-3">
                  <StatDataCard
                    title={<>Bandwith< br />Usage</>}
                    icon={<FontAwesomeIcon icon={faOilWell} />}
                    dataValue={`840mb`}
                    valueColor={'var(--main-green)'}
                  />
                </div>
              </div>
            </div>
            <div className='col-sm-8 mb-3'>
              <IncomeLineChart />
            </div>
            <div className='col-sm-4 mb-3'>
              <CalendarCard />
            </div>
          </div>
        </div>

        <div className='col-sm-3 mb-3'>
          <div className='row'>
            <div className='col-12'>
              <BestSellerPieChart />
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col-sm-7 mb-3'>
          <LatestOrdersCard />
        </div>
        <div className='col-sm-5 mb-3'>
          <ActiveCampaignCard />
        </div>
      </div>
      
    </div>
  )
}