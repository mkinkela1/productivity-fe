const endpointsWithTokens = ["/api/auth/login", "/api/auth/refresh-token"];

const TOKEN_NAME = "accessToken";
const REFRESH_TOKEN_NAME = "refreshToken";

let accessToken = "",
  refreshToken = "";

self.addEventListener("install", () => {
  console.log("Service worker is installing...");
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
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

        return response;
      }
    })(),
  );
});
