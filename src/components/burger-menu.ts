import { createModal } from './modal';

export const initBurgerMenu = (): void => {
  const root = document.querySelector<HTMLElement>('[data-burger-modal]');
  const trigger = document.querySelector<HTMLElement>('.site-menu-button');

  if (!root || !trigger) {
    return;
  }

  const modal = createModal(root);

  trigger.addEventListener('click', () => {
    modal.open();
  });
};
