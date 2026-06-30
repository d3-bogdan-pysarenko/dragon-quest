import template from '../partials/components/exercises-categorie.html?raw';
import { ExerciseFilter, getFilters } from '../api';

const searchInput = document.querySelector('.search-input') as HTMLInputElement;
const exercisesTitleText = document.querySelector('.exercises__text-link') as HTMLElement;
const exercisesSlash = document.querySelector('.exercises__span-slash') as HTMLSpanElement;
const listItems = document.querySelector('.list-filters__container') as HTMLElement;

export function initExercisesPage() {
  const categoriesHTML = Object.values(ExerciseFilter)
    .map(category => {
      return template.replace(/{{\s*category\s*}}/g, category)
    })
    .join("")

  const container = document.getElementById('exerciseCategories');

  if (container) {
    container.innerHTML = categoriesHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btnFilters');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      searchInput.classList.add('hidden');
      exercisesTitleText.classList.add('hidden');
      exercisesSlash.classList.add('hidden');
    });
  });

  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const params = button.textContent?.trim();
      if (!params) return;
      console.log(params);
      const filterParam: ExerciseFilter = params as ExerciseFilter;
      const data = await getFilters({ filter: filterParam });
      console.log(data.results);
    })
  })
});

