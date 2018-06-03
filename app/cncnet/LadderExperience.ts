namespace cncnet
{
    export enum Screen
    {
        Loading,
        GameList,
        GameDetail
    }

    export class LadderExperience
    {
        public readonly LADDER_URL: string = "//ladder.cncnet.org";
        private readonly RECENT_GAMES_URL: string = "//ladder.cncnet.org/api/v1/ladder/yr/games/recent/6";
        
        private recentGames: Array<Game>;
        private recentGamesStorage: WindowLocalStorage;
        private ladderUI: ui.LadderUI;

        private _screen: Screen = Screen.Loading;
        private _games: Array<Game> = [];

        constructor(serviceWorkerFile: string)
        {
            this.ladderUI = new ui.LadderUI(this);

            this.registerServiceWorker(serviceWorkerFile);
            this.recentGamesStorage = localStorage.cncnetRecentGames;
            this.recentGames = this.recentGamesStorage as any;
        }

        private registerServiceWorker(serviceWorkerFile: string): void
        {
            if ("serviceWorker" in navigator)
            {
                navigator.serviceWorker.register(serviceWorkerFile)
                .then(() => this.onServiceWorkerRegistered());
            }
        }

        private onServiceWorkerRegistered(): void
        {
            console.log("LadderExperience ** Service worker registered");
            this.checkLocalStorage();
        }

        private checkLocalStorage(): void
        {
            if (this.recentGamesStorage)
            {   
                this.recentGames = JSON.parse(this.recentGamesStorage as any);
                for (var i:number = 0; i < this.recentGames.length; i++)
                {
                    var game: Game = this.recentGames[i];
                }
            }
            else
            {
                this.fetchData();
            }
        }

        private fetchData(): void
        {
            if (window.caches)
            {
                /*
                * @TODO
                * Check if the service worker has already cached data. 
                * If the service worker has the data, then display the cached
                * data while the app fetches the latest data.
                */
            }

            // Fetch the latest data.
            var request = new XMLHttpRequest();
            request.onreadystatechange = () => 
            {
                if (request.readyState === XMLHttpRequest.DONE) 
                {
                    if (request.status === 200) 
                    {
                        this.onParseResponse(request.response);
                    }
                } 
                else 
                {
                    // @TODO - Show UI with cached data while waiting
                }
            };

            request.open('GET', this.RECENT_GAMES_URL);
            request.send();
        }

        private onParseResponse(data: any): void
        {
            var response = JSON.parse(data);
            for (var i: number = 0; i < response.length; i++)
            {
                this._games.push(Game.fromJson(response[i]));
            }
            this.screen = Screen.GameList;
        }

        private onScreenChanged(): void
        {
            console.log("LadderExperience ** Screen Changed", Screen[this._screen]);

            switch (this._screen)
            {
                case Screen.GameList:
                    this.ladderUI.showList();
                    break;
                case Screen.GameDetail:
                    break;
            }
        }

        public get games(): Array<Game> { return this._games; }
        public get screen(): Screen { return this._screen; }
        public set screen(value: Screen)
        { 
            this._screen = value;
            this.onScreenChanged();
        }
    }
}
