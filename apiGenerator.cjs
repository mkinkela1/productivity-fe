const { generateApi } = require('swagger-typescript-api');
const path = require("path");
const fs = require("fs");

generateApi({
  name: "Api.ts",
  url: "http://localhost:3000/api-json",
  output: path.resolve(__dirname, "src/api"),
  httpClientType: "axios",
  cleanOutput: true,
  singleHttpClient: true,
  moduleNameIndex: 2,
  extractRequestBody: true,
  extractRequestParams: true,
  extractResponseBody: true,
  extractResponseError: true,
  generateResponses: true,
  sortTypes: true,
  hooks: {
    onFormatRouteName: (routeInfo, templateRouteName) => {
      return routeInfo.operationId.split("_").splice(1).join("_");

    },
  }
})
  .then(({ files, configuration }) => {
    files.forEach(({ content, name }) => {
      fs.writeFile(path, content);
    });
  })
  .catch(e => console.error(e))