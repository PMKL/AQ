Air Quality Web App
===================


>Due: Nov 7 by 3:25pm
>Points: 75
>Submission: Website url

 
Task
===================
  For this project, you will create a single page application about air quality. You will use at least 2 external APIs to retrieve data from (Leaflet), and the Open AQ Platform). Your application should be interactive, responsive, and allow a user to investigate air quality from various geographical regions. This project will also incorporate Vue JS as a framework to make building the app simpler. You will also create a second web page - "About the project", which will document your team, your development process, demo the final application. For this project, you are free to use other JavaScript or CSS libraries as you see fit.

About the Data Sets
===================

**Leaflet**:
  The Leaflet API allows you to render interactive maps in your web page as well as overlay data on top of the map. The map can be modified either by user interaction or by JavaScript commands.
  
**Open AQ Platform**:
  The Open AQ Platform maintains a rolling 90 day historical data set of air quality measures (i.e. everything from today back until 90 days ago). The data set includes information about locations where measurements exist (and how many measurements were taken), measurements of different particles in the air (carbon monoxide, sulfur dioxide, etc.), and timestamps for when measurements were taken.

Grading Rubric (75 pts)
===================

**To earn 55/75 points (grade: C)**
  * | **3 / 3** | **Show a map** using the Leaflet API
    1. Pan and zoom available with mouse click-and-drag and scroll wheel interaction 
    2. Have an input box for a user to type a location (lat/long coordinates)
      * Map should update when location is entered
      * Input box text should update with new location (lat/long coordinates) when map is panned
    3. Draw markers on the map at the location of each measurement
      * Create a popup with actual measurement data when hovering over a marker
  * | **2 / 2** | **Populate** a table with most up-to-date air quality measurements (from the Open AQ Platform API)
    * Table should automatically update data based on location shown in map
      * Should account for both center and zoom level
  * | **2 / 3**| Create an "**About the Project**" page
    1. Short bio about each team member (including a photo)
    2. Description of the tools (frameworks, APIs, etc.) you used to create the application
    3. Video demo of the application (2 - 4 minutes)
      * Can natively embed or upload to YouTube and embed
	  
***NOTE***: 

It is best to trigger updates at the **end of user interaction**. Otherwise, continuous requests will be sent and could flood the Open AQ Platform servers, which would slow down your app. Perhaps trigger update after a 200ms timeout with no user activity (pan / zoom).

**+ 4 additional points for each item completed on the list below**

  * | **2 / 3**| Create **UI controls** to filter data
    1. Filter based on particle type
    2. Filter based on measurement values for each particle type (e.g. only show co > 1.3, ammonia > 72.9, ...)
    3. Allow historical data to be retrieved (select a date/time within the last 90 days)
	
  * | **2 / 2** | Use Location IQ API (https://locationiq.com/) to search via place name in addition to lat/long coordinates
    * Also update search box location to location name when panning the map
	
  * | **3 / 3** | Style the background color of particle values in the table so they match the Air Quality Index from the EPA
    1. https://airnowtest.epa.gov/sites/default/files/2018-09/aqi-technical-assistance-document-sept-2018_0.pdf  (colors - page 2, values - page 4)
    2. If levels of one or more particle are "Unhealthy for Sensitive Groups" (orange), add a banner with the AQI descriptor (page 2)
    3. Also include a legend for the colors

  * Add option for showing a heatmap visualization overlay on the map when only one particle type selected
    1. Color should represent the measurement value
    2. Include an easy-to-read legend
    3. Do **NOT** use a rainbow color scale
    4. See Leaflet plugin: https://github.com/Leaflet/Leaflet.heat
	
	
  * | **1 / 1** | Allow map (along with the location input box) to go **fullscreen**

Submission
===================
  You will be working in groups of 2 students to complete this project. You are allowed to work together on all aspects of the project or to divide tasks equally among the members. You are NOT however allowed to collaborate with students from other teams. The only exception to this is posting general questions/answers to the discussion board on Canvas.
  Code should be saved in a private repository on GitHub while working on the project. You should make the repository public on the date the project is due. Your code can be turned into a live web site by following the instructions at https://help.github.com/articles/user-organization-and-project-pages/#project-pages. In order to submit, you should enter the the project's URL for the assignment (in Canvas). After submitting, add a comment describing what you did and what your partner did to contribute to the overall project.
