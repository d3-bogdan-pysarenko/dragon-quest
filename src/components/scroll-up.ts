export const initScrollUp = (): void => {
  const scrollUpBtn =
    document.querySelector<HTMLButtonElement>('.scroll-up-btn');

  if (!scrollUpBtn) {
    return;
  }

  window.addEventListener('scroll', () => {
    scrollUpBtn.classList.toggle('show', window.scrollY > 300);
  });

  scrollUpBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
};
