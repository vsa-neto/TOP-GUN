import React from 'react';
import ItemForm from './ItemForm';
// import './styles/ItemsList.css';

export default function ItemsList({ items, type, onDelete, editingItemId, setEditingItemId, onSuccess }) {

    return (
        <div className="table-responsive">
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Превью</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Level</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => {
                        // console.log(item.media_files);
                        // console.log(item);
                        
// 1. Укажите точный адрес вашего Laravel (без слэша на конце)
    const BACKEND_URL = 'http://localhost:8000'; 

    // 2. Ищем первый элемент, у которого вообще заполнен file_path
    const imageObj = item.media_files?.find(mf => mf.thumbnail_path);

    // 3. Берем относительный путь
    const relativePath = imageObj?.thumbnail_path;

    // 4. Собираем полный URL. Если относительного пути нет, подставляем рабочую заглушку-картинку
    const previewImage = relativePath ? 
    `${BACKEND_URL}/storage/${relativePath}` : 'https://picsum.photos'; // Надежная заглушка-картинка для проверки


                        // Поиск первого изображения из media_files
                        // const previewImage = item.media_files?.find(f => f.type === 'image')?.file_path;
                            // || 'https://placeholder.com';

                        return (
                            <React.Fragment key={item.id}>
                                <tr>
                                    <td>
                                        <img src={previewImage} alt={item.name} className="table-preview-img" />
                                    </td>
                                    <td><strong>{item.id}</strong></td>
                                    <td>{item.name}</td>
                                    <td>
                                        <span className={`badge badge-${item.level}`}>
                                            {item.level}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn-action btn-update"
                                            onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                                        >
                                            {editingItemId === item.id ? 'Cancel' : 'update'}
                                        </button>
                                        <button 
                                            className="btn-action btn-delete"
                                            onClick={() => onDelete(item.id)}
                                        >
                                            delete
                                        </button>
                                    </td>
                                </tr>
                                
                                {editingItemId === item.id && (
                                    <tr>
                                        <td colSpan="5" className="nested-form-td">
                                            <div className="update-form-wrapper">
                                                <h4>Редактирование элемента: {item.id}</h4>
                                                <ItemForm 
                                                    type={type} 
                                                    mode="update" 
                                                    initialData={item} 
                                                    onSuccess={() => {
                                                        setEditingItemId(null);
                                                        onSuccess();
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center">Нет доступных записей</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}