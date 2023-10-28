const { generateApi } = require('swagger-typescript-api');
const path = require("path");
const fs = require("fs");

generateApi({
  name: "Api.ts",
  url: "http://localhost:3000/api-json",
  output: path.resolve(__dirname, "src/endpoints/__generated__/"),
  httpClientType: "axios",
  cleanOutput: true,
  singleHttpClient: true,
  moduleNameIndex: 0,
  extractRequestBody: true,
  extractRequestParams: true,
  extractResponseBody: true,
  extractResponseError: true,
  generateResponses: true,
  sortTypes: true,
  hooks: {
    onCreateComponent: (component) => {},
    onCreateRequestParams: (rawType) => {},
    onCreateRoute: (routeData) => {},
    onCreateRouteName: (routeNameInfo, rawRouteInfo) => {},
    onFormatTypeName: (typeName, rawTypeName, schemaType) => {},
    onInit: (configuration) => {},
    onPreParseSchema: (originalSchema, typeName, schemaType) => {},
    onParseSchema: (originalSchema, parsedSchema) => {},
    onPrepareConfig: (currentConfiguration) => {},
    onFormatRouteName: (routeInfo, templateRouteName) => {
      return routeInfo.operationId.split("_").splice(1).join("_");

    },
  }
})
  .then(({ files }) => {
    files.forEach(({ content }) => {
      fs.writeFileSync(path, JSON.stringify(content));
    });
  })
  .catch(e => console.error(e))