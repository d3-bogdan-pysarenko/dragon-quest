import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
  duration: 3000,
  position: { x: 'right', y: 'top' },
  ripple: false,
  dismissible: true,
});

export const showToast = (message: string, type: 'success' | 'error'): void => {
  if (type === 'success') {
    notyf.success(message);
  } else {
    notyf.error(message);
  }
};
