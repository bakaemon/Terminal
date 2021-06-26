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
    
})
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

