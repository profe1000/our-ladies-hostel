import instance from "../../utils/axios.wrapper";

export const sampleApiCall = async (body: any) => {
  const axios = await instance("", "https://jsonplaceholder.typicode.com/",true);
  const { data } = await axios.get("/todos");
  const result = await data;
  return result;
};
