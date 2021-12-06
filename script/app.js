'use strict';

let graph, logo, page;
let stateLogo = 0; // Niet geklikt
let pointColorGraph = '#ECECEC'
let fontColorGraph = "#000";

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
      percentageSelector.classList.remove('c-procent__neg');
      percentageSelector.classList.remove('c-procent__even');
      percentageSelector.classList.add('c-procent__pos');
      }
    if (percentage < 0) {
      htmlPercent += `<h2>${percentage.toFixed(2)}%</h2>`;
      percentageSelector.classList.remove('c-procent__pos');
      percentageSelector.classList.remove('c-procent__even');
      percentageSelector.classList.add('c-procent__neg');
    }
    if (percentage == 0) {
      htmlPercent += `<h2>${percentage.toFixed(2)}%</h2>`;
      percentageSelector.classList.remove('c-procent__pos');
      percentageSelector.classList.remove('c-procent__neg');
      percentageSelector.classList.add('c-procent__even');
    }
    tekstSelector.innerHTML = htmlTekst, waardeSelector.innerHTML = htmlWaarde, percentageSelector.innerHTML = htmlPercent;
}

function drawChart(d1, d2, d3, d4, d5, d6, d7) {
  let ctx = graph.getContext('2d');

  // let chart = new Chart(ctx, {
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

function listenToClickButton() {
  let buttonSelector = document.querySelector('.js-button');
  let listCurrency1 = document.querySelector('.js-currency1');
  let listCurrency2 = document.querySelector('.js-currency2');
    
  buttonSelector.addEventListener('click', function () {
    TweenMax.fromTo('#Current',1.5,{scale: 0}, {scale: 1});
    // TweenMax.fromTo('#Procent',1,{scale: 0}, {scale: 1});
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

    // let tp = gsap.timeline({
    //   defaults: {
    //     duration: 0.25,
    //     ease: 'power1.inOut',
    //   },
    //   repeat: 2,
    //   yoyo: true,
    // });    
    // tp.fromTo('#Current',{
    //   y: 2.5,
    // },{
    //   y: 0,
    // });
    // tp.play()
    // console.log('cliked')
    currency1 = listCurrency1.value;
    currency2 = listCurrency2.value;
    console.log(currency1, currency2)
    getInfoWaarde(getDate(0), getDate(6), currency1, currency2)
    getInfoGrafiek(currency1, currency2)
  })
}

function listenToClickLogo() {
  logo.addEventListener('click', function () {
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
    if (stateLogo == 0) {
      page.classList.add("dark-mode");
      pointColorGraph = "#1F1F1F"
      fontColorGraph = "#FFF"
      stateLogo = 1
      getInfoGrafiek(currency1, currency2)
    }
    else {
      page.classList.remove("dark-mode");
      pointColorGraph = "#ECECEC"
      fontColorGraph = "#000"
      stateLogo = 0
      getInfoGrafiek(currency1, currency2)
    }
  })
}

const init = function () {
  graph = document.querySelector(".js-graph");
  page = document.querySelector(".js-html-page")
  logo = document.querySelector(".js-logo");

  getInfoWaarde(getDate(0), getDate(6), currency1, currency2);
  getInfoGrafiek(currency1, currency2)
  listenToClickButton();
  listenToClickLogo();
};

document.addEventListener('DOMContentLoaded', function () {
  console.info('DOM geladen');
  init();
});
  