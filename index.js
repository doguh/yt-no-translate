(function () {
  let titleElement;
  function removeTranslation() {
    if (window.location.pathname !== "/watch") return;
    const newTitle = document.title.replace(/- YouTube$/, "");
    const oldTitle = titleElement.getElementsByTagName("span")[0]
      ? titleElement.getElementsByTagName("span")[0].textContent
      : titleElement.textContent;
    titleElement.innerHTML = newTitle;
    titleElement.setAttribute("title", oldTitle);
  }

  let ignoreNextMutation = false;
  const observer = new MutationObserver((mutations) => {
    if (ignoreNextMutation) {
      ignoreNextMutation = false;
      return;
    }
    ignoreNextMutation = true;
    removeTranslation();
  });

  function onTransitionEnd(e) {
    const infoElement = document.getElementById("info-contents");
    const titleContainer =
      infoElement && infoElement.getElementsByClassName("title")[0];
    titleElement =
      titleContainer &&
      titleContainer.getElementsByTagName("yt-formatted-string")[0];

    if (titleElement) {
      observer.observe(titleElement, {
        childList: true,
      });
      removeTranslation();
      document.removeEventListener("transitionend", onTransitionEnd);
    }
  }
  document.addEventListener("transitionend", onTransitionEnd);
})();
