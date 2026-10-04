

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules'; // Убедитесь, что импорты на месте

// Импорты стилей Swiper (если еще не импортированы выше)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import './GallerySlider.css';

export default function GallerySlider({ items }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="gallery-container">
      {/* Главный слайдер */}
      <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        className="main-swiper"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className='slide'>
            {item.type === 'video' ? (
              <video src={item.url} controls width="100%" />
            ) : (
              <img src={item.url} alt="" />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Слайдер с миниатюрами (Исправленный) */}
      <Swiper
        modules={[Thumbs]} // Добавили модуль Thumbs сюда
        onSwiper={setThumbsSwiper}
        watchSlidesProgress={true}
        slidesPerView={4}
        className="thumbs-swiper"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <img src={item.thumbUrl || item.url} alt="preview" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}