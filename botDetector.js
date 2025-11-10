console.log("Bot detector running...");

// import AhoCorasick from 'aho-corasick';


function getFlaggedEmojisSet(){
    return new Set(flaggedEmojis)
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

    // botted likes (50 - 250 range) usually

    // replys <-- way too taxing
    // const replyTag = comment.querySelector("#replies")
    // const hasReplies = replyTag.querySelector("button")
    // if (hasReplies){
    //     hasReplies.click()
    //     let replyContainer = replyTag.querySelector("#expander-contents")
    //     replyContainer.querySelectorAll("yt-attributed-string").forEach(reply => {
    //         if (reply.childNodes[0].textContent.match(/(b | B)ot/)){ // <-- issure with textContent call
    //             flags += 1000 // for sure bot comment
    //         }
    //     })

    // }

    return flags > 15 // <-- abitrary number until fully training model
}

// let botNameRegex = /^@([A-Z][a-z]+)([A-Z][a-z]+)(?:-[a-z0-9]{2,8})?$/; 
// ^ too many false alarms + not all bots use this scheme

//  @ErosMoriahah <-- not detected ???
function isBotUsername(username) {
    console.log("checking: ", username)
    const crillicRegex = /^\p{Script=Cyrillic}+$/u
    const cleanedUsername = username.slice(1).trim()
    if (cleanedUsername.match(crillicRegex)){
        return true;
    }

    const usernameLower = username.toLowerCase()
    for (let name of femaleNames){
        if (usernameLower.includes(name)){
            return true;
        }
    }
    return false;
}


function scanComment(comment) {
    // check messages and usernames
    const authorSpan = comment.querySelector('#author-text span');
    if (!authorSpan) {
        console.log("no authorSpan")
        return;
    }

    let message = comment.querySelector("yt-attributed-string#content-text")
    let text = message.childNodes[0].textContent

    const username = authorSpan.textContent.trim();
    if (isBotUsername(username) ) { // && checkForBotMessage(comment, text)
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
    else{
        console.log(`${username} is not a bot`)
    }
}


// window.addEventListener('load', () => {
//   setTimeout(scanComments, 2000);
// });



function watchComments() {
    const commentsContainer = document.querySelector("#comments");
    const commentsSection = commentsContainer.querySelector("div#contents")
  
    if (!commentsSection) {
        console.log("No comments section found yet. Retrying...");
        setTimeout(watchComments, 1000);
        return;
    }

    // check initial comments
    // document.querySelectorAll("ytd-comment-thread-renderer").forEach(comment => {
    //     scanComment(comment);
    // })
  
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const comment of mutation.addedNodes) {
                if (comment.nodeType === 1 && comment.nodeName === ("ytd-comment-thread-renderer".toUpperCase())) {
                    console.log("New comment loaded:", comment);
                    scanComment(comment);
                }
            }
        }
    });
  
    observer.observe(commentsSection, { childList: true});
  
    console.log("Watching for new YouTube comments...");
}


  
  
window.addEventListener("yt-navigate-finish", () => {
    console.log("Navigation finished on YouTube");
    // in development
    // if (window.location.pathname != '/'){
    //     watchComments();
    // }
});
  


// //common bot comments: 💖💦♥♥, 3 random emojis at end, or emojis with no text
// //ytd-ad-slot-renderer
// //const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}-\u{1F0CF}\u{2934}\u{2935}]/u;
// // <ytd-comments id="comments" ...> 
// // <div id="replies"> <-- other commenters usually call out bots already


// // common bio --> ʜɪ ʜᴀɴᴅꜱᴏᴍᴇ, ᴡᴀɴᴛ ᴀ ᴅᴀᴛᴇ ᴡɪᴛʜ ᴍᴇ? ɪᴛ’ꜱ ᴇᴀꜱʏ, ꜰɪɴᴅ ᴍᴇ ʙᴇʟᴏᴡ
// //            -->
// // @DianneR.Mullins --> '"Youre dad grips my hair while i give brain💝💘🙏💸"\n -Not me 💀💀'
// // @KaterinaLoveMaker --> 'Clix or me ?!! vote For Me ✨ 🖤!!!🧡!!!😘!!!🫶🏻' <-- ! spam
// // botted likes 
// // @Владислава Лидия Марина <--russain names?
// // @TaylorReed-j7u --> "Can’t get over how genuine you are, this is the kind of content that sticks."
// // @AngelinaBarbara-e7d --> I adore how she simply gets up and exits the water without incident as soon as she receives the life ring 😂.
// // @MinhNgogo-e7f --> what even is this channel and why am i hooked 🧡💖
// // @Phanphuongomuhqhq --> just here like 🍒🧡
// // @ÝTrươngng-w7z --> Thank you so much for your colorful and creative videos. Your videos are a real work of art.💡‍♀️🐡
// // @NgọcCaoao --> Keep on creating great content. Your videos are always neat and informative.😹🥩🥥
// // @AmandaLewis-x3t --> I needed this kind of truth today, thank you.
// // @HannahClark-s7d --> You shine without even trying — that’s rare.
// // @VoVanTuTu --> this is youtube at its finest 😻👅
// // @HaYenNhihi --> % confused, % impressed 🔥😛
// // @BiancaTudore --> Clients are able to write.  You elevated Benjamin to customer even though he was a Case employee. <-- stealing some on else's comment
// // @AmberPhillips-k4b --> Your chill presence is a reminder that realness still exists.
// // @JosephineBrooks-n2z --> Can’t get over how genuine you are, this is the type of content that matters.
// // @AuroraSavannahLucy --> i woke up today feeling sad about a recent break up with my ex of 2 years... your videos have been an emotional crutch to me since I'm a very emotionally dependent person and have a hard time realizing what I am feeling. Your reflections during these videos ressonate a shit ton with me, so thank you, Ken. You are an amazing person 😓😓😔😔
// // -->

// // Reused pfps: structure =
// // <div id='author-thumbnail'>
// //  <button id = 'author-thumbnail-button'>
//         //<yt-img-shadow>
//             //<img height ='40' width ='40' src={reused}>

    
