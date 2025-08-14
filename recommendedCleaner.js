function cleanRecommended(){
    const videos = document.querySelectorAll("yt-lockup-view-model.ytd-item-section-renderer")
    videos.forEach(video => {
        const progressBar = video.querySelector("div.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment")
        let width = parseInt(progressBar.style.width)
        if (width > 1 ){ // <-- update value to be user inputted
            video.style.border = '2px solid white';
            video.style.backgroundColor = '#8B0000';
            // grab title
            // let title = video.querySelector('h3.yt-lockup-metadata-view-model-wiz__heading-reset').title
            // console.log(`removing ${title}`)
            // video.remove()
        }
    })
}

let observer;
if (!observer){
    observer = new MutationObserver(() => {
        cleanRecommended();
    })
    observer.observe(document.querySelector)
}

window.addEventListener('load', () => {
    setTimeout(cleanRecommended, 2000);
  });

// < yt-lockup-view-model class="ytd-item-section-renderer lockup" 
// <div id="primary">
//     <ytd-rich-item-renderer> <-- vids and ads on home page
//         <a id="thumbnail">
//         <div id="overlays" class="style-scope ytd-thumbnail"><ytd-thumbnail-overlay-time-status-renderer class="style-scope ytd-thumbnail" hide-time-status="" overlay-style="DEFAULT"><!--css-build:shady--><!--css_build_scope:ytd-thumbnail-overlay-time-status-renderer--><!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js--><ytd-badge-supported-renderer is-thumbnail-badge="" class="style-scope ytd-thumbnail-overlay-time-status-renderer" system-icons=""><!--css-build:shady--><!--css_build_scope:ytd-badge-supported-renderer--><!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js--><dom-repeat id="repeat" as="badge" class="style-scope ytd-badge-supported-renderer"><template is="dom-repeat"></template></dom-repeat></ytd-badge-supported-renderer><div class="thumbnail-overlay-badge-shape style-scope ytd-thumbnail-overlay-time-status-renderer"><badge-shape class="badge-shape-wiz badge-shape-wiz--thumbnail-default badge-shape-wiz--thumbnail-badge" role="img" aria-label="13 minutes, 24 seconds"><div class="badge-shape-wiz__text">13:24</div></badge-shape></div><div id="time-status" class="style-scope ytd-thumbnail-overlay-time-status-renderer" hidden=""><yt-icon size="16" class="style-scope ytd-thumbnail-overlay-time-status-renderer" disable-upgrade="" hidden=""></yt-icon><span id="text" class="style-scope ytd-thumbnail-overlay-time-status-renderer" aria-label="13 minutes, 24 seconds">
//     13:24
//   </span></div></ytd-thumbnail-overlay-time-status-renderer><ytd-thumbnail-overlay-now-playing-renderer class="style-scope ytd-thumbnail" now-playing-badge=""><!--css-build:shady--><!--css_build_scope:ytd-thumbnail-overlay-now-playing-renderer--><!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js--><span id="overlay-text" class="style-scope ytd-thumbnail-overlay-now-playing-renderer">Now playing</span>
// <ytd-thumbnail-overlay-equalizer class="style-scope ytd-thumbnail-overlay-now-playing-renderer"><!--css-build:shady--><!--css_build_scope:ytd-thumbnail-overlay-equalizer--><!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js--><svg xmlns="http://www.w3.org/2000/svg" id="equalizer" viewBox="0 0 55 95" class="style-scope ytd-thumbnail-overlay-equalizer">
//   <g class="style-scope ytd-thumbnail-overlay-equalizer">
//     <rect class="bar style-scope ytd-thumbnail-overlay-equalizer" x="0"></rect>
//     <rect class="bar style-scope ytd-thumbnail-overlay-equalizer" x="20"></rect>
//     <rect class="bar style-scope ytd-thumbnail-overlay-equalizer" x="40"></rect>
//   </g>
// </svg>
// </ytd-thumbnail-overlay-equalizer>
// </ytd-thumbnail-overlay-now-playing-renderer></div>
//         </a>
//     <ytd>
// <div>