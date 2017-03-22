#### Project Title
- Bart Timer

#### Team Members
- David: Front End
- Juan: Firebase backend
- Meggin: Maps API and backend
- Tae: bart api


#### Project Description
- User Input:
    - Origin/Destination Station Names
    - Departure Time Window
    - DoW (Day of Week)
    - Estimated walking time to origin station
- Output
    - Next train arrival times (up to 3 trains total)
    - Time to leave to arrive on time
- Extra features (time allowing)
	- Walk or Drive as a default setting
	- If driving is selected, live traffic time to the origin station from Google Maps API
	- (One major caveat for driving is that the traffic time buffer does not factor in the travelling time incurred getting to/from the user's car)


#### Sketch of Final Product 
![alt tag](mockup.png)

#### API to be Used 
- Bart
	- Example: http://api.bart.gov/api/etd.aspx?cmd=etd&orig=RICH&key=MW9S-E7SL-26DU-VV8V
- Google Maps
- Firebase

####  Rough Breakdown of Tasks
- Take in user inputs
- Store user inputs and generate URL
- Load BART API data based on user input 
- Display on the generated URL
- Parse XML to JSON

#### Project presentation requirements

- Overall application's concepts
- Motivation for its development
- Our design process
- Technologies used and briefly how they work
- Demonstration of project functionality
- Directions for future development

#### Remember these!

- Functional - the app should work.
- Reliable - app should work on different devices, and maybe even basic offline usage.
- Usable - it should be obvious and easy to use.
- Emotional Design - actually thinking the emotional part could be future implementation?

#### Other Useful Resources
- https://www.getpostman.com/
- http://www.utilities-online.info/xmltojson/
