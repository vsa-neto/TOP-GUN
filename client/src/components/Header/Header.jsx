import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExampleResponse } from "../data/ExampleResponse";
import NavDropdown from '../NavDropdown/NavDropdown'; // Импортируем новый компонент
import './Header.css';

export default function Header({scrollToElement}) {

    const location = useLocation();
    const navigate = useNavigate();

  // Группировка данных остается здесь
  const groupedData = useMemo(() => {
    const groups = {};
    ExampleResponse.data.forEach(item => {
      if (!groups[item.type]) {
        groups[item.type] = {};
      }
      if (!groups[item.type][item.level]) {
        groups[item.type][item.level] = [];
      }
      groups[item.type][item.level].push(item);
    });
    return groups;
  }, []);
  console.log(groupedData);

  // 3. Проверяем, начинается ли текущий путь с '/admin'
  // Это автоматически скроет меню и на /admin/dashboard, и на /admin/login
  const isAdminPage = location.pathname.startsWith('/admin');


  return (
    <header className="header-container">
      <div className="logo-section">
        <div>
          <img
          onClick={() => {
            navigate('/');
            scrollToElement('main_container', 0)
          }}
          src="/assets/img/top-gun.svg" className="header-logo" alt="top-gun" />
        </div>
        <h2 className='header-descriptor'> 
          пистолеты для герметика <br />и монтажной пены 
        </h2>
      </div>
{!isAdminPage && (
      <nav className="nav-container">
        {/* ПЕРВАЯ ССЫЛКА С ВЫПАДАЮЩИМ МЕНЮ */}
        <NavDropdown 
          to="/"
          basePath="/blast"
          linkText={<>пистолеты <br /> для герметика</>}
          extraLinkClass="gun-germetic"
          menuData={groupedData.sealant}
        />

        {/* ВТОРАЯ ССЫЛКА С ВЫПАДАЮЩИМ МЕНЮ */}
        <NavDropdown 
          to="/fomeron"
          basePath="/fomeron"
          linkText={<>пистолеты для <br /> монтажной пены</>}
          extraLinkClass="gun-pena"
          extraMenuClass="groups-fomeron"
          menuData={groupedData.foam}
        />
      </nav>
      )}
    </header>
  );
}