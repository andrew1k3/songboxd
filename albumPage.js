const APIController = (function () {

    const clientId = '1c2978216cf240cc81df8aa9a52551ba';
    const clientSecret = 'e7445e56d10d4c6cb76831c402e90907';

    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const _getTracks = async (token, albumID) => {


        const result = await fetch(`https://api.spotify.com/v1/albums/${albumID}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        return await result.json();
    }

    return {
        getToken() {
            return _getToken();
        },
        getTracks(token, albumID) {
            return _getTracks(token, albumID);
        }
    }
})();

function ms_to_time(num) {
    var seconds = num / 1000;
    var mins = Math.floor(seconds / 60);
    var overflow_seconds = Math.floor(seconds) % 60;
    if (overflow_seconds < 10) {
        var temp = overflow_seconds;
        var overflow_seconds = `0${temp}`
    }
    console.log(`${mins}:${overflow_seconds}`);
    return `${mins}:${overflow_seconds}`;
}

const generatePage = async (album) => {
    var html =
    `
        <a href="indexTest.html">BACK</a>
        <h4>${album.album_type}</h4>
        <img src='${album.images[0].url}' alt='${album.id}' />
        <div class='center-div'> 
            <h1 style="display: inline">${album.name}</h1>
            <a href="${album.external_urls.spotify}" target="_blank" rel="noopener noreferrer"><img src='Spotify_logo_without_text.png' style='width:20px;height:20px;'/></a>
        </div>
        <table id='tracklist'>
        </table>
    `;
    document.querySelector('#main').insertAdjacentHTML('beforeend', html);

    
    for (i = 0; i < album.total_tracks; i++) {
        var track = album.tracks.items[i];
        var trackHtml =
        `
        <tr>
             <h5 style="display: inline">${track.name}</h5> by ${track.artists[0].name} | ${ms_to_time(track.duration_ms)}
        </tr>
        `;
        document.querySelector('#tracklist').insertAdjacentHTML('beforeend', trackHtml);
    }
    
};

const main = async () => {
    let params = new URLSearchParams(document.location.search);
    let id = params.get("id");
    console.log(id);

    const token = await APIController.getToken();
    console.log(token)
    var album = await APIController.getTracks(token, id);
    console.log(album)

    generatePage(album)
};

main();