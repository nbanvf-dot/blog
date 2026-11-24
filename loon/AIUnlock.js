/*
作者: @mcdasheng（ChatGPT 部分原版）+ Muse 修改/扩展
修改: 2026-11-25 由 Muse 制作——
  1. ChatGPT：增加首页拦截检测（与 NodeUnlockDetection.js 一致：先测首页是否被 OpenAI 拦截，再测 trace 定位）。
  2. 新增 Claude 检测：claude.ai/ 首页 + claude.ai/cdn-cgi/trace 定位；
     拦截标记 app-unavailable-in-region（FlowZ/check.sh 同款逻辑）。
  3. 新增 Gemini 检测：gemini.google.com/ 首页；
     可用标记 45631641,null,true，拦截文案 not available in your country（FlowZ/vair 同款逻辑）。
     注意：Gemini 可用标记较脆弱（Google 改版可能失效）；若既无拦截文案又无可用标记，报"检测失败"而非误判。
脚本功能: AI 解锁查询（ChatGPT / Claude / Gemini）
[Script]
  generic script-path=https://raw.githubusercontent.com/nbanvf-dot/blog/main/loon/AIUnlock.js, timeout=20, img-url=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/chxm1023/ChatGPT3.png
@params
  "ipinfo_token": https://ipinfo.io 官网自行申请
@thanks
  @getSomeCats @dododook @lm705
*/

const $ = new Env("AI解锁查询");

$.token = $.getdata("ipinfo_token") ? $.getdata("ipinfo_token") : "";

AI_Test()
  .catch((e) => $.logErr(e))
  .finally(async () => {
    $.log("ok");
    $.done();
  });

async function AI_Test() {
  var ip = await getIp();
  var [gpt, claude, gemini] = await Promise.all([
    testChatGPT(ip),
    testClaude(),
    testGemini(),
  ]);
  $.log("ChatGPT: " + gpt);
  $.log("Claude: " + claude);
  $.log("Gemini: " + gemini);
  showResults(gpt, claude, gemini);
}

