console.log("Bot detector running...");

// import { femaleNames } from "./female-names";
// import { flaggedEmojis } from "./flagged-emojis"
// import AhoCorasick from 'aho-corasick';


let flaggedEmojisSet;
if (!flaggedEmojisSet){
    flaggedEmojisSet = new Set(flaggedEmojis)
}

function checkForBotMessage(comment, text){
    const hasEmojis = text.match(/[\u{1F300}-\u{1FAFF}]/gu)
    let flags = 0
    // to do
    // emojis
    if (hasEmojis){
        flags += hasEmojis.length
        for (let emoji of hasEmojis){
            if (flaggedEmojisSet.has(emoji)){
                flags += 5
            }
        }
        
    }

    // ! <-- spam
    let exclamationCount = text.split("!").length - 1

    if (exclamationCount > 3){
        flags += 10
    }

    // botted likes (50 - 250 range)

    // replys
    const replyTag = comment.querySelector("#replies")
    const hasReplies = replyTag.querySelector("button")
    if (hasReplies){
        hasReplies.click()
        let replyContainer = replyTag.querySelector("#expander-contents")
        replyContainer.querySelectorAll("yt-attributed-string").forEach(reply => {
            if (reply.childNodes[0].textContent.match(/(b | B)ot/)){ // <-- issure with textContent call
                flags += 1000 // for sure bot comment
            }
        })

    }

    return flags > 15 // <-- abitrary number until fully implementing machine learning
}

// let botNameRegex = /^@([A-Z][a-z]+)([A-Z][a-z]+)(?:-[a-z0-9]{2,8})?$/; 
// ^ too many false alarms + not all bots use this scheme


function isBotUsername(username) {
    let usernameLower = username.toLowerCase()
    if (username === "@MargarethaLent"){
        console.log(username)
    }
    for (let name of femaleNames){
        if (usernameLower.includes(name)){
            return true;
        }
    }
    return false;
}


let oldNumberOfComments = 0
function scanComment(comment) {
    // check messages and usernames
    const authorSpan = comment.querySelector('#author-text span');
    if (!authorSpan) return;

    let message = comment.querySelector("yt-attributed-string#content-text")
    let text = message.childNodes[0].textContent

    const username = authorSpan.textContent.trim();
    if (isBotUsername(username) || checkForBotMessage(comment, text)) {
        console.log('🚨 Potential Bot Detected:', username);

        // test
        comment.style.border = '2px solid white';
        comment.style.backgroundColor = '#8B0000';

        let thumbnailContainer = comment.querySelector("#author-thumbnail")
        let pfp = thumbnailContainer.querySelector("img")

        // store img src (bots reuse pfps)
        let pfpObj = JSON.parse(localStorage.getItem("botPFPS") || [])
        pfpObj.push(pfp.src)
        localStorage.setItem("botPFPS", JSON.stringify(pfpObj))


        // comment.remove();
    }
}


// window.addEventListener('load', () => {
//   setTimeout(scanComments, 2000);
// });



function watchComments() {
    const commentsSection = document.querySelector("#comments");
  
    if (!commentsSection) {
        console.log("No comments section found yet. Retrying...");
        setTimeout(watchComments, 1000);
        return;
    }
  
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const comment of mutation.addedNodes) {
                if (comment.nodeType === 1 && comment.matches("ytd-comment-thread-renderer")) {
                    console.log("New comment loaded:", comment);
                    scanComment(comment);
                }
            }
        }
    });
  
    observer.observe(commentsSection, { childList: true, subtree: true });
  
    console.log("Watching for new YouTube comments...");
  }
  
  watchComments();
  
  
window.addEventListener("yt-navigate-finish", () => {
    console.log("Navigation finished on YouTube");
    watchComments();
});
  

// youtube replaces deleted ads, so covering them instead is permenant
let adObserver;
if (!adObserver) {
    adObserver = new MutationObserver((mutationList, observer) => {
        document.querySelectorAll("ytd-ad-slot-renderer").forEach((adSlot) => {
            console.log(`removing ${adSlot.nodeName}`)
            //adSlot.parentElement.parentElement.remove()

            const blackout = document.createElement('div');
            blackout.style.position = 'absolute';
            blackout.style.top = '0';
            blackout.style.left = '0';
            blackout.style.width = '100%';
            blackout.style.height = '100%';
            blackout.style.backgroundColor = '#0f0f0f';
            blackout.style.opacity = '1';
            blackout.style.zIndex = '9999'; // make sure it's on top
            adSlot.appendChild(blackout)
        })
    })
}

if (!config) {
    config = { childList: true, subtree: true };
}

adObserver.observe(document.body, config);

// //common bot comments: 💖💦♥♥, 3 random emojis at end, or emojis with no text
// //ytd-ad-slot-renderer
// //const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}-\u{1F0CF}\u{2934}\u{2935}]/u;
// // <ytd-comments id="comments" ...> 
// // <div id="replies"> <-- other commenters usually call out bots already
// // @DianneR.Mullins --> '"Youre dad grips my hair while i give brain💝💘🙏💸"\n -Not me 💀💀'
// // @KaterinaLoveMaker --> 'Clix or me ?!! vote For Me ✨ 🖤!!!🧡!!!😘!!!🫶🏻' <-- ! spam
// // botted likes 
// // @Владислава Лидия Марина <--russain names?
// //
// // Reused pfps: structure =
// // <div id='author-thumbnail'>
// //  <button id = 'author-thumbnail-button'>
//         //<yt-img-shadow>
//             //<img height ='40' width ='40' src={reused}>

    
