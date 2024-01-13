const API_KEY = "AIzaSyDZJj_xwYpR_lxElA_WNcmiAARZRWjUZkk"
const BASE_URL = "https://www.googleapis.com/youtube/v3"

// fetching using a search keyword
async function fetchVideo(searchQuery){
    const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=10&part=snippet`);
    const data = await response.json();
    console.log(data.items.length);
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
        Statistics: data.items[0].statistics,
        VideoContent: data.items[0].contentDetails
    };
}
console.log(getVideoStatsByID("CY1xcC6Nqgo"))
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
    

    return data.items[0].statistics;
}

// // getVideoStats("Rd4a1X3B61w")
// getChannelLogo("UCYgL81lc7DOLNhnel1_J6Vg").then(data=>{
//     console.log(data)
// })
// console.log(getChannelLogo("UCYgL81lc7DOLNhnel1_J6Vg"))
// // getChannelInfo("UCYgL81lc7DOLNhnel1_J6Vg")
async function fetchVideo1(){
    const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&maxResults=30&part=snippet`);
    const data = await response.json();

    data.items.forEach(VideoObj => {
        const res = {};
        res.VideoID = VideoObj.id.videoId;
        res.channelId = VideoObj.snippet.channelId;
        res.channelTitle = VideoObj.snippet.channelTitle;
        res.videoThumbnail = VideoObj.snippet.thumbnails.high.url;
        res.publishedAt = VideoObj.snippet.publishedAt;
        res.VideoTitle = VideoObj.snippet.title;

        getChannelInfo(res.channelId).then(data => {
            res.Channelsubscribers = data.subscriberCount;
            // console.log(data)
        });
        getChannelLogo(res.channelId).then(data =>{
            res.channellogo = data;
        });
        getVideoStats(res.VideoID).then(data =>{
            res.views = data.viewCount;
        })

        console.log(res)
    });
    // console.log(data.items)
    // const videoThumbnail = data.items[4].snippet.thumbnails.high.url;
    // const videoId = 
    // console.log();
}

// fetchVideo1();