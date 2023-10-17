import { Api, HttpClient } from "src/endpoints/__generated__/Api";

const httpClient = new HttpClient({
  baseURL: "http://localhost:3000/",
});
const ApiCall = new Api(httpClient).api;

export default ApiCall;
