/*
    CHOPSTICKS GAME

    Rules:
    1. Each player starts with 1 finger on each hand.
    2. First click your own hand, then click an opponent's hand.
    3. Add the two finger values.
    4. If the total is 5, the hand becomes OUT (0).
    5. If the total is more than 5, keep the remainder:
       4 + 2 = 6 -> 1
       4 + 4 = 8 -> 3
       3 + 2 = 5 -> OUT (0)
       5 + 5 is not possible because an OUT hand cannot be selected.
    6. SPLIT:
       2 + 0 -> 1 + 1
       4 + 0 -> 2 + 2
    7. When both hands of a player are OUT, the other player wins.
*/

var p1hand1 = 1;
var p1hand2 = 1;

var p2hand1 = 1;
var p2hand2 = 1;

var currentPlayer = 1;
var selectedHand = 0;
var selectedPlayer = 0;
var gameStarted = false;


function startGame() {

    p1hand1 = 1;
    p1hand2 = 1;

    p2hand1 = 1;
    p2hand2 = 1;

    currentPlayer = 1;
    selectedHand = 0;
    selectedPlayer = 0;
    gameStarted = true;

    document.getElementById("winner").textContent = "";

    clearSelection();
    updateHands();

    document.getElementById("message").textContent =
        "Player 1: Select one of your hands";
}


function getHandImage(value) {

    if (value == 1) {
        return "images/hand1.png";
    }

    if (value == 2) {
        return "images/hand2.png";
    }

    if (value == 3) {
        return "images/hand3.png";
    }

    if (value == 4) {
        return "images/hand4.png";
    }

    return "";
}


function setHandImage(id, value) {

    var hand = document.getElementById(id);

    if (value == 0) {
        hand.style.backgroundImage = "none";
        hand.classList.add("out");
        hand.title = "OUT";
        return;
    }

    hand.style.backgroundImage = "url('" + getHandImage(value) + "')";
    hand.classList.remove("out");
    hand.title = value + " finger(s)";
}


// function updateHands() {

//     setHandImage("p1hand1", p1hand1);
//     setHandImage("p1hand2", p1hand2);

//     setHandImage("p2hand1", p2hand1);
//     setHandImage("p2hand2", p2hand2);

//     document.getElementById("p1count1").textContent =
//         p1hand1 == 0 ? "OUT" : p1hand1;

//     document.getElementById("p1count2").textContent =
//         p1hand2 == 0 ? "OUT" : p1hand2;

//     document.getElementById("p2count1").textContent =
//         p2hand1 == 0 ? "OUT" : p2hand1;

//     document.getElementById("p2count2").textContent =
//         p2hand2 == 0 ? "OUT" : p2hand2;

//     if (currentPlayer == 1) {
//         document.getElementById("p1turn").classList.add("turn-active");
//         document.getElementById("p2turn").classList.remove("turn-active");
//     } else {
//         document.getElementById("p2turn").classList.add("turn-active");
//         document.getElementById("p1turn").classList.remove("turn-active");
//     }

//     updateSplitButton();
// }







function updateHands() {

    setHandImage("p1hand1", p1hand1, 1);
    setHandImage("p1hand2", p1hand2, 1);

    setHandImage("p2hand1", p2hand1, 2);
    setHandImage("p2hand2", p2hand2, 2);

    document.getElementById("p1count1").textContent =
        p1hand1 == 0 ? "OUT" : p1hand1;

    document.getElementById("p1count2").textContent =
        p1hand2 == 0 ? "OUT" : p1hand2;

    document.getElementById("p2count1").textContent =
        p2hand1 == 0 ? "OUT" : p2hand1;

    document.getElementById("p2count2").textContent =
        p2hand2 == 0 ? "OUT" : p2hand2;

    if (currentPlayer == 1) {
        document.getElementById("p1turn")
            .classList.add("turn-active");

        document.getElementById("p2turn")
            .classList.remove("turn-active");
    } else {
        document.getElementById("p2turn")
            .classList.add("turn-active");

        document.getElementById("p1turn")
            .classList.remove("turn-active");
    }

    updateSplitButton();
}




function getHandValue(player, hand) {

    if (player == 1 && hand == 1) {
        return p1hand1;
    }

    if (player == 1 && hand == 2) {
        return p1hand2;
    }

    if (player == 2 && hand == 1) {
        return p2hand1;
    }

    if (player == 2 && hand == 2) {
        return p2hand2;
    }
}


function setHandValue(player, hand, value) {

    if (player == 1 && hand == 1) {
        p1hand1 = value;
    }

    if (player == 1 && hand == 2) {
        p1hand2 = value;
    }

    if (player == 2 && hand == 1) {
        p2hand1 = value;
    }

    if (player == 2 && hand == 2) {
        p2hand2 = value;
    }
}


function selectHand(player, hand) {

    if (gameStarted == false) {
        return;
    }

    if (getHandValue(player, hand) == 0) {
        return;
    }

    if (selectedHand == 0) {

        if (player != currentPlayer) {
            document.getElementById("message").textContent =
                "Select your own hand first";
            return;
        }

        selectedHand = hand;
        selectedPlayer = player;

        markSelectedHand(player, hand);

        document.getElementById("message").textContent =
            "Now click an opponent's hand";
        return;
    }

    var opponentPlayer;

    if (currentPlayer == 1) {
        opponentPlayer = 2;
    } else {
        opponentPlayer = 1;
    }

    if (player != opponentPlayer) {
        document.getElementById("message").textContent =
            "Click the opponent's hand";
        return;
    }

    makeMove(player, hand);

    selectedHand = 0;
    selectedPlayer = 0;
    clearSelection();

    if (checkWinner() == true) {
        return;
    }

    changeTurn();
    updateHands();

    document.getElementById("message").textContent =
        "Player " + currentPlayer + ": Select your hand";
}


