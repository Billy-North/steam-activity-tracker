import React, { useEffect, useState } from 'react';
import { HttpRequests } from '../../utilities/http-requesnts'

interface SteamUserFound {
    avatar: string
    avatarfull: string
    avatarhash: string
    avatarmedium: string
    commentpermission: number
    communityvisibilitystate: number
    lastlogoff: number
    loccityid: number
    loccountrycode: string
    locstatecode: string
    personaname: string
    personastate: number
    personastateflags: number
    primaryclanid: string
    profilestate: number
    profileurl: string
    steamid: string
    timecreated: number
}

export function AddSteamAccount() {
    const [steamid, setSteamid] = useState<string>("");
    const [steamUserFound, setSteamUserFound] = useState<SteamUserFound | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null)


    const inputSteamid = async (e: any) => {
        setSteamid(e.target.value)
        if (e.target.value.length === 17) {
            const steamUser = await HttpRequests.GetPlayerSummaries(e.target.value)
            if (steamUser !== 'no user') {
                setSteamUserFound(steamUser.data)
                setErrorMessage(null)
            } else if (steamUser === 'no user') {
                setErrorMessage('No steam user found with this id')
                setSteamUserFound(null)
            } else {
                setErrorMessage('Internal server error')
                setSteamUserFound(null)
            }
        }
    }

    return (
        <div style={{ margin: "auto", width: "50%" }}>
            <h2>Add Steam Account</h2>
            <div className="form-group">
                <input value={steamid} onChange={inputSteamid} type="text" className="form-control" placeholder="Enter steam 64 id" />
                {steamUserFound &&
                    <div style={{ marginTop: "7px" }}>
                        <h3>{steamUserFound.personaname}<img src={steamUserFound.avatarmedium} style={{ marginLeft: "10px" }} alt="steam profile image" /></h3>
                        <button type="button" className="btn btn-success">Add {steamUserFound.personaname}</button>
                    </div>
                }
                {errorMessage &&
                    <div style={{ marginTop: "7px" }}>
                        <p style={{ color: 'red' }}>{errorMessage}</p>
                    </div>
                }
            </div>
        </div>
    )





}

