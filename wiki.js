function readWiki(title, callback) {
    fetch("https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&explaintext&format=json&titles=" + title)
        .then(data => data.json())
        .then((data) => {
            callback(data)
        }).catch((e) => block_log(e));
}
function searchWiki(query, callback) {
    fetch("https://en.wikipedia.org/w/api.php?action=opensearch&search=" + query)
        .then(data => {
            var result = { topic: data[0], titles: data[1], links: data[3] }
            callback(result)
        }).catch((e) => block_log(e));
}