import {
    BASE_URL,
    shortenTimeDifference
} from './youtube.js'
const API_KEY = "AIzaSyA30_P0lt18q6mKdI3q4gwC9bqMA1q29uk"

window.addEventListener('load',() =>{
    // logic for rendering the iframe on load
    let videoId = "r7COWvxlN5g";
    if(YT){
        new YT.Player("videoPlayer",{
            height: "400",
            width: "700",
            videoId
        });
    }
    getComments(videoId);
})

async function getComments(videoId){
    const url = `${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=10&part=snippet`;
    const response = await fetch(url);
    const data = await response.json();

    console.log(data.items);
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