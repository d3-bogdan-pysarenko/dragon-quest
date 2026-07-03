import { FAVORITES_CHANGED_EVENT } from '../../constants';
import {
  FAVORITES_PER_PAGE,
  FAVORITES_PER_PAGE_MOBILE,
  FavoritesModel,
} from './favorites.model';
import { FavoritesView } from './favorites.view';

const DESKTOP_QUERY = '(min-width: 768px)';

export class FavoritesController {
  private readonly desktopQuery = window.matchMedia(DESKTOP_QUERY);

  constructor(
    private model: FavoritesModel,
    private view: FavoritesView
  ) {}

  init(): void {
    this.applyPageSize();
    this.render();

    this.view.onDeleteClick(id => {
      this.model.removeFavorite(id);
      this.render();
    });

    this.view.onPageClick(page => {
      this.model.setPage(page);
      this.render();
      this.view.scrollToTop();
    });

    document.addEventListener(FAVORITES_CHANGED_EVENT, () => this.render());

    this.desktopQuery.addEventListener('change', () => {
      this.applyPageSize();
      this.render();
    });
  }

  private applyPageSize(): void {
    this.model.setPageSize(
      this.desktopQuery.matches ? FAVORITES_PER_PAGE : FAVORITES_PER_PAGE_MOBILE
    );
  }

  private render(): void {
    const state = this.model.getPageState();

    if (state.total === 0) {
      this.view.renderEmptyState();
    } else {
      this.view.renderFavorites(state.items);
    }

    this.view.renderPagination(state.page, state.totalPages);
  }
}
