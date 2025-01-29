document.addEventListener("DOMContentLoaded", function () {
  const convertButton = document.getElementById("convertBtn");
  const statusDiv = document.getElementById("status");
  const newTabToggle = document.getElementById("newTabToggle");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const githubLogo = document.querySelector('.logo-container img[alt="GitHub Logo"]');

  if (localStorage.getItem('newTab') === 'true') {
    newTabToggle.checked = true;
  } else {
    newTabToggle.checked = false;
  }

  if (localStorage.getItem('darkMode') === 'true') {
    darkModeToggle.checked = true;
    document.body.classList.add("dark-mode");
    githubLogo.src = "https://img.icons8.com/ios11/512/FFFFFF/github.png";
  } else {
    darkModeToggle.checked = false;
    document.body.classList.remove("dark-mode");
    githubLogo.src = "https://cdn-icons-png.flaticon.com/512/25/25231.png";
  }

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

      if (newTabToggle.checked) {
        window.open(convertedLink, "_blank");
        showStatus("Link converted! Opened in a new tab.", "success");
      } else {
        chrome.tabs.update(activeTab.id, { url: convertedLink });
        showStatus("Link converted! Opened in the current tab.", "success");
      }
    });
  });

  newTabToggle.addEventListener("change", function () {
    localStorage.setItem('newTab', newTabToggle.checked);
  });

  darkModeToggle.addEventListener("change", function () {
    if (darkModeToggle.checked) {
      document.body.classList.add("dark-mode");
      githubLogo.src = "https://img.icons8.com/ios11/512/FFFFFF/github.png";
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove("dark-mode");
      githubLogo.src = "https://cdn-icons-png.flaticon.com/512/25/25231.png";
      localStorage.setItem('darkMode', 'false');
    }
  });

  function cleanWalmartUrl(url) {
    const regex = /^(https:\/\/www\.walmart\.com\/ip\/[^?]+)/;
    const match = url.match(regex);
    return match ? match[0] : url;
  }

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = "block";
    setTimeout(() => {
      statusDiv.style.display = "none";
    }, 3000);
  }
});
