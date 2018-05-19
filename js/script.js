
window.onload = async function(){

  let urlWithData = 'https://gist.githubusercontent.com/vergilius/6d869a7448e405cb52d782120b77b82c/raw/e75dc7c19b918a9f0f5684595899dba2e5ad4f43/history-flashcards.json';
  let wrongAnswer = document.querySelector(".footer__answer--error");
  let positiveAnswer = document.querySelector(".footer__answer--success");

  let data = await fetchData(urlWithData);
  let cardsArray = []; //array of dom element, containing tasks
  let deck = document.querySelector(".deck");
  data.forEach(task => {
    //card container
    let cardCointainer = document.createElement("div");
    cardCointainer.classList.add("deck__card");
    //question
    let question = document.createElement("h1");
    question.className = "sg-text-bit sg-text-bit--small sg-text-bit--not-responsive deck__card__question";
    question.innerText = task.question;
    cardCointainer.appendChild(question);
    //answers
    task.answers.forEach(answer => {
      let button = document.createElement("button");
      button.className = "sg-button-primary sg-button-primary--alt deck__card__answer";
      button.innerText = answer.answer;
      if (answer.correct){
        button.addEventListener("click", handleCorrectAnswer);
      } else {
        button.addEventListener("click", handleWrongAnswer);
      }
      cardCointainer.appendChild(button);
    });
    deck.appendChild(cardCointainer);
  });


  function handleWrongAnswer(event){
    let card = event.target.parentElement;
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

  function handleCorrectAnswer(event){
    let card = event.target.parentElement;
    card.classList.add('deck__card--positive');
    positiveAnswer.style.display = "block";
    setTimeout(() => {
      let parentElement = card.parentElement;
      parentElement.removeChild(card);
      delete card;
      positiveAnswer.style.display = "none";
    },1000)
  }

  function fetchData(url){
    return new Promise((resolve,reject) => {
      let http = new XMLHttpRequest();
      http.open('GET',url,true);
      http.send();
      http.onload = () => {
        if (http.status === 200){
          resolve(JSON.parse(http.response));
        } else {
          reject(http.statusText);
        }
      }
    });
  };
};
