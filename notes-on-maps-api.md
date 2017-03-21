## Notes on Maps API
These notes cover how to approach the implementation of Maps API in the bart-on-time app. They are structured according to model, view and controller (data, UI, and functions).

The basic gist is that we want to read in the user's location using geolocation.
And we want to read in the the user's desired BART station.

Using both the origin and destination, we will calculate commute time using specifically the
[Google Maps Distance Matrix API](https://developers.google.com/maps/documentation/javascript/distancematrix).

This API returns distance and time from an origin to a destination based,
and defaults to current time for estimations.

We will populate the 'AVG walking time to station' and the 'Current traffic to station'
based on calling this API for both walking and driving travel modes.

Also, based on user's selection, be it walking or driving,
the time to the station will also be used in-line with API results,
to calculate when the user should leave to make the next train.

A final note-- the current project designs include an input field
for users to say how long it takes to walk to a station.
Let's revisit this, with the thought of returning walking times without the user having to guess.

### Model

The two main data points are the user's location and the user's desired BART station destination.

We may want to store the lat/long location of each BART station in Firebase.

### View

The user selected whether they are walking or driving.
This will determine the default value returned by Distance Matrix
to be used in calculation of when the user should leave.

But we also will report both the avg walking time,
and the current traffic time, in the UI, so both walking and driving travel options need to be called.

One suggestion to remove in our designs the user input of walking time.
It might be nice to just use the Distance Matrix API for both walking and driving options.
But good to have that placeholder for now, in case something goes wrong with API.

### Controller

We need functions to figure out:

* User's current location
* Time to station based on user's location, selected station, and travel mode.

(The same function that determines time can be called for walking and driving.)

### Questions

1. So one of the requirements is to not use alerts; however, I believe Google Maps API uses this to confirm it is OK to read user's location. Is this an alert that's OK, or is there some sort of work-around for this, that I should be using?

2. One of the presentation items is to cover future ideas. Under maps category, we may want to talk about incorporating walking/driving directions into the project at some point in the future.

3. Another future idea would be for a user to select travel times based on different departure times than just now. In other words, the night before I'm catching Bart, I can enter in a desired leave time for the morning, and that will give me estimates on drive times. I can select different desired leave times to get different train times.


