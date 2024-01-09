const API_KEY = "AIzaSyBL9rQTVuW7uSacUlNWjxA967dUYVDptU8"
const BASE_URL = "https://www.googleapis.com/youtube/v3"

// fetching using a search keyword
async function fetchVideo(searchQuery){
    const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=10&part=snippet`);
    const data = await response.json();
    console.log(data.items);
}
async function fetchVideo1(){
    const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&maxResults=30&part=snippet`);
    const data = await response.json();
    console.log(data.items);
}

fetchVideo1();

// getting video stats using video id
async function getVideoStats(videoId){
    const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`)
    const data = await response.json();
    console.log(data.items);
}
// getting channel logo
async function getChannelLogo(channelId){
    const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`)
    const data = await response.json();
    console.log(data.items[0].snippet.thumbnails.high.url);
}

getVideoStats("Rd4a1X3B61w")
getChannelLogo("UCYgL81lc7DOLNhnel1_J6Vg")
