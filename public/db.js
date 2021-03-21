let db;

const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = (event) => {
  db = event.target.result;
  const budgetStore = db.createObjectStore("pending", {
    autoIncrement: true,
  });
};

request.onsuccess = (event) => {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = (event) => {
  console.log("An error occured: ", event);
};

const saveRecord = (record) => {
  const transaction = db.transaction(["pending"], "readwrite");
  const pendingObjStore = transaction.objectStore("pending");
  pendingObjStore.add(record);
};

const checkDatabase = () => {
  const transaction = db.transaction(["pending"], "readwrite");
  const pendingObjStore = transaction.objectStore("pending");
  const allPendingObjects = pendingObjStore.getAll();

  allPendingObjects.onsuccess = () => {
    if (allPendingObjects.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(allPendingObjects.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          const newTransaction = db.transaction(["pending"], "readwrite");
          const newPendingObjStore = newTransaction.objectStore("pending");
          newPendingObjStore.clear();
        });
    }
  };
};

window.addEventListener("online", checkDatabase);
