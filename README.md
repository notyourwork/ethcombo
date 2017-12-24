# Ethcombo Slots Player 🎰

Ethcombo will earn you free ETH ([etherum](https://www.ethereum.org/)) by automatically playing the [ethcombo.com](http://ethcombo.com) slot machine. Enter your wallet address, run the script and kick back while the free money comes in!

![Demo](https://raw.githubusercontent.com/notyourwork/ethcombo/master/ethcombo-player.gif)


# How does it work? 🔧

ETHCombo Slots player is a tampermonkey script that automatically spins the slot machine, claims treasure (if granted), and will wait until new spins are added to account to maximize plays per time period. 

Fire up your browser, goto bed and wake up with free money! 

**Who doesn't like free money, right? 💰**

# Installation 💿

1. Install [Google chrome](https://www.google.com/chrome/browser/desktop/index.html)
2. Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) browser extension
3. Create new tampermonkey script
4. Copy and paste [spinner.js](https://raw.githubusercontent.com/notyourwork/ethcombo/master/spinner.js) into script body
5. Save
6. Profit ?!?

# Notes 📝

I stumbled across ETHCombo in a crypto related subreddit and quesitoned the sites legitimacy. This is a brief journey to automate an online slot machine to get free money!

Years ago I had encountered a handful of bitcoin faucet sites that were handing out small amounts of BTC for completing various tasks. Tasks like signing up for accounts on sites or installing mobile apps with referal codes for example. 

This site took a different approach, pummel the user with advertisements while they spin a slot machine in hopes of hitting a big payout. Having little experience with ad revenue I wondered if it was possible to build a sustainable model where the site profits from advertisement revenue are greater than the total payouts from the game and hosting costs. 

Alternatively, if the site never paid any ETH winnings it could be much more profitable. Hosting would be the only cost involved in running such an operation. Though if no payout was ever granted the site would require retaining users long eonugh to profit of their interaction before they adandon their hopes of actually cashing out their winnings.

Therefore, I had to confirm whether or not you could cash out the minimum 0.15 ETH. This would take a long time due to the small allotment of spins per hour (25 / 3 hours maximum) and the extremely small winnings when a spin hit (~0.0001 ETH). Unwilling to devote (waste) my time actually playing the game, I decided to try automating game play. 

Below is my approach and the results.

## Approach ❓

The UI is composed of the following elements which we'll need for automation:

```
+-----------------------------------------------------+
|                                                     |
|                 +-----------------+                 |
|                 | CurrentWinnings |                 |
|                 +-----------------+                 |
|                                                     |
|   +---------------------------------------------+   |
|   |                                             |   |
|   |               Spinning Reels                |   |
|   |                                             |   |
|   +---------------------------------------------+   |
|                                                     |
|              +-----------------------+              |
|              |  Play Spin Mechanism  |              |
|              +-----------------------+              |
|                 +-----------------+                 |
|                 | Available Spins |                 |
|                 +-----------------+                 |
|                                                     |
|                      +---------+                    |
|                      |  Timer  |                    |
|                      +---------+                    |
|                                                     |
+-----------------------------------------------------+
```

* **Current Winnings** - How much have you won so far?
* **Spinning Reels** - The reels that spin when you play the slot machine.
* **Play Spin Mechanism** - The button to play a single spin.
* **Available Spins** - The amount of spins available.
* **Timer** - How much time until you have more spins to claim?

Implementing some interactions with the above elements should be sufficient for automation and tracking state (winnings, spins / minute, spins won, etc). 

There wasn't a lot of manual input required to play the game, click the button to spin reels, wait for a result, and repeat.

![Automation workflow](https://raw.githubusercontent.com/notyourwork/ethcombo/master/automation-workflow.png)

The above workflow resulted in [spinner.js](https://raw.githubusercontent.com/notyourwork/ethcombo/master/spinner.js).

## Test Drive 🚗

It works! The script can play **~25 spins per minute** (1 spin / 2400 ms), but the site doesn't grant enough spins to necesitate that throughput. 

At best your account is granted 25 spins / 3 hours, (1 spin / 432 seconds). Therefore, I needed to either wait a long time to cash out or find a way to supplement my spin allotment. I decided the latter and discussed with a friend ways to automate the invite referral process. 

ETHCombo grants your account 45 spins for each invite referred. With the help of a friend's jailbroken iPhone, a list of new wallet addresses and my accounts invite referrer link, he was able to hack together an automated process to load my account with as many spins as I could churn through. 

The process was simple, provide the refer invite link, enable airplane mode, disable airplane mode to claim new IP, open invite link, sign up with new wallet address and repeat. 

## Test Drive Round 2 🚙

With a mountain of spins, I let the script churn through thousands of spins over the next 12 hours while I went to bed. 

When I woke up something was wrong, the winnings were decreasing in amount and frequency. I also noticed that my balance appears to plateau at ~0.12 ETH. (0.15 ETH is minimum payout.) 

I decided to test this out by creating a new account with an empty balance and playing again. The winnings frequency decreased as I approached the 0.15 payout threshold. 

# Conclusion 🏁

Is it possible to win? I don't know (probably not).

The site doesn't let you win enough to reach the cashout threshold. It is certainly possible the site decreases winning odds as your spin count increases making it increasingly improbable. Perhaps, 1/n odds of winning where n = your total spin count. I played ~10,000 spins on multiple accounts and encountered the same result each time.  I don't know though because I only play over a weekend but results were not promising.

## How long would it take for a human to replicate? 👨‍🏫

If a human was playing they could achieve a maximum of 245 spins / day. This assumes they invite maximum 50 people to max out their spin grant per 3 hours (25 spins / 3 hours) and also receive the one time 45 spins for each of the 50 invited users. 

To reach the same result manually playing the game would take ~40 days (10,000 / 200 spins / day). Most likely longer because this would require someone to claim their 25 spins every 3 hours, people sleep and don't live at their computer after all. However, if we assume a spin takes 3 seconds for a human, to hit 10,000 spins would consume ~6.67 hours of time (245 spins / days * 40 days * 3 = 24,000 seconds)

## Final Thoughts 💡

I had a lot of fun with this project and hope others can learn from this!

Traditionally, javascript problems are event based like responding to a user input and updating UI or modifying state. This problem required automating the user input (clicking play) and than chaining together a series of time based operations (waiting for reels to spin, determining result, deciding if more spins were available to continue playing or sleeping until timer hit 0). The key is implementing a series of synchronous events that depend on each other. 

The basic game play mechanics can be summed up with the following snippet. Define a recursive self invoking function that either plays the game or sleeps after which it calls again.

```javascript

(function gameLoop() {
    if( getSpinAllowance() > 0 ) {
        playRound();
    } else {
        var roundSleep = getRoundSleep();
        if ( roundSleep > 0 ) {
            setTimeout(function() {
                gameLoop();
            }, roundSleep);
        }
    }
}());

```

