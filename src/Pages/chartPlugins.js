import { Chart } from 'chart.js';

export const sectionTextPlugin = {
  id: 'sectionText',
  afterDraw(chart) {
    const { ctx, chartArea: { left, right, top, bottom }, data } = chart;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((arc, index) => {
        const { startAngle, endAngle, innerRadius, outerRadius } = arc;
        const midAngle = (startAngle + endAngle) / 2;
        const radius = (innerRadius + outerRadius) / 2;
        const x = centerX + radius * Math.cos(midAngle);
        const y = centerY + radius * Math.sin(midAngle);
        const label = data.labels[index];

        ctx.save();
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x, y);
        ctx.restore();
      });
    });
  }
};

export const backgroundColorPlugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw(chart, args, options) {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || 'lightGreen'; // Default color if not specified
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

// 플러그인을 Chart.js에 전역으로 등록하지 않음
