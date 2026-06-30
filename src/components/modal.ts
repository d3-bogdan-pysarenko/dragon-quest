export interface ModalInstance {
  element: HTMLElement;
  open(): void;
  close(): void;
}

export interface CreateModalOptions {
  onClose?: () => void;
}

export const createModal = (root: HTMLElement, options: CreateModalOptions = {}): ModalInstance => {
  const closeButton = root.querySelector<HTMLElement>('[data-modal-close]');

  let isOpen = false;
  let lastFocused: HTMLElement | null = null;

  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      close();
    }
  };

  const handleOverlayClick = (event: MouseEvent): void => {
    if (event.target === root) {
      close();
    }
  };

  const open = (): void => {
    if (isOpen) {
      return;
    }

    isOpen = true;
    lastFocused = document.activeElement as HTMLElement | null;

    root.classList.add('is-open');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleKeydown);
    root.addEventListener('click', handleOverlayClick);

    closeButton?.focus();
  };

  const close = (): void => {
    if (!isOpen) {
      return;
    }

    isOpen = false;

    root.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleKeydown);
    root.removeEventListener('click', handleOverlayClick);

    lastFocused?.focus();
    options.onClose?.();
  };

  closeButton?.addEventListener('click', close);

  return { element: root, open, close };
};
