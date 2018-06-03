namespace cncnet.ui
{
    export class LadderUI
    {
        private ladderExperience: LadderExperience;
        
        private gameListCardTemplate: HTMLElement;
        private mainRecentGames: HTMLElement;
        private mainTop10Players: HTMLElement;

        constructor(ladderExperience:LadderExperience)
        {   
            this.ladderExperience = ladderExperience;

            this.mainRecentGames = document.getElementById("recentGames") as HTMLElement;
            this.mainTop10Players = document.getElementById("top10Players") as HTMLElement;
            this.gameListCardTemplate = document.querySelector(".gameListCardTemplate") as HTMLElement;
        }

        public showList(): void
        {
            var games: Array<Game> = this.ladderExperience.games;

            for (var i: number = 0; i < games.length; i++)
            {
                var game: Game = games[i];
                var cardNode: Node = this.gameListCardTemplate.cloneNode(true);
                var card: HTMLElement = this.createCard(cardNode, game);
                this.mainRecentGames.appendChild(card);
            }
        }

        private createCard(node: Node, game: Game): HTMLElement
        {
            var el = node as HTMLElement;
            (el.querySelector(".mapName") as HTMLElement).innerText = game.map;
            (el.querySelector(".mapPreview") as HTMLElement).innerHTML += "<img src='" + this.ladderExperience.LADDER_URL + game.mapPreview + "' />";
            (el.querySelector(".viewGame") as HTMLElement).setAttribute("href", this.ladderExperience.LADDER_URL + game.url);

            var mapPlayers: HTMLElement = (el.querySelector(".mapPlayers") as HTMLElement);
            for (var i = 0; i < game.players.length; i++)
            {
                var player = game.players[i];

                i == 1 ? mapPlayers.innerHTML += "<span class='vs'>VS</span> ": null;

                var playerWonLost = "<span class='player "+ (player.won == true ? "won" : "lost") + "'>" + player.username + "</span>";
                mapPlayers.innerHTML += playerWonLost;
            }

            el.removeAttribute("hidden");
            return el;
        }
    }
}