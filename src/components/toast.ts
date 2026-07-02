import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
  duration: 3000,
  position: { x: 'right', y: 'top' },
  ripple: false,
  dismissible: true,
});

export enum ToastType {
  Success = 'success',
  Error = 'error',
}

export const showToast = (message: string, type: ToastType): void => {
  if (type === ToastType.Success) {
    notyf.success(message);
  } else {
    notyf.error(message);
  }
};