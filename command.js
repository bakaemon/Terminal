function greeting() {
    block_log("Welcome to deepfake terminal!")
    readFile("logo.txt", (txt) => { block_log(txt) })
}
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
    callback: () => { clear_all_block(); greeting(); },
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
                                block_log("Wikipedia article of <b>" + pages[k].title + "</b>\n");
                                block_log(pages[k]["extract"] || "No data found.")
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
        const url = "https://api.openweathermap.org/data/2.5/weather?";
        try {
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
                    var description = z[0].description;
                    block_log(
                        `Weather data of ${city} (GMT ${timezone}):\n\n`
                        + `Temperature: ${temperature} degree Celcius\n`
                        + `Pressure: ${pressure} mmHg\n`
                        + `Humidity: ${humidity}%\n`
                        + `Description: ${description}\n`)
                },
                error: (res, options, err) => {
                    block_log(`${res.status} ERROR: ${err}`)
                }
            })
        } catch (e) { block_log(e) }
    },
    description: "Fetch Weather details on OpenWeatherMap."
});
register_cmd({
    cmd_name: "quiz",
    description: "Get fun quiz to solve.",
    usage: "quiz [OPTIONAL-type] [OPTIONAL-difficulty]\n\n" +
        "[type] -   multiple, boolean\n" +
        "[difficulty]   -   easy, medium, hard\n",
    callback: (cmd) => {
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        var message = block_log("Loading...");
        var type = getParameters(cmd)[0] || "";
        var diff = getParameters(cmd)[1] || "";
        $.ajax({
            url: "https://opentdb.com/api.php?amount=1&type=" + type + "&difficulty=",
            success: (res) => {
                var x = res.results[0];
                var category = x.category;
                var difficulty = x.difficulty;
                var question_type = x.type;
                var question = x.question;
                var ans1 = x.incorrect_answers;
                ans1.push(x.correct_answer);
                var answers = ans1;
                shuffle(answers)
                var msg = `Category: ${category} || Difficulty: ${difficulty} || Type: ${question_type}\n\n` +
                    `${question}\n`
                var promptMsg = "";
                var answer_id = [...Array(answers.length).keys()]
                var ids = (answer_id.map(x => "#" + x)).join(", ")
                for (var y of answer_id) {
                    promptMsg += ` <span id='${y}'>[${answers[y]}]</span> `
                }
                msg += promptMsg
                message.innerHTML = msg;
                $(ids).click((e) => {
                    var userAnswer = (answers[parseInt(e.target.id)] == x.correct_answer) ? true : false;
                    if (userAnswer) message.innerHTML = msg.replace(promptMsg, "\n<p style='color:#7FFF00'>Congratulations! You are correct!</p>");
                    else message.innerHTML = msg.replace(promptMsg, "\n<p style='color:#DC143C'>The answer is " + x.correct_answer + ", try again next time.</p>");
                })
            }
        })
    }
});
register_cmd({
    cmd_name: "test",
    callback: (cmd) => {
        var msg = block_log("Choose either" +
            "")

        $("#yes, #no").click((e) => {
            msg.innerText = e.target.id;
        });
    },
    description: "test"
})
