class Updater {
    constructor(config, userBar, levelBar, scoreBar, leaderBar, maxLeaderSize) {
        this.config = config;
        this.userBar = userBar;
        this.scoreBar = scoreBar;
        this.leaderBar = leaderBar;
        this.levelBar = levelBar;
        this.config.leaderboard = this.config.leaderboard ? this.config.leaderboard : [];
        this.maxLeaderSize = maxLeaderSize;
        this.updateInfo();
    }

    updateInfo() {
        this.userBar.textContent = "Игрок: " + this.config.username;
        this.levelBar.textContent = "Текущий уровень: " + (this.config.level + 1);
        this.scoreBar.textContent = "Счёт: " + this.config.score;
        this.leaderBar.textContent = this.config.leaderboard.length !== 0 ? this.config.leaderboard.slice(0, this.maxLeaderSize)
            .map(a => a.name + ' - ' + a.score)
            .join('\n') : "Пусто";
    }

    updateLeaders() {
        this.config.leaderboard.push({name: this.config.username, score: this.config.score});
        this.config.leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem('leaders', JSON.stringify(this.config.leaderboard));
    }
}

export {Updater}