type storageType = "local" | "session";

export const setStorage = (
  key: string,
  data: any,
  storageType: storageType = "local"
) => {
  if (typeof data !== "string") {
    data = JSON.stringify(data);
  }
  if (storageType === "local") {
    localStorage.setItem(key, data as string);
  } else {
    sessionStorage.setItem(key, data as string);
  }
};

export const getStorage = (key: string, storageType: storageType = "local") => {
  let result;
  if (storageType === "local") {
    result = localStorage.getItem(key);
  } else {
    result = sessionStorage.getItem(key);
  }
  if (result === null) return null;
  try {
    return JSON.parse(result);
  } catch (error) {
    return result;
  }
};
