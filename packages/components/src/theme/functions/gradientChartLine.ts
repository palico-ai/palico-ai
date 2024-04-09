import rgba from './rgba';

export default function gradientChartLine (chart: any, color: string, opacity = 0.2): any {
  const gradientStroke = chart.createLinearGradient(0, 230, 0, 50);
  const primaryColor = rgba(color, opacity).toString();

  gradientStroke.addColorStop(1, primaryColor);
  gradientStroke.addColorStop(0.2, 'rgba(72, 72, 176, 0.0)');
  gradientStroke.addColorStop(0, 'rgba(203, 12, 159, 0)');

  return gradientStroke;
}
