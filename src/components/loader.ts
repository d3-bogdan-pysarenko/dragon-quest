const loader = document.getElementById('loader');

export function showLoader(): void {
  if (loader) {
    loader.classList.add('is-active');
  }
}

export function hideLoader(): void {
  if (loader) {
    loader.classList.remove('is-active');
  }
}
