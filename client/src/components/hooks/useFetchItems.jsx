import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios'; // Скорректируйте путь к вашему axios

export default function useFetchItems(endpoint) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useCallback предотвратит бесконечные рендеры при передаче функции в useEffect
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoint);
      setItems(response.data);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Не удалось загрузить данные из БД');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Автоматически перезапускаем загрузку при изменении endpoint
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, setItems, loading, error, refetch: fetchItems };
}