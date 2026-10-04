import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

export default function CategoryPage() {
  // 1. Получаем категорию из URL (hobby, profi или premium)
  const { category } = useParams();
  
  // 2. Определяем, к какому разделу относится страница
  const location = useLocation();
  const isFoam = location.pathname.startsWith('/fomeron');
  
  const sectionTitle = isFoam ? 'Пистолеты для монтажной пены' : 'Пистолеты для герметика';

  // В реальном приложении здесь будет fetch-запрос к серверу на основе `category` и `isFoam`
  // Например: useEffect(() => { fetch(`/api/products?type=${isFoam ? 'foam' : 'sealant'}&cat=${category}`)... }, [category])

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '100px auto' }}>
      {/* Хлебные крошки */}
      <nav style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        <Link to="/">Главная</Link> 
        {isFoam && <> / <Link to="/fomeron">Пистолеты для пены</Link></>} 
        {` / Класс ${category}`}
      </nav>

      <h1>{sectionTitle} — линейка <span style={{ textTransform: 'uppercase', color: '#ff4500' }}>{category}</span></h1>
      
      <p style={{ color: '#555', marginBottom: '40px' }}>
        Здесь будет выводиться полноценный список (плитка) товаров, отфильтрованный по группе: <strong>{category}</strong>.
      </p>

      {/* Пример заглушки для товаров */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
          <div style={{ width: '100%', height: '150px', backgroundColor: '#eee', marginBottom: '10px' }}>[ Изображение ]</div>
          <h3>Модель из серии {category}</h3>
          <Link to={`${location.pathname}/gun-model-example`} style={{ color: '#007bff', textDecoration: 'none' }}>
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}