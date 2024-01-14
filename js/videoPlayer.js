import {
    BASE_URL,
    shortenTimeDifference,
    getVideoStatsByID,
    shortenNumber,
    getChannelInfo
} from './youtube.js'
const API_KEY = "AIzaSyDrpfaUep93bgJsBIwN3aM23NoNMsSFJfc";

// getting the search value from the url
const url = window.location.search;
const urlParams = new URLSearchParams(url);

const videoId = urlParams.get('id');

window.addEventListener('load',() =>{
    // logic for rendering the iframe on load
    if(YT){
        new YT.Player("videoPlayer",{
            height: "400",
            width: "700",
            videoId
        });
    }
    displayVideoDetails(videoId);
    getCommentsAndDisplay(videoId);
    // getRelatedVideos(videoId);
})

// getting comments based on the video ID
async function getCommentsAndDisplay(videoId){
    const url = `${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=10&part=snippet`;
    const response = await fetch(url);
    const data = await response.json();

    // console.log(data.items);
    const items = data.items;
    const resultObj = items.map((item) =>{
        return {
            authorPicture : item.snippet.topLevelComment.snippet.authorProfileImageUrl,
            autherUserName : item.snippet.topLevelComment.snippet.authorDisplayName,
            replySince : shortenTimeDifference(item.snippet.topLevelComment.snippet.publishedAt),
            comment : item.snippet.topLevelComment.snippet.textOriginal,
            commentLikes : item.snippet.topLevelComment.snippet.likeCount,
        }
    });
    resultObj.forEach(item => {
        const individualCommentContainer = document.createElement("div");
        individualCommentContainer.setAttribute("class","individualComment")
        individualCommentContainer.innerHTML = `
                <img src="${item.authorPicture}" alt="">
                <div class="commentDetail">
                    <h3 class="username" style="margin: 0px;">${item.autherUserName} | ${item.replySince}</h3>
                    <p>
                        ${item.comment}
                    </p>
                    <div class="videoStats" style="width: fit-content;">
                        <img src="./icons/like.png" alt="">
                        <span style="color: black;">${item.commentLikes}</span>
                        <img src="./icons/negative-vote.png" alt="">
                    </div> <span> reply </span>
                </div>
        `;
        const commentContainer = document.querySelector(".individualComments");
        commentContainer.appendChild(individualCommentContainer);
    });
}

async function displayVideoDetails(videoId){
    const videoObject = await getVideoStatsByID(videoId);
    const channelInfo = await getChannelInfo(videoObject.snippet.channelId)
    const descriptionContainer = document.querySelector(".videoContentDetails");
    descriptionContainer.innerHTML = `
        <h2>${videoObject.snippet.title} </h2>
        <div class="chanelDetals_Stats">
            <div class="channelDetails">
                <img src="${channelInfo.snippet.thumbnails.high.url}" alt="">
                <div class="channelStats">
                    <h4 style="margin: 0px;">${videoObject.snippet.channelTitle}</h4>
                    <p>${shortenNumber(channelInfo.statistics.subscriberCount)} Subscribers</p>
                </div>
                <a href="">Subscribe</a>
            </div>
            <div class="videoStats">
                <img src="./icons/like.png" alt="">
                <span>${shortenNumber(videoObject.statistics.likeCount)} </span>
                <img src="./icons/negative-vote.png" alt="">

            </div>
        </div>
        <div class="description" style="margin-top: 20px;">
            <p>${shortenNumber(videoObject.statistics.viewCount)} views ${shortenTimeDifference(videoObject.snippet.publishedAt)}</p>
            <p>
                ${videoObject.snippet.description}
            </p>
        </div>
    `;
    const videoplayerContainer = document.querySelector(".videoPlayerContainer");
    // console.log(videoObject);
    // console.log(channelInfo);
    videoplayerContainer.appendChild(descriptionContainer);

}
// // getting related Videos
// async function getRelatedVideos(videoId){
//     const url = `${BASE_URL}/search?part=snippet&relatedToVideoId=${videoId}&type=video&key=${API_KEY}`;
//     const response = await fetch(url);
//     const data = await response.json();

//     console.log(data);
// }