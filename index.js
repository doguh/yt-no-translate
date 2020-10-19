(function () {
  function getTitleElement() {
    const e = document.getElementById("info-contents");
    const t = e && e.getElementsByClassName("title")[0];
    const f = t && t.getElementsByTagName("yt-formatted-string")[0];
    return f;
  }

  function removeTranslation() {
    if (window.location.pathname !== "/watch") return;
    const title = getTitleElement();
    if (title) {
      const newTitle = document.title.replace(/- YouTube$/, "");
      const oldTitle = title.getElementsByTagName("span")[0]
        ? title.getElementsByTagName("span")[0].textContent
        : title.textContent;
      title.innerHTML = newTitle;
      title.setAttribute("title", oldTitle);
    }
  }

  let inited = false;
  let currentPage = document.title;
  document.addEventListener("transitionend", (e) => {
    if (!inited && getTitleElement()) {
      inited = true;
      removeTranslation();
    } else if (e.target.id === "progress" && currentPage !== document.title) {
      currentPage = document.title;
      removeTranslation();
    }
  });

  removeTranslation();
})();
