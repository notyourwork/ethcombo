// ==UserScript==
// @name         Slot player - ETH
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  auto play ethcombo.com slot machine
// @author       Chris
// @match        https://ethcombo.com/home.php*
// @match        http://ethcombo.com/home.php*
// @grant        none
//
// 0x7BD5Db16a02be68082e039C90B9aBeB227da5236 http://ethcombo.com/?i=72251
// 0x8b7653eC63E1D3366e1219CB05DA833ED1267e23 http://ethcombo.com/?i=145858
//
// ==/UserScript==

(function() {
    'use strict';

    var stats = {
        totalRounds: 0,
        startingBalance: 0,
        startTime : new Date()
    };

    // Play the Game!!!!
    console.log("Loading player...👋");
    setTimeout(function(){
        stats.startingBalance = parseFloat($("#balance").text());
        play();
    }, 1000);

    // Main game player
    // play round if spins available, otherwise sleep until we get move
    // Recursive loop setTimeout drives the synchronous execution
    function play() {
        console.log("Ready to play game 🎲");
        (function gameLoop() {
            // check and claim Daily bonus

            // claim available tokens (if any)
            if( $($('#requestdaily')[0]).is(":visible") ) {
                console.log("Tokens available, claiming by clicking #requestdaily");
                $('#requestdaily')[0].click();
            }

            if( getSpinAllowance() > 0 ) {
                playRound();
            } else {
                // set max on delay and consider refreshing page
                // this way if more tokens were given to account due to
                // invite referrals they can be claimed
                var roundSleep = convertTimeToMs($('#countdown_time').text());
                if ( roundSleep > 0 ) {
                    console.log("Waiting for next round. Sleeping for " + roundSleep + "ms 💤");
                    setTimeout(function() {
                        gameLoop();
                    }, roundSleep);
                }
            }
        }());
    }

    // play round of available spins
    function playRound() {
        (function loop() {
            console.log("Playing round");
            if( getSpinAllowance() > 0 ) {
                var rand = getDelay();
                console.log("sleep " + rand + "ms 💤");
                setTimeout(function() {
                    stats.totalRounds++;
                    spinWheel();
                    loop();  // recurse back up to spin again
                }, rand);
            } else {
                play();
            }
        }());
    }

    // spin the wheel
    function spinWheel() {
        console.log("[🎲" + stats.totalRounds + " ] spinning 𐃏 " + new Date());
        $('input').click();

        var spinDuration = 3000;  // how long does a spin take ?
        setTimeout(function() {
            // if treasure is shown, let's claim it arrhhh matey
            if( $('.allchests').is(":visible") ) {
                console.log("Claim treasure 🔑")
                var randomChestIndex = getRandomInInterval(0,2);
                var chest = $('.allchests').children()[randomChestIndex];
                var chestAnchor = $(chest).children()[0];
                $(chestAnchor).click();
            }
            var earned = parseFloat($("#balance").text()) - stats.startingBalance;
            console.log("Spins left = " + getSpinAllowance() + " Earned = " + earned + " Balance = " + $("#balance").text() + " ETH");
        }, spinDuration);
    }

    // how many spins are available ???
    function getSpinAllowance(){
        var parentDiv = $('input#playFancy').parent().find('div.row').children()[1];
        var childDiv = $(parentDiv).children()[0];
        var allowanceText = $(childDiv).find('span').text();
        return parseInt(allowanceText);
    }

    // calculate random delay between min and max to wait before next spin
    // get random number between 2400 and 3200
    function getDelay() {
        var minDelay = 2400;
        var maxDelay = 3200;
        return getRandomInInterval(minDelay, maxDelay);
    }

    function getRandomInInterval(min, max) {
        return Math.floor(Math.random()*(max - min + 1) + min);
    }

    //convert time left until more tokens into milliseconds
    // convertTimeToMs( hh:mm:ss ) --> x (where x is time in milliseconds)
    function convertTimeToMs(timeString) {
        var hoursLeft = parseInt(timeString.substring(0,2));
        var minutesLeft = parseInt(timeString.substring(3,5));
        var secondsLeft = parseInt(timeString.substring(7,9));
        return ( hoursLeft * 60 * 60 * 1000) + ( minutesLeft * 60 * 1000) + ( secondsLeft * 1000);
    }
})();
