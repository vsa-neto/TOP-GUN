import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './NavDropdown.css';

export default function NavDropdown({
  to,
  basePath,
  linkText,
  extraLinkClass,
  extraMenuClass,
  menuData
}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Нужен для корректной проверки location.pathname

  // Если данных для этого типа нет в groupedData, возвращаем null, чтобы избежать ошибок
  if (!menuData) return null;

  return (
    <div
      className="nav-item-dropdown"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Главная ссылка */}
      <NavLink
        to={to}
        end={to === '/'} // end нужен только для главной страницы
        className={({ isActive }) =>
          `nav-main-link ${extraLinkClass} ${isActive || location.pathname.startsWith(basePath) ? 'active' : ''}`
        }
      >
        {linkText}
      </NavLink>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className={`groups ${extraMenuClass || ''}`}>
          {Object.entries(menuData).map(([levelName, items]) => (
            <div className="group" key={levelName}>
              <h3>линейка {levelName}</h3>
              <ul className="dropdown-menu">

                {items.map((item) => {
                  // Убеждаемся, что путь ВСЕГДА начинается строго с одного абсолютного слэша
                  const cleanBase = basePath.startsWith('/') ? basePath : `/${basePath}`;
                  const targetUrl = `${cleanBase}/${item.level}/${item.name}`;

                  return (
                    <li key={item.id}>
                      <NavLink to={targetUrl}>
                        {/* Исправленный абсолютный путь к картинке из папки public */}
                        <img
                          alt={item.name}
                          className="menu-item-preview"
                          src={`/assets/img/min/${item.id}.png`}
                        />
                        <span>{item.name}</span>
                      </NavLink>
                    </li>
                  );
                })}

              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}