// 1. Знаходимо наш лоадер у HTML за його id
const loader = document.getElementById('loader');

// 2. Створюємо функцію, яка ПОКАЗУЄ лоадер
export function showLoader() {
  if (loader) {
    loader.classList.add('is-active');
  }
}

// 3. Створюємо функцію, яка ХОВАЄ лоадер
export function hideLoader() {
  if (loader) {
    loader.classList.remove('is-active');
  }
}

// // --- БЛОК ДЛЯ ПЕРЕВІРКИ (потім ми його видалимо) ---
// // Вмикаємо лоадер одразу при завантаженні сторінки:
// showLoader();

// // Вимикаємо його автоматично через 3 секунди:
// setTimeout(() => {
//   hideLoader();
// }, 3000);

export {};
