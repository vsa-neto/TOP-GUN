import React, { useState } from 'react';
import api from '../../api/axios';
// import './styles/ItemForm.css';

export default function ItemForm({ type, mode, initialData = {}, onSuccess }) {
    const isUpdate = mode === 'update';
    const endpoint = type === 'foam' ? '/foams' : '/sealants';

    // Инициализация структуры attributes
    const defaultAttributes = type === 'foam'
        ? { body: '', barrel: '', adapter: '', hand: '', regulator: '', trigger: '', valve: '', confuzor: false }
        : { volume: '', ratio: '', force: '' };

    const [formData, setFormData] = useState({
        id: initialData.id || '',
        name: initialData.name || '',
        level: initialData.level || 'hobby',
        description: initialData.description || '',
        attributes: { ...defaultAttributes, ...initialData.attributes }
    });

    const [images, setImages] = useState(null);
    const [video, setVideo] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAttributeChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        const finalValue = inputType === 'checkbox' ? checked : value;
        setFormData(prev => ({
            ...prev,
            attributes: { ...prev.attributes, [name]: finalValue }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Передача файлов требует FormData
        const data = new FormData();

        data.append('id', formData.id);
        data.append('name', formData.name);
        data.append('level', formData.level);
        data.append('description', formData.description);

        // Разворачиваем вложенные атрибуты для Laravel Request
        Object.keys(formData.attributes).forEach(key => {
            const val = formData.attributes[key];
            // Конвертируем boolean в 1/0 для корректной передачи в multipart форме
            if (typeof val === 'boolean') {
                data.append(`attributes[${key}]`, val ? '1' : '0');
            } else if (val !== null && val !== undefined) {
                data.append(`attributes[${key}]`, val);
            }
        });

        // Добавляем новые изображения (массив от 3 до 9 штук)
        if (images) {
            for (let i = 0; i < images.length; i++) {
                data.append('images[]', images[i]);
            }
        }

        // Добавляем видео файл
        if (video) {
            data.append('video', video);
        }

        try {
            if (isUpdate) {
                // Laravel хак для парсинга multipart/form-data в PUT запросах
                data.append('_method', 'PUT');
                await api.post(`${endpoint}/${initialData.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(endpoint, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            alert('Данные успешно сохранены!');
            onSuccess();
        } catch (err) {
            console.error(err);
            const backendErrors = err.response?.data?.errors;
            if (backendErrors) {
                alert(`Ошибка валидации: ${Object.values(backendErrors).flat().join(', ')}`);
            } else {
                alert('Произошла ошибка при отправке данных на сервер.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="responsive-form">
            <div className="form-grid">
                <div className="form-group">
                    <label>ID (Артикул)</label>
                    <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        disabled={isUpdate}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Название</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Уровень (Level)</label>
                    <select name="level" value={formData.level} onChange={handleChange}>
                        <option value="hobby">Hobby</option>
                        <option value="profi">Profi</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>
            </div>

            <div className="form-group text-area-group">
                <label>Описание (Markdown)</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                />
            </div>

            <fieldset className="attributes-section">
                <legend>Характеристики (Attributes)</legend>
                <div className="form-grid">
                    {type === 'foam' ? (
                        <>
                            <div className="form-group"><label>Body</label>
                                <select name="body" value={formData.attributes.body || ''} onChange={handleAttributeChange}>
                                    <option value="">-- Не выбрано --</option>
                                    <option value="body_metal">Корпус металлический литой</option>
                                    <option value="body_with_adapter_metal">Корпус с адаптером цельнометаллический</option>
                                    <option value="body_metal_teflon">Корпус металлический литой, покрыт тефлоном</option>
                                     <option value="body_with_adapter_metal_teflon">Корпус с адаптером цельнометаллический, покрыт тефлоном</option>
                                     
                                  

                                    <option value="body_plastic">Корпус пластиковый литой</option>
                                    <option value="body_polypropylene">Корпус полипропиленовый литой</option>
                                    <option value="body_with_adapter_plastic">Корпус с адаптером литой цельнопластиковый</option>
                                    <option value="body_with_adapter_ABS">Корпус с адаптером литой из ударопрочного ABS полимера</option>
                                    
                                </select>
                                {/* <input type="text" name="body" value={formData.attributes.body || ''} onChange={handleAttributeChange} /> */}
                            </div>
                            <div className="form-group"><label>Barrel</label>
                                 <select name="barrel" value={formData.attributes.barrel || ''} onChange={handleAttributeChange}>
                                    <option value="">-- Не выбрано --</option>
                                    <option value="barrel_single-chamber_short">Дуло металлическое однокамерное короткое</option>
                                    <option value="barrel_single-chamber_inox">Дуло из нержавеющей стали однокамерное короткое</option>
                                    <option value="barrel_dual-chamber_inox_long">Дуло из нержавеющей стали двухкамерное удлиненное</option>
                                    
                                </select>
                                {/* <input type="text" name="barrel" value={formData.attributes.barrel || ''} onChange={handleAttributeChange} /> */}
                            </div>
                            <div className="form-group"><label>Adapter</label>
                                <select name="adapter" value={formData.attributes.adapter || ''} onChange={handleAttributeChange}>
                                    <option value="">-- Не выбрано --</option>
                                    <option value="adapter_with_valve_metal">Адаптер с клапаном подачи пены цельнометаллический, съемный</option>
                                    <option value="adapter_with_valve_metal_teflon">Адаптер цельнометаллический, съемный. Покрыт тефлоном</option>
                                    
                                </select>
                                {/* <input type="text" name="adapter" value={formData.attributes.adapter || ''} onChange={handleAttributeChange} /> */}
                            </div>
                            <div className="form-group"><label>Hand</label>
                                <select name="hand" value={formData.attributes.hand || ''} onChange={handleAttributeChange}>
                                    <option value="hand_plasic">Рукоятка пластиковая. Легкая и прочная</option>
                                    <option value="hand_two-component">Рукоятка из двухкомпонентного пластика. Легкая и прочная</option>
                                    <option value="">-- Не выбрано --</option>
                                </select>
                                {/* <input type="text" name="hand" value={formData.attributes.hand || ''} onChange={handleAttributeChange} /> */}
                                </div>
                            <div className="form-group"><label>Regulator</label>
                                <select name="regulator" value={formData.attributes.regulator || ''} onChange={handleAttributeChange}>
                                    <option value="regulator_screw_plastic">Регулятор подачи пены винтовой, пластиковый</option>
                                    <option value="regulator_reductor_plastic">Регулятор подачи пены редукторного типа, пластиковый</option>
                                    <option value="regulator_reductor_metal">Регулятор подачи пены редукторного типа, металлический</option>
                                    <option value="">-- Не выбрано --</option>
                                </select>
                                {/* <input type="text" name="regulator" value={formData.attributes.regulator || ''} onChange={handleAttributeChange} /> */}
                            </div>
                            <div className="form-group"><label>Trigger</label>
                                <select name="trigger" value={formData.attributes.trigger || ''} onChange={handleAttributeChange}>
                                    <option value="">-- Не выбрано --</option>
                                    <option value="trigger_plastic">Курок пластиковый</option>
                                    <option value="trigger_metal">Курок металлический</option>
                                    
                                </select>
                                {/* <input type="text" name="trigger" value={formData.attributes.trigger || ''} onChange={handleAttributeChange} /> */}
                            </div>
                            <div className="form-group"><label>Valve</label>
                            <select name="valve" value={formData.attributes.valve || ''} onChange={handleAttributeChange}>
                                    <option value="">-- Не выбрано --</option>
                                    <option value="valve_removable">Клапан подачи пены съемный</option>
                                </select>
                                {/* <input type="text" name="valve" value={formData.attributes.valve || ''} onChange={handleAttributeChange} /> */}
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" name="confuzor" checked={!!formData.attributes.confuzor} onChange={handleAttributeChange} />
                                    Confuzor
                                </label>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-group"><label>Volume</label><input type="text" name="volume" value={formData.attributes.volume || ''} onChange={handleAttributeChange} /></div>
                            <div className="form-group"><label>Ratio</label><input type="text" name="ratio" value={formData.attributes.ratio || ''} onChange={handleAttributeChange} /></div>
                            <div className="form-group"><label>Force</label><input type="text" name="force" value={formData.attributes.force || ''} onChange={handleAttributeChange} /></div>
                        </>
                    )}
                </div>
            </fieldset>

            <fieldset className="media-section">
                <legend>Медиа файлы</legend>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Изображения {mode === 'create' && <span className="req">* (от 3 до 9 штук)</span>}</label>
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={(e) => setImages(e.target.files)}
                            required={mode === 'create'}
                        />
                    </div>
                    <div className="form-group">
                        <label>Видео (.mp4)</label>
                        <input
                            type="file"
                            accept="video/mp4"
                            onChange={(e) => setVideo(e.target.files[0])}
                        />
                    </div>
                </div>
            </fieldset>

            <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Отправка...' : isUpdate ? 'Сохранить изменения' : 'Подтвердить и создать'}
            </button>
        </form>
    );
}