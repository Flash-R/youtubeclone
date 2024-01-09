const API_KEY = "AIzaSyBL9rQTVuW7uSacUlNWjxA967dUYVDptU8"
const BASE_URL = "https://www.googleapis.com/youtube/v3"

// getting the videos on load
async function fetchVideoOnLoadDeaulf() {
    const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&maxResults=30&part=snippet`);
    const data = await response.json();
    return data.items;
}


// getting channel logo
async function getChannelLogo(channelId){
    const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`)
    const data = await response.json();
    

    return data.items[0].snippet.thumbnails.high.url;
}
// getting channel Info
async function getChannelStats(channelId){
    const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=statistics&id=${channelId}`)
    const data = await response.json();
    

    return data.items[0].statistics;
}
const video_grid = document.getElementById("video-grid")

async function reload(){
    let results = await fetchVideoOnLoadDeaulf();
    console.log(results)
    for (let i = 0; i < results.length; i++) {
        const video_preview = document.createElement("div")
        video_preview.setAttribute("class", "video-preview");


        video_preview.innerHTML = `
            <div class= 'thumbnail-row' >
                <a href='https://www.youtube.com/watch?v=${results[i].id.videoId}' target='_blank' class='video-title-link'>
                    <img class='thumbnail' src='${results[i].snippet.thumbnails.high.url}'>
                </a>
                <div class='video-time'>14:20</div>
            </div >
            <div class='video-info-grid'>
                <div class='channel-picture'>
                    <div class='profile-picture-container'>
                        <a href='https://www.youtube.com/c/${results[i].snippet.channelId}' target='_blank' class='channel-link'>
                            <img class='profile-picture' src='${getChannelLogo(results[i].snippet.channelId).then(data => {data})}>
                        </a>
                        <div class='channel-tooltip'>
                            <img class='channel-tooltip-picture' src='${getChannelLogo(results[i].snippet.channelId).then(data => {data})}'>
                                <div class='channel-info-tooltip'>
                                    <p class='channel-tooltip-name'>${results[i].snippet.channelTitle}</p>
                                    <p class='channel-tooltip-stats'>${getChannelStats(results[i].snippet.channelId).then(data =>{data.subscriberCount})} subscribers</p>
                                </div>
                        </div>
                    </div>
                </div>
                <div class='video-info'>
                    <a href='https://www.youtube.com/watch?v=n2RNcPRtAiY' target='_blank' class='video-title-link'>
                        <p class='video-title'>${results[i].snippet.Title}</p>
                    </a>
                    <div class='tooltip-hover'>
                        <a href='https://www.youtube.com/c/mkbhd' target='_blank' class='channel-link'>
                            <p class='video-author'>${results[i].snippet.channelTitle}</p>
                        </a>
                        <p class='video-stats'>3.4M views &#183; 6 months ago</p>
                    </div>
                </div>
            </div>
         `;
         video_grid.appendChild(video_preview);
         console.log('The page has fully loaded');
    }
};
reload()