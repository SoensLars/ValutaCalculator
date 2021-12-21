'use strict';

let buttonSelector, listCurrency1, listCurrency2, graph, logo, page, mode, modeText, light, width;
let pointColorGraph = '#ECECEC'
let fontColorGraph = "#000";

let stateMode = 0; // Niet geklikt
let stateLogo = 0; // Niet geklikt
let stateArrow1 = 0; // Niet geklikt
let stateArrow2 = 0; // Niet geklikt

const getDate = function (getal) {
  if (getal == 0) {
    date = 'latest'
  }
  else {
    var d = new Date();
    d.setDate(d.getDate() - getal);
    var date = d.toLocaleDateString('en-CA');
  }
  return date
}

let tijdstip1 = 'latest';
let tijdstip2 = getDate(1);
let currency1 = 'btc';
let currency2 = 'eur';

//#region fetchFunctions
async function getCurrencies() {
  const response = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json');
  let json = await response.json()
  let html1 = `<option value="btc" selected="selected" hidden="hidden">Bitcoin (BTC)</option>`;
  let html2 = `<option value="eur" selected="selected" hidden="hidden">Euro (EUR)</option>`;
  for (let item in json) {
    html1 += `<option value="${item}">${json[item]} (${item.toUpperCase()})</option>`
    html2 += `<option value="${item}">${json[item]} (${item.toUpperCase()})</option>`
  }
  listCurrency1.innerHTML = html1
  listCurrency2.innerHTML = html2
}

async function getInfoWaarde(tijdstipLaatst, tijdstipOud, currency1, currency2) {
    const response1 = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${tijdstipLaatst}/currencies/${currency1}/${currency2}.json`);
    const response2 = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${tijdstipOud}/currencies/${currency1}/${currency2}.json`);
    let json1 = await response1.json()
    let json2 = await response2.json()
    let waardeNieuw = json1[currency2]
    let waardeOud = json2[currency2]
    // console.log(waardeNieuw, waardeOud)
    showCurrencies(waardeNieuw, waardeOud)
}

