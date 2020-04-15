'use strict';

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function getRandomColor(change = 0) {

    var randomColor = [
        Math.ceil(Math.random() * 255),
        Math.ceil(Math.random() * 255),
        Math.ceil(Math.random() * 255)
    ];

    for (var i = 0; i < 3; i++) {

        if (randomColor[i] + change > 255) randomColor[i] = 255;
        else if (randomColor[i] + change < 0) randomColor[i] = 0;
    }

    return "#" + componentToHex(randomColor[0]) + componentToHex(randomColor[1]) + componentToHex(randomColor[2]);
}


function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function sortByType(sortType) {

    var sortOrder = 1;
    if (sortType[0] === "-") {
        sortOrder = -1;
        sortType = sortType.substr(1);
    }

    if (sortType === 'name') {

        return function (a, b) {

            var result = (a[sortType].toLowerCase() < b[sortType].toLowerCase()) ? -1 :
                (a[sortType].toLowerCase() > b[sortType].toLowerCase()) ? 1 : 0;
            return result * sortOrder;
        }

    } else {

        return function (a, b) {

            var result = (a[sortType] < b[sortType]) ? -1 : (a[sortType] > b[sortType]) ? 1 : 0;
            return result * sortOrder;
        }
    }

}
