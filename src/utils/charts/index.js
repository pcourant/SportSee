import { select } from 'd3';

export const RECT_DIMENSION_RATIO = 0.383;
export const SQUARE_DIMENSION_RATIO = 1.0194;
export const KEYINFO_DIMENSION_RATIO = 0.4806;
export const SIDEBAR_DIMENSION_RATIO = 0.4806;

// Constants from figma mockups
export function prorataScale(mockupValue, currentChartWidth, mockupChartWidth) {
  return (currentChartWidth * mockupValue) / mockupChartWidth;
}

const WINDOW_ORIGINAL_WIDTH = 1440;
export function prorataWindowScale(mockupValue, currentChartWidth) {
  return prorataScale(mockupValue, currentChartWidth, WINDOW_ORIGINAL_WIDTH);
}

const RECTCHART_ORIGINAL_WIDTH = 835;
export function scaleRectChart(mockupValue, currentChartWidth) {
  return prorataScale(mockupValue, currentChartWidth, RECTCHART_ORIGINAL_WIDTH);
}

const SPAN1_CHART_ORIGINAL_WIDTH = 258;
export function scale1spanChart(mockupValue, currentChartWidth) {
  return prorataScale(
    mockupValue,
    currentChartWidth,
    SPAN1_CHART_ORIGINAL_WIDTH
  );
}

export const wrap = function (text, lineHeight) {
  text.each(function () {
    const text = select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let lineNumber = 0;
    let line = [];
    const width = parseFloat(text.attr('width'));
    const y = parseFloat(text.attr('y'));
    const x = text.attr('x');
    const textAnchor = text.attr('text-anchor');
    let tspan = text
      .text(null)
      .append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', textAnchor);

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        lineNumber++;
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y + lineNumber * lineHeight)
          .attr('text-anchor', textAnchor)
          .text(word);
      }
    }
  });
};

export function getCoordinates(value, radius, index) {
  const angle = Math.PI / 2 + (2 * Math.PI * -index) / HEXAGONAL_POINTS;
  const x = Math.cos(angle) * value;
  const y = Math.sin(angle) * value;
  return { x: radius + x, y: radius - y };
}

const HEXAGONAL_POINTS = 6;

export function getHexagonPoints(hexagonRadius, containerRadius) {
  const hexagonPoints = [];
  for (let i = 0; i < HEXAGONAL_POINTS; i++) {
    const coordinates = getCoordinates(hexagonRadius, containerRadius, i);
    hexagonPoints.push([coordinates.x, coordinates.y]);
  }

  return hexagonPoints;
}

export function pointsToPath(points) {
  return points?.map((p) => p.join(',')).join(' ');
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(' ');

  return d;
}

export function formatPerformanceData(data, kind) {
  if (data && kind) {
    const dataSorted = [
      'intensity',
      'speed',
      'strength',
      'endurance',
      'energy',
      'cardio',
    ];
    for (const [key, k] of Object.entries(kind)) {
      const value = data.find((obj) => obj.kind === +key)?.value;

      if (value !== undefined) {
        const index = dataSorted.indexOf(k);
        if (index > -1) {
          dataSorted[index] = value;
        }
      }
    }
    return dataSorted;
  }
}

export function formatActivityData(data) {
  return data?.map((activity) => ({
    x: new Date(activity?.day).getDate(),
    y1: activity?.kilogram,
    y2: activity?.calories,
  }));
}

export function formatAverageSessionsData(sessions) {
  const dayOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const result = sessions?.map((session) => ({
    xTick: dayOfWeek[session?.day % 7],
    value: session?.sessionLength,
  }));

  if (result?.length < 9) {
    result.unshift(result[0]);
  }
  if (result?.length < 9) {
    result.push(result[result.length - 1]);
  }

  return result;
}
