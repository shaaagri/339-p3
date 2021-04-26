/*
    ************************************
    | P3 Portfolio JS Code             |
    | IAT 339 / Spring 2021            |
    | Grigory Gogin                    |
    ====================================
*/


// apply a proper css class to a button depending on its text width
$('.button-action, .button-default').each(function (index) {
    let textWidth = $(this).text().length;

    if (textWidth <= 6) {
        $(this).addClass('short');
    }
    else if (textWidth <= 9) {
        $(this).addClass('med');
    }
    else {
        $(this).addClass('long');
    }
});


// reduces h2 margins when it is followed by a paragraph (looks better)
$('h2').each(function (index) {
    if ($(this).next().is('p')) {
        $(this).addClass('reduced');
    }
});

// reduces examples margins in process pages when they are the last ones in a
// section (looks better)
$('.example-block, .example-block-video').each(function (index) {
    if ($(this).next().length == 0) {
        $(this).addClass('reduced');
    }
});


// background animation (icons popping in/out randomly)

// Articles used:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
// https://www.w3schools.com/jsref/met_win_setinterval.asp
// https://api.jquery.com/append/
// https://stackoverflow.com/questions/40710283/jquery-detect-animation-end-of-animate-css
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
// https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
// https://stackoverflow.com/questions/5911211/settimeout-inside-javascript-class-using-this

class BgAnimationIcon {
    id;

    constructor(x, y) {
        this.id = Math.round(Math.random() * 1.0e10);
        let rot = Math.floor(Math.random() * 4);
        let icon = Math.floor(Math.random() * 11);
        //console.log(this.id, this.x, this.y, rot, icon);

        $("#bg-anim-container").append("<div id='" + this.id + "'class='bg-anim__icon'><div class='bg-anim__icon-rotate'><div class='bg-anim__icon-" + icon + "'></div></div></div>");

        $('#' + this.id).css('left', x);
        $('#' + this.id).css('top', y);

        // popping the new icons unevenly to make the background more interesting
        let delay = Math.random() * 10;
        $('#' + this.id).css('animation-delay', delay + 's');

        switch (rot) {
            case 1:
                $('#' + this.id + ' .bg-anim__icon-rotate').addClass('deg90');
                break;
            case 2:
                $('#' + this.id + ' .bg-anim__icon-rotate').addClass('deg180');
                break;
            case 3:
                $('#' + this.id + ' .bg-anim__icon-rotate').addClass('deg270');
                break;
        }

        $('#' + this.id).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
            $(this).addClass('popped');
        });
    }
}

class BgAnimation {
    maxIcons = 100;
    icons = [];
    spacing = 280.0;  // icons spacing radius
    updateRate = 5.0;  // times per second

    constructor(updateRate) {
        this.updateRate = updateRate;
    }

    start() {
        this.interval = setInterval(this.update.bind(this), 1000 / this.updateRate);
    }

    update() {
        if (this.icons.length < this.maxIcons) {
            // generating random position for the next icon
            let iconX = Math.round(Math.random() * document.body.clientWidth);
            let iconY = Math.round(Math.random() * document.body.clientHeight);

            // checking the position
            let validPos = true;
            this.icons.forEach(icon => {
                let anotherIconX = parseInt($('#' + icon.id).css('left'));
                let anotherIconY = parseInt($('#' + icon.id).css('top'));
                let dist = Math.hypot(iconX - anotherIconX, iconY - anotherIconY);

                // if the new icon got too close to one of the existing ones,
                // skip and try our luck during the next cycle
                if (dist < bgAnim.spacing) {
                    validPos = false;
                    return;
                }
            });

            if (validPos) {
                this.icons.push(new BgAnimationIcon(iconX, iconY));
            }
        }

        this.icons.forEach(icon => {
            if ($('#' + icon.id).hasClass('popped')) {
                // removing popped icons
                this.icons.splice(this.icons.indexOf(icon), 1);
            }
        });
    }
}

var bgAnim = new BgAnimation();
bgAnim.start();