class Sound {
    game_over = new Audio("audio/game-over.mp3");
    clear_stripe = new Audio("audio/clear-stripe.mp3");

    gameOver() {
        this.game_over.play();
    }

    clearStripe() {
        this.clear_stripe.play();
    }
}

export {Sound}