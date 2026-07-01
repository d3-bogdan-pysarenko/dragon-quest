// Шукаємо кнопку
export const initScrollUp = () => {
  const scrollUpBtn = document.querySelector(
    '.scroll-up-btn'
  ) as HTMLButtonElement | null;

  if (scrollUpBtn) {
    // 1. Показуємо/ховаємо кнопку при скролі
    window.addEventListener('scroll', () => {
      // Якщо проскролили більше ніж на 300px, додаємо клас 'show', інакше прибираємо
      if (window.scrollY > 300) {
        scrollUpBtn.classList.add('show');
      } else {
        scrollUpBtn.classList.remove('show');
      }
    });

    // 2. Робимо клік для повернення на початок
    scrollUpBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth', // Плавно піднімаємося догори
      });
    });
  }
};
