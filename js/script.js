let cards = document.getElementsByClassName("deck__card");
let cardsArray = Array.from(cards);
let wrongAnswer = document.getElementsByClassName("footer__answer--error")[0];
let positiveAnswer = document.getElementsByClassName("footer__answer--success")[0];

cardsArray.forEach(card => {
  card.addEventListener('click', function(event){
    //handleWrongAnswer(this);
    handleCorrectAnswer(this);
  })
});


let handleWrongAnswer = (card) => {
  card.classList.add('deck__card--wrong');
  wrongAnswer.style.display = "block";
  setTimeout(() => {
    let parentElement = card.parentElement;
    parentElement.removeChild(card);
    parentElement.insertBefore(card, parentElement.children[0]);
    card.classList.remove('deck__card--wrong');
    wrongAnswer.style.display = "none";
  },1000)
}

let handleCorrectAnswer = (card) => {
  card.classList.add('deck__card--positive');
  positiveAnswer.style.display = "block";
  setTimeout(() => {
    let parentElement = card.parentElement;
    parentElement.removeChild(card);
    delete card;
    positiveAnswer.style.display = "none";
  },1000)
}
