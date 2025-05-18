import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import PrivateRoute from "./layouts/PrivateRoute";
import MainLayout from './layouts/MainLayout';
import Login from "./pages/Login";
import IndexPage from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import Category from "./pages/Category";
import Tag from "./pages/Tag";
import Products from "./pages/Product/Products";
import ProductDetail from "./pages/Product/ProductDetail";
import Stock from "./pages/Stock";
import Orders from "./pages/Orders";
import Customers from "./pages/Customer/Customers";
import CustomerDetail from "./pages/Customer/CustomerDetail";
import UnAuthorized from "./pages/UnAuthorized";
import NotFound from "./pages/NotFound";
import UpsertProduct from "./pages/Product/UpsertProduct";
import Campaign from "./pages/Campaign";

function App() {
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* "homepage": "https://www.devgamemaker.com/portfolio/comtech/frontend-webadmin-react", */}
        {/* <Router basename="/portfolio/comtech/frontend-webadmin-react"> */}
        <Router>
          <Routes>

            <Route path="/login" element={<Login />}></Route>

            <Route path="/" element={<MainLayout />}>

              <Route index element={<PrivateRoute><IndexPage /></PrivateRoute>}></Route>
              <Route path="dashboard" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><Dashboard /></PrivateRoute>}></Route>
              {/* <Route path="report" element={<PrivateRoute allowedRoles={['ADMIN']}><Report /></PrivateRoute>}></Route> */}
              <Route path="category" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><Category /></PrivateRoute>}></Route>
              <Route path="tag" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><Tag /></PrivateRoute>}></Route>
              <Route path="product" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><Products /></PrivateRoute>}></Route>
              <Route path="product/:id" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><ProductDetail /></PrivateRoute>}></Route>
              <Route path="product/create" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><UpsertProduct /></PrivateRoute>}></Route>
              <Route path="product/edit/:id" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><UpsertProduct /></PrivateRoute>}></Route>
              <Route path="stock" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><Stock /></PrivateRoute>}></Route>
              <Route path="order" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><Orders /></PrivateRoute>}></Route>
              <Route path="customer" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><Customers /></PrivateRoute>}></Route>
              <Route path="customer/:id" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><CustomerDetail /></PrivateRoute>}></Route>
              <Route path="campaign" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><Campaign /></PrivateRoute>}></Route>

              <Route path="unauthorized" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><UnAuthorized /></PrivateRoute>}></Route>
              <Route path="*" element={<PrivateRoute allowedRoles={['ADMIN', 'EDITOR', 'GUEST']}><NotFound /></PrivateRoute>}></Route>

            </Route>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
