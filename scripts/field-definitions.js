module.exports = {
  countryName: {
    sourceIndex: 0,
    label: 'Country',
  },
  areaLoss: {
    sourceIndex: 2,
    label: 'Tree Cover Loss',
    units: 'M ha',
    isNumber: true,
    format: '.1f',
    display: 'choropleth',
    binPartitions: [
      { value: 0.005, label: '< 5,000 ha' },
      { value: 0.1, label: '5,000 - 100,00 ha' },
      { value: 1, label: '100,000 - 1 M ha' },
      { value: Number.POSITIVE_INFINITY, label: '> 1 M ha' },
    ],
  },
  percentLoss: {
    sourceIndex: 3,
    multiplier: 100,
    label: 'Tree Cover Loss',
    units: 'percent/year',
    isNumber: true,
    format: '.3f',
    display: 'choropleth',
    binPartitions: [
      { value: 0.005, label: '< 0.005 %' },
      { value: 0.1, label: '0.005 - 0.1 %' },
      { value: 1, label: '0.1 - 1 %' },
      { value: Number.POSITIVE_INFINITY, label: '> 1 %' },
    ],
  },
  financeResultsBased: {
    sourceIndex: 6,
    label: 'Results-Based REDD+ Commitments',
    units: 'M USD',
    isNumber: true,
    format: ',.0f',
    display: 'icon:dollar',
    binPartitions: [
      { value: 10, label: '< 10 M USD' },
      { value: 50, label: '10 M - 50 M USD' },
      { value: 200, label: '50 M - 200 M USD' },
      { value: Number.POSITIVE_INFINITY, label: '> 200 M USD' },
    ],
  },
  financePhase: {
    sourceIndex: 4,
    label: 'REDD+ Phase 1 and 2 Finance',
    units: 'M USD',
    isNumber: true,
    format: ',.0f',
    display: 'icon:dollar',
    binPartitions: [
      { value: 10, label: '< 10 M USD' },
      { value: 50, label: '10 M - 50 M USD' },
      { value: 200, label: '50 M - 200 M USD' },
      { value: Number.POSITIVE_INFINITY, label: '> 200 M USD' },
    ],
  },
  financeDevelopment: {
    sourceIndex: 5,
    label: 'Development Finance',
    units: 'M USD',
    isNumber: true,
    format: ',.0f',
    display: 'icon:dollar',
    binPartitions: [
      { value: 10, label: '< 10 M USD' },
      { value: 50, label: '10 M - 50 M USD' },
      { value: 200, label: '50 M - 200 M USD' },
      { value: Number.POSITIVE_INFINITY, label: '> 200 M USD' },
    ],
  },
};