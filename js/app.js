'use strict';

/**Globals */
let votingRounds = 25;
let prodArray = [];

// Prompt for the number of voting rounds
const userInput = prompt("Enter the number of voting rounds:", "25");
const userInputNumber = parseInt(userInput);

if (!isNaN(userInputNumber) && userInputNumber > 0) {
  votingRounds = userInputNumber;
}

/** DOM */
let imgContainer = document.getElementById('img-container');
let imgOne = document.getElementById('img-one');
let imgTwo = document.getElementById('img-two');
let imgThree = document.getElementById('img-three');
let resultBtn = document.getElementById('show-results-btn');
let resultsList = document.getElementById('results-container');

//canvas element
let ctx = document.getElementById('myChart')

function Product(name, imageExtension = 'jpg'){
  this.name = name;
  this.image = `img/${name}.${imageExtension}`;
  this.votes = 0;
  this.views = 0;
}

/** Helpers/Utils */
function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

// Keep track of previously displayed image indices
let previousIndices = [];

function renderImgs() {
  // Generate three unique indices
  let indices = [];
  while (indices.length < 3) {
    let newIndex = getRandomNumber(prodArray.length);
    if (!previousIndices.includes(newIndex) && !indices.includes(newIndex)) {
      indices.push(newIndex);
    }
  }

  previousIndices = indices;

  imgOne.src = prodArray[indices[0]].image;
  imgOne.title = prodArray[indices[0]].name;

  imgTwo.src = prodArray[indices[1]].image;
  imgTwo.title = prodArray[indices[1]].name;

  imgThree.src = prodArray[indices[2]].image;
  imgThree.title = prodArray[indices[2]].name;

  prodArray[indices[0]].views++;
  prodArray[indices[1]].views++;
  prodArray[indices[2]].views++;
}

function renderChart() {
  let productNames = [];
  let productViews = [];
  let productVotes = [];

  for(let i = 0; i < prodArray.length; i++){
    productNames.push(prodArray[i].name);
    productViews.push(prodArray[i].views);
    productVotes.push(prodArray[i].votes);
  }

  let chartObj = {
    type: 'bar',
    data: {
      labels: productNames,
      datasets: [{
        label: '# of Views',
        data: productViews, // array that will hold the views
        borderWidth: 5,
        backgroundColor: 'pink',
        borderColor: 'pink'
      },
      {
        label: '# of Votes',
        data: productVotes, // array that will hold the # of votes
        borderWidth: 5,
        backgroundColor: 'black',
        borderColor: 'black'
      }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
};
new Chart(ctx, chartObj);
}

/**Event handler */
function clickProduct(event){
  let imageClicked = event.target.title;

  for(let i = 0; i < prodArray.length; i++){
    if(imageClicked === prodArray[i].name){
      prodArray[i].votes++;
      votingRounds--;
      renderImgs();
    }
  }
  if(votingRounds === 0){
    imgContainer.removeEventListener('click', clickProduct);
  }
}

function handleRenderChart(){
  if (votingRounds === 0){
    renderChart;
  }
  resultBtn.removeEventListener('click', handleRenderChart);
}

//executable

let products = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'tauntaun', 'unicorn', 'water-can', 'wine-glass'];

let sweep = new Product('sweep', 'png');
prodArray.push(sweep);

for (let i = 0; i < products.length; i++) {
  let product = new Product(products[i]);
  prodArray.push(product);
}

renderImgs();

imgContainer.addEventListener('click', clickProduct);
resultBtn.addEventListener('click', renderChart);
