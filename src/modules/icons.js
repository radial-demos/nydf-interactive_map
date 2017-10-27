// <svg class="svg-icon" viewBox="0 0 20 20"><path fill="none" d="

const icons = {
  circle: {
    d: 'M17.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z',
  },
  circleStroked: {
    d: 'M12.5 6.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 1.222a4.278 4.278 0 1 0 0 8.556 4.278 4.278 0 0 0 0-8.556z',
  },
  money_1_1: {
    d: 'M435.2 102.4H25.6C11.46 102.4 0 113.86 0 128v179.2c0 14.14 11.46 25.6 25.6 25.6h409.6c14.14 0 25.6-11.46 25.6-25.6V128c0-14.14-11.46-25.6-25.6-25.6zm0 204.8H25.6V128h409.6v179.2zM486.4 179.2V384H76.8v-25.6H51.2V384c0 14.14 11.46 25.6 25.6 25.6h409.6c14.14 0 25.6-11.46 25.6-25.6V204.8c0-14.14-11.46-25.6-25.6-25.6zM230.4 153.6c-28.28 0-51.2 28.655-51.2 64s22.92 64 51.2 64 51.2-28.655 51.2-64-22.92-64-51.2-64zm0 102.4c-13.636 0-25.6-17.946-25.6-38.4 0-20.454 11.964-38.4 25.6-38.4 13.636 0 25.6 17.946 25.6 38.4 0 20.454-11.964 38.4-25.6 38.4z',
  },
  moneyBill: {
    d: 'M21.8 5.1h-20.5c-0.7 0-1.3 0.6-1.3 1.3v9c0 0.7 0.6 1.3 1.3 1.2h20.5c0.7 0 1.3-0.6 1.2-1.2v-9c0-0.7-0.6-1.3-1.2-1.3z m0 10.3h-20.5v-9h20.5v9z m2.5-6.4v10.2h-20.5v-1.3h-1.2v1.3c0 0.7 0.6 1.3 1.2 1.3h20.5c0.7 0 1.3-0.6 1.3-1.3v-9c0-0.7-0.6-1.3-1.3-1.2z m-12.8-1.3c-1.4 0-2.6 1.4-2.5 3.2s1.1 3.2 2.5 3.2 2.6-1.4 2.6-3.2-1.1-3.2-2.6-3.2z m0 5.1c-0.7 0-1.3-0.9-1.3-1.9 0-1 0.6-1.9 1.3-1.9 0.7 0 1.3 0.9 1.3 1.9 0 1-0.6 1.9-1.3 1.9z',
  },
  moneyBag: {
    d: 'M15.5 16.3c-0.4-0.4-1.1-0.7-2.1-1v-3.5c0.4 0 0.6 0.2 0.9 0.3 0.3 0.3 0.5 0.6 0.5 1.1 0 0.2 0.1 0.4 0.2 0.5 0.2 0.2 0.6 0.2 0.9 0 0.1-0.1 0.2-0.3 0.1-0.5 0-0.8-0.3-1.4-0.7-1.8-0.5-0.4-1.1-0.7-1.9-0.8v-0.5c0-0.3-0.2-0.5-0.6-0.6-0.3 0-0.5 0.2-0.5 0.6v0.5c-0.8 0.1-1.4 0.3-1.9 0.8-0.6 0.5-0.9 1.2-0.9 2 0 0.7 0.3 1.3 0.8 1.8 0.5 0.4 1.1 0.7 2 1v3.7c-0.5-0.1-0.9-0.2-1.2-0.4-0.4-0.4-0.6-0.9-0.7-1.7 0-0.2-0.1-0.4-0.1-0.5-0.2-0.2-0.6-0.2-0.9 0-0.1 0.1-0.2 0.3-0.1 0.5 0 1.2 0.4 2 1 2.6 0.5 0.4 1.1 0.6 2 0.7v0.8c0 0.3 0.2 0.5 0.5 0.6 0.3 0 0.5-0.2 0.6-0.6v-0.8c0.8-0.1 1.5-0.4 2-0.8 0.6-0.5 1-1.3 1-2.2 0-0.8-0.3-1.4-0.9-1.8z m-3.2-1.3c-0.5-0.2-0.9-0.4-1.2-0.6-0.3-0.3-0.4-0.6-0.4-1.1 0-0.5 0.2-0.9 0.6-1.1 0.3-0.2 0.6-0.3 1-0.4v3.2z m2.2 4.5c-0.3 0.2-0.7 0.4-1.1 0.4v-3.4c0.6 0.2 1.1 0.4 1.3 0.6 0.3 0.2 0.4 0.6 0.4 1.1 0 0.5-0.2 0.9-0.6 1.3z m6.2-8.3c-0.9-1.3-2.4-3.1-3.7-4.1l2.1-5.3c0.1-0.2 0.1-0.4 0.1-0.5 0-0.7-0.6-1.3-1.3-1.3h0c0 0-0.1 0-0.1 0-0.2 0-0.4 0.1-0.5 0.1-0.2 0.1-2.4 1.1-4.5 1.2-2.2 0-4.5-1.1-4.5-1.2-0.2-0.1-0.4-0.1-0.6-0.1-0.3 0-0.6 0.1-0.9 0.3-0.4 0.4-0.5 0.9-0.3 1.5l2.1 5.3c-1.3 1-2.8 2.9-3.7 4.1-1.3 1.8-3.6 5.3-3.6 8 0 3.5 2.9 6.4 6.4 6.4h10.2c3.5 0 6.4-2.9 6.4-6.4 0-2.6-2.3-6.1-3.6-8z m-13-9.9s2.6 1.3 5.1 1.3 5.1-1.3 5.1-1.3l-2 5.1h-6.2l-2-5.1z m10.2 23h-10.2c-2.8 0-5.1-2.3-5.1-5.1 0-3.8 6.4-11.5 7.6-11.5h5.2c1.3 0 7.7 7.7 7.6 11.5 0 2.8-2.3 5.1-5.1 5.1z',
  },
};

module.exports = icons;
