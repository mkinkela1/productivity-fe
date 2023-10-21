const endpointsWithTokens = ["/api/auth/login", "/api/auth/refresh-token"];
const TOKEN_NAME = "accessToken";
const REFRESH_TOKEN_NAME = "refreshToken";

let accessToken = "";
let refreshToken = "";

const dbName = "tokenDB";
const dbVersion = 1;
let db;

const indexedDB =
  self.indexedDB ||
  self.mozIndexedDB ||
  self.webkitIndexedDB ||
  self.msIndexedDB;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = () => {
      reject("Error opening the database");
    };

    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      db.createObjectStore("tokens", { keyPath: "name" });
    };
  });
}

// const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
// TODO: get key from env
// const key = "text";

function encrypt(text) {
  // const encrypter = crypto.createCipheriv("aes-256-cbc", key, iv);
  // let encryptedMsg = encrypter.update(text, "utf8", "hex");
  // encryptedMsg += encrypter.final("hex");
  // return encryptedMsg;

  return text;
}

function decrypt(text) {
  // const decrypter = crypto.createDecipheriv("aes-256-cbc", key, iv);
  // let decryptedMsg = decrypter.update(text, "hex", "utf8");
  // decryptedMsg += decrypter.final("utf8");
  // return decryptedMsg;

  return text;
}

function saveTokensToIndexedDB() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["tokens"], "readwrite");
    const objectStore = transaction.objectStore("tokens");

    const encryptedAccessToken = encrypt(accessToken);
    const encryptedRefreshToken = encrypt(refreshToken);

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject("Error saving tokens to IndexedDB");
    };

    objectStore.put({ name: TOKEN_NAME, value: encryptedAccessToken });
    objectStore.put({ name: REFRESH_TOKEN_NAME, value: encryptedRefreshToken });
  });
}

function restoreTokensFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["tokens"]);
    const objectStore = transaction.objectStore("tokens");

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject("Error restoring tokens from IndexedDB");
    };

    const accessTokenRequest = objectStore.get(TOKEN_NAME);
    const refreshTokenRequest = objectStore.get(REFRESH_TOKEN_NAME);

    accessTokenRequest.onsuccess = (event) => {
      const encryptedAccessToken = event.target.result?.value;
      if (encryptedAccessToken) {
        accessToken = decrypt(encryptedAccessToken);
      }
    };

    refreshTokenRequest.onsuccess = (event) => {
      const encryptedRefreshToken = event.target.result?.value;
      if (encryptedRefreshToken) {
        refreshToken = decrypt(encryptedRefreshToken);
      }
    };
  });
}

self.addEventListener("install", () => {
  console.log("Service worker is installing...");
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
  openDatabase()
    .then(restoreTokensFromIndexedDB)
    .catch((error) => console.error(error));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async function () {
      let response = await fetch(event.request);
      const url = new URL(event.request.url);
      const endpoint = url.pathname;

      if (!endpoint.includes("/api/")) return response;

      response = await response.json();

      if (endpointsWithTokens.includes(endpoint)) {
        accessToken = response[TOKEN_NAME];
        refreshToken = response[REFRESH_TOKEN_NAME];

        delete response[TOKEN_NAME];
        delete response[REFRESH_TOKEN_NAME];

        saveTokensToIndexedDB().catch((error) => console.error(error));

        return new Response(JSON.stringify(response));
      } else {
        const headers = new Headers(event.request.headers);
        headers.append("Authorization", `Bearer ${accessToken}`);

        const newRequest = new Request(event.request.url, {
          ...event.request,
          method: event.request.method,
          headers,
        });

        const response = await fetch(newRequest);

        return response;
      }
    })(),
  );
});

/*if (response.status === 401) {
            const refreshResponse = await fetch(
              "http://localhost:3000/api/auth/refresh-token",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  refreshToken,
                }),
              },
            );
  
            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              accessToken = data[TOKEN_NAME];
              refreshToken = data[REFRESH_TOKEN_NAME];
  
              const headers = new Headers(event.request.headers);
              headers.append("Authorization", `Bearer ${accessToken}`);
              event.request = new Request(event.request, {
                headers: headers,
              });
  
              return fetch(event.request);
            }
          }*/
