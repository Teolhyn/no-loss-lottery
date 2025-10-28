import "./chunk-PLDDJCW6.js";

// node_modules/lossless-json/lib/esm/config.js
function config(_options) {
  throw new Error("config is deprecated, support for circularRefs is removed from the library. If you encounter circular references in your data structures, please rethink your datastructures: better prevent circular references in the first place.");
}

// node_modules/lossless-json/lib/esm/utils.js
function isInteger(value) {
  return INTEGER_REGEX.test(value);
}
var INTEGER_REGEX = /^-?[0-9]+$/;
function isNumber(value) {
  return NUMBER_REGEX.test(value);
}
var NUMBER_REGEX = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
function isSafeNumber(value, config2) {
  if (isInteger(value)) {
    return Number.isSafeInteger(Number.parseInt(value, 10));
  }
  const num = Number.parseFloat(value);
  const parsed = String(num);
  if (value === parsed) {
    return true;
  }
  const valueDigits = extractSignificantDigits(value);
  const parsedDigits = extractSignificantDigits(parsed);
  if (valueDigits === parsedDigits) {
    return true;
  }
  if (config2?.approx === true) {
    const requiredDigits = 14;
    if (!isInteger(value) && parsedDigits.length >= requiredDigits && valueDigits.startsWith(parsedDigits.substring(0, requiredDigits))) {
      return true;
    }
  }
  return false;
}
var UnsafeNumberReason = (function(UnsafeNumberReason2) {
  UnsafeNumberReason2["underflow"] = "underflow";
  UnsafeNumberReason2["overflow"] = "overflow";
  UnsafeNumberReason2["truncate_integer"] = "truncate_integer";
  UnsafeNumberReason2["truncate_float"] = "truncate_float";
  return UnsafeNumberReason2;
})({});
function getUnsafeNumberReason(value) {
  if (isSafeNumber(value, {
    approx: false
  })) {
    return void 0;
  }
  if (isInteger(value)) {
    return UnsafeNumberReason.truncate_integer;
  }
  const num = Number.parseFloat(value);
  if (!Number.isFinite(num)) {
    return UnsafeNumberReason.overflow;
  }
  if (num === 0) {
    return UnsafeNumberReason.underflow;
  }
  return UnsafeNumberReason.truncate_float;
}
function toSafeNumberOrThrow(value, config2) {
  const number = Number.parseFloat(value);
  const unsafeReason = getUnsafeNumberReason(value);
  if (config2?.approx === true ? unsafeReason && unsafeReason !== UnsafeNumberReason.truncate_float : unsafeReason) {
    const unsafeReasonText = unsafeReason?.replace(/_\w+$/, "");
    throw new Error(`Cannot safely convert to number: the value '${value}' would ${unsafeReasonText} and become ${number}`);
  }
  return number;
}
function splitNumber(value) {
  const match = value.match(/^(-?)(\d+\.?\d*)([eE]([+-]?\d+))?$/);
  if (!match) {
    throw new SyntaxError(`Invalid number: ${value}`);
  }
  const sign = match[1];
  const digitsStr = match[2];
  let exponent = match[4] !== void 0 ? Number.parseInt(match[4], 10) : 0;
  const dot = digitsStr.indexOf(".");
  exponent += dot !== -1 ? dot - 1 : digitsStr.length - 1;
  const digits = digitsStr.replace(".", "").replace(/^0*/, (zeros) => {
    exponent -= zeros.length;
    return "";
  }).replace(/0*$/, "");
  return digits.length > 0 ? {
    sign,
    digits,
    exponent
  } : {
    sign,
    digits: "0",
    exponent: exponent + 1
  };
}
function compareNumber(a, b) {
  if (a === b) {
    return 0;
  }
  const aa = splitNumber(a);
  const bb = splitNumber(b);
  const sign = aa.sign === "-" ? -1 : 1;
  if (aa.sign !== bb.sign) {
    if (aa.digits === "0" && bb.digits === "0") {
      return 0;
    }
    return sign;
  }
  if (aa.exponent !== bb.exponent) {
    return aa.exponent > bb.exponent ? sign : aa.exponent < bb.exponent ? -sign : 0;
  }
  return aa.digits > bb.digits ? sign : aa.digits < bb.digits ? -sign : 0;
}
function countSignificantDigits(value) {
  const {
    start,
    end
  } = getSignificantDigitRange(value);
  const dot = value.indexOf(".");
  if (dot === -1 || dot < start || dot > end) {
    return end - start;
  }
  return end - start - 1;
}
function extractSignificantDigits(value) {
  const {
    start,
    end
  } = getSignificantDigitRange(value);
  const digits = value.substring(start, end);
  const dot = digits.indexOf(".");
  if (dot === -1) {
    return digits;
  }
  return digits.substring(0, dot) + digits.substring(dot + 1);
}
function getSignificantDigitRange(value) {
  let start = 0;
  if (value[0] === "-") {
    start++;
  }
  while (value[start] === "0" || value[start] === ".") {
    start++;
  }
  let end = value.lastIndexOf("e");
  if (end === -1) {
    end = value.lastIndexOf("E");
  }
  if (end === -1) {
    end = value.length;
  }
  while ((value[end - 1] === "0" || value[end - 1] === ".") && end > start) {
    end--;
  }
  return {
    start,
    end
  };
}

