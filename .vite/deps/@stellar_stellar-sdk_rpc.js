import {
  __commonJS
} from "./chunk-PLDDJCW6.js";

// node_modules/@stellar/stellar-sdk/lib/rpc/api.js
var require_api = __commonJS({
  "node_modules/@stellar/stellar-sdk/lib/rpc/api.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Api = void 0;
    var Api;
    (function(_Api) {
      var GetTransactionStatus = (function(GetTransactionStatus2) {
        GetTransactionStatus2["SUCCESS"] = "SUCCESS";
        GetTransactionStatus2["NOT_FOUND"] = "NOT_FOUND";
        GetTransactionStatus2["FAILED"] = "FAILED";
        return GetTransactionStatus2;
      })({});
      _Api.GetTransactionStatus = GetTransactionStatus;
      function isSimulationError(sim) {
        return "error" in sim;
      }
      _Api.isSimulationError = isSimulationError;
      function isSimulationSuccess(sim) {
        return "transactionData" in sim;
      }
      _Api.isSimulationSuccess = isSimulationSuccess;
      function isSimulationRestore(sim) {
        return isSimulationSuccess(sim) && "restorePreamble" in sim && !!sim.restorePreamble.transactionData;
      }
      _Api.isSimulationRestore = isSimulationRestore;
      function isSimulationRaw(sim) {
        return !sim._parsed;
      }
      _Api.isSimulationRaw = isSimulationRaw;
    })(Api || (exports.Api = Api = {}));
  }
});

// node_modules/urijs/src/punycode.js
var require_punycode = __commonJS({
  "node_modules/urijs/src/punycode.js"(exports, module) {
    (function(root) {
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = typeof module == "object" && module && !module.nodeType && module;
      var freeGlobal = typeof global == "object" && global;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
        root = freeGlobal;
      }
      var punycode, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, errors = {
        "overflow": "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      }, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, key;
      function error(type) {
        throw new RangeError(errors[type]);
      }
      function map(array, fn) {
        var length = array.length;
        var result = [];
        while (length--) {
          result[length] = fn(array[length]);
        }
        return result;
      }
      function mapDomain(string, fn) {
        var parts = string.split("@");
        var result = "";
        if (parts.length > 1) {
          result = parts[0] + "@";
          string = parts[1];
        }
        string = string.replace(regexSeparators, ".");
        var labels = string.split(".");
        var encoded = map(labels, fn).join(".");
        return result + encoded;
      }
      function ucs2decode(string) {
        var output = [], counter = 0, length = string.length, value, extra;
        while (counter < length) {
          value = string.charCodeAt(counter++);
          if (value >= 55296 && value <= 56319 && counter < length) {
            extra = string.charCodeAt(counter++);
            if ((extra & 64512) == 56320) {
              output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
            } else {
              output.push(value);
              counter--;
            }
          } else {
            output.push(value);
          }
        }
        return output;
      }
      function ucs2encode(array) {
        return map(array, function(value) {
          var output = "";
          if (value > 65535) {
            value -= 65536;
            output += stringFromCharCode(value >>> 10 & 1023 | 55296);
            value = 56320 | value & 1023;
          }
          output += stringFromCharCode(value);
          return output;
        }).join("");
      }
      function basicToDigit(codePoint) {
        if (codePoint - 48 < 10) {
          return codePoint - 22;
        }
        if (codePoint - 65 < 26) {
          return codePoint - 65;
        }
        if (codePoint - 97 < 26) {
          return codePoint - 97;
        }
        return base;
      }
      function digitToBasic(digit, flag) {
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
      }
      function adapt(delta, numPoints, firstTime) {
        var k = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);
        for (; delta > baseMinusTMin * tMax >> 1; k += base) {
          delta = floor(delta / baseMinusTMin);
        }
        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
      }
      function decode(input) {
        var output = [], inputLength = input.length, out, i = 0, n = initialN, bias = initialBias, basic, j, index, oldi, w, k, digit, t, baseMinusT;
        basic = input.lastIndexOf(delimiter);
        if (basic < 0) {
          basic = 0;
        }
        for (j = 0; j < basic; ++j) {
          if (input.charCodeAt(j) >= 128) {
            error("not-basic");
          }
          output.push(input.charCodeAt(j));
        }
        for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
          for (oldi = i, w = 1, k = base; ; k += base) {
            if (index >= inputLength) {
              error("invalid-input");
            }
            digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base || digit > floor((maxInt - i) / w)) {
              error("overflow");
            }
            i += digit * w;
            t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (digit < t) {
              break;
            }
            baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
              error("overflow");
            }
            w *= baseMinusT;
          }
          out = output.length + 1;
          bias = adapt(i - oldi, out, oldi == 0);
          if (floor(i / out) > maxInt - n) {
            error("overflow");
          }
          n += floor(i / out);
          i %= out;
          output.splice(i++, 0, n);
        }
        return ucs2encode(output);
      }
      function encode(input) {
        var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, output = [], inputLength, handledCPCountPlusOne, baseMinusT, qMinusT;
        input = ucs2decode(input);
        inputLength = input.length;
        n = initialN;
        delta = 0;
        bias = initialBias;
        for (j = 0; j < inputLength; ++j) {
          currentValue = input[j];
          if (currentValue < 128) {
            output.push(stringFromCharCode(currentValue));
          }
        }
        handledCPCount = basicLength = output.length;
        if (basicLength) {
          output.push(delimiter);
        }
        while (handledCPCount < inputLength) {
          for (m = maxInt, j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue >= n && currentValue < m) {
              m = currentValue;
            }
          }
          handledCPCountPlusOne = handledCPCount + 1;
          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error("overflow");
          }
          delta += (m - n) * handledCPCountPlusOne;
          n = m;
          for (j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue < n && ++delta > maxInt) {
              error("overflow");
            }
            if (currentValue == n) {
              for (q = delta, k = base; ; k += base) {
                t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                if (q < t) {
                  break;
                }
                qMinusT = q - t;
                baseMinusT = base - t;
                output.push(
                  stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                );
                q = floor(qMinusT / baseMinusT);
              }
              output.push(stringFromCharCode(digitToBasic(q, 0)));
              bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
              delta = 0;
              ++handledCPCount;
            }
          }
          ++delta;
          ++n;
        }
        return output.join("");
      }
      function toUnicode(input) {
        return mapDomain(input, function(string) {
          return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
        });
      }
      function toASCII(input) {
        return mapDomain(input, function(string) {
          return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
        });
      }
      punycode = {
        /**
         * A string representing the current Punycode.js version number.
         * @memberOf punycode
         * @type String
         */
        "version": "1.3.2",
        /**
         * An object of methods to convert from JavaScript's internal character
         * representation (UCS-2) to Unicode code points, and back.
         * @see <https://mathiasbynens.be/notes/javascript-encoding>
         * @memberOf punycode
         * @type Object
         */
        "ucs2": {
          "decode": ucs2decode,
          "encode": ucs2encode
        },
        "decode": decode,
        "encode": encode,
        "toASCII": toASCII,
        "toUnicode": toUnicode
      };
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        define("punycode", function() {
          return punycode;
        });
      } else if (freeExports && freeModule) {
        if (module.exports == freeExports) {
          freeModule.exports = punycode;
        } else {
          for (key in punycode) {
            punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
          }
        }
      } else {
        root.punycode = punycode;
      }
    })(exports);
  }
});

// node_modules/urijs/src/IPv6.js
var require_IPv6 = __commonJS({
  "node_modules/urijs/src/IPv6.js"(exports, module) {
    (function(root, factory) {
      "use strict";
      if (typeof module === "object" && module.exports) {
        module.exports = factory();
      } else if (typeof define === "function" && define.amd) {
        define(factory);
      } else {
        root.IPv6 = factory(root);
      }
    })(exports, function(root) {
      "use strict";
      var _IPv6 = root && root.IPv6;
      function bestPresentation(address) {
        var _address = address.toLowerCase();
        var segments = _address.split(":");
        var length = segments.length;
        var total = 8;
        if (segments[0] === "" && segments[1] === "" && segments[2] === "") {
          segments.shift();
          segments.shift();
        } else if (segments[0] === "" && segments[1] === "") {
          segments.shift();
        } else if (segments[length - 1] === "" && segments[length - 2] === "") {
          segments.pop();
        }
        length = segments.length;
        if (segments[length - 1].indexOf(".") !== -1) {
          total = 7;
        }
        var pos;
        for (pos = 0; pos < length; pos++) {
          if (segments[pos] === "") {
            break;
          }
        }
        if (pos < total) {
          segments.splice(pos, 1, "0000");
          while (segments.length < total) {
            segments.splice(pos, 0, "0000");
          }
        }
        var _segments;
        for (var i = 0; i < total; i++) {
          _segments = segments[i].split("");
          for (var j = 0; j < 3; j++) {
            if (_segments[0] === "0" && _segments.length > 1) {
              _segments.splice(0, 1);
            } else {
              break;
            }
          }
          segments[i] = _segments.join("");
        }
        var best = -1;
        var _best = 0;
        var _current = 0;
        var current = -1;
        var inzeroes = false;
        for (i = 0; i < total; i++) {
          if (inzeroes) {
            if (segments[i] === "0") {
              _current += 1;
            } else {
              inzeroes = false;
              if (_current > _best) {
                best = current;
                _best = _current;
              }
            }
          } else {
            if (segments[i] === "0") {
              inzeroes = true;
              current = i;
              _current = 1;
            }
          }
        }
        if (_current > _best) {
          best = current;
          _best = _current;
        }
        if (_best > 1) {
          segments.splice(best, _best, "");
        }
        length = segments.length;
        var result = "";
        if (segments[0] === "") {
          result = ":";
        }
        for (i = 0; i < length; i++) {
          result += segments[i];
          if (i === length - 1) {
            break;
          }
          result += ":";
        }
        if (segments[length - 1] === "") {
          result += ":";
        }
        return result;
      }
      function noConflict() {
        if (root.IPv6 === this) {
          root.IPv6 = _IPv6;
        }
        return this;
      }
      return {
        best: bestPresentation,
        noConflict
      };
    });
  }
});

// node_modules/urijs/src/SecondLevelDomains.js
var require_SecondLevelDomains = __commonJS({
  "node_modules/urijs/src/SecondLevelDomains.js"(exports, module) {
    (function(root, factory) {
      "use strict";
      if (typeof module === "object" && module.exports) {
        module.exports = factory();
      } else if (typeof define === "function" && define.amd) {
        define(factory);
      } else {
        root.SecondLevelDomains = factory(root);
      }
    })(exports, function(root) {
      "use strict";
      var _SecondLevelDomains = root && root.SecondLevelDomains;
      var SLD = {
        // list of known Second Level Domains
        // converted list of SLDs from https://github.com/gavingmiller/second-level-domains
        // ----
        // publicsuffix.org is more current and actually used by a couple of browsers internally.
        // downside is it also contains domains like "dyndns.org" - which is fine for the security
        // issues browser have to deal with (SOP for cookies, etc) - but is way overboard for URI.js
        // ----
        list: {
          "ac": " com gov mil net org ",
          "ae": " ac co gov mil name net org pro sch ",
          "af": " com edu gov net org ",
          "al": " com edu gov mil net org ",
          "ao": " co ed gv it og pb ",
          "ar": " com edu gob gov int mil net org tur ",
          "at": " ac co gv or ",
          "au": " asn com csiro edu gov id net org ",
          "ba": " co com edu gov mil net org rs unbi unmo unsa untz unze ",
          "bb": " biz co com edu gov info net org store tv ",
          "bh": " biz cc com edu gov info net org ",
          "bn": " com edu gov net org ",
          "bo": " com edu gob gov int mil net org tv ",
          "br": " adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ",
          "bs": " com edu gov net org ",
          "bz": " du et om ov rg ",
          "ca": " ab bc mb nb nf nl ns nt nu on pe qc sk yk ",
          "ck": " biz co edu gen gov info net org ",
          "cn": " ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ",
          "co": " com edu gov mil net nom org ",
          "cr": " ac c co ed fi go or sa ",
          "cy": " ac biz com ekloges gov ltd name net org parliament press pro tm ",
          "do": " art com edu gob gov mil net org sld web ",
          "dz": " art asso com edu gov net org pol ",
          "ec": " com edu fin gov info med mil net org pro ",
          "eg": " com edu eun gov mil name net org sci ",
          "er": " com edu gov ind mil net org rochest w ",
          "es": " com edu gob nom org ",
          "et": " biz com edu gov info name net org ",
          "fj": " ac biz com info mil name net org pro ",
          "fk": " ac co gov net nom org ",
          "fr": " asso com f gouv nom prd presse tm ",
          "gg": " co net org ",
          "gh": " com edu gov mil org ",
          "gn": " ac com gov net org ",
          "gr": " com edu gov mil net org ",
          "gt": " com edu gob ind mil net org ",
          "gu": " com edu gov net org ",
          "hk": " com edu gov idv net org ",
          "hu": " 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ",
          "id": " ac co go mil net or sch web ",
          "il": " ac co gov idf k12 muni net org ",
          "in": " ac co edu ernet firm gen gov i ind mil net nic org res ",
          "iq": " com edu gov i mil net org ",
          "ir": " ac co dnssec gov i id net org sch ",
          "it": " edu gov ",
          "je": " co net org ",
          "jo": " com edu gov mil name net org sch ",
          "jp": " ac ad co ed go gr lg ne or ",
          "ke": " ac co go info me mobi ne or sc ",
          "kh": " com edu gov mil net org per ",
          "ki": " biz com de edu gov info mob net org tel ",
          "km": " asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ",
          "kn": " edu gov net org ",
          "kr": " ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ",
          "kw": " com edu gov net org ",
          "ky": " com edu gov net org ",
          "kz": " com edu gov mil net org ",
          "lb": " com edu gov net org ",
          "lk": " assn com edu gov grp hotel int ltd net ngo org sch soc web ",
          "lr": " com edu gov net org ",
          "lv": " asn com conf edu gov id mil net org ",
          "ly": " com edu gov id med net org plc sch ",
          "ma": " ac co gov m net org press ",
          "mc": " asso tm ",
          "me": " ac co edu gov its net org priv ",
          "mg": " com edu gov mil nom org prd tm ",
          "mk": " com edu gov inf name net org pro ",
          "ml": " com edu gov net org presse ",
          "mn": " edu gov org ",
          "mo": " com edu gov net org ",
          "mt": " com edu gov net org ",
          "mv": " aero biz com coop edu gov info int mil museum name net org pro ",
          "mw": " ac co com coop edu gov int museum net org ",
          "mx": " com edu gob net org ",
          "my": " com edu gov mil name net org sch ",
          "nf": " arts com firm info net other per rec store web ",
          "ng": " biz com edu gov mil mobi name net org sch ",
          "ni": " ac co com edu gob mil net nom org ",
          "np": " com edu gov mil net org ",
          "nr": " biz com edu gov info net org ",
          "om": " ac biz co com edu gov med mil museum net org pro sch ",
          "pe": " com edu gob mil net nom org sld ",
          "ph": " com edu gov i mil net ngo org ",
          "pk": " biz com edu fam gob gok gon gop gos gov net org web ",
          "pl": " art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ",
          "pr": " ac biz com edu est gov info isla name net org pro prof ",
          "ps": " com edu gov net org plo sec ",
          "pw": " belau co ed go ne or ",
          "ro": " arts com firm info nom nt org rec store tm www ",
          "rs": " ac co edu gov in org ",
          "sb": " com edu gov net org ",
          "sc": " com edu gov net org ",
          "sh": " co com edu gov net nom org ",
          "sl": " com edu gov net org ",
          "st": " co com consulado edu embaixada gov mil net org principe saotome store ",
          "sv": " com edu gob org red ",
          "sz": " ac co org ",
          "tr": " av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ",
          "tt": " aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ",
          "tw": " club com ebiz edu game gov idv mil net org ",
          "mu": " ac co com gov net or org ",
          "mz": " ac co edu gov org ",
          "na": " co com ",
          "nz": " ac co cri geek gen govt health iwi maori mil net org parliament school ",
          "pa": " abo ac com edu gob ing med net nom org sld ",
          "pt": " com edu gov int net nome org publ ",
          "py": " com edu gov mil net org ",
          "qa": " com edu gov mil net org ",
          "re": " asso com nom ",
          "ru": " ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ",
          "rw": " ac co com edu gouv gov int mil net ",
          "sa": " com edu gov med net org pub sch ",
          "sd": " com edu gov info med net org tv ",
          "se": " a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ",
          "sg": " com edu gov idn net org per ",
          "sn": " art com edu gouv org perso univ ",
          "sy": " com edu gov mil net news org ",
          "th": " ac co go in mi net or ",
          "tj": " ac biz co com edu go gov info int mil name net nic org test web ",
          "tn": " agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ",
          "tz": " ac co go ne or ",
          "ua": " biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ",
          "ug": " ac co go ne or org sc ",
          "uk": " ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ",
          "us": " dni fed isa kids nsn ",
          "uy": " com edu gub mil net org ",
          "ve": " co com edu gob info mil net org web ",
          "vi": " co com k12 net org ",
          "vn": " ac biz com edu gov health info int name net org pro ",
          "ye": " co com gov ltd me net org plc ",
          "yu": " ac co edu gov org ",
          "za": " ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ",
          "zm": " ac co com edu gov net org sch ",
          // https://en.wikipedia.org/wiki/CentralNic#Second-level_domains
          "com": "ar br cn de eu gb gr hu jpn kr no qc ru sa se uk us uy za ",
          "net": "gb jp se uk ",
          "org": "ae",
          "de": "com "
        },
        // gorhill 2013-10-25: Using indexOf() instead Regexp(). Significant boost
        // in both performance and memory footprint. No initialization required.
        // http://jsperf.com/uri-js-sld-regex-vs-binary-search/4
        // Following methods use lastIndexOf() rather than array.split() in order
        // to avoid any memory allocations.
        has: function(domain) {
          var tldOffset = domain.lastIndexOf(".");
          if (tldOffset <= 0 || tldOffset >= domain.length - 1) {
            return false;
          }
          var sldOffset = domain.lastIndexOf(".", tldOffset - 1);
          if (sldOffset <= 0 || sldOffset >= tldOffset - 1) {
            return false;
          }
          var sldList = SLD.list[domain.slice(tldOffset + 1)];
          if (!sldList) {
            return false;
          }
          return sldList.indexOf(" " + domain.slice(sldOffset + 1, tldOffset) + " ") >= 0;
        },
        is: function(domain) {
          var tldOffset = domain.lastIndexOf(".");
          if (tldOffset <= 0 || tldOffset >= domain.length - 1) {
            return false;
          }
          var sldOffset = domain.lastIndexOf(".", tldOffset - 1);
          if (sldOffset >= 0) {
            return false;
          }
          var sldList = SLD.list[domain.slice(tldOffset + 1)];
          if (!sldList) {
            return false;
          }
          return sldList.indexOf(" " + domain.slice(0, tldOffset) + " ") >= 0;
        },
        get: function(domain) {
          var tldOffset = domain.lastIndexOf(".");
          if (tldOffset <= 0 || tldOffset >= domain.length - 1) {
            return null;
          }
          var sldOffset = domain.lastIndexOf(".", tldOffset - 1);
          if (sldOffset <= 0 || sldOffset >= tldOffset - 1) {
            return null;
          }
          var sldList = SLD.list[domain.slice(tldOffset + 1)];
          if (!sldList) {
            return null;
          }
          if (sldList.indexOf(" " + domain.slice(sldOffset + 1, tldOffset) + " ") < 0) {
            return null;
          }
          return domain.slice(sldOffset + 1);
        },
        noConflict: function() {
          if (root.SecondLevelDomains === this) {
            root.SecondLevelDomains = _SecondLevelDomains;
          }
          return this;
        }
      };
      return SLD;
    });
  }
});

// node_modules/urijs/src/URI.js
var require_URI = __commonJS({
  "node_modules/urijs/src/URI.js"(exports, module) {
    (function(root, factory) {
      "use strict";
      if (typeof module === "object" && module.exports) {
        module.exports = factory(require_punycode(), require_IPv6(), require_SecondLevelDomains());
      } else if (typeof define === "function" && define.amd) {
        define(["./punycode", "./IPv6", "./SecondLevelDomains"], factory);
      } else {
        root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
      }
    })(exports, function(punycode, IPv6, SLD, root) {
      "use strict";
      var _URI = root && root.URI;
      function URI(url, base) {
        var _urlSupplied = arguments.length >= 1;
        var _baseSupplied = arguments.length >= 2;
        if (!(this instanceof URI)) {
          if (_urlSupplied) {
            if (_baseSupplied) {
              return new URI(url, base);
            }
            return new URI(url);
          }
          return new URI();
        }
        if (url === void 0) {
          if (_urlSupplied) {
            throw new TypeError("undefined is not a valid argument for URI");
          }
          if (typeof location !== "undefined") {
            url = location.href + "";
          } else {
            url = "";
          }
        }
        if (url === null) {
          if (_urlSupplied) {
            throw new TypeError("null is not a valid argument for URI");
          }
        }
        this.href(url);
        if (base !== void 0) {
          return this.absoluteTo(base);
        }
        return this;
      }
      function isInteger(value) {
        return /^[0-9]+$/.test(value);
      }
      URI.version = "1.19.11";
      var p = URI.prototype;
      var hasOwn = Object.prototype.hasOwnProperty;
      function escapeRegEx(string) {
        return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
      }
      function getType(value) {
        if (value === void 0) {
          return "Undefined";
        }
        return String(Object.prototype.toString.call(value)).slice(8, -1);
      }
      function isArray(obj) {
        return getType(obj) === "Array";
      }
      function filterArrayValues(data, value) {
        var lookup = {};
        var i, length;
        if (getType(value) === "RegExp") {
          lookup = null;
        } else if (isArray(value)) {
          for (i = 0, length = value.length; i < length; i++) {
            lookup[value[i]] = true;
          }
        } else {
          lookup[value] = true;
        }
        for (i = 0, length = data.length; i < length; i++) {
          var _match = lookup && lookup[data[i]] !== void 0 || !lookup && value.test(data[i]);
          if (_match) {
            data.splice(i, 1);
            length--;
            i--;
          }
        }
        return data;
      }
      function arrayContains(list, value) {
        var i, length;
        if (isArray(value)) {
          for (i = 0, length = value.length; i < length; i++) {
            if (!arrayContains(list, value[i])) {
              return false;
            }
          }
          return true;
        }
        var _type = getType(value);
        for (i = 0, length = list.length; i < length; i++) {
          if (_type === "RegExp") {
            if (typeof list[i] === "string" && list[i].match(value)) {
              return true;
            }
          } else if (list[i] === value) {
            return true;
          }
        }
        return false;
      }
      function arraysEqual(one, two) {
        if (!isArray(one) || !isArray(two)) {
          return false;
        }
        if (one.length !== two.length) {
          return false;
        }
        one.sort();
        two.sort();
        for (var i = 0, l = one.length; i < l; i++) {
          if (one[i] !== two[i]) {
            return false;
          }
        }
        return true;
      }
      function trimSlashes(text) {
        var trim_expression = /^\/+|\/+$/g;
        return text.replace(trim_expression, "");
      }
      URI._parts = function() {
        return {
          protocol: null,
          username: null,
          password: null,
          hostname: null,
          urn: null,
          port: null,
          path: null,
          query: null,
          fragment: null,
          // state
          preventInvalidHostname: URI.preventInvalidHostname,
          duplicateQueryParameters: URI.duplicateQueryParameters,
          escapeQuerySpace: URI.escapeQuerySpace
        };
      };
      URI.preventInvalidHostname = false;
      URI.duplicateQueryParameters = false;
      URI.escapeQuerySpace = true;
      URI.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
      URI.idn_expression = /[^a-z0-9\._-]/i;
      URI.punycode_expression = /(xn--)/i;
      URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
      URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
      URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
      URI.findUri = {
        // valid "scheme://" or "www."
        start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
        // everything up to the next whitespace
        end: /[\s\r\n]|$/,
        // trim trailing punctuation captured by end RegExp
        trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/,
        // balanced parens inclusion (), [], {}, <>
        parens: /(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g
      };
      URI.leading_whitespace_expression = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
      URI.ascii_tab_whitespace = /[\u0009\u000A\u000D]+/g;
      URI.defaultPorts = {
        http: "80",
        https: "443",
        ftp: "21",
        gopher: "70",
        ws: "80",
        wss: "443"
      };
      URI.hostProtocols = [
        "http",
        "https"
      ];
      URI.invalid_hostname_characters = /[^a-zA-Z0-9\.\-:_]/;
      URI.domAttributes = {
        "a": "href",
        "blockquote": "cite",
        "link": "href",
        "base": "href",
        "script": "src",
        "form": "action",
        "img": "src",
        "area": "href",
        "iframe": "src",
        "embed": "src",
        "source": "src",
        "track": "src",
        "input": "src",
        // but only if type="image"
        "audio": "src",
        "video": "src"
      };
      URI.getDomAttribute = function(node) {
        if (!node || !node.nodeName) {
          return void 0;
        }
        var nodeName = node.nodeName.toLowerCase();
        if (nodeName === "input" && node.type !== "image") {
          return void 0;
        }
        return URI.domAttributes[nodeName];
      };
      function escapeForDumbFirefox36(value) {
        return escape(value);
      }
      function strictEncodeURIComponent(string) {
        return encodeURIComponent(string).replace(/[!'()*]/g, escapeForDumbFirefox36).replace(/\*/g, "%2A");
      }
      URI.encode = strictEncodeURIComponent;
      URI.decode = decodeURIComponent;
      URI.iso8859 = function() {
        URI.encode = escape;
        URI.decode = unescape;
      };
      URI.unicode = function() {
        URI.encode = strictEncodeURIComponent;
        URI.decode = decodeURIComponent;
      };
      URI.characters = {
        pathname: {
          encode: {
            // RFC3986 2.1: For consistency, URI producers and normalizers should
            // use uppercase hexadecimal digits for all percent-encodings.
            expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
            map: {
              // -._~!'()*
              "%24": "$",
              "%26": "&",
              "%2B": "+",
              "%2C": ",",
              "%3B": ";",
              "%3D": "=",
              "%3A": ":",
              "%40": "@"
            }
          },
          decode: {
            expression: /[\/\?#]/g,
            map: {
              "/": "%2F",
              "?": "%3F",
              "#": "%23"
            }
          }
        },
        reserved: {
          encode: {
            // RFC3986 2.1: For consistency, URI producers and normalizers should
            // use uppercase hexadecimal digits for all percent-encodings.
            expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
            map: {
              // gen-delims
              "%3A": ":",
              "%2F": "/",
              "%3F": "?",
              "%23": "#",
              "%5B": "[",
              "%5D": "]",
              "%40": "@",
              // sub-delims
              "%21": "!",
              "%24": "$",
              "%26": "&",
              "%27": "'",
              "%28": "(",
              "%29": ")",
              "%2A": "*",
              "%2B": "+",
              "%2C": ",",
              "%3B": ";",
              "%3D": "="
            }
          }
        },
        urnpath: {
          // The characters under `encode` are the characters called out by RFC 2141 as being acceptable
          // for usage in a URN. RFC2141 also calls out "-", ".", and "_" as acceptable characters, but
          // these aren't encoded by encodeURIComponent, so we don't have to call them out here. Also
          // note that the colon character is not featured in the encoding map; this is because URI.js
          // gives the colons in URNs semantic meaning as the delimiters of path segements, and so it
          // should not appear unencoded in a segment itself.
          // See also the note above about RFC3986 and capitalalized hex digits.
          encode: {
            expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,
            map: {
              "%21": "!",
              "%24": "$",
              "%27": "'",
              "%28": "(",
              "%29": ")",
              "%2A": "*",
              "%2B": "+",
              "%2C": ",",
              "%3B": ";",
              "%3D": "=",
              "%40": "@"
            }
          },
          // These characters are the characters called out by RFC2141 as "reserved" characters that
          // should never appear in a URN, plus the colon character (see note above).
          decode: {
            expression: /[\/\?#:]/g,
            map: {
              "/": "%2F",
              "?": "%3F",
              "#": "%23",
              ":": "%3A"
            }
          }
        }
      };
      URI.encodeQuery = function(string, escapeQuerySpace) {
        var escaped = URI.encode(string + "");
        if (escapeQuerySpace === void 0) {
          escapeQuerySpace = URI.escapeQuerySpace;
        }
        return escapeQuerySpace ? escaped.replace(/%20/g, "+") : escaped;
      };
      URI.decodeQuery = function(string, escapeQuerySpace) {
        string += "";
        if (escapeQuerySpace === void 0) {
          escapeQuerySpace = URI.escapeQuerySpace;
        }
        try {
          return URI.decode(escapeQuerySpace ? string.replace(/\+/g, "%20") : string);
        } catch (e) {
          return string;
        }
      };
      var _parts = { "encode": "encode", "decode": "decode" };
      var _part;
      var generateAccessor = function(_group, _part2) {
        return function(string) {
          try {
            return URI[_part2](string + "").replace(URI.characters[_group][_part2].expression, function(c) {
              return URI.characters[_group][_part2].map[c];
            });
          } catch (e) {
            return string;
          }
        };
      };
      for (_part in _parts) {
        URI[_part + "PathSegment"] = generateAccessor("pathname", _parts[_part]);
        URI[_part + "UrnPathSegment"] = generateAccessor("urnpath", _parts[_part]);
      }
      var generateSegmentedPathFunction = function(_sep, _codingFuncName, _innerCodingFuncName) {
        return function(string) {
          var actualCodingFunc;
          if (!_innerCodingFuncName) {
            actualCodingFunc = URI[_codingFuncName];
          } else {
            actualCodingFunc = function(string2) {
              return URI[_codingFuncName](URI[_innerCodingFuncName](string2));
            };
          }
          var segments = (string + "").split(_sep);
          for (var i = 0, length = segments.length; i < length; i++) {
            segments[i] = actualCodingFunc(segments[i]);
          }
          return segments.join(_sep);
        };
      };
      URI.decodePath = generateSegmentedPathFunction("/", "decodePathSegment");
      URI.decodeUrnPath = generateSegmentedPathFunction(":", "decodeUrnPathSegment");
      URI.recodePath = generateSegmentedPathFunction("/", "encodePathSegment", "decode");
      URI.recodeUrnPath = generateSegmentedPathFunction(":", "encodeUrnPathSegment", "decode");
      URI.encodeReserved = generateAccessor("reserved", "encode");
      URI.parse = function(string, parts) {
        var pos;
        if (!parts) {
          parts = {
            preventInvalidHostname: URI.preventInvalidHostname
          };
        }
        string = string.replace(URI.leading_whitespace_expression, "");
        string = string.replace(URI.ascii_tab_whitespace, "");
        pos = string.indexOf("#");
        if (pos > -1) {
          parts.fragment = string.substring(pos + 1) || null;
          string = string.substring(0, pos);
        }
        pos = string.indexOf("?");
        if (pos > -1) {
          parts.query = string.substring(pos + 1) || null;
          string = string.substring(0, pos);
        }
        string = string.replace(/^(https?|ftp|wss?)?:+[/\\]*/i, "$1://");
        string = string.replace(/^[/\\]{2,}/i, "//");
        if (string.substring(0, 2) === "//") {
          parts.protocol = null;
          string = string.substring(2);
          string = URI.parseAuthority(string, parts);
        } else {
          pos = string.indexOf(":");
          if (pos > -1) {
            parts.protocol = string.substring(0, pos) || null;
            if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
              parts.protocol = void 0;
            } else if (string.substring(pos + 1, pos + 3).replace(/\\/g, "/") === "//") {
              string = string.substring(pos + 3);
              string = URI.parseAuthority(string, parts);
            } else {
              string = string.substring(pos + 1);
              parts.urn = true;
            }
          }
        }
        parts.path = string;
        return parts;
      };
      URI.parseHost = function(string, parts) {
        if (!string) {
          string = "";
        }
        string = string.replace(/\\/g, "/");
        var pos = string.indexOf("/");
        var bracketPos;
        var t;
        if (pos === -1) {
          pos = string.length;
        }
        if (string.charAt(0) === "[") {
          bracketPos = string.indexOf("]");
          parts.hostname = string.substring(1, bracketPos) || null;
          parts.port = string.substring(bracketPos + 2, pos) || null;
          if (parts.port === "/") {
            parts.port = null;
          }
        } else {
          var firstColon = string.indexOf(":");
          var firstSlash = string.indexOf("/");
          var nextColon = string.indexOf(":", firstColon + 1);
          if (nextColon !== -1 && (firstSlash === -1 || nextColon < firstSlash)) {
            parts.hostname = string.substring(0, pos) || null;
            parts.port = null;
          } else {
            t = string.substring(0, pos).split(":");
            parts.hostname = t[0] || null;
            parts.port = t[1] || null;
          }
        }
        if (parts.hostname && string.substring(pos).charAt(0) !== "/") {
          pos++;
          string = "/" + string;
        }
        if (parts.preventInvalidHostname) {
          URI.ensureValidHostname(parts.hostname, parts.protocol);
        }
        if (parts.port) {
          URI.ensureValidPort(parts.port);
        }
        return string.substring(pos) || "/";
      };
      URI.parseAuthority = function(string, parts) {
        string = URI.parseUserinfo(string, parts);
        return URI.parseHost(string, parts);
      };
      URI.parseUserinfo = function(string, parts) {
        var _string = string;
        var firstBackSlash = string.indexOf("\\");
        if (firstBackSlash !== -1) {
          string = string.replace(/\\/g, "/");
        }
        var firstSlash = string.indexOf("/");
        var pos = string.lastIndexOf("@", firstSlash > -1 ? firstSlash : string.length - 1);
        var t;
        if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
          t = string.substring(0, pos).split(":");
          parts.username = t[0] ? URI.decode(t[0]) : null;
          t.shift();
          parts.password = t[0] ? URI.decode(t.join(":")) : null;
          string = _string.substring(pos + 1);
        } else {
          parts.username = null;
          parts.password = null;
        }
        return string;
      };
      URI.parseQuery = function(string, escapeQuerySpace) {
        if (!string) {
          return {};
        }
        string = string.replace(/&+/g, "&").replace(/^\?*&*|&+$/g, "");
        if (!string) {
          return {};
        }
        var items = {};
        var splits = string.split("&");
        var length = splits.length;
        var v, name, value;
        for (var i = 0; i < length; i++) {
          v = splits[i].split("=");
          name = URI.decodeQuery(v.shift(), escapeQuerySpace);
          value = v.length ? URI.decodeQuery(v.join("="), escapeQuerySpace) : null;
          if (name === "__proto__") {
            continue;
          } else if (hasOwn.call(items, name)) {
            if (typeof items[name] === "string" || items[name] === null) {
              items[name] = [items[name]];
            }
            items[name].push(value);
          } else {
            items[name] = value;
          }
        }
        return items;
      };
      URI.build = function(parts) {
        var t = "";
        var requireAbsolutePath = false;
        if (parts.protocol) {
          t += parts.protocol + ":";
        }
        if (!parts.urn && (t || parts.hostname)) {
          t += "//";
          requireAbsolutePath = true;
        }
        t += URI.buildAuthority(parts) || "";
        if (typeof parts.path === "string") {
          if (parts.path.charAt(0) !== "/" && requireAbsolutePath) {
            t += "/";
          }
          t += parts.path;
        }
        if (typeof parts.query === "string" && parts.query) {
          t += "?" + parts.query;
        }
        if (typeof parts.fragment === "string" && parts.fragment) {
          t += "#" + parts.fragment;
        }
        return t;
      };
      URI.buildHost = function(parts) {
        var t = "";
        if (!parts.hostname) {
          return "";
        } else if (URI.ip6_expression.test(parts.hostname)) {
          t += "[" + parts.hostname + "]";
        } else {
          t += parts.hostname;
        }
        if (parts.port) {
          t += ":" + parts.port;
        }
        return t;
      };
      URI.buildAuthority = function(parts) {
        return URI.buildUserinfo(parts) + URI.buildHost(parts);
      };
      URI.buildUserinfo = function(parts) {
        var t = "";
        if (parts.username) {
          t += URI.encode(parts.username);
        }
        if (parts.password) {
          t += ":" + URI.encode(parts.password);
        }
        if (t) {
          t += "@";
        }
        return t;
      };
      URI.buildQuery = function(data, duplicateQueryParameters, escapeQuerySpace) {
        var t = "";
        var unique, key, i, length;
        for (key in data) {
          if (key === "__proto__") {
            continue;
          } else if (hasOwn.call(data, key)) {
            if (isArray(data[key])) {
              unique = {};
              for (i = 0, length = data[key].length; i < length; i++) {
                if (data[key][i] !== void 0 && unique[data[key][i] + ""] === void 0) {
                  t += "&" + URI.buildQueryParameter(key, data[key][i], escapeQuerySpace);
                  if (duplicateQueryParameters !== true) {
                    unique[data[key][i] + ""] = true;
                  }
                }
              }
            } else if (data[key] !== void 0) {
              t += "&" + URI.buildQueryParameter(key, data[key], escapeQuerySpace);
            }
          }
        }
        return t.substring(1);
      };
      URI.buildQueryParameter = function(name, value, escapeQuerySpace) {
        return URI.encodeQuery(name, escapeQuerySpace) + (value !== null ? "=" + URI.encodeQuery(value, escapeQuerySpace) : "");
      };
      URI.addQuery = function(data, name, value) {
        if (typeof name === "object") {
          for (var key in name) {
            if (hasOwn.call(name, key)) {
              URI.addQuery(data, key, name[key]);
            }
          }
        } else if (typeof name === "string") {
          if (data[name] === void 0) {
            data[name] = value;
            return;
          } else if (typeof data[name] === "string") {
            data[name] = [data[name]];
          }
          if (!isArray(value)) {
            value = [value];
          }
          data[name] = (data[name] || []).concat(value);
        } else {
          throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
        }
      };
      URI.setQuery = function(data, name, value) {
        if (typeof name === "object") {
          for (var key in name) {
            if (hasOwn.call(name, key)) {
              URI.setQuery(data, key, name[key]);
            }
          }
        } else if (typeof name === "string") {
          data[name] = value === void 0 ? null : value;
        } else {
          throw new TypeError("URI.setQuery() accepts an object, string as the name parameter");
        }
      };
      URI.removeQuery = function(data, name, value) {
        var i, length, key;
        if (isArray(name)) {
          for (i = 0, length = name.length; i < length; i++) {
            data[name[i]] = void 0;
          }
        } else if (getType(name) === "RegExp") {
          for (key in data) {
            if (name.test(key)) {
              data[key] = void 0;
            }
          }
        } else if (typeof name === "object") {
          for (key in name) {
            if (hasOwn.call(name, key)) {
              URI.removeQuery(data, key, name[key]);
            }
          }
        } else if (typeof name === "string") {
          if (value !== void 0) {
            if (getType(value) === "RegExp") {
              if (!isArray(data[name]) && value.test(data[name])) {
                data[name] = void 0;
              } else {
                data[name] = filterArrayValues(data[name], value);
              }
            } else if (data[name] === String(value) && (!isArray(value) || value.length === 1)) {
              data[name] = void 0;
            } else if (isArray(data[name])) {
              data[name] = filterArrayValues(data[name], value);
            }
          } else {
            data[name] = void 0;
          }
        } else {
          throw new TypeError("URI.removeQuery() accepts an object, string, RegExp as the first parameter");
        }
      };
      URI.hasQuery = function(data, name, value, withinArray) {
        switch (getType(name)) {
          case "String":
            break;
          case "RegExp":
            for (var key in data) {
              if (hasOwn.call(data, key)) {
                if (name.test(key) && (value === void 0 || URI.hasQuery(data, key, value))) {
                  return true;
                }
              }
            }
            return false;
          case "Object":
            for (var _key in name) {
              if (hasOwn.call(name, _key)) {
                if (!URI.hasQuery(data, _key, name[_key])) {
                  return false;
                }
              }
            }
            return true;
          default:
            throw new TypeError("URI.hasQuery() accepts a string, regular expression or object as the name parameter");
        }
        switch (getType(value)) {
          case "Undefined":
            return name in data;
          // data[name] !== undefined;
          case "Boolean":
            var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);
            return value === _booly;
          case "Function":
            return !!value(data[name], name, data);
          case "Array":
            if (!isArray(data[name])) {
              return false;
            }
            var op = withinArray ? arrayContains : arraysEqual;
            return op(data[name], value);
          case "RegExp":
            if (!isArray(data[name])) {
              return Boolean(data[name] && data[name].match(value));
            }
            if (!withinArray) {
              return false;
            }
            return arrayContains(data[name], value);
          case "Number":
            value = String(value);
          /* falls through */
          case "String":
            if (!isArray(data[name])) {
              return data[name] === value;
            }
            if (!withinArray) {
              return false;
            }
            return arrayContains(data[name], value);
          default:
            throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter");
        }
      };
      URI.joinPaths = function() {
        var input = [];
        var segments = [];
        var nonEmptySegments = 0;
        for (var i = 0; i < arguments.length; i++) {
          var url = new URI(arguments[i]);
          input.push(url);
          var _segments = url.segment();
          for (var s = 0; s < _segments.length; s++) {
            if (typeof _segments[s] === "string") {
              segments.push(_segments[s]);
            }
            if (_segments[s]) {
              nonEmptySegments++;
            }
          }
        }
        if (!segments.length || !nonEmptySegments) {
          return new URI("");
        }
        var uri = new URI("").segment(segments);
        if (input[0].path() === "" || input[0].path().slice(0, 1) === "/") {
          uri.path("/" + uri.path());
        }
        return uri.normalize();
      };
      URI.commonPath = function(one, two) {
        var length = Math.min(one.length, two.length);
        var pos;
        for (pos = 0; pos < length; pos++) {
          if (one.charAt(pos) !== two.charAt(pos)) {
            pos--;
            break;
          }
        }
        if (pos < 1) {
          return one.charAt(0) === two.charAt(0) && one.charAt(0) === "/" ? "/" : "";
        }
        if (one.charAt(pos) !== "/" || two.charAt(pos) !== "/") {
          pos = one.substring(0, pos).lastIndexOf("/");
        }
        return one.substring(0, pos + 1);
      };
      URI.withinString = function(string, callback, options) {
        options || (options = {});
        var _start = options.start || URI.findUri.start;
        var _end = options.end || URI.findUri.end;
        var _trim = options.trim || URI.findUri.trim;
        var _parens = options.parens || URI.findUri.parens;
        var _attributeOpen = /[a-z0-9-]=["']?$/i;
        _start.lastIndex = 0;
        while (true) {
          var match = _start.exec(string);
          if (!match) {
            break;
          }
          var start = match.index;
          if (options.ignoreHtml) {
            var attributeOpen = string.slice(Math.max(start - 3, 0), start);
            if (attributeOpen && _attributeOpen.test(attributeOpen)) {
              continue;
            }
          }
          var end = start + string.slice(start).search(_end);
          var slice = string.slice(start, end);
          var parensEnd = -1;
          while (true) {
            var parensMatch = _parens.exec(slice);
            if (!parensMatch) {
              break;
            }
            var parensMatchEnd = parensMatch.index + parensMatch[0].length;
            parensEnd = Math.max(parensEnd, parensMatchEnd);
          }
          if (parensEnd > -1) {
            slice = slice.slice(0, parensEnd) + slice.slice(parensEnd).replace(_trim, "");
          } else {
            slice = slice.replace(_trim, "");
          }
          if (slice.length <= match[0].length) {
            continue;
          }
          if (options.ignore && options.ignore.test(slice)) {
            continue;
          }
          end = start + slice.length;
          var result = callback(slice, start, end, string);
          if (result === void 0) {
            _start.lastIndex = end;
            continue;
          }
          result = String(result);
          string = string.slice(0, start) + result + string.slice(end);
          _start.lastIndex = start + result.length;
        }
        _start.lastIndex = 0;
        return string;
      };
      URI.ensureValidHostname = function(v, protocol) {
        var hasHostname = !!v;
        var hasProtocol = !!protocol;
        var rejectEmptyHostname = false;
        if (hasProtocol) {
          rejectEmptyHostname = arrayContains(URI.hostProtocols, protocol);
        }
        if (rejectEmptyHostname && !hasHostname) {
          throw new TypeError("Hostname cannot be empty, if protocol is " + protocol);
        } else if (v && v.match(URI.invalid_hostname_characters)) {
          if (!punycode) {
            throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-:_] and Punycode.js is not available');
          }
          if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
            throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-:_]');
          }
        }
      };
      URI.ensureValidPort = function(v) {
        if (!v) {
          return;
        }
        var port = Number(v);
        if (isInteger(port) && port > 0 && port < 65536) {
          return;
        }
        throw new TypeError('Port "' + v + '" is not a valid port');
      };
      URI.noConflict = function(removeAll) {
        if (removeAll) {
          var unconflicted = {
            URI: this.noConflict()
          };
          if (root.URITemplate && typeof root.URITemplate.noConflict === "function") {
            unconflicted.URITemplate = root.URITemplate.noConflict();
          }
          if (root.IPv6 && typeof root.IPv6.noConflict === "function") {
            unconflicted.IPv6 = root.IPv6.noConflict();
          }
          if (root.SecondLevelDomains && typeof root.SecondLevelDomains.noConflict === "function") {
            unconflicted.SecondLevelDomains = root.SecondLevelDomains.noConflict();
          }
          return unconflicted;
        } else if (root.URI === this) {
          root.URI = _URI;
        }
        return this;
      };
      p.build = function(deferBuild) {
        if (deferBuild === true) {
          this._deferred_build = true;
        } else if (deferBuild === void 0 || this._deferred_build) {
          this._string = URI.build(this._parts);
          this._deferred_build = false;
        }
        return this;
      };
      p.clone = function() {
        return new URI(this);
      };
      p.valueOf = p.toString = function() {
        return this.build(false)._string;
      };
      function generateSimpleAccessor(_part2) {
        return function(v, build) {
          if (v === void 0) {
            return this._parts[_part2] || "";
          } else {
            this._parts[_part2] = v || null;
            this.build(!build);
            return this;
          }
        };
      }
      function generatePrefixAccessor(_part2, _key) {
        return function(v, build) {
          if (v === void 0) {
            return this._parts[_part2] || "";
          } else {
            if (v !== null) {
              v = v + "";
              if (v.charAt(0) === _key) {
                v = v.substring(1);
              }
            }
            this._parts[_part2] = v;
            this.build(!build);
            return this;
          }
        };
      }
      p.protocol = generateSimpleAccessor("protocol");
      p.username = generateSimpleAccessor("username");
      p.password = generateSimpleAccessor("password");
      p.hostname = generateSimpleAccessor("hostname");
      p.port = generateSimpleAccessor("port");
      p.query = generatePrefixAccessor("query", "?");
      p.fragment = generatePrefixAccessor("fragment", "#");
      p.search = function(v, build) {
        var t = this.query(v, build);
        return typeof t === "string" && t.length ? "?" + t : t;
      };
      p.hash = function(v, build) {
        var t = this.fragment(v, build);
        return typeof t === "string" && t.length ? "#" + t : t;
      };
      p.pathname = function(v, build) {
        if (v === void 0 || v === true) {
          var res = this._parts.path || (this._parts.hostname ? "/" : "");
          return v ? (this._parts.urn ? URI.decodeUrnPath : URI.decodePath)(res) : res;
        } else {
          if (this._parts.urn) {
            this._parts.path = v ? URI.recodeUrnPath(v) : "";
          } else {
            this._parts.path = v ? URI.recodePath(v) : "/";
          }
          this.build(!build);
          return this;
        }
      };
      p.path = p.pathname;
      p.href = function(href, build) {
        var key;
        if (href === void 0) {
          return this.toString();
        }
        this._string = "";
        this._parts = URI._parts();
        var _URI2 = href instanceof URI;
        var _object = typeof href === "object" && (href.hostname || href.path || href.pathname);
        if (href.nodeName) {
          var attribute = URI.getDomAttribute(href);
          href = href[attribute] || "";
          _object = false;
        }
        if (!_URI2 && _object && href.pathname !== void 0) {
          href = href.toString();
        }
        if (typeof href === "string" || href instanceof String) {
          this._parts = URI.parse(String(href), this._parts);
        } else if (_URI2 || _object) {
          var src = _URI2 ? href._parts : href;
          for (key in src) {
            if (key === "query") {
              continue;
            }
            if (hasOwn.call(this._parts, key)) {
              this._parts[key] = src[key];
            }
          }
          if (src.query) {
            this.query(src.query, false);
          }
        } else {
          throw new TypeError("invalid input");
        }
        this.build(!build);
        return this;
      };
      p.is = function(what) {
        var ip = false;
        var ip4 = false;
        var ip6 = false;
        var name = false;
        var sld = false;
        var idn = false;
        var punycode2 = false;
        var relative = !this._parts.urn;
        if (this._parts.hostname) {
          relative = false;
          ip4 = URI.ip4_expression.test(this._parts.hostname);
          ip6 = URI.ip6_expression.test(this._parts.hostname);
          ip = ip4 || ip6;
          name = !ip;
          sld = name && SLD && SLD.has(this._parts.hostname);
          idn = name && URI.idn_expression.test(this._parts.hostname);
          punycode2 = name && URI.punycode_expression.test(this._parts.hostname);
        }
        switch (what.toLowerCase()) {
          case "relative":
            return relative;
          case "absolute":
            return !relative;
          // hostname identification
          case "domain":
          case "name":
            return name;
          case "sld":
            return sld;
          case "ip":
            return ip;
          case "ip4":
          case "ipv4":
          case "inet4":
            return ip4;
          case "ip6":
          case "ipv6":
          case "inet6":
            return ip6;
          case "idn":
            return idn;
          case "url":
            return !this._parts.urn;
          case "urn":
            return !!this._parts.urn;
          case "punycode":
            return punycode2;
        }
        return null;
      };
      var _protocol = p.protocol;
      var _port = p.port;
      var _hostname = p.hostname;
      p.protocol = function(v, build) {
        if (v) {
          v = v.replace(/:(\/\/)?$/, "");
          if (!v.match(URI.protocol_expression)) {
            throw new TypeError('Protocol "' + v + `" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]`);
          }
        }
        return _protocol.call(this, v, build);
      };
      p.scheme = p.protocol;
      p.port = function(v, build) {
        if (this._parts.urn) {
          return v === void 0 ? "" : this;
        }
        if (v !== void 0) {
          if (v === 0) {
            v = null;
          }
          if (v) {
            v += "";
            if (v.charAt(0) === ":") {
              v = v.substring(1);
            }
            URI.ensureValidPort(v);
          }
        }
        return _port.call(this, v, build);
      };
      p.hostname = function(v, build) {
        if (this._parts.urn) {
          return v === void 0 ? "" : this;
        }
        if (v !== void 0) {
          var x = { preventInvalidHostname: this._parts.preventInvalidHostname };
          var res = URI.parseHost(v, x);
          if (res !== "/") {
            throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
          }
          v = x.hostname;
          if (this._parts.preventInvalidHostname) {
            URI.ensureValidHostname(v, this._parts.protocol);
          }
        }
        return _hostname.call(this, v, build);
      };
      p.origin = function(v, build) {
        if (this._parts.urn) {
          return v === void 0 ? "" : this;
        }
        if (v === void 0) {
          var protocol = this.protocol();
          var authority = this.authority();
          if (!authority) {
            return "";
          }
          return (protocol ? protocol + "://" : "") + this.authority();
        } else {
          var origin = URI(v);
          this.protocol(origin.protocol()).authority(origin.authority()).build(!build);
          return this;
        }
      };
      p.host = function(v, build) {
        if (this._parts.urn) {
          return v === void 0 ? "" : this;
        }
        if (v === void 0) {
          return this._parts.hostname ? URI.buildHost(this._parts) : "";
        } else {
          var res = URI.parseHost(v, this._parts);
          if (res !== "/") {
            throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
          }
          this.build(!build);
          return this;
        }
      };
      p.authority = function(v, build) {
        if (this._parts.urn) {
          return v === void 0 ? "" : this;
        }
        if (v === void 0) {
          return this._parts.hostname ? URI.buildAuthority(this._parts) : "";
        } else {
          var res = URI.parseAuthority(v, this._parts);
          if (res !== "/") {
            throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
          }
          this.build(!build);
          return this;
        }
      };
      p.userinfo = function(v, build) {
        if (this._parts.urn) {
          return v === void 0 ? "" : this;
        }
        if (v === void 0) {
          var t = URI.buildUserinfo(this._parts);
          return t ? t.substring(0, t.length - 1) : t;
        } else {
          if (v[v.length - 1] !== "@") {
            v += "@";
          }
          URI.parseUserinfo(v, this._parts);
          this.build(!build);
          return this;
        }
      };
      p.resource = function(v, build) {
        var parts;
        if (v === void 0) {
          return this.path() + this.search() + this.hash();
        }
        parts = URI.parse(v);
        this._parts.path = parts.path;
        this._parts.query = parts.query;
        this._parts.fragment = parts.fragment;
        this.build(!build);
        return this;
      };
      p.subdomain = function(v, build) {
        if (this._parts.urn) {
          return v === void 0 ? "" : this;
        }
        if (v === void 0) {
          if (!this._parts.hostname || this.is("IP")) {
            return "";
          }
          var end = this._parts.hostname.length - this.domain().length - 1;
          return this._parts.hostname.substring(0, end) || "";
        } else {
          var e = this._parts.hostname.length - this.domain().length;
          var sub = this._parts.hostname.substring(0, e);
          var replace = new RegExp("^" + escapeRegEx(sub));
          if (v && v.charAt(v.length - 1) !== ".") {
            v += ".";
          }
          if (v.indexOf(":") !== -1) {
            throw new TypeError("Domains cannot contain colons");
          }
          if (v) {
            URI.ensureValidHostname(v, this._parts.protocol);
          }
          this._parts.hostname = this._parts.hostname.replace(replace, v);
          this.build(!build);
          return this;
        }
      };
      p.domain = function(v, build) {
        if (this._parts.urn) {
          return v === void 0 ? "" : this;
        }
        if (typeof v === "boolean") {
          build = v;
          v = void 0;
        }
        if (v === void 0) {
          if (!this._parts.hostname || this.is("IP")) {
            return "";
          }
          var t = this._parts.hostname.match(/\./g);
          if (t && t.length < 2) {
            return this._parts.hostname;
          }
          var end = this._parts.hostname.length - this.tld(build).length - 1;
          end = this._parts.hostname.lastIndexOf(".", end - 1) + 1;
          return this._parts.hostname.substring(end) || "";
        } else {
          if (!v) {
            throw new TypeError("cannot set domain empty");
          }
          if (v.indexOf(":") !== -1) {
            throw new TypeError("Domains cannot contain colons");
          }
          URI.ensureValidHostname(v, this._parts.protocol);
          if (!this._parts.hostname || this.is("IP")) {
            this._parts.hostname = v;
          } else {
            var replace = new RegExp(escapeRegEx(this.domain()) + "$");
            this._parts.hostname = this._parts.hostname.replace(replace, v);
          }
          this.build(!build);
          return this;
        }
      };
      p.tld = function(v, build) {
        if (this._parts.urn) {
          return v === void 0 ? "" : this;
        }
        if (typeof v === "boolean") {
          build = v;
          v = void 0;
        }
        if (v === void 0) {
          if (!this._parts.hostname || this.is("IP")) {
            return "";
          }
          var pos = this._parts.hostname.lastIndexOf(".");
          var tld = this._parts.hostname.substring(pos + 1);
          if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
            return SLD.get(this._parts.hostname) || tld;
          }
          return tld;
        } else {
          var replace;
          if (!v) {
            throw new TypeError("cannot set TLD empty");
          } else if (v.match(/[^a-zA-Z0-9-]/)) {
            if (SLD && SLD.is(v)) {
              replace = new RegExp(escapeRegEx(this.tld()) + "$");
              this._parts.hostname = this._parts.hostname.replace(replace, v);
            } else {
              throw new TypeError('TLD "' + v + '" contains characters other than [A-Z0-9]');
            }
          } else if (!this._parts.hostname || this.is("IP")) {
            throw new ReferenceError("cannot set TLD on non-domain host");
          } else {
            replace = new RegExp(escapeRegEx(this.tld()) + "$");
            this._parts.hostname = this._parts.hostname.replace(replace, v);
          }
          this.build(!build);
          return this;
        }
      };
      p.directory = function(v, build) {
        if (this._parts.urn) {
          return v === void 0 ? "" : this;
        }
        if (v === void 0 || v === true) {
          if (!this._parts.path && !this._parts.hostname) {
            return "";
          }
          if (this._parts.path === "/") {
            return "/";
          }
          var end = this._parts.path.length - this.filename().length - 1;
          var res = this._parts.path.substring(0, end) || (this._parts.hostname ? "/" : "");
          return v ? URI.decodePath(res) : res;
        } else {
          var e = this._parts.path.length - this.filename().length;
          var directory = this._parts.path.substring(0, e);
          var replace = new RegExp("^" + escapeRegEx(directory));
          if (!this.is("relative")) {
            if (!v) {
              v = "/";
            }
            if (v.charAt(0) !== "/") {
              v = "/" + v;
            }
          }
          if (v && v.charAt(v.length - 1) !== "/") {
            v += "/";
          }
          v = URI.recodePath(v);
          this._parts.path = this._parts.path.replace(replace, v);
          this.build(!build);
          return this;
        }
      };
      p.filename = function(v, build) {
        if (this._parts.urn) {
          return v === void 0 ? "" : this;
        }
        if (typeof v !== "string") {
          if (!this._parts.path || this._parts.path === "/") {
            return "";
          }
          var pos = this._parts.path.lastIndexOf("/");
          var res = this._parts.path.substring(pos + 1);
          return v ? URI.decodePathSegment(res) : res;
        } else {
          var mutatedDirectory = false;
          if (v.charAt(0) === "/") {
            v = v.substring(1);
          }
          if (v.match(/\.?\//)) {
            mutatedDirectory = true;
          }
          var replace = new RegExp(escapeRegEx(this.filename()) + "$");
          v = URI.recodePath(v);
          this._parts.path = this._parts.path.replace(replace, v);
          if (mutatedDirectory) {
            this.normalizePath(build);
          } else {
            this.build(!build);
          }
          return this;
        }
      };
      p.suffix = function(v, build) {
        if (this._parts.urn) {
          return v === void 0 ? "" : this;
        }
        if (v === void 0 || v === true) {
          if (!this._parts.path || this._parts.path === "/") {
            return "";
          }
          var filename = this.filename();
          var pos = filename.lastIndexOf(".");
          var s, res;
          if (pos === -1) {
            return "";
          }
          s = filename.substring(pos + 1);
          res = /^[a-z0-9%]+$/i.test(s) ? s : "";
          return v ? URI.decodePathSegment(res) : res;
        } else {
          if (v.charAt(0) === ".") {
            v = v.substring(1);
          }
          var suffix = this.suffix();
          var replace;
          if (!suffix) {
            if (!v) {
              return this;
            }
            this._parts.path += "." + URI.recodePath(v);
          } else if (!v) {
            replace = new RegExp(escapeRegEx("." + suffix) + "$");
          } else {
            replace = new RegExp(escapeRegEx(suffix) + "$");
          }
          if (replace) {
            v = URI.recodePath(v);
            this._parts.path = this._parts.path.replace(replace, v);
          }
          this.build(!build);
          return this;
        }
      };
      p.segment = function(segment, v, build) {
        var separator = this._parts.urn ? ":" : "/";
        var path = this.path();
        var absolute = path.substring(0, 1) === "/";
        var segments = path.split(separator);
        if (segment !== void 0 && typeof segment !== "number") {
          build = v;
          v = segment;
          segment = void 0;
        }
        if (segment !== void 0 && typeof segment !== "number") {
          throw new Error('Bad segment "' + segment + '", must be 0-based integer');
        }
        if (absolute) {
          segments.shift();
        }
        if (segment < 0) {
          segment = Math.max(segments.length + segment, 0);
        }
        if (v === void 0) {
          return segment === void 0 ? segments : segments[segment];
        } else if (segment === null || segments[segment] === void 0) {
          if (isArray(v)) {
            segments = [];
            for (var i = 0, l = v.length; i < l; i++) {
              if (!v[i].length && (!segments.length || !segments[segments.length - 1].length)) {
                continue;
              }
              if (segments.length && !segments[segments.length - 1].length) {
                segments.pop();
              }
              segments.push(trimSlashes(v[i]));
            }
          } else if (v || typeof v === "string") {
            v = trimSlashes(v);
            if (segments[segments.length - 1] === "") {
              segments[segments.length - 1] = v;
            } else {
              segments.push(v);
            }
          }
        } else {
          if (v) {
            segments[segment] = trimSlashes(v);
          } else {
            segments.splice(segment, 1);
          }
        }
        if (absolute) {
          segments.unshift("");
        }
        return this.path(segments.join(separator), build);
      };
      p.segmentCoded = function(segment, v, build) {
        var segments, i, l;
        if (typeof segment !== "number") {
          build = v;
          v = segment;
          segment = void 0;
        }
        if (v === void 0) {
          segments = this.segment(segment, v, build);
          if (!isArray(segments)) {
            segments = segments !== void 0 ? URI.decode(segments) : void 0;
          } else {
            for (i = 0, l = segments.length; i < l; i++) {
              segments[i] = URI.decode(segments[i]);
            }
          }
          return segments;
        }
        if (!isArray(v)) {
          v = typeof v === "string" || v instanceof String ? URI.encode(v) : v;
        } else {
          for (i = 0, l = v.length; i < l; i++) {
            v[i] = URI.encode(v[i]);
          }
        }
        return this.segment(segment, v, build);
      };
      var q = p.query;
      p.query = function(v, build) {
        if (v === true) {
          return URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        } else if (typeof v === "function") {
          var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
          var result = v.call(this, data);
          this._parts.query = URI.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
          this.build(!build);
          return this;
        } else if (v !== void 0 && typeof v !== "string") {
          this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
          this.build(!build);
          return this;
        } else {
          return q.call(this, v, build);
        }
      };
      p.setQuery = function(name, value, build) {
        var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        if (typeof name === "string" || name instanceof String) {
          data[name] = value !== void 0 ? value : null;
        } else if (typeof name === "object") {
          for (var key in name) {
            if (hasOwn.call(name, key)) {
              data[key] = name[key];
            }
          }
        } else {
          throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
        }
        this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
        if (typeof name !== "string") {
          build = value;
        }
        this.build(!build);
        return this;
      };
      p.addQuery = function(name, value, build) {
        var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        URI.addQuery(data, name, value === void 0 ? null : value);
        this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
        if (typeof name !== "string") {
          build = value;
        }
        this.build(!build);
        return this;
      };
      p.removeQuery = function(name, value, build) {
        var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        URI.removeQuery(data, name, value);
        this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
        if (typeof name !== "string") {
          build = value;
        }
        this.build(!build);
        return this;
      };
      p.hasQuery = function(name, value, withinArray) {
        var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        return URI.hasQuery(data, name, value, withinArray);
      };
      p.setSearch = p.setQuery;
      p.addSearch = p.addQuery;
      p.removeSearch = p.removeQuery;
      p.hasSearch = p.hasQuery;
      p.normalize = function() {
        if (this._parts.urn) {
          return this.normalizeProtocol(false).normalizePath(false).normalizeQuery(false).normalizeFragment(false).build();
        }
        return this.normalizeProtocol(false).normalizeHostname(false).normalizePort(false).normalizePath(false).normalizeQuery(false).normalizeFragment(false).build();
      };
      p.normalizeProtocol = function(build) {
        if (typeof this._parts.protocol === "string") {
          this._parts.protocol = this._parts.protocol.toLowerCase();
          this.build(!build);
        }
        return this;
      };
      p.normalizeHostname = function(build) {
        if (this._parts.hostname) {
          if (this.is("IDN") && punycode) {
            this._parts.hostname = punycode.toASCII(this._parts.hostname);
          } else if (this.is("IPv6") && IPv6) {
            this._parts.hostname = IPv6.best(this._parts.hostname);
          }
          this._parts.hostname = this._parts.hostname.toLowerCase();
          this.build(!build);
        }
        return this;
      };
      p.normalizePort = function(build) {
        if (typeof this._parts.protocol === "string" && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
          this._parts.port = null;
          this.build(!build);
        }
        return this;
      };
      p.normalizePath = function(build) {
        var _path = this._parts.path;
        if (!_path) {
          return this;
        }
        if (this._parts.urn) {
          this._parts.path = URI.recodeUrnPath(this._parts.path);
          this.build(!build);
          return this;
        }
        if (this._parts.path === "/") {
          return this;
        }
        _path = URI.recodePath(_path);
        var _was_relative;
        var _leadingParents = "";
        var _parent, _pos;
        if (_path.charAt(0) !== "/") {
          _was_relative = true;
          _path = "/" + _path;
        }
        if (_path.slice(-3) === "/.." || _path.slice(-2) === "/.") {
          _path += "/";
        }
        _path = _path.replace(/(\/(\.\/)+)|(\/\.$)/g, "/").replace(/\/{2,}/g, "/");
        if (_was_relative) {
          _leadingParents = _path.substring(1).match(/^(\.\.\/)+/) || "";
          if (_leadingParents) {
            _leadingParents = _leadingParents[0];
          }
        }
        while (true) {
          _parent = _path.search(/\/\.\.(\/|$)/);
          if (_parent === -1) {
            break;
          } else if (_parent === 0) {
            _path = _path.substring(3);
            continue;
          }
          _pos = _path.substring(0, _parent).lastIndexOf("/");
          if (_pos === -1) {
            _pos = _parent;
          }
          _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
        }
        if (_was_relative && this.is("relative")) {
          _path = _leadingParents + _path.substring(1);
        }
        this._parts.path = _path;
        this.build(!build);
        return this;
      };
      p.normalizePathname = p.normalizePath;
      p.normalizeQuery = function(build) {
        if (typeof this._parts.query === "string") {
          if (!this._parts.query.length) {
            this._parts.query = null;
          } else {
            this.query(URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
          }
          this.build(!build);
        }
        return this;
      };
      p.normalizeFragment = function(build) {
        if (!this._parts.fragment) {
          this._parts.fragment = null;
          this.build(!build);
        }
        return this;
      };
      p.normalizeSearch = p.normalizeQuery;
      p.normalizeHash = p.normalizeFragment;
      p.iso8859 = function() {
        var e = URI.encode;
        var d = URI.decode;
        URI.encode = escape;
        URI.decode = decodeURIComponent;
        try {
          this.normalize();
        } finally {
          URI.encode = e;
          URI.decode = d;
        }
        return this;
      };
      p.unicode = function() {
        var e = URI.encode;
        var d = URI.decode;
        URI.encode = strictEncodeURIComponent;
        URI.decode = unescape;
        try {
          this.normalize();
        } finally {
          URI.encode = e;
          URI.decode = d;
        }
        return this;
      };
      p.readable = function() {
        var uri = this.clone();
        uri.username("").password("").normalize();
        var t = "";
        if (uri._parts.protocol) {
          t += uri._parts.protocol + "://";
        }
        if (uri._parts.hostname) {
          if (uri.is("punycode") && punycode) {
            t += punycode.toUnicode(uri._parts.hostname);
            if (uri._parts.port) {
              t += ":" + uri._parts.port;
            }
          } else {
            t += uri.host();
          }
        }
        if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== "/") {
          t += "/";
        }
        t += uri.path(true);
        if (uri._parts.query) {
          var q2 = "";
          for (var i = 0, qp = uri._parts.query.split("&"), l = qp.length; i < l; i++) {
            var kv = (qp[i] || "").split("=");
            q2 += "&" + URI.decodeQuery(kv[0], this._parts.escapeQuerySpace).replace(/&/g, "%26");
            if (kv[1] !== void 0) {
              q2 += "=" + URI.decodeQuery(kv[1], this._parts.escapeQuerySpace).replace(/&/g, "%26");
            }
          }
          t += "?" + q2.substring(1);
        }
        t += URI.decodeQuery(uri.hash(), true);
        return t;
      };
      p.absoluteTo = function(base) {
        var resolved = this.clone();
        var properties = ["protocol", "username", "password", "hostname", "port"];
        var basedir, i, p2;
        if (this._parts.urn) {
          throw new Error("URNs do not have any generally defined hierarchical components");
        }
        if (!(base instanceof URI)) {
          base = new URI(base);
        }
        if (resolved._parts.protocol) {
          return resolved;
        } else {
          resolved._parts.protocol = base._parts.protocol;
        }
        if (this._parts.hostname) {
          return resolved;
        }
        for (i = 0; p2 = properties[i]; i++) {
          resolved._parts[p2] = base._parts[p2];
        }
        if (!resolved._parts.path) {
          resolved._parts.path = base._parts.path;
          if (!resolved._parts.query) {
            resolved._parts.query = base._parts.query;
          }
        } else {
          if (resolved._parts.path.substring(-2) === "..") {
            resolved._parts.path += "/";
          }
          if (resolved.path().charAt(0) !== "/") {
            basedir = base.directory();
            basedir = basedir ? basedir : base.path().indexOf("/") === 0 ? "/" : "";
            resolved._parts.path = (basedir ? basedir + "/" : "") + resolved._parts.path;
            resolved.normalizePath();
          }
        }
        resolved.build();
        return resolved;
      };
      p.relativeTo = function(base) {
        var relative = this.clone().normalize();
        var relativeParts, baseParts, common, relativePath, basePath;
        if (relative._parts.urn) {
          throw new Error("URNs do not have any generally defined hierarchical components");
        }
        base = new URI(base).normalize();
        relativeParts = relative._parts;
        baseParts = base._parts;
        relativePath = relative.path();
        basePath = base.path();
        if (relativePath.charAt(0) !== "/") {
          throw new Error("URI is already relative");
        }
        if (basePath.charAt(0) !== "/") {
          throw new Error("Cannot calculate a URI relative to another relative URI");
        }
        if (relativeParts.protocol === baseParts.protocol) {
          relativeParts.protocol = null;
        }
        if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
          return relative.build();
        }
        if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
          return relative.build();
        }
        if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
          relativeParts.hostname = null;
          relativeParts.port = null;
        } else {
          return relative.build();
        }
        if (relativePath === basePath) {
          relativeParts.path = "";
          return relative.build();
        }
        common = URI.commonPath(relativePath, basePath);
        if (!common) {
          return relative.build();
        }
        var parents = baseParts.path.substring(common.length).replace(/[^\/]*$/, "").replace(/.*?\//g, "../");
        relativeParts.path = parents + relativeParts.path.substring(common.length) || "./";
        return relative.build();
      };
      p.equals = function(uri) {
        var one = this.clone();
        var two = new URI(uri);
        var one_map = {};
        var two_map = {};
        var checked = {};
        var one_query, two_query, key;
        one.normalize();
        two.normalize();
        if (one.toString() === two.toString()) {
          return true;
        }
        one_query = one.query();
        two_query = two.query();
        one.query("");
        two.query("");
        if (one.toString() !== two.toString()) {
          return false;
        }
        if (one_query.length !== two_query.length) {
          return false;
        }
        one_map = URI.parseQuery(one_query, this._parts.escapeQuerySpace);
        two_map = URI.parseQuery(two_query, this._parts.escapeQuerySpace);
        for (key in one_map) {
          if (hasOwn.call(one_map, key)) {
            if (!isArray(one_map[key])) {
              if (one_map[key] !== two_map[key]) {
                return false;
              }
            } else if (!arraysEqual(one_map[key], two_map[key])) {
              return false;
            }
            checked[key] = true;
          }
        }
        for (key in two_map) {
          if (hasOwn.call(two_map, key)) {
            if (!checked[key]) {
              return false;
            }
          }
        }
        return true;
      };
      p.preventInvalidHostname = function(v) {
        this._parts.preventInvalidHostname = !!v;
        return this;
      };
      p.duplicateQueryParameters = function(v) {
        this._parts.duplicateQueryParameters = !!v;
        return this;
      };
      p.escapeQuerySpace = function(v) {
        this._parts.escapeQuerySpace = !!v;
        return this;
      };
      return URI;
    });
  }
});

// node_modules/@stellar/stellar-base/dist/stellar-base.min.js
var require_stellar_base_min = __commonJS({
  "node_modules/@stellar/stellar-base/dist/stellar-base.min.js"(exports, module) {
    !(function(e, t) {
      "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("StellarBase", [], t) : "object" == typeof exports ? exports.StellarBase = t() : e.StellarBase = t();
    })(self, () => (() => {
      var e = { 41: (e2, t2, r2) => {
        "use strict";
        var n = r2(655), o = r2(8068), i = r2(9675), a = r2(5795);
        e2.exports = function(e3, t3, r3) {
          if (!e3 || "object" != typeof e3 && "function" != typeof e3) throw new i("`obj` must be an object or a function`");
          if ("string" != typeof t3 && "symbol" != typeof t3) throw new i("`property` must be a string or a symbol`");
          if (arguments.length > 3 && "boolean" != typeof arguments[3] && null !== arguments[3]) throw new i("`nonEnumerable`, if provided, must be a boolean or null");
          if (arguments.length > 4 && "boolean" != typeof arguments[4] && null !== arguments[4]) throw new i("`nonWritable`, if provided, must be a boolean or null");
          if (arguments.length > 5 && "boolean" != typeof arguments[5] && null !== arguments[5]) throw new i("`nonConfigurable`, if provided, must be a boolean or null");
          if (arguments.length > 6 && "boolean" != typeof arguments[6]) throw new i("`loose`, if provided, must be a boolean");
          var s = arguments.length > 3 ? arguments[3] : null, u = arguments.length > 4 ? arguments[4] : null, c = arguments.length > 5 ? arguments[5] : null, l = arguments.length > 6 && arguments[6], f = !!a && a(e3, t3);
          if (n) n(e3, t3, { configurable: null === c && f ? f.configurable : !c, enumerable: null === s && f ? f.enumerable : !s, value: r3, writable: null === u && f ? f.writable : !u });
          else {
            if (!l && (s || u || c)) throw new o("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
            e3[t3] = r3;
          }
        };
      }, 76: (e2) => {
        "use strict";
        e2.exports = Function.prototype.call;
      }, 251: (e2, t2) => {
        t2.read = function(e3, t3, r2, n, o) {
          var i, a, s = 8 * o - n - 1, u = (1 << s) - 1, c = u >> 1, l = -7, f = r2 ? o - 1 : 0, p = r2 ? -1 : 1, d = e3[t3 + f];
          for (f += p, i = d & (1 << -l) - 1, d >>= -l, l += s; l > 0; i = 256 * i + e3[t3 + f], f += p, l -= 8) ;
          for (a = i & (1 << -l) - 1, i >>= -l, l += n; l > 0; a = 256 * a + e3[t3 + f], f += p, l -= 8) ;
          if (0 === i) i = 1 - c;
          else {
            if (i === u) return a ? NaN : 1 / 0 * (d ? -1 : 1);
            a += Math.pow(2, n), i -= c;
          }
          return (d ? -1 : 1) * a * Math.pow(2, i - n);
        }, t2.write = function(e3, t3, r2, n, o, i) {
          var a, s, u, c = 8 * i - o - 1, l = (1 << c) - 1, f = l >> 1, p = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = n ? 0 : i - 1, h = n ? 1 : -1, y = t3 < 0 || 0 === t3 && 1 / t3 < 0 ? 1 : 0;
          for (t3 = Math.abs(t3), isNaN(t3) || t3 === 1 / 0 ? (s = isNaN(t3) ? 1 : 0, a = l) : (a = Math.floor(Math.log(t3) / Math.LN2), t3 * (u = Math.pow(2, -a)) < 1 && (a--, u *= 2), (t3 += a + f >= 1 ? p / u : p * Math.pow(2, 1 - f)) * u >= 2 && (a++, u /= 2), a + f >= l ? (s = 0, a = l) : a + f >= 1 ? (s = (t3 * u - 1) * Math.pow(2, o), a += f) : (s = t3 * Math.pow(2, f - 1) * Math.pow(2, o), a = 0)); o >= 8; e3[r2 + d] = 255 & s, d += h, s /= 256, o -= 8) ;
          for (a = a << o | s, c += o; c > 0; e3[r2 + d] = 255 & a, d += h, a /= 256, c -= 8) ;
          e3[r2 + d - h] |= 128 * y;
        };
      }, 392: (e2, t2, r2) => {
        "use strict";
        var n = r2(2861).Buffer, o = r2(5377);
        function i(e3, t3) {
          this._block = n.alloc(e3), this._finalSize = t3, this._blockSize = e3, this._len = 0;
        }
        i.prototype.update = function(e3, t3) {
          e3 = o(e3, t3 || "utf8");
          for (var r3 = this._block, n2 = this._blockSize, i2 = e3.length, a = this._len, s = 0; s < i2; ) {
            for (var u = a % n2, c = Math.min(i2 - s, n2 - u), l = 0; l < c; l++) r3[u + l] = e3[s + l];
            s += c, (a += c) % n2 === 0 && this._update(r3);
          }
          return this._len += i2, this;
        }, i.prototype.digest = function(e3) {
          var t3 = this._len % this._blockSize;
          this._block[t3] = 128, this._block.fill(0, t3 + 1), t3 >= this._finalSize && (this._update(this._block), this._block.fill(0));
          var r3 = 8 * this._len;
          if (r3 <= 4294967295) this._block.writeUInt32BE(r3, this._blockSize - 4);
          else {
            var n2 = (4294967295 & r3) >>> 0, o2 = (r3 - n2) / 4294967296;
            this._block.writeUInt32BE(o2, this._blockSize - 8), this._block.writeUInt32BE(n2, this._blockSize - 4);
          }
          this._update(this._block);
          var i2 = this._hash();
          return e3 ? i2.toString(e3) : i2;
        }, i.prototype._update = function() {
          throw new Error("_update must be implemented by subclass");
        }, e2.exports = i;
      }, 414: (e2) => {
        "use strict";
        e2.exports = Math.round;
      }, 448: (e2, t2, r2) => {
        "use strict";
        r2.r(t2), r2.d(t2, { Account: () => vo, Address: () => On, Asset: () => yr, AuthClawbackEnabledFlag: () => Fn, AuthImmutableFlag: () => Ln, AuthRequiredFlag: () => Un, AuthRevocableFlag: () => Nn, BASE_FEE: () => Mo, Claimant: () => an, Contract: () => Qo, FeeBumpTransaction: () => ho, Hyper: () => n.Hyper, Int128: () => ki, Int256: () => Ci, Keypair: () => lr, LiquidityPoolAsset: () => tn, LiquidityPoolFeeV18: () => vr, LiquidityPoolId: () => ln, Memo: () => Wn, MemoHash: () => $n, MemoID: () => zn, MemoNone: () => Hn, MemoReturn: () => Gn, MemoText: () => Xn, MuxedAccount: () => Eo, Networks: () => Ko, Operation: () => jn, ScInt: () => Hi, SignerKey: () => Io, Soroban: () => Wo, SorobanDataBuilder: () => Oo, StrKey: () => tr, TimeoutInfinite: () => Do, Transaction: () => oo, TransactionBase: () => Ar, TransactionBuilder: () => Vo, Uint128: () => si, Uint256: () => yi, UnsignedHyper: () => n.UnsignedHyper, XdrLargeInt: () => Li, authorizeEntry: () => la, authorizeInvocation: () => pa, buildInvocationTree: () => ma, cereal: () => a, decodeAddressToMuxedAccount: () => pn, default: () => ba, encodeMuxedAccount: () => hn, encodeMuxedAccountToAddress: () => dn, extractBaseAddress: () => yn, getLiquidityPoolId: () => br, hash: () => u, humanizeEvents: () => oa, nativeToScVal: () => Ji, scValToBigInt: () => zi, scValToNative: () => Qi, sign: () => qt, verify: () => Kt, walkInvocationTree: () => ga, xdr: () => i });
        var n = r2(3740), o = n.config(function(e3) {
          var t3 = 1024;
          e3.typedef("Value", e3.varOpaque()), e3.struct("ScpBallot", [["counter", e3.lookup("Uint32")], ["value", e3.lookup("Value")]]), e3.enum("ScpStatementType", { scpStPrepare: 0, scpStConfirm: 1, scpStExternalize: 2, scpStNominate: 3 }), e3.struct("ScpNomination", [["quorumSetHash", e3.lookup("Hash")], ["votes", e3.varArray(e3.lookup("Value"), 2147483647)], ["accepted", e3.varArray(e3.lookup("Value"), 2147483647)]]), e3.struct("ScpStatementPrepare", [["quorumSetHash", e3.lookup("Hash")], ["ballot", e3.lookup("ScpBallot")], ["prepared", e3.option(e3.lookup("ScpBallot"))], ["preparedPrime", e3.option(e3.lookup("ScpBallot"))], ["nC", e3.lookup("Uint32")], ["nH", e3.lookup("Uint32")]]), e3.struct("ScpStatementConfirm", [["ballot", e3.lookup("ScpBallot")], ["nPrepared", e3.lookup("Uint32")], ["nCommit", e3.lookup("Uint32")], ["nH", e3.lookup("Uint32")], ["quorumSetHash", e3.lookup("Hash")]]), e3.struct("ScpStatementExternalize", [["commit", e3.lookup("ScpBallot")], ["nH", e3.lookup("Uint32")], ["commitQuorumSetHash", e3.lookup("Hash")]]), e3.union("ScpStatementPledges", { switchOn: e3.lookup("ScpStatementType"), switchName: "type", switches: [["scpStPrepare", "prepare"], ["scpStConfirm", "confirm"], ["scpStExternalize", "externalize"], ["scpStNominate", "nominate"]], arms: { prepare: e3.lookup("ScpStatementPrepare"), confirm: e3.lookup("ScpStatementConfirm"), externalize: e3.lookup("ScpStatementExternalize"), nominate: e3.lookup("ScpNomination") } }), e3.struct("ScpStatement", [["nodeId", e3.lookup("NodeId")], ["slotIndex", e3.lookup("Uint64")], ["pledges", e3.lookup("ScpStatementPledges")]]), e3.struct("ScpEnvelope", [["statement", e3.lookup("ScpStatement")], ["signature", e3.lookup("Signature")]]), e3.struct("ScpQuorumSet", [["threshold", e3.lookup("Uint32")], ["validators", e3.varArray(e3.lookup("NodeId"), 2147483647)], ["innerSets", e3.varArray(e3.lookup("ScpQuorumSet"), 2147483647)]]), e3.typedef("Thresholds", e3.opaque(4)), e3.typedef("String32", e3.string(32)), e3.typedef("String64", e3.string(64)), e3.typedef("SequenceNumber", e3.lookup("Int64")), e3.typedef("DataValue", e3.varOpaque(64)), e3.typedef("AssetCode4", e3.opaque(4)), e3.typedef("AssetCode12", e3.opaque(12)), e3.enum("AssetType", { assetTypeNative: 0, assetTypeCreditAlphanum4: 1, assetTypeCreditAlphanum12: 2, assetTypePoolShare: 3 }), e3.union("AssetCode", { switchOn: e3.lookup("AssetType"), switchName: "type", switches: [["assetTypeCreditAlphanum4", "assetCode4"], ["assetTypeCreditAlphanum12", "assetCode12"]], arms: { assetCode4: e3.lookup("AssetCode4"), assetCode12: e3.lookup("AssetCode12") } }), e3.struct("AlphaNum4", [["assetCode", e3.lookup("AssetCode4")], ["issuer", e3.lookup("AccountId")]]), e3.struct("AlphaNum12", [["assetCode", e3.lookup("AssetCode12")], ["issuer", e3.lookup("AccountId")]]), e3.union("Asset", { switchOn: e3.lookup("AssetType"), switchName: "type", switches: [["assetTypeNative", e3.void()], ["assetTypeCreditAlphanum4", "alphaNum4"], ["assetTypeCreditAlphanum12", "alphaNum12"]], arms: { alphaNum4: e3.lookup("AlphaNum4"), alphaNum12: e3.lookup("AlphaNum12") } }), e3.struct("Price", [["n", e3.lookup("Int32")], ["d", e3.lookup("Int32")]]), e3.struct("Liabilities", [["buying", e3.lookup("Int64")], ["selling", e3.lookup("Int64")]]), e3.enum("ThresholdIndices", { thresholdMasterWeight: 0, thresholdLow: 1, thresholdMed: 2, thresholdHigh: 3 }), e3.enum("LedgerEntryType", { account: 0, trustline: 1, offer: 2, data: 3, claimableBalance: 4, liquidityPool: 5, contractData: 6, contractCode: 7, configSetting: 8, ttl: 9 }), e3.struct("Signer", [["key", e3.lookup("SignerKey")], ["weight", e3.lookup("Uint32")]]), e3.enum("AccountFlags", { authRequiredFlag: 1, authRevocableFlag: 2, authImmutableFlag: 4, authClawbackEnabledFlag: 8 }), e3.const("MASK_ACCOUNT_FLAGS", 7), e3.const("MASK_ACCOUNT_FLAGS_V17", 15), e3.const("MAX_SIGNERS", 20), e3.typedef("SponsorshipDescriptor", e3.option(e3.lookup("AccountId"))), e3.struct("AccountEntryExtensionV3", [["ext", e3.lookup("ExtensionPoint")], ["seqLedger", e3.lookup("Uint32")], ["seqTime", e3.lookup("TimePoint")]]), e3.union("AccountEntryExtensionV2Ext", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [3, "v3"]], arms: { v3: e3.lookup("AccountEntryExtensionV3") } }), e3.struct("AccountEntryExtensionV2", [["numSponsored", e3.lookup("Uint32")], ["numSponsoring", e3.lookup("Uint32")], ["signerSponsoringIDs", e3.varArray(e3.lookup("SponsorshipDescriptor"), e3.lookup("MAX_SIGNERS"))], ["ext", e3.lookup("AccountEntryExtensionV2Ext")]]), e3.union("AccountEntryExtensionV1Ext", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [2, "v2"]], arms: { v2: e3.lookup("AccountEntryExtensionV2") } }), e3.struct("AccountEntryExtensionV1", [["liabilities", e3.lookup("Liabilities")], ["ext", e3.lookup("AccountEntryExtensionV1Ext")]]), e3.union("AccountEntryExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [1, "v1"]], arms: { v1: e3.lookup("AccountEntryExtensionV1") } }), e3.struct("AccountEntry", [["accountId", e3.lookup("AccountId")], ["balance", e3.lookup("Int64")], ["seqNum", e3.lookup("SequenceNumber")], ["numSubEntries", e3.lookup("Uint32")], ["inflationDest", e3.option(e3.lookup("AccountId"))], ["flags", e3.lookup("Uint32")], ["homeDomain", e3.lookup("String32")], ["thresholds", e3.lookup("Thresholds")], ["signers", e3.varArray(e3.lookup("Signer"), e3.lookup("MAX_SIGNERS"))], ["ext", e3.lookup("AccountEntryExt")]]), e3.enum("TrustLineFlags", { authorizedFlag: 1, authorizedToMaintainLiabilitiesFlag: 2, trustlineClawbackEnabledFlag: 4 }), e3.const("MASK_TRUSTLINE_FLAGS", 1), e3.const("MASK_TRUSTLINE_FLAGS_V13", 3), e3.const("MASK_TRUSTLINE_FLAGS_V17", 7), e3.enum("LiquidityPoolType", { liquidityPoolConstantProduct: 0 }), e3.union("TrustLineAsset", { switchOn: e3.lookup("AssetType"), switchName: "type", switches: [["assetTypeNative", e3.void()], ["assetTypeCreditAlphanum4", "alphaNum4"], ["assetTypeCreditAlphanum12", "alphaNum12"], ["assetTypePoolShare", "liquidityPoolId"]], arms: { alphaNum4: e3.lookup("AlphaNum4"), alphaNum12: e3.lookup("AlphaNum12"), liquidityPoolId: e3.lookup("PoolId") } }), e3.union("TrustLineEntryExtensionV2Ext", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()]], arms: {} }), e3.struct("TrustLineEntryExtensionV2", [["liquidityPoolUseCount", e3.lookup("Int32")], ["ext", e3.lookup("TrustLineEntryExtensionV2Ext")]]), e3.union("TrustLineEntryV1Ext", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [2, "v2"]], arms: { v2: e3.lookup("TrustLineEntryExtensionV2") } }), e3.struct("TrustLineEntryV1", [["liabilities", e3.lookup("Liabilities")], ["ext", e3.lookup("TrustLineEntryV1Ext")]]), e3.union("TrustLineEntryExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [1, "v1"]], arms: { v1: e3.lookup("TrustLineEntryV1") } }), e3.struct("TrustLineEntry", [["accountId", e3.lookup("AccountId")], ["asset", e3.lookup("TrustLineAsset")], ["balance", e3.lookup("Int64")], ["limit", e3.lookup("Int64")], ["flags", e3.lookup("Uint32")], ["ext", e3.lookup("TrustLineEntryExt")]]), e3.enum("OfferEntryFlags", { passiveFlag: 1 }), e3.const("MASK_OFFERENTRY_FLAGS", 1), e3.union("OfferEntryExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()]], arms: {} }), e3.struct("OfferEntry", [["sellerId", e3.lookup("AccountId")], ["offerId", e3.lookup("Int64")], ["selling", e3.lookup("Asset")], ["buying", e3.lookup("Asset")], ["amount", e3.lookup("Int64")], ["price", e3.lookup("Price")], ["flags", e3.lookup("Uint32")], ["ext", e3.lookup("OfferEntryExt")]]), e3.union("DataEntryExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()]], arms: {} }), e3.struct("DataEntry", [["accountId", e3.lookup("AccountId")], ["dataName", e3.lookup("String64")], ["dataValue", e3.lookup("DataValue")], ["ext", e3.lookup("DataEntryExt")]]), e3.enum("ClaimPredicateType", { claimPredicateUnconditional: 0, claimPredicateAnd: 1, claimPredicateOr: 2, claimPredicateNot: 3, claimPredicateBeforeAbsoluteTime: 4, claimPredicateBeforeRelativeTime: 5 }), e3.union("ClaimPredicate", { switchOn: e3.lookup("ClaimPredicateType"), switchName: "type", switches: [["claimPredicateUnconditional", e3.void()], ["claimPredicateAnd", "andPredicates"], ["claimPredicateOr", "orPredicates"], ["claimPredicateNot", "notPredicate"], ["claimPredicateBeforeAbsoluteTime", "absBefore"], ["claimPredicateBeforeRelativeTime", "relBefore"]], arms: { andPredicates: e3.varArray(e3.lookup("ClaimPredicate"), 2), orPredicates: e3.varArray(e3.lookup("ClaimPredicate"), 2), notPredicate: e3.option(e3.lookup("ClaimPredicate")), absBefore: e3.lookup("Int64"), relBefore: e3.lookup("Int64") } }), e3.enum("ClaimantType", { claimantTypeV0: 0 }), e3.struct("ClaimantV0", [["destination", e3.lookup("AccountId")], ["predicate", e3.lookup("ClaimPredicate")]]), e3.union("Claimant", { switchOn: e3.lookup("ClaimantType"), switchName: "type", switches: [["claimantTypeV0", "v0"]], arms: { v0: e3.lookup("ClaimantV0") } }), e3.enum("ClaimableBalanceFlags", { claimableBalanceClawbackEnabledFlag: 1 }), e3.const("MASK_CLAIMABLE_BALANCE_FLAGS", 1), e3.union("ClaimableBalanceEntryExtensionV1Ext", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()]], arms: {} }), e3.struct("ClaimableBalanceEntryExtensionV1", [["ext", e3.lookup("ClaimableBalanceEntryExtensionV1Ext")], ["flags", e3.lookup("Uint32")]]), e3.union("ClaimableBalanceEntryExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [1, "v1"]], arms: { v1: e3.lookup("ClaimableBalanceEntryExtensionV1") } }), e3.struct("ClaimableBalanceEntry", [["balanceId", e3.lookup("ClaimableBalanceId")], ["claimants", e3.varArray(e3.lookup("Claimant"), 10)], ["asset", e3.lookup("Asset")], ["amount", e3.lookup("Int64")], ["ext", e3.lookup("ClaimableBalanceEntryExt")]]), e3.struct("LiquidityPoolConstantProductParameters", [["assetA", e3.lookup("Asset")], ["assetB", e3.lookup("Asset")], ["fee", e3.lookup("Int32")]]), e3.struct("LiquidityPoolEntryConstantProduct", [["params", e3.lookup("LiquidityPoolConstantProductParameters")], ["reserveA", e3.lookup("Int64")], ["reserveB", e3.lookup("Int64")], ["totalPoolShares", e3.lookup("Int64")], ["poolSharesTrustLineCount", e3.lookup("Int64")]]), e3.union("LiquidityPoolEntryBody", { switchOn: e3.lookup("LiquidityPoolType"), switchName: "type", switches: [["liquidityPoolConstantProduct", "constantProduct"]], arms: { constantProduct: e3.lookup("LiquidityPoolEntryConstantProduct") } }), e3.struct("LiquidityPoolEntry", [["liquidityPoolId", e3.lookup("PoolId")], ["body", e3.lookup("LiquidityPoolEntryBody")]]), e3.enum("ContractDataDurability", { temporary: 0, persistent: 1 }), e3.struct("ContractDataEntry", [["ext", e3.lookup("ExtensionPoint")], ["contract", e3.lookup("ScAddress")], ["key", e3.lookup("ScVal")], ["durability", e3.lookup("ContractDataDurability")], ["val", e3.lookup("ScVal")]]), e3.struct("ContractCodeCostInputs", [["ext", e3.lookup("ExtensionPoint")], ["nInstructions", e3.lookup("Uint32")], ["nFunctions", e3.lookup("Uint32")], ["nGlobals", e3.lookup("Uint32")], ["nTableEntries", e3.lookup("Uint32")], ["nTypes", e3.lookup("Uint32")], ["nDataSegments", e3.lookup("Uint32")], ["nElemSegments", e3.lookup("Uint32")], ["nImports", e3.lookup("Uint32")], ["nExports", e3.lookup("Uint32")], ["nDataSegmentBytes", e3.lookup("Uint32")]]), e3.struct("ContractCodeEntryV1", [["ext", e3.lookup("ExtensionPoint")], ["costInputs", e3.lookup("ContractCodeCostInputs")]]), e3.union("ContractCodeEntryExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [1, "v1"]], arms: { v1: e3.lookup("ContractCodeEntryV1") } }), e3.struct("ContractCodeEntry", [["ext", e3.lookup("ContractCodeEntryExt")], ["hash", e3.lookup("Hash")], ["code", e3.varOpaque()]]), e3.struct("TtlEntry", [["keyHash", e3.lookup("Hash")], ["liveUntilLedgerSeq", e3.lookup("Uint32")]]), e3.union("LedgerEntryExtensionV1Ext", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()]], arms: {} }), e3.struct("LedgerEntryExtensionV1", [["sponsoringId", e3.lookup("SponsorshipDescriptor")], ["ext", e3.lookup("LedgerEntryExtensionV1Ext")]]), e3.union("LedgerEntryData", { switchOn: e3.lookup("LedgerEntryType"), switchName: "type", switches: [["account", "account"], ["trustline", "trustLine"], ["offer", "offer"], ["data", "data"], ["claimableBalance", "claimableBalance"], ["liquidityPool", "liquidityPool"], ["contractData", "contractData"], ["contractCode", "contractCode"], ["configSetting", "configSetting"], ["ttl", "ttl"]], arms: { account: e3.lookup("AccountEntry"), trustLine: e3.lookup("TrustLineEntry"), offer: e3.lookup("OfferEntry"), data: e3.lookup("DataEntry"), claimableBalance: e3.lookup("ClaimableBalanceEntry"), liquidityPool: e3.lookup("LiquidityPoolEntry"), contractData: e3.lookup("ContractDataEntry"), contractCode: e3.lookup("ContractCodeEntry"), configSetting: e3.lookup("ConfigSettingEntry"), ttl: e3.lookup("TtlEntry") } }), e3.union("LedgerEntryExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [1, "v1"]], arms: { v1: e3.lookup("LedgerEntryExtensionV1") } }), e3.struct("LedgerEntry", [["lastModifiedLedgerSeq", e3.lookup("Uint32")], ["data", e3.lookup("LedgerEntryData")], ["ext", e3.lookup("LedgerEntryExt")]]), e3.struct("LedgerKeyAccount", [["accountId", e3.lookup("AccountId")]]), e3.struct("LedgerKeyTrustLine", [["accountId", e3.lookup("AccountId")], ["asset", e3.lookup("TrustLineAsset")]]), e3.struct("LedgerKeyOffer", [["sellerId", e3.lookup("AccountId")], ["offerId", e3.lookup("Int64")]]), e3.struct("LedgerKeyData", [["accountId", e3.lookup("AccountId")], ["dataName", e3.lookup("String64")]]), e3.struct("LedgerKeyClaimableBalance", [["balanceId", e3.lookup("ClaimableBalanceId")]]), e3.struct("LedgerKeyLiquidityPool", [["liquidityPoolId", e3.lookup("PoolId")]]), e3.struct("LedgerKeyContractData", [["contract", e3.lookup("ScAddress")], ["key", e3.lookup("ScVal")], ["durability", e3.lookup("ContractDataDurability")]]), e3.struct("LedgerKeyContractCode", [["hash", e3.lookup("Hash")]]), e3.struct("LedgerKeyConfigSetting", [["configSettingId", e3.lookup("ConfigSettingId")]]), e3.struct("LedgerKeyTtl", [["keyHash", e3.lookup("Hash")]]), e3.union("LedgerKey", { switchOn: e3.lookup("LedgerEntryType"), switchName: "type", switches: [["account", "account"], ["trustline", "trustLine"], ["offer", "offer"], ["data", "data"], ["claimableBalance", "claimableBalance"], ["liquidityPool", "liquidityPool"], ["contractData", "contractData"], ["contractCode", "contractCode"], ["configSetting", "configSetting"], ["ttl", "ttl"]], arms: { account: e3.lookup("LedgerKeyAccount"), trustLine: e3.lookup("LedgerKeyTrustLine"), offer: e3.lookup("LedgerKeyOffer"), data: e3.lookup("LedgerKeyData"), claimableBalance: e3.lookup("LedgerKeyClaimableBalance"), liquidityPool: e3.lookup("LedgerKeyLiquidityPool"), contractData: e3.lookup("LedgerKeyContractData"), contractCode: e3.lookup("LedgerKeyContractCode"), configSetting: e3.lookup("LedgerKeyConfigSetting"), ttl: e3.lookup("LedgerKeyTtl") } }), e3.enum("EnvelopeType", { envelopeTypeTxV0: 0, envelopeTypeScp: 1, envelopeTypeTx: 2, envelopeTypeAuth: 3, envelopeTypeScpvalue: 4, envelopeTypeTxFeeBump: 5, envelopeTypeOpId: 6, envelopeTypePoolRevokeOpId: 7, envelopeTypeContractId: 8, envelopeTypeSorobanAuthorization: 9 }), e3.enum("BucketListType", { live: 0, hotArchive: 1 }), e3.enum("BucketEntryType", { metaentry: -1, liveentry: 0, deadentry: 1, initentry: 2 }), e3.enum("HotArchiveBucketEntryType", { hotArchiveMetaentry: -1, hotArchiveArchived: 0, hotArchiveLive: 1 }), e3.union("BucketMetadataExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [1, "bucketListType"]], arms: { bucketListType: e3.lookup("BucketListType") } }), e3.struct("BucketMetadata", [["ledgerVersion", e3.lookup("Uint32")], ["ext", e3.lookup("BucketMetadataExt")]]), e3.union("BucketEntry", { switchOn: e3.lookup("BucketEntryType"), switchName: "type", switches: [["liveentry", "liveEntry"], ["initentry", "liveEntry"], ["deadentry", "deadEntry"], ["metaentry", "metaEntry"]], arms: { liveEntry: e3.lookup("LedgerEntry"), deadEntry: e3.lookup("LedgerKey"), metaEntry: e3.lookup("BucketMetadata") } }), e3.union("HotArchiveBucketEntry", { switchOn: e3.lookup("HotArchiveBucketEntryType"), switchName: "type", switches: [["hotArchiveArchived", "archivedEntry"], ["hotArchiveLive", "key"], ["hotArchiveMetaentry", "metaEntry"]], arms: { archivedEntry: e3.lookup("LedgerEntry"), key: e3.lookup("LedgerKey"), metaEntry: e3.lookup("BucketMetadata") } }), e3.typedef("UpgradeType", e3.varOpaque(128)), e3.enum("StellarValueType", { stellarValueBasic: 0, stellarValueSigned: 1 }), e3.struct("LedgerCloseValueSignature", [["nodeId", e3.lookup("NodeId")], ["signature", e3.lookup("Signature")]]), e3.union("StellarValueExt", { switchOn: e3.lookup("StellarValueType"), switchName: "v", switches: [["stellarValueBasic", e3.void()], ["stellarValueSigned", "lcValueSignature"]], arms: { lcValueSignature: e3.lookup("LedgerCloseValueSignature") } }), e3.struct("StellarValue", [["txSetHash", e3.lookup("Hash")], ["closeTime", e3.lookup("TimePoint")], ["upgrades", e3.varArray(e3.lookup("UpgradeType"), 6)], ["ext", e3.lookup("StellarValueExt")]]), e3.const("MASK_LEDGER_HEADER_FLAGS", 7), e3.enum("LedgerHeaderFlags", { disableLiquidityPoolTradingFlag: 1, disableLiquidityPoolDepositFlag: 2, disableLiquidityPoolWithdrawalFlag: 4 }), e3.union("LedgerHeaderExtensionV1Ext", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()]], arms: {} }), e3.struct("LedgerHeaderExtensionV1", [["flags", e3.lookup("Uint32")], ["ext", e3.lookup("LedgerHeaderExtensionV1Ext")]]), e3.union("LedgerHeaderExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [1, "v1"]], arms: { v1: e3.lookup("LedgerHeaderExtensionV1") } }), e3.struct("LedgerHeader", [["ledgerVersion", e3.lookup("Uint32")], ["previousLedgerHash", e3.lookup("Hash")], ["scpValue", e3.lookup("StellarValue")], ["txSetResultHash", e3.lookup("Hash")], ["bucketListHash", e3.lookup("Hash")], ["ledgerSeq", e3.lookup("Uint32")], ["totalCoins", e3.lookup("Int64")], ["feePool", e3.lookup("Int64")], ["inflationSeq", e3.lookup("Uint32")], ["idPool", e3.lookup("Uint64")], ["baseFee", e3.lookup("Uint32")], ["baseReserve", e3.lookup("Uint32")], ["maxTxSetSize", e3.lookup("Uint32")], ["skipList", e3.array(e3.lookup("Hash"), 4)], ["ext", e3.lookup("LedgerHeaderExt")]]), e3.enum("LedgerUpgradeType", { ledgerUpgradeVersion: 1, ledgerUpgradeBaseFee: 2, ledgerUpgradeMaxTxSetSize: 3, ledgerUpgradeBaseReserve: 4, ledgerUpgradeFlags: 5, ledgerUpgradeConfig: 6, ledgerUpgradeMaxSorobanTxSetSize: 7 }), e3.struct("ConfigUpgradeSetKey", [["contractId", e3.lookup("ContractId")], ["contentHash", e3.lookup("Hash")]]), e3.union("LedgerUpgrade", { switchOn: e3.lookup("LedgerUpgradeType"), switchName: "type", switches: [["ledgerUpgradeVersion", "newLedgerVersion"], ["ledgerUpgradeBaseFee", "newBaseFee"], ["ledgerUpgradeMaxTxSetSize", "newMaxTxSetSize"], ["ledgerUpgradeBaseReserve", "newBaseReserve"], ["ledgerUpgradeFlags", "newFlags"], ["ledgerUpgradeConfig", "newConfig"], ["ledgerUpgradeMaxSorobanTxSetSize", "newMaxSorobanTxSetSize"]], arms: { newLedgerVersion: e3.lookup("Uint32"), newBaseFee: e3.lookup("Uint32"), newMaxTxSetSize: e3.lookup("Uint32"), newBaseReserve: e3.lookup("Uint32"), newFlags: e3.lookup("Uint32"), newConfig: e3.lookup("ConfigUpgradeSetKey"), newMaxSorobanTxSetSize: e3.lookup("Uint32") } }), e3.struct("ConfigUpgradeSet", [["updatedEntry", e3.varArray(e3.lookup("ConfigSettingEntry"), 2147483647)]]), e3.enum("TxSetComponentType", { txsetCompTxsMaybeDiscountedFee: 0 }), e3.typedef("DependentTxCluster", e3.varArray(e3.lookup("TransactionEnvelope"), 2147483647)), e3.typedef("ParallelTxExecutionStage", e3.varArray(e3.lookup("DependentTxCluster"), 2147483647)), e3.struct("ParallelTxsComponent", [["baseFee", e3.option(e3.lookup("Int64"))], ["executionStages", e3.varArray(e3.lookup("ParallelTxExecutionStage"), 2147483647)]]), e3.struct("TxSetComponentTxsMaybeDiscountedFee", [["baseFee", e3.option(e3.lookup("Int64"))], ["txes", e3.varArray(e3.lookup("TransactionEnvelope"), 2147483647)]]), e3.union("TxSetComponent", { switchOn: e3.lookup("TxSetComponentType"), switchName: "type", switches: [["txsetCompTxsMaybeDiscountedFee", "txsMaybeDiscountedFee"]], arms: { txsMaybeDiscountedFee: e3.lookup("TxSetComponentTxsMaybeDiscountedFee") } }), e3.union("TransactionPhase", { switchOn: e3.int(), switchName: "v", switches: [[0, "v0Components"], [1, "parallelTxsComponent"]], arms: { v0Components: e3.varArray(e3.lookup("TxSetComponent"), 2147483647), parallelTxsComponent: e3.lookup("ParallelTxsComponent") } }), e3.struct("TransactionSet", [["previousLedgerHash", e3.lookup("Hash")], ["txes", e3.varArray(e3.lookup("TransactionEnvelope"), 2147483647)]]), e3.struct("TransactionSetV1", [["previousLedgerHash", e3.lookup("Hash")], ["phases", e3.varArray(e3.lookup("TransactionPhase"), 2147483647)]]), e3.union("GeneralizedTransactionSet", { switchOn: e3.int(), switchName: "v", switches: [[1, "v1TxSet"]], arms: { v1TxSet: e3.lookup("TransactionSetV1") } }), e3.struct("TransactionResultPair", [["transactionHash", e3.lookup("Hash")], ["result", e3.lookup("TransactionResult")]]), e3.struct("TransactionResultSet", [["results", e3.varArray(e3.lookup("TransactionResultPair"), 2147483647)]]), e3.union("TransactionHistoryEntryExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [1, "generalizedTxSet"]], arms: { generalizedTxSet: e3.lookup("GeneralizedTransactionSet") } }), e3.struct("TransactionHistoryEntry", [["ledgerSeq", e3.lookup("Uint32")], ["txSet", e3.lookup("TransactionSet")], ["ext", e3.lookup("TransactionHistoryEntryExt")]]), e3.union("TransactionHistoryResultEntryExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()]], arms: {} }), e3.struct("TransactionHistoryResultEntry", [["ledgerSeq", e3.lookup("Uint32")], ["txResultSet", e3.lookup("TransactionResultSet")], ["ext", e3.lookup("TransactionHistoryResultEntryExt")]]), e3.union("LedgerHeaderHistoryEntryExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()]], arms: {} }), e3.struct("LedgerHeaderHistoryEntry", [["hash", e3.lookup("Hash")], ["header", e3.lookup("LedgerHeader")], ["ext", e3.lookup("LedgerHeaderHistoryEntryExt")]]), e3.struct("LedgerScpMessages", [["ledgerSeq", e3.lookup("Uint32")], ["messages", e3.varArray(e3.lookup("ScpEnvelope"), 2147483647)]]), e3.struct("ScpHistoryEntryV0", [["quorumSets", e3.varArray(e3.lookup("ScpQuorumSet"), 2147483647)], ["ledgerMessages", e3.lookup("LedgerScpMessages")]]), e3.union("ScpHistoryEntry", { switchOn: e3.int(), switchName: "v", switches: [[0, "v0"]], arms: { v0: e3.lookup("ScpHistoryEntryV0") } }), e3.enum("LedgerEntryChangeType", { ledgerEntryCreated: 0, ledgerEntryUpdated: 1, ledgerEntryRemoved: 2, ledgerEntryState: 3, ledgerEntryRestored: 4 }), e3.union("LedgerEntryChange", { switchOn: e3.lookup("LedgerEntryChangeType"), switchName: "type", switches: [["ledgerEntryCreated", "created"], ["ledgerEntryUpdated", "updated"], ["ledgerEntryRemoved", "removed"], ["ledgerEntryState", "state"], ["ledgerEntryRestored", "restored"]], arms: { created: e3.lookup("LedgerEntry"), updated: e3.lookup("LedgerEntry"), removed: e3.lookup("LedgerKey"), state: e3.lookup("LedgerEntry"), restored: e3.lookup("LedgerEntry") } }), e3.typedef("LedgerEntryChanges", e3.varArray(e3.lookup("LedgerEntryChange"), 2147483647)), e3.struct("OperationMeta", [["changes", e3.lookup("LedgerEntryChanges")]]), e3.struct("TransactionMetaV1", [["txChanges", e3.lookup("LedgerEntryChanges")], ["operations", e3.varArray(e3.lookup("OperationMeta"), 2147483647)]]), e3.struct("TransactionMetaV2", [["txChangesBefore", e3.lookup("LedgerEntryChanges")], ["operations", e3.varArray(e3.lookup("OperationMeta"), 2147483647)], ["txChangesAfter", e3.lookup("LedgerEntryChanges")]]), e3.enum("ContractEventType", { system: 0, contract: 1, diagnostic: 2 }), e3.struct("ContractEventV0", [["topics", e3.varArray(e3.lookup("ScVal"), 2147483647)], ["data", e3.lookup("ScVal")]]), e3.union("ContractEventBody", { switchOn: e3.int(), switchName: "v", switches: [[0, "v0"]], arms: { v0: e3.lookup("ContractEventV0") } }), e3.struct("ContractEvent", [["ext", e3.lookup("ExtensionPoint")], ["contractId", e3.option(e3.lookup("ContractId"))], ["type", e3.lookup("ContractEventType")], ["body", e3.lookup("ContractEventBody")]]), e3.struct("DiagnosticEvent", [["inSuccessfulContractCall", e3.bool()], ["event", e3.lookup("ContractEvent")]]), e3.struct("SorobanTransactionMetaExtV1", [["ext", e3.lookup("ExtensionPoint")], ["totalNonRefundableResourceFeeCharged", e3.lookup("Int64")], ["totalRefundableResourceFeeCharged", e3.lookup("Int64")], ["rentFeeCharged", e3.lookup("Int64")]]), e3.union("SorobanTransactionMetaExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [1, "v1"]], arms: { v1: e3.lookup("SorobanTransactionMetaExtV1") } }), e3.struct("SorobanTransactionMeta", [["ext", e3.lookup("SorobanTransactionMetaExt")], ["events", e3.varArray(e3.lookup("ContractEvent"), 2147483647)], ["returnValue", e3.lookup("ScVal")], ["diagnosticEvents", e3.varArray(e3.lookup("DiagnosticEvent"), 2147483647)]]), e3.struct("TransactionMetaV3", [["ext", e3.lookup("ExtensionPoint")], ["txChangesBefore", e3.lookup("LedgerEntryChanges")], ["operations", e3.varArray(e3.lookup("OperationMeta"), 2147483647)], ["txChangesAfter", e3.lookup("LedgerEntryChanges")], ["sorobanMeta", e3.option(e3.lookup("SorobanTransactionMeta"))]]), e3.struct("OperationMetaV2", [["ext", e3.lookup("ExtensionPoint")], ["changes", e3.lookup("LedgerEntryChanges")], ["events", e3.varArray(e3.lookup("ContractEvent"), 2147483647)]]), e3.struct("SorobanTransactionMetaV2", [["ext", e3.lookup("SorobanTransactionMetaExt")], ["returnValue", e3.option(e3.lookup("ScVal"))]]), e3.enum("TransactionEventStage", { transactionEventStageBeforeAllTxes: 0, transactionEventStageAfterTx: 1, transactionEventStageAfterAllTxes: 2 }), e3.struct("TransactionEvent", [["stage", e3.lookup("TransactionEventStage")], ["event", e3.lookup("ContractEvent")]]), e3.struct("TransactionMetaV4", [["ext", e3.lookup("ExtensionPoint")], ["txChangesBefore", e3.lookup("LedgerEntryChanges")], ["operations", e3.varArray(e3.lookup("OperationMetaV2"), 2147483647)], ["txChangesAfter", e3.lookup("LedgerEntryChanges")], ["sorobanMeta", e3.option(e3.lookup("SorobanTransactionMetaV2"))], ["events", e3.varArray(e3.lookup("TransactionEvent"), 2147483647)], ["diagnosticEvents", e3.varArray(e3.lookup("DiagnosticEvent"), 2147483647)]]), e3.struct("InvokeHostFunctionSuccessPreImage", [["returnValue", e3.lookup("ScVal")], ["events", e3.varArray(e3.lookup("ContractEvent"), 2147483647)]]), e3.union("TransactionMeta", { switchOn: e3.int(), switchName: "v", switches: [[0, "operations"], [1, "v1"], [2, "v2"], [3, "v3"], [4, "v4"]], arms: { operations: e3.varArray(e3.lookup("OperationMeta"), 2147483647), v1: e3.lookup("TransactionMetaV1"), v2: e3.lookup("TransactionMetaV2"), v3: e3.lookup("TransactionMetaV3"), v4: e3.lookup("TransactionMetaV4") } }), e3.struct("TransactionResultMeta", [["result", e3.lookup("TransactionResultPair")], ["feeProcessing", e3.lookup("LedgerEntryChanges")], ["txApplyProcessing", e3.lookup("TransactionMeta")]]), e3.struct("TransactionResultMetaV1", [["ext", e3.lookup("ExtensionPoint")], ["result", e3.lookup("TransactionResultPair")], ["feeProcessing", e3.lookup("LedgerEntryChanges")], ["txApplyProcessing", e3.lookup("TransactionMeta")], ["postTxApplyFeeProcessing", e3.lookup("LedgerEntryChanges")]]), e3.struct("UpgradeEntryMeta", [["upgrade", e3.lookup("LedgerUpgrade")], ["changes", e3.lookup("LedgerEntryChanges")]]), e3.struct("LedgerCloseMetaV0", [["ledgerHeader", e3.lookup("LedgerHeaderHistoryEntry")], ["txSet", e3.lookup("TransactionSet")], ["txProcessing", e3.varArray(e3.lookup("TransactionResultMeta"), 2147483647)], ["upgradesProcessing", e3.varArray(e3.lookup("UpgradeEntryMeta"), 2147483647)], ["scpInfo", e3.varArray(e3.lookup("ScpHistoryEntry"), 2147483647)]]), e3.struct("LedgerCloseMetaExtV1", [["ext", e3.lookup("ExtensionPoint")], ["sorobanFeeWrite1Kb", e3.lookup("Int64")]]), e3.union("LedgerCloseMetaExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [1, "v1"]], arms: { v1: e3.lookup("LedgerCloseMetaExtV1") } }), e3.struct("LedgerCloseMetaV1", [["ext", e3.lookup("LedgerCloseMetaExt")], ["ledgerHeader", e3.lookup("LedgerHeaderHistoryEntry")], ["txSet", e3.lookup("GeneralizedTransactionSet")], ["txProcessing", e3.varArray(e3.lookup("TransactionResultMeta"), 2147483647)], ["upgradesProcessing", e3.varArray(e3.lookup("UpgradeEntryMeta"), 2147483647)], ["scpInfo", e3.varArray(e3.lookup("ScpHistoryEntry"), 2147483647)], ["totalByteSizeOfLiveSorobanState", e3.lookup("Uint64")], ["evictedKeys", e3.varArray(e3.lookup("LedgerKey"), 2147483647)], ["unused", e3.varArray(e3.lookup("LedgerEntry"), 2147483647)]]), e3.struct("LedgerCloseMetaV2", [["ext", e3.lookup("LedgerCloseMetaExt")], ["ledgerHeader", e3.lookup("LedgerHeaderHistoryEntry")], ["txSet", e3.lookup("GeneralizedTransactionSet")], ["txProcessing", e3.varArray(e3.lookup("TransactionResultMetaV1"), 2147483647)], ["upgradesProcessing", e3.varArray(e3.lookup("UpgradeEntryMeta"), 2147483647)], ["scpInfo", e3.varArray(e3.lookup("ScpHistoryEntry"), 2147483647)], ["totalByteSizeOfLiveSorobanState", e3.lookup("Uint64")], ["evictedKeys", e3.varArray(e3.lookup("LedgerKey"), 2147483647)]]), e3.union("LedgerCloseMeta", { switchOn: e3.int(), switchName: "v", switches: [[0, "v0"], [1, "v1"], [2, "v2"]], arms: { v0: e3.lookup("LedgerCloseMetaV0"), v1: e3.lookup("LedgerCloseMetaV1"), v2: e3.lookup("LedgerCloseMetaV2") } }), e3.enum("ErrorCode", { errMisc: 0, errData: 1, errConf: 2, errAuth: 3, errLoad: 4 }), e3.struct("Error", [["code", e3.lookup("ErrorCode")], ["msg", e3.string(100)]]), e3.struct("SendMore", [["numMessages", e3.lookup("Uint32")]]), e3.struct("SendMoreExtended", [["numMessages", e3.lookup("Uint32")], ["numBytes", e3.lookup("Uint32")]]), e3.struct("AuthCert", [["pubkey", e3.lookup("Curve25519Public")], ["expiration", e3.lookup("Uint64")], ["sig", e3.lookup("Signature")]]), e3.struct("Hello", [["ledgerVersion", e3.lookup("Uint32")], ["overlayVersion", e3.lookup("Uint32")], ["overlayMinVersion", e3.lookup("Uint32")], ["networkId", e3.lookup("Hash")], ["versionStr", e3.string(100)], ["listeningPort", e3.int()], ["peerId", e3.lookup("NodeId")], ["cert", e3.lookup("AuthCert")], ["nonce", e3.lookup("Uint256")]]), e3.const("AUTH_MSG_FLAG_FLOW_CONTROL_BYTES_REQUESTED", 200), e3.struct("Auth", [["flags", e3.int()]]), e3.enum("IpAddrType", { iPv4: 0, iPv6: 1 }), e3.union("PeerAddressIp", { switchOn: e3.lookup("IpAddrType"), switchName: "type", switches: [["iPv4", "ipv4"], ["iPv6", "ipv6"]], arms: { ipv4: e3.opaque(4), ipv6: e3.opaque(16) } }), e3.struct("PeerAddress", [["ip", e3.lookup("PeerAddressIp")], ["port", e3.lookup("Uint32")], ["numFailures", e3.lookup("Uint32")]]), e3.enum("MessageType", { errorMsg: 0, auth: 2, dontHave: 3, peers: 5, getTxSet: 6, txSet: 7, generalizedTxSet: 17, transaction: 8, getScpQuorumset: 9, scpQuorumset: 10, scpMessage: 11, getScpState: 12, hello: 13, sendMore: 16, sendMoreExtended: 20, floodAdvert: 18, floodDemand: 19, timeSlicedSurveyRequest: 21, timeSlicedSurveyResponse: 22, timeSlicedSurveyStartCollecting: 23, timeSlicedSurveyStopCollecting: 24 }), e3.struct("DontHave", [["type", e3.lookup("MessageType")], ["reqHash", e3.lookup("Uint256")]]), e3.enum("SurveyMessageCommandType", { timeSlicedSurveyTopology: 1 }), e3.enum("SurveyMessageResponseType", { surveyTopologyResponseV2: 2 }), e3.struct("TimeSlicedSurveyStartCollectingMessage", [["surveyorId", e3.lookup("NodeId")], ["nonce", e3.lookup("Uint32")], ["ledgerNum", e3.lookup("Uint32")]]), e3.struct("SignedTimeSlicedSurveyStartCollectingMessage", [["signature", e3.lookup("Signature")], ["startCollecting", e3.lookup("TimeSlicedSurveyStartCollectingMessage")]]), e3.struct("TimeSlicedSurveyStopCollectingMessage", [["surveyorId", e3.lookup("NodeId")], ["nonce", e3.lookup("Uint32")], ["ledgerNum", e3.lookup("Uint32")]]), e3.struct("SignedTimeSlicedSurveyStopCollectingMessage", [["signature", e3.lookup("Signature")], ["stopCollecting", e3.lookup("TimeSlicedSurveyStopCollectingMessage")]]), e3.struct("SurveyRequestMessage", [["surveyorPeerId", e3.lookup("NodeId")], ["surveyedPeerId", e3.lookup("NodeId")], ["ledgerNum", e3.lookup("Uint32")], ["encryptionKey", e3.lookup("Curve25519Public")], ["commandType", e3.lookup("SurveyMessageCommandType")]]), e3.struct("TimeSlicedSurveyRequestMessage", [["request", e3.lookup("SurveyRequestMessage")], ["nonce", e3.lookup("Uint32")], ["inboundPeersIndex", e3.lookup("Uint32")], ["outboundPeersIndex", e3.lookup("Uint32")]]), e3.struct("SignedTimeSlicedSurveyRequestMessage", [["requestSignature", e3.lookup("Signature")], ["request", e3.lookup("TimeSlicedSurveyRequestMessage")]]), e3.typedef("EncryptedBody", e3.varOpaque(64e3)), e3.struct("SurveyResponseMessage", [["surveyorPeerId", e3.lookup("NodeId")], ["surveyedPeerId", e3.lookup("NodeId")], ["ledgerNum", e3.lookup("Uint32")], ["commandType", e3.lookup("SurveyMessageCommandType")], ["encryptedBody", e3.lookup("EncryptedBody")]]), e3.struct("TimeSlicedSurveyResponseMessage", [["response", e3.lookup("SurveyResponseMessage")], ["nonce", e3.lookup("Uint32")]]), e3.struct("SignedTimeSlicedSurveyResponseMessage", [["responseSignature", e3.lookup("Signature")], ["response", e3.lookup("TimeSlicedSurveyResponseMessage")]]), e3.struct("PeerStats", [["id", e3.lookup("NodeId")], ["versionStr", e3.string(100)], ["messagesRead", e3.lookup("Uint64")], ["messagesWritten", e3.lookup("Uint64")], ["bytesRead", e3.lookup("Uint64")], ["bytesWritten", e3.lookup("Uint64")], ["secondsConnected", e3.lookup("Uint64")], ["uniqueFloodBytesRecv", e3.lookup("Uint64")], ["duplicateFloodBytesRecv", e3.lookup("Uint64")], ["uniqueFetchBytesRecv", e3.lookup("Uint64")], ["duplicateFetchBytesRecv", e3.lookup("Uint64")], ["uniqueFloodMessageRecv", e3.lookup("Uint64")], ["duplicateFloodMessageRecv", e3.lookup("Uint64")], ["uniqueFetchMessageRecv", e3.lookup("Uint64")], ["duplicateFetchMessageRecv", e3.lookup("Uint64")]]), e3.struct("TimeSlicedNodeData", [["addedAuthenticatedPeers", e3.lookup("Uint32")], ["droppedAuthenticatedPeers", e3.lookup("Uint32")], ["totalInboundPeerCount", e3.lookup("Uint32")], ["totalOutboundPeerCount", e3.lookup("Uint32")], ["p75ScpFirstToSelfLatencyMs", e3.lookup("Uint32")], ["p75ScpSelfToOtherLatencyMs", e3.lookup("Uint32")], ["lostSyncCount", e3.lookup("Uint32")], ["isValidator", e3.bool()], ["maxInboundPeerCount", e3.lookup("Uint32")], ["maxOutboundPeerCount", e3.lookup("Uint32")]]), e3.struct("TimeSlicedPeerData", [["peerStats", e3.lookup("PeerStats")], ["averageLatencyMs", e3.lookup("Uint32")]]), e3.typedef("TimeSlicedPeerDataList", e3.varArray(e3.lookup("TimeSlicedPeerData"), 25)), e3.struct("TopologyResponseBodyV2", [["inboundPeers", e3.lookup("TimeSlicedPeerDataList")], ["outboundPeers", e3.lookup("TimeSlicedPeerDataList")], ["nodeData", e3.lookup("TimeSlicedNodeData")]]), e3.union("SurveyResponseBody", { switchOn: e3.lookup("SurveyMessageResponseType"), switchName: "type", switches: [["surveyTopologyResponseV2", "topologyResponseBodyV2"]], arms: { topologyResponseBodyV2: e3.lookup("TopologyResponseBodyV2") } }), e3.const("TX_ADVERT_VECTOR_MAX_SIZE", 1e3), e3.typedef("TxAdvertVector", e3.varArray(e3.lookup("Hash"), e3.lookup("TX_ADVERT_VECTOR_MAX_SIZE"))), e3.struct("FloodAdvert", [["txHashes", e3.lookup("TxAdvertVector")]]), e3.const("TX_DEMAND_VECTOR_MAX_SIZE", 1e3), e3.typedef("TxDemandVector", e3.varArray(e3.lookup("Hash"), e3.lookup("TX_DEMAND_VECTOR_MAX_SIZE"))), e3.struct("FloodDemand", [["txHashes", e3.lookup("TxDemandVector")]]), e3.union("StellarMessage", { switchOn: e3.lookup("MessageType"), switchName: "type", switches: [["errorMsg", "error"], ["hello", "hello"], ["auth", "auth"], ["dontHave", "dontHave"], ["peers", "peers"], ["getTxSet", "txSetHash"], ["txSet", "txSet"], ["generalizedTxSet", "generalizedTxSet"], ["transaction", "transaction"], ["timeSlicedSurveyRequest", "signedTimeSlicedSurveyRequestMessage"], ["timeSlicedSurveyResponse", "signedTimeSlicedSurveyResponseMessage"], ["timeSlicedSurveyStartCollecting", "signedTimeSlicedSurveyStartCollectingMessage"], ["timeSlicedSurveyStopCollecting", "signedTimeSlicedSurveyStopCollectingMessage"], ["getScpQuorumset", "qSetHash"], ["scpQuorumset", "qSet"], ["scpMessage", "envelope"], ["getScpState", "getScpLedgerSeq"], ["sendMore", "sendMoreMessage"], ["sendMoreExtended", "sendMoreExtendedMessage"], ["floodAdvert", "floodAdvert"], ["floodDemand", "floodDemand"]], arms: { error: e3.lookup("Error"), hello: e3.lookup("Hello"), auth: e3.lookup("Auth"), dontHave: e3.lookup("DontHave"), peers: e3.varArray(e3.lookup("PeerAddress"), 100), txSetHash: e3.lookup("Uint256"), txSet: e3.lookup("TransactionSet"), generalizedTxSet: e3.lookup("GeneralizedTransactionSet"), transaction: e3.lookup("TransactionEnvelope"), signedTimeSlicedSurveyRequestMessage: e3.lookup("SignedTimeSlicedSurveyRequestMessage"), signedTimeSlicedSurveyResponseMessage: e3.lookup("SignedTimeSlicedSurveyResponseMessage"), signedTimeSlicedSurveyStartCollectingMessage: e3.lookup("SignedTimeSlicedSurveyStartCollectingMessage"), signedTimeSlicedSurveyStopCollectingMessage: e3.lookup("SignedTimeSlicedSurveyStopCollectingMessage"), qSetHash: e3.lookup("Uint256"), qSet: e3.lookup("ScpQuorumSet"), envelope: e3.lookup("ScpEnvelope"), getScpLedgerSeq: e3.lookup("Uint32"), sendMoreMessage: e3.lookup("SendMore"), sendMoreExtendedMessage: e3.lookup("SendMoreExtended"), floodAdvert: e3.lookup("FloodAdvert"), floodDemand: e3.lookup("FloodDemand") } }), e3.struct("AuthenticatedMessageV0", [["sequence", e3.lookup("Uint64")], ["message", e3.lookup("StellarMessage")], ["mac", e3.lookup("HmacSha256Mac")]]), e3.union("AuthenticatedMessage", { switchOn: e3.lookup("Uint32"), switchName: "v", switches: [[0, "v0"]], arms: { v0: e3.lookup("AuthenticatedMessageV0") } }), e3.const("MAX_OPS_PER_TX", 100), e3.union("LiquidityPoolParameters", { switchOn: e3.lookup("LiquidityPoolType"), switchName: "type", switches: [["liquidityPoolConstantProduct", "constantProduct"]], arms: { constantProduct: e3.lookup("LiquidityPoolConstantProductParameters") } }), e3.struct("MuxedAccountMed25519", [["id", e3.lookup("Uint64")], ["ed25519", e3.lookup("Uint256")]]), e3.union("MuxedAccount", { switchOn: e3.lookup("CryptoKeyType"), switchName: "type", switches: [["keyTypeEd25519", "ed25519"], ["keyTypeMuxedEd25519", "med25519"]], arms: { ed25519: e3.lookup("Uint256"), med25519: e3.lookup("MuxedAccountMed25519") } }), e3.struct("DecoratedSignature", [["hint", e3.lookup("SignatureHint")], ["signature", e3.lookup("Signature")]]), e3.enum("OperationType", { createAccount: 0, payment: 1, pathPaymentStrictReceive: 2, manageSellOffer: 3, createPassiveSellOffer: 4, setOptions: 5, changeTrust: 6, allowTrust: 7, accountMerge: 8, inflation: 9, manageData: 10, bumpSequence: 11, manageBuyOffer: 12, pathPaymentStrictSend: 13, createClaimableBalance: 14, claimClaimableBalance: 15, beginSponsoringFutureReserves: 16, endSponsoringFutureReserves: 17, revokeSponsorship: 18, clawback: 19, clawbackClaimableBalance: 20, setTrustLineFlags: 21, liquidityPoolDeposit: 22, liquidityPoolWithdraw: 23, invokeHostFunction: 24, extendFootprintTtl: 25, restoreFootprint: 26 }), e3.struct("CreateAccountOp", [["destination", e3.lookup("AccountId")], ["startingBalance", e3.lookup("Int64")]]), e3.struct("PaymentOp", [["destination", e3.lookup("MuxedAccount")], ["asset", e3.lookup("Asset")], ["amount", e3.lookup("Int64")]]), e3.struct("PathPaymentStrictReceiveOp", [["sendAsset", e3.lookup("Asset")], ["sendMax", e3.lookup("Int64")], ["destination", e3.lookup("MuxedAccount")], ["destAsset", e3.lookup("Asset")], ["destAmount", e3.lookup("Int64")], ["path", e3.varArray(e3.lookup("Asset"), 5)]]), e3.struct("PathPaymentStrictSendOp", [["sendAsset", e3.lookup("Asset")], ["sendAmount", e3.lookup("Int64")], ["destination", e3.lookup("MuxedAccount")], ["destAsset", e3.lookup("Asset")], ["destMin", e3.lookup("Int64")], ["path", e3.varArray(e3.lookup("Asset"), 5)]]), e3.struct("ManageSellOfferOp", [["selling", e3.lookup("Asset")], ["buying", e3.lookup("Asset")], ["amount", e3.lookup("Int64")], ["price", e3.lookup("Price")], ["offerId", e3.lookup("Int64")]]), e3.struct("ManageBuyOfferOp", [["selling", e3.lookup("Asset")], ["buying", e3.lookup("Asset")], ["buyAmount", e3.lookup("Int64")], ["price", e3.lookup("Price")], ["offerId", e3.lookup("Int64")]]), e3.struct("CreatePassiveSellOfferOp", [["selling", e3.lookup("Asset")], ["buying", e3.lookup("Asset")], ["amount", e3.lookup("Int64")], ["price", e3.lookup("Price")]]), e3.struct("SetOptionsOp", [["inflationDest", e3.option(e3.lookup("AccountId"))], ["clearFlags", e3.option(e3.lookup("Uint32"))], ["setFlags", e3.option(e3.lookup("Uint32"))], ["masterWeight", e3.option(e3.lookup("Uint32"))], ["lowThreshold", e3.option(e3.lookup("Uint32"))], ["medThreshold", e3.option(e3.lookup("Uint32"))], ["highThreshold", e3.option(e3.lookup("Uint32"))], ["homeDomain", e3.option(e3.lookup("String32"))], ["signer", e3.option(e3.lookup("Signer"))]]), e3.union("ChangeTrustAsset", { switchOn: e3.lookup("AssetType"), switchName: "type", switches: [["assetTypeNative", e3.void()], ["assetTypeCreditAlphanum4", "alphaNum4"], ["assetTypeCreditAlphanum12", "alphaNum12"], ["assetTypePoolShare", "liquidityPool"]], arms: { alphaNum4: e3.lookup("AlphaNum4"), alphaNum12: e3.lookup("AlphaNum12"), liquidityPool: e3.lookup("LiquidityPoolParameters") } }), e3.struct("ChangeTrustOp", [["line", e3.lookup("ChangeTrustAsset")], ["limit", e3.lookup("Int64")]]), e3.struct("AllowTrustOp", [["trustor", e3.lookup("AccountId")], ["asset", e3.lookup("AssetCode")], ["authorize", e3.lookup("Uint32")]]), e3.struct("ManageDataOp", [["dataName", e3.lookup("String64")], ["dataValue", e3.option(e3.lookup("DataValue"))]]), e3.struct("BumpSequenceOp", [["bumpTo", e3.lookup("SequenceNumber")]]), e3.struct("CreateClaimableBalanceOp", [["asset", e3.lookup("Asset")], ["amount", e3.lookup("Int64")], ["claimants", e3.varArray(e3.lookup("Claimant"), 10)]]), e3.struct("ClaimClaimableBalanceOp", [["balanceId", e3.lookup("ClaimableBalanceId")]]), e3.struct("BeginSponsoringFutureReservesOp", [["sponsoredId", e3.lookup("AccountId")]]), e3.enum("RevokeSponsorshipType", { revokeSponsorshipLedgerEntry: 0, revokeSponsorshipSigner: 1 }), e3.struct("RevokeSponsorshipOpSigner", [["accountId", e3.lookup("AccountId")], ["signerKey", e3.lookup("SignerKey")]]), e3.union("RevokeSponsorshipOp", { switchOn: e3.lookup("RevokeSponsorshipType"), switchName: "type", switches: [["revokeSponsorshipLedgerEntry", "ledgerKey"], ["revokeSponsorshipSigner", "signer"]], arms: { ledgerKey: e3.lookup("LedgerKey"), signer: e3.lookup("RevokeSponsorshipOpSigner") } }), e3.struct("ClawbackOp", [["asset", e3.lookup("Asset")], ["from", e3.lookup("MuxedAccount")], ["amount", e3.lookup("Int64")]]), e3.struct("ClawbackClaimableBalanceOp", [["balanceId", e3.lookup("ClaimableBalanceId")]]), e3.struct("SetTrustLineFlagsOp", [["trustor", e3.lookup("AccountId")], ["asset", e3.lookup("Asset")], ["clearFlags", e3.lookup("Uint32")], ["setFlags", e3.lookup("Uint32")]]), e3.const("LIQUIDITY_POOL_FEE_V18", 30), e3.struct("LiquidityPoolDepositOp", [["liquidityPoolId", e3.lookup("PoolId")], ["maxAmountA", e3.lookup("Int64")], ["maxAmountB", e3.lookup("Int64")], ["minPrice", e3.lookup("Price")], ["maxPrice", e3.lookup("Price")]]), e3.struct("LiquidityPoolWithdrawOp", [["liquidityPoolId", e3.lookup("PoolId")], ["amount", e3.lookup("Int64")], ["minAmountA", e3.lookup("Int64")], ["minAmountB", e3.lookup("Int64")]]), e3.enum("HostFunctionType", { hostFunctionTypeInvokeContract: 0, hostFunctionTypeCreateContract: 1, hostFunctionTypeUploadContractWasm: 2, hostFunctionTypeCreateContractV2: 3 }), e3.enum("ContractIdPreimageType", { contractIdPreimageFromAddress: 0, contractIdPreimageFromAsset: 1 }), e3.struct("ContractIdPreimageFromAddress", [["address", e3.lookup("ScAddress")], ["salt", e3.lookup("Uint256")]]), e3.union("ContractIdPreimage", { switchOn: e3.lookup("ContractIdPreimageType"), switchName: "type", switches: [["contractIdPreimageFromAddress", "fromAddress"], ["contractIdPreimageFromAsset", "fromAsset"]], arms: { fromAddress: e3.lookup("ContractIdPreimageFromAddress"), fromAsset: e3.lookup("Asset") } }), e3.struct("CreateContractArgs", [["contractIdPreimage", e3.lookup("ContractIdPreimage")], ["executable", e3.lookup("ContractExecutable")]]), e3.struct("CreateContractArgsV2", [["contractIdPreimage", e3.lookup("ContractIdPreimage")], ["executable", e3.lookup("ContractExecutable")], ["constructorArgs", e3.varArray(e3.lookup("ScVal"), 2147483647)]]), e3.struct("InvokeContractArgs", [["contractAddress", e3.lookup("ScAddress")], ["functionName", e3.lookup("ScSymbol")], ["args", e3.varArray(e3.lookup("ScVal"), 2147483647)]]), e3.union("HostFunction", { switchOn: e3.lookup("HostFunctionType"), switchName: "type", switches: [["hostFunctionTypeInvokeContract", "invokeContract"], ["hostFunctionTypeCreateContract", "createContract"], ["hostFunctionTypeUploadContractWasm", "wasm"], ["hostFunctionTypeCreateContractV2", "createContractV2"]], arms: { invokeContract: e3.lookup("InvokeContractArgs"), createContract: e3.lookup("CreateContractArgs"), wasm: e3.varOpaque(), createContractV2: e3.lookup("CreateContractArgsV2") } }), e3.enum("SorobanAuthorizedFunctionType", { sorobanAuthorizedFunctionTypeContractFn: 0, sorobanAuthorizedFunctionTypeCreateContractHostFn: 1, sorobanAuthorizedFunctionTypeCreateContractV2HostFn: 2 }), e3.union("SorobanAuthorizedFunction", { switchOn: e3.lookup("SorobanAuthorizedFunctionType"), switchName: "type", switches: [["sorobanAuthorizedFunctionTypeContractFn", "contractFn"], ["sorobanAuthorizedFunctionTypeCreateContractHostFn", "createContractHostFn"], ["sorobanAuthorizedFunctionTypeCreateContractV2HostFn", "createContractV2HostFn"]], arms: { contractFn: e3.lookup("InvokeContractArgs"), createContractHostFn: e3.lookup("CreateContractArgs"), createContractV2HostFn: e3.lookup("CreateContractArgsV2") } }), e3.struct("SorobanAuthorizedInvocation", [["function", e3.lookup("SorobanAuthorizedFunction")], ["subInvocations", e3.varArray(e3.lookup("SorobanAuthorizedInvocation"), 2147483647)]]), e3.struct("SorobanAddressCredentials", [["address", e3.lookup("ScAddress")], ["nonce", e3.lookup("Int64")], ["signatureExpirationLedger", e3.lookup("Uint32")], ["signature", e3.lookup("ScVal")]]), e3.enum("SorobanCredentialsType", { sorobanCredentialsSourceAccount: 0, sorobanCredentialsAddress: 1 }), e3.union("SorobanCredentials", { switchOn: e3.lookup("SorobanCredentialsType"), switchName: "type", switches: [["sorobanCredentialsSourceAccount", e3.void()], ["sorobanCredentialsAddress", "address"]], arms: { address: e3.lookup("SorobanAddressCredentials") } }), e3.struct("SorobanAuthorizationEntry", [["credentials", e3.lookup("SorobanCredentials")], ["rootInvocation", e3.lookup("SorobanAuthorizedInvocation")]]), e3.typedef("SorobanAuthorizationEntries", e3.varArray(e3.lookup("SorobanAuthorizationEntry"), 2147483647)), e3.struct("InvokeHostFunctionOp", [["hostFunction", e3.lookup("HostFunction")], ["auth", e3.varArray(e3.lookup("SorobanAuthorizationEntry"), 2147483647)]]), e3.struct("ExtendFootprintTtlOp", [["ext", e3.lookup("ExtensionPoint")], ["extendTo", e3.lookup("Uint32")]]), e3.struct("RestoreFootprintOp", [["ext", e3.lookup("ExtensionPoint")]]), e3.union("OperationBody", { switchOn: e3.lookup("OperationType"), switchName: "type", switches: [["createAccount", "createAccountOp"], ["payment", "paymentOp"], ["pathPaymentStrictReceive", "pathPaymentStrictReceiveOp"], ["manageSellOffer", "manageSellOfferOp"], ["createPassiveSellOffer", "createPassiveSellOfferOp"], ["setOptions", "setOptionsOp"], ["changeTrust", "changeTrustOp"], ["allowTrust", "allowTrustOp"], ["accountMerge", "destination"], ["inflation", e3.void()], ["manageData", "manageDataOp"], ["bumpSequence", "bumpSequenceOp"], ["manageBuyOffer", "manageBuyOfferOp"], ["pathPaymentStrictSend", "pathPaymentStrictSendOp"], ["createClaimableBalance", "createClaimableBalanceOp"], ["claimClaimableBalance", "claimClaimableBalanceOp"], ["beginSponsoringFutureReserves", "beginSponsoringFutureReservesOp"], ["endSponsoringFutureReserves", e3.void()], ["revokeSponsorship", "revokeSponsorshipOp"], ["clawback", "clawbackOp"], ["clawbackClaimableBalance", "clawbackClaimableBalanceOp"], ["setTrustLineFlags", "setTrustLineFlagsOp"], ["liquidityPoolDeposit", "liquidityPoolDepositOp"], ["liquidityPoolWithdraw", "liquidityPoolWithdrawOp"], ["invokeHostFunction", "invokeHostFunctionOp"], ["extendFootprintTtl", "extendFootprintTtlOp"], ["restoreFootprint", "restoreFootprintOp"]], arms: { createAccountOp: e3.lookup("CreateAccountOp"), paymentOp: e3.lookup("PaymentOp"), pathPaymentStrictReceiveOp: e3.lookup("PathPaymentStrictReceiveOp"), manageSellOfferOp: e3.lookup("ManageSellOfferOp"), createPassiveSellOfferOp: e3.lookup("CreatePassiveSellOfferOp"), setOptionsOp: e3.lookup("SetOptionsOp"), changeTrustOp: e3.lookup("ChangeTrustOp"), allowTrustOp: e3.lookup("AllowTrustOp"), destination: e3.lookup("MuxedAccount"), manageDataOp: e3.lookup("ManageDataOp"), bumpSequenceOp: e3.lookup("BumpSequenceOp"), manageBuyOfferOp: e3.lookup("ManageBuyOfferOp"), pathPaymentStrictSendOp: e3.lookup("PathPaymentStrictSendOp"), createClaimableBalanceOp: e3.lookup("CreateClaimableBalanceOp"), claimClaimableBalanceOp: e3.lookup("ClaimClaimableBalanceOp"), beginSponsoringFutureReservesOp: e3.lookup("BeginSponsoringFutureReservesOp"), revokeSponsorshipOp: e3.lookup("RevokeSponsorshipOp"), clawbackOp: e3.lookup("ClawbackOp"), clawbackClaimableBalanceOp: e3.lookup("ClawbackClaimableBalanceOp"), setTrustLineFlagsOp: e3.lookup("SetTrustLineFlagsOp"), liquidityPoolDepositOp: e3.lookup("LiquidityPoolDepositOp"), liquidityPoolWithdrawOp: e3.lookup("LiquidityPoolWithdrawOp"), invokeHostFunctionOp: e3.lookup("InvokeHostFunctionOp"), extendFootprintTtlOp: e3.lookup("ExtendFootprintTtlOp"), restoreFootprintOp: e3.lookup("RestoreFootprintOp") } }), e3.struct("Operation", [["sourceAccount", e3.option(e3.lookup("MuxedAccount"))], ["body", e3.lookup("OperationBody")]]), e3.struct("HashIdPreimageOperationId", [["sourceAccount", e3.lookup("AccountId")], ["seqNum", e3.lookup("SequenceNumber")], ["opNum", e3.lookup("Uint32")]]), e3.struct("HashIdPreimageRevokeId", [["sourceAccount", e3.lookup("AccountId")], ["seqNum", e3.lookup("SequenceNumber")], ["opNum", e3.lookup("Uint32")], ["liquidityPoolId", e3.lookup("PoolId")], ["asset", e3.lookup("Asset")]]), e3.struct("HashIdPreimageContractId", [["networkId", e3.lookup("Hash")], ["contractIdPreimage", e3.lookup("ContractIdPreimage")]]), e3.struct("HashIdPreimageSorobanAuthorization", [["networkId", e3.lookup("Hash")], ["nonce", e3.lookup("Int64")], ["signatureExpirationLedger", e3.lookup("Uint32")], ["invocation", e3.lookup("SorobanAuthorizedInvocation")]]), e3.union("HashIdPreimage", { switchOn: e3.lookup("EnvelopeType"), switchName: "type", switches: [["envelopeTypeOpId", "operationId"], ["envelopeTypePoolRevokeOpId", "revokeId"], ["envelopeTypeContractId", "contractId"], ["envelopeTypeSorobanAuthorization", "sorobanAuthorization"]], arms: { operationId: e3.lookup("HashIdPreimageOperationId"), revokeId: e3.lookup("HashIdPreimageRevokeId"), contractId: e3.lookup("HashIdPreimageContractId"), sorobanAuthorization: e3.lookup("HashIdPreimageSorobanAuthorization") } }), e3.enum("MemoType", { memoNone: 0, memoText: 1, memoId: 2, memoHash: 3, memoReturn: 4 }), e3.union("Memo", { switchOn: e3.lookup("MemoType"), switchName: "type", switches: [["memoNone", e3.void()], ["memoText", "text"], ["memoId", "id"], ["memoHash", "hash"], ["memoReturn", "retHash"]], arms: { text: e3.string(28), id: e3.lookup("Uint64"), hash: e3.lookup("Hash"), retHash: e3.lookup("Hash") } }), e3.struct("TimeBounds", [["minTime", e3.lookup("TimePoint")], ["maxTime", e3.lookup("TimePoint")]]), e3.struct("LedgerBounds", [["minLedger", e3.lookup("Uint32")], ["maxLedger", e3.lookup("Uint32")]]), e3.struct("PreconditionsV2", [["timeBounds", e3.option(e3.lookup("TimeBounds"))], ["ledgerBounds", e3.option(e3.lookup("LedgerBounds"))], ["minSeqNum", e3.option(e3.lookup("SequenceNumber"))], ["minSeqAge", e3.lookup("Duration")], ["minSeqLedgerGap", e3.lookup("Uint32")], ["extraSigners", e3.varArray(e3.lookup("SignerKey"), 2)]]), e3.enum("PreconditionType", { precondNone: 0, precondTime: 1, precondV2: 2 }), e3.union("Preconditions", { switchOn: e3.lookup("PreconditionType"), switchName: "type", switches: [["precondNone", e3.void()], ["precondTime", "timeBounds"], ["precondV2", "v2"]], arms: { timeBounds: e3.lookup("TimeBounds"), v2: e3.lookup("PreconditionsV2") } }), e3.struct("LedgerFootprint", [["readOnly", e3.varArray(e3.lookup("LedgerKey"), 2147483647)], ["readWrite", e3.varArray(e3.lookup("LedgerKey"), 2147483647)]]), e3.struct("SorobanResources", [["footprint", e3.lookup("LedgerFootprint")], ["instructions", e3.lookup("Uint32")], ["diskReadBytes", e3.lookup("Uint32")], ["writeBytes", e3.lookup("Uint32")]]), e3.struct("SorobanResourcesExtV0", [["archivedSorobanEntries", e3.varArray(e3.lookup("Uint32"), 2147483647)]]), e3.union("SorobanTransactionDataExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [1, "resourceExt"]], arms: { resourceExt: e3.lookup("SorobanResourcesExtV0") } }), e3.struct("SorobanTransactionData", [["ext", e3.lookup("SorobanTransactionDataExt")], ["resources", e3.lookup("SorobanResources")], ["resourceFee", e3.lookup("Int64")]]), e3.union("TransactionV0Ext", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()]], arms: {} }), e3.struct("TransactionV0", [["sourceAccountEd25519", e3.lookup("Uint256")], ["fee", e3.lookup("Uint32")], ["seqNum", e3.lookup("SequenceNumber")], ["timeBounds", e3.option(e3.lookup("TimeBounds"))], ["memo", e3.lookup("Memo")], ["operations", e3.varArray(e3.lookup("Operation"), e3.lookup("MAX_OPS_PER_TX"))], ["ext", e3.lookup("TransactionV0Ext")]]), e3.struct("TransactionV0Envelope", [["tx", e3.lookup("TransactionV0")], ["signatures", e3.varArray(e3.lookup("DecoratedSignature"), 20)]]), e3.union("TransactionExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()], [1, "sorobanData"]], arms: { sorobanData: e3.lookup("SorobanTransactionData") } }), e3.struct("Transaction", [["sourceAccount", e3.lookup("MuxedAccount")], ["fee", e3.lookup("Uint32")], ["seqNum", e3.lookup("SequenceNumber")], ["cond", e3.lookup("Preconditions")], ["memo", e3.lookup("Memo")], ["operations", e3.varArray(e3.lookup("Operation"), e3.lookup("MAX_OPS_PER_TX"))], ["ext", e3.lookup("TransactionExt")]]), e3.struct("TransactionV1Envelope", [["tx", e3.lookup("Transaction")], ["signatures", e3.varArray(e3.lookup("DecoratedSignature"), 20)]]), e3.union("FeeBumpTransactionInnerTx", { switchOn: e3.lookup("EnvelopeType"), switchName: "type", switches: [["envelopeTypeTx", "v1"]], arms: { v1: e3.lookup("TransactionV1Envelope") } }), e3.union("FeeBumpTransactionExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()]], arms: {} }), e3.struct("FeeBumpTransaction", [["feeSource", e3.lookup("MuxedAccount")], ["fee", e3.lookup("Int64")], ["innerTx", e3.lookup("FeeBumpTransactionInnerTx")], ["ext", e3.lookup("FeeBumpTransactionExt")]]), e3.struct("FeeBumpTransactionEnvelope", [["tx", e3.lookup("FeeBumpTransaction")], ["signatures", e3.varArray(e3.lookup("DecoratedSignature"), 20)]]), e3.union("TransactionEnvelope", { switchOn: e3.lookup("EnvelopeType"), switchName: "type", switches: [["envelopeTypeTxV0", "v0"], ["envelopeTypeTx", "v1"], ["envelopeTypeTxFeeBump", "feeBump"]], arms: { v0: e3.lookup("TransactionV0Envelope"), v1: e3.lookup("TransactionV1Envelope"), feeBump: e3.lookup("FeeBumpTransactionEnvelope") } }), e3.union("TransactionSignaturePayloadTaggedTransaction", { switchOn: e3.lookup("EnvelopeType"), switchName: "type", switches: [["envelopeTypeTx", "tx"], ["envelopeTypeTxFeeBump", "feeBump"]], arms: { tx: e3.lookup("Transaction"), feeBump: e3.lookup("FeeBumpTransaction") } }), e3.struct("TransactionSignaturePayload", [["networkId", e3.lookup("Hash")], ["taggedTransaction", e3.lookup("TransactionSignaturePayloadTaggedTransaction")]]), e3.enum("ClaimAtomType", { claimAtomTypeV0: 0, claimAtomTypeOrderBook: 1, claimAtomTypeLiquidityPool: 2 }), e3.struct("ClaimOfferAtomV0", [["sellerEd25519", e3.lookup("Uint256")], ["offerId", e3.lookup("Int64")], ["assetSold", e3.lookup("Asset")], ["amountSold", e3.lookup("Int64")], ["assetBought", e3.lookup("Asset")], ["amountBought", e3.lookup("Int64")]]), e3.struct("ClaimOfferAtom", [["sellerId", e3.lookup("AccountId")], ["offerId", e3.lookup("Int64")], ["assetSold", e3.lookup("Asset")], ["amountSold", e3.lookup("Int64")], ["assetBought", e3.lookup("Asset")], ["amountBought", e3.lookup("Int64")]]), e3.struct("ClaimLiquidityAtom", [["liquidityPoolId", e3.lookup("PoolId")], ["assetSold", e3.lookup("Asset")], ["amountSold", e3.lookup("Int64")], ["assetBought", e3.lookup("Asset")], ["amountBought", e3.lookup("Int64")]]), e3.union("ClaimAtom", { switchOn: e3.lookup("ClaimAtomType"), switchName: "type", switches: [["claimAtomTypeV0", "v0"], ["claimAtomTypeOrderBook", "orderBook"], ["claimAtomTypeLiquidityPool", "liquidityPool"]], arms: { v0: e3.lookup("ClaimOfferAtomV0"), orderBook: e3.lookup("ClaimOfferAtom"), liquidityPool: e3.lookup("ClaimLiquidityAtom") } }), e3.enum("CreateAccountResultCode", { createAccountSuccess: 0, createAccountMalformed: -1, createAccountUnderfunded: -2, createAccountLowReserve: -3, createAccountAlreadyExist: -4 }), e3.union("CreateAccountResult", { switchOn: e3.lookup("CreateAccountResultCode"), switchName: "code", switches: [["createAccountSuccess", e3.void()], ["createAccountMalformed", e3.void()], ["createAccountUnderfunded", e3.void()], ["createAccountLowReserve", e3.void()], ["createAccountAlreadyExist", e3.void()]], arms: {} }), e3.enum("PaymentResultCode", { paymentSuccess: 0, paymentMalformed: -1, paymentUnderfunded: -2, paymentSrcNoTrust: -3, paymentSrcNotAuthorized: -4, paymentNoDestination: -5, paymentNoTrust: -6, paymentNotAuthorized: -7, paymentLineFull: -8, paymentNoIssuer: -9 }), e3.union("PaymentResult", { switchOn: e3.lookup("PaymentResultCode"), switchName: "code", switches: [["paymentSuccess", e3.void()], ["paymentMalformed", e3.void()], ["paymentUnderfunded", e3.void()], ["paymentSrcNoTrust", e3.void()], ["paymentSrcNotAuthorized", e3.void()], ["paymentNoDestination", e3.void()], ["paymentNoTrust", e3.void()], ["paymentNotAuthorized", e3.void()], ["paymentLineFull", e3.void()], ["paymentNoIssuer", e3.void()]], arms: {} }), e3.enum("PathPaymentStrictReceiveResultCode", { pathPaymentStrictReceiveSuccess: 0, pathPaymentStrictReceiveMalformed: -1, pathPaymentStrictReceiveUnderfunded: -2, pathPaymentStrictReceiveSrcNoTrust: -3, pathPaymentStrictReceiveSrcNotAuthorized: -4, pathPaymentStrictReceiveNoDestination: -5, pathPaymentStrictReceiveNoTrust: -6, pathPaymentStrictReceiveNotAuthorized: -7, pathPaymentStrictReceiveLineFull: -8, pathPaymentStrictReceiveNoIssuer: -9, pathPaymentStrictReceiveTooFewOffers: -10, pathPaymentStrictReceiveOfferCrossSelf: -11, pathPaymentStrictReceiveOverSendmax: -12 }), e3.struct("SimplePaymentResult", [["destination", e3.lookup("AccountId")], ["asset", e3.lookup("Asset")], ["amount", e3.lookup("Int64")]]), e3.struct("PathPaymentStrictReceiveResultSuccess", [["offers", e3.varArray(e3.lookup("ClaimAtom"), 2147483647)], ["last", e3.lookup("SimplePaymentResult")]]), e3.union("PathPaymentStrictReceiveResult", { switchOn: e3.lookup("PathPaymentStrictReceiveResultCode"), switchName: "code", switches: [["pathPaymentStrictReceiveSuccess", "success"], ["pathPaymentStrictReceiveMalformed", e3.void()], ["pathPaymentStrictReceiveUnderfunded", e3.void()], ["pathPaymentStrictReceiveSrcNoTrust", e3.void()], ["pathPaymentStrictReceiveSrcNotAuthorized", e3.void()], ["pathPaymentStrictReceiveNoDestination", e3.void()], ["pathPaymentStrictReceiveNoTrust", e3.void()], ["pathPaymentStrictReceiveNotAuthorized", e3.void()], ["pathPaymentStrictReceiveLineFull", e3.void()], ["pathPaymentStrictReceiveNoIssuer", "noIssuer"], ["pathPaymentStrictReceiveTooFewOffers", e3.void()], ["pathPaymentStrictReceiveOfferCrossSelf", e3.void()], ["pathPaymentStrictReceiveOverSendmax", e3.void()]], arms: { success: e3.lookup("PathPaymentStrictReceiveResultSuccess"), noIssuer: e3.lookup("Asset") } }), e3.enum("PathPaymentStrictSendResultCode", { pathPaymentStrictSendSuccess: 0, pathPaymentStrictSendMalformed: -1, pathPaymentStrictSendUnderfunded: -2, pathPaymentStrictSendSrcNoTrust: -3, pathPaymentStrictSendSrcNotAuthorized: -4, pathPaymentStrictSendNoDestination: -5, pathPaymentStrictSendNoTrust: -6, pathPaymentStrictSendNotAuthorized: -7, pathPaymentStrictSendLineFull: -8, pathPaymentStrictSendNoIssuer: -9, pathPaymentStrictSendTooFewOffers: -10, pathPaymentStrictSendOfferCrossSelf: -11, pathPaymentStrictSendUnderDestmin: -12 }), e3.struct("PathPaymentStrictSendResultSuccess", [["offers", e3.varArray(e3.lookup("ClaimAtom"), 2147483647)], ["last", e3.lookup("SimplePaymentResult")]]), e3.union("PathPaymentStrictSendResult", { switchOn: e3.lookup("PathPaymentStrictSendResultCode"), switchName: "code", switches: [["pathPaymentStrictSendSuccess", "success"], ["pathPaymentStrictSendMalformed", e3.void()], ["pathPaymentStrictSendUnderfunded", e3.void()], ["pathPaymentStrictSendSrcNoTrust", e3.void()], ["pathPaymentStrictSendSrcNotAuthorized", e3.void()], ["pathPaymentStrictSendNoDestination", e3.void()], ["pathPaymentStrictSendNoTrust", e3.void()], ["pathPaymentStrictSendNotAuthorized", e3.void()], ["pathPaymentStrictSendLineFull", e3.void()], ["pathPaymentStrictSendNoIssuer", "noIssuer"], ["pathPaymentStrictSendTooFewOffers", e3.void()], ["pathPaymentStrictSendOfferCrossSelf", e3.void()], ["pathPaymentStrictSendUnderDestmin", e3.void()]], arms: { success: e3.lookup("PathPaymentStrictSendResultSuccess"), noIssuer: e3.lookup("Asset") } }), e3.enum("ManageSellOfferResultCode", { manageSellOfferSuccess: 0, manageSellOfferMalformed: -1, manageSellOfferSellNoTrust: -2, manageSellOfferBuyNoTrust: -3, manageSellOfferSellNotAuthorized: -4, manageSellOfferBuyNotAuthorized: -5, manageSellOfferLineFull: -6, manageSellOfferUnderfunded: -7, manageSellOfferCrossSelf: -8, manageSellOfferSellNoIssuer: -9, manageSellOfferBuyNoIssuer: -10, manageSellOfferNotFound: -11, manageSellOfferLowReserve: -12 }), e3.enum("ManageOfferEffect", { manageOfferCreated: 0, manageOfferUpdated: 1, manageOfferDeleted: 2 }), e3.union("ManageOfferSuccessResultOffer", { switchOn: e3.lookup("ManageOfferEffect"), switchName: "effect", switches: [["manageOfferCreated", "offer"], ["manageOfferUpdated", "offer"], ["manageOfferDeleted", e3.void()]], arms: { offer: e3.lookup("OfferEntry") } }), e3.struct("ManageOfferSuccessResult", [["offersClaimed", e3.varArray(e3.lookup("ClaimAtom"), 2147483647)], ["offer", e3.lookup("ManageOfferSuccessResultOffer")]]), e3.union("ManageSellOfferResult", { switchOn: e3.lookup("ManageSellOfferResultCode"), switchName: "code", switches: [["manageSellOfferSuccess", "success"], ["manageSellOfferMalformed", e3.void()], ["manageSellOfferSellNoTrust", e3.void()], ["manageSellOfferBuyNoTrust", e3.void()], ["manageSellOfferSellNotAuthorized", e3.void()], ["manageSellOfferBuyNotAuthorized", e3.void()], ["manageSellOfferLineFull", e3.void()], ["manageSellOfferUnderfunded", e3.void()], ["manageSellOfferCrossSelf", e3.void()], ["manageSellOfferSellNoIssuer", e3.void()], ["manageSellOfferBuyNoIssuer", e3.void()], ["manageSellOfferNotFound", e3.void()], ["manageSellOfferLowReserve", e3.void()]], arms: { success: e3.lookup("ManageOfferSuccessResult") } }), e3.enum("ManageBuyOfferResultCode", { manageBuyOfferSuccess: 0, manageBuyOfferMalformed: -1, manageBuyOfferSellNoTrust: -2, manageBuyOfferBuyNoTrust: -3, manageBuyOfferSellNotAuthorized: -4, manageBuyOfferBuyNotAuthorized: -5, manageBuyOfferLineFull: -6, manageBuyOfferUnderfunded: -7, manageBuyOfferCrossSelf: -8, manageBuyOfferSellNoIssuer: -9, manageBuyOfferBuyNoIssuer: -10, manageBuyOfferNotFound: -11, manageBuyOfferLowReserve: -12 }), e3.union("ManageBuyOfferResult", { switchOn: e3.lookup("ManageBuyOfferResultCode"), switchName: "code", switches: [["manageBuyOfferSuccess", "success"], ["manageBuyOfferMalformed", e3.void()], ["manageBuyOfferSellNoTrust", e3.void()], ["manageBuyOfferBuyNoTrust", e3.void()], ["manageBuyOfferSellNotAuthorized", e3.void()], ["manageBuyOfferBuyNotAuthorized", e3.void()], ["manageBuyOfferLineFull", e3.void()], ["manageBuyOfferUnderfunded", e3.void()], ["manageBuyOfferCrossSelf", e3.void()], ["manageBuyOfferSellNoIssuer", e3.void()], ["manageBuyOfferBuyNoIssuer", e3.void()], ["manageBuyOfferNotFound", e3.void()], ["manageBuyOfferLowReserve", e3.void()]], arms: { success: e3.lookup("ManageOfferSuccessResult") } }), e3.enum("SetOptionsResultCode", { setOptionsSuccess: 0, setOptionsLowReserve: -1, setOptionsTooManySigners: -2, setOptionsBadFlags: -3, setOptionsInvalidInflation: -4, setOptionsCantChange: -5, setOptionsUnknownFlag: -6, setOptionsThresholdOutOfRange: -7, setOptionsBadSigner: -8, setOptionsInvalidHomeDomain: -9, setOptionsAuthRevocableRequired: -10 }), e3.union("SetOptionsResult", { switchOn: e3.lookup("SetOptionsResultCode"), switchName: "code", switches: [["setOptionsSuccess", e3.void()], ["setOptionsLowReserve", e3.void()], ["setOptionsTooManySigners", e3.void()], ["setOptionsBadFlags", e3.void()], ["setOptionsInvalidInflation", e3.void()], ["setOptionsCantChange", e3.void()], ["setOptionsUnknownFlag", e3.void()], ["setOptionsThresholdOutOfRange", e3.void()], ["setOptionsBadSigner", e3.void()], ["setOptionsInvalidHomeDomain", e3.void()], ["setOptionsAuthRevocableRequired", e3.void()]], arms: {} }), e3.enum("ChangeTrustResultCode", { changeTrustSuccess: 0, changeTrustMalformed: -1, changeTrustNoIssuer: -2, changeTrustInvalidLimit: -3, changeTrustLowReserve: -4, changeTrustSelfNotAllowed: -5, changeTrustTrustLineMissing: -6, changeTrustCannotDelete: -7, changeTrustNotAuthMaintainLiabilities: -8 }), e3.union("ChangeTrustResult", { switchOn: e3.lookup("ChangeTrustResultCode"), switchName: "code", switches: [["changeTrustSuccess", e3.void()], ["changeTrustMalformed", e3.void()], ["changeTrustNoIssuer", e3.void()], ["changeTrustInvalidLimit", e3.void()], ["changeTrustLowReserve", e3.void()], ["changeTrustSelfNotAllowed", e3.void()], ["changeTrustTrustLineMissing", e3.void()], ["changeTrustCannotDelete", e3.void()], ["changeTrustNotAuthMaintainLiabilities", e3.void()]], arms: {} }), e3.enum("AllowTrustResultCode", { allowTrustSuccess: 0, allowTrustMalformed: -1, allowTrustNoTrustLine: -2, allowTrustTrustNotRequired: -3, allowTrustCantRevoke: -4, allowTrustSelfNotAllowed: -5, allowTrustLowReserve: -6 }), e3.union("AllowTrustResult", { switchOn: e3.lookup("AllowTrustResultCode"), switchName: "code", switches: [["allowTrustSuccess", e3.void()], ["allowTrustMalformed", e3.void()], ["allowTrustNoTrustLine", e3.void()], ["allowTrustTrustNotRequired", e3.void()], ["allowTrustCantRevoke", e3.void()], ["allowTrustSelfNotAllowed", e3.void()], ["allowTrustLowReserve", e3.void()]], arms: {} }), e3.enum("AccountMergeResultCode", { accountMergeSuccess: 0, accountMergeMalformed: -1, accountMergeNoAccount: -2, accountMergeImmutableSet: -3, accountMergeHasSubEntries: -4, accountMergeSeqnumTooFar: -5, accountMergeDestFull: -6, accountMergeIsSponsor: -7 }), e3.union("AccountMergeResult", { switchOn: e3.lookup("AccountMergeResultCode"), switchName: "code", switches: [["accountMergeSuccess", "sourceAccountBalance"], ["accountMergeMalformed", e3.void()], ["accountMergeNoAccount", e3.void()], ["accountMergeImmutableSet", e3.void()], ["accountMergeHasSubEntries", e3.void()], ["accountMergeSeqnumTooFar", e3.void()], ["accountMergeDestFull", e3.void()], ["accountMergeIsSponsor", e3.void()]], arms: { sourceAccountBalance: e3.lookup("Int64") } }), e3.enum("InflationResultCode", { inflationSuccess: 0, inflationNotTime: -1 }), e3.struct("InflationPayout", [["destination", e3.lookup("AccountId")], ["amount", e3.lookup("Int64")]]), e3.union("InflationResult", { switchOn: e3.lookup("InflationResultCode"), switchName: "code", switches: [["inflationSuccess", "payouts"], ["inflationNotTime", e3.void()]], arms: { payouts: e3.varArray(e3.lookup("InflationPayout"), 2147483647) } }), e3.enum("ManageDataResultCode", { manageDataSuccess: 0, manageDataNotSupportedYet: -1, manageDataNameNotFound: -2, manageDataLowReserve: -3, manageDataInvalidName: -4 }), e3.union("ManageDataResult", { switchOn: e3.lookup("ManageDataResultCode"), switchName: "code", switches: [["manageDataSuccess", e3.void()], ["manageDataNotSupportedYet", e3.void()], ["manageDataNameNotFound", e3.void()], ["manageDataLowReserve", e3.void()], ["manageDataInvalidName", e3.void()]], arms: {} }), e3.enum("BumpSequenceResultCode", { bumpSequenceSuccess: 0, bumpSequenceBadSeq: -1 }), e3.union("BumpSequenceResult", { switchOn: e3.lookup("BumpSequenceResultCode"), switchName: "code", switches: [["bumpSequenceSuccess", e3.void()], ["bumpSequenceBadSeq", e3.void()]], arms: {} }), e3.enum("CreateClaimableBalanceResultCode", { createClaimableBalanceSuccess: 0, createClaimableBalanceMalformed: -1, createClaimableBalanceLowReserve: -2, createClaimableBalanceNoTrust: -3, createClaimableBalanceNotAuthorized: -4, createClaimableBalanceUnderfunded: -5 }), e3.union("CreateClaimableBalanceResult", { switchOn: e3.lookup("CreateClaimableBalanceResultCode"), switchName: "code", switches: [["createClaimableBalanceSuccess", "balanceId"], ["createClaimableBalanceMalformed", e3.void()], ["createClaimableBalanceLowReserve", e3.void()], ["createClaimableBalanceNoTrust", e3.void()], ["createClaimableBalanceNotAuthorized", e3.void()], ["createClaimableBalanceUnderfunded", e3.void()]], arms: { balanceId: e3.lookup("ClaimableBalanceId") } }), e3.enum("ClaimClaimableBalanceResultCode", { claimClaimableBalanceSuccess: 0, claimClaimableBalanceDoesNotExist: -1, claimClaimableBalanceCannotClaim: -2, claimClaimableBalanceLineFull: -3, claimClaimableBalanceNoTrust: -4, claimClaimableBalanceNotAuthorized: -5 }), e3.union("ClaimClaimableBalanceResult", { switchOn: e3.lookup("ClaimClaimableBalanceResultCode"), switchName: "code", switches: [["claimClaimableBalanceSuccess", e3.void()], ["claimClaimableBalanceDoesNotExist", e3.void()], ["claimClaimableBalanceCannotClaim", e3.void()], ["claimClaimableBalanceLineFull", e3.void()], ["claimClaimableBalanceNoTrust", e3.void()], ["claimClaimableBalanceNotAuthorized", e3.void()]], arms: {} }), e3.enum("BeginSponsoringFutureReservesResultCode", { beginSponsoringFutureReservesSuccess: 0, beginSponsoringFutureReservesMalformed: -1, beginSponsoringFutureReservesAlreadySponsored: -2, beginSponsoringFutureReservesRecursive: -3 }), e3.union("BeginSponsoringFutureReservesResult", { switchOn: e3.lookup("BeginSponsoringFutureReservesResultCode"), switchName: "code", switches: [["beginSponsoringFutureReservesSuccess", e3.void()], ["beginSponsoringFutureReservesMalformed", e3.void()], ["beginSponsoringFutureReservesAlreadySponsored", e3.void()], ["beginSponsoringFutureReservesRecursive", e3.void()]], arms: {} }), e3.enum("EndSponsoringFutureReservesResultCode", { endSponsoringFutureReservesSuccess: 0, endSponsoringFutureReservesNotSponsored: -1 }), e3.union("EndSponsoringFutureReservesResult", { switchOn: e3.lookup("EndSponsoringFutureReservesResultCode"), switchName: "code", switches: [["endSponsoringFutureReservesSuccess", e3.void()], ["endSponsoringFutureReservesNotSponsored", e3.void()]], arms: {} }), e3.enum("RevokeSponsorshipResultCode", { revokeSponsorshipSuccess: 0, revokeSponsorshipDoesNotExist: -1, revokeSponsorshipNotSponsor: -2, revokeSponsorshipLowReserve: -3, revokeSponsorshipOnlyTransferable: -4, revokeSponsorshipMalformed: -5 }), e3.union("RevokeSponsorshipResult", { switchOn: e3.lookup("RevokeSponsorshipResultCode"), switchName: "code", switches: [["revokeSponsorshipSuccess", e3.void()], ["revokeSponsorshipDoesNotExist", e3.void()], ["revokeSponsorshipNotSponsor", e3.void()], ["revokeSponsorshipLowReserve", e3.void()], ["revokeSponsorshipOnlyTransferable", e3.void()], ["revokeSponsorshipMalformed", e3.void()]], arms: {} }), e3.enum("ClawbackResultCode", { clawbackSuccess: 0, clawbackMalformed: -1, clawbackNotClawbackEnabled: -2, clawbackNoTrust: -3, clawbackUnderfunded: -4 }), e3.union("ClawbackResult", { switchOn: e3.lookup("ClawbackResultCode"), switchName: "code", switches: [["clawbackSuccess", e3.void()], ["clawbackMalformed", e3.void()], ["clawbackNotClawbackEnabled", e3.void()], ["clawbackNoTrust", e3.void()], ["clawbackUnderfunded", e3.void()]], arms: {} }), e3.enum("ClawbackClaimableBalanceResultCode", { clawbackClaimableBalanceSuccess: 0, clawbackClaimableBalanceDoesNotExist: -1, clawbackClaimableBalanceNotIssuer: -2, clawbackClaimableBalanceNotClawbackEnabled: -3 }), e3.union("ClawbackClaimableBalanceResult", { switchOn: e3.lookup("ClawbackClaimableBalanceResultCode"), switchName: "code", switches: [["clawbackClaimableBalanceSuccess", e3.void()], ["clawbackClaimableBalanceDoesNotExist", e3.void()], ["clawbackClaimableBalanceNotIssuer", e3.void()], ["clawbackClaimableBalanceNotClawbackEnabled", e3.void()]], arms: {} }), e3.enum("SetTrustLineFlagsResultCode", { setTrustLineFlagsSuccess: 0, setTrustLineFlagsMalformed: -1, setTrustLineFlagsNoTrustLine: -2, setTrustLineFlagsCantRevoke: -3, setTrustLineFlagsInvalidState: -4, setTrustLineFlagsLowReserve: -5 }), e3.union("SetTrustLineFlagsResult", { switchOn: e3.lookup("SetTrustLineFlagsResultCode"), switchName: "code", switches: [["setTrustLineFlagsSuccess", e3.void()], ["setTrustLineFlagsMalformed", e3.void()], ["setTrustLineFlagsNoTrustLine", e3.void()], ["setTrustLineFlagsCantRevoke", e3.void()], ["setTrustLineFlagsInvalidState", e3.void()], ["setTrustLineFlagsLowReserve", e3.void()]], arms: {} }), e3.enum("LiquidityPoolDepositResultCode", { liquidityPoolDepositSuccess: 0, liquidityPoolDepositMalformed: -1, liquidityPoolDepositNoTrust: -2, liquidityPoolDepositNotAuthorized: -3, liquidityPoolDepositUnderfunded: -4, liquidityPoolDepositLineFull: -5, liquidityPoolDepositBadPrice: -6, liquidityPoolDepositPoolFull: -7 }), e3.union("LiquidityPoolDepositResult", { switchOn: e3.lookup("LiquidityPoolDepositResultCode"), switchName: "code", switches: [["liquidityPoolDepositSuccess", e3.void()], ["liquidityPoolDepositMalformed", e3.void()], ["liquidityPoolDepositNoTrust", e3.void()], ["liquidityPoolDepositNotAuthorized", e3.void()], ["liquidityPoolDepositUnderfunded", e3.void()], ["liquidityPoolDepositLineFull", e3.void()], ["liquidityPoolDepositBadPrice", e3.void()], ["liquidityPoolDepositPoolFull", e3.void()]], arms: {} }), e3.enum("LiquidityPoolWithdrawResultCode", { liquidityPoolWithdrawSuccess: 0, liquidityPoolWithdrawMalformed: -1, liquidityPoolWithdrawNoTrust: -2, liquidityPoolWithdrawUnderfunded: -3, liquidityPoolWithdrawLineFull: -4, liquidityPoolWithdrawUnderMinimum: -5 }), e3.union("LiquidityPoolWithdrawResult", { switchOn: e3.lookup("LiquidityPoolWithdrawResultCode"), switchName: "code", switches: [["liquidityPoolWithdrawSuccess", e3.void()], ["liquidityPoolWithdrawMalformed", e3.void()], ["liquidityPoolWithdrawNoTrust", e3.void()], ["liquidityPoolWithdrawUnderfunded", e3.void()], ["liquidityPoolWithdrawLineFull", e3.void()], ["liquidityPoolWithdrawUnderMinimum", e3.void()]], arms: {} }), e3.enum("InvokeHostFunctionResultCode", { invokeHostFunctionSuccess: 0, invokeHostFunctionMalformed: -1, invokeHostFunctionTrapped: -2, invokeHostFunctionResourceLimitExceeded: -3, invokeHostFunctionEntryArchived: -4, invokeHostFunctionInsufficientRefundableFee: -5 }), e3.union("InvokeHostFunctionResult", { switchOn: e3.lookup("InvokeHostFunctionResultCode"), switchName: "code", switches: [["invokeHostFunctionSuccess", "success"], ["invokeHostFunctionMalformed", e3.void()], ["invokeHostFunctionTrapped", e3.void()], ["invokeHostFunctionResourceLimitExceeded", e3.void()], ["invokeHostFunctionEntryArchived", e3.void()], ["invokeHostFunctionInsufficientRefundableFee", e3.void()]], arms: { success: e3.lookup("Hash") } }), e3.enum("ExtendFootprintTtlResultCode", { extendFootprintTtlSuccess: 0, extendFootprintTtlMalformed: -1, extendFootprintTtlResourceLimitExceeded: -2, extendFootprintTtlInsufficientRefundableFee: -3 }), e3.union("ExtendFootprintTtlResult", { switchOn: e3.lookup("ExtendFootprintTtlResultCode"), switchName: "code", switches: [["extendFootprintTtlSuccess", e3.void()], ["extendFootprintTtlMalformed", e3.void()], ["extendFootprintTtlResourceLimitExceeded", e3.void()], ["extendFootprintTtlInsufficientRefundableFee", e3.void()]], arms: {} }), e3.enum("RestoreFootprintResultCode", { restoreFootprintSuccess: 0, restoreFootprintMalformed: -1, restoreFootprintResourceLimitExceeded: -2, restoreFootprintInsufficientRefundableFee: -3 }), e3.union("RestoreFootprintResult", { switchOn: e3.lookup("RestoreFootprintResultCode"), switchName: "code", switches: [["restoreFootprintSuccess", e3.void()], ["restoreFootprintMalformed", e3.void()], ["restoreFootprintResourceLimitExceeded", e3.void()], ["restoreFootprintInsufficientRefundableFee", e3.void()]], arms: {} }), e3.enum("OperationResultCode", { opInner: 0, opBadAuth: -1, opNoAccount: -2, opNotSupported: -3, opTooManySubentries: -4, opExceededWorkLimit: -5, opTooManySponsoring: -6 }), e3.union("OperationResultTr", { switchOn: e3.lookup("OperationType"), switchName: "type", switches: [["createAccount", "createAccountResult"], ["payment", "paymentResult"], ["pathPaymentStrictReceive", "pathPaymentStrictReceiveResult"], ["manageSellOffer", "manageSellOfferResult"], ["createPassiveSellOffer", "createPassiveSellOfferResult"], ["setOptions", "setOptionsResult"], ["changeTrust", "changeTrustResult"], ["allowTrust", "allowTrustResult"], ["accountMerge", "accountMergeResult"], ["inflation", "inflationResult"], ["manageData", "manageDataResult"], ["bumpSequence", "bumpSeqResult"], ["manageBuyOffer", "manageBuyOfferResult"], ["pathPaymentStrictSend", "pathPaymentStrictSendResult"], ["createClaimableBalance", "createClaimableBalanceResult"], ["claimClaimableBalance", "claimClaimableBalanceResult"], ["beginSponsoringFutureReserves", "beginSponsoringFutureReservesResult"], ["endSponsoringFutureReserves", "endSponsoringFutureReservesResult"], ["revokeSponsorship", "revokeSponsorshipResult"], ["clawback", "clawbackResult"], ["clawbackClaimableBalance", "clawbackClaimableBalanceResult"], ["setTrustLineFlags", "setTrustLineFlagsResult"], ["liquidityPoolDeposit", "liquidityPoolDepositResult"], ["liquidityPoolWithdraw", "liquidityPoolWithdrawResult"], ["invokeHostFunction", "invokeHostFunctionResult"], ["extendFootprintTtl", "extendFootprintTtlResult"], ["restoreFootprint", "restoreFootprintResult"]], arms: { createAccountResult: e3.lookup("CreateAccountResult"), paymentResult: e3.lookup("PaymentResult"), pathPaymentStrictReceiveResult: e3.lookup("PathPaymentStrictReceiveResult"), manageSellOfferResult: e3.lookup("ManageSellOfferResult"), createPassiveSellOfferResult: e3.lookup("ManageSellOfferResult"), setOptionsResult: e3.lookup("SetOptionsResult"), changeTrustResult: e3.lookup("ChangeTrustResult"), allowTrustResult: e3.lookup("AllowTrustResult"), accountMergeResult: e3.lookup("AccountMergeResult"), inflationResult: e3.lookup("InflationResult"), manageDataResult: e3.lookup("ManageDataResult"), bumpSeqResult: e3.lookup("BumpSequenceResult"), manageBuyOfferResult: e3.lookup("ManageBuyOfferResult"), pathPaymentStrictSendResult: e3.lookup("PathPaymentStrictSendResult"), createClaimableBalanceResult: e3.lookup("CreateClaimableBalanceResult"), claimClaimableBalanceResult: e3.lookup("ClaimClaimableBalanceResult"), beginSponsoringFutureReservesResult: e3.lookup("BeginSponsoringFutureReservesResult"), endSponsoringFutureReservesResult: e3.lookup("EndSponsoringFutureReservesResult"), revokeSponsorshipResult: e3.lookup("RevokeSponsorshipResult"), clawbackResult: e3.lookup("ClawbackResult"), clawbackClaimableBalanceResult: e3.lookup("ClawbackClaimableBalanceResult"), setTrustLineFlagsResult: e3.lookup("SetTrustLineFlagsResult"), liquidityPoolDepositResult: e3.lookup("LiquidityPoolDepositResult"), liquidityPoolWithdrawResult: e3.lookup("LiquidityPoolWithdrawResult"), invokeHostFunctionResult: e3.lookup("InvokeHostFunctionResult"), extendFootprintTtlResult: e3.lookup("ExtendFootprintTtlResult"), restoreFootprintResult: e3.lookup("RestoreFootprintResult") } }), e3.union("OperationResult", { switchOn: e3.lookup("OperationResultCode"), switchName: "code", switches: [["opInner", "tr"], ["opBadAuth", e3.void()], ["opNoAccount", e3.void()], ["opNotSupported", e3.void()], ["opTooManySubentries", e3.void()], ["opExceededWorkLimit", e3.void()], ["opTooManySponsoring", e3.void()]], arms: { tr: e3.lookup("OperationResultTr") } }), e3.enum("TransactionResultCode", { txFeeBumpInnerSuccess: 1, txSuccess: 0, txFailed: -1, txTooEarly: -2, txTooLate: -3, txMissingOperation: -4, txBadSeq: -5, txBadAuth: -6, txInsufficientBalance: -7, txNoAccount: -8, txInsufficientFee: -9, txBadAuthExtra: -10, txInternalError: -11, txNotSupported: -12, txFeeBumpInnerFailed: -13, txBadSponsorship: -14, txBadMinSeqAgeOrGap: -15, txMalformed: -16, txSorobanInvalid: -17 }), e3.union("InnerTransactionResultResult", { switchOn: e3.lookup("TransactionResultCode"), switchName: "code", switches: [["txSuccess", "results"], ["txFailed", "results"], ["txTooEarly", e3.void()], ["txTooLate", e3.void()], ["txMissingOperation", e3.void()], ["txBadSeq", e3.void()], ["txBadAuth", e3.void()], ["txInsufficientBalance", e3.void()], ["txNoAccount", e3.void()], ["txInsufficientFee", e3.void()], ["txBadAuthExtra", e3.void()], ["txInternalError", e3.void()], ["txNotSupported", e3.void()], ["txBadSponsorship", e3.void()], ["txBadMinSeqAgeOrGap", e3.void()], ["txMalformed", e3.void()], ["txSorobanInvalid", e3.void()]], arms: { results: e3.varArray(e3.lookup("OperationResult"), 2147483647) } }), e3.union("InnerTransactionResultExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()]], arms: {} }), e3.struct("InnerTransactionResult", [["feeCharged", e3.lookup("Int64")], ["result", e3.lookup("InnerTransactionResultResult")], ["ext", e3.lookup("InnerTransactionResultExt")]]), e3.struct("InnerTransactionResultPair", [["transactionHash", e3.lookup("Hash")], ["result", e3.lookup("InnerTransactionResult")]]), e3.union("TransactionResultResult", { switchOn: e3.lookup("TransactionResultCode"), switchName: "code", switches: [["txFeeBumpInnerSuccess", "innerResultPair"], ["txFeeBumpInnerFailed", "innerResultPair"], ["txSuccess", "results"], ["txFailed", "results"], ["txTooEarly", e3.void()], ["txTooLate", e3.void()], ["txMissingOperation", e3.void()], ["txBadSeq", e3.void()], ["txBadAuth", e3.void()], ["txInsufficientBalance", e3.void()], ["txNoAccount", e3.void()], ["txInsufficientFee", e3.void()], ["txBadAuthExtra", e3.void()], ["txInternalError", e3.void()], ["txNotSupported", e3.void()], ["txBadSponsorship", e3.void()], ["txBadMinSeqAgeOrGap", e3.void()], ["txMalformed", e3.void()], ["txSorobanInvalid", e3.void()]], arms: { innerResultPair: e3.lookup("InnerTransactionResultPair"), results: e3.varArray(e3.lookup("OperationResult"), 2147483647) } }), e3.union("TransactionResultExt", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()]], arms: {} }), e3.struct("TransactionResult", [["feeCharged", e3.lookup("Int64")], ["result", e3.lookup("TransactionResultResult")], ["ext", e3.lookup("TransactionResultExt")]]), e3.typedef("Hash", e3.opaque(32)), e3.typedef("Uint256", e3.opaque(32)), e3.typedef("Uint32", e3.uint()), e3.typedef("Int32", e3.int()), e3.typedef("Uint64", e3.uhyper()), e3.typedef("Int64", e3.hyper()), e3.typedef("TimePoint", e3.lookup("Uint64")), e3.typedef("Duration", e3.lookup("Uint64")), e3.union("ExtensionPoint", { switchOn: e3.int(), switchName: "v", switches: [[0, e3.void()]], arms: {} }), e3.enum("CryptoKeyType", { keyTypeEd25519: 0, keyTypePreAuthTx: 1, keyTypeHashX: 2, keyTypeEd25519SignedPayload: 3, keyTypeMuxedEd25519: 256 }), e3.enum("PublicKeyType", { publicKeyTypeEd25519: 0 }), e3.enum("SignerKeyType", { signerKeyTypeEd25519: 0, signerKeyTypePreAuthTx: 1, signerKeyTypeHashX: 2, signerKeyTypeEd25519SignedPayload: 3 }), e3.union("PublicKey", { switchOn: e3.lookup("PublicKeyType"), switchName: "type", switches: [["publicKeyTypeEd25519", "ed25519"]], arms: { ed25519: e3.lookup("Uint256") } }), e3.struct("SignerKeyEd25519SignedPayload", [["ed25519", e3.lookup("Uint256")], ["payload", e3.varOpaque(64)]]), e3.union("SignerKey", { switchOn: e3.lookup("SignerKeyType"), switchName: "type", switches: [["signerKeyTypeEd25519", "ed25519"], ["signerKeyTypePreAuthTx", "preAuthTx"], ["signerKeyTypeHashX", "hashX"], ["signerKeyTypeEd25519SignedPayload", "ed25519SignedPayload"]], arms: { ed25519: e3.lookup("Uint256"), preAuthTx: e3.lookup("Uint256"), hashX: e3.lookup("Uint256"), ed25519SignedPayload: e3.lookup("SignerKeyEd25519SignedPayload") } }), e3.typedef("Signature", e3.varOpaque(64)), e3.typedef("SignatureHint", e3.opaque(4)), e3.typedef("NodeId", e3.lookup("PublicKey")), e3.typedef("AccountId", e3.lookup("PublicKey")), e3.typedef("ContractId", e3.lookup("Hash")), e3.struct("Curve25519Secret", [["key", e3.opaque(32)]]), e3.struct("Curve25519Public", [["key", e3.opaque(32)]]), e3.struct("HmacSha256Key", [["key", e3.opaque(32)]]), e3.struct("HmacSha256Mac", [["mac", e3.opaque(32)]]), e3.struct("ShortHashSeed", [["seed", e3.opaque(16)]]), e3.enum("BinaryFuseFilterType", { binaryFuseFilter8Bit: 0, binaryFuseFilter16Bit: 1, binaryFuseFilter32Bit: 2 }), e3.struct("SerializedBinaryFuseFilter", [["type", e3.lookup("BinaryFuseFilterType")], ["inputHashSeed", e3.lookup("ShortHashSeed")], ["filterSeed", e3.lookup("ShortHashSeed")], ["segmentLength", e3.lookup("Uint32")], ["segementLengthMask", e3.lookup("Uint32")], ["segmentCount", e3.lookup("Uint32")], ["segmentCountLength", e3.lookup("Uint32")], ["fingerprintLength", e3.lookup("Uint32")], ["fingerprints", e3.varOpaque()]]), e3.typedef("PoolId", e3.lookup("Hash")), e3.enum("ClaimableBalanceIdType", { claimableBalanceIdTypeV0: 0 }), e3.union("ClaimableBalanceId", { switchOn: e3.lookup("ClaimableBalanceIdType"), switchName: "type", switches: [["claimableBalanceIdTypeV0", "v0"]], arms: { v0: e3.lookup("Hash") } }), e3.enum("ScValType", { scvBool: 0, scvVoid: 1, scvError: 2, scvU32: 3, scvI32: 4, scvU64: 5, scvI64: 6, scvTimepoint: 7, scvDuration: 8, scvU128: 9, scvI128: 10, scvU256: 11, scvI256: 12, scvBytes: 13, scvString: 14, scvSymbol: 15, scvVec: 16, scvMap: 17, scvAddress: 18, scvContractInstance: 19, scvLedgerKeyContractInstance: 20, scvLedgerKeyNonce: 21 }), e3.enum("ScErrorType", { sceContract: 0, sceWasmVm: 1, sceContext: 2, sceStorage: 3, sceObject: 4, sceCrypto: 5, sceEvents: 6, sceBudget: 7, sceValue: 8, sceAuth: 9 }), e3.enum("ScErrorCode", { scecArithDomain: 0, scecIndexBounds: 1, scecInvalidInput: 2, scecMissingValue: 3, scecExistingValue: 4, scecExceededLimit: 5, scecInvalidAction: 6, scecInternalError: 7, scecUnexpectedType: 8, scecUnexpectedSize: 9 }), e3.union("ScError", { switchOn: e3.lookup("ScErrorType"), switchName: "type", switches: [["sceContract", "contractCode"], ["sceWasmVm", "code"], ["sceContext", "code"], ["sceStorage", "code"], ["sceObject", "code"], ["sceCrypto", "code"], ["sceEvents", "code"], ["sceBudget", "code"], ["sceValue", "code"], ["sceAuth", "code"]], arms: { contractCode: e3.lookup("Uint32"), code: e3.lookup("ScErrorCode") } }), e3.struct("UInt128Parts", [["hi", e3.lookup("Uint64")], ["lo", e3.lookup("Uint64")]]), e3.struct("Int128Parts", [["hi", e3.lookup("Int64")], ["lo", e3.lookup("Uint64")]]), e3.struct("UInt256Parts", [["hiHi", e3.lookup("Uint64")], ["hiLo", e3.lookup("Uint64")], ["loHi", e3.lookup("Uint64")], ["loLo", e3.lookup("Uint64")]]), e3.struct("Int256Parts", [["hiHi", e3.lookup("Int64")], ["hiLo", e3.lookup("Uint64")], ["loHi", e3.lookup("Uint64")], ["loLo", e3.lookup("Uint64")]]), e3.enum("ContractExecutableType", { contractExecutableWasm: 0, contractExecutableStellarAsset: 1 }), e3.union("ContractExecutable", { switchOn: e3.lookup("ContractExecutableType"), switchName: "type", switches: [["contractExecutableWasm", "wasmHash"], ["contractExecutableStellarAsset", e3.void()]], arms: { wasmHash: e3.lookup("Hash") } }), e3.enum("ScAddressType", { scAddressTypeAccount: 0, scAddressTypeContract: 1, scAddressTypeMuxedAccount: 2, scAddressTypeClaimableBalance: 3, scAddressTypeLiquidityPool: 4 }), e3.struct("MuxedEd25519Account", [["id", e3.lookup("Uint64")], ["ed25519", e3.lookup("Uint256")]]), e3.union("ScAddress", { switchOn: e3.lookup("ScAddressType"), switchName: "type", switches: [["scAddressTypeAccount", "accountId"], ["scAddressTypeContract", "contractId"], ["scAddressTypeMuxedAccount", "muxedAccount"], ["scAddressTypeClaimableBalance", "claimableBalanceId"], ["scAddressTypeLiquidityPool", "liquidityPoolId"]], arms: { accountId: e3.lookup("AccountId"), contractId: e3.lookup("ContractId"), muxedAccount: e3.lookup("MuxedEd25519Account"), claimableBalanceId: e3.lookup("ClaimableBalanceId"), liquidityPoolId: e3.lookup("PoolId") } }), e3.const("SCSYMBOL_LIMIT", 32), e3.typedef("ScVec", e3.varArray(e3.lookup("ScVal"), 2147483647)), e3.typedef("ScMap", e3.varArray(e3.lookup("ScMapEntry"), 2147483647)), e3.typedef("ScBytes", e3.varOpaque()), e3.typedef("ScString", e3.string()), e3.typedef("ScSymbol", e3.string(32)), e3.struct("ScNonceKey", [["nonce", e3.lookup("Int64")]]), e3.struct("ScContractInstance", [["executable", e3.lookup("ContractExecutable")], ["storage", e3.option(e3.lookup("ScMap"))]]), e3.union("ScVal", { switchOn: e3.lookup("ScValType"), switchName: "type", switches: [["scvBool", "b"], ["scvVoid", e3.void()], ["scvError", "error"], ["scvU32", "u32"], ["scvI32", "i32"], ["scvU64", "u64"], ["scvI64", "i64"], ["scvTimepoint", "timepoint"], ["scvDuration", "duration"], ["scvU128", "u128"], ["scvI128", "i128"], ["scvU256", "u256"], ["scvI256", "i256"], ["scvBytes", "bytes"], ["scvString", "str"], ["scvSymbol", "sym"], ["scvVec", "vec"], ["scvMap", "map"], ["scvAddress", "address"], ["scvContractInstance", "instance"], ["scvLedgerKeyContractInstance", e3.void()], ["scvLedgerKeyNonce", "nonceKey"]], arms: { b: e3.bool(), error: e3.lookup("ScError"), u32: e3.lookup("Uint32"), i32: e3.lookup("Int32"), u64: e3.lookup("Uint64"), i64: e3.lookup("Int64"), timepoint: e3.lookup("TimePoint"), duration: e3.lookup("Duration"), u128: e3.lookup("UInt128Parts"), i128: e3.lookup("Int128Parts"), u256: e3.lookup("UInt256Parts"), i256: e3.lookup("Int256Parts"), bytes: e3.lookup("ScBytes"), str: e3.lookup("ScString"), sym: e3.lookup("ScSymbol"), vec: e3.option(e3.lookup("ScVec")), map: e3.option(e3.lookup("ScMap")), address: e3.lookup("ScAddress"), instance: e3.lookup("ScContractInstance"), nonceKey: e3.lookup("ScNonceKey") } }), e3.struct("ScMapEntry", [["key", e3.lookup("ScVal")], ["val", e3.lookup("ScVal")]]), e3.enum("ScEnvMetaKind", { scEnvMetaKindInterfaceVersion: 0 }), e3.struct("ScEnvMetaEntryInterfaceVersion", [["protocol", e3.lookup("Uint32")], ["preRelease", e3.lookup("Uint32")]]), e3.union("ScEnvMetaEntry", { switchOn: e3.lookup("ScEnvMetaKind"), switchName: "kind", switches: [["scEnvMetaKindInterfaceVersion", "interfaceVersion"]], arms: { interfaceVersion: e3.lookup("ScEnvMetaEntryInterfaceVersion") } }), e3.struct("ScMetaV0", [["key", e3.string()], ["val", e3.string()]]), e3.enum("ScMetaKind", { scMetaV0: 0 }), e3.union("ScMetaEntry", { switchOn: e3.lookup("ScMetaKind"), switchName: "kind", switches: [["scMetaV0", "v0"]], arms: { v0: e3.lookup("ScMetaV0") } }), e3.const("SC_SPEC_DOC_LIMIT", 1024), e3.enum("ScSpecType", { scSpecTypeVal: 0, scSpecTypeBool: 1, scSpecTypeVoid: 2, scSpecTypeError: 3, scSpecTypeU32: 4, scSpecTypeI32: 5, scSpecTypeU64: 6, scSpecTypeI64: 7, scSpecTypeTimepoint: 8, scSpecTypeDuration: 9, scSpecTypeU128: 10, scSpecTypeI128: 11, scSpecTypeU256: 12, scSpecTypeI256: 13, scSpecTypeBytes: 14, scSpecTypeString: 16, scSpecTypeSymbol: 17, scSpecTypeAddress: 19, scSpecTypeMuxedAddress: 20, scSpecTypeOption: 1e3, scSpecTypeResult: 1001, scSpecTypeVec: 1002, scSpecTypeMap: 1004, scSpecTypeTuple: 1005, scSpecTypeBytesN: 1006, scSpecTypeUdt: 2e3 }), e3.struct("ScSpecTypeOption", [["valueType", e3.lookup("ScSpecTypeDef")]]), e3.struct("ScSpecTypeResult", [["okType", e3.lookup("ScSpecTypeDef")], ["errorType", e3.lookup("ScSpecTypeDef")]]), e3.struct("ScSpecTypeVec", [["elementType", e3.lookup("ScSpecTypeDef")]]), e3.struct("ScSpecTypeMap", [["keyType", e3.lookup("ScSpecTypeDef")], ["valueType", e3.lookup("ScSpecTypeDef")]]), e3.struct("ScSpecTypeTuple", [["valueTypes", e3.varArray(e3.lookup("ScSpecTypeDef"), 12)]]), e3.struct("ScSpecTypeBytesN", [["n", e3.lookup("Uint32")]]), e3.struct("ScSpecTypeUdt", [["name", e3.string(60)]]), e3.union("ScSpecTypeDef", { switchOn: e3.lookup("ScSpecType"), switchName: "type", switches: [["scSpecTypeVal", e3.void()], ["scSpecTypeBool", e3.void()], ["scSpecTypeVoid", e3.void()], ["scSpecTypeError", e3.void()], ["scSpecTypeU32", e3.void()], ["scSpecTypeI32", e3.void()], ["scSpecTypeU64", e3.void()], ["scSpecTypeI64", e3.void()], ["scSpecTypeTimepoint", e3.void()], ["scSpecTypeDuration", e3.void()], ["scSpecTypeU128", e3.void()], ["scSpecTypeI128", e3.void()], ["scSpecTypeU256", e3.void()], ["scSpecTypeI256", e3.void()], ["scSpecTypeBytes", e3.void()], ["scSpecTypeString", e3.void()], ["scSpecTypeSymbol", e3.void()], ["scSpecTypeAddress", e3.void()], ["scSpecTypeMuxedAddress", e3.void()], ["scSpecTypeOption", "option"], ["scSpecTypeResult", "result"], ["scSpecTypeVec", "vec"], ["scSpecTypeMap", "map"], ["scSpecTypeTuple", "tuple"], ["scSpecTypeBytesN", "bytesN"], ["scSpecTypeUdt", "udt"]], arms: { option: e3.lookup("ScSpecTypeOption"), result: e3.lookup("ScSpecTypeResult"), vec: e3.lookup("ScSpecTypeVec"), map: e3.lookup("ScSpecTypeMap"), tuple: e3.lookup("ScSpecTypeTuple"), bytesN: e3.lookup("ScSpecTypeBytesN"), udt: e3.lookup("ScSpecTypeUdt") } }), e3.struct("ScSpecUdtStructFieldV0", [["doc", e3.string(t3)], ["name", e3.string(30)], ["type", e3.lookup("ScSpecTypeDef")]]), e3.struct("ScSpecUdtStructV0", [["doc", e3.string(t3)], ["lib", e3.string(80)], ["name", e3.string(60)], ["fields", e3.varArray(e3.lookup("ScSpecUdtStructFieldV0"), 40)]]), e3.struct("ScSpecUdtUnionCaseVoidV0", [["doc", e3.string(t3)], ["name", e3.string(60)]]), e3.struct("ScSpecUdtUnionCaseTupleV0", [["doc", e3.string(t3)], ["name", e3.string(60)], ["type", e3.varArray(e3.lookup("ScSpecTypeDef"), 12)]]), e3.enum("ScSpecUdtUnionCaseV0Kind", { scSpecUdtUnionCaseVoidV0: 0, scSpecUdtUnionCaseTupleV0: 1 }), e3.union("ScSpecUdtUnionCaseV0", { switchOn: e3.lookup("ScSpecUdtUnionCaseV0Kind"), switchName: "kind", switches: [["scSpecUdtUnionCaseVoidV0", "voidCase"], ["scSpecUdtUnionCaseTupleV0", "tupleCase"]], arms: { voidCase: e3.lookup("ScSpecUdtUnionCaseVoidV0"), tupleCase: e3.lookup("ScSpecUdtUnionCaseTupleV0") } }), e3.struct("ScSpecUdtUnionV0", [["doc", e3.string(t3)], ["lib", e3.string(80)], ["name", e3.string(60)], ["cases", e3.varArray(e3.lookup("ScSpecUdtUnionCaseV0"), 50)]]), e3.struct("ScSpecUdtEnumCaseV0", [["doc", e3.string(t3)], ["name", e3.string(60)], ["value", e3.lookup("Uint32")]]), e3.struct("ScSpecUdtEnumV0", [["doc", e3.string(t3)], ["lib", e3.string(80)], ["name", e3.string(60)], ["cases", e3.varArray(e3.lookup("ScSpecUdtEnumCaseV0"), 50)]]), e3.struct("ScSpecUdtErrorEnumCaseV0", [["doc", e3.string(t3)], ["name", e3.string(60)], ["value", e3.lookup("Uint32")]]), e3.struct("ScSpecUdtErrorEnumV0", [["doc", e3.string(t3)], ["lib", e3.string(80)], ["name", e3.string(60)], ["cases", e3.varArray(e3.lookup("ScSpecUdtErrorEnumCaseV0"), 50)]]), e3.struct("ScSpecFunctionInputV0", [["doc", e3.string(t3)], ["name", e3.string(30)], ["type", e3.lookup("ScSpecTypeDef")]]), e3.struct("ScSpecFunctionV0", [["doc", e3.string(t3)], ["name", e3.lookup("ScSymbol")], ["inputs", e3.varArray(e3.lookup("ScSpecFunctionInputV0"), 10)], ["outputs", e3.varArray(e3.lookup("ScSpecTypeDef"), 1)]]), e3.enum("ScSpecEventParamLocationV0", { scSpecEventParamLocationData: 0, scSpecEventParamLocationTopicList: 1 }), e3.struct("ScSpecEventParamV0", [["doc", e3.string(t3)], ["name", e3.string(30)], ["type", e3.lookup("ScSpecTypeDef")], ["location", e3.lookup("ScSpecEventParamLocationV0")]]), e3.enum("ScSpecEventDataFormat", { scSpecEventDataFormatSingleValue: 0, scSpecEventDataFormatVec: 1, scSpecEventDataFormatMap: 2 }), e3.struct("ScSpecEventV0", [["doc", e3.string(t3)], ["lib", e3.string(80)], ["name", e3.lookup("ScSymbol")], ["prefixTopics", e3.varArray(e3.lookup("ScSymbol"), 2)], ["params", e3.varArray(e3.lookup("ScSpecEventParamV0"), 50)], ["dataFormat", e3.lookup("ScSpecEventDataFormat")]]), e3.enum("ScSpecEntryKind", { scSpecEntryFunctionV0: 0, scSpecEntryUdtStructV0: 1, scSpecEntryUdtUnionV0: 2, scSpecEntryUdtEnumV0: 3, scSpecEntryUdtErrorEnumV0: 4, scSpecEntryEventV0: 5 }), e3.union("ScSpecEntry", { switchOn: e3.lookup("ScSpecEntryKind"), switchName: "kind", switches: [["scSpecEntryFunctionV0", "functionV0"], ["scSpecEntryUdtStructV0", "udtStructV0"], ["scSpecEntryUdtUnionV0", "udtUnionV0"], ["scSpecEntryUdtEnumV0", "udtEnumV0"], ["scSpecEntryUdtErrorEnumV0", "udtErrorEnumV0"], ["scSpecEntryEventV0", "eventV0"]], arms: { functionV0: e3.lookup("ScSpecFunctionV0"), udtStructV0: e3.lookup("ScSpecUdtStructV0"), udtUnionV0: e3.lookup("ScSpecUdtUnionV0"), udtEnumV0: e3.lookup("ScSpecUdtEnumV0"), udtErrorEnumV0: e3.lookup("ScSpecUdtErrorEnumV0"), eventV0: e3.lookup("ScSpecEventV0") } }), e3.struct("ConfigSettingContractExecutionLanesV0", [["ledgerMaxTxCount", e3.lookup("Uint32")]]), e3.struct("ConfigSettingContractComputeV0", [["ledgerMaxInstructions", e3.lookup("Int64")], ["txMaxInstructions", e3.lookup("Int64")], ["feeRatePerInstructionsIncrement", e3.lookup("Int64")], ["txMemoryLimit", e3.lookup("Uint32")]]), e3.struct("ConfigSettingContractParallelComputeV0", [["ledgerMaxDependentTxClusters", e3.lookup("Uint32")]]), e3.struct("ConfigSettingContractLedgerCostV0", [["ledgerMaxDiskReadEntries", e3.lookup("Uint32")], ["ledgerMaxDiskReadBytes", e3.lookup("Uint32")], ["ledgerMaxWriteLedgerEntries", e3.lookup("Uint32")], ["ledgerMaxWriteBytes", e3.lookup("Uint32")], ["txMaxDiskReadEntries", e3.lookup("Uint32")], ["txMaxDiskReadBytes", e3.lookup("Uint32")], ["txMaxWriteLedgerEntries", e3.lookup("Uint32")], ["txMaxWriteBytes", e3.lookup("Uint32")], ["feeDiskReadLedgerEntry", e3.lookup("Int64")], ["feeWriteLedgerEntry", e3.lookup("Int64")], ["feeDiskRead1Kb", e3.lookup("Int64")], ["sorobanStateTargetSizeBytes", e3.lookup("Int64")], ["rentFee1KbSorobanStateSizeLow", e3.lookup("Int64")], ["rentFee1KbSorobanStateSizeHigh", e3.lookup("Int64")], ["sorobanStateRentFeeGrowthFactor", e3.lookup("Uint32")]]), e3.struct("ConfigSettingContractLedgerCostExtV0", [["txMaxFootprintEntries", e3.lookup("Uint32")], ["feeWrite1Kb", e3.lookup("Int64")]]), e3.struct("ConfigSettingContractHistoricalDataV0", [["feeHistorical1Kb", e3.lookup("Int64")]]), e3.struct("ConfigSettingContractEventsV0", [["txMaxContractEventsSizeBytes", e3.lookup("Uint32")], ["feeContractEvents1Kb", e3.lookup("Int64")]]), e3.struct("ConfigSettingContractBandwidthV0", [["ledgerMaxTxsSizeBytes", e3.lookup("Uint32")], ["txMaxSizeBytes", e3.lookup("Uint32")], ["feeTxSize1Kb", e3.lookup("Int64")]]), e3.enum("ContractCostType", { wasmInsnExec: 0, memAlloc: 1, memCpy: 2, memCmp: 3, dispatchHostFunction: 4, visitObject: 5, valSer: 6, valDeser: 7, computeSha256Hash: 8, computeEd25519PubKey: 9, verifyEd25519Sig: 10, vmInstantiation: 11, vmCachedInstantiation: 12, invokeVmFunction: 13, computeKeccak256Hash: 14, decodeEcdsaCurve256Sig: 15, recoverEcdsaSecp256k1Key: 16, int256AddSub: 17, int256Mul: 18, int256Div: 19, int256Pow: 20, int256Shift: 21, chaCha20DrawBytes: 22, parseWasmInstructions: 23, parseWasmFunctions: 24, parseWasmGlobals: 25, parseWasmTableEntries: 26, parseWasmTypes: 27, parseWasmDataSegments: 28, parseWasmElemSegments: 29, parseWasmImports: 30, parseWasmExports: 31, parseWasmDataSegmentBytes: 32, instantiateWasmInstructions: 33, instantiateWasmFunctions: 34, instantiateWasmGlobals: 35, instantiateWasmTableEntries: 36, instantiateWasmTypes: 37, instantiateWasmDataSegments: 38, instantiateWasmElemSegments: 39, instantiateWasmImports: 40, instantiateWasmExports: 41, instantiateWasmDataSegmentBytes: 42, sec1DecodePointUncompressed: 43, verifyEcdsaSecp256r1Sig: 44, bls12381EncodeFp: 45, bls12381DecodeFp: 46, bls12381G1CheckPointOnCurve: 47, bls12381G1CheckPointInSubgroup: 48, bls12381G2CheckPointOnCurve: 49, bls12381G2CheckPointInSubgroup: 50, bls12381G1ProjectiveToAffine: 51, bls12381G2ProjectiveToAffine: 52, bls12381G1Add: 53, bls12381G1Mul: 54, bls12381G1Msm: 55, bls12381MapFpToG1: 56, bls12381HashToG1: 57, bls12381G2Add: 58, bls12381G2Mul: 59, bls12381G2Msm: 60, bls12381MapFp2ToG2: 61, bls12381HashToG2: 62, bls12381Pairing: 63, bls12381FrFromU256: 64, bls12381FrToU256: 65, bls12381FrAddSub: 66, bls12381FrMul: 67, bls12381FrPow: 68, bls12381FrInv: 69 }), e3.struct("ContractCostParamEntry", [["ext", e3.lookup("ExtensionPoint")], ["constTerm", e3.lookup("Int64")], ["linearTerm", e3.lookup("Int64")]]), e3.struct("StateArchivalSettings", [["maxEntryTtl", e3.lookup("Uint32")], ["minTemporaryTtl", e3.lookup("Uint32")], ["minPersistentTtl", e3.lookup("Uint32")], ["persistentRentRateDenominator", e3.lookup("Int64")], ["tempRentRateDenominator", e3.lookup("Int64")], ["maxEntriesToArchive", e3.lookup("Uint32")], ["liveSorobanStateSizeWindowSampleSize", e3.lookup("Uint32")], ["liveSorobanStateSizeWindowSamplePeriod", e3.lookup("Uint32")], ["evictionScanSize", e3.lookup("Uint32")], ["startingEvictionScanLevel", e3.lookup("Uint32")]]), e3.struct("EvictionIterator", [["bucketListLevel", e3.lookup("Uint32")], ["isCurrBucket", e3.bool()], ["bucketFileOffset", e3.lookup("Uint64")]]), e3.struct("ConfigSettingScpTiming", [["ledgerTargetCloseTimeMilliseconds", e3.lookup("Uint32")], ["nominationTimeoutInitialMilliseconds", e3.lookup("Uint32")], ["nominationTimeoutIncrementMilliseconds", e3.lookup("Uint32")], ["ballotTimeoutInitialMilliseconds", e3.lookup("Uint32")], ["ballotTimeoutIncrementMilliseconds", e3.lookup("Uint32")]]), e3.const("CONTRACT_COST_COUNT_LIMIT", 1024), e3.typedef("ContractCostParams", e3.varArray(e3.lookup("ContractCostParamEntry"), e3.lookup("CONTRACT_COST_COUNT_LIMIT"))), e3.enum("ConfigSettingId", { configSettingContractMaxSizeBytes: 0, configSettingContractComputeV0: 1, configSettingContractLedgerCostV0: 2, configSettingContractHistoricalDataV0: 3, configSettingContractEventsV0: 4, configSettingContractBandwidthV0: 5, configSettingContractCostParamsCpuInstructions: 6, configSettingContractCostParamsMemoryBytes: 7, configSettingContractDataKeySizeBytes: 8, configSettingContractDataEntrySizeBytes: 9, configSettingStateArchival: 10, configSettingContractExecutionLanes: 11, configSettingLiveSorobanStateSizeWindow: 12, configSettingEvictionIterator: 13, configSettingContractParallelComputeV0: 14, configSettingContractLedgerCostExtV0: 15, configSettingScpTiming: 16 }), e3.union("ConfigSettingEntry", { switchOn: e3.lookup("ConfigSettingId"), switchName: "configSettingId", switches: [["configSettingContractMaxSizeBytes", "contractMaxSizeBytes"], ["configSettingContractComputeV0", "contractCompute"], ["configSettingContractLedgerCostV0", "contractLedgerCost"], ["configSettingContractHistoricalDataV0", "contractHistoricalData"], ["configSettingContractEventsV0", "contractEvents"], ["configSettingContractBandwidthV0", "contractBandwidth"], ["configSettingContractCostParamsCpuInstructions", "contractCostParamsCpuInsns"], ["configSettingContractCostParamsMemoryBytes", "contractCostParamsMemBytes"], ["configSettingContractDataKeySizeBytes", "contractDataKeySizeBytes"], ["configSettingContractDataEntrySizeBytes", "contractDataEntrySizeBytes"], ["configSettingStateArchival", "stateArchivalSettings"], ["configSettingContractExecutionLanes", "contractExecutionLanes"], ["configSettingLiveSorobanStateSizeWindow", "liveSorobanStateSizeWindow"], ["configSettingEvictionIterator", "evictionIterator"], ["configSettingContractParallelComputeV0", "contractParallelCompute"], ["configSettingContractLedgerCostExtV0", "contractLedgerCostExt"], ["configSettingScpTiming", "contractScpTiming"]], arms: { contractMaxSizeBytes: e3.lookup("Uint32"), contractCompute: e3.lookup("ConfigSettingContractComputeV0"), contractLedgerCost: e3.lookup("ConfigSettingContractLedgerCostV0"), contractHistoricalData: e3.lookup("ConfigSettingContractHistoricalDataV0"), contractEvents: e3.lookup("ConfigSettingContractEventsV0"), contractBandwidth: e3.lookup("ConfigSettingContractBandwidthV0"), contractCostParamsCpuInsns: e3.lookup("ContractCostParams"), contractCostParamsMemBytes: e3.lookup("ContractCostParams"), contractDataKeySizeBytes: e3.lookup("Uint32"), contractDataEntrySizeBytes: e3.lookup("Uint32"), stateArchivalSettings: e3.lookup("StateArchivalSettings"), contractExecutionLanes: e3.lookup("ConfigSettingContractExecutionLanesV0"), liveSorobanStateSizeWindow: e3.varArray(e3.lookup("Uint64"), 2147483647), evictionIterator: e3.lookup("EvictionIterator"), contractParallelCompute: e3.lookup("ConfigSettingContractParallelComputeV0"), contractLedgerCostExt: e3.lookup("ConfigSettingContractLedgerCostExtV0"), contractScpTiming: e3.lookup("ConfigSettingScpTiming") } }), e3.struct("LedgerCloseMetaBatch", [["startSequence", e3.lookup("Uint32")], ["endSequence", e3.lookup("Uint32")], ["ledgerCloseMeta", e3.varArray(e3.lookup("LedgerCloseMeta"), 2147483647)]]);
        });
        const i = o;
        const a = { XdrWriter: n.XdrWriter, XdrReader: n.XdrReader };
        var s = r2(2802);
        function u(e3) {
          var t3 = new s.sha256();
          return t3.update(e3, "utf8"), t3.digest();
        }
        const c = "object" == typeof globalThis && "crypto" in globalThis ? globalThis.crypto : void 0;
        function l(e3) {
          return e3 instanceof Uint8Array || ArrayBuffer.isView(e3) && "Uint8Array" === e3.constructor.name;
        }
        function f(e3) {
          if (!Number.isSafeInteger(e3) || e3 < 0) throw new Error("positive integer expected, got " + e3);
        }
        function p(e3, ...t3) {
          if (!l(e3)) throw new Error("Uint8Array expected");
          if (t3.length > 0 && !t3.includes(e3.length)) throw new Error("Uint8Array expected of length " + t3 + ", got length=" + e3.length);
        }
        function d(e3, t3 = true) {
          if (e3.destroyed) throw new Error("Hash instance has been destroyed");
          if (t3 && e3.finished) throw new Error("Hash#digest() has already been called");
        }
        function h(...e3) {
          for (let t3 = 0; t3 < e3.length; t3++) e3[t3].fill(0);
        }
        function y(e3) {
          return new DataView(e3.buffer, e3.byteOffset, e3.byteLength);
        }
        const m = (() => "function" == typeof Uint8Array.from([]).toHex && "function" == typeof Uint8Array.fromHex)(), g = Array.from({ length: 256 }, (e3, t3) => t3.toString(16).padStart(2, "0"));
        function v(e3) {
          if (p(e3), m) return e3.toHex();
          let t3 = "";
          for (let r3 = 0; r3 < e3.length; r3++) t3 += g[e3[r3]];
          return t3;
        }
        const b = 48, w = 57, S = 65, E = 70, k = 97, A = 102;
        function T(e3) {
          return e3 >= b && e3 <= w ? e3 - b : e3 >= S && e3 <= E ? e3 - (S - 10) : e3 >= k && e3 <= A ? e3 - (k - 10) : void 0;
        }
        function O(e3) {
          if ("string" != typeof e3) throw new Error("hex string expected, got " + typeof e3);
          if (m) return Uint8Array.fromHex(e3);
          const t3 = e3.length, r3 = t3 / 2;
          if (t3 % 2) throw new Error("hex string expected, got unpadded hex of length " + t3);
          const n2 = new Uint8Array(r3);
          for (let t4 = 0, o2 = 0; t4 < r3; t4++, o2 += 2) {
            const r4 = T(e3.charCodeAt(o2)), i2 = T(e3.charCodeAt(o2 + 1));
            if (void 0 === r4 || void 0 === i2) {
              const t5 = e3[o2] + e3[o2 + 1];
              throw new Error('hex string expected, got non-hex character "' + t5 + '" at index ' + o2);
            }
            n2[t4] = 16 * r4 + i2;
          }
          return n2;
        }
        function x(e3) {
          if ("string" != typeof e3) throw new Error("string expected");
          return new Uint8Array(new TextEncoder().encode(e3));
        }
        function P(e3) {
          return "string" == typeof e3 && (e3 = x(e3)), p(e3), e3;
        }
        function B(...e3) {
          let t3 = 0;
          for (let r4 = 0; r4 < e3.length; r4++) {
            const n2 = e3[r4];
            p(n2), t3 += n2.length;
          }
          const r3 = new Uint8Array(t3);
          for (let t4 = 0, n2 = 0; t4 < e3.length; t4++) {
            const o2 = e3[t4];
            r3.set(o2, n2), n2 += o2.length;
          }
          return r3;
        }
        class I {
        }
        function C(e3) {
          const t3 = (t4) => e3().update(P(t4)).digest(), r3 = e3();
          return t3.outputLen = r3.outputLen, t3.blockLen = r3.blockLen, t3.create = () => e3(), t3;
        }
        function R(e3 = 32) {
          if (c && "function" == typeof c.getRandomValues) return c.getRandomValues(new Uint8Array(e3));
          if (c && "function" == typeof c.randomBytes) return Uint8Array.from(c.randomBytes(e3));
          throw new Error("crypto.getRandomValues must be defined");
        }
        class _ extends I {
          constructor(e3, t3, r3, n2) {
            super(), this.finished = false, this.length = 0, this.pos = 0, this.destroyed = false, this.blockLen = e3, this.outputLen = t3, this.padOffset = r3, this.isLE = n2, this.buffer = new Uint8Array(e3), this.view = y(this.buffer);
          }
          update(e3) {
            d(this), p(e3 = P(e3));
            const { view: t3, buffer: r3, blockLen: n2 } = this, o2 = e3.length;
            for (let i2 = 0; i2 < o2; ) {
              const a2 = Math.min(n2 - this.pos, o2 - i2);
              if (a2 === n2) {
                const t4 = y(e3);
                for (; n2 <= o2 - i2; i2 += n2) this.process(t4, i2);
                continue;
              }
              r3.set(e3.subarray(i2, i2 + a2), this.pos), this.pos += a2, i2 += a2, this.pos === n2 && (this.process(t3, 0), this.pos = 0);
            }
            return this.length += e3.length, this.roundClean(), this;
          }
          digestInto(e3) {
            d(this), (function(e4, t4) {
              p(e4);
              const r4 = t4.outputLen;
              if (e4.length < r4) throw new Error("digestInto() expects output buffer of length at least " + r4);
            })(e3, this), this.finished = true;
            const { buffer: t3, view: r3, blockLen: n2, isLE: o2 } = this;
            let { pos: i2 } = this;
            t3[i2++] = 128, h(this.buffer.subarray(i2)), this.padOffset > n2 - i2 && (this.process(r3, 0), i2 = 0);
            for (let e4 = i2; e4 < n2; e4++) t3[e4] = 0;
            !(function(e4, t4, r4, n3) {
              if ("function" == typeof e4.setBigUint64) return e4.setBigUint64(t4, r4, n3);
              const o3 = BigInt(32), i3 = BigInt(4294967295), a3 = Number(r4 >> o3 & i3), s3 = Number(r4 & i3), u3 = n3 ? 4 : 0, c3 = n3 ? 0 : 4;
              e4.setUint32(t4 + u3, a3, n3), e4.setUint32(t4 + c3, s3, n3);
            })(r3, n2 - 8, BigInt(8 * this.length), o2), this.process(r3, 0);
            const a2 = y(e3), s2 = this.outputLen;
            if (s2 % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
            const u2 = s2 / 4, c2 = this.get();
            if (u2 > c2.length) throw new Error("_sha2: outputLen bigger than state");
            for (let e4 = 0; e4 < u2; e4++) a2.setUint32(4 * e4, c2[e4], o2);
          }
          digest() {
            const { buffer: e3, outputLen: t3 } = this;
            this.digestInto(e3);
            const r3 = e3.slice(0, t3);
            return this.destroy(), r3;
          }
          _cloneInto(e3) {
            e3 || (e3 = new this.constructor()), e3.set(...this.get());
            const { blockLen: t3, buffer: r3, length: n2, finished: o2, destroyed: i2, pos: a2 } = this;
            return e3.destroyed = i2, e3.finished = o2, e3.length = n2, e3.pos = a2, n2 % t3 && e3.buffer.set(r3), e3;
          }
          clone() {
            return this._cloneInto();
          }
        }
        const U = Uint32Array.from([1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209]), N = BigInt(2 ** 32 - 1), L = BigInt(32);
        function F(e3, t3 = false) {
          return t3 ? { h: Number(e3 & N), l: Number(e3 >> L & N) } : { h: 0 | Number(e3 >> L & N), l: 0 | Number(e3 & N) };
        }
        function j(e3, t3 = false) {
          const r3 = e3.length;
          let n2 = new Uint32Array(r3), o2 = new Uint32Array(r3);
          for (let i2 = 0; i2 < r3; i2++) {
            const { h: r4, l: a2 } = F(e3[i2], t3);
            [n2[i2], o2[i2]] = [r4, a2];
          }
          return [n2, o2];
        }
        const M = (e3, t3, r3) => e3 >>> r3, D = (e3, t3, r3) => e3 << 32 - r3 | t3 >>> r3, V = (e3, t3, r3) => e3 >>> r3 | t3 << 32 - r3, q = (e3, t3, r3) => e3 << 32 - r3 | t3 >>> r3, K = (e3, t3, r3) => e3 << 64 - r3 | t3 >>> r3 - 32, H = (e3, t3, r3) => e3 >>> r3 - 32 | t3 << 64 - r3;
        function z(e3, t3, r3, n2) {
          const o2 = (t3 >>> 0) + (n2 >>> 0);
          return { h: e3 + r3 + (o2 / 2 ** 32 | 0) | 0, l: 0 | o2 };
        }
        const X = (e3, t3, r3) => (e3 >>> 0) + (t3 >>> 0) + (r3 >>> 0), $ = (e3, t3, r3, n2) => t3 + r3 + n2 + (e3 / 2 ** 32 | 0) | 0, G = (e3, t3, r3, n2) => (e3 >>> 0) + (t3 >>> 0) + (r3 >>> 0) + (n2 >>> 0), W = (e3, t3, r3, n2, o2) => t3 + r3 + n2 + o2 + (e3 / 2 ** 32 | 0) | 0, Y = (e3, t3, r3, n2, o2) => (e3 >>> 0) + (t3 >>> 0) + (r3 >>> 0) + (n2 >>> 0) + (o2 >>> 0), Z = (e3, t3, r3, n2, o2, i2) => t3 + r3 + n2 + o2 + i2 + (e3 / 2 ** 32 | 0) | 0;
        const J = (() => j(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map((e3) => BigInt(e3))))(), Q = (() => J[0])(), ee = (() => J[1])(), te = new Uint32Array(80), re = new Uint32Array(80);
        class ne extends _ {
          constructor(e3 = 64) {
            super(128, e3, 16, false), this.Ah = 0 | U[0], this.Al = 0 | U[1], this.Bh = 0 | U[2], this.Bl = 0 | U[3], this.Ch = 0 | U[4], this.Cl = 0 | U[5], this.Dh = 0 | U[6], this.Dl = 0 | U[7], this.Eh = 0 | U[8], this.El = 0 | U[9], this.Fh = 0 | U[10], this.Fl = 0 | U[11], this.Gh = 0 | U[12], this.Gl = 0 | U[13], this.Hh = 0 | U[14], this.Hl = 0 | U[15];
          }
          get() {
            const { Ah: e3, Al: t3, Bh: r3, Bl: n2, Ch: o2, Cl: i2, Dh: a2, Dl: s2, Eh: u2, El: c2, Fh: l2, Fl: f2, Gh: p2, Gl: d2, Hh: h2, Hl: y2 } = this;
            return [e3, t3, r3, n2, o2, i2, a2, s2, u2, c2, l2, f2, p2, d2, h2, y2];
          }
          set(e3, t3, r3, n2, o2, i2, a2, s2, u2, c2, l2, f2, p2, d2, h2, y2) {
            this.Ah = 0 | e3, this.Al = 0 | t3, this.Bh = 0 | r3, this.Bl = 0 | n2, this.Ch = 0 | o2, this.Cl = 0 | i2, this.Dh = 0 | a2, this.Dl = 0 | s2, this.Eh = 0 | u2, this.El = 0 | c2, this.Fh = 0 | l2, this.Fl = 0 | f2, this.Gh = 0 | p2, this.Gl = 0 | d2, this.Hh = 0 | h2, this.Hl = 0 | y2;
          }
          process(e3, t3) {
            for (let r4 = 0; r4 < 16; r4++, t3 += 4) te[r4] = e3.getUint32(t3), re[r4] = e3.getUint32(t3 += 4);
            for (let e4 = 16; e4 < 80; e4++) {
              const t4 = 0 | te[e4 - 15], r4 = 0 | re[e4 - 15], n3 = V(t4, r4, 1) ^ V(t4, r4, 8) ^ M(t4, 0, 7), o3 = q(t4, r4, 1) ^ q(t4, r4, 8) ^ D(t4, r4, 7), i3 = 0 | te[e4 - 2], a3 = 0 | re[e4 - 2], s3 = V(i3, a3, 19) ^ K(i3, a3, 61) ^ M(i3, 0, 6), u3 = q(i3, a3, 19) ^ H(i3, a3, 61) ^ D(i3, a3, 6), c3 = G(o3, u3, re[e4 - 7], re[e4 - 16]), l3 = W(c3, n3, s3, te[e4 - 7], te[e4 - 16]);
              te[e4] = 0 | l3, re[e4] = 0 | c3;
            }
            let { Ah: r3, Al: n2, Bh: o2, Bl: i2, Ch: a2, Cl: s2, Dh: u2, Dl: c2, Eh: l2, El: f2, Fh: p2, Fl: d2, Gh: h2, Gl: y2, Hh: m2, Hl: g2 } = this;
            for (let e4 = 0; e4 < 80; e4++) {
              const t4 = V(l2, f2, 14) ^ V(l2, f2, 18) ^ K(l2, f2, 41), v2 = q(l2, f2, 14) ^ q(l2, f2, 18) ^ H(l2, f2, 41), b2 = l2 & p2 ^ ~l2 & h2, w2 = Y(g2, v2, f2 & d2 ^ ~f2 & y2, ee[e4], re[e4]), S2 = Z(w2, m2, t4, b2, Q[e4], te[e4]), E2 = 0 | w2, k2 = V(r3, n2, 28) ^ K(r3, n2, 34) ^ K(r3, n2, 39), A2 = q(r3, n2, 28) ^ H(r3, n2, 34) ^ H(r3, n2, 39), T2 = r3 & o2 ^ r3 & a2 ^ o2 & a2, O2 = n2 & i2 ^ n2 & s2 ^ i2 & s2;
              m2 = 0 | h2, g2 = 0 | y2, h2 = 0 | p2, y2 = 0 | d2, p2 = 0 | l2, d2 = 0 | f2, { h: l2, l: f2 } = z(0 | u2, 0 | c2, 0 | S2, 0 | E2), u2 = 0 | a2, c2 = 0 | s2, a2 = 0 | o2, s2 = 0 | i2, o2 = 0 | r3, i2 = 0 | n2;
              const x2 = X(E2, A2, O2);
              r3 = $(x2, S2, k2, T2), n2 = 0 | x2;
            }
            ({ h: r3, l: n2 } = z(0 | this.Ah, 0 | this.Al, 0 | r3, 0 | n2)), { h: o2, l: i2 } = z(0 | this.Bh, 0 | this.Bl, 0 | o2, 0 | i2), { h: a2, l: s2 } = z(0 | this.Ch, 0 | this.Cl, 0 | a2, 0 | s2), { h: u2, l: c2 } = z(0 | this.Dh, 0 | this.Dl, 0 | u2, 0 | c2), { h: l2, l: f2 } = z(0 | this.Eh, 0 | this.El, 0 | l2, 0 | f2), { h: p2, l: d2 } = z(0 | this.Fh, 0 | this.Fl, 0 | p2, 0 | d2), { h: h2, l: y2 } = z(0 | this.Gh, 0 | this.Gl, 0 | h2, 0 | y2), { h: m2, l: g2 } = z(0 | this.Hh, 0 | this.Hl, 0 | m2, 0 | g2), this.set(r3, n2, o2, i2, a2, s2, u2, c2, l2, f2, p2, d2, h2, y2, m2, g2);
          }
          roundClean() {
            h(te, re);
          }
          destroy() {
            h(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
          }
        }
        const oe = C(() => new ne()), ie = BigInt(0), ae = BigInt(1);
        function se(e3, t3 = "") {
          if ("boolean" != typeof e3) {
            throw new Error((t3 && `"${t3}"`) + "expected boolean, got type=" + typeof e3);
          }
          return e3;
        }
        function ue(e3, t3, r3 = "") {
          const n2 = l(e3), o2 = e3?.length, i2 = void 0 !== t3;
          if (!n2 || i2 && o2 !== t3) {
            throw new Error((r3 && `"${r3}" `) + "expected Uint8Array" + (i2 ? ` of length ${t3}` : "") + ", got " + (n2 ? `length=${o2}` : "type=" + typeof e3));
          }
          return e3;
        }
        function ce(e3) {
          if ("string" != typeof e3) throw new Error("hex string expected, got " + typeof e3);
          return "" === e3 ? ie : BigInt("0x" + e3);
        }
        function le(e3) {
          return p(e3), ce(v(Uint8Array.from(e3).reverse()));
        }
        function fe(e3, t3) {
          return O(e3.toString(16).padStart(2 * t3, "0"));
        }
        function pe(e3, t3, r3) {
          let n2;
          if ("string" == typeof t3) try {
            n2 = O(t3);
          } catch (t4) {
            throw new Error(e3 + " must be hex string or Uint8Array, cause: " + t4);
          }
          else {
            if (!l(t3)) throw new Error(e3 + " must be hex string or Uint8Array");
            n2 = Uint8Array.from(t3);
          }
          const o2 = n2.length;
          if ("number" == typeof r3 && o2 !== r3) throw new Error(e3 + " of length " + r3 + " expected, got " + o2);
          return n2;
        }
        function de(e3) {
          return Uint8Array.from(e3);
        }
        const he = (e3) => "bigint" == typeof e3 && ie <= e3;
        function ye(e3, t3, r3, n2) {
          if (!(function(e4, t4, r4) {
            return he(e4) && he(t4) && he(r4) && t4 <= e4 && e4 < r4;
          })(t3, r3, n2)) throw new Error("expected valid " + e3 + ": " + r3 + " <= n < " + n2 + ", got " + t3);
        }
        const me = (e3) => (ae << BigInt(e3)) - ae;
        function ge(e3, t3, r3 = {}) {
          if (!e3 || "object" != typeof e3) throw new Error("expected valid options object");
          function n2(t4, r4, n3) {
            const o2 = e3[t4];
            if (n3 && void 0 === o2) return;
            const i2 = typeof o2;
            if (i2 !== r4 || null === o2) throw new Error(`param "${t4}" is invalid: expected ${r4}, got ${i2}`);
          }
          Object.entries(t3).forEach(([e4, t4]) => n2(e4, t4, false)), Object.entries(r3).forEach(([e4, t4]) => n2(e4, t4, true));
        }
        const ve = () => {
          throw new Error("not implemented");
        };
        function be(e3) {
          const t3 = /* @__PURE__ */ new WeakMap();
          return (r3, ...n2) => {
            const o2 = t3.get(r3);
            if (void 0 !== o2) return o2;
            const i2 = e3(r3, ...n2);
            return t3.set(r3, i2), i2;
          };
        }
        const we = BigInt(0), Se = BigInt(1), Ee = BigInt(2), ke = BigInt(3), Ae = BigInt(4), Te = BigInt(5), Oe = BigInt(7), xe = BigInt(8), Pe = BigInt(9), Be = BigInt(16);
        function Ie(e3, t3) {
          const r3 = e3 % t3;
          return r3 >= we ? r3 : t3 + r3;
        }
        function Ce(e3, t3, r3) {
          let n2 = e3;
          for (; t3-- > we; ) n2 *= n2, n2 %= r3;
          return n2;
        }
        function Re(e3, t3) {
          if (e3 === we) throw new Error("invert: expected non-zero number");
          if (t3 <= we) throw new Error("invert: expected positive modulus, got " + t3);
          let r3 = Ie(e3, t3), n2 = t3, o2 = we, i2 = Se, a2 = Se, s2 = we;
          for (; r3 !== we; ) {
            const e4 = n2 / r3, t4 = n2 % r3, u2 = o2 - a2 * e4, c2 = i2 - s2 * e4;
            n2 = r3, r3 = t4, o2 = a2, i2 = s2, a2 = u2, s2 = c2;
          }
          if (n2 !== Se) throw new Error("invert: does not exist");
          return Ie(o2, t3);
        }
        function _e(e3, t3, r3) {
          if (!e3.eql(e3.sqr(t3), r3)) throw new Error("Cannot find square root");
        }
        function Ue(e3, t3) {
          const r3 = (e3.ORDER + Se) / Ae, n2 = e3.pow(t3, r3);
          return _e(e3, n2, t3), n2;
        }
        function Ne(e3, t3) {
          const r3 = (e3.ORDER - Te) / xe, n2 = e3.mul(t3, Ee), o2 = e3.pow(n2, r3), i2 = e3.mul(t3, o2), a2 = e3.mul(e3.mul(i2, Ee), o2), s2 = e3.mul(i2, e3.sub(a2, e3.ONE));
          return _e(e3, s2, t3), s2;
        }
        function Le(e3) {
          if (e3 < ke) throw new Error("sqrt is not defined for small field");
          let t3 = e3 - Se, r3 = 0;
          for (; t3 % Ee === we; ) t3 /= Ee, r3++;
          let n2 = Ee;
          const o2 = He(e3);
          for (; 1 === qe(o2, n2); ) if (n2++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
          if (1 === r3) return Ue;
          let i2 = o2.pow(n2, t3);
          const a2 = (t3 + Se) / Ee;
          return function(e4, n3) {
            if (e4.is0(n3)) return n3;
            if (1 !== qe(e4, n3)) throw new Error("Cannot find square root");
            let o3 = r3, s2 = e4.mul(e4.ONE, i2), u2 = e4.pow(n3, t3), c2 = e4.pow(n3, a2);
            for (; !e4.eql(u2, e4.ONE); ) {
              if (e4.is0(u2)) return e4.ZERO;
              let t4 = 1, r4 = e4.sqr(u2);
              for (; !e4.eql(r4, e4.ONE); ) if (t4++, r4 = e4.sqr(r4), t4 === o3) throw new Error("Cannot find square root");
              const n4 = Se << BigInt(o3 - t4 - 1), i3 = e4.pow(s2, n4);
              o3 = t4, s2 = e4.sqr(i3), u2 = e4.mul(u2, s2), c2 = e4.mul(c2, i3);
            }
            return c2;
          };
        }
        function Fe(e3) {
          return e3 % Ae === ke ? Ue : e3 % xe === Te ? Ne : e3 % Be === Pe ? (function(e4) {
            const t3 = He(e4), r3 = Le(e4), n2 = r3(t3, t3.neg(t3.ONE)), o2 = r3(t3, n2), i2 = r3(t3, t3.neg(n2)), a2 = (e4 + Oe) / Be;
            return (e5, t4) => {
              let r4 = e5.pow(t4, a2), s2 = e5.mul(r4, n2);
              const u2 = e5.mul(r4, o2), c2 = e5.mul(r4, i2), l2 = e5.eql(e5.sqr(s2), t4), f2 = e5.eql(e5.sqr(u2), t4);
              r4 = e5.cmov(r4, s2, l2), s2 = e5.cmov(c2, u2, f2);
              const p2 = e5.eql(e5.sqr(s2), t4), d2 = e5.cmov(r4, s2, p2);
              return _e(e5, d2, t4), d2;
            };
          })(e3) : Le(e3);
        }
        const je = (e3, t3) => (Ie(e3, t3) & Se) === Se, Me = ["create", "isValid", "is0", "neg", "inv", "sqrt", "sqr", "eql", "add", "sub", "mul", "pow", "div", "addN", "subN", "mulN", "sqrN"];
        function De(e3, t3, r3) {
          if (r3 < we) throw new Error("invalid exponent, negatives unsupported");
          if (r3 === we) return e3.ONE;
          if (r3 === Se) return t3;
          let n2 = e3.ONE, o2 = t3;
          for (; r3 > we; ) r3 & Se && (n2 = e3.mul(n2, o2)), o2 = e3.sqr(o2), r3 >>= Se;
          return n2;
        }
        function Ve(e3, t3, r3 = false) {
          const n2 = new Array(t3.length).fill(r3 ? e3.ZERO : void 0), o2 = t3.reduce((t4, r4, o3) => e3.is0(r4) ? t4 : (n2[o3] = t4, e3.mul(t4, r4)), e3.ONE), i2 = e3.inv(o2);
          return t3.reduceRight((t4, r4, o3) => e3.is0(r4) ? t4 : (n2[o3] = e3.mul(t4, n2[o3]), e3.mul(t4, r4)), i2), n2;
        }
        function qe(e3, t3) {
          const r3 = (e3.ORDER - Se) / Ee, n2 = e3.pow(t3, r3), o2 = e3.eql(n2, e3.ONE), i2 = e3.eql(n2, e3.ZERO), a2 = e3.eql(n2, e3.neg(e3.ONE));
          if (!o2 && !i2 && !a2) throw new Error("invalid Legendre symbol result");
          return o2 ? 1 : i2 ? 0 : -1;
        }
        function Ke(e3, t3) {
          void 0 !== t3 && f(t3);
          const r3 = void 0 !== t3 ? t3 : e3.toString(2).length;
          return { nBitLength: r3, nByteLength: Math.ceil(r3 / 8) };
        }
        function He(e3, t3, r3 = false, n2 = {}) {
          if (e3 <= we) throw new Error("invalid field: expected ORDER > 0, got " + e3);
          let o2, i2, a2, s2 = false;
          if ("object" == typeof t3 && null != t3) {
            if (n2.sqrt || r3) throw new Error("cannot specify opts in two arguments");
            const e4 = t3;
            e4.BITS && (o2 = e4.BITS), e4.sqrt && (i2 = e4.sqrt), "boolean" == typeof e4.isLE && (r3 = e4.isLE), "boolean" == typeof e4.modFromBytes && (s2 = e4.modFromBytes), a2 = e4.allowedLengths;
          } else "number" == typeof t3 && (o2 = t3), n2.sqrt && (i2 = n2.sqrt);
          const { nBitLength: u2, nByteLength: c2 } = Ke(e3, o2);
          if (c2 > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
          let l2;
          const f2 = Object.freeze({ ORDER: e3, isLE: r3, BITS: u2, BYTES: c2, MASK: me(u2), ZERO: we, ONE: Se, allowedLengths: a2, create: (t4) => Ie(t4, e3), isValid: (t4) => {
            if ("bigint" != typeof t4) throw new Error("invalid field element: expected bigint, got " + typeof t4);
            return we <= t4 && t4 < e3;
          }, is0: (e4) => e4 === we, isValidNot0: (e4) => !f2.is0(e4) && f2.isValid(e4), isOdd: (e4) => (e4 & Se) === Se, neg: (t4) => Ie(-t4, e3), eql: (e4, t4) => e4 === t4, sqr: (t4) => Ie(t4 * t4, e3), add: (t4, r4) => Ie(t4 + r4, e3), sub: (t4, r4) => Ie(t4 - r4, e3), mul: (t4, r4) => Ie(t4 * r4, e3), pow: (e4, t4) => De(f2, e4, t4), div: (t4, r4) => Ie(t4 * Re(r4, e3), e3), sqrN: (e4) => e4 * e4, addN: (e4, t4) => e4 + t4, subN: (e4, t4) => e4 - t4, mulN: (e4, t4) => e4 * t4, inv: (t4) => Re(t4, e3), sqrt: i2 || ((t4) => (l2 || (l2 = Fe(e3)), l2(f2, t4))), toBytes: (e4) => r3 ? fe(e4, c2).reverse() : fe(e4, c2), fromBytes: (t4, n3 = true) => {
            if (a2) {
              if (!a2.includes(t4.length) || t4.length > c2) throw new Error("Field.fromBytes: expected " + a2 + " bytes, got " + t4.length);
              const e4 = new Uint8Array(c2);
              e4.set(t4, r3 ? 0 : e4.length - t4.length), t4 = e4;
            }
            if (t4.length !== c2) throw new Error("Field.fromBytes: expected " + c2 + " bytes, got " + t4.length);
            let o3 = r3 ? le(t4) : (function(e4) {
              return ce(v(e4));
            })(t4);
            if (s2 && (o3 = Ie(o3, e3)), !n3 && !f2.isValid(o3)) throw new Error("invalid field element: outside of range 0..ORDER");
            return o3;
          }, invertBatch: (e4) => Ve(f2, e4), cmov: (e4, t4, r4) => r4 ? t4 : e4 });
          return Object.freeze(f2);
        }
        const ze = BigInt(0), Xe = BigInt(1);
        function $e(e3, t3) {
          const r3 = t3.negate();
          return e3 ? r3 : t3;
        }
        function Ge(e3, t3) {
          const r3 = Ve(e3.Fp, t3.map((e4) => e4.Z));
          return t3.map((t4, n2) => e3.fromAffine(t4.toAffine(r3[n2])));
        }
        function We(e3, t3) {
          if (!Number.isSafeInteger(e3) || e3 <= 0 || e3 > t3) throw new Error("invalid window size, expected [1.." + t3 + "], got W=" + e3);
        }
        function Ye(e3, t3) {
          We(e3, t3);
          const r3 = 2 ** e3;
          return { windows: Math.ceil(t3 / e3) + 1, windowSize: 2 ** (e3 - 1), mask: me(e3), maxNumber: r3, shiftBy: BigInt(e3) };
        }
        function Ze(e3, t3, r3) {
          const { windowSize: n2, mask: o2, maxNumber: i2, shiftBy: a2 } = r3;
          let s2 = Number(e3 & o2), u2 = e3 >> a2;
          s2 > n2 && (s2 -= i2, u2 += Xe);
          const c2 = t3 * n2;
          return { nextN: u2, offset: c2 + Math.abs(s2) - 1, isZero: 0 === s2, isNeg: s2 < 0, isNegF: t3 % 2 != 0, offsetF: c2 };
        }
        function Je(e3, t3) {
          if (!Array.isArray(e3)) throw new Error("array expected");
          e3.forEach((e4, r3) => {
            if (!(e4 instanceof t3)) throw new Error("invalid point at index " + r3);
          });
        }
        function Qe(e3, t3) {
          if (!Array.isArray(e3)) throw new Error("array of scalars expected");
          e3.forEach((e4, r3) => {
            if (!t3.isValid(e4)) throw new Error("invalid scalar at index " + r3);
          });
        }
        const et = /* @__PURE__ */ new WeakMap(), tt = /* @__PURE__ */ new WeakMap();
        function rt(e3) {
          return tt.get(e3) || 1;
        }
        function nt(e3) {
          if (e3 !== ze) throw new Error("invalid wNAF");
        }
        class ot {
          constructor(e3, t3) {
            this.BASE = e3.BASE, this.ZERO = e3.ZERO, this.Fn = e3.Fn, this.bits = t3;
          }
          _unsafeLadder(e3, t3, r3 = this.ZERO) {
            let n2 = e3;
            for (; t3 > ze; ) t3 & Xe && (r3 = r3.add(n2)), n2 = n2.double(), t3 >>= Xe;
            return r3;
          }
          precomputeWindow(e3, t3) {
            const { windows: r3, windowSize: n2 } = Ye(t3, this.bits), o2 = [];
            let i2 = e3, a2 = i2;
            for (let e4 = 0; e4 < r3; e4++) {
              a2 = i2, o2.push(a2);
              for (let e5 = 1; e5 < n2; e5++) a2 = a2.add(i2), o2.push(a2);
              i2 = a2.double();
            }
            return o2;
          }
          wNAF(e3, t3, r3) {
            if (!this.Fn.isValid(r3)) throw new Error("invalid scalar");
            let n2 = this.ZERO, o2 = this.BASE;
            const i2 = Ye(e3, this.bits);
            for (let e4 = 0; e4 < i2.windows; e4++) {
              const { nextN: a2, offset: s2, isZero: u2, isNeg: c2, isNegF: l2, offsetF: f2 } = Ze(r3, e4, i2);
              r3 = a2, u2 ? o2 = o2.add($e(l2, t3[f2])) : n2 = n2.add($e(c2, t3[s2]));
            }
            return nt(r3), { p: n2, f: o2 };
          }
          wNAFUnsafe(e3, t3, r3, n2 = this.ZERO) {
            const o2 = Ye(e3, this.bits);
            for (let e4 = 0; e4 < o2.windows && r3 !== ze; e4++) {
              const { nextN: i2, offset: a2, isZero: s2, isNeg: u2 } = Ze(r3, e4, o2);
              if (r3 = i2, !s2) {
                const e5 = t3[a2];
                n2 = n2.add(u2 ? e5.negate() : e5);
              }
            }
            return nt(r3), n2;
          }
          getPrecomputes(e3, t3, r3) {
            let n2 = et.get(t3);
            return n2 || (n2 = this.precomputeWindow(t3, e3), 1 !== e3 && ("function" == typeof r3 && (n2 = r3(n2)), et.set(t3, n2))), n2;
          }
          cached(e3, t3, r3) {
            const n2 = rt(e3);
            return this.wNAF(n2, this.getPrecomputes(n2, e3, r3), t3);
          }
          unsafe(e3, t3, r3, n2) {
            const o2 = rt(e3);
            return 1 === o2 ? this._unsafeLadder(e3, t3, n2) : this.wNAFUnsafe(o2, this.getPrecomputes(o2, e3, r3), t3, n2);
          }
          createCache(e3, t3) {
            We(t3, this.bits), tt.set(e3, t3), et.delete(e3);
          }
          hasCache(e3) {
            return 1 !== rt(e3);
          }
        }
        function it(e3, t3, r3, n2) {
          Je(r3, e3), Qe(n2, t3);
          const o2 = r3.length, i2 = n2.length;
          if (o2 !== i2) throw new Error("arrays of points and scalars must have equal length");
          const a2 = e3.ZERO, s2 = (function(e4) {
            let t4;
            for (t4 = 0; e4 > ie; e4 >>= ae, t4 += 1) ;
            return t4;
          })(BigInt(o2));
          let u2 = 1;
          s2 > 12 ? u2 = s2 - 3 : s2 > 4 ? u2 = s2 - 2 : s2 > 0 && (u2 = 2);
          const c2 = me(u2), l2 = new Array(Number(c2) + 1).fill(a2);
          let f2 = a2;
          for (let e4 = Math.floor((t3.BITS - 1) / u2) * u2; e4 >= 0; e4 -= u2) {
            l2.fill(a2);
            for (let t5 = 0; t5 < i2; t5++) {
              const o3 = n2[t5], i3 = Number(o3 >> BigInt(e4) & c2);
              l2[i3] = l2[i3].add(r3[t5]);
            }
            let t4 = a2;
            for (let e5 = l2.length - 1, r4 = a2; e5 > 0; e5--) r4 = r4.add(l2[e5]), t4 = t4.add(r4);
            if (f2 = f2.add(t4), 0 !== e4) for (let e5 = 0; e5 < u2; e5++) f2 = f2.double();
          }
          return f2;
        }
        function at(e3, t3, r3) {
          if (t3) {
            if (t3.ORDER !== e3) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
            return (function(e4) {
              ge(e4, Me.reduce((e5, t4) => (e5[t4] = "function", e5), { ORDER: "bigint", MASK: "bigint", BYTES: "number", BITS: "number" }));
            })(t3), t3;
          }
          return He(e3, { isLE: r3 });
        }
        const st = BigInt(0), ut = BigInt(1), ct = BigInt(2), lt = BigInt(8);
        function ft(e3, t3 = {}) {
          const r3 = (function(e4, t4, r4 = {}, n3) {
            if (void 0 === n3 && (n3 = "edwards" === e4), !t4 || "object" != typeof t4) throw new Error(`expected valid ${e4} CURVE object`);
            for (const e5 of ["p", "n", "h"]) {
              const r5 = t4[e5];
              if (!("bigint" == typeof r5 && r5 > ze)) throw new Error(`CURVE.${e5} must be positive bigint`);
            }
            const o3 = at(t4.p, r4.Fp, n3), i3 = at(t4.n, r4.Fn, n3), a3 = ["Gx", "Gy", "a", "weierstrass" === e4 ? "b" : "d"];
            for (const e5 of a3) if (!o3.isValid(t4[e5])) throw new Error(`CURVE.${e5} must be valid field element of CURVE.Fp`);
            return { CURVE: t4 = Object.freeze(Object.assign({}, t4)), Fp: o3, Fn: i3 };
          })("edwards", e3, t3, t3.FpFnLE), { Fp: n2, Fn: o2 } = r3;
          let i2 = r3.CURVE;
          const { h: a2 } = i2;
          ge(t3, {}, { uvRatio: "function" });
          const s2 = ct << BigInt(8 * o2.BYTES) - ut, u2 = (e4) => n2.create(e4), c2 = t3.uvRatio || ((e4, t4) => {
            try {
              return { isValid: true, value: n2.sqrt(n2.div(e4, t4)) };
            } catch (e5) {
              return { isValid: false, value: st };
            }
          });
          if (!(function(e4, t4, r4, n3) {
            const o3 = e4.sqr(r4), i3 = e4.sqr(n3), a3 = e4.add(e4.mul(t4.a, o3), i3), s3 = e4.add(e4.ONE, e4.mul(t4.d, e4.mul(o3, i3)));
            return e4.eql(a3, s3);
          })(n2, i2, i2.Gx, i2.Gy)) throw new Error("bad curve params: generator point");
          function l2(e4, t4, r4 = false) {
            return ye("coordinate " + e4, t4, r4 ? ut : st, s2), t4;
          }
          function f2(e4) {
            if (!(e4 instanceof h2)) throw new Error("ExtendedPoint expected");
          }
          const p2 = be((e4, t4) => {
            const { X: r4, Y: o3, Z: i3 } = e4, a3 = e4.is0();
            null == t4 && (t4 = a3 ? lt : n2.inv(i3));
            const s3 = u2(r4 * t4), c3 = u2(o3 * t4), l3 = n2.mul(i3, t4);
            if (a3) return { x: st, y: ut };
            if (l3 !== ut) throw new Error("invZ was invalid");
            return { x: s3, y: c3 };
          }), d2 = be((e4) => {
            const { a: t4, d: r4 } = i2;
            if (e4.is0()) throw new Error("bad point: ZERO");
            const { X: n3, Y: o3, Z: a3, T: s3 } = e4, c3 = u2(n3 * n3), l3 = u2(o3 * o3), f3 = u2(a3 * a3), p3 = u2(f3 * f3), d3 = u2(c3 * t4);
            if (u2(f3 * u2(d3 + l3)) !== u2(p3 + u2(r4 * u2(c3 * l3)))) throw new Error("bad point: equation left != right (1)");
            if (u2(n3 * o3) !== u2(a3 * s3)) throw new Error("bad point: equation left != right (2)");
            return true;
          });
          class h2 {
            constructor(e4, t4, r4, n3) {
              this.X = l2("x", e4), this.Y = l2("y", t4), this.Z = l2("z", r4, true), this.T = l2("t", n3), Object.freeze(this);
            }
            static CURVE() {
              return i2;
            }
            static fromAffine(e4) {
              if (e4 instanceof h2) throw new Error("extended point not allowed");
              const { x: t4, y: r4 } = e4 || {};
              return l2("x", t4), l2("y", r4), new h2(t4, r4, ut, u2(t4 * r4));
            }
            static fromBytes(e4, t4 = false) {
              const r4 = n2.BYTES, { a: o3, d: a3 } = i2;
              e4 = de(ue(e4, r4, "point")), se(t4, "zip215");
              const l3 = de(e4), f3 = e4[r4 - 1];
              l3[r4 - 1] = -129 & f3;
              const p3 = le(l3), d3 = t4 ? s2 : n2.ORDER;
              ye("point.y", p3, st, d3);
              const y3 = u2(p3 * p3), m2 = u2(y3 - ut), g2 = u2(a3 * y3 - o3);
              let { isValid: v2, value: b2 } = c2(m2, g2);
              if (!v2) throw new Error("bad point: invalid y coordinate");
              const w2 = (b2 & ut) === ut, S2 = !!(128 & f3);
              if (!t4 && b2 === st && S2) throw new Error("bad point: x=0 and x_0=1");
              return S2 !== w2 && (b2 = u2(-b2)), h2.fromAffine({ x: b2, y: p3 });
            }
            static fromHex(e4, t4 = false) {
              return h2.fromBytes(pe("point", e4), t4);
            }
            get x() {
              return this.toAffine().x;
            }
            get y() {
              return this.toAffine().y;
            }
            precompute(e4 = 8, t4 = true) {
              return y2.createCache(this, e4), t4 || this.multiply(ct), this;
            }
            assertValidity() {
              d2(this);
            }
            equals(e4) {
              f2(e4);
              const { X: t4, Y: r4, Z: n3 } = this, { X: o3, Y: i3, Z: a3 } = e4, s3 = u2(t4 * a3), c3 = u2(o3 * n3), l3 = u2(r4 * a3), p3 = u2(i3 * n3);
              return s3 === c3 && l3 === p3;
            }
            is0() {
              return this.equals(h2.ZERO);
            }
            negate() {
              return new h2(u2(-this.X), this.Y, this.Z, u2(-this.T));
            }
            double() {
              const { a: e4 } = i2, { X: t4, Y: r4, Z: n3 } = this, o3 = u2(t4 * t4), a3 = u2(r4 * r4), s3 = u2(ct * u2(n3 * n3)), c3 = u2(e4 * o3), l3 = t4 + r4, f3 = u2(u2(l3 * l3) - o3 - a3), p3 = c3 + a3, d3 = p3 - s3, y3 = c3 - a3, m2 = u2(f3 * d3), g2 = u2(p3 * y3), v2 = u2(f3 * y3), b2 = u2(d3 * p3);
              return new h2(m2, g2, b2, v2);
            }
            add(e4) {
              f2(e4);
              const { a: t4, d: r4 } = i2, { X: n3, Y: o3, Z: a3, T: s3 } = this, { X: c3, Y: l3, Z: p3, T: d3 } = e4, y3 = u2(n3 * c3), m2 = u2(o3 * l3), g2 = u2(s3 * r4 * d3), v2 = u2(a3 * p3), b2 = u2((n3 + o3) * (c3 + l3) - y3 - m2), w2 = v2 - g2, S2 = v2 + g2, E2 = u2(m2 - t4 * y3), k2 = u2(b2 * w2), A2 = u2(S2 * E2), T2 = u2(b2 * E2), O2 = u2(w2 * S2);
              return new h2(k2, A2, O2, T2);
            }
            subtract(e4) {
              return this.add(e4.negate());
            }
            multiply(e4) {
              if (!o2.isValidNot0(e4)) throw new Error("invalid scalar: expected 1 <= sc < curve.n");
              const { p: t4, f: r4 } = y2.cached(this, e4, (e5) => Ge(h2, e5));
              return Ge(h2, [t4, r4])[0];
            }
            multiplyUnsafe(e4, t4 = h2.ZERO) {
              if (!o2.isValid(e4)) throw new Error("invalid scalar: expected 0 <= sc < curve.n");
              return e4 === st ? h2.ZERO : this.is0() || e4 === ut ? this : y2.unsafe(this, e4, (e5) => Ge(h2, e5), t4);
            }
            isSmallOrder() {
              return this.multiplyUnsafe(a2).is0();
            }
            isTorsionFree() {
              return y2.unsafe(this, i2.n).is0();
            }
            toAffine(e4) {
              return p2(this, e4);
            }
            clearCofactor() {
              return a2 === ut ? this : this.multiplyUnsafe(a2);
            }
            toBytes() {
              const { x: e4, y: t4 } = this.toAffine(), r4 = n2.toBytes(t4);
              return r4[r4.length - 1] |= e4 & ut ? 128 : 0, r4;
            }
            toHex() {
              return v(this.toBytes());
            }
            toString() {
              return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
            }
            get ex() {
              return this.X;
            }
            get ey() {
              return this.Y;
            }
            get ez() {
              return this.Z;
            }
            get et() {
              return this.T;
            }
            static normalizeZ(e4) {
              return Ge(h2, e4);
            }
            static msm(e4, t4) {
              return it(h2, o2, e4, t4);
            }
            _setWindowSize(e4) {
              this.precompute(e4);
            }
            toRawBytes() {
              return this.toBytes();
            }
          }
          h2.BASE = new h2(i2.Gx, i2.Gy, ut, u2(i2.Gx * i2.Gy)), h2.ZERO = new h2(st, ut, ut, st), h2.Fp = n2, h2.Fn = o2;
          const y2 = new ot(h2, o2.BITS);
          return h2.BASE.precompute(8), h2;
        }
        class pt {
          constructor(e3) {
            this.ep = e3;
          }
          static fromBytes(e3) {
            ve();
          }
          static fromHex(e3) {
            ve();
          }
          get x() {
            return this.toAffine().x;
          }
          get y() {
            return this.toAffine().y;
          }
          clearCofactor() {
            return this;
          }
          assertValidity() {
            this.ep.assertValidity();
          }
          toAffine(e3) {
            return this.ep.toAffine(e3);
          }
          toHex() {
            return v(this.toBytes());
          }
          toString() {
            return this.toHex();
          }
          isTorsionFree() {
            return true;
          }
          isSmallOrder() {
            return false;
          }
          add(e3) {
            return this.assertSame(e3), this.init(this.ep.add(e3.ep));
          }
          subtract(e3) {
            return this.assertSame(e3), this.init(this.ep.subtract(e3.ep));
          }
          multiply(e3) {
            return this.init(this.ep.multiply(e3));
          }
          multiplyUnsafe(e3) {
            return this.init(this.ep.multiplyUnsafe(e3));
          }
          double() {
            return this.init(this.ep.double());
          }
          negate() {
            return this.init(this.ep.negate());
          }
          precompute(e3, t3) {
            return this.init(this.ep.precompute(e3, t3));
          }
          toRawBytes() {
            return this.toBytes();
          }
        }
        function dt(e3, t3, r3 = {}) {
          if ("function" != typeof t3) throw new Error('"hash" function param is required');
          ge(r3, {}, { adjustScalarBytes: "function", randomBytes: "function", domain: "function", prehash: "function", mapToCurve: "function" });
          const { prehash: n2 } = r3, { BASE: o2, Fp: i2, Fn: a2 } = e3, s2 = r3.randomBytes || R, u2 = r3.adjustScalarBytes || ((e4) => e4), c2 = r3.domain || ((e4, t4, r4) => {
            if (se(r4, "phflag"), t4.length || r4) throw new Error("Contexts/pre-hash are not supported");
            return e4;
          });
          function f2(e4) {
            return a2.create(le(e4));
          }
          function p2(e4) {
            const { head: r4, prefix: n3, scalar: i3 } = (function(e5) {
              const r5 = g2.secretKey;
              e5 = pe("private key", e5, r5);
              const n4 = pe("hashed private key", t3(e5), 2 * r5), o3 = u2(n4.slice(0, r5));
              return { head: o3, prefix: n4.slice(r5, 2 * r5), scalar: f2(o3) };
            })(e4), a3 = o2.multiply(i3), s3 = a3.toBytes();
            return { head: r4, prefix: n3, scalar: i3, point: a3, pointBytes: s3 };
          }
          function d2(e4) {
            return p2(e4).pointBytes;
          }
          function h2(e4 = Uint8Array.of(), ...r4) {
            const o3 = B(...r4);
            return f2(t3(c2(o3, pe("context", e4), !!n2)));
          }
          const y2 = { zip215: true };
          const m2 = i2.BYTES, g2 = { secretKey: m2, publicKey: m2, signature: 2 * m2, seed: m2 };
          function v2(e4 = s2(g2.seed)) {
            return ue(e4, g2.seed, "seed");
          }
          const b2 = { getExtendedPublicKey: p2, randomSecretKey: v2, isValidSecretKey: function(e4) {
            return l(e4) && e4.length === a2.BYTES;
          }, isValidPublicKey: function(t4, r4) {
            try {
              return !!e3.fromBytes(t4, r4);
            } catch (e4) {
              return false;
            }
          }, toMontgomery(t4) {
            const { y: r4 } = e3.fromBytes(t4), n3 = g2.publicKey, o3 = 32 === n3;
            if (!o3 && 57 !== n3) throw new Error("only defined for 25519 and 448");
            const a3 = o3 ? i2.div(ut + r4, ut - r4) : i2.div(r4 - ut, r4 + ut);
            return i2.toBytes(a3);
          }, toMontgomeryPriv(e4) {
            const r4 = g2.secretKey;
            ue(e4, r4);
            const n3 = t3(e4.subarray(0, r4));
            return u2(n3).subarray(0, r4);
          }, randomPrivateKey: v2, precompute: (t4 = 8, r4 = e3.BASE) => r4.precompute(t4, false) };
          return Object.freeze({ keygen: function(e4) {
            const t4 = b2.randomSecretKey(e4);
            return { secretKey: t4, publicKey: d2(t4) };
          }, getPublicKey: d2, sign: function(e4, t4, r4 = {}) {
            e4 = pe("message", e4), n2 && (e4 = n2(e4));
            const { prefix: i3, scalar: s3, pointBytes: u3 } = p2(t4), c3 = h2(r4.context, i3, e4), l2 = o2.multiply(c3).toBytes(), f3 = h2(r4.context, l2, u3, e4), d3 = a2.create(c3 + f3 * s3);
            if (!a2.isValid(d3)) throw new Error("sign failed: invalid s");
            return ue(B(l2, a2.toBytes(d3)), g2.signature, "result");
          }, verify: function(t4, r4, i3, a3 = y2) {
            const { context: s3, zip215: u3 } = a3, c3 = g2.signature;
            t4 = pe("signature", t4, c3), r4 = pe("message", r4), i3 = pe("publicKey", i3, g2.publicKey), void 0 !== u3 && se(u3, "zip215"), n2 && (r4 = n2(r4));
            const l2 = c3 / 2, f3 = t4.subarray(0, l2), p3 = le(t4.subarray(l2, c3));
            let d3, m3, v3;
            try {
              d3 = e3.fromBytes(i3, u3), m3 = e3.fromBytes(f3, u3), v3 = o2.multiplyUnsafe(p3);
            } catch (e4) {
              return false;
            }
            if (!u3 && d3.isSmallOrder()) return false;
            const b3 = h2(s3, m3.toBytes(), d3.toBytes(), r4);
            return m3.add(d3.multiplyUnsafe(b3)).subtract(v3).clearCofactor().is0();
          }, utils: b2, Point: e3, lengths: g2 });
        }
        function ht(e3) {
          const { CURVE: t3, curveOpts: r3, hash: n2, eddsaOpts: o2 } = (function(e4) {
            const t4 = { a: e4.a, d: e4.d, p: e4.Fp.ORDER, n: e4.n, h: e4.h, Gx: e4.Gx, Gy: e4.Gy }, r4 = { Fp: e4.Fp, Fn: He(t4.n, e4.nBitLength, true), uvRatio: e4.uvRatio }, n3 = { randomBytes: e4.randomBytes, adjustScalarBytes: e4.adjustScalarBytes, domain: e4.domain, prehash: e4.prehash, mapToCurve: e4.mapToCurve };
            return { CURVE: t4, curveOpts: r4, hash: e4.hash, eddsaOpts: n3 };
          })(e3);
          return (function(e4, t4) {
            const r4 = t4.Point;
            return Object.assign({}, t4, { ExtendedPoint: r4, CURVE: e4, nBitLength: r4.Fn.BITS, nByteLength: r4.Fn.BYTES });
          })(e3, dt(ft(t3, r3), n2, o2));
        }
        x("HashToScalar-");
        const yt = BigInt(0), mt = BigInt(1), gt = BigInt(2), vt = (BigInt(3), BigInt(5)), bt = BigInt(8), wt = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed"), St = (() => ({ p: wt, n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"), h: bt, a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"), d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"), Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"), Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658") }))();
        function Et(e3) {
          const t3 = BigInt(10), r3 = BigInt(20), n2 = BigInt(40), o2 = BigInt(80), i2 = wt, a2 = e3 * e3 % i2 * e3 % i2, s2 = Ce(a2, gt, i2) * a2 % i2, u2 = Ce(s2, mt, i2) * e3 % i2, c2 = Ce(u2, vt, i2) * u2 % i2, l2 = Ce(c2, t3, i2) * c2 % i2, f2 = Ce(l2, r3, i2) * l2 % i2, p2 = Ce(f2, n2, i2) * f2 % i2, d2 = Ce(p2, o2, i2) * p2 % i2, h2 = Ce(d2, o2, i2) * p2 % i2, y2 = Ce(h2, t3, i2) * c2 % i2;
          return { pow_p_5_8: Ce(y2, gt, i2) * e3 % i2, b2: a2 };
        }
        function kt(e3) {
          return e3[0] &= 248, e3[31] &= 127, e3[31] |= 64, e3;
        }
        const At = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
        function Tt(e3, t3) {
          const r3 = wt, n2 = Ie(t3 * t3 * t3, r3), o2 = Ie(n2 * n2 * t3, r3);
          let i2 = Ie(e3 * n2 * Et(e3 * o2).pow_p_5_8, r3);
          const a2 = Ie(t3 * i2 * i2, r3), s2 = i2, u2 = Ie(i2 * At, r3), c2 = a2 === e3, l2 = a2 === Ie(-e3, r3), f2 = a2 === Ie(-e3 * At, r3);
          return c2 && (i2 = s2), (l2 || f2) && (i2 = u2), je(i2, r3) && (i2 = Ie(-i2, r3)), { isValid: c2 || l2, value: i2 };
        }
        const Ot = (() => He(St.p, { isLE: true }))(), xt = (() => He(St.n, { isLE: true }))(), Pt = (() => ({ ...St, Fp: Ot, hash: oe, adjustScalarBytes: kt, uvRatio: Tt }))(), Bt = (() => ht(Pt))();
        const It = At, Ct = BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235"), Rt = BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578"), _t = BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838"), Ut = BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952"), Nt = (e3) => Tt(mt, e3), Lt = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), Ft = (e3) => Bt.Point.Fp.create(le(e3) & Lt);
        function jt(e3) {
          const { d: t3 } = St, r3 = wt, n2 = (e4) => Ot.create(e4), o2 = n2(It * e3 * e3), i2 = n2((o2 + mt) * _t);
          let a2 = BigInt(-1);
          const s2 = n2((a2 - t3 * o2) * n2(o2 + t3));
          let { isValid: u2, value: c2 } = Tt(i2, s2), l2 = n2(c2 * e3);
          je(l2, r3) || (l2 = n2(-l2)), u2 || (c2 = l2), u2 || (a2 = o2);
          const f2 = n2(a2 * (o2 - mt) * Ut - s2), p2 = c2 * c2, d2 = n2((c2 + c2) * s2), h2 = n2(f2 * Ct), y2 = n2(mt - p2), m2 = n2(mt + p2);
          return new Bt.Point(n2(d2 * m2), n2(y2 * h2), n2(h2 * m2), n2(d2 * y2));
        }
        function Mt(e3) {
          p(e3, 64);
          const t3 = jt(Ft(e3.subarray(0, 32))), r3 = jt(Ft(e3.subarray(32, 64)));
          return new Dt(t3.add(r3));
        }
        class Dt extends pt {
          constructor(e3) {
            super(e3);
          }
          static fromAffine(e3) {
            return new Dt(Bt.Point.fromAffine(e3));
          }
          assertSame(e3) {
            if (!(e3 instanceof Dt)) throw new Error("RistrettoPoint expected");
          }
          init(e3) {
            return new Dt(e3);
          }
          static hashToCurve(e3) {
            return Mt(pe("ristrettoHash", e3, 64));
          }
          static fromBytes(e3) {
            p(e3, 32);
            const { a: t3, d: r3 } = St, n2 = wt, o2 = (e4) => Ot.create(e4), i2 = Ft(e3);
            if (!(function(e4, t4) {
              if (e4.length !== t4.length) return false;
              let r4 = 0;
              for (let n3 = 0; n3 < e4.length; n3++) r4 |= e4[n3] ^ t4[n3];
              return 0 === r4;
            })(Ot.toBytes(i2), e3) || je(i2, n2)) throw new Error("invalid ristretto255 encoding 1");
            const a2 = o2(i2 * i2), s2 = o2(mt + t3 * a2), u2 = o2(mt - t3 * a2), c2 = o2(s2 * s2), l2 = o2(u2 * u2), f2 = o2(t3 * r3 * c2 - l2), { isValid: d2, value: h2 } = Nt(o2(f2 * l2)), y2 = o2(h2 * u2), m2 = o2(h2 * y2 * f2);
            let g2 = o2((i2 + i2) * y2);
            je(g2, n2) && (g2 = o2(-g2));
            const v2 = o2(s2 * m2), b2 = o2(g2 * v2);
            if (!d2 || je(b2, n2) || v2 === yt) throw new Error("invalid ristretto255 encoding 2");
            return new Dt(new Bt.Point(g2, v2, mt, b2));
          }
          static fromHex(e3) {
            return Dt.fromBytes(pe("ristrettoHex", e3, 32));
          }
          static msm(e3, t3) {
            return it(Dt, Bt.Point.Fn, e3, t3);
          }
          toBytes() {
            let { X: e3, Y: t3, Z: r3, T: n2 } = this.ep;
            const o2 = wt, i2 = (e4) => Ot.create(e4), a2 = i2(i2(r3 + t3) * i2(r3 - t3)), s2 = i2(e3 * t3), u2 = i2(s2 * s2), { value: c2 } = Nt(i2(a2 * u2)), l2 = i2(c2 * a2), f2 = i2(c2 * s2), p2 = i2(l2 * f2 * n2);
            let d2;
            if (je(n2 * p2, o2)) {
              let r4 = i2(t3 * It), n3 = i2(e3 * It);
              e3 = r4, t3 = n3, d2 = i2(l2 * Rt);
            } else d2 = f2;
            je(e3 * p2, o2) && (t3 = i2(-t3));
            let h2 = i2((r3 - t3) * d2);
            return je(h2, o2) && (h2 = i2(-h2)), Ot.toBytes(h2);
          }
          equals(e3) {
            this.assertSame(e3);
            const { X: t3, Y: r3 } = this.ep, { X: n2, Y: o2 } = e3.ep, i2 = (e4) => Ot.create(e4), a2 = i2(t3 * o2) === i2(r3 * n2), s2 = i2(r3 * o2) === i2(t3 * n2);
            return a2 || s2;
          }
          is0() {
            return this.equals(Dt.ZERO);
          }
        }
        Dt.BASE = (() => new Dt(Bt.Point.BASE))(), Dt.ZERO = (() => new Dt(Bt.Point.ZERO))(), Dt.Fp = /* @__PURE__ */ (() => Ot)(), Dt.Fn = /* @__PURE__ */ (() => xt)();
        var Vt = r2(8287).Buffer;
        function qt(e3, t3) {
          return Vt.from(Bt.sign(Vt.from(e3), t3));
        }
        function Kt(e3, t3, r3) {
          return Bt.verify(Vt.from(t3), Vt.from(e3), Vt.from(r3), { zip215: false });
        }
        var Ht = function(e3, t3) {
          for (var r3 = "number" == typeof e3, n2 = String(e3); n2.endsWith(t3); ) n2 = n2.slice(0, -1);
          return r3 ? Number(n2) : n2;
        }, zt = r2(5360);
        var Xt = r2(8287).Buffer;
        function $t(e3) {
          return $t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, $t(e3);
        }
        function Gt(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, Wt(n2.key), n2);
          }
        }
        function Wt(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != $t(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != $t(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == $t(t3) ? t3 : t3 + "";
        }
        var Yt, Zt, Jt, Qt = { ed25519PublicKey: 48, ed25519SecretSeed: 144, med25519PublicKey: 96, preAuthTx: 152, sha256Hash: 184, signedPayload: 120, contract: 16, liquidityPool: 88, claimableBalance: 8 }, er = { G: "ed25519PublicKey", S: "ed25519SecretSeed", M: "med25519PublicKey", T: "preAuthTx", X: "sha256Hash", P: "signedPayload", C: "contract", L: "liquidityPool", B: "claimableBalance" }, tr = (function() {
          return e3 = function e4() {
            !(function(e5, t4) {
              if (!(e5 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e4);
          }, r3 = [{ key: "encodeEd25519PublicKey", value: function(e4) {
            return or("ed25519PublicKey", e4);
          } }, { key: "decodeEd25519PublicKey", value: function(e4) {
            return nr("ed25519PublicKey", e4);
          } }, { key: "isValidEd25519PublicKey", value: function(e4) {
            return rr("ed25519PublicKey", e4);
          } }, { key: "encodeEd25519SecretSeed", value: function(e4) {
            return or("ed25519SecretSeed", e4);
          } }, { key: "decodeEd25519SecretSeed", value: function(e4) {
            return nr("ed25519SecretSeed", e4);
          } }, { key: "isValidEd25519SecretSeed", value: function(e4) {
            return rr("ed25519SecretSeed", e4);
          } }, { key: "encodeMed25519PublicKey", value: function(e4) {
            return or("med25519PublicKey", e4);
          } }, { key: "decodeMed25519PublicKey", value: function(e4) {
            return nr("med25519PublicKey", e4);
          } }, { key: "isValidMed25519PublicKey", value: function(e4) {
            return rr("med25519PublicKey", e4);
          } }, { key: "encodePreAuthTx", value: function(e4) {
            return or("preAuthTx", e4);
          } }, { key: "decodePreAuthTx", value: function(e4) {
            return nr("preAuthTx", e4);
          } }, { key: "encodeSha256Hash", value: function(e4) {
            return or("sha256Hash", e4);
          } }, { key: "decodeSha256Hash", value: function(e4) {
            return nr("sha256Hash", e4);
          } }, { key: "encodeSignedPayload", value: function(e4) {
            return or("signedPayload", e4);
          } }, { key: "decodeSignedPayload", value: function(e4) {
            return nr("signedPayload", e4);
          } }, { key: "isValidSignedPayload", value: function(e4) {
            return rr("signedPayload", e4);
          } }, { key: "encodeContract", value: function(e4) {
            return or("contract", e4);
          } }, { key: "decodeContract", value: function(e4) {
            return nr("contract", e4);
          } }, { key: "isValidContract", value: function(e4) {
            return rr("contract", e4);
          } }, { key: "encodeClaimableBalance", value: function(e4) {
            return or("claimableBalance", e4);
          } }, { key: "decodeClaimableBalance", value: function(e4) {
            return nr("claimableBalance", e4);
          } }, { key: "isValidClaimableBalance", value: function(e4) {
            return rr("claimableBalance", e4);
          } }, { key: "encodeLiquidityPool", value: function(e4) {
            return or("liquidityPool", e4);
          } }, { key: "decodeLiquidityPool", value: function(e4) {
            return nr("liquidityPool", e4);
          } }, { key: "isValidLiquidityPool", value: function(e4) {
            return rr("liquidityPool", e4);
          } }, { key: "getVersionByteForPrefix", value: function(e4) {
            return er[e4[0]];
          } }], (t3 = null) && Gt(e3.prototype, t3), r3 && Gt(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          var e3, t3, r3;
        })();
        function rr(e3, t3) {
          if ("string" != typeof t3) return false;
          switch (e3) {
            case "ed25519PublicKey":
            case "ed25519SecretSeed":
            case "preAuthTx":
            case "sha256Hash":
            case "contract":
            case "liquidityPool":
              if (56 !== t3.length) return false;
              break;
            case "claimableBalance":
              if (58 !== t3.length) return false;
              break;
            case "med25519PublicKey":
              if (69 !== t3.length) return false;
              break;
            case "signedPayload":
              if (t3.length < 56 || t3.length > 165) return false;
              break;
            default:
              return false;
          }
          var r3 = "";
          try {
            r3 = nr(e3, t3);
          } catch (e4) {
            return false;
          }
          switch (e3) {
            case "ed25519PublicKey":
            case "ed25519SecretSeed":
            case "preAuthTx":
            case "sha256Hash":
            case "contract":
            case "liquidityPool":
              return 32 === r3.length;
            case "claimableBalance":
              return 33 === r3.length;
            case "med25519PublicKey":
              return 40 === r3.length;
            case "signedPayload":
              return r3.length >= 40 && r3.length <= 100;
            default:
              return false;
          }
        }
        function nr(e3, t3) {
          if ("string" != typeof t3) throw new TypeError("encoded argument must be of type String");
          var r3 = zt.decode(t3), n2 = r3[0], o2 = r3.slice(0, -2), i2 = o2.slice(1), a2 = r3.slice(-2);
          if (t3 !== zt.encode(r3)) throw new Error("invalid encoded string");
          var s2 = Qt[e3];
          if (void 0 === s2) throw new Error("".concat(e3, " is not a valid version byte name. ") + "Expected one of ".concat(Object.keys(Qt).join(", ")));
          if (n2 !== s2) throw new Error("invalid version byte. expected ".concat(s2, ", got ").concat(n2));
          if (!(function(e4, t4) {
            if (e4.length !== t4.length) return false;
            if (0 === e4.length) return true;
            for (var r4 = 0; r4 < e4.length; r4 += 1) if (e4[r4] !== t4[r4]) return false;
            return true;
          })(ir(o2), a2)) throw new Error("invalid checksum");
          return Xt.from(i2);
        }
        function or(e3, t3) {
          if (null == t3) throw new Error("cannot encode null data");
          var r3 = Qt[e3];
          if (void 0 === r3) throw new Error("".concat(e3, " is not a valid version byte name. ") + "Expected one of ".concat(Object.keys(Qt).join(", ")));
          t3 = Xt.from(t3);
          var n2 = Xt.from([r3]), o2 = Xt.concat([n2, t3]), i2 = Xt.from(ir(o2)), a2 = Xt.concat([o2, i2]);
          return zt.encode(a2);
        }
        function ir(e3) {
          for (var t3 = [0, 4129, 8258, 12387, 16516, 20645, 24774, 28903, 33032, 37161, 41290, 45419, 49548, 53677, 57806, 61935, 4657, 528, 12915, 8786, 21173, 17044, 29431, 25302, 37689, 33560, 45947, 41818, 54205, 50076, 62463, 58334, 9314, 13379, 1056, 5121, 25830, 29895, 17572, 21637, 42346, 46411, 34088, 38153, 58862, 62927, 50604, 54669, 13907, 9842, 5649, 1584, 30423, 26358, 22165, 18100, 46939, 42874, 38681, 34616, 63455, 59390, 55197, 51132, 18628, 22757, 26758, 30887, 2112, 6241, 10242, 14371, 51660, 55789, 59790, 63919, 35144, 39273, 43274, 47403, 23285, 19156, 31415, 27286, 6769, 2640, 14899, 10770, 56317, 52188, 64447, 60318, 39801, 35672, 47931, 43802, 27814, 31879, 19684, 23749, 11298, 15363, 3168, 7233, 60846, 64911, 52716, 56781, 44330, 48395, 36200, 40265, 32407, 28342, 24277, 20212, 15891, 11826, 7761, 3696, 65439, 61374, 57309, 53244, 48923, 44858, 40793, 36728, 37256, 33193, 45514, 41451, 53516, 49453, 61774, 57711, 4224, 161, 12482, 8419, 20484, 16421, 28742, 24679, 33721, 37784, 41979, 46042, 49981, 54044, 58239, 62302, 689, 4752, 8947, 13010, 16949, 21012, 25207, 29270, 46570, 42443, 38312, 34185, 62830, 58703, 54572, 50445, 13538, 9411, 5280, 1153, 29798, 25671, 21540, 17413, 42971, 47098, 34713, 38840, 59231, 63358, 50973, 55100, 9939, 14066, 1681, 5808, 26199, 30326, 17941, 22068, 55628, 51565, 63758, 59695, 39368, 35305, 47498, 43435, 22596, 18533, 30726, 26663, 6336, 2273, 14466, 10403, 52093, 56156, 60223, 64286, 35833, 39896, 43963, 48026, 19061, 23124, 27191, 31254, 2801, 6864, 10931, 14994, 64814, 60687, 56684, 52557, 48554, 44427, 40424, 36297, 31782, 27655, 23652, 19525, 15522, 11395, 7392, 3265, 61215, 65342, 53085, 57212, 44955, 49082, 36825, 40952, 28183, 32310, 20053, 24180, 11923, 16050, 3793, 7920], r3 = 0, n2 = 0; n2 < e3.length; n2 += 1) {
            r3 = r3 << 8 ^ t3[r3 >> 8 ^ e3[n2]], r3 &= 65535;
          }
          var o2 = new Uint8Array(2);
          return o2[0] = 255 & r3, o2[1] = r3 >> 8 & 255, o2;
        }
        Yt = tr, Jt = er, (Zt = Wt(Zt = "types")) in Yt ? Object.defineProperty(Yt, Zt, { value: Jt, enumerable: true, configurable: true, writable: true }) : Yt[Zt] = Jt;
        var ar = r2(8287).Buffer;
        function sr(e3) {
          return sr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, sr(e3);
        }
        function ur(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, cr(n2.key), n2);
          }
        }
        function cr(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != sr(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != sr(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == sr(t3) ? t3 : t3 + "";
        }
        var lr = (function() {
          return (function(e3, t3, r3) {
            return t3 && ur(e3.prototype, t3), r3 && ur(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          })(function e3(t3) {
            if ((function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3), "ed25519" !== t3.type) throw new Error("Invalid keys type");
            if (this.type = t3.type, t3.secretKey) {
              if (t3.secretKey = ar.from(t3.secretKey), 32 !== t3.secretKey.length) throw new Error("secretKey length is invalid");
              if (this._secretSeed = t3.secretKey, this._publicKey = (r3 = t3.secretKey, Vt.from(Bt.getPublicKey(r3))), this._secretKey = t3.secretKey, t3.publicKey && !this._publicKey.equals(ar.from(t3.publicKey))) throw new Error("secretKey does not match publicKey");
            } else if (this._publicKey = ar.from(t3.publicKey), 32 !== this._publicKey.length) throw new Error("publicKey length is invalid");
            var r3;
          }, [{ key: "xdrAccountId", value: function() {
            return new i.AccountId.publicKeyTypeEd25519(this._publicKey);
          } }, { key: "xdrPublicKey", value: function() {
            return new i.PublicKey.publicKeyTypeEd25519(this._publicKey);
          } }, { key: "xdrMuxedAccount", value: function(e3) {
            if (void 0 !== e3) {
              if ("string" != typeof e3) throw new TypeError("expected string for ID, got ".concat(sr(e3)));
              return i.MuxedAccount.keyTypeMuxedEd25519(new i.MuxedAccountMed25519({ id: i.Uint64.fromString(e3), ed25519: this._publicKey }));
            }
            return new i.MuxedAccount.keyTypeEd25519(this._publicKey);
          } }, { key: "rawPublicKey", value: function() {
            return this._publicKey;
          } }, { key: "signatureHint", value: function() {
            var e3 = this.xdrAccountId().toXDR();
            return e3.slice(e3.length - 4);
          } }, { key: "publicKey", value: function() {
            return tr.encodeEd25519PublicKey(this._publicKey);
          } }, { key: "secret", value: function() {
            if (!this._secretSeed) throw new Error("no secret key available");
            if ("ed25519" === this.type) return tr.encodeEd25519SecretSeed(this._secretSeed);
            throw new Error("Invalid Keypair type");
          } }, { key: "rawSecretKey", value: function() {
            return this._secretSeed;
          } }, { key: "canSign", value: function() {
            return !!this._secretKey;
          } }, { key: "sign", value: function(e3) {
            if (!this.canSign()) throw new Error("cannot sign: no secret key available");
            return qt(e3, this._secretKey);
          } }, { key: "verify", value: function(e3, t3) {
            return Kt(e3, t3, this._publicKey);
          } }, { key: "signDecorated", value: function(e3) {
            var t3 = this.sign(e3), r3 = this.signatureHint();
            return new i.DecoratedSignature({ hint: r3, signature: t3 });
          } }, { key: "signPayloadDecorated", value: function(e3) {
            var t3 = this.sign(e3), r3 = this.signatureHint(), n2 = ar.from(e3.slice(-4));
            return n2.length < 4 && (n2 = ar.concat([n2, ar.alloc(4 - e3.length, 0)])), new i.DecoratedSignature({ hint: n2.map(function(e4, t4) {
              return e4 ^ r3[t4];
            }), signature: t3 });
          } }], [{ key: "fromSecret", value: function(e3) {
            var t3 = tr.decodeEd25519SecretSeed(e3);
            return this.fromRawEd25519Seed(t3);
          } }, { key: "fromRawEd25519Seed", value: function(e3) {
            return new this({ type: "ed25519", secretKey: e3 });
          } }, { key: "master", value: function(e3) {
            if (!e3) throw new Error("No network selected. Please pass a network argument, e.g. `Keypair.master(Networks.PUBLIC)`.");
            return this.fromRawEd25519Seed(u(e3));
          } }, { key: "fromPublicKey", value: function(e3) {
            if (32 !== (e3 = tr.decodeEd25519PublicKey(e3)).length) throw new Error("Invalid Stellar public key");
            return new this({ type: "ed25519", publicKey: e3 });
          } }, { key: "random", value: function() {
            var e3 = Bt.utils.randomPrivateKey();
            return this.fromRawEd25519Seed(e3);
          } }]);
        })(), fr = r2(8287).Buffer;
        function pr(e3) {
          return pr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, pr(e3);
        }
        function dr(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, hr(n2.key), n2);
          }
        }
        function hr(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != pr(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != pr(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == pr(t3) ? t3 : t3 + "";
        }
        var yr = (function() {
          function e3(t3, r3) {
            if ((function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3), !/^[a-zA-Z0-9]{1,12}$/.test(t3)) throw new Error("Asset code is invalid (maximum alphanumeric, 12 characters at max)");
            if ("xlm" !== String(t3).toLowerCase() && !r3) throw new Error("Issuer cannot be null");
            if (r3 && !tr.isValidEd25519PublicKey(r3)) throw new Error("Issuer is invalid");
            "xlm" === String(t3).toLowerCase() ? this.code = "XLM" : this.code = t3, this.issuer = r3;
          }
          return (function(e4, t3, r3) {
            return t3 && dr(e4.prototype, t3), r3 && dr(e4, r3), Object.defineProperty(e4, "prototype", { writable: false }), e4;
          })(e3, [{ key: "toXDRObject", value: function() {
            return this._toXDRObject(i.Asset);
          } }, { key: "toChangeTrustXDRObject", value: function() {
            return this._toXDRObject(i.ChangeTrustAsset);
          } }, { key: "toTrustLineXDRObject", value: function() {
            return this._toXDRObject(i.TrustLineAsset);
          } }, { key: "contractId", value: function(e4) {
            var t3 = u(fr.from(e4)), r3 = i.HashIdPreimage.envelopeTypeContractId(new i.HashIdPreimageContractId({ networkId: t3, contractIdPreimage: i.ContractIdPreimage.contractIdPreimageFromAsset(this.toXDRObject()) }));
            return tr.encodeContract(u(r3.toXDR()));
          } }, { key: "_toXDRObject", value: function() {
            var e4, t3, r3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : i.Asset;
            if (this.isNative()) return r3.assetTypeNative();
            this.code.length <= 4 ? (e4 = i.AlphaNum4, t3 = "assetTypeCreditAlphanum4") : (e4 = i.AlphaNum12, t3 = "assetTypeCreditAlphanum12");
            var n2 = this.code.length <= 4 ? 4 : 12;
            return new r3(t3, new e4({ assetCode: this.code.padEnd(n2, "\0"), issuer: lr.fromPublicKey(this.issuer).xdrAccountId() }));
          } }, { key: "getCode", value: function() {
            if (void 0 !== this.code) return String(this.code);
          } }, { key: "getIssuer", value: function() {
            if (void 0 !== this.issuer) return String(this.issuer);
          } }, { key: "getAssetType", value: function() {
            switch (this.getRawAssetType().value) {
              case i.AssetType.assetTypeNative().value:
                return "native";
              case i.AssetType.assetTypeCreditAlphanum4().value:
                return "credit_alphanum4";
              case i.AssetType.assetTypeCreditAlphanum12().value:
                return "credit_alphanum12";
              default:
                return "unknown";
            }
          } }, { key: "getRawAssetType", value: function() {
            return this.isNative() ? i.AssetType.assetTypeNative() : this.code.length <= 4 ? i.AssetType.assetTypeCreditAlphanum4() : i.AssetType.assetTypeCreditAlphanum12();
          } }, { key: "isNative", value: function() {
            return !this.issuer;
          } }, { key: "equals", value: function(e4) {
            return this.code === e4.getCode() && this.issuer === e4.getIssuer();
          } }, { key: "toString", value: function() {
            return this.isNative() ? "native" : "".concat(this.getCode(), ":").concat(this.getIssuer());
          } }], [{ key: "native", value: function() {
            return new e3("XLM");
          } }, { key: "fromOperation", value: function(e4) {
            var t3, r3;
            switch (e4.switch()) {
              case i.AssetType.assetTypeNative():
                return this.native();
              case i.AssetType.assetTypeCreditAlphanum4():
                t3 = e4.alphaNum4();
              case i.AssetType.assetTypeCreditAlphanum12():
                return t3 = t3 || e4.alphaNum12(), r3 = tr.encodeEd25519PublicKey(t3.issuer().ed25519()), new this(Ht(t3.assetCode(), "\0"), r3);
              default:
                throw new Error("Invalid asset type: ".concat(e4.switch().name));
            }
          } }, { key: "compare", value: function(t3, r3) {
            if (!(t3 && t3 instanceof e3)) throw new Error("assetA is invalid");
            if (!(r3 && r3 instanceof e3)) throw new Error("assetB is invalid");
            if (t3.equals(r3)) return 0;
            var n2 = t3.getRawAssetType().value, o2 = r3.getRawAssetType().value;
            if (n2 !== o2) return n2 < o2 ? -1 : 1;
            var i2 = mr(t3.getCode(), r3.getCode());
            return 0 !== i2 ? i2 : mr(t3.getIssuer(), r3.getIssuer());
          } }]);
        })();
        function mr(e3, t3) {
          return fr.compare(fr.from(e3, "ascii"), fr.from(t3, "ascii"));
        }
        var gr = r2(8287).Buffer, vr = 30;
        function br(e3) {
          var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          if ("constant_product" !== e3) throw new Error("liquidityPoolType is invalid");
          var r3 = t3.assetA, n2 = t3.assetB, o2 = t3.fee;
          if (!(r3 && r3 instanceof yr)) throw new Error("assetA is invalid");
          if (!(n2 && n2 instanceof yr)) throw new Error("assetB is invalid");
          if (!o2 || o2 !== vr) throw new Error("fee is invalid");
          if (-1 !== yr.compare(r3, n2)) throw new Error("Assets are not in lexicographic order");
          var a2 = i.LiquidityPoolType.liquidityPoolConstantProduct().toXDR(), s2 = new i.LiquidityPoolConstantProductParameters({ assetA: r3.toXDRObject(), assetB: n2.toXDRObject(), fee: o2 }).toXDR();
          return u(gr.concat([a2, s2]));
        }
        var wr = r2(8287).Buffer;
        function Sr(e3) {
          return Sr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, Sr(e3);
        }
        function Er(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, kr(n2.key), n2);
          }
        }
        function kr(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != Sr(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != Sr(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == Sr(t3) ? t3 : t3 + "";
        }
        var Ar = (function() {
          return (function(e3, t3, r3) {
            return t3 && Er(e3.prototype, t3), r3 && Er(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          })(function e3(t3, r3, n2, o2) {
            if ((function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3), "string" != typeof o2) throw new Error("Invalid passphrase provided to Transaction: expected a string but got a ".concat(Sr(o2)));
            this._networkPassphrase = o2, this._tx = t3, this._signatures = r3, this._fee = n2;
          }, [{ key: "signatures", get: function() {
            return this._signatures;
          }, set: function(e3) {
            throw new Error("Transaction is immutable");
          } }, { key: "tx", get: function() {
            return this._tx;
          }, set: function(e3) {
            throw new Error("Transaction is immutable");
          } }, { key: "fee", get: function() {
            return this._fee;
          }, set: function(e3) {
            throw new Error("Transaction is immutable");
          } }, { key: "networkPassphrase", get: function() {
            return this._networkPassphrase;
          }, set: function(e3) {
            this._networkPassphrase = e3;
          } }, { key: "sign", value: function() {
            for (var e3 = this, t3 = this.hash(), r3 = arguments.length, n2 = new Array(r3), o2 = 0; o2 < r3; o2++) n2[o2] = arguments[o2];
            n2.forEach(function(r4) {
              var n3 = r4.signDecorated(t3);
              e3.signatures.push(n3);
            });
          } }, { key: "getKeypairSignature", value: function(e3) {
            return e3.sign(this.hash()).toString("base64");
          } }, { key: "addSignature", value: function() {
            var e3, t3, r3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
            if (!n2 || "string" != typeof n2) throw new Error("Invalid signature");
            if (!r3 || "string" != typeof r3) throw new Error("Invalid publicKey");
            var o2 = wr.from(n2, "base64");
            try {
              t3 = (e3 = lr.fromPublicKey(r3)).signatureHint();
            } catch (e4) {
              throw new Error("Invalid publicKey");
            }
            if (!e3.verify(this.hash(), o2)) throw new Error("Invalid signature");
            this.signatures.push(new i.DecoratedSignature({ hint: t3, signature: o2 }));
          } }, { key: "addDecoratedSignature", value: function(e3) {
            this.signatures.push(e3);
          } }, { key: "signHashX", value: function(e3) {
            if ("string" == typeof e3 && (e3 = wr.from(e3, "hex")), e3.length > 64) throw new Error("preimage cannnot be longer than 64 bytes");
            var t3 = e3, r3 = u(e3), n2 = r3.slice(r3.length - 4);
            this.signatures.push(new i.DecoratedSignature({ hint: n2, signature: t3 }));
          } }, { key: "hash", value: function() {
            return u(this.signatureBase());
          } }, { key: "signatureBase", value: function() {
            throw new Error("Implement in subclass");
          } }, { key: "toEnvelope", value: function() {
            throw new Error("Implement in subclass");
          } }, { key: "toXDR", value: function() {
            return this.toEnvelope().toXDR().toString("base64");
          } }]);
        })(), Tr = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i, Or = Math.ceil, xr = Math.floor, Pr = "[BigNumber Error] ", Br = Pr + "Number primitive has more than 15 significant digits: ", Ir = 1e14, Cr = 14, Rr = 9007199254740991, _r = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13], Ur = 1e7, Nr = 1e9;
        function Lr(e3) {
          var t3 = 0 | e3;
          return e3 > 0 || e3 === t3 ? t3 : t3 - 1;
        }
        function Fr(e3) {
          for (var t3, r3, n2 = 1, o2 = e3.length, i2 = e3[0] + ""; n2 < o2; ) {
            for (t3 = e3[n2++] + "", r3 = Cr - t3.length; r3--; t3 = "0" + t3) ;
            i2 += t3;
          }
          for (o2 = i2.length; 48 === i2.charCodeAt(--o2); ) ;
          return i2.slice(0, o2 + 1 || 1);
        }
        function jr(e3, t3) {
          var r3, n2, o2 = e3.c, i2 = t3.c, a2 = e3.s, s2 = t3.s, u2 = e3.e, c2 = t3.e;
          if (!a2 || !s2) return null;
          if (r3 = o2 && !o2[0], n2 = i2 && !i2[0], r3 || n2) return r3 ? n2 ? 0 : -s2 : a2;
          if (a2 != s2) return a2;
          if (r3 = a2 < 0, n2 = u2 == c2, !o2 || !i2) return n2 ? 0 : !o2 ^ r3 ? 1 : -1;
          if (!n2) return u2 > c2 ^ r3 ? 1 : -1;
          for (s2 = (u2 = o2.length) < (c2 = i2.length) ? u2 : c2, a2 = 0; a2 < s2; a2++) if (o2[a2] != i2[a2]) return o2[a2] > i2[a2] ^ r3 ? 1 : -1;
          return u2 == c2 ? 0 : u2 > c2 ^ r3 ? 1 : -1;
        }
        function Mr(e3, t3, r3, n2) {
          if (e3 < t3 || e3 > r3 || e3 !== xr(e3)) throw Error(Pr + (n2 || "Argument") + ("number" == typeof e3 ? e3 < t3 || e3 > r3 ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(e3));
        }
        function Dr(e3) {
          var t3 = e3.c.length - 1;
          return Lr(e3.e / Cr) == t3 && e3.c[t3] % 2 != 0;
        }
        function Vr(e3, t3) {
          return (e3.length > 1 ? e3.charAt(0) + "." + e3.slice(1) : e3) + (t3 < 0 ? "e" : "e+") + t3;
        }
        function qr(e3, t3, r3) {
          var n2, o2;
          if (t3 < 0) {
            for (o2 = r3 + "."; ++t3; o2 += r3) ;
            e3 = o2 + e3;
          } else if (++t3 > (n2 = e3.length)) {
            for (o2 = r3, t3 -= n2; --t3; o2 += r3) ;
            e3 += o2;
          } else t3 < n2 && (e3 = e3.slice(0, t3) + "." + e3.slice(t3));
          return e3;
        }
        var Kr = (function e3(t3) {
          var r3, n2, o2, i2, a2, s2, u2, c2, l2, f2, p2 = O2.prototype = { constructor: O2, toString: null, valueOf: null }, d2 = new O2(1), h2 = 20, y2 = 4, m2 = -7, g2 = 21, v2 = -1e7, b2 = 1e7, w2 = false, S2 = 1, E2 = 0, k2 = { prefix: "", groupSize: 3, secondaryGroupSize: 0, groupSeparator: ",", decimalSeparator: ".", fractionGroupSize: 0, fractionGroupSeparator: " ", suffix: "" }, A2 = "0123456789abcdefghijklmnopqrstuvwxyz", T2 = true;
          function O2(e4, t4) {
            var r4, i3, a3, s3, u3, c3, l3, f3, p3 = this;
            if (!(p3 instanceof O2)) return new O2(e4, t4);
            if (null == t4) {
              if (e4 && true === e4._isBigNumber) return p3.s = e4.s, void (!e4.c || e4.e > b2 ? p3.c = p3.e = null : e4.e < v2 ? p3.c = [p3.e = 0] : (p3.e = e4.e, p3.c = e4.c.slice()));
              if ((c3 = "number" == typeof e4) && 0 * e4 == 0) {
                if (p3.s = 1 / e4 < 0 ? (e4 = -e4, -1) : 1, e4 === ~~e4) {
                  for (s3 = 0, u3 = e4; u3 >= 10; u3 /= 10, s3++) ;
                  return void (s3 > b2 ? p3.c = p3.e = null : (p3.e = s3, p3.c = [e4]));
                }
                f3 = String(e4);
              } else {
                if (!Tr.test(f3 = String(e4))) return o2(p3, f3, c3);
                p3.s = 45 == f3.charCodeAt(0) ? (f3 = f3.slice(1), -1) : 1;
              }
              (s3 = f3.indexOf(".")) > -1 && (f3 = f3.replace(".", "")), (u3 = f3.search(/e/i)) > 0 ? (s3 < 0 && (s3 = u3), s3 += +f3.slice(u3 + 1), f3 = f3.substring(0, u3)) : s3 < 0 && (s3 = f3.length);
            } else {
              if (Mr(t4, 2, A2.length, "Base"), 10 == t4 && T2) return I2(p3 = new O2(e4), h2 + p3.e + 1, y2);
              if (f3 = String(e4), c3 = "number" == typeof e4) {
                if (0 * e4 != 0) return o2(p3, f3, c3, t4);
                if (p3.s = 1 / e4 < 0 ? (f3 = f3.slice(1), -1) : 1, O2.DEBUG && f3.replace(/^0\.0*|\./, "").length > 15) throw Error(Br + e4);
              } else p3.s = 45 === f3.charCodeAt(0) ? (f3 = f3.slice(1), -1) : 1;
              for (r4 = A2.slice(0, t4), s3 = u3 = 0, l3 = f3.length; u3 < l3; u3++) if (r4.indexOf(i3 = f3.charAt(u3)) < 0) {
                if ("." == i3) {
                  if (u3 > s3) {
                    s3 = l3;
                    continue;
                  }
                } else if (!a3 && (f3 == f3.toUpperCase() && (f3 = f3.toLowerCase()) || f3 == f3.toLowerCase() && (f3 = f3.toUpperCase()))) {
                  a3 = true, u3 = -1, s3 = 0;
                  continue;
                }
                return o2(p3, String(e4), c3, t4);
              }
              c3 = false, (s3 = (f3 = n2(f3, t4, 10, p3.s)).indexOf(".")) > -1 ? f3 = f3.replace(".", "") : s3 = f3.length;
            }
            for (u3 = 0; 48 === f3.charCodeAt(u3); u3++) ;
            for (l3 = f3.length; 48 === f3.charCodeAt(--l3); ) ;
            if (f3 = f3.slice(u3, ++l3)) {
              if (l3 -= u3, c3 && O2.DEBUG && l3 > 15 && (e4 > Rr || e4 !== xr(e4))) throw Error(Br + p3.s * e4);
              if ((s3 = s3 - u3 - 1) > b2) p3.c = p3.e = null;
              else if (s3 < v2) p3.c = [p3.e = 0];
              else {
                if (p3.e = s3, p3.c = [], u3 = (s3 + 1) % Cr, s3 < 0 && (u3 += Cr), u3 < l3) {
                  for (u3 && p3.c.push(+f3.slice(0, u3)), l3 -= Cr; u3 < l3; ) p3.c.push(+f3.slice(u3, u3 += Cr));
                  u3 = Cr - (f3 = f3.slice(u3)).length;
                } else u3 -= l3;
                for (; u3--; f3 += "0") ;
                p3.c.push(+f3);
              }
            } else p3.c = [p3.e = 0];
          }
          function x2(e4, t4, r4, n3) {
            var o3, i3, a3, s3, u3;
            if (null == r4 ? r4 = y2 : Mr(r4, 0, 8), !e4.c) return e4.toString();
            if (o3 = e4.c[0], a3 = e4.e, null == t4) u3 = Fr(e4.c), u3 = 1 == n3 || 2 == n3 && (a3 <= m2 || a3 >= g2) ? Vr(u3, a3) : qr(u3, a3, "0");
            else if (i3 = (e4 = I2(new O2(e4), t4, r4)).e, s3 = (u3 = Fr(e4.c)).length, 1 == n3 || 2 == n3 && (t4 <= i3 || i3 <= m2)) {
              for (; s3 < t4; u3 += "0", s3++) ;
              u3 = Vr(u3, i3);
            } else if (t4 -= a3 + (2 === n3 && i3 > a3), u3 = qr(u3, i3, "0"), i3 + 1 > s3) {
              if (--t4 > 0) for (u3 += "."; t4--; u3 += "0") ;
            } else if ((t4 += i3 - s3) > 0) for (i3 + 1 == s3 && (u3 += "."); t4--; u3 += "0") ;
            return e4.s < 0 && o3 ? "-" + u3 : u3;
          }
          function P2(e4, t4) {
            for (var r4, n3, o3 = 1, i3 = new O2(e4[0]); o3 < e4.length; o3++) (!(n3 = new O2(e4[o3])).s || (r4 = jr(i3, n3)) === t4 || 0 === r4 && i3.s === t4) && (i3 = n3);
            return i3;
          }
          function B2(e4, t4, r4) {
            for (var n3 = 1, o3 = t4.length; !t4[--o3]; t4.pop()) ;
            for (o3 = t4[0]; o3 >= 10; o3 /= 10, n3++) ;
            return (r4 = n3 + r4 * Cr - 1) > b2 ? e4.c = e4.e = null : r4 < v2 ? e4.c = [e4.e = 0] : (e4.e = r4, e4.c = t4), e4;
          }
          function I2(e4, t4, r4, n3) {
            var o3, i3, a3, s3, u3, c3, l3, f3 = e4.c, p3 = _r;
            if (f3) {
              e: {
                for (o3 = 1, s3 = f3[0]; s3 >= 10; s3 /= 10, o3++) ;
                if ((i3 = t4 - o3) < 0) i3 += Cr, a3 = t4, u3 = f3[c3 = 0], l3 = xr(u3 / p3[o3 - a3 - 1] % 10);
                else if ((c3 = Or((i3 + 1) / Cr)) >= f3.length) {
                  if (!n3) break e;
                  for (; f3.length <= c3; f3.push(0)) ;
                  u3 = l3 = 0, o3 = 1, a3 = (i3 %= Cr) - Cr + 1;
                } else {
                  for (u3 = s3 = f3[c3], o3 = 1; s3 >= 10; s3 /= 10, o3++) ;
                  l3 = (a3 = (i3 %= Cr) - Cr + o3) < 0 ? 0 : xr(u3 / p3[o3 - a3 - 1] % 10);
                }
                if (n3 = n3 || t4 < 0 || null != f3[c3 + 1] || (a3 < 0 ? u3 : u3 % p3[o3 - a3 - 1]), n3 = r4 < 4 ? (l3 || n3) && (0 == r4 || r4 == (e4.s < 0 ? 3 : 2)) : l3 > 5 || 5 == l3 && (4 == r4 || n3 || 6 == r4 && (i3 > 0 ? a3 > 0 ? u3 / p3[o3 - a3] : 0 : f3[c3 - 1]) % 10 & 1 || r4 == (e4.s < 0 ? 8 : 7)), t4 < 1 || !f3[0]) return f3.length = 0, n3 ? (t4 -= e4.e + 1, f3[0] = p3[(Cr - t4 % Cr) % Cr], e4.e = -t4 || 0) : f3[0] = e4.e = 0, e4;
                if (0 == i3 ? (f3.length = c3, s3 = 1, c3--) : (f3.length = c3 + 1, s3 = p3[Cr - i3], f3[c3] = a3 > 0 ? xr(u3 / p3[o3 - a3] % p3[a3]) * s3 : 0), n3) for (; ; ) {
                  if (0 == c3) {
                    for (i3 = 1, a3 = f3[0]; a3 >= 10; a3 /= 10, i3++) ;
                    for (a3 = f3[0] += s3, s3 = 1; a3 >= 10; a3 /= 10, s3++) ;
                    i3 != s3 && (e4.e++, f3[0] == Ir && (f3[0] = 1));
                    break;
                  }
                  if (f3[c3] += s3, f3[c3] != Ir) break;
                  f3[c3--] = 0, s3 = 1;
                }
                for (i3 = f3.length; 0 === f3[--i3]; f3.pop()) ;
              }
              e4.e > b2 ? e4.c = e4.e = null : e4.e < v2 && (e4.c = [e4.e = 0]);
            }
            return e4;
          }
          function C2(e4) {
            var t4, r4 = e4.e;
            return null === r4 ? e4.toString() : (t4 = Fr(e4.c), t4 = r4 <= m2 || r4 >= g2 ? Vr(t4, r4) : qr(t4, r4, "0"), e4.s < 0 ? "-" + t4 : t4);
          }
          return O2.clone = e3, O2.ROUND_UP = 0, O2.ROUND_DOWN = 1, O2.ROUND_CEIL = 2, O2.ROUND_FLOOR = 3, O2.ROUND_HALF_UP = 4, O2.ROUND_HALF_DOWN = 5, O2.ROUND_HALF_EVEN = 6, O2.ROUND_HALF_CEIL = 7, O2.ROUND_HALF_FLOOR = 8, O2.EUCLID = 9, O2.config = O2.set = function(e4) {
            var t4, r4;
            if (null != e4) {
              if ("object" != typeof e4) throw Error(Pr + "Object expected: " + e4);
              if (e4.hasOwnProperty(t4 = "DECIMAL_PLACES") && (Mr(r4 = e4[t4], 0, Nr, t4), h2 = r4), e4.hasOwnProperty(t4 = "ROUNDING_MODE") && (Mr(r4 = e4[t4], 0, 8, t4), y2 = r4), e4.hasOwnProperty(t4 = "EXPONENTIAL_AT") && ((r4 = e4[t4]) && r4.pop ? (Mr(r4[0], -Nr, 0, t4), Mr(r4[1], 0, Nr, t4), m2 = r4[0], g2 = r4[1]) : (Mr(r4, -Nr, Nr, t4), m2 = -(g2 = r4 < 0 ? -r4 : r4))), e4.hasOwnProperty(t4 = "RANGE")) if ((r4 = e4[t4]) && r4.pop) Mr(r4[0], -Nr, -1, t4), Mr(r4[1], 1, Nr, t4), v2 = r4[0], b2 = r4[1];
              else {
                if (Mr(r4, -Nr, Nr, t4), !r4) throw Error(Pr + t4 + " cannot be zero: " + r4);
                v2 = -(b2 = r4 < 0 ? -r4 : r4);
              }
              if (e4.hasOwnProperty(t4 = "CRYPTO")) {
                if ((r4 = e4[t4]) !== !!r4) throw Error(Pr + t4 + " not true or false: " + r4);
                if (r4) {
                  if ("undefined" == typeof crypto || !crypto || !crypto.getRandomValues && !crypto.randomBytes) throw w2 = !r4, Error(Pr + "crypto unavailable");
                  w2 = r4;
                } else w2 = r4;
              }
              if (e4.hasOwnProperty(t4 = "MODULO_MODE") && (Mr(r4 = e4[t4], 0, 9, t4), S2 = r4), e4.hasOwnProperty(t4 = "POW_PRECISION") && (Mr(r4 = e4[t4], 0, Nr, t4), E2 = r4), e4.hasOwnProperty(t4 = "FORMAT")) {
                if ("object" != typeof (r4 = e4[t4])) throw Error(Pr + t4 + " not an object: " + r4);
                k2 = r4;
              }
              if (e4.hasOwnProperty(t4 = "ALPHABET")) {
                if ("string" != typeof (r4 = e4[t4]) || /^.?$|[+\-.\s]|(.).*\1/.test(r4)) throw Error(Pr + t4 + " invalid: " + r4);
                T2 = "0123456789" == r4.slice(0, 10), A2 = r4;
              }
            }
            return { DECIMAL_PLACES: h2, ROUNDING_MODE: y2, EXPONENTIAL_AT: [m2, g2], RANGE: [v2, b2], CRYPTO: w2, MODULO_MODE: S2, POW_PRECISION: E2, FORMAT: k2, ALPHABET: A2 };
          }, O2.isBigNumber = function(e4) {
            if (!e4 || true !== e4._isBigNumber) return false;
            if (!O2.DEBUG) return true;
            var t4, r4, n3 = e4.c, o3 = e4.e, i3 = e4.s;
            e: if ("[object Array]" == {}.toString.call(n3)) {
              if ((1 === i3 || -1 === i3) && o3 >= -Nr && o3 <= Nr && o3 === xr(o3)) {
                if (0 === n3[0]) {
                  if (0 === o3 && 1 === n3.length) return true;
                  break e;
                }
                if ((t4 = (o3 + 1) % Cr) < 1 && (t4 += Cr), String(n3[0]).length == t4) {
                  for (t4 = 0; t4 < n3.length; t4++) if ((r4 = n3[t4]) < 0 || r4 >= Ir || r4 !== xr(r4)) break e;
                  if (0 !== r4) return true;
                }
              }
            } else if (null === n3 && null === o3 && (null === i3 || 1 === i3 || -1 === i3)) return true;
            throw Error(Pr + "Invalid BigNumber: " + e4);
          }, O2.maximum = O2.max = function() {
            return P2(arguments, -1);
          }, O2.minimum = O2.min = function() {
            return P2(arguments, 1);
          }, O2.random = (i2 = 9007199254740992, a2 = Math.random() * i2 & 2097151 ? function() {
            return xr(Math.random() * i2);
          } : function() {
            return 8388608 * (1073741824 * Math.random() | 0) + (8388608 * Math.random() | 0);
          }, function(e4) {
            var t4, r4, n3, o3, i3, s3 = 0, u3 = [], c3 = new O2(d2);
            if (null == e4 ? e4 = h2 : Mr(e4, 0, Nr), o3 = Or(e4 / Cr), w2) if (crypto.getRandomValues) {
              for (t4 = crypto.getRandomValues(new Uint32Array(o3 *= 2)); s3 < o3; ) (i3 = 131072 * t4[s3] + (t4[s3 + 1] >>> 11)) >= 9e15 ? (r4 = crypto.getRandomValues(new Uint32Array(2)), t4[s3] = r4[0], t4[s3 + 1] = r4[1]) : (u3.push(i3 % 1e14), s3 += 2);
              s3 = o3 / 2;
            } else {
              if (!crypto.randomBytes) throw w2 = false, Error(Pr + "crypto unavailable");
              for (t4 = crypto.randomBytes(o3 *= 7); s3 < o3; ) (i3 = 281474976710656 * (31 & t4[s3]) + 1099511627776 * t4[s3 + 1] + 4294967296 * t4[s3 + 2] + 16777216 * t4[s3 + 3] + (t4[s3 + 4] << 16) + (t4[s3 + 5] << 8) + t4[s3 + 6]) >= 9e15 ? crypto.randomBytes(7).copy(t4, s3) : (u3.push(i3 % 1e14), s3 += 7);
              s3 = o3 / 7;
            }
            if (!w2) for (; s3 < o3; ) (i3 = a2()) < 9e15 && (u3[s3++] = i3 % 1e14);
            for (o3 = u3[--s3], e4 %= Cr, o3 && e4 && (i3 = _r[Cr - e4], u3[s3] = xr(o3 / i3) * i3); 0 === u3[s3]; u3.pop(), s3--) ;
            if (s3 < 0) u3 = [n3 = 0];
            else {
              for (n3 = -1; 0 === u3[0]; u3.splice(0, 1), n3 -= Cr) ;
              for (s3 = 1, i3 = u3[0]; i3 >= 10; i3 /= 10, s3++) ;
              s3 < Cr && (n3 -= Cr - s3);
            }
            return c3.e = n3, c3.c = u3, c3;
          }), O2.sum = function() {
            for (var e4 = 1, t4 = arguments, r4 = new O2(t4[0]); e4 < t4.length; ) r4 = r4.plus(t4[e4++]);
            return r4;
          }, n2 = /* @__PURE__ */ (function() {
            var e4 = "0123456789";
            function t4(e5, t5, r4, n3) {
              for (var o3, i3, a3 = [0], s3 = 0, u3 = e5.length; s3 < u3; ) {
                for (i3 = a3.length; i3--; a3[i3] *= t5) ;
                for (a3[0] += n3.indexOf(e5.charAt(s3++)), o3 = 0; o3 < a3.length; o3++) a3[o3] > r4 - 1 && (null == a3[o3 + 1] && (a3[o3 + 1] = 0), a3[o3 + 1] += a3[o3] / r4 | 0, a3[o3] %= r4);
              }
              return a3.reverse();
            }
            return function(n3, o3, i3, a3, s3) {
              var u3, c3, l3, f3, p3, d3, m3, g3, v3 = n3.indexOf("."), b3 = h2, w3 = y2;
              for (v3 >= 0 && (f3 = E2, E2 = 0, n3 = n3.replace(".", ""), d3 = (g3 = new O2(o3)).pow(n3.length - v3), E2 = f3, g3.c = t4(qr(Fr(d3.c), d3.e, "0"), 10, i3, e4), g3.e = g3.c.length), l3 = f3 = (m3 = t4(n3, o3, i3, s3 ? (u3 = A2, e4) : (u3 = e4, A2))).length; 0 == m3[--f3]; m3.pop()) ;
              if (!m3[0]) return u3.charAt(0);
              if (v3 < 0 ? --l3 : (d3.c = m3, d3.e = l3, d3.s = a3, m3 = (d3 = r3(d3, g3, b3, w3, i3)).c, p3 = d3.r, l3 = d3.e), v3 = m3[c3 = l3 + b3 + 1], f3 = i3 / 2, p3 = p3 || c3 < 0 || null != m3[c3 + 1], p3 = w3 < 4 ? (null != v3 || p3) && (0 == w3 || w3 == (d3.s < 0 ? 3 : 2)) : v3 > f3 || v3 == f3 && (4 == w3 || p3 || 6 == w3 && 1 & m3[c3 - 1] || w3 == (d3.s < 0 ? 8 : 7)), c3 < 1 || !m3[0]) n3 = p3 ? qr(u3.charAt(1), -b3, u3.charAt(0)) : u3.charAt(0);
              else {
                if (m3.length = c3, p3) for (--i3; ++m3[--c3] > i3; ) m3[c3] = 0, c3 || (++l3, m3 = [1].concat(m3));
                for (f3 = m3.length; !m3[--f3]; ) ;
                for (v3 = 0, n3 = ""; v3 <= f3; n3 += u3.charAt(m3[v3++])) ;
                n3 = qr(n3, l3, u3.charAt(0));
              }
              return n3;
            };
          })(), r3 = /* @__PURE__ */ (function() {
            function e4(e5, t5, r5) {
              var n3, o3, i3, a3, s3 = 0, u3 = e5.length, c3 = t5 % Ur, l3 = t5 / Ur | 0;
              for (e5 = e5.slice(); u3--; ) s3 = ((o3 = c3 * (i3 = e5[u3] % Ur) + (n3 = l3 * i3 + (a3 = e5[u3] / Ur | 0) * c3) % Ur * Ur + s3) / r5 | 0) + (n3 / Ur | 0) + l3 * a3, e5[u3] = o3 % r5;
              return s3 && (e5 = [s3].concat(e5)), e5;
            }
            function t4(e5, t5, r5, n3) {
              var o3, i3;
              if (r5 != n3) i3 = r5 > n3 ? 1 : -1;
              else for (o3 = i3 = 0; o3 < r5; o3++) if (e5[o3] != t5[o3]) {
                i3 = e5[o3] > t5[o3] ? 1 : -1;
                break;
              }
              return i3;
            }
            function r4(e5, t5, r5, n3) {
              for (var o3 = 0; r5--; ) e5[r5] -= o3, o3 = e5[r5] < t5[r5] ? 1 : 0, e5[r5] = o3 * n3 + e5[r5] - t5[r5];
              for (; !e5[0] && e5.length > 1; e5.splice(0, 1)) ;
            }
            return function(n3, o3, i3, a3, s3) {
              var u3, c3, l3, f3, p3, d3, h3, y3, m3, g3, v3, b3, w3, S3, E3, k3, A3, T3 = n3.s == o3.s ? 1 : -1, x3 = n3.c, P3 = o3.c;
              if (!(x3 && x3[0] && P3 && P3[0])) return new O2(n3.s && o3.s && (x3 ? !P3 || x3[0] != P3[0] : P3) ? x3 && 0 == x3[0] || !P3 ? 0 * T3 : T3 / 0 : NaN);
              for (m3 = (y3 = new O2(T3)).c = [], T3 = i3 + (c3 = n3.e - o3.e) + 1, s3 || (s3 = Ir, c3 = Lr(n3.e / Cr) - Lr(o3.e / Cr), T3 = T3 / Cr | 0), l3 = 0; P3[l3] == (x3[l3] || 0); l3++) ;
              if (P3[l3] > (x3[l3] || 0) && c3--, T3 < 0) m3.push(1), f3 = true;
              else {
                for (S3 = x3.length, k3 = P3.length, l3 = 0, T3 += 2, (p3 = xr(s3 / (P3[0] + 1))) > 1 && (P3 = e4(P3, p3, s3), x3 = e4(x3, p3, s3), k3 = P3.length, S3 = x3.length), w3 = k3, v3 = (g3 = x3.slice(0, k3)).length; v3 < k3; g3[v3++] = 0) ;
                A3 = P3.slice(), A3 = [0].concat(A3), E3 = P3[0], P3[1] >= s3 / 2 && E3++;
                do {
                  if (p3 = 0, (u3 = t4(P3, g3, k3, v3)) < 0) {
                    if (b3 = g3[0], k3 != v3 && (b3 = b3 * s3 + (g3[1] || 0)), (p3 = xr(b3 / E3)) > 1) for (p3 >= s3 && (p3 = s3 - 1), h3 = (d3 = e4(P3, p3, s3)).length, v3 = g3.length; 1 == t4(d3, g3, h3, v3); ) p3--, r4(d3, k3 < h3 ? A3 : P3, h3, s3), h3 = d3.length, u3 = 1;
                    else 0 == p3 && (u3 = p3 = 1), h3 = (d3 = P3.slice()).length;
                    if (h3 < v3 && (d3 = [0].concat(d3)), r4(g3, d3, v3, s3), v3 = g3.length, -1 == u3) for (; t4(P3, g3, k3, v3) < 1; ) p3++, r4(g3, k3 < v3 ? A3 : P3, v3, s3), v3 = g3.length;
                  } else 0 === u3 && (p3++, g3 = [0]);
                  m3[l3++] = p3, g3[0] ? g3[v3++] = x3[w3] || 0 : (g3 = [x3[w3]], v3 = 1);
                } while ((w3++ < S3 || null != g3[0]) && T3--);
                f3 = null != g3[0], m3[0] || m3.splice(0, 1);
              }
              if (s3 == Ir) {
                for (l3 = 1, T3 = m3[0]; T3 >= 10; T3 /= 10, l3++) ;
                I2(y3, i3 + (y3.e = l3 + c3 * Cr - 1) + 1, a3, f3);
              } else y3.e = c3, y3.r = +f3;
              return y3;
            };
          })(), s2 = /^(-?)0([xbo])(?=\w[\w.]*$)/i, u2 = /^([^.]+)\.$/, c2 = /^\.([^.]+)$/, l2 = /^-?(Infinity|NaN)$/, f2 = /^\s*\+(?=[\w.])|^\s+|\s+$/g, o2 = function(e4, t4, r4, n3) {
            var o3, i3 = r4 ? t4 : t4.replace(f2, "");
            if (l2.test(i3)) e4.s = isNaN(i3) ? null : i3 < 0 ? -1 : 1;
            else {
              if (!r4 && (i3 = i3.replace(s2, function(e5, t5, r5) {
                return o3 = "x" == (r5 = r5.toLowerCase()) ? 16 : "b" == r5 ? 2 : 8, n3 && n3 != o3 ? e5 : t5;
              }), n3 && (o3 = n3, i3 = i3.replace(u2, "$1").replace(c2, "0.$1")), t4 != i3)) return new O2(i3, o3);
              if (O2.DEBUG) throw Error(Pr + "Not a" + (n3 ? " base " + n3 : "") + " number: " + t4);
              e4.s = null;
            }
            e4.c = e4.e = null;
          }, p2.absoluteValue = p2.abs = function() {
            var e4 = new O2(this);
            return e4.s < 0 && (e4.s = 1), e4;
          }, p2.comparedTo = function(e4, t4) {
            return jr(this, new O2(e4, t4));
          }, p2.decimalPlaces = p2.dp = function(e4, t4) {
            var r4, n3, o3, i3 = this;
            if (null != e4) return Mr(e4, 0, Nr), null == t4 ? t4 = y2 : Mr(t4, 0, 8), I2(new O2(i3), e4 + i3.e + 1, t4);
            if (!(r4 = i3.c)) return null;
            if (n3 = ((o3 = r4.length - 1) - Lr(this.e / Cr)) * Cr, o3 = r4[o3]) for (; o3 % 10 == 0; o3 /= 10, n3--) ;
            return n3 < 0 && (n3 = 0), n3;
          }, p2.dividedBy = p2.div = function(e4, t4) {
            return r3(this, new O2(e4, t4), h2, y2);
          }, p2.dividedToIntegerBy = p2.idiv = function(e4, t4) {
            return r3(this, new O2(e4, t4), 0, 1);
          }, p2.exponentiatedBy = p2.pow = function(e4, t4) {
            var r4, n3, o3, i3, a3, s3, u3, c3, l3 = this;
            if ((e4 = new O2(e4)).c && !e4.isInteger()) throw Error(Pr + "Exponent not an integer: " + C2(e4));
            if (null != t4 && (t4 = new O2(t4)), a3 = e4.e > 14, !l3.c || !l3.c[0] || 1 == l3.c[0] && !l3.e && 1 == l3.c.length || !e4.c || !e4.c[0]) return c3 = new O2(Math.pow(+C2(l3), a3 ? e4.s * (2 - Dr(e4)) : +C2(e4))), t4 ? c3.mod(t4) : c3;
            if (s3 = e4.s < 0, t4) {
              if (t4.c ? !t4.c[0] : !t4.s) return new O2(NaN);
              (n3 = !s3 && l3.isInteger() && t4.isInteger()) && (l3 = l3.mod(t4));
            } else {
              if (e4.e > 9 && (l3.e > 0 || l3.e < -1 || (0 == l3.e ? l3.c[0] > 1 || a3 && l3.c[1] >= 24e7 : l3.c[0] < 8e13 || a3 && l3.c[0] <= 9999975e7))) return i3 = l3.s < 0 && Dr(e4) ? -0 : 0, l3.e > -1 && (i3 = 1 / i3), new O2(s3 ? 1 / i3 : i3);
              E2 && (i3 = Or(E2 / Cr + 2));
            }
            for (a3 ? (r4 = new O2(0.5), s3 && (e4.s = 1), u3 = Dr(e4)) : u3 = (o3 = Math.abs(+C2(e4))) % 2, c3 = new O2(d2); ; ) {
              if (u3) {
                if (!(c3 = c3.times(l3)).c) break;
                i3 ? c3.c.length > i3 && (c3.c.length = i3) : n3 && (c3 = c3.mod(t4));
              }
              if (o3) {
                if (0 === (o3 = xr(o3 / 2))) break;
                u3 = o3 % 2;
              } else if (I2(e4 = e4.times(r4), e4.e + 1, 1), e4.e > 14) u3 = Dr(e4);
              else {
                if (0 === (o3 = +C2(e4))) break;
                u3 = o3 % 2;
              }
              l3 = l3.times(l3), i3 ? l3.c && l3.c.length > i3 && (l3.c.length = i3) : n3 && (l3 = l3.mod(t4));
            }
            return n3 ? c3 : (s3 && (c3 = d2.div(c3)), t4 ? c3.mod(t4) : i3 ? I2(c3, E2, y2, void 0) : c3);
          }, p2.integerValue = function(e4) {
            var t4 = new O2(this);
            return null == e4 ? e4 = y2 : Mr(e4, 0, 8), I2(t4, t4.e + 1, e4);
          }, p2.isEqualTo = p2.eq = function(e4, t4) {
            return 0 === jr(this, new O2(e4, t4));
          }, p2.isFinite = function() {
            return !!this.c;
          }, p2.isGreaterThan = p2.gt = function(e4, t4) {
            return jr(this, new O2(e4, t4)) > 0;
          }, p2.isGreaterThanOrEqualTo = p2.gte = function(e4, t4) {
            return 1 === (t4 = jr(this, new O2(e4, t4))) || 0 === t4;
          }, p2.isInteger = function() {
            return !!this.c && Lr(this.e / Cr) > this.c.length - 2;
          }, p2.isLessThan = p2.lt = function(e4, t4) {
            return jr(this, new O2(e4, t4)) < 0;
          }, p2.isLessThanOrEqualTo = p2.lte = function(e4, t4) {
            return -1 === (t4 = jr(this, new O2(e4, t4))) || 0 === t4;
          }, p2.isNaN = function() {
            return !this.s;
          }, p2.isNegative = function() {
            return this.s < 0;
          }, p2.isPositive = function() {
            return this.s > 0;
          }, p2.isZero = function() {
            return !!this.c && 0 == this.c[0];
          }, p2.minus = function(e4, t4) {
            var r4, n3, o3, i3, a3 = this, s3 = a3.s;
            if (t4 = (e4 = new O2(e4, t4)).s, !s3 || !t4) return new O2(NaN);
            if (s3 != t4) return e4.s = -t4, a3.plus(e4);
            var u3 = a3.e / Cr, c3 = e4.e / Cr, l3 = a3.c, f3 = e4.c;
            if (!u3 || !c3) {
              if (!l3 || !f3) return l3 ? (e4.s = -t4, e4) : new O2(f3 ? a3 : NaN);
              if (!l3[0] || !f3[0]) return f3[0] ? (e4.s = -t4, e4) : new O2(l3[0] ? a3 : 3 == y2 ? -0 : 0);
            }
            if (u3 = Lr(u3), c3 = Lr(c3), l3 = l3.slice(), s3 = u3 - c3) {
              for ((i3 = s3 < 0) ? (s3 = -s3, o3 = l3) : (c3 = u3, o3 = f3), o3.reverse(), t4 = s3; t4--; o3.push(0)) ;
              o3.reverse();
            } else for (n3 = (i3 = (s3 = l3.length) < (t4 = f3.length)) ? s3 : t4, s3 = t4 = 0; t4 < n3; t4++) if (l3[t4] != f3[t4]) {
              i3 = l3[t4] < f3[t4];
              break;
            }
            if (i3 && (o3 = l3, l3 = f3, f3 = o3, e4.s = -e4.s), (t4 = (n3 = f3.length) - (r4 = l3.length)) > 0) for (; t4--; l3[r4++] = 0) ;
            for (t4 = Ir - 1; n3 > s3; ) {
              if (l3[--n3] < f3[n3]) {
                for (r4 = n3; r4 && !l3[--r4]; l3[r4] = t4) ;
                --l3[r4], l3[n3] += Ir;
              }
              l3[n3] -= f3[n3];
            }
            for (; 0 == l3[0]; l3.splice(0, 1), --c3) ;
            return l3[0] ? B2(e4, l3, c3) : (e4.s = 3 == y2 ? -1 : 1, e4.c = [e4.e = 0], e4);
          }, p2.modulo = p2.mod = function(e4, t4) {
            var n3, o3, i3 = this;
            return e4 = new O2(e4, t4), !i3.c || !e4.s || e4.c && !e4.c[0] ? new O2(NaN) : !e4.c || i3.c && !i3.c[0] ? new O2(i3) : (9 == S2 ? (o3 = e4.s, e4.s = 1, n3 = r3(i3, e4, 0, 3), e4.s = o3, n3.s *= o3) : n3 = r3(i3, e4, 0, S2), (e4 = i3.minus(n3.times(e4))).c[0] || 1 != S2 || (e4.s = i3.s), e4);
          }, p2.multipliedBy = p2.times = function(e4, t4) {
            var r4, n3, o3, i3, a3, s3, u3, c3, l3, f3, p3, d3, h3, y3, m3, g3 = this, v3 = g3.c, b3 = (e4 = new O2(e4, t4)).c;
            if (!(v3 && b3 && v3[0] && b3[0])) return !g3.s || !e4.s || v3 && !v3[0] && !b3 || b3 && !b3[0] && !v3 ? e4.c = e4.e = e4.s = null : (e4.s *= g3.s, v3 && b3 ? (e4.c = [0], e4.e = 0) : e4.c = e4.e = null), e4;
            for (n3 = Lr(g3.e / Cr) + Lr(e4.e / Cr), e4.s *= g3.s, (u3 = v3.length) < (f3 = b3.length) && (h3 = v3, v3 = b3, b3 = h3, o3 = u3, u3 = f3, f3 = o3), o3 = u3 + f3, h3 = []; o3--; h3.push(0)) ;
            for (y3 = Ir, m3 = Ur, o3 = f3; --o3 >= 0; ) {
              for (r4 = 0, p3 = b3[o3] % m3, d3 = b3[o3] / m3 | 0, i3 = o3 + (a3 = u3); i3 > o3; ) r4 = ((c3 = p3 * (c3 = v3[--a3] % m3) + (s3 = d3 * c3 + (l3 = v3[a3] / m3 | 0) * p3) % m3 * m3 + h3[i3] + r4) / y3 | 0) + (s3 / m3 | 0) + d3 * l3, h3[i3--] = c3 % y3;
              h3[i3] = r4;
            }
            return r4 ? ++n3 : h3.splice(0, 1), B2(e4, h3, n3);
          }, p2.negated = function() {
            var e4 = new O2(this);
            return e4.s = -e4.s || null, e4;
          }, p2.plus = function(e4, t4) {
            var r4, n3 = this, o3 = n3.s;
            if (t4 = (e4 = new O2(e4, t4)).s, !o3 || !t4) return new O2(NaN);
            if (o3 != t4) return e4.s = -t4, n3.minus(e4);
            var i3 = n3.e / Cr, a3 = e4.e / Cr, s3 = n3.c, u3 = e4.c;
            if (!i3 || !a3) {
              if (!s3 || !u3) return new O2(o3 / 0);
              if (!s3[0] || !u3[0]) return u3[0] ? e4 : new O2(s3[0] ? n3 : 0 * o3);
            }
            if (i3 = Lr(i3), a3 = Lr(a3), s3 = s3.slice(), o3 = i3 - a3) {
              for (o3 > 0 ? (a3 = i3, r4 = u3) : (o3 = -o3, r4 = s3), r4.reverse(); o3--; r4.push(0)) ;
              r4.reverse();
            }
            for ((o3 = s3.length) - (t4 = u3.length) < 0 && (r4 = u3, u3 = s3, s3 = r4, t4 = o3), o3 = 0; t4; ) o3 = (s3[--t4] = s3[t4] + u3[t4] + o3) / Ir | 0, s3[t4] = Ir === s3[t4] ? 0 : s3[t4] % Ir;
            return o3 && (s3 = [o3].concat(s3), ++a3), B2(e4, s3, a3);
          }, p2.precision = p2.sd = function(e4, t4) {
            var r4, n3, o3, i3 = this;
            if (null != e4 && e4 !== !!e4) return Mr(e4, 1, Nr), null == t4 ? t4 = y2 : Mr(t4, 0, 8), I2(new O2(i3), e4, t4);
            if (!(r4 = i3.c)) return null;
            if (n3 = (o3 = r4.length - 1) * Cr + 1, o3 = r4[o3]) {
              for (; o3 % 10 == 0; o3 /= 10, n3--) ;
              for (o3 = r4[0]; o3 >= 10; o3 /= 10, n3++) ;
            }
            return e4 && i3.e + 1 > n3 && (n3 = i3.e + 1), n3;
          }, p2.shiftedBy = function(e4) {
            return Mr(e4, -9007199254740991, Rr), this.times("1e" + e4);
          }, p2.squareRoot = p2.sqrt = function() {
            var e4, t4, n3, o3, i3, a3 = this, s3 = a3.c, u3 = a3.s, c3 = a3.e, l3 = h2 + 4, f3 = new O2("0.5");
            if (1 !== u3 || !s3 || !s3[0]) return new O2(!u3 || u3 < 0 && (!s3 || s3[0]) ? NaN : s3 ? a3 : 1 / 0);
            if (0 == (u3 = Math.sqrt(+C2(a3))) || u3 == 1 / 0 ? (((t4 = Fr(s3)).length + c3) % 2 == 0 && (t4 += "0"), u3 = Math.sqrt(+t4), c3 = Lr((c3 + 1) / 2) - (c3 < 0 || c3 % 2), n3 = new O2(t4 = u3 == 1 / 0 ? "5e" + c3 : (t4 = u3.toExponential()).slice(0, t4.indexOf("e") + 1) + c3)) : n3 = new O2(u3 + ""), n3.c[0]) {
              for ((u3 = (c3 = n3.e) + l3) < 3 && (u3 = 0); ; ) if (i3 = n3, n3 = f3.times(i3.plus(r3(a3, i3, l3, 1))), Fr(i3.c).slice(0, u3) === (t4 = Fr(n3.c)).slice(0, u3)) {
                if (n3.e < c3 && --u3, "9999" != (t4 = t4.slice(u3 - 3, u3 + 1)) && (o3 || "4999" != t4)) {
                  +t4 && (+t4.slice(1) || "5" != t4.charAt(0)) || (I2(n3, n3.e + h2 + 2, 1), e4 = !n3.times(n3).eq(a3));
                  break;
                }
                if (!o3 && (I2(i3, i3.e + h2 + 2, 0), i3.times(i3).eq(a3))) {
                  n3 = i3;
                  break;
                }
                l3 += 4, u3 += 4, o3 = 1;
              }
            }
            return I2(n3, n3.e + h2 + 1, y2, e4);
          }, p2.toExponential = function(e4, t4) {
            return null != e4 && (Mr(e4, 0, Nr), e4++), x2(this, e4, t4, 1);
          }, p2.toFixed = function(e4, t4) {
            return null != e4 && (Mr(e4, 0, Nr), e4 = e4 + this.e + 1), x2(this, e4, t4);
          }, p2.toFormat = function(e4, t4, r4) {
            var n3, o3 = this;
            if (null == r4) null != e4 && t4 && "object" == typeof t4 ? (r4 = t4, t4 = null) : e4 && "object" == typeof e4 ? (r4 = e4, e4 = t4 = null) : r4 = k2;
            else if ("object" != typeof r4) throw Error(Pr + "Argument not an object: " + r4);
            if (n3 = o3.toFixed(e4, t4), o3.c) {
              var i3, a3 = n3.split("."), s3 = +r4.groupSize, u3 = +r4.secondaryGroupSize, c3 = r4.groupSeparator || "", l3 = a3[0], f3 = a3[1], p3 = o3.s < 0, d3 = p3 ? l3.slice(1) : l3, h3 = d3.length;
              if (u3 && (i3 = s3, s3 = u3, u3 = i3, h3 -= i3), s3 > 0 && h3 > 0) {
                for (i3 = h3 % s3 || s3, l3 = d3.substr(0, i3); i3 < h3; i3 += s3) l3 += c3 + d3.substr(i3, s3);
                u3 > 0 && (l3 += c3 + d3.slice(i3)), p3 && (l3 = "-" + l3);
              }
              n3 = f3 ? l3 + (r4.decimalSeparator || "") + ((u3 = +r4.fractionGroupSize) ? f3.replace(new RegExp("\\d{" + u3 + "}\\B", "g"), "$&" + (r4.fractionGroupSeparator || "")) : f3) : l3;
            }
            return (r4.prefix || "") + n3 + (r4.suffix || "");
          }, p2.toFraction = function(e4) {
            var t4, n3, o3, i3, a3, s3, u3, c3, l3, f3, p3, h3, m3 = this, g3 = m3.c;
            if (null != e4 && (!(u3 = new O2(e4)).isInteger() && (u3.c || 1 !== u3.s) || u3.lt(d2))) throw Error(Pr + "Argument " + (u3.isInteger() ? "out of range: " : "not an integer: ") + C2(u3));
            if (!g3) return new O2(m3);
            for (t4 = new O2(d2), l3 = n3 = new O2(d2), o3 = c3 = new O2(d2), h3 = Fr(g3), a3 = t4.e = h3.length - m3.e - 1, t4.c[0] = _r[(s3 = a3 % Cr) < 0 ? Cr + s3 : s3], e4 = !e4 || u3.comparedTo(t4) > 0 ? a3 > 0 ? t4 : l3 : u3, s3 = b2, b2 = 1 / 0, u3 = new O2(h3), c3.c[0] = 0; f3 = r3(u3, t4, 0, 1), 1 != (i3 = n3.plus(f3.times(o3))).comparedTo(e4); ) n3 = o3, o3 = i3, l3 = c3.plus(f3.times(i3 = l3)), c3 = i3, t4 = u3.minus(f3.times(i3 = t4)), u3 = i3;
            return i3 = r3(e4.minus(n3), o3, 0, 1), c3 = c3.plus(i3.times(l3)), n3 = n3.plus(i3.times(o3)), c3.s = l3.s = m3.s, p3 = r3(l3, o3, a3 *= 2, y2).minus(m3).abs().comparedTo(r3(c3, n3, a3, y2).minus(m3).abs()) < 1 ? [l3, o3] : [c3, n3], b2 = s3, p3;
          }, p2.toNumber = function() {
            return +C2(this);
          }, p2.toPrecision = function(e4, t4) {
            return null != e4 && Mr(e4, 1, Nr), x2(this, e4, t4, 2);
          }, p2.toString = function(e4) {
            var t4, r4 = this, o3 = r4.s, i3 = r4.e;
            return null === i3 ? o3 ? (t4 = "Infinity", o3 < 0 && (t4 = "-" + t4)) : t4 = "NaN" : (null == e4 ? t4 = i3 <= m2 || i3 >= g2 ? Vr(Fr(r4.c), i3) : qr(Fr(r4.c), i3, "0") : 10 === e4 && T2 ? t4 = qr(Fr((r4 = I2(new O2(r4), h2 + i3 + 1, y2)).c), r4.e, "0") : (Mr(e4, 2, A2.length, "Base"), t4 = n2(qr(Fr(r4.c), i3, "0"), 10, e4, o3, true)), o3 < 0 && r4.c[0] && (t4 = "-" + t4)), t4;
          }, p2.valueOf = p2.toJSON = function() {
            return C2(this);
          }, p2._isBigNumber = true, p2[Symbol.toStringTag] = "BigNumber", p2[Symbol.for("nodejs.util.inspect.custom")] = p2.valueOf, null != t3 && O2.set(t3), O2;
        })();
        var Hr = Kr.clone();
        Hr.DEBUG = true;
        const zr = Hr;
        function Xr(e3, t3) {
          return (function(e4) {
            if (Array.isArray(e4)) return e4;
          })(e3) || (function(e4, t4) {
            var r3 = null == e4 ? null : "undefined" != typeof Symbol && e4[Symbol.iterator] || e4["@@iterator"];
            if (null != r3) {
              var n2, o2, i2, a2, s2 = [], u2 = true, c2 = false;
              try {
                if (i2 = (r3 = r3.call(e4)).next, 0 === t4) {
                  if (Object(r3) !== r3) return;
                  u2 = false;
                } else for (; !(u2 = (n2 = i2.call(r3)).done) && (s2.push(n2.value), s2.length !== t4); u2 = true) ;
              } catch (e5) {
                c2 = true, o2 = e5;
              } finally {
                try {
                  if (!u2 && null != r3.return && (a2 = r3.return(), Object(a2) !== a2)) return;
                } finally {
                  if (c2) throw o2;
                }
              }
              return s2;
            }
          })(e3, t3) || (function(e4, t4) {
            if (e4) {
              if ("string" == typeof e4) return $r(e4, t4);
              var r3 = {}.toString.call(e4).slice(8, -1);
              return "Object" === r3 && e4.constructor && (r3 = e4.constructor.name), "Map" === r3 || "Set" === r3 ? Array.from(e4) : "Arguments" === r3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3) ? $r(e4, t4) : void 0;
            }
          })(e3, t3) || (function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          })();
        }
        function $r(e3, t3) {
          (null == t3 || t3 > e3.length) && (t3 = e3.length);
          for (var r3 = 0, n2 = Array(t3); r3 < t3; r3++) n2[r3] = e3[r3];
          return n2;
        }
        var Gr = 2147483647;
        function Wr(e3) {
          return Wr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, Wr(e3);
        }
        function Yr(e3, t3) {
          var r3 = Object.keys(e3);
          if (Object.getOwnPropertySymbols) {
            var n2 = Object.getOwnPropertySymbols(e3);
            t3 && (n2 = n2.filter(function(t4) {
              return Object.getOwnPropertyDescriptor(e3, t4).enumerable;
            })), r3.push.apply(r3, n2);
          }
          return r3;
        }
        function Zr(e3) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = null != arguments[t3] ? arguments[t3] : {};
            t3 % 2 ? Yr(Object(r3), true).forEach(function(t4) {
              Jr(e3, t4, r3[t4]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(r3)) : Yr(Object(r3)).forEach(function(t4) {
              Object.defineProperty(e3, t4, Object.getOwnPropertyDescriptor(r3, t4));
            });
          }
          return e3;
        }
        function Jr(e3, t3, r3) {
          return (t3 = en(t3)) in e3 ? Object.defineProperty(e3, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e3[t3] = r3, e3;
        }
        function Qr(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, en(n2.key), n2);
          }
        }
        function en(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != Wr(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != Wr(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == Wr(t3) ? t3 : t3 + "";
        }
        var tn = (function() {
          return (function(e3, t3, r3) {
            return t3 && Qr(e3.prototype, t3), r3 && Qr(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          })(function e3(t3, r3, n2) {
            if ((function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3), !(t3 && t3 instanceof yr)) throw new Error("assetA is invalid");
            if (!(r3 && r3 instanceof yr)) throw new Error("assetB is invalid");
            if (-1 !== yr.compare(t3, r3)) throw new Error("Assets are not in lexicographic order");
            if (!n2 || n2 !== vr) throw new Error("fee is invalid");
            this.assetA = t3, this.assetB = r3, this.fee = n2;
          }, [{ key: "toXDRObject", value: function() {
            var e3 = new i.LiquidityPoolConstantProductParameters({ assetA: this.assetA.toXDRObject(), assetB: this.assetB.toXDRObject(), fee: this.fee }), t3 = new i.LiquidityPoolParameters("liquidityPoolConstantProduct", e3);
            return new i.ChangeTrustAsset("assetTypePoolShare", t3);
          } }, { key: "getLiquidityPoolParameters", value: function() {
            return Zr(Zr({}, this), {}, { assetA: this.assetA, assetB: this.assetB, fee: this.fee });
          } }, { key: "getAssetType", value: function() {
            return "liquidity_pool_shares";
          } }, { key: "equals", value: function(e3) {
            return this.assetA.equals(e3.assetA) && this.assetB.equals(e3.assetB) && this.fee === e3.fee;
          } }, { key: "toString", value: function() {
            var e3 = br("constant_product", this.getLiquidityPoolParameters()).toString("hex");
            return "liquidity_pool:".concat(e3);
          } }], [{ key: "fromOperation", value: function(e3) {
            var t3 = e3.switch();
            if (t3 === i.AssetType.assetTypePoolShare()) {
              var r3 = e3.liquidityPool().constantProduct();
              return new this(yr.fromOperation(r3.assetA()), yr.fromOperation(r3.assetB()), r3.fee());
            }
            throw new Error("Invalid asset type: ".concat(t3.name));
          } }]);
        })();
        function rn(e3) {
          return rn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, rn(e3);
        }
        function nn(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, on(n2.key), n2);
          }
        }
        function on(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != rn(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != rn(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == rn(t3) ? t3 : t3 + "";
        }
        var an = (function() {
          return (function(e3, t3, r3) {
            return t3 && nn(e3.prototype, t3), r3 && nn(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          })(function e3(t3, r3) {
            if ((function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3), t3 && !tr.isValidEd25519PublicKey(t3)) throw new Error("Destination is invalid");
            if (this._destination = t3, r3) {
              if (!(r3 instanceof i.ClaimPredicate)) throw new Error("Predicate should be an xdr.ClaimPredicate");
              this._predicate = r3;
            } else this._predicate = i.ClaimPredicate.claimPredicateUnconditional();
          }, [{ key: "toXDRObject", value: function() {
            var e3 = new i.ClaimantV0({ destination: lr.fromPublicKey(this._destination).xdrAccountId(), predicate: this._predicate });
            return i.Claimant.claimantTypeV0(e3);
          } }, { key: "destination", get: function() {
            return this._destination;
          }, set: function(e3) {
            throw new Error("Claimant is immutable");
          } }, { key: "predicate", get: function() {
            return this._predicate;
          }, set: function(e3) {
            throw new Error("Claimant is immutable");
          } }], [{ key: "predicateUnconditional", value: function() {
            return i.ClaimPredicate.claimPredicateUnconditional();
          } }, { key: "predicateAnd", value: function(e3, t3) {
            if (!(e3 instanceof i.ClaimPredicate)) throw new Error("left Predicate should be an xdr.ClaimPredicate");
            if (!(t3 instanceof i.ClaimPredicate)) throw new Error("right Predicate should be an xdr.ClaimPredicate");
            return i.ClaimPredicate.claimPredicateAnd([e3, t3]);
          } }, { key: "predicateOr", value: function(e3, t3) {
            if (!(e3 instanceof i.ClaimPredicate)) throw new Error("left Predicate should be an xdr.ClaimPredicate");
            if (!(t3 instanceof i.ClaimPredicate)) throw new Error("right Predicate should be an xdr.ClaimPredicate");
            return i.ClaimPredicate.claimPredicateOr([e3, t3]);
          } }, { key: "predicateNot", value: function(e3) {
            if (!(e3 instanceof i.ClaimPredicate)) throw new Error("right Predicate should be an xdr.ClaimPredicate");
            return i.ClaimPredicate.claimPredicateNot(e3);
          } }, { key: "predicateBeforeAbsoluteTime", value: function(e3) {
            return i.ClaimPredicate.claimPredicateBeforeAbsoluteTime(i.Int64.fromString(e3));
          } }, { key: "predicateBeforeRelativeTime", value: function(e3) {
            return i.ClaimPredicate.claimPredicateBeforeRelativeTime(i.Int64.fromString(e3));
          } }, { key: "fromXDR", value: function(e3) {
            var t3;
            if (e3.switch() === i.ClaimantType.claimantTypeV0()) return t3 = e3.v0(), new this(tr.encodeEd25519PublicKey(t3.destination().ed25519()), t3.predicate());
            throw new Error("Invalid claimant type: ".concat(e3.switch().name));
          } }]);
        })();
        function sn(e3) {
          return sn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, sn(e3);
        }
        function un(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, cn(n2.key), n2);
          }
        }
        function cn(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != sn(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != sn(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == sn(t3) ? t3 : t3 + "";
        }
        var ln = (function() {
          return (function(e3, t3, r3) {
            return t3 && un(e3.prototype, t3), r3 && un(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          })(function e3(t3) {
            if ((function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3), !t3) throw new Error("liquidityPoolId cannot be empty");
            if (!/^[a-f0-9]{64}$/.test(t3)) throw new Error("Liquidity pool ID is not a valid hash");
            this.liquidityPoolId = t3;
          }, [{ key: "toXDRObject", value: function() {
            var e3 = i.PoolId.fromXDR(this.liquidityPoolId, "hex");
            return new i.TrustLineAsset("assetTypePoolShare", e3);
          } }, { key: "getLiquidityPoolId", value: function() {
            return String(this.liquidityPoolId);
          } }, { key: "getAssetType", value: function() {
            return "liquidity_pool_shares";
          } }, { key: "equals", value: function(e3) {
            return this.liquidityPoolId === e3.getLiquidityPoolId();
          } }, { key: "toString", value: function() {
            return "liquidity_pool:".concat(this.liquidityPoolId);
          } }], [{ key: "fromOperation", value: function(e3) {
            var t3 = e3.switch();
            if (t3 === i.AssetType.assetTypePoolShare()) return new this(e3.liquidityPoolId().toString("hex"));
            throw new Error("Invalid asset type: ".concat(t3.name));
          } }]);
        })();
        var fn = r2(8287).Buffer;
        function pn(e3) {
          return tr.isValidMed25519PublicKey(e3) ? (function(e4) {
            var t3 = tr.decodeMed25519PublicKey(e4);
            return i.MuxedAccount.keyTypeMuxedEd25519(new i.MuxedAccountMed25519({ id: i.Uint64.fromXDR(t3.subarray(-8)), ed25519: t3.subarray(0, -8) }));
          })(e3) : i.MuxedAccount.keyTypeEd25519(tr.decodeEd25519PublicKey(e3));
        }
        function dn(e3) {
          return e3.switch().value === i.CryptoKeyType.keyTypeMuxedEd25519().value ? (function(e4) {
            if (e4.switch() === i.CryptoKeyType.keyTypeEd25519()) return dn(e4);
            var t3 = e4.med25519();
            return tr.encodeMed25519PublicKey(fn.concat([t3.ed25519(), t3.id().toXDR("raw")]));
          })(e3) : tr.encodeEd25519PublicKey(e3.ed25519());
        }
        function hn(e3, t3) {
          if (!tr.isValidEd25519PublicKey(e3)) throw new Error("address should be a Stellar account ID (G...)");
          if ("string" != typeof t3) throw new Error("id should be a string representing a number (uint64)");
          return i.MuxedAccount.keyTypeMuxedEd25519(new i.MuxedAccountMed25519({ id: i.Uint64.fromString(t3), ed25519: tr.decodeEd25519PublicKey(e3) }));
        }
        function yn(e3) {
          if (tr.isValidEd25519PublicKey(e3)) return e3;
          if (!tr.isValidMed25519PublicKey(e3)) throw new TypeError("expected muxed account (M...), got ".concat(e3));
          var t3 = pn(e3);
          return tr.encodeEd25519PublicKey(t3.med25519().ed25519());
        }
        function mn(e3) {
          if ("string" != typeof e3 || 72 !== e3.length) throw new Error("must provide a valid claimable balance id");
        }
        var gn = r2(8287).Buffer;
        var vn = r2(8287).Buffer;
        function bn(e3, t3) {
          if (e3 >= 0 && e3 <= 255) return true;
          throw new Error("".concat(t3, " value must be between 0 and 255"));
        }
        var wn = r2(8287).Buffer;
        function Sn(e3) {
          return Sn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, Sn(e3);
        }
        var En = r2(8287).Buffer;
        function kn(e3) {
          return kn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, kn(e3);
        }
        function An(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, Tn(n2.key), n2);
          }
        }
        function Tn(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != kn(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != kn(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == kn(t3) ? t3 : t3 + "";
        }
        var On = (function() {
          function e3(t3) {
            if ((function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3), tr.isValidEd25519PublicKey(t3)) this._type = "account", this._key = tr.decodeEd25519PublicKey(t3);
            else if (tr.isValidContract(t3)) this._type = "contract", this._key = tr.decodeContract(t3);
            else if (tr.isValidMed25519PublicKey(t3)) this._type = "muxedAccount", this._key = tr.decodeMed25519PublicKey(t3);
            else if (tr.isValidClaimableBalance(t3)) this._type = "claimableBalance", this._key = tr.decodeClaimableBalance(t3);
            else {
              if (!tr.isValidLiquidityPool(t3)) throw new Error("Unsupported address type: ".concat(t3));
              this._type = "liquidityPool", this._key = tr.decodeLiquidityPool(t3);
            }
          }
          return (function(e4, t3, r3) {
            return t3 && An(e4.prototype, t3), r3 && An(e4, r3), Object.defineProperty(e4, "prototype", { writable: false }), e4;
          })(e3, [{ key: "toString", value: function() {
            switch (this._type) {
              case "account":
                return tr.encodeEd25519PublicKey(this._key);
              case "contract":
                return tr.encodeContract(this._key);
              case "claimableBalance":
                return tr.encodeClaimableBalance(this._key);
              case "liquidityPool":
                return tr.encodeLiquidityPool(this._key);
              case "muxedAccount":
                return tr.encodeMed25519PublicKey(this._key);
              default:
                throw new Error("Unsupported address type");
            }
          } }, { key: "toScVal", value: function() {
            return i.ScVal.scvAddress(this.toScAddress());
          } }, { key: "toScAddress", value: function() {
            switch (this._type) {
              case "account":
                return i.ScAddress.scAddressTypeAccount(i.PublicKey.publicKeyTypeEd25519(this._key));
              case "contract":
                return i.ScAddress.scAddressTypeContract(this._key);
              case "liquidityPool":
                return i.ScAddress.scAddressTypeLiquidityPool(this._key);
              case "claimableBalance":
                return i.ScAddress.scAddressTypeClaimableBalance(new i.ClaimableBalanceId("claimableBalanceIdTypeV".concat(this._key.at(0)), this._key.subarray(1)));
              case "muxedAccount":
                return i.ScAddress.scAddressTypeMuxedAccount(new i.MuxedEd25519Account({ ed25519: this._key.subarray(0, 32), id: i.Uint64.fromXDR(this._key.subarray(32, 40), "raw") }));
              default:
                throw new Error("Unsupported address type: ".concat(this._type));
            }
          } }, { key: "toBuffer", value: function() {
            return this._key;
          } }], [{ key: "fromString", value: function(t3) {
            return new e3(t3);
          } }, { key: "account", value: function(t3) {
            return new e3(tr.encodeEd25519PublicKey(t3));
          } }, { key: "contract", value: function(t3) {
            return new e3(tr.encodeContract(t3));
          } }, { key: "claimableBalance", value: function(t3) {
            return new e3(tr.encodeClaimableBalance(t3));
          } }, { key: "liquidityPool", value: function(t3) {
            return new e3(tr.encodeLiquidityPool(t3));
          } }, { key: "muxedAccount", value: function(t3) {
            return new e3(tr.encodeMed25519PublicKey(t3));
          } }, { key: "fromScVal", value: function(t3) {
            return e3.fromScAddress(t3.address());
          } }, { key: "fromScAddress", value: function(t3) {
            switch (t3.switch().value) {
              case i.ScAddressType.scAddressTypeAccount().value:
                return e3.account(t3.accountId().ed25519());
              case i.ScAddressType.scAddressTypeContract().value:
                return e3.contract(t3.contractId());
              case i.ScAddressType.scAddressTypeMuxedAccount().value:
                var r3 = En.concat([t3.muxedAccount().ed25519(), t3.muxedAccount().id().toXDR("raw")]);
                return e3.muxedAccount(r3);
              case i.ScAddressType.scAddressTypeClaimableBalance().value:
                return e3.claimableBalance(t3.claimableBalanceId());
              case i.ScAddressType.scAddressTypeLiquidityPool().value:
                return e3.liquidityPool(t3.liquidityPoolId());
              default:
                throw new Error("Unsupported address type: ".concat(t3.switch().name));
            }
          } }]);
        })(), xn = r2(8287).Buffer;
        function Pn(e3, t3) {
          return (function(e4) {
            if (Array.isArray(e4)) return e4;
          })(e3) || (function(e4, t4) {
            var r3 = null == e4 ? null : "undefined" != typeof Symbol && e4[Symbol.iterator] || e4["@@iterator"];
            if (null != r3) {
              var n2, o2, i2, a2, s2 = [], u2 = true, c2 = false;
              try {
                if (i2 = (r3 = r3.call(e4)).next, 0 === t4) {
                  if (Object(r3) !== r3) return;
                  u2 = false;
                } else for (; !(u2 = (n2 = i2.call(r3)).done) && (s2.push(n2.value), s2.length !== t4); u2 = true) ;
              } catch (e5) {
                c2 = true, o2 = e5;
              } finally {
                try {
                  if (!u2 && null != r3.return && (a2 = r3.return(), Object(a2) !== a2)) return;
                } finally {
                  if (c2) throw o2;
                }
              }
              return s2;
            }
          })(e3, t3) || (function(e4, t4) {
            if (e4) {
              if ("string" == typeof e4) return Bn(e4, t4);
              var r3 = {}.toString.call(e4).slice(8, -1);
              return "Object" === r3 && e4.constructor && (r3 = e4.constructor.name), "Map" === r3 || "Set" === r3 ? Array.from(e4) : "Arguments" === r3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3) ? Bn(e4, t4) : void 0;
            }
          })(e3, t3) || (function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          })();
        }
        function Bn(e3, t3) {
          (null == t3 || t3 > e3.length) && (t3 = e3.length);
          for (var r3 = 0, n2 = Array(t3); r3 < t3; r3++) n2[r3] = e3[r3];
          return n2;
        }
        function In(e3) {
          return In = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, In(e3);
        }
        function Cn(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, Rn(n2.key), n2);
          }
        }
        function Rn(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != In(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != In(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == In(t3) ? t3 : t3 + "";
        }
        var _n = 1e7, Un = 1, Nn = 2, Ln = 4, Fn = 8, jn = (function() {
          return (function(e3, t3, r3) {
            return t3 && Cn(e3.prototype, t3), r3 && Cn(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          })(function e3() {
            !(function(e4, t3) {
              if (!(e4 instanceof t3)) throw new TypeError("Cannot call a class as a function");
            })(this, e3);
          }, null, [{ key: "setSourceAccount", value: function(e3, t3) {
            if (t3.source) try {
              e3.sourceAccount = pn(t3.source);
            } catch (e4) {
              throw new Error("Source address is invalid");
            }
          } }, { key: "fromXDRObject", value: function(e3) {
            var t3 = {};
            e3.sourceAccount() && (t3.source = dn(e3.sourceAccount()));
            var r3 = e3.body().value(), n2 = e3.body().switch().name;
            switch (n2) {
              case "createAccount":
                t3.type = "createAccount", t3.destination = Mn(r3.destination()), t3.startingBalance = this._fromXDRAmount(r3.startingBalance());
                break;
              case "payment":
                t3.type = "payment", t3.destination = dn(r3.destination()), t3.asset = yr.fromOperation(r3.asset()), t3.amount = this._fromXDRAmount(r3.amount());
                break;
              case "pathPaymentStrictReceive":
                t3.type = "pathPaymentStrictReceive", t3.sendAsset = yr.fromOperation(r3.sendAsset()), t3.sendMax = this._fromXDRAmount(r3.sendMax()), t3.destination = dn(r3.destination()), t3.destAsset = yr.fromOperation(r3.destAsset()), t3.destAmount = this._fromXDRAmount(r3.destAmount()), t3.path = [];
                var o2 = r3.path();
                Object.keys(o2).forEach(function(e4) {
                  t3.path.push(yr.fromOperation(o2[e4]));
                });
                break;
              case "pathPaymentStrictSend":
                t3.type = "pathPaymentStrictSend", t3.sendAsset = yr.fromOperation(r3.sendAsset()), t3.sendAmount = this._fromXDRAmount(r3.sendAmount()), t3.destination = dn(r3.destination()), t3.destAsset = yr.fromOperation(r3.destAsset()), t3.destMin = this._fromXDRAmount(r3.destMin()), t3.path = [];
                var a2 = r3.path();
                Object.keys(a2).forEach(function(e4) {
                  t3.path.push(yr.fromOperation(a2[e4]));
                });
                break;
              case "changeTrust":
                if (t3.type = "changeTrust", r3.line().switch() === i.AssetType.assetTypePoolShare()) t3.line = tn.fromOperation(r3.line());
                else t3.line = yr.fromOperation(r3.line());
                t3.limit = this._fromXDRAmount(r3.limit());
                break;
              case "allowTrust":
                t3.type = "allowTrust", t3.trustor = Mn(r3.trustor()), t3.assetCode = r3.asset().value().toString(), t3.assetCode = Ht(t3.assetCode, "\0"), t3.authorize = r3.authorize();
                break;
              case "setOptions":
                if (t3.type = "setOptions", r3.inflationDest() && (t3.inflationDest = Mn(r3.inflationDest())), t3.clearFlags = r3.clearFlags(), t3.setFlags = r3.setFlags(), t3.masterWeight = r3.masterWeight(), t3.lowThreshold = r3.lowThreshold(), t3.medThreshold = r3.medThreshold(), t3.highThreshold = r3.highThreshold(), t3.homeDomain = void 0 !== r3.homeDomain() ? r3.homeDomain().toString("ascii") : void 0, r3.signer()) {
                  var s2 = {}, u2 = r3.signer().key().arm();
                  if ("ed25519" === u2) s2.ed25519PublicKey = Mn(r3.signer().key());
                  else if ("preAuthTx" === u2) s2.preAuthTx = r3.signer().key().preAuthTx();
                  else if ("hashX" === u2) s2.sha256Hash = r3.signer().key().hashX();
                  else if ("ed25519SignedPayload" === u2) {
                    var c2 = r3.signer().key().ed25519SignedPayload();
                    s2.ed25519SignedPayload = tr.encodeSignedPayload(c2.toXDR());
                  }
                  s2.weight = r3.signer().weight(), t3.signer = s2;
                }
                break;
              case "manageOffer":
              case "manageSellOffer":
                t3.type = "manageSellOffer", t3.selling = yr.fromOperation(r3.selling()), t3.buying = yr.fromOperation(r3.buying()), t3.amount = this._fromXDRAmount(r3.amount()), t3.price = this._fromXDRPrice(r3.price()), t3.offerId = r3.offerId().toString();
                break;
              case "manageBuyOffer":
                t3.type = "manageBuyOffer", t3.selling = yr.fromOperation(r3.selling()), t3.buying = yr.fromOperation(r3.buying()), t3.buyAmount = this._fromXDRAmount(r3.buyAmount()), t3.price = this._fromXDRPrice(r3.price()), t3.offerId = r3.offerId().toString();
                break;
              case "createPassiveOffer":
              case "createPassiveSellOffer":
                t3.type = "createPassiveSellOffer", t3.selling = yr.fromOperation(r3.selling()), t3.buying = yr.fromOperation(r3.buying()), t3.amount = this._fromXDRAmount(r3.amount()), t3.price = this._fromXDRPrice(r3.price());
                break;
              case "accountMerge":
                t3.type = "accountMerge", t3.destination = dn(r3);
                break;
              case "manageData":
                t3.type = "manageData", t3.name = r3.dataName().toString("ascii"), t3.value = r3.dataValue();
                break;
              case "inflation":
                t3.type = "inflation";
                break;
              case "bumpSequence":
                t3.type = "bumpSequence", t3.bumpTo = r3.bumpTo().toString();
                break;
              case "createClaimableBalance":
                t3.type = "createClaimableBalance", t3.asset = yr.fromOperation(r3.asset()), t3.amount = this._fromXDRAmount(r3.amount()), t3.claimants = [], r3.claimants().forEach(function(e4) {
                  t3.claimants.push(an.fromXDR(e4));
                });
                break;
              case "claimClaimableBalance":
                t3.type = "claimClaimableBalance", t3.balanceId = r3.toXDR("hex");
                break;
              case "beginSponsoringFutureReserves":
                t3.type = "beginSponsoringFutureReserves", t3.sponsoredId = Mn(r3.sponsoredId());
                break;
              case "endSponsoringFutureReserves":
                t3.type = "endSponsoringFutureReserves";
                break;
              case "revokeSponsorship":
                !(function(e4, t4) {
                  switch (e4.switch().name) {
                    case "revokeSponsorshipLedgerEntry":
                      var r4 = e4.ledgerKey();
                      switch (r4.switch().name) {
                        case i.LedgerEntryType.account().name:
                          t4.type = "revokeAccountSponsorship", t4.account = Mn(r4.account().accountId());
                          break;
                        case i.LedgerEntryType.trustline().name:
                          t4.type = "revokeTrustlineSponsorship", t4.account = Mn(r4.trustLine().accountId());
                          var n3 = r4.trustLine().asset();
                          if (n3.switch() === i.AssetType.assetTypePoolShare()) t4.asset = ln.fromOperation(n3);
                          else t4.asset = yr.fromOperation(n3);
                          break;
                        case i.LedgerEntryType.offer().name:
                          t4.type = "revokeOfferSponsorship", t4.seller = Mn(r4.offer().sellerId()), t4.offerId = r4.offer().offerId().toString();
                          break;
                        case i.LedgerEntryType.data().name:
                          t4.type = "revokeDataSponsorship", t4.account = Mn(r4.data().accountId()), t4.name = r4.data().dataName().toString("ascii");
                          break;
                        case i.LedgerEntryType.claimableBalance().name:
                          t4.type = "revokeClaimableBalanceSponsorship", t4.balanceId = r4.claimableBalance().balanceId().toXDR("hex");
                          break;
                        case i.LedgerEntryType.liquidityPool().name:
                          t4.type = "revokeLiquidityPoolSponsorship", t4.liquidityPoolId = r4.liquidityPool().liquidityPoolId().toString("hex");
                          break;
                        default:
                          throw new Error("Unknown ledgerKey: ".concat(e4.switch().name));
                      }
                      break;
                    case "revokeSponsorshipSigner":
                      t4.type = "revokeSignerSponsorship", t4.account = Mn(e4.signer().accountId()), t4.signer = (function(e5) {
                        var t5 = {};
                        switch (e5.switch().name) {
                          case i.SignerKeyType.signerKeyTypeEd25519().name:
                            t5.ed25519PublicKey = tr.encodeEd25519PublicKey(e5.ed25519());
                            break;
                          case i.SignerKeyType.signerKeyTypePreAuthTx().name:
                            t5.preAuthTx = e5.preAuthTx().toString("hex");
                            break;
                          case i.SignerKeyType.signerKeyTypeHashX().name:
                            t5.sha256Hash = e5.hashX().toString("hex");
                            break;
                          default:
                            throw new Error("Unknown signerKey: ".concat(e5.switch().name));
                        }
                        return t5;
                      })(e4.signer().signerKey());
                      break;
                    default:
                      throw new Error("Unknown revokeSponsorship: ".concat(e4.switch().name));
                  }
                })(r3, t3);
                break;
              case "clawback":
                t3.type = "clawback", t3.amount = this._fromXDRAmount(r3.amount()), t3.from = dn(r3.from()), t3.asset = yr.fromOperation(r3.asset());
                break;
              case "clawbackClaimableBalance":
                t3.type = "clawbackClaimableBalance", t3.balanceId = r3.toXDR("hex");
                break;
              case "setTrustLineFlags":
                t3.type = "setTrustLineFlags", t3.asset = yr.fromOperation(r3.asset()), t3.trustor = Mn(r3.trustor());
                var l2 = r3.clearFlags(), f2 = r3.setFlags(), p2 = { authorized: i.TrustLineFlags.authorizedFlag(), authorizedToMaintainLiabilities: i.TrustLineFlags.authorizedToMaintainLiabilitiesFlag(), clawbackEnabled: i.TrustLineFlags.trustlineClawbackEnabledFlag() };
                t3.flags = {}, Object.keys(p2).forEach(function(e4) {
                  var r4;
                  t3.flags[e4] = (r4 = p2[e4].value, !!(f2 & r4) || !(l2 & r4) && void 0);
                });
                break;
              case "liquidityPoolDeposit":
                t3.type = "liquidityPoolDeposit", t3.liquidityPoolId = r3.liquidityPoolId().toString("hex"), t3.maxAmountA = this._fromXDRAmount(r3.maxAmountA()), t3.maxAmountB = this._fromXDRAmount(r3.maxAmountB()), t3.minPrice = this._fromXDRPrice(r3.minPrice()), t3.maxPrice = this._fromXDRPrice(r3.maxPrice());
                break;
              case "liquidityPoolWithdraw":
                t3.type = "liquidityPoolWithdraw", t3.liquidityPoolId = r3.liquidityPoolId().toString("hex"), t3.amount = this._fromXDRAmount(r3.amount()), t3.minAmountA = this._fromXDRAmount(r3.minAmountA()), t3.minAmountB = this._fromXDRAmount(r3.minAmountB());
                break;
              case "invokeHostFunction":
                var d2;
                t3.type = "invokeHostFunction", t3.func = r3.hostFunction(), t3.auth = null !== (d2 = r3.auth()) && void 0 !== d2 ? d2 : [];
                break;
              case "extendFootprintTtl":
                t3.type = "extendFootprintTtl", t3.extendTo = r3.extendTo();
                break;
              case "restoreFootprint":
                t3.type = "restoreFootprint";
                break;
              default:
                throw new Error("Unknown operation: ".concat(n2));
            }
            return t3;
          } }, { key: "isValidAmount", value: function(e3) {
            var t3, r3 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            if ("string" != typeof e3) return false;
            try {
              t3 = new zr(e3);
            } catch (e4) {
              return false;
            }
            return !(!r3 && t3.isZero() || t3.isNegative() || t3.times(_n).gt(new zr("9223372036854775807").toString()) || t3.decimalPlaces() > 7 || t3.isNaN() || !t3.isFinite());
          } }, { key: "constructAmountRequirementsError", value: function(e3) {
            return "".concat(e3, " argument must be of type String, represent a positive number and have at most 7 digits after the decimal");
          } }, { key: "_checkUnsignedIntValue", value: function(e3, t3) {
            var r3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
            if (void 0 !== t3) switch ("string" == typeof t3 && (t3 = parseFloat(t3)), true) {
              case ("number" != typeof t3 || !Number.isFinite(t3) || t3 % 1 != 0):
                throw new Error("".concat(e3, " value is invalid"));
              case t3 < 0:
                throw new Error("".concat(e3, " value must be unsigned"));
              case (!r3 || r3 && r3(t3, e3)):
                return t3;
              default:
                throw new Error("".concat(e3, " value is invalid"));
            }
          } }, { key: "_toXDRAmount", value: function(e3) {
            var t3 = new zr(e3).times(_n);
            return n.Hyper.fromString(t3.toString());
          } }, { key: "_fromXDRAmount", value: function(e3) {
            return new zr(e3).div(_n).toFixed(7);
          } }, { key: "_fromXDRPrice", value: function(e3) {
            return new zr(e3.n()).div(new zr(e3.d())).toString();
          } }, { key: "_toXDRPrice", value: function(e3) {
            var t3;
            if (e3.n && e3.d) t3 = new i.Price(e3);
            else {
              var r3 = (function(e4) {
                for (var t4, r4, n2 = new zr(e4), o2 = [[new zr(0), new zr(1)], [new zr(1), new zr(0)]], i2 = 2; !n2.gt(Gr); ) {
                  t4 = n2.integerValue(zr.ROUND_FLOOR), r4 = n2.minus(t4);
                  var a2 = t4.times(o2[i2 - 1][0]).plus(o2[i2 - 2][0]), s2 = t4.times(o2[i2 - 1][1]).plus(o2[i2 - 2][1]);
                  if (a2.gt(Gr) || s2.gt(Gr)) break;
                  if (o2.push([a2, s2]), r4.eq(0)) break;
                  n2 = new zr(1).div(r4), i2 += 1;
                }
                var u2 = Xr(o2[o2.length - 1], 2), c2 = u2[0], l2 = u2[1];
                if (c2.isZero() || l2.isZero()) throw new Error("Couldn't find approximation");
                return [c2.toNumber(), l2.toNumber()];
              })(e3);
              t3 = new i.Price({ n: parseInt(r3[0], 10), d: parseInt(r3[1], 10) });
            }
            if (t3.n() < 0 || t3.d() < 0) throw new Error("price must be positive");
            return t3;
          } }]);
        })();
        function Mn(e3) {
          return tr.encodeEd25519PublicKey(e3.ed25519());
        }
        jn.accountMerge = function(e3) {
          var t3 = {};
          try {
            t3.body = i.OperationBody.accountMerge(pn(e3.destination));
          } catch (e4) {
            throw new Error("destination is invalid");
          }
          return this.setSourceAccount(t3, e3), new i.Operation(t3);
        }, jn.allowTrust = function(e3) {
          if (!tr.isValidEd25519PublicKey(e3.trustor)) throw new Error("trustor is invalid");
          var t3 = {};
          if (t3.trustor = lr.fromPublicKey(e3.trustor).xdrAccountId(), e3.assetCode.length <= 4) {
            var r3 = e3.assetCode.padEnd(4, "\0");
            t3.asset = i.AssetCode.assetTypeCreditAlphanum4(r3);
          } else {
            if (!(e3.assetCode.length <= 12)) throw new Error("Asset code must be 12 characters at max.");
            var n2 = e3.assetCode.padEnd(12, "\0");
            t3.asset = i.AssetCode.assetTypeCreditAlphanum12(n2);
          }
          "boolean" == typeof e3.authorize ? e3.authorize ? t3.authorize = i.TrustLineFlags.authorizedFlag().value : t3.authorize = 0 : t3.authorize = e3.authorize;
          var o2 = new i.AllowTrustOp(t3), a2 = {};
          return a2.body = i.OperationBody.allowTrust(o2), this.setSourceAccount(a2, e3), new i.Operation(a2);
        }, jn.bumpSequence = function(e3) {
          var t3 = {};
          if ("string" != typeof e3.bumpTo) throw new Error("bumpTo must be a string");
          try {
            new zr(e3.bumpTo);
          } catch (e4) {
            throw new Error("bumpTo must be a stringified number");
          }
          t3.bumpTo = n.Hyper.fromString(e3.bumpTo);
          var r3 = new i.BumpSequenceOp(t3), o2 = {};
          return o2.body = i.OperationBody.bumpSequence(r3), this.setSourceAccount(o2, e3), new i.Operation(o2);
        }, jn.changeTrust = function(e3) {
          var t3 = {};
          if (e3.asset instanceof yr) t3.line = e3.asset.toChangeTrustXDRObject();
          else {
            if (!(e3.asset instanceof tn)) throw new TypeError("asset must be Asset or LiquidityPoolAsset");
            t3.line = e3.asset.toXDRObject();
          }
          if (void 0 !== e3.limit && !this.isValidAmount(e3.limit, true)) throw new TypeError(this.constructAmountRequirementsError("limit"));
          e3.limit ? t3.limit = this._toXDRAmount(e3.limit) : t3.limit = n.Hyper.fromString(new zr("9223372036854775807").toString()), e3.source && (t3.source = e3.source.masterKeypair);
          var r3 = new i.ChangeTrustOp(t3), o2 = {};
          return o2.body = i.OperationBody.changeTrust(r3), this.setSourceAccount(o2, e3), new i.Operation(o2);
        }, jn.createAccount = function(e3) {
          if (!tr.isValidEd25519PublicKey(e3.destination)) throw new Error("destination is invalid");
          if (!this.isValidAmount(e3.startingBalance, true)) throw new TypeError(this.constructAmountRequirementsError("startingBalance"));
          var t3 = {};
          t3.destination = lr.fromPublicKey(e3.destination).xdrAccountId(), t3.startingBalance = this._toXDRAmount(e3.startingBalance);
          var r3 = new i.CreateAccountOp(t3), n2 = {};
          return n2.body = i.OperationBody.createAccount(r3), this.setSourceAccount(n2, e3), new i.Operation(n2);
        }, jn.createClaimableBalance = function(e3) {
          if (!(e3.asset instanceof yr)) throw new Error("must provide an asset for create claimable balance operation");
          if (!this.isValidAmount(e3.amount)) throw new TypeError(this.constructAmountRequirementsError("amount"));
          if (!Array.isArray(e3.claimants) || 0 === e3.claimants.length) throw new Error("must provide at least one claimant");
          var t3 = {};
          t3.asset = e3.asset.toXDRObject(), t3.amount = this._toXDRAmount(e3.amount), t3.claimants = Object.values(e3.claimants).map(function(e4) {
            return e4.toXDRObject();
          });
          var r3 = new i.CreateClaimableBalanceOp(t3), n2 = {};
          return n2.body = i.OperationBody.createClaimableBalance(r3), this.setSourceAccount(n2, e3), new i.Operation(n2);
        }, jn.claimClaimableBalance = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          mn(e3.balanceId);
          var t3 = {};
          t3.balanceId = i.ClaimableBalanceId.fromXDR(e3.balanceId, "hex");
          var r3 = new i.ClaimClaimableBalanceOp(t3), n2 = {};
          return n2.body = i.OperationBody.claimClaimableBalance(r3), this.setSourceAccount(n2, e3), new i.Operation(n2);
        }, jn.clawbackClaimableBalance = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          mn(e3.balanceId);
          var t3 = { balanceId: i.ClaimableBalanceId.fromXDR(e3.balanceId, "hex") }, r3 = { body: i.OperationBody.clawbackClaimableBalance(new i.ClawbackClaimableBalanceOp(t3)) };
          return this.setSourceAccount(r3, e3), new i.Operation(r3);
        }, jn.createPassiveSellOffer = function(e3) {
          var t3 = {};
          if (t3.selling = e3.selling.toXDRObject(), t3.buying = e3.buying.toXDRObject(), !this.isValidAmount(e3.amount)) throw new TypeError(this.constructAmountRequirementsError("amount"));
          if (t3.amount = this._toXDRAmount(e3.amount), void 0 === e3.price) throw new TypeError("price argument is required");
          t3.price = this._toXDRPrice(e3.price);
          var r3 = new i.CreatePassiveSellOfferOp(t3), n2 = {};
          return n2.body = i.OperationBody.createPassiveSellOffer(r3), this.setSourceAccount(n2, e3), new i.Operation(n2);
        }, jn.inflation = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t3 = {};
          return t3.body = i.OperationBody.inflation(), this.setSourceAccount(t3, e3), new i.Operation(t3);
        }, jn.manageData = function(e3) {
          var t3 = {};
          if (!("string" == typeof e3.name && e3.name.length <= 64)) throw new Error("name must be a string, up to 64 characters");
          if (t3.dataName = e3.name, "string" != typeof e3.value && !gn.isBuffer(e3.value) && null !== e3.value) throw new Error("value must be a string, Buffer or null");
          if ("string" == typeof e3.value ? t3.dataValue = gn.from(e3.value) : t3.dataValue = e3.value, null !== t3.dataValue && t3.dataValue.length > 64) throw new Error("value cannot be longer that 64 bytes");
          var r3 = new i.ManageDataOp(t3), n2 = {};
          return n2.body = i.OperationBody.manageData(r3), this.setSourceAccount(n2, e3), new i.Operation(n2);
        }, jn.manageSellOffer = function(e3) {
          var t3 = {};
          if (t3.selling = e3.selling.toXDRObject(), t3.buying = e3.buying.toXDRObject(), !this.isValidAmount(e3.amount, true)) throw new TypeError(this.constructAmountRequirementsError("amount"));
          if (t3.amount = this._toXDRAmount(e3.amount), void 0 === e3.price) throw new TypeError("price argument is required");
          t3.price = this._toXDRPrice(e3.price), void 0 !== e3.offerId ? e3.offerId = e3.offerId.toString() : e3.offerId = "0", t3.offerId = n.Hyper.fromString(e3.offerId);
          var r3 = new i.ManageSellOfferOp(t3), o2 = {};
          return o2.body = i.OperationBody.manageSellOffer(r3), this.setSourceAccount(o2, e3), new i.Operation(o2);
        }, jn.manageBuyOffer = function(e3) {
          var t3 = {};
          if (t3.selling = e3.selling.toXDRObject(), t3.buying = e3.buying.toXDRObject(), !this.isValidAmount(e3.buyAmount, true)) throw new TypeError(this.constructAmountRequirementsError("buyAmount"));
          if (t3.buyAmount = this._toXDRAmount(e3.buyAmount), void 0 === e3.price) throw new TypeError("price argument is required");
          t3.price = this._toXDRPrice(e3.price), void 0 !== e3.offerId ? e3.offerId = e3.offerId.toString() : e3.offerId = "0", t3.offerId = n.Hyper.fromString(e3.offerId);
          var r3 = new i.ManageBuyOfferOp(t3), o2 = {};
          return o2.body = i.OperationBody.manageBuyOffer(r3), this.setSourceAccount(o2, e3), new i.Operation(o2);
        }, jn.pathPaymentStrictReceive = function(e3) {
          switch (true) {
            case !e3.sendAsset:
              throw new Error("Must specify a send asset");
            case !this.isValidAmount(e3.sendMax):
              throw new TypeError(this.constructAmountRequirementsError("sendMax"));
            case !e3.destAsset:
              throw new Error("Must provide a destAsset for a payment operation");
            case !this.isValidAmount(e3.destAmount):
              throw new TypeError(this.constructAmountRequirementsError("destAmount"));
          }
          var t3 = {};
          t3.sendAsset = e3.sendAsset.toXDRObject(), t3.sendMax = this._toXDRAmount(e3.sendMax);
          try {
            t3.destination = pn(e3.destination);
          } catch (e4) {
            throw new Error("destination is invalid");
          }
          t3.destAsset = e3.destAsset.toXDRObject(), t3.destAmount = this._toXDRAmount(e3.destAmount);
          var r3 = e3.path ? e3.path : [];
          t3.path = r3.map(function(e4) {
            return e4.toXDRObject();
          });
          var n2 = new i.PathPaymentStrictReceiveOp(t3), o2 = {};
          return o2.body = i.OperationBody.pathPaymentStrictReceive(n2), this.setSourceAccount(o2, e3), new i.Operation(o2);
        }, jn.pathPaymentStrictSend = function(e3) {
          switch (true) {
            case !e3.sendAsset:
              throw new Error("Must specify a send asset");
            case !this.isValidAmount(e3.sendAmount):
              throw new TypeError(this.constructAmountRequirementsError("sendAmount"));
            case !e3.destAsset:
              throw new Error("Must provide a destAsset for a payment operation");
            case !this.isValidAmount(e3.destMin):
              throw new TypeError(this.constructAmountRequirementsError("destMin"));
          }
          var t3 = {};
          t3.sendAsset = e3.sendAsset.toXDRObject(), t3.sendAmount = this._toXDRAmount(e3.sendAmount);
          try {
            t3.destination = pn(e3.destination);
          } catch (e4) {
            throw new Error("destination is invalid");
          }
          t3.destAsset = e3.destAsset.toXDRObject(), t3.destMin = this._toXDRAmount(e3.destMin);
          var r3 = e3.path ? e3.path : [];
          t3.path = r3.map(function(e4) {
            return e4.toXDRObject();
          });
          var n2 = new i.PathPaymentStrictSendOp(t3), o2 = {};
          return o2.body = i.OperationBody.pathPaymentStrictSend(n2), this.setSourceAccount(o2, e3), new i.Operation(o2);
        }, jn.payment = function(e3) {
          if (!e3.asset) throw new Error("Must provide an asset for a payment operation");
          if (!this.isValidAmount(e3.amount)) throw new TypeError(this.constructAmountRequirementsError("amount"));
          var t3 = {};
          try {
            t3.destination = pn(e3.destination);
          } catch (e4) {
            throw new Error("destination is invalid");
          }
          t3.asset = e3.asset.toXDRObject(), t3.amount = this._toXDRAmount(e3.amount);
          var r3 = new i.PaymentOp(t3), n2 = {};
          return n2.body = i.OperationBody.payment(r3), this.setSourceAccount(n2, e3), new i.Operation(n2);
        }, jn.setOptions = function(e3) {
          var t3 = {};
          if (e3.inflationDest) {
            if (!tr.isValidEd25519PublicKey(e3.inflationDest)) throw new Error("inflationDest is invalid");
            t3.inflationDest = lr.fromPublicKey(e3.inflationDest).xdrAccountId();
          }
          if (t3.clearFlags = this._checkUnsignedIntValue("clearFlags", e3.clearFlags), t3.setFlags = this._checkUnsignedIntValue("setFlags", e3.setFlags), t3.masterWeight = this._checkUnsignedIntValue("masterWeight", e3.masterWeight, bn), t3.lowThreshold = this._checkUnsignedIntValue("lowThreshold", e3.lowThreshold, bn), t3.medThreshold = this._checkUnsignedIntValue("medThreshold", e3.medThreshold, bn), t3.highThreshold = this._checkUnsignedIntValue("highThreshold", e3.highThreshold, bn), void 0 !== e3.homeDomain && "string" != typeof e3.homeDomain) throw new TypeError("homeDomain argument must be of type String");
          if (t3.homeDomain = e3.homeDomain, e3.signer) {
            var r3, n2 = this._checkUnsignedIntValue("signer.weight", e3.signer.weight, bn), o2 = 0;
            if (e3.signer.ed25519PublicKey) {
              if (!tr.isValidEd25519PublicKey(e3.signer.ed25519PublicKey)) throw new Error("signer.ed25519PublicKey is invalid.");
              var a2 = tr.decodeEd25519PublicKey(e3.signer.ed25519PublicKey);
              r3 = new i.SignerKey.signerKeyTypeEd25519(a2), o2 += 1;
            }
            if (e3.signer.preAuthTx) {
              if ("string" == typeof e3.signer.preAuthTx && (e3.signer.preAuthTx = vn.from(e3.signer.preAuthTx, "hex")), !vn.isBuffer(e3.signer.preAuthTx) || 32 !== e3.signer.preAuthTx.length) throw new Error("signer.preAuthTx must be 32 bytes Buffer.");
              r3 = new i.SignerKey.signerKeyTypePreAuthTx(e3.signer.preAuthTx), o2 += 1;
            }
            if (e3.signer.sha256Hash) {
              if ("string" == typeof e3.signer.sha256Hash && (e3.signer.sha256Hash = vn.from(e3.signer.sha256Hash, "hex")), !vn.isBuffer(e3.signer.sha256Hash) || 32 !== e3.signer.sha256Hash.length) throw new Error("signer.sha256Hash must be 32 bytes Buffer.");
              r3 = new i.SignerKey.signerKeyTypeHashX(e3.signer.sha256Hash), o2 += 1;
            }
            if (e3.signer.ed25519SignedPayload) {
              if (!tr.isValidSignedPayload(e3.signer.ed25519SignedPayload)) throw new Error("signer.ed25519SignedPayload is invalid.");
              var s2 = tr.decodeSignedPayload(e3.signer.ed25519SignedPayload), u2 = i.SignerKeyEd25519SignedPayload.fromXDR(s2);
              r3 = i.SignerKey.signerKeyTypeEd25519SignedPayload(u2), o2 += 1;
            }
            if (1 !== o2) throw new Error("Signer object must contain exactly one of signer.ed25519PublicKey, signer.sha256Hash, signer.preAuthTx.");
            t3.signer = new i.Signer({ key: r3, weight: n2 });
          }
          var c2 = new i.SetOptionsOp(t3), l2 = {};
          return l2.body = i.OperationBody.setOptions(c2), this.setSourceAccount(l2, e3), new i.Operation(l2);
        }, jn.beginSponsoringFutureReserves = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          if (!tr.isValidEd25519PublicKey(e3.sponsoredId)) throw new Error("sponsoredId is invalid");
          var t3 = new i.BeginSponsoringFutureReservesOp({ sponsoredId: lr.fromPublicKey(e3.sponsoredId).xdrAccountId() }), r3 = {};
          return r3.body = i.OperationBody.beginSponsoringFutureReserves(t3), this.setSourceAccount(r3, e3), new i.Operation(r3);
        }, jn.endSponsoringFutureReserves = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t3 = {};
          return t3.body = i.OperationBody.endSponsoringFutureReserves(), this.setSourceAccount(t3, e3), new i.Operation(t3);
        }, jn.revokeAccountSponsorship = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          if (!tr.isValidEd25519PublicKey(e3.account)) throw new Error("account is invalid");
          var t3 = i.LedgerKey.account(new i.LedgerKeyAccount({ accountId: lr.fromPublicKey(e3.account).xdrAccountId() })), r3 = i.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(t3), n2 = {};
          return n2.body = i.OperationBody.revokeSponsorship(r3), this.setSourceAccount(n2, e3), new i.Operation(n2);
        }, jn.revokeTrustlineSponsorship = function() {
          var e3, t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          if (!tr.isValidEd25519PublicKey(t3.account)) throw new Error("account is invalid");
          if (t3.asset instanceof yr) e3 = t3.asset.toTrustLineXDRObject();
          else {
            if (!(t3.asset instanceof ln)) throw new TypeError("asset must be an Asset or LiquidityPoolId");
            e3 = t3.asset.toXDRObject();
          }
          var r3 = i.LedgerKey.trustline(new i.LedgerKeyTrustLine({ accountId: lr.fromPublicKey(t3.account).xdrAccountId(), asset: e3 })), n2 = i.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(r3), o2 = {};
          return o2.body = i.OperationBody.revokeSponsorship(n2), this.setSourceAccount(o2, t3), new i.Operation(o2);
        }, jn.revokeOfferSponsorship = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          if (!tr.isValidEd25519PublicKey(e3.seller)) throw new Error("seller is invalid");
          if ("string" != typeof e3.offerId) throw new Error("offerId is invalid");
          var t3 = i.LedgerKey.offer(new i.LedgerKeyOffer({ sellerId: lr.fromPublicKey(e3.seller).xdrAccountId(), offerId: i.Int64.fromString(e3.offerId) })), r3 = i.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(t3), n2 = {};
          return n2.body = i.OperationBody.revokeSponsorship(r3), this.setSourceAccount(n2, e3), new i.Operation(n2);
        }, jn.revokeDataSponsorship = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          if (!tr.isValidEd25519PublicKey(e3.account)) throw new Error("account is invalid");
          if ("string" != typeof e3.name || e3.name.length > 64) throw new Error("name must be a string, up to 64 characters");
          var t3 = i.LedgerKey.data(new i.LedgerKeyData({ accountId: lr.fromPublicKey(e3.account).xdrAccountId(), dataName: e3.name })), r3 = i.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(t3), n2 = {};
          return n2.body = i.OperationBody.revokeSponsorship(r3), this.setSourceAccount(n2, e3), new i.Operation(n2);
        }, jn.revokeClaimableBalanceSponsorship = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          if ("string" != typeof e3.balanceId) throw new Error("balanceId is invalid");
          var t3 = i.LedgerKey.claimableBalance(new i.LedgerKeyClaimableBalance({ balanceId: i.ClaimableBalanceId.fromXDR(e3.balanceId, "hex") })), r3 = i.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(t3), n2 = {};
          return n2.body = i.OperationBody.revokeSponsorship(r3), this.setSourceAccount(n2, e3), new i.Operation(n2);
        }, jn.revokeLiquidityPoolSponsorship = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          if ("string" != typeof e3.liquidityPoolId) throw new Error("liquidityPoolId is invalid");
          var t3 = i.LedgerKey.liquidityPool(new i.LedgerKeyLiquidityPool({ liquidityPoolId: i.PoolId.fromXDR(e3.liquidityPoolId, "hex") })), r3 = i.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(t3), n2 = { body: i.OperationBody.revokeSponsorship(r3) };
          return this.setSourceAccount(n2, e3), new i.Operation(n2);
        }, jn.revokeSignerSponsorship = function() {
          var e3, t3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          if (!tr.isValidEd25519PublicKey(t3.account)) throw new Error("account is invalid");
          if (t3.signer.ed25519PublicKey) {
            if (!tr.isValidEd25519PublicKey(t3.signer.ed25519PublicKey)) throw new Error("signer.ed25519PublicKey is invalid.");
            var r3 = tr.decodeEd25519PublicKey(t3.signer.ed25519PublicKey);
            e3 = new i.SignerKey.signerKeyTypeEd25519(r3);
          } else if (t3.signer.preAuthTx) {
            var n2;
            if (n2 = "string" == typeof t3.signer.preAuthTx ? wn.from(t3.signer.preAuthTx, "hex") : t3.signer.preAuthTx, !wn.isBuffer(n2) || 32 !== n2.length) throw new Error("signer.preAuthTx must be 32 bytes Buffer.");
            e3 = new i.SignerKey.signerKeyTypePreAuthTx(n2);
          } else {
            if (!t3.signer.sha256Hash) throw new Error("signer is invalid");
            var o2;
            if (o2 = "string" == typeof t3.signer.sha256Hash ? wn.from(t3.signer.sha256Hash, "hex") : t3.signer.sha256Hash, !wn.isBuffer(o2) || 32 !== o2.length) throw new Error("signer.sha256Hash must be 32 bytes Buffer.");
            e3 = new i.SignerKey.signerKeyTypeHashX(o2);
          }
          var a2 = new i.RevokeSponsorshipOpSigner({ accountId: lr.fromPublicKey(t3.account).xdrAccountId(), signerKey: e3 }), s2 = i.RevokeSponsorshipOp.revokeSponsorshipSigner(a2), u2 = {};
          return u2.body = i.OperationBody.revokeSponsorship(s2), this.setSourceAccount(u2, t3), new i.Operation(u2);
        }, jn.clawback = function(e3) {
          var t3 = {};
          if (!this.isValidAmount(e3.amount)) throw new TypeError(this.constructAmountRequirementsError("amount"));
          t3.amount = this._toXDRAmount(e3.amount), t3.asset = e3.asset.toXDRObject();
          try {
            t3.from = pn(e3.from);
          } catch (e4) {
            throw new Error("from address is invalid");
          }
          var r3 = { body: i.OperationBody.clawback(new i.ClawbackOp(t3)) };
          return this.setSourceAccount(r3, e3), new i.Operation(r3);
        }, jn.setTrustLineFlags = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t3 = {};
          if ("object" !== Sn(e3.flags) || 0 === Object.keys(e3.flags).length) throw new Error("opts.flags must be a map of boolean flags to modify");
          var r3 = { authorized: i.TrustLineFlags.authorizedFlag(), authorizedToMaintainLiabilities: i.TrustLineFlags.authorizedToMaintainLiabilitiesFlag(), clawbackEnabled: i.TrustLineFlags.trustlineClawbackEnabledFlag() }, n2 = 0, o2 = 0;
          Object.keys(e3.flags).forEach(function(t4) {
            if (!Object.prototype.hasOwnProperty.call(r3, t4)) throw new Error("unsupported flag name specified: ".concat(t4));
            var i2 = e3.flags[t4], a3 = r3[t4].value;
            true === i2 ? o2 |= a3 : false === i2 && (n2 |= a3);
          }), t3.trustor = lr.fromPublicKey(e3.trustor).xdrAccountId(), t3.asset = e3.asset.toXDRObject(), t3.clearFlags = n2, t3.setFlags = o2;
          var a2 = { body: i.OperationBody.setTrustLineFlags(new i.SetTrustLineFlagsOp(t3)) };
          return this.setSourceAccount(a2, e3), new i.Operation(a2);
        }, jn.liquidityPoolDeposit = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t3 = e3.liquidityPoolId, r3 = e3.maxAmountA, n2 = e3.maxAmountB, o2 = e3.minPrice, a2 = e3.maxPrice, s2 = {};
          if (!t3) throw new TypeError("liquidityPoolId argument is required");
          if (s2.liquidityPoolId = i.PoolId.fromXDR(t3, "hex"), !this.isValidAmount(r3, true)) throw new TypeError(this.constructAmountRequirementsError("maxAmountA"));
          if (s2.maxAmountA = this._toXDRAmount(r3), !this.isValidAmount(n2, true)) throw new TypeError(this.constructAmountRequirementsError("maxAmountB"));
          if (s2.maxAmountB = this._toXDRAmount(n2), void 0 === o2) throw new TypeError("minPrice argument is required");
          if (s2.minPrice = this._toXDRPrice(o2), void 0 === a2) throw new TypeError("maxPrice argument is required");
          s2.maxPrice = this._toXDRPrice(a2);
          var u2 = new i.LiquidityPoolDepositOp(s2), c2 = { body: i.OperationBody.liquidityPoolDeposit(u2) };
          return this.setSourceAccount(c2, e3), new i.Operation(c2);
        }, jn.liquidityPoolWithdraw = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t3 = {};
          if (!e3.liquidityPoolId) throw new TypeError("liquidityPoolId argument is required");
          if (t3.liquidityPoolId = i.PoolId.fromXDR(e3.liquidityPoolId, "hex"), !this.isValidAmount(e3.amount)) throw new TypeError(this.constructAmountRequirementsError("amount"));
          if (t3.amount = this._toXDRAmount(e3.amount), !this.isValidAmount(e3.minAmountA, true)) throw new TypeError(this.constructAmountRequirementsError("minAmountA"));
          if (t3.minAmountA = this._toXDRAmount(e3.minAmountA), !this.isValidAmount(e3.minAmountB, true)) throw new TypeError(this.constructAmountRequirementsError("minAmountB"));
          t3.minAmountB = this._toXDRAmount(e3.minAmountB);
          var r3 = new i.LiquidityPoolWithdrawOp(t3), n2 = { body: i.OperationBody.liquidityPoolWithdraw(r3) };
          return this.setSourceAccount(n2, e3), new i.Operation(n2);
        }, jn.invokeHostFunction = function(e3) {
          if (!e3.func) throw new TypeError("host function invocation ('func') required (got ".concat(JSON.stringify(e3), ")"));
          e3.func.switch().value === i.HostFunctionType.hostFunctionTypeInvokeContract().value && e3.func.invokeContract().args().forEach(function(e4) {
            var t4;
            try {
              t4 = On.fromScVal(e4);
            } catch (e5) {
              return;
            }
            switch (t4._type) {
              case "claimableBalance":
              case "liquidityPool":
                throw new TypeError("claimable balances and liquidity pools cannot be arguments to invokeHostFunction");
            }
          });
          var t3 = new i.InvokeHostFunctionOp({ hostFunction: e3.func, auth: e3.auth || [] }), r3 = { body: i.OperationBody.invokeHostFunction(t3) };
          return this.setSourceAccount(r3, e3), new i.Operation(r3);
        }, jn.extendFootprintTtl = function(e3) {
          var t3;
          if ((null !== (t3 = e3.extendTo) && void 0 !== t3 ? t3 : -1) <= 0) throw new RangeError("extendTo has to be positive");
          var r3 = new i.ExtendFootprintTtlOp({ ext: new i.ExtensionPoint(0), extendTo: e3.extendTo }), n2 = { body: i.OperationBody.extendFootprintTtl(r3) };
          return this.setSourceAccount(n2, e3), new i.Operation(n2);
        }, jn.restoreFootprint = function() {
          var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t3 = new i.RestoreFootprintOp({ ext: new i.ExtensionPoint(0) }), r3 = { body: i.OperationBody.restoreFootprint(t3) };
          return this.setSourceAccount(r3, null != e3 ? e3 : {}), new i.Operation(r3);
        }, jn.createStellarAssetContract = function(e3) {
          var t3 = e3.asset;
          if ("string" == typeof t3) {
            var r3 = Pn(t3.split(":"), 2), n2 = r3[0], o2 = r3[1];
            t3 = new yr(n2, o2);
          }
          if (!(t3 instanceof yr)) throw new TypeError("expected Asset in 'opts.asset', got ".concat(t3));
          return this.invokeHostFunction({ source: e3.source, auth: e3.auth, func: i.HostFunction.hostFunctionTypeCreateContract(new i.CreateContractArgs({ executable: i.ContractExecutable.contractExecutableStellarAsset(), contractIdPreimage: i.ContractIdPreimage.contractIdPreimageFromAsset(t3.toXDRObject()) })) });
        }, jn.invokeContractFunction = function(e3) {
          var t3 = new On(e3.contract);
          if ("contract" !== t3._type) throw new TypeError("expected contract strkey instance, got ".concat(t3));
          return this.invokeHostFunction({ source: e3.source, auth: e3.auth, func: i.HostFunction.hostFunctionTypeInvokeContract(new i.InvokeContractArgs({ contractAddress: t3.toScAddress(), functionName: e3.function, args: e3.args })) });
        }, jn.createCustomContract = function(e3) {
          var t3, r3 = xn.from(e3.salt || lr.random().xdrPublicKey().value());
          if (!e3.wasmHash || 32 !== e3.wasmHash.length) throw new TypeError("expected hash(contract WASM) in 'opts.wasmHash', got ".concat(e3.wasmHash));
          if (32 !== r3.length) throw new TypeError("expected 32-byte salt in 'opts.salt', got ".concat(e3.wasmHash));
          return this.invokeHostFunction({ source: e3.source, auth: e3.auth, func: i.HostFunction.hostFunctionTypeCreateContractV2(new i.CreateContractArgsV2({ executable: i.ContractExecutable.contractExecutableWasm(xn.from(e3.wasmHash)), contractIdPreimage: i.ContractIdPreimage.contractIdPreimageFromAddress(new i.ContractIdPreimageFromAddress({ address: e3.address.toScAddress(), salt: r3 })), constructorArgs: null !== (t3 = e3.constructorArgs) && void 0 !== t3 ? t3 : [] })) });
        }, jn.uploadContractWasm = function(e3) {
          return this.invokeHostFunction({ source: e3.source, auth: e3.auth, func: i.HostFunction.hostFunctionTypeUploadContractWasm(xn.from(e3.wasm)) });
        };
        var Dn = r2(8287).Buffer;
        function Vn(e3) {
          return Vn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, Vn(e3);
        }
        function qn(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, Kn(n2.key), n2);
          }
        }
        function Kn(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != Vn(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != Vn(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == Vn(t3) ? t3 : t3 + "";
        }
        var Hn = "none", zn = "id", Xn = "text", $n = "hash", Gn = "return", Wn = (function() {
          function e3(t3) {
            var r3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
            switch ((function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3), this._type = t3, this._value = r3, this._type) {
              case Hn:
                break;
              case zn:
                e3._validateIdValue(r3);
                break;
              case Xn:
                e3._validateTextValue(r3);
                break;
              case $n:
              case Gn:
                e3._validateHashValue(r3), "string" == typeof r3 && (this._value = Dn.from(r3, "hex"));
                break;
              default:
                throw new Error("Invalid memo type");
            }
          }
          return (function(e4, t3, r3) {
            return t3 && qn(e4.prototype, t3), r3 && qn(e4, r3), Object.defineProperty(e4, "prototype", { writable: false }), e4;
          })(e3, [{ key: "type", get: function() {
            return this._type;
          }, set: function(e4) {
            throw new Error("Memo is immutable");
          } }, { key: "value", get: function() {
            switch (this._type) {
              case Hn:
                return null;
              case zn:
              case Xn:
                return this._value;
              case $n:
              case Gn:
                return Dn.from(this._value);
              default:
                throw new Error("Invalid memo type");
            }
          }, set: function(e4) {
            throw new Error("Memo is immutable");
          } }, { key: "toXDRObject", value: function() {
            switch (this._type) {
              case Hn:
                return i.Memo.memoNone();
              case zn:
                return i.Memo.memoId(n.UnsignedHyper.fromString(this._value));
              case Xn:
                return i.Memo.memoText(this._value);
              case $n:
                return i.Memo.memoHash(this._value);
              case Gn:
                return i.Memo.memoReturn(this._value);
              default:
                return null;
            }
          } }], [{ key: "_validateIdValue", value: function(e4) {
            var t3, r3 = new Error("Expects a int64 as a string. Got ".concat(e4));
            if ("string" != typeof e4) throw r3;
            try {
              t3 = new zr(e4);
            } catch (e5) {
              throw r3;
            }
            if (!t3.isFinite()) throw r3;
            if (t3.isNaN()) throw r3;
          } }, { key: "_validateTextValue", value: function(e4) {
            if (!i.Memo.armTypeForArm("text").isValid(e4)) throw new Error("Expects string, array or buffer, max 28 bytes");
          } }, { key: "_validateHashValue", value: function(e4) {
            var t3, r3 = new Error("Expects a 32 byte hash value or hex encoded string. Got ".concat(e4));
            if (null == e4) throw r3;
            if ("string" == typeof e4) {
              if (!/^[0-9A-Fa-f]{64}$/g.test(e4)) throw r3;
              t3 = Dn.from(e4, "hex");
            } else {
              if (!Dn.isBuffer(e4)) throw r3;
              t3 = Dn.from(e4);
            }
            if (!t3.length || 32 !== t3.length) throw r3;
          } }, { key: "none", value: function() {
            return new e3(Hn);
          } }, { key: "text", value: function(t3) {
            return new e3(Xn, t3);
          } }, { key: "id", value: function(t3) {
            return new e3(zn, t3);
          } }, { key: "hash", value: function(t3) {
            return new e3($n, t3);
          } }, { key: "return", value: function(t3) {
            return new e3(Gn, t3);
          } }, { key: "fromXDRObject", value: function(t3) {
            switch (t3.arm()) {
              case "id":
                return e3.id(t3.value().toString());
              case "text":
                return e3.text(t3.value());
              case "hash":
                return e3.hash(t3.value());
              case "retHash":
                return e3.return(t3.value());
            }
            if (void 0 === t3.value()) return e3.none();
            throw new Error("Unknown type");
          } }]);
        })(), Yn = r2(8287).Buffer;
        function Zn(e3) {
          return Zn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, Zn(e3);
        }
        function Jn(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, Qn(n2.key), n2);
          }
        }
        function Qn(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != Zn(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != Zn(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == Zn(t3) ? t3 : t3 + "";
        }
        function eo(e3, t3, r3) {
          return t3 = ro(t3), (function(e4, t4) {
            if (t4 && ("object" == Zn(t4) || "function" == typeof t4)) return t4;
            if (void 0 !== t4) throw new TypeError("Derived constructors may only return object or undefined");
            return (function(e5) {
              if (void 0 === e5) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e5;
            })(e4);
          })(e3, to() ? Reflect.construct(t3, r3 || [], ro(e3).constructor) : t3.apply(e3, r3));
        }
        function to() {
          try {
            var e3 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            }));
          } catch (e4) {
          }
          return (to = function() {
            return !!e3;
          })();
        }
        function ro(e3) {
          return ro = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e4) {
            return e4.__proto__ || Object.getPrototypeOf(e4);
          }, ro(e3);
        }
        function no(e3, t3) {
          return no = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e4, t4) {
            return e4.__proto__ = t4, e4;
          }, no(e3, t3);
        }
        var oo = (function(e3) {
          function t3(e4, r3) {
            var n2;
            if ((function(e5, t4) {
              if (!(e5 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, t3), "string" == typeof e4) {
              var o2 = Yn.from(e4, "base64");
              e4 = i.TransactionEnvelope.fromXDR(o2);
            }
            var a2 = e4.switch();
            if (a2 !== i.EnvelopeType.envelopeTypeTxV0() && a2 !== i.EnvelopeType.envelopeTypeTx()) throw new Error("Invalid TransactionEnvelope: expected an envelopeTypeTxV0 or envelopeTypeTx but received an ".concat(a2.name, "."));
            var s2 = e4.value(), u2 = s2.tx(), c2 = u2.fee().toString();
            if ((n2 = eo(this, t3, [u2, (s2.signatures() || []).slice(), c2, r3]))._envelopeType = a2, n2._memo = u2.memo(), n2._sequence = u2.seqNum().toString(), n2._envelopeType === i.EnvelopeType.envelopeTypeTxV0()) n2._source = tr.encodeEd25519PublicKey(n2.tx.sourceAccountEd25519());
            else n2._source = dn(n2.tx.sourceAccount());
            var l2 = null, f2 = null;
            switch (n2._envelopeType) {
              case i.EnvelopeType.envelopeTypeTxV0():
                f2 = u2.timeBounds();
                break;
              case i.EnvelopeType.envelopeTypeTx():
                switch (u2.cond().switch()) {
                  case i.PreconditionType.precondTime():
                    f2 = u2.cond().timeBounds();
                    break;
                  case i.PreconditionType.precondV2():
                    f2 = (l2 = u2.cond().v2()).timeBounds();
                }
            }
            if (f2 && (n2._timeBounds = { minTime: f2.minTime().toString(), maxTime: f2.maxTime().toString() }), l2) {
              var p2 = l2.ledgerBounds();
              p2 && (n2._ledgerBounds = { minLedger: p2.minLedger(), maxLedger: p2.maxLedger() });
              var d2 = l2.minSeqNum();
              d2 && (n2._minAccountSequence = d2.toString()), n2._minAccountSequenceAge = l2.minSeqAge(), n2._minAccountSequenceLedgerGap = l2.minSeqLedgerGap(), n2._extraSigners = l2.extraSigners();
            }
            var h2 = u2.operations() || [];
            return n2._operations = h2.map(function(e5) {
              return jn.fromXDRObject(e5);
            }), n2;
          }
          return (function(e4, t4) {
            if ("function" != typeof t4 && null !== t4) throw new TypeError("Super expression must either be null or a function");
            e4.prototype = Object.create(t4 && t4.prototype, { constructor: { value: e4, writable: true, configurable: true } }), Object.defineProperty(e4, "prototype", { writable: false }), t4 && no(e4, t4);
          })(t3, e3), (function(e4, t4, r3) {
            return t4 && Jn(e4.prototype, t4), r3 && Jn(e4, r3), Object.defineProperty(e4, "prototype", { writable: false }), e4;
          })(t3, [{ key: "timeBounds", get: function() {
            return this._timeBounds;
          }, set: function(e4) {
            throw new Error("Transaction is immutable");
          } }, { key: "ledgerBounds", get: function() {
            return this._ledgerBounds;
          }, set: function(e4) {
            throw new Error("Transaction is immutable");
          } }, { key: "minAccountSequence", get: function() {
            return this._minAccountSequence;
          }, set: function(e4) {
            throw new Error("Transaction is immutable");
          } }, { key: "minAccountSequenceAge", get: function() {
            return this._minAccountSequenceAge;
          }, set: function(e4) {
            throw new Error("Transaction is immutable");
          } }, { key: "minAccountSequenceLedgerGap", get: function() {
            return this._minAccountSequenceLedgerGap;
          }, set: function(e4) {
            throw new Error("Transaction is immutable");
          } }, { key: "extraSigners", get: function() {
            return this._extraSigners;
          }, set: function(e4) {
            throw new Error("Transaction is immutable");
          } }, { key: "sequence", get: function() {
            return this._sequence;
          }, set: function(e4) {
            throw new Error("Transaction is immutable");
          } }, { key: "source", get: function() {
            return this._source;
          }, set: function(e4) {
            throw new Error("Transaction is immutable");
          } }, { key: "operations", get: function() {
            return this._operations;
          }, set: function(e4) {
            throw new Error("Transaction is immutable");
          } }, { key: "memo", get: function() {
            return Wn.fromXDRObject(this._memo);
          }, set: function(e4) {
            throw new Error("Transaction is immutable");
          } }, { key: "signatureBase", value: function() {
            var e4 = this.tx;
            this._envelopeType === i.EnvelopeType.envelopeTypeTxV0() && (e4 = i.Transaction.fromXDR(Yn.concat([i.PublicKeyType.publicKeyTypeEd25519().toXDR(), e4.toXDR()])));
            var t4 = new i.TransactionSignaturePayloadTaggedTransaction.envelopeTypeTx(e4);
            return new i.TransactionSignaturePayload({ networkId: i.Hash.fromXDR(u(this.networkPassphrase)), taggedTransaction: t4 }).toXDR();
          } }, { key: "toEnvelope", value: function() {
            var e4, t4 = this.tx.toXDR(), r3 = this.signatures.slice();
            switch (this._envelopeType) {
              case i.EnvelopeType.envelopeTypeTxV0():
                e4 = new i.TransactionEnvelope.envelopeTypeTxV0(new i.TransactionV0Envelope({ tx: i.TransactionV0.fromXDR(t4), signatures: r3 }));
                break;
              case i.EnvelopeType.envelopeTypeTx():
                e4 = new i.TransactionEnvelope.envelopeTypeTx(new i.TransactionV1Envelope({ tx: i.Transaction.fromXDR(t4), signatures: r3 }));
                break;
              default:
                throw new Error("Invalid TransactionEnvelope: expected an envelopeTypeTxV0 or envelopeTypeTx but received an ".concat(this._envelopeType.name, "."));
            }
            return e4;
          } }, { key: "getClaimableBalanceId", value: function(e4) {
            if (!Number.isInteger(e4) || e4 < 0 || e4 >= this.operations.length) throw new RangeError("invalid operation index");
            var t4 = this.operations[e4];
            try {
              t4 = jn.createClaimableBalance(t4);
            } catch (e5) {
              throw new TypeError("expected createClaimableBalance, got ".concat(t4.type, ": ").concat(e5));
            }
            var r3 = tr.decodeEd25519PublicKey(yn(this.source)), n2 = u(i.HashIdPreimage.envelopeTypeOpId(new i.HashIdPreimageOperationId({ sourceAccount: i.AccountId.publicKeyTypeEd25519(r3), seqNum: i.SequenceNumber.fromString(this.sequence), opNum: e4 })).toXDR("raw"));
            return i.ClaimableBalanceId.claimableBalanceIdTypeV0(n2).toXDR("hex");
          } }]);
        })(Ar), io = r2(8287).Buffer;
        function ao(e3) {
          return ao = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, ao(e3);
        }
        function so(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, uo(n2.key), n2);
          }
        }
        function uo(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != ao(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != ao(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == ao(t3) ? t3 : t3 + "";
        }
        function co(e3, t3, r3) {
          return t3 = fo(t3), (function(e4, t4) {
            if (t4 && ("object" == ao(t4) || "function" == typeof t4)) return t4;
            if (void 0 !== t4) throw new TypeError("Derived constructors may only return object or undefined");
            return (function(e5) {
              if (void 0 === e5) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e5;
            })(e4);
          })(e3, lo() ? Reflect.construct(t3, r3 || [], fo(e3).constructor) : t3.apply(e3, r3));
        }
        function lo() {
          try {
            var e3 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            }));
          } catch (e4) {
          }
          return (lo = function() {
            return !!e3;
          })();
        }
        function fo(e3) {
          return fo = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e4) {
            return e4.__proto__ || Object.getPrototypeOf(e4);
          }, fo(e3);
        }
        function po(e3, t3) {
          return po = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e4, t4) {
            return e4.__proto__ = t4, e4;
          }, po(e3, t3);
        }
        var ho = (function(e3) {
          function t3(e4, r3) {
            var n2;
            if ((function(e5, t4) {
              if (!(e5 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, t3), "string" == typeof e4) {
              var o2 = io.from(e4, "base64");
              e4 = i.TransactionEnvelope.fromXDR(o2);
            }
            var a2 = e4.switch();
            if (a2 !== i.EnvelopeType.envelopeTypeTxFeeBump()) throw new Error("Invalid TransactionEnvelope: expected an envelopeTypeTxFeeBump but received an ".concat(a2.name, "."));
            var s2 = e4.value(), u2 = s2.tx(), c2 = u2.fee().toString();
            n2 = co(this, t3, [u2, (s2.signatures() || []).slice(), c2, r3]);
            var l2 = i.TransactionEnvelope.envelopeTypeTx(u2.innerTx().v1());
            return n2._feeSource = dn(n2.tx.feeSource()), n2._innerTransaction = new oo(l2, r3), n2;
          }
          return (function(e4, t4) {
            if ("function" != typeof t4 && null !== t4) throw new TypeError("Super expression must either be null or a function");
            e4.prototype = Object.create(t4 && t4.prototype, { constructor: { value: e4, writable: true, configurable: true } }), Object.defineProperty(e4, "prototype", { writable: false }), t4 && po(e4, t4);
          })(t3, e3), (function(e4, t4, r3) {
            return t4 && so(e4.prototype, t4), r3 && so(e4, r3), Object.defineProperty(e4, "prototype", { writable: false }), e4;
          })(t3, [{ key: "innerTransaction", get: function() {
            return this._innerTransaction;
          } }, { key: "operations", get: function() {
            return this._innerTransaction.operations;
          } }, { key: "feeSource", get: function() {
            return this._feeSource;
          } }, { key: "signatureBase", value: function() {
            var e4 = new i.TransactionSignaturePayloadTaggedTransaction.envelopeTypeTxFeeBump(this.tx);
            return new i.TransactionSignaturePayload({ networkId: i.Hash.fromXDR(u(this.networkPassphrase)), taggedTransaction: e4 }).toXDR();
          } }, { key: "toEnvelope", value: function() {
            var e4 = new i.FeeBumpTransactionEnvelope({ tx: i.FeeBumpTransaction.fromXDR(this.tx.toXDR()), signatures: this.signatures.slice() });
            return new i.TransactionEnvelope.envelopeTypeTxFeeBump(e4);
          } }]);
        })(Ar);
        function yo(e3) {
          return yo = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, yo(e3);
        }
        function mo(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, go(n2.key), n2);
          }
        }
        function go(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != yo(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != yo(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == yo(t3) ? t3 : t3 + "";
        }
        var vo = (function() {
          return (function(e3, t3, r3) {
            return t3 && mo(e3.prototype, t3), r3 && mo(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          })(function e3(t3, r3) {
            if ((function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3), tr.isValidMed25519PublicKey(t3)) throw new Error("accountId is an M-address; use MuxedAccount instead");
            if (!tr.isValidEd25519PublicKey(t3)) throw new Error("accountId is invalid");
            if ("string" != typeof r3) throw new Error("sequence must be of type string");
            this._accountId = t3, this.sequence = new zr(r3);
          }, [{ key: "accountId", value: function() {
            return this._accountId;
          } }, { key: "sequenceNumber", value: function() {
            return this.sequence.toString();
          } }, { key: "incrementSequenceNumber", value: function() {
            this.sequence = this.sequence.plus(1);
          } }]);
        })();
        function bo(e3) {
          return bo = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, bo(e3);
        }
        function wo(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, So(n2.key), n2);
          }
        }
        function So(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != bo(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != bo(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == bo(t3) ? t3 : t3 + "";
        }
        var Eo = (function() {
          function e3(t3, r3) {
            !(function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3);
            var n2 = t3.accountId();
            if (!tr.isValidEd25519PublicKey(n2)) throw new Error("accountId is invalid");
            this.account = t3, this._muxedXdr = hn(n2, r3), this._mAddress = dn(this._muxedXdr), this._id = r3;
          }
          return (function(e4, t3, r3) {
            return t3 && wo(e4.prototype, t3), r3 && wo(e4, r3), Object.defineProperty(e4, "prototype", { writable: false }), e4;
          })(e3, [{ key: "baseAccount", value: function() {
            return this.account;
          } }, { key: "accountId", value: function() {
            return this._mAddress;
          } }, { key: "id", value: function() {
            return this._id;
          } }, { key: "setId", value: function(e4) {
            if ("string" != typeof e4) throw new Error("id should be a string representing a number (uint64)");
            return this._muxedXdr.med25519().id(i.Uint64.fromString(e4)), this._mAddress = dn(this._muxedXdr), this._id = e4, this;
          } }, { key: "sequenceNumber", value: function() {
            return this.account.sequenceNumber();
          } }, { key: "incrementSequenceNumber", value: function() {
            return this.account.incrementSequenceNumber();
          } }, { key: "toXDRObject", value: function() {
            return this._muxedXdr;
          } }, { key: "equals", value: function(e4) {
            return this.accountId() === e4.accountId();
          } }], [{ key: "fromAddress", value: function(t3, r3) {
            var n2 = pn(t3), o2 = yn(t3), i2 = n2.med25519().id().toString();
            return new e3(new vo(o2, r3), i2);
          } }]);
        })();
        function ko(e3) {
          return ko = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, ko(e3);
        }
        function Ao(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, To(n2.key), n2);
          }
        }
        function To(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != ko(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != ko(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == ko(t3) ? t3 : t3 + "";
        }
        var Oo = (function() {
          return (function(e3, t3, r3) {
            return t3 && Ao(e3.prototype, t3), r3 && Ao(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          })(function e3(t3) {
            var r3;
            !(function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3), (function(e4, t4, r4) {
              (t4 = To(t4)) in e4 ? Object.defineProperty(e4, t4, { value: r4, enumerable: true, configurable: true, writable: true }) : e4[t4] = r4;
            })(this, "_data", void 0), r3 = t3 ? "string" == typeof t3 || ArrayBuffer.isView(t3) ? e3.fromXDR(t3) : e3.fromXDR(t3.toXDR()) : new i.SorobanTransactionData({ resources: new i.SorobanResources({ footprint: new i.LedgerFootprint({ readOnly: [], readWrite: [] }), instructions: 0, diskReadBytes: 0, writeBytes: 0 }), ext: new i.SorobanTransactionDataExt(0), resourceFee: new i.Int64(0) }), this._data = r3;
          }, [{ key: "setResourceFee", value: function(e3) {
            return this._data.resourceFee(new i.Int64(e3)), this;
          } }, { key: "setResources", value: function(e3, t3, r3) {
            return this._data.resources().instructions(e3), this._data.resources().diskReadBytes(t3), this._data.resources().writeBytes(r3), this;
          } }, { key: "appendFootprint", value: function(e3, t3) {
            return this.setFootprint(this.getReadOnly().concat(e3), this.getReadWrite().concat(t3));
          } }, { key: "setFootprint", value: function(e3, t3) {
            return null !== e3 && this.setReadOnly(e3), null !== t3 && this.setReadWrite(t3), this;
          } }, { key: "setReadOnly", value: function(e3) {
            return this._data.resources().footprint().readOnly(null != e3 ? e3 : []), this;
          } }, { key: "setReadWrite", value: function(e3) {
            return this._data.resources().footprint().readWrite(null != e3 ? e3 : []), this;
          } }, { key: "build", value: function() {
            return i.SorobanTransactionData.fromXDR(this._data.toXDR());
          } }, { key: "getReadOnly", value: function() {
            return this.getFootprint().readOnly();
          } }, { key: "getReadWrite", value: function() {
            return this.getFootprint().readWrite();
          } }, { key: "getFootprint", value: function() {
            return this._data.resources().footprint();
          } }], [{ key: "fromXDR", value: function(e3) {
            return i.SorobanTransactionData.fromXDR(e3, "string" == typeof e3 ? "base64" : "raw");
          } }]);
        })();
        function xo(e3) {
          return xo = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, xo(e3);
        }
        function Po(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, Bo(n2.key), n2);
          }
        }
        function Bo(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != xo(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != xo(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == xo(t3) ? t3 : t3 + "";
        }
        var Io = (function() {
          return (function(e3, t3, r3) {
            return t3 && Po(e3.prototype, t3), r3 && Po(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          })(function e3() {
            !(function(e4, t3) {
              if (!(e4 instanceof t3)) throw new TypeError("Cannot call a class as a function");
            })(this, e3);
          }, null, [{ key: "decodeAddress", value: function(e3) {
            var t3 = { ed25519PublicKey: i.SignerKey.signerKeyTypeEd25519, preAuthTx: i.SignerKey.signerKeyTypePreAuthTx, sha256Hash: i.SignerKey.signerKeyTypeHashX, signedPayload: i.SignerKey.signerKeyTypeEd25519SignedPayload }, r3 = tr.getVersionByteForPrefix(e3), n2 = t3[r3];
            if (!n2) throw new Error("invalid signer key type (".concat(r3, ")"));
            var o2 = nr(r3, e3);
            return n2("signedPayload" === r3 ? new i.SignerKeyEd25519SignedPayload({ ed25519: o2.slice(0, 32), payload: o2.slice(36) }) : o2);
          } }, { key: "encodeSignerKey", value: function(e3) {
            var t3, r3;
            switch (e3.switch()) {
              case i.SignerKeyType.signerKeyTypeEd25519():
                t3 = "ed25519PublicKey", r3 = e3.value();
                break;
              case i.SignerKeyType.signerKeyTypePreAuthTx():
                t3 = "preAuthTx", r3 = e3.value();
                break;
              case i.SignerKeyType.signerKeyTypeHashX():
                t3 = "sha256Hash", r3 = e3.value();
                break;
              case i.SignerKeyType.signerKeyTypeEd25519SignedPayload():
                t3 = "signedPayload", r3 = e3.ed25519SignedPayload().toXDR("raw");
                break;
              default:
                throw new Error("invalid SignerKey (type: ".concat(e3.switch(), ")"));
            }
            return or(t3, r3);
          } }]);
        })();
        function Co(e3) {
          return Co = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, Co(e3);
        }
        function Ro(e3) {
          return (function(e4) {
            if (Array.isArray(e4)) return _o(e4);
          })(e3) || (function(e4) {
            if ("undefined" != typeof Symbol && null != e4[Symbol.iterator] || null != e4["@@iterator"]) return Array.from(e4);
          })(e3) || (function(e4, t3) {
            if (e4) {
              if ("string" == typeof e4) return _o(e4, t3);
              var r3 = {}.toString.call(e4).slice(8, -1);
              return "Object" === r3 && e4.constructor && (r3 = e4.constructor.name), "Map" === r3 || "Set" === r3 ? Array.from(e4) : "Arguments" === r3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3) ? _o(e4, t3) : void 0;
            }
          })(e3) || (function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          })();
        }
        function _o(e3, t3) {
          (null == t3 || t3 > e3.length) && (t3 = e3.length);
          for (var r3 = 0, n2 = Array(t3); r3 < t3; r3++) n2[r3] = e3[r3];
          return n2;
        }
        function Uo(e3, t3) {
          var r3 = Object.keys(e3);
          if (Object.getOwnPropertySymbols) {
            var n2 = Object.getOwnPropertySymbols(e3);
            t3 && (n2 = n2.filter(function(t4) {
              return Object.getOwnPropertyDescriptor(e3, t4).enumerable;
            })), r3.push.apply(r3, n2);
          }
          return r3;
        }
        function No(e3) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = null != arguments[t3] ? arguments[t3] : {};
            t3 % 2 ? Uo(Object(r3), true).forEach(function(t4) {
              Lo(e3, t4, r3[t4]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(r3)) : Uo(Object(r3)).forEach(function(t4) {
              Object.defineProperty(e3, t4, Object.getOwnPropertyDescriptor(r3, t4));
            });
          }
          return e3;
        }
        function Lo(e3, t3, r3) {
          return (t3 = jo(t3)) in e3 ? Object.defineProperty(e3, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e3[t3] = r3, e3;
        }
        function Fo(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, jo(n2.key), n2);
          }
        }
        function jo(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != Co(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != Co(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == Co(t3) ? t3 : t3 + "";
        }
        var Mo = "100", Do = 0, Vo = (function() {
          function e3(t3) {
            var r3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            if ((function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3), !t3) throw new Error("must specify source account for the transaction");
            if (void 0 === r3.fee) throw new Error("must specify fee for the transaction (in stroops)");
            this.source = t3, this.operations = [], this.baseFee = r3.fee, this.timebounds = r3.timebounds ? No({}, r3.timebounds) : null, this.ledgerbounds = r3.ledgerbounds ? No({}, r3.ledgerbounds) : null, this.minAccountSequence = r3.minAccountSequence || null, this.minAccountSequenceAge = r3.minAccountSequenceAge || null, this.minAccountSequenceLedgerGap = r3.minAccountSequenceLedgerGap || null, this.extraSigners = r3.extraSigners ? Ro(r3.extraSigners) : null, this.memo = r3.memo || Wn.none(), this.networkPassphrase = r3.networkPassphrase || null, this.sorobanData = r3.sorobanData ? new Oo(r3.sorobanData).build() : null;
          }
          return (function(e4, t3, r3) {
            return t3 && Fo(e4.prototype, t3), r3 && Fo(e4, r3), Object.defineProperty(e4, "prototype", { writable: false }), e4;
          })(e3, [{ key: "addOperation", value: function(e4) {
            return this.operations.push(e4), this;
          } }, { key: "addOperationAt", value: function(e4, t3) {
            return this.operations.splice(t3, 0, e4), this;
          } }, { key: "clearOperations", value: function() {
            return this.operations = [], this;
          } }, { key: "clearOperationAt", value: function(e4) {
            return this.operations.splice(e4, 1), this;
          } }, { key: "addMemo", value: function(e4) {
            return this.memo = e4, this;
          } }, { key: "setTimeout", value: function(e4) {
            if (null !== this.timebounds && this.timebounds.maxTime > 0) throw new Error("TimeBounds.max_time has been already set - setting timeout would overwrite it.");
            if (e4 < 0) throw new Error("timeout cannot be negative");
            if (e4 > 0) {
              var t3 = Math.floor(Date.now() / 1e3) + e4;
              null === this.timebounds ? this.timebounds = { minTime: 0, maxTime: t3 } : this.timebounds = { minTime: this.timebounds.minTime, maxTime: t3 };
            } else this.timebounds = { minTime: 0, maxTime: 0 };
            return this;
          } }, { key: "setTimebounds", value: function(e4, t3) {
            if ("number" == typeof e4 && (e4 = new Date(1e3 * e4)), "number" == typeof t3 && (t3 = new Date(1e3 * t3)), null !== this.timebounds) throw new Error("TimeBounds has been already set - setting timebounds would overwrite it.");
            var r3 = Math.floor(e4.valueOf() / 1e3), n2 = Math.floor(t3.valueOf() / 1e3);
            if (r3 < 0) throw new Error("min_time cannot be negative");
            if (n2 < 0) throw new Error("max_time cannot be negative");
            if (n2 > 0 && r3 > n2) throw new Error("min_time cannot be greater than max_time");
            return this.timebounds = { minTime: r3, maxTime: n2 }, this;
          } }, { key: "setLedgerbounds", value: function(e4, t3) {
            if (null !== this.ledgerbounds) throw new Error("LedgerBounds has been already set - setting ledgerbounds would overwrite it.");
            if (e4 < 0) throw new Error("min_ledger cannot be negative");
            if (t3 < 0) throw new Error("max_ledger cannot be negative");
            if (t3 > 0 && e4 > t3) throw new Error("min_ledger cannot be greater than max_ledger");
            return this.ledgerbounds = { minLedger: e4, maxLedger: t3 }, this;
          } }, { key: "setMinAccountSequence", value: function(e4) {
            if (null !== this.minAccountSequence) throw new Error("min_account_sequence has been already set - setting min_account_sequence would overwrite it.");
            return this.minAccountSequence = e4, this;
          } }, { key: "setMinAccountSequenceAge", value: function(e4) {
            if ("number" != typeof e4) throw new Error("min_account_sequence_age must be a number");
            if (null !== this.minAccountSequenceAge) throw new Error("min_account_sequence_age has been already set - setting min_account_sequence_age would overwrite it.");
            if (e4 < 0) throw new Error("min_account_sequence_age cannot be negative");
            return this.minAccountSequenceAge = e4, this;
          } }, { key: "setMinAccountSequenceLedgerGap", value: function(e4) {
            if (null !== this.minAccountSequenceLedgerGap) throw new Error("min_account_sequence_ledger_gap has been already set - setting min_account_sequence_ledger_gap would overwrite it.");
            if (e4 < 0) throw new Error("min_account_sequence_ledger_gap cannot be negative");
            return this.minAccountSequenceLedgerGap = e4, this;
          } }, { key: "setExtraSigners", value: function(e4) {
            if (!Array.isArray(e4)) throw new Error("extra_signers must be an array of strings.");
            if (null !== this.extraSigners) throw new Error("extra_signers has been already set - setting extra_signers would overwrite it.");
            if (e4.length > 2) throw new Error("extra_signers cannot be longer than 2 elements.");
            return this.extraSigners = Ro(e4), this;
          } }, { key: "setNetworkPassphrase", value: function(e4) {
            return this.networkPassphrase = e4, this;
          } }, { key: "setSorobanData", value: function(e4) {
            return this.sorobanData = new Oo(e4).build(), this;
          } }, { key: "build", value: function() {
            var e4 = new zr(this.source.sequenceNumber()).plus(1), t3 = { fee: new zr(this.baseFee).times(this.operations.length).toNumber(), seqNum: i.SequenceNumber.fromString(e4.toString()), memo: this.memo ? this.memo.toXDRObject() : null };
            if (null === this.timebounds || void 0 === this.timebounds.minTime || void 0 === this.timebounds.maxTime) throw new Error("TimeBounds has to be set or you must call setTimeout(TimeoutInfinite).");
            qo(this.timebounds.minTime) && (this.timebounds.minTime = this.timebounds.minTime.getTime() / 1e3), qo(this.timebounds.maxTime) && (this.timebounds.maxTime = this.timebounds.maxTime.getTime() / 1e3), this.timebounds.minTime = n.UnsignedHyper.fromString(this.timebounds.minTime.toString()), this.timebounds.maxTime = n.UnsignedHyper.fromString(this.timebounds.maxTime.toString());
            var r3 = new i.TimeBounds(this.timebounds);
            if (this.hasV2Preconditions()) {
              var o2 = null;
              null !== this.ledgerbounds && (o2 = new i.LedgerBounds(this.ledgerbounds));
              var a2 = this.minAccountSequence || "0";
              a2 = i.SequenceNumber.fromString(a2);
              var s2 = n.UnsignedHyper.fromString(null !== this.minAccountSequenceAge ? this.minAccountSequenceAge.toString() : "0"), u2 = this.minAccountSequenceLedgerGap || 0, c2 = null !== this.extraSigners ? this.extraSigners.map(Io.decodeAddress) : [];
              t3.cond = i.Preconditions.precondV2(new i.PreconditionsV2({ timeBounds: r3, ledgerBounds: o2, minSeqNum: a2, minSeqAge: s2, minSeqLedgerGap: u2, extraSigners: c2 }));
            } else t3.cond = i.Preconditions.precondTime(r3);
            t3.sourceAccount = pn(this.source.accountId()), this.sorobanData ? t3.ext = new i.TransactionExt(1, this.sorobanData) : t3.ext = new i.TransactionExt(0, i.Void);
            var l2 = new i.Transaction(t3);
            l2.operations(this.operations);
            var f2 = new i.TransactionEnvelope.envelopeTypeTx(new i.TransactionV1Envelope({ tx: l2 })), p2 = new oo(f2, this.networkPassphrase);
            return this.source.incrementSequenceNumber(), p2;
          } }, { key: "hasV2Preconditions", value: function() {
            return null !== this.ledgerbounds || null !== this.minAccountSequence || null !== this.minAccountSequenceAge || null !== this.minAccountSequenceLedgerGap || null !== this.extraSigners && this.extraSigners.length > 0;
          } }], [{ key: "cloneFrom", value: function(t3) {
            var r3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            if (!(t3 instanceof oo)) throw new TypeError("expected a 'Transaction', got: ".concat(t3));
            var n2, o2 = (BigInt(t3.sequence) - 1n).toString();
            if (tr.isValidMed25519PublicKey(t3.source)) n2 = Eo.fromAddress(t3.source, o2);
            else {
              if (!tr.isValidEd25519PublicKey(t3.source)) throw new TypeError("unsupported tx source account: ".concat(t3.source));
              n2 = new vo(t3.source, o2);
            }
            var i2 = new e3(n2, No({ fee: (parseInt(t3.fee, 10) / t3.operations.length || Mo).toString(), memo: t3.memo, networkPassphrase: t3.networkPassphrase, timebounds: t3.timeBounds, ledgerbounds: t3.ledgerBounds, minAccountSequence: t3.minAccountSequence, minAccountSequenceAge: t3.minAccountSequenceAge, minAccountSequenceLedgerGap: t3.minAccountSequenceLedgerGap, extraSigners: t3.extraSigners }, r3));
            return t3._tx.operations().forEach(function(e4) {
              return i2.addOperation(e4);
            }), i2;
          } }, { key: "buildFeeBumpTransaction", value: function(e4, t3, r3, n2) {
            var o2 = r3.operations.length, a2 = new zr(r3.fee).div(o2), s2 = new zr(t3);
            if (s2.lt(a2)) throw new Error("Invalid baseFee, it should be at least ".concat(a2, " stroops."));
            var u2 = new zr(Mo);
            if (s2.lt(u2)) throw new Error("Invalid baseFee, it should be at least ".concat(u2, " stroops."));
            var c2, l2 = r3.toEnvelope();
            if (l2.switch() === i.EnvelopeType.envelopeTypeTxV0()) {
              var f2 = l2.v0().tx(), p2 = new i.Transaction({ sourceAccount: new i.MuxedAccount.keyTypeEd25519(f2.sourceAccountEd25519()), fee: f2.fee(), seqNum: f2.seqNum(), cond: i.Preconditions.precondTime(f2.timeBounds()), memo: f2.memo(), operations: f2.operations(), ext: new i.TransactionExt(0) });
              l2 = new i.TransactionEnvelope.envelopeTypeTx(new i.TransactionV1Envelope({ tx: p2, signatures: l2.v0().signatures() }));
            }
            c2 = "string" == typeof e4 ? pn(e4) : e4.xdrMuxedAccount();
            var d2 = new i.FeeBumpTransaction({ feeSource: c2, fee: i.Int64.fromString(s2.times(o2 + 1).toString()), innerTx: i.FeeBumpTransactionInnerTx.envelopeTypeTx(l2.v1()), ext: new i.FeeBumpTransactionExt(0) }), h2 = new i.FeeBumpTransactionEnvelope({ tx: d2, signatures: [] }), y2 = new i.TransactionEnvelope.envelopeTypeTxFeeBump(h2);
            return new ho(y2, n2);
          } }, { key: "fromXDR", value: function(e4, t3) {
            return "string" == typeof e4 && (e4 = i.TransactionEnvelope.fromXDR(e4, "base64")), e4.switch() === i.EnvelopeType.envelopeTypeTxFeeBump() ? new ho(e4, t3) : new oo(e4, t3);
          } }]);
        })();
        function qo(e3) {
          return e3 instanceof Date && !isNaN(e3);
        }
        var Ko = { PUBLIC: "Public Global Stellar Network ; September 2015", TESTNET: "Test SDF Network ; September 2015", FUTURENET: "Test SDF Future Network ; October 2022", SANDBOX: "Local Sandbox Stellar Network ; September 2022", STANDALONE: "Standalone Network ; February 2017" };
        function Ho(e3) {
          return Ho = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, Ho(e3);
        }
        function zo(e3) {
          return (function(e4) {
            if (Array.isArray(e4)) return e4;
          })(e3) || (function(e4) {
            if ("undefined" != typeof Symbol && null != e4[Symbol.iterator] || null != e4["@@iterator"]) return Array.from(e4);
          })(e3) || (function(e4, t3) {
            if (e4) {
              if ("string" == typeof e4) return Xo(e4, t3);
              var r3 = {}.toString.call(e4).slice(8, -1);
              return "Object" === r3 && e4.constructor && (r3 = e4.constructor.name), "Map" === r3 || "Set" === r3 ? Array.from(e4) : "Arguments" === r3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3) ? Xo(e4, t3) : void 0;
            }
          })(e3) || (function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          })();
        }
        function Xo(e3, t3) {
          (null == t3 || t3 > e3.length) && (t3 = e3.length);
          for (var r3 = 0, n2 = Array(t3); r3 < t3; r3++) n2[r3] = e3[r3];
          return n2;
        }
        function $o(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, Go(n2.key), n2);
          }
        }
        function Go(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != Ho(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != Ho(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == Ho(t3) ? t3 : t3 + "";
        }
        var Wo = (function() {
          return (function(e3, t3, r3) {
            return t3 && $o(e3.prototype, t3), r3 && $o(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          })(function e3() {
            !(function(e4, t3) {
              if (!(e4 instanceof t3)) throw new TypeError("Cannot call a class as a function");
            })(this, e3);
          }, null, [{ key: "formatTokenAmount", value: function(e3, t3) {
            if (e3.includes(".")) throw new TypeError("No decimals are allowed");
            var r3 = e3;
            return t3 > 0 && (r3 = t3 > r3.length ? ["0", r3.toString().padStart(t3, "0")].join(".") : [r3.slice(0, -t3), r3.slice(-t3)].join(".")), r3.replace(/(\.\d*?)0+$/, "$1");
          } }, { key: "parseTokenAmount", value: function(e3, t3) {
            var r3, n2 = zo(e3.split(".").slice()), o2 = n2[0], i2 = n2[1];
            if (n2.slice(2).length) throw new Error("Invalid decimal value: ".concat(e3));
            return BigInt(o2 + (null !== (r3 = null == i2 ? void 0 : i2.padEnd(t3, "0")) && void 0 !== r3 ? r3 : "0".repeat(t3))).toString();
          } }]);
        })();
        function Yo(e3) {
          return Yo = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, Yo(e3);
        }
        function Zo(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, Jo(n2.key), n2);
          }
        }
        function Jo(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != Yo(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != Yo(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == Yo(t3) ? t3 : t3 + "";
        }
        var Qo = (function() {
          return (function(e3, t3, r3) {
            return t3 && Zo(e3.prototype, t3), r3 && Zo(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          })(function e3(t3) {
            !(function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3);
            try {
              this._id = tr.decodeContract(t3);
            } catch (e4) {
              throw new Error("Invalid contract ID: ".concat(t3));
            }
          }, [{ key: "contractId", value: function() {
            return tr.encodeContract(this._id);
          } }, { key: "toString", value: function() {
            return this.contractId();
          } }, { key: "address", value: function() {
            return On.contract(this._id);
          } }, { key: "call", value: function(e3) {
            for (var t3 = arguments.length, r3 = new Array(t3 > 1 ? t3 - 1 : 0), n2 = 1; n2 < t3; n2++) r3[n2 - 1] = arguments[n2];
            return jn.invokeContractFunction({ contract: this.address().toString(), function: e3, args: r3 });
          } }, { key: "getFootprint", value: function() {
            return i.LedgerKey.contractData(new i.LedgerKeyContractData({ contract: this.address().toScAddress(), key: i.ScVal.scvLedgerKeyContractInstance(), durability: i.ContractDataDurability.persistent() }));
          } }]);
        })();
        function ei(e3) {
          return ei = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, ei(e3);
        }
        function ti(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, ri(n2.key), n2);
          }
        }
        function ri(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != ei(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != ei(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == ei(t3) ? t3 : t3 + "";
        }
        function ni(e3, t3, r3) {
          return t3 = ii(t3), (function(e4, t4) {
            if (t4 && ("object" == ei(t4) || "function" == typeof t4)) return t4;
            if (void 0 !== t4) throw new TypeError("Derived constructors may only return object or undefined");
            return (function(e5) {
              if (void 0 === e5) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e5;
            })(e4);
          })(e3, oi() ? Reflect.construct(t3, r3 || [], ii(e3).constructor) : t3.apply(e3, r3));
        }
        function oi() {
          try {
            var e3 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            }));
          } catch (e4) {
          }
          return (oi = function() {
            return !!e3;
          })();
        }
        function ii(e3) {
          return ii = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e4) {
            return e4.__proto__ || Object.getPrototypeOf(e4);
          }, ii(e3);
        }
        function ai(e3, t3) {
          return ai = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e4, t4) {
            return e4.__proto__ = t4, e4;
          }, ai(e3, t3);
        }
        var si = (function(e3) {
          function t3() {
            !(function(e5, t4) {
              if (!(e5 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, t3);
            for (var e4 = arguments.length, r3 = new Array(e4), n2 = 0; n2 < e4; n2++) r3[n2] = arguments[n2];
            return ni(this, t3, [r3]);
          }
          return (function(e4, t4) {
            if ("function" != typeof t4 && null !== t4) throw new TypeError("Super expression must either be null or a function");
            e4.prototype = Object.create(t4 && t4.prototype, { constructor: { value: e4, writable: true, configurable: true } }), Object.defineProperty(e4, "prototype", { writable: false }), t4 && ai(e4, t4);
          })(t3, e3), (function(e4, t4, r3) {
            return t4 && ti(e4.prototype, t4), r3 && ti(e4, r3), Object.defineProperty(e4, "prototype", { writable: false }), e4;
          })(t3, [{ key: "unsigned", get: function() {
            return true;
          } }, { key: "size", get: function() {
            return 128;
          } }]);
        })(n.LargeInt);
        function ui(e3) {
          return ui = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, ui(e3);
        }
        function ci(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, li(n2.key), n2);
          }
        }
        function li(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != ui(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != ui(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == ui(t3) ? t3 : t3 + "";
        }
        function fi(e3, t3, r3) {
          return t3 = di(t3), (function(e4, t4) {
            if (t4 && ("object" == ui(t4) || "function" == typeof t4)) return t4;
            if (void 0 !== t4) throw new TypeError("Derived constructors may only return object or undefined");
            return (function(e5) {
              if (void 0 === e5) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e5;
            })(e4);
          })(e3, pi() ? Reflect.construct(t3, r3 || [], di(e3).constructor) : t3.apply(e3, r3));
        }
        function pi() {
          try {
            var e3 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            }));
          } catch (e4) {
          }
          return (pi = function() {
            return !!e3;
          })();
        }
        function di(e3) {
          return di = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e4) {
            return e4.__proto__ || Object.getPrototypeOf(e4);
          }, di(e3);
        }
        function hi(e3, t3) {
          return hi = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e4, t4) {
            return e4.__proto__ = t4, e4;
          }, hi(e3, t3);
        }
        si.defineIntBoundaries();
        var yi = (function(e3) {
          function t3() {
            !(function(e5, t4) {
              if (!(e5 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, t3);
            for (var e4 = arguments.length, r3 = new Array(e4), n2 = 0; n2 < e4; n2++) r3[n2] = arguments[n2];
            return fi(this, t3, [r3]);
          }
          return (function(e4, t4) {
            if ("function" != typeof t4 && null !== t4) throw new TypeError("Super expression must either be null or a function");
            e4.prototype = Object.create(t4 && t4.prototype, { constructor: { value: e4, writable: true, configurable: true } }), Object.defineProperty(e4, "prototype", { writable: false }), t4 && hi(e4, t4);
          })(t3, e3), (function(e4, t4, r3) {
            return t4 && ci(e4.prototype, t4), r3 && ci(e4, r3), Object.defineProperty(e4, "prototype", { writable: false }), e4;
          })(t3, [{ key: "unsigned", get: function() {
            return true;
          } }, { key: "size", get: function() {
            return 256;
          } }]);
        })(n.LargeInt);
        function mi(e3) {
          return mi = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, mi(e3);
        }
        function gi(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, vi(n2.key), n2);
          }
        }
        function vi(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != mi(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != mi(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == mi(t3) ? t3 : t3 + "";
        }
        function bi(e3, t3, r3) {
          return t3 = Si(t3), (function(e4, t4) {
            if (t4 && ("object" == mi(t4) || "function" == typeof t4)) return t4;
            if (void 0 !== t4) throw new TypeError("Derived constructors may only return object or undefined");
            return (function(e5) {
              if (void 0 === e5) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e5;
            })(e4);
          })(e3, wi() ? Reflect.construct(t3, r3 || [], Si(e3).constructor) : t3.apply(e3, r3));
        }
        function wi() {
          try {
            var e3 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            }));
          } catch (e4) {
          }
          return (wi = function() {
            return !!e3;
          })();
        }
        function Si(e3) {
          return Si = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e4) {
            return e4.__proto__ || Object.getPrototypeOf(e4);
          }, Si(e3);
        }
        function Ei(e3, t3) {
          return Ei = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e4, t4) {
            return e4.__proto__ = t4, e4;
          }, Ei(e3, t3);
        }
        yi.defineIntBoundaries();
        var ki = (function(e3) {
          function t3() {
            !(function(e5, t4) {
              if (!(e5 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, t3);
            for (var e4 = arguments.length, r3 = new Array(e4), n2 = 0; n2 < e4; n2++) r3[n2] = arguments[n2];
            return bi(this, t3, [r3]);
          }
          return (function(e4, t4) {
            if ("function" != typeof t4 && null !== t4) throw new TypeError("Super expression must either be null or a function");
            e4.prototype = Object.create(t4 && t4.prototype, { constructor: { value: e4, writable: true, configurable: true } }), Object.defineProperty(e4, "prototype", { writable: false }), t4 && Ei(e4, t4);
          })(t3, e3), (function(e4, t4, r3) {
            return t4 && gi(e4.prototype, t4), r3 && gi(e4, r3), Object.defineProperty(e4, "prototype", { writable: false }), e4;
          })(t3, [{ key: "unsigned", get: function() {
            return false;
          } }, { key: "size", get: function() {
            return 128;
          } }]);
        })(n.LargeInt);
        function Ai(e3) {
          return Ai = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, Ai(e3);
        }
        function Ti(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, Oi(n2.key), n2);
          }
        }
        function Oi(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != Ai(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != Ai(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == Ai(t3) ? t3 : t3 + "";
        }
        function xi(e3, t3, r3) {
          return t3 = Bi(t3), (function(e4, t4) {
            if (t4 && ("object" == Ai(t4) || "function" == typeof t4)) return t4;
            if (void 0 !== t4) throw new TypeError("Derived constructors may only return object or undefined");
            return (function(e5) {
              if (void 0 === e5) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e5;
            })(e4);
          })(e3, Pi() ? Reflect.construct(t3, r3 || [], Bi(e3).constructor) : t3.apply(e3, r3));
        }
        function Pi() {
          try {
            var e3 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            }));
          } catch (e4) {
          }
          return (Pi = function() {
            return !!e3;
          })();
        }
        function Bi(e3) {
          return Bi = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e4) {
            return e4.__proto__ || Object.getPrototypeOf(e4);
          }, Bi(e3);
        }
        function Ii(e3, t3) {
          return Ii = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e4, t4) {
            return e4.__proto__ = t4, e4;
          }, Ii(e3, t3);
        }
        ki.defineIntBoundaries();
        var Ci = (function(e3) {
          function t3() {
            !(function(e5, t4) {
              if (!(e5 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, t3);
            for (var e4 = arguments.length, r3 = new Array(e4), n2 = 0; n2 < e4; n2++) r3[n2] = arguments[n2];
            return xi(this, t3, [r3]);
          }
          return (function(e4, t4) {
            if ("function" != typeof t4 && null !== t4) throw new TypeError("Super expression must either be null or a function");
            e4.prototype = Object.create(t4 && t4.prototype, { constructor: { value: e4, writable: true, configurable: true } }), Object.defineProperty(e4, "prototype", { writable: false }), t4 && Ii(e4, t4);
          })(t3, e3), (function(e4, t4, r3) {
            return t4 && Ti(e4.prototype, t4), r3 && Ti(e4, r3), Object.defineProperty(e4, "prototype", { writable: false }), e4;
          })(t3, [{ key: "unsigned", get: function() {
            return false;
          } }, { key: "size", get: function() {
            return 256;
          } }]);
        })(n.LargeInt);
        function Ri(e3) {
          return Ri = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, Ri(e3);
        }
        function _i(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, Ni(n2.key), n2);
          }
        }
        function Ui(e3, t3, r3) {
          return (t3 = Ni(t3)) in e3 ? Object.defineProperty(e3, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e3[t3] = r3, e3;
        }
        function Ni(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != Ri(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != Ri(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == Ri(t3) ? t3 : t3 + "";
        }
        Ci.defineIntBoundaries();
        var Li = (function() {
          return (function(e3, t3, r3) {
            return t3 && _i(e3.prototype, t3), r3 && _i(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          })(function e3(t3, r3) {
            switch ((function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e3), Ui(this, "int", void 0), Ui(this, "type", void 0), r3 instanceof Array || (r3 = [r3]), r3 = r3.map(function(e4) {
              return "bigint" == typeof e4 ? e4 : "function" == typeof e4.toBigInt ? e4.toBigInt() : BigInt(e4);
            }), t3) {
              case "i64":
                this.int = new n.Hyper(r3);
                break;
              case "i128":
                this.int = new ki(r3);
                break;
              case "i256":
                this.int = new Ci(r3);
                break;
              case "u64":
                this.int = new n.UnsignedHyper(r3);
                break;
              case "u128":
                this.int = new si(r3);
                break;
              case "u256":
                this.int = new yi(r3);
                break;
              default:
                throw TypeError("invalid type: ".concat(t3));
            }
            this.type = t3;
          }, [{ key: "toNumber", value: function() {
            var e3 = this.int.toBigInt();
            if (e3 > Number.MAX_SAFE_INTEGER || e3 < Number.MIN_SAFE_INTEGER) throw RangeError("value ".concat(e3, " not in range for Number ") + "[".concat(Number.MAX_SAFE_INTEGER, ", ").concat(Number.MIN_SAFE_INTEGER, "]"));
            return Number(e3);
          } }, { key: "toBigInt", value: function() {
            return this.int.toBigInt();
          } }, { key: "toI64", value: function() {
            this._sizeCheck(64);
            var e3 = this.toBigInt();
            if (BigInt.asIntN(64, e3) !== e3) throw RangeError("value too large for i64: ".concat(e3));
            return i.ScVal.scvI64(new i.Int64(e3));
          } }, { key: "toU64", value: function() {
            return this._sizeCheck(64), i.ScVal.scvU64(new i.Uint64(BigInt.asUintN(64, this.toBigInt())));
          } }, { key: "toI128", value: function() {
            this._sizeCheck(128);
            var e3 = this.int.toBigInt(), t3 = BigInt.asIntN(64, e3 >> 64n), r3 = BigInt.asUintN(64, e3);
            return i.ScVal.scvI128(new i.Int128Parts({ hi: new i.Int64(t3), lo: new i.Uint64(r3) }));
          } }, { key: "toU128", value: function() {
            this._sizeCheck(128);
            var e3 = this.int.toBigInt();
            return i.ScVal.scvU128(new i.UInt128Parts({ hi: new i.Uint64(BigInt.asUintN(64, e3 >> 64n)), lo: new i.Uint64(BigInt.asUintN(64, e3)) }));
          } }, { key: "toI256", value: function() {
            var e3 = this.int.toBigInt(), t3 = BigInt.asIntN(64, e3 >> 192n), r3 = BigInt.asUintN(64, e3 >> 128n), n2 = BigInt.asUintN(64, e3 >> 64n), o2 = BigInt.asUintN(64, e3);
            return i.ScVal.scvI256(new i.Int256Parts({ hiHi: new i.Int64(t3), hiLo: new i.Uint64(r3), loHi: new i.Uint64(n2), loLo: new i.Uint64(o2) }));
          } }, { key: "toU256", value: function() {
            var e3 = this.int.toBigInt(), t3 = BigInt.asUintN(64, e3 >> 192n), r3 = BigInt.asUintN(64, e3 >> 128n), n2 = BigInt.asUintN(64, e3 >> 64n), o2 = BigInt.asUintN(64, e3);
            return i.ScVal.scvU256(new i.UInt256Parts({ hiHi: new i.Uint64(t3), hiLo: new i.Uint64(r3), loHi: new i.Uint64(n2), loLo: new i.Uint64(o2) }));
          } }, { key: "toScVal", value: function() {
            switch (this.type) {
              case "i64":
                return this.toI64();
              case "i128":
                return this.toI128();
              case "i256":
                return this.toI256();
              case "u64":
                return this.toU64();
              case "u128":
                return this.toU128();
              case "u256":
                return this.toU256();
              default:
                throw TypeError("invalid type: ".concat(this.type));
            }
          } }, { key: "valueOf", value: function() {
            return this.int.valueOf();
          } }, { key: "toString", value: function() {
            return this.int.toString();
          } }, { key: "toJSON", value: function() {
            return { value: this.toBigInt().toString(), type: this.type };
          } }, { key: "_sizeCheck", value: function(e3) {
            if (this.int.size > e3) throw RangeError("value too large for ".concat(e3, " bits (").concat(this.type, ")"));
          } }], [{ key: "isType", value: function(e3) {
            switch (e3) {
              case "i64":
              case "i128":
              case "i256":
              case "u64":
              case "u128":
              case "u256":
                return true;
              default:
                return false;
            }
          } }, { key: "getType", value: function(e3) {
            return e3.slice(3).toLowerCase();
          } }]);
        })();
        function Fi(e3) {
          return Fi = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, Fi(e3);
        }
        function ji(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, Mi(n2.key), n2);
          }
        }
        function Mi(e3) {
          var t3 = (function(e4, t4) {
            if ("object" != Fi(e4) || !e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" != Fi(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" == Fi(t3) ? t3 : t3 + "";
        }
        function Di(e3, t3, r3) {
          return t3 = qi(t3), (function(e4, t4) {
            if (t4 && ("object" == Fi(t4) || "function" == typeof t4)) return t4;
            if (void 0 !== t4) throw new TypeError("Derived constructors may only return object or undefined");
            return (function(e5) {
              if (void 0 === e5) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e5;
            })(e4);
          })(e3, Vi() ? Reflect.construct(t3, r3 || [], qi(e3).constructor) : t3.apply(e3, r3));
        }
        function Vi() {
          try {
            var e3 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            }));
          } catch (e4) {
          }
          return (Vi = function() {
            return !!e3;
          })();
        }
        function qi(e3) {
          return qi = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e4) {
            return e4.__proto__ || Object.getPrototypeOf(e4);
          }, qi(e3);
        }
        function Ki(e3, t3) {
          return Ki = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e4, t4) {
            return e4.__proto__ = t4, e4;
          }, Ki(e3, t3);
        }
        var Hi = (function(e3) {
          function t3(e4, r3) {
            var n2;
            !(function(e5, t4) {
              if (!(e5 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, t3);
            var o2 = e4 < 0, i2 = null !== (n2 = null == r3 ? void 0 : r3.type) && void 0 !== n2 ? n2 : "";
            if (i2.startsWith("u") && o2) throw TypeError("specified type ".concat(r3.type, " yet negative (").concat(e4, ")"));
            if ("" === i2) {
              i2 = o2 ? "i" : "u";
              var a2 = (function(e5) {
                var t4, r4 = e5.toString(2).length;
                return null !== (t4 = [64, 128, 256].find(function(e6) {
                  return r4 <= e6;
                })) && void 0 !== t4 ? t4 : r4;
              })(e4);
              switch (a2) {
                case 64:
                case 128:
                case 256:
                  i2 += a2.toString();
                  break;
                default:
                  throw RangeError("expected 64/128/256 bits for input (".concat(e4, "), got ").concat(a2));
              }
            }
            return Di(this, t3, [i2, e4]);
          }
          return (function(e4, t4) {
            if ("function" != typeof t4 && null !== t4) throw new TypeError("Super expression must either be null or a function");
            e4.prototype = Object.create(t4 && t4.prototype, { constructor: { value: e4, writable: true, configurable: true } }), Object.defineProperty(e4, "prototype", { writable: false }), t4 && Ki(e4, t4);
          })(t3, e3), (function(e4, t4, r3) {
            return t4 && ji(e4.prototype, t4), r3 && ji(e4, r3), Object.defineProperty(e4, "prototype", { writable: false }), e4;
          })(t3);
        })(Li);
        function zi(e3) {
          var t3 = Li.getType(e3.switch().name);
          switch (e3.switch().name) {
            case "scvU32":
            case "scvI32":
              return BigInt(e3.value());
            case "scvU64":
            case "scvI64":
              return new Li(t3, e3.value()).toBigInt();
            case "scvU128":
            case "scvI128":
              return new Li(t3, [e3.value().lo(), e3.value().hi()]).toBigInt();
            case "scvU256":
            case "scvI256":
              return new Li(t3, [e3.value().loLo(), e3.value().loHi(), e3.value().hiLo(), e3.value().hiHi()]).toBigInt();
            default:
              throw TypeError("expected integer type, got ".concat(e3.switch()));
          }
        }
        var Xi = r2(8287).Buffer;
        function $i(e3, t3) {
          return (function(e4) {
            if (Array.isArray(e4)) return e4;
          })(e3) || (function(e4, t4) {
            var r3 = null == e4 ? null : "undefined" != typeof Symbol && e4[Symbol.iterator] || e4["@@iterator"];
            if (null != r3) {
              var n2, o2, i2, a2, s2 = [], u2 = true, c2 = false;
              try {
                if (i2 = (r3 = r3.call(e4)).next, 0 === t4) {
                  if (Object(r3) !== r3) return;
                  u2 = false;
                } else for (; !(u2 = (n2 = i2.call(r3)).done) && (s2.push(n2.value), s2.length !== t4); u2 = true) ;
              } catch (e5) {
                c2 = true, o2 = e5;
              } finally {
                try {
                  if (!u2 && null != r3.return && (a2 = r3.return(), Object(a2) !== a2)) return;
                } finally {
                  if (c2) throw o2;
                }
              }
              return s2;
            }
          })(e3, t3) || (function(e4, t4) {
            if (e4) {
              if ("string" == typeof e4) return Gi(e4, t4);
              var r3 = {}.toString.call(e4).slice(8, -1);
              return "Object" === r3 && e4.constructor && (r3 = e4.constructor.name), "Map" === r3 || "Set" === r3 ? Array.from(e4) : "Arguments" === r3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3) ? Gi(e4, t4) : void 0;
            }
          })(e3, t3) || (function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          })();
        }
        function Gi(e3, t3) {
          (null == t3 || t3 > e3.length) && (t3 = e3.length);
          for (var r3 = 0, n2 = Array(t3); r3 < t3; r3++) n2[r3] = e3[r3];
          return n2;
        }
        function Wi(e3, t3) {
          var r3 = Object.keys(e3);
          if (Object.getOwnPropertySymbols) {
            var n2 = Object.getOwnPropertySymbols(e3);
            t3 && (n2 = n2.filter(function(t4) {
              return Object.getOwnPropertyDescriptor(e3, t4).enumerable;
            })), r3.push.apply(r3, n2);
          }
          return r3;
        }
        function Yi(e3, t3, r3) {
          return (t3 = (function(e4) {
            var t4 = (function(e5, t5) {
              if ("object" != Zi(e5) || !e5) return e5;
              var r4 = e5[Symbol.toPrimitive];
              if (void 0 !== r4) {
                var n2 = r4.call(e5, t5 || "default");
                if ("object" != Zi(n2)) return n2;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return ("string" === t5 ? String : Number)(e5);
            })(e4, "string");
            return "symbol" == Zi(t4) ? t4 : t4 + "";
          })(t3)) in e3 ? Object.defineProperty(e3, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e3[t3] = r3, e3;
        }
        function Zi(e3) {
          return Zi = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, Zi(e3);
        }
        function Ji(e3) {
          var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          switch (Zi(e3)) {
            case "object":
              var r3, n2, o2;
              if (null === e3) return i.ScVal.scvVoid();
              if (e3 instanceof i.ScVal) return e3;
              if (e3 instanceof On) return e3.toScVal();
              if (e3 instanceof lr) return Ji(e3.publicKey(), { type: "address" });
              if (e3 instanceof Qo) return e3.address().toScVal();
              if (e3 instanceof Uint8Array || Xi.isBuffer(e3)) {
                var a2, s2 = Uint8Array.from(e3);
                switch (null !== (a2 = null == t3 ? void 0 : t3.type) && void 0 !== a2 ? a2 : "bytes") {
                  case "bytes":
                    return i.ScVal.scvBytes(s2);
                  case "symbol":
                    return i.ScVal.scvSymbol(s2);
                  case "string":
                    return i.ScVal.scvString(s2);
                  default:
                    throw new TypeError("invalid type (".concat(t3.type, ") specified for bytes-like value"));
                }
              }
              if (Array.isArray(e3)) return i.ScVal.scvVec(e3.map(function(e4, r4) {
                return Array.isArray(t3.type) ? Ji(e4, (function(e5) {
                  for (var t4 = 1; t4 < arguments.length; t4++) {
                    var r5 = null != arguments[t4] ? arguments[t4] : {};
                    t4 % 2 ? Wi(Object(r5), true).forEach(function(t5) {
                      Yi(e5, t5, r5[t5]);
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e5, Object.getOwnPropertyDescriptors(r5)) : Wi(Object(r5)).forEach(function(t5) {
                      Object.defineProperty(e5, t5, Object.getOwnPropertyDescriptor(r5, t5));
                    });
                  }
                  return e5;
                })({}, t3.type.length > r4 && { type: t3.type[r4] })) : Ji(e4, t3);
              }));
              if ("Object" !== (null !== (r3 = null === (n2 = e3.constructor) || void 0 === n2 ? void 0 : n2.name) && void 0 !== r3 ? r3 : "")) throw new TypeError("cannot interpret ".concat(null === (o2 = e3.constructor) || void 0 === o2 ? void 0 : o2.name, " value as ScVal (").concat(JSON.stringify(e3), ")"));
              return i.ScVal.scvMap(Object.entries(e3).sort(function(e4, t4) {
                var r4 = $i(e4, 1)[0], n3 = $i(t4, 1)[0];
                return r4.localeCompare(n3);
              }).map(function(e4) {
                var r4, n3, o3 = $i(e4, 2), a3 = o3[0], s3 = o3[1], u3 = $i(null !== (r4 = (null !== (n3 = null == t3 ? void 0 : t3.type) && void 0 !== n3 ? n3 : {})[a3]) && void 0 !== r4 ? r4 : [null, null], 2), c3 = u3[0], l2 = u3[1], f2 = c3 ? { type: c3 } : {}, p2 = l2 ? { type: l2 } : {};
                return new i.ScMapEntry({ key: Ji(a3, f2), val: Ji(s3, p2) });
              }));
            case "number":
            case "bigint":
              switch (null == t3 ? void 0 : t3.type) {
                case "u32":
                  return i.ScVal.scvU32(e3);
                case "i32":
                  return i.ScVal.scvI32(e3);
              }
              return new Hi(e3, { type: null == t3 ? void 0 : t3.type }).toScVal();
            case "string":
              var u2, c2 = null !== (u2 = null == t3 ? void 0 : t3.type) && void 0 !== u2 ? u2 : "string";
              switch (c2) {
                case "string":
                  return i.ScVal.scvString(e3);
                case "symbol":
                  return i.ScVal.scvSymbol(e3);
                case "address":
                  return new On(e3).toScVal();
                case "u32":
                  return i.ScVal.scvU32(parseInt(e3, 10));
                case "i32":
                  return i.ScVal.scvI32(parseInt(e3, 10));
                default:
                  if (Li.isType(c2)) return new Li(c2, e3).toScVal();
                  throw new TypeError("invalid type (".concat(t3.type, ") specified for string value"));
              }
            case "boolean":
              return i.ScVal.scvBool(e3);
            case "undefined":
              return i.ScVal.scvVoid();
            case "function":
              return Ji(e3());
            default:
              throw new TypeError("failed to convert typeof ".concat(Zi(e3), " (").concat(e3, ")"));
          }
        }
        function Qi(e3) {
          var t3, r3;
          switch (e3.switch().value) {
            case i.ScValType.scvVoid().value:
              return null;
            case i.ScValType.scvU64().value:
            case i.ScValType.scvI64().value:
              return e3.value().toBigInt();
            case i.ScValType.scvU128().value:
            case i.ScValType.scvI128().value:
            case i.ScValType.scvU256().value:
            case i.ScValType.scvI256().value:
              return zi(e3);
            case i.ScValType.scvVec().value:
              return (null !== (t3 = e3.vec()) && void 0 !== t3 ? t3 : []).map(Qi);
            case i.ScValType.scvAddress().value:
              return On.fromScVal(e3).toString();
            case i.ScValType.scvMap().value:
              return Object.fromEntries((null !== (r3 = e3.map()) && void 0 !== r3 ? r3 : []).map(function(e4) {
                return [Qi(e4.key()), Qi(e4.val())];
              }));
            case i.ScValType.scvBool().value:
            case i.ScValType.scvU32().value:
            case i.ScValType.scvI32().value:
            case i.ScValType.scvBytes().value:
              return e3.value();
            case i.ScValType.scvSymbol().value:
            case i.ScValType.scvString().value:
              var n2 = e3.value();
              if (Xi.isBuffer(n2) || ArrayBuffer.isView(n2)) try {
                return new TextDecoder().decode(n2);
              } catch (e4) {
                return new Uint8Array(n2.buffer);
              }
              return n2;
            case i.ScValType.scvTimepoint().value:
            case i.ScValType.scvDuration().value:
              return new i.Uint64(e3.value()).toBigInt();
            case i.ScValType.scvError().value:
              if (e3.error().switch().value === i.ScErrorType.sceContract().value) return { type: "contract", code: e3.error().contractCode() };
              var o2 = e3.error();
              return { type: "system", code: o2.code().value, value: o2.code().name };
            default:
              return e3.value();
          }
        }
        function ea(e3) {
          return ea = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, ea(e3);
        }
        function ta(e3, t3) {
          var r3 = Object.keys(e3);
          if (Object.getOwnPropertySymbols) {
            var n2 = Object.getOwnPropertySymbols(e3);
            t3 && (n2 = n2.filter(function(t4) {
              return Object.getOwnPropertyDescriptor(e3, t4).enumerable;
            })), r3.push.apply(r3, n2);
          }
          return r3;
        }
        function ra(e3) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = null != arguments[t3] ? arguments[t3] : {};
            t3 % 2 ? ta(Object(r3), true).forEach(function(t4) {
              na(e3, t4, r3[t4]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(r3)) : ta(Object(r3)).forEach(function(t4) {
              Object.defineProperty(e3, t4, Object.getOwnPropertyDescriptor(r3, t4));
            });
          }
          return e3;
        }
        function na(e3, t3, r3) {
          return (t3 = (function(e4) {
            var t4 = (function(e5, t5) {
              if ("object" != ea(e5) || !e5) return e5;
              var r4 = e5[Symbol.toPrimitive];
              if (void 0 !== r4) {
                var n2 = r4.call(e5, t5 || "default");
                if ("object" != ea(n2)) return n2;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return ("string" === t5 ? String : Number)(e5);
            })(e4, "string");
            return "symbol" == ea(t4) ? t4 : t4 + "";
          })(t3)) in e3 ? Object.defineProperty(e3, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e3[t3] = r3, e3;
        }
        function oa(e3) {
          return e3.map(function(e4) {
            return e4.inSuccessfulContractCall ? ia(e4.event()) : ia(e4);
          });
        }
        function ia(e3) {
          return ra(ra({}, "function" == typeof e3.contractId && null != e3.contractId() && { contractId: tr.encodeContract(e3.contractId()) }), {}, { type: e3.type().name, topics: e3.body().value().topics().map(function(e4) {
            return Qi(e4);
          }), data: Qi(e3.body().value().data()) });
        }
        i.scvSortedMap = function(e3) {
          var t3 = Array.from(e3).sort(function(e4, t4) {
            var r3 = Qi(e4.key()), n2 = Qi(t4.key());
            switch (Zi(r3)) {
              case "number":
              case "bigint":
                return r3 < n2 ? -1 : 1;
              default:
                return r3.toString().localeCompare(n2.toString());
            }
          });
          return i.ScVal.scvMap(t3);
        };
        var aa = r2(8287).Buffer;
        function sa() {
          var e3, t3, r3 = "function" == typeof Symbol ? Symbol : {}, n2 = r3.iterator || "@@iterator", o2 = r3.toStringTag || "@@toStringTag";
          function i2(r4, n3, o3, i3) {
            var u3 = n3 && n3.prototype instanceof s2 ? n3 : s2, c3 = Object.create(u3.prototype);
            return ua(c3, "_invoke", (function(r5, n4, o4) {
              var i4, s3, u4, c4 = 0, l3 = o4 || [], f3 = false, p3 = { p: 0, n: 0, v: e3, a: d2, f: d2.bind(e3, 4), d: function(t4, r6) {
                return i4 = t4, s3 = 0, u4 = e3, p3.n = r6, a2;
              } };
              function d2(r6, n5) {
                for (s3 = r6, u4 = n5, t3 = 0; !f3 && c4 && !o5 && t3 < l3.length; t3++) {
                  var o5, i5 = l3[t3], d3 = p3.p, h2 = i5[2];
                  r6 > 3 ? (o5 = h2 === n5) && (u4 = i5[(s3 = i5[4]) ? 5 : (s3 = 3, 3)], i5[4] = i5[5] = e3) : i5[0] <= d3 && ((o5 = r6 < 2 && d3 < i5[1]) ? (s3 = 0, p3.v = n5, p3.n = i5[1]) : d3 < h2 && (o5 = r6 < 3 || i5[0] > n5 || n5 > h2) && (i5[4] = r6, i5[5] = n5, p3.n = h2, s3 = 0));
                }
                if (o5 || r6 > 1) return a2;
                throw f3 = true, n5;
              }
              return function(o5, l4, h2) {
                if (c4 > 1) throw TypeError("Generator is already running");
                for (f3 && 1 === l4 && d2(l4, h2), s3 = l4, u4 = h2; (t3 = s3 < 2 ? e3 : u4) || !f3; ) {
                  i4 || (s3 ? s3 < 3 ? (s3 > 1 && (p3.n = -1), d2(s3, u4)) : p3.n = u4 : p3.v = u4);
                  try {
                    if (c4 = 2, i4) {
                      if (s3 || (o5 = "next"), t3 = i4[o5]) {
                        if (!(t3 = t3.call(i4, u4))) throw TypeError("iterator result is not an object");
                        if (!t3.done) return t3;
                        u4 = t3.value, s3 < 2 && (s3 = 0);
                      } else 1 === s3 && (t3 = i4.return) && t3.call(i4), s3 < 2 && (u4 = TypeError("The iterator does not provide a '" + o5 + "' method"), s3 = 1);
                      i4 = e3;
                    } else if ((t3 = (f3 = p3.n < 0) ? u4 : r5.call(n4, p3)) !== a2) break;
                  } catch (t4) {
                    i4 = e3, s3 = 1, u4 = t4;
                  } finally {
                    c4 = 1;
                  }
                }
                return { value: t3, done: f3 };
              };
            })(r4, o3, i3), true), c3;
          }
          var a2 = {};
          function s2() {
          }
          function u2() {
          }
          function c2() {
          }
          t3 = Object.getPrototypeOf;
          var l2 = [][n2] ? t3(t3([][n2]())) : (ua(t3 = {}, n2, function() {
            return this;
          }), t3), f2 = c2.prototype = s2.prototype = Object.create(l2);
          function p2(e4) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(e4, c2) : (e4.__proto__ = c2, ua(e4, o2, "GeneratorFunction")), e4.prototype = Object.create(f2), e4;
          }
          return u2.prototype = c2, ua(f2, "constructor", c2), ua(c2, "constructor", u2), u2.displayName = "GeneratorFunction", ua(c2, o2, "GeneratorFunction"), ua(f2), ua(f2, o2, "Generator"), ua(f2, n2, function() {
            return this;
          }), ua(f2, "toString", function() {
            return "[object Generator]";
          }), (sa = function() {
            return { w: i2, m: p2 };
          })();
        }
        function ua(e3, t3, r3, n2) {
          var o2 = Object.defineProperty;
          try {
            o2({}, "", {});
          } catch (e4) {
            o2 = 0;
          }
          ua = function(e4, t4, r4, n3) {
            function i2(t5, r5) {
              ua(e4, t5, function(e5) {
                return this._invoke(t5, r5, e5);
              });
            }
            t4 ? o2 ? o2(e4, t4, { value: r4, enumerable: !n3, configurable: !n3, writable: !n3 }) : e4[t4] = r4 : (i2("next", 0), i2("throw", 1), i2("return", 2));
          }, ua(e3, t3, r3, n2);
        }
        function ca(e3, t3, r3, n2, o2, i2, a2) {
          try {
            var s2 = e3[i2](a2), u2 = s2.value;
          } catch (e4) {
            return void r3(e4);
          }
          s2.done ? t3(u2) : Promise.resolve(u2).then(n2, o2);
        }
        function la(e3, t3, r3) {
          return fa.apply(this, arguments);
        }
        function fa() {
          var e3;
          return e3 = sa().m(function e4(t3, r3, n2) {
            var o2, a2, s2, c2, l2, f2, p2, d2, h2, y2, m2 = arguments;
            return sa().w(function(e5) {
              for (; ; ) switch (e5.n) {
                case 0:
                  if (o2 = m2.length > 3 && void 0 !== m2[3] ? m2[3] : Ko.FUTURENET, t3.credentials().switch().value === i.SorobanCredentialsType.sorobanCredentialsAddress().value) {
                    e5.n = 1;
                    break;
                  }
                  return e5.a(2, t3);
                case 1:
                  if (a2 = i.SorobanAuthorizationEntry.fromXDR(t3.toXDR()), (s2 = a2.credentials().address()).signatureExpirationLedger(n2), c2 = u(aa.from(o2)), l2 = i.HashIdPreimage.envelopeTypeSorobanAuthorization(new i.HashIdPreimageSorobanAuthorization({ networkId: c2, nonce: s2.nonce(), invocation: a2.rootInvocation(), signatureExpirationLedger: s2.signatureExpirationLedger() })), f2 = u(l2.toXDR()), "function" != typeof r3) {
                    e5.n = 3;
                    break;
                  }
                  return e5.n = 2, r3(l2);
                case 2:
                  null != (h2 = e5.v) && h2.signature ? (p2 = aa.from(h2.signature), d2 = h2.publicKey) : (p2 = aa.from(h2), d2 = On.fromScAddress(s2.address()).toString()), e5.n = 4;
                  break;
                case 3:
                  p2 = aa.from(r3.sign(f2)), d2 = r3.publicKey();
                case 4:
                  if (lr.fromPublicKey(d2).verify(f2, p2)) {
                    e5.n = 5;
                    break;
                  }
                  throw new Error("signature doesn't match payload");
                case 5:
                  return y2 = Ji({ public_key: tr.decodeEd25519PublicKey(d2), signature: p2 }, { type: { public_key: ["symbol", null], signature: ["symbol", null] } }), s2.signature(i.ScVal.scvVec([y2])), e5.a(2, a2);
              }
            }, e4);
          }), fa = function() {
            var t3 = this, r3 = arguments;
            return new Promise(function(n2, o2) {
              var i2 = e3.apply(t3, r3);
              function a2(e4) {
                ca(i2, n2, o2, a2, s2, "next", e4);
              }
              function s2(e4) {
                ca(i2, n2, o2, a2, s2, "throw", e4);
              }
              a2(void 0);
            });
          }, fa.apply(this, arguments);
        }
        function pa(e3, t3, r3) {
          var n2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "", o2 = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : Ko.FUTURENET, a2 = lr.random().rawPublicKey(), s2 = new i.Int64(a2.subarray(0, 8).reduce(function(e4, t4) {
            return e4 << 8 | t4;
          }, 0)), u2 = n2 || e3.publicKey();
          if (!u2) throw new Error("authorizeInvocation requires publicKey parameter");
          return la(new i.SorobanAuthorizationEntry({ rootInvocation: r3, credentials: i.SorobanCredentials.sorobanCredentialsAddress(new i.SorobanAddressCredentials({ address: new On(u2).toScAddress(), nonce: s2, signatureExpirationLedger: 0, signature: i.ScVal.scvVec([]) })) }), e3, t3, o2);
        }
        function da(e3) {
          return da = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, da(e3);
        }
        function ha(e3, t3) {
          var r3 = Object.keys(e3);
          if (Object.getOwnPropertySymbols) {
            var n2 = Object.getOwnPropertySymbols(e3);
            t3 && (n2 = n2.filter(function(t4) {
              return Object.getOwnPropertyDescriptor(e3, t4).enumerable;
            })), r3.push.apply(r3, n2);
          }
          return r3;
        }
        function ya(e3, t3, r3) {
          return (t3 = (function(e4) {
            var t4 = (function(e5, t5) {
              if ("object" != da(e5) || !e5) return e5;
              var r4 = e5[Symbol.toPrimitive];
              if (void 0 !== r4) {
                var n2 = r4.call(e5, t5 || "default");
                if ("object" != da(n2)) return n2;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return ("string" === t5 ? String : Number)(e5);
            })(e4, "string");
            return "symbol" == da(t4) ? t4 : t4 + "";
          })(t3)) in e3 ? Object.defineProperty(e3, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e3[t3] = r3, e3;
        }
        function ma(e3) {
          var t3 = e3.function(), r3 = {}, n2 = t3.value();
          switch (t3.switch().value) {
            case 0:
              r3.type = "execute", r3.args = { source: On.fromScAddress(n2.contractAddress()).toString(), function: n2.functionName(), args: n2.args().map(function(e4) {
                return Qi(e4);
              }) };
              break;
            case 1:
            case 2:
              var o2 = 2 === t3.switch().value;
              r3.type = "create", r3.args = {};
              var i2 = [n2.executable(), n2.contractIdPreimage()], a2 = i2[0], s2 = i2[1];
              if (!!a2.switch().value != !!s2.switch().value) throw new Error("creation function appears invalid: ".concat(JSON.stringify(n2), " (should be wasm+address or token+asset)"));
              switch (a2.switch().value) {
                case 0:
                  var u2 = s2.fromAddress();
                  r3.args.type = "wasm", r3.args.wasm = (function(e4) {
                    for (var t4 = 1; t4 < arguments.length; t4++) {
                      var r4 = null != arguments[t4] ? arguments[t4] : {};
                      t4 % 2 ? ha(Object(r4), true).forEach(function(t5) {
                        ya(e4, t5, r4[t5]);
                      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(r4)) : ha(Object(r4)).forEach(function(t5) {
                        Object.defineProperty(e4, t5, Object.getOwnPropertyDescriptor(r4, t5));
                      });
                    }
                    return e4;
                  })({ salt: u2.salt().toString("hex"), hash: a2.wasmHash().toString("hex"), address: On.fromScAddress(u2.address()).toString() }, o2 && { constructorArgs: n2.constructorArgs().map(function(e4) {
                    return Qi(e4);
                  }) });
                  break;
                case 1:
                  r3.args.type = "sac", r3.args.asset = yr.fromOperation(s2.fromAsset()).toString();
                  break;
                default:
                  throw new Error("unknown creation type: ".concat(JSON.stringify(a2)));
              }
              break;
            default:
              throw new Error("unknown invocation type (".concat(t3.switch(), "): ").concat(JSON.stringify(t3)));
          }
          return r3.invocations = e3.subInvocations().map(function(e4) {
            return ma(e4);
          }), r3;
        }
        function ga(e3, t3) {
          va(e3, 1, t3);
        }
        function va(e3, t3, r3, n2) {
          false !== r3(e3, t3, n2) && e3.subInvocations().forEach(function(n3) {
            return va(n3, t3 + 1, r3, e3);
          });
        }
        const ba = (e2 = r2.hmd(e2)).exports;
      }, 453: (e2, t2, r2) => {
        "use strict";
        var n, o = r2(9612), i = r2(9383), a = r2(1237), s = r2(9290), u = r2(9538), c = r2(8068), l = r2(9675), f = r2(5345), p = r2(1514), d = r2(8968), h = r2(6188), y = r2(8002), m = r2(5880), g = r2(414), v = r2(3093), b = Function, w = function(e3) {
          try {
            return b('"use strict"; return (' + e3 + ").constructor;")();
          } catch (e4) {
          }
        }, S = r2(5795), E = r2(655), k = function() {
          throw new l();
        }, A = S ? (function() {
          try {
            return k;
          } catch (e3) {
            try {
              return S(arguments, "callee").get;
            } catch (e4) {
              return k;
            }
          }
        })() : k, T = r2(4039)(), O = r2(3628), x = r2(1064), P = r2(8648), B = r2(1002), I = r2(76), C = {}, R = "undefined" != typeof Uint8Array && O ? O(Uint8Array) : n, _ = { __proto__: null, "%AggregateError%": "undefined" == typeof AggregateError ? n : AggregateError, "%Array%": Array, "%ArrayBuffer%": "undefined" == typeof ArrayBuffer ? n : ArrayBuffer, "%ArrayIteratorPrototype%": T && O ? O([][Symbol.iterator]()) : n, "%AsyncFromSyncIteratorPrototype%": n, "%AsyncFunction%": C, "%AsyncGenerator%": C, "%AsyncGeneratorFunction%": C, "%AsyncIteratorPrototype%": C, "%Atomics%": "undefined" == typeof Atomics ? n : Atomics, "%BigInt%": "undefined" == typeof BigInt ? n : BigInt, "%BigInt64Array%": "undefined" == typeof BigInt64Array ? n : BigInt64Array, "%BigUint64Array%": "undefined" == typeof BigUint64Array ? n : BigUint64Array, "%Boolean%": Boolean, "%DataView%": "undefined" == typeof DataView ? n : DataView, "%Date%": Date, "%decodeURI%": decodeURI, "%decodeURIComponent%": decodeURIComponent, "%encodeURI%": encodeURI, "%encodeURIComponent%": encodeURIComponent, "%Error%": i, "%eval%": eval, "%EvalError%": a, "%Float16Array%": "undefined" == typeof Float16Array ? n : Float16Array, "%Float32Array%": "undefined" == typeof Float32Array ? n : Float32Array, "%Float64Array%": "undefined" == typeof Float64Array ? n : Float64Array, "%FinalizationRegistry%": "undefined" == typeof FinalizationRegistry ? n : FinalizationRegistry, "%Function%": b, "%GeneratorFunction%": C, "%Int8Array%": "undefined" == typeof Int8Array ? n : Int8Array, "%Int16Array%": "undefined" == typeof Int16Array ? n : Int16Array, "%Int32Array%": "undefined" == typeof Int32Array ? n : Int32Array, "%isFinite%": isFinite, "%isNaN%": isNaN, "%IteratorPrototype%": T && O ? O(O([][Symbol.iterator]())) : n, "%JSON%": "object" == typeof JSON ? JSON : n, "%Map%": "undefined" == typeof Map ? n : Map, "%MapIteratorPrototype%": "undefined" != typeof Map && T && O ? O((/* @__PURE__ */ new Map())[Symbol.iterator]()) : n, "%Math%": Math, "%Number%": Number, "%Object%": o, "%Object.getOwnPropertyDescriptor%": S, "%parseFloat%": parseFloat, "%parseInt%": parseInt, "%Promise%": "undefined" == typeof Promise ? n : Promise, "%Proxy%": "undefined" == typeof Proxy ? n : Proxy, "%RangeError%": s, "%ReferenceError%": u, "%Reflect%": "undefined" == typeof Reflect ? n : Reflect, "%RegExp%": RegExp, "%Set%": "undefined" == typeof Set ? n : Set, "%SetIteratorPrototype%": "undefined" != typeof Set && T && O ? O((/* @__PURE__ */ new Set())[Symbol.iterator]()) : n, "%SharedArrayBuffer%": "undefined" == typeof SharedArrayBuffer ? n : SharedArrayBuffer, "%String%": String, "%StringIteratorPrototype%": T && O ? O(""[Symbol.iterator]()) : n, "%Symbol%": T ? Symbol : n, "%SyntaxError%": c, "%ThrowTypeError%": A, "%TypedArray%": R, "%TypeError%": l, "%Uint8Array%": "undefined" == typeof Uint8Array ? n : Uint8Array, "%Uint8ClampedArray%": "undefined" == typeof Uint8ClampedArray ? n : Uint8ClampedArray, "%Uint16Array%": "undefined" == typeof Uint16Array ? n : Uint16Array, "%Uint32Array%": "undefined" == typeof Uint32Array ? n : Uint32Array, "%URIError%": f, "%WeakMap%": "undefined" == typeof WeakMap ? n : WeakMap, "%WeakRef%": "undefined" == typeof WeakRef ? n : WeakRef, "%WeakSet%": "undefined" == typeof WeakSet ? n : WeakSet, "%Function.prototype.call%": I, "%Function.prototype.apply%": B, "%Object.defineProperty%": E, "%Object.getPrototypeOf%": x, "%Math.abs%": p, "%Math.floor%": d, "%Math.max%": h, "%Math.min%": y, "%Math.pow%": m, "%Math.round%": g, "%Math.sign%": v, "%Reflect.getPrototypeOf%": P };
        if (O) try {
          null.error;
        } catch (e3) {
          var U = O(O(e3));
          _["%Error.prototype%"] = U;
        }
        var N = function e3(t3) {
          var r3;
          if ("%AsyncFunction%" === t3) r3 = w("async function () {}");
          else if ("%GeneratorFunction%" === t3) r3 = w("function* () {}");
          else if ("%AsyncGeneratorFunction%" === t3) r3 = w("async function* () {}");
          else if ("%AsyncGenerator%" === t3) {
            var n2 = e3("%AsyncGeneratorFunction%");
            n2 && (r3 = n2.prototype);
          } else if ("%AsyncIteratorPrototype%" === t3) {
            var o2 = e3("%AsyncGenerator%");
            o2 && O && (r3 = O(o2.prototype));
          }
          return _[t3] = r3, r3;
        }, L = { __proto__: null, "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"], "%ArrayPrototype%": ["Array", "prototype"], "%ArrayProto_entries%": ["Array", "prototype", "entries"], "%ArrayProto_forEach%": ["Array", "prototype", "forEach"], "%ArrayProto_keys%": ["Array", "prototype", "keys"], "%ArrayProto_values%": ["Array", "prototype", "values"], "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"], "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"], "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"], "%BooleanPrototype%": ["Boolean", "prototype"], "%DataViewPrototype%": ["DataView", "prototype"], "%DatePrototype%": ["Date", "prototype"], "%ErrorPrototype%": ["Error", "prototype"], "%EvalErrorPrototype%": ["EvalError", "prototype"], "%Float32ArrayPrototype%": ["Float32Array", "prototype"], "%Float64ArrayPrototype%": ["Float64Array", "prototype"], "%FunctionPrototype%": ["Function", "prototype"], "%Generator%": ["GeneratorFunction", "prototype"], "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"], "%Int8ArrayPrototype%": ["Int8Array", "prototype"], "%Int16ArrayPrototype%": ["Int16Array", "prototype"], "%Int32ArrayPrototype%": ["Int32Array", "prototype"], "%JSONParse%": ["JSON", "parse"], "%JSONStringify%": ["JSON", "stringify"], "%MapPrototype%": ["Map", "prototype"], "%NumberPrototype%": ["Number", "prototype"], "%ObjectPrototype%": ["Object", "prototype"], "%ObjProto_toString%": ["Object", "prototype", "toString"], "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"], "%PromisePrototype%": ["Promise", "prototype"], "%PromiseProto_then%": ["Promise", "prototype", "then"], "%Promise_all%": ["Promise", "all"], "%Promise_reject%": ["Promise", "reject"], "%Promise_resolve%": ["Promise", "resolve"], "%RangeErrorPrototype%": ["RangeError", "prototype"], "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"], "%RegExpPrototype%": ["RegExp", "prototype"], "%SetPrototype%": ["Set", "prototype"], "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"], "%StringPrototype%": ["String", "prototype"], "%SymbolPrototype%": ["Symbol", "prototype"], "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"], "%TypedArrayPrototype%": ["TypedArray", "prototype"], "%TypeErrorPrototype%": ["TypeError", "prototype"], "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"], "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"], "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"], "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"], "%URIErrorPrototype%": ["URIError", "prototype"], "%WeakMapPrototype%": ["WeakMap", "prototype"], "%WeakSetPrototype%": ["WeakSet", "prototype"] }, F = r2(6743), j = r2(9957), M = F.call(I, Array.prototype.concat), D = F.call(B, Array.prototype.splice), V = F.call(I, String.prototype.replace), q = F.call(I, String.prototype.slice), K = F.call(I, RegExp.prototype.exec), H = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, z = /\\(\\)?/g, X = function(e3, t3) {
          var r3, n2 = e3;
          if (j(L, n2) && (n2 = "%" + (r3 = L[n2])[0] + "%"), j(_, n2)) {
            var o2 = _[n2];
            if (o2 === C && (o2 = N(n2)), void 0 === o2 && !t3) throw new l("intrinsic " + e3 + " exists, but is not available. Please file an issue!");
            return { alias: r3, name: n2, value: o2 };
          }
          throw new c("intrinsic " + e3 + " does not exist!");
        };
        e2.exports = function(e3, t3) {
          if ("string" != typeof e3 || 0 === e3.length) throw new l("intrinsic name must be a non-empty string");
          if (arguments.length > 1 && "boolean" != typeof t3) throw new l('"allowMissing" argument must be a boolean');
          if (null === K(/^%?[^%]*%?$/, e3)) throw new c("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
          var r3 = (function(e4) {
            var t4 = q(e4, 0, 1), r4 = q(e4, -1);
            if ("%" === t4 && "%" !== r4) throw new c("invalid intrinsic syntax, expected closing `%`");
            if ("%" === r4 && "%" !== t4) throw new c("invalid intrinsic syntax, expected opening `%`");
            var n3 = [];
            return V(e4, H, function(e5, t5, r5, o3) {
              n3[n3.length] = r5 ? V(o3, z, "$1") : t5 || e5;
            }), n3;
          })(e3), n2 = r3.length > 0 ? r3[0] : "", o2 = X("%" + n2 + "%", t3), i2 = o2.name, a2 = o2.value, s2 = false, u2 = o2.alias;
          u2 && (n2 = u2[0], D(r3, M([0, 1], u2)));
          for (var f2 = 1, p2 = true; f2 < r3.length; f2 += 1) {
            var d2 = r3[f2], h2 = q(d2, 0, 1), y2 = q(d2, -1);
            if (('"' === h2 || "'" === h2 || "`" === h2 || '"' === y2 || "'" === y2 || "`" === y2) && h2 !== y2) throw new c("property names with quotes must have matching quotes");
            if ("constructor" !== d2 && p2 || (s2 = true), j(_, i2 = "%" + (n2 += "." + d2) + "%")) a2 = _[i2];
            else if (null != a2) {
              if (!(d2 in a2)) {
                if (!t3) throw new l("base intrinsic for " + e3 + " exists, but the property is not available.");
                return;
              }
              if (S && f2 + 1 >= r3.length) {
                var m2 = S(a2, d2);
                a2 = (p2 = !!m2) && "get" in m2 && !("originalValue" in m2.get) ? m2.get : a2[d2];
              } else p2 = j(a2, d2), a2 = a2[d2];
              p2 && !s2 && (_[i2] = a2);
            }
          }
          return a2;
        };
      }, 487: (e2, t2, r2) => {
        "use strict";
        var n = r2(6897), o = r2(655), i = r2(3126), a = r2(2205);
        e2.exports = function(e3) {
          var t3 = i(arguments), r3 = e3.length - (arguments.length - 1);
          return n(t3, 1 + (r3 > 0 ? r3 : 0), true);
        }, o ? o(e2.exports, "apply", { value: a }) : e2.exports.apply = a;
      }, 537: (e2, t2, r2) => {
        var n = r2(5606), o = r2(6763), i = Object.getOwnPropertyDescriptors || function(e3) {
          for (var t3 = Object.keys(e3), r3 = {}, n2 = 0; n2 < t3.length; n2++) r3[t3[n2]] = Object.getOwnPropertyDescriptor(e3, t3[n2]);
          return r3;
        }, a = /%[sdj%]/g;
        t2.format = function(e3) {
          if (!w(e3)) {
            for (var t3 = [], r3 = 0; r3 < arguments.length; r3++) t3.push(l(arguments[r3]));
            return t3.join(" ");
          }
          r3 = 1;
          for (var n2 = arguments, o2 = n2.length, i2 = String(e3).replace(a, function(e4) {
            if ("%%" === e4) return "%";
            if (r3 >= o2) return e4;
            switch (e4) {
              case "%s":
                return String(n2[r3++]);
              case "%d":
                return Number(n2[r3++]);
              case "%j":
                try {
                  return JSON.stringify(n2[r3++]);
                } catch (e5) {
                  return "[Circular]";
                }
              default:
                return e4;
            }
          }), s2 = n2[r3]; r3 < o2; s2 = n2[++r3]) v(s2) || !k(s2) ? i2 += " " + s2 : i2 += " " + l(s2);
          return i2;
        }, t2.deprecate = function(e3, r3) {
          if (void 0 !== n && true === n.noDeprecation) return e3;
          if (void 0 === n) return function() {
            return t2.deprecate(e3, r3).apply(this, arguments);
          };
          var i2 = false;
          return function() {
            if (!i2) {
              if (n.throwDeprecation) throw new Error(r3);
              n.traceDeprecation ? o.trace(r3) : o.error(r3), i2 = true;
            }
            return e3.apply(this, arguments);
          };
        };
        var s = {}, u = /^$/;
        if (n.env.NODE_DEBUG) {
          var c = n.env.NODE_DEBUG;
          c = c.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(), u = new RegExp("^" + c + "$", "i");
        }
        function l(e3, r3) {
          var n2 = { seen: [], stylize: p };
          return arguments.length >= 3 && (n2.depth = arguments[2]), arguments.length >= 4 && (n2.colors = arguments[3]), g(r3) ? n2.showHidden = r3 : r3 && t2._extend(n2, r3), S(n2.showHidden) && (n2.showHidden = false), S(n2.depth) && (n2.depth = 2), S(n2.colors) && (n2.colors = false), S(n2.customInspect) && (n2.customInspect = true), n2.colors && (n2.stylize = f), d(n2, e3, n2.depth);
        }
        function f(e3, t3) {
          var r3 = l.styles[t3];
          return r3 ? "\x1B[" + l.colors[r3][0] + "m" + e3 + "\x1B[" + l.colors[r3][1] + "m" : e3;
        }
        function p(e3, t3) {
          return e3;
        }
        function d(e3, r3, n2) {
          if (e3.customInspect && r3 && O(r3.inspect) && r3.inspect !== t2.inspect && (!r3.constructor || r3.constructor.prototype !== r3)) {
            var o2 = r3.inspect(n2, e3);
            return w(o2) || (o2 = d(e3, o2, n2)), o2;
          }
          var i2 = (function(e4, t3) {
            if (S(t3)) return e4.stylize("undefined", "undefined");
            if (w(t3)) {
              var r4 = "'" + JSON.stringify(t3).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
              return e4.stylize(r4, "string");
            }
            if (b(t3)) return e4.stylize("" + t3, "number");
            if (g(t3)) return e4.stylize("" + t3, "boolean");
            if (v(t3)) return e4.stylize("null", "null");
          })(e3, r3);
          if (i2) return i2;
          var a2 = Object.keys(r3), s2 = (function(e4) {
            var t3 = {};
            return e4.forEach(function(e5, r4) {
              t3[e5] = true;
            }), t3;
          })(a2);
          if (e3.showHidden && (a2 = Object.getOwnPropertyNames(r3)), T(r3) && (a2.indexOf("message") >= 0 || a2.indexOf("description") >= 0)) return h(r3);
          if (0 === a2.length) {
            if (O(r3)) {
              var u2 = r3.name ? ": " + r3.name : "";
              return e3.stylize("[Function" + u2 + "]", "special");
            }
            if (E(r3)) return e3.stylize(RegExp.prototype.toString.call(r3), "regexp");
            if (A(r3)) return e3.stylize(Date.prototype.toString.call(r3), "date");
            if (T(r3)) return h(r3);
          }
          var c2, l2 = "", f2 = false, p2 = ["{", "}"];
          (m(r3) && (f2 = true, p2 = ["[", "]"]), O(r3)) && (l2 = " [Function" + (r3.name ? ": " + r3.name : "") + "]");
          return E(r3) && (l2 = " " + RegExp.prototype.toString.call(r3)), A(r3) && (l2 = " " + Date.prototype.toUTCString.call(r3)), T(r3) && (l2 = " " + h(r3)), 0 !== a2.length || f2 && 0 != r3.length ? n2 < 0 ? E(r3) ? e3.stylize(RegExp.prototype.toString.call(r3), "regexp") : e3.stylize("[Object]", "special") : (e3.seen.push(r3), c2 = f2 ? (function(e4, t3, r4, n3, o3) {
            for (var i3 = [], a3 = 0, s3 = t3.length; a3 < s3; ++a3) I(t3, String(a3)) ? i3.push(y(e4, t3, r4, n3, String(a3), true)) : i3.push("");
            return o3.forEach(function(o4) {
              o4.match(/^\d+$/) || i3.push(y(e4, t3, r4, n3, o4, true));
            }), i3;
          })(e3, r3, n2, s2, a2) : a2.map(function(t3) {
            return y(e3, r3, n2, s2, t3, f2);
          }), e3.seen.pop(), (function(e4, t3, r4) {
            var n3 = e4.reduce(function(e5, t4) {
              return t4.indexOf("\n") >= 0 && 0, e5 + t4.replace(/\u001b\[\d\d?m/g, "").length + 1;
            }, 0);
            if (n3 > 60) return r4[0] + ("" === t3 ? "" : t3 + "\n ") + " " + e4.join(",\n  ") + " " + r4[1];
            return r4[0] + t3 + " " + e4.join(", ") + " " + r4[1];
          })(c2, l2, p2)) : p2[0] + l2 + p2[1];
        }
        function h(e3) {
          return "[" + Error.prototype.toString.call(e3) + "]";
        }
        function y(e3, t3, r3, n2, o2, i2) {
          var a2, s2, u2;
          if ((u2 = Object.getOwnPropertyDescriptor(t3, o2) || { value: t3[o2] }).get ? s2 = u2.set ? e3.stylize("[Getter/Setter]", "special") : e3.stylize("[Getter]", "special") : u2.set && (s2 = e3.stylize("[Setter]", "special")), I(n2, o2) || (a2 = "[" + o2 + "]"), s2 || (e3.seen.indexOf(u2.value) < 0 ? (s2 = v(r3) ? d(e3, u2.value, null) : d(e3, u2.value, r3 - 1)).indexOf("\n") > -1 && (s2 = i2 ? s2.split("\n").map(function(e4) {
            return "  " + e4;
          }).join("\n").slice(2) : "\n" + s2.split("\n").map(function(e4) {
            return "   " + e4;
          }).join("\n")) : s2 = e3.stylize("[Circular]", "special")), S(a2)) {
            if (i2 && o2.match(/^\d+$/)) return s2;
            (a2 = JSON.stringify("" + o2)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (a2 = a2.slice(1, -1), a2 = e3.stylize(a2, "name")) : (a2 = a2.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), a2 = e3.stylize(a2, "string"));
          }
          return a2 + ": " + s2;
        }
        function m(e3) {
          return Array.isArray(e3);
        }
        function g(e3) {
          return "boolean" == typeof e3;
        }
        function v(e3) {
          return null === e3;
        }
        function b(e3) {
          return "number" == typeof e3;
        }
        function w(e3) {
          return "string" == typeof e3;
        }
        function S(e3) {
          return void 0 === e3;
        }
        function E(e3) {
          return k(e3) && "[object RegExp]" === x(e3);
        }
        function k(e3) {
          return "object" == typeof e3 && null !== e3;
        }
        function A(e3) {
          return k(e3) && "[object Date]" === x(e3);
        }
        function T(e3) {
          return k(e3) && ("[object Error]" === x(e3) || e3 instanceof Error);
        }
        function O(e3) {
          return "function" == typeof e3;
        }
        function x(e3) {
          return Object.prototype.toString.call(e3);
        }
        function P(e3) {
          return e3 < 10 ? "0" + e3.toString(10) : e3.toString(10);
        }
        t2.debuglog = function(e3) {
          if (e3 = e3.toUpperCase(), !s[e3]) if (u.test(e3)) {
            var r3 = n.pid;
            s[e3] = function() {
              var n2 = t2.format.apply(t2, arguments);
              o.error("%s %d: %s", e3, r3, n2);
            };
          } else s[e3] = function() {
          };
          return s[e3];
        }, t2.inspect = l, l.colors = { bold: [1, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], white: [37, 39], grey: [90, 39], black: [30, 39], blue: [34, 39], cyan: [36, 39], green: [32, 39], magenta: [35, 39], red: [31, 39], yellow: [33, 39] }, l.styles = { special: "cyan", number: "yellow", boolean: "yellow", undefined: "grey", null: "bold", string: "green", date: "magenta", regexp: "red" }, t2.types = r2(9032), t2.isArray = m, t2.isBoolean = g, t2.isNull = v, t2.isNullOrUndefined = function(e3) {
          return null == e3;
        }, t2.isNumber = b, t2.isString = w, t2.isSymbol = function(e3) {
          return "symbol" == typeof e3;
        }, t2.isUndefined = S, t2.isRegExp = E, t2.types.isRegExp = E, t2.isObject = k, t2.isDate = A, t2.types.isDate = A, t2.isError = T, t2.types.isNativeError = T, t2.isFunction = O, t2.isPrimitive = function(e3) {
          return null === e3 || "boolean" == typeof e3 || "number" == typeof e3 || "string" == typeof e3 || "symbol" == typeof e3 || void 0 === e3;
        }, t2.isBuffer = r2(1135);
        var B = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        function I(e3, t3) {
          return Object.prototype.hasOwnProperty.call(e3, t3);
        }
        t2.log = function() {
          var e3, r3;
          o.log("%s - %s", (e3 = /* @__PURE__ */ new Date(), r3 = [P(e3.getHours()), P(e3.getMinutes()), P(e3.getSeconds())].join(":"), [e3.getDate(), B[e3.getMonth()], r3].join(" ")), t2.format.apply(t2, arguments));
        }, t2.inherits = r2(6698), t2._extend = function(e3, t3) {
          if (!t3 || !k(t3)) return e3;
          for (var r3 = Object.keys(t3), n2 = r3.length; n2--; ) e3[r3[n2]] = t3[r3[n2]];
          return e3;
        };
        var C = "undefined" != typeof Symbol ? Symbol("util.promisify.custom") : void 0;
        function R(e3, t3) {
          if (!e3) {
            var r3 = new Error("Promise was rejected with a falsy value");
            r3.reason = e3, e3 = r3;
          }
          return t3(e3);
        }
        t2.promisify = function(e3) {
          if ("function" != typeof e3) throw new TypeError('The "original" argument must be of type Function');
          if (C && e3[C]) {
            var t3;
            if ("function" != typeof (t3 = e3[C])) throw new TypeError('The "util.promisify.custom" argument must be of type Function');
            return Object.defineProperty(t3, C, { value: t3, enumerable: false, writable: false, configurable: true }), t3;
          }
          function t3() {
            for (var t4, r3, n2 = new Promise(function(e4, n3) {
              t4 = e4, r3 = n3;
            }), o2 = [], i2 = 0; i2 < arguments.length; i2++) o2.push(arguments[i2]);
            o2.push(function(e4, n3) {
              e4 ? r3(e4) : t4(n3);
            });
            try {
              e3.apply(this, o2);
            } catch (e4) {
              r3(e4);
            }
            return n2;
          }
          return Object.setPrototypeOf(t3, Object.getPrototypeOf(e3)), C && Object.defineProperty(t3, C, { value: t3, enumerable: false, writable: false, configurable: true }), Object.defineProperties(t3, i(e3));
        }, t2.promisify.custom = C, t2.callbackify = function(e3) {
          if ("function" != typeof e3) throw new TypeError('The "original" argument must be of type Function');
          function t3() {
            for (var t4 = [], r3 = 0; r3 < arguments.length; r3++) t4.push(arguments[r3]);
            var o2 = t4.pop();
            if ("function" != typeof o2) throw new TypeError("The last argument must be of type Function");
            var i2 = this, a2 = function() {
              return o2.apply(i2, arguments);
            };
            e3.apply(this, t4).then(function(e4) {
              n.nextTick(a2.bind(null, null, e4));
            }, function(e4) {
              n.nextTick(R.bind(null, e4, a2));
            });
          }
          return Object.setPrototypeOf(t3, Object.getPrototypeOf(e3)), Object.defineProperties(t3, i(e3)), t3;
        };
      }, 592: (e2, t2, r2) => {
        "use strict";
        var n = r2(655), o = function() {
          return !!n;
        };
        o.hasArrayLengthDefineBug = function() {
          if (!n) return null;
          try {
            return 1 !== n([], "length", { value: 1 }).length;
          } catch (e3) {
            return true;
          }
        }, e2.exports = o;
      }, 655: (e2) => {
        "use strict";
        var t2 = Object.defineProperty || false;
        if (t2) try {
          t2({}, "a", { value: 1 });
        } catch (e3) {
          t2 = false;
        }
        e2.exports = t2;
      }, 1002: (e2) => {
        "use strict";
        e2.exports = Function.prototype.apply;
      }, 1064: (e2, t2, r2) => {
        "use strict";
        var n = r2(9612);
        e2.exports = n.getPrototypeOf || null;
      }, 1093: (e2) => {
        "use strict";
        var t2 = Object.prototype.toString;
        e2.exports = function(e3) {
          var r2 = t2.call(e3), n = "[object Arguments]" === r2;
          return n || (n = "[object Array]" !== r2 && null !== e3 && "object" == typeof e3 && "number" == typeof e3.length && e3.length >= 0 && "[object Function]" === t2.call(e3.callee)), n;
        };
      }, 1135: (e2) => {
        e2.exports = function(e3) {
          return e3 && "object" == typeof e3 && "function" == typeof e3.copy && "function" == typeof e3.fill && "function" == typeof e3.readUInt8;
        };
      }, 1189: (e2, t2, r2) => {
        "use strict";
        var n = Array.prototype.slice, o = r2(1093), i = Object.keys, a = i ? function(e3) {
          return i(e3);
        } : r2(8875), s = Object.keys;
        a.shim = function() {
          if (Object.keys) {
            var e3 = (function() {
              var e4 = Object.keys(arguments);
              return e4 && e4.length === arguments.length;
            })(1, 2);
            e3 || (Object.keys = function(e4) {
              return o(e4) ? s(n.call(e4)) : s(e4);
            });
          } else Object.keys = a;
          return Object.keys || a;
        }, e2.exports = a;
      }, 1237: (e2) => {
        "use strict";
        e2.exports = EvalError;
      }, 1333: (e2) => {
        "use strict";
        e2.exports = function() {
          if ("function" != typeof Symbol || "function" != typeof Object.getOwnPropertySymbols) return false;
          if ("symbol" == typeof Symbol.iterator) return true;
          var e3 = {}, t2 = Symbol("test"), r2 = Object(t2);
          if ("string" == typeof t2) return false;
          if ("[object Symbol]" !== Object.prototype.toString.call(t2)) return false;
          if ("[object Symbol]" !== Object.prototype.toString.call(r2)) return false;
          for (var n in e3[t2] = 42, e3) return false;
          if ("function" == typeof Object.keys && 0 !== Object.keys(e3).length) return false;
          if ("function" == typeof Object.getOwnPropertyNames && 0 !== Object.getOwnPropertyNames(e3).length) return false;
          var o = Object.getOwnPropertySymbols(e3);
          if (1 !== o.length || o[0] !== t2) return false;
          if (!Object.prototype.propertyIsEnumerable.call(e3, t2)) return false;
          if ("function" == typeof Object.getOwnPropertyDescriptor) {
            var i = Object.getOwnPropertyDescriptor(e3, t2);
            if (42 !== i.value || true !== i.enumerable) return false;
          }
          return true;
        };
      }, 1514: (e2) => {
        "use strict";
        e2.exports = Math.abs;
      }, 2205: (e2, t2, r2) => {
        "use strict";
        var n = r2(6743), o = r2(1002), i = r2(3144);
        e2.exports = function() {
          return i(n, o, arguments);
        };
      }, 2299: (e2, t2, r2) => {
        "use strict";
        function n(e3, t3) {
          return (function(e4) {
            if (Array.isArray(e4)) return e4;
          })(e3) || (function(e4, t4) {
            var r3 = null == e4 ? null : "undefined" != typeof Symbol && e4[Symbol.iterator] || e4["@@iterator"];
            if (null != r3) {
              var n2, o2, i2, a2, s2 = [], u2 = true, c2 = false;
              try {
                if (i2 = (r3 = r3.call(e4)).next, 0 === t4) {
                  if (Object(r3) !== r3) return;
                  u2 = false;
                } else for (; !(u2 = (n2 = i2.call(r3)).done) && (s2.push(n2.value), s2.length !== t4); u2 = true) ;
              } catch (e5) {
                c2 = true, o2 = e5;
              } finally {
                try {
                  if (!u2 && null != r3.return && (a2 = r3.return(), Object(a2) !== a2)) return;
                } finally {
                  if (c2) throw o2;
                }
              }
              return s2;
            }
          })(e3, t3) || (function(e4, t4) {
            if (!e4) return;
            if ("string" == typeof e4) return o(e4, t4);
            var r3 = Object.prototype.toString.call(e4).slice(8, -1);
            "Object" === r3 && e4.constructor && (r3 = e4.constructor.name);
            if ("Map" === r3 || "Set" === r3) return Array.from(e4);
            if ("Arguments" === r3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r3)) return o(e4, t4);
          })(e3, t3) || (function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          })();
        }
        function o(e3, t3) {
          (null == t3 || t3 > e3.length) && (t3 = e3.length);
          for (var r3 = 0, n2 = new Array(t3); r3 < t3; r3++) n2[r3] = e3[r3];
          return n2;
        }
        function i(e3) {
          return i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, i(e3);
        }
        var a = void 0 !== /a/g.flags, s = function(e3) {
          var t3 = [];
          return e3.forEach(function(e4) {
            return t3.push(e4);
          }), t3;
        }, u = function(e3) {
          var t3 = [];
          return e3.forEach(function(e4, r3) {
            return t3.push([r3, e4]);
          }), t3;
        }, c = Object.is ? Object.is : r2(7653), l = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
          return [];
        }, f = Number.isNaN ? Number.isNaN : r2(4133);
        function p(e3) {
          return e3.call.bind(e3);
        }
        var d = p(Object.prototype.hasOwnProperty), h = p(Object.prototype.propertyIsEnumerable), y = p(Object.prototype.toString), m = r2(537).types, g = m.isAnyArrayBuffer, v = m.isArrayBufferView, b = m.isDate, w = m.isMap, S = m.isRegExp, E = m.isSet, k = m.isNativeError, A = m.isBoxedPrimitive, T = m.isNumberObject, O = m.isStringObject, x = m.isBooleanObject, P = m.isBigIntObject, B = m.isSymbolObject, I = m.isFloat32Array, C = m.isFloat64Array;
        function R(e3) {
          if (0 === e3.length || e3.length > 10) return true;
          for (var t3 = 0; t3 < e3.length; t3++) {
            var r3 = e3.charCodeAt(t3);
            if (r3 < 48 || r3 > 57) return true;
          }
          return 10 === e3.length && e3 >= Math.pow(2, 32);
        }
        function _(e3) {
          return Object.keys(e3).filter(R).concat(l(e3).filter(Object.prototype.propertyIsEnumerable.bind(e3)));
        }
        function U(e3, t3) {
          if (e3 === t3) return 0;
          for (var r3 = e3.length, n2 = t3.length, o2 = 0, i2 = Math.min(r3, n2); o2 < i2; ++o2) if (e3[o2] !== t3[o2]) {
            r3 = e3[o2], n2 = t3[o2];
            break;
          }
          return r3 < n2 ? -1 : n2 < r3 ? 1 : 0;
        }
        function N(e3, t3, r3, n2) {
          if (e3 === t3) return 0 !== e3 || (!r3 || c(e3, t3));
          if (r3) {
            if ("object" !== i(e3)) return "number" == typeof e3 && f(e3) && f(t3);
            if ("object" !== i(t3) || null === e3 || null === t3) return false;
            if (Object.getPrototypeOf(e3) !== Object.getPrototypeOf(t3)) return false;
          } else {
            if (null === e3 || "object" !== i(e3)) return (null === t3 || "object" !== i(t3)) && e3 == t3;
            if (null === t3 || "object" !== i(t3)) return false;
          }
          var o2, s2, u2, l2, p2 = y(e3);
          if (p2 !== y(t3)) return false;
          if (Array.isArray(e3)) {
            if (e3.length !== t3.length) return false;
            var d2 = _(e3), h2 = _(t3);
            return d2.length === h2.length && F(e3, t3, r3, n2, 1, d2);
          }
          if ("[object Object]" === p2 && (!w(e3) && w(t3) || !E(e3) && E(t3))) return false;
          if (b(e3)) {
            if (!b(t3) || Date.prototype.getTime.call(e3) !== Date.prototype.getTime.call(t3)) return false;
          } else if (S(e3)) {
            if (!S(t3) || (u2 = e3, l2 = t3, !(a ? u2.source === l2.source && u2.flags === l2.flags : RegExp.prototype.toString.call(u2) === RegExp.prototype.toString.call(l2)))) return false;
          } else if (k(e3) || e3 instanceof Error) {
            if (e3.message !== t3.message || e3.name !== t3.name) return false;
          } else {
            if (v(e3)) {
              if (r3 || !I(e3) && !C(e3)) {
                if (!(function(e4, t4) {
                  return e4.byteLength === t4.byteLength && 0 === U(new Uint8Array(e4.buffer, e4.byteOffset, e4.byteLength), new Uint8Array(t4.buffer, t4.byteOffset, t4.byteLength));
                })(e3, t3)) return false;
              } else if (!(function(e4, t4) {
                if (e4.byteLength !== t4.byteLength) return false;
                for (var r4 = 0; r4 < e4.byteLength; r4++) if (e4[r4] !== t4[r4]) return false;
                return true;
              })(e3, t3)) return false;
              var m2 = _(e3), R2 = _(t3);
              return m2.length === R2.length && F(e3, t3, r3, n2, 0, m2);
            }
            if (E(e3)) return !(!E(t3) || e3.size !== t3.size) && F(e3, t3, r3, n2, 2);
            if (w(e3)) return !(!w(t3) || e3.size !== t3.size) && F(e3, t3, r3, n2, 3);
            if (g(e3)) {
              if (s2 = t3, (o2 = e3).byteLength !== s2.byteLength || 0 !== U(new Uint8Array(o2), new Uint8Array(s2))) return false;
            } else if (A(e3) && !(function(e4, t4) {
              return T(e4) ? T(t4) && c(Number.prototype.valueOf.call(e4), Number.prototype.valueOf.call(t4)) : O(e4) ? O(t4) && String.prototype.valueOf.call(e4) === String.prototype.valueOf.call(t4) : x(e4) ? x(t4) && Boolean.prototype.valueOf.call(e4) === Boolean.prototype.valueOf.call(t4) : P(e4) ? P(t4) && BigInt.prototype.valueOf.call(e4) === BigInt.prototype.valueOf.call(t4) : B(t4) && Symbol.prototype.valueOf.call(e4) === Symbol.prototype.valueOf.call(t4);
            })(e3, t3)) return false;
          }
          return F(e3, t3, r3, n2, 0);
        }
        function L(e3, t3) {
          return t3.filter(function(t4) {
            return h(e3, t4);
          });
        }
        function F(e3, t3, r3, o2, a2, c2) {
          if (5 === arguments.length) {
            c2 = Object.keys(e3);
            var f2 = Object.keys(t3);
            if (c2.length !== f2.length) return false;
          }
          for (var p2 = 0; p2 < c2.length; p2++) if (!d(t3, c2[p2])) return false;
          if (r3 && 5 === arguments.length) {
            var y2 = l(e3);
            if (0 !== y2.length) {
              var m2 = 0;
              for (p2 = 0; p2 < y2.length; p2++) {
                var g2 = y2[p2];
                if (h(e3, g2)) {
                  if (!h(t3, g2)) return false;
                  c2.push(g2), m2++;
                } else if (h(t3, g2)) return false;
              }
              var v2 = l(t3);
              if (y2.length !== v2.length && L(t3, v2).length !== m2) return false;
            } else {
              var b2 = l(t3);
              if (0 !== b2.length && 0 !== L(t3, b2).length) return false;
            }
          }
          if (0 === c2.length && (0 === a2 || 1 === a2 && 0 === e3.length || 0 === e3.size)) return true;
          if (void 0 === o2) o2 = { val1: /* @__PURE__ */ new Map(), val2: /* @__PURE__ */ new Map(), position: 0 };
          else {
            var w2 = o2.val1.get(e3);
            if (void 0 !== w2) {
              var S2 = o2.val2.get(t3);
              if (void 0 !== S2) return w2 === S2;
            }
            o2.position++;
          }
          o2.val1.set(e3, o2.position), o2.val2.set(t3, o2.position);
          var E2 = (function(e4, t4, r4, o3, a3, c3) {
            var l2 = 0;
            if (2 === c3) {
              if (!(function(e5, t5, r5, n2) {
                for (var o4 = null, a4 = s(e5), u2 = 0; u2 < a4.length; u2++) {
                  var c4 = a4[u2];
                  if ("object" === i(c4) && null !== c4) null === o4 && (o4 = /* @__PURE__ */ new Set()), o4.add(c4);
                  else if (!t5.has(c4)) {
                    if (r5) return false;
                    if (!D(e5, t5, c4)) return false;
                    null === o4 && (o4 = /* @__PURE__ */ new Set()), o4.add(c4);
                  }
                }
                if (null !== o4) {
                  for (var l3 = s(t5), f4 = 0; f4 < l3.length; f4++) {
                    var p4 = l3[f4];
                    if ("object" === i(p4) && null !== p4) {
                      if (!j(o4, p4, r5, n2)) return false;
                    } else if (!r5 && !e5.has(p4) && !j(o4, p4, r5, n2)) return false;
                  }
                  return 0 === o4.size;
                }
                return true;
              })(e4, t4, r4, a3)) return false;
            } else if (3 === c3) {
              if (!(function(e5, t5, r5, o4) {
                for (var a4 = null, s2 = u(e5), c4 = 0; c4 < s2.length; c4++) {
                  var l3 = n(s2[c4], 2), f4 = l3[0], p4 = l3[1];
                  if ("object" === i(f4) && null !== f4) null === a4 && (a4 = /* @__PURE__ */ new Set()), a4.add(f4);
                  else {
                    var d2 = t5.get(f4);
                    if (void 0 === d2 && !t5.has(f4) || !N(p4, d2, r5, o4)) {
                      if (r5) return false;
                      if (!V(e5, t5, f4, p4, o4)) return false;
                      null === a4 && (a4 = /* @__PURE__ */ new Set()), a4.add(f4);
                    }
                  }
                }
                if (null !== a4) {
                  for (var h3 = u(t5), y3 = 0; y3 < h3.length; y3++) {
                    var m3 = n(h3[y3], 2), g3 = m3[0], v3 = m3[1];
                    if ("object" === i(g3) && null !== g3) {
                      if (!q(a4, e5, g3, v3, r5, o4)) return false;
                    } else if (!(r5 || e5.has(g3) && N(e5.get(g3), v3, false, o4) || q(a4, e5, g3, v3, false, o4))) return false;
                  }
                  return 0 === a4.size;
                }
                return true;
              })(e4, t4, r4, a3)) return false;
            } else if (1 === c3) for (; l2 < e4.length; l2++) {
              if (!d(e4, l2)) {
                if (d(t4, l2)) return false;
                for (var f3 = Object.keys(e4); l2 < f3.length; l2++) {
                  var p3 = f3[l2];
                  if (!d(t4, p3) || !N(e4[p3], t4[p3], r4, a3)) return false;
                }
                return f3.length === Object.keys(t4).length;
              }
              if (!d(t4, l2) || !N(e4[l2], t4[l2], r4, a3)) return false;
            }
            for (l2 = 0; l2 < o3.length; l2++) {
              var h2 = o3[l2];
              if (!N(e4[h2], t4[h2], r4, a3)) return false;
            }
            return true;
          })(e3, t3, r3, c2, o2, a2);
          return o2.val1.delete(e3), o2.val2.delete(t3), E2;
        }
        function j(e3, t3, r3, n2) {
          for (var o2 = s(e3), i2 = 0; i2 < o2.length; i2++) {
            var a2 = o2[i2];
            if (N(t3, a2, r3, n2)) return e3.delete(a2), true;
          }
          return false;
        }
        function M(e3) {
          switch (i(e3)) {
            case "undefined":
              return null;
            case "object":
              return;
            case "symbol":
              return false;
            case "string":
              e3 = +e3;
            case "number":
              if (f(e3)) return false;
          }
          return true;
        }
        function D(e3, t3, r3) {
          var n2 = M(r3);
          return null != n2 ? n2 : t3.has(n2) && !e3.has(n2);
        }
        function V(e3, t3, r3, n2, o2) {
          var i2 = M(r3);
          if (null != i2) return i2;
          var a2 = t3.get(i2);
          return !(void 0 === a2 && !t3.has(i2) || !N(n2, a2, false, o2)) && (!e3.has(i2) && N(n2, a2, false, o2));
        }
        function q(e3, t3, r3, n2, o2, i2) {
          for (var a2 = s(e3), u2 = 0; u2 < a2.length; u2++) {
            var c2 = a2[u2];
            if (N(r3, c2, o2, i2) && N(n2, t3.get(c2), o2, i2)) return e3.delete(c2), true;
          }
          return false;
        }
        e2.exports = { isDeepEqual: function(e3, t3) {
          return N(e3, t3, false);
        }, isDeepStrictEqual: function(e3, t3) {
          return N(e3, t3, true);
        } };
      }, 2464: (e2, t2, r2) => {
        "use strict";
        var n = r2(8452), o = r2(6642);
        e2.exports = function() {
          var e3 = o();
          return n(Number, { isNaN: e3 }, { isNaN: function() {
            return Number.isNaN !== e3;
          } }), e3;
        };
      }, 2682: (e2, t2, r2) => {
        "use strict";
        var n = r2(9600), o = Object.prototype.toString, i = Object.prototype.hasOwnProperty;
        e2.exports = function(e3, t3, r3) {
          if (!n(t3)) throw new TypeError("iterator must be a function");
          var a, s;
          arguments.length >= 3 && (a = r3), s = e3, "[object Array]" === o.call(s) ? (function(e4, t4, r4) {
            for (var n2 = 0, o2 = e4.length; n2 < o2; n2++) i.call(e4, n2) && (null == r4 ? t4(e4[n2], n2, e4) : t4.call(r4, e4[n2], n2, e4));
          })(e3, t3, a) : "string" == typeof e3 ? (function(e4, t4, r4) {
            for (var n2 = 0, o2 = e4.length; n2 < o2; n2++) null == r4 ? t4(e4.charAt(n2), n2, e4) : t4.call(r4, e4.charAt(n2), n2, e4);
          })(e3, t3, a) : (function(e4, t4, r4) {
            for (var n2 in e4) i.call(e4, n2) && (null == r4 ? t4(e4[n2], n2, e4) : t4.call(r4, e4[n2], n2, e4));
          })(e3, t3, a);
        };
      }, 2802: (e2, t2, r2) => {
        "use strict";
        e2.exports = function(t3) {
          var r3 = t3.toLowerCase(), n = e2.exports[r3];
          if (!n) throw new Error(r3 + " is not supported (we accept pull requests)");
          return new n();
        }, e2.exports.sha = r2(7816), e2.exports.sha1 = r2(3737), e2.exports.sha224 = r2(6710), e2.exports.sha256 = r2(4107), e2.exports.sha384 = r2(2827), e2.exports.sha512 = r2(2890);
      }, 2827: (e2, t2, r2) => {
        "use strict";
        var n = r2(6698), o = r2(2890), i = r2(392), a = r2(2861).Buffer, s = new Array(160);
        function u() {
          this.init(), this._w = s, i.call(this, 128, 112);
        }
        n(u, o), u.prototype.init = function() {
          return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
        }, u.prototype._hash = function() {
          var e3 = a.allocUnsafe(48);
          function t3(t4, r3, n2) {
            e3.writeInt32BE(t4, n2), e3.writeInt32BE(r3, n2 + 4);
          }
          return t3(this._ah, this._al, 0), t3(this._bh, this._bl, 8), t3(this._ch, this._cl, 16), t3(this._dh, this._dl, 24), t3(this._eh, this._el, 32), t3(this._fh, this._fl, 40), e3;
        }, e2.exports = u;
      }, 2861: (e2, t2, r2) => {
        var n = r2(8287), o = n.Buffer;
        function i(e3, t3) {
          for (var r3 in e3) t3[r3] = e3[r3];
        }
        function a(e3, t3, r3) {
          return o(e3, t3, r3);
        }
        o.from && o.alloc && o.allocUnsafe && o.allocUnsafeSlow ? e2.exports = n : (i(n, t2), t2.Buffer = a), a.prototype = Object.create(o.prototype), i(o, a), a.from = function(e3, t3, r3) {
          if ("number" == typeof e3) throw new TypeError("Argument must not be a number");
          return o(e3, t3, r3);
        }, a.alloc = function(e3, t3, r3) {
          if ("number" != typeof e3) throw new TypeError("Argument must be a number");
          var n2 = o(e3);
          return void 0 !== t3 ? "string" == typeof r3 ? n2.fill(t3, r3) : n2.fill(t3) : n2.fill(0), n2;
        }, a.allocUnsafe = function(e3) {
          if ("number" != typeof e3) throw new TypeError("Argument must be a number");
          return o(e3);
        }, a.allocUnsafeSlow = function(e3) {
          if ("number" != typeof e3) throw new TypeError("Argument must be a number");
          return n.SlowBuffer(e3);
        };
      }, 2890: (e2, t2, r2) => {
        "use strict";
        var n = r2(6698), o = r2(392), i = r2(2861).Buffer, a = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591], s = new Array(160);
        function u() {
          this.init(), this._w = s, o.call(this, 128, 112);
        }
        function c(e3, t3, r3) {
          return r3 ^ e3 & (t3 ^ r3);
        }
        function l(e3, t3, r3) {
          return e3 & t3 | r3 & (e3 | t3);
        }
        function f(e3, t3) {
          return (e3 >>> 28 | t3 << 4) ^ (t3 >>> 2 | e3 << 30) ^ (t3 >>> 7 | e3 << 25);
        }
        function p(e3, t3) {
          return (e3 >>> 14 | t3 << 18) ^ (e3 >>> 18 | t3 << 14) ^ (t3 >>> 9 | e3 << 23);
        }
        function d(e3, t3) {
          return (e3 >>> 1 | t3 << 31) ^ (e3 >>> 8 | t3 << 24) ^ e3 >>> 7;
        }
        function h(e3, t3) {
          return (e3 >>> 1 | t3 << 31) ^ (e3 >>> 8 | t3 << 24) ^ (e3 >>> 7 | t3 << 25);
        }
        function y(e3, t3) {
          return (e3 >>> 19 | t3 << 13) ^ (t3 >>> 29 | e3 << 3) ^ e3 >>> 6;
        }
        function m(e3, t3) {
          return (e3 >>> 19 | t3 << 13) ^ (t3 >>> 29 | e3 << 3) ^ (e3 >>> 6 | t3 << 26);
        }
        function g(e3, t3) {
          return e3 >>> 0 < t3 >>> 0 ? 1 : 0;
        }
        n(u, o), u.prototype.init = function() {
          return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
        }, u.prototype._update = function(e3) {
          for (var t3 = this._w, r3 = 0 | this._ah, n2 = 0 | this._bh, o2 = 0 | this._ch, i2 = 0 | this._dh, s2 = 0 | this._eh, u2 = 0 | this._fh, v = 0 | this._gh, b = 0 | this._hh, w = 0 | this._al, S = 0 | this._bl, E = 0 | this._cl, k = 0 | this._dl, A = 0 | this._el, T = 0 | this._fl, O = 0 | this._gl, x = 0 | this._hl, P = 0; P < 32; P += 2) t3[P] = e3.readInt32BE(4 * P), t3[P + 1] = e3.readInt32BE(4 * P + 4);
          for (; P < 160; P += 2) {
            var B = t3[P - 30], I = t3[P - 30 + 1], C = d(B, I), R = h(I, B), _ = y(B = t3[P - 4], I = t3[P - 4 + 1]), U = m(I, B), N = t3[P - 14], L = t3[P - 14 + 1], F = t3[P - 32], j = t3[P - 32 + 1], M = R + L | 0, D = C + N + g(M, R) | 0;
            D = (D = D + _ + g(M = M + U | 0, U) | 0) + F + g(M = M + j | 0, j) | 0, t3[P] = D, t3[P + 1] = M;
          }
          for (var V = 0; V < 160; V += 2) {
            D = t3[V], M = t3[V + 1];
            var q = l(r3, n2, o2), K = l(w, S, E), H = f(r3, w), z = f(w, r3), X = p(s2, A), $ = p(A, s2), G = a[V], W = a[V + 1], Y = c(s2, u2, v), Z = c(A, T, O), J = x + $ | 0, Q = b + X + g(J, x) | 0;
            Q = (Q = (Q = Q + Y + g(J = J + Z | 0, Z) | 0) + G + g(J = J + W | 0, W) | 0) + D + g(J = J + M | 0, M) | 0;
            var ee = z + K | 0, te = H + q + g(ee, z) | 0;
            b = v, x = O, v = u2, O = T, u2 = s2, T = A, s2 = i2 + Q + g(A = k + J | 0, k) | 0, i2 = o2, k = E, o2 = n2, E = S, n2 = r3, S = w, r3 = Q + te + g(w = J + ee | 0, J) | 0;
          }
          this._al = this._al + w | 0, this._bl = this._bl + S | 0, this._cl = this._cl + E | 0, this._dl = this._dl + k | 0, this._el = this._el + A | 0, this._fl = this._fl + T | 0, this._gl = this._gl + O | 0, this._hl = this._hl + x | 0, this._ah = this._ah + r3 + g(this._al, w) | 0, this._bh = this._bh + n2 + g(this._bl, S) | 0, this._ch = this._ch + o2 + g(this._cl, E) | 0, this._dh = this._dh + i2 + g(this._dl, k) | 0, this._eh = this._eh + s2 + g(this._el, A) | 0, this._fh = this._fh + u2 + g(this._fl, T) | 0, this._gh = this._gh + v + g(this._gl, O) | 0, this._hh = this._hh + b + g(this._hl, x) | 0;
        }, u.prototype._hash = function() {
          var e3 = i.allocUnsafe(64);
          function t3(t4, r3, n2) {
            e3.writeInt32BE(t4, n2), e3.writeInt32BE(r3, n2 + 4);
          }
          return t3(this._ah, this._al, 0), t3(this._bh, this._bl, 8), t3(this._ch, this._cl, 16), t3(this._dh, this._dl, 24), t3(this._eh, this._el, 32), t3(this._fh, this._fl, 40), t3(this._gh, this._gl, 48), t3(this._hh, this._hl, 56), e3;
        }, e2.exports = u;
      }, 3003: (e2) => {
        "use strict";
        e2.exports = function(e3) {
          return e3 != e3;
        };
      }, 3093: (e2, t2, r2) => {
        "use strict";
        var n = r2(4459);
        e2.exports = function(e3) {
          return n(e3) || 0 === e3 ? e3 : e3 < 0 ? -1 : 1;
        };
      }, 3126: (e2, t2, r2) => {
        "use strict";
        var n = r2(6743), o = r2(9675), i = r2(76), a = r2(3144);
        e2.exports = function(e3) {
          if (e3.length < 1 || "function" != typeof e3[0]) throw new o("a function is required");
          return a(n, i, e3);
        };
      }, 3144: (e2, t2, r2) => {
        "use strict";
        var n = r2(6743), o = r2(1002), i = r2(76), a = r2(7119);
        e2.exports = a || n.call(i, o);
      }, 3628: (e2, t2, r2) => {
        "use strict";
        var n = r2(8648), o = r2(1064), i = r2(7176);
        e2.exports = n ? function(e3) {
          return n(e3);
        } : o ? function(e3) {
          if (!e3 || "object" != typeof e3 && "function" != typeof e3) throw new TypeError("getProto: not an object");
          return o(e3);
        } : i ? function(e3) {
          return i(e3);
        } : null;
      }, 3737: (e2, t2, r2) => {
        "use strict";
        var n = r2(6698), o = r2(392), i = r2(2861).Buffer, a = [1518500249, 1859775393, -1894007588, -899497514], s = new Array(80);
        function u() {
          this.init(), this._w = s, o.call(this, 64, 56);
        }
        function c(e3) {
          return e3 << 1 | e3 >>> 31;
        }
        function l(e3) {
          return e3 << 5 | e3 >>> 27;
        }
        function f(e3) {
          return e3 << 30 | e3 >>> 2;
        }
        function p(e3, t3, r3, n2) {
          return 0 === e3 ? t3 & r3 | ~t3 & n2 : 2 === e3 ? t3 & r3 | t3 & n2 | r3 & n2 : t3 ^ r3 ^ n2;
        }
        n(u, o), u.prototype.init = function() {
          return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
        }, u.prototype._update = function(e3) {
          for (var t3 = this._w, r3 = 0 | this._a, n2 = 0 | this._b, o2 = 0 | this._c, i2 = 0 | this._d, s2 = 0 | this._e, u2 = 0; u2 < 16; ++u2) t3[u2] = e3.readInt32BE(4 * u2);
          for (; u2 < 80; ++u2) t3[u2] = c(t3[u2 - 3] ^ t3[u2 - 8] ^ t3[u2 - 14] ^ t3[u2 - 16]);
          for (var d = 0; d < 80; ++d) {
            var h = ~~(d / 20), y = l(r3) + p(h, n2, o2, i2) + s2 + t3[d] + a[h] | 0;
            s2 = i2, i2 = o2, o2 = f(n2), n2 = r3, r3 = y;
          }
          this._a = r3 + this._a | 0, this._b = n2 + this._b | 0, this._c = o2 + this._c | 0, this._d = i2 + this._d | 0, this._e = s2 + this._e | 0;
        }, u.prototype._hash = function() {
          var e3 = i.allocUnsafe(20);
          return e3.writeInt32BE(0 | this._a, 0), e3.writeInt32BE(0 | this._b, 4), e3.writeInt32BE(0 | this._c, 8), e3.writeInt32BE(0 | this._d, 12), e3.writeInt32BE(0 | this._e, 16), e3;
        }, e2.exports = u;
      }, 3740: function(e2, t2, r2) {
        var n, o = r2(6763);
        n = () => (() => {
          var e3 = { 616: (e4, t4, r4) => {
            "use strict";
            r4.d(t4, { A: () => o2 });
            var n2 = r4(287);
            n2.hp.alloc(1).subarray(0, 1) instanceof n2.hp || (n2.hp.prototype.subarray = function(e5, t5) {
              const r5 = Uint8Array.prototype.subarray.call(this, e5, t5);
              return Object.setPrototypeOf(r5, n2.hp.prototype), r5;
            });
            const o2 = n2.hp;
          }, 281: (e4, t4, r4) => {
            const n2 = r4(164);
            e4.exports = n2;
          }, 164: (e4, t4, r4) => {
            "use strict";
            r4.r(t4), r4.d(t4, { Array: () => D, Bool: () => _, Double: () => C, Enum: () => H, Float: () => I, Hyper: () => O, Int: () => E, LargeInt: () => T, Opaque: () => F, Option: () => q, Quadruple: () => R, Reference: () => z, String: () => N, Struct: () => X, Union: () => G, UnsignedHyper: () => B, UnsignedInt: () => P, VarArray: () => V, VarOpaque: () => M, Void: () => K, XdrReader: () => u, XdrWriter: () => f, config: () => ne });
            class n2 extends TypeError {
              constructor(e5) {
                super(`XDR Write Error: ${e5}`);
              }
            }
            class o2 extends TypeError {
              constructor(e5) {
                super(`XDR Read Error: ${e5}`);
              }
            }
            class i extends TypeError {
              constructor(e5) {
                super(`XDR Type Definition Error: ${e5}`);
              }
            }
            class a extends i {
              constructor() {
                super("method not implemented, it should be overloaded in the descendant class.");
              }
            }
            var s = r4(616).A;
            class u {
              constructor(e5) {
                if (!s.isBuffer(e5)) {
                  if (!(e5 instanceof Array || Array.isArray(e5) || ArrayBuffer.isView(e5))) throw new o2(`source invalid: ${e5}`);
                  e5 = s.from(e5);
                }
                this._buffer = e5, this._length = e5.length, this._index = 0;
              }
              _buffer;
              _length;
              _index;
              get eof() {
                return this._index === this._length;
              }
              advance(e5) {
                const t5 = this._index;
                if (this._index += e5, this._length < this._index) throw new o2("attempt to read outside the boundary of the buffer");
                const r5 = 4 - (e5 % 4 || 4);
                if (r5 > 0) {
                  for (let e6 = 0; e6 < r5; e6++) if (0 !== this._buffer[this._index + e6]) throw new o2("invalid padding");
                  this._index += r5;
                }
                return t5;
              }
              rewind() {
                this._index = 0;
              }
              read(e5) {
                const t5 = this.advance(e5);
                return this._buffer.subarray(t5, t5 + e5);
              }
              readInt32BE() {
                return this._buffer.readInt32BE(this.advance(4));
              }
              readUInt32BE() {
                return this._buffer.readUInt32BE(this.advance(4));
              }
              readBigInt64BE() {
                return this._buffer.readBigInt64BE(this.advance(8));
              }
              readBigUInt64BE() {
                return this._buffer.readBigUInt64BE(this.advance(8));
              }
              readFloatBE() {
                return this._buffer.readFloatBE(this.advance(4));
              }
              readDoubleBE() {
                return this._buffer.readDoubleBE(this.advance(8));
              }
              ensureInputConsumed() {
                if (this._index !== this._length) throw new o2("invalid XDR contract typecast - source buffer not entirely consumed");
              }
            }
            var c = r4(616).A;
            const l = 8192;
            class f {
              constructor(e5) {
                "number" == typeof e5 ? e5 = c.allocUnsafe(e5) : e5 instanceof c || (e5 = c.allocUnsafe(l)), this._buffer = e5, this._length = e5.length;
              }
              _buffer;
              _length;
              _index = 0;
              alloc(e5) {
                const t5 = this._index;
                return this._index += e5, this._length < this._index && this.resize(this._index), t5;
              }
              resize(e5) {
                const t5 = Math.ceil(e5 / l) * l, r5 = c.allocUnsafe(t5);
                this._buffer.copy(r5, 0, 0, this._length), this._buffer = r5, this._length = t5;
              }
              finalize() {
                return this._buffer.subarray(0, this._index);
              }
              toArray() {
                return [...this.finalize()];
              }
              write(e5, t5) {
                if ("string" == typeof e5) {
                  const r6 = this.alloc(t5);
                  this._buffer.write(e5, r6, "utf8");
                } else {
                  e5 instanceof c || (e5 = c.from(e5));
                  const r6 = this.alloc(t5);
                  e5.copy(this._buffer, r6, 0, t5);
                }
                const r5 = 4 - (t5 % 4 || 4);
                if (r5 > 0) {
                  const e6 = this.alloc(r5);
                  this._buffer.fill(0, e6, this._index);
                }
              }
              writeInt32BE(e5) {
                const t5 = this.alloc(4);
                this._buffer.writeInt32BE(e5, t5);
              }
              writeUInt32BE(e5) {
                const t5 = this.alloc(4);
                this._buffer.writeUInt32BE(e5, t5);
              }
              writeBigInt64BE(e5) {
                const t5 = this.alloc(8);
                this._buffer.writeBigInt64BE(e5, t5);
              }
              writeBigUInt64BE(e5) {
                const t5 = this.alloc(8);
                this._buffer.writeBigUInt64BE(e5, t5);
              }
              writeFloatBE(e5) {
                const t5 = this.alloc(4);
                this._buffer.writeFloatBE(e5, t5);
              }
              writeDoubleBE(e5) {
                const t5 = this.alloc(8);
                this._buffer.writeDoubleBE(e5, t5);
              }
              static bufferChunkSize = l;
            }
            var p = r4(616).A;
            class d {
              toXDR(e5 = "raw") {
                if (!this.write) return this.constructor.toXDR(this, e5);
                const t5 = new f();
                return this.write(this, t5), g(t5.finalize(), e5);
              }
              fromXDR(e5, t5 = "raw") {
                if (!this.read) return this.constructor.fromXDR(e5, t5);
                const r5 = new u(v(e5, t5)), n3 = this.read(r5);
                return r5.ensureInputConsumed(), n3;
              }
              validateXDR(e5, t5 = "raw") {
                try {
                  return this.fromXDR(e5, t5), true;
                } catch (e6) {
                  return false;
                }
              }
              static toXDR(e5, t5 = "raw") {
                const r5 = new f();
                return this.write(e5, r5), g(r5.finalize(), t5);
              }
              static fromXDR(e5, t5 = "raw") {
                const r5 = new u(v(e5, t5)), n3 = this.read(r5);
                return r5.ensureInputConsumed(), n3;
              }
              static validateXDR(e5, t5 = "raw") {
                try {
                  return this.fromXDR(e5, t5), true;
                } catch (e6) {
                  return false;
                }
              }
            }
            class h extends d {
              static read(e5) {
                throw new a();
              }
              static write(e5, t5) {
                throw new a();
              }
              static isValid(e5) {
                return false;
              }
            }
            class y extends d {
              isValid(e5) {
                return false;
              }
            }
            class m extends TypeError {
              constructor(e5) {
                super(`Invalid format ${e5}, must be one of "raw", "hex", "base64"`);
              }
            }
            function g(e5, t5) {
              switch (t5) {
                case "raw":
                  return e5;
                case "hex":
                  return e5.toString("hex");
                case "base64":
                  return e5.toString("base64");
                default:
                  throw new m(t5);
              }
            }
            function v(e5, t5) {
              switch (t5) {
                case "raw":
                  return e5;
                case "hex":
                  return p.from(e5, "hex");
                case "base64":
                  return p.from(e5, "base64");
                default:
                  throw new m(t5);
              }
            }
            function b(e5, t5) {
              return null != e5 && (e5 instanceof t5 || w(e5, t5) && "function" == typeof e5.constructor.read && "function" == typeof e5.constructor.write && w(e5, "XdrType"));
            }
            function w(e5, t5) {
              do {
                if (e5.constructor.name === t5) return true;
              } while (e5 = Object.getPrototypeOf(e5));
              return false;
            }
            const S = 2147483647;
            class E extends h {
              static read(e5) {
                return e5.readInt32BE();
              }
              static write(e5, t5) {
                if ("number" != typeof e5) throw new n2("not a number");
                if ((0 | e5) !== e5) throw new n2("invalid i32 value");
                t5.writeInt32BE(e5);
              }
              static isValid(e5) {
                return "number" == typeof e5 && (0 | e5) === e5 && e5 >= -2147483648 && e5 <= S;
              }
            }
            function k(e5, t5, r5) {
              if ("bigint" != typeof e5) throw new TypeError("Expected bigint 'value', got " + typeof e5);
              const n3 = t5 / r5;
              if (1 === n3) return [e5];
              if (r5 < 32 || r5 > 128 || 2 !== n3 && 4 !== n3 && 8 !== n3) throw new TypeError(`invalid bigint (${e5}) and slice size (${t5} -> ${r5}) combination`);
              const o3 = BigInt(r5), i2 = new Array(n3);
              for (let t6 = 0; t6 < n3; t6++) i2[t6] = BigInt.asIntN(r5, e5), e5 >>= o3;
              return i2;
            }
            function A(e5, t5) {
              if (t5) return [0n, (1n << BigInt(e5)) - 1n];
              const r5 = 1n << BigInt(e5 - 1);
              return [0n - r5, r5 - 1n];
            }
            E.MAX_VALUE = S, E.MIN_VALUE = 2147483648;
            class T extends h {
              constructor(e5) {
                super(), this._value = (function(e6, t5, r5) {
                  e6 instanceof Array ? e6.length && e6[0] instanceof Array && (e6 = e6[0]) : e6 = [e6];
                  const n3 = t5 / e6.length;
                  switch (n3) {
                    case 32:
                    case 64:
                    case 128:
                    case 256:
                      break;
                    default:
                      throw new RangeError(`expected slices to fit in 32/64/128/256 bits, got ${e6}`);
                  }
                  try {
                    for (let t6 = 0; t6 < e6.length; t6++) "bigint" != typeof e6[t6] && (e6[t6] = BigInt(e6[t6].valueOf()));
                  } catch (t6) {
                    throw new TypeError(`expected bigint-like values, got: ${e6} (${t6})`);
                  }
                  if (r5 && 1 === e6.length && e6[0] < 0n) throw new RangeError(`expected a positive value, got: ${e6}`);
                  let o3 = BigInt.asUintN(n3, e6[0]);
                  for (let t6 = 1; t6 < e6.length; t6++) o3 |= BigInt.asUintN(n3, e6[t6]) << BigInt(t6 * n3);
                  r5 || (o3 = BigInt.asIntN(t5, o3));
                  const [i2, a2] = A(t5, r5);
                  if (o3 >= i2 && o3 <= a2) return o3;
                  throw new TypeError(`bigint values [${e6}] for ${(function(e7, t6) {
                    return `${t6 ? "u" : "i"}${e7}`;
                  })(t5, r5)} out of range [${i2}, ${a2}]: ${o3}`);
                })(e5, this.size, this.unsigned);
              }
              get unsigned() {
                throw new a();
              }
              get size() {
                throw new a();
              }
              slice(e5) {
                return k(this._value, this.size, e5);
              }
              toString() {
                return this._value.toString();
              }
              toJSON() {
                return { _value: this._value.toString() };
              }
              toBigInt() {
                return BigInt(this._value);
              }
              static read(e5) {
                const { size: t5 } = this.prototype;
                return 64 === t5 ? new this(e5.readBigUInt64BE()) : new this(...Array.from({ length: t5 / 64 }, () => e5.readBigUInt64BE()).reverse());
              }
              static write(e5, t5) {
                if (e5 instanceof this) e5 = e5._value;
                else if ("bigint" != typeof e5 || e5 > this.MAX_VALUE || e5 < this.MIN_VALUE) throw new n2(`${e5} is not a ${this.name}`);
                const { unsigned: r5, size: o3 } = this.prototype;
                if (64 === o3) r5 ? t5.writeBigUInt64BE(e5) : t5.writeBigInt64BE(e5);
                else for (const n3 of k(e5, o3, 64).reverse()) r5 ? t5.writeBigUInt64BE(n3) : t5.writeBigInt64BE(n3);
              }
              static isValid(e5) {
                return "bigint" == typeof e5 || e5 instanceof this;
              }
              static fromString(e5) {
                return new this(e5);
              }
              static MAX_VALUE = 0n;
              static MIN_VALUE = 0n;
              static defineIntBoundaries() {
                const [e5, t5] = A(this.prototype.size, this.prototype.unsigned);
                this.MIN_VALUE = e5, this.MAX_VALUE = t5;
              }
            }
            class O extends T {
              constructor(...e5) {
                super(e5);
              }
              get low() {
                return 0 | Number(0xffffffffn & this._value);
              }
              get high() {
                return 0 | Number(this._value >> 32n);
              }
              get size() {
                return 64;
              }
              get unsigned() {
                return false;
              }
              static fromBits(e5, t5) {
                return new this(e5, t5);
              }
            }
            O.defineIntBoundaries();
            const x = 4294967295;
            class P extends h {
              static read(e5) {
                return e5.readUInt32BE();
              }
              static write(e5, t5) {
                if ("number" != typeof e5 || !(e5 >= 0 && e5 <= x) || e5 % 1 != 0) throw new n2("invalid u32 value");
                t5.writeUInt32BE(e5);
              }
              static isValid(e5) {
                return "number" == typeof e5 && e5 % 1 == 0 && e5 >= 0 && e5 <= x;
              }
            }
            P.MAX_VALUE = x, P.MIN_VALUE = 0;
            class B extends T {
              constructor(...e5) {
                super(e5);
              }
              get low() {
                return 0 | Number(0xffffffffn & this._value);
              }
              get high() {
                return 0 | Number(this._value >> 32n);
              }
              get size() {
                return 64;
              }
              get unsigned() {
                return true;
              }
              static fromBits(e5, t5) {
                return new this(e5, t5);
              }
            }
            B.defineIntBoundaries();
            class I extends h {
              static read(e5) {
                return e5.readFloatBE();
              }
              static write(e5, t5) {
                if ("number" != typeof e5) throw new n2("not a number");
                t5.writeFloatBE(e5);
              }
              static isValid(e5) {
                return "number" == typeof e5;
              }
            }
            class C extends h {
              static read(e5) {
                return e5.readDoubleBE();
              }
              static write(e5, t5) {
                if ("number" != typeof e5) throw new n2("not a number");
                t5.writeDoubleBE(e5);
              }
              static isValid(e5) {
                return "number" == typeof e5;
              }
            }
            class R extends h {
              static read() {
                throw new i("quadruple not supported");
              }
              static write() {
                throw new i("quadruple not supported");
              }
              static isValid() {
                return false;
              }
            }
            class _ extends h {
              static read(e5) {
                const t5 = E.read(e5);
                switch (t5) {
                  case 0:
                    return false;
                  case 1:
                    return true;
                  default:
                    throw new o2(`got ${t5} when trying to read a bool`);
                }
              }
              static write(e5, t5) {
                const r5 = e5 ? 1 : 0;
                E.write(r5, t5);
              }
              static isValid(e5) {
                return "boolean" == typeof e5;
              }
            }
            var U = r4(616).A;
            class N extends y {
              constructor(e5 = P.MAX_VALUE) {
                super(), this._maxLength = e5;
              }
              read(e5) {
                const t5 = P.read(e5);
                if (t5 > this._maxLength) throw new o2(`saw ${t5} length String, max allowed is ${this._maxLength}`);
                return e5.read(t5);
              }
              readString(e5) {
                return this.read(e5).toString("utf8");
              }
              write(e5, t5) {
                const r5 = "string" == typeof e5 ? U.byteLength(e5, "utf8") : e5.length;
                if (r5 > this._maxLength) throw new n2(`got ${e5.length} bytes, max allowed is ${this._maxLength}`);
                P.write(r5, t5), t5.write(e5, r5);
              }
              isValid(e5) {
                return "string" == typeof e5 ? U.byteLength(e5, "utf8") <= this._maxLength : !!(e5 instanceof Array || U.isBuffer(e5)) && e5.length <= this._maxLength;
              }
            }
            var L = r4(616).A;
            class F extends y {
              constructor(e5) {
                super(), this._length = e5;
              }
              read(e5) {
                return e5.read(this._length);
              }
              write(e5, t5) {
                const { length: r5 } = e5;
                if (r5 !== this._length) throw new n2(`got ${e5.length} bytes, expected ${this._length}`);
                t5.write(e5, r5);
              }
              isValid(e5) {
                return L.isBuffer(e5) && e5.length === this._length;
              }
            }
            var j = r4(616).A;
            class M extends y {
              constructor(e5 = P.MAX_VALUE) {
                super(), this._maxLength = e5;
              }
              read(e5) {
                const t5 = P.read(e5);
                if (t5 > this._maxLength) throw new o2(`saw ${t5} length VarOpaque, max allowed is ${this._maxLength}`);
                return e5.read(t5);
              }
              write(e5, t5) {
                const { length: r5 } = e5;
                if (e5.length > this._maxLength) throw new n2(`got ${e5.length} bytes, max allowed is ${this._maxLength}`);
                P.write(r5, t5), t5.write(e5, r5);
              }
              isValid(e5) {
                return j.isBuffer(e5) && e5.length <= this._maxLength;
              }
            }
            class D extends y {
              constructor(e5, t5) {
                super(), this._childType = e5, this._length = t5;
              }
              read(e5) {
                const t5 = new r4.g.Array(this._length);
                for (let r5 = 0; r5 < this._length; r5++) t5[r5] = this._childType.read(e5);
                return t5;
              }
              write(e5, t5) {
                if (!r4.g.Array.isArray(e5)) throw new n2("value is not array");
                if (e5.length !== this._length) throw new n2(`got array of size ${e5.length}, expected ${this._length}`);
                for (const r5 of e5) this._childType.write(r5, t5);
              }
              isValid(e5) {
                if (!(e5 instanceof r4.g.Array) || e5.length !== this._length) return false;
                for (const t5 of e5) if (!this._childType.isValid(t5)) return false;
                return true;
              }
            }
            class V extends y {
              constructor(e5, t5 = P.MAX_VALUE) {
                super(), this._childType = e5, this._maxLength = t5;
              }
              read(e5) {
                const t5 = P.read(e5);
                if (t5 > this._maxLength) throw new o2(`saw ${t5} length VarArray, max allowed is ${this._maxLength}`);
                const r5 = new Array(t5);
                for (let n3 = 0; n3 < t5; n3++) r5[n3] = this._childType.read(e5);
                return r5;
              }
              write(e5, t5) {
                if (!(e5 instanceof Array)) throw new n2("value is not array");
                if (e5.length > this._maxLength) throw new n2(`got array of size ${e5.length}, max allowed is ${this._maxLength}`);
                P.write(e5.length, t5);
                for (const r5 of e5) this._childType.write(r5, t5);
              }
              isValid(e5) {
                if (!(e5 instanceof Array) || e5.length > this._maxLength) return false;
                for (const t5 of e5) if (!this._childType.isValid(t5)) return false;
                return true;
              }
            }
            class q extends h {
              constructor(e5) {
                super(), this._childType = e5;
              }
              read(e5) {
                if (_.read(e5)) return this._childType.read(e5);
              }
              write(e5, t5) {
                const r5 = null != e5;
                _.write(r5, t5), r5 && this._childType.write(e5, t5);
              }
              isValid(e5) {
                return null == e5 || this._childType.isValid(e5);
              }
            }
            class K extends h {
              static read() {
              }
              static write(e5) {
                if (void 0 !== e5) throw new n2("trying to write value to a void slot");
              }
              static isValid(e5) {
                return void 0 === e5;
              }
            }
            class H extends h {
              constructor(e5, t5) {
                super(), this.name = e5, this.value = t5;
              }
              static read(e5) {
                const t5 = E.read(e5), r5 = this._byValue[t5];
                if (void 0 === r5) throw new o2(`unknown ${this.enumName} member for value ${t5}`);
                return r5;
              }
              static write(e5, t5) {
                if (!this.isValid(e5)) throw new n2(`${e5} has enum name ${e5?.enumName}, not ${this.enumName}: ${JSON.stringify(e5)}`);
                E.write(e5.value, t5);
              }
              static isValid(e5) {
                return e5?.constructor?.enumName === this.enumName || b(e5, this);
              }
              static members() {
                return this._members;
              }
              static values() {
                return Object.values(this._members);
              }
              static fromName(e5) {
                const t5 = this._members[e5];
                if (!t5) throw new TypeError(`${e5} is not a member of ${this.enumName}`);
                return t5;
              }
              static fromValue(e5) {
                const t5 = this._byValue[e5];
                if (void 0 === t5) throw new TypeError(`${e5} is not a value of any member of ${this.enumName}`);
                return t5;
              }
              static create(e5, t5, r5) {
                const n3 = class extends H {
                };
                n3.enumName = t5, e5.results[t5] = n3, n3._members = {}, n3._byValue = {};
                for (const [e6, t6] of Object.entries(r5)) {
                  const r6 = new n3(e6, t6);
                  n3._members[e6] = r6, n3._byValue[t6] = r6, n3[e6] = () => r6;
                }
                return n3;
              }
            }
            class z extends h {
              resolve() {
                throw new i('"resolve" method should be implemented in the descendant class');
              }
            }
            class X extends y {
              constructor(e5) {
                super(), this._attributes = e5 || {};
              }
              static read(e5) {
                const t5 = {};
                for (const [r5, n3] of this._fields) t5[r5] = n3.read(e5);
                return new this(t5);
              }
              static write(e5, t5) {
                if (!this.isValid(e5)) throw new n2(`${e5} has struct name ${e5?.constructor?.structName}, not ${this.structName}: ${JSON.stringify(e5)}`);
                for (const [r5, n3] of this._fields) {
                  const o3 = e5._attributes[r5];
                  n3.write(o3, t5);
                }
              }
              static isValid(e5) {
                return e5?.constructor?.structName === this.structName || b(e5, this);
              }
              static create(e5, t5, r5) {
                const n3 = class extends X {
                };
                n3.structName = t5, e5.results[t5] = n3;
                const o3 = new Array(r5.length);
                for (let t6 = 0; t6 < r5.length; t6++) {
                  const i2 = r5[t6], a2 = i2[0];
                  let s2 = i2[1];
                  s2 instanceof z && (s2 = s2.resolve(e5)), o3[t6] = [a2, s2], n3.prototype[a2] = $(a2);
                }
                return n3._fields = o3, n3;
              }
            }
            function $(e5) {
              return function(t5) {
                return void 0 !== t5 && (this._attributes[e5] = t5), this._attributes[e5];
              };
            }
            class G extends y {
              constructor(e5, t5) {
                super(), this.set(e5, t5);
              }
              set(e5, t5) {
                "string" == typeof e5 && (e5 = this.constructor._switchOn.fromName(e5)), this._switch = e5;
                const r5 = this.constructor.armForSwitch(this._switch);
                this._arm = r5, this._armType = r5 === K ? K : this.constructor._arms[r5], this._value = t5;
              }
              get(e5 = this._arm) {
                if (this._arm !== K && this._arm !== e5) throw new TypeError(`${e5} not set`);
                return this._value;
              }
              switch() {
                return this._switch;
              }
              arm() {
                return this._arm;
              }
              armType() {
                return this._armType;
              }
              value() {
                return this._value;
              }
              static armForSwitch(e5) {
                const t5 = this._switches.get(e5);
                if (void 0 !== t5) return t5;
                if (this._defaultArm) return this._defaultArm;
                throw new TypeError(`Bad union switch: ${e5}`);
              }
              static armTypeForArm(e5) {
                return e5 === K ? K : this._arms[e5];
              }
              static read(e5) {
                const t5 = this._switchOn.read(e5), r5 = this.armForSwitch(t5), n3 = r5 === K ? K : this._arms[r5];
                let o3;
                return o3 = void 0 !== n3 ? n3.read(e5) : r5.read(e5), new this(t5, o3);
              }
              static write(e5, t5) {
                if (!this.isValid(e5)) throw new n2(`${e5} has union name ${e5?.unionName}, not ${this.unionName}: ${JSON.stringify(e5)}`);
                this._switchOn.write(e5.switch(), t5), e5.armType().write(e5.value(), t5);
              }
              static isValid(e5) {
                return e5?.constructor?.unionName === this.unionName || b(e5, this);
              }
              static create(e5, t5, r5) {
                const n3 = class extends G {
                };
                n3.unionName = t5, e5.results[t5] = n3, r5.switchOn instanceof z ? n3._switchOn = r5.switchOn.resolve(e5) : n3._switchOn = r5.switchOn, n3._switches = /* @__PURE__ */ new Map(), n3._arms = {};
                let o3 = r5.defaultArm;
                o3 instanceof z && (o3 = o3.resolve(e5)), n3._defaultArm = o3;
                for (const [e6, t6] of r5.switches) {
                  const r6 = "string" == typeof e6 ? n3._switchOn.fromName(e6) : e6;
                  n3._switches.set(r6, t6);
                }
                if (void 0 !== n3._switchOn.values) for (const e6 of n3._switchOn.values()) n3[e6.name] = function(t6) {
                  return new n3(e6, t6);
                }, n3.prototype[e6.name] = function(t6) {
                  return this.set(e6, t6);
                };
                if (r5.arms) for (const [t6, o4] of Object.entries(r5.arms)) n3._arms[t6] = o4 instanceof z ? o4.resolve(e5) : o4, o4 !== K && (n3.prototype[t6] = function() {
                  return this.get(t6);
                });
                return n3;
              }
            }
            class W extends z {
              constructor(e5) {
                super(), this.name = e5;
              }
              resolve(e5) {
                return e5.definitions[this.name].resolve(e5);
              }
            }
            class Y extends z {
              constructor(e5, t5, r5 = false) {
                super(), this.childReference = e5, this.length = t5, this.variable = r5;
              }
              resolve(e5) {
                let t5 = this.childReference, r5 = this.length;
                return t5 instanceof z && (t5 = t5.resolve(e5)), r5 instanceof z && (r5 = r5.resolve(e5)), this.variable ? new V(t5, r5) : new D(t5, r5);
              }
            }
            class Z extends z {
              constructor(e5) {
                super(), this.childReference = e5, this.name = e5.name;
              }
              resolve(e5) {
                let t5 = this.childReference;
                return t5 instanceof z && (t5 = t5.resolve(e5)), new q(t5);
              }
            }
            class J extends z {
              constructor(e5, t5) {
                super(), this.sizedType = e5, this.length = t5;
              }
              resolve(e5) {
                let t5 = this.length;
                return t5 instanceof z && (t5 = t5.resolve(e5)), new this.sizedType(t5);
              }
            }
            class Q {
              constructor(e5, t5, r5) {
                this.constructor = e5, this.name = t5, this.config = r5;
              }
              resolve(e5) {
                return this.name in e5.results ? e5.results[this.name] : this.constructor(e5, this.name, this.config);
              }
            }
            function ee(e5, t5, r5) {
              return r5 instanceof z && (r5 = r5.resolve(e5)), e5.results[t5] = r5, r5;
            }
            function te(e5, t5, r5) {
              return e5.results[t5] = r5, r5;
            }
            class re {
              constructor(e5) {
                this._destination = e5, this._definitions = {};
              }
              enum(e5, t5) {
                const r5 = new Q(H.create, e5, t5);
                this.define(e5, r5);
              }
              struct(e5, t5) {
                const r5 = new Q(X.create, e5, t5);
                this.define(e5, r5);
              }
              union(e5, t5) {
                const r5 = new Q(G.create, e5, t5);
                this.define(e5, r5);
              }
              typedef(e5, t5) {
                const r5 = new Q(ee, e5, t5);
                this.define(e5, r5);
              }
              const(e5, t5) {
                const r5 = new Q(te, e5, t5);
                this.define(e5, r5);
              }
              void() {
                return K;
              }
              bool() {
                return _;
              }
              int() {
                return E;
              }
              hyper() {
                return O;
              }
              uint() {
                return P;
              }
              uhyper() {
                return B;
              }
              float() {
                return I;
              }
              double() {
                return C;
              }
              quadruple() {
                return R;
              }
              string(e5) {
                return new J(N, e5);
              }
              opaque(e5) {
                return new J(F, e5);
              }
              varOpaque(e5) {
                return new J(M, e5);
              }
              array(e5, t5) {
                return new Y(e5, t5);
              }
              varArray(e5, t5) {
                return new Y(e5, t5, true);
              }
              option(e5) {
                return new Z(e5);
              }
              define(e5, t5) {
                if (void 0 !== this._destination[e5]) throw new i(`${e5} is already defined`);
                this._definitions[e5] = t5;
              }
              lookup(e5) {
                return new W(e5);
              }
              resolve() {
                for (const e5 of Object.values(this._definitions)) e5.resolve({ definitions: this._definitions, results: this._destination });
              }
            }
            function ne(e5, t5 = {}) {
              if (e5) {
                const r5 = new re(t5);
                e5(r5), r5.resolve();
              }
              return t5;
            }
          }, 526: (e4, t4) => {
            "use strict";
            t4.byteLength = function(e5) {
              var t5 = s(e5), r5 = t5[0], n3 = t5[1];
              return 3 * (r5 + n3) / 4 - n3;
            }, t4.toByteArray = function(e5) {
              var t5, r5, i2 = s(e5), a2 = i2[0], u2 = i2[1], c = new o2((function(e6, t6, r6) {
                return 3 * (t6 + r6) / 4 - r6;
              })(0, a2, u2)), l = 0, f = u2 > 0 ? a2 - 4 : a2;
              for (r5 = 0; r5 < f; r5 += 4) t5 = n2[e5.charCodeAt(r5)] << 18 | n2[e5.charCodeAt(r5 + 1)] << 12 | n2[e5.charCodeAt(r5 + 2)] << 6 | n2[e5.charCodeAt(r5 + 3)], c[l++] = t5 >> 16 & 255, c[l++] = t5 >> 8 & 255, c[l++] = 255 & t5;
              return 2 === u2 && (t5 = n2[e5.charCodeAt(r5)] << 2 | n2[e5.charCodeAt(r5 + 1)] >> 4, c[l++] = 255 & t5), 1 === u2 && (t5 = n2[e5.charCodeAt(r5)] << 10 | n2[e5.charCodeAt(r5 + 1)] << 4 | n2[e5.charCodeAt(r5 + 2)] >> 2, c[l++] = t5 >> 8 & 255, c[l++] = 255 & t5), c;
            }, t4.fromByteArray = function(e5) {
              for (var t5, n3 = e5.length, o3 = n3 % 3, i2 = [], a2 = 16383, s2 = 0, c = n3 - o3; s2 < c; s2 += a2) i2.push(u(e5, s2, s2 + a2 > c ? c : s2 + a2));
              return 1 === o3 ? (t5 = e5[n3 - 1], i2.push(r4[t5 >> 2] + r4[t5 << 4 & 63] + "==")) : 2 === o3 && (t5 = (e5[n3 - 2] << 8) + e5[n3 - 1], i2.push(r4[t5 >> 10] + r4[t5 >> 4 & 63] + r4[t5 << 2 & 63] + "=")), i2.join("");
            };
            for (var r4 = [], n2 = [], o2 = "undefined" != typeof Uint8Array ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0; a < 64; ++a) r4[a] = i[a], n2[i.charCodeAt(a)] = a;
            function s(e5) {
              var t5 = e5.length;
              if (t5 % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
              var r5 = e5.indexOf("=");
              return -1 === r5 && (r5 = t5), [r5, r5 === t5 ? 0 : 4 - r5 % 4];
            }
            function u(e5, t5, n3) {
              for (var o3, i2, a2 = [], s2 = t5; s2 < n3; s2 += 3) o3 = (e5[s2] << 16 & 16711680) + (e5[s2 + 1] << 8 & 65280) + (255 & e5[s2 + 2]), a2.push(r4[(i2 = o3) >> 18 & 63] + r4[i2 >> 12 & 63] + r4[i2 >> 6 & 63] + r4[63 & i2]);
              return a2.join("");
            }
            n2["-".charCodeAt(0)] = 62, n2["_".charCodeAt(0)] = 63;
          }, 287: (e4, t4, r4) => {
            "use strict";
            const n2 = r4(526), i = r4(251), a = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
            t4.hp = c, t4.IS = 50;
            const s = 2147483647;
            function u(e5) {
              if (e5 > s) throw new RangeError('The value "' + e5 + '" is invalid for option "size"');
              const t5 = new Uint8Array(e5);
              return Object.setPrototypeOf(t5, c.prototype), t5;
            }
            function c(e5, t5, r5) {
              if ("number" == typeof e5) {
                if ("string" == typeof t5) throw new TypeError('The "string" argument must be of type string. Received type number');
                return p(e5);
              }
              return l(e5, t5, r5);
            }
            function l(e5, t5, r5) {
              if ("string" == typeof e5) return (function(e6, t6) {
                if ("string" == typeof t6 && "" !== t6 || (t6 = "utf8"), !c.isEncoding(t6)) throw new TypeError("Unknown encoding: " + t6);
                const r6 = 0 | m(e6, t6);
                let n4 = u(r6);
                const o3 = n4.write(e6, t6);
                return o3 !== r6 && (n4 = n4.slice(0, o3)), n4;
              })(e5, t5);
              if (ArrayBuffer.isView(e5)) return (function(e6) {
                if (Y(e6, Uint8Array)) {
                  const t6 = new Uint8Array(e6);
                  return h(t6.buffer, t6.byteOffset, t6.byteLength);
                }
                return d(e6);
              })(e5);
              if (null == e5) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e5);
              if (Y(e5, ArrayBuffer) || e5 && Y(e5.buffer, ArrayBuffer)) return h(e5, t5, r5);
              if ("undefined" != typeof SharedArrayBuffer && (Y(e5, SharedArrayBuffer) || e5 && Y(e5.buffer, SharedArrayBuffer))) return h(e5, t5, r5);
              if ("number" == typeof e5) throw new TypeError('The "value" argument must not be of type number. Received type number');
              const n3 = e5.valueOf && e5.valueOf();
              if (null != n3 && n3 !== e5) return c.from(n3, t5, r5);
              const o2 = (function(e6) {
                if (c.isBuffer(e6)) {
                  const t6 = 0 | y(e6.length), r6 = u(t6);
                  return 0 === r6.length || e6.copy(r6, 0, 0, t6), r6;
                }
                return void 0 !== e6.length ? "number" != typeof e6.length || Z(e6.length) ? u(0) : d(e6) : "Buffer" === e6.type && Array.isArray(e6.data) ? d(e6.data) : void 0;
              })(e5);
              if (o2) return o2;
              if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e5[Symbol.toPrimitive]) return c.from(e5[Symbol.toPrimitive]("string"), t5, r5);
              throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e5);
            }
            function f(e5) {
              if ("number" != typeof e5) throw new TypeError('"size" argument must be of type number');
              if (e5 < 0) throw new RangeError('The value "' + e5 + '" is invalid for option "size"');
            }
            function p(e5) {
              return f(e5), u(e5 < 0 ? 0 : 0 | y(e5));
            }
            function d(e5) {
              const t5 = e5.length < 0 ? 0 : 0 | y(e5.length), r5 = u(t5);
              for (let n3 = 0; n3 < t5; n3 += 1) r5[n3] = 255 & e5[n3];
              return r5;
            }
            function h(e5, t5, r5) {
              if (t5 < 0 || e5.byteLength < t5) throw new RangeError('"offset" is outside of buffer bounds');
              if (e5.byteLength < t5 + (r5 || 0)) throw new RangeError('"length" is outside of buffer bounds');
              let n3;
              return n3 = void 0 === t5 && void 0 === r5 ? new Uint8Array(e5) : void 0 === r5 ? new Uint8Array(e5, t5) : new Uint8Array(e5, t5, r5), Object.setPrototypeOf(n3, c.prototype), n3;
            }
            function y(e5) {
              if (e5 >= s) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s.toString(16) + " bytes");
              return 0 | e5;
            }
            function m(e5, t5) {
              if (c.isBuffer(e5)) return e5.length;
              if (ArrayBuffer.isView(e5) || Y(e5, ArrayBuffer)) return e5.byteLength;
              if ("string" != typeof e5) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e5);
              const r5 = e5.length, n3 = arguments.length > 2 && true === arguments[2];
              if (!n3 && 0 === r5) return 0;
              let o2 = false;
              for (; ; ) switch (t5) {
                case "ascii":
                case "latin1":
                case "binary":
                  return r5;
                case "utf8":
                case "utf-8":
                  return $(e5).length;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return 2 * r5;
                case "hex":
                  return r5 >>> 1;
                case "base64":
                  return G(e5).length;
                default:
                  if (o2) return n3 ? -1 : $(e5).length;
                  t5 = ("" + t5).toLowerCase(), o2 = true;
              }
            }
            function g(e5, t5, r5) {
              let n3 = false;
              if ((void 0 === t5 || t5 < 0) && (t5 = 0), t5 > this.length) return "";
              if ((void 0 === r5 || r5 > this.length) && (r5 = this.length), r5 <= 0) return "";
              if ((r5 >>>= 0) <= (t5 >>>= 0)) return "";
              for (e5 || (e5 = "utf8"); ; ) switch (e5) {
                case "hex":
                  return C(this, t5, r5);
                case "utf8":
                case "utf-8":
                  return x(this, t5, r5);
                case "ascii":
                  return B(this, t5, r5);
                case "latin1":
                case "binary":
                  return I(this, t5, r5);
                case "base64":
                  return O(this, t5, r5);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return R(this, t5, r5);
                default:
                  if (n3) throw new TypeError("Unknown encoding: " + e5);
                  e5 = (e5 + "").toLowerCase(), n3 = true;
              }
            }
            function v(e5, t5, r5) {
              const n3 = e5[t5];
              e5[t5] = e5[r5], e5[r5] = n3;
            }
            function b(e5, t5, r5, n3, o2) {
              if (0 === e5.length) return -1;
              if ("string" == typeof r5 ? (n3 = r5, r5 = 0) : r5 > 2147483647 ? r5 = 2147483647 : r5 < -2147483648 && (r5 = -2147483648), Z(r5 = +r5) && (r5 = o2 ? 0 : e5.length - 1), r5 < 0 && (r5 = e5.length + r5), r5 >= e5.length) {
                if (o2) return -1;
                r5 = e5.length - 1;
              } else if (r5 < 0) {
                if (!o2) return -1;
                r5 = 0;
              }
              if ("string" == typeof t5 && (t5 = c.from(t5, n3)), c.isBuffer(t5)) return 0 === t5.length ? -1 : w(e5, t5, r5, n3, o2);
              if ("number" == typeof t5) return t5 &= 255, "function" == typeof Uint8Array.prototype.indexOf ? o2 ? Uint8Array.prototype.indexOf.call(e5, t5, r5) : Uint8Array.prototype.lastIndexOf.call(e5, t5, r5) : w(e5, [t5], r5, n3, o2);
              throw new TypeError("val must be string, number or Buffer");
            }
            function w(e5, t5, r5, n3, o2) {
              let i2, a2 = 1, s2 = e5.length, u2 = t5.length;
              if (void 0 !== n3 && ("ucs2" === (n3 = String(n3).toLowerCase()) || "ucs-2" === n3 || "utf16le" === n3 || "utf-16le" === n3)) {
                if (e5.length < 2 || t5.length < 2) return -1;
                a2 = 2, s2 /= 2, u2 /= 2, r5 /= 2;
              }
              function c2(e6, t6) {
                return 1 === a2 ? e6[t6] : e6.readUInt16BE(t6 * a2);
              }
              if (o2) {
                let n4 = -1;
                for (i2 = r5; i2 < s2; i2++) if (c2(e5, i2) === c2(t5, -1 === n4 ? 0 : i2 - n4)) {
                  if (-1 === n4 && (n4 = i2), i2 - n4 + 1 === u2) return n4 * a2;
                } else -1 !== n4 && (i2 -= i2 - n4), n4 = -1;
              } else for (r5 + u2 > s2 && (r5 = s2 - u2), i2 = r5; i2 >= 0; i2--) {
                let r6 = true;
                for (let n4 = 0; n4 < u2; n4++) if (c2(e5, i2 + n4) !== c2(t5, n4)) {
                  r6 = false;
                  break;
                }
                if (r6) return i2;
              }
              return -1;
            }
            function S(e5, t5, r5, n3) {
              r5 = Number(r5) || 0;
              const o2 = e5.length - r5;
              n3 ? (n3 = Number(n3)) > o2 && (n3 = o2) : n3 = o2;
              const i2 = t5.length;
              let a2;
              for (n3 > i2 / 2 && (n3 = i2 / 2), a2 = 0; a2 < n3; ++a2) {
                const n4 = parseInt(t5.substr(2 * a2, 2), 16);
                if (Z(n4)) return a2;
                e5[r5 + a2] = n4;
              }
              return a2;
            }
            function E(e5, t5, r5, n3) {
              return W($(t5, e5.length - r5), e5, r5, n3);
            }
            function k(e5, t5, r5, n3) {
              return W((function(e6) {
                const t6 = [];
                for (let r6 = 0; r6 < e6.length; ++r6) t6.push(255 & e6.charCodeAt(r6));
                return t6;
              })(t5), e5, r5, n3);
            }
            function A(e5, t5, r5, n3) {
              return W(G(t5), e5, r5, n3);
            }
            function T(e5, t5, r5, n3) {
              return W((function(e6, t6) {
                let r6, n4, o2;
                const i2 = [];
                for (let a2 = 0; a2 < e6.length && !((t6 -= 2) < 0); ++a2) r6 = e6.charCodeAt(a2), n4 = r6 >> 8, o2 = r6 % 256, i2.push(o2), i2.push(n4);
                return i2;
              })(t5, e5.length - r5), e5, r5, n3);
            }
            function O(e5, t5, r5) {
              return 0 === t5 && r5 === e5.length ? n2.fromByteArray(e5) : n2.fromByteArray(e5.slice(t5, r5));
            }
            function x(e5, t5, r5) {
              r5 = Math.min(e5.length, r5);
              const n3 = [];
              let o2 = t5;
              for (; o2 < r5; ) {
                const t6 = e5[o2];
                let i2 = null, a2 = t6 > 239 ? 4 : t6 > 223 ? 3 : t6 > 191 ? 2 : 1;
                if (o2 + a2 <= r5) {
                  let r6, n4, s2, u2;
                  switch (a2) {
                    case 1:
                      t6 < 128 && (i2 = t6);
                      break;
                    case 2:
                      r6 = e5[o2 + 1], 128 == (192 & r6) && (u2 = (31 & t6) << 6 | 63 & r6, u2 > 127 && (i2 = u2));
                      break;
                    case 3:
                      r6 = e5[o2 + 1], n4 = e5[o2 + 2], 128 == (192 & r6) && 128 == (192 & n4) && (u2 = (15 & t6) << 12 | (63 & r6) << 6 | 63 & n4, u2 > 2047 && (u2 < 55296 || u2 > 57343) && (i2 = u2));
                      break;
                    case 4:
                      r6 = e5[o2 + 1], n4 = e5[o2 + 2], s2 = e5[o2 + 3], 128 == (192 & r6) && 128 == (192 & n4) && 128 == (192 & s2) && (u2 = (15 & t6) << 18 | (63 & r6) << 12 | (63 & n4) << 6 | 63 & s2, u2 > 65535 && u2 < 1114112 && (i2 = u2));
                  }
                }
                null === i2 ? (i2 = 65533, a2 = 1) : i2 > 65535 && (i2 -= 65536, n3.push(i2 >>> 10 & 1023 | 55296), i2 = 56320 | 1023 & i2), n3.push(i2), o2 += a2;
              }
              return (function(e6) {
                const t6 = e6.length;
                if (t6 <= P) return String.fromCharCode.apply(String, e6);
                let r6 = "", n4 = 0;
                for (; n4 < t6; ) r6 += String.fromCharCode.apply(String, e6.slice(n4, n4 += P));
                return r6;
              })(n3);
            }
            c.TYPED_ARRAY_SUPPORT = (function() {
              try {
                const e5 = new Uint8Array(1), t5 = { foo: function() {
                  return 42;
                } };
                return Object.setPrototypeOf(t5, Uint8Array.prototype), Object.setPrototypeOf(e5, t5), 42 === e5.foo();
              } catch (e5) {
                return false;
              }
            })(), c.TYPED_ARRAY_SUPPORT || void 0 === o || "function" != typeof o.error || o.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(c.prototype, "parent", { enumerable: true, get: function() {
              if (c.isBuffer(this)) return this.buffer;
            } }), Object.defineProperty(c.prototype, "offset", { enumerable: true, get: function() {
              if (c.isBuffer(this)) return this.byteOffset;
            } }), c.poolSize = 8192, c.from = function(e5, t5, r5) {
              return l(e5, t5, r5);
            }, Object.setPrototypeOf(c.prototype, Uint8Array.prototype), Object.setPrototypeOf(c, Uint8Array), c.alloc = function(e5, t5, r5) {
              return (function(e6, t6, r6) {
                return f(e6), e6 <= 0 ? u(e6) : void 0 !== t6 ? "string" == typeof r6 ? u(e6).fill(t6, r6) : u(e6).fill(t6) : u(e6);
              })(e5, t5, r5);
            }, c.allocUnsafe = function(e5) {
              return p(e5);
            }, c.allocUnsafeSlow = function(e5) {
              return p(e5);
            }, c.isBuffer = function(e5) {
              return null != e5 && true === e5._isBuffer && e5 !== c.prototype;
            }, c.compare = function(e5, t5) {
              if (Y(e5, Uint8Array) && (e5 = c.from(e5, e5.offset, e5.byteLength)), Y(t5, Uint8Array) && (t5 = c.from(t5, t5.offset, t5.byteLength)), !c.isBuffer(e5) || !c.isBuffer(t5)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
              if (e5 === t5) return 0;
              let r5 = e5.length, n3 = t5.length;
              for (let o2 = 0, i2 = Math.min(r5, n3); o2 < i2; ++o2) if (e5[o2] !== t5[o2]) {
                r5 = e5[o2], n3 = t5[o2];
                break;
              }
              return r5 < n3 ? -1 : n3 < r5 ? 1 : 0;
            }, c.isEncoding = function(e5) {
              switch (String(e5).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return true;
                default:
                  return false;
              }
            }, c.concat = function(e5, t5) {
              if (!Array.isArray(e5)) throw new TypeError('"list" argument must be an Array of Buffers');
              if (0 === e5.length) return c.alloc(0);
              let r5;
              if (void 0 === t5) for (t5 = 0, r5 = 0; r5 < e5.length; ++r5) t5 += e5[r5].length;
              const n3 = c.allocUnsafe(t5);
              let o2 = 0;
              for (r5 = 0; r5 < e5.length; ++r5) {
                let t6 = e5[r5];
                if (Y(t6, Uint8Array)) o2 + t6.length > n3.length ? (c.isBuffer(t6) || (t6 = c.from(t6)), t6.copy(n3, o2)) : Uint8Array.prototype.set.call(n3, t6, o2);
                else {
                  if (!c.isBuffer(t6)) throw new TypeError('"list" argument must be an Array of Buffers');
                  t6.copy(n3, o2);
                }
                o2 += t6.length;
              }
              return n3;
            }, c.byteLength = m, c.prototype._isBuffer = true, c.prototype.swap16 = function() {
              const e5 = this.length;
              if (e5 % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
              for (let t5 = 0; t5 < e5; t5 += 2) v(this, t5, t5 + 1);
              return this;
            }, c.prototype.swap32 = function() {
              const e5 = this.length;
              if (e5 % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
              for (let t5 = 0; t5 < e5; t5 += 4) v(this, t5, t5 + 3), v(this, t5 + 1, t5 + 2);
              return this;
            }, c.prototype.swap64 = function() {
              const e5 = this.length;
              if (e5 % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
              for (let t5 = 0; t5 < e5; t5 += 8) v(this, t5, t5 + 7), v(this, t5 + 1, t5 + 6), v(this, t5 + 2, t5 + 5), v(this, t5 + 3, t5 + 4);
              return this;
            }, c.prototype.toString = function() {
              const e5 = this.length;
              return 0 === e5 ? "" : 0 === arguments.length ? x(this, 0, e5) : g.apply(this, arguments);
            }, c.prototype.toLocaleString = c.prototype.toString, c.prototype.equals = function(e5) {
              if (!c.isBuffer(e5)) throw new TypeError("Argument must be a Buffer");
              return this === e5 || 0 === c.compare(this, e5);
            }, c.prototype.inspect = function() {
              let e5 = "";
              const r5 = t4.IS;
              return e5 = this.toString("hex", 0, r5).replace(/(.{2})/g, "$1 ").trim(), this.length > r5 && (e5 += " ... "), "<Buffer " + e5 + ">";
            }, a && (c.prototype[a] = c.prototype.inspect), c.prototype.compare = function(e5, t5, r5, n3, o2) {
              if (Y(e5, Uint8Array) && (e5 = c.from(e5, e5.offset, e5.byteLength)), !c.isBuffer(e5)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e5);
              if (void 0 === t5 && (t5 = 0), void 0 === r5 && (r5 = e5 ? e5.length : 0), void 0 === n3 && (n3 = 0), void 0 === o2 && (o2 = this.length), t5 < 0 || r5 > e5.length || n3 < 0 || o2 > this.length) throw new RangeError("out of range index");
              if (n3 >= o2 && t5 >= r5) return 0;
              if (n3 >= o2) return -1;
              if (t5 >= r5) return 1;
              if (this === e5) return 0;
              let i2 = (o2 >>>= 0) - (n3 >>>= 0), a2 = (r5 >>>= 0) - (t5 >>>= 0);
              const s2 = Math.min(i2, a2), u2 = this.slice(n3, o2), l2 = e5.slice(t5, r5);
              for (let e6 = 0; e6 < s2; ++e6) if (u2[e6] !== l2[e6]) {
                i2 = u2[e6], a2 = l2[e6];
                break;
              }
              return i2 < a2 ? -1 : a2 < i2 ? 1 : 0;
            }, c.prototype.includes = function(e5, t5, r5) {
              return -1 !== this.indexOf(e5, t5, r5);
            }, c.prototype.indexOf = function(e5, t5, r5) {
              return b(this, e5, t5, r5, true);
            }, c.prototype.lastIndexOf = function(e5, t5, r5) {
              return b(this, e5, t5, r5, false);
            }, c.prototype.write = function(e5, t5, r5, n3) {
              if (void 0 === t5) n3 = "utf8", r5 = this.length, t5 = 0;
              else if (void 0 === r5 && "string" == typeof t5) n3 = t5, r5 = this.length, t5 = 0;
              else {
                if (!isFinite(t5)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                t5 >>>= 0, isFinite(r5) ? (r5 >>>= 0, void 0 === n3 && (n3 = "utf8")) : (n3 = r5, r5 = void 0);
              }
              const o2 = this.length - t5;
              if ((void 0 === r5 || r5 > o2) && (r5 = o2), e5.length > 0 && (r5 < 0 || t5 < 0) || t5 > this.length) throw new RangeError("Attempt to write outside buffer bounds");
              n3 || (n3 = "utf8");
              let i2 = false;
              for (; ; ) switch (n3) {
                case "hex":
                  return S(this, e5, t5, r5);
                case "utf8":
                case "utf-8":
                  return E(this, e5, t5, r5);
                case "ascii":
                case "latin1":
                case "binary":
                  return k(this, e5, t5, r5);
                case "base64":
                  return A(this, e5, t5, r5);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return T(this, e5, t5, r5);
                default:
                  if (i2) throw new TypeError("Unknown encoding: " + n3);
                  n3 = ("" + n3).toLowerCase(), i2 = true;
              }
            }, c.prototype.toJSON = function() {
              return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
            };
            const P = 4096;
            function B(e5, t5, r5) {
              let n3 = "";
              r5 = Math.min(e5.length, r5);
              for (let o2 = t5; o2 < r5; ++o2) n3 += String.fromCharCode(127 & e5[o2]);
              return n3;
            }
            function I(e5, t5, r5) {
              let n3 = "";
              r5 = Math.min(e5.length, r5);
              for (let o2 = t5; o2 < r5; ++o2) n3 += String.fromCharCode(e5[o2]);
              return n3;
            }
            function C(e5, t5, r5) {
              const n3 = e5.length;
              (!t5 || t5 < 0) && (t5 = 0), (!r5 || r5 < 0 || r5 > n3) && (r5 = n3);
              let o2 = "";
              for (let n4 = t5; n4 < r5; ++n4) o2 += J[e5[n4]];
              return o2;
            }
            function R(e5, t5, r5) {
              const n3 = e5.slice(t5, r5);
              let o2 = "";
              for (let e6 = 0; e6 < n3.length - 1; e6 += 2) o2 += String.fromCharCode(n3[e6] + 256 * n3[e6 + 1]);
              return o2;
            }
            function _(e5, t5, r5) {
              if (e5 % 1 != 0 || e5 < 0) throw new RangeError("offset is not uint");
              if (e5 + t5 > r5) throw new RangeError("Trying to access beyond buffer length");
            }
            function U(e5, t5, r5, n3, o2, i2) {
              if (!c.isBuffer(e5)) throw new TypeError('"buffer" argument must be a Buffer instance');
              if (t5 > o2 || t5 < i2) throw new RangeError('"value" argument is out of bounds');
              if (r5 + n3 > e5.length) throw new RangeError("Index out of range");
            }
            function N(e5, t5, r5, n3, o2) {
              K(t5, n3, o2, e5, r5, 7);
              let i2 = Number(t5 & BigInt(4294967295));
              e5[r5++] = i2, i2 >>= 8, e5[r5++] = i2, i2 >>= 8, e5[r5++] = i2, i2 >>= 8, e5[r5++] = i2;
              let a2 = Number(t5 >> BigInt(32) & BigInt(4294967295));
              return e5[r5++] = a2, a2 >>= 8, e5[r5++] = a2, a2 >>= 8, e5[r5++] = a2, a2 >>= 8, e5[r5++] = a2, r5;
            }
            function L(e5, t5, r5, n3, o2) {
              K(t5, n3, o2, e5, r5, 7);
              let i2 = Number(t5 & BigInt(4294967295));
              e5[r5 + 7] = i2, i2 >>= 8, e5[r5 + 6] = i2, i2 >>= 8, e5[r5 + 5] = i2, i2 >>= 8, e5[r5 + 4] = i2;
              let a2 = Number(t5 >> BigInt(32) & BigInt(4294967295));
              return e5[r5 + 3] = a2, a2 >>= 8, e5[r5 + 2] = a2, a2 >>= 8, e5[r5 + 1] = a2, a2 >>= 8, e5[r5] = a2, r5 + 8;
            }
            function F(e5, t5, r5, n3, o2, i2) {
              if (r5 + n3 > e5.length) throw new RangeError("Index out of range");
              if (r5 < 0) throw new RangeError("Index out of range");
            }
            function j(e5, t5, r5, n3, o2) {
              return t5 = +t5, r5 >>>= 0, o2 || F(e5, 0, r5, 4), i.write(e5, t5, r5, n3, 23, 4), r5 + 4;
            }
            function M(e5, t5, r5, n3, o2) {
              return t5 = +t5, r5 >>>= 0, o2 || F(e5, 0, r5, 8), i.write(e5, t5, r5, n3, 52, 8), r5 + 8;
            }
            c.prototype.slice = function(e5, t5) {
              const r5 = this.length;
              (e5 = ~~e5) < 0 ? (e5 += r5) < 0 && (e5 = 0) : e5 > r5 && (e5 = r5), (t5 = void 0 === t5 ? r5 : ~~t5) < 0 ? (t5 += r5) < 0 && (t5 = 0) : t5 > r5 && (t5 = r5), t5 < e5 && (t5 = e5);
              const n3 = this.subarray(e5, t5);
              return Object.setPrototypeOf(n3, c.prototype), n3;
            }, c.prototype.readUintLE = c.prototype.readUIntLE = function(e5, t5, r5) {
              e5 >>>= 0, t5 >>>= 0, r5 || _(e5, t5, this.length);
              let n3 = this[e5], o2 = 1, i2 = 0;
              for (; ++i2 < t5 && (o2 *= 256); ) n3 += this[e5 + i2] * o2;
              return n3;
            }, c.prototype.readUintBE = c.prototype.readUIntBE = function(e5, t5, r5) {
              e5 >>>= 0, t5 >>>= 0, r5 || _(e5, t5, this.length);
              let n3 = this[e5 + --t5], o2 = 1;
              for (; t5 > 0 && (o2 *= 256); ) n3 += this[e5 + --t5] * o2;
              return n3;
            }, c.prototype.readUint8 = c.prototype.readUInt8 = function(e5, t5) {
              return e5 >>>= 0, t5 || _(e5, 1, this.length), this[e5];
            }, c.prototype.readUint16LE = c.prototype.readUInt16LE = function(e5, t5) {
              return e5 >>>= 0, t5 || _(e5, 2, this.length), this[e5] | this[e5 + 1] << 8;
            }, c.prototype.readUint16BE = c.prototype.readUInt16BE = function(e5, t5) {
              return e5 >>>= 0, t5 || _(e5, 2, this.length), this[e5] << 8 | this[e5 + 1];
            }, c.prototype.readUint32LE = c.prototype.readUInt32LE = function(e5, t5) {
              return e5 >>>= 0, t5 || _(e5, 4, this.length), (this[e5] | this[e5 + 1] << 8 | this[e5 + 2] << 16) + 16777216 * this[e5 + 3];
            }, c.prototype.readUint32BE = c.prototype.readUInt32BE = function(e5, t5) {
              return e5 >>>= 0, t5 || _(e5, 4, this.length), 16777216 * this[e5] + (this[e5 + 1] << 16 | this[e5 + 2] << 8 | this[e5 + 3]);
            }, c.prototype.readBigUInt64LE = Q(function(e5) {
              H(e5 >>>= 0, "offset");
              const t5 = this[e5], r5 = this[e5 + 7];
              void 0 !== t5 && void 0 !== r5 || z(e5, this.length - 8);
              const n3 = t5 + 256 * this[++e5] + 65536 * this[++e5] + this[++e5] * 2 ** 24, o2 = this[++e5] + 256 * this[++e5] + 65536 * this[++e5] + r5 * 2 ** 24;
              return BigInt(n3) + (BigInt(o2) << BigInt(32));
            }), c.prototype.readBigUInt64BE = Q(function(e5) {
              H(e5 >>>= 0, "offset");
              const t5 = this[e5], r5 = this[e5 + 7];
              void 0 !== t5 && void 0 !== r5 || z(e5, this.length - 8);
              const n3 = t5 * 2 ** 24 + 65536 * this[++e5] + 256 * this[++e5] + this[++e5], o2 = this[++e5] * 2 ** 24 + 65536 * this[++e5] + 256 * this[++e5] + r5;
              return (BigInt(n3) << BigInt(32)) + BigInt(o2);
            }), c.prototype.readIntLE = function(e5, t5, r5) {
              e5 >>>= 0, t5 >>>= 0, r5 || _(e5, t5, this.length);
              let n3 = this[e5], o2 = 1, i2 = 0;
              for (; ++i2 < t5 && (o2 *= 256); ) n3 += this[e5 + i2] * o2;
              return o2 *= 128, n3 >= o2 && (n3 -= Math.pow(2, 8 * t5)), n3;
            }, c.prototype.readIntBE = function(e5, t5, r5) {
              e5 >>>= 0, t5 >>>= 0, r5 || _(e5, t5, this.length);
              let n3 = t5, o2 = 1, i2 = this[e5 + --n3];
              for (; n3 > 0 && (o2 *= 256); ) i2 += this[e5 + --n3] * o2;
              return o2 *= 128, i2 >= o2 && (i2 -= Math.pow(2, 8 * t5)), i2;
            }, c.prototype.readInt8 = function(e5, t5) {
              return e5 >>>= 0, t5 || _(e5, 1, this.length), 128 & this[e5] ? -1 * (255 - this[e5] + 1) : this[e5];
            }, c.prototype.readInt16LE = function(e5, t5) {
              e5 >>>= 0, t5 || _(e5, 2, this.length);
              const r5 = this[e5] | this[e5 + 1] << 8;
              return 32768 & r5 ? 4294901760 | r5 : r5;
            }, c.prototype.readInt16BE = function(e5, t5) {
              e5 >>>= 0, t5 || _(e5, 2, this.length);
              const r5 = this[e5 + 1] | this[e5] << 8;
              return 32768 & r5 ? 4294901760 | r5 : r5;
            }, c.prototype.readInt32LE = function(e5, t5) {
              return e5 >>>= 0, t5 || _(e5, 4, this.length), this[e5] | this[e5 + 1] << 8 | this[e5 + 2] << 16 | this[e5 + 3] << 24;
            }, c.prototype.readInt32BE = function(e5, t5) {
              return e5 >>>= 0, t5 || _(e5, 4, this.length), this[e5] << 24 | this[e5 + 1] << 16 | this[e5 + 2] << 8 | this[e5 + 3];
            }, c.prototype.readBigInt64LE = Q(function(e5) {
              H(e5 >>>= 0, "offset");
              const t5 = this[e5], r5 = this[e5 + 7];
              void 0 !== t5 && void 0 !== r5 || z(e5, this.length - 8);
              const n3 = this[e5 + 4] + 256 * this[e5 + 5] + 65536 * this[e5 + 6] + (r5 << 24);
              return (BigInt(n3) << BigInt(32)) + BigInt(t5 + 256 * this[++e5] + 65536 * this[++e5] + this[++e5] * 2 ** 24);
            }), c.prototype.readBigInt64BE = Q(function(e5) {
              H(e5 >>>= 0, "offset");
              const t5 = this[e5], r5 = this[e5 + 7];
              void 0 !== t5 && void 0 !== r5 || z(e5, this.length - 8);
              const n3 = (t5 << 24) + 65536 * this[++e5] + 256 * this[++e5] + this[++e5];
              return (BigInt(n3) << BigInt(32)) + BigInt(this[++e5] * 2 ** 24 + 65536 * this[++e5] + 256 * this[++e5] + r5);
            }), c.prototype.readFloatLE = function(e5, t5) {
              return e5 >>>= 0, t5 || _(e5, 4, this.length), i.read(this, e5, true, 23, 4);
            }, c.prototype.readFloatBE = function(e5, t5) {
              return e5 >>>= 0, t5 || _(e5, 4, this.length), i.read(this, e5, false, 23, 4);
            }, c.prototype.readDoubleLE = function(e5, t5) {
              return e5 >>>= 0, t5 || _(e5, 8, this.length), i.read(this, e5, true, 52, 8);
            }, c.prototype.readDoubleBE = function(e5, t5) {
              return e5 >>>= 0, t5 || _(e5, 8, this.length), i.read(this, e5, false, 52, 8);
            }, c.prototype.writeUintLE = c.prototype.writeUIntLE = function(e5, t5, r5, n3) {
              e5 = +e5, t5 >>>= 0, r5 >>>= 0, n3 || U(this, e5, t5, r5, Math.pow(2, 8 * r5) - 1, 0);
              let o2 = 1, i2 = 0;
              for (this[t5] = 255 & e5; ++i2 < r5 && (o2 *= 256); ) this[t5 + i2] = e5 / o2 & 255;
              return t5 + r5;
            }, c.prototype.writeUintBE = c.prototype.writeUIntBE = function(e5, t5, r5, n3) {
              e5 = +e5, t5 >>>= 0, r5 >>>= 0, n3 || U(this, e5, t5, r5, Math.pow(2, 8 * r5) - 1, 0);
              let o2 = r5 - 1, i2 = 1;
              for (this[t5 + o2] = 255 & e5; --o2 >= 0 && (i2 *= 256); ) this[t5 + o2] = e5 / i2 & 255;
              return t5 + r5;
            }, c.prototype.writeUint8 = c.prototype.writeUInt8 = function(e5, t5, r5) {
              return e5 = +e5, t5 >>>= 0, r5 || U(this, e5, t5, 1, 255, 0), this[t5] = 255 & e5, t5 + 1;
            }, c.prototype.writeUint16LE = c.prototype.writeUInt16LE = function(e5, t5, r5) {
              return e5 = +e5, t5 >>>= 0, r5 || U(this, e5, t5, 2, 65535, 0), this[t5] = 255 & e5, this[t5 + 1] = e5 >>> 8, t5 + 2;
            }, c.prototype.writeUint16BE = c.prototype.writeUInt16BE = function(e5, t5, r5) {
              return e5 = +e5, t5 >>>= 0, r5 || U(this, e5, t5, 2, 65535, 0), this[t5] = e5 >>> 8, this[t5 + 1] = 255 & e5, t5 + 2;
            }, c.prototype.writeUint32LE = c.prototype.writeUInt32LE = function(e5, t5, r5) {
              return e5 = +e5, t5 >>>= 0, r5 || U(this, e5, t5, 4, 4294967295, 0), this[t5 + 3] = e5 >>> 24, this[t5 + 2] = e5 >>> 16, this[t5 + 1] = e5 >>> 8, this[t5] = 255 & e5, t5 + 4;
            }, c.prototype.writeUint32BE = c.prototype.writeUInt32BE = function(e5, t5, r5) {
              return e5 = +e5, t5 >>>= 0, r5 || U(this, e5, t5, 4, 4294967295, 0), this[t5] = e5 >>> 24, this[t5 + 1] = e5 >>> 16, this[t5 + 2] = e5 >>> 8, this[t5 + 3] = 255 & e5, t5 + 4;
            }, c.prototype.writeBigUInt64LE = Q(function(e5, t5 = 0) {
              return N(this, e5, t5, BigInt(0), BigInt("0xffffffffffffffff"));
            }), c.prototype.writeBigUInt64BE = Q(function(e5, t5 = 0) {
              return L(this, e5, t5, BigInt(0), BigInt("0xffffffffffffffff"));
            }), c.prototype.writeIntLE = function(e5, t5, r5, n3) {
              if (e5 = +e5, t5 >>>= 0, !n3) {
                const n4 = Math.pow(2, 8 * r5 - 1);
                U(this, e5, t5, r5, n4 - 1, -n4);
              }
              let o2 = 0, i2 = 1, a2 = 0;
              for (this[t5] = 255 & e5; ++o2 < r5 && (i2 *= 256); ) e5 < 0 && 0 === a2 && 0 !== this[t5 + o2 - 1] && (a2 = 1), this[t5 + o2] = (e5 / i2 | 0) - a2 & 255;
              return t5 + r5;
            }, c.prototype.writeIntBE = function(e5, t5, r5, n3) {
              if (e5 = +e5, t5 >>>= 0, !n3) {
                const n4 = Math.pow(2, 8 * r5 - 1);
                U(this, e5, t5, r5, n4 - 1, -n4);
              }
              let o2 = r5 - 1, i2 = 1, a2 = 0;
              for (this[t5 + o2] = 255 & e5; --o2 >= 0 && (i2 *= 256); ) e5 < 0 && 0 === a2 && 0 !== this[t5 + o2 + 1] && (a2 = 1), this[t5 + o2] = (e5 / i2 | 0) - a2 & 255;
              return t5 + r5;
            }, c.prototype.writeInt8 = function(e5, t5, r5) {
              return e5 = +e5, t5 >>>= 0, r5 || U(this, e5, t5, 1, 127, -128), e5 < 0 && (e5 = 255 + e5 + 1), this[t5] = 255 & e5, t5 + 1;
            }, c.prototype.writeInt16LE = function(e5, t5, r5) {
              return e5 = +e5, t5 >>>= 0, r5 || U(this, e5, t5, 2, 32767, -32768), this[t5] = 255 & e5, this[t5 + 1] = e5 >>> 8, t5 + 2;
            }, c.prototype.writeInt16BE = function(e5, t5, r5) {
              return e5 = +e5, t5 >>>= 0, r5 || U(this, e5, t5, 2, 32767, -32768), this[t5] = e5 >>> 8, this[t5 + 1] = 255 & e5, t5 + 2;
            }, c.prototype.writeInt32LE = function(e5, t5, r5) {
              return e5 = +e5, t5 >>>= 0, r5 || U(this, e5, t5, 4, 2147483647, -2147483648), this[t5] = 255 & e5, this[t5 + 1] = e5 >>> 8, this[t5 + 2] = e5 >>> 16, this[t5 + 3] = e5 >>> 24, t5 + 4;
            }, c.prototype.writeInt32BE = function(e5, t5, r5) {
              return e5 = +e5, t5 >>>= 0, r5 || U(this, e5, t5, 4, 2147483647, -2147483648), e5 < 0 && (e5 = 4294967295 + e5 + 1), this[t5] = e5 >>> 24, this[t5 + 1] = e5 >>> 16, this[t5 + 2] = e5 >>> 8, this[t5 + 3] = 255 & e5, t5 + 4;
            }, c.prototype.writeBigInt64LE = Q(function(e5, t5 = 0) {
              return N(this, e5, t5, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
            }), c.prototype.writeBigInt64BE = Q(function(e5, t5 = 0) {
              return L(this, e5, t5, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
            }), c.prototype.writeFloatLE = function(e5, t5, r5) {
              return j(this, e5, t5, true, r5);
            }, c.prototype.writeFloatBE = function(e5, t5, r5) {
              return j(this, e5, t5, false, r5);
            }, c.prototype.writeDoubleLE = function(e5, t5, r5) {
              return M(this, e5, t5, true, r5);
            }, c.prototype.writeDoubleBE = function(e5, t5, r5) {
              return M(this, e5, t5, false, r5);
            }, c.prototype.copy = function(e5, t5, r5, n3) {
              if (!c.isBuffer(e5)) throw new TypeError("argument should be a Buffer");
              if (r5 || (r5 = 0), n3 || 0 === n3 || (n3 = this.length), t5 >= e5.length && (t5 = e5.length), t5 || (t5 = 0), n3 > 0 && n3 < r5 && (n3 = r5), n3 === r5) return 0;
              if (0 === e5.length || 0 === this.length) return 0;
              if (t5 < 0) throw new RangeError("targetStart out of bounds");
              if (r5 < 0 || r5 >= this.length) throw new RangeError("Index out of range");
              if (n3 < 0) throw new RangeError("sourceEnd out of bounds");
              n3 > this.length && (n3 = this.length), e5.length - t5 < n3 - r5 && (n3 = e5.length - t5 + r5);
              const o2 = n3 - r5;
              return this === e5 && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(t5, r5, n3) : Uint8Array.prototype.set.call(e5, this.subarray(r5, n3), t5), o2;
            }, c.prototype.fill = function(e5, t5, r5, n3) {
              if ("string" == typeof e5) {
                if ("string" == typeof t5 ? (n3 = t5, t5 = 0, r5 = this.length) : "string" == typeof r5 && (n3 = r5, r5 = this.length), void 0 !== n3 && "string" != typeof n3) throw new TypeError("encoding must be a string");
                if ("string" == typeof n3 && !c.isEncoding(n3)) throw new TypeError("Unknown encoding: " + n3);
                if (1 === e5.length) {
                  const t6 = e5.charCodeAt(0);
                  ("utf8" === n3 && t6 < 128 || "latin1" === n3) && (e5 = t6);
                }
              } else "number" == typeof e5 ? e5 &= 255 : "boolean" == typeof e5 && (e5 = Number(e5));
              if (t5 < 0 || this.length < t5 || this.length < r5) throw new RangeError("Out of range index");
              if (r5 <= t5) return this;
              let o2;
              if (t5 >>>= 0, r5 = void 0 === r5 ? this.length : r5 >>> 0, e5 || (e5 = 0), "number" == typeof e5) for (o2 = t5; o2 < r5; ++o2) this[o2] = e5;
              else {
                const i2 = c.isBuffer(e5) ? e5 : c.from(e5, n3), a2 = i2.length;
                if (0 === a2) throw new TypeError('The value "' + e5 + '" is invalid for argument "value"');
                for (o2 = 0; o2 < r5 - t5; ++o2) this[o2 + t5] = i2[o2 % a2];
              }
              return this;
            };
            const D = {};
            function V(e5, t5, r5) {
              D[e5] = class extends r5 {
                constructor() {
                  super(), Object.defineProperty(this, "message", { value: t5.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${e5}]`, this.stack, delete this.name;
                }
                get code() {
                  return e5;
                }
                set code(e6) {
                  Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: e6, writable: true });
                }
                toString() {
                  return `${this.name} [${e5}]: ${this.message}`;
                }
              };
            }
            function q(e5) {
              let t5 = "", r5 = e5.length;
              const n3 = "-" === e5[0] ? 1 : 0;
              for (; r5 >= n3 + 4; r5 -= 3) t5 = `_${e5.slice(r5 - 3, r5)}${t5}`;
              return `${e5.slice(0, r5)}${t5}`;
            }
            function K(e5, t5, r5, n3, o2, i2) {
              if (e5 > r5 || e5 < t5) {
                const n4 = "bigint" == typeof t5 ? "n" : "";
                let o3;
                throw o3 = i2 > 3 ? 0 === t5 || t5 === BigInt(0) ? `>= 0${n4} and < 2${n4} ** ${8 * (i2 + 1)}${n4}` : `>= -(2${n4} ** ${8 * (i2 + 1) - 1}${n4}) and < 2 ** ${8 * (i2 + 1) - 1}${n4}` : `>= ${t5}${n4} and <= ${r5}${n4}`, new D.ERR_OUT_OF_RANGE("value", o3, e5);
              }
              !(function(e6, t6, r6) {
                H(t6, "offset"), void 0 !== e6[t6] && void 0 !== e6[t6 + r6] || z(t6, e6.length - (r6 + 1));
              })(n3, o2, i2);
            }
            function H(e5, t5) {
              if ("number" != typeof e5) throw new D.ERR_INVALID_ARG_TYPE(t5, "number", e5);
            }
            function z(e5, t5, r5) {
              if (Math.floor(e5) !== e5) throw H(e5, r5), new D.ERR_OUT_OF_RANGE(r5 || "offset", "an integer", e5);
              if (t5 < 0) throw new D.ERR_BUFFER_OUT_OF_BOUNDS();
              throw new D.ERR_OUT_OF_RANGE(r5 || "offset", `>= ${r5 ? 1 : 0} and <= ${t5}`, e5);
            }
            V("ERR_BUFFER_OUT_OF_BOUNDS", function(e5) {
              return e5 ? `${e5} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
            }, RangeError), V("ERR_INVALID_ARG_TYPE", function(e5, t5) {
              return `The "${e5}" argument must be of type number. Received type ${typeof t5}`;
            }, TypeError), V("ERR_OUT_OF_RANGE", function(e5, t5, r5) {
              let n3 = `The value of "${e5}" is out of range.`, o2 = r5;
              return Number.isInteger(r5) && Math.abs(r5) > 2 ** 32 ? o2 = q(String(r5)) : "bigint" == typeof r5 && (o2 = String(r5), (r5 > BigInt(2) ** BigInt(32) || r5 < -(BigInt(2) ** BigInt(32))) && (o2 = q(o2)), o2 += "n"), n3 += ` It must be ${t5}. Received ${o2}`, n3;
            }, RangeError);
            const X = /[^+/0-9A-Za-z-_]/g;
            function $(e5, t5) {
              let r5;
              t5 = t5 || 1 / 0;
              const n3 = e5.length;
              let o2 = null;
              const i2 = [];
              for (let a2 = 0; a2 < n3; ++a2) {
                if (r5 = e5.charCodeAt(a2), r5 > 55295 && r5 < 57344) {
                  if (!o2) {
                    if (r5 > 56319) {
                      (t5 -= 3) > -1 && i2.push(239, 191, 189);
                      continue;
                    }
                    if (a2 + 1 === n3) {
                      (t5 -= 3) > -1 && i2.push(239, 191, 189);
                      continue;
                    }
                    o2 = r5;
                    continue;
                  }
                  if (r5 < 56320) {
                    (t5 -= 3) > -1 && i2.push(239, 191, 189), o2 = r5;
                    continue;
                  }
                  r5 = 65536 + (o2 - 55296 << 10 | r5 - 56320);
                } else o2 && (t5 -= 3) > -1 && i2.push(239, 191, 189);
                if (o2 = null, r5 < 128) {
                  if ((t5 -= 1) < 0) break;
                  i2.push(r5);
                } else if (r5 < 2048) {
                  if ((t5 -= 2) < 0) break;
                  i2.push(r5 >> 6 | 192, 63 & r5 | 128);
                } else if (r5 < 65536) {
                  if ((t5 -= 3) < 0) break;
                  i2.push(r5 >> 12 | 224, r5 >> 6 & 63 | 128, 63 & r5 | 128);
                } else {
                  if (!(r5 < 1114112)) throw new Error("Invalid code point");
                  if ((t5 -= 4) < 0) break;
                  i2.push(r5 >> 18 | 240, r5 >> 12 & 63 | 128, r5 >> 6 & 63 | 128, 63 & r5 | 128);
                }
              }
              return i2;
            }
            function G(e5) {
              return n2.toByteArray((function(e6) {
                if ((e6 = (e6 = e6.split("=")[0]).trim().replace(X, "")).length < 2) return "";
                for (; e6.length % 4 != 0; ) e6 += "=";
                return e6;
              })(e5));
            }
            function W(e5, t5, r5, n3) {
              let o2;
              for (o2 = 0; o2 < n3 && !(o2 + r5 >= t5.length || o2 >= e5.length); ++o2) t5[o2 + r5] = e5[o2];
              return o2;
            }
            function Y(e5, t5) {
              return e5 instanceof t5 || null != e5 && null != e5.constructor && null != e5.constructor.name && e5.constructor.name === t5.name;
            }
            function Z(e5) {
              return e5 != e5;
            }
            const J = (function() {
              const e5 = "0123456789abcdef", t5 = new Array(256);
              for (let r5 = 0; r5 < 16; ++r5) {
                const n3 = 16 * r5;
                for (let o2 = 0; o2 < 16; ++o2) t5[n3 + o2] = e5[r5] + e5[o2];
              }
              return t5;
            })();
            function Q(e5) {
              return "undefined" == typeof BigInt ? ee : e5;
            }
            function ee() {
              throw new Error("BigInt not supported");
            }
          }, 251: (e4, t4) => {
            t4.read = function(e5, t5, r4, n2, o2) {
              var i, a, s = 8 * o2 - n2 - 1, u = (1 << s) - 1, c = u >> 1, l = -7, f = r4 ? o2 - 1 : 0, p = r4 ? -1 : 1, d = e5[t5 + f];
              for (f += p, i = d & (1 << -l) - 1, d >>= -l, l += s; l > 0; i = 256 * i + e5[t5 + f], f += p, l -= 8) ;
              for (a = i & (1 << -l) - 1, i >>= -l, l += n2; l > 0; a = 256 * a + e5[t5 + f], f += p, l -= 8) ;
              if (0 === i) i = 1 - c;
              else {
                if (i === u) return a ? NaN : 1 / 0 * (d ? -1 : 1);
                a += Math.pow(2, n2), i -= c;
              }
              return (d ? -1 : 1) * a * Math.pow(2, i - n2);
            }, t4.write = function(e5, t5, r4, n2, o2, i) {
              var a, s, u, c = 8 * i - o2 - 1, l = (1 << c) - 1, f = l >> 1, p = 23 === o2 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = n2 ? 0 : i - 1, h = n2 ? 1 : -1, y = t5 < 0 || 0 === t5 && 1 / t5 < 0 ? 1 : 0;
              for (t5 = Math.abs(t5), isNaN(t5) || t5 === 1 / 0 ? (s = isNaN(t5) ? 1 : 0, a = l) : (a = Math.floor(Math.log(t5) / Math.LN2), t5 * (u = Math.pow(2, -a)) < 1 && (a--, u *= 2), (t5 += a + f >= 1 ? p / u : p * Math.pow(2, 1 - f)) * u >= 2 && (a++, u /= 2), a + f >= l ? (s = 0, a = l) : a + f >= 1 ? (s = (t5 * u - 1) * Math.pow(2, o2), a += f) : (s = t5 * Math.pow(2, f - 1) * Math.pow(2, o2), a = 0)); o2 >= 8; e5[r4 + d] = 255 & s, d += h, s /= 256, o2 -= 8) ;
              for (a = a << o2 | s, c += o2; c > 0; e5[r4 + d] = 255 & a, d += h, a /= 256, c -= 8) ;
              e5[r4 + d - h] |= 128 * y;
            };
          } }, t3 = {};
          function r3(n2) {
            var o2 = t3[n2];
            if (void 0 !== o2) return o2.exports;
            var i = t3[n2] = { exports: {} };
            return e3[n2](i, i.exports, r3), i.exports;
          }
          return r3.d = (e4, t4) => {
            for (var n2 in t4) r3.o(t4, n2) && !r3.o(e4, n2) && Object.defineProperty(e4, n2, { enumerable: true, get: t4[n2] });
          }, r3.g = (function() {
            if ("object" == typeof globalThis) return globalThis;
            try {
              return this || new Function("return this")();
            } catch (e4) {
              if ("object" == typeof window) return window;
            }
          })(), r3.o = (e4, t4) => Object.prototype.hasOwnProperty.call(e4, t4), r3.r = (e4) => {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e4, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e4, "__esModule", { value: true });
          }, r3(281);
        })(), e2.exports = n();
      }, 3918: (e2, t2, r2) => {
        "use strict";
        var n = r2(5606);
        function o(e3, t3) {
          var r3 = Object.keys(e3);
          if (Object.getOwnPropertySymbols) {
            var n2 = Object.getOwnPropertySymbols(e3);
            t3 && (n2 = n2.filter(function(t4) {
              return Object.getOwnPropertyDescriptor(e3, t4).enumerable;
            })), r3.push.apply(r3, n2);
          }
          return r3;
        }
        function i(e3) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r3 = null != arguments[t3] ? arguments[t3] : {};
            t3 % 2 ? o(Object(r3), true).forEach(function(t4) {
              a(e3, t4, r3[t4]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(r3)) : o(Object(r3)).forEach(function(t4) {
              Object.defineProperty(e3, t4, Object.getOwnPropertyDescriptor(r3, t4));
            });
          }
          return e3;
        }
        function a(e3, t3, r3) {
          return (t3 = u(t3)) in e3 ? Object.defineProperty(e3, t3, { value: r3, enumerable: true, configurable: true, writable: true }) : e3[t3] = r3, e3;
        }
        function s(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, u(n2.key), n2);
          }
        }
        function u(e3) {
          var t3 = (function(e4, t4) {
            if ("object" !== m(e4) || null === e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" !== m(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" === m(t3) ? t3 : String(t3);
        }
        function c(e3, t3) {
          if (t3 && ("object" === m(t3) || "function" == typeof t3)) return t3;
          if (void 0 !== t3) throw new TypeError("Derived constructors may only return object or undefined");
          return l(e3);
        }
        function l(e3) {
          if (void 0 === e3) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return e3;
        }
        function f(e3) {
          var t3 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
          return f = function(e4) {
            if (null === e4 || (r3 = e4, -1 === Function.toString.call(r3).indexOf("[native code]"))) return e4;
            var r3;
            if ("function" != typeof e4) throw new TypeError("Super expression must either be null or a function");
            if (void 0 !== t3) {
              if (t3.has(e4)) return t3.get(e4);
              t3.set(e4, n2);
            }
            function n2() {
              return p(e4, arguments, y(this).constructor);
            }
            return n2.prototype = Object.create(e4.prototype, { constructor: { value: n2, enumerable: false, writable: true, configurable: true } }), h(n2, e4);
          }, f(e3);
        }
        function p(e3, t3, r3) {
          return p = d() ? Reflect.construct.bind() : function(e4, t4, r4) {
            var n2 = [null];
            n2.push.apply(n2, t4);
            var o2 = new (Function.bind.apply(e4, n2))();
            return r4 && h(o2, r4.prototype), o2;
          }, p.apply(null, arguments);
        }
        function d() {
          if ("undefined" == typeof Reflect || !Reflect.construct) return false;
          if (Reflect.construct.sham) return false;
          if ("function" == typeof Proxy) return true;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), true;
          } catch (e3) {
            return false;
          }
        }
        function h(e3, t3) {
          return h = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e4, t4) {
            return e4.__proto__ = t4, e4;
          }, h(e3, t3);
        }
        function y(e3) {
          return y = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e4) {
            return e4.__proto__ || Object.getPrototypeOf(e4);
          }, y(e3);
        }
        function m(e3) {
          return m = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, m(e3);
        }
        var g = r2(537).inspect, v = r2(9597).codes.ERR_INVALID_ARG_TYPE;
        function b(e3, t3, r3) {
          return (void 0 === r3 || r3 > e3.length) && (r3 = e3.length), e3.substring(r3 - t3.length, r3) === t3;
        }
        var w = "", S = "", E = "", k = "", A = { deepStrictEqual: "Expected values to be strictly deep-equal:", strictEqual: "Expected values to be strictly equal:", strictEqualObject: 'Expected "actual" to be reference-equal to "expected":', deepEqual: "Expected values to be loosely deep-equal:", equal: "Expected values to be loosely equal:", notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:', notStrictEqual: 'Expected "actual" to be strictly unequal to:', notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":', notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:', notEqual: 'Expected "actual" to be loosely unequal to:', notIdentical: "Values identical but not reference-equal:" };
        function T(e3) {
          var t3 = Object.keys(e3), r3 = Object.create(Object.getPrototypeOf(e3));
          return t3.forEach(function(t4) {
            r3[t4] = e3[t4];
          }), Object.defineProperty(r3, "message", { value: e3.message }), r3;
        }
        function O(e3) {
          return g(e3, { compact: false, customInspect: false, depth: 1e3, maxArrayLength: 1 / 0, showHidden: false, breakLength: 1 / 0, showProxy: false, sorted: true, getters: true });
        }
        function x(e3, t3, r3) {
          var o2 = "", i2 = "", a2 = 0, s2 = "", u2 = false, c2 = O(e3), l2 = c2.split("\n"), f2 = O(t3).split("\n"), p2 = 0, d2 = "";
          if ("strictEqual" === r3 && "object" === m(e3) && "object" === m(t3) && null !== e3 && null !== t3 && (r3 = "strictEqualObject"), 1 === l2.length && 1 === f2.length && l2[0] !== f2[0]) {
            var h2 = l2[0].length + f2[0].length;
            if (h2 <= 10) {
              if (!("object" === m(e3) && null !== e3 || "object" === m(t3) && null !== t3 || 0 === e3 && 0 === t3)) return "".concat(A[r3], "\n\n") + "".concat(l2[0], " !== ").concat(f2[0], "\n");
            } else if ("strictEqualObject" !== r3) {
              if (h2 < (n.stderr && n.stderr.isTTY ? n.stderr.columns : 80)) {
                for (; l2[0][p2] === f2[0][p2]; ) p2++;
                p2 > 2 && (d2 = "\n  ".concat((function(e4, t4) {
                  if (t4 = Math.floor(t4), 0 == e4.length || 0 == t4) return "";
                  var r4 = e4.length * t4;
                  for (t4 = Math.floor(Math.log(t4) / Math.log(2)); t4; ) e4 += e4, t4--;
                  return e4 + e4.substring(0, r4 - e4.length);
                })(" ", p2), "^"), p2 = 0);
              }
            }
          }
          for (var y2 = l2[l2.length - 1], g2 = f2[f2.length - 1]; y2 === g2 && (p2++ < 2 ? s2 = "\n  ".concat(y2).concat(s2) : o2 = y2, l2.pop(), f2.pop(), 0 !== l2.length && 0 !== f2.length); ) y2 = l2[l2.length - 1], g2 = f2[f2.length - 1];
          var v2 = Math.max(l2.length, f2.length);
          if (0 === v2) {
            var T2 = c2.split("\n");
            if (T2.length > 30) for (T2[26] = "".concat(w, "...").concat(k); T2.length > 27; ) T2.pop();
            return "".concat(A.notIdentical, "\n\n").concat(T2.join("\n"), "\n");
          }
          p2 > 3 && (s2 = "\n".concat(w, "...").concat(k).concat(s2), u2 = true), "" !== o2 && (s2 = "\n  ".concat(o2).concat(s2), o2 = "");
          var x2 = 0, P2 = A[r3] + "\n".concat(S, "+ actual").concat(k, " ").concat(E, "- expected").concat(k), B = " ".concat(w, "...").concat(k, " Lines skipped");
          for (p2 = 0; p2 < v2; p2++) {
            var I = p2 - a2;
            if (l2.length < p2 + 1) I > 1 && p2 > 2 && (I > 4 ? (i2 += "\n".concat(w, "...").concat(k), u2 = true) : I > 3 && (i2 += "\n  ".concat(f2[p2 - 2]), x2++), i2 += "\n  ".concat(f2[p2 - 1]), x2++), a2 = p2, o2 += "\n".concat(E, "-").concat(k, " ").concat(f2[p2]), x2++;
            else if (f2.length < p2 + 1) I > 1 && p2 > 2 && (I > 4 ? (i2 += "\n".concat(w, "...").concat(k), u2 = true) : I > 3 && (i2 += "\n  ".concat(l2[p2 - 2]), x2++), i2 += "\n  ".concat(l2[p2 - 1]), x2++), a2 = p2, i2 += "\n".concat(S, "+").concat(k, " ").concat(l2[p2]), x2++;
            else {
              var C = f2[p2], R = l2[p2], _ = R !== C && (!b(R, ",") || R.slice(0, -1) !== C);
              _ && b(C, ",") && C.slice(0, -1) === R && (_ = false, R += ","), _ ? (I > 1 && p2 > 2 && (I > 4 ? (i2 += "\n".concat(w, "...").concat(k), u2 = true) : I > 3 && (i2 += "\n  ".concat(l2[p2 - 2]), x2++), i2 += "\n  ".concat(l2[p2 - 1]), x2++), a2 = p2, i2 += "\n".concat(S, "+").concat(k, " ").concat(R), o2 += "\n".concat(E, "-").concat(k, " ").concat(C), x2 += 2) : (i2 += o2, o2 = "", 1 !== I && 0 !== p2 || (i2 += "\n  ".concat(R), x2++));
            }
            if (x2 > 20 && p2 < v2 - 2) return "".concat(P2).concat(B, "\n").concat(i2, "\n").concat(w, "...").concat(k).concat(o2, "\n") + "".concat(w, "...").concat(k);
          }
          return "".concat(P2).concat(u2 ? B : "", "\n").concat(i2).concat(o2).concat(s2).concat(d2);
        }
        var P = (function(e3, t3) {
          !(function(e4, t4) {
            if ("function" != typeof t4 && null !== t4) throw new TypeError("Super expression must either be null or a function");
            e4.prototype = Object.create(t4 && t4.prototype, { constructor: { value: e4, writable: true, configurable: true } }), Object.defineProperty(e4, "prototype", { writable: false }), t4 && h(e4, t4);
          })(b2, e3);
          var r3, o2, a2, u2, f2, p2 = (r3 = b2, o2 = d(), function() {
            var e4, t4 = y(r3);
            if (o2) {
              var n2 = y(this).constructor;
              e4 = Reflect.construct(t4, arguments, n2);
            } else e4 = t4.apply(this, arguments);
            return c(this, e4);
          });
          function b2(e4) {
            var t4;
            if ((function(e5, t5) {
              if (!(e5 instanceof t5)) throw new TypeError("Cannot call a class as a function");
            })(this, b2), "object" !== m(e4) || null === e4) throw new v("options", "Object", e4);
            var r4 = e4.message, o3 = e4.operator, i2 = e4.stackStartFn, a3 = e4.actual, s2 = e4.expected, u3 = Error.stackTraceLimit;
            if (Error.stackTraceLimit = 0, null != r4) t4 = p2.call(this, String(r4));
            else if (n.stderr && n.stderr.isTTY && (n.stderr && n.stderr.getColorDepth && 1 !== n.stderr.getColorDepth() ? (w = "\x1B[34m", S = "\x1B[32m", k = "\x1B[39m", E = "\x1B[31m") : (w = "", S = "", k = "", E = "")), "object" === m(a3) && null !== a3 && "object" === m(s2) && null !== s2 && "stack" in a3 && a3 instanceof Error && "stack" in s2 && s2 instanceof Error && (a3 = T(a3), s2 = T(s2)), "deepStrictEqual" === o3 || "strictEqual" === o3) t4 = p2.call(this, x(a3, s2, o3));
            else if ("notDeepStrictEqual" === o3 || "notStrictEqual" === o3) {
              var f3 = A[o3], d2 = O(a3).split("\n");
              if ("notStrictEqual" === o3 && "object" === m(a3) && null !== a3 && (f3 = A.notStrictEqualObject), d2.length > 30) for (d2[26] = "".concat(w, "...").concat(k); d2.length > 27; ) d2.pop();
              t4 = 1 === d2.length ? p2.call(this, "".concat(f3, " ").concat(d2[0])) : p2.call(this, "".concat(f3, "\n\n").concat(d2.join("\n"), "\n"));
            } else {
              var h2 = O(a3), y2 = "", g2 = A[o3];
              "notDeepEqual" === o3 || "notEqual" === o3 ? (h2 = "".concat(A[o3], "\n\n").concat(h2)).length > 1024 && (h2 = "".concat(h2.slice(0, 1021), "...")) : (y2 = "".concat(O(s2)), h2.length > 512 && (h2 = "".concat(h2.slice(0, 509), "...")), y2.length > 512 && (y2 = "".concat(y2.slice(0, 509), "...")), "deepEqual" === o3 || "equal" === o3 ? h2 = "".concat(g2, "\n\n").concat(h2, "\n\nshould equal\n\n") : y2 = " ".concat(o3, " ").concat(y2)), t4 = p2.call(this, "".concat(h2).concat(y2));
            }
            return Error.stackTraceLimit = u3, t4.generatedMessage = !r4, Object.defineProperty(l(t4), "name", { value: "AssertionError [ERR_ASSERTION]", enumerable: false, writable: true, configurable: true }), t4.code = "ERR_ASSERTION", t4.actual = a3, t4.expected = s2, t4.operator = o3, Error.captureStackTrace && Error.captureStackTrace(l(t4), i2), t4.stack, t4.name = "AssertionError", c(t4);
          }
          return a2 = b2, (u2 = [{ key: "toString", value: function() {
            return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
          } }, { key: t3, value: function(e4, t4) {
            return g(this, i(i({}, t4), {}, { customInspect: false, depth: 0 }));
          } }]) && s(a2.prototype, u2), f2 && s(a2, f2), Object.defineProperty(a2, "prototype", { writable: false }), b2;
        })(f(Error), g.custom);
        e2.exports = P;
      }, 4035: (e2, t2, r2) => {
        "use strict";
        var n, o = r2(6556), i = r2(9092)(), a = r2(9957), s = r2(5795);
        if (i) {
          var u = o("RegExp.prototype.exec"), c = {}, l = function() {
            throw c;
          }, f = { toString: l, valueOf: l };
          "symbol" == typeof Symbol.toPrimitive && (f[Symbol.toPrimitive] = l), n = function(e3) {
            if (!e3 || "object" != typeof e3) return false;
            var t3 = s(e3, "lastIndex");
            if (!(t3 && a(t3, "value"))) return false;
            try {
              u(e3, f);
            } catch (e4) {
              return e4 === c;
            }
          };
        } else {
          var p = o("Object.prototype.toString");
          n = function(e3) {
            return !(!e3 || "object" != typeof e3 && "function" != typeof e3) && "[object RegExp]" === p(e3);
          };
        }
        e2.exports = n;
      }, 4039: (e2, t2, r2) => {
        "use strict";
        var n = "undefined" != typeof Symbol && Symbol, o = r2(1333);
        e2.exports = function() {
          return "function" == typeof n && ("function" == typeof Symbol && ("symbol" == typeof n("foo") && ("symbol" == typeof Symbol("bar") && o())));
        };
      }, 4107: (e2, t2, r2) => {
        "use strict";
        var n = r2(6698), o = r2(392), i = r2(2861).Buffer, a = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], s = new Array(64);
        function u() {
          this.init(), this._w = s, o.call(this, 64, 56);
        }
        function c(e3, t3, r3) {
          return r3 ^ e3 & (t3 ^ r3);
        }
        function l(e3, t3, r3) {
          return e3 & t3 | r3 & (e3 | t3);
        }
        function f(e3) {
          return (e3 >>> 2 | e3 << 30) ^ (e3 >>> 13 | e3 << 19) ^ (e3 >>> 22 | e3 << 10);
        }
        function p(e3) {
          return (e3 >>> 6 | e3 << 26) ^ (e3 >>> 11 | e3 << 21) ^ (e3 >>> 25 | e3 << 7);
        }
        function d(e3) {
          return (e3 >>> 7 | e3 << 25) ^ (e3 >>> 18 | e3 << 14) ^ e3 >>> 3;
        }
        function h(e3) {
          return (e3 >>> 17 | e3 << 15) ^ (e3 >>> 19 | e3 << 13) ^ e3 >>> 10;
        }
        n(u, o), u.prototype.init = function() {
          return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
        }, u.prototype._update = function(e3) {
          for (var t3 = this._w, r3 = 0 | this._a, n2 = 0 | this._b, o2 = 0 | this._c, i2 = 0 | this._d, s2 = 0 | this._e, u2 = 0 | this._f, y = 0 | this._g, m = 0 | this._h, g = 0; g < 16; ++g) t3[g] = e3.readInt32BE(4 * g);
          for (; g < 64; ++g) t3[g] = h(t3[g - 2]) + t3[g - 7] + d(t3[g - 15]) + t3[g - 16] | 0;
          for (var v = 0; v < 64; ++v) {
            var b = m + p(s2) + c(s2, u2, y) + a[v] + t3[v] | 0, w = f(r3) + l(r3, n2, o2) | 0;
            m = y, y = u2, u2 = s2, s2 = i2 + b | 0, i2 = o2, o2 = n2, n2 = r3, r3 = b + w | 0;
          }
          this._a = r3 + this._a | 0, this._b = n2 + this._b | 0, this._c = o2 + this._c | 0, this._d = i2 + this._d | 0, this._e = s2 + this._e | 0, this._f = u2 + this._f | 0, this._g = y + this._g | 0, this._h = m + this._h | 0;
        }, u.prototype._hash = function() {
          var e3 = i.allocUnsafe(32);
          return e3.writeInt32BE(this._a, 0), e3.writeInt32BE(this._b, 4), e3.writeInt32BE(this._c, 8), e3.writeInt32BE(this._d, 12), e3.writeInt32BE(this._e, 16), e3.writeInt32BE(this._f, 20), e3.writeInt32BE(this._g, 24), e3.writeInt32BE(this._h, 28), e3;
        }, e2.exports = u;
      }, 4133: (e2, t2, r2) => {
        "use strict";
        var n = r2(487), o = r2(8452), i = r2(3003), a = r2(6642), s = r2(2464), u = n(a(), Number);
        o(u, { getPolyfill: a, implementation: i, shim: s }), e2.exports = u;
      }, 4148: (e2, t2, r2) => {
        "use strict";
        var n = r2(5606), o = r2(6763);
        function i(e3) {
          return i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, i(e3);
        }
        function a(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, u(n2.key), n2);
          }
        }
        function s(e3, t3, r3) {
          return t3 && a(e3.prototype, t3), r3 && a(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
        }
        function u(e3) {
          var t3 = (function(e4, t4) {
            if ("object" !== i(e4) || null === e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n2 = r3.call(e4, t4 || "default");
              if ("object" !== i(n2)) return n2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" === i(t3) ? t3 : String(t3);
        }
        var c, l, f = r2(9597).codes, p = f.ERR_AMBIGUOUS_ARGUMENT, d = f.ERR_INVALID_ARG_TYPE, h = f.ERR_INVALID_ARG_VALUE, y = f.ERR_INVALID_RETURN_VALUE, m = f.ERR_MISSING_ARGS, g = r2(3918), v = r2(537).inspect, b = r2(537).types, w = b.isPromise, S = b.isRegExp, E = r2(9133)(), k = r2(9394)(), A = r2(8075)("RegExp.prototype.test");
        /* @__PURE__ */ new Map();
        function T() {
          var e3 = r2(2299);
          c = e3.isDeepEqual, l = e3.isDeepStrictEqual;
        }
        var O = false, x = e2.exports = C, P = {};
        function B(e3) {
          if (e3.message instanceof Error) throw e3.message;
          throw new g(e3);
        }
        function I(e3, t3, r3, n2) {
          if (!r3) {
            var o2 = false;
            if (0 === t3) o2 = true, n2 = "No value argument passed to `assert.ok()`";
            else if (n2 instanceof Error) throw n2;
            var i2 = new g({ actual: r3, expected: true, message: n2, operator: "==", stackStartFn: e3 });
            throw i2.generatedMessage = o2, i2;
          }
        }
        function C() {
          for (var e3 = arguments.length, t3 = new Array(e3), r3 = 0; r3 < e3; r3++) t3[r3] = arguments[r3];
          I.apply(void 0, [C, t3.length].concat(t3));
        }
        x.fail = function e3(t3, r3, i2, a2, s2) {
          var u2, c2 = arguments.length;
          if (0 === c2) u2 = "Failed";
          else if (1 === c2) i2 = t3, t3 = void 0;
          else {
            if (false === O) O = true, (n.emitWarning ? n.emitWarning : o.warn.bind(o))("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", "DeprecationWarning", "DEP0094");
            2 === c2 && (a2 = "!=");
          }
          if (i2 instanceof Error) throw i2;
          var l2 = { actual: t3, expected: r3, operator: void 0 === a2 ? "fail" : a2, stackStartFn: s2 || e3 };
          void 0 !== i2 && (l2.message = i2);
          var f2 = new g(l2);
          throw u2 && (f2.message = u2, f2.generatedMessage = true), f2;
        }, x.AssertionError = g, x.ok = C, x.equal = function e3(t3, r3, n2) {
          if (arguments.length < 2) throw new m("actual", "expected");
          t3 != r3 && B({ actual: t3, expected: r3, message: n2, operator: "==", stackStartFn: e3 });
        }, x.notEqual = function e3(t3, r3, n2) {
          if (arguments.length < 2) throw new m("actual", "expected");
          t3 == r3 && B({ actual: t3, expected: r3, message: n2, operator: "!=", stackStartFn: e3 });
        }, x.deepEqual = function e3(t3, r3, n2) {
          if (arguments.length < 2) throw new m("actual", "expected");
          void 0 === c && T(), c(t3, r3) || B({ actual: t3, expected: r3, message: n2, operator: "deepEqual", stackStartFn: e3 });
        }, x.notDeepEqual = function e3(t3, r3, n2) {
          if (arguments.length < 2) throw new m("actual", "expected");
          void 0 === c && T(), c(t3, r3) && B({ actual: t3, expected: r3, message: n2, operator: "notDeepEqual", stackStartFn: e3 });
        }, x.deepStrictEqual = function e3(t3, r3, n2) {
          if (arguments.length < 2) throw new m("actual", "expected");
          void 0 === c && T(), l(t3, r3) || B({ actual: t3, expected: r3, message: n2, operator: "deepStrictEqual", stackStartFn: e3 });
        }, x.notDeepStrictEqual = function e3(t3, r3, n2) {
          if (arguments.length < 2) throw new m("actual", "expected");
          void 0 === c && T();
          l(t3, r3) && B({ actual: t3, expected: r3, message: n2, operator: "notDeepStrictEqual", stackStartFn: e3 });
        }, x.strictEqual = function e3(t3, r3, n2) {
          if (arguments.length < 2) throw new m("actual", "expected");
          k(t3, r3) || B({ actual: t3, expected: r3, message: n2, operator: "strictEqual", stackStartFn: e3 });
        }, x.notStrictEqual = function e3(t3, r3, n2) {
          if (arguments.length < 2) throw new m("actual", "expected");
          k(t3, r3) && B({ actual: t3, expected: r3, message: n2, operator: "notStrictEqual", stackStartFn: e3 });
        };
        var R = s(function e3(t3, r3, n2) {
          var o2 = this;
          !(function(e4, t4) {
            if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
          })(this, e3), r3.forEach(function(e4) {
            e4 in t3 && (void 0 !== n2 && "string" == typeof n2[e4] && S(t3[e4]) && A(t3[e4], n2[e4]) ? o2[e4] = n2[e4] : o2[e4] = t3[e4]);
          });
        });
        function _(e3, t3, r3, n2) {
          if ("function" != typeof t3) {
            if (S(t3)) return A(t3, e3);
            if (2 === arguments.length) throw new d("expected", ["Function", "RegExp"], t3);
            if ("object" !== i(e3) || null === e3) {
              var o2 = new g({ actual: e3, expected: t3, message: r3, operator: "deepStrictEqual", stackStartFn: n2 });
              throw o2.operator = n2.name, o2;
            }
            var a2 = Object.keys(t3);
            if (t3 instanceof Error) a2.push("name", "message");
            else if (0 === a2.length) throw new h("error", t3, "may not be an empty object");
            return void 0 === c && T(), a2.forEach(function(o3) {
              "string" == typeof e3[o3] && S(t3[o3]) && A(t3[o3], e3[o3]) || (function(e4, t4, r4, n3, o4, i2) {
                if (!(r4 in e4) || !l(e4[r4], t4[r4])) {
                  if (!n3) {
                    var a3 = new R(e4, o4), s2 = new R(t4, o4, e4), u2 = new g({ actual: a3, expected: s2, operator: "deepStrictEqual", stackStartFn: i2 });
                    throw u2.actual = e4, u2.expected = t4, u2.operator = i2.name, u2;
                  }
                  B({ actual: e4, expected: t4, message: n3, operator: i2.name, stackStartFn: i2 });
                }
              })(e3, t3, o3, r3, a2, n2);
            }), true;
          }
          return void 0 !== t3.prototype && e3 instanceof t3 || !Error.isPrototypeOf(t3) && true === t3.call({}, e3);
        }
        function U(e3) {
          if ("function" != typeof e3) throw new d("fn", "Function", e3);
          try {
            e3();
          } catch (e4) {
            return e4;
          }
          return P;
        }
        function N(e3) {
          return w(e3) || null !== e3 && "object" === i(e3) && "function" == typeof e3.then && "function" == typeof e3.catch;
        }
        function L(e3) {
          return Promise.resolve().then(function() {
            var t3;
            if ("function" == typeof e3) {
              if (!N(t3 = e3())) throw new y("instance of Promise", "promiseFn", t3);
            } else {
              if (!N(e3)) throw new d("promiseFn", ["Function", "Promise"], e3);
              t3 = e3;
            }
            return Promise.resolve().then(function() {
              return t3;
            }).then(function() {
              return P;
            }).catch(function(e4) {
              return e4;
            });
          });
        }
        function F(e3, t3, r3, n2) {
          if ("string" == typeof r3) {
            if (4 === arguments.length) throw new d("error", ["Object", "Error", "Function", "RegExp"], r3);
            if ("object" === i(t3) && null !== t3) {
              if (t3.message === r3) throw new p("error/message", 'The error message "'.concat(t3.message, '" is identical to the message.'));
            } else if (t3 === r3) throw new p("error/message", 'The error "'.concat(t3, '" is identical to the message.'));
            n2 = r3, r3 = void 0;
          } else if (null != r3 && "object" !== i(r3) && "function" != typeof r3) throw new d("error", ["Object", "Error", "Function", "RegExp"], r3);
          if (t3 === P) {
            var o2 = "";
            r3 && r3.name && (o2 += " (".concat(r3.name, ")")), o2 += n2 ? ": ".concat(n2) : ".";
            var a2 = "rejects" === e3.name ? "rejection" : "exception";
            B({ actual: void 0, expected: r3, operator: e3.name, message: "Missing expected ".concat(a2).concat(o2), stackStartFn: e3 });
          }
          if (r3 && !_(t3, r3, n2, e3)) throw t3;
        }
        function j(e3, t3, r3, n2) {
          if (t3 !== P) {
            if ("string" == typeof r3 && (n2 = r3, r3 = void 0), !r3 || _(t3, r3)) {
              var o2 = n2 ? ": ".concat(n2) : ".", i2 = "doesNotReject" === e3.name ? "rejection" : "exception";
              B({ actual: t3, expected: r3, operator: e3.name, message: "Got unwanted ".concat(i2).concat(o2, "\n") + 'Actual message: "'.concat(t3 && t3.message, '"'), stackStartFn: e3 });
            }
            throw t3;
          }
        }
        function M(e3, t3, r3, n2, o2) {
          if (!S(t3)) throw new d("regexp", "RegExp", t3);
          var a2 = "match" === o2;
          if ("string" != typeof e3 || A(t3, e3) !== a2) {
            if (r3 instanceof Error) throw r3;
            var s2 = !r3;
            r3 = r3 || ("string" != typeof e3 ? 'The "string" argument must be of type string. Received type ' + "".concat(i(e3), " (").concat(v(e3), ")") : (a2 ? "The input did not match the regular expression " : "The input was expected to not match the regular expression ") + "".concat(v(t3), ". Input:\n\n").concat(v(e3), "\n"));
            var u2 = new g({ actual: e3, expected: t3, message: r3, operator: o2, stackStartFn: n2 });
            throw u2.generatedMessage = s2, u2;
          }
        }
        function D() {
          for (var e3 = arguments.length, t3 = new Array(e3), r3 = 0; r3 < e3; r3++) t3[r3] = arguments[r3];
          I.apply(void 0, [D, t3.length].concat(t3));
        }
        x.throws = function e3(t3) {
          for (var r3 = arguments.length, n2 = new Array(r3 > 1 ? r3 - 1 : 0), o2 = 1; o2 < r3; o2++) n2[o2 - 1] = arguments[o2];
          F.apply(void 0, [e3, U(t3)].concat(n2));
        }, x.rejects = function e3(t3) {
          for (var r3 = arguments.length, n2 = new Array(r3 > 1 ? r3 - 1 : 0), o2 = 1; o2 < r3; o2++) n2[o2 - 1] = arguments[o2];
          return L(t3).then(function(t4) {
            return F.apply(void 0, [e3, t4].concat(n2));
          });
        }, x.doesNotThrow = function e3(t3) {
          for (var r3 = arguments.length, n2 = new Array(r3 > 1 ? r3 - 1 : 0), o2 = 1; o2 < r3; o2++) n2[o2 - 1] = arguments[o2];
          j.apply(void 0, [e3, U(t3)].concat(n2));
        }, x.doesNotReject = function e3(t3) {
          for (var r3 = arguments.length, n2 = new Array(r3 > 1 ? r3 - 1 : 0), o2 = 1; o2 < r3; o2++) n2[o2 - 1] = arguments[o2];
          return L(t3).then(function(t4) {
            return j.apply(void 0, [e3, t4].concat(n2));
          });
        }, x.ifError = function e3(t3) {
          if (null != t3) {
            var r3 = "ifError got unwanted exception: ";
            "object" === i(t3) && "string" == typeof t3.message ? 0 === t3.message.length && t3.constructor ? r3 += t3.constructor.name : r3 += t3.message : r3 += v(t3);
            var n2 = new g({ actual: t3, expected: null, operator: "ifError", message: r3, stackStartFn: e3 }), o2 = t3.stack;
            if ("string" == typeof o2) {
              var a2 = o2.split("\n");
              a2.shift();
              for (var s2 = n2.stack.split("\n"), u2 = 0; u2 < a2.length; u2++) {
                var c2 = s2.indexOf(a2[u2]);
                if (-1 !== c2) {
                  s2 = s2.slice(0, c2);
                  break;
                }
              }
              n2.stack = "".concat(s2.join("\n"), "\n").concat(a2.join("\n"));
            }
            throw n2;
          }
        }, x.match = function e3(t3, r3, n2) {
          M(t3, r3, n2, e3, "match");
        }, x.doesNotMatch = function e3(t3, r3, n2) {
          M(t3, r3, n2, e3, "doesNotMatch");
        }, x.strict = E(D, x, { equal: x.strictEqual, deepEqual: x.deepStrictEqual, notEqual: x.notStrictEqual, notDeepEqual: x.notDeepStrictEqual }), x.strict.strict = x.strict;
      }, 4372: (e2, t2, r2) => {
        "use strict";
        var n = r2(9675), o = r2(6556)("TypedArray.prototype.buffer", true), i = r2(5680);
        e2.exports = o || function(e3) {
          if (!i(e3)) throw new n("Not a Typed Array");
          return e3.buffer;
        };
      }, 4459: (e2) => {
        "use strict";
        e2.exports = Number.isNaN || function(e3) {
          return e3 != e3;
        };
      }, 4634: (e2) => {
        var t2 = {}.toString;
        e2.exports = Array.isArray || function(e3) {
          return "[object Array]" == t2.call(e3);
        };
      }, 5345: (e2) => {
        "use strict";
        e2.exports = URIError;
      }, 5360: (e2, t2) => {
        "use strict";
        var r2 = function(e3, t3) {
          return t3 || (t3 = {}), e3.split("").forEach(function(e4, r3) {
            e4 in t3 || (t3[e4] = r3);
          }), t3;
        }, n = { alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", charmap: { 0: 14, 1: 8 } };
        n.charmap = r2(n.alphabet, n.charmap);
        var o = { alphabet: "0123456789ABCDEFGHJKMNPQRSTVWXYZ", charmap: { O: 0, I: 1, L: 1 } };
        o.charmap = r2(o.alphabet, o.charmap);
        var i = { alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV", charmap: {} };
        function a(e3) {
          if (this.buf = [], this.shift = 8, this.carry = 0, e3) {
            switch (e3.type) {
              case "rfc4648":
                this.charmap = t2.rfc4648.charmap;
                break;
              case "crockford":
                this.charmap = t2.crockford.charmap;
                break;
              case "base32hex":
                this.charmap = t2.base32hex.charmap;
                break;
              default:
                throw new Error("invalid type");
            }
            e3.charmap && (this.charmap = e3.charmap);
          }
        }
        function s(e3) {
          if (this.buf = "", this.shift = 3, this.carry = 0, e3) {
            switch (e3.type) {
              case "rfc4648":
                this.alphabet = t2.rfc4648.alphabet;
                break;
              case "crockford":
                this.alphabet = t2.crockford.alphabet;
                break;
              case "base32hex":
                this.alphabet = t2.base32hex.alphabet;
                break;
              default:
                throw new Error("invalid type");
            }
            e3.alphabet ? this.alphabet = e3.alphabet : e3.lc && (this.alphabet = this.alphabet.toLowerCase());
          }
        }
        i.charmap = r2(i.alphabet, i.charmap), a.prototype.charmap = n.charmap, a.prototype.write = function(e3) {
          var t3 = this.charmap, r3 = this.buf, n2 = this.shift, o2 = this.carry;
          return e3.toUpperCase().split("").forEach(function(e4) {
            if ("=" != e4) {
              var i2 = 255 & t3[e4];
              (n2 -= 5) > 0 ? o2 |= i2 << n2 : n2 < 0 ? (r3.push(o2 | i2 >> -n2), o2 = i2 << (n2 += 8) & 255) : (r3.push(o2 | i2), n2 = 8, o2 = 0);
            }
          }), this.shift = n2, this.carry = o2, this;
        }, a.prototype.finalize = function(e3) {
          return e3 && this.write(e3), 8 !== this.shift && 0 !== this.carry && (this.buf.push(this.carry), this.shift = 8, this.carry = 0), this.buf;
        }, s.prototype.alphabet = n.alphabet, s.prototype.write = function(e3) {
          var t3, r3, n2, o2 = this.shift, i2 = this.carry;
          for (n2 = 0; n2 < e3.length; n2++) t3 = i2 | (r3 = e3[n2]) >> o2, this.buf += this.alphabet[31 & t3], o2 > 5 && (t3 = r3 >> (o2 -= 5), this.buf += this.alphabet[31 & t3]), i2 = r3 << (o2 = 5 - o2), o2 = 8 - o2;
          return this.shift = o2, this.carry = i2, this;
        }, s.prototype.finalize = function(e3) {
          return e3 && this.write(e3), 3 !== this.shift && (this.buf += this.alphabet[31 & this.carry], this.shift = 3, this.carry = 0), this.buf;
        }, t2.encode = function(e3, t3) {
          return new s(t3).finalize(e3);
        }, t2.decode = function(e3, t3) {
          return new a(t3).finalize(e3);
        }, t2.Decoder = a, t2.Encoder = s, t2.charmap = r2, t2.crockford = o, t2.rfc4648 = n, t2.base32hex = i;
      }, 5377: (e2, t2, r2) => {
        "use strict";
        var n = r2(2861).Buffer, o = r2(4634), i = r2(4372), a = ArrayBuffer.isView || function(e3) {
          try {
            return i(e3), true;
          } catch (e4) {
            return false;
          }
        }, s = "undefined" != typeof Uint8Array, u = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, c = u && (n.prototype instanceof Uint8Array || n.TYPED_ARRAY_SUPPORT);
        e2.exports = function(e3, t3) {
          if (e3 instanceof n) return e3;
          if ("string" == typeof e3) return n.from(e3, t3);
          if (u && a(e3)) {
            if (0 === e3.byteLength) return n.alloc(0);
            if (c) {
              var r3 = n.from(e3.buffer, e3.byteOffset, e3.byteLength);
              if (r3.byteLength === e3.byteLength) return r3;
            }
            var i2 = e3 instanceof Uint8Array ? e3 : new Uint8Array(e3.buffer, e3.byteOffset, e3.byteLength), l = n.from(i2);
            if (l.length === e3.byteLength) return l;
          }
          if (s && e3 instanceof Uint8Array) return n.from(e3);
          var f = o(e3);
          if (f) for (var p = 0; p < e3.length; p += 1) {
            var d = e3[p];
            if ("number" != typeof d || d < 0 || d > 255 || ~~d !== d) throw new RangeError("Array items must be numbers in the range 0-255.");
          }
          if (f || n.isBuffer(e3) && e3.constructor && "function" == typeof e3.constructor.isBuffer && e3.constructor.isBuffer(e3)) return n.from(e3);
          throw new TypeError('The "data" argument must be a string, an Array, a Buffer, a Uint8Array, or a DataView.');
        };
      }, 5606: (e2) => {
        var t2, r2, n = e2.exports = {};
        function o() {
          throw new Error("setTimeout has not been defined");
        }
        function i() {
          throw new Error("clearTimeout has not been defined");
        }
        function a(e3) {
          if (t2 === setTimeout) return setTimeout(e3, 0);
          if ((t2 === o || !t2) && setTimeout) return t2 = setTimeout, setTimeout(e3, 0);
          try {
            return t2(e3, 0);
          } catch (r3) {
            try {
              return t2.call(null, e3, 0);
            } catch (r4) {
              return t2.call(this, e3, 0);
            }
          }
        }
        !(function() {
          try {
            t2 = "function" == typeof setTimeout ? setTimeout : o;
          } catch (e3) {
            t2 = o;
          }
          try {
            r2 = "function" == typeof clearTimeout ? clearTimeout : i;
          } catch (e3) {
            r2 = i;
          }
        })();
        var s, u = [], c = false, l = -1;
        function f() {
          c && s && (c = false, s.length ? u = s.concat(u) : l = -1, u.length && p());
        }
        function p() {
          if (!c) {
            var e3 = a(f);
            c = true;
            for (var t3 = u.length; t3; ) {
              for (s = u, u = []; ++l < t3; ) s && s[l].run();
              l = -1, t3 = u.length;
            }
            s = null, c = false, (function(e4) {
              if (r2 === clearTimeout) return clearTimeout(e4);
              if ((r2 === i || !r2) && clearTimeout) return r2 = clearTimeout, clearTimeout(e4);
              try {
                return r2(e4);
              } catch (t4) {
                try {
                  return r2.call(null, e4);
                } catch (t5) {
                  return r2.call(this, e4);
                }
              }
            })(e3);
          }
        }
        function d(e3, t3) {
          this.fun = e3, this.array = t3;
        }
        function h() {
        }
        n.nextTick = function(e3) {
          var t3 = new Array(arguments.length - 1);
          if (arguments.length > 1) for (var r3 = 1; r3 < arguments.length; r3++) t3[r3 - 1] = arguments[r3];
          u.push(new d(e3, t3)), 1 !== u.length || c || a(p);
        }, d.prototype.run = function() {
          this.fun.apply(null, this.array);
        }, n.title = "browser", n.browser = true, n.env = {}, n.argv = [], n.version = "", n.versions = {}, n.on = h, n.addListener = h, n.once = h, n.off = h, n.removeListener = h, n.removeAllListeners = h, n.emit = h, n.prependListener = h, n.prependOnceListener = h, n.listeners = function(e3) {
          return [];
        }, n.binding = function(e3) {
          throw new Error("process.binding is not supported");
        }, n.cwd = function() {
          return "/";
        }, n.chdir = function(e3) {
          throw new Error("process.chdir is not supported");
        }, n.umask = function() {
          return 0;
        };
      }, 5680: (e2, t2, r2) => {
        "use strict";
        var n = r2(5767);
        e2.exports = function(e3) {
          return !!n(e3);
        };
      }, 5767: (e2, t2, r2) => {
        "use strict";
        var n = r2(2682), o = r2(9209), i = r2(487), a = r2(6556), s = r2(5795), u = r2(3628), c = a("Object.prototype.toString"), l = r2(9092)(), f = "undefined" == typeof globalThis ? r2.g : globalThis, p = o(), d = a("String.prototype.slice"), h = a("Array.prototype.indexOf", true) || function(e3, t3) {
          for (var r3 = 0; r3 < e3.length; r3 += 1) if (e3[r3] === t3) return r3;
          return -1;
        }, y = { __proto__: null };
        n(p, l && s && u ? function(e3) {
          var t3 = new f[e3]();
          if (Symbol.toStringTag in t3 && u) {
            var r3 = u(t3), n2 = s(r3, Symbol.toStringTag);
            if (!n2 && r3) {
              var o2 = u(r3);
              n2 = s(o2, Symbol.toStringTag);
            }
            y["$" + e3] = i(n2.get);
          }
        } : function(e3) {
          var t3 = new f[e3](), r3 = t3.slice || t3.set;
          r3 && (y["$" + e3] = i(r3));
        });
        e2.exports = function(e3) {
          if (!e3 || "object" != typeof e3) return false;
          if (!l) {
            var t3 = d(c(e3), 8, -1);
            return h(p, t3) > -1 ? t3 : "Object" === t3 && (function(e4) {
              var t4 = false;
              return n(y, function(r3, n2) {
                if (!t4) try {
                  r3(e4), t4 = d(n2, 1);
                } catch (e5) {
                }
              }), t4;
            })(e3);
          }
          return s ? (function(e4) {
            var t4 = false;
            return n(y, function(r3, n2) {
              if (!t4) try {
                "$" + r3(e4) === n2 && (t4 = d(n2, 1));
              } catch (e5) {
              }
            }), t4;
          })(e3) : null;
        };
      }, 5795: (e2, t2, r2) => {
        "use strict";
        var n = r2(6549);
        if (n) try {
          n([], "length");
        } catch (e3) {
          n = null;
        }
        e2.exports = n;
      }, 5880: (e2) => {
        "use strict";
        e2.exports = Math.pow;
      }, 6188: (e2) => {
        "use strict";
        e2.exports = Math.max;
      }, 6549: (e2) => {
        "use strict";
        e2.exports = Object.getOwnPropertyDescriptor;
      }, 6556: (e2, t2, r2) => {
        "use strict";
        var n = r2(453), o = r2(3126), i = o([n("%String.prototype.indexOf%")]);
        e2.exports = function(e3, t3) {
          var r3 = n(e3, !!t3);
          return "function" == typeof r3 && i(e3, ".prototype.") > -1 ? o([r3]) : r3;
        };
      }, 6576: (e2, t2, r2) => {
        "use strict";
        var n = r2(9394), o = r2(8452);
        e2.exports = function() {
          var e3 = n();
          return o(Object, { is: e3 }, { is: function() {
            return Object.is !== e3;
          } }), e3;
        };
      }, 6578: (e2) => {
        "use strict";
        e2.exports = ["Float16Array", "Float32Array", "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "BigInt64Array", "BigUint64Array"];
      }, 6642: (e2, t2, r2) => {
        "use strict";
        var n = r2(3003);
        e2.exports = function() {
          return Number.isNaN && Number.isNaN(NaN) && !Number.isNaN("a") ? Number.isNaN : n;
        };
      }, 6698: (e2) => {
        "function" == typeof Object.create ? e2.exports = function(e3, t2) {
          t2 && (e3.super_ = t2, e3.prototype = Object.create(t2.prototype, { constructor: { value: e3, enumerable: false, writable: true, configurable: true } }));
        } : e2.exports = function(e3, t2) {
          if (t2) {
            e3.super_ = t2;
            var r2 = function() {
            };
            r2.prototype = t2.prototype, e3.prototype = new r2(), e3.prototype.constructor = e3;
          }
        };
      }, 6710: (e2, t2, r2) => {
        "use strict";
        var n = r2(6698), o = r2(4107), i = r2(392), a = r2(2861).Buffer, s = new Array(64);
        function u() {
          this.init(), this._w = s, i.call(this, 64, 56);
        }
        n(u, o), u.prototype.init = function() {
          return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
        }, u.prototype._hash = function() {
          var e3 = a.allocUnsafe(28);
          return e3.writeInt32BE(this._a, 0), e3.writeInt32BE(this._b, 4), e3.writeInt32BE(this._c, 8), e3.writeInt32BE(this._d, 12), e3.writeInt32BE(this._e, 16), e3.writeInt32BE(this._f, 20), e3.writeInt32BE(this._g, 24), e3;
        }, e2.exports = u;
      }, 6743: (e2, t2, r2) => {
        "use strict";
        var n = r2(9353);
        e2.exports = Function.prototype.bind || n;
      }, 6763: (e2, t2, r2) => {
        var n = r2(537), o = r2(4148);
        function i() {
          return (/* @__PURE__ */ new Date()).getTime();
        }
        var a, s = Array.prototype.slice, u = {};
        a = void 0 !== r2.g && r2.g.console ? r2.g.console : "undefined" != typeof window && window.console ? window.console : {};
        for (var c = [[function() {
        }, "log"], [function() {
          a.log.apply(a, arguments);
        }, "info"], [function() {
          a.log.apply(a, arguments);
        }, "warn"], [function() {
          a.warn.apply(a, arguments);
        }, "error"], [function(e3) {
          u[e3] = i();
        }, "time"], [function(e3) {
          var t3 = u[e3];
          if (!t3) throw new Error("No such label: " + e3);
          delete u[e3];
          var r3 = i() - t3;
          a.log(e3 + ": " + r3 + "ms");
        }, "timeEnd"], [function() {
          var e3 = new Error();
          e3.name = "Trace", e3.message = n.format.apply(null, arguments), a.error(e3.stack);
        }, "trace"], [function(e3) {
          a.log(n.inspect(e3) + "\n");
        }, "dir"], [function(e3) {
          if (!e3) {
            var t3 = s.call(arguments, 1);
            o.ok(false, n.format.apply(null, t3));
          }
        }, "assert"]], l = 0; l < c.length; l++) {
          var f = c[l], p = f[0], d = f[1];
          a[d] || (a[d] = p);
        }
        e2.exports = a;
      }, 6897: (e2, t2, r2) => {
        "use strict";
        var n = r2(453), o = r2(41), i = r2(592)(), a = r2(5795), s = r2(9675), u = n("%Math.floor%");
        e2.exports = function(e3, t3) {
          if ("function" != typeof e3) throw new s("`fn` is not a function");
          if ("number" != typeof t3 || t3 < 0 || t3 > 4294967295 || u(t3) !== t3) throw new s("`length` must be a positive 32-bit integer");
          var r3 = arguments.length > 2 && !!arguments[2], n2 = true, c = true;
          if ("length" in e3 && a) {
            var l = a(e3, "length");
            l && !l.configurable && (n2 = false), l && !l.writable && (c = false);
          }
          return (n2 || c || !r3) && (i ? o(e3, "length", t3, true, true) : o(e3, "length", t3)), e3;
        };
      }, 7119: (e2) => {
        "use strict";
        e2.exports = "undefined" != typeof Reflect && Reflect && Reflect.apply;
      }, 7176: (e2, t2, r2) => {
        "use strict";
        var n, o = r2(3126), i = r2(5795);
        try {
          n = [].__proto__ === Array.prototype;
        } catch (e3) {
          if (!e3 || "object" != typeof e3 || !("code" in e3) || "ERR_PROTO_ACCESS" !== e3.code) throw e3;
        }
        var a = !!n && i && i(Object.prototype, "__proto__"), s = Object, u = s.getPrototypeOf;
        e2.exports = a && "function" == typeof a.get ? o([a.get]) : "function" == typeof u && function(e3) {
          return u(null == e3 ? e3 : s(e3));
        };
      }, 7244: (e2, t2, r2) => {
        "use strict";
        var n = r2(9092)(), o = r2(6556)("Object.prototype.toString"), i = function(e3) {
          return !(n && e3 && "object" == typeof e3 && Symbol.toStringTag in e3) && "[object Arguments]" === o(e3);
        }, a = function(e3) {
          return !!i(e3) || null !== e3 && "object" == typeof e3 && "length" in e3 && "number" == typeof e3.length && e3.length >= 0 && "[object Array]" !== o(e3) && "callee" in e3 && "[object Function]" === o(e3.callee);
        }, s = (function() {
          return i(arguments);
        })();
        i.isLegacyArguments = a, e2.exports = s ? i : a;
      }, 7526: (e2, t2) => {
        "use strict";
        t2.byteLength = function(e3) {
          var t3 = s(e3), r3 = t3[0], n2 = t3[1];
          return 3 * (r3 + n2) / 4 - n2;
        }, t2.toByteArray = function(e3) {
          var t3, r3, i2 = s(e3), a2 = i2[0], u2 = i2[1], c2 = new o((function(e4, t4, r4) {
            return 3 * (t4 + r4) / 4 - r4;
          })(0, a2, u2)), l = 0, f = u2 > 0 ? a2 - 4 : a2;
          for (r3 = 0; r3 < f; r3 += 4) t3 = n[e3.charCodeAt(r3)] << 18 | n[e3.charCodeAt(r3 + 1)] << 12 | n[e3.charCodeAt(r3 + 2)] << 6 | n[e3.charCodeAt(r3 + 3)], c2[l++] = t3 >> 16 & 255, c2[l++] = t3 >> 8 & 255, c2[l++] = 255 & t3;
          2 === u2 && (t3 = n[e3.charCodeAt(r3)] << 2 | n[e3.charCodeAt(r3 + 1)] >> 4, c2[l++] = 255 & t3);
          1 === u2 && (t3 = n[e3.charCodeAt(r3)] << 10 | n[e3.charCodeAt(r3 + 1)] << 4 | n[e3.charCodeAt(r3 + 2)] >> 2, c2[l++] = t3 >> 8 & 255, c2[l++] = 255 & t3);
          return c2;
        }, t2.fromByteArray = function(e3) {
          for (var t3, n2 = e3.length, o2 = n2 % 3, i2 = [], a2 = 16383, s2 = 0, u2 = n2 - o2; s2 < u2; s2 += a2) i2.push(c(e3, s2, s2 + a2 > u2 ? u2 : s2 + a2));
          1 === o2 ? (t3 = e3[n2 - 1], i2.push(r2[t3 >> 2] + r2[t3 << 4 & 63] + "==")) : 2 === o2 && (t3 = (e3[n2 - 2] << 8) + e3[n2 - 1], i2.push(r2[t3 >> 10] + r2[t3 >> 4 & 63] + r2[t3 << 2 & 63] + "="));
          return i2.join("");
        };
        for (var r2 = [], n = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0; a < 64; ++a) r2[a] = i[a], n[i.charCodeAt(a)] = a;
        function s(e3) {
          var t3 = e3.length;
          if (t3 % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
          var r3 = e3.indexOf("=");
          return -1 === r3 && (r3 = t3), [r3, r3 === t3 ? 0 : 4 - r3 % 4];
        }
        function u(e3) {
          return r2[e3 >> 18 & 63] + r2[e3 >> 12 & 63] + r2[e3 >> 6 & 63] + r2[63 & e3];
        }
        function c(e3, t3, r3) {
          for (var n2, o2 = [], i2 = t3; i2 < r3; i2 += 3) n2 = (e3[i2] << 16 & 16711680) + (e3[i2 + 1] << 8 & 65280) + (255 & e3[i2 + 2]), o2.push(u(n2));
          return o2.join("");
        }
        n["-".charCodeAt(0)] = 62, n["_".charCodeAt(0)] = 63;
      }, 7653: (e2, t2, r2) => {
        "use strict";
        var n = r2(8452), o = r2(487), i = r2(9211), a = r2(9394), s = r2(6576), u = o(a(), Object);
        n(u, { getPolyfill: a, implementation: i, shim: s }), e2.exports = u;
      }, 7816: (e2, t2, r2) => {
        "use strict";
        var n = r2(6698), o = r2(392), i = r2(2861).Buffer, a = [1518500249, 1859775393, -1894007588, -899497514], s = new Array(80);
        function u() {
          this.init(), this._w = s, o.call(this, 64, 56);
        }
        function c(e3) {
          return e3 << 5 | e3 >>> 27;
        }
        function l(e3) {
          return e3 << 30 | e3 >>> 2;
        }
        function f(e3, t3, r3, n2) {
          return 0 === e3 ? t3 & r3 | ~t3 & n2 : 2 === e3 ? t3 & r3 | t3 & n2 | r3 & n2 : t3 ^ r3 ^ n2;
        }
        n(u, o), u.prototype.init = function() {
          return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
        }, u.prototype._update = function(e3) {
          for (var t3 = this._w, r3 = 0 | this._a, n2 = 0 | this._b, o2 = 0 | this._c, i2 = 0 | this._d, s2 = 0 | this._e, u2 = 0; u2 < 16; ++u2) t3[u2] = e3.readInt32BE(4 * u2);
          for (; u2 < 80; ++u2) t3[u2] = t3[u2 - 3] ^ t3[u2 - 8] ^ t3[u2 - 14] ^ t3[u2 - 16];
          for (var p = 0; p < 80; ++p) {
            var d = ~~(p / 20), h = c(r3) + f(d, n2, o2, i2) + s2 + t3[p] + a[d] | 0;
            s2 = i2, i2 = o2, o2 = l(n2), n2 = r3, r3 = h;
          }
          this._a = r3 + this._a | 0, this._b = n2 + this._b | 0, this._c = o2 + this._c | 0, this._d = i2 + this._d | 0, this._e = s2 + this._e | 0;
        }, u.prototype._hash = function() {
          var e3 = i.allocUnsafe(20);
          return e3.writeInt32BE(0 | this._a, 0), e3.writeInt32BE(0 | this._b, 4), e3.writeInt32BE(0 | this._c, 8), e3.writeInt32BE(0 | this._d, 12), e3.writeInt32BE(0 | this._e, 16), e3;
        }, e2.exports = u;
      }, 8002: (e2) => {
        "use strict";
        e2.exports = Math.min;
      }, 8068: (e2) => {
        "use strict";
        e2.exports = SyntaxError;
      }, 8075: (e2, t2, r2) => {
        "use strict";
        var n = r2(453), o = r2(487), i = o(n("String.prototype.indexOf"));
        e2.exports = function(e3, t3) {
          var r3 = n(e3, !!t3);
          return "function" == typeof r3 && i(e3, ".prototype.") > -1 ? o(r3) : r3;
        };
      }, 8184: (e2, t2, r2) => {
        "use strict";
        var n, o = r2(6556), i = r2(9721)(/^\s*(?:function)?\*/), a = r2(9092)(), s = r2(3628), u = o("Object.prototype.toString"), c = o("Function.prototype.toString");
        e2.exports = function(e3) {
          if ("function" != typeof e3) return false;
          if (i(c(e3))) return true;
          if (!a) return "[object GeneratorFunction]" === u(e3);
          if (!s) return false;
          if (void 0 === n) {
            var t3 = (function() {
              if (!a) return false;
              try {
                return Function("return function*() {}")();
              } catch (e4) {
              }
            })();
            n = !!t3 && s(t3);
          }
          return s(e3) === n;
        };
      }, 8287: (e2, t2, r2) => {
        "use strict";
        var n = r2(6763);
        const o = r2(7526), i = r2(251), a = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
        t2.Buffer = c, t2.SlowBuffer = function(e3) {
          +e3 != e3 && (e3 = 0);
          return c.alloc(+e3);
        }, t2.INSPECT_MAX_BYTES = 50;
        const s = 2147483647;
        function u(e3) {
          if (e3 > s) throw new RangeError('The value "' + e3 + '" is invalid for option "size"');
          const t3 = new Uint8Array(e3);
          return Object.setPrototypeOf(t3, c.prototype), t3;
        }
        function c(e3, t3, r3) {
          if ("number" == typeof e3) {
            if ("string" == typeof t3) throw new TypeError('The "string" argument must be of type string. Received type number');
            return p(e3);
          }
          return l(e3, t3, r3);
        }
        function l(e3, t3, r3) {
          if ("string" == typeof e3) return (function(e4, t4) {
            "string" == typeof t4 && "" !== t4 || (t4 = "utf8");
            if (!c.isEncoding(t4)) throw new TypeError("Unknown encoding: " + t4);
            const r4 = 0 | m(e4, t4);
            let n3 = u(r4);
            const o3 = n3.write(e4, t4);
            o3 !== r4 && (n3 = n3.slice(0, o3));
            return n3;
          })(e3, t3);
          if (ArrayBuffer.isView(e3)) return (function(e4) {
            if (Y(e4, Uint8Array)) {
              const t4 = new Uint8Array(e4);
              return h(t4.buffer, t4.byteOffset, t4.byteLength);
            }
            return d(e4);
          })(e3);
          if (null == e3) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e3);
          if (Y(e3, ArrayBuffer) || e3 && Y(e3.buffer, ArrayBuffer)) return h(e3, t3, r3);
          if ("undefined" != typeof SharedArrayBuffer && (Y(e3, SharedArrayBuffer) || e3 && Y(e3.buffer, SharedArrayBuffer))) return h(e3, t3, r3);
          if ("number" == typeof e3) throw new TypeError('The "value" argument must not be of type number. Received type number');
          const n2 = e3.valueOf && e3.valueOf();
          if (null != n2 && n2 !== e3) return c.from(n2, t3, r3);
          const o2 = (function(e4) {
            if (c.isBuffer(e4)) {
              const t4 = 0 | y(e4.length), r4 = u(t4);
              return 0 === r4.length || e4.copy(r4, 0, 0, t4), r4;
            }
            if (void 0 !== e4.length) return "number" != typeof e4.length || Z(e4.length) ? u(0) : d(e4);
            if ("Buffer" === e4.type && Array.isArray(e4.data)) return d(e4.data);
          })(e3);
          if (o2) return o2;
          if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e3[Symbol.toPrimitive]) return c.from(e3[Symbol.toPrimitive]("string"), t3, r3);
          throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e3);
        }
        function f(e3) {
          if ("number" != typeof e3) throw new TypeError('"size" argument must be of type number');
          if (e3 < 0) throw new RangeError('The value "' + e3 + '" is invalid for option "size"');
        }
        function p(e3) {
          return f(e3), u(e3 < 0 ? 0 : 0 | y(e3));
        }
        function d(e3) {
          const t3 = e3.length < 0 ? 0 : 0 | y(e3.length), r3 = u(t3);
          for (let n2 = 0; n2 < t3; n2 += 1) r3[n2] = 255 & e3[n2];
          return r3;
        }
        function h(e3, t3, r3) {
          if (t3 < 0 || e3.byteLength < t3) throw new RangeError('"offset" is outside of buffer bounds');
          if (e3.byteLength < t3 + (r3 || 0)) throw new RangeError('"length" is outside of buffer bounds');
          let n2;
          return n2 = void 0 === t3 && void 0 === r3 ? new Uint8Array(e3) : void 0 === r3 ? new Uint8Array(e3, t3) : new Uint8Array(e3, t3, r3), Object.setPrototypeOf(n2, c.prototype), n2;
        }
        function y(e3) {
          if (e3 >= s) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s.toString(16) + " bytes");
          return 0 | e3;
        }
        function m(e3, t3) {
          if (c.isBuffer(e3)) return e3.length;
          if (ArrayBuffer.isView(e3) || Y(e3, ArrayBuffer)) return e3.byteLength;
          if ("string" != typeof e3) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e3);
          const r3 = e3.length, n2 = arguments.length > 2 && true === arguments[2];
          if (!n2 && 0 === r3) return 0;
          let o2 = false;
          for (; ; ) switch (t3) {
            case "ascii":
            case "latin1":
            case "binary":
              return r3;
            case "utf8":
            case "utf-8":
              return $(e3).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return 2 * r3;
            case "hex":
              return r3 >>> 1;
            case "base64":
              return G(e3).length;
            default:
              if (o2) return n2 ? -1 : $(e3).length;
              t3 = ("" + t3).toLowerCase(), o2 = true;
          }
        }
        function g(e3, t3, r3) {
          let n2 = false;
          if ((void 0 === t3 || t3 < 0) && (t3 = 0), t3 > this.length) return "";
          if ((void 0 === r3 || r3 > this.length) && (r3 = this.length), r3 <= 0) return "";
          if ((r3 >>>= 0) <= (t3 >>>= 0)) return "";
          for (e3 || (e3 = "utf8"); ; ) switch (e3) {
            case "hex":
              return C(this, t3, r3);
            case "utf8":
            case "utf-8":
              return x(this, t3, r3);
            case "ascii":
              return B(this, t3, r3);
            case "latin1":
            case "binary":
              return I(this, t3, r3);
            case "base64":
              return O(this, t3, r3);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return R(this, t3, r3);
            default:
              if (n2) throw new TypeError("Unknown encoding: " + e3);
              e3 = (e3 + "").toLowerCase(), n2 = true;
          }
        }
        function v(e3, t3, r3) {
          const n2 = e3[t3];
          e3[t3] = e3[r3], e3[r3] = n2;
        }
        function b(e3, t3, r3, n2, o2) {
          if (0 === e3.length) return -1;
          if ("string" == typeof r3 ? (n2 = r3, r3 = 0) : r3 > 2147483647 ? r3 = 2147483647 : r3 < -2147483648 && (r3 = -2147483648), Z(r3 = +r3) && (r3 = o2 ? 0 : e3.length - 1), r3 < 0 && (r3 = e3.length + r3), r3 >= e3.length) {
            if (o2) return -1;
            r3 = e3.length - 1;
          } else if (r3 < 0) {
            if (!o2) return -1;
            r3 = 0;
          }
          if ("string" == typeof t3 && (t3 = c.from(t3, n2)), c.isBuffer(t3)) return 0 === t3.length ? -1 : w(e3, t3, r3, n2, o2);
          if ("number" == typeof t3) return t3 &= 255, "function" == typeof Uint8Array.prototype.indexOf ? o2 ? Uint8Array.prototype.indexOf.call(e3, t3, r3) : Uint8Array.prototype.lastIndexOf.call(e3, t3, r3) : w(e3, [t3], r3, n2, o2);
          throw new TypeError("val must be string, number or Buffer");
        }
        function w(e3, t3, r3, n2, o2) {
          let i2, a2 = 1, s2 = e3.length, u2 = t3.length;
          if (void 0 !== n2 && ("ucs2" === (n2 = String(n2).toLowerCase()) || "ucs-2" === n2 || "utf16le" === n2 || "utf-16le" === n2)) {
            if (e3.length < 2 || t3.length < 2) return -1;
            a2 = 2, s2 /= 2, u2 /= 2, r3 /= 2;
          }
          function c2(e4, t4) {
            return 1 === a2 ? e4[t4] : e4.readUInt16BE(t4 * a2);
          }
          if (o2) {
            let n3 = -1;
            for (i2 = r3; i2 < s2; i2++) if (c2(e3, i2) === c2(t3, -1 === n3 ? 0 : i2 - n3)) {
              if (-1 === n3 && (n3 = i2), i2 - n3 + 1 === u2) return n3 * a2;
            } else -1 !== n3 && (i2 -= i2 - n3), n3 = -1;
          } else for (r3 + u2 > s2 && (r3 = s2 - u2), i2 = r3; i2 >= 0; i2--) {
            let r4 = true;
            for (let n3 = 0; n3 < u2; n3++) if (c2(e3, i2 + n3) !== c2(t3, n3)) {
              r4 = false;
              break;
            }
            if (r4) return i2;
          }
          return -1;
        }
        function S(e3, t3, r3, n2) {
          r3 = Number(r3) || 0;
          const o2 = e3.length - r3;
          n2 ? (n2 = Number(n2)) > o2 && (n2 = o2) : n2 = o2;
          const i2 = t3.length;
          let a2;
          for (n2 > i2 / 2 && (n2 = i2 / 2), a2 = 0; a2 < n2; ++a2) {
            const n3 = parseInt(t3.substr(2 * a2, 2), 16);
            if (Z(n3)) return a2;
            e3[r3 + a2] = n3;
          }
          return a2;
        }
        function E(e3, t3, r3, n2) {
          return W($(t3, e3.length - r3), e3, r3, n2);
        }
        function k(e3, t3, r3, n2) {
          return W((function(e4) {
            const t4 = [];
            for (let r4 = 0; r4 < e4.length; ++r4) t4.push(255 & e4.charCodeAt(r4));
            return t4;
          })(t3), e3, r3, n2);
        }
        function A(e3, t3, r3, n2) {
          return W(G(t3), e3, r3, n2);
        }
        function T(e3, t3, r3, n2) {
          return W((function(e4, t4) {
            let r4, n3, o2;
            const i2 = [];
            for (let a2 = 0; a2 < e4.length && !((t4 -= 2) < 0); ++a2) r4 = e4.charCodeAt(a2), n3 = r4 >> 8, o2 = r4 % 256, i2.push(o2), i2.push(n3);
            return i2;
          })(t3, e3.length - r3), e3, r3, n2);
        }
        function O(e3, t3, r3) {
          return 0 === t3 && r3 === e3.length ? o.fromByteArray(e3) : o.fromByteArray(e3.slice(t3, r3));
        }
        function x(e3, t3, r3) {
          r3 = Math.min(e3.length, r3);
          const n2 = [];
          let o2 = t3;
          for (; o2 < r3; ) {
            const t4 = e3[o2];
            let i2 = null, a2 = t4 > 239 ? 4 : t4 > 223 ? 3 : t4 > 191 ? 2 : 1;
            if (o2 + a2 <= r3) {
              let r4, n3, s2, u2;
              switch (a2) {
                case 1:
                  t4 < 128 && (i2 = t4);
                  break;
                case 2:
                  r4 = e3[o2 + 1], 128 == (192 & r4) && (u2 = (31 & t4) << 6 | 63 & r4, u2 > 127 && (i2 = u2));
                  break;
                case 3:
                  r4 = e3[o2 + 1], n3 = e3[o2 + 2], 128 == (192 & r4) && 128 == (192 & n3) && (u2 = (15 & t4) << 12 | (63 & r4) << 6 | 63 & n3, u2 > 2047 && (u2 < 55296 || u2 > 57343) && (i2 = u2));
                  break;
                case 4:
                  r4 = e3[o2 + 1], n3 = e3[o2 + 2], s2 = e3[o2 + 3], 128 == (192 & r4) && 128 == (192 & n3) && 128 == (192 & s2) && (u2 = (15 & t4) << 18 | (63 & r4) << 12 | (63 & n3) << 6 | 63 & s2, u2 > 65535 && u2 < 1114112 && (i2 = u2));
              }
            }
            null === i2 ? (i2 = 65533, a2 = 1) : i2 > 65535 && (i2 -= 65536, n2.push(i2 >>> 10 & 1023 | 55296), i2 = 56320 | 1023 & i2), n2.push(i2), o2 += a2;
          }
          return (function(e4) {
            const t4 = e4.length;
            if (t4 <= P) return String.fromCharCode.apply(String, e4);
            let r4 = "", n3 = 0;
            for (; n3 < t4; ) r4 += String.fromCharCode.apply(String, e4.slice(n3, n3 += P));
            return r4;
          })(n2);
        }
        t2.kMaxLength = s, c.TYPED_ARRAY_SUPPORT = (function() {
          try {
            const e3 = new Uint8Array(1), t3 = { foo: function() {
              return 42;
            } };
            return Object.setPrototypeOf(t3, Uint8Array.prototype), Object.setPrototypeOf(e3, t3), 42 === e3.foo();
          } catch (e3) {
            return false;
          }
        })(), c.TYPED_ARRAY_SUPPORT || void 0 === n || "function" != typeof n.error || n.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(c.prototype, "parent", { enumerable: true, get: function() {
          if (c.isBuffer(this)) return this.buffer;
        } }), Object.defineProperty(c.prototype, "offset", { enumerable: true, get: function() {
          if (c.isBuffer(this)) return this.byteOffset;
        } }), c.poolSize = 8192, c.from = function(e3, t3, r3) {
          return l(e3, t3, r3);
        }, Object.setPrototypeOf(c.prototype, Uint8Array.prototype), Object.setPrototypeOf(c, Uint8Array), c.alloc = function(e3, t3, r3) {
          return (function(e4, t4, r4) {
            return f(e4), e4 <= 0 ? u(e4) : void 0 !== t4 ? "string" == typeof r4 ? u(e4).fill(t4, r4) : u(e4).fill(t4) : u(e4);
          })(e3, t3, r3);
        }, c.allocUnsafe = function(e3) {
          return p(e3);
        }, c.allocUnsafeSlow = function(e3) {
          return p(e3);
        }, c.isBuffer = function(e3) {
          return null != e3 && true === e3._isBuffer && e3 !== c.prototype;
        }, c.compare = function(e3, t3) {
          if (Y(e3, Uint8Array) && (e3 = c.from(e3, e3.offset, e3.byteLength)), Y(t3, Uint8Array) && (t3 = c.from(t3, t3.offset, t3.byteLength)), !c.isBuffer(e3) || !c.isBuffer(t3)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
          if (e3 === t3) return 0;
          let r3 = e3.length, n2 = t3.length;
          for (let o2 = 0, i2 = Math.min(r3, n2); o2 < i2; ++o2) if (e3[o2] !== t3[o2]) {
            r3 = e3[o2], n2 = t3[o2];
            break;
          }
          return r3 < n2 ? -1 : n2 < r3 ? 1 : 0;
        }, c.isEncoding = function(e3) {
          switch (String(e3).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "latin1":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return true;
            default:
              return false;
          }
        }, c.concat = function(e3, t3) {
          if (!Array.isArray(e3)) throw new TypeError('"list" argument must be an Array of Buffers');
          if (0 === e3.length) return c.alloc(0);
          let r3;
          if (void 0 === t3) for (t3 = 0, r3 = 0; r3 < e3.length; ++r3) t3 += e3[r3].length;
          const n2 = c.allocUnsafe(t3);
          let o2 = 0;
          for (r3 = 0; r3 < e3.length; ++r3) {
            let t4 = e3[r3];
            if (Y(t4, Uint8Array)) o2 + t4.length > n2.length ? (c.isBuffer(t4) || (t4 = c.from(t4)), t4.copy(n2, o2)) : Uint8Array.prototype.set.call(n2, t4, o2);
            else {
              if (!c.isBuffer(t4)) throw new TypeError('"list" argument must be an Array of Buffers');
              t4.copy(n2, o2);
            }
            o2 += t4.length;
          }
          return n2;
        }, c.byteLength = m, c.prototype._isBuffer = true, c.prototype.swap16 = function() {
          const e3 = this.length;
          if (e3 % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
          for (let t3 = 0; t3 < e3; t3 += 2) v(this, t3, t3 + 1);
          return this;
        }, c.prototype.swap32 = function() {
          const e3 = this.length;
          if (e3 % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
          for (let t3 = 0; t3 < e3; t3 += 4) v(this, t3, t3 + 3), v(this, t3 + 1, t3 + 2);
          return this;
        }, c.prototype.swap64 = function() {
          const e3 = this.length;
          if (e3 % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
          for (let t3 = 0; t3 < e3; t3 += 8) v(this, t3, t3 + 7), v(this, t3 + 1, t3 + 6), v(this, t3 + 2, t3 + 5), v(this, t3 + 3, t3 + 4);
          return this;
        }, c.prototype.toString = function() {
          const e3 = this.length;
          return 0 === e3 ? "" : 0 === arguments.length ? x(this, 0, e3) : g.apply(this, arguments);
        }, c.prototype.toLocaleString = c.prototype.toString, c.prototype.equals = function(e3) {
          if (!c.isBuffer(e3)) throw new TypeError("Argument must be a Buffer");
          return this === e3 || 0 === c.compare(this, e3);
        }, c.prototype.inspect = function() {
          let e3 = "";
          const r3 = t2.INSPECT_MAX_BYTES;
          return e3 = this.toString("hex", 0, r3).replace(/(.{2})/g, "$1 ").trim(), this.length > r3 && (e3 += " ... "), "<Buffer " + e3 + ">";
        }, a && (c.prototype[a] = c.prototype.inspect), c.prototype.compare = function(e3, t3, r3, n2, o2) {
          if (Y(e3, Uint8Array) && (e3 = c.from(e3, e3.offset, e3.byteLength)), !c.isBuffer(e3)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e3);
          if (void 0 === t3 && (t3 = 0), void 0 === r3 && (r3 = e3 ? e3.length : 0), void 0 === n2 && (n2 = 0), void 0 === o2 && (o2 = this.length), t3 < 0 || r3 > e3.length || n2 < 0 || o2 > this.length) throw new RangeError("out of range index");
          if (n2 >= o2 && t3 >= r3) return 0;
          if (n2 >= o2) return -1;
          if (t3 >= r3) return 1;
          if (this === e3) return 0;
          let i2 = (o2 >>>= 0) - (n2 >>>= 0), a2 = (r3 >>>= 0) - (t3 >>>= 0);
          const s2 = Math.min(i2, a2), u2 = this.slice(n2, o2), l2 = e3.slice(t3, r3);
          for (let e4 = 0; e4 < s2; ++e4) if (u2[e4] !== l2[e4]) {
            i2 = u2[e4], a2 = l2[e4];
            break;
          }
          return i2 < a2 ? -1 : a2 < i2 ? 1 : 0;
        }, c.prototype.includes = function(e3, t3, r3) {
          return -1 !== this.indexOf(e3, t3, r3);
        }, c.prototype.indexOf = function(e3, t3, r3) {
          return b(this, e3, t3, r3, true);
        }, c.prototype.lastIndexOf = function(e3, t3, r3) {
          return b(this, e3, t3, r3, false);
        }, c.prototype.write = function(e3, t3, r3, n2) {
          if (void 0 === t3) n2 = "utf8", r3 = this.length, t3 = 0;
          else if (void 0 === r3 && "string" == typeof t3) n2 = t3, r3 = this.length, t3 = 0;
          else {
            if (!isFinite(t3)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
            t3 >>>= 0, isFinite(r3) ? (r3 >>>= 0, void 0 === n2 && (n2 = "utf8")) : (n2 = r3, r3 = void 0);
          }
          const o2 = this.length - t3;
          if ((void 0 === r3 || r3 > o2) && (r3 = o2), e3.length > 0 && (r3 < 0 || t3 < 0) || t3 > this.length) throw new RangeError("Attempt to write outside buffer bounds");
          n2 || (n2 = "utf8");
          let i2 = false;
          for (; ; ) switch (n2) {
            case "hex":
              return S(this, e3, t3, r3);
            case "utf8":
            case "utf-8":
              return E(this, e3, t3, r3);
            case "ascii":
            case "latin1":
            case "binary":
              return k(this, e3, t3, r3);
            case "base64":
              return A(this, e3, t3, r3);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return T(this, e3, t3, r3);
            default:
              if (i2) throw new TypeError("Unknown encoding: " + n2);
              n2 = ("" + n2).toLowerCase(), i2 = true;
          }
        }, c.prototype.toJSON = function() {
          return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
        };
        const P = 4096;
        function B(e3, t3, r3) {
          let n2 = "";
          r3 = Math.min(e3.length, r3);
          for (let o2 = t3; o2 < r3; ++o2) n2 += String.fromCharCode(127 & e3[o2]);
          return n2;
        }
        function I(e3, t3, r3) {
          let n2 = "";
          r3 = Math.min(e3.length, r3);
          for (let o2 = t3; o2 < r3; ++o2) n2 += String.fromCharCode(e3[o2]);
          return n2;
        }
        function C(e3, t3, r3) {
          const n2 = e3.length;
          (!t3 || t3 < 0) && (t3 = 0), (!r3 || r3 < 0 || r3 > n2) && (r3 = n2);
          let o2 = "";
          for (let n3 = t3; n3 < r3; ++n3) o2 += J[e3[n3]];
          return o2;
        }
        function R(e3, t3, r3) {
          const n2 = e3.slice(t3, r3);
          let o2 = "";
          for (let e4 = 0; e4 < n2.length - 1; e4 += 2) o2 += String.fromCharCode(n2[e4] + 256 * n2[e4 + 1]);
          return o2;
        }
        function _(e3, t3, r3) {
          if (e3 % 1 != 0 || e3 < 0) throw new RangeError("offset is not uint");
          if (e3 + t3 > r3) throw new RangeError("Trying to access beyond buffer length");
        }
        function U(e3, t3, r3, n2, o2, i2) {
          if (!c.isBuffer(e3)) throw new TypeError('"buffer" argument must be a Buffer instance');
          if (t3 > o2 || t3 < i2) throw new RangeError('"value" argument is out of bounds');
          if (r3 + n2 > e3.length) throw new RangeError("Index out of range");
        }
        function N(e3, t3, r3, n2, o2) {
          K(t3, n2, o2, e3, r3, 7);
          let i2 = Number(t3 & BigInt(4294967295));
          e3[r3++] = i2, i2 >>= 8, e3[r3++] = i2, i2 >>= 8, e3[r3++] = i2, i2 >>= 8, e3[r3++] = i2;
          let a2 = Number(t3 >> BigInt(32) & BigInt(4294967295));
          return e3[r3++] = a2, a2 >>= 8, e3[r3++] = a2, a2 >>= 8, e3[r3++] = a2, a2 >>= 8, e3[r3++] = a2, r3;
        }
        function L(e3, t3, r3, n2, o2) {
          K(t3, n2, o2, e3, r3, 7);
          let i2 = Number(t3 & BigInt(4294967295));
          e3[r3 + 7] = i2, i2 >>= 8, e3[r3 + 6] = i2, i2 >>= 8, e3[r3 + 5] = i2, i2 >>= 8, e3[r3 + 4] = i2;
          let a2 = Number(t3 >> BigInt(32) & BigInt(4294967295));
          return e3[r3 + 3] = a2, a2 >>= 8, e3[r3 + 2] = a2, a2 >>= 8, e3[r3 + 1] = a2, a2 >>= 8, e3[r3] = a2, r3 + 8;
        }
        function F(e3, t3, r3, n2, o2, i2) {
          if (r3 + n2 > e3.length) throw new RangeError("Index out of range");
          if (r3 < 0) throw new RangeError("Index out of range");
        }
        function j(e3, t3, r3, n2, o2) {
          return t3 = +t3, r3 >>>= 0, o2 || F(e3, 0, r3, 4), i.write(e3, t3, r3, n2, 23, 4), r3 + 4;
        }
        function M(e3, t3, r3, n2, o2) {
          return t3 = +t3, r3 >>>= 0, o2 || F(e3, 0, r3, 8), i.write(e3, t3, r3, n2, 52, 8), r3 + 8;
        }
        c.prototype.slice = function(e3, t3) {
          const r3 = this.length;
          (e3 = ~~e3) < 0 ? (e3 += r3) < 0 && (e3 = 0) : e3 > r3 && (e3 = r3), (t3 = void 0 === t3 ? r3 : ~~t3) < 0 ? (t3 += r3) < 0 && (t3 = 0) : t3 > r3 && (t3 = r3), t3 < e3 && (t3 = e3);
          const n2 = this.subarray(e3, t3);
          return Object.setPrototypeOf(n2, c.prototype), n2;
        }, c.prototype.readUintLE = c.prototype.readUIntLE = function(e3, t3, r3) {
          e3 >>>= 0, t3 >>>= 0, r3 || _(e3, t3, this.length);
          let n2 = this[e3], o2 = 1, i2 = 0;
          for (; ++i2 < t3 && (o2 *= 256); ) n2 += this[e3 + i2] * o2;
          return n2;
        }, c.prototype.readUintBE = c.prototype.readUIntBE = function(e3, t3, r3) {
          e3 >>>= 0, t3 >>>= 0, r3 || _(e3, t3, this.length);
          let n2 = this[e3 + --t3], o2 = 1;
          for (; t3 > 0 && (o2 *= 256); ) n2 += this[e3 + --t3] * o2;
          return n2;
        }, c.prototype.readUint8 = c.prototype.readUInt8 = function(e3, t3) {
          return e3 >>>= 0, t3 || _(e3, 1, this.length), this[e3];
        }, c.prototype.readUint16LE = c.prototype.readUInt16LE = function(e3, t3) {
          return e3 >>>= 0, t3 || _(e3, 2, this.length), this[e3] | this[e3 + 1] << 8;
        }, c.prototype.readUint16BE = c.prototype.readUInt16BE = function(e3, t3) {
          return e3 >>>= 0, t3 || _(e3, 2, this.length), this[e3] << 8 | this[e3 + 1];
        }, c.prototype.readUint32LE = c.prototype.readUInt32LE = function(e3, t3) {
          return e3 >>>= 0, t3 || _(e3, 4, this.length), (this[e3] | this[e3 + 1] << 8 | this[e3 + 2] << 16) + 16777216 * this[e3 + 3];
        }, c.prototype.readUint32BE = c.prototype.readUInt32BE = function(e3, t3) {
          return e3 >>>= 0, t3 || _(e3, 4, this.length), 16777216 * this[e3] + (this[e3 + 1] << 16 | this[e3 + 2] << 8 | this[e3 + 3]);
        }, c.prototype.readBigUInt64LE = Q(function(e3) {
          H(e3 >>>= 0, "offset");
          const t3 = this[e3], r3 = this[e3 + 7];
          void 0 !== t3 && void 0 !== r3 || z(e3, this.length - 8);
          const n2 = t3 + 256 * this[++e3] + 65536 * this[++e3] + this[++e3] * 2 ** 24, o2 = this[++e3] + 256 * this[++e3] + 65536 * this[++e3] + r3 * 2 ** 24;
          return BigInt(n2) + (BigInt(o2) << BigInt(32));
        }), c.prototype.readBigUInt64BE = Q(function(e3) {
          H(e3 >>>= 0, "offset");
          const t3 = this[e3], r3 = this[e3 + 7];
          void 0 !== t3 && void 0 !== r3 || z(e3, this.length - 8);
          const n2 = t3 * 2 ** 24 + 65536 * this[++e3] + 256 * this[++e3] + this[++e3], o2 = this[++e3] * 2 ** 24 + 65536 * this[++e3] + 256 * this[++e3] + r3;
          return (BigInt(n2) << BigInt(32)) + BigInt(o2);
        }), c.prototype.readIntLE = function(e3, t3, r3) {
          e3 >>>= 0, t3 >>>= 0, r3 || _(e3, t3, this.length);
          let n2 = this[e3], o2 = 1, i2 = 0;
          for (; ++i2 < t3 && (o2 *= 256); ) n2 += this[e3 + i2] * o2;
          return o2 *= 128, n2 >= o2 && (n2 -= Math.pow(2, 8 * t3)), n2;
        }, c.prototype.readIntBE = function(e3, t3, r3) {
          e3 >>>= 0, t3 >>>= 0, r3 || _(e3, t3, this.length);
          let n2 = t3, o2 = 1, i2 = this[e3 + --n2];
          for (; n2 > 0 && (o2 *= 256); ) i2 += this[e3 + --n2] * o2;
          return o2 *= 128, i2 >= o2 && (i2 -= Math.pow(2, 8 * t3)), i2;
        }, c.prototype.readInt8 = function(e3, t3) {
          return e3 >>>= 0, t3 || _(e3, 1, this.length), 128 & this[e3] ? -1 * (255 - this[e3] + 1) : this[e3];
        }, c.prototype.readInt16LE = function(e3, t3) {
          e3 >>>= 0, t3 || _(e3, 2, this.length);
          const r3 = this[e3] | this[e3 + 1] << 8;
          return 32768 & r3 ? 4294901760 | r3 : r3;
        }, c.prototype.readInt16BE = function(e3, t3) {
          e3 >>>= 0, t3 || _(e3, 2, this.length);
          const r3 = this[e3 + 1] | this[e3] << 8;
          return 32768 & r3 ? 4294901760 | r3 : r3;
        }, c.prototype.readInt32LE = function(e3, t3) {
          return e3 >>>= 0, t3 || _(e3, 4, this.length), this[e3] | this[e3 + 1] << 8 | this[e3 + 2] << 16 | this[e3 + 3] << 24;
        }, c.prototype.readInt32BE = function(e3, t3) {
          return e3 >>>= 0, t3 || _(e3, 4, this.length), this[e3] << 24 | this[e3 + 1] << 16 | this[e3 + 2] << 8 | this[e3 + 3];
        }, c.prototype.readBigInt64LE = Q(function(e3) {
          H(e3 >>>= 0, "offset");
          const t3 = this[e3], r3 = this[e3 + 7];
          void 0 !== t3 && void 0 !== r3 || z(e3, this.length - 8);
          const n2 = this[e3 + 4] + 256 * this[e3 + 5] + 65536 * this[e3 + 6] + (r3 << 24);
          return (BigInt(n2) << BigInt(32)) + BigInt(t3 + 256 * this[++e3] + 65536 * this[++e3] + this[++e3] * 2 ** 24);
        }), c.prototype.readBigInt64BE = Q(function(e3) {
          H(e3 >>>= 0, "offset");
          const t3 = this[e3], r3 = this[e3 + 7];
          void 0 !== t3 && void 0 !== r3 || z(e3, this.length - 8);
          const n2 = (t3 << 24) + 65536 * this[++e3] + 256 * this[++e3] + this[++e3];
          return (BigInt(n2) << BigInt(32)) + BigInt(this[++e3] * 2 ** 24 + 65536 * this[++e3] + 256 * this[++e3] + r3);
        }), c.prototype.readFloatLE = function(e3, t3) {
          return e3 >>>= 0, t3 || _(e3, 4, this.length), i.read(this, e3, true, 23, 4);
        }, c.prototype.readFloatBE = function(e3, t3) {
          return e3 >>>= 0, t3 || _(e3, 4, this.length), i.read(this, e3, false, 23, 4);
        }, c.prototype.readDoubleLE = function(e3, t3) {
          return e3 >>>= 0, t3 || _(e3, 8, this.length), i.read(this, e3, true, 52, 8);
        }, c.prototype.readDoubleBE = function(e3, t3) {
          return e3 >>>= 0, t3 || _(e3, 8, this.length), i.read(this, e3, false, 52, 8);
        }, c.prototype.writeUintLE = c.prototype.writeUIntLE = function(e3, t3, r3, n2) {
          if (e3 = +e3, t3 >>>= 0, r3 >>>= 0, !n2) {
            U(this, e3, t3, r3, Math.pow(2, 8 * r3) - 1, 0);
          }
          let o2 = 1, i2 = 0;
          for (this[t3] = 255 & e3; ++i2 < r3 && (o2 *= 256); ) this[t3 + i2] = e3 / o2 & 255;
          return t3 + r3;
        }, c.prototype.writeUintBE = c.prototype.writeUIntBE = function(e3, t3, r3, n2) {
          if (e3 = +e3, t3 >>>= 0, r3 >>>= 0, !n2) {
            U(this, e3, t3, r3, Math.pow(2, 8 * r3) - 1, 0);
          }
          let o2 = r3 - 1, i2 = 1;
          for (this[t3 + o2] = 255 & e3; --o2 >= 0 && (i2 *= 256); ) this[t3 + o2] = e3 / i2 & 255;
          return t3 + r3;
        }, c.prototype.writeUint8 = c.prototype.writeUInt8 = function(e3, t3, r3) {
          return e3 = +e3, t3 >>>= 0, r3 || U(this, e3, t3, 1, 255, 0), this[t3] = 255 & e3, t3 + 1;
        }, c.prototype.writeUint16LE = c.prototype.writeUInt16LE = function(e3, t3, r3) {
          return e3 = +e3, t3 >>>= 0, r3 || U(this, e3, t3, 2, 65535, 0), this[t3] = 255 & e3, this[t3 + 1] = e3 >>> 8, t3 + 2;
        }, c.prototype.writeUint16BE = c.prototype.writeUInt16BE = function(e3, t3, r3) {
          return e3 = +e3, t3 >>>= 0, r3 || U(this, e3, t3, 2, 65535, 0), this[t3] = e3 >>> 8, this[t3 + 1] = 255 & e3, t3 + 2;
        }, c.prototype.writeUint32LE = c.prototype.writeUInt32LE = function(e3, t3, r3) {
          return e3 = +e3, t3 >>>= 0, r3 || U(this, e3, t3, 4, 4294967295, 0), this[t3 + 3] = e3 >>> 24, this[t3 + 2] = e3 >>> 16, this[t3 + 1] = e3 >>> 8, this[t3] = 255 & e3, t3 + 4;
        }, c.prototype.writeUint32BE = c.prototype.writeUInt32BE = function(e3, t3, r3) {
          return e3 = +e3, t3 >>>= 0, r3 || U(this, e3, t3, 4, 4294967295, 0), this[t3] = e3 >>> 24, this[t3 + 1] = e3 >>> 16, this[t3 + 2] = e3 >>> 8, this[t3 + 3] = 255 & e3, t3 + 4;
        }, c.prototype.writeBigUInt64LE = Q(function(e3, t3 = 0) {
          return N(this, e3, t3, BigInt(0), BigInt("0xffffffffffffffff"));
        }), c.prototype.writeBigUInt64BE = Q(function(e3, t3 = 0) {
          return L(this, e3, t3, BigInt(0), BigInt("0xffffffffffffffff"));
        }), c.prototype.writeIntLE = function(e3, t3, r3, n2) {
          if (e3 = +e3, t3 >>>= 0, !n2) {
            const n3 = Math.pow(2, 8 * r3 - 1);
            U(this, e3, t3, r3, n3 - 1, -n3);
          }
          let o2 = 0, i2 = 1, a2 = 0;
          for (this[t3] = 255 & e3; ++o2 < r3 && (i2 *= 256); ) e3 < 0 && 0 === a2 && 0 !== this[t3 + o2 - 1] && (a2 = 1), this[t3 + o2] = (e3 / i2 | 0) - a2 & 255;
          return t3 + r3;
        }, c.prototype.writeIntBE = function(e3, t3, r3, n2) {
          if (e3 = +e3, t3 >>>= 0, !n2) {
            const n3 = Math.pow(2, 8 * r3 - 1);
            U(this, e3, t3, r3, n3 - 1, -n3);
          }
          let o2 = r3 - 1, i2 = 1, a2 = 0;
          for (this[t3 + o2] = 255 & e3; --o2 >= 0 && (i2 *= 256); ) e3 < 0 && 0 === a2 && 0 !== this[t3 + o2 + 1] && (a2 = 1), this[t3 + o2] = (e3 / i2 | 0) - a2 & 255;
          return t3 + r3;
        }, c.prototype.writeInt8 = function(e3, t3, r3) {
          return e3 = +e3, t3 >>>= 0, r3 || U(this, e3, t3, 1, 127, -128), e3 < 0 && (e3 = 255 + e3 + 1), this[t3] = 255 & e3, t3 + 1;
        }, c.prototype.writeInt16LE = function(e3, t3, r3) {
          return e3 = +e3, t3 >>>= 0, r3 || U(this, e3, t3, 2, 32767, -32768), this[t3] = 255 & e3, this[t3 + 1] = e3 >>> 8, t3 + 2;
        }, c.prototype.writeInt16BE = function(e3, t3, r3) {
          return e3 = +e3, t3 >>>= 0, r3 || U(this, e3, t3, 2, 32767, -32768), this[t3] = e3 >>> 8, this[t3 + 1] = 255 & e3, t3 + 2;
        }, c.prototype.writeInt32LE = function(e3, t3, r3) {
          return e3 = +e3, t3 >>>= 0, r3 || U(this, e3, t3, 4, 2147483647, -2147483648), this[t3] = 255 & e3, this[t3 + 1] = e3 >>> 8, this[t3 + 2] = e3 >>> 16, this[t3 + 3] = e3 >>> 24, t3 + 4;
        }, c.prototype.writeInt32BE = function(e3, t3, r3) {
          return e3 = +e3, t3 >>>= 0, r3 || U(this, e3, t3, 4, 2147483647, -2147483648), e3 < 0 && (e3 = 4294967295 + e3 + 1), this[t3] = e3 >>> 24, this[t3 + 1] = e3 >>> 16, this[t3 + 2] = e3 >>> 8, this[t3 + 3] = 255 & e3, t3 + 4;
        }, c.prototype.writeBigInt64LE = Q(function(e3, t3 = 0) {
          return N(this, e3, t3, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
        }), c.prototype.writeBigInt64BE = Q(function(e3, t3 = 0) {
          return L(this, e3, t3, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
        }), c.prototype.writeFloatLE = function(e3, t3, r3) {
          return j(this, e3, t3, true, r3);
        }, c.prototype.writeFloatBE = function(e3, t3, r3) {
          return j(this, e3, t3, false, r3);
        }, c.prototype.writeDoubleLE = function(e3, t3, r3) {
          return M(this, e3, t3, true, r3);
        }, c.prototype.writeDoubleBE = function(e3, t3, r3) {
          return M(this, e3, t3, false, r3);
        }, c.prototype.copy = function(e3, t3, r3, n2) {
          if (!c.isBuffer(e3)) throw new TypeError("argument should be a Buffer");
          if (r3 || (r3 = 0), n2 || 0 === n2 || (n2 = this.length), t3 >= e3.length && (t3 = e3.length), t3 || (t3 = 0), n2 > 0 && n2 < r3 && (n2 = r3), n2 === r3) return 0;
          if (0 === e3.length || 0 === this.length) return 0;
          if (t3 < 0) throw new RangeError("targetStart out of bounds");
          if (r3 < 0 || r3 >= this.length) throw new RangeError("Index out of range");
          if (n2 < 0) throw new RangeError("sourceEnd out of bounds");
          n2 > this.length && (n2 = this.length), e3.length - t3 < n2 - r3 && (n2 = e3.length - t3 + r3);
          const o2 = n2 - r3;
          return this === e3 && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(t3, r3, n2) : Uint8Array.prototype.set.call(e3, this.subarray(r3, n2), t3), o2;
        }, c.prototype.fill = function(e3, t3, r3, n2) {
          if ("string" == typeof e3) {
            if ("string" == typeof t3 ? (n2 = t3, t3 = 0, r3 = this.length) : "string" == typeof r3 && (n2 = r3, r3 = this.length), void 0 !== n2 && "string" != typeof n2) throw new TypeError("encoding must be a string");
            if ("string" == typeof n2 && !c.isEncoding(n2)) throw new TypeError("Unknown encoding: " + n2);
            if (1 === e3.length) {
              const t4 = e3.charCodeAt(0);
              ("utf8" === n2 && t4 < 128 || "latin1" === n2) && (e3 = t4);
            }
          } else "number" == typeof e3 ? e3 &= 255 : "boolean" == typeof e3 && (e3 = Number(e3));
          if (t3 < 0 || this.length < t3 || this.length < r3) throw new RangeError("Out of range index");
          if (r3 <= t3) return this;
          let o2;
          if (t3 >>>= 0, r3 = void 0 === r3 ? this.length : r3 >>> 0, e3 || (e3 = 0), "number" == typeof e3) for (o2 = t3; o2 < r3; ++o2) this[o2] = e3;
          else {
            const i2 = c.isBuffer(e3) ? e3 : c.from(e3, n2), a2 = i2.length;
            if (0 === a2) throw new TypeError('The value "' + e3 + '" is invalid for argument "value"');
            for (o2 = 0; o2 < r3 - t3; ++o2) this[o2 + t3] = i2[o2 % a2];
          }
          return this;
        };
        const D = {};
        function V(e3, t3, r3) {
          D[e3] = class extends r3 {
            constructor() {
              super(), Object.defineProperty(this, "message", { value: t3.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${e3}]`, this.stack, delete this.name;
            }
            get code() {
              return e3;
            }
            set code(e4) {
              Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: e4, writable: true });
            }
            toString() {
              return `${this.name} [${e3}]: ${this.message}`;
            }
          };
        }
        function q(e3) {
          let t3 = "", r3 = e3.length;
          const n2 = "-" === e3[0] ? 1 : 0;
          for (; r3 >= n2 + 4; r3 -= 3) t3 = `_${e3.slice(r3 - 3, r3)}${t3}`;
          return `${e3.slice(0, r3)}${t3}`;
        }
        function K(e3, t3, r3, n2, o2, i2) {
          if (e3 > r3 || e3 < t3) {
            const n3 = "bigint" == typeof t3 ? "n" : "";
            let o3;
            throw o3 = i2 > 3 ? 0 === t3 || t3 === BigInt(0) ? `>= 0${n3} and < 2${n3} ** ${8 * (i2 + 1)}${n3}` : `>= -(2${n3} ** ${8 * (i2 + 1) - 1}${n3}) and < 2 ** ${8 * (i2 + 1) - 1}${n3}` : `>= ${t3}${n3} and <= ${r3}${n3}`, new D.ERR_OUT_OF_RANGE("value", o3, e3);
          }
          !(function(e4, t4, r4) {
            H(t4, "offset"), void 0 !== e4[t4] && void 0 !== e4[t4 + r4] || z(t4, e4.length - (r4 + 1));
          })(n2, o2, i2);
        }
        function H(e3, t3) {
          if ("number" != typeof e3) throw new D.ERR_INVALID_ARG_TYPE(t3, "number", e3);
        }
        function z(e3, t3, r3) {
          if (Math.floor(e3) !== e3) throw H(e3, r3), new D.ERR_OUT_OF_RANGE(r3 || "offset", "an integer", e3);
          if (t3 < 0) throw new D.ERR_BUFFER_OUT_OF_BOUNDS();
          throw new D.ERR_OUT_OF_RANGE(r3 || "offset", `>= ${r3 ? 1 : 0} and <= ${t3}`, e3);
        }
        V("ERR_BUFFER_OUT_OF_BOUNDS", function(e3) {
          return e3 ? `${e3} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
        }, RangeError), V("ERR_INVALID_ARG_TYPE", function(e3, t3) {
          return `The "${e3}" argument must be of type number. Received type ${typeof t3}`;
        }, TypeError), V("ERR_OUT_OF_RANGE", function(e3, t3, r3) {
          let n2 = `The value of "${e3}" is out of range.`, o2 = r3;
          return Number.isInteger(r3) && Math.abs(r3) > 2 ** 32 ? o2 = q(String(r3)) : "bigint" == typeof r3 && (o2 = String(r3), (r3 > BigInt(2) ** BigInt(32) || r3 < -(BigInt(2) ** BigInt(32))) && (o2 = q(o2)), o2 += "n"), n2 += ` It must be ${t3}. Received ${o2}`, n2;
        }, RangeError);
        const X = /[^+/0-9A-Za-z-_]/g;
        function $(e3, t3) {
          let r3;
          t3 = t3 || 1 / 0;
          const n2 = e3.length;
          let o2 = null;
          const i2 = [];
          for (let a2 = 0; a2 < n2; ++a2) {
            if (r3 = e3.charCodeAt(a2), r3 > 55295 && r3 < 57344) {
              if (!o2) {
                if (r3 > 56319) {
                  (t3 -= 3) > -1 && i2.push(239, 191, 189);
                  continue;
                }
                if (a2 + 1 === n2) {
                  (t3 -= 3) > -1 && i2.push(239, 191, 189);
                  continue;
                }
                o2 = r3;
                continue;
              }
              if (r3 < 56320) {
                (t3 -= 3) > -1 && i2.push(239, 191, 189), o2 = r3;
                continue;
              }
              r3 = 65536 + (o2 - 55296 << 10 | r3 - 56320);
            } else o2 && (t3 -= 3) > -1 && i2.push(239, 191, 189);
            if (o2 = null, r3 < 128) {
              if ((t3 -= 1) < 0) break;
              i2.push(r3);
            } else if (r3 < 2048) {
              if ((t3 -= 2) < 0) break;
              i2.push(r3 >> 6 | 192, 63 & r3 | 128);
            } else if (r3 < 65536) {
              if ((t3 -= 3) < 0) break;
              i2.push(r3 >> 12 | 224, r3 >> 6 & 63 | 128, 63 & r3 | 128);
            } else {
              if (!(r3 < 1114112)) throw new Error("Invalid code point");
              if ((t3 -= 4) < 0) break;
              i2.push(r3 >> 18 | 240, r3 >> 12 & 63 | 128, r3 >> 6 & 63 | 128, 63 & r3 | 128);
            }
          }
          return i2;
        }
        function G(e3) {
          return o.toByteArray((function(e4) {
            if ((e4 = (e4 = e4.split("=")[0]).trim().replace(X, "")).length < 2) return "";
            for (; e4.length % 4 != 0; ) e4 += "=";
            return e4;
          })(e3));
        }
        function W(e3, t3, r3, n2) {
          let o2;
          for (o2 = 0; o2 < n2 && !(o2 + r3 >= t3.length || o2 >= e3.length); ++o2) t3[o2 + r3] = e3[o2];
          return o2;
        }
        function Y(e3, t3) {
          return e3 instanceof t3 || null != e3 && null != e3.constructor && null != e3.constructor.name && e3.constructor.name === t3.name;
        }
        function Z(e3) {
          return e3 != e3;
        }
        const J = (function() {
          const e3 = "0123456789abcdef", t3 = new Array(256);
          for (let r3 = 0; r3 < 16; ++r3) {
            const n2 = 16 * r3;
            for (let o2 = 0; o2 < 16; ++o2) t3[n2 + o2] = e3[r3] + e3[o2];
          }
          return t3;
        })();
        function Q(e3) {
          return "undefined" == typeof BigInt ? ee : e3;
        }
        function ee() {
          throw new Error("BigInt not supported");
        }
      }, 8403: (e2, t2, r2) => {
        "use strict";
        var n = r2(1189), o = r2(1333)(), i = r2(6556), a = r2(9612), s = i("Array.prototype.push"), u = i("Object.prototype.propertyIsEnumerable"), c = o ? a.getOwnPropertySymbols : null;
        e2.exports = function(e3, t3) {
          if (null == e3) throw new TypeError("target must be an object");
          var r3 = a(e3);
          if (1 === arguments.length) return r3;
          for (var i2 = 1; i2 < arguments.length; ++i2) {
            var l = a(arguments[i2]), f = n(l), p = o && (a.getOwnPropertySymbols || c);
            if (p) for (var d = p(l), h = 0; h < d.length; ++h) {
              var y = d[h];
              u(l, y) && s(f, y);
            }
            for (var m = 0; m < f.length; ++m) {
              var g = f[m];
              if (u(l, g)) {
                var v = l[g];
                r3[g] = v;
              }
            }
          }
          return r3;
        };
      }, 8452: (e2, t2, r2) => {
        "use strict";
        var n = r2(1189), o = "function" == typeof Symbol && "symbol" == typeof Symbol("foo"), i = Object.prototype.toString, a = Array.prototype.concat, s = r2(41), u = r2(592)(), c = function(e3, t3, r3, n2) {
          if (t3 in e3) {
            if (true === n2) {
              if (e3[t3] === r3) return;
            } else if ("function" != typeof (o2 = n2) || "[object Function]" !== i.call(o2) || !n2()) return;
          }
          var o2;
          u ? s(e3, t3, r3, true) : s(e3, t3, r3);
        }, l = function(e3, t3) {
          var r3 = arguments.length > 2 ? arguments[2] : {}, i2 = n(t3);
          o && (i2 = a.call(i2, Object.getOwnPropertySymbols(t3)));
          for (var s2 = 0; s2 < i2.length; s2 += 1) c(e3, i2[s2], t3[i2[s2]], r3[i2[s2]]);
        };
        l.supportsDescriptors = !!u, e2.exports = l;
      }, 8648: (e2) => {
        "use strict";
        e2.exports = "undefined" != typeof Reflect && Reflect.getPrototypeOf || null;
      }, 8875: (e2, t2, r2) => {
        "use strict";
        var n;
        if (!Object.keys) {
          var o = Object.prototype.hasOwnProperty, i = Object.prototype.toString, a = r2(1093), s = Object.prototype.propertyIsEnumerable, u = !s.call({ toString: null }, "toString"), c = s.call(function() {
          }, "prototype"), l = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], f = function(e3) {
            var t3 = e3.constructor;
            return t3 && t3.prototype === e3;
          }, p = { $applicationCache: true, $console: true, $external: true, $frame: true, $frameElement: true, $frames: true, $innerHeight: true, $innerWidth: true, $onmozfullscreenchange: true, $onmozfullscreenerror: true, $outerHeight: true, $outerWidth: true, $pageXOffset: true, $pageYOffset: true, $parent: true, $scrollLeft: true, $scrollTop: true, $scrollX: true, $scrollY: true, $self: true, $webkitIndexedDB: true, $webkitStorageInfo: true, $window: true }, d = (function() {
            if ("undefined" == typeof window) return false;
            for (var e3 in window) try {
              if (!p["$" + e3] && o.call(window, e3) && null !== window[e3] && "object" == typeof window[e3]) try {
                f(window[e3]);
              } catch (e4) {
                return true;
              }
            } catch (e4) {
              return true;
            }
            return false;
          })();
          n = function(e3) {
            var t3 = null !== e3 && "object" == typeof e3, r3 = "[object Function]" === i.call(e3), n2 = a(e3), s2 = t3 && "[object String]" === i.call(e3), p2 = [];
            if (!t3 && !r3 && !n2) throw new TypeError("Object.keys called on a non-object");
            var h = c && r3;
            if (s2 && e3.length > 0 && !o.call(e3, 0)) for (var y = 0; y < e3.length; ++y) p2.push(String(y));
            if (n2 && e3.length > 0) for (var m = 0; m < e3.length; ++m) p2.push(String(m));
            else for (var g in e3) h && "prototype" === g || !o.call(e3, g) || p2.push(String(g));
            if (u) for (var v = (function(e4) {
              if ("undefined" == typeof window || !d) return f(e4);
              try {
                return f(e4);
              } catch (e5) {
                return false;
              }
            })(e3), b = 0; b < l.length; ++b) v && "constructor" === l[b] || !o.call(e3, l[b]) || p2.push(l[b]);
            return p2;
          };
        }
        e2.exports = n;
      }, 8968: (e2) => {
        "use strict";
        e2.exports = Math.floor;
      }, 9032: (e2, t2, r2) => {
        "use strict";
        var n = r2(7244), o = r2(8184), i = r2(5767), a = r2(5680);
        function s(e3) {
          return e3.call.bind(e3);
        }
        var u = "undefined" != typeof BigInt, c = "undefined" != typeof Symbol, l = s(Object.prototype.toString), f = s(Number.prototype.valueOf), p = s(String.prototype.valueOf), d = s(Boolean.prototype.valueOf);
        if (u) var h = s(BigInt.prototype.valueOf);
        if (c) var y = s(Symbol.prototype.valueOf);
        function m(e3, t3) {
          if ("object" != typeof e3) return false;
          try {
            return t3(e3), true;
          } catch (e4) {
            return false;
          }
        }
        function g(e3) {
          return "[object Map]" === l(e3);
        }
        function v(e3) {
          return "[object Set]" === l(e3);
        }
        function b(e3) {
          return "[object WeakMap]" === l(e3);
        }
        function w(e3) {
          return "[object WeakSet]" === l(e3);
        }
        function S(e3) {
          return "[object ArrayBuffer]" === l(e3);
        }
        function E(e3) {
          return "undefined" != typeof ArrayBuffer && (S.working ? S(e3) : e3 instanceof ArrayBuffer);
        }
        function k(e3) {
          return "[object DataView]" === l(e3);
        }
        function A(e3) {
          return "undefined" != typeof DataView && (k.working ? k(e3) : e3 instanceof DataView);
        }
        t2.isArgumentsObject = n, t2.isGeneratorFunction = o, t2.isTypedArray = a, t2.isPromise = function(e3) {
          return "undefined" != typeof Promise && e3 instanceof Promise || null !== e3 && "object" == typeof e3 && "function" == typeof e3.then && "function" == typeof e3.catch;
        }, t2.isArrayBufferView = function(e3) {
          return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(e3) : a(e3) || A(e3);
        }, t2.isUint8Array = function(e3) {
          return "Uint8Array" === i(e3);
        }, t2.isUint8ClampedArray = function(e3) {
          return "Uint8ClampedArray" === i(e3);
        }, t2.isUint16Array = function(e3) {
          return "Uint16Array" === i(e3);
        }, t2.isUint32Array = function(e3) {
          return "Uint32Array" === i(e3);
        }, t2.isInt8Array = function(e3) {
          return "Int8Array" === i(e3);
        }, t2.isInt16Array = function(e3) {
          return "Int16Array" === i(e3);
        }, t2.isInt32Array = function(e3) {
          return "Int32Array" === i(e3);
        }, t2.isFloat32Array = function(e3) {
          return "Float32Array" === i(e3);
        }, t2.isFloat64Array = function(e3) {
          return "Float64Array" === i(e3);
        }, t2.isBigInt64Array = function(e3) {
          return "BigInt64Array" === i(e3);
        }, t2.isBigUint64Array = function(e3) {
          return "BigUint64Array" === i(e3);
        }, g.working = "undefined" != typeof Map && g(/* @__PURE__ */ new Map()), t2.isMap = function(e3) {
          return "undefined" != typeof Map && (g.working ? g(e3) : e3 instanceof Map);
        }, v.working = "undefined" != typeof Set && v(/* @__PURE__ */ new Set()), t2.isSet = function(e3) {
          return "undefined" != typeof Set && (v.working ? v(e3) : e3 instanceof Set);
        }, b.working = "undefined" != typeof WeakMap && b(/* @__PURE__ */ new WeakMap()), t2.isWeakMap = function(e3) {
          return "undefined" != typeof WeakMap && (b.working ? b(e3) : e3 instanceof WeakMap);
        }, w.working = "undefined" != typeof WeakSet && w(/* @__PURE__ */ new WeakSet()), t2.isWeakSet = function(e3) {
          return w(e3);
        }, S.working = "undefined" != typeof ArrayBuffer && S(new ArrayBuffer()), t2.isArrayBuffer = E, k.working = "undefined" != typeof ArrayBuffer && "undefined" != typeof DataView && k(new DataView(new ArrayBuffer(1), 0, 1)), t2.isDataView = A;
        var T = "undefined" != typeof SharedArrayBuffer ? SharedArrayBuffer : void 0;
        function O(e3) {
          return "[object SharedArrayBuffer]" === l(e3);
        }
        function x(e3) {
          return void 0 !== T && (void 0 === O.working && (O.working = O(new T())), O.working ? O(e3) : e3 instanceof T);
        }
        function P(e3) {
          return m(e3, f);
        }
        function B(e3) {
          return m(e3, p);
        }
        function I(e3) {
          return m(e3, d);
        }
        function C(e3) {
          return u && m(e3, h);
        }
        function R(e3) {
          return c && m(e3, y);
        }
        t2.isSharedArrayBuffer = x, t2.isAsyncFunction = function(e3) {
          return "[object AsyncFunction]" === l(e3);
        }, t2.isMapIterator = function(e3) {
          return "[object Map Iterator]" === l(e3);
        }, t2.isSetIterator = function(e3) {
          return "[object Set Iterator]" === l(e3);
        }, t2.isGeneratorObject = function(e3) {
          return "[object Generator]" === l(e3);
        }, t2.isWebAssemblyCompiledModule = function(e3) {
          return "[object WebAssembly.Module]" === l(e3);
        }, t2.isNumberObject = P, t2.isStringObject = B, t2.isBooleanObject = I, t2.isBigIntObject = C, t2.isSymbolObject = R, t2.isBoxedPrimitive = function(e3) {
          return P(e3) || B(e3) || I(e3) || C(e3) || R(e3);
        }, t2.isAnyArrayBuffer = function(e3) {
          return "undefined" != typeof Uint8Array && (E(e3) || x(e3));
        }, ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(e3) {
          Object.defineProperty(t2, e3, { enumerable: false, value: function() {
            throw new Error(e3 + " is not supported in userland");
          } });
        });
      }, 9092: (e2, t2, r2) => {
        "use strict";
        var n = r2(1333);
        e2.exports = function() {
          return n() && !!Symbol.toStringTag;
        };
      }, 9133: (e2, t2, r2) => {
        "use strict";
        var n = r2(8403);
        e2.exports = function() {
          return Object.assign ? (function() {
            if (!Object.assign) return false;
            for (var e3 = "abcdefghijklmnopqrst", t3 = e3.split(""), r3 = {}, n2 = 0; n2 < t3.length; ++n2) r3[t3[n2]] = t3[n2];
            var o = Object.assign({}, r3), i = "";
            for (var a in o) i += a;
            return e3 !== i;
          })() || (function() {
            if (!Object.assign || !Object.preventExtensions) return false;
            var e3 = Object.preventExtensions({ 1: 2 });
            try {
              Object.assign(e3, "xy");
            } catch (t3) {
              return "y" === e3[1];
            }
            return false;
          })() ? n : Object.assign : n;
        };
      }, 9209: (e2, t2, r2) => {
        "use strict";
        var n = r2(6578), o = "undefined" == typeof globalThis ? r2.g : globalThis;
        e2.exports = function() {
          for (var e3 = [], t3 = 0; t3 < n.length; t3++) "function" == typeof o[n[t3]] && (e3[e3.length] = n[t3]);
          return e3;
        };
      }, 9211: (e2) => {
        "use strict";
        var t2 = function(e3) {
          return e3 != e3;
        };
        e2.exports = function(e3, r2) {
          return 0 === e3 && 0 === r2 ? 1 / e3 == 1 / r2 : e3 === r2 || !(!t2(e3) || !t2(r2));
        };
      }, 9290: (e2) => {
        "use strict";
        e2.exports = RangeError;
      }, 9353: (e2) => {
        "use strict";
        var t2 = Object.prototype.toString, r2 = Math.max, n = function(e3, t3) {
          for (var r3 = [], n2 = 0; n2 < e3.length; n2 += 1) r3[n2] = e3[n2];
          for (var o = 0; o < t3.length; o += 1) r3[o + e3.length] = t3[o];
          return r3;
        };
        e2.exports = function(e3) {
          var o = this;
          if ("function" != typeof o || "[object Function]" !== t2.apply(o)) throw new TypeError("Function.prototype.bind called on incompatible " + o);
          for (var i, a = (function(e4, t3) {
            for (var r3 = [], n2 = t3 || 0, o2 = 0; n2 < e4.length; n2 += 1, o2 += 1) r3[o2] = e4[n2];
            return r3;
          })(arguments, 1), s = r2(0, o.length - a.length), u = [], c = 0; c < s; c++) u[c] = "$" + c;
          if (i = Function("binder", "return function (" + (function(e4, t3) {
            for (var r3 = "", n2 = 0; n2 < e4.length; n2 += 1) r3 += e4[n2], n2 + 1 < e4.length && (r3 += t3);
            return r3;
          })(u, ",") + "){ return binder.apply(this,arguments); }")(function() {
            if (this instanceof i) {
              var t3 = o.apply(this, n(a, arguments));
              return Object(t3) === t3 ? t3 : this;
            }
            return o.apply(e3, n(a, arguments));
          }), o.prototype) {
            var l = function() {
            };
            l.prototype = o.prototype, i.prototype = new l(), l.prototype = null;
          }
          return i;
        };
      }, 9383: (e2) => {
        "use strict";
        e2.exports = Error;
      }, 9394: (e2, t2, r2) => {
        "use strict";
        var n = r2(9211);
        e2.exports = function() {
          return "function" == typeof Object.is ? Object.is : n;
        };
      }, 9538: (e2) => {
        "use strict";
        e2.exports = ReferenceError;
      }, 9597: (e2, t2, r2) => {
        "use strict";
        function n(e3) {
          return n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, n(e3);
        }
        function o(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n2 = t3[r3];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e3, i(n2.key), n2);
          }
        }
        function i(e3) {
          var t3 = (function(e4, t4) {
            if ("object" !== n(e4) || null === e4) return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var o2 = r3.call(e4, t4 || "default");
              if ("object" !== n(o2)) return o2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === t4 ? String : Number)(e4);
          })(e3, "string");
          return "symbol" === n(t3) ? t3 : String(t3);
        }
        function a(e3, t3) {
          return a = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e4, t4) {
            return e4.__proto__ = t4, e4;
          }, a(e3, t3);
        }
        function s(e3) {
          var t3 = (function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if ("function" == typeof Proxy) return true;
            try {
              return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
              })), true;
            } catch (e4) {
              return false;
            }
          })();
          return function() {
            var r3, o2 = u(e3);
            if (t3) {
              var i2 = u(this).constructor;
              r3 = Reflect.construct(o2, arguments, i2);
            } else r3 = o2.apply(this, arguments);
            return (function(e4, t4) {
              if (t4 && ("object" === n(t4) || "function" == typeof t4)) return t4;
              if (void 0 !== t4) throw new TypeError("Derived constructors may only return object or undefined");
              return (function(e5) {
                if (void 0 === e5) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e5;
              })(e4);
            })(this, r3);
          };
        }
        function u(e3) {
          return u = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e4) {
            return e4.__proto__ || Object.getPrototypeOf(e4);
          }, u(e3);
        }
        var c, l, f = {};
        function p(e3, t3, r3) {
          r3 || (r3 = Error);
          var n2 = (function(r4) {
            !(function(e4, t4) {
              if ("function" != typeof t4 && null !== t4) throw new TypeError("Super expression must either be null or a function");
              e4.prototype = Object.create(t4 && t4.prototype, { constructor: { value: e4, writable: true, configurable: true } }), Object.defineProperty(e4, "prototype", { writable: false }), t4 && a(e4, t4);
            })(l2, r4);
            var n3, i2, u2, c2 = s(l2);
            function l2(r5, n4, o2) {
              var i3;
              return (function(e4, t4) {
                if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
              })(this, l2), i3 = c2.call(this, (function(e4, r6, n5) {
                return "string" == typeof t3 ? t3 : t3(e4, r6, n5);
              })(r5, n4, o2)), i3.code = e3, i3;
            }
            return n3 = l2, i2 && o(n3.prototype, i2), u2 && o(n3, u2), Object.defineProperty(n3, "prototype", { writable: false }), n3;
          })(r3);
          f[e3] = n2;
        }
        function d(e3, t3) {
          if (Array.isArray(e3)) {
            var r3 = e3.length;
            return e3 = e3.map(function(e4) {
              return String(e4);
            }), r3 > 2 ? "one of ".concat(t3, " ").concat(e3.slice(0, r3 - 1).join(", "), ", or ") + e3[r3 - 1] : 2 === r3 ? "one of ".concat(t3, " ").concat(e3[0], " or ").concat(e3[1]) : "of ".concat(t3, " ").concat(e3[0]);
          }
          return "of ".concat(t3, " ").concat(String(e3));
        }
        p("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError), p("ERR_INVALID_ARG_TYPE", function(e3, t3, o2) {
          var i2, a2, s2, u2;
          if (void 0 === c && (c = r2(4148)), c("string" == typeof e3, "'name' must be a string"), "string" == typeof t3 && (a2 = "not ", t3.substr(!s2 || s2 < 0 ? 0 : +s2, a2.length) === a2) ? (i2 = "must not be", t3 = t3.replace(/^not /, "")) : i2 = "must be", (function(e4, t4, r3) {
            return (void 0 === r3 || r3 > e4.length) && (r3 = e4.length), e4.substring(r3 - t4.length, r3) === t4;
          })(e3, " argument")) u2 = "The ".concat(e3, " ").concat(i2, " ").concat(d(t3, "type"));
          else {
            var l2 = (function(e4, t4, r3) {
              return "number" != typeof r3 && (r3 = 0), !(r3 + t4.length > e4.length) && -1 !== e4.indexOf(t4, r3);
            })(e3, ".") ? "property" : "argument";
            u2 = 'The "'.concat(e3, '" ').concat(l2, " ").concat(i2, " ").concat(d(t3, "type"));
          }
          return u2 += ". Received type ".concat(n(o2));
        }, TypeError), p("ERR_INVALID_ARG_VALUE", function(e3, t3) {
          var n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "is invalid";
          void 0 === l && (l = r2(537));
          var o2 = l.inspect(t3);
          return o2.length > 128 && (o2 = "".concat(o2.slice(0, 128), "...")), "The argument '".concat(e3, "' ").concat(n2, ". Received ").concat(o2);
        }, TypeError, RangeError), p("ERR_INVALID_RETURN_VALUE", function(e3, t3, r3) {
          var o2;
          return o2 = r3 && r3.constructor && r3.constructor.name ? "instance of ".concat(r3.constructor.name) : "type ".concat(n(r3)), "Expected ".concat(e3, ' to be returned from the "').concat(t3, '"') + " function but got ".concat(o2, ".");
        }, TypeError), p("ERR_MISSING_ARGS", function() {
          for (var e3 = arguments.length, t3 = new Array(e3), n2 = 0; n2 < e3; n2++) t3[n2] = arguments[n2];
          void 0 === c && (c = r2(4148)), c(t3.length > 0, "At least one arg needs to be specified");
          var o2 = "The ", i2 = t3.length;
          switch (t3 = t3.map(function(e4) {
            return '"'.concat(e4, '"');
          }), i2) {
            case 1:
              o2 += "".concat(t3[0], " argument");
              break;
            case 2:
              o2 += "".concat(t3[0], " and ").concat(t3[1], " arguments");
              break;
            default:
              o2 += t3.slice(0, i2 - 1).join(", "), o2 += ", and ".concat(t3[i2 - 1], " arguments");
          }
          return "".concat(o2, " must be specified");
        }, TypeError), e2.exports.codes = f;
      }, 9600: (e2) => {
        "use strict";
        var t2, r2, n = Function.prototype.toString, o = "object" == typeof Reflect && null !== Reflect && Reflect.apply;
        if ("function" == typeof o && "function" == typeof Object.defineProperty) try {
          t2 = Object.defineProperty({}, "length", { get: function() {
            throw r2;
          } }), r2 = {}, o(function() {
            throw 42;
          }, null, t2);
        } catch (e3) {
          e3 !== r2 && (o = null);
        }
        else o = null;
        var i = /^\s*class\b/, a = function(e3) {
          try {
            var t3 = n.call(e3);
            return i.test(t3);
          } catch (e4) {
            return false;
          }
        }, s = function(e3) {
          try {
            return !a(e3) && (n.call(e3), true);
          } catch (e4) {
            return false;
          }
        }, u = Object.prototype.toString, c = "function" == typeof Symbol && !!Symbol.toStringTag, l = !(0 in [,]), f = function() {
          return false;
        };
        if ("object" == typeof document) {
          var p = document.all;
          u.call(p) === u.call(document.all) && (f = function(e3) {
            if ((l || !e3) && (void 0 === e3 || "object" == typeof e3)) try {
              var t3 = u.call(e3);
              return ("[object HTMLAllCollection]" === t3 || "[object HTML document.all class]" === t3 || "[object HTMLCollection]" === t3 || "[object Object]" === t3) && null == e3("");
            } catch (e4) {
            }
            return false;
          });
        }
        e2.exports = o ? function(e3) {
          if (f(e3)) return true;
          if (!e3) return false;
          if ("function" != typeof e3 && "object" != typeof e3) return false;
          try {
            o(e3, null, t2);
          } catch (e4) {
            if (e4 !== r2) return false;
          }
          return !a(e3) && s(e3);
        } : function(e3) {
          if (f(e3)) return true;
          if (!e3) return false;
          if ("function" != typeof e3 && "object" != typeof e3) return false;
          if (c) return s(e3);
          if (a(e3)) return false;
          var t3 = u.call(e3);
          return !("[object Function]" !== t3 && "[object GeneratorFunction]" !== t3 && !/^\[object HTML/.test(t3)) && s(e3);
        };
      }, 9612: (e2) => {
        "use strict";
        e2.exports = Object;
      }, 9675: (e2) => {
        "use strict";
        e2.exports = TypeError;
      }, 9721: (e2, t2, r2) => {
        "use strict";
        var n = r2(6556), o = r2(4035), i = n("RegExp.prototype.exec"), a = r2(9675);
        e2.exports = function(e3) {
          if (!o(e3)) throw new a("`regex` must be a RegExp");
          return function(t3) {
            return null !== i(e3, t3);
          };
        };
      }, 9957: (e2, t2, r2) => {
        "use strict";
        var n = Function.prototype.call, o = Object.prototype.hasOwnProperty, i = r2(6743);
        e2.exports = i.call(n, o);
      } }, t = {};
      function r(n) {
        var o = t[n];
        if (void 0 !== o) return o.exports;
        var i = t[n] = { id: n, loaded: false, exports: {} };
        return e[n].call(i.exports, i, i.exports, r), i.loaded = true, i.exports;
      }
      return r.d = (e2, t2) => {
        for (var n in t2) r.o(t2, n) && !r.o(e2, n) && Object.defineProperty(e2, n, { enumerable: true, get: t2[n] });
      }, r.g = (function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || new Function("return this")();
        } catch (e2) {
          if ("object" == typeof window) return window;
        }
      })(), r.hmd = (e2) => ((e2 = Object.create(e2)).children || (e2.children = []), Object.defineProperty(e2, "exports", { enumerable: true, set: () => {
        throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: " + e2.id);
      } }), e2), r.o = (e2, t2) => Object.prototype.hasOwnProperty.call(e2, t2), r.r = (e2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      }, r(448);
    })());
  }
});

// node_modules/@stellar/stellar-sdk/lib/http-client/types.js
var require_types = __commonJS({
  "node_modules/@stellar/stellar-sdk/lib/http-client/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CancelToken = void 0;
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    function _classCallCheck(a, n) {
      if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties(e, r) {
      for (var t = 0; t < r.length; t++) {
        var o = r[t];
        o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
      }
    }
    function _createClass(e, r, t) {
      return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: false }), e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == _typeof(i) ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != _typeof(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    var CancelToken = exports.CancelToken = (function() {
      function CancelToken2(executor) {
        var _this = this;
        _classCallCheck(this, CancelToken2);
        var resolvePromise;
        this.promise = new Promise(function(resolve) {
          resolvePromise = resolve;
        });
        executor(function(reason) {
          _this.reason = reason;
          resolvePromise();
        });
      }
      return _createClass(CancelToken2, [{
        key: "throwIfRequested",
        value: function throwIfRequested() {
          if (this.reason) {
            throw new Error(this.reason);
          }
        }
      }]);
    })();
  }
});

// node_modules/axios/dist/browser/axios.cjs
var require_axios = __commonJS({
  "node_modules/axios/dist/browser/axios.cjs"(exports, module) {
    "use strict";
    function bind(fn, thisArg) {
      return function wrap() {
        return fn.apply(thisArg, arguments);
      };
    }
    var { toString } = Object.prototype;
    var { getPrototypeOf } = Object;
    var { iterator, toStringTag } = Symbol;
    var kindOf = /* @__PURE__ */ ((cache) => (thing) => {
      const str = toString.call(thing);
      return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    })(/* @__PURE__ */ Object.create(null));
    var kindOfTest = (type) => {
      type = type.toLowerCase();
      return (thing) => kindOf(thing) === type;
    };
    var typeOfTest = (type) => (thing) => typeof thing === type;
    var { isArray } = Array;
    var isUndefined = typeOfTest("undefined");
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
    }
    var isArrayBuffer = kindOfTest("ArrayBuffer");
    function isArrayBufferView(val) {
      let result;
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
      } else {
        result = val && val.buffer && isArrayBuffer(val.buffer);
      }
      return result;
    }
    var isString = typeOfTest("string");
    var isFunction$1 = typeOfTest("function");
    var isNumber = typeOfTest("number");
    var isObject = (thing) => thing !== null && typeof thing === "object";
    var isBoolean = (thing) => thing === true || thing === false;
    var isPlainObject = (val) => {
      if (kindOf(val) !== "object") {
        return false;
      }
      const prototype2 = getPrototypeOf(val);
      return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag in val) && !(iterator in val);
    };
    var isEmptyObject = (val) => {
      if (!isObject(val) || isBuffer(val)) {
        return false;
      }
      try {
        return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
      } catch (e) {
        return false;
      }
    };
    var isDate = kindOfTest("Date");
    var isFile = kindOfTest("File");
    var isBlob = kindOfTest("Blob");
    var isFileList = kindOfTest("FileList");
    var isStream = (val) => isObject(val) && isFunction$1(val.pipe);
    var isFormData = (thing) => {
      let kind;
      return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction$1(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
      kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]"));
    };
    var isURLSearchParams = kindOfTest("URLSearchParams");
    var [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
    var trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    function forEach(obj, fn, { allOwnKeys = false } = {}) {
      if (obj === null || typeof obj === "undefined") {
        return;
      }
      let i;
      let l;
      if (typeof obj !== "object") {
        obj = [obj];
      }
      if (isArray(obj)) {
        for (i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        if (isBuffer(obj)) {
          return;
        }
        const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        const len = keys.length;
        let key;
        for (i = 0; i < len; i++) {
          key = keys[i];
          fn.call(null, obj[key], key, obj);
        }
      }
    }
    function findKey(obj, key) {
      if (isBuffer(obj)) {
        return null;
      }
      key = key.toLowerCase();
      const keys = Object.keys(obj);
      let i = keys.length;
      let _key;
      while (i-- > 0) {
        _key = keys[i];
        if (key === _key.toLowerCase()) {
          return _key;
        }
      }
      return null;
    }
    var _global = (() => {
      if (typeof globalThis !== "undefined") return globalThis;
      return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
    })();
    var isContextDefined = (context) => !isUndefined(context) && context !== _global;
    function merge() {
      const { caseless, skipUndefined } = isContextDefined(this) && this || {};
      const result = {};
      const assignValue = (val, key) => {
        const targetKey = caseless && findKey(result, key) || key;
        if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
          result[targetKey] = merge(result[targetKey], val);
        } else if (isPlainObject(val)) {
          result[targetKey] = merge({}, val);
        } else if (isArray(val)) {
          result[targetKey] = val.slice();
        } else if (!skipUndefined || !isUndefined(val)) {
          result[targetKey] = val;
        }
      };
      for (let i = 0, l = arguments.length; i < l; i++) {
        arguments[i] && forEach(arguments[i], assignValue);
      }
      return result;
    }
    var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
      forEach(b, (val, key) => {
        if (thisArg && isFunction$1(val)) {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      }, { allOwnKeys });
      return a;
    };
    var stripBOM = (content) => {
      if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
      }
      return content;
    };
    var inherits = (constructor, superConstructor, props, descriptors2) => {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
      constructor.prototype.constructor = constructor;
      Object.defineProperty(constructor, "super", {
        value: superConstructor.prototype
      });
      props && Object.assign(constructor.prototype, props);
    };
    var toFlatObject = (sourceObj, destObj, filter, propFilter) => {
      let props;
      let i;
      let prop;
      const merged = {};
      destObj = destObj || {};
      if (sourceObj == null) return destObj;
      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = filter !== false && getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
      return destObj;
    };
    var endsWith = (str, searchString, position) => {
      str = String(str);
      if (position === void 0 || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      const lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
    var toArray = (thing) => {
      if (!thing) return null;
      if (isArray(thing)) return thing;
      let i = thing.length;
      if (!isNumber(i)) return null;
      const arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    };
    var isTypedArray = /* @__PURE__ */ ((TypedArray) => {
      return (thing) => {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
    var forEachEntry = (obj, fn) => {
      const generator = obj && obj[iterator];
      const _iterator = generator.call(obj);
      let result;
      while ((result = _iterator.next()) && !result.done) {
        const pair = result.value;
        fn.call(obj, pair[0], pair[1]);
      }
    };
    var matchAll = (regExp, str) => {
      let matches;
      const arr = [];
      while ((matches = regExp.exec(str)) !== null) {
        arr.push(matches);
      }
      return arr;
    };
    var isHTMLForm = kindOfTest("HTMLFormElement");
    var toCamelCase = (str) => {
      return str.toLowerCase().replace(
        /[-_\s]([a-z\d])(\w*)/g,
        function replacer(m, p1, p2) {
          return p1.toUpperCase() + p2;
        }
      );
    };
    var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
    var isRegExp = kindOfTest("RegExp");
    var reduceDescriptors = (obj, reducer) => {
      const descriptors2 = Object.getOwnPropertyDescriptors(obj);
      const reducedDescriptors = {};
      forEach(descriptors2, (descriptor, name) => {
        let ret;
        if ((ret = reducer(descriptor, name, obj)) !== false) {
          reducedDescriptors[name] = ret || descriptor;
        }
      });
      Object.defineProperties(obj, reducedDescriptors);
    };
    var freezeMethods = (obj) => {
      reduceDescriptors(obj, (descriptor, name) => {
        if (isFunction$1(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
          return false;
        }
        const value = obj[name];
        if (!isFunction$1(value)) return;
        descriptor.enumerable = false;
        if ("writable" in descriptor) {
          descriptor.writable = false;
          return;
        }
        if (!descriptor.set) {
          descriptor.set = () => {
            throw Error("Can not rewrite read-only method '" + name + "'");
          };
        }
      });
    };
    var toObjectSet = (arrayOrString, delimiter) => {
      const obj = {};
      const define2 = (arr) => {
        arr.forEach((value) => {
          obj[value] = true;
        });
      };
      isArray(arrayOrString) ? define2(arrayOrString) : define2(String(arrayOrString).split(delimiter));
      return obj;
    };
    var noop = () => {
    };
    var toFiniteNumber = (value, defaultValue) => {
      return value != null && Number.isFinite(value = +value) ? value : defaultValue;
    };
    function isSpecCompliantForm(thing) {
      return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
    }
    var toJSONObject = (obj) => {
      const stack = new Array(10);
      const visit = (source, i) => {
        if (isObject(source)) {
          if (stack.indexOf(source) >= 0) {
            return;
          }
          if (isBuffer(source)) {
            return source;
          }
          if (!("toJSON" in source)) {
            stack[i] = source;
            const target = isArray(source) ? [] : {};
            forEach(source, (value, key) => {
              const reducedValue = visit(value, i + 1);
              !isUndefined(reducedValue) && (target[key] = reducedValue);
            });
            stack[i] = void 0;
            return target;
          }
        }
        return source;
      };
      return visit(obj, 0);
    };
    var isAsyncFn = kindOfTest("AsyncFunction");
    var isThenable = (thing) => thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
    var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
      if (setImmediateSupported) {
        return setImmediate;
      }
      return postMessageSupported ? ((token, callbacks) => {
        _global.addEventListener("message", ({ source, data }) => {
          if (source === _global && data === token) {
            callbacks.length && callbacks.shift()();
          }
        }, false);
        return (cb) => {
          callbacks.push(cb);
          _global.postMessage(token, "*");
        };
      })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
    })(
      typeof setImmediate === "function",
      isFunction$1(_global.postMessage)
    );
    var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
    var isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);
    var utils$1 = {
      isArray,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString,
      isNumber,
      isBoolean,
      isObject,
      isPlainObject,
      isEmptyObject,
      isReadableStream,
      isRequest,
      isResponse,
      isHeaders,
      isUndefined,
      isDate,
      isFile,
      isBlob,
      isRegExp,
      isFunction: isFunction$1,
      isStream,
      isURLSearchParams,
      isTypedArray,
      isFileList,
      forEach,
      merge,
      extend,
      trim,
      stripBOM,
      inherits,
      toFlatObject,
      kindOf,
      kindOfTest,
      endsWith,
      toArray,
      forEachEntry,
      matchAll,
      isHTMLForm,
      hasOwnProperty,
      hasOwnProp: hasOwnProperty,
      // an alias to avoid ESLint no-prototype-builtins detection
      reduceDescriptors,
      freezeMethods,
      toObjectSet,
      toCamelCase,
      noop,
      toFiniteNumber,
      findKey,
      global: _global,
      isContextDefined,
      isSpecCompliantForm,
      toJSONObject,
      isAsyncFn,
      isThenable,
      setImmediate: _setImmediate,
      asap,
      isIterable
    };
    function AxiosError(message, code, config, request, response) {
      Error.call(this);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error().stack;
      }
      this.message = message;
      this.name = "AxiosError";
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      if (response) {
        this.response = response;
        this.status = response.status ? response.status : null;
      }
    }
    utils$1.inherits(AxiosError, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: utils$1.toJSONObject(this.config),
          code: this.code,
          status: this.status
        };
      }
    });
    var prototype$1 = AxiosError.prototype;
    var descriptors = {};
    [
      "ERR_BAD_OPTION_VALUE",
      "ERR_BAD_OPTION",
      "ECONNABORTED",
      "ETIMEDOUT",
      "ERR_NETWORK",
      "ERR_FR_TOO_MANY_REDIRECTS",
      "ERR_DEPRECATED",
      "ERR_BAD_RESPONSE",
      "ERR_BAD_REQUEST",
      "ERR_CANCELED",
      "ERR_NOT_SUPPORT",
      "ERR_INVALID_URL"
      // eslint-disable-next-line func-names
    ].forEach((code) => {
      descriptors[code] = { value: code };
    });
    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype$1, "isAxiosError", { value: true });
    AxiosError.from = (error, code, config, request, response, customProps) => {
      const axiosError = Object.create(prototype$1);
      utils$1.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      }, (prop) => {
        return prop !== "isAxiosError";
      });
      const msg = error && error.message ? error.message : "Error";
      const errCode = code == null && error ? error.code : code;
      AxiosError.call(axiosError, msg, errCode, config, request, response);
      if (error && axiosError.cause == null) {
        Object.defineProperty(axiosError, "cause", { value: error, configurable: true });
      }
      axiosError.name = error && error.name || "Error";
      customProps && Object.assign(axiosError, customProps);
      return axiosError;
    };
    var httpAdapter = null;
    function isVisitable(thing) {
      return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
    }
    function removeBrackets(key) {
      return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
    }
    function renderKey(path, key, dots) {
      if (!path) return key;
      return path.concat(key).map(function each(token, i) {
        token = removeBrackets(token);
        return !dots && i ? "[" + token + "]" : token;
      }).join(dots ? "." : "");
    }
    function isFlatArray(arr) {
      return utils$1.isArray(arr) && !arr.some(isVisitable);
    }
    var predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
      return /^is[A-Z]/.test(prop);
    });
    function toFormData(obj, formData, options) {
      if (!utils$1.isObject(obj)) {
        throw new TypeError("target must be an object");
      }
      formData = formData || new FormData();
      options = utils$1.toFlatObject(options, {
        metaTokens: true,
        dots: false,
        indexes: false
      }, false, function defined(option, source) {
        return !utils$1.isUndefined(source[option]);
      });
      const metaTokens = options.metaTokens;
      const visitor = options.visitor || defaultVisitor;
      const dots = options.dots;
      const indexes = options.indexes;
      const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
      const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
      if (!utils$1.isFunction(visitor)) {
        throw new TypeError("visitor must be a function");
      }
      function convertValue(value) {
        if (value === null) return "";
        if (utils$1.isDate(value)) {
          return value.toISOString();
        }
        if (utils$1.isBoolean(value)) {
          return value.toString();
        }
        if (!useBlob && utils$1.isBlob(value)) {
          throw new AxiosError("Blob is not supported. Use a Buffer instead.");
        }
        if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
          return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
        }
        return value;
      }
      function defaultVisitor(value, key, path) {
        let arr = value;
        if (value && !path && typeof value === "object") {
          if (utils$1.endsWith(key, "{}")) {
            key = metaTokens ? key : key.slice(0, -2);
            value = JSON.stringify(value);
          } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
            key = removeBrackets(key);
            arr.forEach(function each(el, index) {
              !(utils$1.isUndefined(el) || el === null) && formData.append(
                // eslint-disable-next-line no-nested-ternary
                indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
                convertValue(el)
              );
            });
            return false;
          }
        }
        if (isVisitable(value)) {
          return true;
        }
        formData.append(renderKey(path, key, dots), convertValue(value));
        return false;
      }
      const stack = [];
      const exposedHelpers = Object.assign(predicates, {
        defaultVisitor,
        convertValue,
        isVisitable
      });
      function build(value, path) {
        if (utils$1.isUndefined(value)) return;
        if (stack.indexOf(value) !== -1) {
          throw Error("Circular reference detected in " + path.join("."));
        }
        stack.push(value);
        utils$1.forEach(value, function each(el, key) {
          const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
            formData,
            el,
            utils$1.isString(key) ? key.trim() : key,
            path,
            exposedHelpers
          );
          if (result === true) {
            build(el, path ? path.concat(key) : [key]);
          }
        });
        stack.pop();
      }
      if (!utils$1.isObject(obj)) {
        throw new TypeError("data must be an object");
      }
      build(obj);
      return formData;
    }
    function encode$1(str) {
      const charMap = {
        "!": "%21",
        "'": "%27",
        "(": "%28",
        ")": "%29",
        "~": "%7E",
        "%20": "+",
        "%00": "\0"
      };
      return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
        return charMap[match];
      });
    }
    function AxiosURLSearchParams(params, options) {
      this._pairs = [];
      params && toFormData(params, this, options);
    }
    var prototype = AxiosURLSearchParams.prototype;
    prototype.append = function append(name, value) {
      this._pairs.push([name, value]);
    };
    prototype.toString = function toString2(encoder) {
      const _encode = encoder ? function(value) {
        return encoder.call(this, value, encode$1);
      } : encode$1;
      return this._pairs.map(function each(pair) {
        return _encode(pair[0]) + "=" + _encode(pair[1]);
      }, "").join("&");
    };
    function encode(val) {
      return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
    }
    function buildURL(url, params, options) {
      if (!params) {
        return url;
      }
      const _encode = options && options.encode || encode;
      if (utils$1.isFunction(options)) {
        options = {
          serialize: options
        };
      }
      const serializeFn = options && options.serialize;
      let serializedParams;
      if (serializeFn) {
        serializedParams = serializeFn(params, options);
      } else {
        serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
      }
      if (serializedParams) {
        const hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
      }
      return url;
    }
    var InterceptorManager = class {
      constructor() {
        this.handlers = [];
      }
      /**
       * Add a new interceptor to the stack
       *
       * @param {Function} fulfilled The function to handle `then` for a `Promise`
       * @param {Function} rejected The function to handle `reject` for a `Promise`
       *
       * @return {Number} An ID used to remove interceptor later
       */
      use(fulfilled, rejected, options) {
        this.handlers.push({
          fulfilled,
          rejected,
          synchronous: options ? options.synchronous : false,
          runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
      }
      /**
       * Remove an interceptor from the stack
       *
       * @param {Number} id The ID that was returned by `use`
       *
       * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
       */
      eject(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      }
      /**
       * Clear all interceptors from the stack
       *
       * @returns {void}
       */
      clear() {
        if (this.handlers) {
          this.handlers = [];
        }
      }
      /**
       * Iterate over all the registered interceptors
       *
       * This method is particularly useful for skipping over any
       * interceptors that may have become `null` calling `eject`.
       *
       * @param {Function} fn The function to call for each interceptor
       *
       * @returns {void}
       */
      forEach(fn) {
        utils$1.forEach(this.handlers, function forEachHandler(h) {
          if (h !== null) {
            fn(h);
          }
        });
      }
    };
    var InterceptorManager$1 = InterceptorManager;
    var transitionalDefaults = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };
    var URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
    var FormData$1 = typeof FormData !== "undefined" ? FormData : null;
    var Blob$1 = typeof Blob !== "undefined" ? Blob : null;
    var platform$1 = {
      isBrowser: true,
      classes: {
        URLSearchParams: URLSearchParams$1,
        FormData: FormData$1,
        Blob: Blob$1
      },
      protocols: ["http", "https", "file", "blob", "url", "data"]
    };
    var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
    var _navigator = typeof navigator === "object" && navigator || void 0;
    var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
    var hasStandardBrowserWebWorkerEnv = (() => {
      return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
      self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
    })();
    var origin = hasBrowserEnv && window.location.href || "http://localhost";
    var utils = Object.freeze({
      __proto__: null,
      hasBrowserEnv,
      hasStandardBrowserWebWorkerEnv,
      hasStandardBrowserEnv,
      navigator: _navigator,
      origin
    });
    var platform = {
      ...utils,
      ...platform$1
    };
    function toURLEncodedForm(data, options) {
      return toFormData(data, new platform.classes.URLSearchParams(), {
        visitor: function(value, key, path, helpers) {
          if (platform.isNode && utils$1.isBuffer(value)) {
            this.append(key, value.toString("base64"));
            return false;
          }
          return helpers.defaultVisitor.apply(this, arguments);
        },
        ...options
      });
    }
    function parsePropPath(name) {
      return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
        return match[0] === "[]" ? "" : match[1] || match[0];
      });
    }
    function arrayToObject(arr) {
      const obj = {};
      const keys = Object.keys(arr);
      let i;
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        obj[key] = arr[key];
      }
      return obj;
    }
    function formDataToJSON(formData) {
      function buildPath(path, value, target, index) {
        let name = path[index++];
        if (name === "__proto__") return true;
        const isNumericKey = Number.isFinite(+name);
        const isLast = index >= path.length;
        name = !name && utils$1.isArray(target) ? target.length : name;
        if (isLast) {
          if (utils$1.hasOwnProp(target, name)) {
            target[name] = [target[name], value];
          } else {
            target[name] = value;
          }
          return !isNumericKey;
        }
        if (!target[name] || !utils$1.isObject(target[name])) {
          target[name] = [];
        }
        const result = buildPath(path, value, target[name], index);
        if (result && utils$1.isArray(target[name])) {
          target[name] = arrayToObject(target[name]);
        }
        return !isNumericKey;
      }
      if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
        const obj = {};
        utils$1.forEachEntry(formData, (name, value) => {
          buildPath(parsePropPath(name), value, obj, 0);
        });
        return obj;
      }
      return null;
    }
    function stringifySafely(rawValue, parser, encoder) {
      if (utils$1.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils$1.trim(rawValue);
        } catch (e) {
          if (e.name !== "SyntaxError") {
            throw e;
          }
        }
      }
      return (encoder || JSON.stringify)(rawValue);
    }
    var defaults = {
      transitional: transitionalDefaults,
      adapter: ["xhr", "http", "fetch"],
      transformRequest: [function transformRequest(data, headers) {
        const contentType = headers.getContentType() || "";
        const hasJSONContentType = contentType.indexOf("application/json") > -1;
        const isObjectPayload = utils$1.isObject(data);
        if (isObjectPayload && utils$1.isHTMLForm(data)) {
          data = new FormData(data);
        }
        const isFormData2 = utils$1.isFormData(data);
        if (isFormData2) {
          return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
        }
        if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) {
          return data;
        }
        if (utils$1.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils$1.isURLSearchParams(data)) {
          headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
          return data.toString();
        }
        let isFileList2;
        if (isObjectPayload) {
          if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
            return toURLEncodedForm(data, this.formSerializer).toString();
          }
          if ((isFileList2 = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
            const _FormData = this.env && this.env.FormData;
            return toFormData(
              isFileList2 ? { "files[]": data } : data,
              _FormData && new _FormData(),
              this.formSerializer
            );
          }
        }
        if (isObjectPayload || hasJSONContentType) {
          headers.setContentType("application/json", false);
          return stringifySafely(data);
        }
        return data;
      }],
      transformResponse: [function transformResponse(data) {
        const transitional = this.transitional || defaults.transitional;
        const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        const JSONRequested = this.responseType === "json";
        if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
          return data;
        }
        if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
          const silentJSONParsing = transitional && transitional.silentJSONParsing;
          const strictJSONParsing = !silentJSONParsing && JSONRequested;
          try {
            return JSON.parse(data, this.parseReviver);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === "SyntaxError") {
                throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }
        return data;
      }],
      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      maxContentLength: -1,
      maxBodyLength: -1,
      env: {
        FormData: platform.classes.FormData,
        Blob: platform.classes.Blob
      },
      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },
      headers: {
        common: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": void 0
        }
      }
    };
    utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
      defaults.headers[method] = {};
    });
    var defaults$1 = defaults;
    var ignoreDuplicateOf = utils$1.toObjectSet([
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent"
    ]);
    var parseHeaders = (rawHeaders) => {
      const parsed = {};
      let key;
      let val;
      let i;
      rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
        i = line.indexOf(":");
        key = line.substring(0, i).trim().toLowerCase();
        val = line.substring(i + 1).trim();
        if (!key || parsed[key] && ignoreDuplicateOf[key]) {
          return;
        }
        if (key === "set-cookie") {
          if (parsed[key]) {
            parsed[key].push(val);
          } else {
            parsed[key] = [val];
          }
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
        }
      });
      return parsed;
    };
    var $internals = Symbol("internals");
    function normalizeHeader(header) {
      return header && String(header).trim().toLowerCase();
    }
    function normalizeValue(value) {
      if (value === false || value == null) {
        return value;
      }
      return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
    }
    function parseTokens(str) {
      const tokens = /* @__PURE__ */ Object.create(null);
      const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
      let match;
      while (match = tokensRE.exec(str)) {
        tokens[match[1]] = match[2];
      }
      return tokens;
    }
    var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
    function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
      if (utils$1.isFunction(filter)) {
        return filter.call(this, value, header);
      }
      if (isHeaderNameFilter) {
        value = header;
      }
      if (!utils$1.isString(value)) return;
      if (utils$1.isString(filter)) {
        return value.indexOf(filter) !== -1;
      }
      if (utils$1.isRegExp(filter)) {
        return filter.test(value);
      }
    }
    function formatHeader(header) {
      return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
        return char.toUpperCase() + str;
      });
    }
    function buildAccessors(obj, header) {
      const accessorName = utils$1.toCamelCase(" " + header);
      ["get", "set", "has"].forEach((methodName) => {
        Object.defineProperty(obj, methodName + accessorName, {
          value: function(arg1, arg2, arg3) {
            return this[methodName].call(this, header, arg1, arg2, arg3);
          },
          configurable: true
        });
      });
    }
    var AxiosHeaders = class {
      constructor(headers) {
        headers && this.set(headers);
      }
      set(header, valueOrRewrite, rewrite) {
        const self2 = this;
        function setHeader(_value, _header, _rewrite) {
          const lHeader = normalizeHeader(_header);
          if (!lHeader) {
            throw new Error("header name must be a non-empty string");
          }
          const key = utils$1.findKey(self2, lHeader);
          if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
            self2[key || _header] = normalizeValue(_value);
          }
        }
        const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
        if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
          setHeaders(header, valueOrRewrite);
        } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
          setHeaders(parseHeaders(header), valueOrRewrite);
        } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
          let obj = {}, dest, key;
          for (const entry of header) {
            if (!utils$1.isArray(entry)) {
              throw TypeError("Object iterator must return a key-value pair");
            }
            obj[key = entry[0]] = (dest = obj[key]) ? utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
          }
          setHeaders(obj, valueOrRewrite);
        } else {
          header != null && setHeader(valueOrRewrite, header, rewrite);
        }
        return this;
      }
      get(header, parser) {
        header = normalizeHeader(header);
        if (header) {
          const key = utils$1.findKey(this, header);
          if (key) {
            const value = this[key];
            if (!parser) {
              return value;
            }
            if (parser === true) {
              return parseTokens(value);
            }
            if (utils$1.isFunction(parser)) {
              return parser.call(this, value, key);
            }
            if (utils$1.isRegExp(parser)) {
              return parser.exec(value);
            }
            throw new TypeError("parser must be boolean|regexp|function");
          }
        }
      }
      has(header, matcher) {
        header = normalizeHeader(header);
        if (header) {
          const key = utils$1.findKey(this, header);
          return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
        }
        return false;
      }
      delete(header, matcher) {
        const self2 = this;
        let deleted = false;
        function deleteHeader(_header) {
          _header = normalizeHeader(_header);
          if (_header) {
            const key = utils$1.findKey(self2, _header);
            if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
              delete self2[key];
              deleted = true;
            }
          }
        }
        if (utils$1.isArray(header)) {
          header.forEach(deleteHeader);
        } else {
          deleteHeader(header);
        }
        return deleted;
      }
      clear(matcher) {
        const keys = Object.keys(this);
        let i = keys.length;
        let deleted = false;
        while (i--) {
          const key = keys[i];
          if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
            delete this[key];
            deleted = true;
          }
        }
        return deleted;
      }
      normalize(format) {
        const self2 = this;
        const headers = {};
        utils$1.forEach(this, (value, header) => {
          const key = utils$1.findKey(headers, header);
          if (key) {
            self2[key] = normalizeValue(value);
            delete self2[header];
            return;
          }
          const normalized = format ? formatHeader(header) : String(header).trim();
          if (normalized !== header) {
            delete self2[header];
          }
          self2[normalized] = normalizeValue(value);
          headers[normalized] = true;
        });
        return this;
      }
      concat(...targets) {
        return this.constructor.concat(this, ...targets);
      }
      toJSON(asStrings) {
        const obj = /* @__PURE__ */ Object.create(null);
        utils$1.forEach(this, (value, header) => {
          value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
        });
        return obj;
      }
      [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]();
      }
      toString() {
        return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
      }
      getSetCookie() {
        return this.get("set-cookie") || [];
      }
      get [Symbol.toStringTag]() {
        return "AxiosHeaders";
      }
      static from(thing) {
        return thing instanceof this ? thing : new this(thing);
      }
      static concat(first, ...targets) {
        const computed = new this(first);
        targets.forEach((target) => computed.set(target));
        return computed;
      }
      static accessor(header) {
        const internals = this[$internals] = this[$internals] = {
          accessors: {}
        };
        const accessors = internals.accessors;
        const prototype2 = this.prototype;
        function defineAccessor(_header) {
          const lHeader = normalizeHeader(_header);
          if (!accessors[lHeader]) {
            buildAccessors(prototype2, _header);
            accessors[lHeader] = true;
          }
        }
        utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
        return this;
      }
    };
    AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
    utils$1.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
      let mapped = key[0].toUpperCase() + key.slice(1);
      return {
        get: () => value,
        set(headerValue) {
          this[mapped] = headerValue;
        }
      };
    });
    utils$1.freezeMethods(AxiosHeaders);
    var AxiosHeaders$1 = AxiosHeaders;
    function transformData(fns, response) {
      const config = this || defaults$1;
      const context = response || config;
      const headers = AxiosHeaders$1.from(context.headers);
      let data = context.data;
      utils$1.forEach(fns, function transform(fn) {
        data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
      });
      headers.normalize();
      return data;
    }
    function isCancel(value) {
      return !!(value && value.__CANCEL__);
    }
    function CanceledError(message, config, request) {
      AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
      this.name = "CanceledError";
    }
    utils$1.inherits(CanceledError, AxiosError, {
      __CANCEL__: true
    });
    function settle(resolve, reject, response) {
      const validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError(
          "Request failed with status code " + response.status,
          [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    }
    function parseProtocol(url) {
      const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || "";
    }
    function speedometer(samplesCount, min) {
      samplesCount = samplesCount || 10;
      const bytes = new Array(samplesCount);
      const timestamps = new Array(samplesCount);
      let head = 0;
      let tail = 0;
      let firstSampleTS;
      min = min !== void 0 ? min : 1e3;
      return function push(chunkLength) {
        const now = Date.now();
        const startedAt = timestamps[tail];
        if (!firstSampleTS) {
          firstSampleTS = now;
        }
        bytes[head] = chunkLength;
        timestamps[head] = now;
        let i = tail;
        let bytesCount = 0;
        while (i !== head) {
          bytesCount += bytes[i++];
          i = i % samplesCount;
        }
        head = (head + 1) % samplesCount;
        if (head === tail) {
          tail = (tail + 1) % samplesCount;
        }
        if (now - firstSampleTS < min) {
          return;
        }
        const passed = startedAt && now - startedAt;
        return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
      };
    }
    function throttle(fn, freq) {
      let timestamp = 0;
      let threshold = 1e3 / freq;
      let lastArgs;
      let timer;
      const invoke = (args, now = Date.now()) => {
        timestamp = now;
        lastArgs = null;
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        fn(...args);
      };
      const throttled = (...args) => {
        const now = Date.now();
        const passed = now - timestamp;
        if (passed >= threshold) {
          invoke(args, now);
        } else {
          lastArgs = args;
          if (!timer) {
            timer = setTimeout(() => {
              timer = null;
              invoke(lastArgs);
            }, threshold - passed);
          }
        }
      };
      const flush = () => lastArgs && invoke(lastArgs);
      return [throttled, flush];
    }
    var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
      let bytesNotified = 0;
      const _speedometer = speedometer(50, 250);
      return throttle((e) => {
        const loaded = e.loaded;
        const total = e.lengthComputable ? e.total : void 0;
        const progressBytes = loaded - bytesNotified;
        const rate = _speedometer(progressBytes);
        const inRange = loaded <= total;
        bytesNotified = loaded;
        const data = {
          loaded,
          total,
          progress: total ? loaded / total : void 0,
          bytes: progressBytes,
          rate: rate ? rate : void 0,
          estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
          event: e,
          lengthComputable: total != null,
          [isDownloadStream ? "download" : "upload"]: true
        };
        listener(data);
      }, freq);
    };
    var progressEventDecorator = (total, throttled) => {
      const lengthComputable = total != null;
      return [(loaded) => throttled[0]({
        lengthComputable,
        total,
        loaded
      }), throttled[1]];
    };
    var asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));
    var isURLSameOrigin = platform.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
      url = new URL(url, platform.origin);
      return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
    })(
      new URL(platform.origin),
      platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
    ) : () => true;
    var cookies = platform.hasStandardBrowserEnv ? (
      // Standard browser envs support document.cookie
      {
        write(name, value, expires, path, domain, secure) {
          const cookie = [name + "=" + encodeURIComponent(value)];
          utils$1.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
          utils$1.isString(path) && cookie.push("path=" + path);
          utils$1.isString(domain) && cookie.push("domain=" + domain);
          secure === true && cookie.push("secure");
          document.cookie = cookie.join("; ");
        },
        read(name) {
          const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
          return match ? decodeURIComponent(match[3]) : null;
        },
        remove(name) {
          this.write(name, "", Date.now() - 864e5);
        }
      }
    ) : (
      // Non-standard browser env (web workers, react-native) lack needed support.
      {
        write() {
        },
        read() {
          return null;
        },
        remove() {
        }
      }
    );
    function isAbsoluteURL(url) {
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    }
    function combineURLs(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
    }
    function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
      let isRelativeUrl = !isAbsoluteURL(requestedURL);
      if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    }
    var headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;
    function mergeConfig(config1, config2) {
      config2 = config2 || {};
      const config = {};
      function getMergedValue(target, source, prop, caseless) {
        if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
          return utils$1.merge.call({ caseless }, target, source);
        } else if (utils$1.isPlainObject(source)) {
          return utils$1.merge({}, source);
        } else if (utils$1.isArray(source)) {
          return source.slice();
        }
        return source;
      }
      function mergeDeepProperties(a, b, prop, caseless) {
        if (!utils$1.isUndefined(b)) {
          return getMergedValue(a, b, prop, caseless);
        } else if (!utils$1.isUndefined(a)) {
          return getMergedValue(void 0, a, prop, caseless);
        }
      }
      function valueFromConfig2(a, b) {
        if (!utils$1.isUndefined(b)) {
          return getMergedValue(void 0, b);
        }
      }
      function defaultToConfig2(a, b) {
        if (!utils$1.isUndefined(b)) {
          return getMergedValue(void 0, b);
        } else if (!utils$1.isUndefined(a)) {
          return getMergedValue(void 0, a);
        }
      }
      function mergeDirectKeys(a, b, prop) {
        if (prop in config2) {
          return getMergedValue(a, b);
        } else if (prop in config1) {
          return getMergedValue(void 0, a);
        }
      }
      const mergeMap = {
        url: valueFromConfig2,
        method: valueFromConfig2,
        data: valueFromConfig2,
        baseURL: defaultToConfig2,
        transformRequest: defaultToConfig2,
        transformResponse: defaultToConfig2,
        paramsSerializer: defaultToConfig2,
        timeout: defaultToConfig2,
        timeoutMessage: defaultToConfig2,
        withCredentials: defaultToConfig2,
        withXSRFToken: defaultToConfig2,
        adapter: defaultToConfig2,
        responseType: defaultToConfig2,
        xsrfCookieName: defaultToConfig2,
        xsrfHeaderName: defaultToConfig2,
        onUploadProgress: defaultToConfig2,
        onDownloadProgress: defaultToConfig2,
        decompress: defaultToConfig2,
        maxContentLength: defaultToConfig2,
        maxBodyLength: defaultToConfig2,
        beforeRedirect: defaultToConfig2,
        transport: defaultToConfig2,
        httpAgent: defaultToConfig2,
        httpsAgent: defaultToConfig2,
        cancelToken: defaultToConfig2,
        socketPath: defaultToConfig2,
        responseEncoding: defaultToConfig2,
        validateStatus: mergeDirectKeys,
        headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
      };
      utils$1.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
        const merge2 = mergeMap[prop] || mergeDeepProperties;
        const configValue = merge2(config1[prop], config2[prop], prop);
        utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
      });
      return config;
    }
    var resolveConfig = (config) => {
      const newConfig = mergeConfig({}, config);
      let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
      newConfig.headers = headers = AxiosHeaders$1.from(headers);
      newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
      if (auth) {
        headers.set(
          "Authorization",
          "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
        );
      }
      if (utils$1.isFormData(data)) {
        if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
          headers.setContentType(void 0);
        } else if (utils$1.isFunction(data.getHeaders)) {
          const formHeaders = data.getHeaders();
          const allowedHeaders = ["content-type", "content-length"];
          Object.entries(formHeaders).forEach(([key, val]) => {
            if (allowedHeaders.includes(key.toLowerCase())) {
              headers.set(key, val);
            }
          });
        }
      }
      if (platform.hasStandardBrowserEnv) {
        withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
        if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
          const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
          if (xsrfValue) {
            headers.set(xsrfHeaderName, xsrfValue);
          }
        }
      }
      return newConfig;
    };
    var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
    var xhrAdapter = isXHRAdapterSupported && function(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        const _config = resolveConfig(config);
        let requestData = _config.data;
        const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
        let { responseType, onUploadProgress, onDownloadProgress } = _config;
        let onCanceled;
        let uploadThrottled, downloadThrottled;
        let flushUpload, flushDownload;
        function done() {
          flushUpload && flushUpload();
          flushDownload && flushDownload();
          _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
          _config.signal && _config.signal.removeEventListener("abort", onCanceled);
        }
        let request = new XMLHttpRequest();
        request.open(_config.method.toUpperCase(), _config.url, true);
        request.timeout = _config.timeout;
        function onloadend() {
          if (!request) {
            return;
          }
          const responseHeaders = AxiosHeaders$1.from(
            "getAllResponseHeaders" in request && request.getAllResponseHeaders()
          );
          const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
          const response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          };
          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);
          request = null;
        }
        if ("onloadend" in request) {
          request.onloadend = onloadend;
        } else {
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
              return;
            }
            setTimeout(onloadend);
          };
        }
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }
          reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
          request = null;
        };
        request.onerror = function handleError(event) {
          const msg = event && event.message ? event.message : "Network Error";
          const err = new AxiosError(msg, AxiosError.ERR_NETWORK, config, request);
          err.event = event || null;
          reject(err);
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
          const transitional = _config.transitional || transitionalDefaults;
          if (_config.timeoutErrorMessage) {
            timeoutErrorMessage = _config.timeoutErrorMessage;
          }
          reject(new AxiosError(
            timeoutErrorMessage,
            transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
            config,
            request
          ));
          request = null;
        };
        requestData === void 0 && requestHeaders.setContentType(null);
        if ("setRequestHeader" in request) {
          utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
            request.setRequestHeader(key, val);
          });
        }
        if (!utils$1.isUndefined(_config.withCredentials)) {
          request.withCredentials = !!_config.withCredentials;
        }
        if (responseType && responseType !== "json") {
          request.responseType = _config.responseType;
        }
        if (onDownloadProgress) {
          [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
          request.addEventListener("progress", downloadThrottled);
        }
        if (onUploadProgress && request.upload) {
          [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
          request.upload.addEventListener("progress", uploadThrottled);
          request.upload.addEventListener("loadend", flushUpload);
        }
        if (_config.cancelToken || _config.signal) {
          onCanceled = (cancel) => {
            if (!request) {
              return;
            }
            reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
            request.abort();
            request = null;
          };
          _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
          if (_config.signal) {
            _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
          }
        }
        const protocol = parseProtocol(_config.url);
        if (protocol && platform.protocols.indexOf(protocol) === -1) {
          reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
          return;
        }
        request.send(requestData || null);
      });
    };
    var composeSignals = (signals, timeout) => {
      const { length } = signals = signals ? signals.filter(Boolean) : [];
      if (timeout || length) {
        let controller = new AbortController();
        let aborted;
        const onabort = function(reason) {
          if (!aborted) {
            aborted = true;
            unsubscribe();
            const err = reason instanceof Error ? reason : this.reason;
            controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
          }
        };
        let timer = timeout && setTimeout(() => {
          timer = null;
          onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
        }, timeout);
        const unsubscribe = () => {
          if (signals) {
            timer && clearTimeout(timer);
            timer = null;
            signals.forEach((signal2) => {
              signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
            });
            signals = null;
          }
        };
        signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
        const { signal } = controller;
        signal.unsubscribe = () => utils$1.asap(unsubscribe);
        return signal;
      }
    };
    var composeSignals$1 = composeSignals;
    var streamChunk = function* (chunk, chunkSize) {
      let len = chunk.byteLength;
      if (!chunkSize || len < chunkSize) {
        yield chunk;
        return;
      }
      let pos = 0;
      let end;
      while (pos < len) {
        end = pos + chunkSize;
        yield chunk.slice(pos, end);
        pos = end;
      }
    };
    var readBytes = async function* (iterable, chunkSize) {
      for await (const chunk of readStream(iterable)) {
        yield* streamChunk(chunk, chunkSize);
      }
    };
    var readStream = async function* (stream) {
      if (stream[Symbol.asyncIterator]) {
        yield* stream;
        return;
      }
      const reader = stream.getReader();
      try {
        for (; ; ) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          yield value;
        }
      } finally {
        await reader.cancel();
      }
    };
    var trackStream = (stream, chunkSize, onProgress, onFinish) => {
      const iterator2 = readBytes(stream, chunkSize);
      let bytes = 0;
      let done;
      let _onFinish = (e) => {
        if (!done) {
          done = true;
          onFinish && onFinish(e);
        }
      };
      return new ReadableStream({
        async pull(controller) {
          try {
            const { done: done2, value } = await iterator2.next();
            if (done2) {
              _onFinish();
              controller.close();
              return;
            }
            let len = value.byteLength;
            if (onProgress) {
              let loadedBytes = bytes += len;
              onProgress(loadedBytes);
            }
            controller.enqueue(new Uint8Array(value));
          } catch (err) {
            _onFinish(err);
            throw err;
          }
        },
        cancel(reason) {
          _onFinish(reason);
          return iterator2.return();
        }
      }, {
        highWaterMark: 2
      });
    };
    var DEFAULT_CHUNK_SIZE = 64 * 1024;
    var { isFunction } = utils$1;
    var globalFetchAPI = (({ Request, Response }) => ({
      Request,
      Response
    }))(utils$1.global);
    var {
      ReadableStream: ReadableStream$1,
      TextEncoder: TextEncoder2
    } = utils$1.global;
    var test = (fn, ...args) => {
      try {
        return !!fn(...args);
      } catch (e) {
        return false;
      }
    };
    var factory = (env) => {
      env = utils$1.merge.call({
        skipUndefined: true
      }, globalFetchAPI, env);
      const { fetch: envFetch, Request, Response } = env;
      const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === "function";
      const isRequestSupported = isFunction(Request);
      const isResponseSupported = isFunction(Response);
      if (!isFetchSupported) {
        return false;
      }
      const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream$1);
      const encodeText = isFetchSupported && (typeof TextEncoder2 === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder2()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
      const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
        let duplexAccessed = false;
        const hasContentType = new Request(platform.origin, {
          body: new ReadableStream$1(),
          method: "POST",
          get duplex() {
            duplexAccessed = true;
            return "half";
          }
        }).headers.has("Content-Type");
        return duplexAccessed && !hasContentType;
      });
      const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils$1.isReadableStream(new Response("").body));
      const resolvers = {
        stream: supportsResponseStream && ((res) => res.body)
      };
      isFetchSupported && (() => {
        ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
          !resolvers[type] && (resolvers[type] = (res, config) => {
            let method = res && res[type];
            if (method) {
              return method.call(res);
            }
            throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
          });
        });
      })();
      const getBodyLength = async (body) => {
        if (body == null) {
          return 0;
        }
        if (utils$1.isBlob(body)) {
          return body.size;
        }
        if (utils$1.isSpecCompliantForm(body)) {
          const _request = new Request(platform.origin, {
            method: "POST",
            body
          });
          return (await _request.arrayBuffer()).byteLength;
        }
        if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
          return body.byteLength;
        }
        if (utils$1.isURLSearchParams(body)) {
          body = body + "";
        }
        if (utils$1.isString(body)) {
          return (await encodeText(body)).byteLength;
        }
      };
      const resolveBodyLength = async (headers, body) => {
        const length = utils$1.toFiniteNumber(headers.getContentLength());
        return length == null ? getBodyLength(body) : length;
      };
      return async (config) => {
        let {
          url,
          method,
          data,
          signal,
          cancelToken,
          timeout,
          onDownloadProgress,
          onUploadProgress,
          responseType,
          headers,
          withCredentials = "same-origin",
          fetchOptions
        } = resolveConfig(config);
        let _fetch = envFetch || fetch;
        responseType = responseType ? (responseType + "").toLowerCase() : "text";
        let composedSignal = composeSignals$1([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
        let request = null;
        const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
          composedSignal.unsubscribe();
        });
        let requestContentLength;
        try {
          if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
            let _request = new Request(url, {
              method: "POST",
              body: data,
              duplex: "half"
            });
            let contentTypeHeader;
            if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
              headers.setContentType(contentTypeHeader);
            }
            if (_request.body) {
              const [onProgress, flush] = progressEventDecorator(
                requestContentLength,
                progressEventReducer(asyncDecorator(onUploadProgress))
              );
              data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
            }
          }
          if (!utils$1.isString(withCredentials)) {
            withCredentials = withCredentials ? "include" : "omit";
          }
          const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
          const resolvedOptions = {
            ...fetchOptions,
            signal: composedSignal,
            method: method.toUpperCase(),
            headers: headers.normalize().toJSON(),
            body: data,
            duplex: "half",
            credentials: isCredentialsSupported ? withCredentials : void 0
          };
          request = isRequestSupported && new Request(url, resolvedOptions);
          let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
          const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
          if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
            const options = {};
            ["status", "statusText", "headers"].forEach((prop) => {
              options[prop] = response[prop];
            });
            const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
            const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
              responseContentLength,
              progressEventReducer(asyncDecorator(onDownloadProgress), true)
            ) || [];
            response = new Response(
              trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
                flush && flush();
                unsubscribe && unsubscribe();
              }),
              options
            );
          }
          responseType = responseType || "text";
          let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config);
          !isStreamResponse && unsubscribe && unsubscribe();
          return await new Promise((resolve, reject) => {
            settle(resolve, reject, {
              data: responseData,
              headers: AxiosHeaders$1.from(response.headers),
              status: response.status,
              statusText: response.statusText,
              config,
              request
            });
          });
        } catch (err) {
          unsubscribe && unsubscribe();
          if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
            throw Object.assign(
              new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request),
              {
                cause: err.cause || err
              }
            );
          }
          throw AxiosError.from(err, err && err.code, config, request);
        }
      };
    };
    var seedCache = /* @__PURE__ */ new Map();
    var getFetch = (config) => {
      let env = config ? config.env : {};
      const { fetch: fetch2, Request, Response } = env;
      const seeds = [
        Request,
        Response,
        fetch2
      ];
      let len = seeds.length, i = len, seed, target, map = seedCache;
      while (i--) {
        seed = seeds[i];
        target = map.get(seed);
        target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
        map = target;
      }
      return target;
    };
    getFetch();
    var knownAdapters = {
      http: httpAdapter,
      xhr: xhrAdapter,
      fetch: {
        get: getFetch
      }
    };
    utils$1.forEach(knownAdapters, (fn, value) => {
      if (fn) {
        try {
          Object.defineProperty(fn, "name", { value });
        } catch (e) {
        }
        Object.defineProperty(fn, "adapterName", { value });
      }
    });
    var renderReason = (reason) => `- ${reason}`;
    var isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
    var adapters = {
      getAdapter: (adapters2, config) => {
        adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
        const { length } = adapters2;
        let nameOrAdapter;
        let adapter;
        const rejectedReasons = {};
        for (let i = 0; i < length; i++) {
          nameOrAdapter = adapters2[i];
          let id;
          adapter = nameOrAdapter;
          if (!isResolvedHandle(nameOrAdapter)) {
            adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
            if (adapter === void 0) {
              throw new AxiosError(`Unknown adapter '${id}'`);
            }
          }
          if (adapter && (utils$1.isFunction(adapter) || (adapter = adapter.get(config)))) {
            break;
          }
          rejectedReasons[id || "#" + i] = adapter;
        }
        if (!adapter) {
          const reasons = Object.entries(rejectedReasons).map(
            ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
          );
          let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
          throw new AxiosError(
            `There is no suitable adapter to dispatch the request ` + s,
            "ERR_NOT_SUPPORT"
          );
        }
        return adapter;
      },
      adapters: knownAdapters
    };
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
      if (config.signal && config.signal.aborted) {
        throw new CanceledError(null, config);
      }
    }
    function dispatchRequest(config) {
      throwIfCancellationRequested(config);
      config.headers = AxiosHeaders$1.from(config.headers);
      config.data = transformData.call(
        config,
        config.transformRequest
      );
      if (["post", "put", "patch"].indexOf(config.method) !== -1) {
        config.headers.setContentType("application/x-www-form-urlencoded", false);
      }
      const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter, config);
      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        response.data = transformData.call(
          config,
          config.transformResponse,
          response
        );
        response.headers = AxiosHeaders$1.from(response.headers);
        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              config.transformResponse,
              reason.response
            );
            reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
          }
        }
        return Promise.reject(reason);
      });
    }
    var VERSION = "1.12.2";
    var validators$1 = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
      validators$1[type] = function validator2(thing) {
        return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
      };
    });
    var deprecatedWarnings = {};
    validators$1.transitional = function transitional(validator2, version, message) {
      function formatMessage(opt, desc) {
        return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
      }
      return (value, opt, opts) => {
        if (validator2 === false) {
          throw new AxiosError(
            formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
            AxiosError.ERR_DEPRECATED
          );
        }
        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          console.warn(
            formatMessage(
              opt,
              " has been deprecated since v" + version + " and will be removed in the near future"
            )
          );
        }
        return validator2 ? validator2(value, opt, opts) : true;
      };
    };
    validators$1.spelling = function spelling(correctSpelling) {
      return (value, opt) => {
        console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
        return true;
      };
    };
    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== "object") {
        throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
      }
      const keys = Object.keys(options);
      let i = keys.length;
      while (i-- > 0) {
        const opt = keys[i];
        const validator2 = schema[opt];
        if (validator2) {
          const value = options[opt];
          const result = value === void 0 || validator2(value, opt, options);
          if (result !== true) {
            throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
        }
      }
    }
    var validator = {
      assertOptions,
      validators: validators$1
    };
    var validators = validator.validators;
    var Axios = class {
      constructor(instanceConfig) {
        this.defaults = instanceConfig || {};
        this.interceptors = {
          request: new InterceptorManager$1(),
          response: new InterceptorManager$1()
        };
      }
      /**
       * Dispatch a request
       *
       * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
       * @param {?Object} config
       *
       * @returns {Promise} The Promise to be fulfilled
       */
      async request(configOrUrl, config) {
        try {
          return await this._request(configOrUrl, config);
        } catch (err) {
          if (err instanceof Error) {
            let dummy = {};
            Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
            const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
            try {
              if (!err.stack) {
                err.stack = stack;
              } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
                err.stack += "\n" + stack;
              }
            } catch (e) {
            }
          }
          throw err;
        }
      }
      _request(configOrUrl, config) {
        if (typeof configOrUrl === "string") {
          config = config || {};
          config.url = configOrUrl;
        } else {
          config = configOrUrl || {};
        }
        config = mergeConfig(this.defaults, config);
        const { transitional, paramsSerializer, headers } = config;
        if (transitional !== void 0) {
          validator.assertOptions(transitional, {
            silentJSONParsing: validators.transitional(validators.boolean),
            forcedJSONParsing: validators.transitional(validators.boolean),
            clarifyTimeoutError: validators.transitional(validators.boolean)
          }, false);
        }
        if (paramsSerializer != null) {
          if (utils$1.isFunction(paramsSerializer)) {
            config.paramsSerializer = {
              serialize: paramsSerializer
            };
          } else {
            validator.assertOptions(paramsSerializer, {
              encode: validators.function,
              serialize: validators.function
            }, true);
          }
        }
        if (config.allowAbsoluteUrls !== void 0) ;
        else if (this.defaults.allowAbsoluteUrls !== void 0) {
          config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
        } else {
          config.allowAbsoluteUrls = true;
        }
        validator.assertOptions(config, {
          baseUrl: validators.spelling("baseURL"),
          withXsrfToken: validators.spelling("withXSRFToken")
        }, true);
        config.method = (config.method || this.defaults.method || "get").toLowerCase();
        let contextHeaders = headers && utils$1.merge(
          headers.common,
          headers[config.method]
        );
        headers && utils$1.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          (method) => {
            delete headers[method];
          }
        );
        config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
        const requestInterceptorChain = [];
        let synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
          if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
            return;
          }
          synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
          requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        const responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
          responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });
        let promise;
        let i = 0;
        let len;
        if (!synchronousRequestInterceptors) {
          const chain = [dispatchRequest.bind(this), void 0];
          chain.unshift(...requestInterceptorChain);
          chain.push(...responseInterceptorChain);
          len = chain.length;
          promise = Promise.resolve(config);
          while (i < len) {
            promise = promise.then(chain[i++], chain[i++]);
          }
          return promise;
        }
        len = requestInterceptorChain.length;
        let newConfig = config;
        while (i < len) {
          const onFulfilled = requestInterceptorChain[i++];
          const onRejected = requestInterceptorChain[i++];
          try {
            newConfig = onFulfilled(newConfig);
          } catch (error) {
            onRejected.call(this, error);
            break;
          }
        }
        try {
          promise = dispatchRequest.call(this, newConfig);
        } catch (error) {
          return Promise.reject(error);
        }
        i = 0;
        len = responseInterceptorChain.length;
        while (i < len) {
          promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
        }
        return promise;
      }
      getUri(config) {
        config = mergeConfig(this.defaults, config);
        const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
        return buildURL(fullPath, config.params, config.paramsSerializer);
      }
    };
    utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          url,
          data: (config || {}).data
        }));
      };
    });
    utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method,
            headers: isForm ? {
              "Content-Type": "multipart/form-data"
            } : {},
            url,
            data
          }));
        };
      }
      Axios.prototype[method] = generateHTTPMethod();
      Axios.prototype[method + "Form"] = generateHTTPMethod(true);
    });
    var Axios$1 = Axios;
    var CancelToken = class _CancelToken {
      constructor(executor) {
        if (typeof executor !== "function") {
          throw new TypeError("executor must be a function.");
        }
        let resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
          resolvePromise = resolve;
        });
        const token = this;
        this.promise.then((cancel) => {
          if (!token._listeners) return;
          let i = token._listeners.length;
          while (i-- > 0) {
            token._listeners[i](cancel);
          }
          token._listeners = null;
        });
        this.promise.then = (onfulfilled) => {
          let _resolve;
          const promise = new Promise((resolve) => {
            token.subscribe(resolve);
            _resolve = resolve;
          }).then(onfulfilled);
          promise.cancel = function reject() {
            token.unsubscribe(_resolve);
          };
          return promise;
        };
        executor(function cancel(message, config, request) {
          if (token.reason) {
            return;
          }
          token.reason = new CanceledError(message, config, request);
          resolvePromise(token.reason);
        });
      }
      /**
       * Throws a `CanceledError` if cancellation has been requested.
       */
      throwIfRequested() {
        if (this.reason) {
          throw this.reason;
        }
      }
      /**
       * Subscribe to the cancel signal
       */
      subscribe(listener) {
        if (this.reason) {
          listener(this.reason);
          return;
        }
        if (this._listeners) {
          this._listeners.push(listener);
        } else {
          this._listeners = [listener];
        }
      }
      /**
       * Unsubscribe from the cancel signal
       */
      unsubscribe(listener) {
        if (!this._listeners) {
          return;
        }
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
          this._listeners.splice(index, 1);
        }
      }
      toAbortSignal() {
        const controller = new AbortController();
        const abort = (err) => {
          controller.abort(err);
        };
        this.subscribe(abort);
        controller.signal.unsubscribe = () => this.unsubscribe(abort);
        return controller.signal;
      }
      /**
       * Returns an object that contains a new `CancelToken` and a function that, when called,
       * cancels the `CancelToken`.
       */
      static source() {
        let cancel;
        const token = new _CancelToken(function executor(c) {
          cancel = c;
        });
        return {
          token,
          cancel
        };
      }
    };
    var CancelToken$1 = CancelToken;
    function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    }
    function isAxiosError(payload) {
      return utils$1.isObject(payload) && payload.isAxiosError === true;
    }
    var HttpStatusCode = {
      Continue: 100,
      SwitchingProtocols: 101,
      Processing: 102,
      EarlyHints: 103,
      Ok: 200,
      Created: 201,
      Accepted: 202,
      NonAuthoritativeInformation: 203,
      NoContent: 204,
      ResetContent: 205,
      PartialContent: 206,
      MultiStatus: 207,
      AlreadyReported: 208,
      ImUsed: 226,
      MultipleChoices: 300,
      MovedPermanently: 301,
      Found: 302,
      SeeOther: 303,
      NotModified: 304,
      UseProxy: 305,
      Unused: 306,
      TemporaryRedirect: 307,
      PermanentRedirect: 308,
      BadRequest: 400,
      Unauthorized: 401,
      PaymentRequired: 402,
      Forbidden: 403,
      NotFound: 404,
      MethodNotAllowed: 405,
      NotAcceptable: 406,
      ProxyAuthenticationRequired: 407,
      RequestTimeout: 408,
      Conflict: 409,
      Gone: 410,
      LengthRequired: 411,
      PreconditionFailed: 412,
      PayloadTooLarge: 413,
      UriTooLong: 414,
      UnsupportedMediaType: 415,
      RangeNotSatisfiable: 416,
      ExpectationFailed: 417,
      ImATeapot: 418,
      MisdirectedRequest: 421,
      UnprocessableEntity: 422,
      Locked: 423,
      FailedDependency: 424,
      TooEarly: 425,
      UpgradeRequired: 426,
      PreconditionRequired: 428,
      TooManyRequests: 429,
      RequestHeaderFieldsTooLarge: 431,
      UnavailableForLegalReasons: 451,
      InternalServerError: 500,
      NotImplemented: 501,
      BadGateway: 502,
      ServiceUnavailable: 503,
      GatewayTimeout: 504,
      HttpVersionNotSupported: 505,
      VariantAlsoNegotiates: 506,
      InsufficientStorage: 507,
      LoopDetected: 508,
      NotExtended: 510,
      NetworkAuthenticationRequired: 511
    };
    Object.entries(HttpStatusCode).forEach(([key, value]) => {
      HttpStatusCode[value] = key;
    });
    var HttpStatusCode$1 = HttpStatusCode;
    function createInstance(defaultConfig) {
      const context = new Axios$1(defaultConfig);
      const instance = bind(Axios$1.prototype.request, context);
      utils$1.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
      utils$1.extend(instance, context, null, { allOwnKeys: true });
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };
      return instance;
    }
    var axios = createInstance(defaults$1);
    axios.Axios = Axios$1;
    axios.CanceledError = CanceledError;
    axios.CancelToken = CancelToken$1;
    axios.isCancel = isCancel;
    axios.VERSION = VERSION;
    axios.toFormData = toFormData;
    axios.AxiosError = AxiosError;
    axios.Cancel = axios.CanceledError;
    axios.all = function all(promises) {
      return Promise.all(promises);
    };
    axios.spread = spread;
    axios.isAxiosError = isAxiosError;
    axios.mergeConfig = mergeConfig;
    axios.AxiosHeaders = AxiosHeaders$1;
    axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
    axios.getAdapter = adapters.getAdapter;
    axios.HttpStatusCode = HttpStatusCode$1;
    axios.default = axios;
    module.exports = axios;
  }
});

// node_modules/@stellar/stellar-sdk/lib/http-client/axios-client.js
var require_axios_client = __commonJS({
  "node_modules/@stellar/stellar-sdk/lib/http-client/axios-client.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.create = exports.axiosClient = void 0;
    var _axios = _interopRequireDefault(require_axios());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var axiosClient = exports.axiosClient = _axios.default;
    var create = exports.create = _axios.default.create;
  }
});

// node_modules/@stellar/stellar-sdk/lib/http-client/index.js
var require_http_client = __commonJS({
  "node_modules/@stellar/stellar-sdk/lib/http-client/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _exportNames = {
      httpClient: true,
      create: true
    };
    exports.httpClient = exports.create = void 0;
    var _types = require_types();
    Object.keys(_types).forEach(function(key) {
      if (key === "default" || key === "__esModule") return;
      if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
      if (key in exports && exports[key] === _types[key]) return;
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
          return _types[key];
        }
      });
    });
    var httpClient;
    var create;
    if (true) {
      axiosModule = require_axios_client();
      exports.httpClient = httpClient = axiosModule.axiosClient;
      exports.create = create = axiosModule.create;
    } else {
      fetchModule = null;
      exports.httpClient = httpClient = fetchModule.fetchClient;
      exports.create = create = fetchModule.create;
    }
    var axiosModule;
    var fetchModule;
  }
});

// node_modules/@stellar/stellar-sdk/lib/rpc/axios.js
var require_axios2 = __commonJS({
  "node_modules/@stellar/stellar-sdk/lib/rpc/axios.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.version = exports.default = exports.AxiosClient = void 0;
    var _httpClient = require_http_client();
    var version = exports.version = "14.2.0";
    var AxiosClient = exports.AxiosClient = (0, _httpClient.create)({
      headers: {
        "X-Client-Name": "js-soroban-client",
        "X-Client-Version": version
      }
    });
    var _default = exports.default = AxiosClient;
  }
});

// node_modules/@stellar/stellar-sdk/lib/rpc/jsonrpc.js
var require_jsonrpc = __commonJS({
  "node_modules/@stellar/stellar-sdk/lib/rpc/jsonrpc.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.postObject = postObject;
    var _axios = _interopRequireDefault(require_axios2());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function _regenerator() {
      var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag";
      function i(r2, n2, o2, i2) {
        var c2 = n2 && n2.prototype instanceof Generator ? n2 : Generator, u2 = Object.create(c2.prototype);
        return _regeneratorDefine2(u2, "_invoke", (function(r3, n3, o3) {
          var i3, c3, u3, f2 = 0, p = o3 || [], y = false, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d2(t2, r4) {
            return i3 = t2, c3 = 0, u3 = e, G.n = r4, a;
          } };
          function d(r4, n4) {
            for (c3 = r4, u3 = n4, t = 0; !y && f2 && !o4 && t < p.length; t++) {
              var o4, i4 = p[t], d2 = G.p, l = i4[2];
              r4 > 3 ? (o4 = l === n4) && (u3 = i4[(c3 = i4[4]) ? 5 : (c3 = 3, 3)], i4[4] = i4[5] = e) : i4[0] <= d2 && ((o4 = r4 < 2 && d2 < i4[1]) ? (c3 = 0, G.v = n4, G.n = i4[1]) : d2 < l && (o4 = r4 < 3 || i4[0] > n4 || n4 > l) && (i4[4] = r4, i4[5] = n4, G.n = l, c3 = 0));
            }
            if (o4 || r4 > 1) return a;
            throw y = true, n4;
          }
          return function(o4, p2, l) {
            if (f2 > 1) throw TypeError("Generator is already running");
            for (y && 1 === p2 && d(p2, l), c3 = p2, u3 = l; (t = c3 < 2 ? e : u3) || !y; ) {
              i3 || (c3 ? c3 < 3 ? (c3 > 1 && (G.n = -1), d(c3, u3)) : G.n = u3 : G.v = u3);
              try {
                if (f2 = 2, i3) {
                  if (c3 || (o4 = "next"), t = i3[o4]) {
                    if (!(t = t.call(i3, u3))) throw TypeError("iterator result is not an object");
                    if (!t.done) return t;
                    u3 = t.value, c3 < 2 && (c3 = 0);
                  } else 1 === c3 && (t = i3.return) && t.call(i3), c3 < 2 && (u3 = TypeError("The iterator does not provide a '" + o4 + "' method"), c3 = 1);
                  i3 = e;
                } else if ((t = (y = G.n < 0) ? u3 : r3.call(n3, G)) !== a) break;
              } catch (t2) {
                i3 = e, c3 = 1, u3 = t2;
              } finally {
                f2 = 1;
              }
            }
            return { value: t, done: y };
          };
        })(r2, o2, i2), true), u2;
      }
      var a = {};
      function Generator() {
      }
      function GeneratorFunction() {
      }
      function GeneratorFunctionPrototype() {
      }
      t = Object.getPrototypeOf;
      var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function() {
        return this;
      }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
      function f(e2) {
        return Object.setPrototypeOf ? Object.setPrototypeOf(e2, GeneratorFunctionPrototype) : (e2.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e2, o, "GeneratorFunction")), e2.prototype = Object.create(u), e2;
      }
      return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function() {
        return this;
      }), _regeneratorDefine2(u, "toString", function() {
        return "[object Generator]";
      }), (_regenerator = function _regenerator2() {
        return { w: i, m: f };
      })();
    }
    function _regeneratorDefine2(e, r, n, t) {
      var i = Object.defineProperty;
      try {
        i({}, "", {});
      } catch (e2) {
        i = 0;
      }
      _regeneratorDefine2 = function _regeneratorDefine(e2, r2, n2, t2) {
        function o(r3, n3) {
          _regeneratorDefine2(e2, r3, function(e3) {
            return this._invoke(r3, n3, e3);
          });
        }
        r2 ? i ? i(e2, r2, { value: n2, enumerable: !t2, configurable: !t2, writable: !t2 }) : e2[r2] = n2 : (o("next", 0), o("throw", 1), o("return", 2));
      }, _regeneratorDefine2(e, r, n, t);
    }
    function asyncGeneratorStep(n, t, e, r, o, a, c) {
      try {
        var i = n[a](c), u = i.value;
      } catch (n2) {
        return void e(n2);
      }
      i.done ? t(u) : Promise.resolve(u).then(r, o);
    }
    function _asyncToGenerator(n) {
      return function() {
        var t = this, e = arguments;
        return new Promise(function(r, o) {
          var a = n.apply(t, e);
          function _next(n2) {
            asyncGeneratorStep(a, r, o, _next, _throw, "next", n2);
          }
          function _throw(n2) {
            asyncGeneratorStep(a, r, o, _next, _throw, "throw", n2);
          }
          _next(void 0);
        });
      };
    }
    function hasOwnProperty(obj, prop) {
      return obj.hasOwnProperty(prop);
    }
    function postObject(_x, _x2) {
      return _postObject.apply(this, arguments);
    }
    function _postObject() {
      _postObject = _asyncToGenerator(_regenerator().m(function _callee(url, method) {
        var param, response, _response$data, _args = arguments;
        return _regenerator().w(function(_context) {
          while (1) switch (_context.n) {
            case 0:
              param = _args.length > 2 && _args[2] !== void 0 ? _args[2] : null;
              _context.n = 1;
              return _axios.default.post(url, {
                jsonrpc: "2.0",
                id: 1,
                method,
                params: param
              });
            case 1:
              response = _context.v;
              if (!hasOwnProperty(response.data, "error")) {
                _context.n = 2;
                break;
              }
              throw response.data.error;
            case 2:
              return _context.a(2, (_response$data = response.data) === null || _response$data === void 0 ? void 0 : _response$data.result);
            case 3:
              return _context.a(2);
          }
        }, _callee);
      }));
      return _postObject.apply(this, arguments);
    }
  }
});

// node_modules/@stellar/stellar-sdk/lib/rpc/parsers.js
var require_parsers = __commonJS({
  "node_modules/@stellar/stellar-sdk/lib/rpc/parsers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.parseRawEvents = parseRawEvents;
    exports.parseRawLedgerEntries = parseRawLedgerEntries;
    exports.parseRawSendTransaction = parseRawSendTransaction;
    exports.parseRawSimulation = parseRawSimulation;
    exports.parseRawTransactions = parseRawTransactions;
    exports.parseTransactionInfo = parseTransactionInfo;
    var _stellarBase = require_stellar_base_min();
    var _api = require_api();
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == _typeof(i) ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != _typeof(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function parseRawSendTransaction(raw) {
      var errorResultXdr = raw.errorResultXdr, diagnosticEventsXdr = raw.diagnosticEventsXdr;
      delete raw.errorResultXdr;
      delete raw.diagnosticEventsXdr;
      if (errorResultXdr) {
        return _objectSpread(_objectSpread(_objectSpread({}, raw), diagnosticEventsXdr !== void 0 && diagnosticEventsXdr.length > 0 && {
          diagnosticEvents: diagnosticEventsXdr.map(function(evt) {
            return _stellarBase.xdr.DiagnosticEvent.fromXDR(evt, "base64");
          })
        }), {}, {
          errorResult: _stellarBase.xdr.TransactionResult.fromXDR(errorResultXdr, "base64")
        });
      }
      return _objectSpread({}, raw);
    }
    function parseTransactionInfo(raw) {
      var _raw$events$contractE, _raw$events, _raw$events$transacti, _raw$events2;
      var meta = _stellarBase.xdr.TransactionMeta.fromXDR(raw.resultMetaXdr, "base64");
      var info = {
        ledger: raw.ledger,
        createdAt: raw.createdAt,
        applicationOrder: raw.applicationOrder,
        feeBump: raw.feeBump,
        envelopeXdr: _stellarBase.xdr.TransactionEnvelope.fromXDR(raw.envelopeXdr, "base64"),
        resultXdr: _stellarBase.xdr.TransactionResult.fromXDR(raw.resultXdr, "base64"),
        resultMetaXdr: meta,
        events: {
          contractEventsXdr: ((_raw$events$contractE = (_raw$events = raw.events) === null || _raw$events === void 0 ? void 0 : _raw$events.contractEventsXdr) !== null && _raw$events$contractE !== void 0 ? _raw$events$contractE : []).map(function(lst) {
            return lst.map(function(e) {
              return _stellarBase.xdr.ContractEvent.fromXDR(e, "base64");
            });
          }),
          transactionEventsXdr: ((_raw$events$transacti = (_raw$events2 = raw.events) === null || _raw$events2 === void 0 ? void 0 : _raw$events2.transactionEventsXdr) !== null && _raw$events$transacti !== void 0 ? _raw$events$transacti : []).map(function(e) {
            return _stellarBase.xdr.TransactionEvent.fromXDR(e, "base64");
          })
        }
      };
      switch (meta.switch()) {
        case 3:
        case 4:
          var metaV = meta.value();
          if (metaV.sorobanMeta() !== null) {
            var _metaV$sorobanMeta$re, _metaV$sorobanMeta;
            info.returnValue = (_metaV$sorobanMeta$re = (_metaV$sorobanMeta = metaV.sorobanMeta()) === null || _metaV$sorobanMeta === void 0 ? void 0 : _metaV$sorobanMeta.returnValue()) !== null && _metaV$sorobanMeta$re !== void 0 ? _metaV$sorobanMeta$re : void 0;
          }
      }
      if (raw.diagnosticEventsXdr) {
        info.diagnosticEventsXdr = raw.diagnosticEventsXdr.map(function(e) {
          return _stellarBase.xdr.DiagnosticEvent.fromXDR(e, "base64");
        });
      }
      return info;
    }
    function parseRawTransactions(r) {
      return _objectSpread({
        status: r.status,
        txHash: r.txHash
      }, parseTransactionInfo(r));
    }
    function parseRawEvents(raw) {
      var _raw$events3;
      return {
        latestLedger: raw.latestLedger,
        oldestLedger: raw.oldestLedger,
        latestLedgerCloseTime: raw.latestLedgerCloseTime,
        oldestLedgerCloseTime: raw.oldestLedgerCloseTime,
        cursor: raw.cursor,
        events: ((_raw$events3 = raw.events) !== null && _raw$events3 !== void 0 ? _raw$events3 : []).map(function(evt) {
          var clone = _objectSpread({}, evt);
          delete clone.contractId;
          return _objectSpread(_objectSpread(_objectSpread({}, clone), evt.contractId !== "" && {
            contractId: new _stellarBase.Contract(evt.contractId)
          }), {}, {
            topic: evt.topic.map(function(topic) {
              return _stellarBase.xdr.ScVal.fromXDR(topic, "base64");
            }),
            value: _stellarBase.xdr.ScVal.fromXDR(evt.value, "base64")
          });
        })
      };
    }
    function parseRawLedgerEntries(raw) {
      var _raw$entries;
      return {
        latestLedger: raw.latestLedger,
        entries: ((_raw$entries = raw.entries) !== null && _raw$entries !== void 0 ? _raw$entries : []).map(function(rawEntry) {
          if (!rawEntry.key || !rawEntry.xdr) {
            throw new TypeError("invalid ledger entry: ".concat(JSON.stringify(rawEntry)));
          }
          return _objectSpread({
            lastModifiedLedgerSeq: rawEntry.lastModifiedLedgerSeq,
            key: _stellarBase.xdr.LedgerKey.fromXDR(rawEntry.key, "base64"),
            val: _stellarBase.xdr.LedgerEntryData.fromXDR(rawEntry.xdr, "base64")
          }, rawEntry.liveUntilLedgerSeq !== void 0 && {
            liveUntilLedgerSeq: rawEntry.liveUntilLedgerSeq
          });
        })
      };
    }
    function parseSuccessful(sim, partial) {
      var _sim$results$length, _sim$results, _sim$stateChanges$len, _sim$stateChanges, _sim$stateChanges2;
      var success = _objectSpread(_objectSpread(_objectSpread({}, partial), {}, {
        transactionData: new _stellarBase.SorobanDataBuilder(sim.transactionData),
        minResourceFee: sim.minResourceFee
      }, ((_sim$results$length = (_sim$results = sim.results) === null || _sim$results === void 0 ? void 0 : _sim$results.length) !== null && _sim$results$length !== void 0 ? _sim$results$length : 0 > 0) && {
        result: sim.results.map(function(row) {
          var _row$auth;
          return {
            auth: ((_row$auth = row.auth) !== null && _row$auth !== void 0 ? _row$auth : []).map(function(entry) {
              return _stellarBase.xdr.SorobanAuthorizationEntry.fromXDR(entry, "base64");
            }),
            retval: row.xdr ? _stellarBase.xdr.ScVal.fromXDR(row.xdr, "base64") : _stellarBase.xdr.ScVal.scvVoid()
          };
        })[0]
      }), ((_sim$stateChanges$len = (_sim$stateChanges = sim.stateChanges) === null || _sim$stateChanges === void 0 ? void 0 : _sim$stateChanges.length) !== null && _sim$stateChanges$len !== void 0 ? _sim$stateChanges$len : 0 > 0) && {
        stateChanges: (_sim$stateChanges2 = sim.stateChanges) === null || _sim$stateChanges2 === void 0 ? void 0 : _sim$stateChanges2.map(function(entryChange) {
          return {
            type: entryChange.type,
            key: _stellarBase.xdr.LedgerKey.fromXDR(entryChange.key, "base64"),
            before: entryChange.before ? _stellarBase.xdr.LedgerEntry.fromXDR(entryChange.before, "base64") : null,
            after: entryChange.after ? _stellarBase.xdr.LedgerEntry.fromXDR(entryChange.after, "base64") : null
          };
        })
      });
      if (!sim.restorePreamble || sim.restorePreamble.transactionData === "") {
        return success;
      }
      return _objectSpread(_objectSpread({}, success), {}, {
        restorePreamble: {
          minResourceFee: sim.restorePreamble.minResourceFee,
          transactionData: new _stellarBase.SorobanDataBuilder(sim.restorePreamble.transactionData)
        }
      });
    }
    function parseRawSimulation(sim) {
      var _sim$events$map, _sim$events;
      var looksRaw = _api.Api.isSimulationRaw(sim);
      if (!looksRaw) {
        return sim;
      }
      var base = {
        _parsed: true,
        id: sim.id,
        latestLedger: sim.latestLedger,
        events: (_sim$events$map = (_sim$events = sim.events) === null || _sim$events === void 0 ? void 0 : _sim$events.map(function(evt) {
          return _stellarBase.xdr.DiagnosticEvent.fromXDR(evt, "base64");
        })) !== null && _sim$events$map !== void 0 ? _sim$events$map : []
      };
      if (typeof sim.error === "string") {
        return _objectSpread(_objectSpread({}, base), {}, {
          error: sim.error
        });
      }
      return parseSuccessful(sim, base);
    }
  }
});

// node_modules/@stellar/stellar-sdk/lib/rpc/transaction.js
var require_transaction = __commonJS({
  "node_modules/@stellar/stellar-sdk/lib/rpc/transaction.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.assembleTransaction = assembleTransaction;
    var _stellarBase = require_stellar_base_min();
    var _api = require_api();
    var _parsers = require_parsers();
    function isSorobanTransaction(tx) {
      if (tx.operations.length !== 1) {
        return false;
      }
      switch (tx.operations[0].type) {
        case "invokeHostFunction":
        case "extendFootprintTtl":
        case "restoreFootprint":
          return true;
        default:
          return false;
      }
    }
    function assembleTransaction(raw, simulation) {
      if ("innerTransaction" in raw) {
        return assembleTransaction(raw.innerTransaction, simulation);
      }
      if (!isSorobanTransaction(raw)) {
        throw new TypeError("unsupported transaction: must contain exactly one invokeHostFunction, extendFootprintTtl, or restoreFootprint operation");
      }
      var success = (0, _parsers.parseRawSimulation)(simulation);
      if (!_api.Api.isSimulationSuccess(success)) {
        throw new Error("simulation incorrect: ".concat(JSON.stringify(success)));
      }
      var classicFeeNum = parseInt(raw.fee) || 0;
      var minResourceFeeNum = parseInt(success.minResourceFee) || 0;
      var txnBuilder = _stellarBase.TransactionBuilder.cloneFrom(raw, {
        fee: (classicFeeNum + minResourceFeeNum).toString(),
        sorobanData: success.transactionData.build(),
        networkPassphrase: raw.networkPassphrase
      });
      if (raw.operations[0].type === "invokeHostFunction") {
        var _invokeOp$auth;
        txnBuilder.clearOperations();
        var invokeOp = raw.operations[0];
        var existingAuth = (_invokeOp$auth = invokeOp.auth) !== null && _invokeOp$auth !== void 0 ? _invokeOp$auth : [];
        txnBuilder.addOperation(_stellarBase.Operation.invokeHostFunction({
          source: invokeOp.source,
          func: invokeOp.func,
          auth: existingAuth.length > 0 ? existingAuth : success.result.auth
        }));
      }
      return txnBuilder;
    }
  }
});

// node_modules/@stellar/stellar-sdk/lib/utils.js
var require_utils = __commonJS({
  "node_modules/@stellar/stellar-sdk/lib/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Utils = void 0;
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    function _classCallCheck(a, n) {
      if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties(e, r) {
      for (var t = 0; t < r.length; t++) {
        var o = r[t];
        o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
      }
    }
    function _createClass(e, r, t) {
      return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: false }), e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == _typeof(i) ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != _typeof(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    var Utils = exports.Utils = (function() {
      function Utils2() {
        _classCallCheck(this, Utils2);
      }
      return _createClass(Utils2, null, [{
        key: "validateTimebounds",
        value: function validateTimebounds(transaction) {
          var gracePeriod = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          if (!transaction.timeBounds) {
            return false;
          }
          var now = Math.floor(Date.now() / 1e3);
          var _transaction$timeBoun = transaction.timeBounds, minTime = _transaction$timeBoun.minTime, maxTime = _transaction$timeBoun.maxTime;
          return now >= Number.parseInt(minTime, 10) - gracePeriod && now <= Number.parseInt(maxTime, 10) + gracePeriod;
        }
      }, {
        key: "sleep",
        value: function sleep(ms) {
          return new Promise(function(resolve) {
            return setTimeout(resolve, ms);
          });
        }
      }]);
    })();
  }
});

// node_modules/@stellar/stellar-sdk/lib/rpc/server.js
var require_server = __commonJS({
  "node_modules/@stellar/stellar-sdk/lib/rpc/server.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SUBMIT_TRANSACTION_TIMEOUT = exports.RpcServer = exports.LinearSleepStrategy = exports.Durability = exports.BasicSleepStrategy = void 0;
    var _urijs = _interopRequireDefault(require_URI());
    var _stellarBase = require_stellar_base_min();
    var _axios = _interopRequireDefault(require_axios2());
    var jsonrpc = _interopRequireWildcard(require_jsonrpc());
    var _api = require_api();
    var _transaction = require_transaction();
    var _parsers = require_parsers();
    var _utils = require_utils();
    function _interopRequireWildcard(e, t) {
      if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
      return (_interopRequireWildcard = function _interopRequireWildcard2(e2, t2) {
        if (!t2 && e2 && e2.__esModule) return e2;
        var o, i, f = { __proto__: null, default: e2 };
        if (null === e2 || "object" != _typeof(e2) && "function" != typeof e2) return f;
        if (o = t2 ? n : r) {
          if (o.has(e2)) return o.get(e2);
          o.set(e2, f);
        }
        for (var _t9 in e2) "default" !== _t9 && {}.hasOwnProperty.call(e2, _t9) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e2, _t9)) && (i.get || i.set) ? o(f, _t9, i) : f[_t9] = e2[_t9]);
        return f;
      })(e, t);
    }
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r2) {
          return Object.getOwnPropertyDescriptor(e, r2).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
          _defineProperty(e, r2, t[r2]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
          Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
        });
      }
      return e;
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
    }
    function _regenerator() {
      var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag";
      function i(r2, n2, o2, i2) {
        var c2 = n2 && n2.prototype instanceof Generator ? n2 : Generator, u2 = Object.create(c2.prototype);
        return _regeneratorDefine2(u2, "_invoke", (function(r3, n3, o3) {
          var i3, c3, u3, f2 = 0, p = o3 || [], y = false, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d2(t2, r4) {
            return i3 = t2, c3 = 0, u3 = e, G.n = r4, a;
          } };
          function d(r4, n4) {
            for (c3 = r4, u3 = n4, t = 0; !y && f2 && !o4 && t < p.length; t++) {
              var o4, i4 = p[t], d2 = G.p, l = i4[2];
              r4 > 3 ? (o4 = l === n4) && (u3 = i4[(c3 = i4[4]) ? 5 : (c3 = 3, 3)], i4[4] = i4[5] = e) : i4[0] <= d2 && ((o4 = r4 < 2 && d2 < i4[1]) ? (c3 = 0, G.v = n4, G.n = i4[1]) : d2 < l && (o4 = r4 < 3 || i4[0] > n4 || n4 > l) && (i4[4] = r4, i4[5] = n4, G.n = l, c3 = 0));
            }
            if (o4 || r4 > 1) return a;
            throw y = true, n4;
          }
          return function(o4, p2, l) {
            if (f2 > 1) throw TypeError("Generator is already running");
            for (y && 1 === p2 && d(p2, l), c3 = p2, u3 = l; (t = c3 < 2 ? e : u3) || !y; ) {
              i3 || (c3 ? c3 < 3 ? (c3 > 1 && (G.n = -1), d(c3, u3)) : G.n = u3 : G.v = u3);
              try {
                if (f2 = 2, i3) {
                  if (c3 || (o4 = "next"), t = i3[o4]) {
                    if (!(t = t.call(i3, u3))) throw TypeError("iterator result is not an object");
                    if (!t.done) return t;
                    u3 = t.value, c3 < 2 && (c3 = 0);
                  } else 1 === c3 && (t = i3.return) && t.call(i3), c3 < 2 && (u3 = TypeError("The iterator does not provide a '" + o4 + "' method"), c3 = 1);
                  i3 = e;
                } else if ((t = (y = G.n < 0) ? u3 : r3.call(n3, G)) !== a) break;
              } catch (t2) {
                i3 = e, c3 = 1, u3 = t2;
              } finally {
                f2 = 1;
              }
            }
            return { value: t, done: y };
          };
        })(r2, o2, i2), true), u2;
      }
      var a = {};
      function Generator() {
      }
      function GeneratorFunction() {
      }
      function GeneratorFunctionPrototype() {
      }
      t = Object.getPrototypeOf;
      var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function() {
        return this;
      }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
      function f(e2) {
        return Object.setPrototypeOf ? Object.setPrototypeOf(e2, GeneratorFunctionPrototype) : (e2.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e2, o, "GeneratorFunction")), e2.prototype = Object.create(u), e2;
      }
      return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function() {
        return this;
      }), _regeneratorDefine2(u, "toString", function() {
        return "[object Generator]";
      }), (_regenerator = function _regenerator2() {
        return { w: i, m: f };
      })();
    }
    function _regeneratorDefine2(e, r, n, t) {
      var i = Object.defineProperty;
      try {
        i({}, "", {});
      } catch (e2) {
        i = 0;
      }
      _regeneratorDefine2 = function _regeneratorDefine(e2, r2, n2, t2) {
        function o(r3, n3) {
          _regeneratorDefine2(e2, r3, function(e3) {
            return this._invoke(r3, n3, e3);
          });
        }
        r2 ? i ? i(e2, r2, { value: n2, enumerable: !t2, configurable: !t2, writable: !t2 }) : e2[r2] = n2 : (o("next", 0), o("throw", 1), o("return", 2));
      }, _regeneratorDefine2(e, r, n, t);
    }
    function asyncGeneratorStep(n, t, e, r, o, a, c) {
      try {
        var i = n[a](c), u = i.value;
      } catch (n2) {
        return void e(n2);
      }
      i.done ? t(u) : Promise.resolve(u).then(r, o);
    }
    function _asyncToGenerator(n) {
      return function() {
        var t = this, e = arguments;
        return new Promise(function(r, o) {
          var a = n.apply(t, e);
          function _next(n2) {
            asyncGeneratorStep(a, r, o, _next, _throw, "next", n2);
          }
          function _throw(n2) {
            asyncGeneratorStep(a, r, o, _next, _throw, "throw", n2);
          }
          _next(void 0);
        });
      };
    }
    function _classCallCheck(a, n) {
      if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties(e, r) {
      for (var t = 0; t < r.length; t++) {
        var o = r[t];
        o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
      }
    }
    function _createClass(e, r, t) {
      return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: false }), e;
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == _typeof(i) ? i : i + "";
    }
    function _toPrimitive(t, r) {
      if ("object" != _typeof(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    var SUBMIT_TRANSACTION_TIMEOUT = exports.SUBMIT_TRANSACTION_TIMEOUT = 60 * 1e3;
    var Durability = exports.Durability = (function(Durability2) {
      Durability2["Temporary"] = "temporary";
      Durability2["Persistent"] = "persistent";
      return Durability2;
    })({});
    var DEFAULT_GET_TRANSACTION_TIMEOUT = 30;
    var BasicSleepStrategy = exports.BasicSleepStrategy = function BasicSleepStrategy2(_iter) {
      return 1e3;
    };
    var LinearSleepStrategy = exports.LinearSleepStrategy = function LinearSleepStrategy2(iter) {
      return 1e3 * iter;
    };
    function findCreatedAccountSequenceInTransactionMeta(meta) {
      var _operations$flatMap$f;
      var operations = [];
      switch (meta.switch()) {
        case 0:
          operations = meta.operations();
          break;
        case 1:
        case 2:
        case 3:
        case 4:
          operations = meta.value().operations();
          break;
        default:
          throw new Error("Unexpected transaction meta switch value");
      }
      var sequenceNumber = (_operations$flatMap$f = operations.flatMap(function(op) {
        return op.changes();
      }).find(function(c) {
        return c.switch() === _stellarBase.xdr.LedgerEntryChangeType.ledgerEntryCreated() && c.created().data().switch() === _stellarBase.xdr.LedgerEntryType.account();
      })) === null || _operations$flatMap$f === void 0 || (_operations$flatMap$f = _operations$flatMap$f.created()) === null || _operations$flatMap$f === void 0 || (_operations$flatMap$f = _operations$flatMap$f.data()) === null || _operations$flatMap$f === void 0 || (_operations$flatMap$f = _operations$flatMap$f.account()) === null || _operations$flatMap$f === void 0 || (_operations$flatMap$f = _operations$flatMap$f.seqNum()) === null || _operations$flatMap$f === void 0 ? void 0 : _operations$flatMap$f.toString();
      if (sequenceNumber) {
        return sequenceNumber;
      }
      throw new Error("No account created in transaction");
    }
    var RpcServer = exports.RpcServer = (function() {
      function RpcServer2(serverURL) {
        var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        _classCallCheck(this, RpcServer2);
        this.serverURL = (0, _urijs.default)(serverURL);
        if (opts.headers && Object.keys(opts.headers).length !== 0) {
          _axios.default.interceptors.request.use(function(config) {
            config.headers = Object.assign(config.headers, opts.headers);
            return config;
          });
        }
        if (this.serverURL.protocol() !== "https" && !opts.allowHttp) {
          throw new Error("Cannot connect to insecure Soroban RPC server if `allowHttp` isn't set");
        }
      }
      return _createClass(RpcServer2, [{
        key: "getAccount",
        value: (function() {
          var _getAccount = _asyncToGenerator(_regenerator().m(function _callee(address) {
            var entry;
            return _regenerator().w(function(_context) {
              while (1) switch (_context.n) {
                case 0:
                  _context.n = 1;
                  return this.getAccountEntry(address);
                case 1:
                  entry = _context.v;
                  return _context.a(2, new _stellarBase.Account(address, entry.seqNum().toString()));
              }
            }, _callee, this);
          }));
          function getAccount(_x) {
            return _getAccount.apply(this, arguments);
          }
          return getAccount;
        })()
      }, {
        key: "getAccountEntry",
        value: (function() {
          var _getAccountEntry = _asyncToGenerator(_regenerator().m(function _callee2(address) {
            var ledgerKey, resp, _t;
            return _regenerator().w(function(_context2) {
              while (1) switch (_context2.p = _context2.n) {
                case 0:
                  ledgerKey = _stellarBase.xdr.LedgerKey.account(new _stellarBase.xdr.LedgerKeyAccount({
                    accountId: _stellarBase.Keypair.fromPublicKey(address).xdrPublicKey()
                  }));
                  _context2.p = 1;
                  _context2.n = 2;
                  return this.getLedgerEntry(ledgerKey);
                case 2:
                  resp = _context2.v;
                  return _context2.a(2, resp.val.account());
                case 3:
                  _context2.p = 3;
                  _t = _context2.v;
                  throw new Error("Account not found: ".concat(address));
                case 4:
                  return _context2.a(2);
              }
            }, _callee2, this, [[1, 3]]);
          }));
          function getAccountEntry(_x2) {
            return _getAccountEntry.apply(this, arguments);
          }
          return getAccountEntry;
        })()
      }, {
        key: "getTrustline",
        value: (function() {
          var _getTrustline = _asyncToGenerator(_regenerator().m(function _callee3(account, asset) {
            var trustlineLedgerKey, entry, _t2;
            return _regenerator().w(function(_context3) {
              while (1) switch (_context3.p = _context3.n) {
                case 0:
                  trustlineLedgerKey = _stellarBase.xdr.LedgerKey.trustline(new _stellarBase.xdr.LedgerKeyTrustLine({
                    accountId: _stellarBase.Keypair.fromPublicKey(account).xdrAccountId(),
                    asset: asset.toTrustLineXDRObject()
                  }));
                  _context3.p = 1;
                  _context3.n = 2;
                  return this.getLedgerEntry(trustlineLedgerKey);
                case 2:
                  entry = _context3.v;
                  return _context3.a(2, entry.val.trustLine());
                case 3:
                  _context3.p = 3;
                  _t2 = _context3.v;
                  throw new Error("Trustline for ".concat(asset.getCode(), ":").concat(asset.getIssuer(), " not found for ").concat(account));
                case 4:
                  return _context3.a(2);
              }
            }, _callee3, this, [[1, 3]]);
          }));
          function getTrustline(_x3, _x4) {
            return _getTrustline.apply(this, arguments);
          }
          return getTrustline;
        })()
      }, {
        key: "getClaimableBalance",
        value: (function() {
          var _getClaimableBalance = _asyncToGenerator(_regenerator().m(function _callee4(id) {
            var balanceId, buffer, v, trustlineLedgerKey, entry, _t3;
            return _regenerator().w(function(_context4) {
              while (1) switch (_context4.p = _context4.n) {
                case 0:
                  if (!_stellarBase.StrKey.isValidClaimableBalance(id)) {
                    _context4.n = 1;
                    break;
                  }
                  buffer = _stellarBase.StrKey.decodeClaimableBalance(id);
                  v = Buffer.concat([Buffer.from("\0\0\0"), buffer.subarray(0, 1)]);
                  balanceId = _stellarBase.xdr.ClaimableBalanceId.fromXDR(Buffer.concat([v, buffer.subarray(1)]));
                  _context4.n = 4;
                  break;
                case 1:
                  if (!id.match(/[a-f0-9]{72}/i)) {
                    _context4.n = 2;
                    break;
                  }
                  balanceId = _stellarBase.xdr.ClaimableBalanceId.fromXDR(id, "hex");
                  _context4.n = 4;
                  break;
                case 2:
                  if (!id.match(/[a-f0-9]{64}/i)) {
                    _context4.n = 3;
                    break;
                  }
                  balanceId = _stellarBase.xdr.ClaimableBalanceId.fromXDR(id.padStart(72, "0"), "hex");
                  _context4.n = 4;
                  break;
                case 3:
                  throw new TypeError("expected 72-char hex ID or strkey, not ".concat(id));
                case 4:
                  trustlineLedgerKey = _stellarBase.xdr.LedgerKey.claimableBalance(new _stellarBase.xdr.LedgerKeyClaimableBalance({
                    balanceId
                  }));
                  _context4.p = 5;
                  _context4.n = 6;
                  return this.getLedgerEntry(trustlineLedgerKey);
                case 6:
                  entry = _context4.v;
                  return _context4.a(2, entry.val.claimableBalance());
                case 7:
                  _context4.p = 7;
                  _t3 = _context4.v;
                  throw new Error("Claimable balance ".concat(id, " not found"));
                case 8:
                  return _context4.a(2);
              }
            }, _callee4, this, [[5, 7]]);
          }));
          function getClaimableBalance(_x5) {
            return _getClaimableBalance.apply(this, arguments);
          }
          return getClaimableBalance;
        })()
      }, {
        key: "getHealth",
        value: (function() {
          var _getHealth = _asyncToGenerator(_regenerator().m(function _callee5() {
            return _regenerator().w(function(_context5) {
              while (1) switch (_context5.n) {
                case 0:
                  return _context5.a(2, jsonrpc.postObject(this.serverURL.toString(), "getHealth"));
              }
            }, _callee5, this);
          }));
          function getHealth() {
            return _getHealth.apply(this, arguments);
          }
          return getHealth;
        })()
      }, {
        key: "getContractData",
        value: (function() {
          var _getContractData = _asyncToGenerator(_regenerator().m(function _callee6(contract, key) {
            var durability, scAddress, xdrDurability, contractKey, _args6 = arguments, _t4, _t5;
            return _regenerator().w(function(_context6) {
              while (1) switch (_context6.p = _context6.n) {
                case 0:
                  durability = _args6.length > 2 && _args6[2] !== void 0 ? _args6[2] : Durability.Persistent;
                  if (!(typeof contract === "string")) {
                    _context6.n = 1;
                    break;
                  }
                  scAddress = new _stellarBase.Contract(contract).address().toScAddress();
                  _context6.n = 4;
                  break;
                case 1:
                  if (!(contract instanceof _stellarBase.Address)) {
                    _context6.n = 2;
                    break;
                  }
                  scAddress = contract.toScAddress();
                  _context6.n = 4;
                  break;
                case 2:
                  if (!(contract instanceof _stellarBase.Contract)) {
                    _context6.n = 3;
                    break;
                  }
                  scAddress = contract.address().toScAddress();
                  _context6.n = 4;
                  break;
                case 3:
                  throw new TypeError("unknown contract type: ".concat(contract));
                case 4:
                  _t4 = durability;
                  _context6.n = _t4 === Durability.Temporary ? 5 : _t4 === Durability.Persistent ? 6 : 7;
                  break;
                case 5:
                  xdrDurability = _stellarBase.xdr.ContractDataDurability.temporary();
                  return _context6.a(3, 8);
                case 6:
                  xdrDurability = _stellarBase.xdr.ContractDataDurability.persistent();
                  return _context6.a(3, 8);
                case 7:
                  throw new TypeError("invalid durability: ".concat(durability));
                case 8:
                  contractKey = _stellarBase.xdr.LedgerKey.contractData(new _stellarBase.xdr.LedgerKeyContractData({
                    key,
                    contract: scAddress,
                    durability: xdrDurability
                  }));
                  _context6.p = 9;
                  _context6.n = 10;
                  return this.getLedgerEntry(contractKey);
                case 10:
                  return _context6.a(2, _context6.v);
                case 11:
                  _context6.p = 11;
                  _t5 = _context6.v;
                  throw {
                    code: 404,
                    message: "Contract data not found for ".concat(_stellarBase.Address.fromScAddress(scAddress).toString(), " with key ").concat(key.toXDR("base64"), " and durability: ").concat(durability)
                  };
                case 12:
                  return _context6.a(2);
              }
            }, _callee6, this, [[9, 11]]);
          }));
          function getContractData(_x6, _x7) {
            return _getContractData.apply(this, arguments);
          }
          return getContractData;
        })()
      }, {
        key: "getContractWasmByContractId",
        value: (function() {
          var _getContractWasmByContractId = _asyncToGenerator(_regenerator().m(function _callee7(contractId) {
            var _response$entries$;
            var contractLedgerKey, response, wasmHash;
            return _regenerator().w(function(_context7) {
              while (1) switch (_context7.n) {
                case 0:
                  contractLedgerKey = new _stellarBase.Contract(contractId).getFootprint();
                  _context7.n = 1;
                  return this.getLedgerEntries(contractLedgerKey);
                case 1:
                  response = _context7.v;
                  if (!(!response.entries.length || !((_response$entries$ = response.entries[0]) !== null && _response$entries$ !== void 0 && _response$entries$.val))) {
                    _context7.n = 2;
                    break;
                  }
                  return _context7.a(2, Promise.reject({
                    code: 404,
                    message: "Could not obtain contract hash from server"
                  }));
                case 2:
                  wasmHash = response.entries[0].val.contractData().val().instance().executable().wasmHash();
                  return _context7.a(2, this.getContractWasmByHash(wasmHash));
              }
            }, _callee7, this);
          }));
          function getContractWasmByContractId(_x8) {
            return _getContractWasmByContractId.apply(this, arguments);
          }
          return getContractWasmByContractId;
        })()
      }, {
        key: "getContractWasmByHash",
        value: (function() {
          var _getContractWasmByHash = _asyncToGenerator(_regenerator().m(function _callee8(wasmHash) {
            var _responseWasm$entries;
            var format, wasmHashBuffer, ledgerKeyWasmHash, responseWasm, wasmBuffer, _args8 = arguments;
            return _regenerator().w(function(_context8) {
              while (1) switch (_context8.n) {
                case 0:
                  format = _args8.length > 1 && _args8[1] !== void 0 ? _args8[1] : void 0;
                  wasmHashBuffer = typeof wasmHash === "string" ? Buffer.from(wasmHash, format) : wasmHash;
                  ledgerKeyWasmHash = _stellarBase.xdr.LedgerKey.contractCode(new _stellarBase.xdr.LedgerKeyContractCode({
                    hash: wasmHashBuffer
                  }));
                  _context8.n = 1;
                  return this.getLedgerEntries(ledgerKeyWasmHash);
                case 1:
                  responseWasm = _context8.v;
                  if (!(!responseWasm.entries.length || !((_responseWasm$entries = responseWasm.entries[0]) !== null && _responseWasm$entries !== void 0 && _responseWasm$entries.val))) {
                    _context8.n = 2;
                    break;
                  }
                  return _context8.a(2, Promise.reject({
                    code: 404,
                    message: "Could not obtain contract wasm from server"
                  }));
                case 2:
                  wasmBuffer = responseWasm.entries[0].val.contractCode().code();
                  return _context8.a(2, wasmBuffer);
              }
            }, _callee8, this);
          }));
          function getContractWasmByHash(_x9) {
            return _getContractWasmByHash.apply(this, arguments);
          }
          return getContractWasmByHash;
        })()
      }, {
        key: "getLedgerEntries",
        value: function getLedgerEntries() {
          return this._getLedgerEntries.apply(this, arguments).then(_parsers.parseRawLedgerEntries);
        }
      }, {
        key: "_getLedgerEntries",
        value: function _getLedgerEntries() {
          for (var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++) {
            keys[_key] = arguments[_key];
          }
          return jsonrpc.postObject(this.serverURL.toString(), "getLedgerEntries", {
            keys: keys.map(function(k) {
              return k.toXDR("base64");
            })
          });
        }
      }, {
        key: "getLedgerEntry",
        value: (function() {
          var _getLedgerEntry = _asyncToGenerator(_regenerator().m(function _callee9(key) {
            var results;
            return _regenerator().w(function(_context9) {
              while (1) switch (_context9.n) {
                case 0:
                  _context9.n = 1;
                  return this._getLedgerEntries(key).then(_parsers.parseRawLedgerEntries);
                case 1:
                  results = _context9.v;
                  if (!(results.entries.length !== 1)) {
                    _context9.n = 2;
                    break;
                  }
                  throw new Error("failed to find an entry for key ".concat(key.toXDR("base64")));
                case 2:
                  return _context9.a(2, results.entries[0]);
              }
            }, _callee9, this);
          }));
          function getLedgerEntry(_x0) {
            return _getLedgerEntry.apply(this, arguments);
          }
          return getLedgerEntry;
        })()
      }, {
        key: "pollTransaction",
        value: (function() {
          var _pollTransaction = _asyncToGenerator(_regenerator().m(function _callee0(hash, opts) {
            var _opts$attempts, _opts$attempts2;
            var maxAttempts, foundInfo, attempt, _opts$sleepStrategy;
            return _regenerator().w(function(_context0) {
              while (1) switch (_context0.n) {
                case 0:
                  maxAttempts = ((_opts$attempts = opts === null || opts === void 0 ? void 0 : opts.attempts) !== null && _opts$attempts !== void 0 ? _opts$attempts : 0) < 1 ? DEFAULT_GET_TRANSACTION_TIMEOUT : (_opts$attempts2 = opts === null || opts === void 0 ? void 0 : opts.attempts) !== null && _opts$attempts2 !== void 0 ? _opts$attempts2 : DEFAULT_GET_TRANSACTION_TIMEOUT;
                  attempt = 1;
                case 1:
                  if (!(attempt < maxAttempts)) {
                    _context0.n = 5;
                    break;
                  }
                  _context0.n = 2;
                  return this.getTransaction(hash);
                case 2:
                  foundInfo = _context0.v;
                  if (!(foundInfo.status !== _api.Api.GetTransactionStatus.NOT_FOUND)) {
                    _context0.n = 3;
                    break;
                  }
                  return _context0.a(2, foundInfo);
                case 3:
                  _context0.n = 4;
                  return _utils.Utils.sleep(((_opts$sleepStrategy = opts === null || opts === void 0 ? void 0 : opts.sleepStrategy) !== null && _opts$sleepStrategy !== void 0 ? _opts$sleepStrategy : BasicSleepStrategy)(attempt));
                case 4:
                  attempt++;
                  _context0.n = 1;
                  break;
                case 5:
                  return _context0.a(2, foundInfo);
              }
            }, _callee0, this);
          }));
          function pollTransaction(_x1, _x10) {
            return _pollTransaction.apply(this, arguments);
          }
          return pollTransaction;
        })()
      }, {
        key: "getTransaction",
        value: (function() {
          var _getTransaction2 = _asyncToGenerator(_regenerator().m(function _callee1(hash) {
            return _regenerator().w(function(_context1) {
              while (1) switch (_context1.n) {
                case 0:
                  return _context1.a(2, this._getTransaction(hash).then(function(raw) {
                    var foundInfo = {};
                    if (raw.status !== _api.Api.GetTransactionStatus.NOT_FOUND) {
                      Object.assign(foundInfo, (0, _parsers.parseTransactionInfo)(raw));
                    }
                    var result = _objectSpread({
                      status: raw.status,
                      txHash: hash,
                      latestLedger: raw.latestLedger,
                      latestLedgerCloseTime: raw.latestLedgerCloseTime,
                      oldestLedger: raw.oldestLedger,
                      oldestLedgerCloseTime: raw.oldestLedgerCloseTime
                    }, foundInfo);
                    return result;
                  }));
              }
            }, _callee1, this);
          }));
          function getTransaction(_x11) {
            return _getTransaction2.apply(this, arguments);
          }
          return getTransaction;
        })()
      }, {
        key: "_getTransaction",
        value: (function() {
          var _getTransaction3 = _asyncToGenerator(_regenerator().m(function _callee10(hash) {
            return _regenerator().w(function(_context10) {
              while (1) switch (_context10.n) {
                case 0:
                  return _context10.a(2, jsonrpc.postObject(this.serverURL.toString(), "getTransaction", {
                    hash
                  }));
              }
            }, _callee10, this);
          }));
          function _getTransaction(_x12) {
            return _getTransaction3.apply(this, arguments);
          }
          return _getTransaction;
        })()
      }, {
        key: "getTransactions",
        value: (function() {
          var _getTransactions2 = _asyncToGenerator(_regenerator().m(function _callee11(request) {
            return _regenerator().w(function(_context11) {
              while (1) switch (_context11.n) {
                case 0:
                  return _context11.a(2, this._getTransactions(request).then(function(raw) {
                    var result = {
                      transactions: (raw.transactions || []).map(_parsers.parseRawTransactions),
                      latestLedger: raw.latestLedger,
                      latestLedgerCloseTimestamp: raw.latestLedgerCloseTimestamp,
                      oldestLedger: raw.oldestLedger,
                      oldestLedgerCloseTimestamp: raw.oldestLedgerCloseTimestamp,
                      cursor: raw.cursor
                    };
                    return result;
                  }));
              }
            }, _callee11, this);
          }));
          function getTransactions(_x13) {
            return _getTransactions2.apply(this, arguments);
          }
          return getTransactions;
        })()
      }, {
        key: "_getTransactions",
        value: (function() {
          var _getTransactions3 = _asyncToGenerator(_regenerator().m(function _callee12(request) {
            return _regenerator().w(function(_context12) {
              while (1) switch (_context12.n) {
                case 0:
                  return _context12.a(2, jsonrpc.postObject(this.serverURL.toString(), "getTransactions", request));
              }
            }, _callee12, this);
          }));
          function _getTransactions(_x14) {
            return _getTransactions3.apply(this, arguments);
          }
          return _getTransactions;
        })()
      }, {
        key: "getEvents",
        value: (function() {
          var _getEvents2 = _asyncToGenerator(_regenerator().m(function _callee13(request) {
            return _regenerator().w(function(_context13) {
              while (1) switch (_context13.n) {
                case 0:
                  return _context13.a(2, this._getEvents(request).then(_parsers.parseRawEvents));
              }
            }, _callee13, this);
          }));
          function getEvents(_x15) {
            return _getEvents2.apply(this, arguments);
          }
          return getEvents;
        })()
      }, {
        key: "_getEvents",
        value: (function() {
          var _getEvents3 = _asyncToGenerator(_regenerator().m(function _callee14(request) {
            var _request$filters;
            return _regenerator().w(function(_context14) {
              while (1) switch (_context14.n) {
                case 0:
                  return _context14.a(2, jsonrpc.postObject(this.serverURL.toString(), "getEvents", _objectSpread(_objectSpread({
                    filters: (_request$filters = request.filters) !== null && _request$filters !== void 0 ? _request$filters : [],
                    pagination: _objectSpread(_objectSpread({}, request.cursor && {
                      cursor: request.cursor
                    }), request.limit && {
                      limit: request.limit
                    })
                  }, request.startLedger && {
                    startLedger: request.startLedger
                  }), request.endLedger && {
                    endLedger: request.endLedger
                  })));
              }
            }, _callee14, this);
          }));
          function _getEvents(_x16) {
            return _getEvents3.apply(this, arguments);
          }
          return _getEvents;
        })()
      }, {
        key: "getNetwork",
        value: (function() {
          var _getNetwork = _asyncToGenerator(_regenerator().m(function _callee15() {
            return _regenerator().w(function(_context15) {
              while (1) switch (_context15.n) {
                case 0:
                  return _context15.a(2, jsonrpc.postObject(this.serverURL.toString(), "getNetwork"));
              }
            }, _callee15, this);
          }));
          function getNetwork() {
            return _getNetwork.apply(this, arguments);
          }
          return getNetwork;
        })()
      }, {
        key: "getLatestLedger",
        value: (function() {
          var _getLatestLedger = _asyncToGenerator(_regenerator().m(function _callee16() {
            return _regenerator().w(function(_context16) {
              while (1) switch (_context16.n) {
                case 0:
                  return _context16.a(2, jsonrpc.postObject(this.serverURL.toString(), "getLatestLedger"));
              }
            }, _callee16, this);
          }));
          function getLatestLedger() {
            return _getLatestLedger.apply(this, arguments);
          }
          return getLatestLedger;
        })()
      }, {
        key: "simulateTransaction",
        value: (function() {
          var _simulateTransaction2 = _asyncToGenerator(_regenerator().m(function _callee17(tx, addlResources, authMode) {
            return _regenerator().w(function(_context17) {
              while (1) switch (_context17.n) {
                case 0:
                  return _context17.a(2, this._simulateTransaction(tx, addlResources, authMode).then(_parsers.parseRawSimulation));
              }
            }, _callee17, this);
          }));
          function simulateTransaction(_x17, _x18, _x19) {
            return _simulateTransaction2.apply(this, arguments);
          }
          return simulateTransaction;
        })()
      }, {
        key: "_simulateTransaction",
        value: (function() {
          var _simulateTransaction3 = _asyncToGenerator(_regenerator().m(function _callee18(transaction, addlResources, authMode) {
            return _regenerator().w(function(_context18) {
              while (1) switch (_context18.n) {
                case 0:
                  return _context18.a(2, jsonrpc.postObject(this.serverURL.toString(), "simulateTransaction", _objectSpread({
                    transaction: transaction.toXDR(),
                    authMode
                  }, addlResources !== void 0 && {
                    resourceConfig: {
                      instructionLeeway: addlResources.cpuInstructions
                    }
                  })));
              }
            }, _callee18, this);
          }));
          function _simulateTransaction(_x20, _x21, _x22) {
            return _simulateTransaction3.apply(this, arguments);
          }
          return _simulateTransaction;
        })()
      }, {
        key: "prepareTransaction",
        value: (function() {
          var _prepareTransaction = _asyncToGenerator(_regenerator().m(function _callee19(tx) {
            var simResponse;
            return _regenerator().w(function(_context19) {
              while (1) switch (_context19.n) {
                case 0:
                  _context19.n = 1;
                  return this.simulateTransaction(tx);
                case 1:
                  simResponse = _context19.v;
                  if (!_api.Api.isSimulationError(simResponse)) {
                    _context19.n = 2;
                    break;
                  }
                  throw new Error(simResponse.error);
                case 2:
                  return _context19.a(2, (0, _transaction.assembleTransaction)(tx, simResponse).build());
              }
            }, _callee19, this);
          }));
          function prepareTransaction(_x23) {
            return _prepareTransaction.apply(this, arguments);
          }
          return prepareTransaction;
        })()
      }, {
        key: "sendTransaction",
        value: (function() {
          var _sendTransaction2 = _asyncToGenerator(_regenerator().m(function _callee20(transaction) {
            return _regenerator().w(function(_context20) {
              while (1) switch (_context20.n) {
                case 0:
                  return _context20.a(2, this._sendTransaction(transaction).then(_parsers.parseRawSendTransaction));
              }
            }, _callee20, this);
          }));
          function sendTransaction(_x24) {
            return _sendTransaction2.apply(this, arguments);
          }
          return sendTransaction;
        })()
      }, {
        key: "_sendTransaction",
        value: (function() {
          var _sendTransaction3 = _asyncToGenerator(_regenerator().m(function _callee21(transaction) {
            return _regenerator().w(function(_context21) {
              while (1) switch (_context21.n) {
                case 0:
                  return _context21.a(2, jsonrpc.postObject(this.serverURL.toString(), "sendTransaction", {
                    transaction: transaction.toXDR()
                  }));
              }
            }, _callee21, this);
          }));
          function _sendTransaction(_x25) {
            return _sendTransaction3.apply(this, arguments);
          }
          return _sendTransaction;
        })()
      }, {
        key: "requestAirdrop",
        value: (function() {
          var _requestAirdrop = _asyncToGenerator(_regenerator().m(function _callee22(address, friendbotUrl) {
            var account, response, meta, txMeta, sequence, _error$response, _error$response$detai, _t6, _t7;
            return _regenerator().w(function(_context22) {
              while (1) switch (_context22.p = _context22.n) {
                case 0:
                  account = typeof address === "string" ? address : address.accountId();
                  _t6 = friendbotUrl;
                  if (_t6) {
                    _context22.n = 2;
                    break;
                  }
                  _context22.n = 1;
                  return this.getNetwork();
                case 1:
                  _t6 = _context22.v.friendbotUrl;
                case 2:
                  friendbotUrl = _t6;
                  if (friendbotUrl) {
                    _context22.n = 3;
                    break;
                  }
                  throw new Error("No friendbot URL configured for current network");
                case 3:
                  _context22.p = 3;
                  _context22.n = 4;
                  return _axios.default.post("".concat(friendbotUrl, "?addr=").concat(encodeURIComponent(account)));
                case 4:
                  response = _context22.v;
                  if (response.data.result_meta_xdr) {
                    _context22.n = 7;
                    break;
                  }
                  _context22.n = 5;
                  return this.getTransaction(response.data.hash);
                case 5:
                  txMeta = _context22.v;
                  if (!(txMeta.status !== _api.Api.GetTransactionStatus.SUCCESS)) {
                    _context22.n = 6;
                    break;
                  }
                  throw new Error("Funding account ".concat(address, " failed"));
                case 6:
                  meta = txMeta.resultMetaXdr;
                  _context22.n = 8;
                  break;
                case 7:
                  meta = _stellarBase.xdr.TransactionMeta.fromXDR(response.data.result_meta_xdr, "base64");
                case 8:
                  sequence = findCreatedAccountSequenceInTransactionMeta(meta);
                  return _context22.a(2, new _stellarBase.Account(account, sequence));
                case 9:
                  _context22.p = 9;
                  _t7 = _context22.v;
                  if (!(((_error$response = _t7.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 400)) {
                    _context22.n = 10;
                    break;
                  }
                  if (!((_error$response$detai = _t7.response.detail) !== null && _error$response$detai !== void 0 && _error$response$detai.includes("createAccountAlreadyExist"))) {
                    _context22.n = 10;
                    break;
                  }
                  return _context22.a(2, this.getAccount(account));
                case 10:
                  throw _t7;
                case 11:
                  return _context22.a(2);
              }
            }, _callee22, this, [[3, 9]]);
          }));
          function requestAirdrop(_x26, _x27) {
            return _requestAirdrop.apply(this, arguments);
          }
          return requestAirdrop;
        })()
      }, {
        key: "getFeeStats",
        value: (function() {
          var _getFeeStats = _asyncToGenerator(_regenerator().m(function _callee23() {
            return _regenerator().w(function(_context23) {
              while (1) switch (_context23.n) {
                case 0:
                  return _context23.a(2, jsonrpc.postObject(this.serverURL.toString(), "getFeeStats"));
              }
            }, _callee23, this);
          }));
          function getFeeStats() {
            return _getFeeStats.apply(this, arguments);
          }
          return getFeeStats;
        })()
      }, {
        key: "getVersionInfo",
        value: (function() {
          var _getVersionInfo = _asyncToGenerator(_regenerator().m(function _callee24() {
            return _regenerator().w(function(_context24) {
              while (1) switch (_context24.n) {
                case 0:
                  return _context24.a(2, jsonrpc.postObject(this.serverURL.toString(), "getVersionInfo"));
              }
            }, _callee24, this);
          }));
          function getVersionInfo() {
            return _getVersionInfo.apply(this, arguments);
          }
          return getVersionInfo;
        })()
      }, {
        key: "getSACBalance",
        value: (function() {
          var _getSACBalance = _asyncToGenerator(_regenerator().m(function _callee25(address, sac, networkPassphrase) {
            var addressString, passphrase, sacId, key, ledgerKey, response, _response$entries$2, lastModifiedLedgerSeq, liveUntilLedgerSeq, val, entry, _t8;
            return _regenerator().w(function(_context25) {
              while (1) switch (_context25.n) {
                case 0:
                  addressString = address instanceof _stellarBase.Address ? address.toString() : address;
                  if (_stellarBase.StrKey.isValidContract(addressString)) {
                    _context25.n = 1;
                    break;
                  }
                  throw new TypeError("expected contract ID, got ".concat(addressString));
                case 1:
                  if (!(networkPassphrase !== null && networkPassphrase !== void 0)) {
                    _context25.n = 2;
                    break;
                  }
                  _t8 = networkPassphrase;
                  _context25.n = 4;
                  break;
                case 2:
                  _context25.n = 3;
                  return this.getNetwork().then(function(n) {
                    return n.passphrase;
                  });
                case 3:
                  _t8 = _context25.v;
                case 4:
                  passphrase = _t8;
                  sacId = sac.contractId(passphrase);
                  key = (0, _stellarBase.nativeToScVal)(["Balance", addressString], {
                    type: ["symbol", "address"]
                  });
                  ledgerKey = _stellarBase.xdr.LedgerKey.contractData(new _stellarBase.xdr.LedgerKeyContractData({
                    contract: new _stellarBase.Address(sacId).toScAddress(),
                    durability: _stellarBase.xdr.ContractDataDurability.persistent(),
                    key
                  }));
                  _context25.n = 5;
                  return this.getLedgerEntries(ledgerKey);
                case 5:
                  response = _context25.v;
                  if (!(response.entries.length === 0)) {
                    _context25.n = 6;
                    break;
                  }
                  return _context25.a(2, {
                    latestLedger: response.latestLedger
                  });
                case 6:
                  _response$entries$2 = response.entries[0], lastModifiedLedgerSeq = _response$entries$2.lastModifiedLedgerSeq, liveUntilLedgerSeq = _response$entries$2.liveUntilLedgerSeq, val = _response$entries$2.val;
                  if (!(val.switch().value !== _stellarBase.xdr.LedgerEntryType.contractData().value)) {
                    _context25.n = 7;
                    break;
                  }
                  return _context25.a(2, {
                    latestLedger: response.latestLedger
                  });
                case 7:
                  entry = (0, _stellarBase.scValToNative)(val.contractData().val());
                  return _context25.a(2, {
                    latestLedger: response.latestLedger,
                    balanceEntry: {
                      liveUntilLedgerSeq,
                      lastModifiedLedgerSeq,
                      amount: entry.amount.toString(),
                      authorized: entry.authorized,
                      clawback: entry.clawback
                    }
                  });
              }
            }, _callee25, this);
          }));
          function getSACBalance(_x28, _x29, _x30) {
            return _getSACBalance.apply(this, arguments);
          }
          return getSACBalance;
        })()
      }]);
    })();
  }
});

// node_modules/@stellar/stellar-sdk/lib/rpc/index.js
var require_rpc = __commonJS({
  "node_modules/@stellar/stellar-sdk/lib/rpc/index.js"(exports, module) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _exportNames = {
      Server: true,
      BasicSleepStrategy: true,
      LinearSleepStrategy: true,
      Durability: true,
      AxiosClient: true,
      parseRawSimulation: true,
      parseRawEvents: true
    };
    Object.defineProperty(exports, "AxiosClient", {
      enumerable: true,
      get: function get() {
        return _axios.default;
      }
    });
    Object.defineProperty(exports, "BasicSleepStrategy", {
      enumerable: true,
      get: function get() {
        return _server.BasicSleepStrategy;
      }
    });
    Object.defineProperty(exports, "Durability", {
      enumerable: true,
      get: function get() {
        return _server.Durability;
      }
    });
    Object.defineProperty(exports, "LinearSleepStrategy", {
      enumerable: true,
      get: function get() {
        return _server.LinearSleepStrategy;
      }
    });
    Object.defineProperty(exports, "Server", {
      enumerable: true,
      get: function get() {
        return _server.RpcServer;
      }
    });
    exports.default = void 0;
    Object.defineProperty(exports, "parseRawEvents", {
      enumerable: true,
      get: function get() {
        return _parsers.parseRawEvents;
      }
    });
    Object.defineProperty(exports, "parseRawSimulation", {
      enumerable: true,
      get: function get() {
        return _parsers.parseRawSimulation;
      }
    });
    var _api = require_api();
    Object.keys(_api).forEach(function(key) {
      if (key === "default" || key === "__esModule") return;
      if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
      if (key in exports && exports[key] === _api[key]) return;
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
          return _api[key];
        }
      });
    });
    var _server = require_server();
    var _axios = _interopRequireDefault(require_axios2());
    var _parsers = require_parsers();
    var _transaction = require_transaction();
    Object.keys(_transaction).forEach(function(key) {
      if (key === "default" || key === "__esModule") return;
      if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
      if (key in exports && exports[key] === _transaction[key]) return;
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
          return _transaction[key];
        }
      });
    });
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var _default = exports.default = module.exports;
  }
});
export default require_rpc();
/*! Bundled license information:

urijs/src/punycode.js:
  (*! https://mths.be/punycode v1.4.0 by @mathias *)

urijs/src/IPv6.js:
  (*!
   * URI.js - Mutating URLs
   * IPv6 Support
   *
   * Version: 1.19.11
   *
   * Author: Rodney Rehm
   * Web: http://medialize.github.io/URI.js/
   *
   * Licensed under
   *   MIT License http://www.opensource.org/licenses/mit-license
   *
   *)

urijs/src/SecondLevelDomains.js:
  (*!
   * URI.js - Mutating URLs
   * Second Level Domain (SLD) Support
   *
   * Version: 1.19.11
   *
   * Author: Rodney Rehm
   * Web: http://medialize.github.io/URI.js/
   *
   * Licensed under
   *   MIT License http://www.opensource.org/licenses/mit-license
   *
   *)

urijs/src/URI.js:
  (*!
   * URI.js - Mutating URLs
   *
   * Version: 1.19.11
   *
   * Author: Rodney Rehm
   * Web: http://medialize.github.io/URI.js/
   *
   * Licensed under
   *   MIT License http://www.opensource.org/licenses/mit-license
   *
   *)

@stellar/stellar-base/dist/stellar-base.min.js:
  (*! For license information please see stellar-base.min.js.LICENSE.txt *)

axios/dist/browser/axios.cjs:
  (*! Axios v1.12.2 Copyright (c) 2025 Matt Zabriskie and contributors *)
*/
//# sourceMappingURL=@stellar_stellar-sdk_rpc.js.map
