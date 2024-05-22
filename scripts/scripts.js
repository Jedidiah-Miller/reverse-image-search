const URL_STORAGE_KEY = "chrome_image_search_URL"


const googleSearchURL = (url) => {
  return `https://www.google.com/searchbyimage?image_url=${url}&client=app`;
};

const googleLensSearchByImage = function (url) {
  return `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(url)}`;
};

const yandexSearchURL = (url) => {
  return `https://yandex.com/images/search?source=collections&url=${url}&rpt=imageview`;
};

const bingSearchURL = (url) => {
  return `https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIVSP&sbisrc=UrlPaste&q=imgurl:${url}`;
};

const wayBackMachineSearchURL = (url) => {
  return `https://web.archive.org/web/${url}`;
};

const wayBackMachineSaveURL = (url) => {
  return `https://web.archive.org/save/${url}`;
};


function handleChange(e) {
  const {value} = e.target;
  setValue(value);
}

function setValue(value = null) {

  document.getElementById("search-google-btn").href = googleSearchURL(value);
  document.getElementById("search-google_lens-btn").href = googleLensSearchByImage(value);
  document.getElementById("search-yandex-btn").href = yandexSearchURL(value);
  document.getElementById("search-bing-btn").href = bingSearchURL(value);
  document.getElementById("search-waybackMachine-btn").href = wayBackMachineSearchURL(value);
  document.getElementById("save-waybackMachine-btn").href = wayBackMachineSaveURL(value);

  localStorage.setItem(URL_STORAGE_KEY, value);
}


async function clearAndPasteFromClipboard() {
  try {
    const value = await navigator.clipboard.readText();
    document.getElementById("url-input").value = value;
    setValue(value);
  } catch (error) {
    console.error('failed to paste from clipboard:', error);
  }
}


function setInitialValue() {
  const value = localStorage.getItem(URL_STORAGE_KEY);
  document.getElementById("url-input").value = value;
  setValue(value);
}


function addEventListeners() {
  document.getElementById("url-input").addEventListener("input", handleChange);
  document.getElementById("clear-and-paste-from-clipboard-btn").addEventListener("click", clearAndPasteFromClipboard);
}


function initialize() {
  addEventListeners();
  setInitialValue();
}


initialize();