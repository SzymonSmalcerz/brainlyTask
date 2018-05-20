window.onload = async function(){

      /* variables declaration starts here */
  // static variables
  const urlWithData = 'https://gist.githubusercontent.com/vergilius/6d869a7448e405cb52d782120b77b82c/raw/e75dc7c19b918a9f0f5684595899dba2e5ad4f43/history-flashcards.json';
  // local variables
  let userAnswers;
  let data;
  let cardsArray;
      /* variables declaration ends here */

      /* actual code starts here */
  setWelcomeWindowAndListeners();
  reset();
      /*actual code ends here*/



      /* functions declarations starts here */

 /*
  *  this function starts whole flashcard game over again
  */
  async function reset(){
    // reset local variables
    userAnswers = {
      positive : 0,
      negative : 0
    };
    cardsArray = [];
    // fetch data from api and create DOM elements with this data
    data = await fetchData(urlWithData);
    addTasksToCards(data,cardsArray);
    updateRemaininQuestionsElement();
  }

  function setWelcomeWindowAndListeners(){
    let welcomeWindow = document.getElementById("welcomeWindow");
    let buttonStart = document.getElementById("buttonStart");
    let buttonStartAgain = document.getElementById("startAgainButton");
    buttonStart.addEventListener("click", (event) => {
      welcomeWindow.classList.add("welcomeWindow--slide");
      setTimeout(() => {
      welcomeWindow.parentElement.removeChild(welcomeWindow);
      },1300);
    });
    buttonStartAgain.addEventListener("click", reset);
  }

  function updateRemaininQuestionsElement(){
    let remainingQuestionsElement = document.getElementById("remainingQuestions");
    remainingQuestionsElement.textContent = cardsArray.length;
  }

 /*
  * this functions adds fetched tasks (questions + answers) to dom
  */
  function addTasksToCards(data,cardsArray) {
    let deck = document.querySelector(".deck");
    data.forEach(task => {
      //card container => one "card"
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
      cardsArray.push(cardCointainer);
    });
  };


  function handleWrongAnswer(event){
    userAnswers.negative += 1;
    let card = event.target.parentElement.parentElement;
    if(cardsArray.length > 1){
      card.classList.add('deck__card--wrongAnswer');
    }
    addFooterMessage("wrong");
    setTimeout(() => {
      let parentElement = card.parentElement;
      parentElement.removeChild(card);
      parentElement.insertBefore(card, parentElement.children[0]);
      card.classList.remove('deck__card--wrongAnswer');
    },2100)
  }


  function handleCorrectAnswer(event){
    let card = event.target.parentElement.parentElement;
    let indexOfCardInArray = cardsArray.indexOf(card);
    if(indexOfCardInArray === -1){
      return;
    }
    userAnswers.positive += 1;
    cardsArray = cardsArray.slice(0,indexOfCardInArray).concat(cardsArray.slice(indexOfCardInArray+1));
    if(cardsArray.length === 0) {
      updateFinishCard();
    }
    card.classList.add('deck__card--positiveAnswer');
    addFooterMessage("success");
    setTimeout(() => {
      let parentElement = card.parentElement;
      if(parentElement){
        updateRemaininQuestionsElement(-1);
        parentElement.removeChild(card);
        delete card;
      }

    },2100)
  }

 /*
  * this function updates last card with score of the client
  */
  function updateFinishCard(){
    let positiveAnswers = document.getElementById("positiveAnswers");
    let negativeAnswers = document.getElementById("negativeAnswers");
    positiveAnswers.innerText = userAnswers.positive;
    negativeAnswers.innerText = userAnswers.negative;
  }

  /* self explanatory :) */
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

 /*
  * this functions is reponsible for adding and deleting message in footer (banners "wrong answer" and "correct answer")
  */
  function addFooterMessage(message) {
    let messageContainer = document.getElementById("messageContainer");
    let answerContener = document.createElement("div");
    if(message == "wrong"){
      answerContener.className = "sg-flash__message sg-flash__message--error footer__answer";
    } else{ // correct answer
      answerContener.className = "sg-flash__message sg-flash__message--success footer__answer";
    };
    let headerContainer = document.createElement("div");
    headerContainer.className = "sg-text sg-text--small sg-text--light sg-text--emphasised";
    let header = document.createElement("h1");
    header.className = "sg-text-bit sg-text-bit--small sg-text-bit--dark sg-text-bit--not-responsive";
    header.innerText = message == "wrong" ? "wrong answer :(" : "correct answer :)";
    headerContainer.appendChild(header);
    answerContener.appendChild(headerContainer);
    messageContainer.appendChild(answerContener);
    setTimeout(() => {
      messageContainer.removeChild(answerContener);
    },2000);
  };
      /* function declarations ends here */
};
