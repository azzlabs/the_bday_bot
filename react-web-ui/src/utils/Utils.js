export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

export const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

export const formatValue = (value) =>
  Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 3,
    notation: 'compact',
  }).format(value);

export const formatThousands = (value) =>
  Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 3,
    notation: 'compact',
  }).format(value);

const BASE_URL = process.env.REACT_APP_API_URL;
const API_TOKEN = null;//process.env.REACT_APP_API_TOKEN;

export const http = async ({ method, url, form, json = true }) => {
  const fullUrl = url.indexOf('http') === 0 ? url : BASE_URL + url;
  const options = {
    method: method || 'GET',
    headers: {},
    body: !form ? undefined : form instanceof FormData ? form : JSON.stringify(form),
  };
  if (!form || !(form instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
  }
  const authToken = API_TOKEN; //new Cookies().get(AUTH_COOKIE_VAR);
  if (authToken) {
    options.headers.Authorization = `Bearer ${authToken}`;
  }
  const res = await fetch(fullUrl, options);
  let content;
  try {
    content = json ? await res.json() : await res.text();
  } catch (e) {}

  if (!res.ok) {
    if (!content) {
      throw res.statusText;
    } else {
      throw content;
    }
  } else {
    return content;
  }
};

export const IS_MOBILE = window.innerWidth < 768;

export const AUTH_COOKIE_VAR = 'auth';
export const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
export const PHONE_REGEX = /^[0-9]{9,16}$/;
export const POSTAL_CODE_REGEX = /^[0-9]{5}$/;
export const SDI_REGEX = /^[a-zA-Z0-9]{7}$/;
export const VAT_NUMBER_REGEX = /^[0-9]{11}$/;
export const NATIONAL_ID_REGEX =
  /^((?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]|[0-9]{11})$/i;
export const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i;

export const MOVOLAB_ROLE_ADMIN = 'admin';
export const USER_ROLE_CLIENT = 'client';
export const CLIENT_ROLE_ADMIN = 'clientAdmin';
export const CLIENT_ROLE_OPERATOR = 'clientOperator';
export const CORPORATE_ROLE_ADMIN = 'corporateAdmin';
export const CORPORATE_ROLE_OPERATOR = 'corporateOperator';

export const removeUndefinedNullAndEmpty = (obj) => {
  for (let key in obj) {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      removeUndefinedNullAndEmpty(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }
  return obj;
};

const checkIncludes = (object, value) => {
  if (typeof object === 'string') {
    return object.toLowerCase().includes(value);
  } else if (Array.isArray(object)) {
    for (const item of object) {
      if (checkIncludes(item, value) === true) {
        return true;
      }
    }
    return false;
  } else if (typeof object === 'object') {
    for (const key in object) {
      if (typeof object[key] === 'string') {
        if (String(object[key]).toLowerCase().includes(value)) {
          return true;
        }
      } else if (Array.isArray(object[key])) {
        for (const item1 of object[key]) {
          if (checkIncludes(item1, value) === true) {
            return true;
          }
        }
      } else if (typeof object[key] === 'object') {
        if (checkIncludes(object[key], value) === true) {
          return true;
        }
      }
    }
    return false;
  } else return false;
};

export const filterDataByValue = (data, value) => {
  const val = String(value).toLowerCase();
  return checkIncludes(data, val);
};

export const exportToCsv = (filename, dataArray) => {
  const csvContent = dataArray.map((row) => row.join(',')).join('\n');
  const csvData = new Blob([csvContent], { type: 'text/csv' });

  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(csvData, filename);
  } else {
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(csvData);

    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();

    URL.revokeObjectURL(url);
  }
};

export const countDays = (pickUp, dropOff, rentBuffer = 0) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const pickUpDate = new Date(pickUp);
  const dropOffDate = new Date(dropOff);
  const minutesDiff = rentBuffer * 60 * 1000;

  if (dropOffDate < pickUpDate) {
    return 0;
  }

  const diffDays = Math.ceil(Math.abs((dropOffDate - pickUpDate - minutesDiff) / oneDay));
  return Math.max(diffDays, 1);
};

export const urlSerialize = (obj) => {
  const str = [];
  for (const p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
    }
  return str.join('&');
};

export const gn = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);