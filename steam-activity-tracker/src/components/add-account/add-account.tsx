import { useState } from 'react';
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

interface AddUserMessage {
    message: string,
    error: boolean
}

export function AddSteamAccount() {
    const [steamid, setSteamid] = useState<string>("");
    const [steamUserFound, setSteamUserFound] = useState<SteamUserFound | null>(null);
    const [steamUsererrorMessage, setSteamUserErrorMessage] = useState<string | null>(null);
    const [userAddMessage, setUserAddMessage] = useState<AddUserMessage | null>(null);



    const inputSteamid = async (e: any) => {
        setSteamUserFound(null)
        setUserAddMessage(null)
        setSteamid(e.target.value)
        if (e.target.value.length === 17) {
            const steamUser = await HttpRequests.GetPlayerSummaries(e.target.value)
            if (steamUser !== 'no user') {
                setSteamUserFound(steamUser.data)
                setSteamUserErrorMessage(null)
            } else if (steamUser === 'no user') {
                setSteamUserErrorMessage('No steam user found with this id')
                setSteamUserFound(null)
            } else {
                setSteamUserErrorMessage('Internal server error')
                setSteamUserFound(null)
            }
        }
    }

    const addUser = async () => {
        const request = await HttpRequests.addUser(steamid);
        if (request === 'added') {
            setUserAddMessage({ message: 'User has been added', error: false })
            setSteamUserFound(null);
            setSteamid('')
        } else if (request === 'conflict') {
            setUserAddMessage({ message: 'User already exists in database', error: true })
        } else {
            setUserAddMessage({ message: 'Server error', error: true })
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
                        <button onClick={addUser} type="button" className="btn btn-success">Add {steamUserFound.personaname}</button>
                    </div>
                }
                {steamUsererrorMessage &&
                    <div style={{ marginTop: "7px" }}>
                        <p style={{ color: 'red' }}>{steamUsererrorMessage}</p>
                    </div>
                }

                {userAddMessage != null &&
                    <div style={{ marginTop: "7px" }}>
                        {userAddMessage.error ? <p style={{ color: 'red' }}>{userAddMessage.message}</p> : <p style={{ color: 'green' }}>{userAddMessage.message}</p>}
                    </div>
                }
            </div>
        </div>
    )





}