// ============ ChatGPT ============
// 两阶段：先测首页是否被 OpenAI 拦截，再测 trace 定位（与 NodeUnlockDetection.js 一致）
async function testChatGPT(ip) {
  // prettier-ignore
  let chatGPT_regions = ["AL", "DZ", "AF", "AD", "AO", "AG", "AR", "AM", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BE", "BZ", "BJ", "BT", "BO", "BA", "BW", "BR", "BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA", "CF", "TD", "CL", "CO", "KM", "CG", "CD", "CR", "CI", "HR", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FJ", "FI", "FR", "GA", "GM", "GE", "DE", "GH", "GR", "GD", "GT", "GN", "GW", "GY", "HT", "VA", "HN", "HU", "IS", "IN", "ID", "IQ", "IE", "IL", "IT", "JM", "JP", "JO", "KZ", "KE", "KI", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MR", "MU", "MX", "FM", "MD", "MC", "MN", "ME", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NZ", "NI", "NE", "NG", "MK", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PL", "PT", "QA", "RO", "RW", "KN", "LC", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SK", "SI", "SB", "SO", "ZA", "KR", "SS", "ES", "LK", "SR", "SE", "CH", "SD", "TW", "TJ", "TZ", "TH", "TL", "TG", "TO", "TT", "TN", "TR", "TM", "TV", "UG", "UA", "AE", "GB", "US", "UY", "UZ", "VU", "VN", "YE", "ZM", "ZW", ];
  var blocked = await checkHomepageBlocked("https://chat.openai.com/", "text/plain");
  if (blocked) return "🚫未解锁";
  var options = {
    url: `https://chat.openai.com/cdn-cgi/trace`,
    headers: {
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36`,
      "Content-Type": "text/json",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
    },
    node: $environment.params.node,
    timeout: 5000,
  };
  try {
    var resp = await $.http.get(options);
    var body = resp.body;
    $.log(body);
    let lines = body.split("\n");
    let cf = lines.reduce((a, line) => {
      let [key, value] = line.split("=");
      a[key] = value;
      return a;
    }, {});
    var gpt_warp = cf.warp === "plus" || cf.warp === "on" ? true : false;
    var gpt_ip;
    if (gpt_warp == true) {
      gpt_ip = "🟢WARP解锁";
    } else if (cf.ip == ip) {
      gpt_ip = "🎉原生解锁";
    } else {
      gpt_ip = "🟡代理解锁";
    }
    let gpt_country = getCountryFlagEmoji(cf.loc) + cf.loc;
    if (chatGPT_regions.indexOf(cf.loc) !== -1) {
      return `${gpt_ip} ➟ ${gpt_country}`;
    } else {
      return "🚫未解锁";
    }
  } catch (e) {
    $.log("🔴ChatGPT trace 检测失败");
    $.log(e);
    return "检测失败 ❗️";
  }
}

// ============ Claude ============
// 两阶段：首页 + trace 定位。拦截标记 app-unavailable-in-region（FlowZ/check.sh 同款逻辑）
// 注意：Cloudflare 挑战页（Just a moment）不等于拦截，报"检测失败"而非误判
async function testClaude() {
  var homeUrl = "https://claude.ai/";
  var traceUrl = "https://claude.ai/cdn-cgi/trace";
  var headers = {
    "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36`,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
  };
  var [homeResp, traceResp] = await Promise.all([
    $.http.get({ url: homeUrl, headers: headers, node: $environment.params.node, timeout: 5000 }).catch((e) => null),
    $.http.get({ url: traceUrl, headers: headers, node: $environment.params.node, timeout: 5000 }).catch((e) => null),
  ]);
  if (!homeResp || !homeResp.body) {
    $.log("🔴Claude 首页请求失败");
    return "检测失败 ❗️";
  }
  var body = JSON.stringify(homeResp.body);
  // Cloudflare 挑战页：无法判断，不误判为可用或封禁
  if (body.indexOf("Just a moment") !== -1 || body.indexOf("challenges.cloudflare.com") !== -1 || body.indexOf("cf-challenge") !== -1) {
    $.log("🔴Claude 遇到 Cloudflare 挑战页");
    return "检测失败 ❗️";
  }
  // 地区不可用标记
  if (body.indexOf("app-unavailable-in-region") !== -1) {
    $.log("🔴Claude 地区不可用");
    return "🚫未解锁";
  }
  var bodyLower = body.toLowerCase();
  if (bodyLower.indexOf("not available in your region") !== -1 || bodyLower.indexOf("not available in your country") !== -1) {
    $.log("🔴Claude 地区不可用");
    return "🚫未解锁";
  }
  // 首页正常：取 trace 定位
  var region = "";
  if (traceResp && traceResp.body) {
    let lines = traceResp.body.split("\n");
    let cf = lines.reduce((a, line) => {
      let [key, value] = line.split("=");
      a[key] = value;
      return a;
    }, {});
    if (cf.loc) region = " ➟ " + getCountryFlagEmoji(cf.loc) + cf.loc;
  }
  return "🎉解锁" + region;
}

// ============ Gemini ============
// 首页检测：可用标记 45631641,null,true；拦截文案 not available in your country（FlowZ/vair 同款逻辑）
// 注意：可用标记较脆弱；若既无拦截文案又无可用标记，报"检测失败"而非误判
async function testGemini() {
  var options = {
    url: `https://gemini.google.com/`,
    headers: {
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36`,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
    },
    node: $environment.params.node,
    timeout: 5000,
  };
  try {
    var resp = await $.http.get(options);
    var body = resp.body || "";
    // 拦截文案（vair 同款）：明确被封
    if (body.toLowerCase().indexOf("not available in your country") !== -1) {
      $.log("🔴Gemini 地区不可用");
      return "🚫未解锁";
    }
    // 地区码：,2,1,200,"XXX" 提 3 字母码（FlowZ 同款正则）
    var region = "";
    var m = /,2,1,200,"([A-Z]{3})"/.exec(body);
    if (m) {
      var code3 = m[1];
      var code2 = alpha3ToAlpha2(code3);
      region = code2 ? " ➟ " + getCountryFlagEmoji(code2) + code2 : " ➟ " + code3;
    }
    // 可用标记（FlowZ 同款）：命中即解锁
    if (body.indexOf("45631641,null,true") !== -1) {
      return "🎉解锁" + region;
    }
    // 既无拦截文案又无可用标记：无法判断（Google 可能改版）
    $.log("🔴Gemini 可用标记缺失，无法判断");
    return "检测失败 ❗️";
  } catch (e) {
    $.log("🔴Gemini 首页请求失败");
    $.log(e);
    return "检测失败 ❗️";
  }
}

// 通用首页拦截检测：请求首页，若返回内容含 marker 则视为被拦截；请求失败也视为被拦截（与 NodeUnlockDetection.js 一致）
async function checkHomepageBlocked(url, marker) {
  var options = {
    url: url,
    headers: {
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36`,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
    },
    node: $environment.params.node,
    timeout: 5000,
  };
  try {
    var resp = await $.http.get(options);
    var bodyStr = JSON.stringify(resp.body);
    return bodyStr.indexOf(marker) !== -1;
  } catch (e) {
    $.log("🔴首页请求失败: " + url);
    $.log(e);
    return true;
  }
}

// 3 字母国家码 → 2 字母（用于国旗 Emoji；未列出的返回空）
function alpha3ToAlpha2(code3) {
  var map = {
    USA: "US", GBR: "GB", CAN: "CA", AUS: "AU", JPN: "JP", KOR: "KR", SGP: "SG",
    HKG: "HK", TWN: "TW", DEU: "DE", FRA: "FR", NLD: "NL", CHE: "CH", SWE: "SE",
    NOR: "NO", DNK: "DK", FIN: "FI", ITA: "IT", ESP: "ES", PRT: "PT", BRA: "BR",
    MEX: "MX", IND: "IN", IDN: "ID", MYS: "MY", PHL: "PH", THA: "TH", VNM: "VN",
    NZL: "NZ", ZAF: "ZA", TUR: "TR", ARE: "AE", ISR: "IL", IRL: "IE", AUT: "AT",
    BEL: "BE", POL: "PL", CZE: "CZ", HUN: "HU", GRC: "GR", ROU: "RO", UKR: "UA",
    RUS: "RU", SAU: "SA", EGY: "EG", NGA: "NG", KEN: "KE", ARG: "AR", CHL: "CL",
    COL: "CO", PER: "PE", VEN: "VE", PAK: "PK", BGD: "BD", LKA: "LK", NPL: "NP",
    KHM: "KH", LAO: "LA", MMR: "MM", BRN: "BN",
  };
  return map[code3] || "";
}

// 显示三个 AI 服务的检测结果
function showResults(gpt, claude, gemini) {
  var res = "------------------------------";
  res = res + "</br><b>" + "🤖ChatGPT" + "</b> : " + gpt + "</br>";
  res = res + "------------------------------" + "</br><b>" + "🧠Claude" + "</b> : " + claude + "</br>";
  res = res + "------------------------------" + "</br><b>" + "✨Gemini" + "</b> : " + gemini + "</br>";
  res = res + "------------------------------" + `</br><font color=#6959CD><b>节点</b> ➟ ${$environment.params.node} </font>`;
  res = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + res + `</p>`;
  $done({
    title: "      AI 解锁查询结果",
    htmlMessage: res,
  });
}

//获取国旗Emoji函数
function getCountryFlagEmoji(countryCode) {
  if (countryCode.toUpperCase() == "TW") {
    countryCode = "WS";
  }
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}


async function getIp() {
  var options = {
    url: `https://ipinfo.io/json?token=${$.token}`,
    headers: {
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36`,
      "Content-Type": "application/json",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
    },
    node: $environment.params.node,
  };

  // 主函数
  return $.http.get(options).then((resp) => {
    $.log(resp.body);
    var obj = JSON.parse(resp.body);
    if (!obj.ip) {
      $.log("🔴ip查询失败!");
      $.log(resp.body);
      $.msg($.name, "🔴ip查询失败!");
      $.done();
    }
    return obj.ip;
  });
}


// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise(s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,a)=>s(a))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e);if(!s&&!a)return{};{const a=s?t:e;try{return JSON.parse(this.fs.readFileSync(a))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):a?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const a=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of a)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,a)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[a+1])>>0==+e[a+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,a,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,a,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(a),o=a?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(o);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),a)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),a)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:a,statusCode:r,headers:i,rawBody:o}=t,n=s.decode(o,this.encoding);e(null,{status:a,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:a,response:r}=t;e(a,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.tocountryaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let a=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:o}=t,n=a.decode(o,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&a.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in a)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[e]:("00"+a[e]).substr((""+a[e]).length)));return t}queryStr(t){let e="";for(const s in t){let a=t[s];null!=a&&""!==a&&("object"==typeof a&&(a=JSON.stringify(a)),e+=`${s}=${a}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",a="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,a=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":a}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,a,i(r));break;case"Quantumult X":$notify(e,s,a,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),a&&t.push(a),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
