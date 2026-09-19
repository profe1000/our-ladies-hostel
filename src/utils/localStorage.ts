export const getJSON = (key: string) => {
  const fromLocalStorage = localStorage.getItem(key) as string;
  if (!["undefined", "null"].includes(fromLocalStorage)) {
    return JSON.parse(fromLocalStorage);
  }
  return null;
};

export const getString = (key: string) => {
  const fromLocalStorage = localStorage.getItem(key) as string;
  if (!["undefined", "null"].includes(fromLocalStorage)) {
    return fromLocalStorage;
  }
  return null;
};

export const storeJSON = (key: string, payload: any) => {
  if (payload === null || payload === undefined) {
    return;
  }
  localStorage.setItem(key, JSON.stringify(payload));
};

export const storePlainString = (key: string, text: string) => {
  if (text === "" || text === null) {
    return;
  }
  localStorage.setItem(key, text);
};

export const clear = () => {
  localStorage.clear();
};

export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};
