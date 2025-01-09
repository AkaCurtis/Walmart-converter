const currentUrl = window.location.href;


function convertWalmartLink(url) {
  if (url.includes("www.walmart.com")) {
    return url.replace("www.walmart.com", "business.walmart.com");
  }
  return url;
}

function cleanWalmartUrl(url) {
  const regex = /^(https:\/\/www\.walmart\.com\/ip\/[^?]+)/;
  const match = url.match(regex);
  return match ? match[0] : url;
}

if (/^https:\/\/www\.walmart\.com\/ip\/.+\/\d+(\?.*)?$/.test(currentUrl)) {
  const cleanedUrl = cleanWalmartUrl(currentUrl);
  const convertedLink = convertWalmartLink(cleanedUrl);

  if (convertedLink !== currentUrl) {
    chrome.runtime.sendMessage({type: "convertedLink", link: convertedLink}, function(response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      }
    });
  }
}
