function RGBA() {
    this.R = 255;
    this.G = 255;
    this.B = 255;
    this.A = 1
}
function XYZ() {
    this.X = 0;
    this.Y = 0;
    this.Z = 0
}
function LAB() {
    this.L = 0;
    this.A = 0;
    this.B = 0;
    this.Chroma = function() {
        return Chroma(this.A, this.B)
    }
    ;
    this.Hue = function() {
        return Hue(this.A, this.B)
    }
}
function ColorDifference() {
    this.DeltaL = 0;
    this.DeltaA = 0;
    this.DeltaB = 0;
    this.DeltaC = 0;
    this.DeltaH = 0;
    this.DeltaE = 0
}
function MaskData() {
    this.ProminentGrey = -1;
    this.PixelsUsed = -1;
    this.ImageData = null;
    this.OverlayData = null;
    this.IncludeOverlay = !0
}
function Point(n, t) {
    this.X = n;
    this.Y = t
}
function Line() {
    this.Start = new Point(0,0);
    this.End = new Point(0,0)
}
function GammaTransform(n) {
    return n <= .0031308 ? 12.92 * n : 1.055 * Math.pow(n, 1 / 2.4) - .055
}
function GammaTransformInverse(n) {
    return n <= .04045 ? n / 12.92 : Math.pow((n + .055) / 1.055, 2.4)
}
function RGBtoXYZ(n, t, i) {
    n = GammaTransformInverse(n / 255) * 100;
    t = GammaTransformInverse(t / 255) * 100;
    i = GammaTransformInverse(i / 255) * 100;
    var r = new XYZ;
    return r.X = n * .4124564 + t * .3575761 + i * .1804375,
    r.Y = n * .2126729 + t * .7151522 + i * .072175,
    r.Z = n * .0193339 + t * .119192 + i * .9503041,
    r
}
function XYZtoRGB(n, t, i) {
    var r;
    n = n / 100;
    t = t / 100;
    i = i / 100;
    var u = n * 3.2404542 + t * -1.5371385 + i * -.4985314
      , f = n * -.969266 + t * 1.8760108 + i * .041556
      , e = n * .0556434 + t * -.2040259 + i * 1.0572252;
    return u = GammaTransform(u),
    f = GammaTransform(f),
    e = GammaTransform(e),
    r = new RGBA,
    r.R = RgbSafeValue(u),
    r.G = RgbSafeValue(f),
    r.B = RgbSafeValue(e),
    r
}
function RgbSafeValue(n) {
    var t = Math.round(255 * n, 0);
    return t < 0 ? 0 : t > 255 ? 255 : t
}
function IsDark(n, t, i) {
    return Brightness(n, t, i) < 130
}
function Brightness(n, t, i) {
    return Math.sqrt(Math.pow(n, 2) * .241 + Math.pow(t, 2) * .691 + Math.pow(i, 2) * .068)
}
function RGBToGrayScale(n, t, i) {
    return Math.round(.2126 * n + .7152 * t + .0722 * i, 0)
}
function GetAvgRGB(n, t, i) {
    return Math.round((n + t + i) / 3, 0)
}
function XYZtoLAB2DegreeD65(n, t, i) {
    var r = new XYZ;
    r.X = 95.047;
    r.Y = 100;
    r.Z = 108.883;
    var u = new LAB
      , f = t / r.Y
      , e = f > .008856 ? Math.pow(f, 1 / 3) : 7.787 * f + 16 / 116
      , o = n / r.X
      , h = o > .008856 ? Math.pow(o, 1 / 3) : 7.787 * o + 16 / 116
      , s = i / r.Z
      , c = s > .008856 ? Math.pow(s, 1 / 3) : 7.787 * s + 16 / 116;
    return u.L = 116 * e - 16,
    u.A = 500 * (h - e),
    u.B = 200 * (e - c),
    u
}
function Chroma(n, t) {
    return Math.sqrt(Math.pow(n, 2) + Math.pow(t, 2))
}
function Hue(n, t) {
    return n === 0 && t === 0 ? 0 : n > 0 && t === 0 ? 0 : n === 0 && t > 0 ? 90 : n < 0 && t === 0 ? 180 : n === 0 && t < 0 ? 270 : n > 0 && t > 0 ? Math.atan(t / n) * (180 / Math.PI) : n < 0 && t > 0 ? 180 + Math.atan(t / n) * (180 / Math.PI) : n < 0 && t < 0 ? 180 + Math.atan(t / n) * (180 / Math.PI) : n > 0 && t < 0 ? 360 + Math.atan(t / n) * (180 / Math.PI) : 0
}
function CalculateCIE2000Deltas(n, t) {
    var u = new ColorDifference, i, o, s;
    u.DeltaL = t.L - n.L;
    u.DeltaA = t.A - n.A;
    u.DeltaB = t.B - n.B;
    u.DeltaC = t.Chroma() - n.Chroma();
    u.DeltaH = n.A === 0 && n.Chroma() === 0 && n.B === 0 || t.A === 0 && t.Chroma() === 0 && t.B === 0 ? 0 : (n.A * t.B - t.A * n.B) / Math.sqrt(.5 * (n.Chroma() * t.Chroma() + n.A * t.A + n.B * t.B));
    var h = 0
      , c = 0
      , e = 0
      , f = 0
      , l = 0
      , y = 0
      , p = 0
      , w = 0
      , b = 0
      , k = 1
      , d = 1
      , g = 0
      , a = 0
      , v = 0
      , r = new LAB;
    return r.L = t.L,
    r.A = t.A,
    r.B = t.B,
    i = new LAB,
    i.L = n.L,
    i.A = n.A,
    i.B = n.B,
    o = 0,
    s = 0,
    c = (n.Chroma() + t.Chroma()) / 2,
    h = (n.L + t.L) / 2,
    l = .5 * (1 - Math.sqrt(Math.pow(c, 7) / (Math.pow(c, 7) + Math.pow(25, 7)))),
    i.A = n.A * (1 + l),
    r.A = t.A * (1 + l),
    f = (i.Hue() + r.Hue()) / 2,
    e = (i.Chroma() + r.Chroma()) / 2,
    o = Math.sqrt(Math.pow(r.A, 2) + Math.pow(t.B, 2)) - Math.sqrt(Math.pow(i.A, 2) + Math.pow(n.B, 2)),
    s = i.A === 0 && i.Chroma() === 0 && i.B === 0 || r.A === 0 && r.Chroma() === 0 && r.B === 0 ? 0 : (i.A * r.B - r.A * i.B) / Math.sqrt(.5 * (i.Chroma() * r.Chroma() + i.A * r.A + i.B * r.B)),
    g = 1 + .015 * Math.pow(h - 50, 2) / Math.sqrt(20 + Math.pow(h - 50, 2)),
    a = 1 + .045 * e,
    y = 1 - .17 * Math.cos((f - 30) * (Math.PI / 180)) + .24 * Math.cos(2 * f * (Math.PI / 180)) + .32 * Math.cos((3 * f + 6) * (Math.PI / 180)) - .2 * Math.cos((4 * f - 63) * (Math.PI / 180)),
    v = 1 + .015 * e * y,
    p = 2 * Math.sqrt(Math.pow(e, 7) / (Math.pow(e, 7) + Math.pow(25, 7))),
    w = 30 * Math.exp(-1 * Math.pow((f - 275) / 25, 2)),
    b = -1 * Math.sin(2 * w * (Math.PI / 180)) * p,
    u.DeltaE = Math.sqrt(Math.pow(u.DeltaL / (1 * g), 2) + Math.pow(o / (k * a), 2) + Math.pow(s / (d * v), 2) + b * o / (k * a) * (s / (d * v))),
    u
}
function MultiplyBlend(n, t) {
    return Math.max(0, Math.min(255, Math.round(n * t / 255, 0)))
}
function BlendColorToMakeTarget(n, t) {
    return n * 255 / t
}
function RGBtoLAB2DegreeD65(n, t, i) {
    var r = RGBtoXYZ(n, t, i);
    return XYZtoLAB2DegreeD65(r.X, r.Y, r.Z)
}
function FillMaskDataFromBase64Mask(n, t, i, r) {
    var u = document.createElement("canvas"), o, s, f, h, c, e;
    for (u.width = t,
    u.height = i,
    o = atob(n),
    s = [],
    f = 0; f < o.length; f++)
        s[f] = o[f].charCodeAt(0);
    for (h = u.getContext("2d"),
    c = h.getImageData(0, 0, u.width, u.height),
    e = 0; e < i * t * 4; e++)
        c.data[e] = s[e];
    return h.putImageData(c, 0, 0, 0, 0, u.width, u.height),
    GetGreyMaskData(u, r)
}
function GetGreyMaskData(n, t, i) {
    var l = n.width, a = n.height, u = new MaskData, v, o, f, h, c, r, s;
    i !== undefined && i != null && (u.IncludeOverlay = i);
    v = n.getContext("2d");
    u.ImageData = v.getImageData(0, 0, l, a);
    u.OverlayData = v.getImageData(0, 0, l, a);
    var e = []
      , r = 0
      , y = 0;
    for (o = 0; o < a * l; o++)
        y = u.ImageData.data[r + 3],
        y > 0 && (u.PixelsUsed++,
        f = RGBToGrayScale(t.data[r], t.data[r + 1], t.data[r + 2]),
        y === 255 ? (e[f] = e[f] === undefined ? 1 : e[f] + 1,
        o % 4 == 0 ? (u.OverlayData.data[r] = 0,
        u.OverlayData.data[r + 1] = 0,
        u.OverlayData.data[r + 2] = 0,
        u.OverlayData.data[r + 3] = 75) : o % 2 == 0 ? (u.OverlayData.data[r] = 255,
        u.OverlayData.data[r + 1] = 255,
        u.OverlayData.data[r + 2] = 255,
        u.OverlayData.data[r + 3] = 75) : (u.OverlayData.data[r] = 0,
        u.OverlayData.data[r + 1] = 0,
        u.OverlayData.data[r + 2] = 0,
        u.OverlayData.data[r + 3] = 0)) : (u.OverlayData.data[r] = 0,
        u.OverlayData.data[r + 1] = 0,
        u.OverlayData.data[r + 2] = 255,
        u.OverlayData.data[r + 3] = 255),
        u.ImageData.data[r] = f,
        u.ImageData.data[r + 1] = f,
        u.ImageData.data[r + 2] = f),
        r += 4;
    for (h = -1,
    c = -1,
    r = 0; r < e.length; r++)
        s = e[r],
        s === undefined && (s = -2),
        r > 0 && (h === -1 || s >= h && r > c) && (h = s,
        c = r);
    return u.ProminentGrey = c,
    u
}
function GetMaskData(n, t, i, r, u) {
    var e = new MaskData, a = r.getContext("2d"), y, o, c, l, f, h;
    a.clearRect(0, 0, t, i);
    a.drawImage(n, 0, 0, t, i);
    e.ImageData = a.getImageData(0, 0, t, i);
    var s = []
      , f = 0
      , v = 0;
    for (y = 0; y < i * t; y++)
        v = e.ImageData.data[f + 3],
        v > 0 && (e.PixelsUsed++,
        o = RGBToGrayScale(u.data[f], u.data[f + 1], u.data[f + 2]),
        v === 255 && (s[o] = s[o] === undefined ? 1 : s[o] + 1),
        e.ImageData.data[f] = o,
        e.ImageData.data[f + 1] = o,
        e.ImageData.data[f + 2] = o),
        f += 4;
    for (c = -1,
    l = -1,
    f = 0; f < s.length; f++)
        h = s[f],
        h === undefined && (h = -2),
        f > 0 && (c === -1 || h >= c && f > l) && (c = h,
        l = f);
    return e.ProminentGrey = l,
    e
}
function DrawSingleImage(n, t, i, r, u, f) {
    var h = n.width, s = n.height, v = n.getContext("2d"), c, l, a;
    v.putImageData(t, 0, 0, 0, 0, h, s);
    c = document.createElement("canvas");
    c.width = h;
    c.height = s;
    l = c.getContext("2d");
    l.putImageData(i.ImageData, 0, 0, 0, 0, h, s);
    var e = l.getImageData(0, 0, h, s)
      , y = 0
      , p = 0
      , w = 0
      , o = 0;
    for (y = BlendColorToMakeTarget(r, i.ProminentGrey),
    p = BlendColorToMakeTarget(u, i.ProminentGrey),
    w = BlendColorToMakeTarget(f, i.ProminentGrey),
    a = 0; a < s * h; a++)
        e.data[o + 3] > 0 ? (e.data[o] = MultiplyBlend(y, e.data[o]),
        e.data[o + 1] = MultiplyBlend(p, e.data[o + 1]),
        e.data[o + 2] = MultiplyBlend(w, e.data[o + 2])) : (e.data[o] = 0,
        e.data[o + 1] = 0,
        e.data[o + 2] = 0),
        o += 4;
    l.clearRect(0, 0, iwidth, s);
    l.putImageData(e, 0, 0, 0, 0, h, s);
    v.drawImage(c, 0, 0, h, s)
}
function ClosePoints(n, t, i, r, u) {
    var f = Math.sqrt((n - i) * (n - i) + (t - r) * (t - r));
    return f > u ? !1 : !0
}
!function(n, t, i) {
    function o(n, t) {
        return typeof n === t
    }
    function it() {
        var i, n, u, f, e, c, t, s;
        for (s in h)
            if (h.hasOwnProperty(s)) {
                if (i = [],
                n = h[s],
                n.name && (i.push(n.name.toLowerCase()),
                n.options && n.options.aliases && n.options.aliases.length))
                    for (u = 0; u < n.options.aliases.length; u++)
                        i.push(n.options.aliases[u].toLowerCase());
                for (f = o(n.fn, "function") ? n.fn() : n.fn,
                e = 0; e < i.length; e++)
                    c = i[e],
                    t = c.split("."),
                    1 === t.length ? r[t[0]] = f : (!r[t[0]] || r[t[0]]instanceof Boolean || (r[t[0]] = new Boolean(r[t[0]])),
                    r[t[0]][t[1]] = f),
                    g.push((f ? "" : "no-") + t.join("-"))
            }
    }
    function rt(n) {
        var t = e.className, i = r._config.classPrefix || "", u;
        (c && (t = t.baseVal),
        r._config.enableJSClass) && (u = new RegExp("(^|\\s)" + i + "no-js(\\s|$)"),
        t = t.replace(u, "$1" + i + "js$2"));
        r._config.enableClasses && (t += " " + i + n.join(" " + i),
        c ? e.className.baseVal = t : e.className = t)
    }
    function s() {
        return "function" != typeof t.createElement ? t.createElement(arguments[0]) : c ? t.createElementNS.call(t, "http://www.w3.org/2000/svg", arguments[0]) : t.createElement.apply(t, arguments)
    }
    function ut() {
        var n = t.body;
        return n || (n = s(c ? "svg" : "body"),
        n.fake = !0),
        n
    }
    function b(n, i, r, u) {
        var o, a, c, v, l = "modernizr", h = s("div"), f = ut();
        if (parseInt(r, 10))
            for (; r--; )
                c = s("div"),
                c.id = u ? u[r] : l + (r + 1),
                h.appendChild(c);
        return o = s("style"),
        o.type = "text/css",
        o.id = "s" + l,
        (f.fake ? f : h).appendChild(o),
        f.appendChild(h),
        o.styleSheet ? o.styleSheet.cssText = n : o.appendChild(t.createTextNode(n)),
        h.id = l,
        f.fake && (f.style.background = "",
        f.style.overflow = "hidden",
        v = e.style.overflow,
        e.style.overflow = "hidden",
        e.appendChild(f)),
        a = i(h, n),
        f.fake ? (f.parentNode.removeChild(f),
        e.style.overflow = v,
        e.offsetHeight) : h.parentNode.removeChild(h),
        !!a
    }
    function ft(n, t) {
        return !!~("" + n).indexOf(t)
    }
    function et(n) {
        return n.replace(/([a-z])-([a-z])/g, function(n, t, i) {
            return t + i.toUpperCase()
        }).replace(/^-/, "")
    }
    function ot(n, t) {
        return function() {
            return n.apply(t, arguments)
        }
    }
    function st(n, t, i) {
        var r, u;
        for (u in n)
            if (n[u]in t)
                return i === !1 ? n[u] : (r = t[n[u]],
                o(r, "function") ? ot(r, i || t) : r);
        return !1
    }
    function k(n) {
        return n.replace(/([A-Z])/g, function(n, t) {
            return "-" + t.toLowerCase()
        }).replace(/^ms-/, "-ms-")
    }
    function ht(t, r) {
        var f = t.length, u;
        if ("CSS"in n && "supports"in n.CSS) {
            for (; f--; )
                if (n.CSS.supports(k(t[f]), r))
                    return !0;
            return !1
        }
        if ("CSSSupportsRule"in n) {
            for (u = []; f--; )
                u.push("(" + k(t[f]) + ":" + r + ")");
            return u = u.join(" or "),
            b("@supports (" + u + ") { #modernizr { position: absolute; } }", function(n) {
                return "absolute" == getComputedStyle(n, null).position
            })
        }
        return i
    }
    function ct(n, t, r, u) {
        function c() {
            v && (delete f.style,
            delete f.modElem)
        }
        var l, v, h, y, e, p, a;
        if ((u = o(u, "undefined") ? !1 : u,
        !o(r, "undefined")) && (l = ht(n, r),
        !o(l, "undefined")))
            return l;
        for (a = ["modernizr", "tspan", "samp"]; !f.style && a.length; )
            v = !0,
            f.modElem = s(a.shift()),
            f.style = f.modElem.style;
        for (y = n.length,
        h = 0; y > h; h++)
            if (e = n[h],
            p = f.style[e],
            ft(e, "-") && (e = et(e)),
            f.style[e] !== i) {
                if (u || o(r, "undefined"))
                    return c(),
                    "pfx" == t ? e : !0;
                try {
                    f.style[e] = r
                } catch (w) {}
                if (f.style[e] != p)
                    return c(),
                    "pfx" == t ? e : !0
            }
        return c(),
        !1
    }
    function d(n, t, i, r, u) {
        var f = n.charAt(0).toUpperCase() + n.slice(1)
          , e = (n + " " + y.join(f + " ") + f).split(" ");
        return o(t, "string") || o(t, "undefined") ? ct(e, t, r, u) : (e = (n + " " + p.join(f + " ") + f).split(" "),
        st(e, t, i))
    }
    function a(n, t, r) {
        return d(n, i, i, t, r)
    }
    var g = [], h = [], u = {
        _version: "3.3.1",
        _config: {
            classPrefix: "",
            enableClasses: !0,
            enableJSClass: !0,
            usePrefixes: !0
        },
        _q: [],
        on: function(n, t) {
            var i = this;
            setTimeout(function() {
                t(i[n])
            }, 0)
        },
        addTest: function(n, t, i) {
            h.push({
                name: n,
                fn: t,
                options: i
            })
        },
        addAsyncTest: function(n) {
            h.push({
                name: null,
                fn: n
            })
        }
    }, r = function() {}, tt, v, y, p, w, f, l;
    r.prototype = u;
    r = new r;
    var e = t.documentElement
      , c = "svg" === e.nodeName.toLowerCase()
      , nt = u._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : ["", ""];
    for (u._prefixes = nt,
    tt = u.testStyles = b,
    r.addTest("touchevents", function() {
        var i, r;
        return "ontouchstart"in n || n.DocumentTouch && t instanceof DocumentTouch ? i = !0 : (r = ["@media (", nt.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}"].join(""),
        tt(r, function(n) {
            i = 9 === n.offsetTop
        })),
        i
    }),
    v = "Moz O ms Webkit",
    y = u._config.usePrefixes ? v.split(" ") : [],
    u._cssomPrefixes = y,
    p = u._config.usePrefixes ? v.toLowerCase().split(" ") : [],
    u._domPrefixes = p,
    w = {
        elem: s("modernizr")
    },
    r._q.push(function() {
        delete w.elem
    }),
    f = {
        style: w.elem.style
    },
    r._q.unshift(function() {
        delete f.style
    }),
    u.testAllProps = d,
    u.testAllProps = a,
    r.addTest("flexbox", a("flexBasis", "1px", !0)),
    r.addTest("flexboxlegacy", a("boxDirection", "reverse", !0)),
    it(),
    rt(g),
    delete u.addTest,
    delete u.addAsyncTest,
    l = 0; l < r._q.length; l++)
        r._q[l]();
    n.Modernizr = r
}(window, document),
function(n) {
    "use strict";
    function l(n) {
        return function() {
            for (var i = arguments[0], u, t, r = "[" + (n ? n + ":" : "") + i + "] http://errors.angularjs.org/1.5.8/" + (n ? n + "/" : "") + i, i = 1; i < arguments.length; i++)
                r = r + (1 == i ? "?" : "&") + "p" + (i - 1) + "=",
                u = encodeURIComponent,
                t = arguments[i],
                t = "function" == typeof t ? t.toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof t ? "undefined" : "string" != typeof t ? JSON.stringify(t) : t,
                r += u(t);
            return Error(r)
        }
    }
    function kt(n) {
        if (null == n || ur(n))
            return !1;
        if (c(n) || h(n) || e && n instanceof e)
            return !0;
        var t = "length"in Object(n) && n.length;
        return w(t) && (0 <= t && (t - 1 in n || n instanceof Array) || "function" == typeof n.item)
    }
    function t(n, i, r) {
        var u, e, o;
        if (n)
            if (f(n))
                for (u in n)
                    "prototype" == u || "length" == u || "name" == u || n.hasOwnProperty && !n.hasOwnProperty(u) || i.call(r, n[u], u, n);
            else if (c(n) || kt(n))
                for (o = "object" != typeof n,
                u = 0,
                e = n.length; u < e; u++)
                    (o || u in n) && i.call(r, n[u], u, n);
            else if (n.forEach && n.forEach !== t)
                n.forEach(i, r, n);
            else if (we(n))
                for (u in n)
                    i.call(r, n[u], u, n);
            else if ("function" == typeof n.hasOwnProperty)
                for (u in n)
                    n.hasOwnProperty(u) && i.call(r, n[u], u, n);
            else
                for (u in n)
                    wt.call(n, u) && i.call(r, n[u], u, n);
        return n
    }
    function ve(n, t, i) {
        for (var r = Object.keys(n).sort(), u = 0; u < r.length; u++)
            t.call(i, n[r[u]], r[u]);
        return r
    }
    function ye(n) {
        return function(t, i) {
            n(i, t)
        }
    }
    function bc() {
        return ++ku
    }
    function of(n, t, i) {
        for (var e, u, r, l = n.$$hashKey, o = 0, v = t.length; o < v; ++o)
            if (e = t[o],
            s(e) || f(e))
                for (var a = Object.keys(e), h = 0, y = a.length; h < y; h++)
                    u = a[h],
                    r = e[u],
                    i && s(r) ? et(r) ? n[u] = new Date(r.valueOf()) : rr(r) ? n[u] = new RegExp(r) : r.nodeName ? n[u] = r.cloneNode(!0) : hf(r) ? n[u] = r.clone() : (s(n[u]) || (n[u] = c(r) ? [] : {}),
                    of(n[u], [r], !0)) : n[u] = r;
        return l ? n.$$hashKey = l : delete n.$$hashKey,
        n
    }
    function a(n) {
        return of(n, bt.call(arguments, 1), !1)
    }
    function kc(n) {
        return of(n, bt.call(arguments, 1), !0)
    }
    function tt(n) {
        return parseInt(n, 10)
    }
    function sf(n, t) {
        return a(Object.create(n), t)
    }
    function o() {}
    function ir(n) {
        return n
    }
    function ft(n) {
        return function() {
            return n
        }
    }
    function pe(n) {
        return f(n.toString) && n.toString !== rt
    }
    function r(n) {
        return "undefined" == typeof n
    }
    function u(n) {
        return "undefined" != typeof n
    }
    function s(n) {
        return null !== n && "object" == typeof n
    }
    function we(n) {
        return null !== n && "object" == typeof n && !oh(n)
    }
    function h(n) {
        return "string" == typeof n
    }
    function w(n) {
        return "number" == typeof n
    }
    function et(n) {
        return "[object Date]" === rt.call(n)
    }
    function f(n) {
        return "function" == typeof n
    }
    function rr(n) {
        return "[object RegExp]" === rt.call(n)
    }
    function ur(n) {
        return n && n.window === n
    }
    function fr(n) {
        return n && n.$evalAsync && n.$watch
    }
    function ui(n) {
        return "boolean" == typeof n
    }
    function dc(n) {
        return n && w(n.length) && bv.test(rt.call(n))
    }
    function hf(n) {
        return !(!n || !(n.nodeName || n.prop && n.attr && n.find))
    }
    function gc(n) {
        var i = {}, t;
        for (n = n.split(","),
        t = 0; t < n.length; t++)
            i[n[t]] = !0;
        return i
    }
    function at(n) {
        return v(n.nodeName || n[0] && n[0].nodeName)
    }
    function er(n, t) {
        var i = n.indexOf(t);
        return 0 <= i && n.splice(i, 1),
        i
    }
    function dt(n, i) {
        function o(n, t) {
            var u = t.$$hashKey, i, f;
            if (c(n))
                for (i = 0,
                f = n.length; i < f; i++)
                    t.push(r(n[i]));
            else if (we(n))
                for (i in n)
                    t[i] = r(n[i]);
            else if (n && "function" == typeof n.hasOwnProperty)
                for (i in n)
                    n.hasOwnProperty(i) && (t[i] = r(n[i]));
            else
                for (i in n)
                    wt.call(n, i) && (t[i] = r(n[i]));
            return u ? t.$$hashKey = u : delete t.$$hashKey,
            t
        }
        function r(n) {
            var t, i;
            if (!s(n))
                return n;
            if (t = u.indexOf(n),
            -1 !== t)
                return e[t];
            if (ur(n) || fr(n))
                throw hi("cpws");
            return t = !1,
            i = h(n),
            void 0 === i && (i = c(n) ? [] : Object.create(oh(n)),
            t = !0),
            u.push(n),
            e.push(i),
            t ? o(n, i) : i
        }
        function h(n) {
            switch (rt.call(n)) {
            case "[object Int8Array]":
            case "[object Int16Array]":
            case "[object Int32Array]":
            case "[object Float32Array]":
            case "[object Float64Array]":
            case "[object Uint8Array]":
            case "[object Uint8ClampedArray]":
            case "[object Uint16Array]":
            case "[object Uint32Array]":
                return new n.constructor(r(n.buffer),n.byteOffset,n.length);
            case "[object ArrayBuffer]":
                if (!n.slice) {
                    var t = new ArrayBuffer(n.byteLength);
                    return new Uint8Array(t).set(new Uint8Array(n)),
                    t
                }
                return n.slice(0);
            case "[object Boolean]":
            case "[object Number]":
            case "[object String]":
            case "[object Date]":
                return new n.constructor(n.valueOf());
            case "[object RegExp]":
                return t = new RegExp(n.source,n.toString().match(/[^\/]*$/)[0]),
                t.lastIndex = n.lastIndex,
                t;
            case "[object Blob]":
                return new n.constructor([n],{
                    type: n.type
                })
            }
            if (f(n.cloneNode))
                return n.cloneNode(!0)
        }
        var u = []
          , e = [];
        if (i) {
            if (dc(i) || "[object ArrayBuffer]" === rt.call(i))
                throw hi("cpta");
            if (n === i)
                throw hi("cpi");
            return c(i) ? i.length = 0 : t(i, function(n, t) {
                "$$hashKey" !== t && delete i[t]
            }),
            u.push(n),
            e.push(i),
            o(n, i)
        }
        return r(n)
    }
    function ot(n, t) {
        if (n === t)
            return !0;
        if (null === n || null === t)
            return !1;
        if (n !== n && t !== t)
            return !0;
        var r = typeof n, i;
        if (r == typeof t && "object" == r)
            if (c(n)) {
                if (!c(t))
                    return !1;
                if ((r = n.length) == t.length) {
                    for (i = 0; i < r; i++)
                        if (!ot(n[i], t[i]))
                            return !1;
                    return !0
                }
            } else {
                if (et(n))
                    return et(t) ? ot(n.getTime(), t.getTime()) : !1;
                if (rr(n))
                    return rr(t) ? n.toString() == t.toString() : !1;
                if (fr(n) || fr(t) || ur(n) || ur(t) || c(t) || et(t) || rr(t))
                    return !1;
                r = y();
                for (i in n)
                    if ("$" !== i.charAt(0) && !f(n[i])) {
                        if (!ot(n[i], t[i]))
                            return !1;
                        r[i] = !0
                    }
                for (i in t)
                    if (!(i in r) && "$" !== i.charAt(0) && u(t[i]) && !f(t[i]))
                        return !1;
                return !0
            }
        return !1
    }
    function or(n, t, i) {
        return n.concat(bt.call(t, i))
    }
    function sr(n, t) {
        var i = 2 < arguments.length ? bt.call(arguments, 2) : [];
        return !f(t) || t instanceof RegExp ? t : i.length ? function() {
            return arguments.length ? t.apply(n, or(i, arguments, 0)) : t.apply(n, i)
        }
        : function() {
            return arguments.length ? t.apply(n, arguments) : t.call(n)
        }
    }
    function nl(t, i) {
        var r = i;
        return "string" == typeof t && "$" === t.charAt(0) && "$" === t.charAt(1) ? r = void 0 : ur(i) ? r = "$WINDOW" : i && n.document === i ? r = "$DOCUMENT" : fr(i) && (r = "$SCOPE"),
        r
    }
    function hr(n, t) {
        if (!r(n))
            return w(t) || (t = t ? 2 : null),
            JSON.stringify(n, nl, t)
    }
    function be(n) {
        return h(n) ? JSON.parse(n) : n
    }
    function ke(n, t) {
        n = n.replace(kv, "");
        var i = Date.parse("Jan 01, 1970 00:00:00 " + n) / 6e4;
        return isNaN(i) ? t : i
    }
    function cf(n, t, i) {
        i = i ? -1 : 1;
        var r = n.getTimezoneOffset();
        return t = ke(t, r),
        i *= t - r,
        n = new Date(n.getTime()),
        n.setMinutes(n.getMinutes() + i),
        n
    }
    function vt(n) {
        n = e(n).clone();
        try {
            n.empty()
        } catch (i) {}
        var t = e("<div>").append(n).html();
        try {
            return n[0].nodeType === di ? v(t) : t.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function(n, t) {
                return "<" + v(t)
            })
        } catch (r) {
            return v(t)
        }
    }
    function de(n) {
        try {
            return decodeURIComponent(n)
        } catch (t) {}
    }
    function ge(n) {
        var i = {};
        return t((n || "").split("&"), function(n) {
            var f, t, r;
            n && (t = n = n.replace(/\+/g, "%20"),
            f = n.indexOf("="),
            -1 !== f && (t = n.substring(0, f),
            r = n.substring(f + 1)),
            t = de(t),
            u(t) && (r = u(r) ? de(r) : !0,
            wt.call(i, t) ? c(i[t]) ? i[t].push(r) : i[t] = [i[t], r] : i[t] = r))
        }),
        i
    }
    function lf(n) {
        var i = [];
        return t(n, function(n, r) {
            c(n) ? t(n, function(n) {
                i.push(ht(r, !0) + (!0 === n ? "" : "=" + ht(n, !0)))
            }) : i.push(ht(r, !0) + (!0 === n ? "" : "=" + ht(n, !0)))
        }),
        i.length ? i.join("&") : ""
    }
    function tu(n) {
        return ht(n, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+")
    }
    function ht(n, t) {
        return encodeURIComponent(n).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%20/g, t ? "%20" : "+")
    }
    function tl(n, t) {
        for (var i, u = ki.length, r = 0; r < u; ++r)
            if (i = ki[r] + t,
            h(i = n.getAttribute(i)))
                return i;
        return null
    }
    function il(n, i) {
        var r, u, f = {};
        t(ki, function(t) {
            t += "app";
            !r && n.hasAttribute && n.hasAttribute(t) && (r = n,
            u = n.getAttribute(t))
        });
        t(ki, function(t) {
            t += "app";
            var i;
            !r && (i = n.querySelector("[" + t.replace(":", "\\:") + "]")) && (r = i,
            u = i.getAttribute(t))
        });
        r && (f.strictDi = null !== tl(r, "strict-di"),
        i(r, u ? [u] : [], f))
    }
    function no(i, r, u) {
        s(u) || (u = {});
        u = a({
            strictDi: !1
        }, u);
        var o = function() {
            if (i = e(i),
            i.injector()) {
                var t = i[0] === n.document ? "document" : vt(i);
                throw hi("btstrpd", t.replace(/</, "&lt;").replace(/>/, "&gt;"));
            }
            return r = r || [],
            r.unshift(["$provide", function(n) {
                n.value("$rootElement", i)
            }
            ]),
            u.debugInfoEnabled && r.push(["$compileProvider", function(n) {
                n.debugInfoEnabled(!0)
            }
            ]),
            r.unshift("ng"),
            t = ar(r, u.strictDi),
            t.invoke(["$rootScope", "$rootElement", "$compile", "$injector", function(n, t, i, r) {
                n.$apply(function() {
                    t.data("$injector", r);
                    i(t)(n)
                })
            }
            ]),
            t
        }
          , h = /^NG_ENABLE_DEBUG_INFO!/
          , c = /^NG_DEFER_BOOTSTRAP!/;
        if (n && h.test(n.name) && (u.debugInfoEnabled = !0,
        n.name = n.name.replace(h, "")),
        n && !c.test(n.name))
            return o();
        n.name = n.name.replace(c, "");
        ut.resumeBootstrap = function(n) {
            return t(n, function(n) {
                r.push(n)
            }),
            o()
        }
        ;
        f(ut.resumeDeferredBootstrap) && ut.resumeDeferredBootstrap()
    }
    function rl() {
        n.name = "NG_ENABLE_DEBUG_INFO!" + n.name;
        n.location.reload()
    }
    function ul(n) {
        if (n = ut.element(n).injector(),
        !n)
            throw hi("test");
        return n.get("$$testability")
    }
    function to(n, t) {
        return t = t || "_",
        n.replace(dv, function(n, i) {
            return (i ? t : "") + n.toLowerCase()
        })
    }
    function fl() {
        var i, t;
        hh || (t = du(),
        (ii = r(t) ? n.jQuery : t ? n[t] : void 0) && ii.fn.on ? (e = ii,
        a(ii.fn, {
            scope: nr.scope,
            isolateScope: nr.isolateScope,
            controller: nr.controller,
            injector: nr.injector,
            inheritedData: nr.inheritedData
        }),
        i = ii.cleanData,
        ii.cleanData = function(n) {
            for (var r, u = 0, t; null != (t = n[u]); u++)
                (r = ii._data(t, "events")) && r.$destroy && ii(t).triggerHandler("$destroy");
            i(n)
        }
        ) : e = b,
        ut.element = e,
        hh = !0)
    }
    function iu(n, t, i) {
        if (!n)
            throw hi("areq", t || "?", i || "required");
        return n
    }
    function vi(n, t, i) {
        return i && c(n) && (n = n[n.length - 1]),
        iu(f(n), t, "not a function, got " + (n && "object" == typeof n ? n.constructor.name || "Object" : typeof n)),
        n
    }
    function yi(n, t) {
        if ("hasOwnProperty" === n)
            throw hi("badname", t);
    }
    function io(n, t, i) {
        if (!t)
            return n;
        t = t.split(".");
        for (var u, e = n, o = t.length, r = 0; r < o; r++)
            u = t[r],
            n && (n = (e = n)[u]);
        return !i && f(n) ? sr(e, n) : n
    }
    function ru(n) {
        for (var t = n[0], u = n[n.length - 1], i, r = 1; t !== u && (t = t.nextSibling); r++)
            (i || n[r] !== t) && (i || (i = e(bt.call(n, 0, r))),
            i.push(t));
        return i || n
    }
    function y() {
        return Object.create(null)
    }
    function el(n) {
        function t(n, t, i) {
            return n[t] || (n[t] = i())
        }
        var i = l("$injector")
          , r = l("ng");
        return n = t(n, "angular", Object),
        n.$$minErr = n.$$minErr || l,
        t(n, "module", function() {
            var n = {};
            return function(u, e, o) {
                if ("hasOwnProperty" === u)
                    throw r("badname", "module");
                return e && n.hasOwnProperty(u) && (n[u] = null),
                t(n, u, function() {
                    function t(n, t, i, u) {
                        return u || (u = r),
                        function() {
                            return u[i || "push"]([n, t, arguments]),
                            s
                        }
                    }
                    function n(n, t) {
                        return function(i, e) {
                            return e && f(e) && (e.$$moduleName = u),
                            r.push([n, t, arguments]),
                            s
                        }
                    }
                    if (!e)
                        throw i("nomod", u);
                    var r = []
                      , h = []
                      , c = []
                      , l = t("$injector", "invoke", "push", h)
                      , s = {
                        _invokeQueue: r,
                        _configBlocks: h,
                        _runBlocks: c,
                        requires: e,
                        name: u,
                        provider: n("$provide", "provider"),
                        factory: n("$provide", "factory"),
                        service: n("$provide", "service"),
                        value: t("$provide", "value"),
                        constant: t("$provide", "constant", "unshift"),
                        decorator: n("$provide", "decorator"),
                        animation: n("$animateProvider", "register"),
                        filter: n("$filterProvider", "register"),
                        controller: n("$controllerProvider", "register"),
                        directive: n("$compileProvider", "directive"),
                        component: n("$compileProvider", "component"),
                        config: l,
                        run: function(n) {
                            return c.push(n),
                            this
                        }
                    };
                    return o && l(o),
                    s
                })
            }
        })
    }
    function st(n, t) {
        if (c(n)) {
            t = t || [];
            for (var i = 0, r = n.length; i < r; i++)
                t[i] = n[i]
        } else if (s(n))
            for (i in t = t || {},
            n)
                ("$" !== i.charAt(0) || "$" !== i.charAt(1)) && (t[i] = n[i]);
        return t || n
    }
    function ol(i) {
        a(i, {
            bootstrap: no,
            copy: dt,
            extend: a,
            merge: kc,
            equals: ot,
            element: e,
            forEach: t,
            injector: ar,
            noop: o,
            bind: sr,
            toJson: hr,
            fromJson: be,
            identity: ir,
            isUndefined: r,
            isDefined: u,
            isString: h,
            isFunction: f,
            isObject: s,
            isNumber: w,
            isElement: hf,
            isArray: c,
            version: gv,
            isDate: et,
            lowercase: v,
            uppercase: bu,
            callbacks: {
                $$counter: 0
            },
            getTestability: ul,
            $$minErr: l,
            $$csp: ci,
            reloadWithDebugInfo: rl
        });
        ue = el(n);
        ue("ng", ["ngLocale"], ["$provide", function(n) {
            n.provider({
                $$sanitizeUri: da
            });
            n.provider("$compile", ao).directive({
                a: tc,
                input: hc,
                textarea: hc,
                form: pp,
                script: yb,
                select: bb,
                style: db,
                option: kb,
                ngBind: iw,
                ngBindHtml: uw,
                ngBindTemplate: rw,
                ngClass: ew,
                ngClassEven: sw,
                ngClassOdd: ow,
                ngCloak: hw,
                ngController: cw,
                ngForm: wp,
                ngHide: ob,
                ngIf: aw,
                ngInclude: vw,
                ngInit: pw,
                ngNonBindable: nb,
                ngPluralize: ub,
                ngRepeat: fb,
                ngShow: eb,
                ngStyle: sb,
                ngSwitch: hb,
                ngSwitchWhen: cb,
                ngSwitchDefault: lb,
                ngOptions: rb,
                ngTransclude: vb,
                ngModel: kw,
                ngList: ww,
                ngChange: fw,
                pattern: yc,
                ngPattern: yc,
                required: vc,
                ngRequired: vc,
                minlength: wc,
                ngMinlength: wc,
                maxlength: pc,
                ngMaxlength: pc,
                ngValue: tw,
                ngModelOptions: gw
            }).directive({
                ngInclude: yw
            }).directive(kr).directive(cc);
            n.provider({
                $anchorScroll: yl,
                $animate: yy,
                $animateCss: by,
                $$animateJs: ay,
                $$animateQueue: vy,
                $$AnimateRunner: wy,
                $$animateAsyncRun: py,
                $browser: bl,
                $cacheFactory: kl,
                $controller: gl,
                $document: na,
                $exceptionHandler: ta,
                $filter: ps,
                $$forceReflow: dy,
                $interpolate: sa,
                $interval: ha,
                $http: ua,
                $httpParamSerializer: ia,
                $httpParamSerializerJQLike: ra,
                $httpBackend: ea,
                $xhrFactory: fa,
                $jsonpCallbacks: rp,
                $location: ca,
                $log: la,
                $parse: ya,
                $rootScope: ka,
                $q: pa,
                $$q: wa,
                $sce: tv,
                $sceDelegate: nv,
                $sniffer: iv,
                $templateCache: dl,
                $templateRequest: rv,
                $$testability: uv,
                $timeout: fv,
                $window: ev,
                $$rAF: ba,
                $$jqLite: al,
                $$HashMap: ey,
                $$cookieReader: ov
            })
        }
        ])
    }
    function cr(n) {
        return n.replace(ny, function(n, t, i, r) {
            return r ? i.toUpperCase() : i
        }).replace(ty, "Moz$1")
    }
    function ro(n) {
        return n = n.nodeType,
        1 === n || !n || 9 === n
    }
    function uo(n, i) {
        var u, r, f = i.createDocumentFragment(), e = [];
        if (ee.test(n)) {
            for (u = f.appendChild(i.createElement("div")),
            r = (ry.exec(n) || ["", ""])[1].toLowerCase(),
            r = ct[r] || ct._default,
            u.innerHTML = r[1] + n.replace(uy, "<$1><\/$2>") + r[2],
            r = r[0]; r--; )
                u = u.lastChild;
            e = or(e, u.childNodes);
            u = f.firstChild;
            u.textContent = ""
        } else
            e.push(i.createTextNode(n));
        return f.textContent = "",
        f.innerHTML = "",
        t(e, function(n) {
            f.appendChild(n)
        }),
        f
    }
    function fo(n, t) {
        var i = n.parentNode;
        i && i.replaceChild(t, n);
        t.appendChild(n)
    }
    function b(t) {
        var i, r;
        if (t instanceof b)
            return t;
        if (h(t) && (t = p(t),
        i = !0),
        !(this instanceof b)) {
            if (i && "<" != t.charAt(0))
                throw fe("nosel");
            return new b(t)
        }
        i && (i = n.document,
        t = (r = iy.exec(t)) ? [i.createElement(r[1])] : (r = uo(t, i)) ? r.childNodes : []);
        oo(this, t)
    }
    function af(n) {
        return n.cloneNode(!0)
    }
    function uu(n, t) {
        if (t || lr(n),
        n.querySelectorAll)
            for (var r = n.querySelectorAll("*"), i = 0, u = r.length; i < u; i++)
                lr(r[i])
    }
    function eo(n, i, r, f) {
        var e, o, s;
        if (u(f))
            throw fe("offargs");
        if (e = (f = fu(n)) && f.events,
        o = f && f.handle,
        o)
            if (i)
                s = function(t) {
                    var i = e[t];
                    u(r) && er(i || [], r);
                    u(r) && i && 0 < i.length || (n.removeEventListener(t, o, !1),
                    delete e[t])
                }
                ,
                t(i.split(" "), function(n) {
                    s(n);
                    gu[n] && s(gu[n])
                });
            else
                for (i in e)
                    "$destroy" !== i && n.removeEventListener(i, o, !1),
                    delete e[i]
    }
    function lr(n, t) {
        var r = n.ng339
          , i = r && gi[r];
        i && (t ? delete i.data[t] : (i.handle && (i.events.$destroy && i.handle({}, "$destroy"),
        eo(n)),
        delete gi[r],
        n.ng339 = void 0))
    }
    function fu(n, t) {
        var i = n.ng339
          , i = i && gi[i];
        return t && !i && (n.ng339 = i = ++ch,
        i = gi[i] = {
            events: {},
            data: {},
            handle: void 0
        }),
        i
    }
    function vf(n, t, i) {
        if (ro(n)) {
            var r = u(i)
              , f = !r && t && !s(t)
              , e = !t;
            if (n = (n = fu(n, !f)) && n.data,
            r)
                n[t] = i;
            else {
                if (e)
                    return n;
                if (f)
                    return n && n[t];
                a(n, t)
            }
        }
    }
    function eu(n, t) {
        return n.getAttribute ? -1 < (" " + (n.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + t + " ") : !1
    }
    function ou(n, i) {
        i && n.setAttribute && t(i.split(" "), function(t) {
            n.setAttribute("class", p((" " + (n.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + p(t) + " ", " ")))
        })
    }
    function su(n, i) {
        if (i && n.setAttribute) {
            var r = (" " + (n.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
            t(i.split(" "), function(n) {
                n = p(n);
                -1 === r.indexOf(" " + n + " ") && (r += n + " ")
            });
            n.setAttribute("class", p(r))
        }
    }
    function oo(n, t) {
        var i, r;
        if (t)
            if (t.nodeType)
                n[n.length++] = t;
            else if (i = t.length,
            "number" == typeof i && t.window !== t) {
                if (i)
                    for (r = 0; r < i; r++)
                        n[n.length++] = t[r]
            } else
                n[n.length++] = t
    }
    function so(n, t) {
        return hu(n, "$" + (t || "ngController") + "Controller")
    }
    function hu(n, t, i) {
        for (9 == n.nodeType && (n = n.documentElement),
        t = c(t) ? t : [t]; n; ) {
            for (var r = 0, f = t.length; r < f; r++)
                if (u(i = e.data(n, t[r])))
                    return i;
            n = n.parentNode || 11 === n.nodeType && n.host
        }
    }
    function ho(n) {
        for (uu(n, !0); n.firstChild; )
            n.removeChild(n.firstChild)
    }
    function cu(n, t) {
        t || uu(n);
        var i = n.parentNode;
        i && i.removeChild(n)
    }
    function sl(t, i) {
        if (i = i || n,
        "complete" === i.document.readyState)
            i.setTimeout(t);
        else
            e(i).on("load", t)
    }
    function co(n, t) {
        var i = nf[t.toLowerCase()];
        return i && oe[at(n)] && i
    }
    function hl(n, t) {
        var i = function(i, u) {
            var f, e, s, h, o;
            if (i.isDefaultPrevented = function() {
                return i.defaultPrevented
            }
            ,
            f = t[u || i.type],
            e = f ? f.length : 0,
            e)
                for (r(i.immediatePropagationStopped) && (s = i.stopImmediatePropagation,
                i.stopImmediatePropagation = function() {
                    i.immediatePropagationStopped = !0;
                    i.stopPropagation && i.stopPropagation();
                    s && s.call(i)
                }
                ),
                i.isImmediatePropagationStopped = function() {
                    return !0 === i.immediatePropagationStopped
                }
                ,
                h = f.specialHandlerWrapper || cl,
                1 < e && (f = st(f)),
                o = 0; o < e; o++)
                    i.isImmediatePropagationStopped() || h(n, i, f[o])
        };
        return i.elem = n,
        i
    }
    function cl(n, t, i) {
        i.call(n, t)
    }
    function ll(n, t, i) {
        var r = t.relatedTarget;
        r && (r === n || fy.call(n, r)) || i.call(n, t)
    }
    function al() {
        this.$get = function() {
            return a(b, {
                hasClass: function(n, t) {
                    return n.attr && (n = n[0]),
                    eu(n, t)
                },
                addClass: function(n, t) {
                    return n.attr && (n = n[0]),
                    su(n, t)
                },
                removeClass: function(n, t) {
                    return n.attr && (n = n[0]),
                    ou(n, t)
                }
            })
        }
    }
    function fi(n, t) {
        var i = n && n.$$hashKey;
        return i ? ("function" == typeof i && (i = n.$$hashKey()),
        i) : (i = typeof n,
        "function" == i || "object" == i && null !== n ? n.$$hashKey = i + ":" + (t || bc)() : i + ":" + n)
    }
    function pi(n, i) {
        if (i) {
            var r = 0;
            this.nextUid = function() {
                return ++r
            }
        }
        t(n, this.put, this)
    }
    function lo(n) {
        return n = (Function.prototype.toString.call(n) + " ").replace(ly, ""),
        n.match(oy) || n.match(sy)
    }
    function vl(n) {
        return (n = lo(n)) ? "function(" + (n[1] || "").replace(/[\s\r\n]+/, " ") + ")" : "fn"
    }
    function ar(n, i) {
        function l(n) {
            return function(i, r) {
                if (s(i))
                    t(i, ye(n));
                else
                    return n(i, r)
            }
        }
        function w(n, t) {
            if (yi(n, "service"),
            (f(t) || c(t)) && (t = o.instantiate(t)),
            !t.$get)
                throw li("pget", n);
            return e[n + "Provider"] = t
        }
        function tt(n, t) {
            return function() {
                var i = u.invoke(t, this);
                if (r(i))
                    throw li("undef", n);
                return i
            }
        }
        function v(n, t, i) {
            return w(n, {
                $get: !1 !== i ? tt(n, t) : t
            })
        }
        function b(n) {
            iu(r(n) || c(n), "modulesToLoad", "not an array");
            var i = [], u;
            return t(n, function(n) {
                function r(n) {
                    for (var i, r, t = 0, u = n.length; t < u; t++)
                        i = n[t],
                        r = o.get(i[0]),
                        r[i[1]].apply(r, i[2])
                }
                if (!d.get(n)) {
                    d.put(n, !0);
                    try {
                        h(n) ? (u = ue(n),
                        i = i.concat(b(u.requires)).concat(u._runBlocks),
                        r(u._invokeQueue),
                        r(u._configBlocks)) : f(n) ? i.push(o.invoke(n)) : c(n) ? i.push(o.invoke(n)) : vi(n, "module")
                    } catch (t) {
                        throw c(n) && (n = n[n.length - 1]),
                        t.message && t.stack && -1 == t.stack.indexOf(t.message) && (t = t.message + "\n" + t.stack),
                        li("modulerr", n, t.stack || t.message || t);
                    }
                }
            }),
            i
        }
        function k(n, t) {
            function r(i, r) {
                if (n.hasOwnProperty(i)) {
                    if (n[i] === y)
                        throw li("cdep", i + " <- " + a.join(" <- "));
                    return n[i]
                }
                try {
                    return a.unshift(i),
                    n[i] = y,
                    n[i] = t(i, r)
                } catch (u) {
                    throw n[i] === y && delete n[i],
                    u;
                } finally {
                    a.shift()
                }
            }
            function u(n, t, u) {
                var o = [], e, s, f;
                for (n = ar.$$annotate(n, i, u),
                e = 0,
                s = n.length; e < s; e++) {
                    if (f = n[e],
                    "string" != typeof f)
                        throw li("itkn", f);
                    o.push(t && t.hasOwnProperty(f) ? t[f] : r(f, u))
                }
                return o
            }
            return {
                invoke: function(n, t, i, r) {
                    return "string" == typeof i && (r = i,
                    i = null),
                    i = u(n, i, r),
                    c(n) && (n = n[n.length - 1]),
                    r = 11 >= ti ? !1 : "function" == typeof n && /^(?:class\b|constructor\()/.test(Function.prototype.toString.call(n) + " "),
                    r ? (i.unshift(null),
                    new (Function.prototype.bind.apply(n, i))) : n.apply(t, i)
                },
                instantiate: function(n, t, i) {
                    var r = c(n) ? n[n.length - 1] : n;
                    return n = u(n, t, i),
                    n.unshift(null),
                    new (Function.prototype.bind.apply(r, n))
                },
                get: r,
                annotate: ar.$$annotate,
                has: function(t) {
                    return e.hasOwnProperty(t + "Provider") || n.hasOwnProperty(t)
                }
            }
        }
        var nt, u;
        i = !0 === i;
        var y = {}
          , a = []
          , d = new pi([],!0)
          , e = {
            $provide: {
                provider: l(w),
                factory: l(v),
                service: l(function(n, t) {
                    return v(n, ["$injector", function(n) {
                        return n.instantiate(t)
                    }
                    ])
                }),
                value: l(function(n, t) {
                    return v(n, ft(t), !1)
                }),
                constant: l(function(n, t) {
                    yi(n, "constant");
                    e[n] = t;
                    g[n] = t
                }),
                decorator: function(n, t) {
                    var i = o.get(n + "Provider")
                      , r = i.$get;
                    i.$get = function() {
                        var n = u.invoke(r, i);
                        return u.invoke(t, null, {
                            $delegate: n
                        })
                    }
                }
            }
        }
          , o = e.$injector = k(e, function(n, t) {
            ut.isString(t) && a.push(t);
            throw li("unpr", a.join(" <- "));
        })
          , g = {}
          , p = k(g, function(n, t) {
            var i = o.get(n + "Provider", t);
            return u.invoke(i.$get, i, void 0, n)
        })
          , u = p;
        return e.$injectorProvider = {
            $get: ft(p)
        },
        nt = b(n),
        u = p.get("$injector"),
        u.strictDi = i,
        t(nt, function(n) {
            n && u.invoke(n)
        }),
        u
    }
    function yl() {
        var n = !0;
        this.disableAutoScrolling = function() {
            n = !1
        }
        ;
        this.$get = ["$window", "$location", "$rootScope", function(t, i, r) {
            function s(n) {
                var t = null;
                return Array.prototype.some.call(n, function(n) {
                    if ("a" === at(n))
                        return t = n,
                        !0
                }),
                t
            }
            function u(n) {
                if (n) {
                    n.scrollIntoView();
                    var i;
                    i = e.yOffset;
                    f(i) ? i = i() : hf(i) ? (i = i[0],
                    i = "fixed" !== t.getComputedStyle(i).position ? 0 : i.getBoundingClientRect().bottom) : w(i) || (i = 0);
                    i && (n = n.getBoundingClientRect().top,
                    t.scrollBy(0, n - i))
                } else
                    t.scrollTo(0, 0)
            }
            function e(n) {
                n = h(n) ? n : i.hash();
                var t;
                n ? (t = o.getElementById(n)) ? u(t) : (t = s(o.getElementsByName(n))) ? u(t) : "top" === n && u(null) : u(null)
            }
            var o = t.document;
            return n && r.$watch(function() {
                return i.hash()
            }, function(n, t) {
                n === t && "" === n || sl(function() {
                    r.$evalAsync(e)
                })
            }),
            e
        }
        ]
    }
    function vr(n, t) {
        return !n && !t ? "" : n ? t ? (c(n) && (n = n.join(" ")),
        c(t) && (t = t.join(" ")),
        n + " " + t) : n : t
    }
    function pl(n) {
        h(n) && (n = n.split(" "));
        var i = y();
        return t(n, function(n) {
            n.length && (i[n] = !0)
        }),
        i
    }
    function ei(n) {
        return s(n) ? n : {}
    }
    function wl(n, i, u, f) {
        function k(n) {
            try {
                n.apply(null, bt.call(arguments, 1))
            } finally {
                if (l--,
                0 === l)
                    for (; b.length; )
                        try {
                            b.pop()()
                        } catch (t) {
                            u.error(t)
                        }
            }
        }
        function d() {
            y = null;
            g();
            tt()
        }
        function g() {
            h = st();
            h = r(h) ? null : h;
            ot(h, nt) && (h = nt);
            nt = h
        }
        function tt() {
            (v !== s.url() || a !== h) && (v = s.url(),
            a = h,
            t(it, function(n) {
                n(s.url(), h)
            }))
        }
        var s = this, c = n.location, p = n.history, ut = n.setTimeout, ft = n.clearTimeout, w = {}, l, b;
        s.isMock = !1;
        l = 0;
        b = [];
        s.$$completeOutstandingRequest = k;
        s.$$incOutstandingRequestCount = function() {
            l++
        }
        ;
        s.notifyWhenNoOutstandingRequests = function(n) {
            0 === l ? n() : b.push(n)
        }
        ;
        var h, a, v = c.href, et = i.find("base"), y = null, st = f.history ? function() {
            try {
                return p.state
            } catch (n) {}
        }
        : o;
        g();
        a = h;
        s.url = function(t, i, u) {
            var o, e;
            return (r(u) && (u = null),
            c !== n.location && (c = n.location),
            p !== n.history && (p = n.history),
            t) ? (o = a === u,
            v === t && (!f.history || o)) ? s : (e = v && oi(v) === oi(t),
            v = t,
            a = u,
            !f.history || e && o ? (e || (y = t),
            i ? c.replace(t) : e ? (i = c,
            u = t.indexOf("#"),
            u = -1 === u ? "" : t.substr(u),
            i.hash = u) : c.href = t,
            c.href !== t && (y = t)) : (p[i ? "replaceState" : "pushState"](u, "", t),
            g(),
            a = h),
            y && (y = t),
            s) : y || c.href.replace(/%27/g, "'")
        }
        ;
        s.state = function() {
            return h
        }
        ;
        var it = []
          , rt = !1
          , nt = null;
        s.onUrlChange = function(t) {
            if (!rt) {
                if (f.history)
                    e(n).on("popstate", d);
                e(n).on("hashchange", d);
                rt = !0
            }
            return it.push(t),
            t
        }
        ;
        s.$$applicationDestroyed = function() {
            e(n).off("hashchange popstate", d)
        }
        ;
        s.$$checkUrlChange = tt;
        s.baseHref = function() {
            var n = et.attr("href");
            return n ? n.replace(/^(https?\:)?\/\/[^\/]*/, "") : ""
        }
        ;
        s.defer = function(n, t) {
            var i;
            return l++,
            i = ut(function() {
                delete w[i];
                k(n)
            }, t || 0),
            w[i] = !0,
            i
        }
        ;
        s.defer.cancel = function(n) {
            return w[n] ? (delete w[n],
            ft(n),
            k(o),
            !0) : !1
        }
    }
    function bl() {
        this.$get = ["$window", "$log", "$sniffer", "$document", function(n, t, i, r) {
            return new wl(n,r,t,i)
        }
        ]
    }
    function kl() {
        this.$get = function() {
            function i(t, i) {
                function v(n) {
                    n != o && (u ? u == n && (u = n.n) : u = n,
                    c(n.n, n.p),
                    c(n, o),
                    o = n,
                    o.n = null)
                }
                function c(n, t) {
                    n != t && (n && (n.p = t),
                    t && (t.n = n))
                }
                if (t in n)
                    throw l("$cacheFactory")("iid", t);
                var s = 0
                  , p = a({}, i, {
                    id: t
                })
                  , f = y()
                  , h = i && i.capacity || Number.MAX_VALUE
                  , e = y()
                  , o = null
                  , u = null;
                return n[t] = {
                    put: function(n, t) {
                        if (!r(t)) {
                            if (h < Number.MAX_VALUE) {
                                var i = e[n] || (e[n] = {
                                    key: n
                                });
                                v(i)
                            }
                            return n in f || s++,
                            f[n] = t,
                            s > h && this.remove(u.key),
                            t
                        }
                    },
                    get: function(n) {
                        if (h < Number.MAX_VALUE) {
                            var t = e[n];
                            if (!t)
                                return;
                            v(t)
                        }
                        return f[n]
                    },
                    remove: function(n) {
                        if (h < Number.MAX_VALUE) {
                            var t = e[n];
                            if (!t)
                                return;
                            t == o && (o = t.p);
                            t == u && (u = t.n);
                            c(t.n, t.p);
                            delete e[n]
                        }
                        n in f && (delete f[n],
                        s--)
                    },
                    removeAll: function() {
                        f = y();
                        s = 0;
                        e = y();
                        o = u = null
                    },
                    destroy: function() {
                        e = p = f = null;
                        delete n[t]
                    },
                    info: function() {
                        return a({}, p, {
                            size: s
                        })
                    }
                }
            }
            var n = {};
            return i.info = function() {
                var i = {};
                return t(n, function(n, t) {
                    i[t] = n.info()
                }),
                i
            }
            ,
            i.get = function(t) {
                return n[t]
            }
            ,
            i
        }
    }
    function dl() {
        this.$get = ["$cacheFactory", function(n) {
            return n("templates")
        }
        ]
    }
    function ao(i, l) {
        function d(n, i, r) {
            var f = /^\s*([@&<]|=(\*?))(\??)\s*(\w*)\s*$/
              , u = y();
            return t(n, function(n, t) {
                if (n in nt)
                    u[t] = nt[n];
                else {
                    var e = n.match(f);
                    if (!e)
                        throw g("iscp", i, t, n, r ? "controller bindings definition" : "isolate scope definition");
                    u[t] = {
                        mode: e[1][0],
                        collection: "*" === e[2],
                        optional: "?" === e[3],
                        attrName: e[4] || t
                    };
                    e[4] && (nt[n] = u[t])
                }
            }),
            u
        }
        function it(n) {
            var t = n.charAt(0);
            if (!t || t !== v(t))
                throw g("baddir", n);
            if (n !== n.trim())
                throw g("baddir", n);
        }
        function ut(n) {
            var i = n.require || n.controller && n.name;
            return !c(i) && s(i) && t(i, function(n, t) {
                var r = n.match(tt);
                n.substring(r[0].length) || (i[t] = r[0] + t)
            }),
            i
        }
        var b = {}, et = /^\s*directive\:\s*([\w\-]+)\s+(.*)$/, st = /(([\w\-]+)(?:\:([^;]+))?;?)/, ht = gc("ngSrc,ngSrcset,src,srcset"), tt = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/, ct = /^(on[a-z]+|formaction)$/, nt = y(), w, k;
        this.directive = function lt(n, r) {
            return yi(n, "directive"),
            h(n) ? (it(n),
            iu(r, "directiveFactory"),
            b.hasOwnProperty(n) || (b[n] = [],
            i.factory(n + "Directive", ["$injector", "$exceptionHandler", function(i, r) {
                var u = [];
                return t(b[n], function(t, e) {
                    try {
                        var o = i.invoke(t);
                        f(o) ? o = {
                            compile: ft(o)
                        } : !o.compile && o.link && (o.compile = ft(o.link));
                        o.priority = o.priority || 0;
                        o.index = e;
                        o.name = o.name || n;
                        o.require = ut(o);
                        o.restrict = o.restrict || "EA";
                        o.$$moduleName = t.$$moduleName;
                        u.push(o)
                    } catch (s) {
                        r(s)
                    }
                }),
                u
            }
            ])),
            b[n].push(r)) : t(n, ye(lt)),
            this
        }
        ;
        this.component = function(n, i) {
            function r(n) {
                function r(t) {
                    return f(t) || c(t) ? function(i, r) {
                        return n.invoke(t, this, {
                            $element: i,
                            $attrs: r
                        })
                    }
                    : t
                }
                var o = i.template || i.templateUrl ? i.template : ""
                  , e = {
                    controller: u,
                    controllerAs: po(i.controller) || i.controllerAs || "$ctrl",
                    template: r(o),
                    templateUrl: r(i.templateUrl),
                    transclude: i.transclude,
                    scope: {},
                    bindToController: i.bindings || {},
                    restrict: "E",
                    require: i.require
                };
                return t(i, function(n, t) {
                    "$" === t.charAt(0) && (e[t] = n)
                }),
                e
            }
            var u = i.controller || function() {}
            ;
            return t(i, function(n, t) {
                "$" === t.charAt(0) && (r[t] = n,
                f(u) && (u[t] = n))
            }),
            r.$inject = ["$injector"],
            this.directive(n, r)
        }
        ;
        this.aHrefSanitizationWhitelist = function(n) {
            return u(n) ? (l.aHrefSanitizationWhitelist(n),
            this) : l.aHrefSanitizationWhitelist()
        }
        ;
        this.imgSrcSanitizationWhitelist = function(n) {
            return u(n) ? (l.imgSrcSanitizationWhitelist(n),
            this) : l.imgSrcSanitizationWhitelist()
        }
        ;
        w = !0;
        this.debugInfoEnabled = function(n) {
            return u(n) ? (w = n,
            this) : w
        }
        ;
        k = 10;
        this.onChangesTtl = function(n) {
            return arguments.length ? (k = n,
            this) : k
        }
        ;
        this.$get = ["$injector", "$interpolate", "$exceptionHandler", "$templateRequest", "$parse", "$controller", "$rootScope", "$sce", "$animate", "$$sanitizeUri", function(i, l, nt, it, ut, ft, lt, pt, kt, dt) {
            function ar() {
                try {
                    if (!--or)
                        throw ni = void 0,
                        g("infchng", k);
                    lt.$apply(function() {
                        for (var n = [], t = 0, i = ni.length; t < i; ++t)
                            try {
                                ni[t]()
                            } catch (r) {
                                n.push(r)
                            }
                        if (ni = void 0,
                        n.length)
                            throw n;
                    })
                } finally {
                    or++
                }
            }
            function si(n, t) {
                if (t)
                    for (var u = Object.keys(t), r, i = 0, f = u.length; i < f; i++)
                        r = u[i],
                        this[r] = t[r];
                else
                    this.$attr = {};
                this.$$element = n
            }
            function vr(n, t, i) {
                ur.innerHTML = "<span " + t + ">";
                t = ur.firstChild.attributes;
                var r = t[0];
                t.removeNamedItem(r.name);
                r.value = i;
                n.attributes.setNamedItem(r)
            }
            function hi(n, t) {
                try {
                    n.addClass(t)
                } catch (i) {}
            }
            function gt(t, i, r, u, f) {
                var h, c, o;
                t instanceof e || (t = e(t));
                for (var s = 0, l = t.length; s < l; s++)
                    h = t[s],
                    h.nodeType === di && h.nodeValue.match(/\S+/) && fo(h, t[s] = n.document.createElement("span"));
                return c = ci(t, i, t, r, u, f),
                gt.$$addScopeClass(t),
                o = null,
                function(n, i, r) {
                    var u, s, h;
                    if (iu(n, "scope"),
                    f && f.needsNewScope && (n = n.$parent.$new()),
                    r = r || {},
                    u = r.parentBoundTranscludeFn,
                    s = r.transcludeControllers,
                    r = r.futureParentElement,
                    u && u.$$boundTransclude && (u = u.$$boundTransclude),
                    o || (o = (r = r && r[0]) ? "foreignobject" !== at(r) && rt.call(r).match(/SVG/) ? "svg" : "html" : "html"),
                    r = "html" !== o ? e(vi(o, e("<div>").append(t).html())) : i ? nr.clone.call(t) : t,
                    s)
                        for (h in s)
                            r.data("$" + h + "Controller", s[h].instance);
                    return gt.$$addScopeInfo(r, n),
                    i && i(r, n),
                    c && c(n, r, r, u),
                    r
                }
            }
            function ci(n, t, i, r, u, f) {
                function y(n, i, r, u) {
                    var s, h, c, f, v, y, l;
                    if (a)
                        for (l = Array(i.length),
                        f = 0; f < o.length; f += 3)
                            s = o[f],
                            l[s] = i[s];
                    else
                        l = i;
                    for (f = 0,
                    v = o.length; f < v; )
                        h = l[o[f++]],
                        i = o[f++],
                        s = o[f++],
                        i ? (i.scope ? (c = n.$new(),
                        gt.$$addScopeInfo(e(h), c)) : c = n,
                        y = i.transcludeOnThisElement ? ri(n, i.transclude, u) : !i.templateOnThisElement && u ? u : !u && t ? ri(n, t) : null,
                        i(s, c, h, r, y)) : s && s(n, h.childNodes, void 0, u)
                }
                for (var o = [], s, c, l, v, a, h = 0; h < n.length; h++)
                    s = new si,
                    c = li(n[h], [], s, 0 === h ? r : void 0, u),
                    (f = c.length ? bi(c, n[h], s, t, i, null, [], [], f) : null) && f.scope && gt.$$addScopeClass(s.$$element),
                    s = f && f.terminal || !(l = n[h].childNodes) || !l.length ? null : ci(l, f ? (f.transcludeOnThisElement || !f.templateOnThisElement) && f.transclude : t),
                    (f || s) && (o.push(h, f, s),
                    v = !0,
                    a = a || f),
                    f = null;
                return v ? y : null
            }
            function ri(n, t, i) {
                function u(r, u, f, e, o) {
                    return r || (r = n.$new(!1, o),
                    r.$$transcluded = !0),
                    t(r, u, {
                        parentBoundTranscludeFn: i,
                        transcludeControllers: f,
                        futureParentElement: e
                    })
                }
                var f = u.$$slots = y(), r;
                for (r in t.$$slots)
                    f[r] = t.$$slots[r] ? ri(n, t.$$slots[r], i) : null;
                return u
            }
            function li(n, t, i, r, u) {
                var o = i.$attr, y, w;
                switch (n.nodeType) {
                case 1:
                    ei(t, yt(at(n)), "E", r, u);
                    for (var f, e, c, l, a = n.attributes, v = 0, b = a && a.length; v < b; v++)
                        y = !1,
                        w = !1,
                        f = a[v],
                        e = f.name,
                        c = p(f.value),
                        f = yt(e),
                        (l = ru.test(f)) && (e = e.replace(ah, "").substr(8).replace(/_(.)/g, function(n, t) {
                            return t.toUpperCase()
                        })),
                        (f = f.match(uu)) && wr(f[1]) && (y = e,
                        w = e.substr(0, e.length - 5) + "end",
                        e = e.substr(0, e.length - 6)),
                        f = yt(e.toLowerCase()),
                        o[f] = e,
                        (l || !i.hasOwnProperty(f)) && (i[f] = c,
                        co(n, f) && (i[f] = !0)),
                        nu(n, t, c, f, l),
                        ei(t, f, "A", r, u, y, w);
                    if (o = n.className,
                    s(o) && (o = o.animVal),
                    h(o) && "" !== o)
                        for (; n = st.exec(o); )
                            f = yt(n[2]),
                            ei(t, f, "C", r, u) && (i[f] = p(n[3])),
                            o = o.substr(n.index + n[0].length);
                    break;
                case di:
                    if (11 === ti)
                        for (; n.parentNode && n.nextSibling && n.nextSibling.nodeType === di; )
                            n.nodeValue += n.nextSibling.nodeValue,
                            n.parentNode.removeChild(n.nextSibling);
                    dr(t, n.nodeValue);
                    break;
                case 8:
                    yr(n, t, i, r, u)
                }
                return t.sort(kr),
                t
            }
            function yr(n, t, i, r, u) {
                var f, e;
                try {
                    f = et.exec(n.nodeValue);
                    f && (e = yt(f[1]),
                    ei(t, e, "M", r, u) && (i[e] = p(f[2])))
                } catch (o) {}
            }
            function pi(n, t, i) {
                var r = []
                  , u = 0;
                if (t && n.hasAttribute && n.hasAttribute(t)) {
                    do {
                        if (!n)
                            throw g("uterdir", t, i);
                        1 == n.nodeType && (n.hasAttribute(t) && u++,
                        n.hasAttribute(i) && u--);
                        r.push(n);
                        n = n.nextSibling
                    } while (0 < u)
                } else
                    r.push(n);
                return e(r)
            }
            function wi(n, t, i) {
                return function(r, u, f, e, o) {
                    return u = pi(u[0], t, i),
                    n(r, u, f, e, o)
                }
            }
            function ai(n, t, i, r, u, f) {
                var e;
                return n ? gt(t, i, r, u, f) : function() {
                    return e || (e = gt(t, i, r, u, f),
                    t = i = f = null),
                    e.apply(this, arguments)
                }
            }
            function bi(n, i, u, o, h, l, v, w, b) {
                function ur(n, t, i, r) {
                    n && (i && (n = wi(n, i, r)),
                    n.require = k.require,
                    n.directiveName = ot,
                    (d === k || k.$$isolateScope) && (n = tr(n, {
                        isolateScope: !0
                    })),
                    v.push(n));
                    t && (i && (t = wi(t, i, r)),
                    t.require = k.require,
                    t.directiveName = ot,
                    (d === k || k.$$isolateScope) && (t = tr(t, {
                        isolateScope: !0
                    })),
                    w.push(t))
                }
                function lt(n, o, h, l, y) {
                    function at(n, t, i, u) {
                        var e, f;
                        if (fr(n) || (u = i,
                        i = t,
                        t = n,
                        n = void 0),
                        ri && (e = rt),
                        i || (i = ri ? b.parent() : b),
                        u) {
                            if (f = y.$$slots[u],
                            f)
                                return f(n, t, e, i, ht);
                            if (r(f))
                                throw g("noslot", u, vt(b));
                        } else
                            return y(n, t, e, i, ht)
                    }
                    var k, tt, p, it, ft, rt, ot, b, ct, lt, ht;
                    i === h ? (l = u,
                    b = u.$$element) : (b = e(h),
                    l = new si(b,u));
                    ft = o;
                    d ? it = o.$new(!0) : ut && (ft = o.$parent);
                    y && (ot = at,
                    ot.$$boundTransclude = y,
                    ot.isSlotFilled = function(n) {
                        return !!y.$$slots[n]
                    }
                    );
                    et && (rt = pr(b, l, ot, et, it, o, d));
                    d && (gt.$$addScopeInfo(b, it, !0, !(st && (st === d || st === d.$$originalDirective))),
                    gt.$$addScopeClass(b, !0),
                    it.$$isolateBindings = d.$$isolateBindings,
                    tt = yi(o, l, it, it.$$isolateBindings, d),
                    tt.removeWatches && it.$on("$destroy", tt.removeWatches));
                    for (k in rt)
                        tt = et[k],
                        p = rt[k],
                        ct = tt.$$bindings.bindToController,
                        p.bindingInfo = p.identifier && ct ? yi(ft, l, p.instance, ct, tt) : {},
                        lt = p(),
                        lt !== p.instance && (p.instance = lt,
                        b.data("$" + tt.name + "Controller", lt),
                        p.bindingInfo.removeWatches && p.bindingInfo.removeWatches(),
                        p.bindingInfo = yi(ft, l, p.instance, ct, tt));
                    for (t(et, function(n, t) {
                        var i = n.require;
                        n.bindToController && !c(i) && s(i) && a(rt[t].instance, fi(t, i, b, rt))
                    }),
                    t(rt, function(n) {
                        var t = n.instance;
                        if (f(t.$onChanges))
                            try {
                                t.$onChanges(n.bindingInfo.initialChanges)
                            } catch (i) {
                                nt(i)
                            }
                        if (f(t.$onInit))
                            try {
                                t.$onInit()
                            } catch (r) {
                                nt(r)
                            }
                        f(t.$doCheck) && (ft.$watch(function() {
                            t.$doCheck()
                        }),
                        t.$doCheck());
                        f(t.$onDestroy) && ft.$on("$destroy", function() {
                            t.$onDestroy()
                        })
                    }),
                    k = 0,
                    tt = v.length; k < tt; k++)
                        p = v[k],
                        rr(p, p.isolateScope ? it : o, b, l, p.require && fi(p.directiveName, p.require, b, rt), ot);
                    for (ht = o,
                    d && (d.template || null === d.templateUrl) && (ht = it),
                    n && n(ht, h.childNodes, void 0, y),
                    k = w.length - 1; 0 <= k; k--)
                        p = w[k],
                        rr(p, p.isolateScope ? it : o, b, l, p.require && fi(p.directiveName, p.require, b, rt), ot);
                    t(rt, function(n) {
                        n = n.instance;
                        f(n.$postLink) && n.$postLink()
                    })
                }
                var ni, ei, ft, ir, hi, ci, er, bi;
                b = b || {};
                for (var dt = -Number.MAX_VALUE, ut = b.newScopeDirective, et = b.controllerDirectives, d = b.newIsolateScopeDirective, st = b.templateDirective, ti = b.nonTlbTranscludeDirective, di = !1, nr = !1, ri = b.hasElementTranscludeDirective, tt = u.$$element = e(i), k, ot, rt, pt = o, wt, ht = !1, ui = !1, it, ct = 0, kt = n.length; ct < kt; ct++) {
                    if (k = n[ct],
                    ni = k.$$start,
                    ei = k.$$end,
                    ni && (tt = pi(i, ni, ei)),
                    rt = void 0,
                    dt > k.priority)
                        break;
                    if ((it = k.scope) && (k.templateUrl || (s(it) ? (ii("new/isolated scope", d || ut, k, tt),
                    d = k) : ii("new/isolated scope", d, k, tt)),
                    ut = ut || k),
                    ot = k.name,
                    !ht && (k.replace && (k.templateUrl || k.template) || k.transclude && !k.$$tlb)) {
                        for (it = ct + 1; ht = n[it++]; )
                            if (ht.transclude && !ht.$$tlb || ht.replace && (ht.templateUrl || ht.template)) {
                                ui = !0;
                                break
                            }
                        ht = !0
                    }
                    if (!k.templateUrl && k.controller && (it = k.controller,
                    et = et || y(),
                    ii("'" + ot + "' controller", et[ot], k, tt),
                    et[ot] = k),
                    it = k.transclude)
                        if (di = !0,
                        k.$$tlb || (ii("transclusion", ti, k, tt),
                        ti = k),
                        "element" == it)
                            ri = !0,
                            dt = k.priority,
                            rt = tt,
                            tt = u.$$element = e(gt.$$createComment(ot, u[ot])),
                            i = tt[0],
                            oi(h, bt.call(rt, 0), i),
                            rt[0].$$parentNode = rt[0].parentNode,
                            pt = ai(ui, rt, o, dt, l && l.name, {
                                nonTlbTranscludeDirective: ti
                            });
                        else {
                            if (ft = y(),
                            rt = e(af(i)).contents(),
                            s(it)) {
                                rt = [];
                                ir = y();
                                hi = y();
                                t(it, function(n, t) {
                                    var i = "?" === n.charAt(0);
                                    n = i ? n.substring(1) : n;
                                    ir[n] = t;
                                    ft[t] = null;
                                    hi[t] = i
                                });
                                t(tt.contents(), function(n) {
                                    var t = ir[yt(at(n))];
                                    t ? (hi[t] = !0,
                                    ft[t] = ft[t] || [],
                                    ft[t].push(n)) : rt.push(n)
                                });
                                t(hi, function(n, t) {
                                    if (!n)
                                        throw g("reqslot", t);
                                });
                                for (ci in ft)
                                    ft[ci] && (ft[ci] = ai(ui, ft[ci], o))
                            }
                            tt.empty();
                            pt = ai(ui, rt, o, void 0, void 0, {
                                needsNewScope: k.$$isolateScope || k.$$newScope
                            });
                            pt.$$slots = ft
                        }
                    if (k.template)
                        if (nr = !0,
                        ii("template", st, k, tt),
                        st = k,
                        it = f(k.template) ? k.template(tt, u) : k.template,
                        it = lr(it),
                        k.replace) {
                            if (l = k,
                            rt = ee.test(it) ? yo(vi(k.templateNamespace, p(it))) : [],
                            i = rt[0],
                            1 != rt.length || 1 !== i.nodeType)
                                throw g("tplrt", ot, "");
                            oi(h, tt, i);
                            kt = {
                                $attr: {}
                            };
                            it = li(i, [], kt);
                            er = n.splice(ct + 1, n.length - (ct + 1));
                            (d || ut) && ki(it, d, ut);
                            n = n.concat(it).concat(er);
                            gi(u, kt);
                            kt = n.length
                        } else
                            tt.html(it);
                    if (k.templateUrl)
                        nr = !0,
                        ii("template", st, k, tt),
                        st = k,
                        k.replace && (l = k),
                        lt = br(n.splice(ct, n.length - ct), tt, u, h, di && pt, v, w, {
                            controllerDirectives: et,
                            newScopeDirective: ut !== k && ut,
                            newIsolateScopeDirective: d,
                            templateDirective: st,
                            nonTlbTranscludeDirective: ti
                        }),
                        kt = n.length;
                    else if (k.compile)
                        try {
                            wt = k.compile(tt, u, pt);
                            bi = k.$$originalDirective || k;
                            f(wt) ? ur(null, sr(bi, wt), ni, ei) : wt && ur(sr(bi, wt.pre), sr(bi, wt.post), ni, ei)
                        } catch (or) {
                            nt(or, vt(tt))
                        }
                    k.terminal && (lt.terminal = !0,
                    dt = Math.max(dt, k.priority))
                }
                return lt.scope = ut && !0 === ut.scope,
                lt.transcludeOnThisElement = di,
                lt.templateOnThisElement = nr,
                lt.transclude = pt,
                b.hasElementTranscludeDirective = ri,
                lt
            }
            function fi(n, i, r, u) {
                var f, o, e, l;
                if (h(i)) {
                    if (e = i.match(tt),
                    i = i.substring(e[0].length),
                    o = e[1] || e[3],
                    e = "?" === e[2],
                    "^^" === o ? r = r.parent() : f = (f = u && u[i]) && f.instance,
                    f || (l = "$" + i + "Controller",
                    f = o ? r.inheritedData(l) : r.data(l)),
                    !f && !e)
                        throw g("ctreq", i, n);
                } else if (c(i))
                    for (f = [],
                    o = 0,
                    e = i.length; o < e; o++)
                        f[o] = fi(n, i[o], r, u);
                else
                    s(i) && (f = {},
                    t(i, function(t, i) {
                        f[i] = fi(n, t, r, u)
                    }));
                return f || null
            }
            function pr(n, t, i, r, u, f, e) {
                var c = y(), l;
                for (l in r) {
                    var o = r[l]
                      , s = {
                        $scope: o === e || o.$$isolateScope ? u : f,
                        $element: n,
                        $attrs: t,
                        $transclude: i
                    }
                      , h = o.controller;
                    "@" == h && (h = t[o.name]);
                    s = ft(h, s, !0, o.controllerAs);
                    c[o.name] = s;
                    n.data("$" + o.name + "Controller", s.instance)
                }
                return c
            }
            function ki(n, t, i) {
                for (var r = 0, u = n.length; r < u; r++)
                    n[r] = sf(n[r], {
                        $$isolateScope: t,
                        $$newScope: i
                    })
            }
            function ei(n, t, u, f, e, o, h) {
                var c, y, k, p, tt, w;
                if (t === e)
                    return null;
                if (e = null,
                b.hasOwnProperty(t))
                    for (t = i.get(t + "Directive"),
                    y = 0,
                    k = t.length; y < k; y++)
                        try {
                            if (c = t[y],
                            (r(f) || f > c.priority) && -1 != c.restrict.indexOf(u)) {
                                if (o && (c = sf(c, {
                                    $$start: o,
                                    $$end: h
                                })),
                                !c.$$bindings) {
                                    var it = c
                                      , l = c
                                      , v = c.name
                                      , a = {
                                        isolateScope: null,
                                        bindToController: null
                                    };
                                    if (s(l.scope) && (!0 === l.bindToController ? (a.bindToController = d(l.scope, v, !0),
                                    a.isolateScope = {}) : a.isolateScope = d(l.scope, v, !1)),
                                    s(l.bindToController) && (a.bindToController = d(l.bindToController, v, !0)),
                                    s(a.bindToController)) {
                                        if (p = l.controller,
                                        tt = l.controllerAs,
                                        !p)
                                            throw g("noctrl", v);
                                        if (!po(p, tt))
                                            throw g("noident", v);
                                    }
                                    w = it.$$bindings = a;
                                    s(w.isolateScope) && (c.$$isolateBindings = w.isolateScope)
                                }
                                n.push(c);
                                e = c
                            }
                        } catch (rt) {
                            nt(rt)
                        }
                return e
            }
            function wr(n) {
                if (b.hasOwnProperty(n))
                    for (var r = i.get(n + "Directive"), t = 0, u = r.length; t < u; t++)
                        if (n = r[t],
                        n.multiElement)
                            return !0;
                return !1
            }
            function gi(n, i) {
                var r = i.$attr
                  , u = n.$attr;
                t(n, function(t, u) {
                    "$" != u.charAt(0) && (i[u] && i[u] !== t && (t += ("style" === u ? ";" : " ") + i[u]),
                    n.$set(u, t, !0, r[u]))
                });
                t(i, function(t, i) {
                    n.hasOwnProperty(i) || "$" === i.charAt(0) || (n[i] = t,
                    "class" !== i && "style" !== i && (u[i] = r[i]))
                })
            }
            function br(n, i, r, u, o, h, c, l) {
                var v = [], y, w, b = i[0], a = n.shift(), d = sf(a, {
                    templateUrl: null,
                    transclude: null,
                    replace: null,
                    $$originalDirective: a
                }), k = f(a.templateUrl) ? a.templateUrl(i, r) : a.templateUrl, nt = a.templateNamespace;
                return i.empty(),
                it(k).then(function(f) {
                    var tt, rt, it, ft;
                    if (f = lr(f),
                    a.replace) {
                        if (f = ee.test(f) ? yo(vi(nt, p(f))) : [],
                        tt = f[0],
                        1 != f.length || 1 !== tt.nodeType)
                            throw g("tplrt", a.name, k);
                        f = {
                            $attr: {}
                        };
                        oi(u, i, tt);
                        it = li(tt, [], f);
                        s(a.scope) && ki(it, !0);
                        n = it.concat(n);
                        gi(r, f)
                    } else
                        tt = b,
                        i.html(f);
                    for (n.unshift(d),
                    y = bi(n, tt, r, o, i, a, h, c, l),
                    t(u, function(n, t) {
                        n == tt && (u[t] = i[0])
                    }),
                    w = ci(i[0].childNodes, o); v.length; ) {
                        f = v.shift();
                        rt = v.shift();
                        var et = v.shift()
                          , ut = v.shift()
                          , it = i[0];
                        f.$$destroyed || (rt !== b && (ft = rt.className,
                        l.hasElementTranscludeDirective && a.replace || (it = af(tt)),
                        oi(et, e(rt), it),
                        hi(e(it), ft)),
                        rt = y.transcludeOnThisElement ? ri(f, y.transclude, ut) : ut,
                        y(w, f, it, u, rt))
                    }
                    v = null
                }),
                function(n, t, i, r, u) {
                    n = u;
                    t.$$destroyed || (v ? v.push(t, i, r, n) : (y.transcludeOnThisElement && (n = ri(t, y.transclude, u)),
                    y(w, t, i, r, n)))
                }
            }
            function kr(n, t) {
                var i = t.priority - n.priority;
                return 0 !== i ? i : n.name !== t.name ? n.name < t.name ? -1 : 1 : n.index - t.index
            }
            function ii(n, t, i, r) {
                function u(n) {
                    return n ? " (module: " + n + ")" : ""
                }
                if (t)
                    throw g("multidir", t.name, u(t.$$moduleName), i.name, u(i.$$moduleName), n, vt(r));
            }
            function dr(n, t) {
                var i = l(t, !0);
                i && n.push({
                    priority: 0,
                    compile: function(n) {
                        n = n.parent();
                        var t = !!n.length;
                        return t && gt.$$addBindingClass(n),
                        function(n, r) {
                            var u = r.parent();
                            t || gt.$$addBindingClass(u);
                            gt.$$addBindingInfo(u, i.expressions);
                            n.$watch(i, function(n) {
                                r[0].nodeValue = n
                            })
                        }
                    }
                })
            }
            function vi(t, i) {
                t = v(t || "html");
                switch (t) {
                case "svg":
                case "math":
                    var r = n.document.createElement("div");
                    return r.innerHTML = "<" + t + ">" + i + "<\/" + t + ">",
                    r.childNodes[0].childNodes;
                default:
                    return i
                }
            }
            function gr(n, t) {
                if ("srcdoc" == t)
                    return pt.HTML;
                var i = at(n);
                if ("xlinkHref" == t || "form" == i && "action" == t || "img" != i && ("src" == t || "ngSrc" == t))
                    return pt.RESOURCE_URL
            }
            function nu(n, t, i, r, u) {
                var e = gr(n, r), f;
                if (u = ht[r] || u,
                f = l(i, !0, e, u),
                f) {
                    if ("multiple" === r && "select" === at(n))
                        throw g("selmulti", vt(n));
                    t.push({
                        priority: 100,
                        compile: function() {
                            return {
                                pre: function(n, t, o) {
                                    if (t = o.$$observers || (o.$$observers = y()),
                                    ct.test(r))
                                        throw g("nodomevents");
                                    var s = o[r];
                                    s !== i && (f = s && l(s, !0, e, u),
                                    i = s);
                                    f && (o[r] = f(n),
                                    (t[r] || (t[r] = [])).$$inter = !0,
                                    (o.$$observers && o.$$observers[r].$$scope || n).$watch(f, function(n, t) {
                                        "class" === r && n != t ? o.$updateClass(n, t) : o.$set(r, n)
                                    }))
                                }
                            }
                        }
                    })
                }
            }
            function oi(t, i, r) {
                var f = i[0], s = i.length, c = f.parentNode, u, o, h;
                if (t)
                    for (u = 0,
                    o = t.length; u < o; u++)
                        if (t[u] == f) {
                            for (t[u++] = r,
                            o = u + s - 1,
                            h = t.length; u < h; u++,
                            o++)
                                o < h ? t[u] = t[o] : delete t[u];
                            t.length -= s - 1;
                            t.context === f && (t.context = r);
                            break
                        }
                for (c && c.replaceChild(r, f),
                t = n.document.createDocumentFragment(),
                u = 0; u < s; u++)
                    t.appendChild(i[u]);
                for (e.hasData(f) && (e.data(r, e.data(f)),
                e(f).off("$destroy")),
                e.cleanData(t.querySelectorAll("*")),
                u = 1; u < s; u++)
                    delete i[u];
                i[0] = r;
                i.length = 1
            }
            function tr(n, t) {
                return a(function() {
                    return n.apply(null, arguments)
                }, n, t)
            }
            function rr(n, t, i, r, u, f) {
                try {
                    n(t, i, r, u, f)
                } catch (e) {
                    nt(e, vt(i))
                }
            }
            function yi(n, i, r, u, e) {
                function v(t, i, u) {
                    f(r.$onChanges) && i !== u && (ni || (n.$$postDigest(ar),
                    ni = []),
                    s || (s = {},
                    ni.push(y)),
                    s[t] && (u = s[t].previousValue),
                    s[t] = new lu(u,i))
                }
                function y() {
                    r.$onChanges(s);
                    s = void 0
                }
                var c = [], a = {}, s;
                return t(u, function(t, u) {
                    var f = t.attrName, s = t.optional, p, y, k, w, b;
                    switch (t.mode) {
                    case "@":
                        s || wt.call(i, f) || (r[u] = i[f] = void 0);
                        i.$observe(f, function(n) {
                            (h(n) || ui(n)) && (v(u, n, r[u]),
                            r[u] = n)
                        });
                        i.$$observers[f].$$scope = n;
                        p = i[f];
                        h(p) ? r[u] = l(p)(n) : ui(p) && (r[u] = p);
                        a[u] = new lu(he,r[u]);
                        break;
                    case "=":
                        if (!wt.call(i, f)) {
                            if (s)
                                break;
                            i[f] = void 0
                        }
                        if (s && !i[f])
                            break;
                        y = ut(i[f]);
                        w = y.literal ? ot : function(n, t) {
                            return n === t || n !== n && t !== t
                        }
                        ;
                        k = y.assign || function() {
                            p = r[u] = y(n);
                            throw g("nonassign", i[f], f, e.name);
                        }
                        ;
                        p = r[u] = y(n);
                        s = function(t) {
                            return w(t, r[u]) || (w(t, p) ? k(n, t = r[u]) : r[u] = t),
                            p = t
                        }
                        ;
                        s.$stateful = !0;
                        s = t.collection ? n.$watchCollection(i[f], s) : n.$watch(ut(i[f], s), null, y.literal);
                        c.push(s);
                        break;
                    case "<":
                        if (!wt.call(i, f)) {
                            if (s)
                                break;
                            i[f] = void 0
                        }
                        if (s && !i[f])
                            break;
                        y = ut(i[f]);
                        b = r[u] = y(n);
                        a[u] = new lu(he,r[u]);
                        s = n.$watch(y, function(n, t) {
                            if (t === n) {
                                if (t === b)
                                    return;
                                t = b
                            }
                            v(u, n, t);
                            r[u] = n
                        }, y.literal);
                        c.push(s);
                        break;
                    case "&":
                        if (y = i.hasOwnProperty(f) ? ut(i[f]) : o,
                        y === o && s)
                            break;
                        r[u] = function(t) {
                            return y(n, t)
                        }
                    }
                }),
                {
                    initialChanges: a,
                    removeWatches: c.length && function() {
                        for (var n = 0, t = c.length; n < t; ++n)
                            c[n]()
                    }
                }
            }
            var tu = /^\w/, ur = n.document.createElement("div"), or = k, ni;
            si.prototype = {
                $normalize: yt,
                $addClass: function(n) {
                    n && 0 < n.length && kt.addClass(this.$$element, n)
                },
                $removeClass: function(n) {
                    n && 0 < n.length && kt.removeClass(this.$$element, n)
                },
                $updateClass: function(n, t) {
                    var i = vo(n, t);
                    i && i.length && kt.addClass(this.$$element, i);
                    (i = vo(t, n)) && i.length && kt.removeClass(this.$$element, i)
                },
                $set: function(n, i, f, e) {
                    var s = co(this.$$element[0], n)
                      , o = se[n]
                      , l = n;
                    if (s ? (this.$$element.prop(n, i),
                    e = s) : o && (this[o] = i,
                    l = o),
                    this[n] = i,
                    e ? this.$attr[n] = e : (e = this.$attr[n]) || (this.$attr[n] = e = to(n, "-")),
                    s = at(this.$$element),
                    "a" === s && ("href" === n || "xlinkHref" === n) || "img" === s && "src" === n)
                        this[n] = i = dt(i, "src" === n);
                    else if ("img" === s && "srcset" === n && u(i)) {
                        for (var s = "", o = p(i), h = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/, h = /\s/.test(o) ? h : /(,)/, o = o.split(h), h = Math.floor(o.length / 2), c = 0; c < h; c++)
                            var a = 2 * c
                              , s = s + dt(p(o[a]), !0)
                              , s = s + (" " + p(o[a + 1]));
                        o = p(o[2 * c]).split(/\s/);
                        s += dt(p(o[0]), !0);
                        2 === o.length && (s += " " + p(o[1]));
                        this[n] = i = s
                    }
                    !1 !== f && (null === i || r(i) ? this.$$element.removeAttr(e) : tu.test(e) ? this.$$element.attr(e, i) : vr(this.$$element[0], e, i));
                    (n = this.$$observers) && t(n[l], function(n) {
                        try {
                            n(i)
                        } catch (t) {
                            nt(t)
                        }
                    })
                },
                $observe: function(n, t) {
                    var i = this
                      , f = i.$$observers || (i.$$observers = y())
                      , u = f[n] || (f[n] = []);
                    return u.push(t),
                    lt.$evalAsync(function() {
                        u.$$inter || !i.hasOwnProperty(n) || r(i[n]) || t(i[n])
                    }),
                    function() {
                        er(u, t)
                    }
                }
            };
            var hr = l.startSymbol()
              , cr = l.endSymbol()
              , lr = "{{" == hr && "}}" == cr ? ir : function(n) {
                return n.replace(/\{\{/g, hr).replace(/}}/g, cr)
            }
              , ru = /^ngAttr[A-Z]/
              , uu = /^(.+)Start$/;
            return gt.$$addBindingInfo = w ? function(n, t) {
                var i = n.data("$binding") || [];
                c(t) ? i = i.concat(t) : i.push(t);
                n.data("$binding", i)
            }
            : o,
            gt.$$addBindingClass = w ? function(n) {
                hi(n, "ng-binding")
            }
            : o,
            gt.$$addScopeInfo = w ? function(n, t, i, r) {
                n.data(i ? r ? "$isolateScopeNoTemplate" : "$isolateScope" : "$scope", t)
            }
            : o,
            gt.$$addScopeClass = w ? function(n, t) {
                hi(n, t ? "ng-isolate-scope" : "ng-scope")
            }
            : o,
            gt.$$createComment = function(t, i) {
                var r = "";
                return w && (r = " " + (t || "") + ": ",
                i && (r += i + " ")),
                n.document.createComment(r)
            }
            ,
            gt
        }
        ]
    }
    function lu(n, t) {
        this.previousValue = n;
        this.currentValue = t
    }
    function yt(n) {
        return cr(n.replace(ah, ""))
    }
    function vo(n, t) {
        var r = "", e = n.split(/\s+/), o = t.split(/\s+/), u = 0, f, i;
        n: for (; u < e.length; u++) {
            for (f = e[u],
            i = 0; i < o.length; i++)
                if (f == o[i])
                    continue n;
            r += (0 < r.length ? " " : "") + f
        }
        return r
    }
    function yo(n) {
        n = e(n);
        var t = n.length;
        if (1 >= t)
            return n;
        for (; t--; )
            8 === n[t].nodeType && pv.call(n, t, 1);
        return n
    }
    function po(n, t) {
        if (t && h(t))
            return t;
        if (h(n)) {
            var i = vh.exec(n);
            if (i)
                return i[3]
        }
    }
    function gl() {
        var n = {}
          , t = !1;
        this.has = function(t) {
            return n.hasOwnProperty(t)
        }
        ;
        this.register = function(t, i) {
            yi(t, "controller");
            s(t) ? a(n, t) : n[t] = i
        }
        ;
        this.allowGlobals = function() {
            t = !0
        }
        ;
        this.$get = ["$injector", "$window", function(i, r) {
            function u(n, t, i, r) {
                if (!n || !s(n.$scope))
                    throw l("$controller")("noscp", r, t);
                n.$scope[t] = i
            }
            return function(e, o, l, v) {
                var y, p, w;
                if (l = !0 === l,
                v && h(v) && (w = v),
                h(e)) {
                    if (v = e.match(vh),
                    !v)
                        throw ky("ctrlfmt", e);
                    p = v[1];
                    w = w || v[3];
                    e = n.hasOwnProperty(p) ? n[p] : io(o.$scope, p, !0) || (t ? io(r, p, !0) : void 0);
                    vi(e, p, !0)
                }
                return l ? (l = (c(e) ? e[e.length - 1] : e).prototype,
                y = Object.create(l || null),
                w && u(o, w, y, p || e.name),
                a(function() {
                    var n = i.invoke(e, y, o, p);
                    return n !== y && (s(n) || f(n)) && (y = n,
                    w && u(o, w, y, p || e.name)),
                    y
                }, {
                    instance: y,
                    identifier: w
                })) : (y = i.instantiate(e, o, p),
                w && u(o, w, y, p || e.name),
                y)
            }
        }
        ]
    }
    function na() {
        this.$get = ["$window", function(n) {
            return e(n.document)
        }
        ]
    }
    function ta() {
        this.$get = ["$log", function(n) {
            return function() {
                n.error.apply(n, arguments)
            }
        }
        ]
    }
    function yf(n) {
        return s(n) ? et(n) ? n.toISOString() : hr(n) : n
    }
    function ia() {
        this.$get = function() {
            return function(n) {
                if (!n)
                    return "";
                var i = [];
                return ve(n, function(n, u) {
                    null === n || r(n) || (c(n) ? t(n, function(n) {
                        i.push(ht(u) + "=" + ht(yf(n)))
                    }) : i.push(ht(u) + "=" + ht(yf(n))))
                }),
                i.join("&")
            }
        }
    }
    function ra() {
        this.$get = function() {
            return function(n) {
                function i(n, f, e) {
                    null === n || r(n) || (c(n) ? t(n, function(n, t) {
                        i(n, f + "[" + (s(n) ? t : "") + "]")
                    }) : s(n) && !et(n) ? ve(n, function(n, t) {
                        i(n, f + (e ? "" : "[") + t + (e ? "" : "]"))
                    }) : u.push(ht(f) + "=" + ht(yf(n))))
                }
                if (!n)
                    return "";
                var u = [];
                return i(n, "", !0),
                u.join("&")
            }
        }
    }
    function pf(n, t) {
        var r, i;
        return h(n) && (r = n.replace(tp, "").trim(),
        r && (i = t("Content-Type"),
        (i = i && 0 === i.indexOf(yh)) || (i = (i = r.match(gy)) && np[i[0]].test(r)),
        i && (n = be(r)))),
        n
    }
    function wo(n) {
        var i = y(), r;
        return h(n) ? t(n.split("\n"), function(n) {
            r = n.indexOf(":");
            var t = v(p(n.substr(0, r)));
            n = p(n.substr(r + 1));
            t && (i[t] = i[t] ? i[t] + ", " + n : n)
        }) : s(n) && t(n, function(n, t) {
            var r = v(t)
              , u = p(n);
            r && (i[r] = i[r] ? i[r] + ", " + u : u)
        }),
        i
    }
    function bo(n) {
        var t;
        return function(i) {
            return t || (t = wo(n)),
            i ? (i = t[v(i)],
            void 0 === i && (i = null),
            i) : t
        }
    }
    function ko(n, i, r, u) {
        return f(u) ? u(n, i, r) : (t(u, function(t) {
            n = t(n, i, r)
        }),
        n)
    }
    function ua() {
        var n = this.defaults = {
            transformResponse: [pf],
            transformRequest: [function(n) {
                return s(n) && "[object File]" !== rt.call(n) && "[object Blob]" !== rt.call(n) && "[object FormData]" !== rt.call(n) ? hr(n) : n
            }
            ],
            headers: {
                common: {
                    Accept: "application/json, text/plain, */*"
                },
                post: st(ce),
                put: st(ce),
                patch: st(ce)
            },
            xsrfCookieName: "XSRF-TOKEN",
            xsrfHeaderName: "X-XSRF-TOKEN",
            paramSerializer: "$httpParamSerializer"
        }, i = !1, e, o;
        this.useApplyAsync = function(n) {
            return u(n) ? (i = !!n,
            this) : i
        }
        ;
        e = !0;
        this.useLegacyPromiseExtensions = function(n) {
            return u(n) ? (e = !!n,
            this) : e
        }
        ;
        o = this.interceptors = [];
        this.$get = ["$httpBackend", "$$cookieReader", "$cacheFactory", "$rootScope", "$q", "$injector", function(y, p, w, b, k, d) {
            function g(i) {
                function c(n, t) {
                    for (var u, f, i = 0, r = t.length; i < r; )
                        u = t[i++],
                        f = t[i++],
                        n = n.then(u, f);
                    return t.length = 0,
                    n
                }
                function b(n, i) {
                    var r, u = {};
                    return t(n, function(n, t) {
                        f(n) ? (r = n(i),
                        null != r && (u[t] = r)) : u[t] = n
                    }),
                    u
                }
                function y(n) {
                    var t = a({}, n);
                    return t.data = ko(n.data, n.headers, n.status, o.transformResponse),
                    n = n.status,
                    200 <= n && 300 > n ? t : k.reject(t)
                }
                var o;
                if (!s(i))
                    throw l("$http")("badreq", i);
                if (!h(i.url))
                    throw l("$http")("badreq", i.url);
                o = a({
                    method: "get",
                    transformRequest: n.transformRequest,
                    transformResponse: n.transformResponse,
                    paramSerializer: n.paramSerializer
                }, i);
                o.headers = function(t) {
                    var i = n.headers, u = a({}, t.headers), r, f, e, i = a({}, i.common, i[v(t.method)]);
                    n: for (r in i) {
                        f = v(r);
                        for (e in u)
                            if (v(e) === f)
                                continue n;
                        u[r] = i[r]
                    }
                    return b(u, st(t))
                }(i);
                o.method = bu(o.method);
                o.paramSerializer = h(o.paramSerializer) ? d.get(o.paramSerializer) : o.paramSerializer;
                var p = []
                  , w = []
                  , u = k.when(o);
                return t(nt, function(n) {
                    (n.request || n.requestError) && p.unshift(n.request, n.requestError);
                    (n.response || n.responseError) && w.push(n.response, n.responseError)
                }),
                u = c(u, p),
                u = u.then(function(i) {
                    var u = i.headers
                      , f = ko(i.data, bo(u), void 0, i.transformRequest);
                    return r(f) && t(u, function(n, t) {
                        "content-type" === v(t) && delete u[t]
                    }),
                    r(i.withCredentials) && !r(n.withCredentials) && (i.withCredentials = n.withCredentials),
                    tt(i, f).then(y, y)
                }),
                u = c(u, w),
                e ? (u.success = function(n) {
                    return vi(n, "fn"),
                    u.then(function(t) {
                        n(t.data, t.status, t.headers, o)
                    }),
                    u
                }
                ,
                u.error = function(n) {
                    return vi(n, "fn"),
                    u.then(null, function(t) {
                        n(t.data, t.status, t.headers, o)
                    }),
                    u
                }
                ) : (u.success = ph("success"),
                u.error = ph("error")),
                u
            }
            function tt(e, o) {
                function nt(n) {
                    if (n) {
                        var r = {};
                        return t(n, function(n, t) {
                            r[t] = function(t) {
                                function r() {
                                    n(t)
                                }
                                i ? b.$applyAsync(r) : b.$$phase ? r() : b.$apply(r)
                            }
                        }),
                        r
                    }
                }
                function et(n, t, r, u) {
                    function f() {
                        v(t, n, r, u)
                    }
                    l && (200 <= n && 300 > n ? l.put(a, [n, t, wo(r), u]) : l.remove(a));
                    i ? b.$applyAsync(f) : (f(),
                    b.$$phase || b.$apply())
                }
                function v(n, t, i, r) {
                    t = -1 <= t ? t : 0;
                    (200 <= t && 300 > t ? w.resolve : w.reject)({
                        data: n,
                        status: t,
                        headers: bo(i),
                        config: e,
                        statusText: r
                    })
                }
                function tt(n) {
                    v(n.data, n.status, st(n.headers()), n.statusText)
                }
                function ut() {
                    var n = g.pendingRequests.indexOf(e);
                    -1 !== n && g.pendingRequests.splice(n, 1)
                }
                var w = k.defer(), d = w.promise, l, h, ft = e.headers, a = it(e.url, e.paramSerializer(e.params));
                return g.pendingRequests.push(e),
                d.then(ut, ut),
                (e.cache || n.cache) && !1 !== e.cache && ("GET" === e.method || "JSONP" === e.method) && (l = s(e.cache) ? e.cache : s(n.cache) ? n.cache : rt),
                l && (h = l.get(a),
                u(h) ? h && f(h.then) ? h.then(tt, tt) : c(h) ? v(h[1], h[0], st(h[2]), h[3]) : v(h, 200, {}, "OK") : l.put(a, d)),
                r(h) && ((h = vs(e.url) ? p()[e.xsrfCookieName || n.xsrfCookieName] : void 0) && (ft[e.xsrfHeaderName || n.xsrfHeaderName] = h),
                y(e.method, a, o, et, ft, e.timeout, e.withCredentials, e.responseType, nt(e.eventHandlers), nt(e.uploadEventHandlers))),
                d
            }
            function it(n, t) {
                return 0 < t.length && (n += (-1 == n.indexOf("?") ? "?" : "&") + t),
                n
            }
            var rt = w("$http"), nt;
            return n.paramSerializer = h(n.paramSerializer) ? d.get(n.paramSerializer) : n.paramSerializer,
            nt = [],
            t(o, function(n) {
                nt.unshift(h(n) ? d.get(n) : d.invoke(n))
            }),
            g.pendingRequests = [],
            function() {
                t(arguments, function(n) {
                    g[n] = function(t, i) {
                        return g(a({}, i || {}, {
                            method: n,
                            url: t
                        }))
                    }
                })
            }("get", "delete", "head", "jsonp"),
            function() {
                t(arguments, function(n) {
                    g[n] = function(t, i, r) {
                        return g(a({}, r || {}, {
                            method: n,
                            url: t,
                            data: i
                        }))
                    }
                })
            }("post", "put", "patch"),
            g.defaults = n,
            g
        }
        ]
    }
    function fa() {
        this.$get = function() {
            return function() {
                return new n.XMLHttpRequest
            }
        }
    }
    function ea() {
        this.$get = ["$browser", "$jsonpCallbacks", "$document", "$xhrFactory", function(n, t, i, r) {
            return oa(n, r, n.defer, t, i[0])
        }
        ]
    }
    function oa(n, i, e, s, h) {
        function c(n, t, i) {
            n = n.replace("JSON_CALLBACK", t);
            var r = h.createElement("script")
              , u = null;
            return r.type = "text/javascript",
            r.src = n,
            r.async = !0,
            u = function(n) {
                r.removeEventListener("load", u, !1);
                r.removeEventListener("error", u, !1);
                h.body.removeChild(r);
                r = null;
                var f = -1
                  , e = "unknown";
                n && ("load" !== n.type || s.wasCalled(t) || (n = {
                    type: "error"
                }),
                e = n.type,
                f = "error" === n.type ? 404 : 200);
                i && i(f, e)
            }
            ,
            r.addEventListener("load", u, !1),
            r.addEventListener("error", u, !1),
            h.body.appendChild(r),
            u
        }
        return function(h, l, a, y, p, w, b, k, d, g) {
            function ft() {
                it && it();
                nt && nt.abort()
            }
            function rt(t, i, r, f, s) {
                u(ut) && e.cancel(ut);
                it = nt = null;
                t(i, r, f, s);
                n.$$completeOutstandingRequest(o)
            }
            var tt, it, nt, ut;
            if (n.$$incOutstandingRequestCount(),
            l = l || n.url(),
            "jsonp" === v(h))
                tt = s.createCallback(l),
                it = c(l, tt, function(n, t) {
                    var i = 200 === n && s.getResponse(tt);
                    rt(y, n, i, "", t);
                    s.removeCallback(tt)
                });
            else {
                if (nt = i(h, l),
                nt.open(h, l, !0),
                t(p, function(n, t) {
                    u(n) && nt.setRequestHeader(t, n)
                }),
                nt.onload = function() {
                    var i = nt.statusText || ""
                      , t = "response"in nt ? nt.response : nt.responseText
                      , n = 1223 === nt.status ? 204 : nt.status;
                    0 === n && (n = t ? 200 : "file" == ni(l).protocol ? 404 : 0);
                    rt(y, n, t, nt.getAllResponseHeaders(), i)
                }
                ,
                h = function() {
                    rt(y, -1, null, null, "")
                }
                ,
                nt.onerror = h,
                nt.onabort = h,
                t(d, function(n, t) {
                    nt.addEventListener(t, n)
                }),
                t(g, function(n, t) {
                    nt.upload.addEventListener(t, n)
                }),
                b && (nt.withCredentials = !0),
                k)
                    try {
                        nt.responseType = k
                    } catch (et) {
                        if ("json" !== k)
                            throw et;
                    }
                nt.send(r(a) ? null : a)
            }
            0 < w ? ut = e(ft, w) : w && f(w.then) && w.then(ft)
        }
    }
    function sa() {
        var n = "{{"
          , t = "}}";
        this.startSymbol = function(t) {
            return t ? (n = t,
            this) : n
        }
        ;
        this.endSymbol = function(n) {
            return n ? (t = n,
            this) : t
        }
        ;
        this.$get = ["$parse", "$exceptionHandler", "$sce", function(i, e, o) {
            function c(n) {
                return "\\\\\\" + n
            }
            function s(i) {
                return i.replace(p, n).replace(w, t)
            }
            function v(n, t, i, r) {
                var u;
                return u = n.$watch(function(n) {
                    return u(),
                    r(n)
                }, t, i)
            }
            function h(h, c, p, w) {
                function et(n) {
                    var i, t;
                    try {
                        if (i = n,
                        n = p ? o.getTrusted(p, i) : o.valueOf(i),
                        w && !u(n))
                            t = n;
                        else if (null == n)
                            t = "";
                        else {
                            switch (typeof n) {
                            case "string":
                                break;
                            case "number":
                                n = "" + n;
                                break;
                            default:
                                n = hr(n)
                            }
                            t = n
                        }
                        return t
                    } catch (r) {
                        e(ai.interr(h, r))
                    }
                }
                var k, d, rt, ut;
                if (!h.length || -1 === h.indexOf(n))
                    return c || (c = s(h),
                    k = ft(c),
                    k.exp = h,
                    k.expressions = [],
                    k.$$watchDelegate = v),
                    k;
                w = !!w;
                var g, tt, b = 0, nt = [], it = [];
                for (k = h.length,
                d = [],
                rt = []; b < k; )
                    if (-1 != (g = h.indexOf(n, b)) && -1 != (tt = h.indexOf(t, g + l)))
                        b !== g && d.push(s(h.substring(b, g))),
                        b = h.substring(g + l, tt),
                        nt.push(b),
                        it.push(i(b, et)),
                        b = tt + y,
                        rt.push(d.length),
                        d.push("");
                    else {
                        b !== k && d.push(s(h.substring(b)));
                        break
                    }
                return p && 1 < d.length && ai.throwNoconcat(h),
                !c || nt.length ? (ut = function(n) {
                    for (var t = 0, i = nt.length; t < i; t++) {
                        if (w && r(n[t]))
                            return;
                        d[rt[t]] = n[t]
                    }
                    return d.join("")
                }
                ,
                a(function(n) {
                    var t = 0
                      , i = nt.length
                      , r = Array(i);
                    try {
                        for (; t < i; t++)
                            r[t] = it[t](n);
                        return ut(r)
                    } catch (u) {
                        e(ai.interr(h, u))
                    }
                }, {
                    exp: h,
                    expressions: nt,
                    $$watchDelegate: function(n, t) {
                        var i;
                        return n.$watchGroup(it, function(r, u) {
                            var e = ut(r);
                            f(t) && t.call(this, e, r !== u ? i : e, n);
                            i = e
                        })
                    }
                })) : void 0
            }
            var l = n.length
              , y = t.length
              , p = new RegExp(n.replace(/./g, c),"g")
              , w = new RegExp(t.replace(/./g, c),"g");
            return h.startSymbol = function() {
                return n
            }
            ,
            h.endSymbol = function() {
                return t
            }
            ,
            h
        }
        ]
    }
    function ha() {
        this.$get = ["$rootScope", "$window", "$q", "$$q", "$browser", function(n, t, i, r, f) {
            function o(o, s, h, c) {
                function p() {
                    w ? o.apply(null, b) : o(a)
                }
                var w = 4 < arguments.length
                  , b = w ? bt.call(arguments, 4) : []
                  , k = t.setInterval
                  , d = t.clearInterval
                  , a = 0
                  , y = u(c) && !c
                  , v = (y ? r : i).defer()
                  , l = v.promise;
                return h = u(h) ? h : 0,
                l.$$intervalId = k(function() {
                    y ? f.defer(p) : n.$evalAsync(p);
                    v.notify(a++);
                    0 < h && a >= h && (v.resolve(a),
                    d(l.$$intervalId),
                    delete e[l.$$intervalId]);
                    y || n.$apply()
                }, s),
                e[l.$$intervalId] = v,
                l
            }
            var e = {};
            return o.cancel = function(n) {
                return n && n.$$intervalId in e ? (e[n.$$intervalId].reject("canceled"),
                t.clearInterval(n.$$intervalId),
                delete e[n.$$intervalId],
                !0) : !1
            }
            ,
            o
        }
        ]
    }
    function wf(n) {
        n = n.split("/");
        for (var t = n.length; t--; )
            n[t] = tu(n[t]);
        return n.join("/")
    }
    function go(n, t) {
        var i = ni(n);
        t.$$protocol = i.protocol;
        t.$$host = i.hostname;
        t.$$port = tt(i.port) || fp[i.protocol] || null
    }
    function ns(n, t) {
        var r = "/" !== n.charAt(0), i;
        r && (n = "/" + n);
        i = ni(n);
        t.$$path = decodeURIComponent(r && "/" === i.pathname.charAt(0) ? i.pathname.substring(1) : i.pathname);
        t.$$search = ge(i.search);
        t.$$hash = decodeURIComponent(i.hash);
        t.$$path && "/" != t.$$path.charAt(0) && (t.$$path = "/" + t.$$path)
    }
    function pt(n, t) {
        if (0 === t.lastIndexOf(n, 0))
            return t.substr(n.length)
    }
    function oi(n) {
        var t = n.indexOf("#");
        return -1 == t ? n : n.substr(0, t)
    }
    function yr(n) {
        return n.replace(/(#.+)|#$/, "$1")
    }
    function bf(n, t, i) {
        this.$$html5 = !0;
        i = i || "";
        go(n, this);
        this.$$parse = function(n) {
            var i = pt(t, n);
            if (!h(i))
                throw tf("ipthprfx", n, t);
            ns(i, this);
            this.$$path || (this.$$path = "/");
            this.$$compose()
        }
        ;
        this.$$compose = function() {
            var n = lf(this.$$search)
              , i = this.$$hash ? "#" + tu(this.$$hash) : "";
            this.$$url = wf(this.$$path) + (n ? "?" + n : "") + i;
            this.$$absUrl = t + this.$$url.substr(1)
        }
        ;
        this.$$parseLinkUrl = function(r, f) {
            if (f && "#" === f[0])
                return this.hash(f.slice(1)),
                !0;
            var e, o;
            return u(e = pt(n, r)) ? (o = e,
            o = u(e = pt(i, e)) ? t + (pt("/", e) || e) : n + o) : u(e = pt(t, r)) ? o = t + e : t == r + "/" && (o = t),
            o && this.$$parse(o),
            !!o
        }
    }
    function kf(n, t, i) {
        go(n, this);
        this.$$parse = function(u) {
            var e = pt(n, u) || pt(t, u), f, o;
            r(e) || "#" !== e.charAt(0) ? this.$$html5 ? f = e : (f = "",
            r(e) && (n = u,
            this.replace())) : (f = pt(i, e),
            r(f) && (f = e));
            ns(f, this);
            u = this.$$path;
            e = n;
            o = /^\/[A-Z]:(\/.*)/;
            0 === f.lastIndexOf(e, 0) && (f = f.replace(e, ""));
            o.exec(f) || (u = (f = o.exec(u)) ? f[1] : u);
            this.$$path = u;
            this.$$compose()
        }
        ;
        this.$$compose = function() {
            var t = lf(this.$$search)
              , r = this.$$hash ? "#" + tu(this.$$hash) : "";
            this.$$url = wf(this.$$path) + (t ? "?" + t : "") + r;
            this.$$absUrl = n + (this.$$url ? i + this.$$url : "")
        }
        ;
        this.$$parseLinkUrl = function(t) {
            return oi(n) == oi(t) ? (this.$$parse(t),
            !0) : !1
        }
    }
    function ts(n, t, i) {
        this.$$html5 = !0;
        kf.apply(this, arguments);
        this.$$parseLinkUrl = function(r, u) {
            if (u && "#" === u[0])
                return this.hash(u.slice(1)),
                !0;
            var f, e;
            return n == oi(r) ? f = r : (e = pt(t, r)) ? f = n + i + e : t === r + "/" && (f = t),
            f && this.$$parse(f),
            !!f
        }
        ;
        this.$$compose = function() {
            var t = lf(this.$$search)
              , r = this.$$hash ? "#" + tu(this.$$hash) : "";
            this.$$url = wf(this.$$path) + (t ? "?" + t : "") + r;
            this.$$absUrl = n + i + this.$$url
        }
    }
    function au(n) {
        return function() {
            return this[n]
        }
    }
    function is(n, t) {
        return function(i) {
            return r(i) ? this[n] : (this[n] = t(i),
            this.$$compose(),
            this)
        }
    }
    function ca() {
        var t = ""
          , n = {
            enabled: !1,
            requireBase: !0,
            rewriteLinks: !0
        };
        this.hashPrefix = function(n) {
            return u(n) ? (t = n,
            this) : t
        }
        ;
        this.html5Mode = function(t) {
            return ui(t) ? (n.enabled = t,
            this) : s(t) ? (ui(t.enabled) && (n.enabled = t.enabled),
            ui(t.requireBase) && (n.requireBase = t.requireBase),
            ui(t.rewriteLinks) && (n.rewriteLinks = t.rewriteLinks),
            this) : n
        }
        ;
        this.$get = ["$rootScope", "$browser", "$sniffer", "$rootElement", "$window", function(i, u, f, o, h) {
            function w(n, t, i) {
                var r = c.url()
                  , f = c.$$state;
                try {
                    u.url(n, t, i);
                    c.$$state = u.state()
                } catch (e) {
                    throw c.url(r),
                    c.$$state = f,
                    e;
                }
            }
            function b(n, t) {
                i.$broadcast("$locationChangeSuccess", c.absUrl(), n, c.$$state, t)
            }
            var c, a, l, v, p, k, y;
            if (a = u.baseHref(),
            l = u.url(),
            n.enabled) {
                if (!a && n.requireBase)
                    throw tf("nobase");
                v = l.substring(0, l.indexOf("/", l.indexOf("//") + 2)) + (a || "/");
                a = f.history ? bf : ts
            } else
                v = oi(l),
                a = kf;
            p = v.substr(0, oi(v).lastIndexOf("/") + 1);
            c = new a(v,p,"#" + t);
            c.$$parseLinkUrl(l, l);
            c.$$state = u.state();
            k = /^\s*(javascript|mailto):/i;
            o.on("click", function(t) {
                var r, f, l;
                if (n.rewriteLinks && !t.ctrlKey && !t.metaKey && !t.shiftKey && 2 != t.which && 2 != t.button) {
                    for (r = e(t.target); "a" !== at(r[0]); )
                        if (r[0] === o[0] || !(r = r.parent())[0])
                            return;
                    f = r.prop("href");
                    l = r.attr("href") || r.attr("xlink:href");
                    s(f) && "[object SVGAnimatedString]" === f.toString() && (f = ni(f.animVal).href);
                    k.test(f) || !f || r.attr("target") || t.isDefaultPrevented() || !c.$$parseLinkUrl(f, l) || (t.preventDefault(),
                    c.absUrl() != u.url() && (i.$apply(),
                    h.angular["ff-684208-preventDefault"] = !0))
                }
            });
            yr(c.absUrl()) != yr(l) && u.url(c.absUrl(), !0);
            y = !0;
            u.onUrlChange(function(n, t) {
                r(pt(p, n)) ? h.location.href = n : (i.$evalAsync(function() {
                    var r = c.absUrl(), u = c.$$state, f;
                    n = yr(n);
                    c.$$parse(n);
                    c.$$state = t;
                    f = i.$broadcast("$locationChangeStart", n, r, t, u).defaultPrevented;
                    c.absUrl() === n && (f ? (c.$$parse(r),
                    c.$$state = u,
                    w(r, !1, u)) : (y = !1,
                    b(r, u)))
                }),
                i.$$phase || i.$digest())
            });
            return i.$watch(function() {
                var t = yr(u.url())
                  , e = yr(c.absUrl())
                  , n = u.state()
                  , o = c.$$replace
                  , r = t !== e || c.$$html5 && f.history && n !== c.$$state;
                (y || r) && (y = !1,
                i.$evalAsync(function() {
                    var u = c.absUrl()
                      , f = i.$broadcast("$locationChangeStart", u, t, c.$$state, n).defaultPrevented;
                    c.absUrl() === u && (f ? (c.$$parse(t),
                    c.$$state = n) : (r && w(u, o, n === c.$$state ? null : c.$$state),
                    b(t, n)))
                }));
                c.$$replace = !1
            }),
            c
        }
        ]
    }
    function la() {
        var n = !0
          , i = this;
        this.debugEnabled = function(t) {
            return u(t) ? (n = t,
            this) : n
        }
        ;
        this.$get = ["$window", function(r) {
            function f(n) {
                return n instanceof Error && (n.stack ? n = n.message && -1 === n.stack.indexOf(n.message) ? "Error: " + n.message + "\n" + n.stack : n.stack : n.sourceURL && (n = n.message + "\n" + n.sourceURL + ":" + n.line)),
                n
            }
            function u(n) {
                var i = r.console || {}
                  , u = i[n] || i.log || o;
                n = !1;
                try {
                    n = !!u.apply
                } catch (e) {}
                return n ? function() {
                    var n = [];
                    return t(arguments, function(t) {
                        n.push(f(t))
                    }),
                    u.apply(i, n)
                }
                : function(n, t) {
                    u(n, null == t ? "" : t)
                }
            }
            return {
                log: u("log"),
                info: u("info"),
                warn: u("warn"),
                error: u("error"),
                debug: function() {
                    var t = u("debug");
                    return function() {
                        n && t.apply(i, arguments)
                    }
                }()
            }
        }
        ]
    }
    function wi(n, t) {
        if ("__defineGetter__" === n || "__defineSetter__" === n || "__lookupGetter__" === n || "__lookupSetter__" === n || "__proto__" === n)
            throw it("isecfld", t);
        return n
    }
    function aa(n) {
        return n + ""
    }
    function gt(n, t) {
        if (n) {
            if (n.constructor === n)
                throw it("isecfn", t);
            if (n.window === n)
                throw it("isecwindow", t);
            if (n.children && (n.nodeName || n.prop && n.attr && n.find))
                throw it("isecdom", t);
            if (n === Object)
                throw it("isecobj", t);
        }
        return n
    }
    function rs(n, t) {
        if (n) {
            if (n.constructor === n)
                throw it("isecfn", t);
            if (n === op || n === sp || n === hp)
                throw it("isecff", t);
        }
    }
    function vu(n, t) {
        if (n && (n === 0..constructor || n === (!1).constructor || n === "".constructor || n === {}.constructor || n === [].constructor || n === Function.constructor))
            throw it("isecaf", t);
    }
    function va(n, t) {
        return "undefined" != typeof n ? n : t
    }
    function us(n, t) {
        return "undefined" == typeof n ? t : "undefined" == typeof t ? n : n + t
    }
    function k(n, r) {
        var u, f;
        switch (n.type) {
        case i.Program:
            u = !0;
            t(n.body, function(n) {
                k(n.expression, r);
                u = u && n.expression.constant
            });
            n.constant = u;
            break;
        case i.Literal:
            n.constant = !0;
            n.toWatch = [];
            break;
        case i.UnaryExpression:
            k(n.argument, r);
            n.constant = n.argument.constant;
            n.toWatch = n.argument.toWatch;
            break;
        case i.BinaryExpression:
            k(n.left, r);
            k(n.right, r);
            n.constant = n.left.constant && n.right.constant;
            n.toWatch = n.left.toWatch.concat(n.right.toWatch);
            break;
        case i.LogicalExpression:
            k(n.left, r);
            k(n.right, r);
            n.constant = n.left.constant && n.right.constant;
            n.toWatch = n.constant ? [] : [n];
            break;
        case i.ConditionalExpression:
            k(n.test, r);
            k(n.alternate, r);
            k(n.consequent, r);
            n.constant = n.test.constant && n.alternate.constant && n.consequent.constant;
            n.toWatch = n.constant ? [] : [n];
            break;
        case i.Identifier:
            n.constant = !1;
            n.toWatch = [n];
            break;
        case i.MemberExpression:
            k(n.object, r);
            n.computed && k(n.property, r);
            n.constant = n.object.constant && (!n.computed || n.property.constant);
            n.toWatch = [n];
            break;
        case i.CallExpression:
            u = n.filter ? !r(n.callee.name).$stateful : !1;
            f = [];
            t(n.arguments, function(n) {
                k(n, r);
                u = u && n.constant;
                n.constant || f.push.apply(f, n.toWatch)
            });
            n.constant = u;
            n.toWatch = n.filter && !r(n.callee.name).$stateful ? f : [n];
            break;
        case i.AssignmentExpression:
            k(n.left, r);
            k(n.right, r);
            n.constant = n.left.constant && n.right.constant;
            n.toWatch = [n];
            break;
        case i.ArrayExpression:
            u = !0;
            f = [];
            t(n.elements, function(n) {
                k(n, r);
                u = u && n.constant;
                n.constant || f.push.apply(f, n.toWatch)
            });
            n.constant = u;
            n.toWatch = f;
            break;
        case i.ObjectExpression:
            u = !0;
            f = [];
            t(n.properties, function(n) {
                k(n.value, r);
                u = u && n.value.constant && !n.computed;
                n.value.constant || f.push.apply(f, n.value.toWatch)
            });
            n.constant = u;
            n.toWatch = f;
            break;
        case i.ThisExpression:
            n.constant = !1;
            n.toWatch = [];
            break;
        case i.LocalsExpression:
            n.constant = !1;
            n.toWatch = []
        }
    }
    function fs(n) {
        if (1 == n.length) {
            n = n[0].expression;
            var t = n.toWatch;
            return 1 !== t.length ? t : t[0] !== n ? t : void 0
        }
    }
    function es(n) {
        return n.type === i.Identifier || n.type === i.MemberExpression
    }
    function os(n) {
        if (1 === n.body.length && es(n.body[0].expression))
            return {
                type: i.AssignmentExpression,
                left: n.body[0].expression,
                right: {
                    type: i.NGValueParameter
                },
                operator: "="
            }
    }
    function ss(n) {
        return 0 === n.body.length || 1 === n.body.length && (n.body[0].expression.type === i.Literal || n.body[0].expression.type === i.ArrayExpression || n.body[0].expression.type === i.ObjectExpression)
    }
    function hs(n, t) {
        this.astBuilder = n;
        this.$filter = t
    }
    function cs(n, t) {
        this.astBuilder = n;
        this.$filter = t
    }
    function yu(n) {
        return "constructor" == n
    }
    function df(n) {
        return f(n.valueOf) ? n.valueOf() : cp.call(n)
    }
    function ya() {
        var e = y(), s = y(), r = {
            "true": !0,
            "false": !1,
            "null": null,
            undefined: void 0
        }, n, i;
        this.addLiteral = function(n, t) {
            r[n] = t
        }
        ;
        this.setIdentifierFns = function(t, r) {
            return n = t,
            i = r,
            this
        }
        ;
        this.$get = ["$filter", function(h) {
            function p(n, t, i) {
                var r, l, u, f, p;
                i = i || c;
                switch (typeof n) {
                case "string":
                    return u = n = n.trim(),
                    f = i ? s : e,
                    r = f[u],
                    r || (":" === n.charAt(0) && ":" === n.charAt(1) && (l = !0,
                    n = n.substring(2)),
                    r = i ? nt : g,
                    p = new uf(r),
                    r = new ff(p,h,r).parse(n),
                    r.constant ? r.$$watchDelegate = d : l ? r.$$watchDelegate = r.literal ? b : w : r.inputs && (r.$$watchDelegate = v),
                    i && (r = a(r)),
                    f[u] = r),
                    y(r, t);
                case "function":
                    return y(n, t);
                default:
                    return y(o, t)
                }
            }
            function a(n) {
                function t(t, i, r, u) {
                    var f = c;
                    c = !0;
                    try {
                        return n(t, i, r, u)
                    } finally {
                        c = f
                    }
                }
                if (!n)
                    return n;
                t.$$watchDelegate = n.$$watchDelegate;
                t.assign = a(n.assign);
                t.constant = n.constant;
                t.literal = n.literal;
                for (var i = 0; n.inputs && i < n.inputs.length; ++i)
                    n.inputs[i] = a(n.inputs[i]);
                return t.inputs = n.inputs,
                t
            }
            function l(n, t) {
                return null == n || null == t ? n === t : "object" == typeof n && (n = df(n),
                "object" == typeof n) ? !1 : n === t || n !== n && t !== t
            }
            function v(n, t, i, r, u) {
                var f = r.inputs, e, s;
                if (1 === f.length)
                    return s = l,
                    f = f[0],
                    n.$watch(function(n) {
                        var t = f(n);
                        return l(t, s) || (e = r(n, void 0, void 0, [t]),
                        s = t && df(t)),
                        e
                    }, t, i, u);
                for (var h = [], c = [], o = 0, a = f.length; o < a; o++)
                    h[o] = l,
                    c[o] = null;
                return n.$watch(function(n) {
                    for (var i, u = !1, t = 0, o = f.length; t < o; t++)
                        i = f[t](n),
                        (u || (u = !l(i, h[t]))) && (c[t] = i,
                        h[t] = i && df(i));
                    return u && (e = r(n, void 0, void 0, c)),
                    e
                }, t, i, u)
            }
            function w(n, t, i, r) {
                var e, o;
                return e = n.$watch(function(n) {
                    return r(n)
                }, function(n, i, r) {
                    o = n;
                    f(t) && t.apply(this, arguments);
                    u(n) && r.$$postDigest(function() {
                        u(o) && e()
                    })
                }, i)
            }
            function b(n, i, r, e) {
                function o(n) {
                    var i = !0;
                    return t(n, function(n) {
                        u(n) || (i = !1)
                    }),
                    i
                }
                var s, h;
                return s = n.$watch(function(n) {
                    return e(n)
                }, function(n, t, r) {
                    h = n;
                    f(i) && i.call(this, n, t, r);
                    o(n) && r.$$postDigest(function() {
                        o(h) && s()
                    })
                }, r)
            }
            function d(n, t, i, r) {
                var u;
                return u = n.$watch(function(n) {
                    return u(),
                    r(n)
                }, t, i)
            }
            function y(n, t) {
                if (!t)
                    return n;
                var i = n.$$watchDelegate
                  , r = !1
                  , i = i !== b && i !== w ? function(i, u, f, e) {
                    return f = r && e ? e[0] : n(i, u, f, e),
                    t(f, i, u)
                }
                : function(i, r, f, e) {
                    return f = n(i, r, f, e),
                    i = t(f, i, r),
                    u(f) ? i : f
                }
                ;
                return n.$$watchDelegate && n.$$watchDelegate !== v ? i.$$watchDelegate = n.$$watchDelegate : t.$stateful || (i.$$watchDelegate = v,
                r = !n.inputs,
                i.inputs = n.inputs ? n.inputs : [n]),
                i
            }
            var k = ci().noUnsafeEval
              , g = {
                csp: k,
                expensiveChecks: !1,
                literals: dt(r),
                isIdentifierStart: f(n) && n,
                isIdentifierContinue: f(i) && i
            }
              , nt = {
                csp: k,
                expensiveChecks: !0,
                literals: dt(r),
                isIdentifierStart: f(n) && n,
                isIdentifierContinue: f(i) && i
            }
              , c = !1;
            return p.$$runningExpensiveChecks = function() {
                return c
            }
            ,
            p
        }
        ]
    }
    function pa() {
        this.$get = ["$rootScope", "$exceptionHandler", function(n, t) {
            return ls(function(t) {
                n.$evalAsync(t)
            }, t)
        }
        ]
    }
    function wa() {
        this.$get = ["$browser", "$exceptionHandler", function(n, t) {
            return ls(function(t) {
                n.defer(t)
            }, t)
        }
        ]
    }
    function ls(n, i) {
        function y() {
            this.$$state = {
                status: 0
            }
        }
        function o(n, t) {
            return function(i) {
                t.call(n, i)
            }
        }
        function p(t) {
            !t.processScheduled && t.pending && (t.processScheduled = !0,
            n(function() {
                var e, n, u, r, o;
                for (u = t.pending,
                t.processScheduled = !1,
                t.pending = void 0,
                r = 0,
                o = u.length; r < o; ++r) {
                    n = u[r][0];
                    e = u[r][t.status];
                    try {
                        f(e) ? n.resolve(e(t.value)) : 1 === t.status ? n.resolve(t.value) : n.reject(t.value)
                    } catch (s) {
                        n.reject(s);
                        i(s)
                    }
                }
            }))
        }
        function u() {
            this.promise = new y
        }
        var w = l("$q", TypeError)
          , b = function() {
            var n = new u;
            return n.resolve = o(n, n.resolve),
            n.reject = o(n, n.reject),
            n.notify = o(n, n.notify),
            n
        };
        a(y.prototype, {
            then: function(n, t, i) {
                if (r(n) && r(t) && r(i))
                    return this;
                var f = new u;
                return this.$$state.pending = this.$$state.pending || [],
                this.$$state.pending.push([f, n, t, i]),
                0 < this.$$state.status && p(this.$$state),
                f.promise
            },
            "catch": function(n) {
                return this.then(null, n)
            },
            "finally": function(n, t) {
                return this.then(function(t) {
                    return k(t, !0, n)
                }, function(t) {
                    return k(t, !1, n)
                }, t)
            }
        });
        a(u.prototype, {
            resolve: function(n) {
                this.promise.$$state.status || (n === this.promise ? this.$$reject(w("qcycle", n)) : this.$$resolve(n))
            },
            $$resolve: function(n) {
                function c(n) {
                    t || (t = !0,
                    e.$$resolve(n))
                }
                function u(n) {
                    t || (t = !0,
                    e.$$reject(n))
                }
                var r, e = this, t = !1;
                try {
                    (s(n) || f(n)) && (r = n && n.then);
                    f(r) ? (this.promise.$$state.status = -1,
                    r.call(n, c, u, o(this, this.notify))) : (this.promise.$$state.value = n,
                    this.promise.$$state.status = 1,
                    p(this.promise.$$state))
                } catch (h) {
                    u(h);
                    i(h)
                }
            },
            reject: function(n) {
                this.promise.$$state.status || this.$$reject(n)
            },
            $$reject: function(n) {
                this.promise.$$state.value = n;
                this.promise.$$state.status = 2;
                p(this.promise.$$state)
            },
            notify: function(t) {
                var r = this.promise.$$state.pending;
                0 >= this.promise.$$state.status && r && r.length && n(function() {
                    for (var u, e, n = 0, o = r.length; n < o; n++) {
                        e = r[n][0];
                        u = r[n][3];
                        try {
                            e.notify(f(u) ? u(t) : t)
                        } catch (s) {
                            i(s)
                        }
                    }
                })
            }
        });
        var h = function(n, t) {
            var i = new u;
            return t ? i.resolve(n) : i.reject(n),
            i.promise
        }
          , k = function(n, t, i) {
            var r = null;
            try {
                f(i) && (r = i())
            } catch (u) {
                return h(u, !1)
            }
            return r && f(r.then) ? r.then(function() {
                return h(n, t)
            }, function(n) {
                return h(n, !1)
            }) : h(n, t)
        }
          , v = function(n, t, i, r) {
            var f = new u;
            return f.resolve(n),
            f.promise.then(t, i, r)
        }
          , e = function(n) {
            if (!f(n))
                throw w("norslvr", n);
            var t = new u;
            return n(function(n) {
                t.resolve(n)
            }, function(n) {
                t.reject(n)
            }),
            t.promise
        };
        return e.prototype = y.prototype,
        e.defer = b,
        e.reject = function(n) {
            var t = new u;
            return t.reject(n),
            t.promise
        }
        ,
        e.when = v,
        e.resolve = v,
        e.all = function(n) {
            var r = new u
              , f = 0
              , i = c(n) ? [] : {};
            return t(n, function(n, t) {
                f++;
                v(n).then(function(n) {
                    i.hasOwnProperty(t) || (i[t] = n,
                    --f || r.resolve(i))
                }, function(n) {
                    i.hasOwnProperty(t) || r.reject(n)
                })
            }),
            0 === f && r.resolve(i),
            r.promise
        }
        ,
        e.race = function(n) {
            var i = b();
            return t(n, function(n) {
                v(n).then(i.resolve, i.reject)
            }),
            i.promise
        }
        ,
        e
    }
    function ba() {
        this.$get = ["$window", "$timeout", function(n, t) {
            var i = n.requestAnimationFrame || n.webkitRequestAnimationFrame
              , f = n.cancelAnimationFrame || n.webkitCancelAnimationFrame || n.webkitCancelRequestAnimationFrame
              , r = !!i
              , u = r ? function(n) {
                var t = i(n);
                return function() {
                    f(t)
                }
            }
            : function(n) {
                var i = t(n, 16.66, !1);
                return function() {
                    t.cancel(i)
                }
            }
            ;
            return u.supported = r,
            u
        }
        ]
    }
    function ka() {
        function h(n) {
            function t() {
                this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null;
                this.$$listeners = {};
                this.$$listenerCount = {};
                this.$$watchersCount = 0;
                this.$id = ++ku;
                this.$$ChildScope = null
            }
            return t.prototype = n,
            t
        }
        var u = 10
          , e = l("$rootScope")
          , n = null
          , i = null;
        this.digestTtl = function(n) {
            return arguments.length && (u = n),
            u
        }
        ;
        this.$get = ["$exceptionHandler", "$parse", "$browser", function(c, l, a) {
            function ut(n) {
                n.currentScope.$$destroyed = !0
            }
            function b(n) {
                9 === ti && (n.$$childHead && b(n.$$childHead),
                n.$$nextSibling && b(n.$$nextSibling));
                n.$parent = n.$$nextSibling = n.$$prevSibling = n.$$childHead = n.$$childTail = n.$root = n.$$watchers = null
            }
            function p() {
                this.$id = ++ku;
                this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
                this.$root = this;
                this.$$destroyed = !1;
                this.$$listeners = {};
                this.$$listenerCount = {};
                this.$$watchersCount = 0;
                this.$$isolateBindings = null
            }
            function nt(n) {
                if (v.$$phase)
                    throw e("inprog", v.$$phase);
                v.$$phase = n
            }
            function k(n, t) {
                do
                    n.$$watchersCount += t;
                while (n = n.$parent)
            }
            function tt(n, t, i) {
                do
                    n.$$listenerCount[i] -= t,
                    0 === n.$$listenerCount[i] && delete n.$$listenerCount[i];
                while (n = n.$parent)
            }
            function it() {}
            function rt() {
                for (; d.length; )
                    try {
                        d.shift()()
                    } catch (n) {
                        c(n)
                    }
                i = null
            }
            function ft() {
                null === i && (i = a.defer(function() {
                    v.$apply(rt)
                }))
            }
            p.prototype = {
                constructor: p,
                $new: function(n, t) {
                    var i;
                    return t = t || this,
                    n ? (i = new p,
                    i.$root = this.$root) : (this.$$ChildScope || (this.$$ChildScope = h(this)),
                    i = new this.$$ChildScope),
                    i.$parent = t,
                    i.$$prevSibling = t.$$childTail,
                    t.$$childHead ? (t.$$childTail.$$nextSibling = i,
                    t.$$childTail = i) : t.$$childHead = t.$$childTail = i,
                    (n || t != this) && i.$on("$destroy", ut),
                    i
                },
                $watch: function(t, i, r, u) {
                    var e = l(t);
                    if (e.$$watchDelegate)
                        return e.$$watchDelegate(this, i, r, e, t);
                    var h = this
                      , s = h.$$watchers
                      , c = {
                        fn: i,
                        last: it,
                        get: e,
                        exp: u || t,
                        eq: !!r
                    };
                    return n = null,
                    f(i) || (c.fn = o),
                    s || (s = h.$$watchers = []),
                    s.unshift(c),
                    k(this, 1),
                    function() {
                        0 <= er(s, c) && k(h, -1);
                        n = null
                    }
                },
                $watchGroup: function(n, i) {
                    function c() {
                        o = !1;
                        h ? (h = !1,
                        i(r, r, u)) : i(r, f, u)
                    }
                    var f = Array(n.length), r = Array(n.length), e = [], u = this, o = !1, h = !0, s;
                    return n.length ? 1 === n.length ? this.$watch(n[0], function(n, t, u) {
                        r[0] = n;
                        f[0] = t;
                        i(r, n === t ? r : f, u)
                    }) : (t(n, function(n, t) {
                        var i = u.$watch(n, function(n, i) {
                            r[t] = n;
                            f[t] = i;
                            o || (o = !0,
                            u.$evalAsync(c))
                        });
                        e.push(i)
                    }),
                    function() {
                        for (; e.length; )
                            e.shift()()
                    }
                    ) : (s = !0,
                    u.$evalAsync(function() {
                        s && i(r, r, u)
                    }),
                    function() {
                        s = !1
                    }
                    )
                },
                $watchCollection: function(n, t) {
                    function h(n) {
                        i = n;
                        var t, c, o, h;
                        if (!r(i)) {
                            if (s(i))
                                if (kt(i))
                                    for (u !== a && (u = a,
                                    e = u.length = 0,
                                    f++),
                                    n = i.length,
                                    e !== n && (f++,
                                    u.length = e = n),
                                    t = 0; t < n; t++)
                                        h = u[t],
                                        o = i[t],
                                        c = h !== h && o !== o,
                                        c || h === o || (f++,
                                        u[t] = o);
                                else {
                                    u !== v && (u = v = {},
                                    e = 0,
                                    f++);
                                    n = 0;
                                    for (t in i)
                                        wt.call(i, t) && (n++,
                                        o = i[t],
                                        h = u[t],
                                        t in u ? (c = h !== h && o !== o,
                                        c || h === o || (f++,
                                        u[t] = o)) : (e++,
                                        u[t] = o,
                                        f++));
                                    if (e > n)
                                        for (t in f++,
                                        u)
                                            wt.call(i, t) || (e--,
                                            delete u[t])
                                }
                            else
                                u !== i && (u = i,
                                f++);
                            return f
                        }
                    }
                    h.$stateful = !0;
                    var c = this, i, u, o, p = 1 < t.length, f = 0, w = l(n, h), a = [], v = {}, y = !0, e = 0;
                    return this.$watch(w, function() {
                        if (y ? (y = !1,
                        t(i, i, c)) : t(i, o, c),
                        p)
                            if (s(i))
                                if (kt(i)) {
                                    o = Array(i.length);
                                    for (var n = 0; n < i.length; n++)
                                        o[n] = i[n]
                                } else
                                    for (n in o = {},
                                    i)
                                        wt.call(i, n) && (o[n] = i[n]);
                            else
                                o = i
                    })
                },
                $digest: function() {
                    var t, s, h, ut, ft, o, d, l, tt = u, r, p = [], b, k;
                    nt("$digest");
                    a.$$checkUrlChange();
                    this === v && null !== i && (a.defer.cancel(i),
                    rt());
                    n = null;
                    do {
                        for (l = !1,
                        r = this,
                        o = 0; o < y.length; o++) {
                            try {
                                k = y[o];
                                k.scope.$eval(k.expression, k.locals)
                            } catch (et) {
                                c(et)
                            }
                            n = null
                        }
                        y.length = 0;
                        n: do {
                            if (o = r.$$watchers)
                                for (d = o.length; d--; )
                                    try {
                                        if (t = o[d])
                                            if (ft = t.get,
                                            (s = ft(r)) === (h = t.last) || (t.eq ? ot(s, h) : "number" == typeof s && "number" == typeof h && isNaN(s) && isNaN(h))) {
                                                if (t === n) {
                                                    l = !1;
                                                    break n
                                                }
                                            } else
                                                l = !0,
                                                n = t,
                                                t.last = t.eq ? dt(s, null) : s,
                                                ut = t.fn,
                                                ut(s, h === it ? s : h, r),
                                                5 > tt && (b = 4 - tt,
                                                p[b] || (p[b] = []),
                                                p[b].push({
                                                    msg: f(t.exp) ? "fn: " + (t.exp.name || t.exp.toString()) : t.exp,
                                                    newVal: s,
                                                    oldVal: h
                                                }))
                                    } catch (st) {
                                        c(st)
                                    }
                            if (!(o = r.$$watchersCount && r.$$childHead || r !== this && r.$$nextSibling))
                                for (; r !== this && !(o = r.$$nextSibling); )
                                    r = r.$parent
                        } while (r = o);
                        if ((l || y.length) && !tt--)
                            throw v.$$phase = null,
                            e("infdig", u, p);
                    } while (l || y.length);
                    for (v.$$phase = null; g < w.length; )
                        try {
                            w[g++]()
                        } catch (ht) {
                            c(ht)
                        }
                    w.length = g = 0
                },
                $destroy: function() {
                    var n, t;
                    if (!this.$$destroyed) {
                        n = this.$parent;
                        this.$broadcast("$destroy");
                        this.$$destroyed = !0;
                        this === v && a.$$applicationDestroyed();
                        k(this, -this.$$watchersCount);
                        for (t in this.$$listenerCount)
                            tt(this, this.$$listenerCount[t], t);
                        n && n.$$childHead == this && (n.$$childHead = this.$$nextSibling);
                        n && n.$$childTail == this && (n.$$childTail = this.$$prevSibling);
                        this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling);
                        this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling);
                        this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = o;
                        this.$on = this.$watch = this.$watchGroup = function() {
                            return o
                        }
                        ;
                        this.$$listeners = {};
                        this.$$nextSibling = null;
                        b(this)
                    }
                },
                $eval: function(n, t) {
                    return l(n)(this, t)
                },
                $evalAsync: function(n, t) {
                    v.$$phase || y.length || a.defer(function() {
                        y.length && v.$digest()
                    });
                    y.push({
                        scope: this,
                        expression: l(n),
                        locals: t
                    })
                },
                $$postDigest: function(n) {
                    w.push(n)
                },
                $apply: function(n) {
                    try {
                        nt("$apply");
                        try {
                            return this.$eval(n)
                        } finally {
                            v.$$phase = null
                        }
                    } catch (i) {
                        c(i)
                    } finally {
                        try {
                            v.$digest()
                        } catch (t) {
                            throw c(t),
                            t;
                        }
                    }
                },
                $applyAsync: function(n) {
                    function t() {
                        i.$eval(n)
                    }
                    var i = this;
                    n && d.push(t);
                    n = l(n);
                    ft()
                },
                $on: function(n, t) {
                    var r = this.$$listeners[n], i, u;
                    r || (this.$$listeners[n] = r = []);
                    r.push(t);
                    i = this;
                    do
                        i.$$listenerCount[n] || (i.$$listenerCount[n] = 0),
                        i.$$listenerCount[n]++;
                    while (i = i.$parent);
                    return u = this,
                    function() {
                        var i = r.indexOf(t);
                        -1 !== i && (r[i] = null,
                        tt(u, 1, n))
                    }
                },
                $emit: function(n) {
                    var o = [], u, r = this, e = !1, t = {
                        name: n,
                        targetScope: r,
                        stopPropagation: function() {
                            e = !0
                        },
                        preventDefault: function() {
                            t.defaultPrevented = !0
                        },
                        defaultPrevented: !1
                    }, s = or([t], arguments, 1), i, f;
                    do {
                        for (u = r.$$listeners[n] || o,
                        t.currentScope = r,
                        i = 0,
                        f = u.length; i < f; i++)
                            if (u[i])
                                try {
                                    u[i].apply(null, s)
                                } catch (h) {
                                    c(h)
                                }
                            else
                                u.splice(i, 1),
                                i--,
                                f--;
                        if (e)
                            return t.currentScope = null,
                            t;
                        r = r.$parent
                    } while (r);
                    return t.currentScope = null,
                    t
                },
                $broadcast: function(n) {
                    var t = this, i = this, u = {
                        name: n,
                        targetScope: this,
                        preventDefault: function() {
                            u.defaultPrevented = !0
                        },
                        defaultPrevented: !1
                    }, e, r, f;
                    if (!this.$$listenerCount[n])
                        return u;
                    for (e = or([u], arguments, 1); t = i; ) {
                        for (u.currentScope = t,
                        i = t.$$listeners[n] || [],
                        r = 0,
                        f = i.length; r < f; r++)
                            if (i[r])
                                try {
                                    i[r].apply(null, e)
                                } catch (o) {
                                    c(o)
                                }
                            else
                                i.splice(r, 1),
                                r--,
                                f--;
                        if (!(i = t.$$listenerCount[n] && t.$$childHead || t !== this && t.$$nextSibling))
                            for (; t !== this && !(i = t.$$nextSibling); )
                                t = t.$parent
                    }
                    return u.currentScope = null,
                    u
                }
            };
            var v = new p
              , y = v.$$asyncQueue = []
              , w = v.$$postDigestQueue = []
              , d = v.$$applyAsyncQueue = []
              , g = 0;
            return v
        }
        ]
    }
    function da() {
        var n = /^\s*(https?|ftp|mailto|tel|file):/
          , t = /^\s*((https?|ftp|file|blob):|data:image\/)/;
        this.aHrefSanitizationWhitelist = function(t) {
            return u(t) ? (n = t,
            this) : n
        }
        ;
        this.imgSrcSanitizationWhitelist = function(n) {
            return u(n) ? (t = n,
            this) : t
        }
        ;
        this.$get = function() {
            return function(i, r) {
                var f = r ? t : n, u;
                return u = ni(i).href,
                "" === u || u.match(f) ? i : "unsafe:" + u
            }
        }
    }
    function ga(n) {
        if ("self" === n)
            return n;
        if (h(n)) {
            if (-1 < n.indexOf("***"))
                throw ri("iwcard", n);
            return n = sh(n).replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*"),
            new RegExp("^" + n + "$")
        }
        if (rr(n))
            return new RegExp("^" + n.source + "$");
        throw ri("imatcher");
    }
    function as(n) {
        var i = [];
        return u(n) && t(n, function(n) {
            i.push(ga(n))
        }),
        i
    }
    function nv() {
        this.SCE_CONTEXTS = lt;
        var n = ["self"]
          , t = [];
        this.resourceUrlWhitelist = function(t) {
            return arguments.length && (n = as(t)),
            n
        }
        ;
        this.resourceUrlBlacklist = function(n) {
            return arguments.length && (t = as(n)),
            t
        }
        ;
        this.$get = ["$injector", function(i) {
            function o(n, t) {
                return "self" === n ? vs(t) : !!n.exec(t.href)
            }
            function f(n) {
                var t = function(n) {
                    this.$$unwrapTrustedValue = function() {
                        return n
                    }
                };
                return n && (t.prototype = new n),
                t.prototype.valueOf = function() {
                    return this.$$unwrapTrustedValue()
                }
                ,
                t.prototype.toString = function() {
                    return this.$$unwrapTrustedValue().toString()
                }
                ,
                t
            }
            var s = function() {
                throw ri("unsafe");
            }, e, u;
            return i.has("$sanitize") && (s = i.get("$sanitize")),
            e = f(),
            u = {},
            u[lt.HTML] = f(e),
            u[lt.CSS] = f(e),
            u[lt.URL] = f(e),
            u[lt.JS] = f(e),
            u[lt.RESOURCE_URL] = f(u[lt.URL]),
            {
                trustAs: function(n, t) {
                    var i = u.hasOwnProperty(n) ? u[n] : null;
                    if (!i)
                        throw ri("icontext", n, t);
                    if (null === t || r(t) || "" === t)
                        return t;
                    if ("string" != typeof t)
                        throw ri("itype", n);
                    return new i(t)
                },
                getTrusted: function(i, f) {
                    var h, e, l, c;
                    if (null === f || r(f) || "" === f)
                        return f;
                    if (h = u.hasOwnProperty(i) ? u[i] : null,
                    h && f instanceof h)
                        return f.$$unwrapTrustedValue();
                    if (i === lt.RESOURCE_URL) {
                        for (h = ni(f.toString()),
                        c = !1,
                        e = 0,
                        l = n.length; e < l; e++)
                            if (o(n[e], h)) {
                                c = !0;
                                break
                            }
                        if (c)
                            for (e = 0,
                            l = t.length; e < l; e++)
                                if (o(t[e], h)) {
                                    c = !1;
                                    break
                                }
                        if (c)
                            return f;
                        throw ri("insecurl", f.toString());
                    }
                    if (i === lt.HTML)
                        return s(f);
                    throw ri("unsafe");
                },
                valueOf: function(n) {
                    return n instanceof e ? n.$$unwrapTrustedValue() : n
                }
            }
        }
        ]
    }
    function tv() {
        var n = !0;
        this.enabled = function(t) {
            return arguments.length && (n = !!t),
            n
        }
        ;
        this.$get = ["$parse", "$sceDelegate", function(i, r) {
            var u;
            if (n && 8 > ti)
                throw ri("iequirks");
            u = st(lt);
            u.isEnabled = function() {
                return n
            }
            ;
            u.trustAs = r.trustAs;
            u.getTrusted = r.getTrusted;
            u.valueOf = r.valueOf;
            n || (u.trustAs = u.getTrusted = function(n, t) {
                return t
            }
            ,
            u.valueOf = ir);
            u.parseAs = function(n, t) {
                var r = i(t);
                return r.literal && r.constant ? r : i(t, function(t) {
                    return u.getTrusted(n, t)
                })
            }
            ;
            var f = u.parseAs
              , e = u.getTrusted
              , o = u.trustAs;
            return t(lt, function(n, t) {
                var i = v(t);
                u[cr("parse_as_" + i)] = function(t) {
                    return f(n, t)
                }
                ;
                u[cr("get_trusted_" + i)] = function(t) {
                    return e(n, t)
                }
                ;
                u[cr("trust_as_" + i)] = function(t) {
                    return o(n, t)
                }
            }),
            u
        }
        ]
    }
    function iv() {
        this.$get = ["$window", "$document", function(n, t) {
            var o = {}, a = !(n.chrome && n.chrome.app && n.chrome.app.runtime) && n.history && n.history.pushState, s = tt((/android (\d+)/.exec(v((n.navigator || {}).userAgent)) || [])[1]), y = /Boxee/i.test((n.navigator || {}).userAgent), c = t[0] || {}, i, u = c.body && c.body.style, f = !1, e = !1, l;
            if (u) {
                for (l in u)
                    if (f = /^(Moz|webkit|ms)(?=[A-Z])/.exec(l)) {
                        i = f[0];
                        i = i[0].toUpperCase() + i.substr(1);
                        break
                    }
                i || (i = "WebkitOpacity"in u && "webkit");
                f = !!("transition"in u || i + "Transition"in u);
                e = !!("animation"in u || i + "Animation"in u);
                !s || f && e || (f = h(u.webkitTransition),
                e = h(u.webkitAnimation))
            }
            return {
                history: !(!a || 4 > s || y),
                hasEvent: function(n) {
                    if ("input" === n && 11 >= ti)
                        return !1;
                    if (r(o[n])) {
                        var t = c.createElement("div");
                        o[n] = "on" + n in t
                    }
                    return o[n]
                },
                csp: ci(),
                vendorPrefix: i,
                transitions: f,
                animations: e,
                android: s
            }
        }
        ]
    }
    function rv() {
        var n;
        this.httpOptions = function(t) {
            return t ? (n = t,
            this) : n
        }
        ;
        this.$get = ["$templateCache", "$http", "$q", "$sce", function(t, i, u, f) {
            function e(o, s) {
                e.totalPendingRequests++;
                (!h(o) || r(t.get(o))) && (o = f.getTrustedResourceUrl(o));
                var l = i.defaults && i.defaults.transformResponse;
                return c(l) ? l = l.filter(function(n) {
                    return n !== pf
                }) : l === pf && (l = null),
                i.get(o, a({
                    cache: t,
                    transformResponse: l
                }, n))["finally"](function() {
                    e.totalPendingRequests--
                }).then(function(n) {
                    return t.put(o, n.data),
                    n.data
                }, function(n) {
                    if (!s)
                        throw lp("tpload", o, n.status, n.statusText);
                    return u.reject(n)
                })
            }
            return e.totalPendingRequests = 0,
            e
        }
        ]
    }
    function uv() {
        this.$get = ["$rootScope", "$browser", "$location", function(n, i, r) {
            return {
                findBindings: function(n, i, r) {
                    n = n.getElementsByClassName("ng-binding");
                    var u = [];
                    return t(n, function(n) {
                        var f = ut.element(n).data("$binding");
                        f && t(f, function(t) {
                            r ? new RegExp("(^|\\s)" + sh(i) + "(\\s|\\||$)").test(t) && u.push(n) : -1 != t.indexOf(i) && u.push(n)
                        })
                    }),
                    u
                },
                findModels: function(n, t, i) {
                    for (var f, u = ["ng-", "data-ng-", "ng\\:"], r = 0; r < u.length; ++r)
                        if (f = n.querySelectorAll("[" + u[r] + "model" + (i ? "=" : "*=") + '"' + t + '"]'),
                        f.length)
                            return f
                },
                getLocation: function() {
                    return r.url()
                },
                setLocation: function(t) {
                    t !== r.url() && (r.url(t),
                    n.$digest())
                },
                whenStable: function(n) {
                    i.notifyWhenNoOutstandingRequests(n)
                }
            }
        }
        ]
    }
    function fv() {
        this.$get = ["$rootScope", "$browser", "$q", "$$q", "$exceptionHandler", function(n, t, i, r, e) {
            function h(h, c, l) {
                f(h) || (l = c,
                c = h,
                h = o);
                var w = bt.call(arguments, 3), p = u(l) && !l, a = (p ? r : i).defer(), v = a.promise, y;
                return y = t.defer(function() {
                    try {
                        a.resolve(h.apply(null, w))
                    } catch (t) {
                        a.reject(t);
                        e(t)
                    } finally {
                        delete s[v.$$timeoutId]
                    }
                    p || n.$apply()
                }, c),
                v.$$timeoutId = y,
                s[y] = a,
                v
            }
            var s = {};
            return h.cancel = function(n) {
                return n && n.$$timeoutId in s ? (s[n.$$timeoutId].reject("canceled"),
                delete s[n.$$timeoutId],
                t.defer.cancel(n.$$timeoutId)) : !1
            }
            ,
            h
        }
        ]
    }
    function ni(n) {
        return ti && (nt.setAttribute("href", n),
        n = nt.href),
        nt.setAttribute("href", n),
        {
            href: nt.href,
            protocol: nt.protocol ? nt.protocol.replace(/:$/, "") : "",
            host: nt.host,
            search: nt.search ? nt.search.replace(/^\?/, "") : "",
            hash: nt.hash ? nt.hash.replace(/^#/, "") : "",
            hostname: nt.hostname,
            port: nt.port,
            pathname: "/" === nt.pathname.charAt(0) ? nt.pathname : "/" + nt.pathname
        }
    }
    function vs(n) {
        return n = h(n) ? ni(n) : n,
        n.protocol === bh.protocol && n.host === bh.host
    }
    function ev() {
        this.$get = ft(n)
    }
    function ys(n) {
        function u(n) {
            try {
                return decodeURIComponent(n)
            } catch (t) {
                return n
            }
        }
        var f = n[0] || {}
          , t = {}
          , i = "";
        return function() {
            var n, e, o, s, h;
            if (n = f.cookie || "",
            n !== i)
                for (i = n,
                n = i.split("; "),
                t = {},
                o = 0; o < n.length; o++)
                    e = n[o],
                    s = e.indexOf("="),
                    0 < s && (h = u(e.substring(0, s)),
                    r(t[h]) && (t[h] = u(e.substring(s + 1))));
            return t
        }
    }
    function ov() {
        this.$get = ys
    }
    function ps(n) {
        function i(r, u) {
            if (s(r)) {
                var f = {};
                return t(r, function(n, t) {
                    f[t] = i(t, n)
                }),
                f
            }
            return n.factory(r + "Filter", u)
        }
        this.register = i;
        this.$get = ["$injector", function(n) {
            return function(t) {
                return n.get(t + "Filter")
            }
        }
        ];
        i("currency", ws);
        i("date", nh);
        i("filter", sv);
        i("json", av);
        i("limitTo", vv);
        i("lowercase", gh);
        i("number", bs);
        i("orderBy", th);
        i("uppercase", nc)
    }
    function sv() {
        return function(n, t, i, r) {
            if (!kt(n)) {
                if (null == n)
                    return n;
                throw l("filter")("notarray", n);
            }
            r = r || "$";
            var u;
            switch (gf(t)) {
            case "function":
                break;
            case "boolean":
            case "null":
            case "number":
            case "string":
                u = !0;
            case "object":
                t = hv(t, i, r, u);
                break;
            default:
                return n
            }
            return Array.prototype.filter.call(n, t)
        }
    }
    function hv(n, t, i, u) {
        var e = s(n) && i in n;
        return !0 === t ? t = ot : f(t) || (t = function(n, t) {
            return r(n) ? !1 : null === n || null === t ? n === t : s(t) || s(n) && !pe(n) ? !1 : (n = v("" + n),
            t = v("" + t),
            -1 !== n.indexOf(t))
        }
        ),
        function(r) {
            return e && !s(r) ? si(r, n[i], t, i, !1) : si(r, n, t, i, u)
        }
    }
    function si(n, t, i, u, e, o) {
        var h = gf(n), l = gf(t), s;
        if ("string" === l && "!" === t.charAt(0))
            return !si(n, t.substring(1), i, u, e);
        if (c(n))
            return n.some(function(n) {
                return si(n, t, i, u, e)
            });
        switch (h) {
        case "object":
            if (e) {
                for (s in n)
                    if ("$" !== s.charAt(0) && si(n[s], t, i, u, !0))
                        return !0;
                return o ? !1 : si(n, t, i, u, !1)
            }
            if ("object" === l) {
                for (s in t)
                    if (o = t[s],
                    !f(o) && !r(o) && (h = s === u,
                    !si(h ? n : n[s], o, i, u, h, h)))
                        return !1;
                return !0
            }
            return i(n, t);
        case "function":
            return !1;
        default:
            return i(n, t)
        }
    }
    function gf(n) {
        return null === n ? "null" : typeof n
    }
    function ws(n) {
        var t = n.NUMBER_FORMATS;
        return function(n, i, u) {
            return r(i) && (i = t.CURRENCY_SYM),
            r(u) && (u = t.PATTERNS[1].maxFrac),
            null == n ? n : ks(n, t.PATTERNS[1], t.GROUP_SEP, t.DECIMAL_SEP, u).replace(/\u00A4/g, i)
        }
    }
    function bs(n) {
        var t = n.NUMBER_FORMATS;
        return function(n, i) {
            return null == n ? n : ks(n, t.PATTERNS[0], t.GROUP_SEP, t.DECIMAL_SEP, i)
        }
    }
    function cv(n) {
        var e = 0, r, t, i, f, u;
        for (-1 < (t = n.indexOf(dh)) && (n = n.replace(dh, "")),
        0 < (i = n.search(/e/i)) ? (0 > t && (t = i),
        t += +n.slice(i + 1),
        n = n.substring(0, i)) : 0 > t && (t = n.length),
        i = 0; n.charAt(i) == le; i++)
            ;
        if (i == (u = n.length))
            r = [0],
            t = 1;
        else {
            for (u--; n.charAt(u) == le; )
                u--;
            for (t -= i,
            r = [],
            f = 0; i <= u; i++,
            f++)
                r[f] = +n.charAt(i)
        }
        return t > kh && (r = r.splice(0, kh - 1),
        e = t - 1,
        t = 1),
        {
            d: r,
            e: e,
            i: t
        }
    }
    function lv(n, t, i, u) {
        var f = n.d, o = f.length - n.i, e;
        if (t = r(t) ? Math.min(Math.max(i, o), u) : +t,
        i = t + n.i,
        u = f[i],
        0 < i)
            for (f.splice(Math.max(n.i, i)),
            e = i; e < f.length; e++)
                f[e] = 0;
        else
            for (o = Math.max(0, o),
            n.i = 1,
            f.length = Math.max(1, i = t + 1),
            f[0] = 0,
            e = 1; e < i; e++)
                f[e] = 0;
        if (5 <= u)
            if (0 > i - 1) {
                for (u = 0; u > i; u--)
                    f.unshift(0),
                    n.i++;
                f.unshift(1);
                n.i++
            } else
                f[i - 1]++;
        for (; o < Math.max(0, t); o++)
            f.push(0);
        (t = f.reduceRight(function(n, t, i, r) {
            return t += n,
            r[i] = t % 10,
            Math.floor(t / 10)
        }, 0)) && (f.unshift(t),
        n.i++)
    }
    function ks(n, t, i, r, u) {
        if (!h(n) && !w(n) || isNaN(n))
            return "";
        var s = !isFinite(n)
          , o = !1
          , e = Math.abs(n) + ""
          , f = "";
        if (s)
            f = "∞";
        else {
            for (o = cv(e),
            lv(o, u, t.minFrac, t.maxFrac),
            f = o.d,
            e = o.i,
            u = o.e,
            s = [],
            o = f.reduce(function(n, t) {
                return n && !t
            }, !0); 0 > e; )
                f.unshift(0),
                e++;
            for (0 < e ? s = f.splice(e, f.length) : (s = f,
            f = [0]),
            e = [],
            f.length >= t.lgSize && e.unshift(f.splice(-t.lgSize, f.length).join("")); f.length > t.gSize; )
                e.unshift(f.splice(-t.gSize, f.length).join(""));
            f.length && e.unshift(f.join(""));
            f = e.join(i);
            s.length && (f += r + s.join(""));
            u && (f += "e+" + u)
        }
        return 0 > n && !o ? t.negPre + f + t.negSuf : t.posPre + f + t.posSuf
    }
    function pu(n, t, i, r) {
        var u = "";
        for ((0 > n || r && 0 >= n) && (r ? n = -n + 1 : (n = -n,
        u = "-")),
        n = "" + n; n.length < t; )
            n = le + n;
        return i && (n = n.substr(n.length - t)),
        u + n
    }
    function d(n, t, i, r, u) {
        return i = i || 0,
        function(f) {
            return f = f["get" + n](),
            (0 < i || f > -i) && (f += i),
            0 === f && -12 == i && (f = 12),
            pu(f, t, r, u)
        }
    }
    function pr(n, t, i) {
        return function(r, u) {
            var f = r["get" + n]()
              , e = bu((i ? "STANDALONE" : "") + (t ? "SHORT" : "") + n);
            return u[e][f]
        }
    }
    function ds(n) {
        var t = new Date(n,0,1).getDay();
        return new Date(n,0,(4 >= t ? 5 : 12) - t)
    }
    function gs(n) {
        return function(t) {
            var i = ds(t.getFullYear());
            return t = +new Date(t.getFullYear(),t.getMonth(),t.getDate() + (4 - t.getDay())) - +i,
            t = 1 + Math.round(t / 6048e5),
            pu(t, n)
        }
    }
    function ne(n, t) {
        return 0 >= n.getFullYear() ? t.ERAS[0] : t.ERAS[1]
    }
    function nh(n) {
        function i(n) {
            var t;
            if (t = n.match(r)) {
                n = new Date(0);
                var i = 0
                  , u = 0
                  , f = t[8] ? n.setUTCFullYear : n.setFullYear
                  , e = t[8] ? n.setUTCHours : n.setHours;
                t[9] && (i = tt(t[9] + t[10]),
                u = tt(t[9] + t[11]));
                f.call(n, tt(t[1]), tt(t[2]) - 1, tt(t[3]));
                i = tt(t[4] || 0) - i;
                u = tt(t[5] || 0) - u;
                f = tt(t[6] || 0);
                t = Math.round(1e3 * parseFloat("0." + (t[7] || 0)));
                e.call(n, i, u, f, t)
            }
            return n
        }
        var r = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
        return function(r, u, f) {
            var c = "", e = [], s, l, o;
            if (u = u || "mediumDate",
            u = n.DATETIME_FORMATS[u] || u,
            h(r) && (r = yp.test(r) ? tt(r) : i(r)),
            w(r) && (r = new Date(r)),
            !et(r) || !isFinite(r.getTime()))
                return r;
            for (; u; )
                (l = vp.exec(u)) ? (e = or(e, l, 1),
                u = e.pop()) : (e.push(u),
                u = null);
            return o = r.getTimezoneOffset(),
            f && (o = ke(f, o),
            r = cf(r, f, !0)),
            t(e, function(t) {
                s = ap[t];
                c += s ? s(r, n.DATETIME_FORMATS, o) : "''" === t ? "'" : t.replace(/(^'|'$)/g, "").replace(/''/g, "'")
            }),
            c
        }
    }
    function av() {
        return function(n, t) {
            return r(t) && (t = 2),
            hr(n, t)
        }
    }
    function vv() {
        return function(n, t, i) {
            return (t = Infinity === Math.abs(Number(t)) ? Number(t) : tt(t),
            isNaN(t)) ? n : (w(n) && (n = n.toString()),
            !kt(n)) ? n : (i = !i || isNaN(i) ? 0 : tt(i),
            i = 0 > i ? Math.max(0, n.length + i) : i,
            0 <= t ? te(n, i, i + t) : 0 === i ? te(n, t, n.length) : te(n, Math.max(0, i + t), i))
        }
    }
    function te(n, t, i) {
        return h(n) ? n.slice(t, i) : bt.call(n, t, i)
    }
    function th(n) {
        function i(t) {
            return t.map(function(t) {
                var r = 1, i = ir, u;
                return f(t) ? i = t : h(t) && (("+" == t.charAt(0) || "-" == t.charAt(0)) && (r = "-" == t.charAt(0) ? -1 : 1,
                t = t.substring(1)),
                "" !== t && (i = n(t),
                i.constant) && (u = i(),
                i = function(n) {
                    return n[u]
                }
                )),
                {
                    get: i,
                    descending: r
                }
            })
        }
        function t(n) {
            switch (typeof n) {
            case "number":
            case "boolean":
            case "string":
                return !0;
            default:
                return !1
            }
        }
        function r(n, t) {
            var f = 0, u = n.type, i = t.type, r;
            return u === i ? (i = n.value,
            r = t.value,
            "string" === u ? (i = i.toLowerCase(),
            r = r.toLowerCase()) : "object" === u && (s(i) && (i = n.index),
            s(r) && (r = t.index)),
            i !== r && (f = i < r ? -1 : 1)) : f = u < i ? -1 : 1,
            f
        }
        return function(n, u, e, o) {
            if (null == n)
                return n;
            if (!kt(n))
                throw l("orderBy")("notarray", n);
            c(u) || (u = [u]);
            0 === u.length && (u = ["+"]);
            var s = i(u)
              , h = e ? -1 : 1
              , a = f(o) ? o : r;
            return n = Array.prototype.map.call(n, function(n, i) {
                return {
                    value: n,
                    tieBreaker: {
                        value: i,
                        type: "number",
                        index: i
                    },
                    predicateValues: s.map(function(r) {
                        var u = r.get(n);
                        if (r = typeof u,
                        null === u)
                            r = "string",
                            u = "null";
                        else if ("object" === r)
                            n: {
                                if (f(u.valueOf) && (u = u.valueOf(),
                                t(u)))
                                    break n;
                                pe(u) && (u = u.toString(),
                                t(u))
                            }
                        return {
                            value: u,
                            type: r,
                            index: i
                        }
                    })
                }
            }),
            n.sort(function(n, t) {
                for (var r, i = 0, u = s.length; i < u; i++)
                    if (r = a(n.predicateValues[i], t.predicateValues[i]),
                    r)
                        return r * s[i].descending * h;
                return a(n.tieBreaker, t.tieBreaker) * h
            }),
            n.map(function(n) {
                return n.value
            })
        }
    }
    function bi(n) {
        return f(n) && (n = {
            link: n
        }),
        n.restrict = n.restrict || "AC",
        ft(n)
    }
    function ih(n, i, r, u, f) {
        var e = this
          , o = [];
        e.$error = {};
        e.$$success = {};
        e.$pending = void 0;
        e.$name = f(i.name || i.ngForm || "")(r);
        e.$dirty = !1;
        e.$pristine = !0;
        e.$valid = !0;
        e.$invalid = !1;
        e.$submitted = !1;
        e.$$parentForm = dr;
        e.$rollbackViewValue = function() {
            t(o, function(n) {
                n.$rollbackViewValue()
            })
        }
        ;
        e.$commitViewValue = function() {
            t(o, function(n) {
                n.$commitViewValue()
            })
        }
        ;
        e.$addControl = function(n) {
            yi(n.$name, "input");
            o.push(n);
            n.$name && (e[n.$name] = n);
            n.$$parentForm = e
        }
        ;
        e.$$renameControl = function(n, t) {
            var i = n.$name;
            e[i] === n && delete e[i];
            e[t] = n;
            n.$name = t
        }
        ;
        e.$removeControl = function(n) {
            n.$name && e[n.$name] === n && delete e[n.$name];
            t(e.$pending, function(t, i) {
                e.$setValidity(i, null, n)
            });
            t(e.$error, function(t, i) {
                e.$setValidity(i, null, n)
            });
            t(e.$$success, function(t, i) {
                e.$setValidity(i, null, n)
            });
            er(o, n);
            n.$$parentForm = dr
        }
        ;
        fh({
            ctrl: this,
            $element: n,
            set: function(n, t, i) {
                var r = n[t];
                r ? -1 === r.indexOf(i) && r.push(i) : n[t] = [i]
            },
            unset: function(n, t, i) {
                var r = n[t];
                r && (er(r, i),
                0 === r.length && delete n[t])
            },
            $animate: u
        });
        e.$setDirty = function() {
            u.removeClass(n, tr);
            u.addClass(n, ef);
            e.$dirty = !0;
            e.$pristine = !1;
            e.$$parentForm.$setDirty()
        }
        ;
        e.$setPristine = function() {
            u.setClass(n, tr, ef + " ng-submitted");
            e.$dirty = !1;
            e.$pristine = !0;
            e.$submitted = !1;
            t(o, function(n) {
                n.$setPristine()
            })
        }
        ;
        e.$setUntouched = function() {
            t(o, function(n) {
                n.$setUntouched()
            })
        }
        ;
        e.$setSubmitted = function() {
            u.addClass(n, "ng-submitted");
            e.$submitted = !0;
            e.$$parentForm.$setSubmitted()
        }
    }
    function ie(n) {
        n.$formatters.push(function(t) {
            return n.$isEmpty(t) ? t : t.toString()
        })
    }
    function wr(n, t, i, r, u, f) {
        var h = v(t[0].type), s, e, o, c;
        if (!u.android) {
            s = !1;
            t.on("compositionstart", function() {
                s = !0
            });
            t.on("compositionend", function() {
                s = !1;
                o()
            })
        }
        if (o = function(n) {
            if (e && (f.defer.cancel(e),
            e = null),
            !s) {
                var u = t.val();
                n = n && n.type;
                "password" === h || i.ngTrim && "false" === i.ngTrim || (u = p(u));
                (r.$viewValue !== u || "" === u && r.$$hasNativeValidators) && r.$setViewValue(u, n)
            }
        }
        ,
        u.hasEvent("input"))
            t.on("input", o);
        else {
            c = function(n, t, i) {
                e || (e = f.defer(function() {
                    e = null;
                    t && t.value === i || o(n)
                }))
            }
            ;
            t.on("keydown", function(n) {
                var t = n.keyCode;
                91 === t || 15 < t && 19 > t || 37 <= t && 40 >= t || c(n, this, this.value)
            });
            if (u.hasEvent("paste"))
                t.on("paste cut", c)
        }
        t.on("change", o);
        if (oc[h] && r.$$hasNativeValidators && h === i.type)
            t.on("keydown wheel mousedown", function(n) {
                if (!e) {
                    var t = this.validity
                      , i = t.badInput
                      , r = t.typeMismatch;
                    e = f.defer(function() {
                        e = null;
                        t.badInput === i && t.typeMismatch === r || o(n)
                    })
                }
            });
        r.$render = function() {
            var n = r.$isEmpty(r.$viewValue) ? "" : r.$viewValue;
            t.val() !== n && t.val(n)
        }
    }
    function wu(n, i) {
        return function(r, u) {
            var e, f;
            if (et(r))
                return r;
            if (h(r)) {
                if ('"' == r.charAt(0) && '"' == r.charAt(r.length - 1) && (r = r.substring(1, r.length - 1)),
                bp.test(r))
                    return new Date(r);
                if (n.lastIndex = 0,
                e = n.exec(r))
                    return e.shift(),
                    f = u ? {
                        yyyy: u.getFullYear(),
                        MM: u.getMonth() + 1,
                        dd: u.getDate(),
                        HH: u.getHours(),
                        mm: u.getMinutes(),
                        ss: u.getSeconds(),
                        sss: u.getMilliseconds() / 1e3
                    } : {
                        yyyy: 1970,
                        MM: 1,
                        dd: 1,
                        HH: 0,
                        mm: 0,
                        ss: 0,
                        sss: 0
                    },
                    t(e, function(n, t) {
                        t < i.length && (f[i[t]] = +n)
                    }),
                    new Date(f.yyyy,f.MM - 1,f.dd,f.HH,f.mm,f.ss || 0,1e3 * f.sss || 0)
            }
            return NaN
        }
    }
    function br(n, t, i, f) {
        return function(e, o, s, h, c, l, a) {
            function p(n) {
                return n && !(n.getTime && n.getTime() !== n.getTime())
            }
            function k(n) {
                return u(n) && !et(n) ? i(n) || void 0 : n
            }
            var v, y, w, b;
            rh(e, o, s, h);
            wr(e, o, s, h, c, l);
            v = h && h.$options && h.$options.timezone;
            h.$$parserName = n;
            h.$parsers.push(function(n) {
                return h.$isEmpty(n) ? null : t.test(n) ? (n = i(n, y),
                v && (n = cf(n, v)),
                n) : void 0
            });
            h.$formatters.push(function(n) {
                if (n && !et(n))
                    throw nu("datefmt", n);
                return p(n) ? ((y = n) && v && (y = cf(y, v, !0)),
                a("date")(n, f, v)) : (y = null,
                "")
            });
            (u(s.min) || s.ngMin) && (h.$validators.min = function(n) {
                return !p(n) || r(w) || i(n) >= w
            }
            ,
            s.$observe("min", function(n) {
                w = k(n);
                h.$validate()
            }));
            (u(s.max) || s.ngMax) && (h.$validators.max = function(n) {
                return !p(n) || r(b) || i(n) <= b
            }
            ,
            s.$observe("max", function(n) {
                b = k(n);
                h.$validate()
            }))
        }
    }
    function rh(n, t, i, r) {
        (r.$$hasNativeValidators = s(t[0].validity)) && r.$parsers.push(function(n) {
            var i = t.prop("validity") || {};
            if (!i.badInput && !i.typeMismatch)
                return n
        })
    }
    function uh(n, t, i, r, f) {
        if (u(r)) {
            if (n = n(r),
            !n.constant)
                throw nu("constexpr", i, r);
            return n(t)
        }
        return f
    }
    function re(n, i) {
        return n = "ngClass" + n,
        ["$animate", function(r) {
            function f(n, t) {
                var f = [], r = 0, u, i;
                n: for (; r < n.length; r++) {
                    for (u = n[r],
                    i = 0; i < t.length; i++)
                        if (u == t[i])
                            continue n;
                    f.push(u)
                }
                return f
            }
            function u(n) {
                var i = [];
                return c(n) ? (t(n, function(n) {
                    i = i.concat(u(n))
                }),
                i) : h(n) ? n.split(" ") : s(n) ? (t(n, function(n, t) {
                    n && (i = i.concat(t.split(" ")))
                }),
                i) : n
            }
            return {
                restrict: "AC",
                link: function(e, o, s) {
                    function a(n) {
                        n = h(n, 1);
                        s.$addClass(n)
                    }
                    function h(n, i) {
                        var r = o.data("$classCounts") || y()
                          , u = [];
                        return t(n, function(n) {
                            (0 < i || r[n]) && (r[n] = (r[n] || 0) + i,
                            r[n] === +(0 < i) && u.push(n))
                        }),
                        o.data("$classCounts", r),
                        u.join(" ")
                    }
                    function p(n, t) {
                        var i = f(t, n)
                          , u = f(n, t)
                          , i = h(i, 1)
                          , u = h(u, -1);
                        i && i.length && r.addClass(o, i);
                        u && u.length && r.removeClass(o, u)
                    }
                    function v(n) {
                        var t, r;
                        (!0 === i || (e.$index & 1) === i) && (t = u(n || []),
                        l ? ot(n, l) || (r = u(l),
                        p(r, t)) : a(t));
                        l = c(n) ? n.map(function(n) {
                            return st(n)
                        }) : st(n)
                    }
                    var l;
                    e.$watch(s[n], v, !0);
                    s.$observe("class", function() {
                        v(e.$eval(s[n]))
                    });
                    "ngClass" !== n && e.$watch("$index", function(t, r) {
                        var f = t & 1, o;
                        f !== (r & 1) && (o = u(e.$eval(s[n])),
                        f === i ? a(o) : (f = h(o, -1),
                        s.$removeClass(f)))
                    })
                }
            }
        }
        ]
    }
    function fh(n) {
        function f(n, t) {
            t && !i[n] ? (h.addClass(o, n),
            i[n] = !0) : !t && i[n] && (h.removeClass(o, n),
            i[n] = !1)
        }
        function e(n, t) {
            n = n ? "-" + to(n, "-") : "";
            f(gr + n, !0 === t);
            f(lc + n, !1 === t)
        }
        var t = n.ctrl
          , o = n.$element
          , i = {}
          , s = n.set
          , u = n.unset
          , h = n.$animate;
        i[lc] = !(i[gr] = o.hasClass(gr));
        t.$setValidity = function(n, i, o) {
            r(i) ? (t.$pending || (t.$pending = {}),
            s(t.$pending, n, o)) : (t.$pending && u(t.$pending, n, o),
            eh(t.$pending) && (t.$pending = void 0));
            ui(i) ? i ? (u(t.$error, n, o),
            s(t.$$success, n, o)) : (s(t.$error, n, o),
            u(t.$$success, n, o)) : (u(t.$error, n, o),
            u(t.$$success, n, o));
            t.$pending ? (f(ac, !0),
            t.$valid = t.$invalid = void 0,
            e("", null)) : (f(ac, !1),
            t.$valid = eh(t.$error),
            t.$invalid = !t.$valid,
            e("", t.$valid));
            i = t.$pending && t.$pending[n] ? void 0 : t.$error[n] ? !1 : t.$$success[n] ? !0 : null;
            e(n, i);
            t.$$parentForm.$setValidity(n, i, t)
        }
    }
    function eh(n) {
        if (n)
            for (var t in n)
                if (n.hasOwnProperty(t))
                    return !1;
        return !0
    }
    var yv = /^\/(.+)\/([a-z]*)$/, wt = Object.prototype.hasOwnProperty, v = function(n) {
        return h(n) ? n.toLowerCase() : n
    }, bu = function(n) {
        return h(n) ? n.toUpperCase() : n
    }, ti, e, ii, bt = [].slice, pv = [].splice, wv = [].push, rt = Object.prototype.toString, oh = Object.getPrototypeOf, hi = l("ng"), ut = n.angular || (n.angular = {}), ue, ku = 0, gi, ch, oe, se, wh, uf, i, ff, gh, nc, tc, kr, dr;
    ti = n.document.documentMode;
    o.$inject = [];
    ir.$inject = [];
    var c = Array.isArray
      , bv = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/
      , p = function(n) {
        return h(n) ? n.trim() : n
    }
      , sh = function(n) {
        return n.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
    }
      , ci = function() {
        var i, t;
        if (!u(ci.rules))
            if (i = n.document.querySelector("[ng-csp]") || n.document.querySelector("[data-ng-csp]"),
            i)
                t = i.getAttribute("ng-csp") || i.getAttribute("data-ng-csp"),
                ci.rules = {
                    noUnsafeEval: !t || -1 !== t.indexOf("no-unsafe-eval"),
                    noInlineStyle: !t || -1 !== t.indexOf("no-inline-style")
                };
            else {
                i = ci;
                try {
                    new Function("");
                    t = !1
                } catch (r) {
                    t = !0
                }
                i.rules = {
                    noUnsafeEval: t,
                    noInlineStyle: !1
                }
            }
        return ci.rules
    }
      , du = function() {
        if (u(du.name_))
            return du.name_;
        for (var r, e = ki.length, i, f, t = 0; t < e; ++t)
            if (i = ki[t],
            r = n.document.querySelector("[" + i.replace(":", "\\:") + "jq]")) {
                f = r.getAttribute(i + "jq");
                break
            }
        return du.name_ = f
    }
      , kv = /:/g
      , ki = ["ng-", "data-ng-", "ng:", "x-ng-"]
      , dv = /[A-Z]/g
      , hh = !1
      , di = 3
      , gv = {
        full: "1.5.8",
        major: 1,
        minor: 5,
        dot: 8,
        codeName: "arbitrary-fallbacks"
    };
    b.expando = "ng339";
    gi = b.cache = {};
    ch = 1;
    b._data = function(n) {
        return this.cache[n[this.expando]] || {}
    }
    ;
    var ny = /([\:\-\_]+(.))/g
      , ty = /^moz([A-Z])/
      , gu = {
        mouseleave: "mouseout",
        mouseenter: "mouseover"
    }
      , fe = l("jqLite")
      , iy = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/
      , ee = /<|&#?\w+;/
      , ry = /<([\w:-]+)/
      , uy = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi
      , ct = {
        option: [1, '<select multiple="multiple">', "<\/select>"],
        thead: [1, "<table>", "<\/table>"],
        col: [2, "<table><colgroup>", "<\/colgroup><\/table>"],
        tr: [2, "<table><tbody>", "<\/tbody><\/table>"],
        td: [3, "<table><tbody><tr>", "<\/tr><\/tbody><\/table>"],
        _default: [0, "", ""]
    };
    ct.optgroup = ct.option;
    ct.tbody = ct.tfoot = ct.colgroup = ct.caption = ct.thead;
    ct.th = ct.td;
    var fy = n.Node.prototype.contains || function(n) {
        return !!(this.compareDocumentPosition(n) & 16)
    }
      , nr = b.prototype = {
        ready: function(t) {
            function i() {
                r || (r = !0,
                t())
            }
            var r = !1;
            "complete" === n.document.readyState ? n.setTimeout(i) : (this.on("DOMContentLoaded", i),
            b(n).on("load", i))
        },
        toString: function() {
            var n = [];
            return t(this, function(t) {
                n.push("" + t)
            }),
            "[" + n.join(", ") + "]"
        },
        eq: function(n) {
            return 0 <= n ? e(this[n]) : e(this[this.length + n])
        },
        length: 0,
        push: wv,
        sort: [].sort,
        splice: [].splice
    }
      , nf = {};
    t("multiple selected checked disabled readOnly required open".split(" "), function(n) {
        nf[v(n)] = n
    });
    oe = {};
    t("input select option textarea button form details".split(" "), function(n) {
        oe[n] = !0
    });
    se = {
        ngMinlength: "minlength",
        ngMaxlength: "maxlength",
        ngMin: "min",
        ngMax: "max",
        ngPattern: "pattern"
    };
    t({
        data: vf,
        removeData: lr,
        hasData: function(n) {
            for (var t in gi[n.ng339])
                return !0;
            return !1
        },
        cleanData: function(n) {
            for (var t = 0, i = n.length; t < i; t++)
                lr(n[t])
        }
    }, function(n, t) {
        b[t] = n
    });
    t({
        data: vf,
        inheritedData: hu,
        scope: function(n) {
            return e.data(n, "$scope") || hu(n.parentNode || n, ["$isolateScope", "$scope"])
        },
        isolateScope: function(n) {
            return e.data(n, "$isolateScope") || e.data(n, "$isolateScopeNoTemplate")
        },
        controller: so,
        injector: function(n) {
            return hu(n, "$injector")
        },
        removeAttr: function(n, t) {
            n.removeAttribute(t)
        },
        hasClass: eu,
        css: function(n, t, i) {
            if (t = cr(t),
            u(i))
                n.style[t] = i;
            else
                return n.style[t]
        },
        attr: function(n, t, i) {
            var r = n.nodeType;
            if (r !== di && 2 !== r && 8 !== r)
                if (r = v(t),
                nf[r])
                    if (u(i))
                        i ? (n[t] = !0,
                        n.setAttribute(t, r)) : (n[t] = !1,
                        n.removeAttribute(r));
                    else
                        return n[t] || (n.attributes.getNamedItem(t) || o).specified ? r : void 0;
                else if (u(i))
                    n.setAttribute(t, i);
                else if (n.getAttribute)
                    return n = n.getAttribute(t, 2),
                    null === n ? void 0 : n
        },
        prop: function(n, t, i) {
            if (u(i))
                n[t] = i;
            else
                return n[t]
        },
        text: function() {
            function n(n, t) {
                if (r(t)) {
                    var i = n.nodeType;
                    return 1 === i || i === di ? n.textContent : ""
                }
                n.textContent = t
            }
            return n.$dv = "",
            n
        }(),
        val: function(n, i) {
            if (r(i)) {
                if (n.multiple && "select" === at(n)) {
                    var u = [];
                    return t(n.options, function(n) {
                        n.selected && u.push(n.value || n.text)
                    }),
                    0 === u.length ? null : u
                }
                return n.value
            }
            n.value = i
        },
        html: function(n, t) {
            if (r(t))
                return n.innerHTML;
            uu(n, !0);
            n.innerHTML = t
        },
        empty: ho
    }, function(n, t) {
        b.prototype[t] = function(t, i) {
            var u, f, e = this.length, o;
            if (n !== ho && r(2 == n.length && n !== eu && n !== so ? t : i)) {
                if (s(t)) {
                    for (u = 0; u < e; u++)
                        if (n === vf)
                            n(this[u], t);
                        else
                            for (f in t)
                                n(this[u], f, t[f]);
                    return this
                }
                for (u = n.$dv,
                e = r(u) ? Math.min(e, 1) : e,
                f = 0; f < e; f++)
                    o = n(this[f], t, i),
                    u = u ? u + o : o;
                return u
            }
            for (u = 0; u < e; u++)
                n(this[u], t, i);
            return this
        }
    });
    t({
        removeData: lr,
        on: function(n, t, i, r) {
            var f, e, s, o;
            if (u(r))
                throw fe("onargs");
            if (ro(n))
                for (r = fu(n, !0),
                f = r.events,
                e = r.handle,
                e || (e = r.handle = hl(n, f)),
                r = 0 <= t.indexOf(" ") ? t.split(" ") : [t],
                s = r.length,
                o = function(t, r, u) {
                    var o = f[t];
                    o || (o = f[t] = [],
                    o.specialHandlerWrapper = r,
                    "$destroy" === t || u || n.addEventListener(t, e, !1));
                    o.push(i)
                }
                ; s--; )
                    t = r[s],
                    gu[t] ? (o(gu[t], ll),
                    o(t, void 0, !0)) : o(t)
        },
        off: eo,
        one: function(n, t, i) {
            n = e(n);
            n.on(t, function r() {
                n.off(t, i);
                n.off(t, r)
            });
            n.on(t, i)
        },
        replaceWith: function(n, i) {
            var r, u = n.parentNode;
            uu(n);
            t(new b(i), function(t) {
                r ? u.insertBefore(t, r.nextSibling) : u.replaceChild(t, n);
                r = t
            })
        },
        children: function(n) {
            var i = [];
            return t(n.childNodes, function(n) {
                1 === n.nodeType && i.push(n)
            }),
            i
        },
        contents: function(n) {
            return n.contentDocument || n.childNodes || []
        },
        append: function(n, t) {
            var i = n.nodeType, r;
            if (1 === i || 11 === i)
                for (t = new b(t),
                i = 0,
                r = t.length; i < r; i++)
                    n.appendChild(t[i])
        },
        prepend: function(n, i) {
            if (1 === n.nodeType) {
                var r = n.firstChild;
                t(new b(i), function(t) {
                    n.insertBefore(t, r)
                })
            }
        },
        wrap: function(n, t) {
            fo(n, e(t).eq(0).clone()[0])
        },
        remove: cu,
        detach: function(n) {
            cu(n, !0)
        },
        after: function(n, t) {
            var u = n, e = n.parentNode, i, f, r;
            for (t = new b(t),
            i = 0,
            f = t.length; i < f; i++)
                r = t[i],
                e.insertBefore(r, u.nextSibling),
                u = r
        },
        addClass: su,
        removeClass: ou,
        toggleClass: function(n, i, u) {
            i && t(i.split(" "), function(t) {
                var i = u;
                r(i) && (i = !eu(n, t));
                (i ? su : ou)(n, t)
            })
        },
        parent: function(n) {
            return (n = n.parentNode) && 11 !== n.nodeType ? n : null
        },
        next: function(n) {
            return n.nextElementSibling
        },
        find: function(n, t) {
            return n.getElementsByTagName ? n.getElementsByTagName(t) : []
        },
        clone: af,
        triggerHandler: function(n, i, r) {
            var u, e, s = i.type || i, f = fu(n);
            (f = (f = f && f.events) && f[s]) && (u = {
                preventDefault: function() {
                    this.defaultPrevented = !0
                },
                isDefaultPrevented: function() {
                    return !0 === this.defaultPrevented
                },
                stopImmediatePropagation: function() {
                    this.immediatePropagationStopped = !0
                },
                isImmediatePropagationStopped: function() {
                    return !0 === this.immediatePropagationStopped
                },
                stopPropagation: o,
                type: s,
                target: n
            },
            i.type && (u = a(u, i)),
            i = st(f),
            e = r ? [u].concat(r) : [u],
            t(i, function(t) {
                u.isImmediatePropagationStopped() || t.apply(n, e)
            }))
        }
    }, function(n, t) {
        b.prototype[t] = function(t, i, f) {
            for (var o, s = 0, h = this.length; s < h; s++)
                r(o) ? (o = n(this[s], t, i, f),
                u(o) && (o = e(o))) : oo(o, n(this[s], t, i, f));
            return u(o) ? o : this
        }
        ;
        b.prototype.bind = b.prototype.on;
        b.prototype.unbind = b.prototype.off
    });
    pi.prototype = {
        put: function(n, t) {
            this[fi(n, this.nextUid)] = t
        },
        get: function(n) {
            return this[fi(n, this.nextUid)]
        },
        remove: function(n) {
            var t = this[n = fi(n, this.nextUid)];
            return delete this[n],
            t
        }
    };
    var ey = [function() {
        this.$get = [function() {
            return pi
        }
        ]
    }
    ]
      , oy = /^([^\(]+?)=>/
      , sy = /^[^\(]*\(\s*([^\)]*)\)/m
      , hy = /,/
      , cy = /^\s*(_?)(\S+?)\1\s*$/
      , ly = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
      , li = l("$injector");
    ar.$$annotate = function(n, i, r) {
        var u;
        if ("function" == typeof n) {
            if (!(u = n.$inject)) {
                if (u = [],
                n.length) {
                    if (i)
                        throw h(r) && r || (r = n.name || vl(n)),
                        li("strictdi", r);
                    i = lo(n);
                    t(i[1].split(hy), function(n) {
                        n.replace(cy, function(n, t, i) {
                            u.push(i)
                        })
                    })
                }
                n.$inject = u
            }
        } else
            c(n) ? (i = n.length - 1,
            vi(n[i], "fn"),
            u = n.slice(0, i)) : vi(n, "fn", !0);
        return u
    }
    ;
    var lh = l("$animate")
      , ay = function() {
        this.$get = o
    }
      , vy = function() {
        var n = new pi
          , i = [];
        this.$get = ["$$AnimateRunner", "$rootScope", function(r, u) {
            function f(n, i, r) {
                var u = !1;
                return i && (i = h(i) ? i.split(" ") : c(i) ? i : [],
                t(i, function(t) {
                    t && (u = !0,
                    n[t] = r)
                })),
                u
            }
            function e() {
                t(i, function(i) {
                    var f = n.get(i);
                    if (f) {
                        var e = pl(i.attr("class"))
                          , r = ""
                          , u = "";
                        t(f, function(n, t) {
                            n !== !!e[t] && (n ? r += (r.length ? " " : "") + t : u += (u.length ? " " : "") + t)
                        });
                        t(i, function(n) {
                            r && su(n, r);
                            u && ou(n, u)
                        });
                        n.remove(i)
                    }
                });
                i.length = 0
            }
            return {
                enabled: o,
                on: o,
                off: o,
                pin: o,
                push: function(t, o, s, h) {
                    return h && h(),
                    s = s || {},
                    s.from && t.css(s.from),
                    s.to && t.css(s.to),
                    (s.addClass || s.removeClass) && (o = s.addClass,
                    h = s.removeClass,
                    s = n.get(t) || {},
                    o = f(s, o, !0),
                    h = f(s, h, !1),
                    o || h) && (n.put(t, s),
                    i.push(t),
                    1 === i.length && u.$$postDigest(e)),
                    t = new r,
                    t.complete(),
                    t
                }
            }
        }
        ]
    }
      , yy = ["$provide", function(n) {
        var t = this;
        this.$$registeredAnimations = Object.create(null);
        this.register = function(i, r) {
            if (i && "." !== i.charAt(0))
                throw lh("notcsel", i);
            var u = i + "-animation";
            t.$$registeredAnimations[i.substr(1)] = u;
            n.factory(u, r)
        }
        ;
        this.classNameFilter = function(n) {
            if (1 === arguments.length && (this.$$classNameFilter = n instanceof RegExp ? n : null) && /(\s+|\/)ng-animate(\s+|\/)/.test(this.$$classNameFilter.toString()))
                throw lh("nongcls", "ng-animate");
            return this.$$classNameFilter
        }
        ;
        this.$get = ["$$animateQueue", function(n) {
            function t(n, t, i) {
                var r, u;
                if (i) {
                    n: {
                        for (r = 0; r < i.length; r++)
                            if (u = i[r],
                            1 === u.nodeType) {
                                r = u;
                                break n
                            }
                        r = void 0
                    }
                    !r || r.parentNode || r.previousElementSibling || (i = null)
                }
                i ? i.after(n) : t.prepend(n)
            }
            return {
                on: n.on,
                off: n.off,
                pin: n.pin,
                enabled: n.enabled,
                cancel: function(n) {
                    n.end && n.end()
                },
                enter: function(i, r, u, f) {
                    return r = r && e(r),
                    u = u && e(u),
                    r = r || u.parent(),
                    t(i, r, u),
                    n.push(i, "enter", ei(f))
                },
                move: function(i, r, u, f) {
                    return r = r && e(r),
                    u = u && e(u),
                    r = r || u.parent(),
                    t(i, r, u),
                    n.push(i, "move", ei(f))
                },
                leave: function(t, i) {
                    return n.push(t, "leave", ei(i), function() {
                        t.remove()
                    })
                },
                addClass: function(t, i, r) {
                    return r = ei(r),
                    r.addClass = vr(r.addclass, i),
                    n.push(t, "addClass", r)
                },
                removeClass: function(t, i, r) {
                    return r = ei(r),
                    r.removeClass = vr(r.removeClass, i),
                    n.push(t, "removeClass", r)
                },
                setClass: function(t, i, r, u) {
                    return u = ei(u),
                    u.addClass = vr(u.addClass, i),
                    u.removeClass = vr(u.removeClass, r),
                    n.push(t, "setClass", u)
                },
                animate: function(t, i, r, u, f) {
                    return f = ei(f),
                    f.from = f.from ? a(f.from, i) : i,
                    f.to = f.to ? a(f.to, r) : r,
                    f.tempClasses = vr(f.tempClasses, u || "ng-inline-animate"),
                    n.push(t, "animate", f)
                }
            }
        }
        ]
    }
    ]
      , py = function() {
        this.$get = ["$$rAF", function(n) {
            function i(i) {
                t.push(i);
                1 < t.length || n(function() {
                    for (var n = 0; n < t.length; n++)
                        t[n]();
                    t = []
                })
            }
            var t = [];
            return function() {
                var n = !1;
                return i(function() {
                    n = !0
                }),
                function(t) {
                    n ? t() : i(t)
                }
            }
        }
        ]
    }
      , wy = function() {
        this.$get = ["$q", "$sniffer", "$$animateAsyncRun", "$document", "$timeout", function(n, i, r, u, f) {
            function e(n) {
                this.setHost(n);
                var t = r();
                this._doneCallbacks = [];
                this._tick = function(n) {
                    var i = u[0];
                    i && i.hidden ? f(n, 0, !1) : t(n)
                }
                ;
                this._state = 0
            }
            return e.chain = function(n, t) {
                function r() {
                    i === n.length ? t(!0) : n[i](function(n) {
                        !1 === n ? t(!1) : (i++,
                        r())
                    })
                }
                var i = 0;
                r()
            }
            ,
            e.all = function(n, i) {
                function u(t) {
                    r = r && t;
                    ++f === n.length && i(r)
                }
                var f = 0
                  , r = !0;
                t(n, function(n) {
                    n.done(u)
                })
            }
            ,
            e.prototype = {
                setHost: function(n) {
                    this.host = n || {}
                },
                done: function(n) {
                    2 === this._state ? n() : this._doneCallbacks.push(n)
                },
                progress: o,
                getPromise: function() {
                    if (!this.promise) {
                        var t = this;
                        this.promise = n(function(n, i) {
                            t.done(function(t) {
                                !1 === t ? i() : n()
                            })
                        })
                    }
                    return this.promise
                },
                then: function(n, t) {
                    return this.getPromise().then(n, t)
                },
                "catch": function(n) {
                    return this.getPromise()["catch"](n)
                },
                "finally": function(n) {
                    return this.getPromise()["finally"](n)
                },
                pause: function() {
                    this.host.pause && this.host.pause()
                },
                resume: function() {
                    this.host.resume && this.host.resume()
                },
                end: function() {
                    this.host.end && this.host.end();
                    this._resolve(!0)
                },
                cancel: function() {
                    this.host.cancel && this.host.cancel();
                    this._resolve(!1)
                },
                complete: function(n) {
                    var t = this;
                    0 === t._state && (t._state = 1,
                    t._tick(function() {
                        t._resolve(n)
                    }))
                },
                _resolve: function(n) {
                    2 !== this._state && (t(this._doneCallbacks, function(t) {
                        t(n)
                    }),
                    this._doneCallbacks.length = 0,
                    this._state = 2)
                }
            },
            e
        }
        ]
    }
      , by = function() {
        this.$get = ["$$rAF", "$q", "$$AnimateRunner", function(n, t, i) {
            return function(t, r) {
                function e() {
                    return n(function() {
                        u.addClass && (t.addClass(u.addClass),
                        u.addClass = null);
                        u.removeClass && (t.removeClass(u.removeClass),
                        u.removeClass = null);
                        u.to && (t.css(u.to),
                        u.to = null);
                        o || f.complete();
                        o = !0
                    }),
                    f
                }
                var u = r || {}, o, f;
                return u.$$prepared || (u = dt(u)),
                u.cleanupStyles && (u.from = u.to = null),
                u.from && (t.css(u.from),
                u.from = null),
                f = new i,
                {
                    start: e,
                    end: e
                }
            }
        }
        ]
    }
      , g = l("$compile")
      , he = new function() {}
    ;
    ao.$inject = ["$provide", "$$sanitizeUriProvider"];
    lu.prototype.isFirstChange = function() {
        return this.previousValue === he
    }
    ;
    var ah = /^((?:x|data)[\:\-_])/i
      , ky = l("$controller")
      , vh = /^(\S+)(\s+as\s+([\w$]+))?$/
      , dy = function() {
        this.$get = ["$document", function(n) {
            return function(t) {
                return t ? !t.nodeType && t instanceof e && (t = t[0]) : t = n[0].body,
                t.offsetWidth + 1
            }
        }
        ]
    }
      , yh = "application/json"
      , ce = {
        "Content-Type": yh + ";charset=utf-8"
    }
      , gy = /^\[|^\{(?!\{)/
      , np = {
        "[": /]$/,
        "{": /}$/
    }
      , tp = /^\)\]\}',?\n/
      , ip = l("$http")
      , ph = function(n) {
        return function() {
            throw ip("legacy", n);
        }
    }
      , ai = ut.$interpolateMinErr = l("$interpolate");
    ai.throwNoconcat = function(n) {
        throw ai("noconcat", n);
    }
    ;
    ai.interr = function(n, t) {
        return ai("interr", n, t.toString())
    }
    ;
    var rp = function() {
        this.$get = ["$window", function(n) {
            function r(n) {
                var t = function(n) {
                    t.data = n;
                    t.called = !0
                };
                return t.id = n,
                t
            }
            var i = n.angular.callbacks
              , t = {};
            return {
                createCallback: function(n) {
                    n = "_" + (i.$$counter++).toString(36);
                    var u = "angular.callbacks." + n
                      , f = r(n);
                    return t[u] = i[n] = f,
                    u
                },
                wasCalled: function(n) {
                    return t[n].called
                },
                getResponse: function(n) {
                    return t[n].data
                },
                removeCallback: function(n) {
                    delete i[t[n].id];
                    delete t[n]
                }
            }
        }
        ]
    }
      , up = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/
      , fp = {
        http: 80,
        https: 443,
        ftp: 21
    }
      , tf = l("$location")
      , ep = {
        $$absUrl: "",
        $$html5: !1,
        $$replace: !1,
        absUrl: au("$$absUrl"),
        url: function(n) {
            if (r(n))
                return this.$$url;
            var t = up.exec(n);
            return (t[1] || "" === n) && this.path(decodeURIComponent(t[1])),
            (t[2] || t[1] || "" === n) && this.search(t[3] || ""),
            this.hash(t[5] || ""),
            this
        },
        protocol: au("$$protocol"),
        host: au("$$host"),
        port: au("$$port"),
        path: is("$$path", function(n) {
            return n = null !== n ? n.toString() : "",
            "/" == n.charAt(0) ? n : "/" + n
        }),
        search: function(n, i) {
            switch (arguments.length) {
            case 0:
                return this.$$search;
            case 1:
                if (h(n) || w(n))
                    n = n.toString(),
                    this.$$search = ge(n);
                else if (s(n))
                    n = dt(n, {}),
                    t(n, function(t, i) {
                        null == t && delete n[i]
                    }),
                    this.$$search = n;
                else
                    throw tf("isrcharg");
                break;
            default:
                r(i) || null === i ? delete this.$$search[n] : this.$$search[n] = i
            }
            return this.$$compose(),
            this
        },
        hash: is("$$hash", function(n) {
            return null !== n ? n.toString() : ""
        }),
        replace: function() {
            return this.$$replace = !0,
            this
        }
    };
    t([ts, kf, bf], function(n) {
        n.prototype = Object.create(ep);
        n.prototype.state = function(t) {
            if (!arguments.length)
                return this.$$state;
            if (n !== bf || !this.$$html5)
                throw tf("nostate");
            return this.$$state = r(t) ? null : t,
            this
        }
    });
    var it = l("$parse")
      , op = Function.prototype.call
      , sp = Function.prototype.apply
      , hp = Function.prototype.bind
      , rf = y();
    t("+ - * / % === !== == != < > <= >= && || ! = |".split(" "), function(n) {
        rf[n] = !0
    });
    wh = {
        n: "\n",
        f: "\f",
        r: "\r",
        t: "\t",
        v: "\v",
        "'": "'",
        '"': '"'
    };
    uf = function(n) {
        this.options = n
    }
    ;
    uf.prototype = {
        constructor: uf,
        lex: function(n) {
            for (this.text = n,
            this.index = 0,
            this.tokens = []; this.index < this.text.length; )
                if (n = this.text.charAt(this.index),
                '"' === n || "'" === n)
                    this.readString(n);
                else if (this.isNumber(n) || "." === n && this.isNumber(this.peek()))
                    this.readNumber();
                else if (this.isIdentifierStart(this.peekMultichar()))
                    this.readIdent();
                else if (this.is(n, "(){}[].,;:?"))
                    this.tokens.push({
                        index: this.index,
                        text: n
                    }),
                    this.index++;
                else if (this.isWhitespace(n))
                    this.index++;
                else {
                    var t = n + this.peek()
                      , i = t + this.peek(2)
                      , r = rf[t]
                      , u = rf[i];
                    rf[n] || r || u ? (n = u ? i : r ? t : n,
                    this.tokens.push({
                        index: this.index,
                        text: n,
                        operator: !0
                    }),
                    this.index += n.length) : this.throwError("Unexpected next character ", this.index, this.index + 1)
                }
            return this.tokens
        },
        is: function(n, t) {
            return -1 !== t.indexOf(n)
        },
        peek: function(n) {
            return n = n || 1,
            this.index + n < this.text.length ? this.text.charAt(this.index + n) : !1
        },
        isNumber: function(n) {
            return "0" <= n && "9" >= n && "string" == typeof n
        },
        isWhitespace: function(n) {
            return " " === n || "\r" === n || "\t" === n || "\n" === n || "\v" === n || " " === n
        },
        isIdentifierStart: function(n) {
            return this.options.isIdentifierStart ? this.options.isIdentifierStart(n, this.codePointAt(n)) : this.isValidIdentifierStart(n)
        },
        isValidIdentifierStart: function(n) {
            return "a" <= n && "z" >= n || "A" <= n && "Z" >= n || "_" === n || "$" === n
        },
        isIdentifierContinue: function(n) {
            return this.options.isIdentifierContinue ? this.options.isIdentifierContinue(n, this.codePointAt(n)) : this.isValidIdentifierContinue(n)
        },
        isValidIdentifierContinue: function(n, t) {
            return this.isValidIdentifierStart(n, t) || this.isNumber(n)
        },
        codePointAt: function(n) {
            return 1 === n.length ? n.charCodeAt(0) : (n.charCodeAt(0) << 10) + n.charCodeAt(1) - 56613888
        },
        peekMultichar: function() {
            var n = this.text.charAt(this.index), t = this.peek(), i, r;
            return t ? (i = n.charCodeAt(0),
            r = t.charCodeAt(0),
            55296 <= i && 56319 >= i && 56320 <= r && 57343 >= r ? n + t : n) : n
        },
        isExpOperator: function(n) {
            return "-" === n || "+" === n || this.isNumber(n)
        },
        throwError: function(n, t, i) {
            i = i || this.index;
            t = u(t) ? "s " + t + "-" + this.index + " [" + this.text.substring(t, i) + "]" : " " + i;
            throw it("lexerr", n, t, this.text);
        },
        readNumber: function() {
            for (var t, i, n = "", r = this.index; this.index < this.text.length; ) {
                if (t = v(this.text.charAt(this.index)),
                "." == t || this.isNumber(t))
                    n += t;
                else if (i = this.peek(),
                "e" == t && this.isExpOperator(i))
                    n += t;
                else if (this.isExpOperator(t) && i && this.isNumber(i) && "e" == n.charAt(n.length - 1))
                    n += t;
                else if (!this.isExpOperator(t) || i && this.isNumber(i) || "e" != n.charAt(n.length - 1))
                    break;
                else
                    this.throwError("Invalid exponent");
                this.index++
            }
            this.tokens.push({
                index: r,
                text: n,
                constant: !0,
                value: Number(n)
            })
        },
        readIdent: function() {
            var t = this.index, n;
            for (this.index += this.peekMultichar().length; this.index < this.text.length; ) {
                if (n = this.peekMultichar(),
                !this.isIdentifierContinue(n))
                    break;
                this.index += n.length
            }
            this.tokens.push({
                index: t,
                text: this.text.slice(t, this.index),
                identifier: !0
            })
        },
        readString: function(n) {
            var f = this.index, t, u;
            this.index++;
            for (var r = "", u = n, i = !1; this.index < this.text.length; ) {
                if (t = this.text.charAt(this.index),
                u = u + t,
                i)
                    "u" === t ? (i = this.text.substring(this.index + 1, this.index + 5),
                    i.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + i + "]"),
                    this.index += 4,
                    r += String.fromCharCode(parseInt(i, 16))) : r += wh[t] || t,
                    i = !1;
                else if ("\\" === t)
                    i = !0;
                else {
                    if (t === n) {
                        this.index++;
                        this.tokens.push({
                            index: f,
                            text: u,
                            constant: !0,
                            value: r
                        });
                        return
                    }
                    r += t
                }
                this.index++
            }
            this.throwError("Unterminated quote", f)
        }
    };
    i = function(n, t) {
        this.lexer = n;
        this.options = t
    }
    ;
    i.Program = "Program";
    i.ExpressionStatement = "ExpressionStatement";
    i.AssignmentExpression = "AssignmentExpression";
    i.ConditionalExpression = "ConditionalExpression";
    i.LogicalExpression = "LogicalExpression";
    i.BinaryExpression = "BinaryExpression";
    i.UnaryExpression = "UnaryExpression";
    i.CallExpression = "CallExpression";
    i.MemberExpression = "MemberExpression";
    i.Identifier = "Identifier";
    i.Literal = "Literal";
    i.ArrayExpression = "ArrayExpression";
    i.Property = "Property";
    i.ObjectExpression = "ObjectExpression";
    i.ThisExpression = "ThisExpression";
    i.LocalsExpression = "LocalsExpression";
    i.NGValueParameter = "NGValueParameter";
    i.prototype = {
        ast: function(n) {
            return this.text = n,
            this.tokens = this.lexer.lex(n),
            n = this.program(),
            0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]),
            n
        },
        program: function() {
            for (var n = []; ; )
                if (0 < this.tokens.length && !this.peek("}", ")", ";", "]") && n.push(this.expressionStatement()),
                !this.expect(";"))
                    return {
                        type: i.Program,
                        body: n
                    }
        },
        expressionStatement: function() {
            return {
                type: i.ExpressionStatement,
                expression: this.filterChain()
            }
        },
        filterChain: function() {
            for (var n = this.expression(); this.expect("|"); )
                n = this.filter(n);
            return n
        },
        expression: function() {
            return this.assignment()
        },
        assignment: function() {
            var n = this.ternary();
            return this.expect("=") && (n = {
                type: i.AssignmentExpression,
                left: n,
                right: this.assignment(),
                operator: "="
            }),
            n
        },
        ternary: function() {
            var n = this.logicalOR(), t, r;
            return this.expect("?") && (t = this.expression(),
            this.consume(":")) ? (r = this.expression(),
            {
                type: i.ConditionalExpression,
                test: n,
                alternate: t,
                consequent: r
            }) : n
        },
        logicalOR: function() {
            for (var n = this.logicalAND(); this.expect("||"); )
                n = {
                    type: i.LogicalExpression,
                    operator: "||",
                    left: n,
                    right: this.logicalAND()
                };
            return n
        },
        logicalAND: function() {
            for (var n = this.equality(); this.expect("&&"); )
                n = {
                    type: i.LogicalExpression,
                    operator: "&&",
                    left: n,
                    right: this.equality()
                };
            return n
        },
        equality: function() {
            for (var n = this.relational(), t; t = this.expect("==", "!=", "===", "!=="); )
                n = {
                    type: i.BinaryExpression,
                    operator: t.text,
                    left: n,
                    right: this.relational()
                };
            return n
        },
        relational: function() {
            for (var n = this.additive(), t; t = this.expect("<", ">", "<=", ">="); )
                n = {
                    type: i.BinaryExpression,
                    operator: t.text,
                    left: n,
                    right: this.additive()
                };
            return n
        },
        additive: function() {
            for (var n = this.multiplicative(), t; t = this.expect("+", "-"); )
                n = {
                    type: i.BinaryExpression,
                    operator: t.text,
                    left: n,
                    right: this.multiplicative()
                };
            return n
        },
        multiplicative: function() {
            for (var n = this.unary(), t; t = this.expect("*", "/", "%"); )
                n = {
                    type: i.BinaryExpression,
                    operator: t.text,
                    left: n,
                    right: this.unary()
                };
            return n
        },
        unary: function() {
            var n;
            return (n = this.expect("+", "-", "!")) ? {
                type: i.UnaryExpression,
                operator: n.text,
                prefix: !0,
                argument: this.unary()
            } : this.primary()
        },
        primary: function() {
            var n, t;
            for (this.expect("(") ? (n = this.filterChain(),
            this.consume(")")) : this.expect("[") ? n = this.arrayDeclaration() : this.expect("{") ? n = this.object() : this.selfReferential.hasOwnProperty(this.peek().text) ? n = dt(this.selfReferential[this.consume().text]) : this.options.literals.hasOwnProperty(this.peek().text) ? n = {
                type: i.Literal,
                value: this.options.literals[this.consume().text]
            } : this.peek().identifier ? n = this.identifier() : this.peek().constant ? n = this.constant() : this.throwError("not a primary expression", this.peek()); t = this.expect("(", "[", "."); )
                "(" === t.text ? (n = {
                    type: i.CallExpression,
                    callee: n,
                    arguments: this.parseArguments()
                },
                this.consume(")")) : "[" === t.text ? (n = {
                    type: i.MemberExpression,
                    object: n,
                    property: this.expression(),
                    computed: !0
                },
                this.consume("]")) : "." === t.text ? n = {
                    type: i.MemberExpression,
                    object: n,
                    property: this.identifier(),
                    computed: !1
                } : this.throwError("IMPOSSIBLE");
            return n
        },
        filter: function(n) {
            n = [n];
            for (var t = {
                type: i.CallExpression,
                callee: this.identifier(),
                arguments: n,
                filter: !0
            }; this.expect(":"); )
                n.push(this.expression());
            return t
        },
        parseArguments: function() {
            var n = [];
            if (")" !== this.peekToken().text)
                do
                    n.push(this.filterChain());
                while (this.expect(","));
            return n
        },
        identifier: function() {
            var n = this.consume();
            return n.identifier || this.throwError("is not a valid identifier", n),
            {
                type: i.Identifier,
                name: n.text
            }
        },
        constant: function() {
            return {
                type: i.Literal,
                value: this.consume().value
            }
        },
        arrayDeclaration: function() {
            var n = [];
            if ("]" !== this.peekToken().text)
                do {
                    if (this.peek("]"))
                        break;
                    n.push(this.expression())
                } while (this.expect(","));
            return this.consume("]"),
            {
                type: i.ArrayExpression,
                elements: n
            }
        },
        object: function() {
            var t = [], n;
            if ("}" !== this.peekToken().text)
                do {
                    if (this.peek("}"))
                        break;
                    n = {
                        type: i.Property,
                        kind: "init"
                    };
                    this.peek().constant ? (n.key = this.constant(),
                    n.computed = !1,
                    this.consume(":"),
                    n.value = this.expression()) : this.peek().identifier ? (n.key = this.identifier(),
                    n.computed = !1,
                    this.peek(":") ? (this.consume(":"),
                    n.value = this.expression()) : n.value = n.key) : this.peek("[") ? (this.consume("["),
                    n.key = this.expression(),
                    this.consume("]"),
                    n.computed = !0,
                    this.consume(":"),
                    n.value = this.expression()) : this.throwError("invalid key", this.peek());
                    t.push(n)
                } while (this.expect(","));
            return this.consume("}"),
            {
                type: i.ObjectExpression,
                properties: t
            }
        },
        throwError: function(n, t) {
            throw it("syntax", t.text, n, t.index + 1, this.text, this.text.substring(t.index));
        },
        consume: function(n) {
            if (0 === this.tokens.length)
                throw it("ueoe", this.text);
            var t = this.expect(n);
            return t || this.throwError("is unexpected, expecting [" + n + "]", this.peek()),
            t
        },
        peekToken: function() {
            if (0 === this.tokens.length)
                throw it("ueoe", this.text);
            return this.tokens[0]
        },
        peek: function(n, t, i, r) {
            return this.peekAhead(0, n, t, i, r)
        },
        peekAhead: function(n, t, i, r, u) {
            if (this.tokens.length > n) {
                n = this.tokens[n];
                var f = n.text;
                if (f === t || f === i || f === r || f === u || !(t || i || r || u))
                    return n
            }
            return !1
        },
        expect: function(n, t, i, r) {
            return (n = this.peek(n, t, i, r)) ? (this.tokens.shift(),
            n) : !1
        },
        selfReferential: {
            "this": {
                type: i.ThisExpression
            },
            $locals: {
                type: i.LocalsExpression
            }
        }
    };
    hs.prototype = {
        compile: function(n, i) {
            var u = this, f = this.astBuilder.ast(n), r, e;
            return this.state = {
                nextId: 0,
                filters: {},
                expensiveChecks: i,
                fn: {
                    vars: [],
                    body: [],
                    own: {}
                },
                assign: {
                    vars: [],
                    body: [],
                    own: {}
                },
                inputs: []
            },
            k(f, u.$filter),
            r = "",
            this.stage = "assign",
            (e = os(f)) && (this.state.computing = "assign",
            r = this.nextId(),
            this.recurse(e, r),
            this.return_(r),
            r = "fn.assign=" + this.generateFunction("assign", "s,v,l")),
            e = fs(f.body),
            u.stage = "inputs",
            t(e, function(n, t) {
                var i = "fn" + t, r;
                u.state[i] = {
                    vars: [],
                    body: [],
                    own: {}
                };
                u.state.computing = i;
                r = u.nextId();
                u.recurse(n, r);
                u.return_(r);
                u.state.inputs.push(i);
                n.watchId = t
            }),
            this.state.computing = "fn",
            this.stage = "main",
            this.recurse(f),
            r = '"' + this.USE + " " + this.STRICT + '";\n' + this.filterPrefix() + "var fn=" + this.generateFunction("fn", "s,l,a,i") + r + this.watchFns() + "return fn;",
            r = new Function("$filter","ensureSafeMemberName","ensureSafeObject","ensureSafeFunction","getStringValue","ensureSafeAssignContext","ifDefined","plus","text",r)(this.$filter, wi, gt, rs, aa, vu, va, us, n),
            this.state = this.stage = void 0,
            r.literal = ss(f),
            r.constant = f.constant,
            r
        },
        USE: "use",
        STRICT: "strict",
        watchFns: function() {
            var n = []
              , i = this.state.inputs
              , r = this;
            return t(i, function(t) {
                n.push("var " + t + "=" + r.generateFunction(t, "s"))
            }),
            i.length && n.push("fn.inputs=[" + i.join(",") + "];"),
            n.join("")
        },
        generateFunction: function(n, t) {
            return "function(" + t + "){" + this.varsPrefix(n) + this.body(n) + "};"
        },
        filterPrefix: function() {
            var n = []
              , i = this;
            return t(this.state.filters, function(t, r) {
                n.push(t + "=$filter(" + i.escape(r) + ")")
            }),
            n.length ? "var " + n.join(",") + ";" : ""
        },
        varsPrefix: function(n) {
            return this.state[n].vars.length ? "var " + this.state[n].vars.join(",") + ";" : ""
        },
        body: function(n) {
            return this.state[n].body.join("")
        },
        recurse: function(n, r, f, e, s, h) {
            var l, v, c = this, y, a, p;
            if (e = e || o,
            !h && u(n.watchId))
                r = r || this.nextId(),
                this.if_("i", this.lazyAssign(r, this.computedMember("i", n.watchId)), this.lazyRecurse(n, r, f, e, s, !0));
            else
                switch (n.type) {
                case i.Program:
                    t(n.body, function(t, i) {
                        c.recurse(t.expression, void 0, void 0, function(n) {
                            v = n
                        });
                        i !== n.body.length - 1 ? c.current().body.push(v, ";") : c.return_(v)
                    });
                    break;
                case i.Literal:
                    a = this.escape(n.value);
                    this.assign(r, a);
                    e(a);
                    break;
                case i.UnaryExpression:
                    this.recurse(n.argument, void 0, void 0, function(n) {
                        v = n
                    });
                    a = n.operator + "(" + this.ifDefined(v, 0) + ")";
                    this.assign(r, a);
                    e(a);
                    break;
                case i.BinaryExpression:
                    this.recurse(n.left, void 0, void 0, function(n) {
                        l = n
                    });
                    this.recurse(n.right, void 0, void 0, function(n) {
                        v = n
                    });
                    a = "+" === n.operator ? this.plus(l, v) : "-" === n.operator ? this.ifDefined(l, 0) + n.operator + this.ifDefined(v, 0) : "(" + l + ")" + n.operator + "(" + v + ")";
                    this.assign(r, a);
                    e(a);
                    break;
                case i.LogicalExpression:
                    r = r || this.nextId();
                    c.recurse(n.left, r);
                    c.if_("&&" === n.operator ? r : c.not(r), c.lazyRecurse(n.right, r));
                    e(r);
                    break;
                case i.ConditionalExpression:
                    r = r || this.nextId();
                    c.recurse(n.test, r);
                    c.if_(r, c.lazyRecurse(n.alternate, r), c.lazyRecurse(n.consequent, r));
                    e(r);
                    break;
                case i.Identifier:
                    r = r || this.nextId();
                    f && (f.context = "inputs" === c.stage ? "s" : this.assign(this.nextId(), this.getHasOwnProperty("l", n.name) + "?l:s"),
                    f.computed = !1,
                    f.name = n.name);
                    wi(n.name);
                    c.if_("inputs" === c.stage || c.not(c.getHasOwnProperty("l", n.name)), function() {
                        c.if_("inputs" === c.stage || "s", function() {
                            s && 1 !== s && c.if_(c.not(c.nonComputedMember("s", n.name)), c.lazyAssign(c.nonComputedMember("s", n.name), "{}"));
                            c.assign(r, c.nonComputedMember("s", n.name))
                        })
                    }, r && c.lazyAssign(r, c.nonComputedMember("l", n.name)));
                    (c.state.expensiveChecks || yu(n.name)) && c.addEnsureSafeObject(r);
                    e(r);
                    break;
                case i.MemberExpression:
                    l = f && (f.context = this.nextId()) || this.nextId();
                    r = r || this.nextId();
                    c.recurse(n.object, l, void 0, function() {
                        c.if_(c.notNull(l), function() {
                            s && 1 !== s && c.addEnsureSafeAssignContext(l);
                            n.computed ? (v = c.nextId(),
                            c.recurse(n.property, v),
                            c.getStringValue(v),
                            c.addEnsureSafeMemberName(v),
                            s && 1 !== s && c.if_(c.not(c.computedMember(l, v)), c.lazyAssign(c.computedMember(l, v), "{}")),
                            a = c.ensureSafeObject(c.computedMember(l, v)),
                            c.assign(r, a),
                            f && (f.computed = !0,
                            f.name = v)) : (wi(n.property.name),
                            s && 1 !== s && c.if_(c.not(c.nonComputedMember(l, n.property.name)), c.lazyAssign(c.nonComputedMember(l, n.property.name), "{}")),
                            a = c.nonComputedMember(l, n.property.name),
                            (c.state.expensiveChecks || yu(n.property.name)) && (a = c.ensureSafeObject(a)),
                            c.assign(r, a),
                            f && (f.computed = !1,
                            f.name = n.property.name))
                        }, function() {
                            c.assign(r, "undefined")
                        });
                        e(r)
                    }, !!s);
                    break;
                case i.CallExpression:
                    r = r || this.nextId();
                    n.filter ? (v = c.filter(n.callee.name),
                    y = [],
                    t(n.arguments, function(n) {
                        var t = c.nextId();
                        c.recurse(n, t);
                        y.push(t)
                    }),
                    a = v + "(" + y.join(",") + ")",
                    c.assign(r, a),
                    e(r)) : (v = c.nextId(),
                    l = {},
                    y = [],
                    c.recurse(n.callee, v, l, function() {
                        c.if_(c.notNull(v), function() {
                            c.addEnsureSafeFunction(v);
                            t(n.arguments, function(n) {
                                c.recurse(n, c.nextId(), void 0, function(n) {
                                    y.push(c.ensureSafeObject(n))
                                })
                            });
                            l.name ? (c.state.expensiveChecks || c.addEnsureSafeObject(l.context),
                            a = c.member(l.context, l.name, l.computed) + "(" + y.join(",") + ")") : a = v + "(" + y.join(",") + ")";
                            a = c.ensureSafeObject(a);
                            c.assign(r, a)
                        }, function() {
                            c.assign(r, "undefined")
                        });
                        e(r)
                    }));
                    break;
                case i.AssignmentExpression:
                    if (v = this.nextId(),
                    l = {},
                    !es(n.left))
                        throw it("lval");
                    this.recurse(n.left, void 0, l, function() {
                        c.if_(c.notNull(l.context), function() {
                            c.recurse(n.right, v);
                            c.addEnsureSafeObject(c.member(l.context, l.name, l.computed));
                            c.addEnsureSafeAssignContext(l.context);
                            a = c.member(l.context, l.name, l.computed) + n.operator + v;
                            c.assign(r, a);
                            e(r || a)
                        })
                    }, 1);
                    break;
                case i.ArrayExpression:
                    y = [];
                    t(n.elements, function(n) {
                        c.recurse(n, c.nextId(), void 0, function(n) {
                            y.push(n)
                        })
                    });
                    a = "[" + y.join(",") + "]";
                    this.assign(r, a);
                    e(a);
                    break;
                case i.ObjectExpression:
                    y = [];
                    p = !1;
                    t(n.properties, function(n) {
                        n.computed && (p = !0)
                    });
                    p ? (r = r || this.nextId(),
                    this.assign(r, "{}"),
                    t(n.properties, function(n) {
                        n.computed ? (l = c.nextId(),
                        c.recurse(n.key, l)) : l = n.key.type === i.Identifier ? n.key.name : "" + n.key.value;
                        v = c.nextId();
                        c.recurse(n.value, v);
                        c.assign(c.member(r, l, n.computed), v)
                    })) : (t(n.properties, function(t) {
                        c.recurse(t.value, n.constant ? void 0 : c.nextId(), void 0, function(n) {
                            y.push(c.escape(t.key.type === i.Identifier ? t.key.name : "" + t.key.value) + ":" + n)
                        })
                    }),
                    a = "{" + y.join(",") + "}",
                    this.assign(r, a));
                    e(r || a);
                    break;
                case i.ThisExpression:
                    this.assign(r, "s");
                    e("s");
                    break;
                case i.LocalsExpression:
                    this.assign(r, "l");
                    e("l");
                    break;
                case i.NGValueParameter:
                    this.assign(r, "v");
                    e("v")
                }
        },
        getHasOwnProperty: function(n, t) {
            var i = n + "." + t
              , r = this.current().own;
            return r.hasOwnProperty(i) || (r[i] = this.nextId(!1, n + "&&(" + this.escape(t) + " in " + n + ")")),
            r[i]
        },
        assign: function(n, t) {
            if (n)
                return this.current().body.push(n, "=", t, ";"),
                n
        },
        filter: function(n) {
            return this.state.filters.hasOwnProperty(n) || (this.state.filters[n] = this.nextId(!0)),
            this.state.filters[n]
        },
        ifDefined: function(n, t) {
            return "ifDefined(" + n + "," + this.escape(t) + ")"
        },
        plus: function(n, t) {
            return "plus(" + n + "," + t + ")"
        },
        return_: function(n) {
            this.current().body.push("return ", n, ";")
        },
        if_: function(n, t, i) {
            if (!0 === n)
                t();
            else {
                var r = this.current().body;
                r.push("if(", n, "){");
                t();
                r.push("}");
                i && (r.push("else{"),
                i(),
                r.push("}"))
            }
        },
        not: function(n) {
            return "!(" + n + ")"
        },
        notNull: function(n) {
            return n + "!=null"
        },
        nonComputedMember: function(n, t) {
            return /[$_a-zA-Z][$_a-zA-Z0-9]*/.test(t) ? n + "." + t : n + '["' + t.replace(/[^$_a-zA-Z0-9]/g, this.stringEscapeFn) + '"]'
        },
        computedMember: function(n, t) {
            return n + "[" + t + "]"
        },
        member: function(n, t, i) {
            return i ? this.computedMember(n, t) : this.nonComputedMember(n, t)
        },
        addEnsureSafeObject: function(n) {
            this.current().body.push(this.ensureSafeObject(n), ";")
        },
        addEnsureSafeMemberName: function(n) {
            this.current().body.push(this.ensureSafeMemberName(n), ";")
        },
        addEnsureSafeFunction: function(n) {
            this.current().body.push(this.ensureSafeFunction(n), ";")
        },
        addEnsureSafeAssignContext: function(n) {
            this.current().body.push(this.ensureSafeAssignContext(n), ";")
        },
        ensureSafeObject: function(n) {
            return "ensureSafeObject(" + n + ",text)"
        },
        ensureSafeMemberName: function(n) {
            return "ensureSafeMemberName(" + n + ",text)"
        },
        ensureSafeFunction: function(n) {
            return "ensureSafeFunction(" + n + ",text)"
        },
        getStringValue: function(n) {
            this.assign(n, "getStringValue(" + n + ")")
        },
        ensureSafeAssignContext: function(n) {
            return "ensureSafeAssignContext(" + n + ",text)"
        },
        lazyRecurse: function(n, t, i, r, u, f) {
            var e = this;
            return function() {
                e.recurse(n, t, i, r, u, f)
            }
        },
        lazyAssign: function(n, t) {
            var i = this;
            return function() {
                i.assign(n, t)
            }
        },
        stringEscapeRegex: /[^ a-zA-Z0-9]/g,
        stringEscapeFn: function(n) {
            return "\\u" + ("0000" + n.charCodeAt(0).toString(16)).slice(-4)
        },
        escape: function(n) {
            if (h(n))
                return "'" + n.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'";
            if (w(n))
                return n.toString();
            if (!0 === n)
                return "true";
            if (!1 === n)
                return "false";
            if (null === n)
                return "null";
            if ("undefined" == typeof n)
                return "undefined";
            throw it("esc");
        },
        nextId: function(n, t) {
            var i = "v" + this.state.nextId++;
            return n || this.current().vars.push(i + (t ? "=" + t : "")),
            i
        },
        current: function() {
            return this.state[this.state.computing]
        }
    };
    cs.prototype = {
        compile: function(n, i) {
            var s = this, u = this.astBuilder.ast(n), r, h, f, e;
            return this.expression = n,
            this.expensiveChecks = i,
            k(u, s.$filter),
            (r = os(u)) && (h = this.recurse(r)),
            r = fs(u.body),
            r && (f = [],
            t(r, function(n, t) {
                var i = s.recurse(n);
                n.input = i;
                f.push(i);
                n.watchId = t
            })),
            e = [],
            t(u.body, function(n) {
                e.push(s.recurse(n.expression))
            }),
            r = 0 === u.body.length ? o : 1 === u.body.length ? e[0] : function(n, i) {
                var r;
                return t(e, function(t) {
                    r = t(n, i)
                }),
                r
            }
            ,
            h && (r.assign = function(n, t, i) {
                return h(n, i, t)
            }
            ),
            f && (r.inputs = f),
            r.literal = ss(u),
            r.constant = u.constant,
            r
        },
        recurse: function(n, r, u) {
            var s, o, e = this, f;
            if (n.input)
                return this.inputs(n.input, n.watchId);
            switch (n.type) {
            case i.Literal:
                return this.value(n.value, r);
            case i.UnaryExpression:
                return o = this.recurse(n.argument),
                this["unary" + n.operator](o, r);
            case i.BinaryExpression:
                return s = this.recurse(n.left),
                o = this.recurse(n.right),
                this["binary" + n.operator](s, o, r);
            case i.LogicalExpression:
                return s = this.recurse(n.left),
                o = this.recurse(n.right),
                this["binary" + n.operator](s, o, r);
            case i.ConditionalExpression:
                return this["ternary?:"](this.recurse(n.test), this.recurse(n.alternate), this.recurse(n.consequent), r);
            case i.Identifier:
                return wi(n.name, e.expression),
                e.identifier(n.name, e.expensiveChecks || yu(n.name), r, u, e.expression);
            case i.MemberExpression:
                return s = this.recurse(n.object, !1, !!u),
                n.computed || (wi(n.property.name, e.expression),
                o = n.property.name),
                n.computed && (o = this.recurse(n.property)),
                n.computed ? this.computedMember(s, o, r, u, e.expression) : this.nonComputedMember(s, o, e.expensiveChecks, r, u, e.expression);
            case i.CallExpression:
                return f = [],
                t(n.arguments, function(n) {
                    f.push(e.recurse(n))
                }),
                n.filter && (o = this.$filter(n.callee.name)),
                n.filter || (o = this.recurse(n.callee, !0)),
                n.filter ? function(n, t, i, u) {
                    for (var s = [], e = 0; e < f.length; ++e)
                        s.push(f[e](n, t, i, u));
                    return n = o.apply(void 0, s, u),
                    r ? {
                        context: void 0,
                        name: void 0,
                        value: n
                    } : n
                }
                : function(n, t, i, u) {
                    var h = o(n, t, i, u), s, c;
                    if (null != h.value) {
                        for (gt(h.context, e.expression),
                        rs(h.value, e.expression),
                        s = [],
                        c = 0; c < f.length; ++c)
                            s.push(gt(f[c](n, t, i, u), e.expression));
                        s = gt(h.value.apply(h.context, s), e.expression)
                    }
                    return r ? {
                        value: s
                    } : s
                }
                ;
            case i.AssignmentExpression:
                return s = this.recurse(n.left, !0, 1),
                o = this.recurse(n.right),
                function(n, t, i, u) {
                    var f = s(n, t, i, u);
                    return n = o(n, t, i, u),
                    gt(f.value, e.expression),
                    vu(f.context),
                    f.context[f.name] = n,
                    r ? {
                        value: n
                    } : n
                }
                ;
            case i.ArrayExpression:
                return f = [],
                t(n.elements, function(n) {
                    f.push(e.recurse(n))
                }),
                function(n, t, i, u) {
                    for (var e = [], o = 0; o < f.length; ++o)
                        e.push(f[o](n, t, i, u));
                    return r ? {
                        value: e
                    } : e
                }
                ;
            case i.ObjectExpression:
                return f = [],
                t(n.properties, function(n) {
                    n.computed ? f.push({
                        key: e.recurse(n.key),
                        computed: !0,
                        value: e.recurse(n.value)
                    }) : f.push({
                        key: n.key.type === i.Identifier ? n.key.name : "" + n.key.value,
                        computed: !1,
                        value: e.recurse(n.value)
                    })
                }),
                function(n, t, i, u) {
                    for (var o = {}, e = 0; e < f.length; ++e)
                        f[e].computed ? o[f[e].key(n, t, i, u)] = f[e].value(n, t, i, u) : o[f[e].key] = f[e].value(n, t, i, u);
                    return r ? {
                        value: o
                    } : o
                }
                ;
            case i.ThisExpression:
                return function(n) {
                    return r ? {
                        value: n
                    } : n
                }
                ;
            case i.LocalsExpression:
                return function(n, t) {
                    return r ? {
                        value: t
                    } : t
                }
                ;
            case i.NGValueParameter:
                return function(n, t, i) {
                    return r ? {
                        value: i
                    } : i
                }
            }
        },
        "unary+": function(n, t) {
            return function(i, r, f, e) {
                return i = n(i, r, f, e),
                i = u(i) ? +i : 0,
                t ? {
                    value: i
                } : i
            }
        },
        "unary-": function(n, t) {
            return function(i, r, f, e) {
                return i = n(i, r, f, e),
                i = u(i) ? -i : 0,
                t ? {
                    value: i
                } : i
            }
        },
        "unary!": function(n, t) {
            return function(i, r, u, f) {
                return i = !n(i, r, u, f),
                t ? {
                    value: i
                } : i
            }
        },
        "binary+": function(n, t, i) {
            return function(r, u, f, e) {
                var o = n(r, u, f, e);
                return r = t(r, u, f, e),
                o = us(o, r),
                i ? {
                    value: o
                } : o
            }
        },
        "binary-": function(n, t, i) {
            return function(r, f, e, o) {
                var s = n(r, f, e, o);
                return r = t(r, f, e, o),
                s = (u(s) ? s : 0) - (u(r) ? r : 0),
                i ? {
                    value: s
                } : s
            }
        },
        "binary*": function(n, t, i) {
            return function(r, u, f, e) {
                return r = n(r, u, f, e) * t(r, u, f, e),
                i ? {
                    value: r
                } : r
            }
        },
        "binary/": function(n, t, i) {
            return function(r, u, f, e) {
                return r = n(r, u, f, e) / t(r, u, f, e),
                i ? {
                    value: r
                } : r
            }
        },
        "binary%": function(n, t, i) {
            return function(r, u, f, e) {
                return r = n(r, u, f, e) % t(r, u, f, e),
                i ? {
                    value: r
                } : r
            }
        },
        "binary===": function(n, t, i) {
            return function(r, u, f, e) {
                return r = n(r, u, f, e) === t(r, u, f, e),
                i ? {
                    value: r
                } : r
            }
        },
        "binary!==": function(n, t, i) {
            return function(r, u, f, e) {
                return r = n(r, u, f, e) !== t(r, u, f, e),
                i ? {
                    value: r
                } : r
            }
        },
        "binary==": function(n, t, i) {
            return function(r, u, f, e) {
                return r = n(r, u, f, e) == t(r, u, f, e),
                i ? {
                    value: r
                } : r
            }
        },
        "binary!=": function(n, t, i) {
            return function(r, u, f, e) {
                return r = n(r, u, f, e) != t(r, u, f, e),
                i ? {
                    value: r
                } : r
            }
        },
        "binary<": function(n, t, i) {
            return function(r, u, f, e) {
                return r = n(r, u, f, e) < t(r, u, f, e),
                i ? {
                    value: r
                } : r
            }
        },
        "binary>": function(n, t, i) {
            return function(r, u, f, e) {
                return r = n(r, u, f, e) > t(r, u, f, e),
                i ? {
                    value: r
                } : r
            }
        },
        "binary<=": function(n, t, i) {
            return function(r, u, f, e) {
                return r = n(r, u, f, e) <= t(r, u, f, e),
                i ? {
                    value: r
                } : r
            }
        },
        "binary>=": function(n, t, i) {
            return function(r, u, f, e) {
                return r = n(r, u, f, e) >= t(r, u, f, e),
                i ? {
                    value: r
                } : r
            }
        },
        "binary&&": function(n, t, i) {
            return function(r, u, f, e) {
                return r = n(r, u, f, e) && t(r, u, f, e),
                i ? {
                    value: r
                } : r
            }
        },
        "binary||": function(n, t, i) {
            return function(r, u, f, e) {
                return r = n(r, u, f, e) || t(r, u, f, e),
                i ? {
                    value: r
                } : r
            }
        },
        "ternary?:": function(n, t, i, r) {
            return function(u, f, e, o) {
                return u = n(u, f, e, o) ? t(u, f, e, o) : i(u, f, e, o),
                r ? {
                    value: u
                } : u
            }
        },
        value: function(n, t) {
            return function() {
                return t ? {
                    context: void 0,
                    name: void 0,
                    value: n
                } : n
            }
        },
        identifier: function(n, t, i, r, u) {
            return function(f, e) {
                return f = e && n in e ? e : f,
                r && 1 !== r && f && !f[n] && (f[n] = {}),
                e = f ? f[n] : void 0,
                t && gt(e, u),
                i ? {
                    context: f,
                    name: n,
                    value: e
                } : e
            }
        },
        computedMember: function(n, t, i, r, u) {
            return function(f, e, o, s) {
                var h = n(f, e, o, s), c, l;
                return null != h && (c = t(f, e, o, s),
                c += "",
                wi(c, u),
                r && 1 !== r && (vu(h),
                h && !h[c] && (h[c] = {})),
                l = h[c],
                gt(l, u)),
                i ? {
                    context: h,
                    name: c,
                    value: l
                } : l
            }
        },
        nonComputedMember: function(n, t, i, r, u, f) {
            return function(e, o, s, h) {
                return e = n(e, o, s, h),
                u && 1 !== u && (vu(e),
                e && !e[t] && (e[t] = {})),
                o = null != e ? e[t] : void 0,
                (i || yu(t)) && gt(o, f),
                r ? {
                    context: e,
                    name: t,
                    value: o
                } : o
            }
        },
        inputs: function(n, t) {
            return function(i, r, u, f) {
                return f ? f[t] : n(i, r, u)
            }
        }
    };
    ff = function(n, t, r) {
        this.lexer = n;
        this.$filter = t;
        this.options = r;
        this.ast = new i(n,r);
        this.astCompiler = r.csp ? new cs(this.ast,t) : new hs(this.ast,t)
    }
    ;
    ff.prototype = {
        constructor: ff,
        parse: function(n) {
            return this.astCompiler.compile(n, this.options.expensiveChecks)
        }
    };
    var cp = Object.prototype.valueOf
      , ri = l("$sce")
      , lt = {
        HTML: "html",
        CSS: "css",
        URL: "url",
        RESOURCE_URL: "resourceUrl",
        JS: "js"
    }
      , lp = l("$compile")
      , nt = n.document.createElement("a")
      , bh = ni(n.location.href);
    ys.$inject = ["$document"];
    ps.$inject = ["$provide"];
    var kh = 22
      , dh = "."
      , le = "0";
    ws.$inject = ["$locale"];
    bs.$inject = ["$locale"];
    var ap = {
        yyyy: d("FullYear", 4, 0, !1, !0),
        yy: d("FullYear", 2, 0, !0, !0),
        y: d("FullYear", 1, 0, !1, !0),
        MMMM: pr("Month"),
        MMM: pr("Month", !0),
        MM: d("Month", 2, 1),
        M: d("Month", 1, 1),
        LLLL: pr("Month", !1, !0),
        dd: d("Date", 2),
        d: d("Date", 1),
        HH: d("Hours", 2),
        H: d("Hours", 1),
        hh: d("Hours", 2, -12),
        h: d("Hours", 1, -12),
        mm: d("Minutes", 2),
        m: d("Minutes", 1),
        ss: d("Seconds", 2),
        s: d("Seconds", 1),
        sss: d("Milliseconds", 3),
        EEEE: pr("Day"),
        EEE: pr("Day", !0),
        a: function(n, t) {
            return 12 > n.getHours() ? t.AMPMS[0] : t.AMPMS[1]
        },
        Z: function(n, t, i) {
            return n = -1 * i,
            (0 <= n ? "+" : "") + (pu(Math[0 < n ? "floor" : "ceil"](n / 60), 2) + pu(Math.abs(n % 60), 2))
        },
        ww: gs(2),
        w: gs(1),
        G: ne,
        GG: ne,
        GGG: ne,
        GGGG: function(n, t) {
            return 0 >= n.getFullYear() ? t.ERANAMES[0] : t.ERANAMES[1]
        }
    }
      , vp = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/
      , yp = /^\-?\d+$/;
    nh.$inject = ["$locale"];
    gh = ft(v);
    nc = ft(bu);
    th.$inject = ["$parse"];
    tc = ft({
        restrict: "E",
        compile: function(n, t) {
            if (!t.href && !t.xlinkHref)
                return function(n, t) {
                    if ("a" === t[0].nodeName.toLowerCase()) {
                        var i = "[object SVGAnimatedString]" === rt.call(t.prop("href")) ? "xlink:href" : "href";
                        t.on("click", function(n) {
                            t.attr(i) || n.preventDefault()
                        })
                    }
                }
        }
    });
    kr = {};
    t(nf, function(n, t) {
        function r(n, r, u) {
            n.$watch(u[i], function(n) {
                u.$set(t, !!n)
            })
        }
        if ("multiple" != n) {
            var i = yt("ng-" + t)
              , u = r;
            "checked" === n && (u = function(n, t, u) {
                u.ngModel !== u[i] && r(n, t, u)
            }
            );
            kr[i] = function() {
                return {
                    restrict: "A",
                    priority: 100,
                    link: u
                }
            }
        }
    });
    t(se, function(n, t) {
        kr[t] = function() {
            return {
                priority: 100,
                link: function(n, i, r) {
                    if ("ngPattern" === t && "/" == r.ngPattern.charAt(0) && (i = r.ngPattern.match(yv))) {
                        r.$set("ngPattern", new RegExp(i[1],i[2]));
                        return
                    }
                    n.$watch(r[t], function(n) {
                        r.$set(t, n)
                    })
                }
            }
        }
    });
    t(["src", "srcset", "href"], function(n) {
        var t = yt("ng-" + n);
        kr[t] = function() {
            return {
                priority: 99,
                link: function(i, r, u) {
                    var e = n
                      , f = n;
                    "href" === n && "[object SVGAnimatedString]" === rt.call(r.prop("href")) && (f = "xlinkHref",
                    u.$attr[f] = "xlink:href",
                    e = null);
                    u.$observe(t, function(t) {
                        t ? (u.$set(f, t),
                        ti && e && r.prop(e, u[f])) : "href" === n && u.$set(f, null)
                    })
                }
            }
        }
    });
    dr = {
        $addControl: o,
        $$renameControl: function(n, t) {
            n.$name = t
        },
        $removeControl: o,
        $setValidity: o,
        $setDirty: o,
        $setPristine: o,
        $setSubmitted: o
    };
    ih.$inject = ["$element", "$attrs", "$scope", "$animate", "$interpolate"];
    var ic = function(n) {
        return ["$timeout", "$parse", function(t, i) {
            function r(n) {
                return "" === n ? i('this[""]').assign : i(n).assign || o
            }
            return {
                name: "form",
                restrict: n ? "EAC" : "E",
                require: ["form", "^^?form"],
                controller: ih,
                compile: function(i, u) {
                    i.addClass(tr).addClass(gr);
                    var f = u.name ? "name" : n && u.ngForm ? "ngForm" : !1;
                    return {
                        pre: function(n, i, u, e) {
                            var s = e[0], c, h;
                            if (!("action"in u)) {
                                c = function(t) {
                                    n.$apply(function() {
                                        s.$commitViewValue();
                                        s.$setSubmitted()
                                    });
                                    t.preventDefault()
                                }
                                ;
                                i[0].addEventListener("submit", c, !1);
                                i.on("$destroy", function() {
                                    t(function() {
                                        i[0].removeEventListener("submit", c, !1)
                                    }, 0, !1)
                                })
                            }
                            (e[1] || s.$$parentForm).$addControl(s);
                            h = f ? r(s.$name) : o;
                            f && (h(n, s),
                            u.$observe(f, function(t) {
                                s.$name !== t && (h(n, void 0),
                                s.$$parentForm.$$renameControl(s, t),
                                h = r(s.$name),
                                h(n, s))
                            }));
                            i.on("$destroy", function() {
                                s.$$parentForm.$removeControl(s);
                                h(n, void 0);
                                a(s, dr)
                            })
                        }
                    }
                }
            }
        }
        ]
    }
      , pp = ic()
      , wp = ic(!0)
      , bp = /^\d{4,}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)$/
      , kp = /^[a-z][a-z\d.+-]*:\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+\])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i
      , dp = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/
      , gp = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/
      , rc = /^(\d{4,})-(\d{2})-(\d{2})$/
      , uc = /^(\d{4,})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/
      , ae = /^(\d{4,})-W(\d\d)$/
      , fc = /^(\d{4,})-(\d\d)$/
      , ec = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/
      , oc = y();
    t(["date", "datetime-local", "month", "time", "week"], function(n) {
        oc[n] = !0
    });
    var sc = {
        text: function(n, t, i, r, u, f) {
            wr(n, t, i, r, u, f);
            ie(r)
        },
        date: br("date", rc, wu(rc, ["yyyy", "MM", "dd"]), "yyyy-MM-dd"),
        "datetime-local": br("datetimelocal", uc, wu(uc, "yyyy MM dd HH mm ss sss".split(" ")), "yyyy-MM-ddTHH:mm:ss.sss"),
        time: br("time", ec, wu(ec, ["HH", "mm", "ss", "sss"]), "HH:mm:ss.sss"),
        week: br("week", ae, function(n, t) {
            var i;
            if (et(n))
                return n;
            if (h(n) && (ae.lastIndex = 0,
            i = ae.exec(n),
            i)) {
                var u = +i[1]
                  , r = +i[2]
                  , f = i = 0
                  , e = 0
                  , o = 0
                  , s = ds(u)
                  , r = 7 * (r - 1);
                return t && (i = t.getHours(),
                f = t.getMinutes(),
                e = t.getSeconds(),
                o = t.getMilliseconds()),
                new Date(u,0,s.getDate() + r,i,f,e,o)
            }
            return NaN
        }, "yyyy-Www"),
        month: br("month", fc, wu(fc, ["yyyy", "MM"]), "yyyy-MM"),
        number: function(n, t, i, f, e, o) {
            var s, h;
            rh(n, t, i, f);
            wr(n, t, i, f, e, o);
            f.$$parserName = "number";
            f.$parsers.push(function(n) {
                return f.$isEmpty(n) ? null : gp.test(n) ? parseFloat(n) : void 0
            });
            f.$formatters.push(function(n) {
                if (!f.$isEmpty(n)) {
                    if (!w(n))
                        throw nu("numfmt", n);
                    n = n.toString()
                }
                return n
            });
            (u(i.min) || i.ngMin) && (f.$validators.min = function(n) {
                return f.$isEmpty(n) || r(s) || n >= s
            }
            ,
            i.$observe("min", function(n) {
                u(n) && !w(n) && (n = parseFloat(n));
                s = w(n) && !isNaN(n) ? n : void 0;
                f.$validate()
            }));
            (u(i.max) || i.ngMax) && (f.$validators.max = function(n) {
                return f.$isEmpty(n) || r(h) || n <= h
            }
            ,
            i.$observe("max", function(n) {
                u(n) && !w(n) && (n = parseFloat(n));
                h = w(n) && !isNaN(n) ? n : void 0;
                f.$validate()
            }))
        },
        url: function(n, t, i, r, u, f) {
            wr(n, t, i, r, u, f);
            ie(r);
            r.$$parserName = "url";
            r.$validators.url = function(n, t) {
                var i = n || t;
                return r.$isEmpty(i) || kp.test(i)
            }
        },
        email: function(n, t, i, r, u, f) {
            wr(n, t, i, r, u, f);
            ie(r);
            r.$$parserName = "email";
            r.$validators.email = function(n, t) {
                var i = n || t;
                return r.$isEmpty(i) || dp.test(i)
            }
        },
        radio: function(n, t, i, u) {
            r(i.name) && t.attr("name", ++ku);
            t.on("click", function(n) {
                t[0].checked && u.$setViewValue(i.value, n && n.type)
            });
            u.$render = function() {
                t[0].checked = i.value == u.$viewValue
            }
            ;
            i.$observe("value", u.$render)
        },
        checkbox: function(n, t, i, r, u, f, e, o) {
            var s = uh(o, n, "ngTrueValue", i.ngTrueValue, !0)
              , h = uh(o, n, "ngFalseValue", i.ngFalseValue, !1);
            t.on("click", function(n) {
                r.$setViewValue(t[0].checked, n && n.type)
            });
            r.$render = function() {
                t[0].checked = r.$viewValue
            }
            ;
            r.$isEmpty = function(n) {
                return !1 === n
            }
            ;
            r.$formatters.push(function(n) {
                return ot(n, s)
            });
            r.$parsers.push(function(n) {
                return n ? s : h
            })
        },
        hidden: o,
        button: o,
        submit: o,
        reset: o,
        file: o
    }
      , hc = ["$browser", "$sniffer", "$filter", "$parse", function(n, t, i, r) {
        return {
            restrict: "E",
            require: ["?ngModel"],
            link: {
                pre: function(u, f, e, o) {
                    o[0] && (sc[v(e.type)] || sc.text)(u, f, e, o[0], t, n, i, r)
                }
            }
        }
    }
    ]
      , nw = /^(true|false|\d+)$/
      , tw = function() {
        return {
            restrict: "A",
            priority: 100,
            compile: function(n, t) {
                return nw.test(t.ngValue) ? function(n, t, i) {
                    i.$set("value", n.$eval(i.ngValue))
                }
                : function(n, t, i) {
                    n.$watch(i.ngValue, function(n) {
                        i.$set("value", n)
                    })
                }
            }
        }
    }
      , iw = ["$compile", function(n) {
        return {
            restrict: "AC",
            compile: function(t) {
                return n.$$addBindingClass(t),
                function(t, i, u) {
                    n.$$addBindingInfo(i, u.ngBind);
                    i = i[0];
                    t.$watch(u.ngBind, function(n) {
                        i.textContent = r(n) ? "" : n
                    })
                }
            }
        }
    }
    ]
      , rw = ["$interpolate", "$compile", function(n, t) {
        return {
            compile: function(i) {
                return t.$$addBindingClass(i),
                function(i, u, f) {
                    i = n(u.attr(f.$attr.ngBindTemplate));
                    t.$$addBindingInfo(u, i.expressions);
                    u = u[0];
                    f.$observe("ngBindTemplate", function(n) {
                        u.textContent = r(n) ? "" : n
                    })
                }
            }
        }
    }
    ]
      , uw = ["$sce", "$parse", "$compile", function(n, t, i) {
        return {
            restrict: "A",
            compile: function(r, u) {
                var f = t(u.ngBindHtml)
                  , e = t(u.ngBindHtml, function(t) {
                    return n.valueOf(t)
                });
                return i.$$addBindingClass(r),
                function(t, r, u) {
                    i.$$addBindingInfo(r, u.ngBindHtml);
                    t.$watch(e, function() {
                        var i = f(t);
                        r.html(n.getTrustedHtml(i) || "")
                    })
                }
            }
        }
    }
    ]
      , fw = ft({
        restrict: "A",
        require: "ngModel",
        link: function(n, t, i, r) {
            r.$viewChangeListeners.push(function() {
                n.$eval(i.ngChange)
            })
        }
    })
      , ew = re("", !0)
      , ow = re("Odd", 0)
      , sw = re("Even", 1)
      , hw = bi({
        compile: function(n, t) {
            t.$set("ngCloak", void 0);
            n.removeClass("ng-cloak")
        }
    })
      , cw = [function() {
        return {
            restrict: "A",
            scope: !0,
            controller: "@",
            priority: 500
        }
    }
    ]
      , cc = {}
      , lw = {
        blur: !0,
        focus: !0
    };
    t("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function(n) {
        var t = yt("ng-" + n);
        cc[t] = ["$parse", "$rootScope", function(i, r) {
            return {
                restrict: "A",
                compile: function(u, f) {
                    var e = i(f[t], null, !0);
                    return function(t, i) {
                        i.on(n, function(i) {
                            var u = function() {
                                e(t, {
                                    $event: i
                                })
                            };
                            lw[n] && r.$$phase ? t.$evalAsync(u) : t.$apply(u)
                        })
                    }
                }
            }
        }
        ]
    });
    var aw = ["$animate", "$compile", function(n, t) {
        return {
            multiElement: !0,
            transclude: "element",
            priority: 600,
            terminal: !0,
            restrict: "A",
            $$tlb: !0,
            link: function(i, r, u, f, e) {
                var h, s, o;
                i.$watch(u.ngIf, function(i) {
                    i ? s || e(function(i, f) {
                        s = f;
                        i[i.length++] = t.$$createComment("end ngIf", u.ngIf);
                        h = {
                            clone: i
                        };
                        n.enter(i, r.parent(), r)
                    }) : (o && (o.remove(),
                    o = null),
                    s && (s.$destroy(),
                    s = null),
                    h && (o = ru(h.clone),
                    n.leave(o).then(function() {
                        o = null
                    }),
                    h = null))
                })
            }
        }
    }
    ]
      , vw = ["$templateRequest", "$anchorScroll", "$animate", function(n, t, i) {
        return {
            restrict: "ECA",
            priority: 400,
            terminal: !0,
            transclude: "element",
            controller: ut.noop,
            compile: function(r, f) {
                var o = f.ngInclude || f.src
                  , s = f.onload || ""
                  , e = f.autoscroll;
                return function(r, f, h, c, l) {
                    var p = 0, a, v, y, w = function() {
                        v && (v.remove(),
                        v = null);
                        a && (a.$destroy(),
                        a = null);
                        y && (i.leave(y).then(function() {
                            v = null
                        }),
                        v = y,
                        y = null)
                    };
                    r.$watch(o, function(o) {
                        var v = function() {
                            u(e) && (!e || r.$eval(e)) && t()
                        }
                          , h = ++p;
                        o ? (n(o, !0).then(function(n) {
                            if (!r.$$destroyed && h === p) {
                                var t = r.$new();
                                c.template = n;
                                n = l(t, function(n) {
                                    w();
                                    i.enter(n, null, f).then(v)
                                });
                                a = t;
                                y = n;
                                a.$emit("$includeContentLoaded", o);
                                r.$eval(s)
                            }
                        }, function() {
                            r.$$destroyed || h !== p || (w(),
                            r.$emit("$includeContentError", o))
                        }),
                        r.$emit("$includeContentRequested", o)) : (w(),
                        c.template = null)
                    })
                }
            }
        }
    }
    ]
      , yw = ["$compile", function(t) {
        return {
            restrict: "ECA",
            priority: -400,
            require: "ngInclude",
            link: function(i, r, u, f) {
                rt.call(r[0]).match(/SVG/) ? (r.empty(),
                t(uo(f.template, n.document).childNodes)(i, function(n) {
                    r.append(n)
                }, {
                    futureParentElement: r
                })) : (r.html(f.template),
                t(r.contents())(i))
            }
        }
    }
    ]
      , pw = bi({
        priority: 450,
        compile: function() {
            return {
                pre: function(n, t, i) {
                    n.$eval(i.ngInit)
                }
            }
        }
    })
      , ww = function() {
        return {
            restrict: "A",
            priority: 100,
            require: "ngModel",
            link: function(n, i, u, f) {
                var e = i.attr(u.$attr.ngList) || ", "
                  , o = "false" !== u.ngTrim
                  , s = o ? p(e) : e;
                f.$parsers.push(function(n) {
                    if (!r(n)) {
                        var i = [];
                        return n && t(n.split(s), function(n) {
                            n && i.push(o ? p(n) : n)
                        }),
                        i
                    }
                });
                f.$formatters.push(function(n) {
                    if (c(n))
                        return n.join(e)
                });
                f.$isEmpty = function(n) {
                    return !n || !n.length
                }
            }
        }
    }
      , gr = "ng-valid"
      , lc = "ng-invalid"
      , tr = "ng-pristine"
      , ef = "ng-dirty"
      , ac = "ng-pending"
      , nu = l("ngModel")
      , bw = ["$scope", "$exceptionHandler", "$attrs", "$element", "$parse", "$animate", "$timeout", "$rootScope", "$q", "$interpolate", function(n, i, e, s, h, c, l, a, v, y) {
        var d;
        this.$modelValue = this.$viewValue = Number.NaN;
        this.$$rawModelValue = void 0;
        this.$validators = {};
        this.$asyncValidators = {};
        this.$parsers = [];
        this.$formatters = [];
        this.$viewChangeListeners = [];
        this.$untouched = !0;
        this.$touched = !1;
        this.$pristine = !0;
        this.$dirty = !1;
        this.$valid = !0;
        this.$invalid = !1;
        this.$error = {};
        this.$$success = {};
        this.$pending = void 0;
        this.$name = y(e.name || "", !1)(n);
        this.$$parentForm = dr;
        var k = h(e.ngModel), tt = k.assign, nt = k, it = tt, g = null, b, p = this;
        this.$$setOptions = function(n) {
            if ((p.$options = n) && n.getterSetter) {
                var t = h(e.ngModel + "()")
                  , i = h(e.ngModel + "($$$p)");
                nt = function(n) {
                    var i = k(n);
                    return f(i) && (i = t(n)),
                    i
                }
                ;
                it = function(n, t) {
                    f(k(n)) ? i(n, {
                        $$$p: t
                    }) : tt(n, t)
                }
            } else if (!k.assign)
                throw nu("nonassign", e.ngModel, vt(s));
        }
        ;
        this.$render = o;
        this.$isEmpty = function(n) {
            return r(n) || "" === n || null === n || n !== n
        }
        ;
        this.$$updateEmptyClasses = function(n) {
            p.$isEmpty(n) ? (c.removeClass(s, "ng-not-empty"),
            c.addClass(s, "ng-empty")) : (c.removeClass(s, "ng-empty"),
            c.addClass(s, "ng-not-empty"))
        }
        ;
        d = 0;
        fh({
            ctrl: this,
            $element: s,
            set: function(n, t) {
                n[t] = !0
            },
            unset: function(n, t) {
                delete n[t]
            },
            $animate: c
        });
        this.$setPristine = function() {
            p.$dirty = !1;
            p.$pristine = !0;
            c.removeClass(s, ef);
            c.addClass(s, tr)
        }
        ;
        this.$setDirty = function() {
            p.$dirty = !0;
            p.$pristine = !1;
            c.removeClass(s, tr);
            c.addClass(s, ef);
            p.$$parentForm.$setDirty()
        }
        ;
        this.$setUntouched = function() {
            p.$touched = !1;
            p.$untouched = !0;
            c.setClass(s, "ng-untouched", "ng-touched")
        }
        ;
        this.$setTouched = function() {
            p.$touched = !0;
            p.$untouched = !1;
            c.setClass(s, "ng-touched", "ng-untouched")
        }
        ;
        this.$rollbackViewValue = function() {
            l.cancel(g);
            p.$viewValue = p.$$lastCommittedViewValue;
            p.$render()
        }
        ;
        this.$validate = function() {
            if (!w(p.$modelValue) || !isNaN(p.$modelValue)) {
                var n = p.$$rawModelValue
                  , t = p.$valid
                  , i = p.$modelValue
                  , r = p.$options && p.$options.allowInvalid;
                p.$$runValidators(n, p.$$lastCommittedViewValue, function(u) {
                    r || t === u || (p.$modelValue = u ? n : void 0,
                    p.$modelValue !== i && p.$$writeModelToScope())
                })
            }
        }
        ;
        this.$$runValidators = function(n, i, u) {
            function c() {
                var r = !0;
                return t(p.$validators, function(t, u) {
                    var f = t(n, i);
                    r = r && f;
                    e(u, f)
                }),
                r ? !0 : (t(p.$asyncValidators, function(n, t) {
                    e(t, null)
                }),
                !1)
            }
            function l() {
                var r = []
                  , u = !0;
                t(p.$asyncValidators, function(t, o) {
                    var s = t(n, i);
                    if (!s || !f(s.then))
                        throw nu("nopromise", s);
                    e(o, void 0);
                    r.push(s.then(function() {
                        e(o, !0)
                    }, function() {
                        u = !1;
                        e(o, !1)
                    }))
                });
                r.length ? v.all(r).then(function() {
                    s(u)
                }, o) : s(!0)
            }
            function e(n, t) {
                h === d && p.$setValidity(n, t)
            }
            function s(n) {
                h === d && u(n)
            }
            d++;
            var h = d;
            (function() {
                var n = p.$$parserName || "parse";
                if (r(b))
                    e(n, null);
                else
                    return b || (t(p.$validators, function(n, t) {
                        e(t, null)
                    }),
                    t(p.$asyncValidators, function(n, t) {
                        e(t, null)
                    })),
                    e(n, b),
                    b;
                return !0
            }
            )() ? c() ? l() : s(!1) : s(!1)
        }
        ;
        this.$commitViewValue = function() {
            var n = p.$viewValue;
            l.cancel(g);
            (p.$$lastCommittedViewValue !== n || "" === n && p.$$hasNativeValidators) && (p.$$updateEmptyClasses(n),
            p.$$lastCommittedViewValue = n,
            p.$pristine && this.$setDirty(),
            this.$$parseAndValidate())
        }
        ;
        this.$$parseAndValidate = function() {
            var t = p.$$lastCommittedViewValue, i, u, f;
            if (b = r(t) ? void 0 : !0)
                for (i = 0; i < p.$parsers.length; i++)
                    if (t = p.$parsers[i](t),
                    r(t)) {
                        b = !1;
                        break
                    }
            w(p.$modelValue) && isNaN(p.$modelValue) && (p.$modelValue = nt(n));
            u = p.$modelValue;
            f = p.$options && p.$options.allowInvalid;
            p.$$rawModelValue = t;
            f && (p.$modelValue = t,
            p.$modelValue !== u && p.$$writeModelToScope());
            p.$$runValidators(t, p.$$lastCommittedViewValue, function(n) {
                f || (p.$modelValue = n ? t : void 0,
                p.$modelValue !== u && p.$$writeModelToScope())
            })
        }
        ;
        this.$$writeModelToScope = function() {
            it(n, p.$modelValue);
            t(p.$viewChangeListeners, function(n) {
                try {
                    n()
                } catch (t) {
                    i(t)
                }
            })
        }
        ;
        this.$setViewValue = function(n, t) {
            p.$viewValue = n;
            p.$options && !p.$options.updateOnDefault || p.$$debounceViewValueCommit(t)
        }
        ;
        this.$$debounceViewValueCommit = function(t) {
            var r = 0
              , i = p.$options;
            i && u(i.debounce) && (i = i.debounce,
            w(i) ? r = i : w(i[t]) ? r = i[t] : w(i["default"]) && (r = i["default"]));
            l.cancel(g);
            r ? g = l(function() {
                p.$commitViewValue()
            }, r) : a.$$phase ? p.$commitViewValue() : n.$apply(function() {
                p.$commitViewValue()
            })
        }
        ;
        n.$watch(function() {
            var t = nt(n);
            if (t !== p.$modelValue && (p.$modelValue === p.$modelValue || t === t)) {
                p.$modelValue = p.$$rawModelValue = t;
                b = void 0;
                for (var r = p.$formatters, u = r.length, i = t; u--; )
                    i = r[u](i);
                p.$viewValue !== i && (p.$$updateEmptyClasses(i),
                p.$viewValue = p.$$lastCommittedViewValue = i,
                p.$render(),
                p.$$runValidators(t, i, o))
            }
            return t
        })
    }
    ]
      , kw = ["$rootScope", function(n) {
        return {
            restrict: "A",
            require: ["ngModel", "^?form", "^?ngModelOptions"],
            controller: bw,
            priority: 1,
            compile: function(t) {
                return t.addClass(tr).addClass("ng-untouched").addClass(gr),
                {
                    pre: function(n, t, i, r) {
                        var u = r[0];
                        t = r[1] || u.$$parentForm;
                        u.$$setOptions(r[2] && r[2].$options);
                        t.$addControl(u);
                        i.$observe("name", function(n) {
                            u.$name !== n && u.$$parentForm.$$renameControl(u, n)
                        });
                        n.$on("$destroy", function() {
                            u.$$parentForm.$removeControl(u)
                        })
                    },
                    post: function(t, i, r, u) {
                        var f = u[0];
                        if (f.$options && f.$options.updateOn)
                            i.on(f.$options.updateOn, function(n) {
                                f.$$debounceViewValueCommit(n && n.type)
                            });
                        i.on("blur", function() {
                            f.$touched || (n.$$phase ? t.$evalAsync(f.$setTouched) : t.$apply(f.$setTouched))
                        })
                    }
                }
            }
        }
    }
    ]
      , dw = /(\s+|^)default(\s+|$)/
      , gw = function() {
        return {
            restrict: "A",
            controller: ["$scope", "$attrs", function(n, t) {
                var i = this;
                this.$options = dt(n.$eval(t.ngModelOptions));
                u(this.$options.updateOn) ? (this.$options.updateOnDefault = !1,
                this.$options.updateOn = p(this.$options.updateOn.replace(dw, function() {
                    return i.$options.updateOnDefault = !0,
                    " "
                }))) : this.$options.updateOnDefault = !0
            }
            ]
        }
    }
      , nb = bi({
        terminal: !0,
        priority: 1e3
    })
      , tb = l("ngOptions")
      , ib = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/
      , rb = ["$compile", "$document", "$parse", function(i, r, f) {
        function h(n, t, i) {
            function w(n, t, i, r, u) {
                this.selectValue = n;
                this.viewValue = t;
                this.label = i;
                this.group = r;
                this.disabled = u
            }
            function l(n) {
                var t, i;
                if (!s && kt(n))
                    t = n;
                else {
                    t = [];
                    for (i in n)
                        n.hasOwnProperty(i) && "$" !== i.charAt(0) && t.push(i)
                }
                return t
            }
            var r = n.match(ib), o, s, u;
            if (!r)
                throw tb("iexp", n, vt(t));
            o = r[5] || r[7];
            s = r[6];
            n = / as /.test(r[0]) && r[1];
            u = r[9];
            t = f(r[2] ? r[1] : o);
            var b = n && f(n) || t
              , k = u && f(u)
              , h = u ? function(n, t) {
                return k(i, t)
            }
            : function(n) {
                return fi(n)
            }
              , a = function(n, t) {
                return h(n, c(n, t))
            }
              , v = f(r[2] || r[1])
              , d = f(r[3] || "")
              , y = f(r[4] || "")
              , p = f(r[8])
              , e = {}
              , c = s ? function(n, t) {
                return e[s] = t,
                e[o] = n,
                e
            }
            : function(n) {
                return e[o] = n,
                e
            }
            ;
            return {
                trackBy: u,
                getTrackByValue: a,
                getWatchables: f(p, function(n) {
                    var f = [];
                    n = n || [];
                    for (var o = l(n), s = o.length, e = 0; e < s; e++) {
                        var t = n === o ? e : o[e]
                          , u = n[t]
                          , t = c(u, t)
                          , u = h(u, t);
                        f.push(u);
                        (r[2] || r[1]) && (u = v(i, t),
                        f.push(u));
                        r[4] && (t = y(i, t),
                        f.push(t))
                    }
                    return f
                }),
                getOptions: function() {
                    for (var k = [], e = {}, o = p(i) || [], s = l(o), g = s.length, f = 0; f < g; f++) {
                        var t = o === s ? f : s[f]
                          , n = c(o[t], t)
                          , r = b(i, n)
                          , t = h(r, n)
                          , nt = v(i, n)
                          , tt = d(i, n)
                          , n = y(i, n)
                          , r = new w(t,r,nt,tt,n);
                        k.push(r);
                        e[t] = r
                    }
                    return {
                        items: k,
                        selectValueMap: e,
                        getOptionFromViewValue: function(n) {
                            return e[a(n)]
                        },
                        getViewValueFromOption: function(n) {
                            return u ? ut.copy(n.viewValue) : n.viewValue
                        }
                    }
                }
            }
        }
        var s = n.document.createElement("option")
          , l = n.document.createElement("optgroup");
        return {
            restrict: "A",
            terminal: !0,
            require: ["select", "ngModel"],
            link: {
                pre: function(n, t, i, r) {
                    r[0].registerOption = o
                },
                post: function(n, f, o, a) {
                    function ut(n, t) {
                        n.element = t;
                        t.disabled = n.disabled;
                        n.label !== t.label && (t.label = n.label,
                        t.textContent = n.label);
                        n.value !== t.value && (t.value = n.selectValue)
                    }
                    function tt() {
                        var i = y && d.readValue(), n, t, r;
                        if (y)
                            for (n = y.items.length - 1; 0 <= n; n--)
                                t = y.items[n],
                                u(t.group) ? cu(t.element.parentNode) : cu(t.element);
                        y = k.getOptions();
                        r = {};
                        w && f.prepend(v);
                        y.items.forEach(function(n) {
                            var t, i;
                            u(n.group) ? (t = r[n.group],
                            t || (t = l.cloneNode(!1),
                            nt.appendChild(t),
                            t.label = null === n.group ? "null" : n.group,
                            r[n.group] = t),
                            i = s.cloneNode(!1)) : (t = nt,
                            i = s.cloneNode(!1));
                            t.appendChild(i);
                            ut(n, i)
                        });
                        f[0].appendChild(nt);
                        p.$render();
                        p.$isEmpty(i) || (n = d.readValue(),
                        (k.trackBy || it ? ot(i, n) : i === n) || (p.$setViewValue(n),
                        p.$render()))
                    }
                    var d = a[0], p = a[1], it = o.multiple, v, g, rt, w, b, y, k, nt;
                    for (a = 0,
                    g = f.children(),
                    rt = g.length; a < rt; a++)
                        if ("" === g[a].value) {
                            v = g.eq(a);
                            break
                        }
                    w = !!v;
                    b = e(s.cloneNode(!1));
                    b.val("?");
                    k = h(o.ngOptions, f, n);
                    nt = r[0].createDocumentFragment();
                    it ? (p.$isEmpty = function(n) {
                        return !n || 0 === n.length
                    }
                    ,
                    d.writeValue = function(n) {
                        y.items.forEach(function(n) {
                            n.element.selected = !1
                        });
                        n && n.forEach(function(n) {
                            (n = y.getOptionFromViewValue(n)) && (n.element.selected = !0)
                        })
                    }
                    ,
                    d.readValue = function() {
                        var i = f.val() || []
                          , n = [];
                        return t(i, function(t) {
                            (t = y.selectValueMap[t]) && !t.disabled && n.push(y.getViewValueFromOption(t))
                        }),
                        n
                    }
                    ,
                    k.trackBy && n.$watchCollection(function() {
                        if (c(p.$viewValue))
                            return p.$viewValue.map(function(n) {
                                return k.getTrackByValue(n)
                            })
                    }, function() {
                        p.$render()
                    })) : (d.writeValue = function(n) {
                        var t = y.getOptionFromViewValue(n);
                        t ? (f[0].value !== t.selectValue && (b.remove(),
                        w || v.remove(),
                        f[0].value = t.selectValue,
                        t.element.selected = !0),
                        t.element.setAttribute("selected", "selected")) : null === n || w ? (b.remove(),
                        w || f.prepend(v),
                        f.val(""),
                        v.prop("selected", !0),
                        v.attr("selected", !0)) : (w || v.remove(),
                        f.prepend(b),
                        f.val("?"),
                        b.prop("selected", !0),
                        b.attr("selected", !0))
                    }
                    ,
                    d.readValue = function() {
                        var n = y.selectValueMap[f.val()];
                        return n && !n.disabled ? (w || v.remove(),
                        b.remove(),
                        y.getViewValueFromOption(n)) : null
                    }
                    ,
                    k.trackBy && n.$watch(function() {
                        return k.getTrackByValue(p.$viewValue)
                    }, function() {
                        p.$render()
                    }));
                    w ? (v.remove(),
                    i(v)(n),
                    v.removeClass("ng-scope")) : v = e(s.cloneNode(!1));
                    f.empty();
                    tt();
                    n.$watchCollection(k.getWatchables, tt)
                }
            }
        }
    }
    ]
      , ub = ["$locale", "$interpolate", "$log", function(n, i, u) {
        var f = /{}/g
          , e = /^when(Minus)?(.+)$/;
        return {
            link: function(s, h, c) {
                function p(n) {
                    h.text(n || "")
                }
                var b = c.count, k = c.$attr.when && h.attr(c.$attr.when), d = c.offset || 0, a = s.$eval(k) || {}, g = {}, nt = i.startSymbol(), tt = i.endSymbol(), it = nt + b + "-" + d + tt, y = ut.noop, l;
                t(c, function(n, t) {
                    var i = e.exec(t);
                    i && (i = (i[1] ? "-" : "") + v(i[2]),
                    a[i] = h.attr(c.$attr[t]))
                });
                t(a, function(n, t) {
                    g[t] = i(n.replace(f, it))
                });
                s.$watch(b, function(t) {
                    var i = parseFloat(t)
                      , f = isNaN(i);
                    f || i in a || (i = n.pluralCat(i - d));
                    i === l || f && w(l) && isNaN(l) || (y(),
                    f = g[i],
                    r(f) ? (null != t && u.debug("ngPluralize: no rule defined for '" + i + "' in " + k),
                    y = o,
                    p()) : y = s.$watch(f, p),
                    l = i)
                })
            }
        }
    }
    ]
      , fb = ["$parse", "$animate", "$compile", function(n, i, r) {
        var u = l("ngRepeat")
          , f = function(n, t, i, r, u, f, e) {
            n[i] = r;
            u && (n[u] = f);
            n.$index = t;
            n.$first = 0 === t;
            n.$last = t === e - 1;
            n.$middle = !(n.$first || n.$last);
            n.$odd = !(n.$even = 0 == (t & 1))
        };
        return {
            restrict: "A",
            multiElement: !0,
            transclude: "element",
            priority: 1e3,
            terminal: !0,
            $$tlb: !0,
            compile: function(e, o) {
                var a = o.ngRepeat, nt = r.$$createComment("end ngRepeat", a), s = a.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/), v, c, p, w, d, g, l;
                if (!s)
                    throw u("iexp", a);
                var b = s[1]
                  , tt = s[2]
                  , h = s[3]
                  , k = s[4]
                  , s = b.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
                if (!s)
                    throw u("iidexp", b);
                if (v = s[3] || s[1],
                c = s[2],
                h && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(h) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(h)))
                    throw u("badident", h);
                return l = {
                    $id: fi
                },
                k ? p = n(k) : (d = function(n, t) {
                    return fi(t)
                }
                ,
                g = function(n) {
                    return n
                }
                ),
                function(n, r, e, o, s) {
                    p && (w = function(t, i, r) {
                        return c && (l[c] = t),
                        l[v] = i,
                        l.$index = r,
                        p(n, l)
                    }
                    );
                    var b = y();
                    n.$watchCollection(tt, function(e) {
                        var o, et, ot = r[0], tt, st = y(), ut, rt, ft, p, it, l, k;
                        if (h && (n[h] = e),
                        kt(e))
                            it = e,
                            et = w || d;
                        else
                            for (k in et = w || g,
                            it = [],
                            e)
                                wt.call(e, k) && "$" !== k.charAt(0) && it.push(k);
                        for (ut = it.length,
                        k = Array(ut),
                        o = 0; o < ut; o++)
                            if (rt = e === it ? o : it[o],
                            ft = e[rt],
                            p = et(rt, ft, o),
                            b[p])
                                l = b[p],
                                delete b[p],
                                st[p] = l,
                                k[o] = l;
                            else {
                                if (st[p])
                                    throw t(k, function(n) {
                                        n && n.scope && (b[n.id] = n)
                                    }),
                                    u("dupes", a, p, ft);
                                k[o] = {
                                    id: p,
                                    scope: void 0,
                                    clone: void 0
                                };
                                st[p] = !0
                            }
                        for (tt in b) {
                            if (l = b[tt],
                            p = ru(l.clone),
                            i.leave(p),
                            p[0].parentNode)
                                for (o = 0,
                                et = p.length; o < et; o++)
                                    p[o].$$NG_REMOVED = !0;
                            l.scope.$destroy()
                        }
                        for (o = 0; o < ut; o++)
                            if (rt = e === it ? o : it[o],
                            ft = e[rt],
                            l = k[o],
                            l.scope) {
                                tt = ot;
                                do
                                    tt = tt.nextSibling;
                                while (tt && tt.$$NG_REMOVED);
                                l.clone[0] != tt && i.move(ru(l.clone), null, ot);
                                ot = l.clone[l.clone.length - 1];
                                f(l.scope, o, v, ft, c, rt, ut)
                            } else
                                s(function(n, t) {
                                    l.scope = t;
                                    var r = nt.cloneNode(!1);
                                    n[n.length++] = r;
                                    i.enter(n, null, ot);
                                    ot = r;
                                    l.clone = n;
                                    st[l.id] = l;
                                    f(l.scope, o, v, ft, c, rt, ut)
                                });
                        b = st
                    })
                }
            }
        }
    }
    ]
      , eb = ["$animate", function(n) {
        return {
            restrict: "A",
            multiElement: !0,
            link: function(t, i, r) {
                t.$watch(r.ngShow, function(t) {
                    n[t ? "removeClass" : "addClass"](i, "ng-hide", {
                        tempClasses: "ng-hide-animate"
                    })
                })
            }
        }
    }
    ]
      , ob = ["$animate", function(n) {
        return {
            restrict: "A",
            multiElement: !0,
            link: function(t, i, r) {
                t.$watch(r.ngHide, function(t) {
                    n[t ? "addClass" : "removeClass"](i, "ng-hide", {
                        tempClasses: "ng-hide-animate"
                    })
                })
            }
        }
    }
    ]
      , sb = bi(function(n, i, r) {
        n.$watch(r.ngStyle, function(n, r) {
            r && n !== r && t(r, function(n, t) {
                i.css(t, "")
            });
            n && i.css(n)
        }, !0)
    })
      , hb = ["$animate", "$compile", function(n, i) {
        return {
            require: "ngSwitch",
            controller: ["$scope", function() {
                this.cases = {}
            }
            ],
            link: function(r, u, f, e) {
                var c = []
                  , h = []
                  , o = []
                  , s = []
                  , l = function(n, t) {
                    return function() {
                        n.splice(t, 1)
                    }
                };
                r.$watch(f.ngSwitch || f.on, function(r) {
                    for (var a, u = 0, f = o.length; u < f; ++u)
                        n.cancel(o[u]);
                    for (u = o.length = 0,
                    f = s.length; u < f; ++u)
                        a = ru(h[u].clone),
                        s[u].$destroy(),
                        (o[u] = n.leave(a)).then(l(o, u));
                    h.length = 0;
                    s.length = 0;
                    (c = e.cases["!" + r] || e.cases["?"]) && t(c, function(t) {
                        t.transclude(function(r, u) {
                            s.push(u);
                            var f = t.element;
                            r[r.length++] = i.$$createComment("end ngSwitchWhen");
                            h.push({
                                clone: r
                            });
                            n.enter(r, f.parent(), f)
                        })
                    })
                })
            }
        }
    }
    ]
      , cb = bi({
        transclude: "element",
        priority: 1200,
        require: "^ngSwitch",
        multiElement: !0,
        link: function(n, t, i, r, u) {
            r.cases["!" + i.ngSwitchWhen] = r.cases["!" + i.ngSwitchWhen] || [];
            r.cases["!" + i.ngSwitchWhen].push({
                transclude: u,
                element: t
            })
        }
    })
      , lb = bi({
        transclude: "element",
        priority: 1200,
        require: "^ngSwitch",
        multiElement: !0,
        link: function(n, t, i, r, u) {
            r.cases["?"] = r.cases["?"] || [];
            r.cases["?"].push({
                transclude: u,
                element: t
            })
        }
    })
      , ab = l("ngTransclude")
      , vb = ["$compile", function(n) {
        return {
            restrict: "EAC",
            terminal: !0,
            compile: function(t) {
                var i = n(t.contents());
                return t.empty(),
                function(n, t, r, u, f) {
                    function e() {
                        i(n, function(n) {
                            t.append(n)
                        })
                    }
                    if (!f)
                        throw ab("orphan", vt(t));
                    r.ngTransclude === r.$attr.ngTransclude && (r.ngTransclude = "");
                    r = r.ngTransclude || r.ngTranscludeSlot;
                    f(function(n, i) {
                        n.length ? t.append(n) : (e(),
                        i.$destroy())
                    }, null, r);
                    r && !f.isSlotFilled(r) && e()
                }
            }
        }
    }
    ]
      , yb = ["$templateCache", function(n) {
        return {
            restrict: "E",
            terminal: !0,
            compile: function(t, i) {
                "text/ng-template" == i.type && n.put(i.id, t[0].text)
            }
        }
    }
    ]
      , pb = {
        $setViewValue: o,
        $render: o
    }
      , wb = ["$element", "$scope", function(t, i) {
        var r = this
          , f = new pi;
        r.ngModelCtrl = pb;
        r.unknownOption = e(n.document.createElement("option"));
        r.renderUnknownOption = function(n) {
            n = "? " + fi(n) + " ?";
            r.unknownOption.val(n);
            t.prepend(r.unknownOption);
            t.val(n)
        }
        ;
        i.$on("$destroy", function() {
            r.renderUnknownOption = o
        });
        r.removeUnknownOption = function() {
            r.unknownOption.parent() && r.unknownOption.remove()
        }
        ;
        r.readValue = function() {
            return r.removeUnknownOption(),
            t.val()
        }
        ;
        r.writeValue = function(n) {
            r.hasOption(n) ? (r.removeUnknownOption(),
            t.val(n),
            "" === n && r.emptyOption.prop("selected", !0)) : null == n && r.emptyOption ? (r.removeUnknownOption(),
            t.val("")) : r.renderUnknownOption(n)
        }
        ;
        r.addOption = function(n, t) {
            if (8 !== t[0].nodeType) {
                yi(n, '"option value"');
                "" === n && (r.emptyOption = t);
                var i = f.get(n) || 0;
                f.put(n, i + 1);
                r.ngModelCtrl.$render();
                t[0].hasAttribute("selected") && (t[0].selected = !0)
            }
        }
        ;
        r.removeOption = function(n) {
            var t = f.get(n);
            t && (1 === t ? (f.remove(n),
            "" === n && (r.emptyOption = void 0)) : f.put(n, t - 1))
        }
        ;
        r.hasOption = function(n) {
            return !!f.get(n)
        }
        ;
        r.registerOption = function(n, t, i, f, e) {
            if (f) {
                var o;
                i.$observe("value", function(n) {
                    u(o) && r.removeOption(o);
                    o = n;
                    r.addOption(n, t)
                })
            } else
                e ? n.$watch(e, function(n, u) {
                    i.$set("value", n);
                    u !== n && r.removeOption(u);
                    r.addOption(n, t)
                }) : r.addOption(i.value, t);
            t.on("$destroy", function() {
                r.removeOption(i.value);
                r.ngModelCtrl.$render()
            })
        }
    }
    ]
      , bb = function() {
        return {
            restrict: "E",
            require: ["select", "?ngModel"],
            controller: wb,
            priority: 1,
            link: {
                pre: function(n, i, r, f) {
                    var e = f[1], o, h, s;
                    if (e) {
                        o = f[0];
                        o.ngModelCtrl = e;
                        i.on("change", function() {
                            n.$apply(function() {
                                e.$setViewValue(o.readValue())
                            })
                        });
                        r.multiple && (o.readValue = function() {
                            var n = [];
                            return t(i.find("option"), function(t) {
                                t.selected && n.push(t.value)
                            }),
                            n
                        }
                        ,
                        o.writeValue = function(n) {
                            var r = new pi(n);
                            t(i.find("option"), function(n) {
                                n.selected = u(r.get(n.value))
                            })
                        }
                        ,
                        s = NaN,
                        n.$watch(function() {
                            s !== e.$viewValue || ot(h, e.$viewValue) || (h = st(e.$viewValue),
                            e.$render());
                            s = e.$viewValue
                        }),
                        e.$isEmpty = function(n) {
                            return !n || 0 === n.length
                        }
                        )
                    }
                },
                post: function(n, t, i, r) {
                    var u = r[1], f;
                    u && (f = r[0],
                    u.$render = function() {
                        f.writeValue(u.$viewValue)
                    }
                    )
                }
            }
        }
    }
      , kb = ["$interpolate", function(n) {
        return {
            restrict: "E",
            priority: 100,
            compile: function(t, i) {
                var f, r;
                return u(i.value) ? f = n(i.value, !0) : (r = n(t.text(), !0),
                r || i.$set("value", t.text())),
                function(n, t, i) {
                    var u = t.parent();
                    (u = u.data("$selectController") || u.parent().data("$selectController")) && u.registerOption(n, t, i, f, r)
                }
            }
        }
    }
    ]
      , db = ft({
        restrict: "E",
        terminal: !1
    })
      , vc = function() {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function(n, t, i, r) {
                r && (i.required = !0,
                r.$validators.required = function(n, t) {
                    return !i.required || !r.$isEmpty(t)
                }
                ,
                i.$observe("required", function() {
                    r.$validate()
                }))
            }
        }
    }
      , yc = function() {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function(n, t, i, u) {
                if (u) {
                    var f, e = i.ngPattern || i.pattern;
                    i.$observe("pattern", function(n) {
                        if (h(n) && 0 < n.length && (n = new RegExp("^" + n + "$")),
                        n && !n.test)
                            throw l("ngPattern")("noregexp", e, n, vt(t));
                        f = n || void 0;
                        u.$validate()
                    });
                    u.$validators.pattern = function(n, t) {
                        return u.$isEmpty(t) || r(f) || f.test(t)
                    }
                }
            }
        }
    }
      , pc = function() {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function(n, t, i, r) {
                if (r) {
                    var u = -1;
                    i.$observe("maxlength", function(n) {
                        n = tt(n);
                        u = isNaN(n) ? -1 : n;
                        r.$validate()
                    });
                    r.$validators.maxlength = function(n, t) {
                        return 0 > u || r.$isEmpty(t) || t.length <= u
                    }
                }
            }
        }
    }
      , wc = function() {
        return {
            restrict: "A",
            require: "?ngModel",
            link: function(n, t, i, r) {
                if (r) {
                    var u = 0;
                    i.$observe("minlength", function(n) {
                        u = tt(n) || 0;
                        r.$validate()
                    });
                    r.$validators.minlength = function(n, t) {
                        return r.$isEmpty(t) || t.length >= u
                    }
                }
            }
        }
    };
    n.angular.bootstrap ? n.console && console.log("WARNING: Tried to load angular more than once.") : (fl(),
    ol(ut),
    ut.module("ngLocale", [], ["$provide", function(n) {
        function t(n) {
            n += "";
            var t = n.indexOf(".");
            return -1 == t ? 0 : n.length - t - 1
        }
        n.value("$locale", {
            DATETIME_FORMATS: {
                AMPMS: ["AM", "PM"],
                DAY: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                ERANAMES: ["Before Christ", "Anno Domini"],
                ERAS: ["BC", "AD"],
                FIRSTDAYOFWEEK: 6,
                MONTH: "January February March April May June July August September October November December".split(" "),
                SHORTDAY: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
                SHORTMONTH: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
                STANDALONEMONTH: "January February March April May June July August September October November December".split(" "),
                WEEKENDRANGE: [5, 6],
                fullDate: "EEEE, MMMM d, y",
                longDate: "MMMM d, y",
                medium: "MMM d, y h:mm:ss a",
                mediumDate: "MMM d, y",
                mediumTime: "h:mm:ss a",
                short: "M/d/yy h:mm a",
                shortDate: "M/d/yy",
                shortTime: "h:mm a"
            },
            NUMBER_FORMATS: {
                CURRENCY_SYM: "$",
                DECIMAL_SEP: ".",
                GROUP_SEP: ",",
                PATTERNS: [{
                    gSize: 3,
                    lgSize: 3,
                    maxFrac: 3,
                    minFrac: 0,
                    minInt: 1,
                    negPre: "-",
                    negSuf: "",
                    posPre: "",
                    posSuf: ""
                }, {
                    gSize: 3,
                    lgSize: 3,
                    maxFrac: 2,
                    minFrac: 2,
                    minInt: 1,
                    negPre: "-¤",
                    negSuf: "",
                    posPre: "¤",
                    posSuf: ""
                }]
            },
            id: "en-us",
            localeID: "en_US",
            pluralCat: function(n, i) {
                var u = n | 0
                  , r = i;
                return void 0 === r && (r = Math.min(t(n), 3)),
                Math.pow(10, r),
                1 == u && 0 == r ? "one" : "other"
            }
        })
    }
    ]),
    e(n.document).ready(function() {
        il(n.document, no)
    }))
}(window);
window.angular.$$csp().noInlineStyle || window.angular.element(document.head).prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}.ng-animate-shim{visibility:hidden;}.ng-anchor{position:absolute;}<\/style>'),
function(n, t) {
    "use strict";
    function r(n, i, r) {
        return {
            restrict: "ECA",
            terminal: !0,
            priority: 400,
            transclude: "element",
            link: function(u, f, e, o, s) {
                function v() {
                    c && (r.cancel(c),
                    c = null);
                    h && (h.$destroy(),
                    h = null);
                    l && (c = r.leave(l),
                    c.then(function() {
                        c = null
                    }),
                    l = null)
                }
                function y() {
                    var e = n.current && n.current.locals, o;
                    t.isDefined(e && e.$template) ? (e = u.$new(),
                    o = n.current,
                    l = s(e, function(n) {
                        r.enter(n, null, l || f).then(function() {
                            t.isDefined(a) && (!a || u.$eval(a)) && i()
                        });
                        v()
                    }),
                    h = o.scope = e,
                    h.$emit("$viewContentLoaded"),
                    h.$eval(p)) : v()
                }
                var h, l, c, a = e.autoscroll, p = e.onload || "";
                u.$on("$routeChangeSuccess", y);
                y()
            }
        }
    }
    function u(n, t, i) {
        return {
            restrict: "ECA",
            priority: -400,
            link: function(r, u) {
                var f = i.current, e = f.locals, s, o;
                u.html(e.$template);
                s = n(u.contents());
                f.controller && (e.$scope = r,
                o = t(f.controller, e),
                f.controllerAs && (r[f.controllerAs] = o),
                u.data("$ngControllerController", o),
                u.children().data("$ngControllerController", o));
                r[f.resolveAs || "$resolve"] = e;
                s(r)
            }
        }
    }
    var f, e, i = t.module("ngRoute", ["ng"]).provider("$route", function() {
        function i(n, i) {
            return t.extend(Object.create(n), i)
        }
        function r(n, t) {
            var r = t.caseInsensitiveMatch
              , i = {
                originalPath: n,
                regexp: n
            }
              , u = i.keys = [];
            return n = n.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)(\*\?|[\?\*])?/g, function(n, t, i, r) {
                return n = "?" === r || "*?" === r ? "?" : null,
                r = "*" === r || "*?" === r ? "*" : null,
                u.push({
                    name: i,
                    optional: !!n
                }),
                t = t || "",
                "" + (n ? "" : t) + "(?:" + (n ? t : "") + (r && "(.+?)" || "([^/]+)") + (n || "") + ")" + (n || "")
            }).replace(/([\/$\*])/g, "\\$1"),
            i.regexp = new RegExp("^" + n + "$",r ? "i" : ""),
            i
        }
        f = t.isArray;
        e = t.isObject;
        var n = {};
        this.when = function(i, u) {
            var o, s, h;
            if (o = void 0,
            f(u))
                for (o = o || [],
                s = 0,
                h = u.length; s < h; s++)
                    o[s] = u[s];
            else if (e(u))
                for (s in o = o || {},
                u)
                    ("$" !== s.charAt(0) || "$" !== s.charAt(1)) && (o[s] = u[s]);
            return o = o || u,
            t.isUndefined(o.reloadOnSearch) && (o.reloadOnSearch = !0),
            t.isUndefined(o.caseInsensitiveMatch) && (o.caseInsensitiveMatch = this.caseInsensitiveMatch),
            n[i] = t.extend(o, i && r(i, o)),
            i && (s = "/" == i[i.length - 1] ? i.substr(0, i.length - 1) : i + "/",
            n[s] = t.extend({
                redirectTo: i
            }, r(s, o))),
            this
        }
        ;
        this.caseInsensitiveMatch = !1;
        this.otherwise = function(n) {
            return "string" == typeof n && (n = {
                redirectTo: n
            }),
            this.when(null, n),
            this
        }
        ;
        this.$get = ["$rootScope", "$location", "$routeParams", "$q", "$injector", "$templateRequest", "$sce", function(r, u, f, e, s, h, c) {
            function y(n) {
                var i = a.current;
                !(b = (l = g()) && i && l.$$route === i.$$route && t.equals(l.pathParams, i.pathParams) && !l.reloadOnSearch && !v) && (i || l) && r.$broadcast("$routeChangeStart", l, i).defaultPrevented && n && n.preventDefault()
            }
            function p() {
                var i = a.current
                  , n = l;
                b ? (i.params = n.params,
                t.copy(i.params, f),
                r.$broadcast("$routeUpdate", i)) : (n || i) && (v = !1,
                (a.current = n) && n.redirectTo && (t.isString(n.redirectTo) ? u.path(w(n.redirectTo, n.params)).search(n.params).replace() : u.url(n.redirectTo(n.pathParams, u.path(), u.search())).replace()),
                e.when(n).then(k).then(function(u) {
                    n == a.current && (n && (n.locals = u,
                    t.copy(n.params, f)),
                    r.$broadcast("$routeChangeSuccess", n, i))
                }, function(t) {
                    n == a.current && r.$broadcast("$routeChangeError", n, i, t)
                }))
            }
            function k(n) {
                if (n) {
                    var i = t.extend({}, n.resolve);
                    return t.forEach(i, function(n, r) {
                        i[r] = t.isString(n) ? s.get(n) : s.invoke(n, null, null, r)
                    }),
                    n = d(n),
                    t.isDefined(n) && (i.$template = n),
                    e.all(i)
                }
            }
            function d(n) {
                var r, i;
                return t.isDefined(r = n.template) ? t.isFunction(r) && (r = r(n.params)) : t.isDefined(i = n.templateUrl) && (t.isFunction(i) && (i = i(n.params)),
                t.isDefined(i) && (n.loadedTemplateUrl = c.valueOf(i),
                r = h(i))),
                r
            }
            function g() {
                var f, r;
                return t.forEach(n, function(n) {
                    var e, o, h, s, a, c, l;
                    if (e = !r) {
                        if (o = u.path(),
                        e = n.keys,
                        h = {},
                        n.regexp)
                            if (o = n.regexp.exec(o)) {
                                for (s = 1,
                                a = o.length; s < a; ++s)
                                    c = e[s - 1],
                                    l = o[s],
                                    c && l && (h[c.name] = l);
                                e = h
                            } else
                                e = null;
                        else
                            e = null;
                        e = f = e
                    }
                    e && (r = i(n, {
                        params: t.extend({}, u.search(), f),
                        pathParams: f
                    }),
                    r.$$route = n)
                }),
                r || n[null] && i(n[null], {
                    params: {},
                    pathParams: {}
                })
            }
            function w(n, i) {
                var r = [];
                return t.forEach((n || "").split(":"), function(n, t) {
                    if (0 === t)
                        r.push(n);
                    else {
                        var u = n.match(/(\w+)(?:[?*])?(.*)/)
                          , f = u[1];
                        r.push(i[f]);
                        r.push(u[2] || "");
                        delete i[f]
                    }
                }),
                r.join("")
            }
            var v = !1, l, b, a = {
                routes: n,
                reload: function() {
                    v = !0;
                    var n = {
                        defaultPrevented: !1,
                        preventDefault: function() {
                            this.defaultPrevented = !0;
                            v = !1
                        }
                    };
                    r.$evalAsync(function() {
                        y(n);
                        n.defaultPrevented || p()
                    })
                },
                updateParams: function(n) {
                    if (this.current && this.current.$$route)
                        n = t.extend({}, this.current.params, n),
                        u.path(w(this.current.$$route.originalPath, n)),
                        u.search(n);
                    else
                        throw o("norout");
                }
            };
            return r.$on("$locationChangeStart", y),
            r.$on("$locationChangeSuccess", p),
            a
        }
        ]
    }), o = t.$$minErr("ngRoute");
    i.provider("$routeParams", function() {
        this.$get = function() {
            return {}
        }
    });
    i.directive("ngView", r);
    i.directive("ngView", u);
    r.$inject = ["$route", "$anchorScroll", "$animate"];
    u.$inject = ["$compile", "$controller", "$route"]
}(window, window.angular),
function(n, t) {
    "use strict";
    function at(n, t, i) {
        if (!n)
            throw oi("areq", t || "?", i || "required");
        return n
    }
    function vt(n, t) {
        return !n && !t ? "" : n ? t ? (c(n) && (n = n.join(" ")),
        c(t) && (t = t.join(" ")),
        n + " " + t) : n : t
    }
    function ni(n) {
        var t = {};
        return n && (n.to || n.from) && (t.to = n.to,
        t.from = n.from),
        t
    }
    function s(n, t, r) {
        var u = "";
        return n = c(n) ? n : n && o(n) && n.length ? n.split(/\s+/) : [],
        i(n, function(n, i) {
            n && 0 < n.length && (u += 0 < i ? " " : "",
            u += r ? t + n : n + t)
        }),
        u
    }
    function ti(n) {
        if (n instanceof u)
            switch (n.length) {
            case 0:
                return n;
            case 1:
                if (1 === n[0].nodeType)
                    return n;
                break;
            default:
                return u(it(n))
            }
        if (1 === n.nodeType)
            return u(n)
    }
    function it(n) {
        var t, i;
        if (!n[0])
            return n;
        for (t = 0; t < n.length; t++)
            if (i = n[t],
            1 == i.nodeType)
                return i
    }
    function ii(n, t, r) {
        i(t, function(t) {
            n.addClass(t, r)
        })
    }
    function ri(n, t, r) {
        i(t, function(t) {
            n.removeClass(t, r)
        })
    }
    function v(n) {
        return function(t, i) {
            i.addClass && (ii(n, t, i.addClass),
            i.addClass = null);
            i.removeClass && (ri(n, t, i.removeClass),
            i.removeClass = null)
        }
    }
    function b(n) {
        if (n = n || {},
        !n.$$prepared) {
            var t = n.domOperation || f;
            n.domOperation = function() {
                n.$$domOperationFired = !0;
                t();
                t = f
            }
            ;
            n.$$prepared = !0
        }
        return n
    }
    function l(n, t) {
        yt(n, t);
        pt(n, t)
    }
    function yt(n, t) {
        t.from && (n.css(t.from),
        t.from = null)
    }
    function pt(n, t) {
        t.to && (n.css(t.to),
        t.to = null)
    }
    function y(n, t, i) {
        var r = t.options || {}, u, e;
        return i = i.options || {},
        u = (r.addClass || "") + " " + (i.addClass || ""),
        e = (r.removeClass || "") + " " + (i.removeClass || ""),
        n = ui(n.attr("class"), u, e),
        i.preparationClasses && (r.preparationClasses = d(i.preparationClasses, r.preparationClasses),
        delete i.preparationClasses),
        u = r.domOperation !== f ? r.domOperation : null,
        ht(r, i),
        u && (r.domOperation = u),
        r.addClass = n.addClass ? n.addClass : null,
        r.removeClass = n.removeClass ? n.removeClass : null,
        t.addClass = r.addClass,
        t.removeClass = r.removeClass,
        r
    }
    function ui(n, t, r) {
        function e(n) {
            o(n) && (n = n.split(" "));
            var t = {};
            return i(n, function(n) {
                n.length && (t[n] = !0)
            }),
            t
        }
        var f = {}, u;
        return n = e(n),
        t = e(t),
        i(t, function(n, t) {
            f[t] = 1
        }),
        r = e(r),
        i(r, function(n, t) {
            f[t] = 1 === f[t] ? null : -1
        }),
        u = {
            addClass: "",
            removeClass: ""
        },
        i(f, function(t, i) {
            var r, f;
            1 === t ? (r = "addClass",
            f = !n[i] || n[i + "-remove"]) : -1 === t && (r = "removeClass",
            f = n[i] || n[i + "-add"]);
            f && (u[r].length && (u[r] += " "),
            u[r] += i)
        }),
        u
    }
    function r(n) {
        return n instanceof u ? n[0] : n
    }
    function fi(n, t, i) {
        var r = "";
        t && (r = s(t, "ng-", !0));
        i.addClass && (r = d(r, s(i.addClass, "-add")));
        i.removeClass && (r = d(r, s(i.removeClass, "-remove")));
        r.length && (i.preparationClasses = r,
        n.addClass(r))
    }
    function k(n, t) {
        var i = t ? "-" + t + "s" : "";
        return p(n, [w, i]),
        [w, i]
    }
    function rt(n, t) {
        var i = t ? "paused" : ""
          , r = h + "PlayState";
        return p(n, [r, i]),
        [r, i]
    }
    function p(n, t) {
        n.style[t[0]] = t[1]
    }
    function d(n, t) {
        return n ? t ? n + " " + t : n : t
    }
    function wt(n, t, r) {
        var u = Object.create(null)
          , f = n.getComputedStyle(t) || {};
        return i(r, function(n, t) {
            var i = f[n], r;
            i && (r = i.charAt(0),
            ("-" === r || "+" === r || 0 <= r) && (i = ei(i)),
            0 === i && (i = null),
            u[t] = i)
        }),
        u
    }
    function ei(n) {
        var t = 0;
        return n = n.split(/\s*,\s*/),
        i(n, function(n) {
            "s" == n.charAt(n.length - 1) && (n = n.substring(0, n.length - 1));
            n = parseFloat(n) || 0;
            t = t ? Math.max(n, t) : n
        }),
        t
    }
    function ut(n) {
        return 0 === n || null != n
    }
    function bt(n, t) {
        var i = e
          , r = n + "s";
        return t ? i += "Duration" : r += " linear all",
        [i, r]
    }
    function kt() {
        var n = Object.create(null);
        return {
            flush: function() {
                n = Object.create(null)
            },
            count: function(t) {
                return (t = n[t]) ? t.total : 0
            },
            get: function(t) {
                return (t = n[t]) && t.value
            },
            put: function(t, i) {
                n[t] ? n[t].total++ : n[t] = {
                    total: 1,
                    value: i
                }
            }
        }
    }
    function dt(n, t, r) {
        i(r, function(i) {
            n[i] = ct(n[i]) ? n[i] : t.style.getPropertyValue(i)
        })
    }
    var e, ft, h, et;
    void 0 === n.ontransitionend && void 0 !== n.onwebkittransitionend ? (e = "WebkitTransition",
    ft = "webkitTransitionEnd transitionend") : (e = "transition",
    ft = "transitionend");
    void 0 === n.onanimationend && void 0 !== n.onwebkitanimationend ? (h = "WebkitAnimation",
    et = "webkitAnimationEnd animationend") : (h = "animation",
    et = "animationend");
    var g = h + "Delay", ot = h + "Duration", w = e + "Delay", gt = e + "Duration", oi = t.$$minErr("ng"), si = {
        transitionDuration: gt,
        transitionDelay: w,
        transitionProperty: e + "Property",
        animationDuration: ot,
        animationDelay: g,
        animationIterationCount: h + "IterationCount"
    }, hi = {
        transitionDuration: gt,
        transitionDelay: w,
        animationDuration: ot,
        animationDelay: g
    }, st, ht, i, c, ct, nt, lt, tt, o, a, u, f;
    t.module("ngAnimate", [], function() {
        f = t.noop;
        st = t.copy;
        ht = t.extend;
        u = t.element;
        i = t.forEach;
        c = t.isArray;
        o = t.isString;
        tt = t.isObject;
        a = t.isUndefined;
        ct = t.isDefined;
        lt = t.isFunction;
        nt = t.isElement
    }).directive("ngAnimateSwap", ["$animate", "$rootScope", function(n) {
        return {
            restrict: "A",
            transclude: "element",
            terminal: !0,
            priority: 600,
            link: function(t, i, r, u, f) {
                var o, e;
                t.$watchCollection(r.ngAnimateSwap || r["for"], function(r) {
                    o && n.leave(o);
                    e && (e.$destroy(),
                    e = null);
                    (r || 0 === r) && (e = t.$new(),
                    f(e, function(t) {
                        o = t;
                        n.enter(t, null, i)
                    }))
                })
            }
        }
    }
    ]).directive("ngAnimateChildren", ["$interpolate", function(n) {
        return {
            link: function(t, i, r) {
                function f(n) {
                    i.data("$$ngAnimateChildren", "on" === n || "true" === n)
                }
                var u = r.ngAnimateChildren;
                o(u) && 0 === u.length ? i.data("$$ngAnimateChildren", !0) : (f(n(u)(t)),
                r.$observe("ngAnimateChildren", f))
            }
        }
    }
    ]).factory("$$rAFScheduler", ["$$rAF", function(n) {
        function r(n) {
            i = i.concat(n);
            u()
        }
        function u() {
            if (i.length) {
                for (var f = i.shift(), r = 0; r < f.length; r++)
                    f[r]();
                t || n(function() {
                    t || u()
                })
            }
        }
        var i, t;
        return i = r.queue = [],
        r.waitUntilQuiet = function(i) {
            t && t();
            t = n(function() {
                t = null;
                i();
                u()
            })
        }
        ,
        r
    }
    ]).provider("$$animateQueue", ["$animateProvider", function(t) {
        function p(n) {
            if (!n)
                return null;
            n = n.split(" ");
            var t = Object.create(null);
            return i(n, function(n) {
                t[n] = !0
            }),
            t
        }
        function h(n, t) {
            if (n && t) {
                var i = p(t);
                return n.split(" ").some(function(n) {
                    return i[n]
                })
            }
        }
        function s(n, t, i, r) {
            return f[n].some(function(n) {
                return n(t, i, r)
            })
        }
        function e(n, t) {
            var i = 0 < (n.addClass || "").length
              , r = 0 < (n.removeClass || "").length;
            return t ? i && r : i || r
        }
        var f = this.rules = {
            skip: [],
            cancel: [],
            join: []
        };
        f.join.push(function(n, t) {
            return !t.structural && e(t)
        });
        f.skip.push(function(n, t) {
            return !t.structural && !e(t)
        });
        f.skip.push(function(n, t, i) {
            return "leave" == i.event && t.structural
        });
        f.skip.push(function(n, t, i) {
            return i.structural && 2 === i.state && !t.structural
        });
        f.cancel.push(function(n, t, i) {
            return i.structural && t.structural
        });
        f.cancel.push(function(n, t, i) {
            return 2 === i.state && t.structural
        });
        f.cancel.push(function(n, t, i) {
            if (i.structural)
                return !1;
            n = t.addClass;
            t = t.removeClass;
            var r = i.addClass;
            return i = i.removeClass,
            a(n) && a(t) || a(r) && a(i) ? !1 : h(n, i) || h(t, r)
        });
        this.$get = ["$$rAF", "$rootScope", "$rootElement", "$document", "$$HashMap", "$$animation", "$$AnimateRunner", "$templateRequest", "$$jqLite", "$$forceReflow", function(f, h, p, w, k, d, g, rt, ut) {
            function ni() {
                var n = !1;
                return function(t) {
                    n ? t() : h.$$postDigest(function() {
                        n = !0;
                        t()
                    })
                }
            }
            function ii(n, t, u) {
                var e = r(t)
                  , o = r(n)
                  , f = [];
                return (n = et[u]) && i(n, function(n) {
                    gt.call(n.node, e) ? f.push(n.callback) : "leave" === u && gt.call(n.node, o) && f.push(n.callback)
                }),
                f
            }
            function wt(n, t, i) {
                var r = it(t);
                return n.filter(function(n) {
                    return !(n.node === r && (!i || n.callback === i))
                })
            }
            function ri(n, t, u) {
                function rt(t, r, u, e) {
                    at(function() {
                        var t = ii(ct, n, r);
                        t.length ? f(function() {
                            i(t, function(t) {
                                t(n, u, e)
                            });
                            "close" !== u || n[0].parentNode || yt.off(n)
                        }) : "close" !== u || n[0].parentNode || yt.off(n)
                    });
                    t.progress(r, u, e)
                }
                function nt(t) {
                    var r = n
                      , i = a;
                    i.preparationClasses && (r.removeClass(i.preparationClasses),
                    i.preparationClasses = null);
                    i.activeClasses && (r.removeClass(i.activeClasses),
                    i.activeClasses = null);
                    dt(n, a);
                    l(n, a);
                    a.domOperation();
                    p.complete(!t)
                }
                var a = st(u), k, ct, it, ht;
                (n = ti(n)) && (k = r(n),
                ct = n.parent());
                var a = b(a)
                  , p = new g
                  , at = ni();
                if ((c(a.addClass) && (a.addClass = a.addClass.join(" ")),
                a.addClass && !o(a.addClass) && (a.addClass = null),
                c(a.removeClass) && (a.removeClass = a.removeClass.join(" ")),
                a.removeClass && !o(a.removeClass) && (a.removeClass = null),
                a.from && !tt(a.from) && (a.from = null),
                a.to && !tt(a.to) && (a.to = null),
                !k) || (u = [k.className, a.addClass, a.removeClass].join(" "),
                !si(u)))
                    return nt(),
                    p;
                var ut = 0 <= ["enter", "move", "leave"].indexOf(t)
                  , v = w[0].hidden
                  , et = !lt || v || ot.get(k);
                if (u = !et && ft.get(k) || {},
                it = !!u.state,
                et || it && 1 == u.state || (et = !ei(n, ct, t)),
                et)
                    return v && rt(p, t, "start"),
                    nt(),
                    v && rt(p, t, "close"),
                    p;
                if (ut && ui(n),
                v = {
                    structural: ut,
                    element: n,
                    event: t,
                    addClass: a.addClass,
                    removeClass: a.removeClass,
                    close: nt,
                    options: a,
                    runner: p
                },
                it) {
                    if (s("skip", n, v, u))
                        return 2 === u.state ? (nt(),
                        p) : (y(n, u, v),
                        u.runner);
                    if (s("cancel", n, v, u))
                        if (2 === u.state)
                            u.runner.end();
                        else if (u.structural)
                            u.close();
                        else
                            return y(n, u, v),
                            u.runner;
                    else if (s("join", n, v, u))
                        if (2 === u.state)
                            y(n, v, {});
                        else
                            return fi(n, ut ? t : null, a),
                            t = v.event = u.event,
                            a = y(n, u, v),
                            u.runner
                } else
                    y(n, v, {});
                return ((it = v.structural) || (it = "animate" === v.event && 0 < Object.keys(v.options.to || {}).length || e(v)),
                !it) ? (nt(),
                pt(n),
                p) : (ht = (u.counter || 0) + 1,
                v.counter = ht,
                bt(n, 1, v),
                h.$$postDigest(function() {
                    var i = ft.get(k)
                      , u = !i
                      , i = i || {}
                      , f = 0 < (n.parent() || []).length && ("animate" === i.event || i.structural || e(i));
                    u || i.counter !== ht || !f ? (u && (dt(n, a),
                    l(n, a)),
                    (u || ut && i.event !== t) && (a.domOperation(),
                    p.end()),
                    f || pt(n)) : (t = !i.structural && e(i, !0) ? "setClass" : i.event,
                    bt(n, 2),
                    i = d(n, t, i.options),
                    p.setHost(i),
                    rt(p, t, "start", {}),
                    i.done(function(i) {
                        nt(!i);
                        (i = ft.get(k)) && i.counter === ht && pt(r(n));
                        rt(p, t, "close", {})
                    }))
                }),
                p)
            }
            function ui(n) {
                n = r(n).querySelectorAll("[data-ng-animate]");
                i(n, function(n) {
                    var i = parseInt(n.getAttribute("data-ng-animate"))
                      , t = ft.get(n);
                    if (t)
                        switch (i) {
                        case 2:
                            t.runner.end();
                        case 1:
                            ft.remove(n)
                        }
                })
            }
            function pt(n) {
                n = r(n);
                n.removeAttribute("data-ng-animate");
                ft.remove(n)
            }
            function vt(n, t) {
                return r(n) === r(t)
            }
            function ei(n, t, i) {
                var c;
                i = u(w[0].body);
                var o = vt(n, i) || "HTML" === n[0].nodeName, f = vt(n, p), s = !1, e, h = ot.get(r(n));
                for ((n = u.data(n[0], "$ngAnimatePin")) && (t = n),
                t = r(t); t; ) {
                    if (f || (f = vt(t, p)),
                    1 !== t.nodeType)
                        break;
                    if (n = ft.get(t) || {},
                    !s) {
                        if (c = ot.get(t),
                        !0 === c && !1 !== h) {
                            h = !0;
                            break
                        } else
                            !1 === c && (h = !1);
                        s = n.structural
                    }
                    if ((a(e) || !0 === e) && (n = u.data(t, "$$ngAnimateChildren"),
                    ct(n) && (e = n)),
                    s && !1 === e)
                        break;
                    if (o || (o = vt(t, i)),
                    o && f)
                        break;
                    if (!f && (n = u.data(t, "$ngAnimatePin"))) {
                        t = r(n);
                        continue
                    }
                    t = t.parentNode
                }
                return (!s || e) && !0 !== h && f && o
            }
            function bt(n, t, i) {
                i = i || {};
                i.state = t;
                n = r(n);
                n.setAttribute("data-ng-animate", t);
                i = (t = ft.get(n)) ? ht(t, i) : i;
                ft.put(n, i)
            }
            var ft = new k
              , ot = new k
              , lt = null
              , oi = h.$watch(function() {
                return 0 === rt.totalPendingRequests
            }, function(n) {
                n && (oi(),
                h.$$postDigest(function() {
                    h.$$postDigest(function() {
                        null === lt && (lt = !0)
                    })
                }))
            })
              , et = Object.create(null)
              , kt = t.classNameFilter()
              , si = kt ? function(n) {
                return kt.test(n)
            }
            : function() {
                return !0
            }
              , dt = v(ut)
              , gt = n.Node.prototype.contains || function(n) {
                return this === n || !!(this.compareDocumentPosition(n) & 16)
            }
              , yt = {
                on: function(n, t, i) {
                    var r = it(t);
                    et[n] = et[n] || [];
                    et[n].push({
                        node: r,
                        callback: i
                    });
                    u(t).on("$destroy", function() {
                        ft.get(r) || yt.off(n, t, i)
                    })
                },
                off: function(n, t, i) {
                    if (1 !== arguments.length || o(arguments[0])) {
                        var r = et[n];
                        r && (et[n] = 1 === arguments.length ? null : wt(r, t, i))
                    } else
                        for (r in t = arguments[0],
                        et)
                            et[r] = wt(et[r], t)
                },
                pin: function(n, t) {
                    at(nt(n), "element", "not an element");
                    at(nt(t), "parentElement", "not an element");
                    n.data("$ngAnimatePin", t)
                },
                push: function(n, t, i, r) {
                    return i = i || {},
                    i.domOperation = r,
                    ri(n, t, i)
                },
                enabled: function(n, t) {
                    var u = arguments.length, i;
                    return 0 === u ? t = !!lt : nt(n) ? (i = r(n),
                    1 === u ? t = !ot.get(i) : ot.put(i, !t)) : t = lt = !!n,
                    t
                }
            };
            return yt
        }
        ]
    }
    ]).provider("$$animation", ["$animateProvider", function() {
        var n = this.drivers = [];
        this.$get = ["$$jqLite", "$rootScope", "$injector", "$$AnimateRunner", "$$HashMap", "$$rAFScheduler", function(t, f, e, o, s, h) {
            function a(n) {
                function u(n) {
                    var e, t, i;
                    if (n.processed)
                        return n;
                    for (n.processed = !0,
                    e = n.domNode,
                    t = e.parentNode,
                    r.put(e, n); t; ) {
                        if (i = r.get(t)) {
                            i.processed || (i = u(i));
                            break
                        }
                        t = t.parentNode
                    }
                    return (i || f).children.push(n),
                    n
                }
                for (var f = {
                    children: []
                }, r = new s, i, t = 0; t < n.length; t++)
                    i = n[t],
                    r.put(i.domNode, n[t] = {
                        domNode: i.domNode,
                        fn: i.fn,
                        children: []
                    });
                for (t = 0; t < n.length; t++)
                    u(n[t]);
                return function(n) {
                    for (var f = [], r = [], u, i, e, t = 0; t < n.children.length; t++)
                        r.push(n.children[t]);
                    for (n = r.length,
                    u = 0,
                    i = [],
                    t = 0; t < r.length; t++)
                        e = r[t],
                        0 >= n && (n = u,
                        u = 0,
                        f.push(i),
                        i = []),
                        i.push(e.fn),
                        e.children.forEach(function(n) {
                            u++;
                            r.push(n)
                        }),
                        n--;
                    return i.length && f.push(i),
                    f
                }(f)
            }
            var c = []
              , y = v(t);
            return function(s, v, p) {
                function rt(n) {
                    n = n.hasAttribute("ng-animate-ref") ? [n] : n.querySelectorAll("[ng-animate-ref]");
                    var t = [];
                    return i(n, function(n) {
                        var i = n.getAttribute("ng-animate-ref");
                        i && i.length && t.push(n)
                    }),
                    t
                }
                function ut(n) {
                    var t = [], f = {}, o, e;
                    return i(n, function(n, e) {
                        var o = r(n.element), h = 0 <= ["enter", "move"].indexOf(n.event), o = n.structural ? rt(o) : [], s;
                        o.length ? (s = h ? "to" : "from",
                        i(o, function(n) {
                            var t = n.getAttribute("ng-animate-ref");
                            f[t] = f[t] || {};
                            f[t][s] = {
                                animationID: e,
                                element: u(n)
                            }
                        })) : t.push(n)
                    }),
                    o = {},
                    e = {},
                    i(f, function(i) {
                        var r = i.from, u = i.to, c;
                        if (r && u) {
                            var f = n[r.animationID]
                              , s = n[u.animationID]
                              , h = r.animationID.toString();
                            e[h] || (c = e[h] = {
                                structural: !0,
                                beforeStart: function() {
                                    f.beforeStart();
                                    s.beforeStart()
                                },
                                close: function() {
                                    f.close();
                                    s.close()
                                },
                                classes: ft(f.classes, s.classes),
                                from: f,
                                to: s,
                                anchors: []
                            },
                            c.classes.length ? t.push(c) : (t.push(f),
                            t.push(s)));
                            e[h].anchors.push({
                                out: r.element,
                                "in": u.element
                            })
                        } else
                            r = r ? r.animationID : u.animationID,
                            u = r.toString(),
                            o[u] || (o[u] = !0,
                            t.push(n[r]))
                    }),
                    t
                }
                function ft(n, t) {
                    var f, i, r, u;
                    for (n = n.split(" "),
                    t = t.split(" "),
                    f = [],
                    i = 0; i < n.length; i++)
                        if (r = n[i],
                        "ng-" !== r.substring(0, 3))
                            for (u = 0; u < t.length; u++)
                                if (r === t[u]) {
                                    f.push(r);
                                    break
                                }
                    return f.join(" ")
                }
                function et(t) {
                    for (var r, i = n.length - 1; 0 <= i; i--)
                        if (r = e.get(n[i])(t),
                        r)
                            return r
                }
                function ot(n, t) {
                    function i(n) {
                        (n = n.data("$$animationRunner")) && n.setHost(t)
                    }
                    n.from && n.to ? (i(n.from.element),
                    i(n.to.element)) : i(n.element)
                }
                function it() {
                    var n = s.data("$$animationRunner");
                    !n || "leave" === v && p.$$domOperationFired || n.end()
                }
                function g(n) {
                    s.off("$destroy", it);
                    s.removeData("$$animationRunner");
                    y(s, p);
                    l(s, p);
                    p.domOperation();
                    w && t.removeClass(s, w);
                    s.removeClass("ng-animate");
                    k.complete(!n)
                }
                var nt, k, tt, w, d;
                if (p = b(p),
                nt = 0 <= ["enter", "move", "leave"].indexOf(v),
                k = new o({
                    end: function() {
                        g()
                    },
                    cancel: function() {
                        g(!0)
                    }
                }),
                !n.length)
                    return g(),
                    k;
                s.data("$$animationRunner", k);
                tt = vt(s.attr("class"), vt(p.addClass, p.removeClass));
                w = p.tempClasses;
                w && (tt += " " + w,
                p.tempClasses = null);
                nt && (d = "ng-" + v + "-prepare",
                t.addClass(s, d));
                c.push({
                    element: s,
                    classes: tt,
                    event: v,
                    structural: nt,
                    options: p,
                    beforeStart: function() {
                        s.addClass("ng-animate");
                        w && t.addClass(s, w);
                        d && (t.removeClass(s, d),
                        d = null)
                    },
                    close: g
                });
                s.on("$destroy", it);
                return 1 < c.length ? k : (f.$$postDigest(function() {
                    var t = [], u, n;
                    i(c, function(n) {
                        n.element.data("$$animationRunner") ? t.push(n) : n.close()
                    });
                    c.length = 0;
                    u = ut(t);
                    n = [];
                    i(u, function(t) {
                        n.push({
                            domNode: r(t.from ? t.from.element : t.element),
                            fn: function() {
                                var n, i, r;
                                t.beforeStart();
                                i = t.close;
                                (t.anchors ? t.from.element || t.to.element : t.element).data("$$animationRunner") && (r = et(t),
                                r && (n = r.start));
                                n ? (n = n(),
                                n.done(function(n) {
                                    i(!n)
                                }),
                                ot(t, n)) : i()
                            }
                        })
                    });
                    h(a(n))
                }),
                k)
            }
        }
        ]
    }
    ]).provider("$animateCss", ["$animateProvider", function() {
        var n = kt()
          , t = kt();
        this.$get = ["$window", "$$jqLite", "$$AnimateRunner", "$timeout", "$$forceReflow", "$sniffer", "$$rAFScheduler", "$$animateQueue", function(u, o, a, y, d, nt, tt, it) {
            function lt(n, t) {
                var i = n.parentNode;
                return (i.$$ngAnimateParentKey || (i.$$ngAnimateParentKey = ++gt)) + "-" + n.getAttribute("class") + "-" + t
            }
            function kt(i, r, f, e) {
                var h;
                return 0 < n.count(f) && (h = t.get(f),
                h || (r = s(r, "-stagger"),
                o.addClass(i, r),
                h = wt(u, i, e),
                h.animationDuration = Math.max(h.animationDuration, 0),
                h.transitionDuration = Math.max(h.transitionDuration, 0),
                o.removeClass(i, r),
                t.put(f, h))),
                h || {}
            }
            function at(i) {
                ht.push(i);
                tt.waitUntilQuiet(function() {
                    n.flush();
                    t.flush();
                    for (var r = d(), i = 0; i < ht.length; i++)
                        ht[i](r);
                    ht.length = 0
                })
            }
            function vt(t, i, r) {
                return i = n.get(r),
                i || (i = wt(u, t, si),
                "infinite" === i.animationIterationCount && (i.animationIterationCount = 1)),
                n.put(r, i),
                t = i,
                r = t.animationDelay,
                i = t.transitionDelay,
                t.maxDelay = r && i ? Math.max(r, i) : r || i,
                t.maxDuration = Math.max(t.animationDuration * t.animationIterationCount, t.transitionDuration),
                t
            }
            var ct = v(o)
              , gt = 0
              , ht = [];
            return function(t, u) {
                function ki() {
                    ii()
                }
                function or() {
                    ii(!0)
                }
                function ii(n) {
                    if (!(wi || rr && ei)) {
                        wi = !0;
                        ei = !1;
                        v.$$skipPreparationClasses || o.removeClass(t, ci);
                        o.removeClass(t, cr);
                        rt(tt, !1);
                        k(tt, !1);
                        i(gt, function(n) {
                            tt.style[n[0]] = ""
                        });
                        ct(t, v);
                        l(t, v);
                        Object.keys(pi).length && i(pi, function(n, t) {
                            n ? tt.style.setProperty(t, n) : tt.style.removeProperty(t)
                        });
                        v.onDone && v.onDone();
                        oi && oi.length && t.off(oi.join(" "), hr);
                        var r = t.data("$$animateCss");
                        r && (y.cancel(r[0].timer),
                        t.removeData("$$animateCss"));
                        li && li.complete(!n)
                    }
                }
                function sr(n) {
                    d.blockTransition && k(tt, n);
                    d.blockKeyframeAnimation && rt(tt, !!n)
                }
                function di() {
                    return li = new a({
                        end: ki,
                        cancel: or
                    }),
                    at(f),
                    ii(),
                    {
                        $$willAnimate: !1,
                        start: function() {
                            return li
                        },
                        end: ki
                    }
                }
                function hr(n) {
                    n.stopPropagation();
                    var t = n.originalEvent || n;
                    n = t.$manualTimeStamp || Date.now();
                    t = parseFloat(t.elapsedTime.toFixed(3));
                    Math.max(n - fr, 0) >= tr && t >= ti && (rr = !0,
                    ii())
                }
                function lr() {
                    function n() {
                        var r, u, n, s, c;
                        if (!wi) {
                            if (sr(!1),
                            i(gt, function(n) {
                                tt.style[n[0]] = n[1]
                            }),
                            ct(t, v),
                            o.addClass(t, cr),
                            d.recalculateTimingStyles) {
                                if (bi = tt.className + " " + ci,
                                yi = lt(tt, bi),
                                ht = vt(tt, bi, yi),
                                ui = ht.maxDelay,
                                ai = Math.max(ui, 0),
                                ti = ht.maxDuration,
                                0 === ti) {
                                    ii();
                                    return
                                }
                                d.hasTransitions = 0 < ht.transitionDuration;
                                d.hasAnimations = 0 < ht.animationDuration
                            }
                            if (d.applyAnimationDelay && (ui = "boolean" != typeof v.delay && ut(v.delay) ? parseFloat(v.delay) : ui,
                            ai = Math.max(ui, 0),
                            ht.animationDelay = ui,
                            fi = [g, ui + "s"],
                            gt.push(fi),
                            tt.style[fi[0]] = fi[1]),
                            tr = 1e3 * ai,
                            ur = 1e3 * ti,
                            v.easing && (n = v.easing,
                            d.hasTransitions && (r = e + "TimingFunction",
                            gt.push([r, n]),
                            tt.style[r] = n),
                            d.hasAnimations && (r = h + "TimingFunction",
                            gt.push([r, n]),
                            tt.style[r] = n)),
                            ht.transitionDuration && oi.push(ft),
                            ht.animationDuration && oi.push(et),
                            fr = Date.now(),
                            u = tr + 1.5 * ur,
                            r = fr + u,
                            n = t.data("$$animateCss") || [],
                            s = !0,
                            n.length && (c = n[0],
                            (s = r > c.expectedEndTime) ? y.cancel(c.timer) : n.push(ii)),
                            s && (u = y(f, u, !1),
                            n[0] = {
                                timer: u,
                                expectedEndTime: r
                            },
                            n.push(ii),
                            t.data("$$animateCss", n)),
                            oi.length)
                                t.on(oi.join(" "), hr);
                            v.to && (v.cleanupStyles && dt(pi, tt, Object.keys(v.to)),
                            pt(t, v))
                        }
                    }
                    function f() {
                        var i = t.data("$$animateCss"), n;
                        if (i) {
                            for (n = 1; n < i.length; n++)
                                i[n]();
                            t.removeData("$$animateCss")
                        }
                    }
                    if (!wi)
                        if (tt.parentNode) {
                            var r = function(n) {
                                if (rr)
                                    ei && n && (ei = !1,
                                    ii());
                                else if (ei = !n,
                                ht.animationDuration)
                                    if (n = rt(tt, ei),
                                    ei)
                                        gt.push(n);
                                    else {
                                        var t = gt
                                          , i = t.indexOf(n);
                                        0 <= n && t.splice(i, 1)
                                    }
                            }
                              , u = 0 < ir && (ht.transitionDuration && 0 === ri.transitionDuration || ht.animationDuration && 0 === ri.animationDuration) && Math.max(ri.animationDelay, ri.transitionDelay);
                            u ? y(n, Math.floor(u * ir * 1e3), !1) : n();
                            nr.resume = function() {
                                r(!0)
                            }
                            ;
                            nr.pause = function() {
                                r(!1)
                            }
                        } else
                            ii()
                }
                var v = u || {}, pi, tt, yi, ri, ir, ht, ui, d, fi;
                if (v.$$prepared || (v = b(st(v))),
                pi = {},
                tt = r(t),
                !tt || !tt.parentNode || !it.enabled())
                    return di();
                var gt = [], gi = t.attr("class"), wt = ni(v), wi, ei, rr, li, nr, ai, tr, ti, ur, fr, oi = [];
                if (0 === v.duration || !nt.animations && !nt.transitions)
                    return di();
                var vi = v.event && c(v.event) ? v.event.join(" ") : v.event
                  , er = ""
                  , si = "";
                vi && v.structural ? er = s(vi, "ng-", !0) : vi && (er = vi);
                v.addClass && (si += s(v.addClass, "-add"));
                v.removeClass && (si.length && (si += " "),
                si += s(v.removeClass, "-remove"));
                v.applyClassesEarly && si.length && ct(t, v);
                var ci = [er, si].join(" ").trim()
                  , bi = gi + " " + ci
                  , cr = s(ci, "-active")
                  , gi = wt.to && 0 < Object.keys(wt.to).length;
                return (0 < (v.keyframeStyle || "").length || gi || ci) ? (0 < v.stagger ? (wt = parseFloat(v.stagger),
                ri = {
                    transitionDelay: wt,
                    animationDelay: wt,
                    transitionDuration: 0,
                    animationDuration: 0
                }) : (yi = lt(tt, bi),
                ri = kt(tt, ci, yi, hi)),
                v.$$skipPreparationClasses || o.addClass(t, ci),
                v.transitionStyle && (wt = [e, v.transitionStyle],
                p(tt, wt),
                gt.push(wt)),
                0 <= v.duration && (wt = 0 < tt.style[e].length,
                wt = bt(v.duration, wt),
                p(tt, wt),
                gt.push(wt)),
                v.keyframeStyle && (wt = [h, v.keyframeStyle],
                p(tt, wt),
                gt.push(wt)),
                ir = ri ? 0 <= v.staggerIndex ? v.staggerIndex : n.count(yi) : 0,
                (vi = 0 === ir) && !v.skipBlocking && k(tt, 9999),
                ht = vt(tt, bi, yi),
                ui = ht.maxDelay,
                ai = Math.max(ui, 0),
                ti = ht.maxDuration,
                d = {},
                d.hasTransitions = 0 < ht.transitionDuration,
                d.hasAnimations = 0 < ht.animationDuration,
                d.hasTransitionAll = d.hasTransitions && "all" == ht.transitionProperty,
                d.applyTransitionDuration = gi && (d.hasTransitions && !d.hasTransitionAll || d.hasAnimations && !d.hasTransitions),
                d.applyAnimationDuration = v.duration && d.hasAnimations,
                d.applyTransitionDelay = ut(v.delay) && (d.applyTransitionDuration || d.hasTransitions),
                d.applyAnimationDelay = ut(v.delay) && d.hasAnimations,
                d.recalculateTimingStyles = 0 < si.length,
                (d.applyTransitionDuration || d.applyAnimationDuration) && (ti = v.duration ? parseFloat(v.duration) : ti,
                d.applyTransitionDuration && (d.hasTransitions = !0,
                ht.transitionDuration = ti,
                wt = 0 < tt.style[e + "Property"].length,
                gt.push(bt(ti, wt))),
                d.applyAnimationDuration && (d.hasAnimations = !0,
                ht.animationDuration = ti,
                gt.push([ot, ti + "s"]))),
                0 === ti && !d.recalculateTimingStyles) ? di() : (null != v.delay && ("boolean" != typeof v.delay && (fi = parseFloat(v.delay),
                ai = Math.max(fi, 0)),
                d.applyTransitionDelay && gt.push([w, fi + "s"]),
                d.applyAnimationDelay && gt.push([g, fi + "s"])),
                null == v.duration && 0 < ht.transitionDuration && (d.recalculateTimingStyles = d.recalculateTimingStyles || vi),
                tr = 1e3 * ai,
                ur = 1e3 * ti,
                v.skipBlocking || (d.blockTransition = 0 < ht.transitionDuration,
                d.blockKeyframeAnimation = 0 < ht.animationDuration && 0 < ri.animationDelay && 0 === ri.animationDuration),
                v.from && (v.cleanupStyles && dt(pi, tt, Object.keys(v.from)),
                yt(t, v)),
                d.blockTransition || d.blockKeyframeAnimation ? sr(ti) : v.skipBlocking || k(tt, !1),
                {
                    $$willAnimate: !0,
                    end: ki,
                    start: function() {
                        if (!wi)
                            return nr = {
                                end: ki,
                                cancel: or,
                                resume: null,
                                pause: null
                            },
                            li = new a(nr),
                            at(lr),
                            li
                    }
                }) : di()
            }
        }
        ]
    }
    ]).provider("$$animateCssDriver", ["$$animationProvider", function(n) {
        n.drivers.push("$$animateCssDriver");
        this.$get = ["$animateCss", "$rootScope", "$$AnimateRunner", "$rootElement", "$sniffer", "$$jqLite", "$document", function(n, t, e, s, h, c, l) {
            function p(n) {
                return n.replace(/\bng-\S+\b/g, "")
            }
            function w(n, t) {
                return o(n) && (n = n.split(" ")),
                o(t) && (t = t.split(" ")),
                n.filter(function(n) {
                    return -1 === t.indexOf(n)
                }).join(" ")
            }
            function k(t, f, o) {
                function l(n) {
                    var t = {}
                      , u = r(n).getBoundingClientRect();
                    return i(["width", "height", "top", "left"], function(n) {
                        var i = u[n];
                        switch (n) {
                        case "top":
                            i += a.scrollTop;
                            break;
                        case "left":
                            i += a.scrollLeft
                        }
                        t[n] = Math.floor(i) + "px"
                    }),
                    t
                }
                function v() {
                    var t = p(o.attr("class") || "")
                      , i = w(t, y)
                      , t = w(y, t)
                      , i = n(s, {
                        to: l(o),
                        addClass: "ng-anchor-in " + i,
                        removeClass: "ng-anchor-out " + t,
                        delay: !0
                    });
                    return i.$$willAnimate ? i : null
                }
                function c() {
                    s.remove();
                    f.removeClass("ng-animate-shim");
                    o.removeClass("ng-animate-shim")
                }
                var s = u(r(f).cloneNode(!0)), y = p(s.attr("class") || ""), h, k;
                return (f.addClass("ng-animate-shim"),
                o.addClass("ng-animate-shim"),
                s.addClass("ng-anchor"),
                b.append(s),
                t = function() {
                    var t = n(s, {
                        addClass: "ng-anchor-out",
                        delay: !0,
                        from: l(f)
                    });
                    return t.$$willAnimate ? t : null
                }(),
                !t && (h = v(),
                !h)) ? c() : (k = t || h,
                {
                    start: function() {
                        function i() {
                            n && n.end()
                        }
                        var t, n = k.start();
                        return n.done(function() {
                            if (n = null,
                            !h && (h = v()))
                                return n = h.start(),
                                n.done(function() {
                                    n = null;
                                    c();
                                    t.complete()
                                }),
                                n;
                            c();
                            t.complete()
                        }),
                        t = new e({
                            end: i,
                            cancel: i
                        })
                    }
                })
            }
            function g(n, t, r, u) {
                var o = y(n, f)
                  , s = y(t, f)
                  , h = [];
                return i(u, function(n) {
                    (n = k(r, n.out, n["in"])) && h.push(n)
                }),
                o || s || 0 !== h.length ? {
                    start: function() {
                        function r() {
                            i(n, function(n) {
                                n.end()
                            })
                        }
                        var n = [], t;
                        return o && n.push(o.start()),
                        s && n.push(s.start()),
                        i(h, function(t) {
                            n.push(t.start())
                        }),
                        t = new e({
                            end: r,
                            cancel: r
                        }),
                        e.all(n, function(n) {
                            t.complete(n)
                        }),
                        t
                    }
                } : void 0
            }
            function y(t) {
                var r = t.element
                  , i = t.options || {};
                return t.structural && (i.event = t.event,
                i.structural = !0,
                i.applyClassesEarly = !0,
                "leave" === t.event && (i.onDone = i.domOperation)),
                i.preparationClasses && (i.event = d(i.event, i.preparationClasses)),
                t = n(r, i),
                t.$$willAnimate ? t : null
            }
            var a, b;
            return !h.animations && !h.transitions ? f : (a = l[0].body,
            t = r(s),
            b = u(t.parentNode && 11 === t.parentNode.nodeType || a.contains(t) ? t : a),
            v(c),
            function(n) {
                return n.from && n.to ? g(n.from, n.to, n.classes, n.anchors) : y(n)
            }
            )
        }
        ]
    }
    ]).provider("$$animateJs", ["$animateProvider", function(n) {
        this.$get = ["$injector", "$$AnimateRunner", "$$jqLite", function(t, r, u) {
            function e(i) {
                var r, f;
                i = c(i) ? i : i.split(" ");
                for (var e = [], o = {}, u = 0; u < i.length; u++)
                    r = i[u],
                    f = n.$$registeredAnimations[r],
                    f && !o[r] && (e.push(t.get(f)),
                    o[r] = !0);
                return e
            }
            var o = v(u);
            return function(n, t, u, s) {
                function a() {
                    s.domOperation();
                    o(n, s)
                }
                function rt(n, t, i, u, e) {
                    switch (i) {
                    case "animate":
                        t = [t, u.from, u.to, e];
                        break;
                    case "setClass":
                        t = [t, nt, it, e];
                        break;
                    case "addClass":
                        t = [t, nt, e];
                        break;
                    case "removeClass":
                        t = [t, it, e];
                        break;
                    default:
                        t = [t, e]
                    }
                    if (t.push(u),
                    n = n.apply(n, t))
                        if (lt(n.start) && (n = n.start()),
                        n instanceof r)
                            n.done(e);
                        else if (lt(n))
                            return n;
                    return f
                }
                function c(n, t, u, e, o) {
                    var s = [];
                    return i(e, function(i) {
                        var e = i[o];
                        e && s.push(function() {
                            var i, s, h = !1, o = function(n) {
                                h || (h = !0,
                                (s || f)(n),
                                i.complete(!n))
                            };
                            return i = new r({
                                end: function() {
                                    o()
                                },
                                cancel: function() {
                                    o(!0)
                                }
                            }),
                            s = rt(e, n, t, u, function(n) {
                                o(!1 === n)
                            }),
                            i
                        })
                    }),
                    s
                }
                function g(n, t, u, f, e) {
                    var o = c(n, t, u, f, e), s, h;
                    return 0 === o.length && ("beforeSetClass" === e ? (s = c(n, "removeClass", u, f, "beforeRemoveClass"),
                    h = c(n, "addClass", u, f, "beforeAddClass")) : "setClass" === e && (s = c(n, "removeClass", u, f, "removeClass"),
                    h = c(n, "addClass", u, f, "addClass")),
                    s && (o = o.concat(s)),
                    h && (o = o.concat(h))),
                    0 !== o.length ? function(n) {
                        var t = [];
                        return o.length && i(o, function(n) {
                            t.push(n())
                        }),
                        t.length ? r.all(t, n) : n(),
                        function(n) {
                            i(t, function(t) {
                                n ? t.cancel() : t.end()
                            })
                        }
                    }
                    : void 0
                }
                var v = !1, k, d, h;
                3 === arguments.length && tt(u) && (s = u,
                u = null);
                s = b(s);
                u || (u = n.attr("class") || "",
                s.addClass && (u += " " + s.addClass),
                s.removeClass && (u += " " + s.removeClass));
                var nt = s.addClass, it = s.removeClass, w = e(u), y, p;
                return w.length && ("leave" == t ? (d = "leave",
                k = "afterLeave") : (d = "before" + t.charAt(0).toUpperCase() + t.substr(1),
                k = t),
                "enter" !== t && "move" !== t && (y = g(n, t, s, w, d)),
                p = g(n, t, s, w, k)),
                y || p ? {
                    $$willAnimate: !0,
                    end: function() {
                        return h ? h.end() : (v = !0,
                        a(),
                        l(n, s),
                        h = new r,
                        h.complete(!0)),
                        h
                    },
                    start: function() {
                        function u(t) {
                            v = !0;
                            a();
                            l(n, s);
                            h.complete(t)
                        }
                        if (h)
                            return h;
                        h = new r;
                        var i, t = [];
                        return y && t.push(function(n) {
                            i = y(n)
                        }),
                        t.length ? t.push(function(n) {
                            a();
                            n(!0)
                        }) : a(),
                        p && t.push(function(n) {
                            i = p(n)
                        }),
                        h.setHost({
                            end: function() {
                                v || ((i || f)(void 0),
                                u(void 0))
                            },
                            cancel: function() {
                                v || ((i || f)(!0),
                                u(!0))
                            }
                        }),
                        r.chain(t, u),
                        h
                    }
                } : void 0
            }
        }
        ]
    }
    ]).provider("$$animateJsDriver", ["$$animationProvider", function(n) {
        n.drivers.push("$$animateJsDriver");
        this.$get = ["$$animateJs", "$$AnimateRunner", function(n, t) {
            function r(t) {
                return n(t.element, t.event, t.classes, t.options)
            }
            return function(n) {
                if (n.from && n.to) {
                    var u = r(n.from)
                      , f = r(n.to);
                    if (u || f)
                        return {
                            start: function() {
                                function r() {
                                    return function() {
                                        i(n, function(n) {
                                            n.end()
                                        })
                                    }
                                }
                                var n = [], e;
                                return u && n.push(u.start()),
                                f && n.push(f.start()),
                                t.all(n, function(n) {
                                    e.complete(n)
                                }),
                                e = new t({
                                    end: r(),
                                    cancel: r()
                                })
                            }
                        }
                } else
                    return r(n)
            }
        }
        ]
    }
    ])
}(window, window.angular);
!function(n, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : n.Cropper = t()
}(this, function() {
    "use strict";
    function bt(n) {
        return uu.call(n).slice(8, -1).toLowerCase()
    }
    function n(n) {
        return "number" == typeof n && !isNaN(n)
    }
    function v(n) {
        return "undefined" == typeof n
    }
    function h(n) {
        return "object" === ("undefined" == typeof n ? "undefined" : wr(n)) && null !== n
    }
    function y(n) {
        if (!h(n))
            return !1;
        try {
            var t = n.constructor
              , i = t.prototype;
            return t && i && fu.call(i, "isPrototypeOf")
        } catch (n) {
            return !1
        }
    }
    function f(n) {
        return "function" === bt(n)
    }
    function fr(n) {
        return Array.isArray ? Array.isArray(n) : "array" === bt(n)
    }
    function ct(n) {
        return "string" == typeof n && (n = n.trim ? n.trim() : n.replace(ru, "$1")),
        n
    }
    function i(t, i) {
        var r, u;
        if (t && f(i))
            if (r = void 0,
            fr(t) || n(t.length))
                for (u = t.length,
                r = 0; r < u && i.call(t, t[r], r, t) !== !1; r++)
                    ;
            else
                h(t) && Object.keys(t).forEach(function(n) {
                    i.call(t, t[n], n, t)
                });
        return t
    }
    function t() {
        for (var u, i, f = arguments.length, n = Array(f), r = 0; r < f; r++)
            n[r] = arguments[r];
        return u = n[0] === !0,
        i = u ? n[1] : n[0],
        h(i) && n.length > 1 && (n.shift(),
        n.forEach(function(n) {
            h(n) && Object.keys(n).forEach(function(r) {
                u && h(i[r]) ? t(!0, i[r], n[r]) : i[r] = n[r]
            })
        })),
        i
    }
    function c(n, t) {
        for (var r = arguments.length, u = Array(r > 2 ? r - 2 : 0), i = 2; i < r; i++)
            u[i - 2] = arguments[i];
        return function() {
            for (var r = arguments.length, f = Array(r), i = 0; i < r; i++)
                f[i] = arguments[i];
            return n.apply(t, u.concat(f))
        }
    }
    function l(t, r) {
        var u = t.style;
        i(r, function(t, i) {
            iu.test(i) && n(t) && (t += "px");
            u[i] = t
        })
    }
    function er(n, t) {
        return n.classList ? n.classList.contains(t) : n.className.indexOf(t) > -1
    }
    function r(t, u) {
        if (n(t.length))
            return void i(t, function(n) {
                r(n, u)
            });
        if (t.classList)
            return void t.classList.add(u);
        var f = ct(t.className);
        f ? f.indexOf(u) < 0 && (t.className = f + " " + u) : t.className = u
    }
    function o(t, r) {
        return n(t.length) ? void i(t, function(n) {
            o(n, r)
        }) : t.classList ? void t.classList.remove(r) : void (t.className.indexOf(r) >= 0 && (t.className = t.className.replace(r, "")))
    }
    function b(t, u, f) {
        return n(t.length) ? void i(t, function(n) {
            b(n, u, f)
        }) : void (f ? r(t, u) : o(t, u))
    }
    function lt(n) {
        return n.replace(nu, "$1-$2").toLowerCase()
    }
    function ut(n, t) {
        return h(n[t]) ? n[t] : n.dataset ? n.dataset[t] : n.getAttribute("data-" + lt(t))
    }
    function k(n, t, i) {
        h(i) ? n[t] = i : n.dataset ? n.dataset[t] = i : n.setAttribute("data-" + lt(t), i)
    }
    function kt(n, t) {
        if (h(n[t]))
            delete n[t];
        else if (n.dataset)
            try {
                delete n.dataset[t]
            } catch (i) {
                n.dataset[t] = null
            }
        else
            n.removeAttribute("data-" + lt(t))
    }
    function u(n, t, r) {
        var f = ct(t).split(ui);
        return f.length > 1 ? void i(f, function(t) {
            u(n, t, r)
        }) : void (n.removeEventListener ? n.removeEventListener(t, r, !1) : n.detachEvent && n.detachEvent("on" + t, r))
    }
    function e(n, t, r, f) {
        var o = ct(t).split(ui)
          , s = r;
        return o.length > 1 ? void i(o, function(t) {
            e(n, t, r)
        }) : (f && (r = function() {
            for (var f = arguments.length, e = Array(f), i = 0; i < f; i++)
                e[i] = arguments[i];
            return u(n, t, r),
            s.apply(n, e)
        }
        ),
        void (n.addEventListener ? n.addEventListener(t, r, !1) : n.attachEvent && n.attachEvent("on" + t, r)))
    }
    function p(n, t, i) {
        if (n.dispatchEvent) {
            var r = void 0;
            return f(Event) && f(CustomEvent) ? r = v(i) ? new Event(t,{
                bubbles: !0,
                cancelable: !0
            }) : new CustomEvent(t,{
                detail: i,
                bubbles: !0,
                cancelable: !0
            }) : v(i) ? (r = document.createEvent("Event"),
            r.initEvent(t, !0, !0)) : (r = document.createEvent("CustomEvent"),
            r.initCustomEvent(t, !0, !0, i)),
            n.dispatchEvent(r)
        }
        return !n.fireEvent || n.fireEvent("on" + t)
    }
    function ft(t) {
        var i = t || window.event;
        if (i.target || (i.target = i.srcElement || document),
        !n(i.pageX) && n(i.clientX)) {
            var f = t.target.ownerDocument || document
              , r = f.documentElement
              , u = f.body;
            i.pageX = i.clientX + ((r && r.scrollLeft || u && u.scrollLeft || 0) - (r && r.clientLeft || u && u.clientLeft || 0));
            i.pageY = i.clientY + ((r && r.scrollTop || u && u.scrollTop || 0) - (r && r.clientTop || u && u.clientTop || 0))
        }
        return i
    }
    function dt(n) {
        var t = document.documentElement
          , i = n.getBoundingClientRect();
        return {
            left: i.left + ((window.scrollX || t && t.scrollLeft || 0) - (t && t.clientLeft || 0)),
            top: i.top + ((window.scrollY || t && t.scrollTop || 0) - (t && t.clientTop || 0))
        }
    }
    function gt(n, t) {
        return n.getElementsByTagName(t)
    }
    function s(n, t) {
        return n.getElementsByClassName ? n.getElementsByClassName(t) : n.querySelectorAll("." + t)
    }
    function w(n) {
        return document.createElement(n)
    }
    function at(n, t) {
        n.appendChild(t)
    }
    function vt(n) {
        n.parentNode && n.parentNode.removeChild(n)
    }
    function or(n) {
        for (; n.firstChild; )
            n.removeChild(n.firstChild)
    }
    function ni(n) {
        var t = n.match(tu);
        return t && (t[1] !== location.protocol || t[2] !== location.hostname || t[3] !== location.port)
    }
    function ti(n) {
        var t = "timestamp=" + (new Date).getTime();
        return n + (n.indexOf("?") === -1 ? "?" : "&") + t
    }
    function sr(n, t) {
        if (n.naturalWidth && !ei)
            return void t(n.naturalWidth, n.naturalHeight);
        var i = w("img");
        i.onload = function() {
            t(this.width, this.height)
        }
        ;
        i.src = n.src
    }
    function g(t) {
        var i = [], u = t.translateX, f = t.translateY, e = t.rotate, o = t.scaleX, s = t.scaleY, r;
        return n(u) && 0 !== u && i.push("translateX(" + u + "px)"),
        n(f) && 0 !== f && i.push("translateY(" + f + "px)"),
        n(e) && 0 !== e && i.push("rotate(" + e + "deg)"),
        n(o) && 1 !== o && i.push("scaleX(" + o + ")"),
        n(s) && 1 !== s && i.push("scaleY(" + s + ")"),
        r = i.length ? i.join(" ") : "none",
        {
            WebkitTransform: r,
            msTransform: r,
            transform: r
        }
    }
    function et(n, t) {
        var r = Math.abs(n.degree) % 180
          , s = (r > 90 ? 180 - r : r) * Math.PI / 180
          , u = Math.sin(s)
          , f = Math.cos(s)
          , e = n.width
          , h = n.height
          , c = n.aspectRatio
          , i = void 0
          , o = void 0;
        return t ? (i = e / (f + u / c),
        o = i / c) : (i = e * f + h * u,
        o = e * u + h * f),
        {
            width: i,
            height: o
        }
    }
    function ii(t, i) {
        var e = w("canvas")
          , r = e.getContext("2d")
          , k = 0
          , d = 0
          , c = i.naturalWidth
          , l = i.naturalHeight
          , o = i.rotate
          , s = i.scaleX
          , h = i.scaleY
          , a = n(s) && n(h) && (1 !== s || 1 !== h)
          , v = n(o) && 0 !== o
          , g = v || a
          , u = c * Math.abs(s || 1)
          , f = l * Math.abs(h || 1)
          , y = void 0
          , p = void 0
          , b = void 0;
        return a && (y = u / 2,
        p = f / 2),
        v && (b = et({
            width: u,
            height: f,
            degree: o
        }),
        u = b.width,
        f = b.height,
        y = u / 2,
        p = f / 2),
        e.width = u,
        e.height = f,
        g && (k = -c / 2,
        d = -l / 2,
        r.save(),
        r.translate(y, p)),
        v && r.rotate(o * Math.PI / 180),
        a && r.scale(s, h),
        r.drawImage(t, Math.floor(k), Math.floor(d), Math.floor(c), Math.floor(l)),
        g && r.restore(),
        e
    }
    function hr(n, t, i) {
        var u = ""
          , r = t;
        for (i += t; r < i; r++)
            u += si(n.getUint8(r));
        return u
    }
    function cr(n) {
        var t = new DataView(n)
          , s = t.byteLength
          , l = void 0
          , a = void 0
          , u = void 0
          , h = void 0
          , r = void 0
          , c = void 0
          , f = void 0
          , e = void 0
          , i = void 0
          , o = void 0;
        if (255 === t.getUint8(0) && 216 === t.getUint8(1))
            for (i = 2; i < s; ) {
                if (255 === t.getUint8(i) && 225 === t.getUint8(i + 1)) {
                    f = i;
                    break
                }
                i++
            }
        if (f && (a = f + 4,
        u = f + 10,
        "Exif" === hr(t, a, 4) && (c = t.getUint16(u),
        r = 18761 === c,
        (r || 19789 === c) && 42 === t.getUint16(u + 2, r) && (h = t.getUint32(u + 4, r),
        h >= 8 && (e = u + h)))),
        e)
            for (s = t.getUint16(e, r),
            o = 0; o < s; o++)
                if (i = e + 12 * o + 2,
                274 === t.getUint16(i, r)) {
                    i += 8;
                    l = t.getUint16(i, r);
                    ei && t.setUint16(i, 1, r);
                    break
                }
        return l
    }
    function lr(n) {
        for (var f = n.replace(gr, ""), i = atob(f), r = i.length, u = new ArrayBuffer(r), e = new Uint8Array(u), t = void 0, t = 0; t < r; t++)
            e[t] = i.charCodeAt(t);
        return u
    }
    function ar(n) {
        for (var i = new Uint8Array(n), u = i.length, r = "", t = void 0, t = 0; t < u; t++)
            r += si(i[t]);
        return "data:image/jpeg;base64," + btoa(r)
    }
    function ot(n, i) {
        var r = n.pageX
          , u = n.pageY
          , f = {
            endX: r,
            endY: u
        };
        return i ? f : t({
            startX: r,
            startY: u
        }, f)
    }
    function vr(n) {
        var u = t({}, n)
          , r = [];
        return i(n, function(n, t) {
            delete u[t];
            i(u, function(t) {
                var i = Math.abs(n.startX - t.startX)
                  , u = Math.abs(n.startY - t.startY)
                  , f = Math.abs(n.endX - t.endX)
                  , e = Math.abs(n.endY - t.endY)
                  , o = Math.sqrt(i * i + u * u)
                  , s = Math.sqrt(f * f + e * e)
                  , h = (s - o) / o;
                r.push(h)
            })
        }),
        r.sort(function(n, t) {
            return Math.abs(n) < Math.abs(t)
        }),
        r[0]
    }
    function yr(n) {
        var t = 0
          , r = 0
          , u = 0;
        return i(n, function(n) {
            var i = n.startX
              , f = n.startY;
            t += i;
            r += f;
            u += 1
        }),
        t /= u,
        r /= u,
        {
            pageX: t,
            pageY: r
        }
    }
    var ri = {
        viewMode: 0,
        dragMode: "crop",
        aspectRatio: NaN,
        data: null,
        preview: "",
        responsive: !0,
        restore: !0,
        checkCrossOrigin: !0,
        checkOrientation: !0,
        modal: !0,
        guides: !0,
        center: !0,
        highlight: !0,
        background: !0,
        autoCrop: !0,
        autoCropArea: .8,
        movable: !0,
        rotatable: !0,
        scalable: !0,
        zoomable: !0,
        zoomOnTouch: !0,
        zoomOnWheel: !0,
        wheelZoomRatio: .1,
        cropBoxMovable: !0,
        cropBoxResizable: !0,
        toggleDragModeOnDblclick: !0,
        minCanvasWidth: 0,
        minCanvasHeight: 0,
        minCropBoxWidth: 0,
        minCropBoxHeight: 0,
        minContainerWidth: 200,
        minContainerHeight: 100,
        ready: null,
        cropstart: null,
        cropmove: null,
        cropend: null,
        crop: null,
        zoom: null
    }
      , pr = '<div class="cropper-container"><div class="cropper-wrap-box"><div class="cropper-canvas"><\/div><\/div><div class="cropper-drag-box"><\/div><div class="cropper-crop-box"><span class="cropper-view-box"><\/span><span class="cropper-dashed dashed-h"><\/span><span class="cropper-dashed dashed-v"><\/span><span class="cropper-center"><\/span><span class="cropper-face"><\/span><span class="cropper-line line-e" data-action="e"><\/span><span class="cropper-line line-n" data-action="n"><\/span><span class="cropper-line line-w" data-action="w"><\/span><span class="cropper-line line-s" data-action="s"><\/span><span class="cropper-point point-e" data-action="e"><\/span><span class="cropper-point point-n" data-action="n"><\/span><span class="cropper-point point-w" data-action="w"><\/span><span class="cropper-point point-s" data-action="s"><\/span><span class="cropper-point point-ne" data-action="ne"><\/span><span class="cropper-point point-nw" data-action="nw"><\/span><span class="cropper-point point-sw" data-action="sw"><\/span><span class="cropper-point point-se" data-action="se"><\/span><\/div><\/div>'
      , wr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(n) {
        return typeof n
    }
    : function(n) {
        return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n
    }
      , br = function(n, t) {
        if (!(n instanceof t))
            throw new TypeError("Cannot call a class as a function");
    }
      , kr = function() {
        function n(n, t) {
            for (var i, r = 0; r < t.length; r++)
                i = t[r],
                i.enumerable = i.enumerable || !1,
                i.configurable = !0,
                "value"in i && (i.writable = !0),
                Object.defineProperty(n, i.key, i)
        }
        return function(t, i, r) {
            return i && n(t.prototype, i),
            r && n(t, r),
            t
        }
    }()
      , dr = function(n) {
        if (Array.isArray(n)) {
            for (var t = 0, i = Array(n.length); t < n.length; t++)
                i[t] = n[t];
            return i
        }
        return Array.from(n)
    }
      , gr = /^data:([^;]+);base64,/
      , nu = /([a-z\d])([A-Z])/g
      , tu = /^(https?:)\/\/([^:\/?#]+):?(\d*)/i
      , ui = /\s+/
      , iu = /^(width|height|left|top|marginLeft|marginTop)$/
      , ru = /^\s+(.*)\s+$/
      , fi = "undefined" != typeof window ? window.navigator : null
      , ei = fi && /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i.test(fi.userAgent)
      , oi = Object.prototype
      , uu = oi.toString
      , fu = oi.hasOwnProperty
      , si = (Array.prototype.slice,
    String.fromCharCode)
      , eu = {
        render: function() {
            var n = this;
            n.initContainer();
            n.initCanvas();
            n.initCropBox();
            n.renderCanvas();
            n.cropped && n.renderCropBox()
        },
        initContainer: function() {
            var n = this
              , f = n.options
              , e = n.element
              , s = n.container
              , i = n.cropper
              , t = "cropper-hidden"
              , u = void 0;
            r(i, t);
            o(e, t);
            n.containerData = u = {
                width: Math.max(s.offsetWidth, Number(f.minContainerWidth) || 200),
                height: Math.max(s.offsetHeight, Number(f.minContainerHeight) || 100)
            };
            l(i, {
                width: u.width,
                height: u.height
            });
            r(e, t);
            o(i, t)
        },
        initCanvas: function() {
            var i = this, e = i.options.viewMode, n = i.containerData, u = i.imageData, h = 90 === Math.abs(u.rotate), c = h ? u.naturalHeight : u.naturalWidth, l = h ? u.naturalWidth : u.naturalHeight, f = c / l, o = n.width, s = n.height, r;
            n.height * f > n.width ? 3 === e ? o = n.height * f : s = n.width / f : 3 === e ? s = n.width / f : o = n.height * f;
            r = {
                naturalWidth: c,
                naturalHeight: l,
                aspectRatio: f,
                width: o,
                height: s
            };
            r.oldLeft = r.left = (n.width - o) / 2;
            r.oldTop = r.top = (n.height - s) / 2;
            i.canvasData = r;
            i.limited = 1 === e || 2 === e;
            i.limitCanvas(!0, !0);
            i.initialImageData = t({}, u);
            i.initialCanvasData = t({}, r)
        },
        limitCanvas: function(n, t) {
            var s = this, v = s.options, h = v.viewMode, o = s.containerData, i = s.canvasData, e = i.aspectRatio, f = s.cropBoxData, a = s.cropped && f, r, u, c, l;
            n && (r = Number(v.minCanvasWidth) || 0,
            u = Number(v.minCanvasHeight) || 0,
            h > 1 ? (r = Math.max(r, o.width),
            u = Math.max(u, o.height),
            3 === h && (u * e > r ? r = u * e : u = r / e)) : h > 0 && (r ? r = Math.max(r, a ? f.width : 0) : u ? u = Math.max(u, a ? f.height : 0) : a && (r = f.width,
            u = f.height,
            u * e > r ? r = u * e : u = r / e)),
            r && u ? u * e > r ? u = r / e : r = u * e : r ? u = r / e : u && (r = u * e),
            i.minWidth = r,
            i.minHeight = u,
            i.maxWidth = 1 / 0,
            i.maxHeight = 1 / 0);
            t && (h ? (c = o.width - i.width,
            l = o.height - i.height,
            i.minLeft = Math.min(0, c),
            i.minTop = Math.min(0, l),
            i.maxLeft = Math.max(0, c),
            i.maxTop = Math.max(0, l),
            a && s.limited && (i.minLeft = Math.min(f.left, f.left + (f.width - i.width)),
            i.minTop = Math.min(f.top, f.top + (f.height - i.height)),
            i.maxLeft = f.left,
            i.maxTop = f.top,
            2 === h && (i.width >= o.width && (i.minLeft = Math.min(0, c),
            i.maxLeft = Math.max(0, c)),
            i.height >= o.height && (i.minTop = Math.min(0, l),
            i.maxTop = Math.max(0, l))))) : (i.minLeft = -i.width,
            i.minTop = -i.height,
            i.maxLeft = o.width,
            i.maxTop = o.height))
        },
        renderCanvas: function(n) {
            var r = this
              , i = r.canvasData
              , f = r.imageData
              , e = f.rotate
              , o = void 0
              , u = void 0;
            r.rotated && (r.rotated = !1,
            u = et({
                width: f.width,
                height: f.height,
                degree: e
            }),
            o = u.width / u.height,
            o !== i.aspectRatio && (i.left -= (u.width - i.width) / 2,
            i.top -= (u.height - i.height) / 2,
            i.width = u.width,
            i.height = u.height,
            i.aspectRatio = o,
            i.naturalWidth = f.naturalWidth,
            i.naturalHeight = f.naturalHeight,
            e % 180 && (u = et({
                width: f.naturalWidth,
                height: f.naturalHeight,
                degree: e
            }),
            i.naturalWidth = u.width,
            i.naturalHeight = u.height),
            r.limitCanvas(!0, !1)));
            (i.width > i.maxWidth || i.width < i.minWidth) && (i.left = i.oldLeft);
            (i.height > i.maxHeight || i.height < i.minHeight) && (i.top = i.oldTop);
            i.width = Math.min(Math.max(i.width, i.minWidth), i.maxWidth);
            i.height = Math.min(Math.max(i.height, i.minHeight), i.maxHeight);
            r.limitCanvas(!1, !0);
            i.oldLeft = i.left = Math.min(Math.max(i.left, i.minLeft), i.maxLeft);
            i.oldTop = i.top = Math.min(Math.max(i.top, i.minTop), i.maxTop);
            l(r.canvas, t({
                width: i.width,
                height: i.height
            }, g({
                translateX: i.left,
                translateY: i.top
            })));
            r.renderImage();
            r.cropped && r.limited && r.limitCropBox(!0, !0);
            n && r.output()
        },
        renderImage: function(n) {
            var u = this
              , r = u.canvasData
              , i = u.imageData
              , s = void 0
              , f = void 0
              , e = void 0
              , o = void 0;
            i.rotate && (f = et({
                width: r.width,
                height: r.height,
                degree: i.rotate,
                aspectRatio: i.aspectRatio
            }, !0),
            e = f.width,
            o = f.height,
            s = {
                width: e,
                height: o,
                left: (r.width - e) / 2,
                top: (r.height - o) / 2
            });
            t(i, s || {
                width: r.width,
                height: r.height,
                left: 0,
                top: 0
            });
            l(u.image, t({
                width: i.width,
                height: i.height
            }, g(t({
                translateX: i.left,
                translateY: i.top
            }, i))));
            n && u.output()
        },
        initCropBox: function() {
            var r = this
              , f = r.options
              , u = f.aspectRatio
              , e = Number(f.autoCropArea) || .8
              , i = r.canvasData
              , n = {
                width: i.width,
                height: i.height
            };
            u && (i.height * u > i.width ? n.height = n.width / u : n.width = n.height * u);
            r.cropBoxData = n;
            r.limitCropBox(!0, !0);
            n.width = Math.min(Math.max(n.width, n.minWidth), n.maxWidth);
            n.height = Math.min(Math.max(n.height, n.minHeight), n.maxHeight);
            n.width = Math.max(n.minWidth, n.width * e);
            n.height = Math.max(n.minHeight, n.height * e);
            n.oldLeft = n.left = i.left + (i.width - n.width) / 2;
            n.oldTop = n.top = i.top + (i.height - n.height) / 2;
            r.initialCropBoxData = t({}, n)
        },
        limitCropBox: function(n, t) {
            var s = this
              , l = s.options
              , e = l.aspectRatio
              , r = s.containerData
              , o = s.canvasData
              , i = s.cropBoxData
              , a = s.limited;
            if (n) {
                var u = Number(l.minCropBoxWidth) || 0
                  , f = Number(l.minCropBoxHeight) || 0
                  , h = Math.min(r.width, a ? o.width : r.width)
                  , c = Math.min(r.height, a ? o.height : r.height);
                u = Math.min(u, r.width);
                f = Math.min(f, r.height);
                e && (u && f ? f * e > u ? f = u / e : u = f * e : u ? f = u / e : f && (u = f * e),
                c * e > h ? c = h / e : h = c * e);
                i.minWidth = Math.min(u, h);
                i.minHeight = Math.min(f, c);
                i.maxWidth = h;
                i.maxHeight = c
            }
            t && (a ? (i.minLeft = Math.max(0, o.left),
            i.minTop = Math.max(0, o.top),
            i.maxLeft = Math.min(r.width, o.left + o.width) - i.width,
            i.maxTop = Math.min(r.height, o.top + o.height) - i.height) : (i.minLeft = 0,
            i.minTop = 0,
            i.maxLeft = r.width - i.width,
            i.maxTop = r.height - i.height))
        },
        renderCropBox: function() {
            var i = this
              , r = i.options
              , u = i.containerData
              , n = i.cropBoxData;
            (n.width > n.maxWidth || n.width < n.minWidth) && (n.left = n.oldLeft);
            (n.height > n.maxHeight || n.height < n.minHeight) && (n.top = n.oldTop);
            n.width = Math.min(Math.max(n.width, n.minWidth), n.maxWidth);
            n.height = Math.min(Math.max(n.height, n.minHeight), n.maxHeight);
            i.limitCropBox(!1, !0);
            n.oldLeft = n.left = Math.min(Math.max(n.left, n.minLeft), n.maxLeft);
            n.oldTop = n.top = Math.min(Math.max(n.top, n.minTop), n.maxTop);
            r.movable && r.cropBoxMovable && k(i.face, "action", n.width === u.width && n.height === u.height ? "move" : "all");
            l(i.cropBox, t({
                width: n.width,
                height: n.height
            }, g({
                translateX: n.left,
                translateY: n.top
            })));
            i.cropped && i.limited && i.limitCanvas(!0, !0);
            i.disabled || i.output()
        },
        output: function() {
            var n = this;
            n.preview();
            n.complete && p(n.element, "crop", n.getData())
        }
    }
      , st = "preview"
      , ou = {
        initPreview: function() {
            var n = this, r = n.options.preview, u = w("img"), t = n.crossOrigin, e = t ? n.crossOriginUrl : n.url, f;
            (t && (u.crossOrigin = t),
            u.src = e,
            at(n.viewBox, u),
            n.image2 = u,
            r) && (f = r.querySelector ? [r] : document.querySelectorAll(r),
            n.previews = f,
            i(f, function(n) {
                var i = w("img");
                k(n, st, {
                    width: n.offsetWidth,
                    height: n.offsetHeight,
                    html: n.innerHTML
                });
                t && (i.crossOrigin = t);
                i.src = e;
                i.style.cssText = 'display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;"';
                or(n);
                at(n, i)
            }))
        },
        resetPreview: function() {
            i(this.previews, function(n) {
                var t = ut(n, st);
                l(n, {
                    width: t.width,
                    height: t.height
                });
                n.innerHTML = t.html;
                kt(n, st)
            })
        },
        preview: function() {
            var n = this
              , r = n.imageData
              , o = n.canvasData
              , u = n.cropBoxData
              , f = u.width
              , e = u.height
              , s = r.width
              , h = r.height
              , c = u.left - o.left - r.left
              , a = u.top - o.top - r.top;
            n.cropped && !n.disabled && (l(n.image2, t({
                width: s,
                height: h
            }, g(t({
                translateX: -c,
                translateY: -a
            }, r)))),
            i(n.previews, function(n) {
                var v = ut(n, st)
                  , y = v.width
                  , u = v.height
                  , p = y
                  , o = u
                  , i = 1;
                f && (i = y / f,
                o = e * i);
                e && o > u && (i = u / e,
                p = f * i,
                o = u);
                l(n, {
                    width: p,
                    height: o
                });
                l(gt(n, "img")[0], t({
                    width: s * i,
                    height: h * i
                }, g(t({
                    translateX: -c * i,
                    translateY: -a * i
                }, r))))
            }))
        }
    }
      , yt = "undefined" != typeof window ? window.PointerEvent : null
      , hi = yt ? "pointerdown" : "touchstart mousedown"
      , ci = yt ? "pointermove" : "touchmove mousemove"
      , li = yt ? " pointerup pointercancel" : "touchend touchcancel mouseup"
      , ai = "wheel mousewheel DOMMouseScroll"
      , vi = "dblclick"
      , yi = "resize"
      , pi = "cropstart"
      , wi = "cropmove"
      , bi = "cropend"
      , ki = "crop"
      , di = "zoom"
      , su = {
        bind: function() {
            var n = this
              , t = n.options
              , i = n.element
              , r = n.cropper;
            f(t.cropstart) && e(i, pi, t.cropstart);
            f(t.cropmove) && e(i, wi, t.cropmove);
            f(t.cropend) && e(i, bi, t.cropend);
            f(t.crop) && e(i, ki, t.crop);
            f(t.zoom) && e(i, di, t.zoom);
            e(r, hi, n.onCropStart = c(n.cropStart, n));
            t.zoomable && t.zoomOnWheel && e(r, ai, n.onWheel = c(n.wheel, n));
            t.toggleDragModeOnDblclick && e(r, vi, n.onDblclick = c(n.dblclick, n));
            e(document, ci, n.onCropMove = c(n.cropMove, n));
            e(document, li, n.onCropEnd = c(n.cropEnd, n));
            t.responsive && e(window, yi, n.onResize = c(n.resize, n))
        },
        unbind: function() {
            var t = this
              , n = t.options
              , i = t.element
              , r = t.cropper;
            f(n.cropstart) && u(i, pi, n.cropstart);
            f(n.cropmove) && u(i, wi, n.cropmove);
            f(n.cropend) && u(i, bi, n.cropend);
            f(n.crop) && u(i, ki, n.crop);
            f(n.zoom) && u(i, di, n.zoom);
            u(r, hi, t.onCropStart);
            n.zoomable && n.zoomOnWheel && u(r, ai, t.onWheel);
            n.toggleDragModeOnDblclick && u(r, vi, t.onDblclick);
            u(document, ci, t.onCropMove);
            u(document, li, t.onCropEnd);
            n.responsive && u(window, yi, t.onResize)
        }
    }
      , hu = /^(e|w|s|n|se|sw|ne|nw|all|crop|move|zoom)$/
      , cu = {
        resize: function() {
            var n = this
              , e = n.options.restore
              , o = n.container
              , t = n.containerData;
            if (!n.disabled && t) {
                var r = o.offsetWidth / t.width
                  , u = void 0
                  , f = void 0;
                1 === r && o.offsetHeight === t.height || (e && (u = n.getCanvasData(),
                f = n.getCropBoxData()),
                n.render(),
                e && (n.setCanvasData(i(u, function(n, t) {
                    u[t] = n * r
                })),
                n.setCropBoxData(i(f, function(n, t) {
                    f[t] = n * r
                }))))
            }
        },
        dblclick: function() {
            var n = this;
            n.disabled || n.setDragMode(er(n.dragBox, "cropper-crop") ? "move" : "crop")
        },
        wheel: function(n) {
            var i = this
              , t = ft(n)
              , u = Number(i.options.wheelZoomRatio) || .1
              , r = 1;
            i.disabled || (t.preventDefault(),
            i.wheeling || (i.wheeling = !0,
            setTimeout(function() {
                i.wheeling = !1
            }, 50),
            t.deltaY ? r = t.deltaY > 0 ? 1 : -1 : t.wheelDelta ? r = -t.wheelDelta / 120 : t.detail && (r = t.detail > 0 ? 1 : -1),
            i.zoom(-r * u, t)))
        },
        cropStart: function(n) {
            var t = this;
            if (!t.disabled) {
                var o = t.options
                  , e = t.pointers
                  , u = ft(n)
                  , f = void 0;
                if (u.changedTouches ? i(u.changedTouches, function(n) {
                    e[n.identifier] = ot(n)
                }) : e[u.pointerId || 0] = ot(u),
                f = Object.keys(e).length > 1 && o.zoomable && o.zoomOnTouch ? "zoom" : ut(u.target, "action"),
                hu.test(f)) {
                    if (p(t.element, "cropstart", {
                        originalEvent: u,
                        action: f
                    }) === !1)
                        return;
                    u.preventDefault();
                    t.action = f;
                    t.cropping = !1;
                    "crop" === f && (t.cropping = !0,
                    r(t.dragBox, "cropper-modal"))
                }
            }
        },
        cropMove: function(n) {
            var u = this, e = u.action, f, r;
            !u.disabled && e && (f = u.pointers,
            r = ft(n),
            r.preventDefault(),
            p(u.element, "cropmove", {
                originalEvent: r,
                action: e
            }) !== !1 && (r.changedTouches ? i(r.changedTouches, function(n) {
                t(f[n.identifier], ot(n, !0))
            }) : t(f[r.pointerId || 0], ot(r, !0)),
            u.change(r)))
        },
        cropEnd: function(n) {
            var t = this, f = t.action, u, r;
            !t.disabled && f && (u = t.pointers,
            r = ft(n),
            r.preventDefault(),
            r.changedTouches ? i(r.changedTouches, function(n) {
                delete u[n.identifier]
            }) : delete u[r.pointerId || 0],
            Object.keys(u).length || (t.action = ""),
            t.cropping && (t.cropping = !1,
            b(t.dragBox, "cropper-modal", t.cropped && this.options.modal)),
            p(t.element, "cropend", {
                originalEvent: r,
                action: f
            }))
        }
    }
      , gi = "e"
      , nr = "w"
      , tr = "s"
      , ir = "n"
      , nt = "se"
      , tt = "sw"
      , it = "ne"
      , rt = "nw"
      , lu = {
        change: function(n) {
            var c = this
              , ot = c.options
              , ut = c.containerData
              , d = c.canvasData
              , a = c.cropBoxData
              , f = ot.aspectRatio
              , h = c.action
              , r = a.width
              , u = a.height
              , s = a.left
              , e = a.top
              , k = s + r
              , p = e + u
              , w = 0
              , v = 0
              , b = ut.width
              , y = ut.height
              , l = !0
              , et = void 0;
            !f && n.shiftKey && (f = r && u ? r / u : 1);
            c.limited && (w = a.minLeft,
            v = a.minTop,
            b = w + Math.min(ut.width, d.width, d.left + d.width),
            y = v + Math.min(ut.height, d.height, d.top + d.height));
            var ft = c.pointers
              , g = ft[Object.keys(ft)[0]]
              , t = {
                x: g.endX - g.startX,
                y: g.endY - g.startY
            };
            switch (f && (t.X = t.y * f,
            t.Y = t.x / f),
            h) {
            case "all":
                s += t.x;
                e += t.y;
                break;
            case gi:
                if (t.x >= 0 && (k >= b || f && (e <= v || p >= y))) {
                    l = !1;
                    break
                }
                r += t.x;
                f && (u = r / f,
                e -= t.Y / 2);
                r < 0 && (h = nr,
                r = 0);
                break;
            case ir:
                if (t.y <= 0 && (e <= v || f && (s <= w || k >= b))) {
                    l = !1;
                    break
                }
                u -= t.y;
                e += t.y;
                f && (r = u * f,
                s += t.X / 2);
                u < 0 && (h = tr,
                u = 0);
                break;
            case nr:
                if (t.x <= 0 && (s <= w || f && (e <= v || p >= y))) {
                    l = !1;
                    break
                }
                r -= t.x;
                s += t.x;
                f && (u = r / f,
                e += t.Y / 2);
                r < 0 && (h = gi,
                r = 0);
                break;
            case tr:
                if (t.y >= 0 && (p >= y || f && (s <= w || k >= b))) {
                    l = !1;
                    break
                }
                u += t.y;
                f && (r = u * f,
                s -= t.X / 2);
                u < 0 && (h = ir,
                u = 0);
                break;
            case it:
                if (f) {
                    if (t.y <= 0 && (e <= v || k >= b)) {
                        l = !1;
                        break
                    }
                    u -= t.y;
                    e += t.y;
                    r = u * f
                } else
                    t.x >= 0 ? k < b ? r += t.x : t.y <= 0 && e <= v && (l = !1) : r += t.x,
                    t.y <= 0 ? e > v && (u -= t.y,
                    e += t.y) : (u -= t.y,
                    e += t.y);
                r < 0 && u < 0 ? (h = tt,
                u = 0,
                r = 0) : r < 0 ? (h = rt,
                r = 0) : u < 0 && (h = nt,
                u = 0);
                break;
            case rt:
                if (f) {
                    if (t.y <= 0 && (e <= v || s <= w)) {
                        l = !1;
                        break
                    }
                    u -= t.y;
                    e += t.y;
                    r = u * f;
                    s += t.X
                } else
                    t.x <= 0 ? s > w ? (r -= t.x,
                    s += t.x) : t.y <= 0 && e <= v && (l = !1) : (r -= t.x,
                    s += t.x),
                    t.y <= 0 ? e > v && (u -= t.y,
                    e += t.y) : (u -= t.y,
                    e += t.y);
                r < 0 && u < 0 ? (h = nt,
                u = 0,
                r = 0) : r < 0 ? (h = it,
                r = 0) : u < 0 && (h = tt,
                u = 0);
                break;
            case tt:
                if (f) {
                    if (t.x <= 0 && (s <= w || p >= y)) {
                        l = !1;
                        break
                    }
                    r -= t.x;
                    s += t.x;
                    u = r / f
                } else
                    t.x <= 0 ? s > w ? (r -= t.x,
                    s += t.x) : t.y >= 0 && p >= y && (l = !1) : (r -= t.x,
                    s += t.x),
                    t.y >= 0 ? p < y && (u += t.y) : u += t.y;
                r < 0 && u < 0 ? (h = it,
                u = 0,
                r = 0) : r < 0 ? (h = nt,
                r = 0) : u < 0 && (h = rt,
                u = 0);
                break;
            case nt:
                if (f) {
                    if (t.x >= 0 && (k >= b || p >= y)) {
                        l = !1;
                        break
                    }
                    r += t.x;
                    u = r / f
                } else
                    t.x >= 0 ? k < b ? r += t.x : t.y >= 0 && p >= y && (l = !1) : r += t.x,
                    t.y >= 0 ? p < y && (u += t.y) : u += t.y;
                r < 0 && u < 0 ? (h = rt,
                u = 0,
                r = 0) : r < 0 ? (h = tt,
                r = 0) : u < 0 && (h = it,
                u = 0);
                break;
            case "move":
                c.move(t.x, t.y);
                l = !1;
                break;
            case "zoom":
                c.zoom(vr(ft), n);
                l = !1;
                break;
            case "crop":
                if (!t.x || !t.y) {
                    l = !1;
                    break
                }
                et = dt(c.cropper);
                s = g.startX - et.left;
                e = g.startY - et.top;
                r = a.minWidth;
                u = a.minHeight;
                t.x > 0 ? h = t.y > 0 ? nt : it : t.x < 0 && (s -= r,
                h = t.y > 0 ? tt : rt);
                t.y < 0 && (e -= u);
                c.cropped || (o(c.cropBox, "cropper-hidden"),
                c.cropped = !0,
                c.limited && c.limitCropBox(!0, !0))
            }
            l && (a.width = r,
            a.height = u,
            a.left = s,
            a.top = e,
            c.action = h,
            c.renderCropBox());
            i(ft, function(n) {
                n.startX = n.endX;
                n.startY = n.endY
            })
        }
    }
      , au = {
        crop: function() {
            var n = this;
            return n.ready && !n.disabled && (n.cropped || (n.cropped = !0,
            n.limitCropBox(!0, !0),
            n.options.modal && r(n.dragBox, "cropper-modal"),
            o(n.cropBox, "cropper-hidden")),
            n.setCropBoxData(n.initialCropBoxData)),
            n
        },
        reset: function() {
            var n = this;
            return n.ready && !n.disabled && (n.imageData = t({}, n.initialImageData),
            n.canvasData = t({}, n.initialCanvasData),
            n.cropBoxData = t({}, n.initialCropBoxData),
            n.renderCanvas(),
            n.cropped && n.renderCropBox()),
            n
        },
        clear: function() {
            var n = this;
            return n.cropped && !n.disabled && (t(n.cropBoxData, {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            }),
            n.cropped = !1,
            n.renderCropBox(),
            n.limitCanvas(),
            n.renderCanvas(),
            o(n.dragBox, "cropper-modal"),
            r(n.cropBox, "cropper-hidden")),
            n
        },
        replace: function(n, t) {
            var r = this;
            return !r.disabled && n && (r.isImg && (r.element.src = n),
            t ? (r.url = n,
            r.image.src = n,
            r.ready && (r.image2.src = n,
            i(r.previews, function(t) {
                gt(t, "img")[0].src = n
            }))) : (r.isImg && (r.replaced = !0),
            r.options.data = null,
            r.load(n))),
            r
        },
        enable: function() {
            var n = this;
            return n.ready && (n.disabled = !1,
            o(n.cropper, "cropper-disabled")),
            n
        },
        disable: function() {
            var n = this;
            return n.ready && (n.disabled = !0,
            r(n.cropper, "cropper-disabled")),
            n
        },
        destroy: function() {
            var n = this
              , t = n.element
              , i = n.image;
            return n.loaded ? (n.isImg && n.replaced && (t.src = n.originalUrl),
            n.unbuild(),
            o(t, "cropper-hidden")) : n.isImg ? u(t, "load", n.start) : i && vt(i),
            kt(t, "cropper"),
            n
        },
        move: function(n, t) {
            var i = this
              , r = i.canvasData;
            return i.moveTo(v(n) ? n : r.left + Number(n), v(t) ? t : r.top + Number(t))
        },
        moveTo: function(t, i) {
            var r = this
              , f = r.canvasData
              , u = !1;
            return v(i) && (i = t),
            t = Number(t),
            i = Number(i),
            r.ready && !r.disabled && r.options.movable && (n(t) && (f.left = t,
            u = !0),
            n(i) && (f.top = i,
            u = !0),
            u && r.renderCanvas(!0)),
            r
        },
        zoom: function(n, t) {
            var i = this
              , r = i.canvasData;
            return n = Number(n),
            n = n < 0 ? 1 / (1 - n) : 1 + n,
            i.zoomTo(r.width * n / r.naturalWidth, t)
        },
        zoomTo: function(n, t) {
            var r = this, a = r.options, i = r.canvasData, f = i.width, o = i.height, s = i.naturalWidth, v = i.naturalHeight, u, e;
            if (n = Number(n),
            n >= 0 && r.ready && !r.disabled && a.zoomable) {
                if (u = s * n,
                e = v * n,
                p(r.element, "zoom", {
                    originalEvent: t,
                    oldRatio: f / s,
                    ratio: u / s
                }) === !1)
                    return r;
                if (t) {
                    var h = r.pointers
                      , c = dt(r.cropper)
                      , l = h && Object.keys(h).length ? yr(h) : {
                        pageX: t.pageX,
                        pageY: t.pageY
                    };
                    i.left -= (u - f) * ((l.pageX - c.left - i.left) / f);
                    i.top -= (e - o) * ((l.pageY - c.top - i.top) / o)
                } else
                    i.left -= (u - f) / 2,
                    i.top -= (e - o) / 2;
                i.width = u;
                i.height = e;
                r.renderCanvas(!0)
            }
            return r
        },
        rotate: function(n) {
            var t = this;
            return t.rotateTo((t.imageData.rotate || 0) + Number(n))
        },
        rotateTo: function(t) {
            var i = this;
            return t = Number(t),
            n(t) && i.ready && !i.disabled && i.options.rotatable && (i.imageData.rotate = t % 360,
            i.rotated = !0,
            i.renderCanvas(!0)),
            i
        },
        scale: function(t, i) {
            var r = this
              , f = r.imageData
              , u = !1;
            return v(i) && (i = t),
            t = Number(t),
            i = Number(i),
            r.ready && !r.disabled && r.options.scalable && (n(t) && (f.scaleX = t,
            u = !0),
            n(i) && (f.scaleY = i,
            u = !0),
            u && r.renderImage(!0)),
            r
        },
        scaleX: function(t) {
            var i = this
              , r = i.imageData.scaleY;
            return i.scale(t, n(r) ? r : 1)
        },
        scaleY: function(t) {
            var i = this
              , r = i.imageData.scaleX;
            return i.scale(n(r) ? r : 1, t)
        },
        getData: function(n) {
            var r = this
              , e = r.options
              , u = r.imageData
              , o = r.canvasData
              , f = r.cropBoxData
              , s = void 0
              , t = void 0;
            return r.ready && r.cropped ? (t = {
                x: f.left - o.left,
                y: f.top - o.top,
                width: f.width,
                height: f.height
            },
            s = u.width / u.naturalWidth,
            i(t, function(i, r) {
                i /= s;
                t[r] = n ? Math.round(i) : i
            })) : t = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            e.rotatable && (t.rotate = u.rotate || 0),
            e.scalable && (t.scaleX = u.scaleX || 1,
            t.scaleY = u.scaleY || 1),
            t
        },
        setData: function(t) {
            var i = this
              , s = i.options
              , r = i.imageData
              , h = i.canvasData
              , u = {}
              , c = void 0
              , o = void 0
              , e = void 0;
            return f(t) && (t = t.call(i.element)),
            i.ready && !i.disabled && y(t) && (s.rotatable && n(t.rotate) && t.rotate !== r.rotate && (r.rotate = t.rotate,
            i.rotated = c = !0),
            s.scalable && (n(t.scaleX) && t.scaleX !== r.scaleX && (r.scaleX = t.scaleX,
            o = !0),
            n(t.scaleY) && t.scaleY !== r.scaleY && (r.scaleY = t.scaleY,
            o = !0)),
            c ? i.renderCanvas() : o && i.renderImage(),
            e = r.width / r.naturalWidth,
            n(t.x) && (u.left = t.x * e + h.left),
            n(t.y) && (u.top = t.y * e + h.top),
            n(t.width) && (u.width = t.width * e),
            n(t.height) && (u.height = t.height * e),
            i.setCropBoxData(u)),
            i
        },
        getContainerData: function() {
            var n = this;
            return n.ready ? n.containerData : {}
        },
        getImageData: function() {
            var n = this;
            return n.loaded ? n.imageData : {}
        },
        getCanvasData: function() {
            var n = this
              , r = n.canvasData
              , t = {};
            return n.ready && i(["left", "top", "width", "height", "naturalWidth", "naturalHeight"], function(n) {
                t[n] = r[n]
            }),
            t
        },
        setCanvasData: function(t) {
            var r = this
              , i = r.canvasData
              , u = i.aspectRatio;
            return f(t) && (t = t.call(r.element)),
            r.ready && !r.disabled && y(t) && (n(t.left) && (i.left = t.left),
            n(t.top) && (i.top = t.top),
            n(t.width) ? (i.width = t.width,
            i.height = t.width / u) : n(t.height) && (i.height = t.height,
            i.width = t.height * u),
            r.renderCanvas(!0)),
            r
        },
        getCropBoxData: function() {
            var t = this
              , n = t.cropBoxData
              , i = void 0;
            return t.ready && t.cropped && (i = {
                left: n.left,
                top: n.top,
                width: n.width,
                height: n.height
            }),
            i || {}
        },
        setCropBoxData: function(t) {
            var r = this
              , i = r.cropBoxData
              , u = r.options.aspectRatio
              , e = void 0
              , o = void 0;
            return f(t) && (t = t.call(r.element)),
            r.ready && r.cropped && !r.disabled && y(t) && (n(t.left) && (i.left = t.left),
            n(t.top) && (i.top = t.top),
            n(t.width) && t.width !== i.width && (e = !0,
            i.width = t.width),
            n(t.height) && t.height !== i.height && (o = !0,
            i.height = t.height),
            u && (e ? i.height = i.width / u : o && (i.width = i.height * u)),
            r.renderCropBox()),
            r
        },
        getCroppedCanvas: function(n) {
            var t = this, v;
            if (!t.ready || !window.HTMLCanvasElement)
                return null;
            if (!t.cropped)
                return ii(t.image, t.imageData);
            y(n) || (n = {});
            var r = t.getData()
              , u = r.width
              , f = r.height
              , c = u / f
              , e = void 0
              , o = void 0
              , i = void 0;
            y(n) && (e = n.width,
            o = n.height,
            e ? (o = e / c,
            i = e / u) : o && (e = o * c,
            i = o / f));
            var l = Math.floor(e || u)
              , a = Math.floor(o || f)
              , s = w("canvas")
              , h = s.getContext("2d");
            return s.width = l,
            s.height = a,
            n.fillColor && (h.fillStyle = n.fillColor,
            h.fillRect(0, 0, l, a)),
            v = function() {
                var p = ii(t.image, t.imageData)
                  , a = p.width
                  , v = p.height
                  , b = t.canvasData
                  , w = [p]
                  , n = r.x + b.naturalWidth * (Math.abs(r.scaleX || 1) - 1) / 2
                  , e = r.y + b.naturalHeight * (Math.abs(r.scaleY || 1) - 1) / 2
                  , h = void 0
                  , y = void 0
                  , c = void 0
                  , l = void 0
                  , o = void 0
                  , s = void 0;
                return n <= -u || n > a ? n = h = c = o = 0 : n <= 0 ? (c = -n,
                n = 0,
                h = o = Math.min(a, u + n)) : n <= a && (c = 0,
                h = o = Math.min(u, a - n)),
                h <= 0 || e <= -f || e > v ? e = y = l = s = 0 : e <= 0 ? (l = -e,
                e = 0,
                y = s = Math.min(v, f + e)) : e <= v && (l = 0,
                y = s = Math.min(f, v - e)),
                w.push(Math.floor(n), Math.floor(e), Math.floor(h), Math.floor(y)),
                i && (c *= i,
                l *= i,
                o *= i,
                s *= i),
                o > 0 && s > 0 && w.push(Math.floor(c), Math.floor(l), Math.floor(o), Math.floor(s)),
                w
            }(),
            h.drawImage.apply(h, dr(v)),
            s
        },
        setAspectRatio: function(n) {
            var t = this
              , i = t.options;
            return t.disabled || v(n) || (i.aspectRatio = Math.max(0, n) || NaN,
            t.ready && (t.initCropBox(),
            t.cropped && t.renderCropBox())),
            t
        },
        setDragMode: function(n) {
            var t = this
              , e = t.options
              , u = t.dragBox
              , f = t.face
              , i = void 0
              , r = void 0;
            return t.loaded && !t.disabled && (i = "crop" === n,
            r = e.movable && "move" === n,
            n = i || r ? n : "none",
            k(u, "action", n),
            b(u, "cropper-crop", i),
            b(u, "cropper-move", r),
            e.cropBoxMovable || (k(f, "action", n),
            b(f, "cropper-crop", i),
            b(f, "cropper-move", r))),
            t
        }
    }
      , pt = "cropper"
      , d = pt + "-hidden"
      , wt = "error"
      , ht = "load"
      , rr = "ready"
      , vu = "crop"
      , yu = /^data:/
      , pu = /^data:image\/jpeg.*;base64,/
      , ur = void 0
      , a = function() {
        function n(i, r) {
            br(this, n);
            var u = this;
            u.element = i;
            u.options = t({}, ri, y(r) && r);
            u.loaded = !1;
            u.ready = !1;
            u.complete = !1;
            u.rotated = !1;
            u.cropped = !1;
            u.disabled = !1;
            u.replaced = !1;
            u.limited = !1;
            u.wheeling = !1;
            u.isImg = !1;
            u.originalUrl = "";
            u.canvasData = null;
            u.cropBoxData = null;
            u.previews = null;
            u.pointers = {};
            u.init()
        }
        return kr(n, [{
            key: "init",
            value: function() {
                var t = this
                  , n = t.element
                  , r = n.tagName.toLowerCase()
                  , i = void 0;
                if (!ut(n, pt)) {
                    if (k(n, pt, t),
                    "img" === r) {
                        if (t.isImg = !0,
                        t.originalUrl = i = n.getAttribute("src"),
                        !i)
                            return;
                        i = n.src
                    } else
                        "canvas" === r && window.HTMLCanvasElement && (i = n.toDataURL());
                    t.load(i)
                }
            }
        }, {
            key: "load",
            value: function(n) {
                var t = this, r = t.options, u = t.element, i;
                if (n) {
                    if (t.url = n,
                    t.imageData = {},
                    !r.checkOrientation || !window.ArrayBuffer)
                        return void t.clone();
                    if (yu.test(n))
                        return void (pu ? t.read(lr(n)) : t.clone());
                    i = new XMLHttpRequest;
                    i.onerror = i.onabort = function() {
                        t.clone()
                    }
                    ;
                    i.onload = function() {
                        t.read(i.response)
                    }
                    ;
                    r.checkCrossOrigin && ni(n) && u.crossOrigin && (n = ti(n));
                    i.open("get", n);
                    i.responseType = "arraybuffer";
                    i.withCredentials = "use-credentials" === u.crossOrigin;
                    i.send()
                }
            }
        }, {
            key: "read",
            value: function(n) {
                var i = this
                  , e = i.options
                  , o = cr(n)
                  , r = i.imageData
                  , t = 0
                  , u = 1
                  , f = 1;
                if (o > 1)
                    switch (i.url = ar(n),
                    o) {
                    case 2:
                        u = -1;
                        break;
                    case 3:
                        t = -180;
                        break;
                    case 4:
                        f = -1;
                        break;
                    case 5:
                        t = 90;
                        f = -1;
                        break;
                    case 6:
                        t = 90;
                        break;
                    case 7:
                        t = 90;
                        u = -1;
                        break;
                    case 8:
                        t = -90
                    }
                e.rotatable && (r.rotate = t);
                e.scalable && (r.scaleX = u,
                r.scaleY = f);
                i.clone()
            }
        }, {
            key: "clone",
            value: function() {
                var n = this, u = n.element, f = n.url, i = void 0, o = void 0, s = void 0, h = void 0, t;
                n.options.checkCrossOrigin && ni(f) && (i = u.crossOrigin,
                i ? o = f : (i = "anonymous",
                o = ti(f)));
                n.crossOrigin = i;
                n.crossOriginUrl = o;
                t = w("img");
                i && (t.crossOrigin = i);
                t.src = o || f;
                n.image = t;
                n.onStart = s = c(n.start, n);
                n.onStop = h = c(n.stop, n);
                n.isImg ? u.complete ? n.start() : e(u, ht, s) : (e(t, ht, s),
                e(t, wt, h),
                r(t, "cropper-hide"),
                u.parentNode.insertBefore(t, u.nextSibling))
            }
        }, {
            key: "start",
            value: function(n) {
                var i = this
                  , r = i.isImg ? i.element : i.image;
                n && (u(r, ht, i.onStart),
                u(r, wt, i.onStop));
                sr(r, function(n, r) {
                    t(i.imageData, {
                        naturalWidth: n,
                        naturalHeight: r,
                        aspectRatio: n / r
                    });
                    i.loaded = !0;
                    i.build()
                })
            }
        }, {
            key: "stop",
            value: function() {
                var n = this
                  , t = n.image;
                u(t, ht, n.onStart);
                u(t, wt, n.onStop);
                vt(t);
                n.image = null
            }
        }, {
            key: "build",
            value: function() {
                var n = this, t = n.options, h = n.element, a = n.image, v = void 0, i = void 0, y = void 0, b = void 0, u = void 0, c = void 0, l;
                n.loaded && (n.ready && n.unbuild(),
                l = w("div"),
                l.innerHTML = pr,
                n.container = v = h.parentNode,
                n.cropper = i = s(l, "cropper-container")[0],
                n.canvas = y = s(i, "cropper-canvas")[0],
                n.dragBox = b = s(i, "cropper-drag-box")[0],
                n.cropBox = u = s(i, "cropper-crop-box")[0],
                n.viewBox = s(i, "cropper-view-box")[0],
                n.face = c = s(u, "cropper-face")[0],
                at(y, a),
                r(h, d),
                v.insertBefore(i, h.nextSibling),
                n.isImg || o(a, "cropper-hide"),
                n.initPreview(),
                n.bind(),
                t.aspectRatio = Math.max(0, t.aspectRatio) || NaN,
                t.viewMode = Math.max(0, Math.min(3, Math.round(t.viewMode))) || 0,
                n.cropped = t.autoCrop,
                t.autoCrop ? t.modal && r(b, "cropper-modal") : r(u, d),
                t.guides || r(s(u, "cropper-dashed"), d),
                t.center || r(s(u, "cropper-center"), d),
                t.background && r(i, "cropper-bg"),
                t.highlight || r(c, "cropper-invisible"),
                t.cropBoxMovable && (r(c, "cropper-move"),
                k(c, "action", "all")),
                t.cropBoxResizable || (r(s(u, "cropper-line"), d),
                r(s(u, "cropper-point"), d)),
                n.setDragMode(t.dragMode),
                n.render(),
                n.ready = !0,
                n.setData(t.data),
                n.completing = setTimeout(function() {
                    f(t.ready) && e(h, rr, t.ready, !0);
                    p(h, rr);
                    p(h, vu, n.getData());
                    n.complete = !0
                }, 0))
            }
        }, {
            key: "unbuild",
            value: function() {
                var n = this;
                n.ready && (n.complete || clearTimeout(n.completing),
                n.ready = !1,
                n.complete = !1,
                n.initialImageData = null,
                n.initialCanvasData = null,
                n.initialCropBoxData = null,
                n.containerData = null,
                n.canvasData = null,
                n.cropBoxData = null,
                n.unbind(),
                n.resetPreview(),
                n.previews = null,
                n.viewBox = null,
                n.cropBox = null,
                n.dragBox = null,
                n.canvas = null,
                n.container = null,
                vt(n.cropper),
                n.cropper = null)
            }
        }], [{
            key: "noConflict",
            value: function() {
                return window.Cropper = ur,
                n
            }
        }, {
            key: "setDefaults",
            value: function(n) {
                t(ri, y(n) && n)
            }
        }]),
        n
    }();
    return t(a.prototype, eu),
    t(a.prototype, ou),
    t(a.prototype, su),
    t(a.prototype, cu),
    t(a.prototype, lu),
    t(a.prototype, au),
    "undefined" != typeof window && (ur = window.Cropper,
    window.Cropper = a),
    a
});
var n = void 0;
(function(t, i, r, u) {
    function e(n) {
        return n && (n.forEach || (n.forEach = function(n, t) {
            for (var r = t || window, i = 0, u = this.length; i < u; ++i)
                n.call(r, this[i], i, this)
        }
        ),
        n.filter || (n.filter = function(n, t) {
            for (var u = t || window, r = [], i = 0, f = this.length; i < f; ++i)
                n.call(u, this[i], i, this) && r.push(this[i]);
            return r
        }
        ),
        n.indexOf || (n.indexOf = function(n) {
            for (var t = 0; t < this.length; ++t)
                if (this[t] === n)
                    return t;
            return -1
        }
        )),
        n
    }
    if (!t.Ba || !t.Ba.zb) {
        var f = {
            zb: !0,
            e: {},
            plugins: {},
            hb: 0,
            f: {},
            addEventListener: t.addEventListener ? function(n, t, i) {
                n.addEventListener && n.addEventListener(t, i, !1)
            }
            : function(n, t, i) {
                n.attachEvent && n.attachEvent("on" + t, i, !1)
            }
            ,
            h: {},
            version: "10.4.23",
            i: {},
            pb: !1,
            t: 25,
            $: function() {
                /MSIE ([0-9]{1,}[.0-9]{0,})/.exec(r.userAgent) != null && (f.da = parseFloat(RegExp.$1));
                u.search && (f.i = f.pa(u.search));
                t.webtrendsAsyncInit && !t.webtrendsAsyncInit.hasRun && (t.webtrendsAsyncInit(),
                t.webtrendsAsyncInit.hasRun = !0);
                f.addEventListener(t, "load", function() {
                    f.pb = !0
                })
            },
            g: function(n) {
                return Object.prototype.toString.call(n) === "[object Function]"
            },
            qb: function(t) {
                var r = [], i;
                for (i in t)
                    t.hasOwnProperty(i) && t[i] != "" && t[i] != n && typeof t[i] != "function" && r.push({
                        k: i,
                        v: t[i]
                    });
                return r
            },
            extend: function(n, t, i) {
                for (var r in t)
                    (i || typeof n[r] == "undefined") && (n[r] = t[r]);
                return n
            },
            find: function(n) {
                return f.wa || (f.wa = f.nb()),
                f.wa(n)
            },
            nb: function() {
                var n = /MSIE (\d+)/.exec(r.userAgent), n = n ? n[1] : 99, u;
                return i.querySelectorAll && i.body && n > 8 ? (u = i.body,
                function(n) {
                    return u.querySelectorAll(n)
                }
                ) : t.jQuery ? t.jQuery.find : t.Sizzle ? t.Sizzle : t.YAHOO && YAHOO.za && YAHOO.za.Aa ? YAHOO.za.Aa.Nb : "qwery"in t ? qwery : (t.YUI && YUI().Pb("node", function(n) {
                    return n.all
                }),
                i.querySelectorAll ? (u = i.body) ? function(n) {
                    return u.querySelectorAll(n)
                }
                : function() {
                    return []
                }
                : function() {
                    return []
                }
                )
            },
            pa: function(n) {
                var n = n.split(/[&?]/g), r = {}, f, e, t, i, u;
                try {
                    for (f = 0,
                    e = n.length; f < e; ++f)
                        if (t = n[f].match(/^([^=]+)(?:=([\s\S]*))?/),
                        t && t[1]) {
                            i = "";
                            try {
                                i = decodeURIComponent(t[1])
                            } catch (o) {
                                try {
                                    i = unescape(t[1])
                                } catch (s) {
                                    i = t[1]
                                }
                            }
                            u = "";
                            try {
                                u = decodeURIComponent(t[2])
                            } catch (h) {
                                try {
                                    u = unescape(t[2])
                                } catch (c) {
                                    u = t[2]
                                }
                            }
                            r[i] ? (r[i] = [r[i]],
                            r[i].push(u)) : r[i] = u
                        }
                } catch (l) {}
                return r
            },
            aa: function(n, t) {
                var r, u;
                arguments.length < 2 && (t = !0);
                r = i.createElement("script");
                r.type = "text/javascript";
                r.async = t;
                r.src = n;
                u = i.getElementsByTagName("script")[0];
                u.parentNode.insertBefore(r, u)
            },
            V: function(n, t) {
                var i = n.target || n.srcElement, r, t;
                for (typeof t == "string" && (r = t,
                t = {},
                t[r.toUpperCase()] = 1); i && i.tagName && !t[i.tagName.toUpperCase()]; )
                    i = i.parentElement || i.parentNode;
                return i
            },
            fa: function(n) {
                return typeof encodeURIComponent == "function" ? encodeURIComponent(n) : escape(n)
            },
            sa: function(n) {
                for (var t in f.e)
                    f.e[t].ha(n);
                return !1
            },
            Q: function(n, t, i) {
                return t || (t = "collect"),
                i ? f.D("transform." + t, n, i) : f.D("transform." + t, n),
                this
            },
            D: function(n, t, u) {
                function s(t, i) {
                    f.h[n][t.n] || (f.h[n][t.n] = e([]));
                    f.h[n][t.n].push(i)
                }
                var o, h;
                if (n && t && n != "" && f.g(t))
                    if (n === "wtmouseup" && (n = "wtmouse"),
                    n !== "wtmouse" || f.ta || (o = /MSIE (\d+)/.exec(r.userAgent),
                    f.addEventListener(i, (o ? o[1] : 99) >= 8 ? "mousedown" : "mouseup", function(t) {
                        t || (t = window.event);
                        f.Pa(n, {
                            event: t
                        })
                    }),
                    f.ta = !0),
                    f.h[n] || (f.h[n] = {}),
                    u)
                        s(u, t);
                    else
                        for (h in f.e)
                            s(f.e[h], t)
            },
            Pa: function(n, t) {
                for (var i in f.e)
                    f.fireEvent(n, f.e[i], t)
            },
            Ca: function(n, t, i, r) {
                if (typeof t == "function")
                    return t.onetime ? (i.push(t),
                    !0) : (t(n, r),
                    !1)
            },
            fireEvent: function(n, t, i) {
                var u = e([]), r;
                if (f.h[n] && f.h[n][t.n]) {
                    if (n = f.h[n][t.n],
                    !n.length)
                        return;
                    for (r = n.length - 1; r >= 0; r--)
                        f.Ca(t, n[r], u, i) && n.pop()
                }
                u.forEach(function(n) {
                    n(t, i)
                })
            },
            ca: function(n, t) {
                var r = !1, u, i;
                for (u in f.e)
                    i = f.e[u],
                    n in i.plugins && (r = !0,
                    i.ca(n, t));
                r || t({
                    Mb: !0
                })
            },
            T: function(n, t) {
                for (var f, u = i.cookie.split("; "), e = [], o = 0, r = 0, h = n.length, s = u.length, r = 0; r < s; r++)
                    f = u[r],
                    f.substring(0, h + 1) == n + "=" && (e[o++] = f);
                if (u = e.length,
                u > 0) {
                    if (o = 0,
                    u > 1 && n == t)
                        for (s = new Date(0),
                        r = 0; r < u; r++)
                            f = new Date(parseInt(this.Wa(e[r], "lv"))),
                            f > s && (s.setTime(f.getTime()),
                            o = r);
                    return unescape(e[o].substring(h + 1))
                }
                return null
            },
            Wa: function(n, t, i) {
                for (n = n.split(i || ":"),
                i = 0; i < n.length; i++) {
                    var r = n[i].split("=");
                    if (t == r[0])
                        return r[1]
                }
                return null
            }
        }
          , o = f.fireEvent
          , s = f.D;
        f.b = function() {
            return this.na = t.RegExp ? /dcs(uri)|(ref)|(aut)|(met)|(sta)|(sip)|(pro)|(byt)|(dat)|(p3p)|(cfg)|(redirect)|(cip)/i : "",
            this.va = {},
            this.plugins = this.plugins = {},
            this.d = this.WT = {},
            this.j = this.DCS = {},
            this.q = this.DCSext = {},
            this.n = this.dcssID = "dcsobj_" + f.hb++,
            this.images = this.images = [],
            this.ma = this.errors = [],
            this.a = this.FPCConfig = {},
            this.c = this.TPCConfig = {},
            this.images = [],
            this.w = [],
            this.Eb = [],
            this.l = [],
            this.N = [],
            this.P = "",
            this.ba = this.p = 0,
            this.X = this.oa = "",
            this.ta = !1,
            this
        }
        ;
        f.b.prototype = {
            $: function(i) {
                function r(n, t) {
                    return i.hasOwnProperty(n) ? i[n] : t
                }
                function u(n, t, i) {
                    return n ? n.hasOwnProperty(t) ? n[t] : i : i
                }
                return this.Gb = i,
                this.I = r("errorlogger", function() {}),
                this.gb = this.dcsid = i.dcsid,
                this.L = this.queue = r("queue", []),
                this.domain = this.domain = r("domain", "statse.webtrendslive.com"),
                this.Bb = this.timezone = r("timezone", -8),
                this.enabled = this.enabled = r("enabled", !0),
                this.Z = this.i18n = r("i18n", !0),
                this.va = t.RegExp ? this.Z ? {
                    "%25": /\%/g,
                    "%26": /\&/g,
                    "%23": /\#/g
                } : {
                    "%09": /\t/g,
                    "%20": / /g,
                    "%23": /\#/g,
                    "%26": /\&/g,
                    "%2B": /\+/g,
                    "%3F": /\?/g,
                    "%5C": /\\/g,
                    "%22": /\"/g,
                    "%7F": /\x7F/g,
                    "%A0": /\xA0/g
                } : "",
                i.metanames && (this.ra = e(i.metanames.toLowerCase().split(","))),
                t.webtrendsAsyncLoad && typeof t.webtrendsAsyncLoad == "function" && !r("privateFlag", !1) && f.D("onready", window.webtrendsAsyncLoad, this),
                this.M = this.vtid = r("vtid", n),
                this.ua = r("paidsearchparams", "gclid"),
                this.yb = this.splitvalue = r("splitvalue", ""),
                f.t = i.dcsdelay || f.t,
                this.ib = this.delayAll = r("delayAll", !1),
                this.K = this.preserve = r("preserve", !0),
                this.w = e(r("navigationtag", "div,table").toLowerCase().split(",")),
                this.l = r("onsitedoms", ""),
                f.g(this.l.test) || (this.l = e(this.l.toLowerCase().split(",")),
                this.l.forEach(function(n, t, i) {
                    i[t] = n.replace(/^\s*/, "").replace(/\s*$/, "")
                })),
                this.N = e(r("downloadtypes", "xls,doc,pdf,txt,csv,zip,docx,xlsx,rar,gzip").toLowerCase().split(",")),
                this.N.forEach(function(n, t, i) {
                    i[t] = n.replace(/^\s*/, "").replace(/\s*$/, "")
                }),
                r("adimpressions", !1) && (this.P = r("adsparam", "WT.ac")),
                this.a.enabled = this.FPCConfig.enabled = u(i.FPCConfig, "enabled", !0),
                this.a.domain = this.FPCConfig.domain = u(i.FPCConfig, "domain", r("fpcdom", "")),
                this.a.name = this.FPCConfig.name = u(i.FPCConfig, "name", r("fpc", "WT_FPC")),
                this.a.u = this.FPCConfig.expiry = u(i.FPCConfig, "expires", r("cookieexpires", 63113851500)),
                this.a.u = this.a.u < 63113851500 ? this.a.u : 63113851500,
                this.a.kb = new Date(this.getTime() + this.a.u),
                this.a.wb = this.a.u === 0,
                this.c.enabled = this.TPCConfig.enabled = u(i.TPCConfig, "enabled", !r("disablecookie", !1)),
                this.c.R = this.TPCConfig.cfgType = u(i.TPCConfig, "cfgType", this.c.enabled ? "" : "1"),
                i.cookieTypes && (i.cookieTypes.toLowerCase() === "none" ? (this.a.enabled = !1,
                this.c.enabled = !1,
                this.c.R = "1") : i.cookieTypes.toLowerCase() === "firstpartyonly" ? (this.a.enabled = !0,
                this.c.enabled = !1,
                this.c.R = "1") : i.cookieTypes.toLowerCase() === "all" && (this.a.enabled = !0,
                this.c.enabled = !0,
                this.c.R = u(i.TPCConfig, "cfgType", ""))),
                this.Jb = this.fpc = this.a.name,
                this.Kb = this.fpcdom = this.a.domain,
                this.Ib = this.cookieExp = this.a.u,
                e(r("pageEvents", [])).forEach(function(n) {
                    this.Db = i[n.toLowerCase()] = !0
                }),
                r("offsite", !1) && this.Ma(),
                r("download", !1) && this.Ka(),
                r("anchor", !1) && this.Ja(),
                r("javascript", !1) && this.La(),
                r("rightclick", !1) && this.Na(),
                r("privateFlag", !1) || (f.e[this.n] = this),
                this.plugins = i.plugins || {},
                this.Fa(),
                f.f[this.domain] || (f.f[this.domain] = ""),
                !r("privateFlag", !1) && this.a.enabled && this.Ya(this.n),
                this.F(),
                this
            },
            Fa: function() {
                var i, n, r, u;
                for (i in this.plugins)
                    n = this.plugins[i],
                    f.plugins[i] || (f.plugins[i] = n,
                    r = n.src,
                    f.g(r) ? t.setTimeout(function(n) {
                        return function() {
                            n()
                        }
                    }(r), 1) : f.aa(r, !1)),
                    n.async || (u = this,
                    n.loaded = !1,
                    this.p++,
                    n.Qb && this.ba++,
                    n.timeout && t.setTimeout(function(n) {
                        return function() {
                            n.loaded || (n.Ab = !0,
                            u.p--,
                            u.F())
                        }
                    }(n), n.timeout))
            },
            Za: function(n) {
                typeof n != "undefined" && (!f.f[this.domain] && n.gTempWtId && (f.f[this.domain] = n.gTempWtId),
                this.X = n.gTempWtId,
                !f.f[this.domain] && n.gWtId && (f.f[this.domain] = n.gWtId),
                this.oa = n.gWtAccountRollup);
                this.p--;
                this.F()
            },
            Ya: function(n) {
                return i.cookie.indexOf(this.a.name + "=") == -1 && i.cookie.indexOf("WTLOPTOUT=") == -1 && this.c.enabled ? (this.enabled && (f.aa("//" + this.domain + "/" + this.gb + "/wtid.js?callback=Webtrends.dcss." + n + ".dcsGetIdCallback", !0),
                this.p++),
                !1) : !0
            },
            ca: function(n, t) {
                var i = this.plugins[n];
                i && (f.g(t) && (this.tb() ? t(this, i) : s("pluginsLoaded", function(n, t, i) {
                    function r() {
                        n(t, i)
                    }
                    return r.onetime = !0,
                    r
                }(t, this, i), this)),
                i.loaded = !0,
                !i.async && !i.Ab && this.p--);
                this.F()
            },
            vb: function() {
                this.ba--;
                this.F()
            },
            tb: function() {
                return this.p <= 0
            },
            F: function() {
                this.p <= 0 && (this.Ea || (o("pluginsLoaded", this),
                this.Ea = !0),
                this.ba <= 0 && this.xb())
            },
            xb: function() {
                this.Ga || (o("onready", this),
                this.ob(),
                this.ub(),
                this.Ga = !0)
            },
            ob: function() {
                for (var n = 0; n < this.L.length; n++)
                    this.ka(this.L[n]);
                this.L = []
            },
            ub: function() {
                var n = this;
                this.L.push = function(t) {
                    n.ka(t)
                }
            },
            Q: function(n, t) {
                f.Q(n, t, this)
            },
            r: function(t, i) {
                var r = this
                  , u = f.extend({
                    domEvent: "click",
                    callback: n,
                    argsa: [],
                    args: {},
                    delayTime: n,
                    transform: n,
                    filter: n,
                    actionElems: {
                        A: 1,
                        INPUT: 1
                    },
                    finish: n
                }, i, !0);
                return s("wtmouse", function(n, i) {
                    r.Oa(r, t, f.extend(i, u, !0))
                }, r),
                this
            },
            xa: function(n, t, i, r) {
                t.element = i;
                (r === "form" || r === "input" || r === "button") && (t.domEvent = "submit");
                n.ea(t)
            },
            Oa: function(n, t, i) {
                var u = f.find, r, e;
                if (u && i.event && i.actionElems) {
                    if (r = f.V(i.event, i.actionElems),
                    e = r.tagName ? r.tagName.toLowerCase() : "",
                    t.toUpperCase()in i.actionElems && t.toUpperCase() === e.toUpperCase())
                        return this.xa(n, i, r, e);
                    if ((t = u(t)) && r && t && t.length)
                        for (u = 0; u < t.length; u++)
                            if (t[u] === r) {
                                this.xa(n, i, r, e);
                                break
                            }
                }
            },
            W: function(n, t) {
                var r = e(i.cookie.split("; ")).filter(function(t) {
                    return t.indexOf(n + "=") != -1
                })[0];
                return !r || r.length < n.length + 1 ? !1 : (e(r.split(n + "=")[1].split(":")).forEach(function(n) {
                    n = n.split("=");
                    t[n[0]] = n[1]
                }),
                !0)
            },
            T: function(n) {
                return f.T(n, this.a.name)
            },
            cb: function(n, t, r) {
                var u = []
                  , t = f.qb(t);
                e(t).forEach(function(n) {
                    u.push(n.k + "=" + n.v)
                });
                u = u.sort().join(":");
                i.cookie = n + "=" + u + r
            },
            Ta: function(n, t, i) {
                n += "=";
                n += "; expires=expires=Thu, 01 Jan 1970 00:00:01 GMT";
                n += "; path=" + t;
                n += i ? ";domain=" + i : "";
                document.cookie = n
            },
            $a: function(n, t, i, r) {
                var u = {};
                return this.W(n, u) ? t == u.id && i == u.lv && r == u.ss ? 0 : 3 : 2
            },
            Xa: function() {
                var n = {};
                return this.W(this.a.name, n),
                n
            },
            Va: function() {
                var u, e;
                if (i.cookie.indexOf("WTLOPTOUT=") == -1)
                    if (this.d.ce = !this.a.enabled && !this.c.enabled ? "0" : this.a.enabled && !this.c.enabled ? "1" : "2",
                    this.a.enabled) {
                        var n = this.d
                          , o = this.a.name
                          , t = new Date
                          , s = t.getTimezoneOffset() * 6e4 + this.Bb * 36e5;
                        if (t.setTime(t.getTime() + s),
                        u = new Date(t.getTime()),
                        n.co_f = n.vtid = n.vtvs = n.vt_f = n.vt_f_a = n.vt_f_s = n.vt_f_d = n.vt_f_tlh = n.vt_f_tlv = "",
                        e = {},
                        this.W(o, e)) {
                            var r = e.id
                              , c = parseInt(e.lv)
                              , h = parseInt(e.ss);
                            if (r == null || r == "null" || isNaN(c) || isNaN(h))
                                return;
                            n.co_f = r;
                            r = new Date(c);
                            n.vt_f_tlh = Math.floor((r.getTime() - s) / 1e3);
                            u.setTime(h);
                            (t.getTime() > r.getTime() + 18e5 || t.getTime() > u.getTime() + 288e5) && (n.vt_f_tlv = Math.floor((u.getTime() - s) / 1e3),
                            u.setTime(t.getTime()),
                            n.vt_f_s = "1");
                            (t.getDate() != r.getDate() || t.getMonth() != r.getMonth() || t.getFullYear() != r.getFullYear()) && (n.vt_f_d = "1")
                        } else {
                            if (this.X.length)
                                n.co_f = f.f[this.domain].length ? f.f[this.domain] : this.X,
                                n.vt_f = "1";
                            else if (f.f[this.domain].length)
                                n.co_f = f.f[this.domain];
                            else {
                                for (n.co_f = "2",
                                h = t.getTime().toString(),
                                r = 2; r <= 32 - h.length; r++)
                                    n.co_f += Math.floor(Math.random() * 16).toString(16);
                                n.co_f += h;
                                n.vt_f = "1"
                            }
                            this.oa.length == 0 && (n.vt_f_a = "1");
                            n.vt_f_s = n.vt_f_d = "1";
                            n.vt_f_tlh = n.vt_f_tlv = "0"
                        }
                        n.co_f = escape(n.co_f);
                        n.vtid = typeof this.M == "undefined" ? n.co_f : this.M || "";
                        n.vtvs = (u.getTime() - s).toString();
                        s = (this.a.wb ? "" : "; expires=" + this.a.kb.toGMTString()) + "; path=/" + (this.a.domain != "" ? "; domain=" + this.a.domain : "");
                        t = t.getTime().toString();
                        u = u.getTime().toString();
                        e.id = n.co_f;
                        e.lv = t;
                        e.ss = u;
                        this.cb(o, e, s);
                        o = this.$a(o, n.co_f, t, u);
                        o != 0 && (n.co_f = n.vtvs = n.vt_f_s = n.vt_f_d = n.vt_f_tlh = n.vt_f_tlv = "",
                        typeof this.M == "undefined" && (n.vtid = ""),
                        n.vt_f = n.vt_f_a = o)
                    } else
                        this.d.vtid = this.M ? this.M : "",
                        this.Ta(this.a.name, "/", this.a.domain)
            },
            Cb: function() {
                try {
                    var t;
                    return arguments && arguments.length > 1 ? t = {
                        argsa: Array.prototype.slice.call(arguments)
                    } : arguments.length === 1 && (t = arguments[0]),
                    typeof t == "undefined" && (t = {
                        element: n,
                        event: n,
                        Fb: []
                    }),
                    typeof t.argsa == "undefined" && (t.argsa = []),
                    this.la("collect", t),
                    this
                } catch (i) {
                    this.ma.push(i);
                    this.I(i)
                }
            },
            ha: function(n) {
                n && n.length > 1 && (n = {
                    argsa: Array.prototype.slice.call(arguments)
                });
                this.ea(n)
            },
            ea: function(n) {
                try {
                    if (typeof n == "undefined" && (n = {}),
                    this.la("multitrack", n),
                    n.delayTime) {
                        var t = Number(n.delayTime);
                        this.ya(isNaN(t) ? f.t : t)
                    } else
                        this.ib && this.ya(f.t);
                    return !1
                } catch (i) {
                    this.ma.push(i);
                    this.I(i)
                }
            },
            Ra: function() {
                this.j = {};
                this.d = {};
                this.q = {};
                arguments.length % 2 == 0 && this.U(arguments)
            },
            U: function(n) {
                if (n)
                    for (var t = 0, i = n.length; t < i; t += 2)
                        n[t].indexOf("WT.") == 0 ? this.d[n[t].substring(3)] = n[t + 1] : n[t].indexOf("DCS.") == 0 ? this.j[n[t].substring(4)] = n[t + 1] : n[t].indexOf("DCSext.") == 0 && (this.q[n[t].substring(7)] = n[t + 1])
            },
            eb: function(n) {
                var i, t, r, u;
                if (this.K)
                    for (this.C = [],
                    r = 0,
                    u = n.length; r < u; r += 2)
                        t = n[r],
                        t.indexOf("WT.") == 0 ? (i = t.substring(3),
                        this.C.push(t, this.d[i] || "")) : t.indexOf("DCS.") == 0 ? (i = t.substring(4),
                        this.C.push(t, this.j[i] || "")) : t.indexOf("DCSext.") == 0 && (i = t.substring(7),
                        this.C.push(t, this.q[i] || ""))
            },
            bb: function() {
                this.K && (this.U(this.C),
                this.C = [])
            },
            fb: function() {
                var h = new Date, c = this, n = this.d, e = this.j, s, o;
                if (n.tz = parseInt(h.getTimezoneOffset() / -60) || "0",
                n.bh = h.getHours() || "0",
                n.ul = r.language || r.userLanguage,
                typeof screen == "object" && (n.cd = r.appName == "Netscape" ? screen.pixelDepth : screen.colorDepth,
                n.sr = screen.width + "x" + screen.height),
                typeof r.javaEnabled() == "boolean" && (n.jo = r.javaEnabled() ? "Yes" : "No"),
                i.title && (n.ti = t.RegExp ? i.title.replace(RegExp("^" + u.protocol + "//" + u.hostname + "\\s-\\s"), "") : i.title),
                n.js = "Yes",
                n.jv = function() {
                    var n = navigator.userAgent.toLowerCase()
                      , r = parseInt(navigator.appVersion)
                      , v = n.indexOf("mac") != -1
                      , u = n.indexOf("firefox") != -1
                      , f = n.indexOf("firefox/0.") != -1
                      , e = n.indexOf("firefox/1.0") != -1
                      , o = n.indexOf("firefox/1.5") != -1
                      , s = n.indexOf("firefox/2.0") != -1
                      , h = !u && n.indexOf("mozilla") != -1 && n.indexOf("compatible") == -1
                      , i = n.indexOf("msie") != -1 && n.indexOf("opera") == -1
                      , c = i && r == 4 && n.indexOf("msie 4") != -1
                      , i = i && !c
                      , l = n.indexOf("opera 5") != -1 || n.indexOf("opera/5") != -1
                      , a = n.indexOf("opera 6") != -1 || n.indexOf("opera/6") != -1
                      , n = n.indexOf("opera") != -1 && !l && !a
                      , t = "1.1";
                    return u && !f && !e & !o & !s ? t = "1.8" : s ? t = "1.7" : o ? t = "1.6" : f || e || h && r >= 5 || n ? t = "1.5" : v && i || a ? t = "1.4" : i || h && r == 4 || l ? t = "1.3" : c && (t = "1.2"),
                    t
                }(),
                n.ct = "unknown",
                i.body && i.body.addBehavior)
                    try {
                        i.body.addBehavior("#default#clientCaps");
                        n.ct = i.body.Hb || "unknown";
                        i.body.addBehavior("#default#homePage");
                        n.hp = i.body.Lb(location.href) ? "1" : "0"
                    } catch (l) {
                        c.I(l)
                    }
                if (s = 0,
                o = 0,
                typeof t.innerWidth == "number" ? (s = t.innerWidth,
                o = t.innerHeight) : i.documentElement && (i.documentElement.clientWidth || i.documentElement.clientHeight) ? (s = i.documentElement.clientWidth,
                o = i.documentElement.clientHeight) : i.body && (i.body.clientWidth || i.body.clientHeight) && (s = i.body.clientWidth,
                o = i.body.clientHeight),
                n.bs = s + "x" + o,
                n.fv = function() {
                    var n;
                    if (t.ActiveXObject)
                        for (n = 15; n > 0; n--)
                            try {
                                return new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + n),
                                n + ".0"
                            } catch (i) {
                                c.I(i)
                            }
                    else if (r.plugins && r.plugins.length)
                        for (n = 0; n < r.plugins.length; n++)
                            if (r.plugins[n].name.indexOf("Shockwave Flash") != -1)
                                return r.plugins[n].description.split(" ")[2];
                    return "Not enabled"
                }(),
                n.slv = function() {
                    var t = "Not enabled", n, i, u;
                    try {
                        r.userAgent.indexOf("MSIE") != -1 ? new ActiveXObject("AgControl.AgControl") && (t = "Unknown") : r.plugins["Silverlight Plug-In"] && (t = "Unknown")
                    } catch (f) {
                        c.I(f)
                    }
                    if (t != "Not enabled" && typeof Silverlight == "object" && typeof Silverlight.qa == "function") {
                        for (n = 9; n > 0; n--) {
                            if (i = n,
                            Silverlight.qa(i + ".0"))
                                break;
                            if (t == i)
                                break
                        }
                        for (n = 9; n >= 0; n--) {
                            if (u = i + "." + n,
                            Silverlight.qa(u)) {
                                t = u;
                                break
                            }
                            if (t == u)
                                break
                        }
                    }
                    return t
                }(),
                this.Z && (n.le = typeof i.defaultCharset == "string" ? i.defaultCharset : typeof i.characterSet == "string" ? i.characterSet : "unknown"),
                n.tv = f.version,
                n.sp = this.yb,
                n.dl = "0",
                f.i && f.i.lb && (n.fb_ref = f.i.lb),
                f.i && f.i.mb && (n.fb_source = f.i.mb),
                n.ssl = u.protocol.indexOf("https:") == 0 ? "1" : "0",
                e.dcsdat = h.getTime(),
                e.dcssip = u.hostname,
                e.dcsuri = u.pathname,
                n.es = e.dcssip + e.dcsuri,
                u.search && (e.dcsqry = u.search),
                e.dcsqry)
                    for (h = e.dcsqry.toLowerCase(),
                    s = this.ua.length ? this.ua.toLowerCase().split(",") : [],
                    o = 0; o < s.length; o++)
                        if (h.indexOf(s[o] + "=") != -1) {
                            n.srch = "1";
                            break
                        }
                i.referrer == "" || i.referrer == "-" || r.appName == "Microsoft Internet Explorer" && parseInt(r.appVersion) < 4 || (e.dcsref = i.referrer);
                e.dcscfg = this.c.R
            },
            Ua: function(t, i) {
                if (i != "") {
                    if (t === null || t === n)
                        return "";
                    var t = t.toString(), r;
                    for (r in i)
                        i[r]instanceof RegExp && (t = t.replace(i[r], r));
                    return t
                }
                return escape(t)
            },
            S: function(n, t) {
                var u, s, i;
                if (this.Z && this.na != "" && !this.na.test(n))
                    if (n == "dcsqry") {
                        for (var e = "", o = t.substring(1).split("&"), r = 0; r < o.length; r++)
                            i = o[r],
                            u = i.indexOf("="),
                            u != -1 && (s = i.substring(0, u),
                            i = i.substring(u + 1),
                            r != 0 && (e += "&"),
                            e += s + "=" + f.fa(i));
                        t = t.substring(0, 1) + e
                    } else
                        t = f.fa(t);
                return "&" + n + "=" + this.Ua(t, this.va)
            },
            Sa: function(n, r) {
                var u;
                if (i.images) {
                    if (u = new Image,
                    this.images.push(u),
                    arguments.length === 2 && r && f.g(r.callback)) {
                        var e = !1
                          , o = r.callback
                          , s = this;
                        u.onload = function() {
                            if (!e)
                                return e = !0,
                                o(s, r),
                                !0
                        }
                        ;
                        t.setTimeout(function() {
                            if (!e)
                                return e = !0,
                                o(s, r),
                                !0
                        }, f.t)
                    }
                    u.src = n
                }
            },
            ab: function() {
                var t, f, r, n, u;
                if (i.documentElement ? t = i.getElementsByTagName("meta") : i.all && (t = i.all.Ob("meta")),
                typeof t != "undefined")
                    for (f = t.length,
                    r = 0; r < f; r++)
                        n = t.item(r).name,
                        u = t.item(r).content,
                        t.item(r),
                        n.length > 0 && (n = n.toLowerCase(),
                        n.toUpperCase().indexOf("WT.") == 0 ? this.d[n.substring(3)] = u : n.toUpperCase().indexOf("DCSEXT.") == 0 ? this.q[n.substring(7)] = u : n.toUpperCase().indexOf("DCS.") == 0 ? this.j[n.substring(4)] = u : this.ra && this.ra.indexOf(n) != -1 && (this.q["meta_" + n] = u))
            },
            ia: function(t) {
                var r;
                if (i.cookie.indexOf("WTLOPTOUT=") == -1) {
                    var e = this.d
                      , s = this.j
                      , h = this.q
                      , c = this.i18n
                      , o = "http" + (u.protocol.indexOf("https:") == 0 ? "s" : "") + "://" + this.domain + (this.dcsid == "" ? "" : "/" + this.dcsid) + "/dcs.gif?";
                    c && (e.dep = "");
                    for (r in s)
                        s[r] != "" && s[r] != n && typeof s[r] != "function" && (o += this.S(r, s[r]));
                    for (r in e)
                        e[r] != "" && e[r] != n && typeof e[r] != "function" && (o += this.S("WT." + r, e[r]));
                    for (r in h)
                        h[r] != "" && h[r] != n && typeof h[r] != "function" && (c && (e.dep = e.dep.length == 0 ? r : e.dep + ";" + r),
                        o += this.S(r, h[r]));
                    c && e.dep.length > 0 && (o += this.S("WT.dep", e.dep));
                    f.da && f.da < 9 && o.length > 2048 && (o = o.substring(0, 2040) + "&WT.tu=1");
                    this.Sa(o, t);
                    this.d.ad = ""
                }
            },
            rb: function() {
                this.fb();
                this.ab();
                this.P && this.P.length > 0 && this.Qa();
                this.sb = !0
            },
            getTime: function() {
                return (new Date).getTime()
            },
            jb: 0,
            ya: function(n) {
                for (var t = this.getTime(); this.getTime() - t < n; )
                    this.jb++
            },
            la: function(n, t) {
                n || (n = "collect");
                this.L.push({
                    action: n,
                    message: t
                })
            },
            ka: function(n) {
                var r = "action_" + n.action, t = n.message, i;
                if (this.sb || this.rb(),
                t.event && !t.element && (t.element = f.V(t.event, {
                    A: 1
                })),
                !f.g(t.filter) || !t.filter(this, t)) {
                    if (t.args) {
                        t.argsa = t.argsa || [];
                        for (i in t.args)
                            t.argsa.push(i, t.args[i])
                    }
                    t.element && t.element.getAttribute && t.element.getAttribute("data-wtmt") && (t.argsa = t.argsa.concat(t.element.getAttribute("data-wtmt").split(",")));
                    o("transform." + n.action, this, t);
                    o("transform.all", this, t);
                    t.transform && f.g(t.transform) && t.transform(this, t);
                    this.enabled && (this.Va(),
                    f.g(this[r]) && this[r](t),
                    o("finish." + n.action, this, t),
                    o("finish.all", this, t),
                    t.finish && f.g(t.finish) && t.finish(this, t))
                }
            },
            Ia: function(n) {
                var t = n && n.argsa && n.argsa.length % 2 == 0;
                t && (this.eb(n.argsa),
                this.U(n.argsa));
                this.j.dcsdat = this.getTime();
                this.ia(n);
                t && this.bb()
            },
            Ha: function(n) {
                n && n.argsa && n.argsa.length % 2 == 0 && this.U(n.argsa);
                this.ia(n)
            },
            J: function(n) {
                var i = document.createElement("a");
                return i.href = n.href,
                n = {},
                n.H = i.hostname ? i.hostname.split(":")[0] : window.location.hostname,
                n.o = i.pathname ? i.pathname.indexOf("/") != 0 ? "/" + i.pathname : i.pathname : "/",
                n.m = i.search ? i.search.substring(i.search.indexOf("?") + 1, i.search.length) : "",
                n.G = t.location,
                n
            },
            ga: function(n, t) {
                if (n.length > 0) {
                    if (n = n.toLowerCase(),
                    n == window.location.hostname.toLowerCase())
                        return !0;
                    if (f.g(t.test))
                        return t.test(n);
                    if (t.length > 0)
                        for (var r = t.length, i = 0; i < r; i++)
                            if (n == t[i])
                                return !0
                }
                return !1
            },
            ja: function(n, t) {
                for (var r = n.toLowerCase().substring(n.lastIndexOf(".") + 1, n.length), u = t.length, i = 0; i < u; i++)
                    if (r == t[i])
                        return !0;
                return !1
            },
            s: function(n, t) {
                for (var r = "", i = "", o = t.length, e, u = 0; u < o; u++)
                    if (e = t[u],
                    e.length && (i = f.V(n, e),
                    r = i.getAttribute && i.getAttribute("id") ? i.getAttribute("id") : "",
                    i = i.className || "",
                    r.length || i.length))
                        break;
                return r.length ? r : i
            },
            Y: function(n, t, r) {
                var e = i.all ? t.innerText : t.text, n = f.V(n, {
                    IMG: 1
                }), u;
                return n && n.alt ? u = n.alt : e ? u = e : t.innerHTML && (u = t.innerHTML),
                u ? u : r
            },
            B: function() {
                this.K || (this.Da = this.K = !0)
            },
            z: function() {
                this.Da = this.K = !1
            },
            O: function(n) {
                var t = !1;
                return n || (n = window.event),
                n.which ? t = n.which == 3 : n.button && (t = n.button == 2),
                t
            },
            Ma: function() {
                this.r("a", {
                    filter: function(n, t) {
                        var i = t.element || {}
                          , r = t.event || {};
                        return i.hostname && !n.ga(i.hostname, n.l) && !n.O(r) ? !1 : !0
                    },
                    transform: function(n, t) {
                        var r = t.event || {}
                          , i = t.element || {};
                        n.B(t);
                        i = n.J(i);
                        t.argsa.push("DCS.dcssip", i.H, "DCS.dcsuri", i.o, "DCS.dcsqry", i.m, "DCS.dcsref", i.G, "WT.ti", "Offsite:" + i.H + i.o + (i.m.length ? "?" + i.m : ""), "WT.dl", "24", "WT.nv", n.s(r, n.w))
                    },
                    finish: function(n) {
                        n.z()
                    }
                })
            },
            Ja: function() {
                this.r("a", {
                    filter: function(n, t) {
                        var i = t.element || {}
                          , r = t.event || {};
                        return n.ga(i.hostname, n.l) && i.hash && i.hash != "" && i.hash != "#" && !n.O(r) ? !1 : !0
                    },
                    transform: function(n, t) {
                        var r = t.event || {}
                          , i = t.element || {};
                        n.B(t);
                        i = n.J(i);
                        t.argsa.push("DCS.dcssip", i.H, "DCS.dcsuri", escape(i.o + t.element.hash), "DCS.dcsqry", i.m, "DCS.dcsref", i.G, "WT.ti", escape("Anchor:" + t.element.hash), "WT.nv", n.s(r, n.w), "WT.dl", "21")
                    },
                    finish: function(n) {
                        n.z()
                    }
                })
            },
            Ka: function() {
                this.r("a", {
                    filter: function(n, t) {
                        var i = t.event || {};
                        return n.ja((t.element || {}).pathname, n.N) && !n.O(i) ? !1 : !0
                    },
                    transform: function(n, t) {
                        var u = t.event || {}, r = t.element || {}, i;
                        n.B(t);
                        i = n.J(r);
                        r = n.Y(u, r, i.o);
                        t.argsa.push("DCS.dcssip", i.H, "DCS.dcsuri", i.o, "DCS.dcsqry", i.m, "DCS.dcsref", i.G, "WT.ti", "Download:" + r, "WT.nv", n.s(u, n.w), "WT.dl", "20")
                    },
                    finish: function(n) {
                        n.z()
                    }
                })
            },
            Na: function() {
                this.r("a", {
                    filter: function(n, t) {
                        var i = t.event || {};
                        return n.ja((t.element || {}).pathname, n.N) && n.O(i) ? !1 : !0
                    },
                    transform: function(n, t) {
                        var u = t.event || {}, r = t.element || {}, i;
                        n.B(t);
                        i = n.J(r);
                        r = n.Y(u, r, i.o);
                        t.argsa.push("DCS.dcssip", i.H, "DCS.dcsuri", i.o, "DCS.dcsqry", i.m, "DCS.dcsref", i.G, "WT.ti", "RightClick:" + r, "WT.nv", n.s(u, n.w), "WT.dl", "25")
                    },
                    finish: function(n) {
                        n.z()
                    }
                })
            },
            La: function() {
                this.r("a", {
                    filter: function(n, t) {
                        var i = t.element || {};
                        return i.href && i.protocol && i.protocol.toLowerCase() === "javascript:" ? !1 : !0
                    },
                    transform: function(n, i) {
                        var f = i.event || {}, r = i.element || {}, u;
                        n.B(i);
                        u = n.J(r);
                        i.argsa.push("DCS.dcssip", t.location.hostname, "DCS.dcsuri", r.href, "DCS.dcsqry", u.m, "DCS.dcsref", u.G, "WT.ti", "JavaScript:" + (r.innerHTML ? r.innerHTML : ""), "WT.dl", "22", "WT.nv", n.s(f, n.w))
                    },
                    finish: function(n) {
                        n.z()
                    }
                })
            },
            Qa: function() {
                var u;
                if (i.links) {
                    var r = this.P + "=", e = r.length, r = RegExp(r, "i"), o = i.links.length, t = end = -1, n = urlp = value = "", f, n = i.URL + "", t = n.search(r);
                    for (t != -1 && (end = n.indexOf("&", t),
                    urlp = n.substring(t, end != -1 ? end : n.length),
                    f = RegExp(urlp + "(&|#)", "i")),
                    u = 0; u < o; u++)
                        i.links[u].href && (n = i.links[u].href + "",
                        urlp.length > 0 && (n = n.replace(f, "$1")),
                        t = n.search(r),
                        t != -1) && (t += e,
                        end = n.indexOf("&", t),
                        value = n.substring(t, end != -1 ? end : n.length),
                        this.d.ad = this.d.ad ? this.d.ad + ";" + value : value)
                }
            }
        };
        f.b.prototype.action_multitrack = f.b.prototype.Ia;
        f.b.prototype.action_collect = f.b.prototype.Ha;
        t.dcsMultiTrack = function() {
            for (var t = [], n = 0; n < arguments.length; n++)
                t[n] = arguments[n];
            f.sa({
                argsa: t
            })
        }
        ;
        t.Webtrends = f;
        t.WebTrends = f;
        f.multiTrack = f.sa;
        f.dcs = f.b;
        f.dcss = f.e;
        f.addTransform = f.Q;
        f.bindEvent = f.D;
        f.getQryParams = f.pa;
        f.qryparams = f.i;
        f.dcsdelay = f.t;
        f.find = f.find;
        f.loadJS = f.aa;
        f.registerPlugin = f.ca;
        f.registerPluginCallback = f.vb;
        f.dcsGetCookie = f.T;
        f.b.prototype.init = f.b.prototype.$;
        f.b.prototype.dcsMultiTrack = f.b.prototype.ha;
        f.b.prototype.track = f.b.prototype.Cb;
        f.b.prototype.addSelector = f.b.prototype.r;
        f.b.prototype.dcsGetIdCallback = f.b.prototype.Za;
        f.b.prototype.dcsCleanUp = f.b.prototype.Ra;
        f.b.prototype.dcsGetFPC = f.b.prototype.Xa;
        f.b.prototype.addTransform = f.b.prototype.Q;
        f.b.prototype.dcsGetCookie = f.b.prototype.T;
        f.b.prototype.dcsNavigation = f.b.prototype.s;
        f.b.prototype.getTTL = f.b.prototype.Y;
        f.$()
    }
}
)(window, window.document, window.navigator, window.location),
function(n) {
    function i(n, t) {
        t || (t = window.location.href);
        n = n.replace(/[\[\]]/g, "\\$&");
        var r = new RegExp("[?&]" + n + "(=([^&#]*)|&|#|$)")
          , i = r.exec(t);
        return i ? i[2] ? decodeURIComponent(i[2].replace(/\+/g, " ")) : "" : null
    }
    var t = n.module("dcpLite", ["ngRoute", "ngAnimate"]), r, u, f, e, o;
    t.Instance = _Instance;
    t.InstanceAssetsFrom = _InstanceAssetsFrom;
    t.BlobStorageUrl = _BlobStorageUrl;
    t.RoutesLoaded = !1;
    t.LastCollectionPathSelected = [];
    t.ChangeHistory = [];
    t.LastColorPage = {
        Path: "",
        ColorSearched: ""
    };
    (t.Instance == null || t.Instance == "") && (window.location.href = "/404?requested=" + window.location.pathname);
    t.config(["$routeProvider", "$locationProvider", "$compileProvider", function(n, i, r) {
        t.routeProvider = n;
        r.aHrefSanitizationWhitelist(/^\s*(https?|fil‌​e|blob|ftp|mailto|data|chrome-extension|tel):/)
    }
    ]);
    r = document.createElement("meta");
    r.name = "wt_mc_id";
    r.content = i("wt.mc_id");
    document.getElementsByTagName("head")[0].appendChild(r);
    u = document.createElement("meta");
    u.name = "wt_tsrc";
    u.content = i("wt.tsrc");
    document.getElementsByTagName("head")[0].appendChild(u);
    f = document.createElement("meta");
    f.name = "utm_campaign";
    f.content = i("utm_campaign");
    document.getElementsByTagName("head")[0].appendChild(f);
    e = document.createElement("meta");
    e.name = "utm_medium";
    e.content = i("utm_medium");
    document.getElementsByTagName("head")[0].appendChild(e);
    o = document.createElement("meta");
    o.name = "utm_source";
    o.content = i("utm_source");
    document.getElementsByTagName("head")[0].appendChild(o);
    t.LowerCaseCompare = function(t, i) {
        return n.lowercase(t) === n.lowercase(i)
    }
    ;
    t.MaxChanges = 10
}(window.angular),
function() {
    "use strict";
    function n(n, t, i) {
        function r(r, u) {
            u.on("drop", function(n) {
                n.preventDefault();
                var u = n.dataTransfer.files;
                r.model.isFileUploaded = !0;
                t.LastUploadedImage = URL.createObjectURL(u[0]);
                i.path().toLowerCase().match("upload") && i.path("/UploadPhotoResult");
                r.$apply();
                r.model.imageSelected(u[0], !0)
            }).on("dragover", function(n) {
                n.preventDefault()
            });
            angular.element(n).on("dragenter", function() {
                angular.element(u[0]).addClass("active")
            }).on("dragleave", function(n) {
                var t = u[0].getBoundingClientRect();
                (n.x > t.left + t.width || n.x < t.left || n.y > t.top + t.height || n.y < t.top) && angular.element(u[0]).removeClass("active")
            }).on("dragover", function(n) {
                n.preventDefault()
            }).on("drop", function(n) {
                n.preventDefault();
                angular.element(u[0]).removeClass("active")
            });
            angular.element(document).find("body").on("dragenter", function() {
                angular.element(u[0]).addClass("active")
            }).on("dragover", function(n) {
                n.preventDefault()
            }).on("drop", function(n) {
                n.preventDefault();
                angular.element(u[0]).removeClass("active")
            })
        }
        return {
            link: r,
            restrict: "A",
            scope: !0
        }
    }
    var t = angular.module("dcpLite");
    t.directive("dropEvent", n);
    n.$inject = ["$window", "projectService", "$location"]
}(),
function() {
    "use strict";
    var n = angular.module("dcpLite");
    n.directive("gtmEvent", function() {
        return {
            restrict: "A",
            scope: {
                gtmEvent: "="
            },
            link: function(n, t) {
                if (n.gtmEvent != undefined && n.gtmEvent != null)
                    for (var i = 0; i < n.gtmEvent.length; i++)
                        i === 0 ? t.attr("data-t", n.gtmEvent[0]) : t.attr("data-d" + i, n.gtmEvent[i])
            }
        }
    })
}(),
function() {
    "use strict";
    var n = angular.module("dcpLite");
    n.directive("localImageSelected", ["projectService", "$location", "$rootScope", function(n, t, i) {
        return {
            restrict: "A",
            link: function(r, u, f) {
                u.bind("change", function(u) {
                    if (u.target.files[0]) {
                        var e = new Image
                          , h = u.target.files[0]
                          , o = window.URL || window.webkitURL
                          , s = o.createObjectURL(h);
                        i.$broadcast("waitStart");
                        e.onload = function() {
                            if (o.revokeObjectURL(s),
                            f.action && r.$eval(f.action)(u.target.files[0]),
                            f.path) {
                                var i = new FileReader;
                                i.onload = function(i) {
                                    var e = 600
                                      , o = 900
                                      , u = new Image;
                                    u.onload = function() {
                                        var i, s;
                                        u.width > u.height ? u.width > o && (u.height *= o / u.width,
                                        u.width = o) : u.height > e && (u.width *= e / u.height,
                                        u.height = e);
                                        i = document.createElement("canvas");
                                        i.height = u.height;
                                        i.width = u.width;
                                        s = i.getContext("2d");
                                        s.drawImage(u, 0, 0, u.width, u.height);
                                        n.LastUploadedImage = i.toDataURL("image/jpeg", 1);
                                        t.path(f.path);
                                        r.$apply()
                                    }
                                    ;
                                    u.src = i.target.result
                                }
                                ;
                                i.readAsDataURL(u.target.files[0])
                            }
                        }
                        ;
                        e.src = s
                    }
                });
                u.bind("click", function() {
                    this.value = null
                })
            }
        }
    }
    ])
}(),
function() {
    "use strict";
    var n = angular.module("dcpLite");
    n.directive("onStripeLoad", ["$window", function() {
        function n(n) {
            n.$on("StripeLoaded", function(t, i) {
                n.model.hasStripeLoaded = i;
                n.$apply()
            })
        }
        return {
            link: n,
            restrict: "A"
        }
    }
    ]);
    n.run(function() {
        n.ScriptsLoaded += 1
    })
}(),
function() {
    "use strict";
    var n = angular.module("dcpLite");
    n.directive("scrollLoadedImage", ["$window", "$timeout", function(n, t) {
        function i(i, r, u) {
            function f() {
                angular.element(r[0]).unbind("load", f);
                angular.element(r[0]).unbind("error", f);
                e.removeChild(s);
                e.className = ""
            }
            var e = angular.element(r[0]).parent()[0], o = ".imageLoader", s;
            u.parentclass && u.parentclass != "" && (o = "." + u.parentclass);
            s = e.querySelector(o);
            angular.element(r[0]).bind("load", f);
            angular.element(r[0]).bind("error", f);
            t(function() {
                var t = 0;
                n.scrollY >= 0 && (t = n.scrollY);
                t == 0 && document.documentElement.scrollTop >= 0 && (t = document.documentElement.scrollTop);
                t + n.innerHeight >= r[0].getBoundingClientRect().top - 50 ? (u.$set("src", u.lazysrc),
                u.$set("alt", u.lazyalt)) : angular.element(n).bind("scroll", function i() {
                    t + n.innerHeight >= r[0].getBoundingClientRect().top - 50 && (u.$set("src", u.lazysrc),
                    u.$set("alt", u.lazyalt),
                    angular.element(n).unbind("scroll", i))
                })
            })
        }
        return {
            link: i,
            restrict: "A",
            controller: [function() {}
            ]
        }
    }
    ])
}(),
function() {
    "use strict";
    var n = angular.module("dcpLite");
    n.directive("waitingIcon", ["$rootScope", "$timeout", function(n, t) {
        return {
            restrict: "A",
            link: function(n) {
                var i = 500
                  , r = n.$on("waitStart", function() {
                    n.status.loading = !0
                })
                  , u = n.$on("waitEnd", function() {
                    t(function() {
                        n.status.loading = !1
                    }, i)
                });
                n.$on("$destroy", r);
                n.$on("$destroy", u)
            }
        }
    }
    ]);
    n.run(function() {
        n.ScriptsLoaded += 1
    })
}(),
function() {
    var n = angular.module("dcpLite")
      , t = function(t, i) {
        function c() {
            try {
                return e(),
                o(),
                h(),
                s(),
                !0
            } catch (t) {
                var n = {};
                return n[decodeURIComponent("Message")] = decodeURIComponent(t),
                Promise.reject(n)
            }
        }
        var r = {}
          , u = function(n) {
            r.Error = n === undefined || n !== null && n.status === "-1" ? "Could not fetch required data!" : n.Message === undefined ? n : n.Message;
            console.error(r.Error)
        }
          , f = {
            headers: {
                DcpApiToken: _ApiToken,
                DcpSessionID: _SessionID
            }
        }
          , e = function() {
            return t.get("/api/InstanceColors/" + n.Instance, f).then(function(t) {
                var u, o, f, e;
                for (r.InstanceColors = t.data.Object,
                f = 0,
                e = 0; e < r.InstanceColors.Colors.Items.length; e++) {
                    if (u = r.InstanceColors.Colors.Items[e],
                    u.ColorMetaData.Count > 0)
                        for (f = 0; f < u.ColorMetaData.Items.length; f++)
                            o = u.ColorMetaData.Items[f],
                            o.Attribute === "DcpCSSColorImage" && (u.DcpCSSColorImage = o.Value);
                    u.ColorNumber = u.ColorNumber.replace("&nbsp;", "");
                    u.LAB = RGBtoLAB2DegreeD65(u.R, u.G, u.B);
                    u.gtmName = u.ColorName + " | " + u.ColorNumber;
                    u.CssColor = "rgb(" + u.R + ", " + u.G + ", " + u.B + ")"
                }
                r.InstanceColors.GetColor = function(t) {
                    var u = i("filter")(r.InstanceColors.Colors.Items, t, function(t, i) {
                        return n.LowerCaseCompare(t, i)
                    });
                    return u.length ? u[0] : null
                }
            }, u)
        }
          , o = function() {
            return t.get("/api/StockImages/" + n.Instance, f).then(function(t) {
                var f, e, o, u;
                for (r.StockImages = t.data.Object,
                f = r.StockImages.Rooms.Items,
                e = 0; e < f.length; e++)
                    for (o = f[e].Photos.Items,
                    u = 0; u < o.length; u++)
                        o[u].ThumbUrl = n.BlobStorageUrl + o[u].ThumbUrl;
                r.StockImages.Rooms.Items = f;
                r.StockImages.GetSurfaces = function(t) {
                    var u = i("filter")(r.StockImages.Surfaces.Items, t, function(t, i) {
                        return n.LowerCaseCompare(t, i)
                    });
                    return u.length ? u : null
                }
            }, u)
        }
          , s = function() {
            return t.get("/api/InstanceCollections/" + n.Instance, f).then(function(t) {
                var i, u, f;
                for (r.ColorCollections = t.data.Object.ColorCollections,
                i = 0; i < r.ColorCollections.Items.length; i++) {
                    for (r.ColorCollections.Items[i].ColorCollectionTypeID != 8 && (r.ColorCollections.Items[i].DisplayAs = n.BlobStorageUrl + r.ColorCollections.Items[i].DisplayAs),
                    u = r.ColorCollections.Items[i].Images.Items,
                    f = 0; f < u.length; f++)
                        u[f].ImageUrl = n.BlobStorageUrl + u[f].ImageUrl;
                    r.ColorCollections.Items[i].Images.Items = u
                }
            }, u)
        }
          , h = function() {
            return t.get("/api/InstanceData/" + n.Instance, f).then(function(t) {
                var f, u, e;
                for (r.InstanceData = t.data.Object,
                f = r.InstanceData.ColorSelectionTabs.Items,
                u = 0; u < f.length; u++)
                    e = f[u],
                    e.DisplayAs = n.BlobStorageUrl + n.InstanceAssetsFrom + "/" + e.DisplayAs;
                r.GetFeatures = function() {
                    return r.InstanceData.Features.Items
                }
                ;
                r.GetLanguageText = function(n, t) {
                    var i = angular.lowercase(n)
                      , u = t === undefined ? i : t;
                    return r.InstanceData.LanguageText[i] !== undefined && r.InstanceData.LanguageText[i] !== "" && (u = r.InstanceData.LanguageText[i]),
                    u
                }
                ;
                r.InstanceData.HideSocial = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "Hide Social" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.ShowOrderChipsAlways = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "Show Order Chips" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.ChineseSocial = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "Chinese Socials" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.EmailCheckbox = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "Check Email Checkbox" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.ListDescColorRelations = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "Show Desc. List of Color Relations" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.HasExtendFooter = i("filter")(r.InstanceData.Features.Items, {
                    FeatureName: "ExtendFooter"
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                })[0].Active;
                r.InstanceData.ShowColorNumber = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "HideColorNumber" && n.Active === !0
                }).length > 0 ? !1 : !0;
                r.InstanceData.ShowRequestChip = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "ShowRequestChips" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.UseFastUploader = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "UseFastUploader" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.UseSmallEmailLogoSize = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "UseSmallEmailLogoSize" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.ShowReviewColorName = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "ShowReviewColorName" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.StripColorNumber = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "StripColorNumber" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.ShowRetailers = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "ShowRetailers" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.UseClientLink = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "UseClientLink" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.HaveWhoAreYou = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "HaveWhoAreYou" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.HasThreeLogos = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "HasThreeLogos" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.HasFooterLogo = r.InstanceData.Features.Items.filter(function(n) {
                    return n.FeatureName === "HasFooterLogo" && n.Active === !0
                }).length > 0 ? !0 : !1;
                r.InstanceData.HasExtendFooter = i("filter")(r.InstanceData.Features.Items, {
                    FeatureName: "ExtendFooter"
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                })[0].Active;
                r.InstanceData.HasTwoLogos = i("filter")(r.InstanceData.Features.Items, {
                    FeatureName: "Has 2 Logos"
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                }).length > 0 ? i("filter")(r.InstanceData.Features.Items, {
                    FeatureName: "Has 2 Logos"
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                })[0].Active : !1;
                r.InstanceData.HasTwoLogos && (r.InstanceData.LogoUrl2 = n.BlobStorageUrl + n.InstanceAssetsFrom + "/logo2.png");
                r.InstanceData.HasThreeLogos && (r.InstanceData.LogoUrl2 = n.BlobStorageUrl + n.InstanceAssetsFrom + "/logo2.png",
                r.InstanceData.LogoUrl3 = n.BlobStorageUrl + n.InstanceAssetsFrom + "/logo3.png");
                i("filter")(r.InstanceData.Features.Items, {
                    FeatureName: "Full Screen Background"
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                }).length > 0 && (r.InstanceData.HasScreenBackground = i("filter")(r.InstanceData.Features.Items, {
                    FeatureName: "Full Screen Background"
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                })[0].Active,
                r.InstanceData.FullBackgroundImageUrl = n.BlobStorageUrl + n.InstanceAssetsFrom + "/main_background.jpg")
            }, u)
        };
        return c(),
        {
            IsLoaded: function() {
                return r.InstanceData != undefined && r.StockImages !== undefined && r.InstanceColors !== undefined && r.ColorCollections !== undefined || r.Error !== undefined
            },
            LoadSuccess: function() {
                return r.Error === undefined ? !0 : !1
            },
            Data: r,
            GetBuyOnlineData: function() {
                return r.BuyOnlineData = null,
                t.get("/api/BuyOnlineData/" + n.Instance, f).then(function(t) {
                    r.BuyOnlineData = t.data.Object;
                    r.BuyOnlineData.GetColor = function(t) {
                        var u = i("filter")(r.BuyOnlineData.Colors.Items, t, function(t, i) {
                            return n.LowerCaseCompare(t, i)
                        });
                        return u.length ? u : null
                    }
                }, u)
            }
        }
    };
    n.factory("dsl", ["$http", "$filter", "$rootScope", t])
}(),
function() {
    var n = angular.module("dcpLite")
      , t = function(t, i, r, u) {
        function a(n) {
            e = n.width;
            o = n.height;
            var i = l(n);
            this.OrigImageData = i.Context.getImageData(0, 0, e, o);
            this.DesatImageData = null;
            this.Masks = [];
            this.CurrentImageData = null;
            t.PaintedImage = i.Canvas.toDataURL("image/jpeg", 1)
        }
        function v(n, t, r) {
            this.Image = n;
            this.SurfaceID = t;
            this.Color = r ? i.Data.InstanceColors.GetColor({
                ColorID: r
            }) : null;
            var u = l(n);
            this.MaskData = GetGreyMaskData(u.Canvas, f.DcpImage.DesatImageData)
        }
        function l(n) {
            var t = document.createElement("canvas"), i;
            return t.width = n.width,
            t.height = n.height,
            i = t.getContext("2d"),
            i.drawImage(n, 0, 0, n.width, n.height),
            {
                Canvas: t,
                Context: i
            }
        }
        function w(n) {
            for (var u, t, r = 0; r < i.Data.StockImages.Rooms.Items.length; r++)
                for (u = i.Data.StockImages.Rooms.Items[r],
                t = 0; t < u.Photos.Items.length; t++)
                    if (u.Photos.Items[t].PhotoID === n)
                        return u.Photos.Items[t];
            return null
        }
        function y() {
            var i = new Image;
            i.crossOrigin = "anonymous";
            i.onload = function() {
                var u = l(this), r, i;
                for (f.DcpImage.DesatImageData = u.Context.getImageData(0, 0, this.width, this.height),
                r = 0; r < s; r++)
                    i = new Image,
                    i.crossOrigin = "anonymous",
                    i.SurfaceID = t.Project.AppliedColors[r].SurfaceNumber,
                    i.ColorID = t.Project.AppliedColors[r].ColorID,
                    i.onload = function() {
                        var n = new v(this,this.SurfaceID,this.ColorID);
                        c.push(n);
                        h++
                    }
                    ,
                    i.onerror = function() {
                        console.log("error in loading the image: ", this.src)
                    }
                    ,
                    i.src = n.BlobStorageUrl + n.Instance + "/uploadphoto/" + t.Project.id + "/" + t.Project.CurrentFile + "_image-" + t.Project.AppliedColors[r].SurfaceNumber + ".png"
            }
            ;
            i.onerror = function() {
                console.log("error in loading the image: ", this.src)
            }
            ;
            f.DcpImage.DesatImageData = null;
            s = t.Project.AppliedColors.length;
            i.src = n.BlobStorageUrl + n.Instance + "/uploadphoto/" + t.Project.id + "/" + t.Project.CurrentFile + "_image.jpg";
            f.PhotoID = t.Project.CurrentFile
        }
        function b() {
            var i = new Image;
            i.crossOrigin = "anonymous";
            i.onload = function() {
                f.DcpImage = new a(this);
                h = 0;
                t.Project.CurrentFile && y()
            }
            ;
            i.onerror = function() {
                console.log("error in loading the image: ", this.src)
            }
            ;
            i.src = n.BlobStorageUrl + n.Instance + "/uploadphoto/" + t.Project.id + "/Image.jpg";
            s = t.Project.AppliedColors.length
        }
        function k() {
            var e = parseInt(t.Project.StockID);
            f.PhotoID = t.Project.StockID;
            var r = i.Data.StockImages.GetSurfaces({
                PhotoID: e
            })
              , o = w(e)
              , u = new Image;
            u.crossOrigin = "anonymous";
            u.onload = function() {
                var i = this.height, e = this.width, y = 500, u;
                this.height > y && (i = y,
                e = parseInt(i * this.width / this.height, 10),
                this.height = i,
                this.width = e);
                f.DcpImage = new a(this);
                u = new Image;
                u.crossOrigin = "anonymous";
                u.onload = function() {
                    var y, o, u, a;
                    for (this.height = i,
                    this.width = e,
                    h = 0,
                    y = l(this),
                    f.DcpImage.DesatImageData = y.Context.getImageData(0, 0, this.width, this.height),
                    f.DcpImage.OrigImageData = y.Context.getImageData(0, 0, this.width, this.height),
                    o = 0; o < s; o++) {
                        for (u = new Image,
                        u.crossOrigin = "anonymous",
                        u.SurfaceID = r[o].SurfaceID,
                        u.ColorID = null,
                        a = 0; a < t.Project.AppliedColors.length; a++)
                            if (r[o].SurfaceID == t.Project.AppliedColors[a].SurfaceNumber) {
                                u.ColorID = t.Project.AppliedColors[a].ColorID;
                                break
                            }
                        u.onload = function() {
                            this.height = i;
                            this.width = e;
                            var n = new v(this,this.SurfaceID,this.ColorID);
                            c.push(n);
                            h++
                        }
                        ;
                        u.onerror = function() {
                            console.log("error in loading the image: ", this.src)
                        }
                        ;
                        u.src = n.BlobStorageUrl + r[o].MaskUrl
                    }
                }
                ;
                u.onerror = function() {
                    console.log("error in loading the image: ", this.src)
                }
                ;
                u.src = n.BlobStorageUrl + o.ImageForColorUrl
            }
            ;
            u.onerror = function() {
                console.log("error in loading the image: ", this.src)
            }
            ;
            u.src = n.BlobStorageUrl + o.DisplayImageUrl;
            s = r.length
        }
        var s = 99
          , h = -1
          , c = null
          , f = {
            DcpImage: null,
            IsLoading: !1,
            ProjectID: null,
            PhotoID: null,
            NeedsColored: !1
        }
          , e = 0
          , o = 0
          , p = function() {
            var n = r(function() {
                var t, i, u, e;
                if (s === h) {
                    for (t = c.map(function(n, t) {
                        return {
                            index: t,
                            count: n.MaskData ? n.MaskData.PixelsUsed : 0
                        }
                    }),
                    t.sort(function(n, t) {
                        return +(n.count > t.count) || +(n.count === t.count) - 1
                    }),
                    i = 0; i < t.length; i++)
                        u = t[i],
                        e = c[u.index],
                        f.DcpImage.Masks.push(e);
                    f.IsLoading = !1;
                    c = [];
                    r.cancel(n)
                }
            }, 100)
        };
        return {
            Data: f,
            RemapColorsToSurfaces: function() {
                var u = null, n, r;
                for (f.NeedsColored = !0,
                n = 0; n < f.DcpImage.Masks.length; n++)
                    for (f.DcpImage.Masks[n].Color = null,
                    r = 0; r < t.Project.AppliedColors.length; r++)
                        if (t.Project.AppliedColors[r].SurfaceNumber === f.DcpImage.Masks[n].SurfaceID && t.Project.AppliedColors[r].ColorID !== f.DcpImage.Masks[n].ColorID) {
                            u = t.Project.AppliedColors[r].ColorID;
                            u && (f.DcpImage.Masks[n].Color = i.Data.InstanceColors.GetColor({
                                ColorID: u
                            }));
                            break
                        }
            },
            ReloadCustomImages: function() {
                f.IsLoading = !0;
                s = 99;
                h = 0;
                c = [];
                p();
                t.Project.StockID || (f.DcpImage.Masks = [],
                f.NeedsColored = !0,
                y())
            },
            LoadDcpImages: function() {
                f.IsLoading = !0;
                s = 99;
                h = -1;
                c = [];
                p();
                t.Project.StockID ? f.ProjectID === t.Project.id && f.PhotoID === t.Project.StockID ? (s = f.DcpImage.Masks.length,
                h = f.DcpImage.Masks.length) : (f.NeedsColored = !0,
                k()) : f.ProjectID === t.Project.id && f.PhotoID === t.Project.CurrentFile ? (s = f.DcpImage.Masks.length,
                h = f.DcpImage.Masks.length) : (f.NeedsColored = !0,
                b());
                f.ProjectID = t.Project.id
            },
            ResetImage: function(n) {
                var r = n.getContext("2d"), i;
                if (r.putImageData(f.DcpImage.OrigImageData, 0, 0, 0, 0, e, o),
                f.DcpImage.CurrentImageData = r.getImageData(0, 0, e, o),
                t.Project.StockID)
                    for (i = 0; i < f.DcpImage.Masks.length; i++)
                        f.DcpImage.Masks[i].Color = null;
                else
                    f.DcpImage.Masks = [],
                    f.DcpImage.DesatImageData = null;
                f.NeedsColored = !1;
                t.PaintedImage = n.toDataURL("image/jpeg", 1)
            },
            DrawImage: function(n) {
                var u, a, c, i, s, l, v;
                for (n.width = e,
                n.height = o,
                u = n.getContext("2d"),
                u.clearRect(0, 0, e, o),
                a = document.createElement("canvas"),
                a.width = e,
                a.height = o,
                f.DcpImage.DesatImageData ? u.putImageData(f.DcpImage.DesatImageData, 0, 0, 0, 0, e, o) : u.putImageData(f.DcpImage.OrigImageData, 0, 0, 0, 0, e, o),
                c = 0; c < f.DcpImage.Masks.length; c++)
                    if (i = f.DcpImage.Masks[c],
                    i.MaskData && i.Color) {
                        s = document.createElement("canvas");
                        s.width = e;
                        s.height = o;
                        l = s.getContext("2d");
                        l.putImageData(i.MaskData.ImageData, 0, 0, 0, 0, e, o);
                        var h = l.getImageData(0, 0, e, o)
                          , y = 0
                          , p = 0
                          , w = 0
                          , r = 0;
                        for (y = BlendColorToMakeTarget(i.Color.R, i.MaskData.ProminentGrey),
                        p = BlendColorToMakeTarget(i.Color.G, i.MaskData.ProminentGrey),
                        w = BlendColorToMakeTarget(i.Color.B, i.MaskData.ProminentGrey),
                        v = 0; v < o * e; v++)
                            h.data[r + 3] > 0 && (h.data[r] = MultiplyBlend(y, i.MaskData.ImageData.data[r]),
                            h.data[r + 1] = MultiplyBlend(p, i.MaskData.ImageData.data[r + 1]),
                            h.data[r + 2] = MultiplyBlend(w, i.MaskData.ImageData.data[r + 2])),
                            r += 4;
                        l.putImageData(h, 0, 0, 0, 0, e, o);
                        u.drawImage(s, 0, 0, e, o)
                    }
                t.PaintedImage = n.toDataURL("image/jpeg", 1);
                f.DcpImage.CurrentImageData = u.getImageData(0, 0, e, o);
                f.NeedsColored = !1
            }
        }
    };
    n.factory("projectImages", ["projectService", "dsl", "$interval", "$filter", t])
}(),
function() {
    var n = angular.module("dcpLite")
      , t = function(i, r, u, f) {
        var o = {
            Brand: _BrandName,
            Instance: _Instance,
            id: null,
            StockID: null,
            StockName: "",
            FakeEdges: [],
            ExcludeMarkers: [],
            IncludedMarkers: [],
            Colors: [],
            AppliedColors: [],
            CurrentFile: null,
            ColorList: [],
            SharedProjectIDs: []
        }, s, h, c, e = {
            headers: {
                DcpApiToken: _ApiToken,
                DcpSessionID: _SessionID
            }
        };
        return {
            GetProject: function(n, t, r) {
                return i.get("/api/GetProject/" + this.Project.Instance + "/" + n, e).then(t, r)
            },
            SegmentProject: function(n, t) {
                return i.post("/api/SegmentWall/", this.Project, e).then(n, t)
            },
            SharedProject: {
                id: null,
                DateShared: null,
                AppliedColors: [],
                ShareType: null,
                ImageUrl: null,
                EmailImageUrl: null
            },
            Project: o,
            NewProject: function(n) {
                this.Project.id = n;
                this.ResetProject(null);
                this.Project.Created = undefined;
                this.Project.LastSaved = undefined;
                this.Project.LastRetrieved = undefined;
                this.Project.LastSegmented = undefined;
                this.Project.StockName = "";
                this.SharedProject.DateShared = undefined
            },
            SetSaveProjectResult: function(n) {
                this.Project.id == null || this.Project.id != n.id ? (this.NewProject(n.id),
                this.Project = angular.copy(n)) : (this.Project.AppliedColors = n.AppliedColors,
                this.Project.Created = n.Created,
                this.Project.LastSaved = n.LastSaved,
                this.Project.LastRetrieved = n.LastRetrieved,
                this.Project.StockName = n.StockName,
                this.Project.StockID == null && (this.Project.LastSegmented = n.LastSegmented,
                this.Project.CurrentFile = n.CurrentFile,
                this.Project.FakeEdges = n.FakeEdges,
                this.Project.ExcludeMarkers = n.ExcludeMarkers,
                this.Project.IncludedMarkers = n.IncludedMarkers));
                this.Project.SharedProjectIDs == null && (this.Project.SharedProjectIDs = []);
                this.Project.ColorList == null && (this.Project.ColorList = []);
                r.search("projectid", this.Project.id)
            },
            RemoveColorFromProject: function(n) {
                var t;
                for (n.InMyColors = !1,
                t = this.Project.AppliedColors.length - 1; t >= 0; t--)
                    this.Project.AppliedColors[t].ColorID === n.ColorID && this.Project.AppliedColors.splice(t, 1);
                if (this.Project.StockID == null) {
                    for (t = this.Project.IncludedMarkers.length - 1; t >= 0; t--)
                        this.Project.IncludedMarkers[t].ColorID === n.ColorID && this.Project.IncludedMarkers.splice(t, 1);
                    this.Project.CurrentFile = null
                }
            },
            SaveProject: function(n, t) {
                return this.Project.StockID == null ? i.post("/api/SaveUploadProject", this.Project, e).then(n, t) : i.post("/api/SaveStockProject", this.Project, e).then(n, t)
            },
            ShareProject: function(n, t) {
                return i.post("/api/ShareProject/" + this.Project.Instance, this.SharedProject, e).then(n, t)
            },
            EmailProject: function(n, t, r) {
                return i.post("/api/send-email", n, e).then(t, r)
            },
            ResetProject: function(n) {
                this.Project.FakeEdges = [];
                this.Project.ExcludeMarkers = [];
                this.Project.IncludedMarkers = [];
                this.Project.AppliedColors = [];
                this.Project.SharedProjectIDs = [];
                this.Project.StockID = n;
                this.Project.StockName = "";
                this.Project.CurrentFile = null;
                this.PaintedImage = null;
                this.ReviewPhotoFooterImage = null
            },
            selectedColorId: function() {
                return this.Project.Colors.length > 0 ? this.Project.Colors[this.Project.Colors.length - 1] : -1
            },
            selectedColorName: function(n) {
                var t = u.Data.InstanceColors.Colors.Items.filter(function(t) {
                    return t.ColorID == n
                })[0];
                return t ? (t.InMyColors = !0,
                t.ColorName) : ""
            },
            LastUploadedImage: s,
            PaintedImage: h,
            ReviewPhotoFooterImage: c,
            LoadColorList: function() {
                var i, e, t, n, o;
                if (r.search().colorslist) {
                    for (this.Project.ColorList = [],
                    i = r.search().colorslist.split(","),
                    e = u.Data.InstanceData.StripColorNumber,
                    t = 0; t < i.length; t++)
                        n = u.Data.InstanceColors.Colors.Items.filter(function(n) {
                            if (e) {
                                var r = n.ColorNumber.replace(/[^0-9a-zA-Z\.\/\_\\\-\s]/g, "").trimEnd();
                                return r.toLowerCase() == decodeURIComponent(i[t]).toLowerCase()
                            }
                            return n.ColorNumber.toLowerCase() == decodeURIComponent(i[t]).toLowerCase()
                        })[0],
                        o = this.Project.Colors.indexOf(n.ColorID),
                        n && o < 0 && (this.Project.Colors.push(n.ColorID),
                        this.Project.ColorList.push(n.ColorID),
                        f.event({
                            event: "addFromWebsite",
                            t: "addColor",
                            d1: "website",
                            d2: n.gtmName
                        }));
                    r.url(r.path())
                }
            },
            AddRemoveColor: function(n, t, i, r) {
                if (t.InMyColors = !t.InMyColors,
                t.InMyColors)
                    this.Project.Colors.indexOf(t.ColorID) < 0 && (this.Project.Colors.push(t.ColorID),
                    f.event({
                        event: "gtm.click",
                        t: "addColor",
                        d1: i,
                        d2: t.gtmName
                    }),
                    r && r != "" && f.event({
                        event: "gtm.click",
                        t: "ux",
                        d1: "add from collection",
                        d2: r
                    }));
                else {
                    this.RemoveColorFromProject(t);
                    var u = this.Project.Colors.indexOf(t.ColorID);
                    this.Project.Colors.splice(u, 1);
                    f.event({
                        event: "gtm.click",
                        t: "ux",
                        d1: "removeColor",
                        d2: i
                    })
                }
                this.SaveProject(n, n)
            },
            GetUnPaintedImage: function() {
                var r, i;
                (this.PaintedImage === undefined || this.PaintedImage === null) && (this.Project.StockID == null ? (i = new Image,
                i.projectServ = this,
                i.onload = function() {
                    i.projectServ.PaintedImage = this
                }
                ,
                i.src = n.BlobStorageUrl + n.Instance + "/uploadphoto/" + this.Project.id + "/" + this.Project.CurrentFile + "_image.jpg") : (this.ShareData.Base64Image = null,
                r = parseInt(t.Project.StockID),
                i = new Image,
                i.projectServ = this,
                i.onload = function() {
                    i.projectServ.PaintedImage = this
                }
                ,
                i.src = n.BlobStorageUrl + photo.DisplayImageUrl))
            },
            CustomPhotoUploading: !1,
            CustomPhotoFinished: !1
        }
    };
    n.factory("projectService", ["$http", "$location", "dsl", "gtmDataLayer", t])
}(),
function() {
    "use strict";
    function i() {
        return function(t, i) {
            return t == undefined || i == undefined || i === "" ? [] : t.filter(function(t) {
                return n(t.AltNames, i) || n(t.ColorNumber, i) || n(t.ColorName, i) || t.ColorMetaData.Items.filter(function(t) {
                    return n(t.Value, i) && t.Attribute.toLowerCase() === "oldnumber"
                }).length > 0
            })
        }
    }
    function n(n, t) {
        return n.toLowerCase().indexOf(t.toLowerCase()) !== -1
    }
    var t = angular.module("dcpLite");
    t.filter("colorFilter", i)
}(),
function() {
    "use strict";
    function i() {
        return function(t, i) {
            return t == undefined || i == undefined || i === "" ? [] : t.filter(function(t) {
                return n(t.AltNames, i) || n(t.ColorName, i)
            })
        }
    }
    function n(n, t) {
        return n.toLowerCase().indexOf(t.toLowerCase()) !== -1
    }
    var t = angular.module("dcpLite");
    t.filter("colorFilterWithoutColorCode", i)
}(),
function() {
    "use strict";
    function i() {
        return function(t, i) {
            return t == undefined || i == undefined || i === "" ? [] : t.filter(function(t) {
                return n(t.AltNames, i) || n(t.ColorNumber, i) || n(t.ColorName, i)
            })
        }
    }
    function n(n, t) {
        return n.toLowerCase().indexOf(t.toLowerCase()) !== -1
    }
    var t = angular.module("dcpLite");
    t.filter("colorFilterWithoutOldNames", i)
}(),
function() {
    "use strict";
    var n = angular.module("dcpLite");
    n.factory("gtmDataLayer", ["$location", function(n) {
        var t = window.dataLayer;
        if (t)
            return {
                event: function(n) {
                    n !== undefined && t.push({
                        gtm: {
                            element: {
                                dataset: {
                                    t: n.t,
                                    d1: n.d1,
                                    d2: n.d2,
                                    d3: n.d3,
                                    d4: n.d4
                                }
                            }
                        },
                        event: n.event
                    })
                },
                virtualPageView: function(i) {
                    i === undefined && (i = n.path());
                    t.push({
                        event: "virtualPageView",
                        virtualPage: i
                    })
                }
            }
    }
    ])
}(),
function() {
    "use strict";
    function t() {
        return function(n) {
            return n !== null && n !== undefined ? n.slice().reverse() : n
        }
    }
    var n = angular.module("dcpLite");
    n.filter("reverseFilter", t)
}(),
function() {
    "use strict";
    function t() {
        return function(n, t) {
            return t = +t,
            n.slice(t)
        }
    }
    var n = angular.module("dcpLite");
    n.filter("startFrom", t);
    n.run(function() {
        n.ScriptsLoaded += 1
    })
}(),
function() {
    "use strict";
    function t(n, t, i, r, u, f, e, o) {
        var s = this;
        s.showModal = !1;
        s.PageData = o;
        s.ProjectServ = f;
        s.selectedColorNumbers = [];
        s.selectedchipsURL = "";
        s.ShowColorNumber = i.Data.InstanceData.ShowColorNumber;
        n.$on("showChipModal", function(n, t) {
            s.showModal = !0;
            s.usedColors = t.usedColors;
            s.unusedColors = t.unusedColors
        });
        s.chipUrlBase = (window.location.href.indexOf("stage.visualizecolor.com") > -1 || window.location.href.indexOf("localhost") > -1) && i.Data.GetLanguageText("Order.Chip.StageCTAUrl", "") != "" ? i.Data.GetLanguageText("Order.Chip.StageCTAUrl", "https://www.ppgvoiceofcolor.com/designer/color-samples?colorNumbers=") : i.Data.GetLanguageText("Order.Chip.CTAUrl", "https://www.ppgvoiceofcolor.com/designer/color-samples?colorNumbers=");
        s.cancelModal = function(n, t) {
            t != "continued" && (s.showModal = !1)
        }
        ;
        s.getColorById = function(n) {
            var t = i.Data.InstanceColors.Colors.Items.filter(function(t) {
                return t.ColorID == n
            })[0];
            return {
                Color: t
            }
        }
        ;
        s.addRemoveSelectedChips = function(n) {
            var t = "ColorName", i;
            s.ShowColorNumber && (t = "ColorNumber");
            i = s.selectedColorNumbers.indexOf(n.Color[t]);
            i < 0 ? s.selectedColorNumbers.push(n.Color[t]) : s.selectedColorNumbers.splice(i, 1);
            s.selectedchipsURL = s.selectedColorNumbers.join()
        }
    }
    var n = angular.module("dcpLite");
    n.directive("checkchip", ["$document", "$timeout", function(n, t) {
        function i(n, i) {
            var r = i[0];
            i.bind("click", function() {
                t(function() {
                    r.classList.contains("Checked") ? r.classList.remove("Checked") : r.classList.add("Checked")
                })
            })
        }
        return {
            link: i,
            restrict: "A",
            controller: [function() {}
            ]
        }
    }
    ]);
    n.component("chipModal", {
        templateUrl: "/Versions/Shared/Views/Components/Controls/ChipModal.html",
        bindings: {
            index: "=",
            helpType: "@"
        },
        transclude: !0,
        controllerAs: "model",
        controller: ["$rootScope", "$location", "dsl", "$filter", "$scope", "projectService", "$http", "pageData", "gtmDataLayer", "$window", t]
    })
}(),
function() {
    "use strict";
    function t(n, t, i, r) {
        var u = this;
        u.Color = null;
        u.show = !1;
        u.$onInit = function() {}
        ;
        r.$on("displayModal", function(t, i) {
            var e, f, r, a, s, h, c, o, l;
            if (u.SimilarShadesLabel = n.Data.GetLanguageText("ColorModal.SimilarShadesLabel", "Similar Shade"),
            u.CoordinatingColorsLabel = n.Data.GetLanguageText("ColorModal.CoordinatingColorsLabel", "Coordinating Colors"),
            u.TrimAndCeilingLabel = n.Data.GetLanguageText("ColorModal.TrimAndCeilingLabel", "Trim & Ceiling Colors"),
            u.AccentColorsLabel = n.Data.GetLanguageText("ColorModal.AccentColorsLabel", "Accent Colors"),
            u.FlowColorLabel = n.Data.GetLanguageText("ColorModal.FlowColorLabel", "Flow"),
            i.colorID != undefined) {
                for (u.color = n.Data.InstanceColors.GetColor({
                    ColorID: i.colorID
                }),
                u.currentColor = [],
                u.currentColor.push({
                    ColorID: u.color.ColorID,
                    Type: null
                }),
                e = 0,
                u.Shades = [],
                u.Compliments = [],
                f = [],
                e = 0; e < u.color.Relations.Items.length; e++)
                    if (r = u.color.Relations.Items[e],
                    r.ColorRelationTypeID === 7)
                        a = n.Data.InstanceColors.GetColor({
                            ColorID: r.RelatedColorID
                        }),
                        a && u.Shades.push({
                            ColorID: r.RelatedColorID,
                            Type: null
                        });
                    else {
                        for (s = 0; s < n.Data.InstanceColors.ColorRelationTypes.Items.length; s++)
                            if (h = n.Data.InstanceColors.ColorRelationTypes.Items[s],
                            h.ID === r.ColorRelationTypeID) {
                                for (c = -1,
                                o = 0; o < f.length; o++)
                                    if (f[o].DcpType === h.DcpValue) {
                                        c = o;
                                        break
                                    }
                                c < 0 ? (l = {
                                    DcpType: h.DcpValue,
                                    Colors: []
                                },
                                l.Colors.push({
                                    ColorID: r.RelatedColorID,
                                    Type: null
                                }),
                                f.push(l)) : f[c].Colors.push({
                                    ColorID: r.RelatedColorID,
                                    Type: null
                                });
                                break
                            }
                        u.Compliments = f
                    }
                u.show = !0;
                angular.element(document.getElementsByClassName("my-colors flyout is-visible")[0]).attr("aria-hidden", "true").removeClass("is-visible");
                angular.element(document.querySelector("#main-content")).attr("aria-hidden", "true")
            }
            n.Data.GetLanguageText("ColorMeta.RGB", "") !== "" && (u.RVB = n.Data.GetLanguageText("ColorMeta.RGB", "RVB: R {Rvalue} - V {Vvalue} - B {Bvalue}"),
            u.RVB = u.RVB.replace("{Rvalue}", u.color.R.toString()),
            u.RVB = u.RVB.replace("{Vvalue}", u.color.G.toString()),
            u.RVB = u.RVB.replace("{Bvalue}", u.color.B.toString()));
            n.Data.GetLanguageText("ColorMeta.LAB", "") !== "" && u.color.ColorMetaData.Items.filter(function(n) {
                return n.Attribute === "LStar"
            }).length > 0 && u.color.ColorMetaData.Items.filter(function(n) {
                return n.Attribute === "AStar"
            }).length > 0 && u.color.ColorMetaData.Items.filter(function(n) {
                return n.Attribute === "BStar"
            }).length > 0 && (u.LAB = n.Data.GetLanguageText("ColorMeta.LAB", "L*a*b*: L {Lstarvalue} - A {Astarvalue} - B {Bstarvalue}"),
            u.LAB = u.LAB.replace("{Lstarvalue}", u.color.ColorMetaData.Items.filter(function(n) {
                return n.Attribute === "LStar"
            })[0].Value),
            u.LAB = u.LAB.replace("{Astarvalue}", u.color.ColorMetaData.Items.filter(function(n) {
                return n.Attribute === "AStar"
            })[0].Value),
            u.LAB = u.LAB.replace("{Bstarvalue}", u.color.ColorMetaData.Items.filter(function(n) {
                return n.Attribute === "BStar"
            })[0].Value));
            n.Data.GetLanguageText("ColorMeta.Y", "") !== "" && u.color.ColorMetaData.Items.filter(function(n) {
                return n.Attribute === "Y"
            }).length > 0 && (u.Y = n.Data.GetLanguageText("ColorMeta.Y", "Y: {Yvalue}"),
            u.Y = u.Y.replace("{Yvalue}", u.color.ColorMetaData.Items.filter(function(n) {
                return n.Attribute === "Y"
            })[0].Value));
            n.Data.GetLanguageText("ColorMeta.Page Number", "") !== "" && u.color.ColorMetaData.Items.filter(function(n) {
                return n.Attribute === "Page Number"
            }).length > 0 && (u.PageNumber = n.Data.GetLanguageText("ColorMeta.Page Number", "N° de page: {pagenumbervalue}"),
            u.PageNumber = u.PageNumber.replace("{pagenumbervalue}", u.color.ColorMetaData.Items.filter(function(n) {
                return n.Attribute === "Page Number"
            })[0].Value))
        });
        u.closeModal = function(n) {
            n.preventDefault();
            angular.element(document.getElementsByClassName("main-content")[0]).attr("aria-hidden", "false");
            u.show = !1
        }
    }
    var n = angular.module("dcpLite");
    n.component("colorModal", {
        templateUrl: "/Versions/Shared/Views/Components/Controls/ColorModal.html",
        controllerAs: "model",
        controller: ["dsl", "$filter", "orderByFilter", "$rootScope", "$window", t]
    })
}(),
function() {
    "use strict";
    function t(n, t, i, r) {
        var u = this, f;
        u.showColorNumber = n.Data.InstanceData.ShowColorNumber;
        f = function(n) {
            r.SetSaveProjectResult(n.data)
        }
        ;
        u.AddRemoveColor = function(n) {
            r.AddRemoveColor(f, n, u.type)
        }
        ;
        u.getColorById = function(t) {
            return n.Data.InstanceColors.Colors.Items.filter(function(n) {
                return n.ColorID == t
            })[0]
        }
    }
    var n = angular.module("dcpLite");
    n.component("colorModalSwatch", {
        templateUrl: "/Versions/Shared/Views/Components/Controls/ColorModalSwatch.html",
        bindings: {
            colors: "=",
            type: "@",
            isFeatured: "@"
        },
        controllerAs: "model",
        controller: ["dsl", "$rootScope", "$location", "projectService", "gtmDataLayer", t]
    })
}(),
function() {
    "use strict";
    function t(n, t, i, r, u, f) {
        var e = this;
        e.$onInit = function() {
            e.CurrentPage = 0;
            e.ItemPerPage = 3;
            e.Pages = 0;
            e.SavedColorsCount = i.Project.Colors.length;
            e.DisplayedColors = [];
            e.loadData();
            e.SetData()
        }
        ;
        e.loadData = function() {
            var n, t;
            for (e.Colors = [],
            n = [],
            t = i.Project.Colors.length - 1; t >= 0; t--)
                n.length >= e.ItemPerPage && (e.Colors.push(n),
                n = []),
                n.push(i.Project.Colors[t]);
            n.length > 0 && e.Colors.push(n);
            e.Pages = e.Colors.length - 1
        }
        ;
        e.PrevPage = function() {
            e.CurrentPage > 0 && (e.CurrentPage -= 1,
            e.SetData())
        }
        ;
        e.NextPage = function() {
            e.CurrentPage < e.Pages && (e.CurrentPage += 1,
            e.SetData())
        }
        ;
        e.SetData = function() {
            var t, i;
            if (e.CurrentPage || (e.CurrentPage = 0),
            e.DisplayedColors = [],
            e.Colors && e.Colors.length > 0 && e.Colors[e.CurrentPage])
                for (t = 0; t < e.ItemPerPage; t++)
                    t < e.Colors[e.CurrentPage].length && (i = n.Data.InstanceColors.GetColor({
                        ColorID: e.Colors[e.CurrentPage][t]
                    }),
                    i && e.DisplayedColors.push(i))
        }
        ;
        e.GetColorTitle = function(t) {
            return n.Data.InstanceData.ShowColorNumber ? t.ColorName + " - " + t.ColorNumber : t.ColorName
        }
        ;
        e.SelectColor = function(n) {
            e.pageData.SelectedColor = n;
            t.event({
                event: "gtm.click",
                t: "ux",
                d1: "changeColor",
                d2: n.gtmName
            })
        }
        ;
        e.ItemsCss = function() {
            return "columns count-" + e.ItemPerPage
        }
        ;
        e.GetIsDarkCss = function(n) {
            var t = "";
            return n.IsDark && (t = "isDark"),
            t
        }
        ;
        f.$watch(function() {
            return f.MaxItems
        }, function(n, t) {
            n != t && (e.ItemPerPage = n >= 9 ? 9 : n <= 3 ? 3 : n,
            e.SavedColorsCount <= 5 && (e.ItemPerPage = 5),
            e.CurrentPage = 0,
            e.SavedColorsCount = i.Project.Colors.length,
            e.loadData(),
            e.SetData())
        }, !0);
        f.$watch(function() {
            return i.Project.Colors.length
        }, function(n, t) {
            n != t && (e.pageData = u.Data,
            e.SavedColorsCount = n,
            e.SavedColorsCount <= 5 && (e.ItemPerPage = 5),
            e.CurrentPage = 0,
            e.loadData(),
            e.SetData())
        }, !0)
    }
    var n = angular.module("dcpLite");
    n.component("colorSelector", {
        templateUrl: "/Versions/Shared/Views/Components/Controls/ColorSelector.html",
        bindings: {
            pageData: "="
        },
        controllerAs: "model",
        controller: ["dsl", "gtmDataLayer", "projectService", "$filter", "pageData", "$scope", t]
    })
}(),
function() {
    "use strict";
    function t(n, t, i, r, u, f) {
        var e = this, o;
        e.color = r.Data.InstanceColors.GetColor({
            ColorID: e.colorid
        });
        e.PageData = f;
        e.ShowFirstColor = !1;
        e.OffsetClass = "";
        e.ProjectServ = n;
        e.color && (e.color.InMyColors = ~n.Project.Colors.indexOf(e.color.ColorID) ? !0 : !1,
        e.colorTitle = r.Data.InstanceData.ShowColorNumber && e.color.ColorNumber.toLowerCase() != e.color.ColorName.toLowerCase() ? e.color.ColorName + " - " + e.color.ColorNumber : e.color.ColorName);
        o = function(t) {
            n.SetSaveProjectResult(t.data)
        }
        ;
        e.AddColor = function() {
            n.AddRemoveColor(o, e.color, e.gtmType, e.gtmFrom);
            e.PageData.Data.FirstColorConfirmed || (e.ShowFirstColor = !0,
            e.PageData.Data.FirstColorShowing = !0)
        }
        ;
        e.colorIsDark = function(n) {
            var t = e.color.IsDark ? "IsDark" : "";
            return n.DcpCSSColorImage && (t = n.IsDark ? "IsDark " + n.DcpCSSColorImage + " Dark" : n.DcpCSSColorImage + " Light"),
            t
        }
    }
    var n = angular.module("dcpLite");
    n.component("colorSwatch", {
        templateUrl: "/Versions/Shared/Views/Components/Controls/ColorSwatch.html",
        bindings: {
            colorid: "<",
            gtmType: "<",
            gtmFrom: "<",
            index: "<",
            row: "<",
            columncount: "<"
        },
        transclude: !0,
        controllerAs: "model",
        controller: ["projectService", "$location", "$rootScope", "dsl", "gtmDataLayer", "pageData", t]
    })
}(),
function() {
    "use strict";
    var n = angular.module("dcpLite");
    n.directive("showmobilemenu", ["$document", "$window", "$timeout", function(n, t, i) {
        function r(n, t) {
            var r = t.parent()[0].children.progressBar;
            t.bind("click", function() {
                i(function() {
                    if (window.innerWidth < 750) {
                        var n = document.getElementById("SavedColorsModal");
                        n && n.classList.contains("nav-slideDown") && (n.classList.add("nav-slideUp"),
                        n.classList.remove("nav-slideDown"));
                        r.classList.contains("nav-slideDown") ? (r.classList.remove("nav-slideDown"),
                        r.className += " nav-slideUp",
                        document.body.style.cursor = null) : (r.className += " nav-slideDown",
                        r.classList.contains("nav-slideUp") && (r.classList.remove("nav-slideUp"),
                        headerMenu.style.height = "255px"),
                        document.body.style.cursor = "pointer")
                    }
                })
            })
        }
        return {
            link: r,
            restrict: "A",
            controller: [function() {}
            ]
        }
    }
    ]);
    n.directive("stickymenu", ["$window", "$timeout", function(n, t) {
        function i(i, r) {
            var f = angular.element(r.parent().parent()[0])
              , u = r.children()[0];
            t(function() {
                var t = window.pageXOffset !== undefined
                  , i = (document.compatMode || "") === "CSS1Compat"
                  , e = u.offsetTop + u.offsetHeight
                  , r = u.offsetTop;
                f[0].style.height = u.style.height;
                angular.element(n).bind("scroll", function() {
                    var n = t ? window.pageYOffset : i ? document.documentElement.scrollTop : document.body.scrollTop;
                    window.innerWidth < 970 && (n >= r ? u.classList.add("fixed") : u.classList.remove("fixed"))
                });
                angular.element(n).bind("resize", function() {
                    var n = t ? window.pageYOffset : i ? document.documentElement.scrollTop : document.body.scrollTop;
                    window.innerWidth < 970 && (n >= r ? u.classList.add("fixed") : u.classList.remove("fixed"))
                })
            })
        }
        return {
            link: i,
            restrict: "A",
            controller: [function() {}
            ]
        }
    }
    ]);
    n.directive("clickoutside", ["$document", "$timeout", function(n, t) {
        function i(i, r) {
            n.on("click", function(n) {
                t(function() {
                    var t, i, u, f;
                    if (!r[0].contains(n.target)) {
                        for (t = r[0].getElementsByClassName("nav-slideDown"),
                        i = 0; i < t.length; i++)
                            t[i].classList.add("nav-slideUp"),
                            t[i].classList.remove("nav-slideDown");
                        u = r[0].children[0].children[0];
                        f = r.parent().parent().parent().parent();
                        t.length > 0 && (f[0].style.height = u.offsetWidth > 0 && u.offsetHeight > 0 ? "55px" : "70px");
                        document.body.style.cursor = null
                    }
                })
            })
        }
        return {
            link: i,
            restrict: "A",
            controller: [function() {}
            ]
        }
    }
    ]);
    n.directive("navclose", ["$document", "$timeout", function(n, t) {
        function i(n, i) {
            var r = i.parent().parent().parent().parent();
            i.bind("click", function() {
                t(function() {
                    window.innerWidth < 750 && (r[0].classList.contains("nav-slideDown") ? (r[0].classList.remove("nav-slideDown"),
                    r[0].className += " nav-slideUp",
                    document.body.style.cursor = null,
                    headerMenu.style.height == "255px" && (headerMenu.style.height = "55px")) : (r[0].className += " nav-slideDown",
                    r[0].classList.contains("nav-slideUp") && (r[0].classList.remove("nav-slideUp"),
                    headerMenu.style.height = "255px"),
                    document.body.style.cursor = "pointer"))
                })
            })
        }
        return {
            link: i,
            restrict: "A",
            controller: [function() {}
            ]
        }
    }
    ]);
    n.directive("resizeheader", ["$document", "$window", "$timeout", "$location", function(n, t) {
        function i(n, i) {
            var u = i[0], f = i[0].children[0].children[0].children[0].children[0].children["nav-menuTab"].children["nav-menuTabIconText"], e, r = null;
            i.on("transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd", function() {
                var t = i[0].children[0].children[0].children[0].children[0].children.savedColorsSection, o, n;
                t.children.length > 0 && (r = t.children[0].children.SavedColorsModal);
                o = i[0].children[0].children[0].children[0].children[0].children.progressBar;
                r && (r.offsetWidth == 295 || r.offsetWidth == 246) && (u.style.height = "70px");
                r && r.classList.contains("nav-slideDown") ? (n = 85,
                f.offsetWidth > 0 && f.offsetHeight > 0 && (n = 70),
                e = "height:" + (r.offsetHeight + n) + "px",
                u.style.height = r.offsetHeight.toString()) : (n = 70,
                f.offsetWidth > 0 && f.offsetHeight > 0 && (n = 55),
                e = n + "px",
                o.classList.contains("nav-slideDown") && (e = f.offsetWidth > 0 && f.offsetHeight > 0 ? "255px" : "70px"),
                r && r.classList.contains("nav-slideUp") && (u.style.height = e),
                r || (u.style.height = e))
            });
            angular.element(t).bind("resize", function() {
                var n = i[0].children[0].children[0].children[0].children[0].children.savedColorsSection, t;
                r = n.children.length > 0 ? n.children[0].children.SavedColorsModal : null;
                window.innerWidth > 749 && !r ? u.style.height = "70px" : r || (t = document.getElementsByClassName("nav-slideDown"),
                t.length > 0 ? u.style.height = "255px" : window.innerWidth < 750 && (u.style.height = "55px"))
            })
        }
        return {
            link: i,
            restrict: "A",
            scope: {
                checkpage: "=resizeheader"
            },
            controller: [function() {}
            ]
        }
    }
    ]);
    n.component("mainNavigation", {
        require: "^IndexController",
        controllerAs: "model",
        templateUrl: "/Versions/Shared/Views/Components/Controls/MainNavigation.html",
        controller: ["$location", "dsl", "$rootScope", "$filter", "$window", "$scope", "projectService", "$timeout", "pageData", function(n, t, i, r, u, f, e, o, s) {
            function l() {
                var t = document.getElementById("SavedColorsModal")
                  , n = document.getElementById("progressBar");
                n.classList.remove("transitionProp");
                clearTimeout(c);
                c = setTimeout(function() {
                    n.className += " transitionProp"
                }, 250)
            }
            var a = document.getElementById("headerMenu"), h = this, c;
            h.PageData = s.Data;
            h.header = {
                menu: t.Data.GetLanguageText("Header.LinkText.Menu", "Menu")
            };
            h.StepCss = function() {
                return h.PageData.CurrentStep === 1 && h.PageData.CarryColor == !1 || h.PageData.CurrentStep === 4 ? "Step1_4" : ""
            }
            ;
            window.onresize = l;
            f.goBack = function(n) {
                n.preventDefault();
                u.history.back()
            }
        }
        ]
    })
}(),
function() {
    "use strict";
    function t(n, t, i) {
        var r = this;
        r.BackAction = function() {
            r.backurl.toLowerCase() === n.path().toLowerCase() ? i.reload() : n.path(r.backurl)
        }
    }
    var n = angular.module("dcpLite");
    n.component("pageHeader", {
        templateUrl: "/Versions/Shared/Views/Components/Controls/PageHeader.html",
        bindings: {
            headline: "@",
            backlinktext: "@",
            backurl: "@",
            subheadline: "@"
        },
        controllerAs: "model",
        controller: ["$location", "$rootScope", "$route", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o, s, h, c) {
        function v() {
            if (l.showWhoAreYou) {
                var n = document.getElementById("share-preferred-retailer").value.replace("string:", "") === ""
                  , t = document.getElementById("share-who-are-you").value.replace("string:", "") === ""
                  , r = document.getElementById("share-market-segment").value.replace("string:", "") === ""
                  , i = document.getElementById("share-country").value.replace("string:", "") === "";
                return l.showMarketSegment ? !(n || t || r || i) : !(n || t || i)
            }
            return !0
        }
        function y(n) {
            var f = [], t = [], i = [], u, e;
            switch (n) {
            case "WhoAreYou":
                t = r.Data.GetLanguageText("Review.ShareModal.WhoAreYouOptions", "Homeowner,Professional").split(",");
                i = r.Data.GetLanguageText("Review.ShareModal.WhoAreYouOptionValues", "Homeowner,Professional").split(",");
                break;
            case "MarketSegment":
                t = r.Data.GetLanguageText("Review.ShareModal.MarketSegmentOptions", "Residential Repainter,Commercial,New Home,Multi-Family,Designer,Architect,Specifier,Other").split(",");
                i = r.Data.GetLanguageText("Review.ShareModal.MarketSegmentOptionValues", "Residential Repainter,Commercial,New Home,Multi-Family,Designer,Architect,Specifier,Other").split(",");
                break;
            case "PreferredRetailer":
                t = r.Data.GetLanguageText("Review.ShareModal.PreferredRetailerOptions", "Independent Dealer,PPG Paint Store,The Home Depot").split(",");
                i = r.Data.GetLanguageText("Review.ShareModal.PreferredRetailerOptionValues", "Independent Dealer,PPG Paint Store,The Home Depot").split(",");
                break;
            case "Country":
                t = r.Data.GetLanguageText("Review.ShareModal.CountryOptions", "USA,Canada,Mexico").split(",");
                i = r.Data.GetLanguageText("Review.ShareModal.CountryOptionValues", "USA,Canada,Mexico").split(",")
            }
            for (u = 0; u < t.length; u++)
                e = {
                    value: i[u].trim().toLowerCase(),
                    text: t[u].trim()
                },
                f.push(e);
            return f
        }
        function a(n) {
            var t = [];
            return t.push(n[0]),
            t.push(n[1]),
            l.type == "share" ? (t.push(n[3]),
            l.shareChecked && l.showCheckbox && t.push(n[2])) : t.push(n[2]),
            l.type == "email-360" && (t.push(l.email360Sections[0]),
            t.push(l.email360Sections[1])),
            t.reduce(function(n, t) {
                return n & t
            })
        }
        function p(n) {
            var i = n.indexOf("-"), t = n.substring(0, i), r;
            return n = n.slice(i + 1),
            r = n.indexOf("_"),
            n = n.substring(0, r),
            n = n.replace(/-/g, " "),
            t.toUpperCase() == "RUSTIC" && (t = t + " Collection"),
            t + ": " + n
        }
        var l = this;
        l.showModal = !1;
        l.invalidName = !1;
        l.invalidFirstName = !1;
        l.invalidLastName = !1;
        l.invalidEmail = !1;
        l.invalidRecipient = !1;
        l.invalidPhone = !1;
        l.invalidZipCode = !1;
        l.shareChecked = !1;
        l.PageData = s;
        l.EmailRecipientPrefix = r.Data.GetLanguageText("Review.ShareModal.EmailSent", "Email sent to");
        l.emailFinished = !1;
        l.emailFormValid = !1;
        l.emailSections = [];
        l.email360Sections = [];
        l.showCheckbox = !1;
        l.formattedStockName = "";
        l.showMarketSegment = !1;
        l.invalidPreferredRetailer = !1;
        l.invalidWhoAreYou = !1;
        l.invalidMarketSegment = !1;
        l.invalidCountry = !1;
        f.inputValueCountry = "";
        t.$on("showShareModal", function(n, t) {
            var i;
            if (l.emailSections.length == 0)
                for (i = 0; i < 4; i++)
                    l.emailSections.push(0);
            if (l.email360Sections.length == 0)
                for (i = 0; i < 2; i++)
                    l.email360Sections.push(0);
            l.showModal = !0;
            l.ProjectImages = c;
            angular.element(document.querySelector("#main-content")).attr("aria-hidden", "true");
            l.image = t.image;
            l.type = t.type;
            l.selfName = "";
            l.selfFirstName = "";
            l.selfLastName = "";
            l.selfEmail = "";
            l.recipientEmail = "";
            l.selfPhone = "";
            l.selfZip = "";
            l.selfEmailReset = !0;
            l.recipientEmailReset = !0;
            l.replacePlaceholders("{Sign Up} to receive product updates and promotional offers from [Brand]");
            l.ShareProjectText = r.Data.GetLanguageText("Review.ShareModal.ShareInstructions", "Share your project with friends and family.");
            l.SaveProjectText = r.Data.GetLanguageText("Review.ShareModal.SaveInstructions", "Save your project to return later and continue making edits.");
            l.Email360Text = r.Data.GetLanguageText("ReviewPhotoPainter.FormDescription", "Share your project with us and we will be in touch with you shortly.");
            l.ShareProjectTitle = r.Data.GetLanguageText("Review.ShareModal.ShareTitle", "Share Your Project");
            l.SaveProjectTitle = r.Data.GetLanguageText("Review.ShareModal.SaveTitle", "Save Your Project");
            l.Name = r.Data.GetLanguageText("Review.ShareModal.Name", "Your Name");
            l.FirstName = r.Data.GetLanguageText("Review.ShareModal.FirstName", "First Name");
            l.LastName = r.Data.GetLanguageText("Review.ShareModal.LastName", "Last Name");
            l.PhoneNumber = r.Data.GetLanguageText("ReviewPhotoPainter.FormYourPhone", "Your Phone");
            l.ZipCode = r.Data.GetLanguageText("ReviewPhotoPainter.FormZipCode", "Your Zip Code");
            l.WhoAreYou = r.Data.GetLanguageText("Review.ShareModal.WhoAreYou", "Who are you?");
            l.WhoAreYouOptions = y("WhoAreYou");
            l.PreferredRetailer = r.Data.GetLanguageText("Review.ShareModal.PreferredRetailer", "Where do you shop?");
            l.PreferredRetailerOptions = y("PreferredRetailer");
            l.MarketSegment = r.Data.GetLanguageText("Review.ShareModal.MarketSegment", "What's your primary segment?");
            l.MarketSegmentOptions = y("MarketSegment");
            l.CountryOptions = y("Country");
            l.YourEmail = r.Data.GetLanguageText("Review.ShareModal.ShareEmail", "Your Email");
            l.RecipientEmail = r.Data.GetLanguageText("Review.ShareModal.RecipientEmail", "Recipient's Email");
            l.Country = r.Data.GetLanguageText("Review.ShareModal.Country", "Country");
            l.Required = r.Data.GetLanguageText("Review.ShareModal.Required", "(required)");
            l.SaveEmail = r.Data.GetLanguageText("Review.ShareModal.SaveEmail", "Email");
            l.SendButton = r.Data.GetLanguageText("Review.ShareModal.SendEmail", "Send Email");
            l.SaveButton = r.Data.GetLanguageText("Review.ShareModal.SaveButton", "Save Project");
            l.CancelButton = r.Data.GetLanguageText("Review.ShareModal.Cancel", "Cancel");
            l.Email360Address = r.Data.GetLanguageText("ReviewPhotoPainter.InboxEmailAddress", "360painting@example.com");
            l.shareChecked = r.Data.InstanceData.EmailCheckbox;
            l.showCheckbox = r.Data.InstanceData.UsesEmailSubscription;
            l.showWhoAreYou = r.Data.InstanceData.HaveWhoAreYou;
            l.ModalTitle = l.type == "share" || l.type == "email-360" ? l.ShareProjectTitle : l.SaveProjectTitle;
            l.ModalInstructions = "";
            l.ModalInstructions = l.type == "share" ? l.ShareProjectText : l.type == "email-360" ? l.Email360Text : l.SaveProjectText;
            l.GtmFrom = l.type == "share" ? "" : t.from;
            l.showColorNumber = r.Data.InstanceData.ShowColorNumber;
            l.hideColorSwatches = r.Data.InstanceData.ShowReviewColorName;
            l.hasTwoLogos = r.Data.InstanceData.HasTwoLogos;
            l.logoUrl2 = r.Data.InstanceData.LogoUrl2;
            l.SendButtonText = l.type == "share" || l.type == "email-360" ? l.SendButton : l.SaveButton;
            l.emailFormValid = a(l.emailSections) ? !0 : !1
        });
        l.myFunction = function() {
            console.log("Input field lost focus.")
        }
        ;
        l.text = {
            invalidname: r.Data.GetLanguageText("Review.ShareModal.InvalidName", "You must enter your name."),
            invalidfirstname: r.Data.GetLanguageText("Review.ShareModal.InvalidFirstName", "You must enter your first name."),
            invalidlastname: r.Data.GetLanguageText("Review.ShareModal.InvalidLastName", "You must enter your last name."),
            invalidemail: r.Data.GetLanguageText("Review.ShareModal.InvalidEmail", "You must enter a valid email address."),
            invalidphone: r.Data.GetLanguageText("ReviewPhotoPainter.Instructions.invalidPhoneError", "You must enter a valid phone number."),
            invalidzipcode: r.Data.GetLanguageText("ReviewPhotoPainter.Instructions.invalidZipCodeError", "You must enter a valid zip code."),
            agreement: r.Data.GetLanguageText("Review.ShareModal.Agreement", "Yes, I would like the opportunity to receive e-mails containing information, product updates, e-newsletters, samples, promotional offers and rebates from brands of PPG Industries, Inc. and its subsidiaries. I understand that I may later withdraw my consent to receive these materials by following the message's opt out instructions."),
            invalidPreferredRetailer: r.Data.GetLanguageText("Review.ShareModal.InvalidPreferredRetailer", "You must select a retailer."),
            invalidWhoAreYou: r.Data.GetLanguageText("Review.ShareModal.InvalidWhoAreYou", "You must select a role."),
            invalidMarketSegment: r.Data.GetLanguageText("Review.ShareModal.InvalidMarketSegment", "You must select a segment."),
            invalidCountry: r.Data.GetLanguageText("Review.ShareModal.InvalidCountry", "You must select a country.")
        };
        l.getPhotoName = function() {
            for (var i, t, n = 0; n < r.Data.StockImages.Rooms.Items.length; n++)
                for (i = [],
                t = 0; t < r.Data.StockImages.Rooms.Items[n].Photos.Items.length; t++)
                    if (r.Data.StockImages.Rooms.Items[n].Photos.Items[t].Active && r.Data.StockImages.Rooms.Items[n].Photos.Items[t].PhotoID == e.Project.StockID)
                        return r.Data.StockImages.Rooms.Items[n].Photos.Items[t].Description;
            return null
        }
        ;
        l.cancelModal = function(n, t) {
            n.preventDefault();
            var i = l.type == "share" ? "shareEmail modal" : "saveProject modal";
            h.event({
                event: "gtm.click",
                t: "ux",
                d1: i,
                d2: t
            });
            angular.element(document.getElementsByClassName("main-content")[0]).attr("aria-hidden", "false");
            l.showModal = !1
        }
        ;
        l.isEmailValid = function(n) {
            return /^([0-9A-z]([\+\-_\.][0-9A-z]+)*)+@(([0-9A-z][-\w]*[0-9A-z]*\.)+[0-9A-z]{2,17})$/.exec(n) != null
        }
        ;
        l.isPhoneValid = function(n) {
            return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.exec(n) != null
        }
        ;
        l.isZipValid = function(n) {
            return /(^\d{5}$)|(^\d{5}-\d{4}$)/.exec(n) != null
        }
        ;
        l.restore = function(n) {
            var t = n.currentTarget;
            switch (t.id) {
            case "share-first-name":
                l.invalidFirstName = !1;
                break;
            case "share-last-name":
                l.invalidLastName = !1;
                break;
            case "share-email":
                l.invalidEmail = !1;
                break;
            case "share-friend-email":
                l.invalidRecipient = !1;
                break;
            case "share-phone":
                l.invalidPhone = !1;
                break;
            case "share-zipcode":
                l.invalidZipCode = !1;
                break;
            default:
                return
            }
        }
        ;
        l.checkName = function(n, t) {
            t ? (l.invalidFirstName = n.length == 0,
            l.emailSections[0] = l.invalidFirstName ? 0 : 1) : (l.invalidLastName = n.length == 0,
            l.emailSections[1] = l.invalidLastName ? 0 : 1);
            l.emailFormValid = a(l.emailSections) && v() ? !0 : !1
        }
        ;
        l.checkEmail = function(n) {
            l.emailSections[2] = l.isEmailValid(n) ? 1 : 0;
            l.emailFormValid = a(l.emailSections) && v() ? !0 : !1
        }
        ;
        l.checkRecipient = function(n) {
            l.emailSections[3] = l.isEmailValid(n) ? 1 : 0;
            l.emailFormValid = a(l.emailSections) && v() ? !0 : !1
        }
        ;
        l.checkPhone = function(n) {
            l.email360Sections[0] = l.isPhoneValid(n) ? 1 : 0;
            l.emailFormValid = a(l.emailSections) && v() ? !0 : !1
        }
        ;
        l.checkZipCode = function(n) {
            l.email360Sections[1] = l.isZipValid(n) ? 1 : 0;
            l.emailFormValid = a(l.emailSections) && v() ? !0 : !1
        }
        ;
        l.checkInput = function(n) {
            var t = n.currentTarget;
            switch (t.id) {
            case "share-first-name":
                l.invalidFirstName = t.value.length == 0;
                l.emailSections[0] = l.invalidFirstName ? 0 : 1;
                l.emailSections[0] && (l.selfFirstName = t.value);
                break;
            case "share-last-name":
                l.invalidLastName = t.value.length == 0;
                l.emailSections[1] = l.invalidLastName ? 0 : 1;
                l.emailSections[1] && (l.selfLastName = t.value);
                break;
            case "share-email":
                l.isEmailValid(t.value) ? (l.invalidEmail = !1,
                l.emailSections[2] = 1) : (l.invalidEmail = !0,
                l.emailSections[2] = 0);
                break;
            case "share-friend-email":
                l.isEmailValid(t.value) ? (l.invalidRecipient = !1,
                l.emailSections[3] = 1) : (l.invalidRecipient = !0,
                l.emailSections[3] = 0);
                break;
            case "share-phone":
                l.isPhoneValid(t.value) ? (l.invalidPhone = !1,
                l.email360Sections[0] = 1) : (l.invalidPhone = !0,
                l.email360Sections[0] = 0);
                break;
            case "share-zipcode":
                l.isZipValid(t.value) ? (l.invalidZipCode = !1,
                l.email360Sections[1] = 1) : (l.invalidZipCode = !0,
                l.email360Sections[1] = 0)
            }
            l.emailFormValid = a(l.emailSections) && v() ? !0 : !1
        }
        ;
        l.checkPreferredRetailer = function(n) {
            l.invalidPreferredRetailer = n == null ? !0 : !1;
            l.emailFormValid = a(l.emailSections) && v() ? !0 : !1
        }
        ;
        l.checkWhoAreYou = function(n) {
            l.invalidWhoAreYou = n == null ? !0 : !1;
            l.showMarketSegment = n.toLowerCase().replace("string:", "") === "professional" ? !0 : !1;
            l.emailFormValid = a(l.emailSections) && v() ? !0 : !1
        }
        ;
        l.checkMarketSegment = function(n) {
            l.invalidMarketSegment = n == null ? !0 : !1;
            l.emailFormValid = a(l.emailSections) && v() ? !0 : !1
        }
        ;
        l.generateShare = function(t, i) {
            var r, u, f;
            t.preventDefault();
            e.SharedProject.AppliedColors = l.getSharableColors();
            l.formattedStockName = "";
            e.Project.StockName && p(e.Project.StockName);
            r = e.Project;
            r.Base64 = l.image.split(",")[1];
            r.blobUrl = n.BlobStorageUrl;
            r.instanceKey = e.Project.Instance;
            r.projectId = e.Project.id;
            r.showColorNumber = l.showColorNumber;
            r.hideColorSwatches = l.hideColorSwatches;
            r.stockPhotoName = l.formattedStockName;
            r.uploadPhoto = e.PaintedImage;
            r.usedColors = JSON.stringify(e.SharedProject.AppliedColors);
            u = JSON.stringify(r);
            f = {
                headers: {
                    DcpApiToken: _ApiToken,
                    DcpSessionID: _SessionID,
                    "Content-Type": "application/json"
                }
            };
            o.post("/share/email", u, f).then(function(n) {
                l.showEmailSentMessage = !1;
                e.SharedProject.ImageUrl = n.data;
                switch (i) {
                case "save":
                    h.event({
                        event: "gtm.click",
                        t: "saveProject"
                    });
                    var t = l.getUsedColors()
                      , r = l.getUnusedColors()
                      , u = l.getPhotoName();
                    h.event({
                        event: "savedProjectAttributes",
                        t: "savedProjectAttributes",
                        d1: "projectID",
                        d2: e.Project.id
                    });
                    h.event({
                        event: "savedProjectAttributes",
                        t: "savedProjectAttributes",
                        d1: "usedColors",
                        d2: t
                    });
                    h.event({
                        event: "savedProjectAttributes",
                        t: "savedProjectAttributes",
                        d1: "unUsedColors",
                        d2: r
                    });
                    e.Project.StockID ? h.event({
                        event: "savedProjectAttributes",
                        t: "savedProjectAttributes",
                        d1: "photo",
                        d2: u
                    }) : h.event({
                        event: "savedProjectAttributes",
                        t: "savedProjectAttributes",
                        d1: "photo",
                        d2: "user"
                    });
                    l.showInvalidEmailError || l.sendEmail(i);
                    break;
                case "share":
                    l.selfFirstName = document.getElementById("share-first-name").value;
                    l.selfLastName = document.getElementById("share-last-name").value;
                    h.event({
                        event: "gtm.click",
                        t: "shareProject",
                        d1: "email",
                        d2: l.PageData.Data.CurrentStep
                    });
                    l.showInvalidEmailError || l.sendEmail(i);
                    break;
                case "email-360":
                    h.event({
                        event: "gtm.click",
                        t: "email360"
                    });
                    l.selfFirstName = document.getElementById("share-first-name").value;
                    l.selfLastName = document.getElementById("share-last-name").value;
                    l.selfPhone = document.getElementById("share-phone").value;
                    l.selfZip = document.getElementById("share-zipcode").value;
                    l.showInvalidEmailError || l.sendEmail(i)
                }
            });
            angular.element(document.getElementsByClassName("main-content")[0]).attr("aria-hidden", "false");
            l.showModal = !1
        }
        ;
        l.getUnusedColors = function() {
            for (var i = [], f = r.Data.InstanceColors.Colors.Items, t, n = 0; n < e.Project.Colors.length; n++)
                u("filter")(e.Project.AppliedColors, e.Project.Colors[n]).length === 0 && (t = f.filter(function(t) {
                    return t.ColorID == e.Project.Colors[n]
                })[0],
                t !== undefined && i.push(t.gtmName));
            return i
        }
        ;
        l.getUsedColors = function() {
            for (var t = [], n = 0; n < l.ProjectImages.Data.DcpImage.Masks.length; n++)
                l.ProjectImages.Data.DcpImage.Masks[n].Color !== null && t.indexOf(l.ProjectImages.Data.DcpImage.Masks[n].Color.ColorID) === -1 && t.push(l.ProjectImages.Data.DcpImage.Masks[n].Color.gtmName);
            return t
        }
        ;
        l.sendEmail = function(t) {
            l.showMessages = !1;
            var f = function() {
                l.showEmailSentMessage = !0;
                l.showMessages = !0;
                l.PageData.Data.InfoMessage = l.EmailRecipientPrefix + " " + l.emailObj.RecipientEmailAddress;
                l.PageData.Data.EmailSent = !0
            }
              , o = function() {
                l.showEmailSentMessage = !1;
                l.showMessages = !0
            }
              , i = function(i) {
                var c, h, s;
                for (e.SharedProject = i.data,
                e.Project.SharedProjectIDs.push(i.data.id),
                l.updateEmailObject(t),
                t == "email-360" ? (l.emailObj.RecipientEmailAddress = l.Email360Address,
                l.emailObj.ContactWithEmail = document.getElementById("share-email").value,
                l.emailObj.Phone = l.selfPhone,
                l.emailObj.ZipCode = l.selfZip) : l.emailObj.RecipientEmailAddress = e.SharedProject.ShareType === "share" ? document.getElementById("share-friend-email").value : document.getElementById("share-email").value,
                l.emailObj.UserEmailAddress = document.getElementById("share-email").value,
                l.emailObj.LogoUrl = n.BlobStorageUrl + n.InstanceAssetsFrom + "/logo.png",
                l.emailObj.BlobStorageUri = n.BlobStorageUrl,
                l.emailObj.Instance = n.Instance,
                l.emailObj.ProjectID = e.Project.id,
                l.emailObj.SocialNetworks = [],
                l.emailObj.LogoUrl = n.BlobStorageUrl + n.InstanceAssetsFrom + "/logo.png",
                l.emailObj.LogoUrl2 = r.Data.InstanceData.HasTwoLogos ? r.Data.InstanceData.LogoUrl2 : "",
                l.emailObj.LogoUrlAction = r.Data.GetLanguageText("logo1action.url", ""),
                l.emailObj.LogoUrl2Action = r.Data.GetLanguageText("logo2action.url", ""),
                l.emailObj.FirstName = l.selfFirstName,
                l.emailObj.LastName = l.selfLastName,
                l.emailObj.IsChecked = l.shareChecked,
                l.emailObj.UseClientLink = r.Data.InstanceData.UseClientLink,
                l.emailObj.HaveWhoAreYou = r.Data.InstanceData.HaveWhoAreYou,
                l.emailObj.PreferredRetailer = document.getElementById("share-preferred-retailer").value.replace("string:", ""),
                l.emailObj.WhoAreYou = document.getElementById("share-who-are-you").value.replace("string:", ""),
                l.emailObj.MarketSegment = document.getElementById("share-market-segment").value.replace("string:", ""),
                l.emailObj.Country = document.getElementById("share-country").value.replace("string:", ""),
                c = Object.keys(r.Data.InstanceData.LanguageText),
                h = u("filter")(c, "sociallinks."),
                s = 0; s < h.length; s++)
                    l.emailObj.SocialNetworks.push({
                        ImageName: h[s].split(".")[1] + ".png",
                        SocialUrl: r.Data.GetLanguageText(h[s], "")
                    });
                e.EmailProject(l.emailObj, f, o);
                e.SaveProject();
                l.selfEmail = "";
                l.selfEmailReset = !1;
                l.recipientEmail = "";
                l.recipientEmailReset = !1;
                setTimeout(function() {
                    l.PageData.Data.ClearInfoMessage();
                    l.PageData.Data.EmailSent = !1
                }, 8e3);
                (t == "share" || t == "email-360") && (l.friendEmailSent = !0)
            };
            e.SharedProject.ShareType = t;
            e.SharedProject.ProjectID = e.Project.id;
            e.ShareProject(i, i)
        }
        ;
        l.replacePlaceholders = function(n) {
            var i = {
                "[Name]": l.selfFirstName,
                "[Brand]": _BrandName,
                "}": "<\/a>"
            }
              , t = 0;
            return n.replace(/\[\w+\]|}/g, function(n) {
                return i[n] || n
            }).replace(/{/ig, function() {
                return t++,
                "<a href='" + r.Data.GetLanguageText("SelfEmail.EmailSignUpText.Link" + t, "") + "'>"
            })
        }
        ;
        l.updateEmailObject = function(t) {
            t === "save" ? l.emailObj = {
                Subject: l.replacePlaceholders(r.Data.GetLanguageText("SelfEmail.Subject", "Your Freshly Painted Room by [Brand]!")),
                Headline: r.Data.GetLanguageText("SelfEmail.Headline", "Your Freshly Painted Room!"),
                BodyCopy: r.Data.GetLanguageText("SelfEmail.BodyCopy", "Like what you see? Return to your project and then make this new room a reality by finding your nearest store. Happy painting!"),
                BlobName: e.SharedProject.ImageUrl,
                Buttons: [{
                    Text: r.Data.GetLanguageText("SelfEmail.CTA1Text", "Return to Your Project"),
                    Url: e.Project.StockID != null ? i.absUrl().replace(/ReviewPhoto/, "StockPhoto") + "&wt.tsrc=dcp&utm_medium=email&utm_source=dcp&utm_campaign=shareProject" : i.absUrl().replace(/ReviewPhoto/, "PaintPhoto") + "&wt.tsrc=dcp&utm_medium=email&utm_source=dcp&utm_campaign=shareProject"
                }, {
                    Text: r.Data.GetLanguageText("SelfEmail.StoreFinderText", "Find a Store Near You"),
                    Url: r.Data.GetLanguageText("SelfEmail.StoreFinderCTA", "")
                }, {
                    Text: r.Data.GetLanguageText("SelfEmail.StoreFinderText2", "Find a Store Near You"),
                    Url: r.Data.GetLanguageText("SelfEmail.StoreFinderCTA2", "")
                }, ],
                Colors: e.SharedProject.AppliedColors,
                EmailLanguage: l.replacePlaceholders(r.Data.GetLanguageText("SelfEmail.EmailLanguage", "Sign up to receive product updates and promotional offers from [Brand].")),
                EmailSignUpUrl: r.Data.GetLanguageText("SelfEmail.EmailSignUpUrl", ""),
                EmailUpdates: l.replacePlaceholders(r.Data.GetLanguageText("SelfEmail.EmailSignUpText", "")),
                UnsubscribeText: r.Data.GetLanguageText("SharedEmail.UnsubscribeText", ""),
                UnsubscribeUrl: r.Data.GetLanguageText("SharedEmail.UnsubscribeUrl", ""),
                LegalCopyLine1: r.Data.GetLanguageText("SharedEmail.LegalCopyLine1", "").replace("{currentYear}", (new Date).getFullYear()),
                LegalCopyLine2: r.Data.GetLanguageText("SharedEmail.LegalCopyLine2", "").replace("{currentYear}", (new Date).getFullYear()),
                HideColorNumber: r.Data.InstanceData.ShowColorNumber,
                FirstName: l.selfFirstName,
                LastName: l.selfFirstName,
                IsChecked: l.shareChecked
            } : (l.emailObj = {
                Subject: l.replacePlaceholders(l.replacePlaceholders(r.Data.GetLanguageText("SharedEmail.Subject", "Check Out [Name]’s New Room by [Brand]!"))),
                Headline: l.replacePlaceholders(r.Data.GetLanguageText("SharedEmail.Headline", "Check Out [Name]’s New Room!")),
                BodyCopy: l.replacePlaceholders(r.Data.GetLanguageText("SharedEmail.BodyCopy", "[Name] just digitally painted their own room with [Brand]’s 3-step Paint Visualizer. All it takes is a single photo and a little creativity. Try digitally painting one of your own rooms today!")),
                BlobName: e.SharedProject.ImageUrl,
                Buttons: [{
                    Text: r.Data.GetLanguageText("SharedEmail.CTA1Text", "Digitally Paint Your Own Room"),
                    Url: r.Data.GetLanguageText("SharedEmail.CTA1Url", "")
                }, {
                    Text: r.Data.GetLanguageText("SharedEmail.StoreFinderText", "Find a Store Near You"),
                    Url: r.Data.GetLanguageText("SharedEmail.StoreFinderCTA", "")
                }, {
                    Text: r.Data.GetLanguageText("SelfEmail.StoreFinderText2", "Find a Store Near You"),
                    Url: r.Data.GetLanguageText("SelfEmail.StoreFinderCTA2", "")
                }, ],
                Colors: e.SharedProject.AppliedColors,
                EmailLanguage: l.replacePlaceholders(r.Data.GetLanguageText("SharedEmail.EmailLanguage", "Sign up to receive product updates and promotional offers from [Brand].")),
                EmailSignUpUrl: r.Data.GetLanguageText("SharedEmail.EmailSignUpUrl", ""),
                EmailUpdates: l.replacePlaceholders(r.Data.GetLanguageText("SelfEmail.EmailSignUpText", "")),
                UnsubscribeText: r.Data.GetLanguageText("SharedEmail.UnsubscribeText", ""),
                UnsubscribeUrl: r.Data.GetLanguageText("SharedEmail.UnsubscribeUrl", ""),
                LegalCopyLine1: r.Data.GetLanguageText("SharedEmail.LegalCopyLine1", "").replace("{currentYear}", (new Date).getFullYear()),
                LegalCopyLine2: r.Data.GetLanguageText("SharedEmail.LegalCopyLine2", "").replace("{currentYear}", (new Date).getFullYear()),
                HideColorNumber: r.Data.InstanceData.ShowColorNumber,
                FirstName: l.selfFirstName,
                LastName: l.selfFirstName,
                IsChecked: l.shareChecked
            },
            t == "email-360" && (l.emailObj.Headline = l.replacePlaceholders(r.Data.GetLanguageText("SharedEmail.HeadlinePainter", "Please contact [Name] about their PPG Color"))));
            l.emailObj.SenderEmailAddress = r.Data.GetLanguageText("Email.NoReplyAddress", "email@PPGArchitecturalFinishes.com");
            l.emailObj.SenderName = r.Data.GetLanguageText("Email.NoReplyDisplayName", "");
            l.emailObj.UseSmallEmailLogoSize = r.Data.InstanceData.UseSmallEmailLogoSize;
            var u = r.Data.GetLanguageText("Email.CtaFontColor", "default");
            n.LowerCaseCompare(u, "default") && (u = "#04567c");
            u == "RGB 2 - 23 - 138" && (u = "#02178a");
            l.emailObj.CtaColorHex = u
        }
        ;
        l.getSharableColors = function(n, t) {
            for (var f = [], i, s, o = 0; o < e.Project.AppliedColors.length; o++)
                if (i = r.Data.InstanceColors.GetColor({
                    ColorID: e.Project.AppliedColors[o].ColorID
                }),
                s = u("filter")(f, {
                    ColorID: i.ColorID
                }, !0),
                s.length === 0 && (f.push({
                    ColorID: i.ColorID,
                    Name: i.ColorName,
                    Number: i.ColorNumber,
                    Rgb: {
                        R: i.R,
                        G: i.G,
                        B: i.B
                    },
                    IsDark: i.IsDark,
                    Icon: i.DcpCSSColorImage
                }),
                n && f.length === t))
                    break;
            return f
        }
        ;
        l.countryChanged = function() {
            f.inputValueCountry != null && (f.inputValueCountry.toLowerCase() == "canada" ? l.shareChecked = !1 : r.Data.InstanceData.EmailCheckbox && (l.shareChecked = !0));
            l.invalidCountry = f.inputValueCountry == null ? !0 : !1;
            l.emailFormValid = a(l.emailSections) && v() ? !0 : !1
        }
    }
    var n = angular.module("dcpLite");
    n.component("shareModal", {
        templateUrl: "/Versions/Shared/Views/Components/Controls/ShareModal.html",
        bindings: {
            index: "=",
            helpType: "@"
        },
        transclude: !0,
        controllerAs: "model",
        controller: ["$rootScope", "$location", "dsl", "$filter", "$scope", "projectService", "$http", "pageData", "gtmDataLayer", "projectImages", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o, s, h, c) {
        function a(n, t) {
            var i = n;
            return i.replace(/{([^}]+)}/g, t)
        }
        var l = this;
        l.showModal = !1;
        l.showGrey = !0;
        l.PageData = s;
        l.ProjectServ = e;
        l.selectedSheenName = "Flat";
        l.sheenDelay = !1;
        f.radiodata = {};
        t.$on("showSheenModal", function(t, i) {
            var o, u, e, s;
            for (l.showModal = !0,
            l.roomSelected = !1,
            l.retailerID = i.retailerID,
            l.color = i.color,
            l.InstanceFromID = r.Data.InstanceData.InstanceFromID,
            l.retailersShortList = ["Walmart", "HomeDepot", "Amazon"],
            l.retailerNameText = l.retailersShortList[l.retailerID - 1],
            l.isPaint = l.ProjectServ.Project.StockID ? !1 : !0,
            angular.element(document.querySelector("#main-content")).attr("aria-hidden", "true"),
            l.ModalInstructions = r.Data.GetLanguageText("Review.ShareModal.ShareInstructions", "Share your project with friends and family."),
            l.ModalTitle = r.Data.GetLanguageText("Review.SheenModalTitle", "Select Your Paint Sheen"),
            l.Continue = r.Data.GetLanguageText("Review.Actions.ContinueOnline", "Continue to"),
            l.ChangeRoomType = r.Data.GetLanguageText("Review.SheenHeadline.ChangeRoomType", "Change Room Type"),
            l.SelectRoomType = r.Data.GetLanguageText("Review.SheenHeadline.SelectRoomType", "Select Your Room Type"),
            l.Recommended = r.Data.GetLanguageText("Review.SheenText.Recommended", "RECOMMENDED").toUpperCase(),
            l.Walmart = {
                SheenText: {
                    Flat: r.Data.GetLanguageText("Review.SheenText.Walmart.Flat", "Ceilings, Commercial, Dining Rooms, Offices"),
                    SemiGloss: r.Data.GetLanguageText("Review.SheenText.Walmart.Semi-Gloss", "Ceilings, Commercial, Dining Rooms, Offices"),
                    Eggshell: r.Data.GetLanguageText("Review.SheenText.Walmart.Eggshell", "Ceilings, Commercial, Dining Rooms, Offices"),
                    ExteriorFlat: r.Data.GetLanguageText("Review.SheenText.Walmart.ExteriorFlat", "Exteriors"),
                    ExteriorSemiGloss: r.Data.GetLanguageText("Review.SheenText.Walmart.ExteriorSemiGloss", "Exteriors"),
                    ExteriorEggshell: r.Data.GetLanguageText("Review.SheenText.Walmart.ExteriorEggshell", "Exteriors")
                },
                SheenHeadline: {
                    Flat: r.Data.GetLanguageText("Review.SheenHeadline.Walmart.Flat", "BEST FOR").toUpperCase(),
                    SemiGloss: r.Data.GetLanguageText("Review.SheenHeadline.Walmart.Semi-Gloss", "BEST FOR").toUpperCase(),
                    Eggshell: r.Data.GetLanguageText("Review.SheenHeadline.Walmart.Eggshell", "BEST FOR").toUpperCase(),
                    ExteriorFlat: r.Data.GetLanguageText("Review.SheenHeadLine.Walmart.ExteriorFlat", "BEST FOR").toUpperCase(),
                    ExteriorSemiGloss: r.Data.GetLanguageText("Review.SheenHeadLine.Walmart.ExteriorSemiGloss", "BEST FOR").toUpperCase(),
                    ExteriorEggshell: r.Data.GetLanguageText("Review.SheenHeadLine.Walmart.ExteriorEggshell", "BEST FOR").toUpperCase()
                },
                SheenName: {
                    Flat: r.Data.GetLanguageText("Review.SheenName.Walmart.Flat", "Interior - Flat"),
                    SemiGloss: r.Data.GetLanguageText("Review.SheenName.Walmart.Semi-Gloss", "Interior - Semi-Gloss"),
                    Eggshell: r.Data.GetLanguageText("Review.SheenName.Walmart.Eggshell", "Interior - Eggshell"),
                    ExteriorFlat: r.Data.GetLanguageText("Review.SheenName.Walmart.ExteriorFlat", "Exterior - Flat"),
                    ExteriorSemiGloss: r.Data.GetLanguageText("Review.SheenName.Walmart.ExteriorSemiGloss", "Exterior - Semi-Gloss"),
                    ExteriorEggshell: r.Data.GetLanguageText("Review.SheenName.Walmart.ExteriorEggshell", "Exterior - Eggshell")
                }
            },
            l.HomeDepot = {
                SheenText: {
                    Flat: r.Data.GetLanguageText("Review.SheenText.The Home Depot.Flat", "Ceilings, Commercial, Dining Rooms, Offices"),
                    SemiGloss: r.Data.GetLanguageText("Review.SheenText.The Home Depot.Semi-Gloss", "Bathrooms, Trim"),
                    Eggshell: r.Data.GetLanguageText("Review.SheenText.The Home Depot.Eggshell", "Bedrooms, Hallways, Living Rooms"),
                    Satin: r.Data.GetLanguageText("Review.SheenText.The Home Depot.Satin", "Entryways, Exteriors, Kitchens, Nursery Rooms"),
                    ExteriorFlat: r.Data.GetLanguageText("Review.SheenText.The Home Depot.ExteriorFlat", "Exteriors"),
                    ExteriorSemiGloss: r.Data.GetLanguageText("Review.SheenText.The Home Depot.ExteriorSemiGloss", "Exteriors"),
                    ExteriorEggshell: r.Data.GetLanguageText("Review.SheenText.The Home Depot.ExteriorEggshell", "Exteriors"),
                    ExteriorSatin: r.Data.GetLanguageText("Review.SheenText.The Home Depot.ExteriorSatin", "Exteriors")
                },
                SheenHeadline: {
                    Flat: r.Data.GetLanguageText("Review.SheenHeadline.The Home Depot.Flat", "BEST FOR").toUpperCase(),
                    SemiGloss: r.Data.GetLanguageText("Review.SheenHeadline.The Home Depot.Semi-Gloss", "BEST FOR").toUpperCase(),
                    Eggshell: r.Data.GetLanguageText("Review.SheenHeadline.The Home Depot.Eggshell", "BEST FOR").toUpperCase(),
                    Satin: r.Data.GetLanguageText("Review.SheenHeadline.The Home Depot.Satin", "BEST FOR").toUpperCase(),
                    ExteriorFlat: r.Data.GetLanguageText("Review.SheenHeadLine.The Home Depot.ExteriorFlat", "BEST FOR").toUpperCase(),
                    ExteriorSemiGloss: r.Data.GetLanguageText("Review.SheenHeadLine.The Home Depot.ExteriorSemiGloss", "BEST FOR").toUpperCase(),
                    ExteriorEggshell: r.Data.GetLanguageText("Review.SheenHeadLine.The Home Depot.ExteriorEggshell", "BEST FOR").toUpperCase(),
                    ExteriorSatin: r.Data.GetLanguageText("Review.SheenHeadLine.The Home Depot.ExteriorSatin", "BEST FOR").toUpperCase()
                },
                SheenName: {
                    Flat: r.Data.GetLanguageText("Review.SheenName.The Home Depot.Flat", "Interior - Flat"),
                    SemiGloss: r.Data.GetLanguageText("Review.SheenName.The Home Depot.Semi-Gloss", "Interior - Semi-Gloss"),
                    Eggshell: r.Data.GetLanguageText("Review.SheenName.The Home Depot.Eggshell", "Interior - Eggshell"),
                    Satin: r.Data.GetLanguageText("Review.SheenName.The Home Depot.Satin", "Interior - Satin"),
                    ExteriorFlat: r.Data.GetLanguageText("Review.SheenName.The Home Depot.ExteriorFlat", "Exterior - Flat"),
                    ExteriorSemiGloss: r.Data.GetLanguageText("Review.SheenName.The Home Depot.ExteriorSemiGloss", "Exterior - Semi-Gloss"),
                    ExteriorEggshell: r.Data.GetLanguageText("Review.SheenName.The Home Depot.ExteriorEggshell", "Exterior - Eggshell"),
                    ExteriorSatin: r.Data.GetLanguageText("Review.SheenName.The Home Depot.ExteriorSatin", "Exterior - Satin")
                }
            },
            l.Amazon = {
                SheenText: {
                    Flat: r.Data.GetLanguageText("Review.SheenText.Amazon.Flat", "Ceilings, Commercial, Dining Rooms, Offices"),
                    SemiGloss: r.Data.GetLanguageText("Review.SheenText.Amazon.Semi-Gloss", "Bathrooms, Trim"),
                    Eggshell: r.Data.GetLanguageText("Review.SheenText.Amazon.Eggshell", "Bedrooms, Hallways, Living Rooms"),
                    Satin: r.Data.GetLanguageText("Review.SheenText.Amazon.Satin", "Entryways, Exteriors, Kitchens, Nursery Rooms"),
                    ExteriorFlat: r.Data.GetLanguageText("Review.SheenText.Amazon.ExteriorFlat", "Exteriors"),
                    ExteriorSemiGloss: r.Data.GetLanguageText("Review.SheenText.Amazon.ExteriorSemiGloss", "Exteriors"),
                    ExteriorEggshell: r.Data.GetLanguageText("Review.SheenText.Amazon.ExteriorEggshell", "Exteriors"),
                    ExteriorSatin: r.Data.GetLanguageText("Review.SheenText.Amazon.ExteriorSatin", "Exteriors")
                },
                SheenHeadline: {
                    Flat: r.Data.GetLanguageText("Review.SheenHeadline.Amazon.Flat", "BEST FOR").toUpperCase(),
                    SemiGloss: r.Data.GetLanguageText("Review.SheenHeadline.Amazont.Semi-Gloss", "BEST FOR").toUpperCase(),
                    Eggshell: r.Data.GetLanguageText("Review.SheenHeadline.Amazon.Eggshell", "BEST FOR").toUpperCase(),
                    Satin: r.Data.GetLanguageText("Review.SheenHeadline.Amazon.Satin", "BEST FOR").toUpperCase(),
                    ExteriorFlat: r.Data.GetLanguageText("Review.SheenHeadLine.Amazon.ExteriorFlat", "BEST FOR").toUpperCase(),
                    ExteriorSemiGloss: r.Data.GetLanguageText("Review.SheenHeadLine.Amazon.ExteriorSemiGloss", "BEST FOR").toUpperCase(),
                    ExteriorEggshell: r.Data.GetLanguageText("Review.SheenHeadLine.Amazon.ExteriorEggshell", "BEST FOR").toUpperCase(),
                    ExteriorSatin: r.Data.GetLanguageText("Review.SheenHeadLine.Amazon.ExteriorSatin", "BEST FOR").toUpperCase()
                },
                SheenName: {
                    Flat: r.Data.GetLanguageText("Review.SheenName.Amazon.Flat", "Interior - Flat"),
                    SemiGloss: r.Data.GetLanguageText("Review.SheenName.Amazon.Semi-Gloss", "Interior - Semi-Gloss"),
                    Eggshell: r.Data.GetLanguageText("Review.SheenName.Amazon.Eggshell", "Interior - Eggshell"),
                    Satin: r.Data.GetLanguageText("Review.SheenName.Amazon.Satin", "Interior - Satin"),
                    ExteriorFlat: r.Data.GetLanguageText("Review.SheenName.Amazon.ExteriorFlat", "Exterior - Flat"),
                    ExteriorSemiGloss: r.Data.GetLanguageText("Review.SheenName.Amazon.ExteriorSemiGloss", "Exterior - Semi-Gloss"),
                    ExteriorEggshell: r.Data.GetLanguageText("Review.SheenName.Amazon.ExteriorEggshell", "Exterior - Eggshell"),
                    ExteriorSatin: r.Data.GetLanguageText("Review.SheenName.Amazon.ExteriorSatin", "Exterior - Satin")
                }
            },
            l.Images = {
                ImageName: {
                    Walmart: "sheenimages/walmart.svg",
                    HomeDepot: "sheenimages/home-depot.svg",
                    Amazon: "sheenimages/amazon.svg"
                }
            },
            l.ProductUrl = {
                Walmart: r.Data.GetLanguageText("Review.ProductUrl.Walmart", "http://www.walmart.com/ip/{UrlProductKey}"),
                HomeDepot: r.Data.GetLanguageText("Review.ProductUrl.The Home Depot", "http://www.homedepot.com/p/{UrlProductKey}"),
                Amazon: r.Data.GetLanguageText("Review.ProductUrl.Amazon", "http://www.amazon.com/dp/{UrlProductKey}")
            },
            l.BrandColors = {
                BackColor: {
                    Walmart: r.Data.GetLanguageText("Review.BuyOnline.BackColor.Walmart", "rgba(0,125,198,1)"),
                    HomeDepot: "rgba(241,100,34,1)",
                    Amazon: "rgba(35,47,62,1)"
                },
                Hover: {
                    Walmart: r.Data.GetLanguageText("Review.BuyOnline.BackHoverColor.Walmart", "rgba(0,76,145,1)"),
                    HomeDepot: "rgba(193,80,28,1)",
                    Amazon: "rgba(0,0,0,1)"
                }
            },
            f.roomtypes = ["Bathroom", "Bedroom", "Commercial Space", "Dining Room", "Entryway", "Exterior", "Hallway", "Kitchen", "Living Room", "Nursery Room", "Office"],
            u = 0; u < r.Data.BuyOnlineData.Retailers.Items.length; u++)
                if (l.retailerID == r.Data.BuyOnlineData.Retailers.Items[u].RetailerID) {
                    l.Retailer = r.Data.BuyOnlineData.Retailers.Items[u].RetailerName != "The Home Depot" ? r.Data.BuyOnlineData.Retailers.Items[u].RetailerName : "HomeDepot";
                    break
                }
            for (l.retrievedColors = r.Data.BuyOnlineData.GetColor(l.color.ColorID),
            l.Sheens = [],
            l.ExteriorSheens = [],
            l.Images.SheenImage = [],
            u = 0; u < r.Data.BuyOnlineData.Sheens.Items.length; u++)
                if (r.Data.BuyOnlineData.Sheens.Items[u].RetailerID == l.retailerID)
                    for (e = 0; e < l.retrievedColors.length; e++)
                        r.Data.BuyOnlineData.Sheens.Items[u].SheenID == l.retrievedColors[e].SheenID && l.retrievedColors[e].RetailerID == l.retailerID && l.retrievedColors[e].InstanceID == l.InstanceFromID && (o = angular.copy(r.Data.BuyOnlineData.Sheens.Items[u]),
                        o.Image = n.BlobStorageUrl + n.InstanceAssetsFrom + "/sheenimages/" + r.Data.BuyOnlineData.Sheens.Items[u].SheenName.toLowerCase() + ".jpg",
                        o.sheenType = o.SheenName != "Semi-Gloss" ? o.SheenName : "SemiGloss",
                        l.retrievedColors[e].Exterior == !1 ? l.Sheens.push(o) : l.ExteriorSheens.push(o));
            l.ExtSheenTypes = ["semigloss", "satin", "eggshell"];
            n: for (u = 0; u < l.ExtSheenTypes.length; u++)
                for (e = 0; e < l.ExteriorSheens.length; e++)
                    if (l.ExteriorSheens[e].sheenType.toLowerCase() == l.ExtSheenTypes[u].toLowerCase()) {
                        s = l.ExteriorSheens[e];
                        s.SheenName = "Exterior" + s.sheenType;
                        s.sheenType = s.SheenName;
                        l.Sheens.push(s);
                        break n
                    }
            l.hasTwoLogos = r.Data.InstanceData.HasTwoLogos;
            l.logoUrl2 = r.Data.InstanceData.LogoUrl2;
            f.retailerImg = n.BlobStorageUrl + n.InstanceAssetsFrom + "/" + l.Images.ImageName[l.Retailer];
            f.radiodata.value = null;
            l.showGrey = !0
        });
        l.cancelModal = function(n, t) {
            t != "continued" && h.event({
                event: "gtm.click",
                t: "ux",
                d1: "sheen modal",
                d2: "clicked outside modal"
            });
            (t != "continued" || l.showGrey) && t == "continued" || (l.showModal = !1)
        }
        ;
        l.changedSheen = function() {
            l.showGrey = !1;
            l.sheenDelay || (l.sheenDelay = !0,
            setTimeout(function() {
                h.event({
                    event: "gtm.click",
                    t: "orderPaint",
                    d1: "selectSheen",
                    d2: l.selectedSheenName
                });
                l.sheenDelay = !1
            }, 50))
        }
        ;
        l.GetProductUrl = function(n) {
            var i = l.Sheens[n], r, t;
            for (i === undefined && (i = l.Sheens[0]),
            r = i.sheenType.toLowerCase().indexOf("exterior") >= 0 ? !0 : !1,
            t = 0; t < l.retrievedColors.length; t++)
                if (i.SheenID == l.retrievedColors[t].SheenID && l.retailerID == l.retrievedColors[t].RetailerID && (r && l.retrievedColors[t].Exterior == !0 || !r && l.retrievedColors[t].Exterior == !1)) {
                    l.UrlProductKey = l.retrievedColors[t].UrlProductKey;
                    break
                }
            l.ProductUrlLink = a(l.ProductUrl[l.Retailer], l.UrlProductKey)
        }
        ;
        l.selectRoom = function(n) {
            l.selectedRoom = n;
            l.roomSelected = !0
        }
        ;
        l.goToRetailer = function() {
            if (!l.showGrey) {
                c.open(l.ProductUrlLink, "_blank");
                var n = l.Retailer != "HomeDepot" ? l.Retailer : "The Home Depot";
                h.event({
                    event: "orderAttribute",
                    t: "orderAttribute",
                    d1: "color",
                    d2: l.color.gtmName
                });
                h.event({
                    event: "orderAttribute",
                    t: "orderAttribute",
                    d1: "sheen",
                    d2: l.selectedSheenName
                });
                h.event({
                    event: "orderAttribute",
                    t: "orderAttribute",
                    d1: "store",
                    d2: n
                });
                h.event({
                    event: "orderAttribute",
                    t: "orderAttribute",
                    d1: "size",
                    d2: "gallon"
                });
                h.event({
                    event: "gtm.click",
                    t: "buy",
                    d1: "buy-clicktoRetailer"
                })
            }
        }
        ;
        l.checkRecommended = function(n, t, i) {
            for (var e = l[t].SheenText[n], u = e.split(", "), o = l.selectedRoom == "Commercial Space" ? "Commercial" : l.selectedRoom + "s", r = 0; r < u.length; r++)
                if (u[r] == o)
                    return f.radiodata.value = i,
                    l.GetProductUrl(i),
                    !0;
            return !1
        }
    }
    var n = angular.module("dcpLite");
    n.component("sheenModal", {
        templateUrl: "/Versions/Shared/Views/Components/Controls/SheenModal.html",
        bindings: {
            index: "=",
            helpType: "@"
        },
        transclude: !0,
        controllerAs: "model",
        controller: ["$rootScope", "$location", "dsl", "$filter", "$scope", "projectService", "$http", "pageData", "gtmDataLayer", "$window", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e) {
        function s(n, t) {
            var i = document.getElementById("SocialShareFormurl")
              , u = document.getElementById("SocialShareFormdescription");
            t == "pinterest" ? (i.value = r.Data.GetLanguageText("Pinterest.SharingUrl", ""),
            u.value = r.Data.GetLanguageText("Pinterest.Description", "Digitally paint your own room with your favorite colors, in just a few clicks! Upload your picture to find the perfect color combination for your next painting project. ")) : t == "weibo" ? (i.value = r.Data.GetLanguageText("Weibo.SharingUrl", "https://www.visualizecolor.com/mastersmark"),
            u.value = r.Data.GetLanguageText("Weibo.Description", "只需点击几下，就可以用自己喜欢的颜色对您的家进行实景模拟焕色！上传一张您房间的照片，为您的涂刷项目找到合适的配色。")) : (i.value = "",
            u.value = "")
        }
        var o = this;
        o.$onInit = function() {
            o.ProjectServ = u;
            o.PageData = f;
            o.blobUrl = n.BlobStorageUrl;
            o.showColorNumber = r.Data.InstanceData.ShowColorNumber;
            o.shareLabel = r.Data.GetLanguageText("Review.Headline.Share", "Share:");
            o.HideSocial = r.Data.InstanceData.HideSocial;
            o.ChineseSocial = r.Data.InstanceData.ChineseSocial
        }
        ;
        o.openShareModal = function() {
            e.event({
                event: "gtm.click",
                t: "ux",
                d1: "shareEmail modal",
                d2: o.PageData.Data.CurrentStep
            });
            t.$broadcast("showShareModal", {
                image: o.ProjectServ.PaintedImage,
                type: "share"
            })
        }
        ;
        o.Share = function(n) {
            var t = document.getElementById("SocialShareForm"), u, r, i;
            e.event({
                event: "gtm.click",
                t: "shareProject",
                d1: n.toLowerCase(),
                d2: o.PageData.Data.CurrentStep
            });
            t.action = "/share/" + n;
            u = document.getElementById("SocialShareFormuploadPhoto");
            u.value = o.ProjectServ.PaintedImage;
            r = document.getElementById("SocialShareFormusedColors");
            n.toLowerCase() === "facebook" ? o.ProjectServ.Project.Instance === "seguret" ? window.location.href = "https://www.facebook.com/SeguretDecoration" : (s(t, "facebook"),
            i = o.getSharableColors(!0, 2)) : n.toLowerCase() === "pinterest" ? (s(t, "pinterest"),
            i = o.getSharableColors()) : n.toLowerCase() === "weibo" && (s(t, "weibo"),
            i = o.getSharableColors());
            r.value = JSON.stringify(i);
            t.appendChild(r);
            t.submit()
        }
        ;
        o.getSharableColors = function(n, t) {
            for (var e = [], f, s, o = 0; o < u.Project.AppliedColors.length; o++)
                if (f = r.Data.InstanceColors.GetColor({
                    ColorID: u.Project.AppliedColors[o].ColorID
                }),
                s = i("filter")(e, {
                    ColorID: f.ColorID
                }, !0),
                s.length === 0 && (e.push({
                    ColorID: f.ColorID,
                    Name: f.ColorName,
                    Number: f.ColorNumber,
                    Rgb: {
                        R: f.R,
                        G: f.G,
                        B: f.B
                    },
                    IsDark: f.IsDark,
                    Icon: f.DcpCSSColorImage
                }),
                n && e.length === t))
                    break;
            return e
        }
    }
    var n = angular.module("dcpLite");
    n.directive("moveweibo", ["$document", "$timeout", "$interval", function(n, t, i) {
        function r(t) {
            var r, u;
            t.chinesesocial && (r = document.createElement("wb:share-button"),
            r.setAttribute("appkey", "4210525423"),
            r.setAttribute("addition", "simple"),
            r.setAttribute("type", "button"),
            r.setAttribute("id", "WeiboShareButton"),
            u = i(function() {
                var f = n[0].getElementById("SocialWeibo"), t, e;
                f && (f.insertBefore(r, n[0].getElementById("WeiboShareList")),
                t = document.createElement("iframe"),
                t.id = "WeiboIframe",
                t.width = "65",
                t.height = "25",
                t.setAttribute("frameborder", "0"),
                t.scrolling = "no",
                t.setAttribute("marginheight", "0"),
                e = '<head><meta http-equiv="Content-Type"content="text/html; charset=utf-8"><link rel="stylesheet" type="text/css" href="https://img.t.sinajs.cn/t4/appstyle/widget/css/shareButton/shareButton_v2.css?ver=201308281655"><\/head><body style="margin:0;padding:0" marginheight="0"><script type="text/javascript" src="https://tjs.sjs.sinajs.cn/open/widget/js/share/shareBtn.js?version=201308281655"><\/script><\/body>',
                r.appendChild(t),
                t.contentWindow.document.open(),
                t.contentWindow.document.write(e),
                t.contentWindow.document.close(),
                i.cancel(u))
            }, 100))
        }
        return {
            link: r,
            restrict: "EA",
            scope: {
                chinesesocial: "=moveweibo"
            },
            controller: [function() {}
            ]
        }
    }
    ]);
    n.component("socialShares", {
        templateUrl: "/Versions/Shared/Views/Components/Controls/SocialShares.html",
        controllerAs: "model",
        controller: ["$rootScope", "$filter", "dsl", "projectService", "pageData", "gtmDataLayer", "$timeout", t]
    })
}(),
function() {
    "use strict";
    function t(n) {
        var t = this;
        t.RedirectHome = function() {
            n.path(t.backurl)
        }
        ;
        t.cssClass = function() {
            return t.text && t.text != "" ? "HasText" : ""
        }
        ;
        t.GetStripeClass = function(n) {
            return "columns count-" + n.length
        }
    }
    var n = angular.module("dcpLite");
    n.component("tile", {
        templateUrl: "/Versions/Shared/Views/Components/Controls/Tile.html",
        bindings: {
            divclass: "@",
            lazysrc: "@",
            lazyalt: "@",
            text: "@",
            topcolors: "<",
            bottomcolors: "<",
            swatchGtmType: "<",
            swatchGtmFrom: "<"
        },
        controllerAs: "model",
        controller: ["$location", "$rootScope", "projectService", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o, s) {
        var h = this, c;
        h.Loc = u;
        c = u.path().split("/");
        h.LastColorPage = n.LastColorPage;
        h.LastColorPage.Path = u.path();
        h.LastColorPage.ColorSearched = "";
        h.ColumnCount = 0;
        var a = r("filter")(t.Data.InstanceData.Routes.Items, {
            NavKey: "paint",
            Template: "<paint-photo><\/paint-photo>"
        }, function(t, i) {
            return n.LowerCaseCompare(t, i)
        })[0]
          , v = r("filter")(t.Data.InstanceData.Routes.Items, {
            NavKey: "paint",
            Template: "<stock-photo><\/stock-photo>"
        }, function(t, i) {
            return n.LowerCaseCompare(t, i)
        })[0]
          , l = r("filter")(t.Data.InstanceData.Routes.Items, {
            NavKey: "color",
            Template: "<colors><\/colors>"
        }, function(t, i) {
            return n.LowerCaseCompare(t, i)
        })[0];
        h.eventData = ["paintProject", "paintProject", "", "", 3];
        h.$onInit = function() {
            var p, u, w, a, v, b, o, e, y, k;
            if (s.Data.CurrentStep = 2,
            p = !1,
            i.Name !== null && (u = r("filter")(t.Data.ColorCollections.Items, {
                Route: "/" + c[1] + "/" + c[2] + "/:Name",
                CollectionName: i.Name.replace("%2F", "/")
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            }),
            u.length)) {
                for (h.TabID = u[0].TabID,
                p = !0,
                h.collectionName = u[0].CollectionName,
                h.Colors = [],
                h.Images = [],
                e = 0; e < u[0].Images.Items.length; e++) {
                    w = [];
                    for (a in u[0].Images.Items[e])
                        a.match("ImageColor") && u[0].Images.Items[e][a] > 0 && w.push(u[0].Images.Items[e][a]);
                    h.Images.push({
                        URL: u[0].Images.Items[e].ImageUrl,
                        Colors: w,
                        DisplayOrder: u[0].Images.Items[e].DisplayOrder
                    })
                }
                for (v = t.Data.InstanceData.MaxNumberOfShades,
                u[0].NumberOfShades && u[0].NumberOfShades > 0 && (v = u[0].NumberOfShades),
                h.ColumnCount = v,
                h.ColorPerRow = "columns count-" + v,
                h.Images.length > 0 ? h.samplePhotosText = t.Data.GetLanguageText("ColorCollection.samplePhotosText", "Check Out These Colors In Use") : h.Images = null,
                b = [],
                e = 0; e < u[0].Colors.Items.length; e++)
                    o = u[0].Colors.Items[e],
                    b[o.ColorID] === undefined && (b[o.ColorID] = o.ColorID,
                    h.Colors.push(o.ColorID));
                y = r("filter")(t.Data.InstanceData.ColorSelectionTabs.Items, {
                    TabID: h.TabID
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                });
                y.length && (k = y[0].Route,
                y[0].Route == h.Loc.path() && (k = l.RouteName),
                h.text = {
                    headline: {
                        header: t.Data.GetLanguageText("ColorCollection.PageTitle", "{CollectionName}").replace("{CollectionName}", h.collectionName)
                    },
                    backlink: {
                        text: t.Data.GetLanguageText("ColorCollection.BackButtonLabel", "Back to Curated Palettes"),
                        url: k
                    }
                })
            }
            p || h.Loc.path("notfound").replace();
            h.SetupMyColors();
            f.$broadcast("waitEnd")
        }
        ;
        h.GetColor = function(n) {
            return "rgb(" + n.R + "," + n.G + "," + n.B + ")"
        }
        ;
        h.SetupMyColors = function() {
            h.myColors = o.Project.Colors;
            h.selectedColorId = o.selectedColorId();
            h.selectedColorName = o.selectedColorName(h.selectedColorId)
        }
    }
    var n = angular.module("dcpLite");
    n.component("colorCollection", {
        templateUrl: "/Versions/Shared/Views/Components/Routes/ColorCollection.html",
        controllerAs: "model",
        controller: ["dsl", "$routeParams", "$filter", "$location", "$rootScope", "$scope", "projectService", "pageData", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o) {
        var s, c, h;
        o.Data.CurrentStep = 2;
        s = this;
        c = -1;
        s.Loc = r;
        h = r.path().split("/");
        s.LastColorPage = n.LastColorPage;
        s.LastColorPage.Path = r.path();
        s.LastColorPage.ColorSearched = "";
        var a = i("filter")(t.Data.InstanceData.Routes.Items, {
            NavKey: "paint",
            Template: "<paint-photo><\/paint-photo>"
        }, function(t, i) {
            return n.LowerCaseCompare(t, i)
        })[0]
          , v = i("filter")(t.Data.InstanceData.Routes.Items, {
            NavKey: "paint",
            Template: "<stock-photo><\/stock-photo>"
        }, function(t, i) {
            return n.LowerCaseCompare(t, i)
        })[0]
          , l = i("filter")(t.Data.InstanceData.Routes.Items, {
            NavKey: "color"
        }, function(t, i) {
            return n.LowerCaseCompare(t, i)
        });
        s.text = {
            headline: {
                header: t.Data.GetLanguageText("ColorCollections.PageTitle", "View Curated Palettes")
            },
            backlink: {
                text: t.Data.GetLanguageText("ColorCollections.BackButtonLabel", "Explore Different Colors"),
                url: l[0].RouteName
            }
        };
        s.$onInit = function() {
            var a = i("filter")(t.Data.InstanceData.ColorSelectionTabs.Items, {
                Route: "/" + h[1] + "/" + h[2]
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            }), c, u, l, o, e, v;
            if (a.length)
                if (s.TabID = a[0].TabID,
                n.LastCollectionPathSelected[s.TabID] === undefined || n.LastCollectionPathSelected[s.TabID] === null) {
                    if (c = i("filter")(t.Data.ColorCollections.Items, {
                        TabID: s.TabID
                    }, function(t, i) {
                        return n.LowerCaseCompare(t, i)
                    }),
                    c.length)
                        for (s.Collections = c,
                        u = 0; u < s.Collections.length; u++)
                            for (s.Collections[u].top5Colors = [],
                            l = Object.keys(s.Collections[u].ColorCollectionColors),
                            o = 0; o < l.length; o++)
                                e = t.Data.InstanceColors.GetColor({
                                    ColorID: s.Collections[u].ColorCollectionColors[l[o]]
                                }),
                                e != null && (v = "rgb(" + e.R + "," + e.G + "," + e.B + ")",
                                s.Collections[u].top5Colors.push(v))
                } else
                    r.path(n.LastCollectionPathSelected[s.TabID]).replace();
            f.$broadcast("waitEnd")
        }
        ;
        s.AnyColorSelected = function() {
            return s.myColors.length > 0
        }
        ;
        s.Select = function(n) {
            r.path(n.Route.replace(":Name", n.CollectionName.replace("/", "%2F")));
            e.CustomPhotoUploading == !0 && f.$broadcast("waitStart")
        }
    }
    var n = angular.module("dcpLite");
    n.component("colorCollections", {
        templateUrl: "/Versions/Shared/Views/Components/Routes/ColorCollections.html",
        controllerAs: "model",
        controller: ["dsl", "$filter", "$location", "$scope", "$rootScope", "projectService", "pageData", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o) {
        var s, c, h;
        o.Data.CurrentStep = 2;
        s = this;
        c = -1;
        s.Loc = r;
        h = r.path().split("/");
        s.indexedGroups = [];
        s.LastColorPage = n.LastColorPage;
        s.LastColorPage.Path = r.path();
        s.LastColorPage.ColorSearched = "";
        var a = i("filter")(t.Data.InstanceData.Routes.Items, {
            NavKey: "paint",
            Template: "<paint-photo><\/paint-photo>"
        }, function(t, i) {
            return n.LowerCaseCompare(t, i)
        })[0]
          , v = i("filter")(t.Data.InstanceData.Routes.Items, {
            NavKey: "paint",
            Template: "<stock-photo><\/stock-photo>"
        }, function(t, i) {
            return n.LowerCaseCompare(t, i)
        })[0]
          , l = i("filter")(t.Data.InstanceData.Routes.Items, {
            NavKey: "color"
        }, function(t, i) {
            return n.LowerCaseCompare(t, i)
        });
        s.text = {
            headline: {
                header: t.Data.GetLanguageText("ColorCollections.PageTitle", "View Curated Palettes")
            },
            backlink: {
                text: t.Data.GetLanguageText("ColorCollections.BackButtonLabel", "Explore Different Colors"),
                url: l[0].RouteName
            }
        };
        s.$onInit = function() {
            var y = i("filter")(t.Data.InstanceData.ColorSelectionTabs.Items, {
                Route: "/" + h[1] + "/" + h[2]
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            }), u, e, c, l, v, a, o, p;
            if (y.length)
                if (s.TabID = y[0].TabID,
                n.LastCollectionPathSelected[s.TabID] === undefined || n.LastCollectionPathSelected[s.TabID] === null) {
                    if (u = i("filter")(t.Data.ColorCollections.Items, {
                        TabID: s.TabID
                    }, function(t, i) {
                        return n.LowerCaseCompare(t, i)
                    }),
                    u.length)
                        for (s.ParentNames = [],
                        e = 0; e < u.length; e++) {
                            for (c = s.indexedGroups.indexOf(u[e].Parent),
                            c == -1 && (l = {
                                Text: u[e].Parent,
                                Collections: []
                            },
                            s.indexedGroups.push(l.Text),
                            s.ParentNames.push(l),
                            c = s.indexedGroups.indexOf(l.Text)),
                            u[e].top5Colors = [],
                            v = Object.keys(u[e].ColorCollectionColors),
                            a = 0; a < v.length; a++)
                                o = t.Data.InstanceColors.GetColor({
                                    ColorID: u[e].ColorCollectionColors[v[a]]
                                }),
                                o != null && (p = "rgb(" + o.R + "," + o.G + "," + o.B + ")",
                                u[e].top5Colors.push(p));
                            s.ParentNames[c].Collections.push(u[e])
                        }
                } else
                    r.path(n.LastCollectionPathSelected[s.TabID]).replace();
            f.$broadcast("waitEnd")
        }
        ;
        s.AnyColorSelected = function() {
            return s.myColors.length > 0
        }
        ;
        s.Select = function(n) {
            r.path(n.Route.replace(":Name", n.CollectionName))
        }
    }
    var n = angular.module("dcpLite");
    n.component("colorCollectionsShowParent", {
        templateUrl: "/Versions/Shared/Views/Components/Routes/ColorCollectionsShowParent.html",
        controllerAs: "model",
        controller: ["dsl", "$filter", "$location", "$scope", "$rootScope", "projectService", "pageData", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o, s, h, c) {
        c.Data.CurrentStep = 2;
        var l = this
          , v = i.path().split("/")
          , a = null;
        l.currentTab = {};
        l.$onInit = function() {
            var o = !1, b = h("filter")(t.Data.InstanceData.Routes.Items, {
                NavKey: "paint",
                Template: "<paint-photo><\/paint-photo>"
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            })[0], k = h("filter")(t.Data.InstanceData.Routes.Items, {
                NavKey: "paint",
                Template: "<stock-photo><\/stock-photo>"
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            })[0], c = "", e, y, u, p, w;
            if (v[2].toLowerCase() != "colorfamilies" && (c = v[2].toLowerCase() == "thehomedepot" ? "The Home Depot" : v[2]),
            l.LastColorPage = n.LastColorPage,
            l.LastColorPage.Path = i.path(),
            l.LastColorPage.ColorSearched = "",
            r.Name !== null && (e = h("filter")(t.Data.ColorCollections.Items, {
                Route: "/" + v[1] + "/" + v[2] + "/:Name"
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            }),
            e.length)) {
                if (o = !0,
                y = h("filter")(t.Data.InstanceData.Routes.Items, {
                    NavKey: "color"
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                }),
                l.Collections = e,
                a = l.Collections[0],
                r.Name !== undefined)
                    for (u = 0; u < l.Collections.length; u++)
                        if (l.Collections[u].CollectionName.toLowerCase() === r.Name.toLowerCase()) {
                            a = l.Collections[u];
                            break
                        }
                l.currentTab = h("filter")(t.Data.InstanceData.ColorSelectionTabs.Items, {
                    TabID: a.TabID
                })[0];
                l.collectionName = a.CollectionName;
                l.text = {
                    headline: {
                        header: t.Data.GetLanguageText("ColorFamilies.Headline.Header", "Browse {retailer} Paint Colors").replace("{retailer}", c),
                        subheader: a.CollectionName
                    },
                    backlink: {
                        text: t.Data.GetLanguageText("ColorFamilies.BackButton.Text", "Explore Different Colors"),
                        url: y[0].RouteName
                    },
                    actions: {
                        nextStep: t.Data.GetLanguageText("ColorFamilies.Actions.NextStep", "Paint Your Project"),
                        nextStepUrl: s.Project.StockID ? k.RouteName : b.RouteName,
                        nextStepNavId: "paint"
                    }
                };
                l.loadData()
            }
            o || i.path("notfound").replace();
            s.Project.id == null ? (s.NewProject(null),
            s.Project.StockID = t.Data.InstanceData.DefaultStockPhotoID,
            p = function(n) {
                s.SetSaveProjectResult(n.data);
                f.$broadcast("waitEnd")
            }
            ,
            w = function() {}
            ,
            s.SaveProject(p, w)) : f.$broadcast("waitEnd")
        }
        ;
        l.loadData = function() {
            var r = "", n = -1, u = t.Data.InstanceData.MaxNumberOfShades, i;
            for (a.NumberOfShades && a.NumberOfShades > 0 && (u = a.NumberOfShades),
            l.Colors = [],
            i = 0; i < a.Colors.Items.length; i++)
                n == -1 || r != a.Colors.Items[i].ColorCard ? (n++,
                l.Colors.push([])) : n >= 0 && l.Colors[n].length == u && (n++,
                l.Colors.push([])),
                l.Colors[n].push(a.Colors.Items[i].ColorID),
                r = a.Colors.Items[i].ColorCard;
            f.$broadcast("waitEnd")
        }
        ;
        l.GetStripeClass = function(n) {
            return "columns count-" + n.length
        }
        ;
        l.GetDisplayAs = function(n) {
            var t = "";
            return n.substring(0, 4) === "rgb:" && (t = "rgb(" + n.replace("rgb:", "") + ")"),
            t
        }
        ;
        l.GetIsDarkCss = function(n) {
            var t = "", i;
            return n.DisplayAs.substring(0, 4) === "rgb:" && (t = n.DisplayAs.replace("rgb:", ""),
            i = t.split(","),
            t = IsDark(i[0], i[1], i[2]) ? "isDark" : ""),
            n.CollectionName === a.CollectionName && (t += " isSelected"),
            t
        }
        ;
        l.GoToFamily = function(r) {
            var u = h("filter")(t.Data.ColorCollections.Items, {
                Route: "/" + v[1] + "/" + v[2] + "/:Name",
                CollectionName: r
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            });
            i.path(u[0].Route.replace(":Name", r));
            l.LastColorPage.Path = i.path()
        }
    }
    var n = angular.module("dcpLite");
    n.component("colorFamilies", {
        templateUrl: "/Versions/Shared/Views/Components/Routes/ColorFamilies.html",
        controllerAs: "model",
        controller: ["dsl", "$location", "$routeParams", "$scope", "$rootScope", "$timeout", "gtmDataLayer", "projectService", "$filter", "pageData", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e) {
        var o = this;
        o.$onInit = function() {
            if (f.Data.CurrentStep = 2,
            o.Tabs = angular.copy(t.Data.InstanceData.ColorSelectionTabs.Items),
            o.LastColorPage = n.LastColorPage,
            o.LastColorPage.Path = i.path(),
            o.LastColorPage.ColorSearched = "",
            o.text = {
                headline: {
                    header: t.Data.GetLanguageText("Colors.Headline.PageTitle", "Find Colors for Your Photo")
                },
                backlink: {
                    text: t.Data.GetLanguageText("Colors.BackButtonLabel", "Select a Different Photo"),
                    url: "/"
                }
            },
            e.Project.id == null) {
                if (e.CustomPhotoUploading == !1) {
                    e.NewProject(null);
                    e.Project.StockID = t.Data.InstanceData.DefaultStockPhotoID;
                    var u = function(n) {
                        e.SetSaveProjectResult(n.data);
                        r.$broadcast("waitEnd")
                    }
                      , s = function() {};
                    e.SaveProject(u, s)
                }
            } else
                r.$broadcast("waitEnd")
        }
        ;
        o.Select = function(n) {
            var t = i.search();
            (t.projectid == null || t.projectid != e.Project.id) && (r.$broadcast("waitStart"),
            i.search("projectid", e.Project.id));
            i.path(n)
        }
    }
    var n = angular.module("dcpLite");
    n.component("colors", {
        templateUrl: "/Versions/Shared/Views/Components/Routes/Colors.html",
        controllerAs: "model",
        controller: ["dsl", "$location", "$rootScope", "gtmDataLayer", "pageData", "projectService", t]
    })
}(),
function() {
    "use strict";
    var n = angular.module("dcpLite");
    n.component("createStockProject", {
        controllerAs: "tapModel",
        controller: ["$rootScope", "$location", "dsl", "$routeParams", "gtmDataLayer", "projectService", "$scope", "$compile", "$timeout", "pageData", function(n, t, i, r, u, f, e, o, s, h) {
            var c = this;
            e.showTapFooter = !0;
            c.createProject = function() {
                var l, s, o, n, e, v, y;
                if (f.NewProject(null),
                f.Project.StockID = i.Data.InstanceData.DefaultStockPhotoID,
                f.Project.Colors = [],
                l = i.Data.InstanceData.StripColorNumber,
                typeof String.prototype.trimEnd != "function" && (String.prototype.trimEnd = function() {
                    return this.replace(/^\s+|\s+$/g, "")
                }
                ),
                r.ColorId != undefined) {
                    var a = decodeURIComponent(r.ColorId)
                      , n = i.Data.InstanceColors.Colors.Items.filter(function(n) {
                        if (l) {
                            var t = n.ColorNumber.replace(/[^0-9a-zA-Z\.\/\_\\\-\s]/g, "").trimEnd();
                            return t.toLowerCase() == a.toLowerCase()
                        }
                        return n.ColorNumber.toLowerCase() == a.toLowerCase()
                    })[0]
                      , e = -1;
                    n && (e = f.Project.Colors.indexOf(n.ColorID));
                    n && e < 0 && (f.Project.ColorList.push(n.ColorID),
                    f.Project.AppliedColors.push({
                        ColorId: n.ColorID,
                        SurfaceNumber: i.Data.InstanceData.DefaultSurfaceID
                    }),
                    f.Project.Colors.push(n.ColorID),
                    u.event({
                        event: "addFromWebsite",
                        t: "addColor",
                        d1: "website",
                        d2: n.gtmName
                    }))
                } else if (t.search().colorslist)
                    for (f.Project.ColorList = [],
                    s = t.search().colorslist.split(","),
                    o = 0; o < s.length; o++)
                        n = i.Data.InstanceColors.Colors.Items.filter(function(n) {
                            if (l) {
                                var t = n.ColorNumber.replace(/[^0-9a-zA-Z\.\/\_\\\-\s]/g, "").trimEnd();
                                return t.toLowerCase() == decodeURIComponent(s[o]).toLowerCase()
                            }
                            return n.ColorNumber.toLowerCase() == decodeURIComponent(s[o]).toLowerCase()
                        })[0],
                        e = f.Project.Colors.indexOf(n.ColorID),
                        n && e < 0 && (f.Project.Colors.push(n.ColorID),
                        f.Project.ColorList.push(n.ColorID),
                        u.event({
                            event: "addFromWebsite",
                            d1: "addColor",
                            d2: "website",
                            d3: n.gtmName
                        }));
                c.PageData = h;
                c.PageData.isCreateStockProject || (c.PageData.isCreateStockProject = !0);
                v = function(n) {
                    f.SetSaveProjectResult(n.data);
                    t.path("/StockPhoto")
                }
                ;
                y = function() {
                    t.path("/")
                }
                ;
                f.SaveProject(v, y)
            }
            ;
            c.createProject()
        }
        ]
    })
}(),
function() {
    "use strict";
    function t(n, t, i, r, u, f, e, o, s, h, c) {
        var l = this;
        l.text = {
            headline: {
                header: n.Data.GetLanguageText("Home.Headline.Header", "Select a Photo to Virtually Paint"),
                uploadPhoto: n.Data.GetLanguageText("Home.Headline.UploadPhoto", "Upload Your Own Photo")
            },
            instructions: {
                header: n.Data.GetLanguageText("Home.Instructions.Header", "Explore Our Paintable Photos"),
                uploadPhoto: n.Data.GetLanguageText("Home.Instructions.UploadPhoto", "Make your project come alive with a photo of your own home."),
                or: n.Data.GetLanguageText("Home.Instructions.Or", "OR")
            }
        };
        l.$onInit = function() {
            var r, i, t, f;
            for (h.Data.CurrentStep = 1,
            h.Data.CarryColor = !1,
            o.LoadColorList("addColor"),
            l.orImg = _BlobStorageUrl + "dcpcoreassets/AllInstances/orImg.png",
            r = [],
            i = 0; i < n.Data.StockImages.Rooms.Items.length; i++)
                n.Data.StockImages.Rooms.Items[i].Photos.Items.length > 0 && (t = angular.copy(n.Data.StockImages.Rooms.Items[i]),
                t.Name = n.Data.GetLanguageText("room." + t.Name.toLowerCase() + "s", t.Name),
                t.ImageUrl = t.Photos.Items[0].ThumbUrl,
                r.push(t));
            l.Rooms = r;
            f = document.getElementById("headerMenu");
            f && (f.style.height = c.innerWidth < 750 ? "55px" : "70px");
            u.$broadcast("waitEnd")
        }
        ;
        l.UploadPhoto = function() {
            t.path("UploadPhoto")
        }
        ;
        l.Select = function(n) {
            t.path("SelectPhoto/" + n)
        }
    }
    var n = angular.module("dcpLite");
    n.component("home", {
        templateUrl: "/Versions/Shared/Views/Components/Routes/Home.html",
        controllerAs: "model",
        controller: ["dsl", "$location", "$routeParams", "$scope", "$rootScope", "$timeout", "gtmDataLayer", "projectService", "$filter", "pageData", "$window", t]
    })
}(),
function() {
    "use strict";
    function t(n, t, i, r, u, f, e, o, s, h) {
        var c = this;
        c.$onInit = function() {
            h.Data.CurrentStep = 1;
            c.text = {
                headline: {
                    header: n.Data.GetLanguageText("NotFound.Title", "Oops") + " - " + n.Data.GetLanguageText("NotFound.Description", "Looks like this page doesn't exist.")
                },
                backlink: {
                    text: n.Data.GetLanguageText("NotFound.Button", "Visualize your paint colors online."),
                    url: "/"
                }
            };
            c.ProjectID = o.Project && o.Project.id ? o.Project.id : "";
            u.$broadcast("waitEnd")
        }
        ;
        c.ReturnHome = function() {
            e.event({
                event: "gtm.click",
                t: "error",
                d1: "missingRoute",
                d2: c.ProjectID
            });
            t.search("projectid", null);
            t.path("/");
            u.$broadcast("newProject")
        }
    }
    var n = angular.module("dcpLite");
    n.component("missingRoute", {
        templateUrl: "/Versions/Shared/Views/Components/Routes/MissingRoute.html",
        controllerAs: "model",
        controller: ["dsl", "$location", "$routeParams", "$scope", "$rootScope", "$timeout", "gtmDataLayer", "projectService", "$filter", "pageData", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o, s, h, c, l, a, v, y, p) {
        function tt(i) {
            var e, f, o, r, u;
            for (w.IsRestoring = !0,
            angular.equals(n.ChangeHistory[i].Project.FakeEdges, v.Project.FakeEdges) && angular.equals(n.ChangeHistory[i].Project.ExcludeMarkers, v.Project.ExcludeMarkers) && it(n.ChangeHistory[i].Project.IncludedMarkers, v.Project.IncludedMarkers) ? (v.Project = angular.copy(n.ChangeHistory[i].Project),
            t.RemapColorsToSurfaces(),
            t.DrawImage(w.CanvasData.Canvas),
            w.CanvasData.ResizeOverlay(),
            v.SaveProject(k, d),
            w.IsRestoring = !1) : (document.body.style.cursor = "wait",
            v.Project = angular.copy(n.ChangeHistory[i].Project),
            b()),
            e = 1,
            w.IncludedMarkers = angular.copy(v.Project.IncludedMarkers),
            f = 0; f < w.IncludedMarkers.length; f++)
                w.IncludedMarkers[f].Markers.map(function(n) {
                    n.Id = e;
                    e++
                });
            for (w.CurrentTool = n.ChangeHistory[i].Tool,
            w.isEdit = n.ChangeHistory[i].IsEdit,
            o = 1,
            w.FakeEdges = angular.copy(v.Project.FakeEdges),
            r = 0; r < w.FakeEdges.length; r++)
                for (u = 0; u < w.FakeEdges[r].Points.length; u++)
                    w.FakeEdges[r].Points[u].Id = o,
                    w.FakeEdges[r].Points[u].Active = !1,
                    o++;
            w.Markers = w.getMarkers()
        }
        function it(n, t) {
            if (n.length !== t.length)
                return !1;
            for (var i = 0; i < n.length; i++)
                if (!angular.equals(n[i].Markers, t[i].Markers))
                    return !1;
            return !0
        }
        function rt() {
            var o = w.PageData.Data.SelectedColor, i, h, y, p, u, c, tt, n, it;
            if (w.editTouched = !0,
            w.CurrentTool === w.Tool.ChangeEdges && w.isEdit) {
                for (w.numEditClicks++,
                h = 0,
                n = 0; n < w.FakeEdges.length; n++)
                    for (u = 0; u < w.FakeEdges[n].Points.length; u++)
                        w.FakeEdges[n].Points[u].Id > h && (h = w.FakeEdges[n].Points[u].Id);
                if (h++,
                w.previousClick == null)
                    w.FakeEdges.push({
                        Points: [{
                            Id: h,
                            X: w.CanvasData.X,
                            Y: w.CanvasData.Y,
                            Active: !0
                        }],
                        ClosedPolygon: !1
                    }),
                    w.previousClick = {
                        i: w.FakeEdges.length - 1,
                        j: w.FakeEdges[w.FakeEdges.length - 1].Points.length,
                        Id: h
                    },
                    f.$broadcast("updateLines");
                else {
                    for (n = 0; n < w.FakeEdges.length; n++)
                        for (u = 0; u < w.FakeEdges[n].Points.length; u++)
                            if (ClosePoints(w.CanvasData.X, w.CanvasData.Y, w.FakeEdges[n].Points[u].X, w.FakeEdges[n].Points[u].Y, 10) && (u === 0 || u === w.FakeEdges[n].Points.length - 1)) {
                                if (w.previousClick.i !== n) {
                                    y = angular.copy(w.FakeEdges[n].Points);
                                    u === 0 && (y = y.reverse());
                                    p = angular.copy(w.FakeEdges[w.previousClick.i].Points);
                                    w.previousClick.j !== 0 && (p = p.reverse());
                                    w.FakeEdges.push({
                                        Points: y.concat(p)
                                    });
                                    n > w.previousClick.i ? (w.FakeEdges.splice(n, 1),
                                    w.FakeEdges.splice(w.previousClick.i, 1)) : (w.FakeEdges.splice(w.previousClick.i, 1),
                                    w.FakeEdges.splice(n, 1));
                                    w.FakeEdges[w.FakeEdges.length - 1].Points.map(function(n) {
                                        n.Active = !1
                                    });
                                    f.$broadcast("updateLines");
                                    w.previousClick = null;
                                    return
                                }
                                w.FakeEdges[n].ClosedPolygon = !0;
                                w.FakeEdges[n].Points.map(function(n) {
                                    n.Active = !1
                                });
                                f.$broadcast("updateLines");
                                w.previousClick = null;
                                return
                            }
                    for (w.FakeEdges[w.previousClick.i].Points.splice(w.previousClick.j === 0 ? 0 : w.previousClick.j + 1, 0, {
                        Id: h,
                        X: w.CanvasData.X,
                        Y: w.CanvasData.Y,
                        Active: !1
                    }),
                    n = 0; n < w.FakeEdges.length; n++)
                        for (u = 0; u < w.FakeEdges[n].Points.length; u++)
                            w.FakeEdges[n].Points[u].Active = !1;
                    f.$broadcast("updateLines");
                    w.previousClick = null
                }
                for (w.numMarkers = 0,
                n = 0; n < w.FakeEdges.length; n++)
                    w.numMarkers += w.FakeEdges[n].Points.length;
                a.event({
                    event: "gtm.click",
                    t: "ux",
                    d1: "paintTool",
                    d2: "add edit marker"
                });
                a.event({
                    event: "paintTool",
                    t: "paintTool",
                    d1: "add edit marker",
                    d2: "edit clicks: " + w.numEditClicks
                });
                a.event({
                    event: "paintTool",
                    t: "paintTool",
                    d1: "add edit marker",
                    d2: "markersIncluded: " + w.totalMarkers
                });
                a.event({
                    event: "paintTool",
                    t: "paintTool",
                    d1: "add edit marker",
                    d2: "linesCompleted: " + w.numLines
                });
                document.body.style.cursor = "auto"
            }
            if (w.isEdit === !1) {
                for (document.body.style.cursor = "wait",
                c = null,
                i = 0; i < t.Data.DcpImage.Masks.length; i++)
                    if (tt = t.Data.DcpImage.Masks[i],
                    tt.MaskData !== null && (n = (w.CanvasData.Canvas.width * w.CanvasData.Y + w.CanvasData.X) * 4,
                    tt.MaskData.ImageData.data[n + 3] > 0)) {
                        c = tt;
                        break
                    }
                if (c === null) {
                    for (e.$broadcast("waitStart"),
                    document.body.style.cursor = "wait",
                    it = !1,
                    i = 0; i < v.Project.IncludedMarkers.length; i++)
                        if (v.Project.IncludedMarkers[i].ColorID === o.ColorID) {
                            v.Project.IncludedMarkers[i].Markers.push(new nt(w.CanvasData.X,w.CanvasData.Y));
                            it = !0;
                            break
                        }
                    it || v.Project.IncludedMarkers.push({
                        ColorID: o.ColorID,
                        Markers: [new nt(w.CanvasData.X,w.CanvasData.Y)]
                    });
                    b();
                    w.setCounts();
                    a.event({
                        event: "gtm.click",
                        t: "paintWall",
                        d1: "userPhoto",
                        d2: o.gtmName
                    });
                    a.event({
                        event: "paintTool",
                        t: "paintTool",
                        d1: "userPhoto",
                        d2: "fakeEdgePoints: " + w.totalFakeEdges
                    });
                    a.event({
                        event: "paintTool",
                        t: "paintTool",
                        d1: "userPhoto",
                        d2: "markersIncluded: " + w.totalMarkers
                    })
                } else if (c.Color.ColorID !== o.ColorID) {
                    var s = null
                      , rt = -1
                      , l = null;
                    for (i = 0; i < v.Project.IncludedMarkers.length; i++)
                        if (v.Project.IncludedMarkers[i].ColorID === c.Color.ColorID && (s = v.Project.IncludedMarkers[i],
                        rt = i),
                        v.Project.IncludedMarkers[i].ColorID === o.ColorID && (l = v.Project.IncludedMarkers[i]),
                        s !== null && l !== null)
                            break;
                    if (l === null && s === null)
                        v.Project.IncludedMarkers.push({
                            ColorID: o.ColorID,
                            Markers: [new nt(w.CanvasData.X,w.CanvasData.Y)]
                        }),
                        b();
                    else if (l === null && s !== null) {
                        for (c.Color = o,
                        i = 0; i < v.Project.AppliedColors.length; i++)
                            v.Project.AppliedColors[i].ColorID === s.ColorID && (v.Project.AppliedColors[i].ColorID = o.ColorID);
                        s.ColorID = o.ColorID;
                        t.RemapColorsToSurfaces();
                        t.DrawImage(w.CanvasData.Canvas);
                        w.CanvasData.ResizeOverlay();
                        v.SaveProject(k, d);
                        g();
                        document.body.style.cursor = "auto"
                    } else if (l !== null && s !== null && rt > -1) {
                        for (i = 0; i < s.Markers.length; i++)
                            l.Markers.push(new nt(s.Markers[i].Center.X,s.Markers[i].Center.Y));
                        v.Project.IncludedMarkers.splice(rt, 1);
                        b()
                    } else
                        r.path("/PaintPhoto"),
                        document.body.style.cursor = "auto";
                    a.event({
                        event: "gtm.click",
                        t: "paintWall",
                        d1: "userPhoto",
                        d2: o.gtmName
                    });
                    a.event({
                        event: "paintTool",
                        t: "paintTool",
                        d1: "userPhoto",
                        d2: "fakeEdgePoints: " + w.totalFakeEdges
                    });
                    a.event({
                        event: "paintTool",
                        t: "paintTool",
                        d1: "userPhoto",
                        d2: "markersIncluded: " + w.totalMarkers
                    })
                } else
                    document.body.style.cursor = "auto"
            }
        }
        function g() {
            if (w.IsRestoring === !1) {
                var t = {
                    Project: angular.copy(v.Project),
                    IsEdit: w.isEdit,
                    Tool: w.CurrentTool
                };
                n.ChangeHistory.length > n.MaxChanges && (n.ChangeHistory.splice(0, 1),
                n.CurrentChangeIndex--);
                n.ChangeHistory.length > 0 ? n.ChangeHistory.splice(n.CurrentChangeIndex + 1, n.ChangeHistory.length - n.CurrentChangeIndex, t) : n.ChangeHistory.push(t);
                n.CurrentChangeIndex++
            }
        }
        function nt(n, t) {
            return {
                Diameter: 5,
                Center: new Point(n,t)
            }
        }
        function b() {
            e.$broadcast("waitStart");
            document.body.style.cursor = "wait";
            var n = function(n) {
                v.SetSaveProjectResult(n.data);
                t.ReloadCustomImages()
            }
              , i = function(n) {
                console.log("GenerateMasks error response", n)
            };
            v.SegmentProject(n, i)
        }
        function ut() {
            document.body.style.cursor = "wait";
            v.Project.CurrentFile !== null && v.Project.AppliedColors.length > 0 && t.LoadDcpImages();
            v.Project.CurrentFile === null && (v.Project.AppliedColors.length > 0 ? (w.setCounts(),
            a.event({
                event: "DevFeedback",
                t: "DevFeedback",
                d1: "project loaded no files",
                d2: "markersIncluded: " + w.totalMarkers
            }),
            a.event({
                event: "DevFeedback",
                t: "DevFeedback",
                d1: "project loaded no files",
                d2: "fakeEdgePoints: " + w.totalFakeEdges
            }),
            b()) : t.LoadDcpImages())
        }
        function ft(n) {
            var t = n.getBoundingClientRect();
            return t.top >= 0 && t.bottom <= window.innerHeight
        }
        var w = this, k, d;
        w.totalMarkers = 0;
        w.totalFakeEdges = 0;
        k = function(n) {
            v.SetSaveProjectResult(n.data)
        }
        ;
        d = function(n) {
            console.log(n)
        }
        ;
        f.$watch(function() {
            return t.Data.IsLoading
        }, function(n, i) {
            n === !1 && i === !0 && (t.RemapColorsToSurfaces(),
            t.DrawImage(w.CanvasData.Canvas),
            w.CanvasData.ResizeOverlay(),
            g(),
            w.NotificationTitle = "",
            document.body.style.cursor = "auto",
            w.CanvasData.EnableSelection(),
            w.IsRestoring = !1,
            o(function() {
                e.$broadcast("waitEnd")
            }))
        });
        f.$watch(function() {
            return w.PageData.Data.LastDeletedColor
        }, function(n) {
            var r, i;
            if (n) {
                for (r = !1,
                i = 0; i < t.Data.DcpImage.Masks.length; i++)
                    if (t.Data.DcpImage.Masks[i].Color && t.Data.DcpImage.Masks[i].Color.ColorID === n.ColorID) {
                        r = !0;
                        break
                    }
                w.IncludedMarkers = angular.copy(v.Project.IncludedMarkers);
                w.Markers = w.getMarkers();
                r ? (e.$broadcast("waitStart"),
                document.body.style.cursor = "wait",
                b()) : g();
                w.PageData.Data.LastDeletedColor = null
            }
        });
        w.$onInit = function() {
            var f, o, s;
            e.$broadcast("waitStart");
            w.ProjectServ = v;
            p.Data.CurrentStep = 3;
            w.PageData = p;
            w.IsRestoring = !1;
            var h = y("filter")(i.Data.InstanceData.Routes.Items, {
                NavKey: "color"
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            })
              , t = i.Data.GetLanguageText("PaintPhoto.EraseTool.Instructions", "Click the {icon-format_color_reset} to erase the area.")
              , r = t.indexOf("{icon-")
              , u = t.indexOf("}");
            w.LastColorPage = n.LastColorPage;
            w.LastColorPage.Path == "" && (w.LastColorPage.Path = h[0].RouteName);
            w.text = {
                headline: {
                    header: i.Data.GetLanguageText("PaintPhoto.pageTitle", "Visualize Your Room"),
                    subheader: i.Data.GetLanguageText("PaintPhoto.pageSubtitle", "Click a wall to paint the selected color.")
                },
                backlink: {
                    text: i.Data.GetLanguageText("PaintPhoto.BackUrlLabel", "Find More Colors"),
                    url: w.LastColorPage.Path
                },
                tools: {
                    text: i.Data.GetLanguageText("HelpText.PreviewLabel", "Preview")
                },
                instructions: {
                    paint: i.Data.GetLanguageText("PaintPhoto.PaintTool.Instructions", "Click a wall to paint the selected color."),
                    edit: i.Data.GetLanguageText("PaintPhoto.MaskTool.Instructions", "Draw lines to mask areas."),
                    erasePreIcon: t.substring(0, r),
                    eraseIcon: t.substring(r + 1, u).replace("icon-", ""),
                    erasePostIcon: t.substring(u + 1)
                }
            };
            w.Tool = {
                AddSurface: 1,
                ChangeEdges: 2,
                RemoveMarker: 3
            };
            w.CurrentTool = w.Tool.AddSurface;
            w.isEdit = !1;
            n.ChangeHistory = [];
            n.CurrentChangeIndex = -1;
            w.isUploadPhoto = !0;
            w.editTouched = !1;
            w.helpLabel = i.Data.GetLanguageText("PaintPhoto.helpLabel", "Help");
            w.undoLabel = i.Data.GetLanguageText("PaintPhoto.undoLabel", "Undo");
            w.redoLabel = i.Data.GetLanguageText("PaintPhoto.redoLabel", "Redo");
            w.resetLabel = i.Data.GetLanguageText("PaintPhoto.resetLabel", "Reset");
            w.newPhotoLabel = i.Data.GetLanguageText("PaintPhoto.secondaryActionLabel", "Change Your Photo");
            w.paintPhotoLabel = i.Data.GetLanguageText("PaintPhoto.paintPhotoLabel", "Paint");
            w.changeEdgeLabel = i.Data.GetLanguageText("PaintPhoto.changeEdgeLabel", "Edit Area");
            w.removePointLabel = i.Data.GetLanguageText("PaintPhoto.removePointLabel", "Erase Area");
            w.MyColors = [];
            w.IncludedMarkers = [];
            w.markerBeingDragged = !1;
            w.FakeEdges = [];
            w.previousClick = null;
            w.Markers = [];
            w.numEditClicks = 0;
            w.numEraseClicks = 0;
            w.numLines = 0;
            w.numMarkers = 0;
            w.lineCount = 0;
            w.CanvasData = {
                Ratio: 1,
                CanvasBound: ut,
                Canvas: null,
                ShowZoom: !1,
                PixelSelected: rt,
                ImageContext: null,
                ShowOverlay: !0
            };
            f = document.getElementById("PaintPhotoImg");
            s = setInterval(function() {
                o = document.getElementById("ImageCanvas");
                o && (ft(f) || clearInterval(s))
            }, 100)
        }
        ;
        w.blobUrl = n.BlobStorageUrl;
        w.showColorNumber = i.Data.InstanceData.ShowColorNumber;
        w.NewPhoto = function() {
            r.path("/")
        }
        ;
        w.openShareModal = function() {
            e.$broadcast("showShareModal", {
                image: v.PaintedImage,
                type: "share"
            })
        }
        ;
        w.SetupTools = function() {
            var u = 1, n, t, r, i;
            for (w.FakeEdges = angular.copy(v.Project.FakeEdges),
            n = 0; n < w.FakeEdges.length; n++)
                for (t = 0; t < w.FakeEdges[n].Points.length; t++)
                    w.FakeEdges[n].Points[t].Id = u,
                    w.FakeEdges[n].Points[t].Active = !1,
                    u++;
            for (r = 1,
            w.IncludedMarkers = angular.copy(v.Project.IncludedMarkers),
            i = 0; i < w.IncludedMarkers.length; i++)
                w.IncludedMarkers[i].Markers.map(function(n) {
                    n.Id = r;
                    r++
                });
            w.editTouched = !1;
            w.Markers = w.getMarkers()
        }
        ;
        w.ChangeEdgesMode = function() {
            w.CurrentTool = w.Tool.ChangeEdges;
            w.isEdit = !0;
            w.CanvasData.ShowOverlay = !0;
            w.SetupTools();
            w.CanvasData.EnableSelection();
            f.$broadcast("updateLines");
            a.event({
                event: "gtm.click",
                t: "ux",
                d1: "paintToolTab",
                d2: "edit"
            })
        }
        ;
        w.Reset = function() {
            w.CurrentTool = w.Tool.AddSurface;
            t.ResetImage(w.CanvasData.Canvas);
            w.CanvasData.ResizeOverlay();
            v.ResetProject(null);
            v.SaveProject(k, d);
            w.IncludedMarkers = [];
            w.Markers = [];
            n.ChangeHistory = [];
            n.CurrentChangeIndex = -1;
            g();
            w.FakeEdges.length = 0;
            w.editTouched = !1;
            w.isEdit = !1;
            f.$broadcast("updateLines");
            w.previousClick = null;
            w.numLines = 0;
            a.event({
                event: "gtm.click",
                t: "ux",
                d1: "reset"
            })
        }
        ;
        w.UndoActive = function() {
            return n.CurrentChangeIndex <= 0
        }
        ;
        w.RedoActive = function() {
            return n.CurrentChangeIndex + 1 >= n.ChangeHistory.length
        }
        ;
        w.Undo = function() {
            if (w.UndoActive()) {
                alert(i.Data.GetLanguageText("StockPhoto.UnableUndo", "Unable to Undo!"));
                return
            }
            tt(n.CurrentChangeIndex - 1);
            n.CurrentChangeIndex--;
            a.event({
                event: "gtm.click",
                t: "ux",
                d1: "undo"
            })
        }
        ;
        w.Redo = function() {
            if (w.RedoActive()) {
                alert(i.Data.GetLanguageText("StockPhoto.UnableRedo", "Unable to Redo!"));
                return
            }
            tt(n.CurrentChangeIndex + 1);
            n.CurrentChangeIndex++;
            a.event({
                event: "gtm.click",
                t: "ux",
                d1: "redo"
            })
        }
        ;
        w.turnOffEditMode = function() {
            w.CanvasData.EnableSelection();
            w.IncludedMarkers = [];
            w.isEdit = !1;
            w.Markers = [];
            w.CanvasData.ShowOverlay = !0;
            w.CurrentTool = w.Tool.AddSurface;
            a.event({
                event: "gtm.click",
                t: "ux",
                d1: "paintToolTab",
                d2: "paint"
            })
        }
        ;
        w.RemoveMode = function() {
            w.CurrentTool = w.Tool.RemoveMarker;
            w.isEdit = !0;
            w.SetupTools();
            w.CanvasData.DisableSelection();
            w.CanvasData.ShowOverlay = !1;
            a.event({
                event: "gtm.click",
                t: "ux",
                d1: "paintToolTab",
                d2: "erase"
            })
        }
        ;
        w.getMarkers = function() {
            for (var r = [], t, n = 0; n < w.IncludedMarkers.length; n++)
                for (t = 0; t < w.IncludedMarkers[n].Markers.length; t++)
                    r.push({
                        Point: {
                            X: w.IncludedMarkers[n].Markers[t].Center.X,
                            Y: w.IncludedMarkers[n].Markers[t].Center.Y,
                            Id: w.IncludedMarkers[n].Markers[t].Id,
                            LastTouched: w.IncludedMarkers[n].Markers[t].Center.LastTouched
                        },
                        Color: i.Data.InstanceColors.Colors.Items.filter(function(t) {
                            return t.ColorID == w.IncludedMarkers[n].ColorID
                        })[0]
                    });
            return r
        }
        ;
        w.updatePreviousClick = function(n) {
            w.previousClick = angular.copy(n)
        }
        ;
        w.deleteMarker = function(n) {
            var t, i;
            for (e.$broadcast("waitStart"),
            w.numEraseClicks++,
            t = 0; t < w.IncludedMarkers.length; t++)
                for (i = 0; i < w.IncludedMarkers[t].Markers.length; i++)
                    w.IncludedMarkers[t].Markers[i].Id === n && w.IncludedMarkers[t].Markers.splice(i, 1);
            w.editTouched = !0;
            w.Markers = w.getMarkers();
            w.updateEditMode();
            w.CurrentTool = w.Tool.RemoveMarker;
            w.setCounts();
            a.event({
                event: "gtm.click",
                t: "ux",
                d1: "paintTool",
                d2: "erase area"
            });
            a.event({
                event: "paintTool",
                t: "paintTool",
                d1: "erase area",
                d2: "edit clicks: " + w.numEditClicks
            });
            a.event({
                event: "paintTool",
                t: "paintTool",
                d1: "erase area",
                d2: "markersIncluded: " + w.totalMarkers
            });
            a.event({
                event: "paintTool",
                t: "paintTool",
                d1: "erase area",
                d2: "linesCompleted: " + w.numLines
            })
        }
        ;
        w.updateEditMode = function() {
            e.$broadcast("waitStart");
            document.body.style.cursor = "wait";
            w.CanvasData.DisableSelection();
            v.Project.IncludedMarkers = angular.copy(w.IncludedMarkers);
            v.Project.FakeEdges = angular.copy(w.FakeEdges);
            b();
            w.editTouched = !1;
            w.numEditClicks++;
            w.numMarkers = 0;
            for (var n = 0; n < w.FakeEdges.length; n++)
                w.numMarkers += w.FakeEdges[n].Points.length;
            w.setCounts();
            a.event({
                event: "gtm.click",
                t: "ux",
                d1: "paintTool",
                d2: "preview changes"
            });
            a.event({
                event: "paintTool",
                t: "paintTool",
                d1: "preview changes",
                d2: "edit clicks: " + w.numEditClicks
            });
            a.event({
                event: "paintTool",
                t: "paintTool",
                d1: "preview changes",
                d2: "markersIncluded: " + w.totalMarkers
            });
            a.event({
                event: "paintTool",
                t: "paintTool",
                d1: "preview changes",
                d2: "fakeEdgePoints: " + w.totalFakeEdges
            })
        }
        ;
        w.setCounts = function() {
            var n;
            for (w.totalFakeEdges = 0,
            n = 0; n < v.Project.FakeEdges.length; n++)
                w.totalFakeEdges += v.Project.FakeEdges[n].ClosedPolygon === !0 ? v.Project.FakeEdges[n].Points.length : v.Project.FakeEdges[n].Points.length - 1;
            for (w.totalMarkers = 0,
            n = 0; n < v.Project.IncludedMarkers.length; n++)
                w.totalMarkers += v.Project.IncludedMarkers[n].Markers.length
        }
    }
    var n = angular.module("dcpLite");
    n.component("paintPhoto", {
        templateUrl: "/Versions/Shared/Views/Components/Routes/PaintPhoto.html",
        controllerAs: "model",
        controller: ["projectImages", "dsl", "$location", "$routeParams", "$scope", "$rootScope", "$timeout", "$interval", "$http", "$window", "$compile", "gtmDataLayer", "projectService", "$filter", "pageData", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o, s, h, c, l) {
        function y(n, i) {
            for (var e = [], l = null, r = 0, f = 0, p, w, d, v, o, g, c, u, r = 0; r < n.length; r++) {
                if (p = n[r],
                p === undefined)
                    break;
                if (w = !0,
                e.length !== 0)
                    for (f = 0; f < e.length; f++)
                        if (d = e[f],
                        l = CalculateCIE2000Deltas(p.lab, d.lab),
                        w = l.DeltaE > 25,
                        !w)
                            break;
                if (w && e.push(p),
                e.length === a.MaxColorCount)
                    break
            }
            for (n = null,
            v = t.Data.InstanceColors.Colors.Items.map(function(n, t) {
                return {
                    index: t,
                    colorID: n.ColorID,
                    used: !1
                }
            }),
            o = [],
            r = 0; r < e.length; r++) {
                var y = -1
                  , b = e[r]
                  , k = 999999999999;
                for (f = 0; f < v.length; f++)
                    if (g = v[f].index,
                    !v[f].used && (u = t.Data.InstanceColors.Colors.Items[g],
                    u !== null))
                        if (b.r === u.R && b.g === u.G && b.b === u.B) {
                            y = f;
                            k = 0;
                            break
                        } else
                            l = CalculateCIE2000Deltas(b.lab, u.LAB),
                            l.DeltaE <= k && (k = l.DeltaE,
                            y = f);
                y >= 0 && (c = angular.copy(t.Data.InstanceColors.Colors.Items[y]),
                c.DeltaE = k,
                o.length + a.Colors.length >= a.colorCount ? (c.splice = !0,
                o.splice(a.currentColorIndex, 1, c)) : (c.splice = !1,
                o.push(c)),
                v[y].used = !0)
            }
            for (r = 0; r < o.length; r++)
                u = t.Data.InstanceColors.Colors.Items.filter(function(n) {
                    return n.ColorID == o[r].ColorID
                })[0],
                u && (o[r].splice ? a.Colors.splice(a.currentColorIndex, 1, u) : a.Colors.push(u),
                u.InMyColors = ~s.Project.Colors.indexOf(u.ColorID) ? !0 : !1),
                i && h.event({
                    event: "gtm.click",
                    t: "ux",
                    d1: "colorMatch",
                    d2: "colorSelector"
                })
        }
        var a = this, v;
        a.Colors = [];
        a.PageData = l;
        a.ProjectServ = s;
        a.$onInit = function() {
            var r, u, e;
            l.Data.CurrentStep = 2;
            a.ShowFirstColor = !1;
            a.showColorNumber = t.Data.InstanceData.ShowColorNumber;
            r = c("filter")(t.Data.InstanceData.Routes.Items, {
                NavKey: "color"
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            });
            a.LastColorPage = n.LastColorPage;
            a.LastColorPage.Path = i.path();
            a.LastColorPage.ColorSearched = "";
            a.text = {
                headline: {
                    header: t.Data.GetLanguageText("PullColors.TabTitle", "Match Colors from a Photo"),
                    subheader: t.Data.GetLanguageText("PullColors.TabSubTitle", "Save colors from your photos.")
                },
                backlink: {
                    text: t.Data.GetLanguageText("PullColors.BackButtonLabel", "Explore Different Colors"),
                    url: r[0].RouteName
                },
                backlink2: {
                    text: t.Data.GetLanguageText("PullColors.BackButtonLabelAfterPhoto", "Use a Different Photo"),
                    url: i.path()
                }
            };
            a.eventData = ["paintProject", "paintProject", "", "", 3];
            a.SelectImageLabel = t.Data.GetLanguageText("PullColors.SelectImage", "Select Image");
            a.EditImageLabel = t.Data.GetLanguageText("PullColors.EditImage", "Edit Image");
            a.FindColorsLabel = t.Data.GetLanguageText("PullColors.FindColors", "Find Colors");
            a.ViewColorLabel = t.Data.GetLanguageText("Swatch.ViewColorLabel", "View Color");
            a.pageTitle = t.Data.GetLanguageText("PullColors.PageTitle", "Pick Your Colors");
            a.nextActionLabel = t.Data.GetLanguageText("PullColors.NextActionLabel", "Paint Your Project");
            a.tabTitle = t.Data.GetLanguageText("PullColors.TabTitle", "Match Colors From An Image");
            a.tabSubtitle = t.Data.GetLanguageText("PullColors.TabSubTitle", "Bring colors from your photos into your project.");
            a.dragPhoto = t.Data.GetLanguageText("PullColors.DragPhoto", "Drag a Photo here or ");
            a.clickToBrowse = t.Data.GetLanguageText("PullColors.ClickToBrowse", "click to browse.");
            a.tapToUpload = t.Data.GetLanguageText("PullColors.TapToUpload", "Tap here to upload your own photo.");
            a.uploadPhotoSmallLabel = t.Data.GetLanguageText("PullColors.uploadPhotoSmallLabel", "Upload a photo");
            a.postUploadSubtitle = t.Data.GetLanguageText("PullColors.postUpload.Subtitle", "We’ve matched colors from your image! Don’t see the color you wanted to pull? Move the active dot to a different spot on the photo to change it.");
            a.Instructions = t.Data.GetLanguageText("PullColors.Instructions", "Click the area of the photo you want to match.");
            a.DragPhotoLabel = t.Data.GetLanguageText("UploadPhoto.DragPhotoLabel", "Drag a photo here or ");
            a.ClickToBrowseLabel = t.Data.GetLanguageText("UploadPhoto.ClickToBrowse", "click to browse");
            a.addLabel = t.Data.GetLanguageText("PullColors.addLabel", "Save");
            a.removeLabel = t.Data.GetLanguageText("PullColors.removeLabel", "Remove");
            a.isFileUploaded = !1;
            a.MaxColorCount = 6;
            a.currentColorIndex = 0;
            a.hasStripeLoaded = !1;
            a.CanvasData = {
                Canvas: null,
                ZoomCanvas: null,
                ShowZoom: !1,
                UseProjectImage: !1,
                PixelSelected: function() {
                    var n = [];
                    n.push({
                        index: 0,
                        r: a.CanvasData.R,
                        g: a.CanvasData.G,
                        b: a.CanvasData.B,
                        lab: RGBtoLAB2DegreeD65(a.CanvasData.R, a.CanvasData.G, a.CanvasData.B),
                        count: 1
                    });
                    y(n, !0)
                }
            };
            s.Project.id == null ? (s.NewProject(null),
            s.Project.StockID = t.Data.InstanceData.DefaultStockPhotoID,
            u = function(n) {
                s.SetSaveProjectResult(n.data);
                f.$broadcast("waitEnd")
            }
            ,
            e = function() {}
            ,
            s.SaveProject(u, e)) : f.$broadcast("waitEnd")
        }
        ;
        a.colorIsDark = function(n) {
            var t = "";
            return n.DcpCSSColorImage && (t = n.IsDark ? n.DcpCSSColorImage + " Dark" : n.DcpCSSColorImage + " Light"),
            t
        }
        ;
        a.GetImage = function() {
            document.getElementById("ImagePicker").click()
        }
        ;
        a.ViewColor = function(n) {
            i.path("Colors/Color/" + n.ColorNumber)
        }
        ;
        a.GetColor = function(n) {
            return "rgb(" + n.R + "," + n.G + "," + n.B + ")"
        }
        ;
        v = function(n) {
            s.SetSaveProjectResult(n.data)
        }
        ;
        a.AddRemoveColor = function(n, t) {
            n.preventDefault();
            n.stopPropagation();
            s.AddRemoveColor(v, t, "image match");
            a.PageData.Data.FirstColorConfirmed || (a.ShowFirstColor = !0,
            a.PageData.Data.FirstColorShowing = !0)
        }
        ;
        a.ExpandColor = function(n, t) {
            a.currentColorIndex = t;
            h.event({
                event: "gtm.click",
                t: "ux",
                d1: "colorMatch",
                d2: "colorExpanded:" + (t + 1)
            })
        }
        ;
        a.GetColors = function() {
            for (var n = [], o, s, h, i = 0, e, r, t, u = 0; u < a.CanvasData.DrawnImageData.height; u++)
                for (e = 0; e < a.CanvasData.DrawnImageData.width; e++)
                    o = a.CanvasData.DrawnImageData.data[i++],
                    s = a.CanvasData.DrawnImageData.data[i++],
                    h = a.CanvasData.DrawnImageData.data[i++],
                    i++,
                    r = (o << 16) + (s << 8) + h,
                    n[r] = n[r] === undefined ? 1 : n[r] + 1;
            n[0] !== null && delete n[0];
            t = n.map(function(n, t) {
                return {
                    index: t,
                    r: t >> 16 & 255,
                    g: t >> 8 & 255,
                    b: t >> 0 & 255,
                    lab: RGBtoLAB2DegreeD65(t >> 16 & 255, t >> 8 & 255, t >> 0 & 255),
                    count: n
                }
            });
            n = null;
            t = t.filter(function(n) {
                return n !== undefined
            });
            t.sort(function(n, t) {
                return +(t.count > n.count) || +(t.count === n.count) - 1
            });
            y(t, !1);
            a.colorCount = a.Colors.length;
            f.$broadcast("StripeLoaded", !0)
        }
        ;
        a.imageSelected = function(n) {
            var i, t;
            a.isFileUploaded = !0;
            h.event({
                event: "gtm.click",
                t: "ux",
                d1: "colorMatch",
                d2: "uploadPhoto"
            });
            i = a.CanvasData.Canvas.getContext("2d");
            i.clearRect(0, 0, a.CanvasData.Canvas.width, a.CanvasData.Canvas.height);
            t = new Image;
            a.ImageName = n.name;
            t.onload = function() {
                a.Colors = [];
                a.ImageName = n.name;
                var t = 600
                  , i = 900;
                this.width > this.height ? this.width > i && (this.height *= i / this.width,
                this.width = i) : this.height > t && (this.width *= t / this.height,
                this.height = t);
                a.CanvasData.DrawThisImage(this);
                a.GetColors();
                a.hasStripeLoaded = !0;
                f.$broadcast("waitEnd");
                document.body.style.cursor = "auto"
            }
            ;
            document.body.style.cursor = "wait";
            f.$broadcast("StripeLoaded", !1);
            o(function() {
                t.src = URL.createObjectURL(n)
            }, 500)
        }
    }
    var n = angular.module("dcpLite");
    n.directive("addremove", ["$document", "$timeout", function() {
        function n() {}
        return {
            link: n,
            restrict: "EA",
            controller: [function() {}
            ]
        }
    }
    ]);
    n.component("pullColors", {
        templateUrl: "/Versions/Shared/Views/Components/Routes/PullColors.html",
        controllerAs: "model",
        controller: ["dsl", "$location", "$http", "$scope", "$rootScope", "$compile", "$timeout", "projectService", "gtmDataLayer", "$filter", "pageData", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o, s, h, c, l, a, v, y) {
        function w(n, t, i, r, u, f, e, o) {
            for (var c = t.split(" "), h = "", s = 0; s < c.length; s++) {
                var l = h + c[s] + " "
                  , a = n.measureText(l)
                  , v = a.width;
                v > u && s > 0 ? (n.fillText(h, i, r),
                h = c[s] + " ",
                r += f) : h = l
            }
            n.fillText(h, i, r);
            n.font = "400 12px Roboto";
            n.fillText(e, i, r + o)
        }
        function b(n) {
            var i = n.indexOf("-"), t = n.substring(0, i), r;
            return n = n.slice(i + 1),
            r = n.indexOf("_"),
            n = n.substring(0, r),
            n = n.replace(/-/g, " "),
            t.toUpperCase() == "RUSTIC" && (t = t + " Collection"),
            t + ": " + n
        }
        function k() {
            var n = s(function() {
                var t, r, u;
                i.Data.BuyOnlineData && p.HasImage && (s.cancel(n),
                f.OnlineDataLoaded = !0,
                f.ShowBuy = f.ShowRetailers && i.Data.BuyOnlineData.Retailers.Items.length > 0,
                t = document.getElementById("sheenModal"),
                t && t.parentNode.removeChild(t),
                r = f.$new(!0, f),
                r = angular.merge(r),
                u = document.createElement("sheen-modal"),
                angular.element(u).attr({
                    id: "sheenModal"
                }),
                angular.element(document.getElementsByClassName("modal-container")[0]).append(v(u)(r)),
                p.usedColors = p.getUsedColors(),
                p.unusedColors = p.getUnusedColors(),
                e.$broadcast("waitEnd"))
            }, 100)
        }
        function d() {
            var n = s(function() {
                p.usedColors && p.ProjectServ.PaintedImage && (s.cancel(n),
                p.AllowResponsiveReview = !0,
                p.CreateReviewImage())
            }, 100)
        }
        var p = this;
        f.alreadyLoaded = !1;
        f.unusedactive = !1;
        f.$watch(function() {
            return t.Data.IsLoading
        }, function(n, i) {
            n === !1 && i === !0 && (p.HasImage = !0,
            t.Data.NeedsColored && t.DrawImage(document.createElement("canvas")))
        });
        p.$onInit = function() {
            var r, u;
            e.$broadcast("waitStart");
            i.Data.BuyOnlineData ? f.alreadyLoaded = !0 : i.GetBuyOnlineData();
            f.ShowChip = i.Data.InstanceData.ShowRequestChip;
            f.ShowRetailers = i.Data.InstanceData.ShowRetailers;
            p.PageData = a;
            p.ProjectImages = t;
            p.ProjectServ = c;
            a.Data.CurrentStep = 4;
            r = c.Project.StockID ? l("filter")(i.Data.InstanceData.Routes.Items, {
                NavKey: "paint",
                Template: "<stock-photo><\/stock-photo>"
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            }) : l("filter")(i.Data.InstanceData.Routes.Items, {
                NavKey: "paint",
                Template: "<paint-photo><\/paint-photo>"
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            });
            u = document.getElementById("headerMenu");
            u && (u.style.height = y.innerWidth < 750 ? "55px" : "70px");
            p.text = {
                headline: {
                    header: i.Data.GetLanguageText("Review.Headline.Header", "Order Paint"),
                    UnusedColors: i.Data.GetLanguageText("Review.Headline.UnusedColors", "Show Unused Colors"),
                    HideUnusedColors: i.Data.GetLanguageText("Review.Headline.HideUnusedColors", "Hide Unused Colors"),
                    MyColors: i.Data.GetLanguageText("Review.Headline.MyColors", "Colors Used in Project")
                },
                backlink: {
                    text: i.Data.GetLanguageText("Review.BackUrlLabel", "Visualize Your Room"),
                    url: r[0].RouteName
                },
                actions: {
                    RequestChip: i.Data.GetLanguageText("Review.Actions.RequestChip", "Paint Chips"),
                    Buy: i.Data.GetLanguageText("Review.Actions.FindStore", "Where to Buy"),
                    Save: i.Data.GetLanguageText("Review.TabTitle.SaveProject", "Save Project"),
                    BuyOnline: i.Data.GetLanguageText("Review.Actions.BuyOnline", "BUY NOW").toUpperCase()
                }
            };
            p.Images = {
                ImageName: {
                    Walmart: "sheenimages/walmart.svg",
                    HomeDepot: "sheenimages/home-depot.svg",
                    Amazon: "sheenimages/amazon.svg"
                }
            };
            p.BrandColors = {
                BackColor: {
                    Walmart: i.Data.GetLanguageText("Review.BuyOnline.BackColor.Walmart", "rgba(0,125,198,1)"),
                    HomeDepot: i.Data.GetLanguageText("Review.BuyOnline.BackColor.The Home Depot", "rgba(241,100,34,1)"),
                    Amazon: i.Data.GetLanguageText("Review.BuyOnline.BackColor.Amazon", "rgba(35, 47, 62, 1)")
                },
                Hover: {
                    Walmart: i.Data.GetLanguageText("Review.BuyOnline.BackHoverColor.Walmart", "rgba(0,76,145,1)"),
                    HomeDepot: i.Data.GetLanguageText("Review.BuyOnline.BackHoverColor.The Home Depot", "rgba(193,80,28,1)"),
                    Amazon: i.Data.GetLanguageText("Review.BuyOnline.BackHoverColor.Amazon", "rgba(0, 0, 0, 1)")
                }
            };
            p.storeURL = i.Data.GetLanguageText("Review.Actions.FindStoreUrl", "");
            p.hirePainterURL = i.Data.GetLanguageText("Review.Actions.hirePainterUrl", "https://www.paintzen.com/");
            f.retailerImg = n.BlobStorageUrl + n.InstanceAssetsFrom + "/";
            p.PageData = a;
            p.showColorNumber = i.Data.InstanceData.ShowColorNumber;
            p.hasTwoLogos = i.Data.InstanceData.HasTwoLogos;
            p.logoUrl2 = i.Data.InstanceData.LogoUrl2;
            p.showReviewColorName = i.Data.InstanceData.ShowReviewColorName;
            p.HideMapPin = i.Data.GetLanguageText("Review.Actions.HideMapPin", "");
            p.HasImage = !1;
            t.LoadDcpImages();
            k();
            d();
            f.alreadyLoaded && e.$broadcast("waitEnd")
        }
        ;
        p.instance = c.Project.Instance;
        p.projectId = c.Project.id;
        p.blobUrl = n.BlobStorageUrl;
        p.OpenStoreLocator = function() {
            y.open(p.storeURL, "_blank")
        }
        ;
        p.OpenHirePainter = function() {
            y.open(p.hirePainterURL, "_blank")
        }
        ;
        p.AnyColorApplied = function() {
            return c.Project.AppliedColors.length > 0
        }
        ;
        p.getSharableColors = function(n, t) {
            for (var u = [], r, e, f = 0; f < c.Project.AppliedColors.length; f++)
                if (r = i.Data.InstanceColors.GetColor({
                    ColorID: c.Project.AppliedColors[f].ColorID
                }),
                e = l("filter")(u, {
                    ColorID: r.ColorID
                }, !0),
                e.length === 0 && (u.push({
                    ColorID: r.ColorID,
                    Name: r.ColorName,
                    Number: r.ColorNumber,
                    Rgb: {
                        R: r.R,
                        G: r.G,
                        B: r.B
                    },
                    IsDark: r.IsDark,
                    Icon: r.DcpCSSColorImage
                }),
                n && u.length === t))
                    break;
            return u
        }
        ;
        p.getColorById = function(n) {
            var t = i.Data.InstanceColors.Colors.Items.filter(function(t) {
                return t.ColorID == n
            })[0];
            return {
                Color: t
            }
        }
        ;
        p.getUnusedColors = function() {
            var r = [], u = i.Data.InstanceColors.Colors.Items, n, t;
            for (f.HasRetailerUnused = [],
            n = 0; n < c.Project.Colors.length; n++)
                l("filter")(c.Project.AppliedColors, c.Project.Colors[n]).length === 0 && (t = u.filter(function(t) {
                    return t.ColorID == c.Project.Colors[n]
                })[0],
                t !== undefined && (i.Data.BuyOnlineData.GetColor(t.ColorID) ? f.HasRetailerUnused.push(!0) : f.HasRetailerUnused.push(!1),
                r.push(t)));
            return r
        }
        ;
        p.getUsedColors = function() {
            var s = [], r = {}, u, e, o, n, t;
            for (f.HasRetailerUsed = [],
            n = 0; n < p.ProjectImages.Data.DcpImage.Masks.length; n++)
                u = p.ProjectImages.Data.DcpImage.Masks[n],
                u.Color !== null && (r[u.Color.ColorID] == undefined && (r[u.Color.ColorID] = 0),
                r[u.Color.ColorID] += u.MaskData.PixelsUsed);
            e = [];
            for (o in r)
                r.hasOwnProperty(o) && e.push({
                    ColorID: o,
                    PixelsUsed: r[o]
                });
            for (e.sort(function(n, t) {
                return t.PixelsUsed - n.PixelsUsed
            }),
            n = 0; n < e.length; n++)
                for (t = 0; t < p.ProjectImages.Data.DcpImage.Masks.length; t++)
                    if (p.ProjectImages.Data.DcpImage.Masks[t].Color !== null && p.ProjectImages.Data.DcpImage.Masks[t].Color.ColorID === parseInt(e[n].ColorID, 10)) {
                        i.Data.BuyOnlineData.GetColor(p.ProjectImages.Data.DcpImage.Masks[t].Color.ColorID) ? f.HasRetailerUsed.push(!0) : f.HasRetailerUsed.push(!1);
                        s.push(p.ProjectImages.Data.DcpImage.Masks[t].Color);
                        break
                    }
            return s
        }
        ;
        p.ClickedUnused = function(n) {
            for (var i = [], t = 0; t < n.length; t++)
                i.push(n[t].gtmName);
            h.event({
                event: "gtm.click",
                t: "orderPaint",
                d1: "view unused colors",
                d2: i
            })
        }
        ;
        p.RequestPaintChip = function(n, t) {
            h.event({
                event: "gtm.click",
                t: "orderPaint",
                d1: "paint chip"
            });
            e.$broadcast("showChipModal", {
                usedColors: n,
                unusedColors: t
            })
        }
        ;
        p.ConvertToRGB = function(n) {
            return n = n.replace(/[^\d,]/g, "").split(","),
            "rgb(" + n[0] + "," + n[1] + "," + n[2] + ")"
        }
        ;
        p.openSheenModal = function(n, t, r) {
            var f, u;
            for (r ? h.event({
                event: "gtm.click",
                t: "orderPaint",
                d1: "open sheen used color",
                d2: t.gtmName
            }) : h.event({
                event: "gtm.click",
                t: "orderPaint",
                d1: "open sheen unused color",
                d2: t.gtmName
            }),
            e.$broadcast("showSheenModal", {
                retailerID: n,
                color: t
            }),
            f = "none",
            u = 0; u < i.Data.BuyOnlineData.Retailers.Items.length; u++)
                i.Data.BuyOnlineData.Retailers.Items[u].RetailerID == n && (f = i.Data.BuyOnlineData.Retailers.Items[u].RetailerName);
            h.event({
                event: "gtm.click",
                t: "orderPaint",
                d1: "buy now logo",
                d2: f
            })
        }
        ;
        p.SaveProject = function() {
            var n = function(n) {
                c.SetSaveProjectResult(n.data)
            }
              , t = function() {
                p.NotificationTitle = i.Data.GetLanguageText("StockPhoto.DataLoadError", "Data Load Error");
                p.NotificationMessage = i.Data.GetLanguageText("StockPhoto.DoesNotExist", "Project Could not be found")
            };
            c.SaveProject(n, t)
        }
        ;
        p.NewPhoto = function() {
            r.path("/")
        }
        ;
        p.CreateReviewImage = function() {
            var i = document.getElementById("ReviewPhotoPaintedContainer")
              , t = new Image;
            t.onload = function() {
                var u = document.createElement("canvas"), d = t.width, g = t.height, l = 500, s = t.height, e = t.width, a, r, h, v, y, o, k, f;
                e > l && (e = l);
                s = Math.round(g * (e / d));
                u.width = e;
                a = p.showReviewColorName ? 75 : 0;
                u.height = Math.round(s + a);
                r = u.getContext("2d");
                r.drawImage(t, 0, 0, t.width, t.height, 0, 0, e, s);
                p.showReviewColorName && c.Project.StockName !== undefined && (h = b(c.Project.StockName),
                r.font = "700 32px Roboto",
                v = r.measureText(h).width,
                r.fillText(h, e / 2 - v / 2, s + 50));
                y = document.getElementById("ReviewPhotoPaintedImg");
                y == null && (o = new Image,
                o.id = "ReviewPhotoPaintedImg",
                o.crossOrigin = "anonymous",
                k = u.toDataURL("image/png", 1),
                o.src = k,
                i.appendChild(o));
                f = new Image;
                f.crossOrigin = "anonymous";
                f.onload = function() {
                    var e, o, t;
                    r.clearRect(0, 0, f.width, f.height);
                    u.width = f.width;
                    u.height = f.height;
                    r.beginPath();
                    r.rect(0, 0, u.width, u.height);
                    r.closePath();
                    r.fillStyle = "#FFF";
                    r.fill();
                    r.drawImage(f, 0, 0, f.width, f.height, 0, 0, 300, f.height);
                    e = new Image;
                    e.id = "ReviewPhotoHeadlineImg";
                    e.crossOrigin = "anonymous";
                    p.showReviewColorName && (e.style = "display: none");
                    o = u.toDataURL("image/png", 1);
                    e.src = o;
                    i.appendChild(e);
                    t = new Image;
                    t.crossOrigin = "anonymous";
                    t.onload = function() {
                        for (var s = 82, c = 70, l = 32, a = 15, v = 180, y = 15, e, b, o, k, f, h = 0; h < p.usedColors.length; h++)
                            r.clearRect(0, 0, 300, s),
                            u.width = 300,
                            u.height = s,
                            e = p.usedColors[h],
                            b = e.CssColor,
                            r.beginPath(),
                            r.rect(0, 0, u.width, u.height),
                            r.closePath(),
                            r.fillStyle = "#FFF",
                            r.fill(),
                            r.beginPath(),
                            r.rect(0, 0, 300, s),
                            r.closePath(),
                            r.fillStyle = b,
                            r.fill(),
                            r.drawImage(t, 0, 0, t.width, t.height, 0, 0, 300, s),
                            r.font = "500 14px Roboto",
                            r.fillStyle = e.IsDark ? "#FFF" : "#000",
                            e.ColorNumber.toLowerCase() != e.ColorName.toLowerCase() ? w(r, e.ColorName, c, l, v, y, e.ColorNumber, a) : w(r, e.ColorName, c, l, v, y, "", a),
                            o = new Image,
                            o.crossOrigin = "anonymous",
                            o.className = "ReviewPhotoSwatchImg",
                            p.showReviewColorName && (o.style = "display: none"),
                            k = u.toDataURL("image/png", 1),
                            o.src = k,
                            i.appendChild(o);
                        f = new Image;
                        f.crossOrigin = "anonymous";
                        f.onload = function() {
                            var e, l;
                            r.clearRect(0, 0, f.width, f.height);
                            u.width = f.width;
                            u.height = f.height;
                            var o = f.width
                              , s = f.height
                              , h = 250
                              , c = 85
                              , n = f.height
                              , t = f.width;
                            t > h && (t = h,
                            n = Math.round(s * (t / o)));
                            n > c && (n = c,
                            t = Math.round(o * (n / s)));
                            u.width = t;
                            u.height = Math.round(n);
                            r.beginPath();
                            r.rect(0, 0, u.width, u.height);
                            r.closePath();
                            r.fillStyle = "#FFF";
                            r.fill();
                            r.drawImage(f, 0, 0, f.width, f.height, 0, 0, t, n);
                            e = new Image;
                            e.id = "ReviewPhotoLogoImg";
                            e.crossOrigin = "anonymous";
                            p.showReviewColorName && (e.style = "display: none");
                            l = u.toDataURL("image/png", 1);
                            e.src = l;
                            i.appendChild(e)
                        }
                        ;
                        f.src = n.BlobStorageUrl + n.InstanceAssetsFrom + "/share/share-logo.png"
                    }
                    ;
                    t.src = n.BlobStorageUrl + n.InstanceAssetsFrom + "/share/review-swatch.png"
                }
                ;
                f.src = n.BlobStorageUrl + n.InstanceAssetsFrom + "/share/share-headline-new.png"
            }
            ;
            t.src = p.ProjectServ.PaintedImage
        }
        ;
        p.getRetailers = function(n) {
            for (var f = i.Data.BuyOnlineData.GetColor(n), e = [], r, u, t = 0; t < i.Data.BuyOnlineData.Retailers.Items.length; t++)
                if (f != null)
                    for (r = 0; r < f.length; r++)
                        u = i.Data.BuyOnlineData.Retailers.Items[t],
                        u.RetailerID == f[r].RetailerID && e.indexOf(u) === -1 && e.push(u);
            return e
        }
    }
    var n = angular.module("dcpLite");
    n.directive("showunused", ["$document", "$timeout", function(n, t) {
        function i(n, i) {
            var u = i[0]
              , r = i.parent().parent()[0].children.ReviewPhotoModalUnusedColorList;
            r.style.maxHeight = "0px";
            i.bind("click", function() {
                t(function() {
                    r.style.maxHeight != "0px" ? (r.style.maxHeight = "0px",
                    u.classList.remove("active"),
                    n.showcolors = !1,
                    r.style.overflow = "hidden") : (r.style.maxHeight = r.scrollHeight + "px",
                    u.classList.add("active"),
                    n.showcolors = !0,
                    t(function() {
                        r.style.overflow = "visible"
                    }, 200))
                })
            })
        }
        return {
            link: i,
            restrict: "A",
            scope: {
                showcolors: "="
            },
            controller: [function() {}
            ]
        }
    }
    ]);
    n.component("reviewPhoto", {
        templateUrl: "/Versions/Shared/Views/Components/Routes/ReviewPhoto.html",
        controllerAs: "model",
        controller: ["projectImages", "dsl", "$location", "$routeParams", "$scope", "$rootScope", "$timeout", "$interval", "gtmDataLayer", "projectService", "$filter", "pageData", "$compile", "$window", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o, s) {
        var h = this, l;
        h.Loc = f;
        var c = f.path().split("/")
          , a = i("filter")(u.Data.InstanceData.Routes.Items, {
            NavKey: "paint",
            Template: "<paint-photo><\/paint-photo>"
        }, function(t, i) {
            return n.LowerCaseCompare(t, i)
        })[0]
          , v = i("filter")(u.Data.InstanceData.Routes.Items, {
            NavKey: "paint",
            Template: "<stock-photo><\/stock-photo>"
        }, function(t, i) {
            return n.LowerCaseCompare(t, i)
        })[0]
          , y = i("filter")(u.Data.InstanceData.Routes.Items, {
            NavKey: "color"
        }, function(t, i) {
            return n.LowerCaseCompare(t, i)
        });
        h.PageData = s;
        h.ProjectServ = e;
        h.text = {
            headline: {
                header: u.Data.GetLanguageText("SearchColors.Headline.Header", "Search by Color Name")
            },
            backlink: {
                text: u.Data.GetLanguageText("ColorFamilies.BackButton.Text", "Explore Different Colors"),
                url: y[0].RouteName
            },
            actions: {
                nextStep: u.Data.GetLanguageText("ColorFamilies.Actions.NextStep", "Paint Your Project"),
                nextStepUrl: e.Project.StockID ? v.RouteName : a.RouteName,
                nextStepNavId: "paint",
                nextPage: u.Data.GetLanguageText("SearchColors.Actions.NextPage", "Next"),
                prevPage: u.Data.GetLanguageText("SearchColors.Actions.PrevPage", "Previous")
            }
        };
        h.LastColorPage = n.LastColorPage;
        h.SearchColorsHeader = u.Data.GetLanguageText("SearchColors.Header", "Search Colors");
        h.SearchColorsSubheader = u.Data.GetLanguageText("SearchColors.Subheader", "Know a color's name or number? Add it to your project.");
        h.SearchColorsPlaceholder = u.Data.GetLanguageText("SearchColors.Placeholder", "Search by color name or number");
        h.SearchColorsSubmitbutton = u.Data.GetLanguageText("SearchColors.Submitbutton", "Submit");
        h.SearchColorsResults = u.Data.GetLanguageText("SearchColors.Results", "Search Results");
        h.FilterType = u.Data.GetFeatures().filter(function(n) {
            return n.FeatureName === "SearchPreviousColors" && n.Active === !0
        }).length > 0 ? "colorFilter" : "colorFilterWithoutOldNames";
        h.FilterType = u.Data.GetFeatures().filter(function(n) {
            return n.FeatureName === "HideColorNumber" && n.Active === !0
        }).length > 0 ? "colorFilterWithoutColorCode" : "colorFilterWithoutOldNames";
        h.eventData = ["paintProject", "paintProject", "", "", 3];
        h.$onInit = function() {
            var e, o;
            h.ShowFirstColor = !1;
            s.Data.CurrentStep = 2;
            h.search = "";
            h.filteredList = [];
            h.GetColors();
            h.currentPage = 0;
            h.pageSize = 20;
            h.filteredColors = [];
            h.LastColorPage.Collection = "";
            h.LastColorPage.ColorFamily = "";
            h.LastColorPage.Path = h.Loc.path();
            h.search = h.LastColorPage.ColorSearched;
            h.FilterAndResetPage();
            h.GetIsDarkCss = "";
            e = i("filter")(u.Data.InstanceData.ColorSelectionTabs.Items, {
                Route: "/" + c[1] + "/" + c[2]
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            });
            e.length && (h.TabID = e[0].TabID,
            n.LastCollectionPathSelected[h.TabID] === undefined || n.LastCollectionPathSelected[h.TabID] === null ? (o = i("filter")(u.Data.ColorCollections.Items, {
                TabID: h.TabID
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            }),
            o.length && (h.Collections = o)) : f.path(n.LastCollectionPathSelected[h.TabID]).replace());
            r.$parent.wrapperClasses = "has-right-flyout";
            h.SetupMyColors();
            t.$broadcast("waitEnd")
        }
        ;
        h.AnyColorSelected = function() {
            return h.myColors.length > 0
        }
        ;
        h.SetupMyColors = function() {
            h.myColors = e.Project.Colors;
            h.selectedColorId = e.selectedColorId();
            h.selectedColorName = e.selectedColorName(h.selectedColorId)
        }
        ;
        h.GetColor = function(n) {
            return "rgb(" + n.R + ", " + n.G + ", " + n.B + ")"
        }
        ;
        h.NumberOfPages = function() {
            return Math.ceil(i(h.FilterType)(h.colors, h.search).length / h.pageSize)
        }
        ;
        h.Filter = function() {
            h.search.length > 1 && (h.filteredColors = i("startFrom")(i(h.FilterType)(h.colors, h.search), h.currentPage * h.pageSize))
        }
        ;
        h.Page = function(n) {
            h.currentPage = n;
            h.Filter()
        }
        ;
        h.Range = function(n, t) {
            var r, i;
            for (n <= 0 && (n = 1),
            t >= h.NumberOfPages() && (t = h.NumberOfPages()),
            r = [],
            i = n; i <= t; i += 1)
                r.push(i);
            return r
        }
        ;
        h.FilterAndResetPage = function() {
            h.currentPage = 0;
            h.search.length > 1 && (h.filteredColors = i("startFrom")(i(h.FilterType)(h.colors, h.search), h.currentPage * h.pageSize));
            h.LastColorPage.ColorSearched = h.search
        }
        ;
        h.AddColor = function(n) {
            e.AddRemoveColor(l, n, "search");
            h.PageData.Data.FirstColorConfirmed || (h.ShowFirstColor = !0,
            h.PageData.Data.FirstColorShowing = !0)
        }
        ;
        h.Next = function() {
            h.currentPage = h.currentPage + 1;
            h.Filter()
        }
        ;
        h.Prev = function() {
            h.currentPage = h.currentPage - 1;
            h.Filter()
        }
        ;
        h.IsSelected = function(n) {
            return h.myColors.indexOf(n) > -1
        }
        ;
        h.GetColors = function() {
            h.colors = u.Data.InstanceColors.Colors.Items
        }
        ;
        h.Redirect = function(n) {
            f.path(n)
        }
        ;
        h.SearchColor = function() {
            var t = h.colorNumber, n;
            h.NotificationTitle = "Searching";
            n = u.Data.InstanceColors.GetColor({
                ColorNumber: h.colorNumber
            });
            n ? (h.colorNumber = "",
            h.error = "",
            f.path("Colors/Color/" + n.ColorNumber)) : (h.error = "Could not find color: " + t,
            h.NotificationTitle = null)
        }
        ;
        l = function(n) {
            e.SetSaveProjectResult(n.data)
        }
        ;
        r.ShowCheck = function(n) {
            var t = "";
            return n.IsDark && (t = "isDark"),
            n.InMyColors && (t !== "" && (t = t + " "),
            t = t + "isSelected"),
            t
        }
    }
    var n = angular.module("dcpLite");
    n.component("searchColors", {
        templateUrl: "/Versions/Shared/Views/Components/Routes/SearchColors.html",
        controllerAs: "model",
        controller: ["$rootScope", "$filter", "$scope", "dsl", "$location", "projectService", "gtmDataLayer", "pageData", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o, s, h, c) {
        var l = this;
        l.$onInit = function() {
            var u, n, o, e, i;
            if (c.Data.CurrentStep = 1,
            u = !1,
            r.Name !== null)
                for (n = 0; n < t.Data.StockImages.Rooms.Items.length; n++)
                    if (l.Room = t.Data.GetLanguageText("room." + t.Data.StockImages.Rooms.Items[n].Name.toLowerCase() + "s", t.Data.StockImages.Rooms.Items[n].Name),
                    l.Room.toLowerCase() === r.Name.toLowerCase()) {
                        for (o = l.text = {
                            headline: {
                                subheader: t.Data.GetLanguageText("room." + t.Data.StockImages.Rooms.Items[n].Name.toLowerCase() + "s", t.Data.StockImages.Rooms.Items[n].Name),
                                header: t.Data.GetLanguageText("SelectPhoto.PageTitle", "Select a Photo to Paint")
                            },
                            backlink: {
                                text: t.Data.GetLanguageText("SelectPhoto.BackLink.Text", "Explore Different Photos"),
                                url: "/"
                            }
                        },
                        e = [],
                        i = 0; i < t.Data.StockImages.Rooms.Items[n].Photos.Items.length; i++)
                            t.Data.StockImages.Rooms.Items[n].Photos.Items[i].Active && e.push(t.Data.StockImages.Rooms.Items[n].Photos.Items[i]);
                        l.Photos = e;
                        u = !0;
                        break
                    }
            u || l.Loc.path("notfound").replace();
            f.$broadcast("waitEnd")
        }
        ;
        l.Select = function(r) {
            f.$broadcast("waitStart");
            s.NewProject(null);
            s.Project.StockID = r.PhotoID;
            s.Project.StockName = r.Description;
            var u = function(r) {
                var u;
                s.SetSaveProjectResult(r.data);
                s.Project.ColorList.length > 0 ? (u = h("filter")(t.Data.InstanceData.Routes.Items, {
                    NavKey: "paint",
                    Template: "<stock-photo><\/stock-photo>"
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                }),
                i.path(u[0].RouteName)) : (u = h("filter")(t.Data.InstanceData.Routes.Items, {
                    NavKey: "color"
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                }),
                i.path(u[0].RouteName))
            }
              , e = function() {};
            s.SaveProject(u, e)
        }
    }
    var n = angular.module("dcpLite");
    n.component("selectPhoto", {
        templateUrl: "/Versions/Shared/Views/Components/Routes/SelectPhoto.html",
        controllerAs: "model",
        controller: ["dsl", "$location", "$routeParams", "$scope", "$rootScope", "$timeout", "gtmDataLayer", "projectService", "$filter", "pageData", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o, s, h, c, l, a) {
        function w() {
            v.Surfaces = [];
            v.CanvasData = {
                CanvasBound: b,
                Canvas: null,
                ShowZoom: !1,
                PixelSelected: k,
                ImageContext: null,
                ShowOverlay: !0
            }
        }
        function b() {
            document.body.style.cursor = "wait";
            n.ChangeHistory = [];
            n.CurrentChangeIndex = -1;
            v.showAdd = !0;
            v.isUploadPhoto = c.Project.StockID === null;
            t.LoadDcpImages()
        }
        function k() {
            var f, r, e, o, u;
            if (v.PageData.Data.SelectedColor)
                for (e = !1,
                o = null,
                v.EnableUndo = !0,
                f = 0; f < t.Data.DcpImage.Masks.length; f++)
                    if (r = t.Data.DcpImage.Masks[f],
                    r.MaskData !== null && (u = (v.CanvasData.Canvas.width * v.CanvasData.Y + v.CanvasData.X) * 4,
                    r.MaskData.ImageData.data[u + 3] > 0)) {
                        for (r.Color && v.PageData.Data.SelectedColor != r.Color && h.event({
                            event: "gtm.click",
                            t: "paintWall",
                            d1: "StockPhoto",
                            d2: v.PageData.Data.SelectedColor.gtmName
                        }),
                        r.Color = i.Data.InstanceColors.GetColor({
                            ColorID: v.PageData.Data.SelectedColor.ColorID
                        }),
                        u = 0; u < c.Project.AppliedColors.length; u++)
                            if (c.Project.AppliedColors[u].SurfaceNumber === r.SurfaceID) {
                                c.Project.AppliedColors[u].ColorID = r.Color.ColorID;
                                e = !0;
                                break
                            }
                        e || (c.Project.AppliedColors.push({
                            ColorID: r.Color.ColorID,
                            SurfaceNumber: r.SurfaceID
                        }),
                        h.event({
                            event: "gtm.click",
                            t: "paintWall",
                            d1: "StockPhoto",
                            d2: r.Color.gtmName
                        }));
                        t.DrawImage(v.CanvasData.Canvas);
                        y();
                        n.CurrentChangeIndex++;
                        v.SaveProject();
                        break
                    }
        }
        function y() {
            var t = {
                Project: angular.copy(c.Project)
            };
            n.ChangeHistory.length > n.MaxChanges && (n.ChangeHistory.splice(0, 1),
            n.CurrentChangeIndex--);
            n.ChangeHistory.length > 0 ? n.ChangeHistory.splice(n.CurrentChangeIndex + 1, n.ChangeHistory.length - n.CurrentChangeIndex, t) : n.ChangeHistory.push(t)
        }
        function p(i) {
            c.Project = angular.copy(n.ChangeHistory[i].Project);
            t.RemapColorsToSurfaces();
            t.DrawImage(v.CanvasData.Canvas);
            v.SaveProject()
        }
        function d(n) {
            var t = n.getBoundingClientRect();
            return t.top >= 0 && t.bottom <= window.innerHeight
        }
        document.body.style.cursor = "wait";
        var v = this;
        f.$watch(function() {
            return t.Data.IsLoading
        }, function(i, r) {
            i === !1 && r === !0 && (t.DrawImage(v.CanvasData.Canvas),
            v.CanvasData.ResizeOverlay(),
            y(),
            n.CurrentChangeIndex++,
            v.NotificationTitle = "",
            document.body.style.cursor = "auto",
            v.CanvasData.EnableSelection(),
            o(function() {
                e.$broadcast("waitEnd")
            }))
        });
        v.$onInit = function() {
            var t, u, f, o;
            r.search("colorslist", null);
            e.$broadcast("waitStart");
            v.ProjectServ = c;
            a.Data.CurrentStep = 3;
            v.helpLabel = i.Data.GetLanguageText("StockPhoto.helpLabel", "Help");
            v.undoLabel = i.Data.GetLanguageText("StockPhoto.undoLabel", "Undo");
            v.redoLabel = i.Data.GetLanguageText("StockPhoto.redoLabel", "Redo");
            v.resetLabel = i.Data.GetLanguageText("StockPhoto.resetLabel", "Reset");
            v.newPhotoLabel = i.Data.GetLanguageText("StockPhoto.secondaryActionLabel", "Change Your Photo");
            t = l("filter")(i.Data.InstanceData.Routes.Items, {
                NavKey: "color"
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            });
            v.LastColorPage = n.LastColorPage;
            v.LastColorPage.Path == "" && (v.LastColorPage.Path = t[0].RouteName);
            v.text = {
                headline: {
                    header: i.Data.GetLanguageText("PaintPhoto.pageTitle", "Visualize Your Room"),
                    subheader: i.Data.GetLanguageText("PaintPhoto.pageSubtitle", "Click a wall to paint the selected color.")
                },
                backlink: {
                    text: i.Data.GetLanguageText("PaintPhoto.BackUrlLabel", "Find More Colors"),
                    url: v.LastColorPage.Path
                }
            };
            v.PageData = a;
            w();
            v.showColorNumber = i.Data.InstanceData.ShowColorNumber;
            v.hasTwoLogos = i.Data.InstanceData.HasTwoLogos;
            v.logoUrl2 = i.Data.InstanceData.LogoUrl2;
            u = document.getElementById("StockPhotoImg");
            o = setInterval(function() {
                f = document.getElementById("ImageCanvas");
                f && (d(u) || (window.scrollBy(0, -20),
                clearInterval(o)))
            }, 100)
        }
        ;
        v.instance = c.Project.Instance;
        v.projectId = c.Project.id;
        v.blobUrl = n.BlobStorageUrl;
        v.logoUrl = n.BlobStorageUrl + n.InstanceAssetsFrom + "/logo.png";
        v.AnyColorApplied = function() {
            return c.Project.AppliedColors.length > 0
        }
        ;
        v.getFooterColors = function() {
            for (var r = [], n, u, t = 0; t < c.Project.AppliedColors.length; t++)
                n = i.Data.InstanceColors.GetColor({
                    ColorID: c.Project.AppliedColors[t].ColorID
                }),
                u = l("filter")(r, {
                    ColorID: n.ColorID
                }, !0),
                u.length === 0 && r.push({
                    ColorID: n.ColorID,
                    Name: n.ColorName,
                    Number: n.ColorNumber,
                    Rgb: {
                        R: n.R,
                        G: n.G,
                        B: n.B
                    },
                    IsDark: n.IsDark,
                    Icon: n.DcpCSSColorImage
                });
            return r
        }
        ;
        v.getSharableColors = function(n, t) {
            for (var u = [], r, e, f = 0; f < c.Project.AppliedColors.length; f++)
                if (r = i.Data.InstanceColors.GetColor({
                    ColorID: c.Project.AppliedColors[f].ColorID
                }),
                e = l("filter")(u, {
                    ColorID: r.ColorID
                }, !0),
                e.length === 0 && (u.push({
                    ColorID: r.ColorID,
                    Name: r.ColorName,
                    Number: r.ColorNumber,
                    Rgb: {
                        R: r.R,
                        G: r.G,
                        B: r.B
                    },
                    IsDark: r.IsDark,
                    Icon: r.DcpCSSColorImage
                }),
                n && u.length === t))
                    break;
            return u
        }
        ;
        f.$watch(function() {
            return v.PageData.Data.LastDeletedColor
        }, function(i) {
            var r, u, f;
            if (i) {
                for (r = !1,
                u = 0; u < t.Data.DcpImage.Masks.length; u++)
                    f = t.Data.DcpImage.Masks[u],
                    f.Color && f.Color.ColorID === i.ColorID && (r || (y(),
                    n.CurrentChangeIndex++),
                    f.Color = null,
                    r = !0);
                r && (v.PageData.Data.LastDeletedColor = null,
                t.RemapColorsToSurfaces(),
                t.DrawImage(v.CanvasData.Canvas),
                v.SaveProject())
            }
        });
        v.Undo = function() {
            if (n.CurrentChangeIndex <= 0 || v.EnableUndo === !1) {
                alert(i.Data.GetLanguageText("StockPhoto.UnableUndo", "Unable to Undo!"));
                return
            }
            p(n.CurrentChangeIndex - 1);
            n.CurrentChangeIndex--;
            v.EnableRedo = !0;
            h.event({
                event: "gtm.click",
                t: "ux",
                d1: "undo"
            })
        }
        ;
        v.Redo = function() {
            if (n.CurrentChangeIndex + 1 >= n.ChangeHistory.length || v.EnableRedo === !1) {
                alert(i.Data.GetLanguageText("StockPhoto.UnableRedo", "Unable to Redo!"));
                return
            }
            p(n.CurrentChangeIndex + 1);
            n.CurrentChangeIndex++;
            v.EnableUndo = !0;
            h.event({
                event: "gtm.click",
                t: "ux",
                d1: "redo"
            })
        }
        ;
        v.Reset = function() {
            v.EnableRedo = !1;
            v.EnableUndo = !1;
            n.ChangeHistory = [];
            n.CurrentChangeIndex = 0;
            c.ResetProject(c.Project.StockID);
            h.event({
                event: "gtm.click",
                t: "ux",
                d1: "reset"
            });
            y();
            v.GetDefaultPhoto();
            v.SaveProject()
        }
        ;
        v.GetDefaultPhoto = function() {
            t.ResetImage(v.CanvasData.Canvas)
        }
        ;
        v.SaveProject = function() {
            var n = function(n) {
                c.SetSaveProjectResult(n.data)
            }
              , t = function() {
                v.NotificationTitle = i.Data.GetLanguageText("StockPhoto.DataLoadError", "Data Load Error");
                v.NotificationMessage = i.Data.GetLanguageText("StockPhoto.DoesNotExist", "Project Could not be found")
            };
            c.SaveProject(n, t)
        }
        ;
        v.NewPhoto = function() {
            r.path("/")
        }
    }
    var n = angular.module("dcpLite");
    n.component("stockPhoto", {
        templateUrl: "/Versions/Shared/Views/Components/Routes/StockPhoto.html",
        controllerAs: "model",
        controller: ["projectImages", "dsl", "$location", "$routeParams", "$scope", "$rootScope", "$timeout", "$interval", "gtmDataLayer", "projectService", "$filter", "pageData", "$compile", "$window", t]
    })
}(),
function(n) {
    function i(n, i, r, u, f, e, o, s, h, c, l) {
        function p() {
            var t = n.location.pathname.slice(-1);
            t == "/" && (n.location.pathname = n.location.pathname.slice(0, -1))
        }
        function w() {
            var n = e(function() {
                var w, c, s, f, p, b, k;
                if (r.IsLoaded())
                    if (r.LoadSuccess()) {
                        if (e.cancel(n),
                        i.dataLoaded = !0,
                        i.copyright = r.Data.GetLanguageText("Footer.Text", "Copyright {currentYear}. All Rights Reserved. "),
                        i.copyright = i.copyright.replace("{currentYear}", (new Date).getFullYear()),
                        i.copyright = l.trustAsHtml(i.copyright),
                        i.hasFooterLogo = r.Data.InstanceData.HasFooterLogo,
                        i.hasExtendFooter = r.Data.InstanceData.HasExtendFooter,
                        i.hasTwoLogos = r.Data.InstanceData.HasTwoLogos,
                        i.hasThreeLogos = r.Data.InstanceData.HasThreeLogos,
                        i.logoUrl2 = r.Data.InstanceData.LogoUrl2,
                        i.logoUrl3 = r.Data.InstanceData.LogoUrl3,
                        i.hasScreenBackground = r.Data.InstanceData.HasScreenBackground,
                        i.fullBackgroundImageUrl = r.Data.InstanceData.FullBackgroundImageUrl,
                        i.fullBackgroundImageCss = i.hasScreenBackground ? "fullScreenImage" : "",
                        i.logo1ActionUrl = r.Data.GetLanguageText("Logo1Action.URL", ""),
                        i.logo2ActionUrl = r.Data.GetLanguageText("Logo2Action.URL", ""),
                        i.dcpCoreAssets = _BlobStorageUrl + "dcpcoreassets/AllInstances/",
                        i.hasExtendFooter)
                            for (w = Object.keys(r.Data.InstanceData.LanguageText),
                            c = o("filter")(w, "extendfooter.line"),
                            i.extendFooter = [],
                            s = 0; s < c.length; s++)
                                f = r.Data.GetLanguageText(c[s], ""),
                                /{image\d*}/.test(f) && (p = f.split("}")[0].replace("{", ""),
                                f = f.replace(/{image\d*}/, '<img src="' + t.BlobStorageUrl + t.Instance.toLowerCase() + "/" + r.Data.GetLanguageText("ExtendFooter." + p, "") + '" alt="' + r.Data.GetLanguageText("ExtendFooter." + p, "") + '" />')),
                                i.extendFooter.push(f);
                        a !== undefined && a !== null ? (b = function(n) {
                            n.data === "" ? u.path("notfound").replace() : t.LowerCaseCompare(n.data.Instance, t.Instance) ? h.SetSaveProjectResult(n.data) : u.path("notfound").replace();
                            v()
                        }
                        ,
                        k = function() {}
                        ,
                        h.GetProject(a, b, k)) : v()
                    } else
                        y()
            }, 100)
        }
        i.copyright = l.trustAsHtml(i.copyright);
        var a = u.search().projectid
          , v = function() {
            var u, n;
            if (!t.RoutesLoaded) {
                for (u in r.Data.InstanceData.Routes.Items)
                    n = r.Data.InstanceData.Routes.Items[u],
                    t.routeProvider.when(n.RouteName, {
                        template: n.Template,
                        caseInsensitiveMatch: !0
                    });
                t.routeProvider.otherwise({
                    redirectTo: "/notfound"
                });
                f.reload();
                t.RoutesLoaded = !0
            }
            p();
            i.logoUrl = t.BlobStorageUrl + t.InstanceAssetsFrom + "/logo.png";
            i.backgroundImageUrl = t.BlobStorageUrl + t.InstanceAssetsFrom + "/header_background.jpg"
        }
          , y = function() {
            i.notificationTitle = "Data Load Error";
            i.notificationMessage = "Could not fetch required data!"
        };
        w();
        i.blobUrl = "";
        i.status = {};
        i.status.loading = !0;
        i.$on("$routeChangeStart", function(n, i) {
            if (u.search().projectid != null && a != u.search().projectid) {
                a = u.search().projectid;
                var r = function(n) {
                    n.data === "" ? u.path("notfound").replace() : t.LowerCaseCompare(n.data.Instance, t.Instance) ? (h.SetSaveProjectResult(n.data),
                    u.path(i.$$route.originalPath)) : u.path("notfound").replace()
                }
                  , f = function() {};
                h.GetProject(a, r, f);
                n.preventDefault()
            }
        });
        i.$on("$routeChangeSuccess", function() {
            c.virtualPageView(u.path())
        })
    }
    var t = n.module("dcpLite");
    t.controller("IndexController", ["$window", "$scope", "dsl", "$location", "$route", "$interval", "$filter", "$rootScope", "projectService", "gtmDataLayer", "$sce", i])
}(window.angular),
function() {
    "use strict";
    var n = angular.module("dcpLite");
    n.component("notificationPane", {
        templateUrl: "/Versions/Shared/Views/Controls/NotificationPane.html",
        bindings: {
            title: "<",
            message: "<",
            level: "@"
        },
        transclude: !0,
        controllerAs: "model",
        controller: function() {
            var n = this
        }
    })
}(),
function() {
    "use strict";
    var n = angular.module("dcpLite");
    n.directive("colorSelectorResize", ["$window", "projectService", function(n, t) {
        return function(i, r) {
            var u = angular.element(n);
            i.$watch(function() {
                return t.Project.Colors.length
            }, function(n, t) {
                n != t && n <= 5 && (r[0].style.width = r[0].parentElement.offsetWidth + "px")
            }, !0);
            i.$watch(function() {
                return {
                    h: window.innerHeight,
                    w: window.innerWidth
                }
            }, function() {
                var n = 0;
                t.Project.Colors.length > 5 && (n = 78);
                r[0].style.width = r[0].parentElement.offsetWidth - n + "px";
                i.MaxItems = Math.floor((r[0].parentElement.offsetWidth - n) / 56)
            }, !0);
            u.bind("resize", function() {
                i.$apply()
            })
        }
    }
    ])
}(),
function() {
    "use strict";
    function r() {
        var n = this;
        n.markerStyle = function(r, u, f) {
            return {
                left: (r - .5 * t) / n.paintPhoto.CanvasData.Canvas.width * 100 + "%",
                top: (u - .5 * i) / n.paintPhoto.CanvasData.Canvas.height * 100 + "%",
                "background-color": n.marker.Color.CssColor,
                "z-index": f === !0 ? "101" : "100"
            }
        }
        ;
        n.markerIsDark = function() {
            return n.marker.Color.IsDark ? "IsDark" : ""
        }
    }
    function u(n, t) {
        angular.element(t[0]).on("click", function() {
            n.model.paintPhoto.deleteMarker && n.model.paintPhoto.deleteMarker(n.model.marker.Point.Id, n.model.marker.Color.gtmName);
            n.$apply()
        })
    }
    var n = angular.module("dcpLite")
      , t = 30
      , i = 30;
    n.directive("eraseMarker", ["$rootScope", function() {
        return {
            templateUrl: "/Versions/Shared/Views/Directives/EraseMarker.html",
            controllerAs: "model",
            restrict: "E",
            scope: {
                marker: "<"
            },
            require: {
                paintPhoto: "?^^paintPhoto"
            },
            link: u,
            controller: ["$rootScope", r],
            bindToController: !0
        }
    }
    ])
}(),
function() {
    "use strict";
    function r(n) {
        var r = this;
        r.lines = [];
        r.joinedTwoLines = !1;
        r.updateLines = function() {
            r.lines = r.getLineCoordinates()
        }
        ;
        r.removeLine = function(t, i) {
            r.deleteLine(t, i);
            r.updateLines();
            r.paintPhoto.numLines--;
            r.paintPhoto.numEditClicks++;
            r.paintPhoto.numMarkers = 0;
            for (var u = 0; u < r.paintPhoto.FakeEdges.length; u++)
                r.paintPhoto.numMarkers += r.paintPhoto.FakeEdges[u].Points.length;
            n.event({
                event: "gtm.click",
                t: "ux",
                d1: "paintTool",
                d2: "delete edit line"
            });
            n.event({
                event: "paintTool",
                t: "paintTool",
                d1: "delete edit line",
                d2: "edit clicks: " + r.paintPhoto.numEditClicks
            });
            n.event({
                event: "paintTool",
                t: "paintTool",
                d1: "delete edit line",
                d2: "markersIncluded: " + r.paintPhoto.numMarkers
            });
            n.event({
                event: "paintTool",
                t: "paintTool",
                d1: "delete edit line",
                d2: "linesCompleted: " + r.paintPhoto.lineCount
            })
        }
        ;
        r.removeLineStyle = function(n, u, f, e) {
            return {
                left: (.5 * (n + f) - .5 * i + 3) / r.paintPhoto.CanvasData.Canvas.width * 100 + "%",
                top: (.5 * (u + e) - .5 * t + 3) / r.paintPhoto.CanvasData.Canvas.height * 100 + "%"
            }
        }
        ;
        r.lineStyle = function(n, t, i, u) {
            var f, e, o;
            return n > i && (i = n + i,
            n = i - n,
            i = i - n,
            u = t + u,
            t = u - t,
            u = u - t),
            f = Math.atan((t - u) / (i - n)),
            f = f * 180 / Math.PI,
            f = -f,
            e = Math.sqrt((n - i) * (n - i) + (t - u) * (t - u)),
            o = {
                left: n / r.paintPhoto.CanvasData.Canvas.width * 100 + "%",
                top: t / r.paintPhoto.CanvasData.Canvas.height * 100 + "%",
                width: e / r.paintPhoto.CanvasData.Canvas.width * 100 + "%",
                transform: "rotate(" + f + "deg)"
            },
            o
        }
        ;
        r.getLineCoordinates = function() {
            for (var u = [], f, i, e, t = 0; t < r.paintPhoto.FakeEdges.length; t++) {
                for (i = 0; i < r.paintPhoto.FakeEdges[t].Points.length; i++) {
                    if (i + 1 > r.paintPhoto.FakeEdges[t].Points.length - 1)
                        break;
                    u.push({
                        X1: r.paintPhoto.FakeEdges[t].Points[i].X,
                        Y1: r.paintPhoto.FakeEdges[t].Points[i].Y,
                        Id1: r.paintPhoto.FakeEdges[t].Points[i].Id,
                        X2: r.paintPhoto.FakeEdges[t].Points[i + 1].X,
                        Y2: r.paintPhoto.FakeEdges[t].Points[i + 1].Y,
                        Id2: r.paintPhoto.FakeEdges[t].Points[i + 1].Id
                    })
                }
                r.paintPhoto.FakeEdges[t].ClosedPolygon === !0 && (f = r.paintPhoto.FakeEdges[t].Points.length - 1,
                u.push({
                    X1: r.paintPhoto.FakeEdges[t].Points[0].X,
                    Y1: r.paintPhoto.FakeEdges[t].Points[0].Y,
                    Id1: r.paintPhoto.FakeEdges[t].Points[0].Id,
                    X2: r.paintPhoto.FakeEdges[t].Points[f].X,
                    Y2: r.paintPhoto.FakeEdges[t].Points[f].Y,
                    Id2: r.paintPhoto.FakeEdges[t].Points[f].Id
                }))
            }
            if (r.paintPhoto.numLines < u.length) {
                for (r.paintPhoto.numLines++,
                r.paintPhoto.numMarkers = 0,
                i = 0; i < r.paintPhoto.FakeEdges.length; i++)
                    r.paintPhoto.numMarkers += r.paintPhoto.FakeEdges[i].Points.length;
                for (e = !1,
                t = 0; t < length; t++)
                    if (r.paintPhoto.FakeEdges[t].ClosedPolygon === !0) {
                        e = !0;
                        break
                    }
                e || r.joinedTwoLines || (n.event({
                    event: "gtm.click",
                    t: "ux",
                    d1: "paintTool",
                    d2: "add edit line"
                }),
                n.event({
                    event: "paintTool",
                    t: "paintTool",
                    d1: "add edit line",
                    d2: "edit clicks: " + r.paintPhoto.numEditClicks
                }),
                n.event({
                    event: "paintTool",
                    t: "paintTool",
                    d1: "add edit line",
                    d2: "markersIncluded: " + r.paintPhoto.numMarkers
                }),
                n.event({
                    event: "paintTool",
                    t: "paintTool",
                    d1: "add edit line",
                    d2: "linesCompleted: " + r.paintPhoto.lineCount
                }));
                r.joinedTwoLines && (r.joinedTwoLines = !1)
            }
            return r.paintPhoto.lineCount = u.length,
            u
        }
        ;
        r.cleanActivatedPoints = function() {
            for (var t, n = 0; n < r.paintPhoto.FakeEdges.length; n++)
                for (t = 0; t < r.paintPhoto.FakeEdges[n].Points.length; t++)
                    r.paintPhoto.FakeEdges[n].Points[t].Active = !1
        }
        ;
        r.deleteLine = function(n, t) {
            for (var i = 0, u = 0, f = 0, h, l, c, v, e, o, s = 0; s < r.paintPhoto.FakeEdges.length; s++)
                for (h = 0; h < r.paintPhoto.FakeEdges[s].Points.length; h++)
                    r.paintPhoto.FakeEdges[s].Points[h].Id === n && (i = s,
                    u = h),
                    r.paintPhoto.FakeEdges[s].Points[h].Id === t && (f = h);
            if (r.paintPhoto.FakeEdges[i].ClosedPolygon === !0) {
                for (r.paintPhoto.FakeEdges[i].ClosedPolygon = !1,
                l = [],
                l.push({
                    Id: r.paintPhoto.FakeEdges[i].Points[u].Id,
                    X: r.paintPhoto.FakeEdges[i].Points[u].X,
                    Y: r.paintPhoto.FakeEdges[i].Points[u].Y,
                    Active: !1
                }),
                r.paintPhoto.FakeEdges[i].Points[u].Added = !0,
                c = u,
                v = 0; v < r.paintPhoto.FakeEdges[i].Points.length; v++)
                    e = c - 1 >= 0 ? c - 1 : r.paintPhoto.FakeEdges[i].Points.length - 1,
                    o = c + 1 < r.paintPhoto.FakeEdges[i].Points.length ? c + 1 : 0,
                    o !== f && r.paintPhoto.FakeEdges[i].Points[o].Added !== !0 && (l.push({
                        Id: r.paintPhoto.FakeEdges[i].Points[o].Id,
                        X: r.paintPhoto.FakeEdges[i].Points[o].X,
                        Y: r.paintPhoto.FakeEdges[i].Points[o].Y,
                        Active: !1
                    }),
                    c = o,
                    r.paintPhoto.FakeEdges[i].Points[o].Added = !0),
                    e !== f && r.paintPhoto.FakeEdges[i].Points[e].Added !== !0 && (l.push({
                        Id: r.paintPhoto.FakeEdges[i].Points[e].Id,
                        X: r.paintPhoto.FakeEdges[i].Points[e].X,
                        Y: r.paintPhoto.FakeEdges[i].Points[e].Y,
                        Active: !1
                    }),
                    c = e,
                    r.paintPhoto.FakeEdges[i].Points[e].Added = !0);
                l.push({
                    Id: r.paintPhoto.FakeEdges[i].Points[f].Id,
                    X: r.paintPhoto.FakeEdges[i].Points[f].X,
                    Y: r.paintPhoto.FakeEdges[i].Points[f].Y,
                    Active: !1
                });
                r.paintPhoto.FakeEdges.splice(i, 1);
                r.paintPhoto.FakeEdges.push({
                    Points: l,
                    ClosedPolygon: !1
                });
                r.lines = r.getLineCoordinates();
                r.paintPhoto.updatePreviousClick(null);
                return
            }
            if (u > 0 && u < r.paintPhoto.FakeEdges[i].Points.length - 1 && f > 0 && f < r.paintPhoto.FakeEdges[i].Points.length - 1) {
                var y = []
                  , p = []
                  , a = angular.copy(r.paintPhoto.FakeEdges[i].Points);
                u > f ? (y = a.slice(0, f + 1),
                p = a.slice(u, a.length)) : (y = a.slice(0, u + 1),
                p = a.slice(f, a.length));
                r.paintPhoto.FakeEdges.splice(i, 1);
                r.paintPhoto.FakeEdges.push({
                    Points: y
                });
                r.paintPhoto.FakeEdges.push({
                    Points: p
                })
            } else
                (u === 0 || f === 0) && (u === 0 ? (r.paintPhoto.FakeEdges[i].Points.splice(u, 1),
                f--) : (r.paintPhoto.FakeEdges[i].Points.splice(f, 1),
                u--)),
                u === r.paintPhoto.FakeEdges[i].Points.length - 1 && r.paintPhoto.FakeEdges[i].Points.splice(u, 1),
                f === r.paintPhoto.FakeEdges[i].Points.length - 1 && r.paintPhoto.FakeEdges[i].Points.splice(f, 1),
                r.paintPhoto.FakeEdges[i].Points.length === 0 && r.paintPhoto.FakeEdges.splice(i, 1);
            r.lines = r.getLineCoordinates();
            r.paintPhoto.updatePreviousClick(null);
            r.cleanActivatedPoints();
            r.paintPhoto.editTouched = !0
        }
    }
    function u(n) {
        n.$on("updateLines", n.model.updateLines)
    }
    var n = angular.module("dcpLite")
      , t = 24
      , i = 24;
    n.directive("line", [function() {
        return {
            templateUrl: "/Versions/Shared/Views/Directives/Line.html",
            controllerAs: "model",
            restrict: "E",
            scope: {},
            require: {
                paintPhoto: "?^^paintPhoto"
            },
            link: u,
            controller: ["gtmDataLayer", r],
            bindToController: !0
        }
    }
    ])
}(),
function() {
    "use strict";
    function r(i) {
        var r = this;
        r.markerEdgeStyle = function(i, u) {
            return {
                left: (i - .5 * n) / r.paintPhoto.CanvasData.Canvas.width * 100 + "%",
                top: (u - .5 * t) / r.paintPhoto.CanvasData.Canvas.height * 100 + "%",
                "background-color": r.point.Active ? "#DCDCDC" : "#FFFFFF"
            }
        }
        ;
        r.serveEdgePointDrag = function(n) {
            for (var i, t = 0; t < r.paintPhoto.FakeEdges.length; t++)
                for (i = 0; i < r.paintPhoto.FakeEdges[t].Points.length; i++)
                    r.paintPhoto.FakeEdges[t].Points[i].Id === n.Id && (r.paintPhoto.FakeEdges[t].Points[i] = n,
                    r.editTouched = !0)
        }
        ;
        r.cleanActivatedPoints = function() {
            for (var t, n = 0; n < r.paintPhoto.FakeEdges.length; n++)
                for (t = 0; t < r.paintPhoto.FakeEdges[n].Points.length; t++)
                    r.paintPhoto.FakeEdges[n].Points[t].Active = !1
        }
        ;
        r.serveEdgePointClick = function(n) {
            var u, s, e, o, t, f;
            for (r.paintPhoto.numEditClicks++,
            t = 0; t < r.paintPhoto.FakeEdges.length; t++)
                for (u = 0; u < r.paintPhoto.FakeEdges[t].Points.length; u++)
                    if (r.paintPhoto.FakeEdges[t].Points[u].Id === n && r.paintPhoto.FakeEdges[t].ClosedPolygon !== !0) {
                        if (s = r.paintPhoto.FakeEdges[t].Points.length - 1,
                        u === 0 || u === s)
                            if (r.paintPhoto.previousClick !== null) {
                                if (r.paintPhoto.previousClick.i !== t) {
                                    for (e = angular.copy(r.paintPhoto.FakeEdges[t].Points),
                                    u === 0 && (e = e.reverse()),
                                    o = angular.copy(r.paintPhoto.FakeEdges[r.paintPhoto.previousClick.i].Points),
                                    r.paintPhoto.previousClick.j !== 0 && (o = o.reverse()),
                                    r.paintPhoto.FakeEdges.push({
                                        Points: e.concat(o)
                                    }),
                                    t > r.paintPhoto.previousClick.i ? (r.paintPhoto.FakeEdges.splice(t, 1),
                                    r.paintPhoto.FakeEdges.splice(r.paintPhoto.previousClick.i, 1)) : (r.paintPhoto.FakeEdges.splice(r.paintPhoto.previousClick.i, 1),
                                    r.paintPhoto.FakeEdges.splice(t, 1)),
                                    r.paintPhoto.FakeEdges[r.paintPhoto.FakeEdges.length - 1].Points.map(function(n) {
                                        n.Active = !1
                                    }),
                                    r.paintPhoto.updatePreviousClick(null),
                                    r.paintPhoto.numMarkers = 0,
                                    t = 0; t < r.paintPhoto.FakeEdges.length; t++)
                                        r.paintPhoto.numMarkers += r.paintPhoto.FakeEdges[t].Points.length;
                                    r.line.joinedTwoLines = !0;
                                    i.event({
                                        event: "gtm.click",
                                        t: "ux",
                                        d1: "paintTool",
                                        d2: "complete edit line"
                                    });
                                    i.event({
                                        event: "paintTool",
                                        t: "paintTool",
                                        d1: "complete edit line",
                                        d2: "edit clicks: " + r.paintPhoto.numEditClicks
                                    });
                                    i.event({
                                        event: "paintTool",
                                        t: "paintTool",
                                        d1: "complete edit line",
                                        d2: "markersIncluded: " + r.paintPhoto.numMarkers
                                    });
                                    i.event({
                                        event: "paintTool",
                                        t: "paintTool",
                                        d1: "complete edit line",
                                        d2: "linesCompleted: " + (r.paintPhoto.numLines + 1)
                                    });
                                    return
                                }
                                if (r.paintPhoto.FakeEdges[t].Points.length > 2 && r.paintPhoto.previousClick.j !== u) {
                                    for (r.paintPhoto.FakeEdges[t].ClosedPolygon = !0,
                                    r.paintPhoto.FakeEdges[t].Points.map(function(n) {
                                        n.Active = !1
                                    }),
                                    r.paintPhoto.updatePreviousClick(null),
                                    r.paintPhoto.numMarkers = 0,
                                    t = 0; t < r.paintPhoto.FakeEdges.length; t++)
                                        r.paintPhoto.numMarkers += r.paintPhoto.FakeEdges[t].Points.length;
                                    i.event({
                                        event: "gtm.click",
                                        t: "ux",
                                        d1: "paintTool",
                                        d2: "complete edit line"
                                    });
                                    i.event({
                                        event: "paintTool",
                                        t: "paintTool",
                                        d1: "complete edit line",
                                        d2: "edit clicks: " + r.paintPhoto.numEditClicks
                                    });
                                    i.event({
                                        event: "paintTool",
                                        t: "paintTool",
                                        d1: "complete edit line",
                                        d2: "markersIncluded: " + r.paintPhoto.numMarkers
                                    });
                                    i.event({
                                        event: "paintTool",
                                        t: "paintTool",
                                        d1: "complete edit line",
                                        d2: "linesCompleted: " + (r.paintPhoto.numLines + 1)
                                    });
                                    i.event({
                                        event: "gtm.click",
                                        t: "ux",
                                        d1: "paintTool",
                                        d2: "edit polygon completed"
                                    });
                                    i.event({
                                        event: "paintTool",
                                        t: "paintTool",
                                        d1: "edit polygon completed",
                                        d2: "edit clicks: " + r.paintPhoto.numEditClicks
                                    });
                                    i.event({
                                        event: "paintTool",
                                        t: "paintTool",
                                        d1: "edit polygon completed",
                                        d2: "markersIncluded: " + r.paintPhoto.numMarkers
                                    });
                                    i.event({
                                        event: "paintTool",
                                        t: "paintTool",
                                        d1: "edit polygon completed",
                                        d2: "linesCompleted: " + (r.paintPhoto.numLines + 1)
                                    });
                                    return
                                }
                                r.paintPhoto.updatePreviousClick(null);
                                f = r.paintPhoto.FakeEdges[t].Points[u].Active;
                                r.cleanActivatedPoints();
                                r.paintPhoto.FakeEdges[t].Points[u].Active = !f
                            } else
                                f = r.paintPhoto.FakeEdges[t].Points[u].Active,
                                r.cleanActivatedPoints(),
                                r.paintPhoto.FakeEdges[t].Points[u].Active = !f,
                                r.paintPhoto.FakeEdges[t].Points[u].Active ? r.paintPhoto.updatePreviousClick({
                                    i: t,
                                    j: u
                                }) : r.paintPhoto.updatePreviousClick(null);
                        u !== 0 && u !== s && (r.paintPhoto.updatePreviousClick(null),
                        r.cleanActivatedPoints())
                    }
        }
    }
    function u(i, r) {
        function c(n) {
            Math.abs(n.pageX - u[0]) < 5 && Math.abs(n.pageY - u[1]) < 5 || (f = !0);
            h = n.pageY - o;
            s = n.pageX - e;
            a(s, h)
        }
        function l(n) {
            Math.abs(n.pageX - u[0]) < 5 && Math.abs(n.pageY - u[1]) < 5 || (f = !0);
            h = n.changedTouches[0].pageY - o;
            s = n.changedTouches[0].pageX - e;
            a(s, h)
        }
        function a(u, f) {
            f > i.model.paintPhoto.CanvasData.Canvas.height / i.model.paintPhoto.CanvasData.Ratio && (f = i.model.paintPhoto.CanvasData.Canvas.height / i.model.paintPhoto.CanvasData.Ratio);
            f < 0 && (f = 0);
            u > i.model.paintPhoto.CanvasData.Canvas.width / i.model.paintPhoto.CanvasData.Ratio && (u = i.model.paintPhoto.CanvasData.Canvas.width / i.model.paintPhoto.CanvasData.Ratio);
            u < 0 && (u = 0);
            angular.element(r[0].children[0]).css({
                top: f - .5 * n + "px",
                left: u - .5 * t + "px",
                opacity: 0
            });
            i.model.point.X = parseInt(u * i.model.paintPhoto.CanvasData.Ratio);
            i.model.point.Y = parseInt(f * i.model.paintPhoto.CanvasData.Ratio);
            i.model.serveEdgePointDrag(i.model.point);
            i.model.line.updateLines();
            i.$apply()
        }
        function v(n) {
            u = [];
            n.preventDefault();
            var t = document.getElementById("ImageCanvas").getBoundingClientRect()
              , i = n.clientX - t.left
              , r = n.clientY - t.top;
            p(i, r);
            angular.element(document).off("mousemove", c);
            angular.element(document).off("mouseup", v)
        }
        function y(n) {
            u = [];
            n.preventDefault();
            var t = document.getElementById("ImageCanvas").getBoundingClientRect()
              , i = n.changedTouches[0].clientX - t.left
              , r = n.changedTouches[0].clientY - t.top;
            p(i, r);
            angular.element(document).off("touchmove", l);
            angular.element(document).off("touchend", y)
        }
        function p(n, t) {
            t > i.model.paintPhoto.CanvasData.Canvas.height / i.model.paintPhoto.CanvasData.Ratio && (t = i.model.paintPhoto.CanvasData.Canvas.height / i.model.paintPhoto.CanvasData.Ratio);
            t < 0 && (t = 0);
            n > i.model.paintPhoto.CanvasData.Canvas.width / i.model.paintPhoto.CanvasData.Ratio && (n = i.model.paintPhoto.CanvasData.Canvas.width / i.model.paintPhoto.CanvasData.Ratio);
            n < 0 && (n = 0);
            i.model.point.X = parseInt(n * i.model.paintPhoto.CanvasData.Ratio);
            i.model.point.Y = parseInt(t * i.model.paintPhoto.CanvasData.Ratio);
            f || i.model.serveEdgePointClick(i.model.point.Id);
            angular.element(r[0].children[0]).css({
                opacity: 1
            });
            i.model.line.updateLines();
            i.model.paintPhoto.editTouched = !0;
            i.$apply();
            f = !1
        }
        var f = !1
          , u = []
          , e = 0
          , o = 0
          , s = i.model.point.X / i.model.paintPhoto.CanvasData.Ratio
          , h = i.model.point.Y / i.model.paintPhoto.CanvasData.Ratio;
        angular.element(r[0]).on("mousedown", function(n) {
            n.preventDefault();
            f = !1;
            u = [n.pageX, n.pageY];
            e = n.pageX - i.model.point.X / i.model.paintPhoto.CanvasData.Ratio;
            o = n.pageY - i.model.point.Y / i.model.paintPhoto.CanvasData.Ratio;
            angular.element(document).on("mousemove", c);
            angular.element(document).on("mouseup", v)
        });
        angular.element(r[0]).on("touchstart", function(n) {
            n.preventDefault();
            f = !1;
            u = [n.targetTouches[0].pageX, n.targetTouches[0].pageY];
            e = n.targetTouches[0].pageX - i.model.point.X / i.model.paintPhoto.CanvasData.Ratio;
            o = n.targetTouches[0].pageY - i.model.point.Y / i.model.paintPhoto.CanvasData.Ratio;
            angular.element(document).on("touchmove", l);
            angular.element(document).on("touchend", y)
        })
    }
    var i = angular.module("dcpLite")
      , n = 20
      , t = 20;
    i.directive("markerEdge", function() {
        return {
            templateUrl: "/Versions/Shared/Views/Directives/MarkerEdge.html",
            controllerAs: "model",
            restrict: "E",
            scope: {
                point: "="
            },
            require: {
                paintPhoto: "?^^paintPhoto",
                line: "?^^line"
            },
            link: u,
            controller: ["gtmDataLayer", r],
            bindToController: !0
        }
    })
}(),
function() {
    "use strict";
    var n = angular.module("dcpLite");
    n.directive("ppgCanvas", ["$rootScope", "$interval", "projectService", "projectImages", function(n, t, i, r) {
        function et() {
            v = !0;
            clearTimeout(d);
            d = setTimeout(function() {
                v = !1
            }, 50)
        }
        function ot() {
            u.style.visibility = "visible";
            o && (l.style.cursor = "pointer")
        }
        function s() {
            u.style.visibility = "hidden";
            var n = f.getContext("2d");
            n.clearRect(0, 0, e, c);
            a = -1;
            o && (l.style.cursor = "auto")
        }
        function st(n, t) {
            if (n.preventDefault(),
            o) {
                var u = n.changedTouches[0]
                  , f = t.Canvas.getBoundingClientRect()
                  , i = u.clientX - f.left
                  , r = u.clientY - f.top;
                i >= 0 && i <= t.Canvas.width && r >= 0 && r <= t.Canvas.height ? g(i, r, t, 30, 30) : s();
                h = new Date
            }
        }
        function ht(n, t) {
            if (n.preventDefault(),
            o) {
                var u = n.changedTouches[0]
                  , f = t.Canvas.getBoundingClientRect()
                  , i = u.clientX - f.left
                  , r = u.clientY - f.top;
                i >= 0 && i <= t.Canvas.width && r >= 0 && r <= t.Canvas.height ? g(i, r, t, 30, 30) : s();
                h = new Date
            }
        }
        function ct(n, t) {
            if (n.preventDefault(),
            o) {
                var u = t.Canvas.getBoundingClientRect()
                  , i = n.clientX - u.left
                  , r = n.clientY - u.top;
                i >= 0 && i <= t.Canvas.width && r >= 0 && r <= t.Canvas.height ? lt(i, r, t, 0, 0) : s();
                h = new Date
            }
        }
        function g(n, t, i) {
            i.Ratio == -1 && (i.Ratio = i.Canvas.width / i.Canvas.getBoundingClientRect().width);
            var r = n
              , u = t;
            n = parseInt(n * i.Ratio);
            t = parseInt(t * i.Ratio);
            i.ShowOverlay && nt(i, n, t)
        }
        function lt(n, t, i, f, e) {
            var w, g, s, h, a, v, c, l, y, p;
            i.Ratio == -1 && (i.Ratio = i.Canvas.width / i.Canvas.getBoundingClientRect().width);
            w = n;
            g = t;
            n = parseInt(n * i.Ratio);
            t = parseInt(t * i.Ratio);
            s = (i.Canvas.width * t + n) * 4;
            h = null;
            h = i.DrawnImageData ? i.DrawnImageData.data : r.Data.DcpImage.CurrentImageData.data;
            var b = h[s]
              , k = h[s + 1]
              , d = h[s + 2]
              , o = u.getContext("2d");
            for (o.clearRect(0, 0, u.width, u.height),
            c = 0,
            l = 0,
            y = -2; y <= 2; y++) {
                for (v = t + y,
                c = 0,
                p = -2; p <= 2; p++)
                    a = n + p,
                    v < 0 || a < 0 || v > i.Canvas.height || a > i.Canvas.width ? (o.beginPath(),
                    o.fillStyle = "rgba(128, 128, 128, 1)",
                    o.fillRect(c, l, 20, 20),
                    o.moveTo(c + 20, l),
                    o.lineTo(c, l + 20),
                    o.strokeStyle = "rgba(255, 0, 0, 1",
                    o.stroke()) : (s = (i.Canvas.width * v + a) * 4,
                    b = h[s],
                    k = h[s + 1],
                    d = h[s + 2],
                    o.beginPath(),
                    o.fillStyle = "rgba(" + b + ", " + k + ", " + d + ", 1)",
                    o.fillRect(c, l, 20, 20),
                    n === a && t === v && (o.moveTo(40, 40),
                    o.lineTo(40, 60),
                    o.lineTo(60, 60),
                    o.lineTo(60, 40),
                    o.lineTo(40, 40),
                    o.strokeStyle = IsDark(b, k, d) ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)"),
                    o.stroke()),
                    c = c + 20;
                l = l + 20
            }
            u.style.left = n > parseInt(i.Canvas.width / 2) ? w - u.width - f + "px" : w + f + "px";
            u.style.top = g - u.width - e + "px";
            ot();
            i.ShowOverlay && nt(i, n, t)
        }
        function nt(n, t, i) {
            for (var s = !1, h, o, u = 0; u < r.Data.DcpImage.Masks.length; u++)
                if (h = (e * i + t) * 4,
                r.Data.DcpImage.Masks[u].MaskData != null && r.Data.DcpImage.Masks[u].MaskData.ImageData != null && r.Data.DcpImage.Masks[u].MaskData.ImageData.data[h + 3] > 0 && (s = !0),
                s && a != r.Data.DcpImage.Masks[u].SurfaceID && (o = f.getContext("2d"),
                o.putImageData(r.Data.DcpImage.Masks[u].MaskData.OverlayData, 0, 0, 0, 0, e, c),
                a = r.Data.DcpImage.Masks[u].SurfaceID),
                s)
                    break;
            s || (o = f.getContext("2d"),
            o.clearRect(0, 0, e, c),
            a = -1)
        }
        function tt(n, t, i) {
            if (o) {
                t = parseInt(t * n.model.CanvasData.Ratio);
                i = parseInt(i * n.model.CanvasData.Ratio);
                n.model.CanvasData.X = t;
                n.model.CanvasData.Y = i;
                var f = n.model.CanvasData.Canvas
                  , h = f.getContext("2d")
                  , r = h.getImageData(0, 0, e, c)
                  , u = (e * i + t) * 4
                  , l = r.data[u]
                  , a = r.data[u + 1]
                  , v = r.data[u + 2];
                n.model.CanvasData.R = l;
                n.model.CanvasData.G = a;
                n.model.CanvasData.B = v;
                n.model.CanvasData.PixelSelected && n.model.CanvasData.R > -1 && n.model.CanvasData.G > -1 && n.model.CanvasData.B > -1 && n.model.CanvasData.PixelSelected();
                n.$apply();
                s()
            }
        }
        var it = "ImageCanvas", rt = "ZoomCanvas", ut = "OverlayCanvas", l = null, u = null, f = null, h = null, w = 2, o = !0, ft = null, a = -1, e = 0, c = 0, y, b, k = !1, p = !1, v = !1, d, at;
        return window.onscroll = et,
        at = t(function() {
            if (h) {
                var t = new Date
                  , n = angular.copy(h);
                n.setSeconds(n.getSeconds() + w);
                n < t && (s(),
                h = null)
            }
        }, w * 1e3),
        {
            restrict: "E",
            templateUrl: "/Versions/Shared/Views/Directives/PPGCanvas.html",
            link: function(n, t) {
                function r(t) {
                    e = n.model.CanvasData.Canvas.width;
                    c = n.model.CanvasData.Canvas.height;
                    n.model.CanvasData.Ratio = t ? -1 : e / n.model.CanvasData.Canvas.getBoundingClientRect().width;
                    f.width = e;
                    f.height = c
                }
                ft = n;
                for (var i = 0; i < t[0].children.length; i++)
                    t[0].children[i].id == it && (l = t[0].children[i],
                    n.model.CanvasData.Canvas = t[0].children[i],
                    n.model.CanvasData.ImageContext = n.model.CanvasData.Canvas.getContext("2d")),
                    t[0].children[i].id == rt && (n.model.CanvasData.ZoomCanvas = t[0].children[i],
                    u = t[0].children[i]),
                    t[0].children[i].id == ut && (f = t[0].children[i]);
                n.model.CanvasData.Ratio = -1;
                n.model.CanvasData.DrawnImageData = null;
                n.model.CanvasData.R = -1;
                n.model.CanvasData.G = -1;
                n.model.CanvasData.B = -1;
                n.model.CanvasData.ResizeOverlay = function() {
                    r(!0)
                }
                ;
                n.model.CanvasData.DrawThisImage = function(t) {
                    n.model.CanvasData.Canvas.height = t.height;
                    n.model.CanvasData.Canvas.width = t.width;
                    n.model.CanvasData.ImageContext.drawImage(t, 0, 0, t.width, t.height);
                    n.model.CanvasData.DrawnImageData = n.model.CanvasData.ImageContext.getImageData(0, 0, t.width, t.height);
                    r(!0)
                }
                ;
                n.model.CanvasData.DisableSelection = function() {
                    u.style.visibility = "hidden";
                    l.style.cursor = "not-allowed";
                    o = !1
                }
                ;
                n.model.CanvasData.EnableSelection = function() {
                    o = !0
                }
                ;
                f.addEventListener("mouseup", function(t) {
                    var i, r, u;
                    t.preventDefault();
                    s();
                    i = n.model.CanvasData.Canvas.getBoundingClientRect();
                    n.model.CanvasData.Ratio = n.model.CanvasData.Canvas.width / n.model.CanvasData.Canvas.getBoundingClientRect().width;
                    r = t.clientX - i.left;
                    u = t.clientY - i.top;
                    tt(n, r, u)
                }, !1);
                f.addEventListener("touchstart", function() {
                    y = new Date;
                    p = !0
                });
                f.addEventListener("touchend", function(t) {
                    t.preventDefault();
                    p = !1;
                    s();
                    var i = t.changedTouches[0]
                      , r = n.model.CanvasData.Canvas.getBoundingClientRect()
                      , u = i.clientX - r.left
                      , f = i.clientY - r.top
                      , e = new Date - y;
                    (e < 300 || k) && !v && (ht(t, n.model.CanvasData),
                    tt(n, u, f))
                }, !1);
                f.addEventListener("mouseleave", function() {
                    s()
                }, !1);
                f.addEventListener("mousemove", function(t) {
                    p || ct(t, n.model.CanvasData, n)
                }, !1);
                f.addEventListener("touchmove", function(t) {
                    v || (b = new Date - y,
                    b >= 300 && (st(t, n.model.CanvasData),
                    k = !0))
                }, !1);
                window.addEventListener("resize", function() {
                    r(!1)
                }, !1);
                window.addEventListener("orientationchange", function() {
                    r(!1)
                }, !1);
                n.model.CanvasData.CanvasBound && n.model.CanvasData.CanvasBound()
            }
        }
    }
    ])
}(),
function() {
    "use strict";
    function t(n, t, i, r, u, f, e, o) {
        var s = this;
        s.$onInit = function() {
            s.PageData = o;
            s.ProjectServ = f;
            s.asModal ? (s.FirstColorSavedID = "FirstColorSavedPopup",
            s.OffsetClass = "") : (s.FirstColorSavedID = "FirstColorSaved",
            s.columncount && (s.index % s.columncount == 0 ? s.OffsetClass = "FirstColorLeft" : (s.index + 1) % s.columncount == 0 && (s.OffsetClass = "FirstColorRight")));
            s.NotifyFirstColor = i.Data.GetLanguageText("Footer.Notification.NotifyFirstColor", "You just saved your first color!");
            s.FirstColorBodyTextUpload = i.Data.GetLanguageText("Footer.Notification.FirstColorBodyUpload", "Save as many colors as you like while your photo is uploading.");
            s.FirstColorBodyText = i.Data.GetLanguageText("Header.SavedColors.NotifyFirstColor", "You just saved your first color. Save as many colors as you like.");
            s.GotItText = i.Data.GetLanguageText("Footer.Notification.GotIt", "Got it")
        }
        ;
        s.Stop = function(n) {
            n.stopPropagation()
        }
        ;
        s.CloseFirstColorModal = function(n) {
            n.stopPropagation();
            s.PageData.Data.FirstColorShowing = !1;
            s.showFirstColor = !1;
            s.PageData.Data.ClearFirstColor()
        }
    }
    var n = angular.module("dcpLite");
    n.component("firstColorModal", {
        templateUrl: "/Versions/V3/Views/Components/Controls/FirstColorModal.html",
        bindings: {
            index: "<",
            columncount: "<",
            asModal: "<",
            showFirstColor: "="
        },
        controllerAs: "model",
        controller: ["$rootScope", "$location", "dsl", "$filter", "$scope", "projectService", "$http", "pageData", "gtmDataLayer", "$window", t]
    })
}(),
function() {
    "use strict";
    var n = angular.module("dcpLite");
    n.component("notificationFooter", {
        require: "^IndexController",
        controllerAs: "model",
        bindings: {
            colorcount: "=",
            color: "="
        },
        templateUrl: "/Versions/V3/Views/Components/Controls/NotificationFooter.html",
        controller: ["$location", "dsl", "$rootScope", "$filter", "$window", "$scope", "projectService", "pageData", "$timeout", "gtmDataLayer", function(t, i, r, u, f, e, o, s, h, c) {
            var l = this;
            l.$onInit = function() {
                l.ShowMe = !1;
                l.ProjectServ = o;
                l.ShowLoaderNotification = !1;
                l.PageData = s;
                l.TapText = i.Data.GetLanguageText("Footer.ColorEntryPoint.TapHere", "TAP HERE.").toUpperCase();
                l.SaveMoreColor = i.Data.GetLanguageText("Footer.ColorEntryPoint.SaveMoreColors", "To save more colors");
                l.UploadingText = i.Data.GetLanguageText("Footer.Notification.Uploading", "Uploading photo...");
                l.FinishedText = i.Data.GetLanguageText("Footer.Notification.Finished", "Your photo is uploaded!");
                l.CompleteText = i.Data.GetLanguageText("Footer.Notification.Complete", "Upload complete!");
                l.NotificationBody = i.Data.GetLanguageText("Footer.Notification.UploadBody", "You can now paint your room or save more colors.");
                l.UseFastUploader = i.Data.InstanceData.UseFastUploader;
                l.userMessage = ""
            }
            ;
            l.SetupActions = function() {
                l.ShowMe = !1;
                l.PageData.Data.CurrentStep === 2 && ((l.ProjectServ.Project.Colors.length > 0 || l.ProjectServ.CustomPhotoUploading) && (l.ShowMe = !0),
                l.PageData.Data.FirstColorConfirmed || l.ProjectServ.Project.Colors.length >= 1);
                (l.PageData.Data.CurrentStep === 3 || l.PageData.Data.CurrentStep === 4 || l.PageData.Data.CurrentStep === 5) && l.ProjectServ.Project.AppliedColors.length > 0 && (l.ShowMe = !0)
            }
            ;
            l.CloseLoaderNotification = function() {
                l.ShowLoaderNotification = !1;
                c.event({
                    event: "gtm.click",
                    t: "ux",
                    d1: "UserInfoMessage",
                    d2: "closed: user photo uploaded notification"
                })
            }
            ;
            l.CloseSaveMoreColors = function() {
                l.PageData.isCreateStockProject = !1;
                c.event({
                    event: "gtm.click",
                    t: "ux",
                    d1: "UserInfoMessage",
                    d2: "closed: save more colors notification"
                })
            }
            ;
            l.AddMoreColors = function() {
                l.PageData.isCreateStockProject = !1;
                c.event({
                    event: "gtm.click",
                    t: "ux",
                    d1: "addMoreColors",
                    d2: l.PageData.Data.CurrentStep
                });
                var r = u("filter")(i.Data.InstanceData.Routes.Items, {
                    NavKey: "color"
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                });
                t.path(r[0].RouteName)
            }
            ;
            e.$watch(function() {
                return l.ProjectServ.Project.AppliedColors ? l.ProjectServ.Project.AppliedColors.length : 0
            }, function() {
                l.SetupActions()
            });
            e.$watch(function() {
                return l.ProjectServ.CustomPhotoFinished
            }, function(n) {
                n === !0 && (l.ShowLoaderNotification = !0,
                l.PageData.Data.FirstColorShowing && (l.PageData.Data.FirstColorShowing = !1,
                l.PageData.Data.ClearFirstColor()),
                h(function() {
                    l.ProjectServ.CustomPhotoFinished = !1
                }, 2e3))
            });
            e.$watch(function() {
                return l.ProjectServ.Project.Colors ? l.ProjectServ.Project.Colors.length : 0
            }, function() {
                l.SetupActions()
            });
            e.$watch(function() {
                return l.ProjectServ.Project.id ? l.ProjectServ.Project.id : ""
            }, function(n, t) {
                n !== t && (l.SetupActions(),
                l.PageData.Data.FirstColorConfirmed = l.ProjectServ.Project.Colors.length > 0 ? !0 : !1)
            });
            e.$watch(function() {
                return l.PageData.Data ? l.PageData.Data.CurrentStep : 0
            }, function(n, t) {
                n !== t && (l.SetupActions(),
                l.PageData.Data.InfoMessage = "",
                l.PageData.Data.CurrentStep === 2 && (l.PageData.Data.FirstColorConfirmed || l.ProjectServ.Project.Colors >= 1))
            })
        }
        ]
    })
}(),
function() {
    "use strict";
    var n = angular.module("dcpLite");
    n.directive("scrollfade", ["$document", "$timeout", "$window", function(n, t, i) {
        function r(n, r) {
            var u = r[0]
              , e = r[0].children[0]
              , o = r.parent()[0].children[1]
              , f = r.parent()
              , s = 75
              , h = 0
              , c = 274;
            e.style.height = "0px";
            (f[0].offsetWidth == 295 || f[0].offsetWidth == 246) && (c = f[0].offsetHeight - 1);
            n.$watch("checkstep", function(n) {
                e.style.top = n === 3 ? null : "75px"
            });
            n.$watch(function() {
                return u.offsetHeight
            }, function(n) {
                o.style.visibility = n >= 275 ? "visible" : "hidden"
            });
            t(function() {
                angular.element(i).bind("resize", function() {
                    c = f[0].offsetWidth == 295 || f[0].offsetWidth == 246 ? f[0].offsetHeight - 1 : 274;
                    h = u.scrollHeight - (u.scrollTop + c)
                })
            });
            r.bind("scroll", function() {
                h = u.scrollHeight - (u.scrollTop + c);
                o.style.height = h < s ? h.toString() + "px" : s.toString() + "px";
                e.style.height = u.scrollTop < s ? u.scrollTop.toString() + "px" : s.toString() + "px"
            })
        }
        return {
            link: r,
            restrict: "A",
            scope: {
                checkstep: "=scrollfade"
            },
            controller: [function() {}
            ]
        }
    }
    ]);
    n.directive("navcloseonpaint", ["$document", "$timeout", function(n, t) {
        function i(n, i) {
            var u = i.parent().parent().parent().parent().parent().parent().parent()[0].children[2]
              , r = i.parent().parent().parent().parent();
            i.bind("click", function() {
                t(function() {
                    r && r[0].classList.contains("nav-slideDown") && (r[0].classList.add("nav-slideUp"),
                    r[0].classList.remove("nav-slideDown"))
                })
            })
        }
        return {
            link: i,
            restrict: "A",
            controller: [function() {}
            ]
        }
    }
    ]);
    n.directive("closemodal", ["$document", "$timeout", function(n, t) {
        function i(n, i) {
            i.on("click", function() {
                t(function() {
                    for (var r = i[0].getElementsByClassName("nav-slideDown"), u, t, n = 0; n < r.length; n++)
                        r[n].classList.add("nav-slideUp"),
                        r[n].classList.remove("nav-slideDown");
                    u = i[0].children[0].children[0];
                    t = i.parent().parent().parent().parent();
                    u.offsetWidth > 0 && u.offsetHeight > 0 ? t[0] && (t[0].style.height = "55px") : t[0] && (t[0].style.height = "70px");
                    document.body.style.cursor = null
                })
            })
        }
        return {
            link: i,
            restrict: "A",
            scope: {
                removeitem: "="
            },
            controller: [function() {}
            ]
        }
    }
    ]);
    n.directive("showsavedcolors", ["$document", "$window", function() {
        function n(n, t) {
            var i = t[0].children[1]
              , r = t.parent().parent().parent().parent().parent().parent()
              , f = t.parent().parent()[0].children["nav-menuTab"].children["nav-menuTabIconText"]
              , u = t.parent().parent()[0].children.progressBar
              , e = t[0].children[0].children[0];
            n.$watch("colorcounter", function() {
                n.colorcounter > 0 ? e.classList.add("plusOne") : e.classList.remove("plusOne")
            });
            n.$watch("currentstep", function() {
                if (n.currentstep === 3 && i.classList.contains("nav-slideDown")) {
                    var t = r[0].offsetHeight + 75;
                    r[0].style.height = t + "px"
                }
            });
            t.bind("click", function() {
                var n, t;
                u.classList.contains("nav-slideDown") && (u.classList.add("nav-slideUp"),
                u.classList.remove("nav-slideDown"));
                i.classList.contains("nav-slideDown") ? (i.classList.remove("nav-slideDown"),
                i.className += " nav-slideUp",
                document.body.style.cursor = null) : (i.classList.contains("nav-slideUp") && (i.classList.remove("nav-slideUp"),
                n = 85,
                f.offsetWidth > 0 && f.offsetHeight > 0 && (n = 70),
                t = i.offsetHeight + n + "px",
                r[0].style.height = t),
                i.className += " nav-slideDown",
                document.body.style.cursor = "pointer")
            })
        }
        return {
            link: n,
            restrict: "A",
            scope: {
                colorcounter: "=showsavedcolors",
                currentstep: "="
            },
            controller: [function() {}
            ]
        }
    }
    ]);
    n.directive("stickymodal", ["$document", "$window", "$timeout", function(n, t, i) {
        function r(n, r) {
            var u = r[0], s = r.parent(), f, e, o = r.parent().parent().parent().parent().parent().parent().parent(), c = o.parent().parent().parent(), h = r.parent().parent().parent()[0].children["nav-menuTab"].children["nav-menuTabIconText"];
            u.offsetWidth <= 205 && u.classList.remove("nav-slideUp");
            (u.offsetWidth == 295 || u.offsetWidth == 246) && (u.classList.contains("nav-slideUp") ? (f = !0,
            e = !1,
            u.classList.remove("nav-slideUp")) : u.classList.contains("nav-slideDown") && (u.classList.remove("nav-slideDown"),
            f = !1,
            e = !0));
            i(function() {
                var n = window.pageXOffset !== undefined
                  , i = (document.compatMode || "") === "CSS1Compat"
                  , l = o[0].offsetTop + o[0].offsetHeight
                  , h = o[0].offsetTop;
                c[0].style.height = o[0].style.height;
                angular.element(t).bind("scroll", function() {
                    var t = n ? window.pageYOffset : i ? document.documentElement.scrollTop : document.body.scrollTop;
                    o[0].offsetWidth > 949 && (t >= h ? s[0].classList.add("stick") : s[0].classList.remove("stick"))
                });
                angular.element(t).bind("resize", function() {
                    var t = n ? window.pageYOffset : i ? document.documentElement.scrollTop : document.body.scrollTop;
                    (u.offsetWidth == 295 || u.offsetWidth == 246) && (t >= h ? s[0].classList.add("stick") : s[0].classList.remove("stick"),
                    u.classList.contains("nav-slideUp") ? (f = !0,
                    e = !1,
                    u.classList.remove("nav-slideUp")) : u.classList.contains("nav-slideDown") && (r[0].classList.remove("nav-slideDown"),
                    f = !1,
                    e = !0))
                })
            });
            r.on("transitionend webkitTransitionEnd mozTransitionEnd oTransitionEnd", function() {
                var n, t;
                u.offsetWidth == 295 || u.offsetWidth == 246 ? u.classList.contains("nav-slideUp") ? (f = !0,
                e = !1,
                u.classList.remove("nav-slideUp")) : u.classList.contains("nav-slideDown") && (r[0].classList.remove("nav-slideDown"),
                f = !1,
                e = !0) : (f ? u.classList.contains("nav-slideUp") || (u.className += " nav-slideUp",
                f = !1) : e && (u.classList.contains("nav-slideDown") || (u.className += " nav-slideDown",
                e = !1,
                n = 85,
                h.offsetWidth > 0 && h.offsetHeight > 0 && (n = 70),
                t = u.offsetHeight + n + "px",
                o[0].style.height = t)),
                u.classList.contains("nav-slideUp") || u.classList.contains("nav-slideDown") || (u.className += " nav-slideUp",
                f = !1,
                e = !1))
            })
        }
        return {
            link: r,
            restrict: "A",
            controller: [function() {}
            ]
        }
    }
    ]);
    n.component("savedColors", {
        require: "^IndexController",
        controllerAs: "model",
        bindings: {
            colorcount: "=",
            color: "="
        },
        templateUrl: "/Versions/V3/Views/Components/Controls/SavedColors.html",
        controller: ["$location", "dsl", "$rootScope", "$filter", "$window", "$scope", "projectService", "pageData", "$timeout", "gtmDataLayer", function(t, i, r, u, f, e, o, s, h, c) {
            var l = this;
            l.$onInit = function() {
                l.ProjectServ = o;
                l.PageData = s;
                l.noSavedColors = i.Data.GetLanguageText("Header.SavedColors.NoColors", "You haven't saved any colors yet.");
                l.noAppliedColors = i.Data.GetLanguageText("Header.SavedColors.NoPaint", "Click a wall to paint the selected color.");
                l.SavedColorsTitle = i.Data.GetLanguageText("Mycolors.Header", "Saved Colors");
                l.SaveProjectText = i.Data.GetLanguageText("Review.TabTitle.SaveProject", "Save Project");
                l.userMessage = "";
                l.SaveMoreColorsText = i.Data.GetLanguageText("Header.SavedColors.SaveMoreColors", "SAVE MORE COLORS").toUpperCase();
                l.UploadingText = i.Data.GetLanguageText("Footer.Notification.Uploading", "Uploading photo...");
                l.CompleteText = i.Data.GetLanguageText("Footer.Notification.Complete", "Upload complete!");
                l.ShowSavedColors = l.PageData.Data.CarryColor
            }
            ;
            l.SetupActions = function() {
                l.userMessage = "";
                l.PageData.Data.CurrentStep === 2 ? l.ProjectServ.Project.Colors.length <= 0 && (l.userMessage = i.Data.GetLanguageText("Header.SavedColors.NoColors", "You haven't saved any colors yet.")) : l.PageData.Data.CurrentStep === 3 && (l.ProjectServ.Project.Colors.length <= 0 ? l.userMessage = i.Data.GetLanguageText("Header.SavedColors.NoColors", "You haven't saved any colors yet.") : l.ProjectServ.Project.AppliedColors.length <= 0 && (l.userMessage = i.Data.GetLanguageText("Header.SavedColors.NoPaint", "Click a wall to paint the selected color.")))
            }
            ;
            e.$watch(function() {
                return l.ProjectServ.Project.AppliedColors ? l.ProjectServ.Project.AppliedColors.length : 0
            }, function() {
                l.SetupActions()
            });
            e.$watch(function() {
                return l.ProjectServ.Project.Colors ? l.ProjectServ.Project.Colors.length : 0
            }, function() {
                l.SetupActions()
            });
            e.$watch(function() {
                return l.ProjectServ.Project.id ? l.ProjectServ.Project.id : ""
            }, function(n, t) {
                n !== t && l.SetupActions()
            });
            e.$watch(function() {
                return l.PageData.Data ? l.PageData.Data.CurrentStep : 0
            }, function(n, t) {
                if (n !== t)
                    if (l.SetupActions(),
                    l.ShowSavedColors = !1,
                    l.PageData.Data.SelectedColor = null,
                    l.PageData.Data.CurrentStep === 2)
                        l.ShowSavedColors = !0,
                        l.ColorClicked = function(n, t) {
                            n.preventDefault();
                            n.stopPropagation();
                            c.event({
                                event: "gtm.click",
                                t: "ux",
                                d1: "savedColors-click",
                                d2: l.PageData.Data.CurrentStep
                            });
                            r.$emit("displayModal", {
                                colorID: t.Color.ColorID
                            })
                        }
                        ;
                    else if (l.PageData.Data.CurrentStep === 3) {
                        if (l.ShowSavedColors = !0,
                        !l.PageData.Data.SelectedColor && l.ProjectServ.Project.Colors.length > 0) {
                            var u = i.Data.InstanceColors.GetColor({
                                ColorID: l.ProjectServ.Project.Colors[l.ProjectServ.Project.Colors.length - 1]
                            });
                            u && (l.PageData.Data.SelectedColor = u)
                        }
                        l.ColorClicked = function(n, t) {
                            n.stopPropagation();
                            l.PageData.Data.SelectedColor = t.Color;
                            c.event({
                                event: "gtm.click",
                                t: "ux",
                                d1: "savedColors-click",
                                d2: l.PageData.Data.CurrentStep
                            })
                        }
                    }
            });
            e.$watch(function() {
                if (l.PageData.Data)
                    return l.PageData.Data.CarryColor
            }, function(n, t) {
                if (n !== t && (l.ShowSavedColors = l.PageData.Data.CarryColor,
                l.PageData.Data.SelectedColor = null,
                !l.PageData.Data.SelectedColor && l.ProjectServ.Project.Colors.length > 0)) {
                    var r = i.Data.InstanceColors.GetColor({
                        ColorID: l.ProjectServ.Project.Colors[l.ProjectServ.Project.Colors.length - 1]
                    });
                    r && (l.PageData.Data.SelectedColor = r)
                }
            });
            l.getColorById = function(n) {
                var t, r;
                return (l.ProjectServ.Project.Colors,
                t = i.Data.InstanceColors.Colors.Items.filter(function(t) {
                    return t.ColorID == n
                })[0],
                t == undefined) ? (r = l.ProjectServ.Project.Colors.indexOf(n),
                r > -1 && l.ProjectServ.Project.Colors.splice(r, 1),
                null) : {
                    Color: t,
                    IsDarkCss: l.GetIsDarkCss(t),
                    RemoveColor: function(n) {
                        function f() {
                            o.SaveProject(t, t)
                        }
                        var t, u, r;
                        n.stopPropagation();
                        t = function(n) {
                            o.SetSaveProjectResult(n.data)
                        }
                        ;
                        l.PageData.Data.LastDeletedColor = this.Color;
                        o.RemoveColorFromProject(this.Color);
                        u = l.ProjectServ.Project.Colors.indexOf(this.Color.ColorID);
                        l.ProjectServ.Project.Colors.splice(u, 1);
                        l.PageData.Data.SelectedColor && l.PageData.Data.SelectedColor.ColorID == this.Color.ColorID && (l.PageData.Data.SelectedColor = null,
                        l.ProjectServ.Project.Colors.length > 0 && (r = i.Data.InstanceColors.GetColor({
                            ColorID: l.ProjectServ.Project.Colors[l.ProjectServ.Project.Colors.length - 1]
                        }),
                        r && (l.PageData.Data.SelectedColor = r)));
                        c.event({
                            event: "gtm.click",
                            t: "ux",
                            d1: "removeColor",
                            d2: "savedColors"
                        });
                        f()
                    }
                }
            }
            ;
            l.GetIsDarkCss = function(n) {
                var t = "";
                return n.IsDark && (t = "isDark"),
                t
            }
            ;
            l.AddMoreColors = function() {
                var r = u("filter")(i.Data.InstanceData.Routes.Items, {
                    NavKey: "color"
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                });
                t.path(r[0].RouteName)
            }
        }
        ]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o, s, h) {
        var c = this;
        c.GoodImage = n.BlobStorageUrl + n.InstanceAssetsFrom + "/good.jpg";
        c.DarkImage = n.BlobStorageUrl + n.InstanceAssetsFrom + "/dark.jpg";
        c.FarImage = n.BlobStorageUrl + n.InstanceAssetsFrom + "/tooFar.jpg";
        c.text = {
            tips: {
                title: r.Data.GetLanguageText("Tip.Notification.Header", "Tips for Uploading Your Photo"),
                welllit: r.Data.GetLanguageText("Tip.Notification.WellLit", "Your photo should be well-lit."),
                distance: r.Data.GetLanguageText("Tip.Notification.Distance", "Take your photo 5ft-8ft from your wall.")
            },
            button: r.Data.GetLanguageText("Tip.Notification.UploadPhoto", "Upload Photo")
        };
        c.showModal = !1;
        t.$on("showTipModal", function() {
            c.showModal = !0;
            h.event({
                event: "gtm.click",
                t: "uploadPhoto",
                d1: "ctaClick"
            })
        });
        t.$on("cancelTipModal", function() {
            c.showModal && h.event({
                event: "gtm.click",
                t: "uploadPhoto",
                d1: "exitModal"
            });
            c.showModal = !1
        });
        c.cancelModal = function() {
            c.showModal && h.event({
                event: "gtm.click",
                t: "uploadPhoto",
                d1: "exitModal"
            });
            c.showModal = !1
        }
        ;
        c.GetImage = function() {
            h.event({
                event: "gtm.click",
                t: "userPhoto",
                d1: "upload",
                d2: "upload"
            });
            document.getElementById("ImagePicker").click()
        }
    }
    var n = angular.module("dcpLite");
    n.component("tipModal", {
        templateUrl: "/Versions/V3/Views/Components/Controls/TipModal.html",
        transclude: !0,
        controllerAs: "model",
        controller: ["$rootScope", "$location", "dsl", "$filter", "$scope", "projectService", "$http", "pageData", "gtmDataLayer", "$window", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f) {
        var e = this;
        e.showImage = !1;
        e.showUpload = !1;
        e.PageData = f;
        e.PageData.Data.CarryColor = !0;
        e.showTipModal = !0;
        e.$onInit = function() {
            e.PageData.Data.CurrentStep = 1;
            e.termsChecked = !1;
            e.checkIcon = "check_box_outline_blank";
            e.text = {
                headline: {
                    header: t.Data.GetLanguageText("UploadPhoto.pageTitle", "Upload Your Own Photo")
                },
                backlink: {
                    text: t.Data.GetLanguageText("UploadPhoto.BackUrlLabel", "Explore Different Photos"),
                    url: "/"
                },
                button: t.Data.GetLanguageText("UploadPhoto.SelectPhotoButton", "Select Photo to Upload"),
                tips: {
                    title: t.Data.GetLanguageText("Tip.Notification.Header", "Tips for Uploading Your Photo"),
                    welllit: t.Data.GetLanguageText("Tip.Notification.WellLit", "Your photo should be well-lit."),
                    distance: t.Data.GetLanguageText("Tip.Notification.Distance", "Take your photo 5ft-8ft from your wall.")
                }
            };
            e.DragPhotoLabel = t.Data.GetLanguageText("UploadPhoto.DragPhotoLabel", "Drag your photo here or ");
            e.ClickToBrowseLabel = t.Data.GetLanguageText("UploadPhoto.ClickToBrowse", "click here to browse");
            e.TermsOfUseCtaText = t.Data.GetLanguageText("UploadPhoto.TermsOfUseCta", "I Accept PPG's Terms of Use");
            e.TnCLabel = t.Data.GetLanguageText("UploadPhoto.TermsConditionsLabel", "View Full Terms of Use");
            e.TnCUrl = t.Data.GetLanguageText("UploadPhoto.TermsConditionsUrl", "http://www.ppgac.com/privacy-policy/");
            e.TapToUpload = t.Data.GetLanguageText("UploadPhoto.tapToUpload", "Tap to upload your photo");
            e.GoodImage = n.BlobStorageUrl + n.InstanceAssetsFrom + "/good.jpg";
            e.DarkImage = n.BlobStorageUrl + n.InstanceAssetsFrom + "/dark.jpg";
            e.FarImage = n.BlobStorageUrl + n.InstanceAssetsFrom + "/tooFar.jpg";
            i.$broadcast("waitEnd")
        }
        ;
        u.LoadColorList("addColor");
        e.AcceptTerms = function(n) {
            n.preventDefault();
            e.showUpload = !0;
            r.event({
                event: "gtm.click",
                t: "userPhoto",
                d1: "acceptTerms"
            });
            var t = null;
            setTimeout(function() {
                t = document.getElementById("UploadFormContainer");
                t.className += " UploadAcceptedForm"
            }, 100)
        }
        ;
        e.imageSelected = function(n, t) {
            e.isFileUploaded = !0;
            t && r.event({
                event: "gtm.click",
                t: "userPhoto",
                d1: "upload",
                d2: "dragdrop"
            });
            var i = new Image
              , f = window.URL || window.webkitURL
              , u = URL.createObjectURL(n);
            i.onload = function() {
                i.src = u
            }
        }
        ;
        e.GetImage = function() {
            r.event({
                event: "gtm.click",
                t: "userPhoto",
                d1: "upload",
                d2: "upload"
            });
            document.getElementById("ImagePicker").click()
        }
        ;
        e.UpdateCheckBox = function() {
            e.termsChecked = !e.termsChecked;
            e.termsChecked ? (r.event({
                event: "gtm.click",
                t: "userPhoto",
                d1: "acceptTerms"
            }),
            e.checkIcon = "check_box") : e.checkIcon = "check_box_outline_blank"
        }
        ;
        e.OpenUploadModal = function() {
            i.$broadcast("showTipModal")
        }
        ;
        e.cancelModal = function(n) {
            n.preventDefault();
            angular.element(document.getElementsByClassName("main-content")[0]).attr("aria-hidden", "false");
            e.showTipModal = !1
        }
    }
    var n = angular.module("dcpLite");
    n.component("uploadPhoto", {
        templateUrl: "/Versions/V3/Views/Components/Routes/UploadPhoto.html",
        controllerAs: "model",
        controller: ["dsl", "$rootScope", "gtmDataLayer", "projectService", "pageData", t]
    })
}(),
function() {
    "use strict";
    function t(t, i, r, u, f, e, o, s, h) {
        function l(n, t) {
            return n.x == t.x && n.y == t.y && n.height == t.height && n.width == t.width
        }
        var c = this;
        c.firstLoad = !0;
        c.initialCropperData;
        c.finalCropperData;
        c.$onInit = function() {
            s.Data.CurrentStep = 1;
            s.Data.CarryColor = !0;
            u.$broadcast("cancelTipModal");
            c.text = {
                headline: {
                    header: t.Data.GetLanguageText("UploadPhoto.photoEditorTitle", "Rotate or Crop Your Photo")
                },
                backlink: {
                    text: t.Data.GetLanguageText("UploadResult.BackUrlLabel", "Change Your Photo"),
                    url: "/UploadPhoto"
                }
            };
            c.nextActionLabel = t.Data.GetLanguageText("UploadPhoto.nextActionLabel", "Next Step: Select Colors");
            c.ResetLabel = t.Data.GetLanguageText("UploadPhoto.ResetLabel", "Reset");
            c.RotateLabel = t.Data.GetLanguageText("UploadPhoto.RotateLabel", "Rotate");
            c.CropLabel = t.Data.GetLanguageText("UploadPhoto.CropLabel", "Crop");
            c.UseFastUploader = t.Data.InstanceData.UseFastUploader;
            e.Project.ColorList.length > 0 && (c.nextActionLabel = t.Data.GetLanguageText("UploadPhoto.workflowNextActionLabel", "Paint Your Project"));
            c.imageUrl = e.LastUploadedImage;
            var n = document.getElementById("image");
            n.onload = function() {
                var n, t, i;
                c.firstLoad && (n = new Image,
                n.src = e.LastUploadedImage,
                t = c.canvas,
                t.height = n.height,
                t.width = n.width,
                i = t.getContext("2d"),
                i.drawImage(n, 0, 0, n.width, n.height),
                c.firstLoad = !1,
                c.InitializeCrop())
            }
        }
        ;
        c.angle = 90;
        c.cropper = null;
        c.isTouch = angular.element(document.getElementsByTagName("html")[0]).hasClass("touchevents");
        c.preRotatedImage = null;
        c.InitializeCrop = function() {
            for (var u = "tab-content-2", t = angular.element(document.getElementById("UploadResultCrop")), i = document.querySelectorAll(".tab.title"), r = document.querySelectorAll(".tab-content"), n = 0; n < i.length; n++)
                i[n] != t && (i[n].className = i[n].className.replace(/is-active/gi, ""));
            for (n = 0; n < r.length; n++)
                r[n] != document.getElementById(u) && (r[n].className = r[n].className.replace(/is-visible/gi, ""));
            t.toggleClass("is-active");
            angular.element(document.getElementById(u)).toggleClass("is-visible");
            t.hasClass("is-active") && t[0].dataset.tool == "crop" ? c.onStartCrop() : (t.hasClass("is-active") || t[0].dataset.tool != "crop") && (t[0].dataset.tool == "crop" || c.cropper == null) || c.cropper.destroy()
        }
        ;
        c.tab = function(n) {
            var t;
            h.event({
                event: "gtm.click",
                t: "userPhoto",
                d1: "edit",
                d2: "crop"
            });
            var f = n.currentTarget.dataset.tab
              , u = angular.element(n.currentTarget)
              , i = document.querySelectorAll(".tab.title")
              , r = document.querySelectorAll(".tab-content");
            for (t = 0; t < i.length; t++)
                i[t] != n.currentTarget && (i[t].className = i[t].className.replace(/is-active/gi, ""));
            for (t = 0; t < r.length; t++)
                r[t] != document.getElementById(f) && (r[t].className = r[t].className.replace(/is-visible/gi, ""));
            u.toggleClass("is-active");
            angular.element(document.getElementById(f)).toggleClass("is-visible");
            u.hasClass("is-active") && n.currentTarget.dataset.tool == "crop" ? c.onStartCrop() : (u.hasClass("is-active") || n.currentTarget.dataset.tool != "crop") && (n.currentTarget.dataset.tool == "crop" || c.cropper == null) || c.cropper.destroy()
        }
        ;
        c.onCancel = function() {
            for (var t = document.querySelectorAll(".is-active"), i = document.querySelectorAll(".is-visible"), r, n = 0; n < t.length; n++)
                t[n].className = t[n].className.replace(/is-active/gi, ""),
                t[n].dataset.tool == "crop" && c.cropper != null && c.cropper.destroy(),
                t[n].dataset.tool == "rotate" && (r = c.canvas.getContext("2d"),
                r.clearRect(0, 0, c.canvas.width, c.canvas.height),
                c.canvas.height = c.preRotatedImage.height,
                c.canvas.width = c.preRotatedImage.width,
                r.drawImage(c.preRotatedImage, 0, 0, c.preRotatedImage.width, c.preRotatedImage.height),
                document.getElementById("image").src = c.canvas.toDataURL("image/jpeg", 1));
            for (n = 0; n < i.length; n++)
                i[n].className = i[n].className.replace(/is-visible/gi, "");
            c.InitializeCrop()
        }
        ;
        c.createCanvas = function(n, t) {
            var i = document.createElement("canvas");
            return i.width = n,
            i.height = t,
            i
        }
        ;
        c.resetPhoto = function(n) {
            var t, i;
            h.event({
                event: "gtm.click",
                t: "userPhoto",
                d1: "edit",
                d2: "reset"
            });
            t = new Image;
            t.src = e.LastUploadedImage;
            i = c.canvas.getContext("2d");
            i.clearRect(0, 0, c.canvas.width, c.canvas.height);
            c.canvas.width = t.width;
            c.canvas.height = t.height;
            i.drawImage(t, 0, 0, t.width, t.height);
            document.getElementById("image").src = e.LastUploadedImage;
            c.onCancel(n)
        }
        ;
        c.onConfirmRotate = function() {
            var t, i, n;
            for (c.preRotatedImage = null,
            t = document.querySelectorAll(".is-active"),
            i = document.querySelectorAll(".is-visible"),
            n = 0; n < t.length; n++)
                t[n].className = t[n].className.replace(/is-active/gi, ""),
                t[n].dataset.tool == "crop" && c.cropper != null && c.cropper.destroy();
            for (n = 0; n < i.length; n++)
                i[n].className = i[n].className.replace(/is-visible/gi, "")
        }
        ;
        c.onConfirm = function(n) {
            for (var i = document.querySelectorAll(".is-active"), r = document.querySelectorAll(".is-visible"), t = 0; t < i.length; t++)
                i[t].className = i[t].className.replace(/is-active/gi, ""),
                i[t].dataset.tool == "crop" && c.cropper != null && c.onFinishCrop(),
                i[t].dataset.tool == "rotate" && c.onConfirmRotate();
            if (c.UseFastUploader && (e.Project.ColorList.length == 0 || e.Project.ColorList == null))
                c.onDoneFast(n);
            else
                c.onDone(n)
        }
        ;
        c.canvas = c.createCanvas(1, 1);
        c.onRotate = function() {
            var r, n, t, i;
            h.event({
                event: "gtm.click",
                t: "userPhoto",
                d1: "edit",
                d2: "rotate"
            });
            c.cropper && c.cropper.rotate(c.angle);
            c.preRotatedImage == null && (c.preRotatedImage = c.createCanvas(c.canvas.width, c.canvas.height),
            r = c.preRotatedImage.getContext("2d"),
            r.drawImage(c.canvas, 0, 0, c.canvas.width, c.canvas.height));
            n = c.createCanvas(c.canvas.height, c.canvas.width);
            t = n.getContext("2d");
            t.save();
            c.angle === 90 || c.angle === 270 ? (n.height = c.canvas.width,
            n.width = c.canvas.height,
            t.translate(c.canvas.height / 2, c.canvas.width / 2)) : (n.height = c.canvas.height,
            n.width = c.canvas.width,
            t.translate(c.canvas.width / 2, c.canvas.height / 2));
            t.rotate(c.angle * Math.PI / 180);
            t.drawImage(c.canvas, -(c.canvas.width / 2), -(c.canvas.height / 2));
            t.restore();
            i = c.canvas.getContext("2d");
            i.clearRect(0, 0, c.canvas.width, c.canvas.height);
            c.canvas.height = n.height;
            c.canvas.width = n.width;
            i.drawImage(n, 0, 0, n.width, n.height);
            document.getElementById("image").src = n.toDataURL("image/jpeg", 1)
        }
        ;
        c.onStartCrop = function() {
            var n = document.getElementById("image");
            c.cropper = new Cropper(n,{
                zoomable: !0,
                cropBoxMovable: !0,
                cropBoxResizable: !0,
                scalable: !0,
                movable: !0,
                autoCropArea: 1,
                initialAspectRatio: 1,
                aspectRatio: 1,
                rotatable: !0,
                checkOrientation: !0,
                dragMode: "move",
                viewMode: 1
            });
            c.initialCropperData = c.cropper.getData()
        }
        ;
        c.onFinishCrop = function() {
            var t = c.cropper.getCroppedCanvas().toDataURL("image/jpeg")
              , n = c.canvas.getContext("2d");
            n.clearRect(0, 0, c.canvas.width, c.canvas.height);
            c.canvas.height = c.cropper.getCroppedCanvas().height;
            c.canvas.width = c.cropper.getCroppedCanvas().width;
            n.drawImage(c.cropper.getCroppedCanvas(), 0, 0, c.cropper.getCroppedCanvas().width, c.cropper.getCroppedCanvas().height);
            document.getElementById("image").src = t;
            c.finalCropperData = c.cropper.getData();
            c.cropper.destroy();
            l(c.initialCropperData, c.finalCropperData) || h.event({
                event: "gtm.click",
                t: "userPhoto",
                d1: "edit",
                d2: "crop"
            });
            c.onCancel()
        }
        ;
        c.onDone = function(f) {
            var s, l;
            f.preventDefault();
            u.$broadcast("waitStart");
            s = c.canvas.toDataURL("image/jpeg", 1);
            c.NotificationTitle = t.Data.GetLanguageText("UploadPhoto.UploadingImage", "Uploading Image");
            var a = {
                headers: {
                    DcpApiToken: _ApiToken,
                    DcpSessionID: _SessionID,
                    "Content-Type": "application/json"
                }
            }
              , v = function(r) {
                var u;
                console.log(r);
                e.NewProject(r.data.id);
                e.Project.Colors = r.data.Colors;
                e.Project.ColorList = r.data.ColorList;
                e.Project.Created = r.data.Created;
                i.search("projectid", e.Project.id);
                e.Project.ColorList && e.Project.ColorList.length > 0 ? (u = o("filter")(t.Data.InstanceData.Routes.Items, {
                    NavKey: "paint",
                    Template: "<paint-photo><\/paint-photo>"
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                }),
                i.path(u[0].RouteName)) : (u = o("filter")(t.Data.InstanceData.Routes.Items, {
                    NavKey: "color"
                }, function(t, i) {
                    return n.LowerCaseCompare(t, i)
                }),
                i.path(u[0].RouteName))
            }
              , y = function(n) {
                console.log(n)
            }
              , h = e.Project;
            h.Base64 = s.split(",")[1];
            l = JSON.stringify(h);
            r.post("/api/UploadPhoto", l, a).then(v, y)
        }
        ;
        c.onDoneFast = function(u) {
            var s, f, l;
            u.preventDefault();
            s = c.canvas.toDataURL("image/jpeg", 1);
            c.NotificationTitle = t.Data.GetLanguageText("UploadPhoto.UploadingImage", "Uploading Image");
            var h = {
                headers: {
                    DcpApiToken: _ApiToken,
                    DcpSessionID: _SessionID,
                    "Content-Type": "application/json"
                }
            }
              , a = function(n) {
                var t, i;
                e.NewProject(n.data.id);
                e.Project.Colors = n.data.Colors;
                e.Project.ColorList = n.data.ColorList;
                e.Project.Created = n.data.Created;
                t = e.Project;
                t.Base64 = s.split(",")[1];
                t.id = n.data.id;
                i = JSON.stringify(t);
                r.post("/api/UploadPhotoFast", i, h).then(v, p)
            }
              , v = function() {
                e.CustomPhotoUploading = !1;
                e.CustomPhotoFinished = !0
            }
              , y = function(n) {
                console.log(n)
            }
              , p = function(n) {
                console.log(n)
            }
              , w = e.Project;
            e.CustomPhotoUploading = !0;
            e.Project.ColorList && e.Project.ColorList.length > 0 ? (f = o("filter")(t.Data.InstanceData.Routes.Items, {
                NavKey: "paint",
                Template: "<paint-photo><\/paint-photo>"
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            }),
            i.path(f[0].RouteName)) : (f = o("filter")(t.Data.InstanceData.Routes.Items, {
                NavKey: "color"
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            }),
            i.path(f[0].RouteName));
            l = JSON.stringify(w);
            r.post("/api/UploadCreateProject", l, h).then(a, y)
        }
        ;
        c.back = function(n) {
            n.preventDefault();
            f.history.back()
        }
        ;
        u.$broadcast("waitEnd")
    }
    var n = angular.module("dcpLite");
    n.component("uploadPhotoResult", {
        templateUrl: "/Versions/V3/Views/Components/Routes/UploadPhotoResult.html",
        controllerAs: "model",
        controller: ["dsl", "$location", "$http", "$rootScope", "$window", "projectService", "$filter", "pageData", "gtmDataLayer", t]
    })
}(),
function() {
    var n = angular.module("dcpLite")
      , t = function(t, i, r, u, f, e, o, s) {
        var y = function() {
            var i, u;
            t.Project.id && t.Project.Colors.length > 0 && (t.Project.StockID ? (i = e("filter")(f.Data.InstanceData.Routes.Items, {
                NavKey: "paint",
                Template: "<stock-photo><\/stock-photo>"
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            }),
            r.path(i[0].RouteName)) : (u = e("filter")(f.Data.InstanceData.Routes.Items, {
                NavKey: "paint",
                Template: "<paint-photo><\/paint-photo>"
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            }),
            r.path(u[0].RouteName)))
        }, p = function(n) {
            var i = n == "SavedColors" ? "Saved Colors" : n;
            o.event({
                event: "gtm.click",
                t: "ux",
                d1: "CTA: " + i,
                d2: "saveProject"
            });
            s.$broadcast("showShareModal", {
                image: t.PaintedImage,
                type: "save",
                from: n
            })
        }, w = function(n) {
            o.event({
                event: "gtm.click",
                t: "ux",
                d1: "CTA: " + n,
                d2: "email360"
            });
            s.$broadcast("showShareModal", {
                image: t.PaintedImage,
                type: "email-360",
                from: n
            })
        }, b = "tel:" + f.Data.GetLanguageText("ReviewPhotoPainter.CallUsNowNumber", "(34) 555 555 555"), k = function() {
            u.open(b, "_blank")
        }, c = f.Data.GetLanguageText("Review.Actions.FindStoreUrl", ""), l = function() {
            u.open(c, "_blank")
        }, h = {
            progressHeightCss: function() {
                return this.CurrentStep === 1 && this.CarryColor == !1 || this.CurrentStep === 4 || this.CurrentStep === 5 ? "nav-menuItemsCount-" + this.Steps.length + " Step1_4" : "nav-menuItemsCount-" + this.Steps.length
            },
            progressLineCss: function(n) {
                return "nav-menuItemsCount-" + this.Steps.length + " nav-" + n + "Step"
            },
            Steps: [{
                id: 1,
                text: f.Data.GetLanguageText("Header.LinkText.Photo", "Select Photo"),
                enabled: function(n) {
                    return this.id === n ? "current" : t.Project.id ? "enabled" : ""
                },
                route: function() {
                    var t = e("filter")(f.Data.InstanceData.Routes.Items, {
                        NavKey: "photo"
                    }, function(t, i) {
                        return n.LowerCaseCompare(t, i)
                    });
                    r.path(t[0].RouteName)
                }
            }, {
                id: 2,
                text: f.Data.GetLanguageText("Header.LinkText.Color", "Select Colors"),
                enabled: function(n) {
                    return t.Project.id ? this.id === n ? "current" : "enabled" : ""
                },
                route: function() {
                    var i = e("filter")(f.Data.InstanceData.Routes.Items, {
                        NavKey: "color"
                    }, function(t, i) {
                        return n.LowerCaseCompare(t, i)
                    });
                    t.Project.id && r.path(i[0].RouteName)
                }
            }, {
                id: 3,
                text: f.Data.GetLanguageText("Header.LinkText.Visualizer", "Visualize Room"),
                enabled: function(n) {
                    return t.Project.id && t.Project.Colors.length > 0 ? this.id === n ? "current" : "enabled" : ""
                },
                route: y
            }],
            CurrentStep: 1,
            FirstColorConfirmed: !1,
            FirstColorShowing: !1,
            InfoMessage: "",
            EmailSent: !1,
            ClearInfoMessage: function() {
                this.CurrentStep === 2 && (this.FirstColorConfirmed = !0);
                this.EmailSent ? o.event({
                    event: "gtm.click",
                    t: "ux",
                    d1: "UserInfoMessage",
                    d2: "closed: email sent confirmation"
                }) : o.event({
                    event: "gtm.click",
                    t: "ux",
                    d1: "UserInfoMessage",
                    d2: "closed: " + this.InfoMessage
                });
                this.InfoMessage = ""
            },
            ClearFirstColor: function() {
                o.event({
                    event: "gtm.click",
                    t: "ux",
                    d1: "UserInfoMessage",
                    d2: "closed: first color modal"
                });
                this.CurrentStep === 2 && (this.FirstColorConfirmed = !0)
            },
            SelectedColor: null,
            LastDeletedColor: null,
            ShowOnlySave: !1,
            OrderChipButton: null,
            ShowOrderChipsAlways: f.Data.InstanceData.ShowOrderChipsAlways,
            SaveButton: {
                Text: f.Data.GetLanguageText("Review.TabTitle.SaveProject", "Save Project"),
                Action: p,
                Icon: "save"
            },
            Email360Button: {
                Text: f.Data.GetLanguageText("ReviewPhotoPainter.FormButton", "Send to 360°"),
                Action: w,
                Icon: "360"
            },
            ActionButtons: [{
                StepID: 2,
                gtmT: "ux",
                gtmD2: "paintRoom",
                Text: f.Data.GetLanguageText("Header.SavedColors.Step2NextText", "Paint Your Room"),
                Action: y,
                Css: "SavedColorsNextButton",
                Icon: "navigate_next",
                PostCss: f.Data.InstanceData.ShowOrderChipsAlways ? "" : "One",
                FooterCss: "ReviewPhotoBuyClass"
            }],
            isCreateStockProject: !1,
            CarryColor: !1
        }, a = f.Data.GetLanguageText("Header.LinkText.Review", ""), v;
        return a && a != "" ? (v = function() {
            var i = e("filter")(f.Data.InstanceData.Routes.Items, {
                NavKey: "review"
            }, function(t, i) {
                return n.LowerCaseCompare(t, i)
            });
            t.Project.id && t.Project.Colors.length && t.Project.AppliedColors.length && r.path(i[0].RouteName)
        }
        ,
        h.Steps.push({
            id: 4,
            text: a,
            enabled: function(n) {
                return t.Project.id && t.Project.Colors.length > 0 && t.Project.AppliedColors.length > 0 ? this.id === n || n === 5 ? "current" : "enabled" : ""
            },
            route: function() {
                return v()
            }
        }),
        h.ActionButtons.push({
            StepID: 3,
            Action: v,
            gtmT: "ux",
            gtmD1: "",
            gtmD2: "orderPaint",
            Text: f.Data.GetLanguageText("Header.SavedColors.Step3NextText", "Order Paint"),
            Css: "SavedColorsNextButton",
            Icon: "navigate_next",
            PostCss: "",
            FooterCss: "ReviewPhotoBuyClass"
        }),
        h.ActionButtons.push({
            StepID: 4,
            gtmT: "findStore",
            gtmD1: "Footer",
            gtmD2: 4,
            Action: l,
            Text: f.Data.GetLanguageText("Review.Actions.FindStore", "Where to Buy"),
            Css: "ReviewPhotoBuyClass",
            Icon: "place",
            PostCss: "",
            FooterCss: "ReviewPhotoBuyClass"
        }),
        h.ActionButtons.push({
            StepID: 5,
            gtmT: "call360",
            gtmD1: "Footer",
            gmD2: 5,
            Action: k,
            Text: f.Data.GetLanguageText("ReviewPhotoPainter.CallUsNowButton", "Call 360°"),
            Css: "ReviewPhotoBuyClass",
            Icon: "call",
            PostCss: "",
            FooterCss: "ReviewPhotoBuyClass"
        })) : (f.Data.InstanceData.ShowOrderChipsAlways === !0 && (h.OrderChipButton = {
            Text: f.Data.GetLanguageText("Review.Actions.RequestChip", "Request A Chip"),
            Action: function() {
                var n, l, u, i;
                o.event({
                    event: "gtm.click",
                    t: "finishProject",
                    d1: "request",
                    d2: "chip"
                });
                var h = []
                  , r = []
                  , c = f.Data.InstanceColors.Colors.Items;
                for (n = 0; n < t.Project.Colors.length; n++)
                    if (t.Project.AppliedColors.length > 0)
                        if (e("filter")(t.Project.AppliedColors, t.Project.Colors[n]).length === 0)
                            i = c.filter(function(i) {
                                return i.ColorID == t.Project.Colors[n]
                            })[0],
                            h.push(i);
                        else {
                            for (l = !1,
                            u = 0; u < r.length; u++)
                                if (r[u].ColorID === t.Project.Colors[n]) {
                                    l = !0;
                                    break
                                }
                            l || (i = c.filter(function(i) {
                                return i.ColorID == t.Project.Colors[n]
                            })[0],
                            r.push(i))
                        }
                    else
                        i = c.filter(function(i) {
                            return i.ColorID == t.Project.Colors[n]
                        })[0],
                        h.push(i);
                s.$broadcast("showChipModal", {
                    usedColors: r,
                    unusedColors: h
                })
            },
            Icon: "layers"
        }),
        c = f.Data.GetLanguageText("Review.Actions.FindStoreUrl", ""),
        c != "" ? (l = function() {
            u.open(c, "_blank")
        }
        ,
        h.ActionButtons.push({
            StepID: 3,
            gtmT: f.Data.InstanceData.ShowOrderChipsAlways ? "hirePainter" : "findStore",
            gtmD1: "Footer",
            gtmD2: 3,
            Action: l,
            Text: f.Data.GetLanguageText("Review.Actions.FindStore", "Where to Buy"),
            Css: f.Data.InstanceData.ShowOrderChipsAlways ? "HirePainter" : "ReviewPhotoBuyClass",
            Icon: f.Data.InstanceData.ShowOrderChipsAlways ? "format_paint" : "place",
            PostCss: f.Data.InstanceData.ShowOrderChipsAlways ? "One" : "",
            FooterCss: "ReviewPhotoBuyClass"
        })) : h.ShowOnlySave = !0),
        {
            Data: h
        }
    };
    n.factory("pageData", ["projectService", "projectImages", "$location", "$window", "dsl", "$filter", "gtmDataLayer", "$rootScope", t])
}()
