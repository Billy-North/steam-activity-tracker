export class HttpRequests {

    static async GetPlayerSummaries(steamid: string): Promise<any> {
        const url = `${process.env.REACT_APP_BACKEND_URL}/steamgetplayersummaries/${steamid}`;
        const response = await fetch(url);
        if (response.status === 200) {
            return Promise.resolve(response.json())
        } else if (response.status === 204) {
            return Promise.resolve('no user')
        } else {
            return Promise.reject(response.statusText)
        }
    }

}