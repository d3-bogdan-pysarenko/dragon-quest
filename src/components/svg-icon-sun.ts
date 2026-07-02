export const initSunIcon = () => {
  const svgSun = document.querySelector<SVGSVGElement>('.hero-title-icon');
  if (!svgSun) return;

  svgSun.style.transform = 'scale(1)';
  svgSun.style.transition = 'color 0.3s ease, transform 0.3s ease';

  const colors = [
    '#FFD54A',
    '#FF9F1C',
    '#FF6B6B',
    '#A855F7',
    '#38BDF8',
    '#9BE15D',
    '#FFD54A',
  ];

  let currentColorIndex = 0;

  svgSun.addEventListener('mouseover', function () {
    svgSun.style.color = colors[currentColorIndex];
    svgSun.style.transform = 'scale(1.5) rotate(145deg)';
  });

  svgSun.addEventListener('mouseout', function () {
    svgSun.style.transform = 'scale(1) rotate(0deg)';
    svgSun.style.color = 'var(--color-ink)';
    currentColorIndex = (currentColorIndex + 1) % colors.length;
  });
};