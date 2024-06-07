let intervalId; // Stores the interval ID for letter generation

// Starts the game once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    startGame();
});

function startGame() {
    // Hides game over message and start button, clears existing letters
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('start-button').style.display = 'none';
    document.querySelectorAll('.letter').forEach(letter => letter.remove());

    // Sets an interval to create a new letter every second
    intervalId = setInterval(createLetter, 1000);
}

function generateRandomLetter() {
    // Generates a random letter from A-Z
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters.charAt(Math.floor(Math.random() * letters.length));
}

function generateRandomPosition() {
    // Calculates a random position for a letter within the viewport, excluding navbar area
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const randomX = Math.floor(Math.random() * (screenWidth - 50));
    const randomY = Math.floor(Math.random() * (screenHeight - navbarHeight - 50)) + navbarHeight;
    return { x: randomX, y: randomY };
}

function createLetter() {
    // Creates and positions a new letter element on the screen
    const letter = generateRandomLetter();
    const position = generateRandomPosition();
    const newLetter = document.createElement('div');
    newLetter.textContent = letter;
    newLetter.classList.add('letter');
    newLetter.style.left = position.x + 'px';
    newLetter.style.top = position.y + 'px';
    newLetter.addEventListener('click', function() {
        if (letter === 'X') {
            gameOver(); // Ends game if letter X is clicked
        } else {
            this.remove(); // Removes the letter on click
        }
    });
    document.body.appendChild(newLetter);
}

function gameOver() {
    // Stops letter generation, clears the screen, shows game over message and restart option
    clearInterval(intervalId);
    document.querySelectorAll('.letter').forEach(letter => letter.remove());
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('start-button').style.display = 'block';
}
