export interface PaginationState {
  page: number;
  totalPages: number;
}

const WINDOW_SIZE = 3;

const arrow = (
  symbol: string,
  target: number,
  disabled: boolean,
  label: string
): string => `
  <button
    class="pagination-btn pagination-arrow"
    type="button"
    data-page="${target}"
    aria-label="${label}"
    ${disabled ? 'disabled data-static-disabled' : ''}
  >${symbol}</button>
`;

export function renderPagination(
  container: HTMLElement,
  { page, totalPages }: PaginationState
): void {
  if (totalPages <= 1) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');

  const start = Math.max(1, Math.min(page - 1, totalPages - WINDOW_SIZE + 1));
  const end = Math.min(totalPages, start + WINDOW_SIZE - 1);

  const numbers: string[] = [];
  for (let p = start; p <= end; p += 1) {
    const isActive = p === page;
    numbers.push(`
      <button
        class="pagination-btn${isActive ? ' active' : ''}"
        type="button"
        data-page="${p}"
        ${isActive ? 'aria-current="page"' : ''}
      >${p}</button>
    `);
  }

  container.innerHTML = `
    <div class="pagination-group">
      ${arrow('&laquo;', 1, page === 1, 'First page')}
      ${arrow('&lsaquo;', page - 1, page === 1, 'Previous page')}
    </div>
    <div class="pagination-group">${numbers.join('')}</div>
    <div class="pagination-group">
      ${arrow('&rsaquo;', page + 1, page === totalPages, 'Next page')}
      ${arrow('&raquo;', totalPages, page === totalPages, 'Last page')}
    </div>
  `;
}

export function getPageFromEvent(target: EventTarget | null): number | null {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const button = target.closest<HTMLButtonElement>('[data-page]');

  if (!button || button.disabled) {
    return null;
  }

  const page = Number(button.dataset.page);

  return Number.isFinite(page) ? page : null;
}
