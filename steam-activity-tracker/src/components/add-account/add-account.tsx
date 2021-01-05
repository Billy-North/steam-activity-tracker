import React, { ReactHTMLElement, useEffect, useState } from 'react';

export function AddSteamAccount() {
    const [steamid, setSteamid] = useState<string>("");


    const inputSteamid = (e: any) => {
        setSteamid(e.target.value)

        if (e.target.value.length == 17) {
            console.log('THE LENGTH is 17')
        }
    }

    return (
        <div style={{ margin: "auto", width: "50%" }}>
            <h3>Add Steam Account</h3>
            <div className="form-group">
                < label >Steam ID</label >
                <input value={steamid} onChange={inputSteamid} type="text" className="form-control" placeholder="Enter steam id" />
            </div >
        </div >
    )





}

