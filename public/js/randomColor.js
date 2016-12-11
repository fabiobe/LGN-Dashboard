/**
 * Created by fabio on 20.11.2016.
 */

let upperColors = ['#733D9A', '#D64541'];
let lowerColors = ['#8245AD', '#EF4836'];
let hoverColors = ['#7424ad', '#C0392B'];
let activeColors = ['#7c2fad', '#EC644B'];

let randomNumber = 0;

function random() {
    randomNumber = Math.floor(Math.random() * ((upperColors.length + lowerColors.length) / 2));
}

function getUpperColor() {

    return upperColors[randomNumber];

}

function getLowerColor() {

    return lowerColors[randomNumber];

}

function getHoverColor() {

    return hoverColors[randomNumber];

}

function getActiveColor() {

    return activeColors[randomNumber];

}