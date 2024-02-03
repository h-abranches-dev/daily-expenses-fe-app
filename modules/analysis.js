let analysisDetailsCategoriesSessionStorageKey = "adc";

function setAnalysisDetailsCategories(cs) {
    sessionStorage.setItem(analysisDetailsCategoriesSessionStorageKey, cs);
}

function getAnalysisDetailsCategories() {
    return sessionStorage.getItem(analysisDetailsCategoriesSessionStorageKey);
}

export { getAnalysisDetailsCategories, setAnalysisDetailsCategories };
