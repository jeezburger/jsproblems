let i = 30;
var counter = 0;

var a = setInterval(function () {

    console.log(i--);
    counter++;
    if (counter == 31) {
        clearInterval(a);
    }

}, 1 * 1000);