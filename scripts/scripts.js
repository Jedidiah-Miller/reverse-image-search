const URL_STORAGE_KEY = "chrome_image_search_URL";
const SELECTED_PAGES_KEY = "chrome_image_search_selected_pages";


const googleSearchByImageURL = (url) => {
  return `https://www.google.com/searchbyimage?image_url=${url}&client=app`;
};

const googleLensSearchByImageURL = function (url) {
  return `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(url)}`;
};

const yandexSearchByImageURL = (url) => {
  return `https://yandex.com/images/search?source=collections&url=${url}&rpt=imageview`;
};

const bingSearchByImageURL = (url) => {
  return `https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIVSP&sbisrc=UrlPaste&q=imgurl:${url}`;
};

const wayBackMachineSearchURL = (url) => {
  return `https://web.archive.org/web/${url}`;
};

const wayBackMachineSaveURL = (url) => {
  return `https://web.archive.org/save/${url}`;
};


const searchMethods = {
  googleImages: {
    id: 'google_images',
    openBtnId: null,
    URL: googleSearchByImageURL
  },
  googleLens: {
    id: 'google_lens',
    openBtnId: null,
    URL: googleLensSearchByImageURL
  },
  yandexImages: {
    id: 'yandex_images',
    openBtnId: null,
    URL: yandexSearchByImageURL
  },
  bingImages: {
    id: 'bing_images',
    openBtnId: null,
    URL: bingSearchByImageURL
  },
  waybackMachineSearch: {
    id: 'waybackMachine',
    openBtnId: null,
    URL: wayBackMachineSearchURL
  },
};

const archiveMethods = {
  waybackMachineSave: {
    id: 'waybackMachine',
    openBtnId: null,
    URL: wayBackMachineSaveURL
  },
};

const searchBtnId = (methodName) => `search-${methodName}-btn`;
const archiveBtnId = (methodName) => `save-${methodName}-btn`;

// TODO: this should be dynamic and the user should be able to update the slected pages
const selectedPages = {
  googleImages: true,
  googleLens: true,
  yandexImages: true,
};


function handleChange(e) {
  const {value} = e.target;
  setValue(value);
}

function setValue(value = null) {

  [searchMethods, archiveMethods].forEach((methods) => {
    Object.entries(methods).forEach(([k, v]) => {
      document.getElementById(v.openBtnId).href = v.URL(value);
    });
  });

  localStorage.setItem(URL_STORAGE_KEY, value);
}

const isBrowserChrome = () => {
  return navigator.userAgent.indexOf("Chrome") > -1;
};

const openNewChromeTab = (url) => {
  chrome.tabs.create({
    url: url
  });
};

const openNewTab = (url) => {
  window.open(url);
};


async function clearAndPasteFromClipboard() {
  try {
    const value = await navigator.clipboard.readText();
    document.getElementById("url-input").value = value;
    setValue(value);
  } catch (error) {
    console.error('failed to paste from clipboard:', error);
  }
}

function openMultipleSearchPages(pages=selectedPages) {
  const openNewTabFunction = isBrowserChrome() ? openNewChromeTab : openNewTab;
  Object.keys(pages).forEach((k) => {
    if (pages[k]) {
      const url = document.getElementById(searchMethods[k].openBtnId).href;
      openNewTabFunction(url);
    }
  });
}


function setElementIds() {
  Object.entries(searchMethods).forEach(([k, v]) => {
    searchMethods[k].openBtnId = searchBtnId(v.id);
  });
  Object.entries(archiveMethods).forEach(([k, v]) => {
    archiveMethods[k].openBtnId = archiveBtnId(v.id);
  });
}

function setInitialValue() {
  const value = localStorage.getItem(URL_STORAGE_KEY);
  document.getElementById("url-input").value = value;
  setValue(value);
  // // TODO: loop through each key - set selected pages
}


function addEventListeners() {
  document.getElementById("url-input").addEventListener("input", handleChange);
  document.getElementById("clear-and-paste-from-clipboard-btn").addEventListener("click", clearAndPasteFromClipboard);
  document.getElementById("open-multiple-search-pages-btn").addEventListener("click", () => openMultipleSearchPages(selectedPages));
}


function initialize() {
  try {    
    setElementIds();
    addEventListeners();
    setInitialValue();
  } catch (error) {
    console.error(error);
  }
}


initialize();