export const scrollToElement = (id, offset = 0) => {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Элемент с id="${id}" не найден.`);
    return;
  }

  // Вычисляем позицию элемента с учетом прокрутки страницы и отступа
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};