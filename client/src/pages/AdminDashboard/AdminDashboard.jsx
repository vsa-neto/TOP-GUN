
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../api/axios';
// import ItemsList from './ItemsList';
// import ItemForm from './ItemForm';
// import './Dashboard.css';
// import './ItemForm.css';
// import './ItemsList.css';

// export default function AdminDashboard() {
//     const navigate = useNavigate();
//     const [currentTab, setCurrentTab] = useState('foam'); // вкладки: 'foam' или 'sealant'
//     const [items, setItems] = useState([]);  // список элементов (товаров)
//     const [loading, setLoading] = useState(false); // индикатор загрузки / true пока данные идут с сервера
//     const [error, setError] = useState(null); // хранит текст ошибки, если запрос к серверу завершился неудачно
//     const [isCreateOpen, setIsCreateOpen] = useState(false);
//     const [editingItemId, setEditingItemId] = useState(null); // хранит ID товара, который админ редактирует
    
//     // Динамический URL (endpoint)
//     const endpoint = currentTab === 'foam' ? '/foams' : '/sealants';

//     // Загрузка списка данных
//     const fetchItems = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await api.get(endpoint);
//             setItems(response.data);
//             // console.log("-----------");
//             // console.log(response.data);
//             // console.log(response.data[0].name);
//         } catch (err) {
//             console.error('Ошибка загрузки данных:', err);
//             setError('Не удалось загрузить данные из БД');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchItems();
//         setIsCreateOpen(false);
//         setEditingItemId(null);
//     }, [currentTab]);

//     // Выход из системы = handleLogout()
//     const handleLogout = async () => {
//         try {
//             await api.post('/logout');
//         } catch (err) {
//             console.error('Ошибка при выходе из API', err);
//         } finally {
//             localStorage.removeItem('admin_token_topgun'); // Используем ваш ключ токена
//             navigate('/admin/login');
//         }
//     };
    
//     // Удаление записи = handleDelete
//     const handleDelete = async (id) => {
//         if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
//         try {
//             await api.delete(`${endpoint}/${id}`);
//             setItems(items.filter(item => item.id !== id));
//         } catch (err) {
//             alert('Ошибка при удалении записи');
//         }
//     };

//     return (
//         <div className="dashboard-container">
//             <header className="dashboard-header">
//                 <h1>Панель администратора</h1>
//                 <button className="btn-logout" onClick={handleLogout}>Выйти</button>
//             </header>

//             <div className="tabs-container">
//                 <button 
//                     className={`tab-btn ${currentTab === 'foam' ? 'active' : ''}`} 
//                     onClick={() => setCurrentTab('foam')}
//                 >
//                     Пистолеты для пены
//                 </button>
//                 <button 
//                     className={`tab-btn ${currentTab === 'sealant' ? 'active' : ''}`} 
//                     onClick={() => setCurrentTab('sealant')}
//                 >
//                     Пистолеты для герметика
//                 </button>
//             </div>

//             {error && <div className="error-message">{error}</div>}

//             {loading ? (
//                 <div className="loading">Загрузка данных...</div>
//             ) : (
//                 <ItemsList 
//                     items={items} 
//                     type={currentTab} 
//                     onDelete={handleDelete}
//                     editingItemId={editingItemId}
//                     setEditingItemId={setEditingItemId}
//                     onSuccess={fetchItems}
//                 />
//             )}

//             <div className="create-section">
//                 <button 
//                     className="btn-create-main" 
//                     onClick={() => setIsCreateOpen(!isCreateOpen)}
//                 >
//                     {isCreateOpen ? 'Закрыть форму создания' : 'create'}
//                 </button>
                
//                 {isCreateOpen && (
//                     <div className="create-form-wrapper">
//                         <h3>Создать новый элемент ({currentTab})</h3>
//                         <ItemForm 
//                             type={currentTab} 
//                             mode="create" 
//                             onSuccess={() => {
//                                 setIsCreateOpen(false);
//                                 fetchItems();
//                             }}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ItemsList from './ItemsList';
import ItemForm from './ItemForm';
import useFetchItems from '../../components/hooks/useFetchItems'; // Импорт хука

import './Dashboard.css';
import './ItemForm.css';
import './ItemsList.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('foam');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const endpoint = currentTab === 'foam' ? '/foams' : '/sealants';

  // Используем наш кастомный хук
  const { items, setItems, loading, error, refetch: fetchItems } = useFetchItems(endpoint);

  // Сбрасываем состояния формы при смене вкладки
  useEffect(() => {
    setIsCreateOpen(false);
    setEditingItemId(null);
  }, [currentTab]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Ошибка при выходе из API', err);
    } finally {
      localStorage.removeItem('admin_token_topgun');
      navigate('/admin/login');
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      setItems(items.filter(item => item.id !== id)); // Удаляем из локального стейта хука

    } catch (err) {
      alert('Ошибка при удалении записи');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Панель администратора</h1>
        <button className="btn-logout" onClick={handleLogout}>Выйти</button>
      </header>

      <div className="tabs-container">
        <button 
          className={`tab-btn ${currentTab === 'foam' ? 'active' : ''}`} 
          onClick={() => setCurrentTab('foam')}
        >
          Пистолеты для пены
        </button>
        <button 
          className={`tab-btn ${currentTab === 'sealant' ? 'active' : ''}`} 
          onClick={() => setCurrentTab('sealant')}
        >
          Пистолеты для герметика
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Загрузка данных...</div>
      ) : (
        <ItemsList 
          items={items} 
          type={currentTab} 
          onDelete={handleDelete} 
          editingItemId={editingItemId} 
          setEditingItemId={setEditingItemId} 
          onSuccess={fetchItems} 
        />
      )}

      <div className="create-section">
        <button className="btn-create-main" onClick={() => setIsCreateOpen(!isCreateOpen)}>
          {isCreateOpen ? 'Закрыть форму создания' : 'create'}
        </button>
        
        {isCreateOpen && (
          <div className="create-form-wrapper">
            <h3>Создать новый элемент ({currentTab})</h3>
            <ItemForm 
              type={currentTab} 
              mode="create" 
              onSuccess={() => {
                setIsCreateOpen(false);
                fetchItems();
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}