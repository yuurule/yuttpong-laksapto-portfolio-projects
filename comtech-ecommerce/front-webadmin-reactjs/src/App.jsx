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
        <Router>
          <Routes>

            <Route path="/login" element={<Login />}></Route>

            <Route path="/" element={<MainLayout />}>

              {/* <Route index element={<PrivateRoute><IndexPage /></PrivateRoute>}></Route>
              <Route path="dashboard" element={<PrivateRoute allowedRoles={[]}><Dashboard /></PrivateRoute>}></Route>
              <Route path="report" element={<PrivateRoute allowedRoles={[]}><Report /></PrivateRoute>}></Route>
              <Route path="category" element={<PrivateRoute allowedRoles={[]}><Category /></PrivateRoute>}></Route>
              <Route path="tag" element={<PrivateRoute allowedRoles={[]}><Tag /></PrivateRoute>}></Route>
              <Route path="products" element={<PrivateRoute allowedRoles={[]}><Products /></PrivateRoute>}></Route>
              <Route path="products/:id" element={<PrivateRoute allowedRoles={[]}><ProductDetail /></PrivateRoute>}></Route>
              <Route path="orders" element={<PrivateRoute allowedRoles={[]}><Orders /></PrivateRoute>}></Route>
              <Route path="cutomers" element={<PrivateRoute allowedRoles={[]}><Customers /></PrivateRoute>}></Route>
              <Route path="cutomers/:id" element={<PrivateRoute allowedRoles={[]}><CustomerDetail /></PrivateRoute>}></Route> */}

              {/* <Route index element={<PrivateRoute><IndexPage /></PrivateRoute>}></Route> */}
              <Route path="dashboard" element={<Dashboard />}></Route>
              {/* <Route path="report" element={<Report />}></Route> */}
              <Route path="category" element={<Category />}></Route>
              <Route path="tag" element={<Tag />}></Route>
              <Route path="product" element={<Products />}></Route>
              <Route path="product/:id" element={<ProductDetail />}></Route>
              <Route path="product/create" element={<UpsertProduct />}></Route>
              <Route path="stock" element={<Stock />}></Route>
              <Route path="order" element={<Orders />}></Route>
              <Route path="customer" element={<Customers />}></Route>
              <Route path="customer/:id" element={<CustomerDetail />}></Route>
              <Route path="campaign" element={<Campaign />}></Route>

              <Route path="unauthorized" element={<UnAuthorized />}></Route>
              <Route path="*" element={<NotFound />}></Route>
            </Route>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
