const API_KEY = "AIzaSyA30_P0lt18q6mKdI3q4gwC9bqMA1q29uk"
const BASE_URL = "https://www.googleapis.com/youtube/v3"

const searchBtn = document.getElementById("searchBtn");
const searchText = document.getElementById("searchText");
// fetch search queries
async function fetchSearchResults(searchQuery){
    let response, responseData;
    try {
        if(searchQuery == null || searchQuery == undefined){
            response = await fetch(`${BASE_URL}/search?key=${API_KEY}&maxResults=8&part=snippet&type=video`);
        }else{
            response = await fetch(`${BASE_URL}/search?key=${API_KEY}&maxResults=3&part=snippet&q=${searchQuery}&type=video`);
        }
        if(response.ok){
            responseData = await response.json();
        }else{
            throw new Error("API FETCH FAILED")
        }
    } catch (error) {
        console.log(error)
    }
    return responseData.items;

}
// getting video stats using video id
async function getVideoStatsByID(videoId){
    const url = `${BASE_URL}/videos?key=${API_KEY}&part=statistics,snippet,contentDetails&id=${videoId}`;

    let videoResponse;
    let data;
    try{
        videoResponse = await fetch(url);
        if(!videoResponse.ok){
            throw new Error("Error: Could not fetch from: ",url);
        }
        try{
            data = await videoResponse.json();
        }catch(e){
            console.log("Error: Could not parse the content")
        }
    }catch(e){
        console.log(e)
    }
    
    return {
        statistics: data.items[0].statistics,
        VideoContent: data.items[0].contentDetails
    };
}
// getting channel logo
async function getChannelLogo(channelId){
    const VideoObjponse = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`)
    const data = await VideoObjponse.json();
    

    return data.items[0].snippet.thumbnails.high.url;
}
    // getting channel Info
async function getChannelInfo(channelId){
    let response = null;
    let responseBody = null;
    try{
        response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=statistics,snippet&id=${channelId}`)
        if(response.ok){
            responseBody = await response.json()
        }else{
            throw new Error("Channel Info Failed to Load")
        }
    }catch(e){
        console.log(e)
        return null;
    }
    
    
    return responseBody.items[0];
}

async function updateSearchItemProperties(itemDetails) {
    const videoStatsObject = await getVideoStatsByID(itemDetails.videoId);

    const videoDuration = convertVideoDuration(
        videoStatsObject.VideoContent.duration
    );
    const videoViewCount = shortenNumber(videoStatsObject.statistics.viewCount);
    const videoLikeCount = shortenNumber(videoStatsObject.statistics.likeCount);
    const videoCommentCount = shortenNumber(videoStatsObject.statistics.commentCount);

    const channelDetailsObject = await getChannelInfo(itemDetails.channelId);
    const channelLogoUrl = channelDetailsObject.snippet.thumbnails.default.url;
    const channelSubscriberCount = shortenNumber(channelDetailsObject.statistics.subscriberCount);
    const channelDescription = channelDetailsObject.snippet.description;

    itemDetails.videoDuration = videoDuration;
    itemDetails["videoViewCount"] = videoViewCount;
    itemDetails["channelLogoUrl"] = channelLogoUrl;
    itemDetails['likeCount'] = videoLikeCount;
    itemDetails['commentCount'] = videoCommentCount;
    itemDetails['channelSubscriberCount'] = channelSubscriberCount;
    itemDetails['videoDescription'] = channelDescription;

    return itemDetails;
}

async function renderContent(itemDetails){
        
        const video_preview = document.createElement("div")
        video_preview.setAttribute("class", "video-preview");
        video_preview.innerHTML = `
            <div class= 'thumbnail-row' >
                <a href='https://www.youtube.com/watch?v=${itemDetails.videoId}' target='_blank' class='video-title-link'>
                    <img class='thumbnail' src='${itemDetails.thumbnailUrl}'>
                </a>
                <div class='video-time'>${itemDetails.videoDuration}</div>
            </div >
            <div class='video-info-grid'>
                <div class='channel-picture'>
                    <div class='profile-picture-container'>
                        <a href='https://www.youtube.com/c/${itemDetails.channelId}' target='_blank' class='channel-link'>
                            <img class='profile-picture' src='${itemDetails.channelLogoUrl}'>
                        </a>
                    </div>
                </div>
                <div class='video-info'>
                    <a href='https://www.youtube.com/watch?v=${itemDetails.videoId}' target='_blank' class='video-title-link'>
                        <p class='video-title'>${itemDetails.videoTitle}</p>
                    </a>
                    <div class='tooltip-hover'>
                        <a href='https://www.youtube.com/c/mkbhd' target='_blank' class='channel-link'>
                            <p class='video-author'>${itemDetails.channelTitle}</p>
                        </a>
                        <p class='video-stats'>${itemDetails.videoViewCount} views &#183; ${itemDetails.sincePublishDate}</p>
                    </div>
                </div>
            </div>
         `;

         const videosContainer = document.querySelector(".video-grid");

        //  console.log(video_preview);
         videosContainer.appendChild(video_preview)
}

