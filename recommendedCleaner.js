console.log("Clean Recommended running...");

function cleanRecommended(video){
    const progressBar = video.querySelector("div.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment")
    if (!progressBar) return;

    let width = parseInt(progressBar.style.width)
    if (width > 1 ){ // <-- update value to be user inputted
            // video.style.border = '2px solid white';
            // video.style.backgroundColor = '#8B0000';
            //grab title
            try{
                let title = video.querySelector('h3.yt-lockup-metadata-view-model-wiz__heading-reset').title
                console.log(`removing ${title}`)
            }
            catch(err){
                console.log("removing: ", video)
            }
            
            video.style.display = "none" 
    }
}

function blackOut(adSlot){
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
}

function removeShorts(container){
    // container.style.border = '2px solid white';
    // container.style.backgroundColor = '#8B0000';

    container.style.display = "none"
}
  
function watchAds(adSlot){
    // adSlot.style.border = '2px solid white';
    // adSlot.style.backgroundColor = '#8B0000';

    adSlot.style.display = "none"
}

function checkInitial(){
    document.querySelectorAll("yt-lockup-view-model.ytd-item-section-renderer").forEach(video=>cleanRecommended(video))
    document.querySelectorAll("YTD-AD-SLOT-RENDERER".toLowerCase()).forEach(ad=>watchAds(ad))
    let shorts = window.location.pathname == "/" ? "ytd-rich-shelf-renderer":"ytd-reel-shelf-renderer"
    document.querySelectorAll(shorts).forEach(container=>removeShorts(container))
}

function waitForContentsToLoad(observer){
    let contents = document.querySelector("#contents")
    if (contents == null){
        setTimeout(() => waitForContentsToLoad(observer), 1000)
        return;
    }
    setTimeout(checkInitial, 1000)
    observer.observe(contents, { childList: true })
}

window.addEventListener("yt-navigate-finish", () => {
    const observer = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            for (const node of mutation.addedNodes){ // node == "ytd-rich-item-renderer" if on homepage, else node == targets below
                console.log(node)
                const tag = node.tagName;
                let target = node.querySelector("yt-lockup-view-model")
                if (target != null || tag == "YT-LOCKUP-VIEW-MODEL") {
                    console.log(`cleaning recommended...`)
                    cleanRecommended(node)
                    continue;
                }
                target = node.querySelector("YTD-AD-SLOT-RENDERER".toLowerCase())
                if (target != null || tag == "YTD-AD-SLOT-RENDERER") {
                    console.log(`blocking ad...`)
                    watchAds(node)
                    continue;
                }
                target = node.querySelector("ytd-reel-shelf-renderer")
                if (target != null || /ytd-(reel|rich)-shelf-renderer/i.test(tag)) {
                    console.log(`blocking shorts...`)
                    removeShorts(node)
                    continue;
                }
            }
        }

    })

    waitForContentsToLoad(observer)
  });
