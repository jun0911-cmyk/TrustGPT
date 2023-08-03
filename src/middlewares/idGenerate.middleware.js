module.exports = function idGenerator(id) {
    const idArray = id.split("-");

    let id = "";

    for (let i = 0; i <= idArray.length; i++) {
        id += idArray[i];
    }

    return id;
}