// Shortening the numbers to B,M,K
function shortenNumber(number) {
    const M = 1000000;
    const B = 1000 * M;
    const K = 1000;

    if (Math.floor(number / B)) {
        return (number / B).toFixed(1) + "B";
    } else if (Math.floor(number / M)) {
        return (number / M).toFixed(1) + "M";
    } else if (Math.floor(number / K)) {
        return Math.floor(number / K) + "K";
    } else {
        return number;
    }
}

// Shortening the numbers to sec,min,hours,day,month,years
function shortenTimeDifference(ISODateString) {
    const startDate = new Date(ISODateString);
    const endDate = new Date();

    // time units in milliseconds
    const ms_sec = 1000;
    const ms_min = ms_sec * 60;
    const ms_hour = ms_min * 60;
    const ms_day = ms_hour * 24;
    const ms_week = ms_day * 7;
    const ms_month = ms_day * 30;
    const ms_year = ms_day * 365;

    // time difference in milliseconds
    const ms_difference = endDate.getTime() - startDate.getTime();

    if (Math.floor(ms_difference / ms_year) > 0) {
        return convertTime(ms_year, "year");
    } else if (Math.floor(ms_difference / ms_month) > 0){
        return convertTime(ms_month, "month");
    } else if (Math.floor(ms_difference / ms_week) > 0){
        return convertTime(ms_week, "week");
    } else if (Math.floor(ms_difference / ms_day) > 0){
        return convertTime(ms_day, "day");
    } else if (Math.floor(ms_difference / ms_hour) > 0){
        return convertTime(ms_hour, "hour");
    } else if (Math.floor(ms_difference / ms_min)){
        return convertTime(ms_min, "min");
    } else {
        return convertTime(ms_sec, "second");
    }

    function convertTime(divisor, suffix) {
        const timeUnit = Math.floor(ms_difference / divisor);
        suffix = timeUnit > 1 ? suffix + "s" : suffix;
        return timeUnit.toString() + " " + suffix + " ago";
    }
}

// Formating video duration
function convertVideoDuration(ISO_time) {
    const hours = ISO_time.includes("H")
        ? ISO_time.slice(2, ISO_time.indexOf("H"))
        : null;
    const minutes = hours
        ? ISO_time.slice(ISO_time.indexOf("H") + 1, ISO_time.indexOf("M"))
        : ISO_time.slice(2, ISO_time.indexOf("M"));
    const seconds = ISO_time.slice(ISO_time.indexOf("M") + 1, -1);

    const duration = hours
        ? hours + ":" + minutes + ":" + seconds
        : minutes + ":" + seconds;

    return duration;
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
        // localStorage.setItem(
        //     "renderableVideoProperties",
        //     JSON.stringify(resolvedArray)
        // );

        resolvedArray.forEach((renderable_videoDetailsObject)=> {
            renderContent(renderable_videoDetailsObject);
        })
    });
}
renderSearchResults()
// When the search button 
searchBtn.addEventListener("click", function(){
    const searchValue = searchText.value;
    console.log(searchValue);
    if(searchValue == " " || searchValue == null){
        alert("Please Put a value to search")
        window.location.href = `./`;
    }else{
        window.location.href = `./search.html?q=${searchValue}`;
    }
})

export {
    API_KEY,
    BASE_URL,
    fetchSearchResults, 
    getVideoStatsByID,
    getChannelInfo,
    updateSearchItemProperties,
    shortenNumber,
    shortenTimeDifference,
    renderSearchResults
}