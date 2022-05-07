// Card API: https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1

// --------------------------------------------
// Card deck api fetch
// --------------------------------------------
const deckID = document.querySelector('#deckID span');
const cardCount = document.querySelector('#cardCount span');
const newCard = document.querySelector('#currentCard span');
const cardTemplate = document.querySelector('#template');

let id = '';

// Make new deck
const makeNewDeck = async () => {
    try {
        const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`;
        const res = await axios.get(url);
        id = res.data.deck_id;
        deckID.textContent = id;
        cardCount.textContent = res.data.remaining;
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

// Get new card from deck
const drawCard = async () => {
    try {
        const url = `https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`;
        const res = await axios.get(url);
        const currentCard = res.data.cards[0];
        const numberSuit = currentCard.value + ' Of ' + currentCard.suit;
        newCard.textContent = numberSuit;
        cardCount.textContent = res.data.remaining;
        return addCard(currentCard);
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

// create card based on info of the freshly drawn card and the card template
const addCard = (card) => {
    let clone = cardTemplate.cloneNode(true);
    clone.style.display = "inline-block";
    const numbers = clone.querySelectorAll('h4');
    Array.from(numbers).forEach(number => {
        if (card.value.length > 3) {
            number.innerText = card.value[0];
            return;
        } else if (card.value.length === 3) {
            number.innerText = 'A';
            return;
        } else if (card.value.length === 2) {
            number.style.right = '5px';
        }
        number.innerText = card.value;
    })

    const suits = clone.querySelectorAll('img');
    Array.from(suits).forEach(suit => {
        switch (card.suit) {
            case 'SPADES':
                suit.src = 'assets/suit-spade-fill.svg';
                break;
            case 'CLUBS':
                suit.src = 'assets/suit-club-fill.svg';
                break;
            case 'HEARTS':
                suit.src = 'assets/suit-heart-fill.svg';
                suit.classList.add('red');
                break;
            case 'DIAMONDS':
                suit.src = 'assets/suit-diamond-fill.svg';
                suit.classList.add('red');
                break;
        }
    })

    return clone;
}



// --------------------------------------------
// Game Events and Logic
// --------------------------------------------
const dealer = document.querySelector('#dealer div');
const player = document.querySelector('#player div');
const hit = document.querySelector('#hit');
const stand = document.querySelector('#stand');
const newGame = document.querySelector('#newGame');
const playerScore = document.querySelector('#playerScore span');
const dealerScore = document.querySelector('#dealerScore span');
let playerCount = 0;
let dealerCount = 0;

// an object with numbers as keys and actual values as card counts
let numberValues = { 'A': 11, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10 }

const resetBoard = () => {
    dealer.innerHTML = '';
    player.innerHTML = '';
    playerCount = 0;
    dealerCount = 0;
}

const start = async () => {
    resetBoard();
    await makeNewDeck();
    await drawDealer();
    await drawDealer();
    await drawPlayer();
    await drawPlayer();
}

const newRound = () => {
    resetBoard();
}

const drawPlayer = async () => {
    let card = await drawCard();
    if (card == undefined) return;
    player.append(card);
    let value = card.querySelector('h4').innerText;
    playerCount += numberValues[value];
    playerScore.innerText = playerCount;
}

const drawDealer = async () => {
    let card = await drawCard();
    if (card == undefined) return;
    dealer.append(card);
    let value = card.querySelector('h4').innerText;
    dealerCount += numberValues[value];
    dealerScore.innerText = dealerCount;
}

newGame.addEventListener('click', start)
hit.addEventListener('click', drawPlayer);