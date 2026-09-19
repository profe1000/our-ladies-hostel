export const convertObjToQueryParams = (obj: any) => {
  return "?" + new URLSearchParams(obj).toString();
};

export const getFormData = (data: any): FormData => {
  const formData = new FormData();
  const keys = Object.keys(data);
  keys.forEach((key) => {
    formData.append(key, data[key] ?? "");
  });
  return formData;
};

export const getAndAppendFormData = (data: any, formData: FormData) => {
  const keys = Object.keys(data);
  keys.forEach((key) => {
    formData.set(key, data[key] ?? "");
  });
};

// Format the price above to USD using the locale, style, and currency.
let USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

let nairaFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NGN",
});

export const formatCurrency = (price: any) => {
  return nairaFormat.format(Number(price));
};
