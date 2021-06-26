var key = "$2b$10$mSiXNBsd6/8WdlalxQTSNusLxbzLtY74juvihgt5oWROjrHGs19VW"
let req = new XMLHttpRequest();
class Bin {

    /**
     * 
     * @param {String} binID 
     */
    constructor(binID, version = 1) {
        this.binID = binID + "/" + version;
    }
    read(callback) {
        try {
            req.onreadystatechange = () => {
                if (req.readyState == XMLHttpRequest.DONE) {
                    callback(JSON.parse(req.responseText));
                }
            };
            req.open("GET", "https://api.jsonbin.io/b/" + this.binID, true);
            req.setRequestHeader("secret-key", key);
            req.send();

        } catch (e) { log(e) }
    }
    create(query, callback) {
        try {
            req.onreadystatechange = () => {
                if (req.readyState == XMLHttpRequest.DONE) {
                    callback(JSON.parse(req.responseText));
                }
            };
            req.open("POST", "https://api.jsonbin.io/b/" + this.binID, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.setRequestHeader("secret-key", key);
            req.send(query);
        } catch (e) { log(e) }
    }
    update(query, callback) {
        try {
            req.onreadystatechange = () => {
                if (req.readyState == XMLHttpRequest.DONE) {
                    this.version += 1;
                    callback(JSON.parse(req.responseText));
                }
            };
            req.open("PUT", "https://api.jsonbin.io/b/" + this.binID, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.setRequestHeader("secret-key", key);
            req.send(query);
        } catch (e) { log(e) }
    }
    delete() {
        try {
            req.onreadystatechange = () => {
                if (req.readyState == XMLHttpRequest.DONE) {
                    callback(JSON.parse(req.responseText));
                }
            };
            req.open("DELETE", "https://api.jsonbin.io/b/" + this.binID, true);
            req.setRequestHeader("secret-key", key);
            req.send();
        } catch (e) { log(e) }
    }
}