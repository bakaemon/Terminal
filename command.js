/**
 * Get array of parameters
 * @param {String} cmd 
 * @param {Number} startAt
 * @returns {Array} Array of String
 */
const getParameters = (cmd, startAt = 1) => {
    if (startAt < 1) startAt = 1;
    var para = cmd.split(" ")
    for (var i = 0; i < startAt; i++) para.shift();
    return para;
}

register_cmd("clear", () => {
    clear_all_block();
});
register_cmd("login", (cmd) => {
    var username = getParameters(cmd)[0];
    var password = getParameters(cmd)[1];

    if (!username || !password) return block_log("ERROR: Must pass either username or password!");
    var bin = new Bin("60d6a64f5ed58625fd196d67");
    try {
        bin.read((res) => {
            var user = res.users;
            for (var u of user) {
                if (u.username == username && u.password == password) {
                    update_user_title(u.username);
                    return block_log("Logged in as " + u.username);
                }
            }
            block_log("Can not logged in.")
        });
    } catch (e) { block_log(e) }
});
register_cmd("sum", (cmd) => {
    var parameters = getParameters(cmd);
    try {
        var sum = (numbers) => {
            var total = 0;
            for (var x of numbers) total += parseInt(x);
            return total;
        }
        block_log(sum(parameters))
    } catch (e) { block_log(e); }
});

register_cmd("wiki", (cmd) => {
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
})

