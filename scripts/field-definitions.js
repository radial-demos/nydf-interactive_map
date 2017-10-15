module.exports = {
  countryName: {
    sourceIndex: 0, label: 'Country',
  },
  areaLoss: {
    sourceIndex: 2, label: 'Tree Cover Loss', units: 'M ha', isNumber: true, format: '.1f', display: 'choropleth',
  },
  percentLoss: {
    sourceIndex: 3, label: 'Tree Cover Loss', units: 'percent/yr', isNumber: true, format: '.3f', display: 'choropleth',
  },
  financeResultsBased: {
    sourceIndex: 6, label: 'Results-Based REDD+ Commitments', units: 'M USD', isNumber: true, format: ',.0f', display: 'icon:dollar',
  },
  financePhase: {
    sourceIndex: 4, label: 'REDD+ Phase 1 and 2 Finance', units: 'M USD', isNumber: true, format: ',.0f', display: 'icon:dollar',
  },
  financeDevelopment: {
    sourceIndex: 5, label: 'Development Finance', units: 'M USD', isNumber: true, format: ',.0f', display: 'icon:dollar',
  },
};
