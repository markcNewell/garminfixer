
# Garmin Ride/Run Fixer #

## Introduction ##
A small web application to fix errors in the latitude and longitude values for garmin files.
File types supported for input:
- `.fit`
- `.gpx`

File types supported for output:
- `.gpx`
- More coming

## What is it for? ##
For example when you stop your garmin for a cafe stop but forget to restart it. You can't be loosing out on those precious miles when uploaded to Strava. 
Hence, this web app has been made for you to load in files from your garmin and correct them before exporting and loading into Strava for the world to see.

## Demo ##
<a>https://markcnewell.github.io/garminfixer/#/</a>

## How to use? ##
- Load in your activity file.
- See your activity displayed on the map. The error should be obvious as it will be a straight line coloured in blue.
- Click on the line to create new intermediate nodes.
- Drag these intermediate nodes around to the route you actually took.
- Save the resulting activity.
- Load into Strava.

## For Dev ##
- Clone into repository.
- Get packages `npm install`.
- Start local server `npm start`.
- Watch the magic at work.
