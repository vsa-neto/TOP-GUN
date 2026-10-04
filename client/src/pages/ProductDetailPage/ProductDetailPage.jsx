import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GallerySlider from '../../components/sliders/GallerySlider';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  // Извлекаем параметры из URL
  const { level, productId } = useParams();

   const galleryItems = [
    {
      type: 'image',
      url: 'https://example.com',
      // thumbUrl: 'https://example.com' // необязательно, если есть url
    },
    {
      type: 'video',
      url: 'https://example.com',
      // thumbUrl: 'https://example.com'
    },
    {
      type: 'image',
      url: 'https://example.com'
    }
  ];


  useEffect(() => {
    // Каждый раз, когда меняется productId (вы выбрали другой товар),
    // код находит текущий блок в DOM и плавно к нему скроллит
    const element = document.getElementById(productId);
    console.log(productId);
    if (element) {
      // Таймаут в 100мс нужен, чтобы браузер успел обновить текст в DOM
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [productId]); // Следит за изменением ID товара




  return (
    <div 
    // id={productId}
     className="product-page">
      <GallerySlider items={galleryItems} />
      <div id={productId} className="scroll-anchor"></div>
      <h1>Страница товара</h1>
      <p>Категория: <strong>{level}</strong></p>
      <p>ID / Системное имя товара: <strong>{productId}</strong></p>

{/* <GallerySlider items={galleryItems} /> */}
    </div>
  );
}