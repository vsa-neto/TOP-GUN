import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';

import {scrollToElement} from './components/scrollToElement/scrollToElement'; // Ваш новый компонент
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// import Blast from './components/TM/Blast';
// import Fomeron from './components/TM/Fomeron';
import StartBanner from './components/StartBanner/StartBanner';

import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

// Импортируйте ваши новые компоненты (создадим их ниже)
import CategoryPage from './pages/CategoryPage'; 
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';




import './assets/css/normalize.css';

// 1. Общий макет для всего приложения (включает шапку)
const RootLayout = () => {
    return (<>
      
        <div id="main_container" className="page-wrapper">
              <Header scrollToElement={scrollToElement}/>
            <Banner/>
            <main className="main-content"> 
                <Outlet /> {/* Здесь рендер.:  /, /fomeron, /admin/... */}
            </main>
            <Footer/>
        </div>
        </>
    );
};

// 1. Блок banner
function Banner() {
    const location = useLocation(); // Следит за текущим URL
    return (
        <> 
            {location.pathname === '/' && <StartBanner bannerType = "1" />}
            {location.pathname.startsWith('/blast') && <StartBanner bannerType="1" />}
            {location.pathname.startsWith('/fomeron') && <StartBanner bannerType="2" />}
        </>
    );
}

// 2. Защищенный макет для админки
const ProtectedAdminLayout = () => {
    const token = localStorage.getItem('admin_token');
    return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [

      { path: "", element: <CategoryPage />, },
      { path: "blast/", element: <CategoryPage />, },
      { path: "fomeron/", element: <CategoryPage />, },

      { path: "blast/:level", element: <CategoryPage />, },
      { path: "blast/:level/:productId", element: <ProductDetailPage />, },

      { path: "fomeron/:level", element: <CategoryPage />, },
      { path: "fomeron/:level/:productId", element: <ProductDetailPage />, },

      { path: "admin/login", element: <AdminLogin /> }, 

      { 
        element: <ProtectedAdminLayout />,
        children: [
          { path: "admin/dashboard", element: <AdminDashboard /> },
        ]
      }
    ]
  }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;