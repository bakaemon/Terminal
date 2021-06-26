function smart_split(input, del, empty_space) {
    if (input.length === 0) return input;
    var outputs = [""];

    var compare = function(base, insert, position) {
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

function update_user_title(title) {
    terminal_user_title = title;
    document.getElementById("input_title").innerText = terminal_user_title + "@default $ ";
}

update_user_title(terminal_user_title);

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
    current_block.innerHTML += "<p style='white-space:pre-wrap; '>" + message + "</p>";
}
/**
 * Default function display message to terminal screen
 * @param {String} message 
 */
function log(message) {
    var wrapper = document.getElementById('wrapper');
    wrapper.innerHTML += "<div class='log'><p>" + message + "</p></div>";
}

document.getElementById('input_source').onblur = function() {
    document.getElementById("input_source").focus();
};

document.getElementById('input_source').addEventListener('keyup', submit_command);

var registry = new Map();

/**
 * Register command to registry.
 * @param {String} cmd_name 
 * @param {Function} callback
 */
function register_cmd(cmd_name, callback) {
    registry.set(cmd_name.toString().toUpperCase(), callback);
}

function submit_command() {
    event.preventDefault();
    if (!(event.keyCode === 13)) return;
    var command = document.getElementById("input_source").value;
    document.getElementById("input_source").value = "";

    new_block();
    block_log(terminal_user_title + " # " + "<a id='inputted'>" + command + "</p>");

    if (registry.has(command.split(" ")[0].toUpperCase())) {
        registry.get(command.split(" ")[0].toUpperCase())(command);
    } else {
        block_log("'" + command.split(" ")[0].toUpperCase() + "' is not a registered command, please use # help command for listing available commands.");
    }
}

register_cmd("help", function(cmd) {
    block_log("Registry Command List: ");
    registry.forEach(function(value, key, map) {
        block_log("    - " + key);
    });
});


