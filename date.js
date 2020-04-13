//jshint esversion: 6
module.exports = new GetDay();

    function GetDay() {
        //res.render('index', {title: "Home"});
        const today = new Date();

        // const weekday = new Array(7);
        // weekday[0] = "Sunday";
        // weekday[1] = "Monday";
        // weekday[2] = "Tuesday";
        // weekday[3] = "Wednesday";
        // weekday[4] = "Thursday";
        // weekday[5] = "Friday";
        // weekday[6] = "Saturday";

        //const day = weekday[today.getDay()]; 
        //res.render("index",{ day : day});
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        };// options to pass to the toLocale method
        this.date = today.toLocaleString("us-En", options);
        this.day = today.toLocaleString("us-En", {weekday: 'long'});
    }
