var inputObject = {
    history: []
}
var indexHistory = inputObject.history.length - 1;
var registry = new Object();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function recordToHistory(command) {
    if (inputObject.history.length < 20) inputObject.history.push(command);
    else {
        inputObject.history.shift();
        inputObject.history.push(command);
    }
}
function smart_split(input, del, empty_space) {
    if (input.length === 0) return input;
    var outputs = [""];

    var compare = function (base, insert, position) {
        if ((position + insert.length) > base.length) return false;
        for (var i = 0; i < insert.length; i++) {
            if (!(base.charAt(position + i) === insert.charAt(i))) return false;
        }
        return true;
    };

    var quotes = false;
    for (var i = 0; i < input.length; i++) {
        var char = input.charAt(i);
        if (char === '"') {
            quotes = !quotes;
            continue;
        }

        if (!quotes && compare(input, del, i)) {
            outputs.push("");
            i += del.length - 1;
            continue;
        }

        outputs[outputs.length - 1] += char;
    }

    if (!empty_space) {
        for (var i = 0; i < outputs.length; i++) {
            if (outputs[i] === "") {
                outputs.splice(i, 1);
            }
        }
    }

    return outputs;
}

var terminal_user_title = "guest";
var terminal_user_client = "default"
var clientID = "<a style='color:#DC143C'>" + terminal_user_title + "</a>" + "@" + "<a style='color:#7FFF00'>" + terminal_user_client + "</a>" + " $ ";
function update_user_title(title, client) {
    terminal_user_title = title;
    terminal_user_client = client;
    clientID = "<a style='color:#DC143C'>" + terminal_user_title + "</a>" + "@" + "<a style='color:#7FFF00'>" + terminal_user_client + "</a>" + " $ ";
    document.getElementById("input_title").innerHTML = clientID;
}

update_user_title(terminal_user_title, terminal_user_client);

var current_block;

function new_block() {
    var wrapper = document.getElementById('wrapper');
    current_block = document.createElement("div");
    current_block.classList.add("log");
    wrapper.appendChild(current_block);
}
function clear_all_block() {
    var wrapper = document.getElementById('wrapper');
    wrapper.textContent = ''
}
/**
 * Display message to terminal screen
 * @param {String} message 
 */
function block_log(message) {
    var randid = String(getRandomInt(1, 1000))
    current_block.innerHTML += "<p style='white-space:pre-wrap; ' id=" + randid + ">" + message + "</p>";
    return $("p#" + randid)
}
/**
 * Default function display message to terminal screen
 * @param {String} message 
 */
function log(message) {
    var wrapper = document.getElementById('wrapper');
    wrapper.innerHTML += "<div class='log'><p>" + message + "</p></div>";
}

document.getElementById('input_source').onblur = function () {
    document.getElementById("input_source").focus();
};

$("#input_source").keyup(() => {
    var command = document.getElementById("input_source").value;
    submit_command((command) => {
        var base = command.split(" ")[0]
        if (registry.hasOwnProperty(base)) {
            registry[base].load(command);
        } else {
            block_log("'" + base + "' is not a registered command, please use 'help' command for listing available commands.");
        }
    }, clientID + "<a id='inputted'>" + command + "</p>")
});


/**
 * Register command to registry.
 */
function register_cmd(cmd = { cmd_name: null, callback: null, description: "", usage: null }) {
    if (!cmd.cmd_name || !cmd.callback || !cmd.description) throw Error("Property must not be null.")
    if (!cmd.usage) cmd.usage = cmd.cmd_name + " PARAMS"
    registry[cmd.cmd_name] = {
        load: cmd.callback,
        description: cmd.description,
        usage: cmd.usage
    }

}
function submit_command(handler,
    message = "") {
    event.preventDefault();
    if (!(event.keyCode === 13)) return;
    var command = document.getElementById("input_source").value;
    if (command) {
        recordToHistory(command)
        document.getElementById("input_source").value = "";
        new_block();
        block_log(message);
        handler(command);
    }
}

register_cmd({
    cmd_name: "help",
    callback: (cmd) => {
        if (getParameters(cmd).length == 0) {
            block_log("Registry Command List: ");
            for (let key in registry) block_log("    - " + key + " - " + registry[key].description);
        } else {
            var command = getParameters(cmd)[0];
            if (!registry.hasOwnProperty(command))
                return block_log("Command " + command + " is not registered in registry, please use 'help' to show available commands.");
            block_log("USAGE: \n    - " + registry[command].usage + "\nDESCRIPTION: \n    - " + registry[command].description)
        }
    },
    description: "Show all available commands and their descriptions",
    usage: "help [COMMAND]"
});
const getUA = () => {
    let device = "Unknown";
    const ua = {
        "Generic Linux": /Linux/i,
        "Android": /Android/i,
        "BlackBerry": /BlackBerry/i,
        "Bluebird": /EF500/i,
        "Chrome OS": /CrOS/i,
        "Datalogic": /DL-AXIS/i,
        "Honeywell": /CT50/i,
        "iPad": /iPad/i,
        "iPhone": /iPhone/i,
        "iPod": /iPod/i,
        "macOS": /Macintosh/i,
        "Windows": /IEMobile|Windows/i,
        "Zebra": /TC70|TC55/i,
    }
    Object.keys(ua).map(v => navigator.userAgent.match(ua[v]) && (device = v));
    return device;
}


