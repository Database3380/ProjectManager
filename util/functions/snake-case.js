function snakeCase(string) {
    return string.split(/(?=[A-Z])/).map(section => section.toLowerCase()).join('_');
}


module.exports = snakeCase;