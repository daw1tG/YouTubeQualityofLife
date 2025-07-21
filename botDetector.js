console.log("Content script running...");

function checkForBot(comment, text){
    const hasEmojis = text.match(/[\u{1F300}-\u{1FAFF}]/gu)
    // to do
}

const botNameRegex = /^@([A-Z][a-z]+)([A-Z][a-z]+)(?:-[a-z0-9]{2,8})?$/;


function isBotUsername(username) {
  const match = username.match(botNameRegex);
  if (!match) return false;
  const [, first, last] = match;
  return true;
}


function scanComments() {
    const comments = document.querySelectorAll('ytd-comment-thread-renderer');

    // usernames
    comments.forEach(comment => {
        const authorSpan = comment.querySelector('#author-text span');
        if (!authorSpan) return;

        const username = authorSpan.textContent.trim();
        if (isBotUsername(username)) {
            console.log('🚨 Bot detected:', username);


            comment.style.border = '2px solid white';
            comment.style.backgroundColor = '#8B0000';

            // comment.remove();
        }

        //check message
        comments.forEach((comment) => {
            try {
                let message = comment.querySelector("yt-attributed-string")
                let text = message.childNodes[0].textContent

                if (checkForBot(comment, text)){
                    comment.style.border = '2px solid red';
                    comment.style.backgroundColor = '#ffe6e6';
                    // comment.remove()
                }
            }
            catch (err){
                console.log(err)
            }
        })
  });
}


window.addEventListener('load', () => {
  setTimeout(scanComments, 2000);
});


let observer;
let config;

if (!observer) {
    observer = new MutationObserver((mutationList, observer) => {
        scanComments();
    });
}

let observer2;
if (!observer) {
    observer2 = new MutationObserver((mutationList, observer) => {
        document.querySelectorAll("ytd-ad-slot-renderer").forEach((adSlot) => {
            console.log(`removing ${adSlot.nodeName}`)
            adSlot.parentElement.parentElement.remove()
        })
    })
}

if (!config) {
    config = { childList: true, subtree: true };
}

observer.observe(document.body, config);
observer2.observe(document.body, config);

//common bot comments: 💖💦♥♥, 3 random emojis at end, or emojis with no text
//ytd-ad-slot-renderer
//const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}-\u{1F0CF}\u{2934}\u{2935}]/u;
// <ytd-comments id="comments" ...> 
// <div id="replies">
// @DianneR.Mullins --> '"Youre dad grips my hair while i give brain💝💘🙏💸"\n -Not me 💀💀'

