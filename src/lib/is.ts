const isString = (value: any): value is string => {
  return typeof value === "string" || value instanceof String;
};

const isNumber = (value: any): value is number => {
  return typeof value === "number" && isFinite(value);
};

const isBoolean = (value: any): value is boolean => {
  return typeof value === "boolean";
};

const isArray = (value: any): value is Array<any> => {
  return Array.isArray(value);
};

const isObject = (value: any): value is Record<string, any> => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const isFunction = (value: any): value is Function => {
  return typeof value === "function";
};

const isDate = (value: any): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

export { isString, isNumber, isBoolean, isArray, isObject, isFunction, isDate };
