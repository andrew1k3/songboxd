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

    const _getAlbum = async (token, albumID) => {

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
        getAlbum(token, albumID) {
            return _getAlbum(token, albumID);
        }
    }
})();

function generateAlbumRating(album, rating) {
    let ratingColour = (rating * 15) + 100;
    let html =
    `
    <tr>
        <th class='container-row'>
            <img src="${album.images[0].url}"/>
            <a href="albumPage.html?id=${album.id}"><h5> ${album.name}</h5></a><div> ${album.artists[0].name}</div>
            <input data-role="rating"
                data-stars="10"
                data-stared-color="rgb( 44, ${ratingColour}, 75)"
                data-value="${rating}"
                data-static="true"
                data-message="${rating}/10"
                style="display:block;">
        </th>
    </tr>
    `;
    document.querySelector('#albums-rated').insertAdjacentHTML('beforeend', html); 
}

const main = async () => {
    let cookies = document.cookie.split(';');
    cookies.forEach(async cookie => {
        console.log(cookie);
        let id = cookie.split('=')[0].trim();
        let rating = cookie.split('=')[1];
        let token = await APIController.getToken();
        let album = await APIController.getAlbum(token, id);  
        generateAlbumRating(album, rating);   
    });      
};
main();