// node_modules/lossless-json/lib/esm/LosslessNumber.js
var LosslessNumber = class {
  // numeric value as string
  // type information
  isLosslessNumber = true;
  constructor(value) {
    if (!isNumber(value)) {
      throw new Error(`Invalid number (value: "${value}")`);
    }
    this.value = value;
  }
  /**
   * Get the value of the LosslessNumber as number or bigint.
   *
   * - a number is returned for safe numbers and decimal values that only lose some insignificant digits
   * - a bigint is returned for big integer numbers
   * - an Error is thrown for values that will overflow or underflow
   *
   * Note that you can implement your own strategy for conversion by just getting the value as string
   * via .toString(), and using util functions like isInteger, isSafeNumber, getUnsafeNumberReason,
   * and toSafeNumberOrThrow to convert it to a numeric value.
   */
  valueOf() {
    const unsafeReason = getUnsafeNumberReason(this.value);
    if (unsafeReason === void 0 || unsafeReason === UnsafeNumberReason.truncate_float) {
      return Number.parseFloat(this.value);
    }
    if (isInteger(this.value)) {
      return BigInt(this.value);
    }
    throw new Error(`Cannot safely convert to number: the value '${this.value}' would ${unsafeReason} and become ${Number.parseFloat(this.value)}`);
  }
  /**
   * Get the value of the LosslessNumber as string.
   */
  toString() {
    return this.value;
  }
  // Note: we do NOT implement a .toJSON() method, and you should not implement
  // or use that, it cannot safely turn the numeric value in the string into
  // stringified JSON since it has to be parsed into a number first.
};
function isLosslessNumber(value) {
  return value && typeof value === "object" && value.isLosslessNumber || false;
}
function toLosslessNumber(value) {
  const maxDigits = 15;
  if (countSignificantDigits(String(value)) > maxDigits) {
    throw new Error(`Invalid number: contains more than 15 digits and is most likely truncated and unsafe by itself (value: ${value})`);
  }
  if (Number.isNaN(value)) {
    throw new Error("Invalid number: NaN");
  }
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid number: ${value}`);
  }
  return new LosslessNumber(String(value));
}
function compareLosslessNumber(a, b) {
  return compareNumber(a.value, b.value);
}

// node_modules/lossless-json/lib/esm/numberParsers.js
function parseLosslessNumber(value) {
  return new LosslessNumber(value);
}
function parseNumberAndBigInt(value) {
  return isInteger(value) ? BigInt(value) : Number.parseFloat(value);
}

// node_modules/lossless-json/lib/esm/revive.js
function revive(json, reviver) {
  return reviveValue({
    "": json
  }, "", json, reviver);
}
function reviveValue(context, key, value, reviver) {
  if (Array.isArray(value)) {
    return reviver.call(context, key, reviveArray(value, reviver));
  }
  if (value && typeof value === "object" && !isLosslessNumber(value)) {
    return reviver.call(context, key, reviveObject(value, reviver));
  }
  return reviver.call(context, key, value);
}
function reviveObject(object, reviver) {
  for (const key of Object.keys(object)) {
    const value = reviveValue(object, key, object[key], reviver);
    if (value !== void 0) {
      object[key] = value;
    } else {
      delete object[key];
    }
  }
  return object;
}
function reviveArray(array, reviver) {
  for (let i = 0; i < array.length; i++) {
    array[i] = reviveValue(array, String(i), array[i], reviver);
  }
  return array;
}

// node_modules/lossless-json/lib/esm/parse.js
function parse(text, reviver) {
  let parseNumber = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : parseLosslessNumber;
  let i = 0;
  const value = parseValue();
  expectValue(value);
  expectEndOfInput();
  return reviver ? revive(value, reviver) : value;
  function parseObject() {
    if (text.charCodeAt(i) === codeOpeningBrace) {
      i++;
      skipWhitespace();
      const object = {};
      let initial = true;
      while (i < text.length && text.charCodeAt(i) !== codeClosingBrace) {
        if (!initial) {
          eatComma();
          skipWhitespace();
        } else {
          initial = false;
        }
        const start = i;
        const key = parseString();
        if (key === void 0) {
          throwObjectKeyExpected();
          return;
        }
        skipWhitespace();
        eatColon();
        const value2 = parseValue();
        if (value2 === void 0) {
          throwObjectValueExpected();
          return;
        }
        if (Object.prototype.hasOwnProperty.call(object, key) && !isDeepEqual(value2, object[key])) {
          throwDuplicateKey(key, start + 1);
        }
        object[key] = value2;
      }
      if (text.charCodeAt(i) !== codeClosingBrace) {
        throwObjectKeyOrEndExpected();
      }
      i++;
      return object;
    }
  }
  function parseArray() {
    if (text.charCodeAt(i) === codeOpeningBracket) {
      i++;
      skipWhitespace();
      const array = [];
      let initial = true;
      while (i < text.length && text.charCodeAt(i) !== codeClosingBracket) {
        if (!initial) {
          eatComma();
        } else {
          initial = false;
        }
        const value2 = parseValue();
        expectArrayItem(value2);
        array.push(value2);
      }
      if (text.charCodeAt(i) !== codeClosingBracket) {
        throwArrayItemOrEndExpected();
      }
      i++;
      return array;
    }
  }
  function parseValue() {
    skipWhitespace();
    const value2 = parseString() ?? parseNumeric() ?? parseObject() ?? parseArray() ?? parseKeyword("true", true) ?? parseKeyword("false", false) ?? parseKeyword("null", null);
    skipWhitespace();
    return value2;
  }
  function parseKeyword(name, value2) {
    if (text.slice(i, i + name.length) === name) {
      i += name.length;
      return value2;
    }
  }
  function skipWhitespace() {
    while (isWhitespace(text.charCodeAt(i))) {
      i++;
    }
  }
  function parseString() {
    if (text.charCodeAt(i) === codeDoubleQuote) {
      i++;
      let result = "";
      while (i < text.length && text.charCodeAt(i) !== codeDoubleQuote) {
        if (text.charCodeAt(i) === codeBackslash) {
          const char = text[i + 1];
          const escapeChar = escapeCharacters[char];
          if (escapeChar !== void 0) {
            result += escapeChar;
            i++;
          } else if (char === "u") {
            if (isHex(text.charCodeAt(i + 2)) && isHex(text.charCodeAt(i + 3)) && isHex(text.charCodeAt(i + 4)) && isHex(text.charCodeAt(i + 5))) {
              result += String.fromCharCode(Number.parseInt(text.slice(i + 2, i + 6), 16));
              i += 5;
            } else {
              throwInvalidUnicodeCharacter(i);
            }
          } else {
            throwInvalidEscapeCharacter(i);
          }
        } else {
          if (isValidStringCharacter(text.charCodeAt(i))) {
            result += text[i];
          } else {
            throwInvalidCharacter(text[i]);
          }
        }
        i++;
      }
      expectEndOfString();
      i++;
      return result;
    }
  }
  function parseNumeric() {
    const start = i;
    if (text.charCodeAt(i) === codeMinus) {
      i++;
      expectDigit(start);
    }
    if (text.charCodeAt(i) === codeZero) {
      i++;
    } else if (isNonZeroDigit(text.charCodeAt(i))) {
      i++;
      while (isDigit(text.charCodeAt(i))) {
        i++;
      }
    }
    if (text.charCodeAt(i) === codeDot) {
      i++;
      expectDigit(start);
      while (isDigit(text.charCodeAt(i))) {
        i++;
      }
    }
    if (text.charCodeAt(i) === codeLowercaseE || text.charCodeAt(i) === codeUppercaseE) {
      i++;
      if (text.charCodeAt(i) === codeMinus || text.charCodeAt(i) === codePlus) {
        i++;
      }
      expectDigit(start);
      while (isDigit(text.charCodeAt(i))) {
        i++;
      }
    }
    if (i > start) {
      return parseNumber(text.slice(start, i));
    }
  }
  function eatComma() {
    if (text.charCodeAt(i) !== codeComma) {
      throw new SyntaxError(`Comma ',' expected after value ${gotAt()}`);
    }
    i++;
  }
  function eatColon() {
    if (text.charCodeAt(i) !== codeColon) {
      throw new SyntaxError(`Colon ':' expected after property name ${gotAt()}`);
    }
    i++;
  }
  function expectValue(value2) {
    if (value2 === void 0) {
      throw new SyntaxError(`JSON value expected ${gotAt()}`);
    }
  }
  function expectArrayItem(value2) {
    if (value2 === void 0) {
      throw new SyntaxError(`Array item expected ${gotAt()}`);
    }
  }
  function expectEndOfInput() {
    if (i < text.length) {
      throw new SyntaxError(`Expected end of input ${gotAt()}`);
    }
  }
  function expectDigit(start) {
    if (!isDigit(text.charCodeAt(i))) {
      const numSoFar = text.slice(start, i);
      throw new SyntaxError(`Invalid number '${numSoFar}', expecting a digit ${gotAt()}`);
    }
  }
  function expectEndOfString() {
    if (text.charCodeAt(i) !== codeDoubleQuote) {
      throw new SyntaxError(`End of string '"' expected ${gotAt()}`);
    }
  }
  function throwObjectKeyExpected() {
    throw new SyntaxError(`Quoted object key expected ${gotAt()}`);
  }
  function throwDuplicateKey(key, pos2) {
    throw new SyntaxError(`Duplicate key '${key}' encountered at position ${pos2}`);
  }
  function throwObjectKeyOrEndExpected() {
    throw new SyntaxError(`Quoted object key or end of object '}' expected ${gotAt()}`);
  }
  function throwArrayItemOrEndExpected() {
    throw new SyntaxError(`Array item or end of array ']' expected ${gotAt()}`);
  }
  function throwInvalidCharacter(char) {
    throw new SyntaxError(`Invalid character '${char}' ${pos()}`);
  }
  function throwInvalidEscapeCharacter(start) {
    const chars = text.slice(start, start + 2);
    throw new SyntaxError(`Invalid escape character '${chars}' ${pos()}`);
  }
  function throwObjectValueExpected() {
    throw new SyntaxError(`Object value expected after ':' ${pos()}`);
  }
  function throwInvalidUnicodeCharacter(start) {
    const chars = text.slice(start, start + 6);
    throw new SyntaxError(`Invalid unicode character '${chars}' ${pos()}`);
  }
  function pos() {
    return `at position ${i}`;
  }
  function got() {
    return i < text.length ? `but got '${text[i]}'` : "but reached end of input";
  }
  function gotAt() {
    return `${got()} ${pos()}`;
  }
}
function isWhitespace(code) {
  return code === codeSpace || code === codeNewline || code === codeTab || code === codeReturn;
}
function isHex(code) {
  return code >= codeZero && code <= codeNine || code >= codeUppercaseA && code <= codeUppercaseF || code >= codeLowercaseA && code <= codeLowercaseF;
}
function isDigit(code) {
  return code >= codeZero && code <= codeNine;
}
function isNonZeroDigit(code) {
  return code >= codeOne && code <= codeNine;
}
function isValidStringCharacter(code) {
  return code >= 32 && code <= 1114111;
}
function isDeepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => isDeepEqual(item, b[index]));
  }
  if (isObject(a) && isObject(b)) {
    const keys = [.../* @__PURE__ */ new Set([...Object.keys(a), ...Object.keys(b)])];
    return keys.every((key) => isDeepEqual(a[key], b[key]));
  }
  return false;
}
function isObject(value) {
  return typeof value === "object" && value !== null;
}
var escapeCharacters = {
  '"': '"',
  "\\": "\\",
  "/": "/",
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "	"
  // note that \u is handled separately in parseString()
};
var codeBackslash = 92;
var codeOpeningBrace = 123;
var codeClosingBrace = 125;
var codeOpeningBracket = 91;
var codeClosingBracket = 93;
var codeSpace = 32;
var codeNewline = 10;
var codeTab = 9;
var codeReturn = 13;
var codeDoubleQuote = 34;
var codePlus = 43;
var codeMinus = 45;
var codeZero = 48;
var codeOne = 49;
var codeNine = 57;
var codeComma = 44;
var codeDot = 46;
var codeColon = 58;
var codeUppercaseA = 65;
var codeLowercaseA = 97;
var codeUppercaseE = 69;
var codeLowercaseE = 101;
var codeUppercaseF = 70;
var codeLowercaseF = 102;

// node_modules/lossless-json/lib/esm/reviveDate.js
function reviveDate(_key, value) {
  return typeof value === "string" && isoDateRegex.test(value) ? new Date(value) : value;
}
var isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

// node_modules/lossless-json/lib/esm/stringify.js
function stringify(value, replacer, space, numberStringifiers) {
  const resolvedSpace = resolveSpace(space);
  const replacedValue = typeof replacer === "function" ? replacer.call({
    "": value
  }, "", value) : value;
  return stringifyValue(replacedValue, "");
  function stringifyValue(value2, indent) {
    if (Array.isArray(numberStringifiers)) {
      const stringifier = numberStringifiers.find((item) => item.test(value2));
      if (stringifier) {
        const str = stringifier.stringify(value2);
        if (typeof str !== "string" || !isNumber(str)) {
          throw new Error(`Invalid JSON number: output of a number stringifier must be a string containing a JSON number (output: ${str})`);
        }
        return str;
      }
    }
    if (typeof value2 === "boolean" || typeof value2 === "number" || typeof value2 === "string" || value2 === null || value2 instanceof Date || value2 instanceof Boolean || value2 instanceof Number || value2 instanceof String) {
      return JSON.stringify(value2);
    }
    if (value2?.isLosslessNumber) {
      return value2.toString();
    }
    if (typeof value2 === "bigint") {
      return value2.toString();
    }
    if (Array.isArray(value2)) {
      return stringifyArray(value2, indent);
    }
    if (value2 && typeof value2 === "object") {
      return stringifyObject(value2, indent);
    }
    return void 0;
  }
  function stringifyArray(array, indent) {
    if (array.length === 0) {
      return "[]";
    }
    const childIndent = resolvedSpace ? indent + resolvedSpace : void 0;
    let str = resolvedSpace ? "[\n" : "[";
    for (let i = 0; i < array.length; i++) {
      const item = typeof replacer === "function" ? replacer.call(array, String(i), array[i]) : array[i];
      if (resolvedSpace) {
        str += childIndent;
      }
      if (typeof item !== "undefined" && typeof item !== "function") {
        str += stringifyValue(item, childIndent);
      } else {
        str += "null";
      }
      if (i < array.length - 1) {
        str += resolvedSpace ? ",\n" : ",";
      }
    }
    str += resolvedSpace ? `
${indent}]` : "]";
    return str;
  }
  function stringifyObject(object, indent) {
    if (typeof object.toJSON === "function") {
      return stringify(object.toJSON(), replacer, space, void 0);
    }
    const keys = Array.isArray(replacer) ? replacer.map(String) : Object.keys(object);
    if (keys.length === 0) {
      return "{}";
    }
    const childIndent = resolvedSpace ? indent + resolvedSpace : void 0;
    let first = true;
    let str = resolvedSpace ? "{\n" : "{";
    for (const key of keys) {
      const value2 = typeof replacer === "function" ? replacer.call(object, key, object[key]) : object[key];
      if (includeProperty(key, value2)) {
        if (first) {
          first = false;
        } else {
          str += resolvedSpace ? ",\n" : ",";
        }
        const keyStr = JSON.stringify(key);
        str += resolvedSpace ? `${childIndent + keyStr}: ` : `${keyStr}:`;
        str += stringifyValue(value2, childIndent);
      }
    }
    str += resolvedSpace ? `
${indent}}` : "}";
    return str;
  }
  function includeProperty(_key, value2) {
    return typeof value2 !== "undefined" && typeof value2 !== "function" && typeof value2 !== "symbol";
  }
}
function resolveSpace(space) {
  if (typeof space === "number") {
    return " ".repeat(space);
  }
  if (typeof space === "string" && space !== "") {
    return space;
  }
  return void 0;
}
export {
  LosslessNumber,
  UnsafeNumberReason,
  compareLosslessNumber,
  compareNumber,
  config,
  getUnsafeNumberReason,
  isInteger,
  isLosslessNumber,
  isNumber,
  isSafeNumber,
  parse,
  parseLosslessNumber,
  parseNumberAndBigInt,
  reviveDate,
  splitNumber,
  stringify,
  toLosslessNumber,
  toSafeNumberOrThrow
};
//# sourceMappingURL=lossless-json.js.map
