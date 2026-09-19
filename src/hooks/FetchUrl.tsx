import { useState, useEffect } from "react";

const useFetch = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setHasData(true);
      });
  }, [url]);
  return { data, hasData };
};

export default useFetch;
