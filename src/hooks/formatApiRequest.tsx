import { useState, useEffect } from "react";

export type IHttpState = "NOTSTARTED" | "LOADING" | "ERROR" | "SUCCESS";

const useFormatApiRequest = (
  apiRequest: any,
  loadApi: Boolean,
  preReqFunc?: () => void,
  onStateChanged?: () => void
) => {
  const [data, setData] = useState<any>(null);
  const [httpCode, setHttpCode] = useState(0);
  const [httpState, setHttpState] = useState<IHttpState>("NOTSTARTED");
  const [errorMsg, setErrorMsg] = useState<any>(null);

  useEffect(() => {
    if (loadApi) {
      if (preReqFunc) {
        preReqFunc();
      }
      makeApiRequest();
    }
  }, [loadApi]);

  useEffect(() => {
    if (onStateChanged) {
      onStateChanged();
    }
  }, [httpState]);

  const resetSet = async () => {
    setHttpState("LOADING");
    setData(null);
    setErrorMsg(null);
    setHttpCode(0);
  };

  const makeApiRequest = async () => {
    resetSet();
    try {
      const data = await apiRequest();
      setData(data);
      setErrorMsg(null);
      setHttpState("SUCCESS");
      setHttpCode(200);
    } catch (error: any) {
      setData(error);
      setErrorMsg(error?.message);
      setHttpState("ERROR");
      setHttpCode(error?.response?.status);
    }
  };
  return { data, httpCode, httpState, errorMsg };
};

export default useFormatApiRequest;
