function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function rewriteXHR(details) {
  console.log("Loading: " + details.url);

  const filter = browser.webRequest.filterResponseData(details.requestId);

  const buffers = [];
  const decoder = new TextDecoder("utf-8");
  const encoder = new TextEncoder();

  filter.ondata = (event) => {
    buffers.push(event.data);
  };

  filter.onstop = (event) => {
    try {
      const str = buffers
        .map((buffer) => decoder.decode(buffer, { stream: true }))
        .join("");
      if (details.type === "xmlhttprequest") {
        // if xmlhttprequest, we parse the response and replace the poorly translated title with the original
        const obj = JSON.parse(str);
        const trueTitle = obj[2].playerResponse.videoDetails.title;
        const shittyTitle =
          obj[2].playerResponse.microformat.playerMicroformatRenderer.title
            .simpleText;
        filter.write(
          encoder.encode(
            str.replace(new RegExp(escapeRegExp(shittyTitle), "g"), trueTitle)
          )
        );
      } else if (details.type === "main_frame") {
        // if main_frame, we try to find the ytInitialPlayerResponse object and find the original title here, then replace the poorly translated title with it
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
          encoder.encode(
            str.replace(new RegExp(escapeRegExp(shittyTitle), "g"), trueTitle)
          )
        );
      }
    } catch (err) {
      console.error(err);
      buffers.forEach((buffer) => filter.write(buffer));
    }
    filter.disconnect();
  };
}

browser.webRequest.onBeforeRequest.addListener(
  rewriteXHR,
  { urls: ["https://www.youtube.com/watch?v=*"] },
  ["blocking"]
);
