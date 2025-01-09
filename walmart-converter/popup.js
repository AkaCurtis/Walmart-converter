document.addEventListener("DOMContentLoaded", function () {
  const convertButton = document.getElementById("convertBtn");
  const statusDiv = document.getElementById("status");

  convertButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const currentUrl = activeTab.url;

      const walmartRegex = /^https:\/\/www\.walmart\.com\/ip\/.*\/\d+/;
      if (!walmartRegex.test(currentUrl)) {
        showStatus("This page is not a valid Walmart product link.", "error");
        return;
      }

      const cleanedUrl = cleanWalmartUrl(currentUrl);
      const convertedLink = cleanedUrl.replace(
        "www.walmart.com",
        "business.walmart.com"
      );

      window.open(convertedLink, "_blank");
      showStatus("Link converted! Opened in a new tab.", "success");
    });
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = "block";
    setTimeout(() => {
      statusDiv.style.display = "none";
    }, 3000);
  }

  function cleanWalmartUrl(url) {
    const regex = /^(https:\/\/www\.walmart\.com\/ip\/[^?]+)/;
    const match = url.match(regex);
    return match ? match[0] : url;
  }
});
