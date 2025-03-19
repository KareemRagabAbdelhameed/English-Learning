import axios from "axios";

const apiBaseUrl = axios.create({
    baseURL : "http://localhost:5000",

});
export default apiBaseUrl;