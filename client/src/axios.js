import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/api/";
console.log("hello");

export default axios.create({});
