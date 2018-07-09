import ext from "./utils/ext";
import WAE from 'web-auto-extractor';

let extractTags = () => {


    let url = document.location.href;
    if(!url || !url.match(/^http/)) return;

    let data = {
        title: "",
        description: "",
        url: document.location.href
    };

    let ogTitle = document.querySelector("meta[property='og:title']");

    if(ogTitle) {
        data.title = ogTitle.getAttribute("content")

    } else {
        data.title = document.title
    }

    let descriptionTag = document.querySelector("meta[property='og:description']") || document.querySelector("meta[name='description']")
    if(descriptionTag) {
        data.description = descriptionTag.getAttribute("content")
    }

    let documentHTML = document.documentElement.innerHTML;
    data.rdfa = WAE().parse(documentHTML);

    return data;
};

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    sendResponse(extractTags())
  }
}

ext.runtime.onMessage.addListener(onRequest);