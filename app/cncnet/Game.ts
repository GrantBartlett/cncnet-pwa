namespace cncnet
{
    export class Game
    {
        private _id: string;
        private _scen: string;
        private _plrs: number;
        private _url: string;
        private _map_url: string;
        private _players: Array<any>; // TODO
        private games: Array<Game>;

        constructor(id: string, scen: string, plrs: number, url: string, map_url: string, players: Array<any>)
        {
            this._id = id;
            this._scen = scen;
            this._plrs = plrs;
            this._url = url;
            this._map_url = map_url;
            this._players = players;
            this.games = [];
        }

        public static fromJson(json: any): Game
        {
            return new Game(json.id, json.scen, json.plrs, json.url, json.map_url, json.players);
        }

        public get id(): string { return this._id;}
        public get map(): string { return this._scen;}
        public get mapPreview(): string { return this._map_url;}
        public get url(): string { return this._url;}
        public get players(): Array<any> { return this._players; }
    }
}