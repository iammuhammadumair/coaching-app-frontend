

function loadScript(c, b) { var a = document.createElement("script"); a.type = "text/javascript"; a.readyState ? a.onreadystatechange = function () { if ("loaded" == a.readyState || "complete" == a.readyState) a.onreadystatechange = null, b() } : a.onload = function () { b() }; a.src = c; document.getElementsByTagName("head")[0].appendChild(a) };
loadScript("https://prod.api.adline.com/api/cpa?key=UID-ij9fQPWHiABYZ4K8UHxx", function () { });
