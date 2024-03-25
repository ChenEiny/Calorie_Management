/*
Roy Megidish 209277458
Hen Einy 209533785 
*/

const storeName = "calories";

const openCostsDB = (dbName = "caloriesDB", version = 1) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);
        request.onerror = () => reject("Error opening database");
        request.onsuccess = (event) => {
            const db = event.target.result;

            const customDb = {
                _db: db,
                addCalories: (item) => {
                    return new Promise((resolve, reject) => {
                        const transaction = customDb._db.transaction([storeName], "readwrite");
                        const store = transaction.objectStore(storeName);
                        const request = store.add(item);
                        request.onerror = () => reject("Error adding item");
                        request.onsuccess = (event) => resolve(event.target.result);
                    });
                },
                deleteCalories: (item) => {
                    return new Promise((resolve, reject) => {
                        const transaction = customDb._db.transaction([storeName], "readwrite");
                        const store = transaction.objectStore(storeName);
                
                        const request = store.openCursor();
                        request.onsuccess = (event) => {
                            const cursor = event.target.result;
                            if (cursor) {
                                if (JSON.stringify(cursor.value) === JSON.stringify(item)) {
                                    store.delete(cursor.key);
                                    resolve();
                                } else {
                                    cursor.continue();
                                }
                            } else {
                                reject("Item not found");
                            }
                        };
                
                        request.onerror = () => {
                            reject("Error deleting item");
                        };
                    });
                },
                
                getAll: () => {
                    return new Promise((resolve, reject) => {
                        const transaction = customDb._db.transaction([storeName], "readonly");
                        const store = transaction.objectStore(storeName);
                        const items = [];

                        store.openCursor().onsuccess = (event) => {
                            const cursor = event.target.result;
                            if (cursor) {
                                items.push(cursor.value);
                                cursor.continue();
                            } else {
                                resolve(items);
                            }
                        };

                        store.openCursor().onerror = (event) => {
                            reject("Error fetching items");
                        };
                    });
                }
            };

            resolve(customDb);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { autoIncrement: true });
            }
        };
    });
};

export { openCostsDB };
