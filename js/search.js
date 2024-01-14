import {
    API_KEY,
    BASE_URL,
    fetchSearchResults, 
    getVideoStatsByID,
    getChannelInfo,
    updateSearchItemProperties,
    shortenNumber,
    shortenTimeDifference,
} from './youtube.js'


// getting the search value from the url
const url = window.location.search;
const urlParams = new URLSearchParams(url);

const searchValue = urlParams.get('q');

console.log(searchValue);
// displaying on the search 
async function renderContent(itemDetails){
        
    const video_preview = document.createElement("div")
    video_preview.setAttribute("class", "singleSearchOutput_row");
    video_preview.innerHTML = `
        <div class="searchThumnail">
            <a href="./video_player.html?id=${itemDetails.videoId}">
                <img src="${itemDetails.thumbnailUrl}" alt="">
            </a>
        </div>
        <div class="SingleSearchDetails">
            <a href="./video_player.html?id=${itemDetails.videoId}">
                <h2 class="title">${itemDetails.videoTitle}</h3>
            </a>
            <p>${itemDetails.videoViewCount} views. ${itemDetails.sincePublishDate}</p>
            <div class="channelDetails">
                <img src="${itemDetails.channelLogoUrl}" alt="${itemDetails.channelTitle}" class="channelImage">
                <p>${itemDetails.channelTitle}</p>
            </div>
            <div class="videoDescription">
                <p>
                ${itemDetails.videoDescription.substring(0,100)}
                </p>
            </div>
        </div>
     `;

     const searchedVideosContainer = document.getElementById("searchOutput");

     searchedVideosContainer.appendChild(video_preview)
}

async function renderSearchResults(searchQuery) {
    const items = await fetchSearchResults(searchQuery);

    const usefulItemProperties = items.map((item) => {
        return {
            videoId: item.id.videoId,
            channelId: item.snippet.channelId,
            thumbnailUrl: item.snippet.thumbnails.high.url,
            videoTitle: item.snippet.title,
            channelTitle: item.snippet.channelTitle,
            sincePublishDate: shortenTimeDifference(item.snippet.publishedAt),
        };
    });
    
    const itemPromiseArr = [];
    usefulItemProperties.forEach((itemDetails) => {
        // returns a promise of updating the properties with neccessary data
        // don't await, we need the promises, not the result
        itemPromiseArr.push(updateSearchItemProperties(itemDetails));
    });


    // ADD ALL THE VIDEO OBJECTS TO AN ARRAY, THEN TO LOCAL_STORAGE, RENDER FROM THE RESOLVED ARRAY
    Promise.all(itemPromiseArr).then((resolvedArray) => {

        resolvedArray.forEach((renderable_videoDetailsObject)=> {
            renderContent(renderable_videoDetailsObject);
        })
    });
}

renderSearchResults(searchValue);


