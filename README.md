# YouTube No Translate

Firefox Add-On to prevent YouTube from translating videos titles.

You can install it from here: https://addons.mozilla.org/fr/firefox/addon/youtube-no-translate/

## How it works?

Actually it does not prevent YouTube from translating, it replaces the translated title with the original one.

### V1

The original title is still here in `document.title` so we use this to replace the value of the title under the video.

### V2

Requests to Youtube are catched and their responses are filtered using `browser.webRequest.filterResponseData` method.

Both the original title and translated title are found in the response. The translated title is then replaced with the orignal title before the response is being sent to the web page.

### V3

Since the V2 method was not working for some videos, now both V1 and V2 methods are applied on page load.
