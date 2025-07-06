console.log("Content script running...");

function checkForBot(comment, text){

        // Match 3 or more emojis at the end of the string
        const emojiEndRegex = /(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}){3,}$/u;
        const match = text.match(emojiEndRegex);
      
        if (match) {
          const emojiStr = match[0];
      
          // Extract individual emojis using the same Unicode pattern
          const individualEmojis = emojiStr.match(/(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu);
          const uniqueEmojis = new Set(individualEmojis);

          const flaggedEmojis = ['💖', '💦'];
          const hasFlagged = individualEmojis.some(e => flaggedEmojis.includes(e));
      
          if (uniqueEmojis.size >= 2 || hasFlagged){
            return true
          }
        }
      
        
}

let observer;
let config;

if (!observer) {
    observer = new MutationObserver((mutationList, observer) => {
        // Query for the comment profile picture
        const comments = document.querySelectorAll("ytd-comment-thread-renderer")
        if (comments){
            comments.forEach((comment) => {
                try {
                    let message = comment.querySelector("yt-attributed-string")
                    let text = message.childNodes[0].textContent

                    if (checkForBot(comment, text)){
                        comment.remove()
                    }
                }
                catch (err){
                    console.log(err)
                }
            })
        }

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

//common bot comments: 💖💦 or 3 random emojis
//ytd-ad-slot-renderer
//const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}-\u{1F0CF}\u{2934}\u{2935}]/u;
// <ytd-comments id="comments" ...>