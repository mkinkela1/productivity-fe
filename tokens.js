const loginUrl = "/api/auth/login";
const logoutUrl = "/api/auth/logout";
const refreshTokenUrl = "/api/auth/refresh-token";

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

const dbName = "tokenDB";
const dbVersion = 1;

const indexedDB =
  self.indexedDB ||
  self.mozIndexedDB ||
  self.webkitIndexedDB ||
  self.msIndexedDB;

const GlobalState = (() => {
  let db = null,
    secretKey = null,
    accessToken = "",
    refreshToken = "";

  return {
    getDb: () => db,
    setDb: (newDb) => (db = newDb),
    getSecretKey: () => secretKey,
    setSecretKey: (newSecretKey) => (secretKey = newSecretKey),
    getAccessToken: () => accessToken,
    setAccessToken: (newAccessToken) => (accessToken = newAccessToken),
    getRefreshToken: () => refreshToken,
    setRefreshToken: (newRefreshToken) => (refreshToken = newRefreshToken),
  };
})();

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = () => {
      reject("Error opening the database");
    };

    request.onsuccess = () => {
      GlobalState.setDb(request.result);
      resolve();
    };

    request.onupgradeneeded = (event) => {
      GlobalState.setDb(event.target.result);
      GlobalState.getDb().createObjectStore("tokens", { keyPath: "name" });
    };
  });
};

const encryptData = async (data) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    GlobalState.getSecretKey(),
    dataBuffer,
  );

  return {
    iv,
    token: encryptedData,
  };
};

const decryptData = async (encryptedData) => {
  try {
    const { iv, token } = encryptedData;

    const ivBuffer = new Uint8Array(iv);
    const tokenBuffer = new Uint8Array(token);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBuffer },
      GlobalState.getSecretKey(),
      tokenBuffer,
    );

    const textDecoder = new TextDecoder();
    const decryptedString = textDecoder.decode(decryptedBuffer);

    return decryptedString;
  } catch (e) {
    console.error(e);
  }
};

const saveTokensToIndexedDB = (_accessToken, _refreshToken) => {
  return new Promise(async (resolve, reject) => {
    const { token: accessToken, iv: accessTokenIv } =
      await encryptData(_accessToken);
    const { token: refreshToken, iv: refreshTokenIv } =
      await encryptData(_refreshToken);
    const transaction = GlobalState.getDb().transaction(
      ["tokens"],
      "readwrite",
    );
    const objectStore = transaction.objectStore("tokens");

    objectStore.put({
      name: ACCESS_TOKEN,
      value: { token: accessToken, iv: accessTokenIv },
    });
    objectStore.put({
      name: REFRESH_TOKEN,
      value: { token: refreshToken, iv: refreshTokenIv },
    });

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = (e) => {
      reject(`Error saving tokens to IndexedDB: ${e}`);
    };
  });
};

const restoreTokensFromIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const transaction = GlobalState.getDb().transaction(["tokens"]);
    const objectStore = transaction.objectStore("tokens");

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject("Error restoring tokens from IndexedDB");
    };

    const accessTokenRequest = objectStore.get(ACCESS_TOKEN);
    const refreshTokenRequest = objectStore.get(REFRESH_TOKEN);

    accessTokenRequest.onsuccess = async (event) => {
      try {
        const encryptedAccessToken = event.target.result?.value;
        if (encryptedAccessToken) {
          const accessToken = await decryptData(encryptedAccessToken);
          GlobalState.setAccessToken(accessToken);
        }
      } catch (e) {
        console.error(e);
      }
    };

    refreshTokenRequest.onsuccess = async (event) => {
      try {
        const encryptedRefreshToken = event.target.result?.value;
        if (encryptedRefreshToken) {
          const refreshToken = await decryptData(encryptedRefreshToken);
          GlobalState.setRefreshToken(refreshToken);
        }
      } catch (e) {
        console.error(e);
      }
    };
  });
};

const computeSecretKey = async ({ key }) => {
  const keyBuffer = Uint8Array.from(
    key
      .slice(0, 16)
      .split("")
      .map((x) => x.charCodeAt()),
  );

  return await crypto.subtle.importKey("raw", keyBuffer, "AES-GCM", false, [
    "decrypt",
    "encrypt",
  ]);
};

const setupSecrets = async (key) => {
  try {
    const secretKey = await computeSecretKey(key);

    GlobalState.setSecretKey(secretKey);

    await openDatabase();
    await restoreTokensFromIndexedDB();

    console.log("Secrets setup complete");
  } catch (error) {
    console.error("Error during setting up secrets:", error);
  }
};

const configChannel = new BroadcastChannel("configChannel");
configChannel.addEventListener("message", (event) => {
  setupSecrets(event.data.configData);
});

self.addEventListener("install", () => {
  console.log("Service worker is installing...");
});

self.addEventListener("activate", (event) => {
  console.log("Activating service worker...");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(useTokens(event));
});

const login = async (event) => {
  console.log(event);
  let response = await fetch(event.request);
  response = await response.json();

  const accessToken = response[ACCESS_TOKEN];
  const refreshToken = response[REFRESH_TOKEN];
  GlobalState.setAccessToken(accessToken);
  GlobalState.setRefreshToken(refreshToken);

  delete response[ACCESS_TOKEN];
  delete response[REFRESH_TOKEN];

  saveTokensToIndexedDB(accessToken, refreshToken).catch((error) =>
    console.error(error),
  );

  return new Response(JSON.stringify(response));
};

const logout = async (event) => {};

const authenticateRequest = async (event) => {
  const headers = new Headers(event.request.headers);
  const accessToken = GlobalState.getAccessToken();

  headers.set("Authorization", `Bearer ${accessToken}`);

  const modifiedRequest = new Request(event.request.url, {
    ...event.request,
    headers,
  });

  const response = await fetch(modifiedRequest);
  const responseJson = await response.json();

  if (response.status === 401) {
    return await refreshToken(event);
  } else return new Response(JSON.stringify(responseJson));
};

const refreshToken = async (event) => {
  console.log(event);
  const refreshResponse = await fetch(
    "http://localhost:3000/api/auth/refresh-token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: GlobalState.getRefreshToken(),
      }),
    },
  );

  if (refreshResponse.ok) {
    const data = await refreshResponse.json();

    const accessToken = data[ACCESS_TOKEN];
    const refreshToken = data[REFRESH_TOKEN];

    GlobalState.setAccessToken(accessToken);
    GlobalState.setRefreshToken(refreshToken);

    saveTokensToIndexedDB(accessToken, refreshToken).catch((error) =>
      console.error(error),
    );

    const headers = new Headers(event.request.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);

    const modifiedRequest = new Request(event.request.url, {
      ...event.request,
      headers,
    });

    return await fetch(modifiedRequest);
  }
};

const useTokens = async (event) => {
  const url = new URL(event.request.url);
  const endpoint = url.pathname;

  if (!endpoint.includes("/api/")) return await fetch(event.request);

  if (endpoint.includes(loginUrl)) {
    return await login(event);
  } else if (endpoint.includes(logoutUrl)) {
    return await logout(event);
  } else {
    return await authenticateRequest(event);
  }
};
