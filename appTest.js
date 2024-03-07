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

    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=en_US`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 10;

        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, playlistID) => {

        const limit = 10;

        const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.items;
    }

    const _getSearch = async (token, query) => {

        const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album&limit=10`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        
        return data;
    }

    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getSearch(token, tracksEndPoint) {
            return _getSearch(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})();


function multiArtist(item) {
    var out = item[0].name;
    if (item.length == 1) { return out; }
    for (i = 1; i < item.length; i++) {
        out += ', ' + item[i].name; 
    }
    return out;  
};


const page = async (id) => {
    // launch album page with info
    // document.querySelector('#testLabel').innerHTML = name;
    console.log(id);
    // go to albumPage form -> bring through id string
    let url = new URL(`https://localhost:44330/albumPage.html?id=${id}`);
    window.location.replace(url)
};

const main = async () => { 
    document.querySelector('#albums-detail').innerHTML = '';
    var search = document.querySelector('#ID').value;
    document.querySelector('#testLabel').innerHTML = '...';
    console.log(search)
    const token = await APIController.getToken();
    console.log(token)
    var searches = await APIController.getSearch(token, search);
    console.log(searches)
    searches = searches.albums.items;    

    if (searches.length > 0) {
        for (i = 0; i < searches.length; i++) {
            var search = searches[i];
            var artists = search.artists[0].name;
            console.log(artists);
            var html =
            `
            <tr>
                <th class='container-row'>
                    <img src="${search.images[0].url}"/>
                    <a href="albumPage.html?id=${search.id}"><h5> ${search.name}</h5></a>by ${artists}
                </th>
            </tr>
            `;
            document.querySelector('#albums-detail').insertAdjacentHTML('beforeend', html); 
            //onclick="page('${search.id}')
        }
        document.querySelector('#testLabel').innerHTML = ``;
    }
    else {
        document.querySelector('#testLabel').innerHTML = 'No search results';
    }
}; 



