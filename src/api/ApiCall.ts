import { Api, HttpClient } from "src/api/Api";

const httpClient = new HttpClient({
  baseURL: "http://localhost:3000/",
});
const ApiCall = new Api(httpClient);

export default ApiCall;
