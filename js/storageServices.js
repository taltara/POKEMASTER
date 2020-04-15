'use strict';

function saveToStorage(KEY, val) {
    localStorage.setItem(KEY, JSON.stringify(val));
    // console.log(loadFromStorage(KEY));
    
}

function loadFromStorage(KEY) {
    var val = localStorage.getItem(KEY);
    // console.log(JSON.parse(val));
    return JSON.parse(val);
}

