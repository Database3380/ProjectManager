var timestamp = function () {
    return new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', hour12: false }) + ' CST';
}


module.exports = timestamp;