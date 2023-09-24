import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import DefaultLayout from "./layouts/DefaultLayout";
import GuestLayout from "./layouts/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Users from "./pages/Admin/Users.jsx";
import UserForm from "./views/UserForm";
import Products from "./pages/Admin/Products.jsx";
import NewProduct from "./pages/Admin/NewProduct.jsx";
import ShopPage from "./pages/General/ShopPage.jsx";
import SingleProductPage from "./pages/General/SingleProductPage.jsx";
import Category from "./pages/Admin/Category.jsx";
import Checkout from "./pages/General/Checkout.jsx";
import OrderThankYou from "./pages/General/OrderThankYou.jsx";
import CategoryForm from "./pages/Admin/CategoryForm.jsx";
import Type from "./pages/Admin/Type.jsx";
import TypeForm from "./pages/Admin/TypeForm.jsx";
import Banks from "./pages/Admin/Banks.jsx";
import BanksForm from "./pages/Admin/BanksForm.jsx";
import Stores from "./pages/Admin/Stores.jsx";
import StoresForm from "./pages/Admin/StoreForm.jsx";
import Shipping from "./pages/Admin/Shipping.jsx";
import ShippingForm from "./pages/Admin/ShippingForm.jsx";
import Payment from "./pages/Admin/Payments.jsx";
import PaymentForm from "./pages/Admin/PaymentsForm.jsx";
import Inventories from "./pages/Admin/Inventories.jsx";
import Attributes from "./pages/Admin/Attributes.jsx";
import AttributesForm from "./pages/Admin/AttributesForm.jsx";
import Orders from "./pages/Admin/Orders.jsx";
import OrderClient from "./pages/General/OrdersClient.jsx";
import Transaction from "./pages/Admin/Transaction.jsx";
import Coupons from "./pages/Admin/Coupons.jsx";
import CouponsForm from "./pages/Admin/CouponsForm.jsx";
import Contact from "./pages/General/Contact.jsx";
import Advert from "./pages/Admin/Advert.jsx";
import AdvertForm from "./pages/Admin/AdvertForm.jsx";
import Contacts from "./pages/Admin/Contacts.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/shop" />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/users',
        element: <Users />
      },
      {
        path: '/users/new',
        element: <UserForm key="userCreate" />
      },
      {
        path: '/users/:id',
        element: <UserForm key="userUpdate" />
      },
      {
        path: '/products',
        element: <Products />
      },
      {
        path: '/products/new',
        element: <NewProduct key={'New'} />
      },
      {
        path: '/products/:id',
        element: <NewProduct key={'Update'} />
      },
      {
        path: '/product-category',
        element: <Category />
      },
      {
        path: '/product-category/new',
        element: <CategoryForm key={'New'} />
      },
      {
        path: '/product-category/:id',
        element: <CategoryForm key={'Update'} />
      },
      {
        path: '/product-type',
        element: <Type />
      },
      {
        path: '/product-type/new',
        element: <TypeForm key={'New'} />
      },
      {
        path: '/product-type/:id',
        element: <TypeForm key={'Update'} />
      },
      {
        path: '/banks',
        element: <Banks />
      },
      {
        path: '/banks/new',
        element: <BanksForm key={'New'} />
      },
      {
        path: '/banks/:id',
        element: <BanksForm key={'Update'} />
      },
      {
        path: '/stores',
        element: <Stores />
      },
      {
        path: '/stores/new',
        element: <StoresForm key={'New'} />
      },
      {
        path: '/stores/:id',
        element: <StoresForm key={'Update'} />
      },
      {
        path: '/shipping',
        element: <Shipping />
      },
      {
        path: '/shipping/new',
        element: <ShippingForm key={'New'} />
      },
      {
        path: '/shipping/:id',
        element: <ShippingForm key={'Update'} />
      },
      {
        path: '/payment',
        element: <Payment />
      },
      {
        path: '/payment/new',
        element: <PaymentForm key={'New'} />
      },
      {
        path: '/payment/:id',
        element: <PaymentForm key={'Update'} />
      },
      {
        path: '/inventory',
        element: <Inventories />,
      },
      {
        path: '/attributes',
        element: <Attributes />
      },
      {
        path: '/attributes/new',
        element: <AttributesForm key={'New'} />
      },
      {
        path: '/attributes/:id',
        element: <AttributesForm key={'Update'} />
      },
      {
        path: '/admin/orders',
        element: <Orders />
      },
      {
        path: '/transactions',
        element: <Transaction />
      },
      {
        path: '/coupons',
        element: <Coupons />
      },
      {
        path: '/coupons/new',
        element: <CouponsForm key={'New'} />
      },
      {
        path: '/coupons/:id',
        element: <CouponsForm key={'Update'} />
      },
      {
        path: '/advs',
        element: <Advert />
      },
      {
        path: '/advs/new',
        element: <AdvertForm key={'New'} />
      },
      {
        path: '/advs/:id',
        element: <AdvertForm key={'Update'} />
      },
      {
        path: '/contacts',
        element: <Contacts />
      }
    ]
  },
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      }
    ]
  },
  {
    path: '/shop',
    element: <ShopPage />,
  },
  {
    path: '/shop/:slug',
    element: <SingleProductPage />
  },
  {
    path: '/checkout/:device',
    element: <Checkout />
  },
  {
    path: '/checkout/:device/thank-you',
    element: <OrderThankYou />
  },
  {
    path: '/orders',
    element: <OrderClient />
  },
  {
    path: '/contact',
    element: <Contact/>
  },
  {
    path: "*",
    element: <NotFound />
  }
])

export default router;
