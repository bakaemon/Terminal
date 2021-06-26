
/**
 * Get array of parameters
 * @param {String} cmd 
 * @param {Number} startAt
 * @returns {Array} Array of String
 */
const getParameters = (cmd, startAt = 1) => {
    if (startAt < 0) startAt = 0;
    var para = cmd.split(" ")
    if (startAt > 0) {
        for (var i = 0; i < startAt; i++) para.shift();
    }
    return para;
}

register_cmd({
    cmd_name: "clear",
    callback: () => { clear_all_block() },
    description: "Clear terminal screen"
});
register_cmd({
    cmd_name: "user",
    callback: (cmd) => {
        var choice = getParameters(cmd)[0];
        var username = getParameters(cmd)[1];
        var password = getParameters(cmd)[2];
        var bin = new Bin("60d6a64f5ed58625fd196d67", 3);
        switch (choice) {
            case "login":
                if (!username || !password) return block_log("ERROR: Must pass either username or password!");
                try {
                    bin.read((res) => {
                        var user = res.users;
                        for (var u of user) {
                            if (u.username == username && u.password == password) {
                                update_user_title(u.username, getUA());
                                return block_log("Logged in as " + u.username);
                            }
                        }
                        block_log("ERROR: Cannot log in to <i>" + username + "</i>!")
                    });
                } catch (e) { block_log(e) }
                break;
            case "register":
                if (!username || !password) return block_log("ERROR: Must pass either username or password!");
                try {
                    bin.read((res) => {
                        var user = res.users
                        for (var u of user) {
                            if (u.username == username && u.password == password) {
                                return block_log("User has already been existed");
                            }
                        }
                        res.users.push({ "username": username, "password": password })
                        bin.update(JSON.stringify(res), (result) => {
                            if (result.success) block_log("User " + username + " has been updated.");
                            else block_log(result.message)
                        })
    
                    });
                } catch (e) { block_log(e) }
                break;
            case "list":
                try {
                    bin.read((res) => {
                        var user = res.users
                        var str = ""
                        for (var u of user) {
                            str += "--" + u.username + "\n";
                        }
                        block_log("List of available user: \n\n" + str)
                    });
                } catch (e) {
                    block_log(e);
                }
        }
    }, 
    description: "Perform login or register user."
});
register_cmd({
    cmd_name: "sum",
    callback: (cmd) => {
        var parameters = getParameters(cmd);
        try {
            var sum = (numbers) => {
                var total = 0;
                for (var x of numbers) total += parseInt(x);
                return total;
            }
            block_log(sum(parameters))
        } catch (e) { block_log(e); }
    },
    description: "Get sum of numbers"
});

register_cmd({
    cmd_name: "wiki",
    callback: (cmd) => {
        var choice = getParameters(cmd)[0];
        try {
            switch (choice) {
                case "read":
                    readWiki(getParameters(cmd, 2).join(), (result) => {
                        var pages = result["query"]["pages"];
                        for (var k in pages) {
                            if (pages.hasOwnProperty(k)) {
                                block_log("Wikipedia article of <b>" + pages[k].title + "</b>\n" + pages[k]["extract"]);
                            }
                        }
                    });
                    break;
                case "search":
    
                    break;
            }
        } catch (e) { block_log(e); }
    },
    description: "Look up or search wikipedia."
})

register_cmd({
    cmd_name: "weather",
    callback: (cmd) => {
        var city = getParameters(cmd).join(" ");
        const apikey = "043fe41560ba98d3eeb53597c52def13";
        const url = "http://api.openweathermap.org/data/2.5/weather?";
        $.ajax({
            url: url + "appid=" + apikey + "&q=" + city,
            method: "get",
            success: (x) => {
                var timezone = x.timezone / 3600;
                var y = x.main;
                var temperature = y.temp - 273.15;
                var pressure = y.pressure;
                var humidity = y.humidity;
                var z = x.weather;
                console.log(x)
                var description = z[0].description;
                block_log(
                    `Weather data of ${city} (GMT ${timezone}):\n\n`
                    + `Temperature: ${temperature} degree Celcius\n`
                    + `Pressure: ${pressure} mmHg\n`
                    + `Humidity: ${humidity}%\n`
                    + `Description: ${description}\n`)
            },
            error: (res, options, err)=> {
                block_log(`${res.status} ERROR: ${err}`)
            }
        })
    },
    description: "Fetch Weather details on OpenWeatherMap."
})
