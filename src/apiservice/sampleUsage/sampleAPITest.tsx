import { useEffect, useState } from "react";
import useFormatApiRequest from "../../hooks/formatApiRequest";
import { sampleApiCall } from "./sample";


export const SampleApiTest = () => {
  const [count, setCount] = useState(0);
  const [loadApi, setLoadApi] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCount((count) => count + 1);
    }, 1000);
  }, [count]);

  const result = useFormatApiRequest(() => sampleApiCall({}), loadApi);

  useEffect(() => {
    setLoadApi(false);
    processApi();
  }, [result.httpState]);

  //Process Api
  const processApi = async () => {
    console.log(result.httpState);
  };

  // Reload Api when needed.
  const reLoadApi = async () => {
    setLoadApi(true);
  };

  return (
    <>
      <div className="w3-light-grey">
        <div className="w3-content contentmargin w3-round">
          {/* This Block is for Redux Test */}
          <div className="w3-margin-top">
            <h1>I've rendered {count} times!</h1>
            <span>
              This is a sample API call with an independent Events (Timer), API
              is only trigger when reload button is press.
            </span><br />
            <button onClick={() => reLoadApi()}>Reload</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SampleApiTest;
