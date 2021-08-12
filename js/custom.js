"use strict"

let secondsBlock = document.querySelector('.timer__seconds');
let minutesBlock = document.querySelector('.timer__minutes');
let gameField = document.querySelector(".game-field");
let popUpContainer = document.querySelector('.pop-up-container');
let letters = document.querySelector('.letters');

let items = ["🐶", "🐹", "🐱", "🐮", "🦀", "🐟", "🐶", "🐹", "🐱", "🐮", "🦀", "🐟"];
let max = 12;
let min = 0;

let openCardsCount = 0;
let prevContainer = null;
let lastContainer = null;
let status = false;
let isStart = false;
let couplesCount = 0;
let win = false;
let to = null;

let Timer = {
    minutes: 0,
    seconds: 60,
    int: null,

    start: function() {
        this.int = setInterval(() => {
            if (this.seconds === 0) {
                this.minutes--;
                this.seconds = 60;
            }

            this.seconds--;
            let stringSec = this.seconds < 10 ? '0' + this.seconds : this.seconds;
            let stringMin = this.minutes < 10 ? '0' + this.minutes : this.minutes;
            minutesBlock.innerHTML = stringMin;
            secondsBlock.innerHTML = stringSec;
        }, 1000);
    },

    stop: function() {
        clearInterval(this.int);
        let againBtn = document.querySelector('.play-btn');
        againBtn.addEventListener('click', () => {
            PlayAgain();
        });
    },
}

gameField.addEventListener("click", (elem) => {
    elem.preventDefault();

    if (elem.target.classList.contains('card') || elem.target.parentNode.classList.contains('card')) {
        if (!isStart)
            to = StartGame();

        let container = elem.target.classList.contains('card') ? elem.target.parentNode : elem.target.parentNode.parentNode;

        if (openCardsCount !== 2 && !container.classList.contains('animated')) {
            if (!status && prevContainer !== null && lastContainer !== null) {
                prevContainer.classList.add('animated-reverse');
                prevContainer.classList.remove('animated');

                lastContainer.classList.add('animated-reverse');
                lastContainer.classList.remove('animated');

                prevContainer.querySelector(".card.front").classList.remove('fail');
                lastContainer.querySelector(".card.front").classList.remove('fail');

                prevContainer = null;
                lastContainer = null;
            }

            openCardsCount++;
            if (openCardsCount === 1) prevContainer = container;
            else if (openCardsCount === 2) lastContainer = container;

            if (!container.classList.contains('animated')) {
                container.classList.add('animated');
                container.classList.remove('animated-reverse');
            }

            if (openCardsCount === 2) {
                if (prevContainer.querySelector(".emojy").textContent === container.querySelector(".emojy").textContent) {
                    prevContainer.querySelector(".card.front").classList.add('ok');
                    container.querySelector(".card.front").classList.add('ok');
                    status = true;
                    couplesCount++;

                    if (couplesCount === 6) {
                        Timer.stop();
                        win = true;
                        clearTimeout(to);
                        popUp('Win', 'Play again');
                    }
                } else {
                    prevContainer.querySelector(".card.front").classList.add('fail');
                    container.querySelector(".card.front").classList.add('fail');
                    status = false;
                }

                openCardsCount = 0;
            }
        }
    }
});

function CreateGameField(items, max, min) {
    let cards = document.querySelectorAll(".card.front");

    for (let i = 0; i < cards.length; i++) {
        let sign = cards[i].querySelector(".emojy");

        let n = Math.floor(Math.random() * (max - min) + min);

        sign.textContent = items[n];
        items.splice(n, 1);
        max--;
    }
}

function popUp(text, btnText) {
    popUpContainer.classList.remove('hidden');

    let tmp = text.split('');
    let i = 100;
    tmp.forEach((item) => {
        let p = document.createElement('p');
        p.classList.add('play-text');
        setTimeout(() => {
            p.classList.add('play-text-animated');
        }, i);
        i += 50;
        p.textContent = '' + item;
        letters.append(p);
    })

    popUpContainer.querySelector('.play-btn').textContent = btnText;
}

function PlayAgain() {
    if (!popUpContainer.classList.contains('hidden'))
        popUpContainer.classList.add('hidden');

    let popUpContainers = document.querySelectorAll('.container');
    popUpContainers.forEach((item) => {
        if (item.classList.contains('animated')) {
            item.classList.add('animated-reverse');
            item.classList.remove('animated');
        }

        let card = item.querySelector(".card.front");
        if (card.classList.contains('fail'))
            card.classList.remove('fail')
        else if (card.classList.contains('ok'))
            card.classList.remove('ok')
    });

    Reset();
    CreateGameField(items, max, min);
}

function Reset() {
    couplesCount = 0;
    openCardsCount = 0;
    prevContainer = null;
    lastContainer = null;
    isStart = false;
    items = ["🐶", "🐹", "🐱", "🐮", "🦀", "🐟", "🐶", "🐹", "🐱", "🐮", "🦀", "🐟"];
    min = 0;
    max = 12;
    Timer.seconds = 60;
    Timer.minutes = 0;
    win = false;

    minutesBlock.textContent = '01';
    secondsBlock.textContent = '00';

    while (letters.firstChild) {
        letters.removeChild(letters.firstChild);
    }
}

function StartGame() {
    PlayAgain();
    isStart = true;
    Timer.start();

    let to = setTimeout(() => {
        if (!win) {
            Timer.stop();
            popUp('Lose', 'Try again');
        }
    }, 60000);

    return to;
}