const API_KEY = "AIzaSyBL9rQTVuW7uSacUlNWjxA967dUYVDptU8"
const BASE_URL = "https://www.googleapis.com/youtube/v3"

// fetching using a search keyword
async function fetchVideo(searchQuery){
    const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=10&part=snippet`);
    const data = await response.json();
    console.log(data.items.length);
}
async function fetchVideo1(){
    const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&maxResults=30&part=snippet`);
    const data = await response.json();
    console.log(data.items[4].snippet.thumbnails.high.url);
}

// fetchVideo1();

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
    

    return data.items[0].snippet.thumbnails.high.url;
}
// getting channel Info
async function getChannelInfo(channelId){
    const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=statistics&id=${channelId}`)
    const data = await response.json();
    

    console.log(data.items[0].statistics);
}

// getVideoStats("Rd4a1X3B61w")
getChannelLogo("UCYgL81lc7DOLNhnel1_J6Vg").then(data=>{
    console.log(data)
})
console.log(getChannelLogo("UCYgL81lc7DOLNhnel1_J6Vg"))
// getChannelInfo("UCYgL81lc7DOLNhnel1_J6Vg")
