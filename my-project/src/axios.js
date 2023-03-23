import axios from "axios";

const instance = axios.create({
  baseURL: "https://easy-gray-crab-cape.cyclic.app",
});

export default instance;
