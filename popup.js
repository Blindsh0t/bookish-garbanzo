document.getElementById('saveTabs').addEventListener('click', () => {
    // Get today's date for the folder name
    const today = new Date();
    const folderName = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Create the main folder
    chrome.bookmarks.create({ title: folderName }, (mainFolder) => {
        // Save non-incognito tabs from the current window
        chrome.tabs.query({ currentWindow: true, windowType: "normal" }, (tabs) => {
            tabs.forEach((tab) => {
                if (!tab.incognito) {
                    chrome.bookmarks.create({
                        parentId: mainFolder.id,
                        title: tab.title,
                        url: tab.url
                    });
                }
            });
        });

        // Save incognito tabs from all windows
        chrome.tabs.query({ windowType: "normal" }, (tabs) => {
            const incognitoTabs = tabs.filter((tab) => tab.incognito);

            if (incognitoTabs.length > 0) {
                // Create a subfolder named "$Temp" for incognito tabs
                chrome.bookmarks.create({
                    parentId: mainFolder.id,
                    title: "$Temp"
                }, (incognitoFolder) => {
                    incognitoTabs.forEach((tab) => {
                        chrome.bookmarks.create({
                            parentId: incognitoFolder.id,
                            title: tab.title,
                            url: tab.url
                        });
                    });
                });
            }
        });

        // Notify the user
        alert(`Tabs saved in folder "${folderName}"`);
    });
});