async function getInfoGrafiek(currency1, currency2) {
    const response1 = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${getDate(6)}/currencies/${currency1}/${currency2}.json`);
    const response2 = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${getDate(5)}/currencies/${currency1}/${currency2}.json`);
    const response3 = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${getDate(4)}/currencies/${currency1}/${currency2}.json`);
    const response4 = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${getDate(3)}/currencies/${currency1}/${currency2}.json`);
    const response5 = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${getDate(2)}/currencies/${currency1}/${currency2}.json`);
    const response6 = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${getDate(1)}/currencies/${currency1}/${currency2}.json`);
    const response7 = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${getDate(0)}/currencies/${currency1}/${currency2}.json`);
    let json1 = await response1.json()
    let json2 = await response2.json()
    let json3 = await response3.json()
    let json4 = await response4.json()
    let json5 = await response5.json()
    let json6 = await response6.json()
    let json7 = await response7.json()
    let waardeDag1 = json1[currency2]
    let waardeDag2 = json2[currency2]
    let waardeDag3 = json3[currency2]
    let waardeDag4 = json4[currency2]
    let waardeDag5 = json5[currency2]
    let waardeDag6 = json6[currency2]
    let waardeDag7 = json7[currency2]
    drawChart(waardeDag1, waardeDag2, waardeDag3, waardeDag4, waardeDag5, waardeDag6, waardeDag7)
}
//#endregion

//#region variousFunctions
function showCurrencies(waardeNieuw, waardeOud) {
  // console.log(waardeNieuw, waardeOud);
  let tekstSelector = document.querySelector('.js-equals-tekst');
  let waardeSelector = document.querySelector('.js-current-waarde');
  let percentageSelector = document.querySelector('.js-procent-waarde');

  let htmlTekst = '';
  let htmlWaarde = '';
  let htmlPercent = '';

  let percentage = (((waardeNieuw-waardeOud)/waardeOud)*100)
  // console.log(`percentage: ${waardePercentage}`)

  htmlTekst += `<h3>1 ${currency1.toUpperCase()} equals</h3>`
  htmlWaarde += `<h1>${waardeNieuw.toFixed(5)} ${currency2.toUpperCase()}</h1>`;
  if (percentage > 0) {
    htmlPercent += `<h2>+${percentage.toFixed(2)}%</h2>`;
    percentageSelector.classList.remove('u-procent__neg');
    percentageSelector.classList.remove('u-procent__even');
    percentageSelector.classList.add('u-procent__pos');
    }
  if (percentage < 0) {
    htmlPercent += `<h2>${percentage.toFixed(2)}%</h2>`;
    percentageSelector.classList.remove('u-procent__pos');
    percentageSelector.classList.remove('u-procent__even');
    percentageSelector.classList.add('u-procent__neg');
  }
  if (percentage == 0) {
    htmlPercent += `<h2>${percentage.toFixed(2)}%</h2>`;
    percentageSelector.classList.remove('u-procent__pos');
    percentageSelector.classList.remove('u-procent__neg');
    percentageSelector.classList.add('u-procent__even');
  }
  tekstSelector.innerHTML = htmlTekst, waardeSelector.innerHTML = htmlWaarde, percentageSelector.innerHTML = htmlPercent;
};

function drawChart(d1, d2, d3, d4, d5, d6, d7) {
  let ctx = graph.getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: [getDate(6), getDate(5), getDate(4), getDate(3), getDate(2), getDate(1), getDate(0)],
      datasets: [
        {
          label: `${currency1.toUpperCase()}`,
          data: [d1, d2, d3, d4, d5, d6, d7],
          borderColor: '#6F00FF',
          backgroundColor: '#6F00FF10',
          pointBackgroundColor: pointColorGraph,
          lineTension: 0.3,
          borderWidth: 2,
          pointRadius: 4,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: `${currency1.toUpperCase()} values of the last 7 days in ${currency2.toUpperCase()}`
      },
      defaultFontColor: (Chart.defaults.global.defaultFontColor = fontColorGraph),
      tooltips: {
        xPadding: 10,
        yPadding: 10,
        cornerRadius: 0,
      },
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          defaultFontFamily: (Chart.defaults.global.defaultFontFamily = "'Source Sans Pro', 'Helvetica', 'arial', 'sans-serif'"),
          boxWidth: 2,
        },
      },
      responsive: true,
    },
  });
};

function chartProp(width) {  
  var canvas = document.getElementById("myCanvas");
  if (width < 700) {
    canvas.width = 1;
  }
  else {
    canvas.width = 3;
  }
}
//#endregion

//#region listenTo-functions
function listenToClickButton() {    
  buttonSelector.addEventListener('click', function () {
    TweenMax.fromTo('#Current',1.5,{scale: 0}, {scale: 1});
    let tl = gsap.timeline({
      defaults: {
        duration: 0.25,
        ease: 'power1.inOut',
      },
      repeat: 2,
      yoyo: true,
    });    
    tl.fromTo('#Circle',{
      y: 2.5,
    },{
      y: 0,
    });
    tl.play()

    currency1 = listCurrency1.value;
    currency2 = listCurrency2.value;
    console.log(currency1, currency2)
    getInfoWaarde(getDate(0), getDate(6), currency1, currency2)
    getInfoGrafiek(currency1, currency2)
  })
}

function listenToClickLogo() {
  logo.addEventListener('click', function () {
    let old1 = currency1;
    let old2 = currency2;
    currency1 = old2;
    currency2 = old1;
    listCurrency1.value = currency1
    listCurrency2.value = currency2
    if (stateLogo == 0) {
      TweenLite.to("#Circle", 0.35, {rotation:180});
      stateLogo = 1;
    }
    else {
      TweenLite.to("#Circle", 0.35, {rotation:0});
      stateLogo = 0;
    }
  })
}

function listenToClickMode() {
  mode.addEventListener('click', function () {
    let tl = gsap.timeline({
      defaults: {
        duration: 0.25,
        ease: 'power1.inOut',
      },
      repeat: 0,
      yoyo: true,
    });    
    tl.fromTo('#Mode',{
      y: 2.5,
    },{
      y: 0,
    });
    tl.play()
    if (stateMode == 0) {
      modeText.innerHTML = "DARK";
      light.innerHTML = `<title>Click for light theme</title><path fill="currentColor" d="M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M11,18H13V15.87C14.73,15.43 16,13.86 16,12A4,4 0 0,0 12,8A4,4 0 0,0 8,12C8,13.86 9.27,15.43 11,15.87V18Z" />`
      page.classList.add("dark-mode");
      pointColorGraph = "#1F1F1F"
      fontColorGraph = "#FFF"
      stateMode = 1
      getInfoGrafiek(currency1, currency2)
    }
    else {
      modeText.innerHTML = "LIGHT";
      light.innerHTML = `<title>Click for dark theme</title><path fill="currentColor" d="M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63Z" />`
      page.classList.remove("dark-mode");
      pointColorGraph = "#ECECEC"
      fontColorGraph = "#000"
      stateMode = 0
      getInfoGrafiek(currency1, currency2)
    }
  });
}

function listenToClickInput() {
  listCurrency1.addEventListener('click', function () {
    if (stateArrow1 == 0) {
      TweenLite.to("#Arrow1", 0.35, {rotation:180});
      stateArrow1 = 1;
    }
    else {
      TweenLite.to("#Arrow1", 0.35, {rotation:0});
      stateArrow1 = 0;
    }
  })

  listCurrency2.addEventListener('click', function () {
    if (stateArrow2 == 0) {
      TweenLite.to("#Arrow2", 0.35, {rotation:180});
      stateArrow2 = 1;
    }
    else {
      TweenLite.to("#Arrow2", 0.35, {rotation:0});
      stateArrow2 = 0;
    }
  });

  // page.addEventListener('click', function () {
  //   if (stateArrow1 == 1) {
  //     TweenLite.to("#Arrow1", 0.35, {rotation:0});
  //     stateArrow1 = 0;
  //   }
  //   else {
  //     stateArrow1 = 0;
  //   }
  // })

  // page.addEventListener('click', function () {
  //   if (stateArrow2 == 0) {
  //     TweenLite.to("#Arrow2", 0.35, {rotation:0});
  //     stateArrow1 = 0;
  //   }
  //   else {
  //     stateArrow2 = 0;
  //   }
  // })
}
//#endregion

const init = function () {
  buttonSelector = document.querySelector('.js-button');
  listCurrency1 = document.querySelector('.js-currency1');
  listCurrency2 = document.querySelector('.js-currency2');
  graph = document.querySelector(".js-graph");
  page = document.querySelector(".js-html-page");
  logo = document.querySelector(".js-logo");
  mode = document.querySelector(".js-mode");
  modeText = document.querySelector(".js-mode-text");
  light = document.querySelector('.js-light');
  width = document.body.clientWidth;

  getCurrencies()
  getInfoWaarde(getDate(0), getDate(6), currency1, currency2);
  getInfoGrafiek(currency1, currency2)
  listenToClickButton();
  listenToClickMode();
  listenToClickLogo();
  listenToClickInput();
  chartProp(width)
};

document.addEventListener('DOMContentLoaded', function () {
  console.info('DOM geladen');
  init();
});
  