import ext from "./utils/ext";
import storage from "./utils/storage";
import Inspector from "react-json-inspector";
import React from "react";

let popup = document.getElementById("app");

storage.get('color', function(resp) {
  let color = resp.color;
  if(color) {
    popup.style.backgroundColor = color
  }
});

let log = (message) => {
    let displayContainer = document.getElementById("log-container");
    displayContainer.innerHTML = `<p class='message'>${message}</p>`;
};

let template = (data) => {
    // log(data);
    let json = JSON.stringify(data);
    return (`
  <div class="site-description">
    <h3 class="title">${data.title}</h3>
    <p class="description">${data.description}</p>
    <Inspector data=${data.rdfa} />
    <a href="${data.url}" target="_blank" class="url">${data.url}</a>
  </div>
  <div class="action-container">
    <button data-bookmark=${json} id="save-btn" class="btn btn-primary">Save</button>
  </div>
  `);
};

let renderMessage = (message) => {
    let displayContainer = document.getElementById("display-container");
    displayContainer.innerHTML = `<p class='message'>${message}</p>`;
};

let renderBookmark = (data) => {
    let displayContainer = document.getElementById("display-container");
    if (data) {
        displayContainer.innerHTML = template(data);
    } else {
        renderMessage("Nothing found")
    }
};

ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderBookmark);
});

popup.addEventListener("click", function(e) {
  if(e.target) {

      if (e.target.matches("#save-btn")){
          e.preventDefault();
          let data = e.target.getAttribute("data-bookmark");
          ext.runtime.sendMessage({ action: "perform-save", data: data }, function(response) {
              if(response && response.action === "saved") {
                  renderMessage("Your triples were saved successfully!");
              } else {
                  renderMessage("Sorry, there was an error while saving your triples.");
              }
          })
      }

  }

});

let optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function(e) {
  e.preventDefault();
  ext.tabs.create({'url': ext.extension.getURL('options.html')});
});
