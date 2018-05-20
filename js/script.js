
window.onload = async function(){

  let urlWithData = 'https://gist.githubusercontent.com/vergilius/6d869a7448e405cb52d782120b77b82c/raw/e75dc7c19b918a9f0f5684595899dba2e5ad4f43/history-flashcards.json';
  let wrongAnswer = document.querySelector("#footer__answer--error");
  let positiveAnswer = document.querySelector("#footer__answer--success");
  let numOfRemainingQuestions = 0;
  let remainingQuestionsElement = document.getElementById("remainingQuestions");
  let welcomeWindow = document.getElementById("welcomeWindow");
  let buttonStart = document.getElementById("buttonStart");
  let userAnswers = {
    positive : 0,
    negative : 0
  };
  buttonStart.addEventListener("click", (event) => {
    // welcomeWindow.style.display = "none";
    welcomeWindow.classList.add("welcomeWindow--slide");
    setTimeout(() => {
      welcomeWindow.parentElement.removeChild(welcomeWindow);
    },1300);
  });
  let data = await fetchData(urlWithData);
  let cardsArray = []; //array of dom element, containing tasks
  let deck = document.querySelector(".deck");



  data.forEach(task => {
    updateRemaininQuestionsElement(1);
    //card container
    let cardCointainer = document.createElement("div");
    cardCointainer.classList.add("flexContainer");
    cardCointainer.classList.add("flexContainer--nowrap");
    cardCointainer.classList.add("deck__card");
    //question
    let question = document.createElement("h1");
    question.className = "sg-text-bit sg-text-bit--small sg-text-bit--not-responsive flexItem flexItem__header flexItem__header--blue flexItem--halfHeight ";
    question.innerText = task.question;
    cardCointainer.appendChild(question);
    //answers
    let answersContainer = document.createElement("div");
    answersContainer.className ="flexItem flexItem--halfHeight flexContainer flexContainer--row";
    task.answers.forEach(answer => {
      let button = document.createElement("button");
      button.className = "sg-button-primary sg-button-primary--alt flexItem button";
      button.innerText = answer.answer;
      if (answer.correct){
        button.addEventListener("click", handleCorrectAnswer);
      } else {
        button.addEventListener("click", handleWrongAnswer);
      }
      answersContainer.appendChild(button);
    });
    cardCointainer.appendChild(answersContainer);
    deck.appendChild(cardCointainer);
  });


  function createFinishCard(){

  }

  function updateRemaininQuestionsElement(val){
    let curr = Number.parseInt(remainingQuestionsElement.textContent);
    curr += val;
    numOfRemainingQuestions = curr;
    remainingQuestionsElement.textContent = curr;
  }


  function handleWrongAnswer(event){
    userAnswers.negative += 1;
    let card = event.target.parentElement.parentElement;
    if(numOfRemainingQuestions > 1){
      card.classList.add('deck__card--wrongAnswer');
    }
    wrongAnswer.style.display = "block";
    setTimeout(() => {
      let parentElement = card.parentElement;
      parentElement.removeChild(card);
      parentElement.insertBefore(card, parentElement.children[0]);
      card.classList.remove('deck__card--wrongAnswer');
      wrongAnswer.style.display = "none";
    },2100)
  }

  function updateFinishCard(){
    let positiveAnswers = document.getElementById("positiveAnswers");
    let negativeAnswers = document.getElementById("negativeAnswers");
    positiveAnswers.innerText = userAnswers.positive;
    negativeAnswers.innerText = userAnswers.negative;
  }
  function handleCorrectAnswer(event){
    userAnswers.positive += 1;
    let card = event.target.parentElement.parentElement;
    card.classList.add('deck__card--positiveAnswer');
    positiveAnswer.style.display = "block";
    if(numOfRemainingQuestions === 1) {
      updateFinishCard()
    }
    setTimeout(() => {
      let parentElement = card.parentElement;
      if(parentElement){
        updateRemaininQuestionsElement(-1);
        parentElement.removeChild(card);
        delete card;
        positiveAnswer.style.display = "none";
      }

    },2100)
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
