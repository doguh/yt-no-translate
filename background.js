function rewriteXHR(details) {
  console.log("Loading: " + details.url);

  let filter = browser.webRequest.filterResponseData(details.requestId);

  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();
  let str = "";

  filter.ondata = (event) => {
    str += decoder.decode(event.data, { stream: true });
  };

  if (details.type === "xmlhttprequest") {
    // if xmlhttprequest, we parse the response and replace the poorly translated title with the original
    filter.onstop = (event) => {
      const obj = JSON.parse(str);
      const trueTitle = obj[2].playerResponse.videoDetails.title;
      const shittyTitle =
        obj[2].playerResponse.microformat.playerMicroformatRenderer.title
          .simpleText;
      filter.write(
        encoder.encode(str.replace(new RegExp(shittyTitle, "g"), trueTitle))
      );
      filter.disconnect();
    };
  } else if (details.type === "main_frame") {
    // if main_frame, we try to find the ytInitialPlayerResponse object and find the original title here, then replace the poorly translated title with it
    filter.onstop = (event) => {
      const startTag = "var ytInitialPlayerResponse = ";
      const endTag = "};";
      const startIndex = str.indexOf(startTag);
      const endIndex = str.indexOf(endTag, startIndex);
      const dataStr = str.substring(
        startIndex + startTag.length,
        endIndex + endTag.length - 1
      );
      const data = JSON.parse(dataStr);
      const trueTitle = data.videoDetails.title;
      const shittyTitle =
        data.microformat.playerMicroformatRenderer.title.simpleText;
      filter.write(
        encoder.encode(str.replace(new RegExp(shittyTitle, "g"), trueTitle))
      );
      filter.disconnect();
    };
  }
}

browser.webRequest.onBeforeRequest.addListener(
  rewriteXHR,
  { urls: ["https://www.youtube.com/watch?v=*"] },
  ["blocking"]
);
