import {
    API_KEY
} from './youtube.js'

window.addEventListener('load',() =>{
    // logic for rendering the iframe on load
    let videoId = "Ga47-p9M1Ec";
    if(YT){
        new YT.Player("videoPlayer",{
            height: "400",
            width: "700",
            videoId
        });
    }
})