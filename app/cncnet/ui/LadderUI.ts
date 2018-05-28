namespace cncnet.ui
{
    export class LadderUI
    {
        private ladderExperience: LadderExperience;
        
        private gameListCardTemplate: HTMLElement;
        private main: HTMLElement;

        constructor(ladderExperience:LadderExperience)
        {   
            this.ladderExperience = ladderExperience;

            this.main = document.querySelector(".main") as HTMLElement;
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
                this.main.appendChild(card);
            }
        }

        private createCard(node: Node, game: Game): HTMLElement
        {
            var el = node as HTMLElement;
            (el.querySelector(".mapName") as HTMLElement).innerText = game.map;
            (el.querySelector(".mapPreview") as HTMLElement).innerText = game.mapPreview;
            el.removeAttribute("hidden");

            return el;
        }
    }
}