function makeMove(opponentPlayer, opponentHand) {

    var attackerValue =
        getHandValue(currentPlayer, selectedHand);

    var opponentValue =
        getHandValue(opponentPlayer, opponentHand);

    var newValue = attackerValue + opponentValue;

    /*
        A total of 5 becomes OUT.
        Totals above 5 wrap around using the remainder.
        Example: 4 + 2 = 6 -> 1.
        JavaScript's % operator gives the remainder after division. 
    */
    newValue = newValue % 5;

    setHandValue(opponentPlayer, opponentHand, newValue);

    updateHands();
}


function changeTurn() {

    if (currentPlayer == 1) {
        currentPlayer = 2;
    } else {
        currentPlayer = 1;
    }
}


function checkWinner() {

    if (p1hand1 == 0 && p1hand2 == 0) {

        gameStarted = false;

        document.getElementById("message").textContent = "GAME OVER";
        document.getElementById("winner").textContent =
            "🏆 PLAYER 2 WINS!";

        updateHands();
        return true;
    }

    if (p2hand1 == 0 && p2hand2 == 0) {

        gameStarted = false;

        document.getElementById("message").textContent = "GAME OVER";
        document.getElementById("winner").textContent =
            "🏆 PLAYER 1 WINS!";

        updateHands();
        return true;
    }

    return false;
}


function canSplit() {

    if (currentPlayer == 1) {
        return (p1hand1 == 2 && p1hand2 == 0) ||
               (p1hand1 == 0 && p1hand2 == 2) ||
               (p1hand1 == 4 && p1hand2 == 0) ||
               (p1hand1 == 0 && p1hand2 == 4);
    }

    return (p2hand1 == 2 && p2hand2 == 0) ||
           (p2hand1 == 0 && p2hand2 == 2) ||
           (p2hand1 == 4 && p2hand2 == 0) ||
           (p2hand1 == 0 && p2hand2 == 4);
}


function splitHands() {

    if (gameStarted == false) {
        return;
    }

    if (canSplit() == false) {
        document.getElementById("message").textContent =
            "SPLIT is not available for this hand combination";
        return;
    }

    if (currentPlayer == 1) {

        if (p1hand1 == 2 && p1hand2 == 0) {
            p1hand1 = 1;
            p1hand2 = 1;
        } else if (p1hand1 == 0 && p1hand2 == 2) {
            p1hand1 = 1;
            p1hand2 = 1;
        } else if (p1hand1 == 4 && p1hand2 == 0) {
            p1hand1 = 2;
            p1hand2 = 2;
        } else if (p1hand1 == 0 && p1hand2 == 4) {
            p1hand1 = 2;
            p1hand2 = 2;
        }

    } else {

        if (p2hand1 == 2 && p2hand2 == 0) {
            p2hand1 = 1;
            p2hand2 = 1;
        } else if (p2hand1 == 0 && p2hand2 == 2) {
            p2hand1 = 1;
            p2hand2 = 1;
        } else if (p2hand1 == 4 && p2hand2 == 0) {
            p2hand1 = 2;
            p2hand2 = 2;
        } else if (p2hand1 == 0 && p2hand2 == 4) {
            p2hand1 = 2;
            p2hand2 = 2;
        }
    }

    selectedHand = 0;
    selectedPlayer = 0;
    clearSelection();

    changeTurn();
    updateHands();

    document.getElementById("message").textContent =
        "Player " + currentPlayer + ": Select your hand";
}


function updateSplitButton() {
    document.getElementById("splitButton").disabled = !canSplit();
}


function markSelectedHand(player, hand) {

    clearSelection();

    var id = "";

    if (player == 1 && hand == 1) id = "p1hand1";
    if (player == 1 && hand == 2) id = "p1hand2";
    if (player == 2 && hand == 1) id = "p2hand1";
    if (player == 2 && hand == 2) id = "p2hand2";

    document.getElementById(id).classList.add("selected");
}


function clearSelection() {

    document.getElementById("p1hand1").classList.remove("selected");
    document.getElementById("p1hand2").classList.remove("selected");
    document.getElementById("p2hand1").classList.remove("selected");
    document.getElementById("p2hand2").classList.remove("selected");
}


document.getElementById("startButton").addEventListener(
    "click",
    startGame
);

document.getElementById("splitButton").addEventListener(
    "click",
    splitHands
);

document.getElementById("p1hand1").addEventListener(
    "click",
    function() { selectHand(1, 1); }
);

document.getElementById("p1hand2").addEventListener(
    "click",
    function() { selectHand(1, 2); }
);

document.getElementById("p2hand1").addEventListener(
    "click",
    function() { selectHand(2, 1); }
);

document.getElementById("p2hand2").addEventListener(
    "click",
    function() { selectHand(2, 2); }
);

updateHands();
updateSplitButton();








