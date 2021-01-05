export class HttpRequests {

    static async GetPlayerSummaries(steamid: string) {
        const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=0B19338574C902EE40D457F4B8ABD677&steamids=${steamid}`;
        const response = await fetch(url);
        const user = await response.json();
        return user;
    }

}