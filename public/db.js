let db;

const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = event => {
    db = event.target.result;
    const budgetStore = db.createObjectStore("pending", {
        autoIncrement: true
    })
}

request.onsuccess = event => {
    db = event.target.result;

    if(navigator.onLine){
        checkDatabase();
    }
}

request.onerror = event => {
    console.log('An error occured: ', event)
}

