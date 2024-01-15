# YOUTUBE CLONE USING YOUTUBE API V3
## This projects uses Google's Youtube V3 API to fetch videos, search and comments and display them on a custom developed YouTube clone site

By Expoloring the functionalities of the Google's YouTube V3 API using Javascript, i was able to fetch videos and search for videos, for each video i pulled information about the video including
comments, descriptions and the video player using the YT Class from Google. This Project has three pages, the home page with random videos, them search result page which shows while searching and 
the video player page that contains the player and comments based on the video displayed.

The HTML template was developed customary and can be customised to fit your personal designs and preference.

### Take a Look

## How to Run The Project 
In order to run this project on your local machine
* Create a directory to host the project ```mkdir folderName```
* Enter into your directory ```cd folderName```
* Clone the responsitory by running ```git clone ```
* Create a project in Google cloud console ```https://console.cloud.google.com/```
* Click API and Services under the created project
* Enable API and Services and search for ```YouTube Data API V3```
* Enable the API and Create credentials,
* Under credentials select public data and click next to get the API KEY
* Update the API KEY in the code with your own generated API
* You can either run on live server or run directly by copying the file path to the browser.

## Known Issues
Since Google discontinued the relatedVideoId paramenters in their search list, this project doesnot fetch related videos to a video of interest and am working on that.
