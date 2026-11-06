/*
 * In-browser Pygame subset for Skulpt.
 * Drawing goes to an OffscreenCanvas owned by the worker. The page shows that
 * canvas directly, so nothing is executed on a server.
 */
(function (global) {
    "use strict";

    var SCAN = 1073741824;
    var C = {
        NOEVENT: 0,
        QUIT: 256,
        ACTIVEEVENT: 512,
        KEYDOWN: 768,
        KEYUP: 769,
        MOUSEMOTION: 1024,
        MOUSEBUTTONDOWN: 1025,
        MOUSEBUTTONUP: 1026,
        MOUSEWHEEL: 1027,
        JOYAXISMOTION: 1536,
        JOYBALLMOTION: 1537,
        JOYHATMOTION: 1538,
        JOYBUTTONDOWN: 1539,
        JOYBUTTONUP: 1540,
        VIDEORESIZE: 32769,
        VIDEOEXPOSE: 32770,
        USEREVENT: 32768,
        SWSURFACE: 0,
        HWSURFACE: 1,
        ASYNCBLIT: 4,
        OPENGL: 2,
        FULLSCREEN: -2147483648,
        RESIZABLE: 16,
        NOFRAME: 32,
        DOUBLEBUF: 1073741824,
        SRCALPHA: 65536,
        SRCCOLORKEY: 4096,
        RLEACCEL: 16384,
        SCALED: 512,
        BLEND_RGB_ADD: 1,
        BLEND_RGB_SUB: 2,
        BLEND_RGB_MULT: 3,
        BLEND_RGB_MIN: 4,
        BLEND_RGB_MAX: 5,
        BLEND_RGBA_ADD: 6,
        BLEND_RGBA_SUB: 7,
        BLEND_RGBA_MULT: 8,
        BLEND_RGBA_MIN: 9,
        BLEND_RGBA_MAX: 10,
        BLEND_ADD: 1,
        BLEND_SUB: 2,
        BLEND_MULT: 3,
        BLEND_MIN: 4,
        BLEND_MAX: 5,
        BLEND_PREMULTIPLIED: 17,
        BUTTON_LEFT: 1,
        BUTTON_MIDDLE: 2,
        BUTTON_RIGHT: 3,
        BUTTON_WHEELUP: 4,
        BUTTON_WHEELDOWN: 5,
        KMOD_NONE: 0,
        KMOD_LSHIFT: 1,
        KMOD_RSHIFT: 2,
        KMOD_SHIFT: 3,
        KMOD_LCTRL: 64,
        KMOD_RCTRL: 128,
        KMOD_CTRL: 192,
        KMOD_LALT: 256,
        KMOD_RALT: 512,
        KMOD_ALT: 768,
        KMOD_LMETA: 1024,
        KMOD_RMETA: 2048,
        KMOD_META: 3072,
        KMOD_LGUI: 1024,
        KMOD_RGUI: 2048,
        KMOD_GUI: 3072,
        KMOD_NUM: 4096,
        KMOD_CAPS: 8192,
        KMOD_MODE: 16384,
        K_BACKSPACE: 8,
        K_TAB: 9,
        K_RETURN: 13,
        K_ESCAPE: 27,
        K_SPACE: 32,
        K_QUOTE: 39,
        K_PLUS: 43,
        K_COMMA: 44,
        K_MINUS: 45,
        K_PERIOD: 46,
        K_SLASH: 47,
        K_SEMICOLON: 59,
        K_EQUALS: 61,
        K_LEFTBRACKET: 91,
        K_BACKSLASH: 92,
        K_RIGHTBRACKET: 93,
        K_BACKQUOTE: 96,
        K_DELETE: 127,
        K_CAPSLOCK: SCAN + 57,
        K_F1: SCAN + 58,
        K_PRINTSCREEN: SCAN + 70,
        K_SCROLLLOCK: SCAN + 71,
        K_PAUSE: SCAN + 72,
        K_INSERT: SCAN + 73,
        K_HOME: SCAN + 74,
        K_PAGEUP: SCAN + 75,
        K_END: SCAN + 77,
        K_PAGEDOWN: SCAN + 78,
        K_RIGHT: SCAN + 79,
        K_LEFT: SCAN + 80,
        K_DOWN: SCAN + 81,
        K_UP: SCAN + 82,
        K_KP_DIVIDE: SCAN + 84,
        K_KP_MULTIPLY: SCAN + 85,
        K_KP_MINUS: SCAN + 86,
        K_KP_PLUS: SCAN + 87,
        K_KP_ENTER: SCAN + 88,
        K_KP1: SCAN + 89,
        K_KP2: SCAN + 90,
        K_KP3: SCAN + 91,
        K_KP4: SCAN + 92,
        K_KP5: SCAN + 93,
        K_KP6: SCAN + 94,
        K_KP7: SCAN + 95,
        K_KP8: SCAN + 96,
        K_KP9: SCAN + 97,
        K_KP0: SCAN + 98,
        K_KP_PERIOD: SCAN + 99,
        K_LCTRL: SCAN + 224,
        K_LSHIFT: SCAN + 225,
        K_LALT: SCAN + 226,
        K_LMETA: SCAN + 227,
        K_RCTRL: SCAN + 228,
        K_RSHIFT: SCAN + 229,
        K_RALT: SCAN + 230,
        K_RMETA: SCAN + 231,
    };

    var letter;
    for (letter = 0; letter < 26; letter += 1) {
        C["K_" + String.fromCharCode(97 + letter)] = 97 + letter;
    }
    for (letter = 0; letter < 10; letter += 1) {
        C["K_" + letter] = 48 + letter;
    }
    for (letter = 1; letter <= 12; letter += 1) {
        C["K_F" + letter] = C.K_F1 + (letter - 1);
    }

    var CODE_TO_KEY = {
        ArrowLeft: C.K_LEFT,
        ArrowRight: C.K_RIGHT,
        ArrowUp: C.K_UP,
        ArrowDown: C.K_DOWN,
        Space: C.K_SPACE,
        Enter: C.K_RETURN,
        NumpadEnter: C.K_KP_ENTER,
        Escape: C.K_ESCAPE,
        Backspace: C.K_BACKSPACE,
        Tab: C.K_TAB,
        Delete: C.K_DELETE,
        Insert: C.K_INSERT,
        Home: C.K_HOME,
        End: C.K_END,
        PageUp: C.K_PAGEUP,
        PageDown: C.K_PAGEDOWN,
        ShiftLeft: C.K_LSHIFT,
        ShiftRight: C.K_RSHIFT,
        ControlLeft: C.K_LCTRL,
        ControlRight: C.K_RCTRL,
        AltLeft: C.K_LALT,
        AltRight: C.K_RALT,
        MetaLeft: C.K_LMETA,
        MetaRight: C.K_RMETA,
        CapsLock: C.K_CAPSLOCK,
        Minus: C.K_MINUS,
        Equal: C.K_EQUALS,
        BracketLeft: C.K_LEFTBRACKET,
        BracketRight: C.K_RIGHTBRACKET,
        Backslash: C.K_BACKSLASH,
        Semicolon: C.K_SEMICOLON,
        Quote: C.K_QUOTE,
        Comma: C.K_COMMA,
        Period: C.K_PERIOD,
        Slash: C.K_SLASH,
        Backquote: C.K_BACKQUOTE,
        NumpadAdd: C.K_KP_PLUS,
        NumpadSubtract: C.K_KP_MINUS,
        NumpadMultiply: C.K_KP_MULTIPLY,
        NumpadDivide: C.K_KP_DIVIDE,
        NumpadDecimal: C.K_KP_PERIOD,
        Numpad0: C.K_KP0,
        Numpad1: C.K_KP1,
        Numpad2: C.K_KP2,
        Numpad3: C.K_KP3,
        Numpad4: C.K_KP4,
        Numpad5: C.K_KP5,
        Numpad6: C.K_KP6,
        Numpad7: C.K_KP7,
        Numpad8: C.K_KP8,
        Numpad9: C.K_KP9,
    };

    var COLORS = {
        aliceblue: [240, 248, 255, 255], antiquewhite: [250, 235, 215, 255], aqua: [0, 255, 255, 255],
        aquamarine: [127, 255, 212, 255], azure: [240, 255, 255, 255], beige: [245, 245, 220, 255],
        bisque: [255, 228, 196, 255], black: [0, 0, 0, 255], blanchedalmond: [255, 235, 205, 255],
        blue: [0, 0, 255, 255], blueviolet: [138, 43, 226, 255], brown: [165, 42, 42, 255],
        burlywood: [222, 184, 135, 255], cadetblue: [95, 158, 160, 255], chartreuse: [127, 255, 0, 255],
        chocolate: [210, 105, 30, 255], coral: [255, 127, 80, 255], cornflowerblue: [100, 149, 237, 255],
        cornsilk: [255, 248, 220, 255], crimson: [220, 20, 60, 255], cyan: [0, 255, 255, 255],
        darkblue: [0, 0, 139, 255], darkcyan: [0, 139, 139, 255], darkgoldenrod: [184, 134, 11, 255],
        darkgray: [169, 169, 169, 255], darkgrey: [169, 169, 169, 255], darkgreen: [0, 100, 0, 255],
        darkkhaki: [189, 183, 107, 255], darkmagenta: [139, 0, 139, 255], darkolivegreen: [85, 107, 47, 255],
        darkorange: [255, 140, 0, 255], darkorchid: [153, 50, 204, 255], darkred: [139, 0, 0, 255],
        darksalmon: [233, 150, 122, 255], darkseagreen: [143, 188, 143, 255], darkslateblue: [72, 61, 139, 255],
        darkslategray: [47, 79, 79, 255], darkslategrey: [47, 79, 79, 255], darkturquoise: [0, 206, 209, 255],
        darkviolet: [148, 0, 211, 255], deeppink: [255, 20, 147, 255], deepskyblue: [0, 191, 255, 255],
        dimgray: [105, 105, 105, 255], dimgrey: [105, 105, 105, 255], dodgerblue: [30, 144, 255, 255],
        firebrick: [178, 34, 34, 255], floralwhite: [255, 250, 240, 255], forestgreen: [34, 139, 34, 255],
        fuchsia: [255, 0, 255, 255], gainsboro: [220, 220, 220, 255], ghostwhite: [248, 248, 255, 255],
        gold: [255, 215, 0, 255], goldenrod: [218, 165, 32, 255], gray: [128, 128, 128, 255],
        grey: [128, 128, 128, 255], green: [0, 128, 0, 255], greenyellow: [173, 255, 47, 255],
        honeydew: [240, 255, 240, 255], hotpink: [255, 105, 180, 255], indianred: [205, 92, 92, 255],
        indigo: [75, 0, 130, 255], ivory: [255, 255, 240, 255], khaki: [240, 230, 140, 255],
        lavender: [230, 230, 250, 255], lavenderblush: [255, 240, 245, 255], lawngreen: [124, 252, 0, 255],
        lemonchiffon: [255, 250, 205, 255], lightblue: [173, 216, 230, 255], lightcoral: [240, 128, 128, 255],
        lightcyan: [224, 255, 255, 255], lightgoldenrodyellow: [250, 250, 210, 255], lightgray: [211, 211, 211, 255],
        lightgrey: [211, 211, 211, 255], lightgreen: [144, 238, 144, 255], lightpink: [255, 182, 193, 255],
        lightsalmon: [255, 160, 122, 255], lightseagreen: [32, 178, 170, 255], lightskyblue: [135, 206, 250, 255],
        lightslategray: [119, 136, 153, 255], lightslategrey: [119, 136, 153, 255], lightsteelblue: [176, 196, 222, 255],
        lightyellow: [255, 255, 224, 255], lime: [0, 255, 0, 255], limegreen: [50, 205, 50, 255],
        linen: [250, 240, 230, 255], magenta: [255, 0, 255, 255], maroon: [128, 0, 0, 255],
        mediumaquamarine: [102, 205, 170, 255], mediumblue: [0, 0, 205, 255], mediumorchid: [186, 85, 211, 255],
        mediumpurple: [147, 112, 219, 255], mediumseagreen: [60, 179, 113, 255], mediumslateblue: [123, 104, 238, 255],
        mediumspringgreen: [0, 250, 154, 255], mediumturquoise: [72, 209, 204, 255], mediumvioletred: [199, 21, 133, 255],
        midnightblue: [25, 25, 112, 255], mintcream: [245, 255, 250, 255], mistyrose: [255, 228, 225, 255],
        moccasin: [255, 228, 181, 255], navajowhite: [255, 222, 173, 255], navy: [0, 0, 128, 255],
        oldlace: [253, 245, 230, 255], olive: [128, 128, 0, 255], olivedrab: [107, 142, 35, 255],
        orange: [255, 165, 0, 255], orangered: [255, 69, 0, 255], orchid: [218, 112, 214, 255],
        palegoldenrod: [238, 232, 170, 255], palegreen: [152, 251, 152, 255], paleturquoise: [175, 238, 238, 255],
        palevioletred: [219, 112, 147, 255], papayawhip: [255, 239, 213, 255], peachpuff: [255, 218, 185, 255],
        peru: [205, 133, 63, 255], pink: [255, 192, 203, 255], plum: [221, 160, 221, 255],
        powderblue: [176, 224, 230, 255], purple: [128, 0, 128, 255], red: [255, 0, 0, 255],
        rosybrown: [188, 143, 143, 255], royalblue: [65, 105, 225, 255], saddlebrown: [139, 69, 19, 255],
        salmon: [250, 128, 114, 255], sandybrown: [244, 164, 96, 255], seagreen: [46, 139, 87, 255],
        seashell: [255, 245, 238, 255], sienna: [160, 82, 45, 255], silver: [192, 192, 192, 255],
        skyblue: [135, 206, 235, 255], slateblue: [106, 90, 205, 255], slategray: [112, 128, 144, 255],
        slategrey: [112, 128, 144, 255], snow: [255, 250, 250, 255], springgreen: [0, 255, 127, 255],
        steelblue: [70, 130, 180, 255], tan: [210, 180, 140, 255], teal: [0, 128, 128, 255],
        thistle: [216, 191, 216, 255], tomato: [255, 99, 71, 255], turquoise: [64, 224, 208, 255],
        violet: [238, 130, 238, 255], wheat: [245, 222, 179, 255], white: [255, 255, 255, 255],
        whitesmoke: [245, 245, 245, 255], yellow: [255, 255, 0, 255], yellowgreen: [154, 205, 50, 255],
    };

    function mapCode(code, key) {
        if (code && CODE_TO_KEY[code]) return CODE_TO_KEY[code];
        if (code && /^Key[A-Z]$/.test(code)) return code.charCodeAt(3) + 32;
        if (code && /^Digit[0-9]$/.test(code)) return code.charCodeAt(5);
        var func = code && /^F(\d{1,2})$/.exec(code);
        if (func) {
            var n = Number(func[1]);
            if (n >= 1 && n <= 12) return C.K_F1 + n - 1;
        }
        if (key && key.length === 1) {
            var ch = key.toLowerCase().charCodeAt(0);
            if (ch >= 32 && ch < 127) return ch;
        }
        return 0;
    }

    function modsOf(ev) {
        var m = 0;
        if (ev.shift) m |= C.KMOD_SHIFT;
        if (ev.ctrl) m |= C.KMOD_CTRL;
        if (ev.alt) m |= C.KMOD_ALT;
        if (ev.meta) m |= C.KMOD_META;
        if (ev.caps) m |= C.KMOD_CAPS;
        return m;
    }

    function createPygameHost(options) {
        var canvas = options.canvas;
        var host = {
            canvas: canvas,
            ctx: canvas ? canvas.getContext("2d") : null,
            post: options.post,
            images: new Map(),
            fonts: new Map(),
            audio: new Map(),
            rawQueue: [],
            keys: Object.create(null),
            mods: 0,
            mouseX: 0,
            mouseY: 0,
            mouseButtons: [false, false, false],
            mouseRelX: 0,
            mouseRelY: 0,
            keyRepeat: false,
            blocked: Object.create(null),
            allowOnly: null,
            eventWaiters: [],
            pendingYields: Object.create(null),
            yieldSeq: 0,
            timerIds: Object.create(null),
            width: canvas ? canvas.width : 800,
            height: canvas ? canvas.height : 600,
            screen: null,
            flippedSinceTick: false,
            startTime: (typeof performance !== "undefined" ? performance.now() : Date.now()),
            inited: false,
            channels: Object.create(null),
            audioSeq: 1,
            musicName: null,
            musicBusy: false,
            musicVolume: 1,
            spriteSeq: 1,
        };
        if (host.ctx) host.ctx.imageSmoothingEnabled = true;

        host.sleep = function (ms) {
            return new Promise(function (resolve) {
                var id = ++host.yieldSeq;
                host.pendingYields[id] = resolve;
                host.post({ type: "yield", id: id, delay: Math.max(0, ms || 0) });
            });
        };

        host.pushRaw = function (ev) {
            host.rawQueue.push(ev);
            if (host.rawQueue.length > 2000) host.rawQueue.splice(0, host.rawQueue.length - 1000);
            var waiters = host.eventWaiters.splice(0, host.eventWaiters.length);
            waiters.forEach(function (fn) { fn(); });
        };

        host.pushDomEvent = function (ev) {
            var k;
            if (ev.kind === "keydown") {
                if (ev.repeat && !host.keyRepeat) return;
                k = mapCode(ev.code, ev.key);
                if (k) host.keys[k] = true;
                host.mods = modsOf(ev);
                host.pushRaw(ev);
                return;
            }
            if (ev.kind === "keyup") {
                k = mapCode(ev.code, ev.key);
                if (k) delete host.keys[k];
                host.mods = modsOf(ev);
                host.pushRaw(ev);
                return;
            }
            if (ev.kind === "mousedown" || ev.kind === "mouseup" || ev.kind === "wheel") {
                host.mouseX = ev.x;
                host.mouseY = ev.y;
                if (ev.kind === "mousedown" && ev.button >= 1 && ev.button <= 3) host.mouseButtons[ev.button - 1] = true;
                if (ev.kind === "mouseup" && ev.button >= 1 && ev.button <= 3) host.mouseButtons[ev.button - 1] = false;
                host.pushRaw(ev);
                return;
            }
            if (ev.kind === "blur") {
                (ev.codes || []).forEach(function (code) {
                    host.pushRaw({ kind: "keyup", code: code, key: "", shift: false, ctrl: false, alt: false, meta: false, caps: false, repeat: false });
                });
                host.keys = Object.create(null);
                host.mouseButtons = [false, false, false];
            }
        };

        host.applySnapshot = function (snap) {
            var codes = snap.codes || [];
            host.keys = Object.create(null);
            codes.forEach(function (code) {
                var k = mapCode(code, "");
                if (k) host.keys[k] = true;
            });
            host.mods = 0;
            if (codes.some(function (c) { return c.indexOf("Shift") === 0; })) host.mods |= C.KMOD_SHIFT;
            if (codes.some(function (c) { return c.indexOf("Control") === 0; })) host.mods |= C.KMOD_CTRL;
            if (codes.some(function (c) { return c.indexOf("Alt") === 0; })) host.mods |= C.KMOD_ALT;
            if (codes.some(function (c) { return c.indexOf("Meta") === 0; })) host.mods |= C.KMOD_META;
            if (snap.caps) host.mods |= C.KMOD_CAPS;
            if (snap.mouse) {
                host.mouseX = snap.mouse.x;
                host.mouseY = snap.mouse.y;
                host.mouseButtons = snap.mouse.buttons || host.mouseButtons;
                host.mouseRelX += snap.mouse.relX || 0;
                host.mouseRelY += snap.mouse.relY || 0;
                if (snap.mouse.motion) {
                    host.pushRaw({
                        kind: "mousemove",
                        x: host.mouseX,
                        y: host.mouseY,
                        relX: snap.mouse.relX || 0,
                        relY: snap.mouse.relY || 0,
                        buttons: host.mouseButtons.slice(),
                    });
                }
            }
        };

        host.clearTimers = function () {
            Object.keys(host.timerIds).forEach(function (key) {
                clearInterval(host.timerIds[key]);
            });
            host.timerIds = Object.create(null);
        };

        host.prepare = async function (msg) {
            (msg.images || []).forEach(function (img) {
                var base = String(img.name).split(/[/\\]/).pop();
                host.images.set(img.name, img.bitmap);
                host.images.set(base, img.bitmap);
                host.images.set(base.toLowerCase(), img.bitmap);
            });
            var fonts = msg.fonts || [];
            for (var i = 0; i < fonts.length; i += 1) {
                var font = fonts[i];
                var baseName = String(font.name).split(/[/\\]/).pop();
                var family = "pyfont-" + baseName.replace(/[^a-zA-Z0-9_-]/g, "");
                try {
                    var face = new FontFace(family, font.buffer);
                    await face.load();
                    self.fonts.add(face);
                    host.fonts.set(font.name, family);
                    host.fonts.set(baseName, family);
                    host.fonts.set(baseName.toLowerCase(), family);
                } catch (err) {
                    /* An unreadable font falls back to the system face. */
                }
            }
            (msg.audio || []).forEach(function (item) {
                var baseAudio = String(item.name).split(/[/\\]/).pop();
                host.audio.set(item.name, item.duration || 0);
                host.audio.set(baseAudio, item.duration || 0);
                host.audio.set(baseAudio.toLowerCase(), item.duration || 0);
            });
        };

        host.lookupImage = function (name) {
            if (host.images.has(name)) return host.images.get(name);
            var base = String(name).split(/[/\\]/).pop();
            if (host.images.has(base)) return host.images.get(base);
            if (host.images.has(base.toLowerCase())) return host.images.get(base.toLowerCase());
            return null;
        };

        host.lookupAudio = function (name) {
            if (host.audio.has(name)) return host.audio.get(name);
            var base = String(name).split(/[/\\]/).pop();
            if (host.audio.has(base)) return host.audio.get(base);
            if (host.audio.has(base.toLowerCase())) return host.audio.get(base.toLowerCase());
            return null;
        };

        host.lookupFont = function (name) {
            if (!name) return null;
            if (host.fonts.has(name)) return host.fonts.get(name);
            var base = String(name).split(/[/\\]/).pop();
            if (host.fonts.has(base)) return host.fonts.get(base);
            if (host.fonts.has(base.toLowerCase())) return host.fonts.get(base.toLowerCase());
            return null;
        };

        return host;
    }

    function pyInt(n) { return new Sk.builtin.int_(n | 0); }
    function pyNum(n) {
        if (typeof n !== "number" || !isFinite(n)) n = 0;
        if (Math.abs(n - Math.round(n)) < 1e-9) return new Sk.builtin.int_(Math.round(n));
        return new Sk.builtin.float_(n);
    }
    function pyStr(s) { return new Sk.builtin.str(String(s)); }
    function pyPair(x, y) { return new Sk.builtin.tuple([pyNum(x), pyNum(y)]); }
    function pyBool(v) { return v ? Sk.builtin.bool.true$ : Sk.builtin.bool.false$; }
    function isNone(x) { return x === undefined || x === null || x === Sk.builtin.none.none$; }
    function num(x) {
        if (typeof x === "number") return x;
        if (x === true) return 1;
        if (x === false || isNone(x)) return 0;
        if (Sk.builtin.checkNumber(x)) return Sk.builtin.asnum$(x);
        throw new Sk.builtin.TypeError("a number is required");
    }
    function jsStr(x) {
        if (isNone(x)) return "";
        if (typeof x === "string") return x;
        if (Sk.builtin.checkString(x)) return x.v;
        return String(Sk.ffi.remapToJs(x));
    }
    function isTrue(x) { return !isNone(x) && Sk.misceval.isTrue(x); }

    function createApi(host) {
        var PY_NONE = Sk.builtin.none.none$;
        var PY_ZERO = pyInt(0);
        var PY_ONE = pyInt(1);
        var api = {};

        function suspend(promise) {
            return Sk.misceval.promiseToSuspension(promise);
        }
        function noneSuspend(promise) {
            return suspend(promise.then(function () { return PY_NONE; }));
        }

        function pair(obj) {
            if (obj && (obj._isVector || obj._isRect)) return [obj._x, obj._y];
            if (obj instanceof Sk.builtin.list || obj instanceof Sk.builtin.tuple) {
                if (obj.v.length >= 2) return [num(obj.v[0]), num(obj.v[1])];
            }
            if (obj && typeof obj.mp$subscript === "function" && !obj._isColor) {
                try {
                    return [num(obj.mp$subscript(pyInt(0))), num(obj.mp$subscript(pyInt(1)))];
                } catch (err) { /* not a point */ }
            }
            throw new Sk.builtin.TypeError("expected a pair of numbers");
        }

        function clampByte(v) {
            v = Math.round(Number(v));
            if (v < 0) return 0;
            if (v > 255) return 255;
            return v;
        }

        function parseHex(text) {
            var h = text.charAt(0) === "#" ? text.slice(1) : text;
            if (h.length === 3 || h.length === 4) {
                h = h.split("").map(function (ch) { return ch + ch; }).join("");
            }
            if (h.length === 6) h += "ff";
            if (!/^[0-9a-fA-F]{8}$/.test(h)) return null;
            var value = parseInt(h, 16);
            return [(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255];
        }

        function components(color) {
            if (color && color._isColor) return [color._r, color._g, color._b, color._a];
            if (Sk.builtin.checkString(color) || typeof color === "string") {
                var text = jsStr(color).trim().toLowerCase();
                if (COLORS[text]) return COLORS[text].slice();
                var hex = parseHex(text);
                if (hex) return hex;
                throw new Sk.builtin.ValueError("invalid color name: " + text);
            }
            if (Sk.builtin.checkNumber(color)) {
                var packed = num(color) >>> 0;
                return [(packed >> 16) & 255, (packed >> 8) & 255, packed & 255, 255];
            }
            if (color instanceof Sk.builtin.list || color instanceof Sk.builtin.tuple) {
                var parts = color.v;
                if (parts.length === 3 || parts.length === 4) {
                    return [clampByte(num(parts[0])), clampByte(num(parts[1])), clampByte(num(parts[2])), parts.length === 4 ? clampByte(num(parts[3])) : 255];
                }
            }
            if (color && typeof color.mp$subscript === "function") {
                try {
                    var r = num(color.mp$subscript(pyInt(0)));
                    var g = num(color.mp$subscript(pyInt(1)));
                    var b = num(color.mp$subscript(pyInt(2)));
                    var a = 255;
                    try { a = num(color.mp$subscript(pyInt(3))); } catch (err) { a = 255; }
                    return [clampByte(r), clampByte(g), clampByte(b), clampByte(a)];
                } catch (err2) { /* fall through */ }
            }
            throw new Sk.builtin.ValueError("invalid color");
        }

        function cssColor(c) {
            if (c[3] >= 255) return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
            return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (c[3] / 255) + ")";
        }

        function alloc(proto, type) {
            var inst = Object.create(proto);
            inst.$d = new Sk.builtin.dict();
            inst.ob$type = proto.ob$type || type;
            return inst;
        }

        function setAttr(obj, name, value) {
            obj.$d.mp$ass_subscript(pyStr(name), value);
        }

        function bounds(r) {
            var x = r._x, y = r._y, w = r._w, h = r._h;
            if (w < 0) { x += w; w = -w; }
            if (h < 0) { y += h; h = -h; }
            return { x: x, y: y, w: w, h: h };
        }

        function newRect(x, y, w, h) {
            var rect = alloc(api.Rect.prototype, api.Rect);
            rect._isRect = true;
            rect._x = x || 0;
            rect._y = y || 0;
            rect._w = w || 0;
            rect._h = h || 0;
            return rect;
        }

        function rectOf(obj) {
            if (obj && obj._isRect) return obj;
            if ((obj instanceof Sk.builtin.list || obj instanceof Sk.builtin.tuple) && obj.v.length === 4) {
                return newRect(num(obj.v[0]), num(obj.v[1]), num(obj.v[2]), num(obj.v[3]));
            }
            try {
                var inner = Sk.abstr.gattr(obj, pyStr("rect"));
                if (inner && inner._isRect) return inner;
            } catch (err) { /* not a sprite */ }
            throw new Sk.builtin.TypeError("expected a Rect");
        }

        function overlaps(a, b) {
            if (!a || !b || !a._isRect || !b._isRect) return false;
            var A = bounds(a);
            var B = bounds(b);
            return A.w > 0 && A.h > 0 && B.w > 0 && B.h > 0 &&
                A.x < B.x + B.w && A.x + A.w > B.x && A.y < B.y + B.h && A.y + A.h > B.y;
        }

        function applyRectArgs(rect, args) {
            if (!args || !args.length) throw new Sk.builtin.TypeError("Rect() requires coordinates");
            if (args.length === 4 && args.every(function (item) { return Sk.builtin.checkNumber(item); })) {
                rect._x = num(args[0]); rect._y = num(args[1]); rect._w = num(args[2]); rect._h = num(args[3]);
                return;
            }
            if (args.length === 2) {
                var p = pair(args[0]);
                var s = pair(args[1]);
                rect._x = p[0]; rect._y = p[1]; rect._w = s[0]; rect._h = s[1];
                return;
            }
            if (args.length === 1) {
                var one = args[0];
                if (one && one._isRect) {
                    rect._x = one._x; rect._y = one._y; rect._w = one._w; rect._h = one._h;
                    return;
                }
                if ((one instanceof Sk.builtin.list || one instanceof Sk.builtin.tuple) && one.v.length === 4) {
                    rect._x = num(one.v[0]); rect._y = num(one.v[1]); rect._w = num(one.v[2]); rect._h = num(one.v[3]);
                    return;
                }
                try {
                    var inner = Sk.abstr.gattr(one, pyStr("rect"));
                    if (inner && inner._isRect) {
                        rect._x = inner._x; rect._y = inner._y; rect._w = inner._w; rect._h = inner._h;
                        return;
                    }
                } catch (err) { /* continue */ }
            }
            throw new Sk.builtin.TypeError("invalid Rect arguments");
        }

        function placeRect(rect, name, value) {
            var p;
            if (name === "x" || name === "left") rect._x = num(value);
            else if (name === "y" || name === "top") rect._y = num(value);
            else if (name === "w" || name === "width") rect._w = num(value);
            else if (name === "h" || name === "height") rect._h = num(value);
            else if (name === "right") rect._x = num(value) - rect._w;
            else if (name === "bottom") rect._y = num(value) - rect._h;
            else if (name === "centerx") rect._x = num(value) - rect._w / 2;
            else if (name === "centery") rect._y = num(value) - rect._h / 2;
            else if (name === "topleft") { p = pair(value); rect._x = p[0]; rect._y = p[1]; }
            else if (name === "topright") { p = pair(value); rect._x = p[0] - rect._w; rect._y = p[1]; }
            else if (name === "bottomleft") { p = pair(value); rect._x = p[0]; rect._y = p[1] - rect._h; }
            else if (name === "bottomright") { p = pair(value); rect._x = p[0] - rect._w; rect._y = p[1] - rect._h; }
            else if (name === "midtop") { p = pair(value); rect._x = p[0] - rect._w / 2; rect._y = p[1]; }
            else if (name === "midbottom") { p = pair(value); rect._x = p[0] - rect._w / 2; rect._y = p[1] - rect._h; }
            else if (name === "midleft") { p = pair(value); rect._x = p[0]; rect._y = p[1] - rect._h / 2; }
            else if (name === "midright") { p = pair(value); rect._x = p[0] - rect._w; rect._y = p[1] - rect._h / 2; }
            else if (name === "center") { p = pair(value); rect._x = p[0] - rect._w / 2; rect._y = p[1] - rect._h / 2; }
            else if (name === "size") { p = pair(value); rect._w = p[0]; rect._h = p[1]; }
            else throw new Sk.builtin.AttributeError("Rect has no attribute " + name);
        }

        function dimGet(field) {
            return function () { return pyNum(this[field]); };
        }
        function dimSet(field) {
            return function (value) { this[field] = num(value); };
        }

        var rectGetsets = {
            x: { $get: dimGet("_x"), $set: dimSet("_x") },
            y: { $get: dimGet("_y"), $set: dimSet("_y") },
            w: { $get: dimGet("_w"), $set: dimSet("_w") },
            h: { $get: dimGet("_h"), $set: dimSet("_h") },
            width: { $get: dimGet("_w"), $set: dimSet("_w") },
            height: { $get: dimGet("_h"), $set: dimSet("_h") },
            left: { $get: dimGet("_x"), $set: dimSet("_x") },
            top: { $get: dimGet("_y"), $set: dimSet("_y") },
            right: {
                $get: function () { return pyNum(this._x + this._w); },
                $set: function (v) { this._x = num(v) - this._w; },
            },
            bottom: {
                $get: function () { return pyNum(this._y + this._h); },
                $set: function (v) { this._y = num(v) - this._h; },
            },
            centerx: {
                $get: function () { return pyNum(this._x + this._w / 2); },
                $set: function (v) { this._x = num(v) - this._w / 2; },
            },
            centery: {
                $get: function () { return pyNum(this._y + this._h / 2); },
                $set: function (v) { this._y = num(v) - this._h / 2; },
            },
            topleft: {
                $get: function () { return pyPair(this._x, this._y); },
                $set: function (v) { placeRect(this, "topleft", v); },
            },
            topright: {
                $get: function () { return pyPair(this._x + this._w, this._y); },
                $set: function (v) { placeRect(this, "topright", v); },
            },
            bottomleft: {
                $get: function () { return pyPair(this._x, this._y + this._h); },
                $set: function (v) { placeRect(this, "bottomleft", v); },
            },
            bottomright: {
                $get: function () { return pyPair(this._x + this._w, this._y + this._h); },
                $set: function (v) { placeRect(this, "bottomright", v); },
            },
            midtop: {
                $get: function () { return pyPair(this._x + this._w / 2, this._y); },
                $set: function (v) { placeRect(this, "midtop", v); },
            },
            midbottom: {
                $get: function () { return pyPair(this._x + this._w / 2, this._y + this._h); },
                $set: function (v) { placeRect(this, "midbottom", v); },
            },
            midleft: {
                $get: function () { return pyPair(this._x, this._y + this._h / 2); },
                $set: function (v) { placeRect(this, "midleft", v); },
            },
            midright: {
                $get: function () { return pyPair(this._x + this._w, this._y + this._h / 2); },
                $set: function (v) { placeRect(this, "midright", v); },
            },
            center: {
                $get: function () { return pyPair(this._x + this._w / 2, this._y + this._h / 2); },
                $set: function (v) { placeRect(this, "center", v); },
            },
            size: {
                $get: function () { return pyPair(this._w, this._h); },
                $set: function (v) { placeRect(this, "size", v); },
            },
        };

        function copyRect(rect) { return newRect(rect._x, rect._y, rect._w, rect._h); }

        function moved(rect, dx, dy, inplace) {
            var target = inplace ? rect : copyRect(rect);
            target._x += dx;
            target._y += dy;
            return target;
        }

        function inflated(rect, dx, dy, inplace) {
            var target = inplace ? rect : copyRect(rect);
            target._x -= dx / 2;
            target._y -= dy / 2;
            target._w += dx;
            target._h += dy;
            return target;
        }

        function clampRect(rect, other, inplace) {
            var target = inplace ? rect : copyRect(rect);
            var b = bounds(rectOf(other));
            if (target._w >= b.w) target._x = b.x;
            else if (target._x < b.x) target._x = b.x;
            else if (target._x + target._w > b.x + b.w) target._x = b.x + b.w - target._w;
            if (target._h >= b.h) target._y = b.y;
            else if (target._y < b.y) target._y = b.y;
            else if (target._y + target._h > b.y + b.h) target._y = b.y + b.h - target._h;
            return target;
        }

        function pointInside(rect, x, y) {
            var b = bounds(rect);
            return x >= b.x && y >= b.y && x < b.x + b.w && y < b.y + b.h;
        }

        api.Rect = Sk.abstr.buildNativeClass("pygame.Rect", {
            constructor: function Rect() {},
            slots: {
                tp$getattr: Sk.generic.getAttr,
                tp$setattr: Sk.generic.setAttr,
                tp$doc: "pygame rectangle",
                tp$new: function () {
                    var inst = alloc(this, api.Rect);
                    inst._isRect = true;
                    inst._x = 0; inst._y = 0; inst._w = 0; inst._h = 0;
                    return inst;
                },
                tp$init: function (args) { applyRectArgs(this, args || []); },
                tp$iter: function () {
                    return new Sk.builtin.tuple([pyNum(this._x), pyNum(this._y), pyNum(this._w), pyNum(this._h)]).tp$iter();
                },
                tp$as_sequence_or_mapping: true,
                mp$subscript: function (key) {
                    var vals = [this._x, this._y, this._w, this._h];
                    if (Sk.builtin.checkNumber(key)) {
                        var i = num(key);
                        if (i < 0) i += 4;
                        if (i < 0 || i > 3) throw new Sk.builtin.IndexError("Rect index out of range");
                        return pyNum(vals[i]);
                    }
                    throw new Sk.builtin.TypeError("Rect indices must be integers");
                },
                mp$ass_subscript: function (key, value) {
                    var i = num(key);
                    if (i < 0) i += 4;
                    if (i === 0) this._x = num(value);
                    else if (i === 1) this._y = num(value);
                    else if (i === 2) this._w = num(value);
                    else if (i === 3) this._h = num(value);
                    else throw new Sk.builtin.IndexError("Rect index out of range");
                },
                sq$length: function () { return 4; },
                nb$bool: function () { return this._w !== 0 && this._h !== 0; },
                tp$richcompare: function (other, op) {
                    if (!other || !other._isRect) return Sk.builtin.NotImplemented.NotImplemented$;
                    var eq = this._x === other._x && this._y === other._y && this._w === other._w && this._h === other._h;
                    if (op === "Eq") return eq;
                    if (op === "NotEq") return !eq;
                    return Sk.builtin.NotImplemented.NotImplemented$;
                },
                $r: function () {
                    return pyStr("Rect(" + this._x + ", " + this._y + ", " + this._w + ", " + this._h + ")");
                },
            },
            getsets: rectGetsets,
            methods: {
                copy: { $meth: function () { return copyRect(this); }, $flags: { NoArgs: true } },
                move: { $meth: function (dx, dy) { return moved(this, num(dx), num(dy), false); }, $flags: { MinArgs: 2, MaxArgs: 2 } },
                move_ip: { $meth: function (dx, dy) { moved(this, num(dx), num(dy), true); return PY_NONE; }, $flags: { MinArgs: 2, MaxArgs: 2 } },
                inflate: { $meth: function (dx, dy) { return inflated(this, num(dx), num(dy), false); }, $flags: { MinArgs: 2, MaxArgs: 2 } },
                inflate_ip: { $meth: function (dx, dy) { inflated(this, num(dx), num(dy), true); return PY_NONE; }, $flags: { MinArgs: 2, MaxArgs: 2 } },
                clamp: { $meth: function (other) { return clampRect(this, other, false); }, $flags: { OneArg: true } },
                clamp_ip: { $meth: function (other) { clampRect(this, other, true); return PY_NONE; }, $flags: { OneArg: true } },
                clip: {
                    $meth: function (other) {
                        var A = bounds(this), B = bounds(rectOf(other));
                        var x1 = Math.max(A.x, B.x), y1 = Math.max(A.y, B.y);
                        var x2 = Math.min(A.x + A.w, B.x + B.w), y2 = Math.min(A.y + A.h, B.y + B.h);
                        if (x2 <= x1 || y2 <= y1) return newRect(x1, y1, 0, 0);
                        return newRect(x1, y1, x2 - x1, y2 - y1);
                    },
                    $flags: { OneArg: true },
                },
                union: {
                    $meth: function (other) {
                        var A = bounds(this), B = bounds(rectOf(other));
                        var x = Math.min(A.x, B.x), y = Math.min(A.y, B.y);
                        return newRect(x, y, Math.max(A.x + A.w, B.x + B.w) - x, Math.max(A.y + A.h, B.y + B.h) - y);
                    },
                    $flags: { OneArg: true },
                },
                union_ip: {
                    $meth: function (other) {
                        var next = api.Rect.prototype.union.tp$call
                            ? null
                            : null;
                        var A = bounds(this), B = bounds(rectOf(other));
                        var x = Math.min(A.x, B.x), y = Math.min(A.y, B.y);
                        this._x = x; this._y = y;
                        this._w = Math.max(A.x + A.w, B.x + B.w) - x;
                        this._h = Math.max(A.y + A.h, B.y + B.h) - y;
                        return PY_NONE;
                    },
                    $flags: { OneArg: true },
                },
                contains: {
                    $meth: function (other) {
                        var A = bounds(this), B = bounds(rectOf(other));
                        return pyBool(B.x >= A.x && B.y >= A.y && B.x + B.w <= A.x + A.w && B.y + B.h <= A.y + A.h);
                    },
                    $flags: { OneArg: true },
                },
                collidepoint: {
                    $meth: function (args) {
                        var x, y;
                        if (args.length === 1) { var p = pair(args[0]); x = p[0]; y = p[1]; }
                        else { x = num(args[0]); y = num(args[1]); }
                        return pyBool(pointInside(this, x, y));
                    },
                    $flags: { FastCall: true, NoKwargs: true },
                },
                colliderect: { $meth: function (other) { return pyBool(overlaps(this, rectOf(other))); }, $flags: { OneArg: true } },
                collidelist: {
                    $meth: function (list) {
                        var items = list.v || [];
                        for (var i = 0; i < items.length; i += 1) {
                            try { if (overlaps(this, rectOf(items[i]))) return pyInt(i); } catch (err) {}
                        }
                        return pyInt(-1);
                    },
                    $flags: { OneArg: true },
                },
                collidelistall: {
                    $meth: function (list) {
                        var items = list.v || [];
                        var hits = [];
                        for (var i = 0; i < items.length; i += 1) {
                            try { if (overlaps(this, rectOf(items[i]))) hits.push(pyInt(i)); } catch (err) {}
                        }
                        return new Sk.builtin.list(hits);
                    },
                    $flags: { OneArg: true },
                },
                normalize: {
                    $meth: function () {
                        var b = bounds(this);
                        this._x = b.x; this._y = b.y; this._w = b.w; this._h = b.h;
                        return PY_NONE;
                    },
                    $flags: { NoArgs: true },
                },
            },
        });

        api.Color = Sk.abstr.buildNativeClass("pygame.Color", {
            constructor: function Color() {},
            slots: {
                tp$getattr: Sk.generic.getAttr,
                tp$setattr: Sk.generic.setAttr,
                tp$new: function () {
                    var inst = alloc(this, api.Color);
                    inst._isColor = true;
                    inst._r = 0; inst._g = 0; inst._b = 0; inst._a = 255;
                    return inst;
                },
                tp$init: function (args) {
                    var c;
                    if (!args || !args.length) throw new Sk.builtin.TypeError("Color needs a value");
                    if (args.length === 1) c = components(args[0]);
                    else c = [clampByte(num(args[0])), clampByte(num(args[1])), clampByte(num(args[2])), args.length > 3 ? clampByte(num(args[3])) : 255];
                    this._r = c[0]; this._g = c[1]; this._b = c[2]; this._a = c[3];
                },
                tp$iter: function () {
                    return new Sk.builtin.tuple([pyInt(this._r), pyInt(this._g), pyInt(this._b), pyInt(this._a)]).tp$iter();
                },
                tp$as_sequence_or_mapping: true,
                mp$subscript: function (key) {
                    var vals = [this._r, this._g, this._b, this._a];
                    var i = num(key);
                    if (i < 0) i += 4;
                    if (i < 0 || i > 3) throw new Sk.builtin.IndexError("Color index out of range");
                    return pyInt(vals[i]);
                },
                sq$length: function () { return 4; },
                $r: function () { return pyStr("Color(" + this._r + ", " + this._g + ", " + this._b + ", " + this._a + ")"); },
            },
            getsets: {
                r: { $get: function () { return pyInt(this._r); }, $set: function (v) { this._r = clampByte(num(v)); } },
                g: { $get: function () { return pyInt(this._g); }, $set: function (v) { this._g = clampByte(num(v)); } },
                b: { $get: function () { return pyInt(this._b); }, $set: function (v) { this._b = clampByte(num(v)); } },
                a: { $get: function () { return pyInt(this._a); }, $set: function (v) { this._a = clampByte(num(v)); } },
            },
            methods: {
                normalize: {
                    $meth: function () {
                        return new Sk.builtin.tuple([new Sk.builtin.float_(this._r / 255), new Sk.builtin.float_(this._g / 255), new Sk.builtin.float_(this._b / 255), new Sk.builtin.float_(this._a / 255)]);
                    },
                    $flags: { NoArgs: true },
                },
            },
        });

        function newVector(x, y) {
            var v = alloc(api.Vector2.prototype, api.Vector2);
            v._isVector = true;
            v._x = x; v._y = y;
            return v;
        }

        function asVectorPair(other) {
            if (Sk.builtin.checkNumber(other)) return null;
            try { return pair(other); } catch (err) { return null; }
        }

        api.Vector2 = Sk.abstr.buildNativeClass("pygame.math.Vector2", {
            constructor: function Vector2() {},
            slots: {
                tp$getattr: Sk.generic.getAttr,
                tp$setattr: Sk.generic.setAttr,
                tp$as_number: true,
                tp$as_sequence_or_mapping: true,
                tp$new: function () {
                    var inst = alloc(this, api.Vector2);
                    inst._isVector = true;
                    inst._x = 0; inst._y = 0;
                    return inst;
                },
                tp$init: function (args) {
                    if (!args || !args.length) { this._x = 0; this._y = 0; return; }
                    if (args.length === 1) {
                        var p = pair(args[0]);
                        this._x = p[0]; this._y = p[1];
                        return;
                    }
                    this._x = num(args[0]); this._y = num(args[1]);
                },
                tp$iter: function () { return new Sk.builtin.tuple([pyNum(this._x), pyNum(this._y)]).tp$iter(); },
                mp$subscript: function (key) {
                    var i = num(key);
                    if (i < 0) i += 2;
                    if (i === 0) return pyNum(this._x);
                    if (i === 1) return pyNum(this._y);
                    throw new Sk.builtin.IndexError("Vector2 index out of range");
                },
                mp$ass_subscript: function (key, value) {
                    var i = num(key);
                    if (i < 0) i += 2;
                    if (i === 0) this._x = num(value);
                    else if (i === 1) this._y = num(value);
                    else throw new Sk.builtin.IndexError("Vector2 index out of range");
                },
                sq$length: function () { return 2; },
                nb$bool: function () { return this._x !== 0 || this._y !== 0; },
                nb$negative: function () { return newVector(-this._x, -this._y); },
                nb$positive: function () { return newVector(this._x, this._y); },
                nb$add: function (other) {
                    var p = asVectorPair(other);
                    if (!p) return Sk.builtin.NotImplemented.NotImplemented$;
                    return newVector(this._x + p[0], this._y + p[1]);
                },
                nb$subtract: function (other) {
                    var p = asVectorPair(other);
                    if (!p) return Sk.builtin.NotImplemented.NotImplemented$;
                    return newVector(this._x - p[0], this._y - p[1]);
                },
                nb$multiply: function (other) {
                    if (Sk.builtin.checkNumber(other)) return newVector(this._x * num(other), this._y * num(other));
                    var p = asVectorPair(other);
                    if (!p) return Sk.builtin.NotImplemented.NotImplemented$;
                    return new Sk.builtin.float_(this._x * p[0] + this._y * p[1]);
                },
                nb$divide: function (other) {
                    if (!Sk.builtin.checkNumber(other)) return Sk.builtin.NotImplemented.NotImplemented$;
                    var n = num(other);
                    if (!n) throw new Sk.builtin.ZeroDivisionError("division by zero");
                    return newVector(this._x / n, this._y / n);
                },
                nb$inplace_add: function (other) {
                    var p = pair(other);
                    this._x += p[0]; this._y += p[1];
                    return this;
                },
                nb$inplace_subtract: function (other) {
                    var p = pair(other);
                    this._x -= p[0]; this._y -= p[1];
                    return this;
                },
                nb$inplace_multiply: function (other) {
                    var n = num(other);
                    this._x *= n; this._y *= n;
                    return this;
                },
                $r: function () { return pyStr("Vector2(" + this._x + ", " + this._y + ")"); },
                tp$richcompare: function (other, op) {
                    if (!other || !other._isVector) return Sk.builtin.NotImplemented.NotImplemented$;
                    var eq = this._x === other._x && this._y === other._y;
                    if (op === "Eq") return eq;
                    if (op === "NotEq") return !eq;
                    return Sk.builtin.NotImplemented.NotImplemented$;
                },
            },
            getsets: {
                x: { $get: dimGet("_x"), $set: dimSet("_x") },
                y: { $get: dimGet("_y"), $set: dimSet("_y") },
            },
            methods: {
                length: { $meth: function () { return new Sk.builtin.float_(Math.hypot(this._x, this._y)); }, $flags: { NoArgs: true } },
                length_squared: { $meth: function () { return new Sk.builtin.float_(this._x * this._x + this._y * this._y); }, $flags: { NoArgs: true } },
                normalize: {
                    $meth: function () {
                        var len = Math.hypot(this._x, this._y);
                        if (!len) throw new Sk.builtin.ValueError("Can't normalize Vector of length Zero");
                        return newVector(this._x / len, this._y / len);
                    },
                    $flags: { NoArgs: true },
                },
                normalize_ip: {
                    $meth: function () {
                        var len = Math.hypot(this._x, this._y);
                        if (!len) throw new Sk.builtin.ValueError("Can't normalize Vector of length Zero");
                        this._x /= len; this._y /= len;
                        return PY_NONE;
                    },
                    $flags: { NoArgs: true },
                },
                scale_to_length: {
                    $meth: function (length) {
                        var len = Math.hypot(this._x, this._y);
                        if (!len) throw new Sk.builtin.ValueError("Can't scale Vector of length Zero");
                        var k = num(length) / len;
                        this._x *= k; this._y *= k;
                        return PY_NONE;
                    },
                    $flags: { OneArg: true },
                },
                rotate: {
                    $meth: function (angle) {
                        var rad = num(angle) * Math.PI / 180;
                        var c = Math.cos(rad), s = Math.sin(rad);
                        return newVector(this._x * c - this._y * s, this._x * s + this._y * c);
                    },
                    $flags: { OneArg: true },
                },
                rotate_ip: {
                    $meth: function (angle) {
                        var rad = num(angle) * Math.PI / 180;
                        var c = Math.cos(rad), s = Math.sin(rad);
                        var x = this._x * c - this._y * s;
                        var y = this._x * s + this._y * c;
                        this._x = x; this._y = y;
                        return PY_NONE;
                    },
                    $flags: { OneArg: true },
                },
                angle_to: {
                    $meth: function (other) {
                        var p = pair(other);
                        var dot = this._x * p[0] + this._y * p[1];
                        var det = this._x * p[1] - this._y * p[0];
                        return new Sk.builtin.float_(Math.atan2(det, dot) * 180 / Math.PI);
                    },
                    $flags: { OneArg: true },
                },
                dot: { $meth: function (other) { var p = pair(other); return new Sk.builtin.float_(this._x * p[0] + this._y * p[1]); }, $flags: { OneArg: true } },
                distance_to: { $meth: function (other) { var p = pair(other); return new Sk.builtin.float_(Math.hypot(this._x - p[0], this._y - p[1])); }, $flags: { OneArg: true } },
                lerp: {
                    $meth: function (other, amount) {
                        var p = pair(other);
                        var t = num(amount);
                        return newVector(this._x + (p[0] - this._x) * t, this._y + (p[1] - this._y) * t);
                    },
                    $flags: { MinArgs: 2, MaxArgs: 2 },
                },
                update: {
                    $meth: function (args) {
                        if (args.length === 1) { var p = pair(args[0]); this._x = p[0]; this._y = p[1]; }
                        else { this._x = num(args[0]); this._y = num(args[1]); }
                        return PY_NONE;
                    },
                    $flags: { FastCall: true, NoKwargs: true },
                },
                copy: { $meth: function () { return newVector(this._x, this._y); }, $flags: { NoArgs: true } },
            },
        });

        function blankSurface(w, h) {
            var surf = alloc(api.Surface.prototype, api.Surface);
            surf._isSurface = true;
            surf._w = Math.max(0, w | 0);
            surf._h = Math.max(0, h | 0);
            surf._canvas = new OffscreenCanvas(Math.max(1, surf._w), Math.max(1, surf._h));
            surf._ctx = surf._canvas.getContext("2d");
            surf._ctx.imageSmoothingEnabled = true;
            surf._alpha = null;
            surf._colorkey = null;
            surf._ckDirty = true;
            surf._ckCanvas = null;
            surf._clip = null;
            return surf;
        }

        function sourceCanvas(surface) {
            if (!surface._colorkey) return surface._canvas;
            if (!surface._ckDirty && surface._ckCanvas) return surface._ckCanvas;
            var copy = new OffscreenCanvas(Math.max(1, surface._w), Math.max(1, surface._h));
            var ctx = copy.getContext("2d");
            ctx.drawImage(surface._canvas, 0, 0);
            if (surface._w > 0 && surface._h > 0) {
                var img = ctx.getImageData(0, 0, surface._w, surface._h);
                var data = img.data;
                var r = surface._colorkey[0], g = surface._colorkey[1], b = surface._colorkey[2];
                for (var i = 0; i < data.length; i += 4) {
                    if (data[i] === r && data[i + 1] === g && data[i + 2] === b) data[i + 3] = 0;
                }
                ctx.putImageData(img, 0, 0);
            }
            surface._ckCanvas = copy;
            surface._ckDirty = false;
            return copy;
        }

        function doBlit(dest, source, position, area, flags) {
            if (!dest || !dest._isSurface || !source || !source._isSurface) {
                throw new Sk.builtin.TypeError("blit source and destination must be Surfaces");
            }
            var p = pair(position);
            var sx = 0, sy = 0, sw = source._w, sh = source._h;
            if (area && !isNone(area)) {
                var b = bounds(rectOf(area));
                sx = b.x; sy = b.y; sw = b.w; sh = b.h;
            }
            var ctx = dest._ctx;
            ctx.save();
            if (dest._clip) {
                var c = bounds(dest._clip);
                ctx.beginPath();
                ctx.rect(c.x, c.y, c.w, c.h);
                ctx.clip();
            }
            if (source._alpha !== null && source._alpha !== undefined) ctx.globalAlpha = Math.max(0, Math.min(1, source._alpha / 255));
            var flag = flags && !isNone(flags) ? num(flags) : 0;
            if (flag === C.BLEND_ADD || flag === C.BLEND_RGBA_ADD) ctx.globalCompositeOperation = "lighter";
            else if (flag === C.BLEND_MULT || flag === C.BLEND_RGB_MULT || flag === C.BLEND_RGBA_MULT) ctx.globalCompositeOperation = "multiply";
            if (sw > 0 && sh > 0) ctx.drawImage(sourceCanvas(source), sx, sy, sw, sh, p[0], p[1], sw, sh);
            ctx.restore();
            dest._ckDirty = true;
            return newRect(p[0], p[1], sw, sh);
        }

        function withCtx(surface, fn) {
            var ctx = surface._ctx;
            ctx.save();
            if (surface._clip) {
                var c = bounds(surface._clip);
                ctx.beginPath();
                ctx.rect(c.x, c.y, c.w, c.h);
                ctx.clip();
            }
            fn(ctx);
            ctx.restore();
            surface._ckDirty = true;
        }

        function drawRoundRect(ctx, x, y, w, h, radius) {
            var r = Math.max(0, Math.min(radius || 0, Math.min(w, h) / 2));
            if (typeof ctx.roundRect === "function" && r > 0) ctx.roundRect(x, y, w, h, r);
            else ctx.rect(x, y, w, h);
        }

        api.Surface = Sk.abstr.buildNativeClass("pygame.Surface", {
            constructor: function Surface() {},
            slots: {
                tp$getattr: Sk.generic.getAttr,
                tp$setattr: Sk.generic.setAttr,
                tp$new: function () {
                    var inst = alloc(this, api.Surface);
                    inst._isSurface = true;
                    inst._alpha = null;
                    inst._colorkey = null;
                    inst._ckDirty = true;
                    inst._clip = null;
                    return inst;
                },
                tp$init: function (args, kwargs) {
                    var parsed = Sk.abstr.copyKeywordsToNamedArgs("Surface", ["size", "flags", "depth"], args, kwargs || [], [PY_ZERO, PY_ZERO]);
                    var size = pair(parsed[0]);
                    this._w = Math.max(0, Math.floor(size[0]));
                    this._h = Math.max(0, Math.floor(size[1]));
                    this._canvas = new OffscreenCanvas(Math.max(1, this._w), Math.max(1, this._h));
                    this._ctx = this._canvas.getContext("2d");
                    this._ctx.imageSmoothingEnabled = true;
                },
                $r: function () { return pyStr("<Surface(" + this._w + "x" + this._h + ")>"); },
            },
            methods: {
                blit: {
                    $meth: function (source, dest, area, special_flags) { return doBlit(this, source, dest, area, special_flags); },
                    $flags: { NamedArgs: ["source", "dest", "area", "special_flags"], Defaults: [PY_NONE, PY_ZERO] },
                },
                fill: {
                    $meth: function (color, rect) {
                        var c = components(color);
                        var box = rect && !isNone(rect) ? bounds(rectOf(rect)) : { x: 0, y: 0, w: this._w, h: this._h };
                        withCtx(this, function (ctx) {
                            ctx.fillStyle = cssColor(c);
                            ctx.fillRect(box.x, box.y, box.w, box.h);
                        });
                        return newRect(box.x, box.y, box.w, box.h);
                    },
                    $flags: { NamedArgs: ["color", "rect"], Defaults: [PY_NONE] },
                },
                get_width: { $meth: function () { return pyInt(this._w); }, $flags: { NoArgs: true } },
                get_height: { $meth: function () { return pyInt(this._h); }, $flags: { NoArgs: true } },
                get_size: { $meth: function () { return pyPair(this._w, this._h); }, $flags: { NoArgs: true } },
                get_rect: {
                    $meth: function (args, kwargs) {
                        var rect = newRect(0, 0, this._w, this._h);
                        if (kwargs) {
                            for (var i = 0; i < kwargs.length; i += 2) placeRect(rect, kwargs[i], kwargs[i + 1]);
                        }
                        return rect;
                    },
                    $flags: { FastCall: true },
                },
                copy: {
                    $meth: function () {
                        var s = blankSurface(this._w, this._h);
                        if (this._w && this._h) s._ctx.drawImage(this._canvas, 0, 0);
                        s._alpha = this._alpha;
                        s._colorkey = this._colorkey ? this._colorkey.slice() : null;
                        return s;
                    },
                    $flags: { NoArgs: true },
                },
                convert: { $meth: function () { return api.Surface.prototype.copy.$meth.call(this); }, $flags: { FastCall: true, NoKwargs: true } },
                convert_alpha: { $meth: function () { return api.Surface.prototype.copy.$meth.call(this); }, $flags: { FastCall: true, NoKwargs: true } },
                set_colorkey: {
                    $meth: function (color) {
                        this._colorkey = isNone(color) ? null : components(color).slice(0, 3);
                        this._ckDirty = true;
                        return PY_NONE;
                    },
                    $flags: { MinArgs: 1, MaxArgs: 2 },
                },
                get_colorkey: {
                    $meth: function () {
                        if (!this._colorkey) return PY_NONE;
                        var color = alloc(api.Color.prototype, api.Color);
                        color._isColor = true;
                        color._r = this._colorkey[0];
                        color._g = this._colorkey[1];
                        color._b = this._colorkey[2];
                        color._a = 255;
                        return color;
                    },
                    $flags: { NoArgs: true },
                },
                set_alpha: {
                    $meth: function (alpha) {
                        this._alpha = isNone(alpha) ? null : clampByte(num(alpha));
                        return PY_NONE;
                    },
                    $flags: { MinArgs: 1, MaxArgs: 2 },
                },
                get_alpha: { $meth: function () { return this._alpha === null ? PY_NONE : pyInt(this._alpha); }, $flags: { NoArgs: true } },
                set_clip: { $meth: function (rect) { this._clip = isNone(rect) ? null : copyRect(rectOf(rect)); return PY_NONE; }, $flags: { OneArg: true } },
                get_clip: { $meth: function () { return this._clip ? copyRect(this._clip) : newRect(0, 0, this._w, this._h); }, $flags: { NoArgs: true } },
                get_flags: { $meth: function () { return pyInt(C.SRCALPHA); }, $flags: { NoArgs: true } },
                get_bitsize: { $meth: function () { return pyInt(32); }, $flags: { NoArgs: true } },
                get_bytesize: { $meth: function () { return pyInt(4); }, $flags: { NoArgs: true } },
                get_at: {
                    $meth: function (pos) {
                        var p = pair(pos);
                        var x = p[0] | 0, y = p[1] | 0;
                        if (x < 0 || y < 0 || x >= this._w || y >= this._h) throw new Sk.builtin.IndexError("pixel index out of range");
                        var data = this._ctx.getImageData(x, y, 1, 1).data;
                        var color = alloc(api.Color.prototype, api.Color);
                        color._isColor = true;
                        color._r = data[0]; color._g = data[1]; color._b = data[2]; color._a = data[3];
                        return color;
                    },
                    $flags: { OneArg: true },
                },
                set_at: {
                    $meth: function (pos, color) {
                        var p = pair(pos);
                        var c = components(color);
                        withCtx(this, function (ctx) {
                            ctx.fillStyle = cssColor(c);
                            ctx.fillRect(p[0], p[1], 1, 1);
                        });
                        return PY_NONE;
                    },
                    $flags: { MinArgs: 2, MaxArgs: 2 },
                },
                lock: { $meth: function () { return PY_NONE; }, $flags: { NoArgs: true } },
                unlock: { $meth: function () { return PY_NONE; }, $flags: { NoArgs: true } },
                mustlock: { $meth: function () { return Sk.builtin.bool.false$; }, $flags: { NoArgs: true } },
                get_locked: { $meth: function () { return Sk.builtin.bool.false$; }, $flags: { NoArgs: true } },
                subsurface: {
                    $meth: function (rect) {
                        var b = bounds(rectOf(rect));
                        var s = blankSurface(Math.max(0, b.w | 0), Math.max(0, b.h | 0));
                        if (b.w > 0 && b.h > 0) s._ctx.drawImage(this._canvas, b.x, b.y, b.w, b.h, 0, 0, b.w, b.h);
                        return s;
                    },
                    $flags: { OneArg: true },
                },
            },
        });

        function styleFont(font) {
            return (font._italic ? "italic " : "normal ") + (font._bold ? "700 " : "400 ") + font._size + "px " + font._family;
        }

        var FONT_MAP = {
            arial: "Arial, Helvetica, sans-serif",
            helvetica: "Helvetica, Arial, sans-serif",
            verdana: "Verdana, Geneva, sans-serif",
            comicsansms: "\"Comic Sans MS\", \"Comic Sans\", cursive",
            courier: "\"Courier New\", Courier, monospace",
            couriernew: "\"Courier New\", Courier, monospace",
            timesnewroman: "\"Times New Roman\", Times, serif",
            georgia: "Georgia, serif",
            impact: "Impact, sans-serif",
            trebuchetms: "\"Trebuchet MS\", sans-serif",
            monospace: "monospace",
            sansserif: "sans-serif",
            serif: "serif",
        };

        function familyOf(name) {
            if (isNone(name) || name === undefined) return "sans-serif";
            var uploaded = host.lookupFont(jsStr(name));
            if (uploaded) return uploaded;
            var key = jsStr(name).toLowerCase().replace(/[^a-z0-9]+/g, "");
            return FONT_MAP[key] || jsStr(name) || "sans-serif";
        }

        api.Font = Sk.abstr.buildNativeClass("pygame.font.Font", {
            constructor: function Font() {},
            slots: {
                tp$getattr: Sk.generic.getAttr,
                tp$setattr: Sk.generic.setAttr,
                tp$new: function () {
                    var inst = alloc(this, api.Font);
                    inst._size = 20; inst._bold = false; inst._italic = false; inst._family = "sans-serif";
                    return inst;
                },
                tp$init: function (args, kwargs) {
                    var parsed = Sk.abstr.copyKeywordsToNamedArgs("Font", ["file", "size"], args, kwargs || [], []);
                    this._size = Math.max(1, num(parsed[1] || pyInt(20)));
                    this._family = isNone(parsed[0]) ? "sans-serif" : (host.lookupFont(jsStr(parsed[0])) || "sans-serif");
                    this._bold = false; this._italic = false;
                },
            },
            methods: {
                render: {
                    $meth: function (text, antialias, color, background) {
                        var str = jsStr(text);
                        var col = components(color);
                        var bg = !isNone(background) ? components(background) : null;
                        var probe = new OffscreenCanvas(1, 1).getContext("2d");
                        var font = styleFont(this);
                        probe.font = font;
                        var metrics = probe.measureText(str || " ");
                        var ascent = metrics.actualBoundingBoxAscent || this._size * 0.8;
                        var descent = metrics.actualBoundingBoxDescent || this._size * 0.2;
                        var w = Math.max(1, Math.ceil(str ? metrics.width : 1));
                        var h = Math.max(1, Math.ceil(ascent + descent));
                        var surf = blankSurface(w, h);
                        if (bg) {
                            surf._ctx.fillStyle = cssColor(bg);
                            surf._ctx.fillRect(0, 0, w, h);
                        }
                        surf._ctx.font = font;
                        surf._ctx.fillStyle = cssColor(col);
                        surf._ctx.textBaseline = "alphabetic";
                        if (str) surf._ctx.fillText(str, 0, ascent);
                        return surf;
                    },
                    $flags: { NamedArgs: ["text", "antialias", "color", "background"], Defaults: [PY_NONE] },
                },
                size: {
                    $meth: function (text) {
                        var probe = new OffscreenCanvas(1, 1).getContext("2d");
                        probe.font = styleFont(this);
                        var metrics = probe.measureText(jsStr(text));
                        var ascent = metrics.actualBoundingBoxAscent || this._size * 0.8;
                        var descent = metrics.actualBoundingBoxDescent || this._size * 0.2;
                        return pyPair(Math.ceil(metrics.width), Math.ceil(ascent + descent));
                    },
                    $flags: { OneArg: true },
                },
                get_height: { $meth: function () { return pyInt(Math.ceil(this._size * 1.2)); }, $flags: { NoArgs: true } },
                get_ascent: { $meth: function () { return pyInt(Math.ceil(this._size * 0.8)); }, $flags: { NoArgs: true } },
                get_descent: { $meth: function () { return pyInt(Math.ceil(this._size * 0.2)); }, $flags: { NoArgs: true } },
                set_bold: { $meth: function (bold) { this._bold = isTrue(bold); return PY_NONE; }, $flags: { OneArg: true } },
                set_italic: { $meth: function (italic) { this._italic = isTrue(italic); return PY_NONE; }, $flags: { OneArg: true } },
                get_bold: { $meth: function () { return pyBool(this._bold); }, $flags: { NoArgs: true } },
                get_italic: { $meth: function () { return pyBool(this._italic); }, $flags: { NoArgs: true } },
            },
        });

        function makeEvent(type, fields) {
            var ev = alloc(api.Event.prototype, api.Event);
            ev._type = type;
            setAttr(ev, "type", pyInt(type));
            var dict = new Sk.builtin.dict();
            dict.mp$ass_subscript(pyStr("type"), pyInt(type));
            Object.keys(fields || {}).forEach(function (name) {
                setAttr(ev, name, fields[name]);
                dict.mp$ass_subscript(pyStr(name), fields[name]);
            });
            setAttr(ev, "dict", dict);
            return ev;
        }

        api.Event = Sk.abstr.buildNativeClass("pygame.event.Event", {
            constructor: function Event() {},
            slots: {
                tp$getattr: Sk.generic.getAttr,
                tp$setattr: Sk.generic.setAttr,
                tp$new: function () {
                    var inst = alloc(this, api.Event);
                    inst._type = 0;
                    return inst;
                },
                tp$init: function (args, kwargs) {
                    if (!args || !args.length) throw new Sk.builtin.TypeError("Event requires a type");
                    var type = num(args[0]);
                    this._type = type;
                    setAttr(this, "type", pyInt(type));
                    if (args[1] && args[1] instanceof Sk.builtin.dict) {
                        args[1].$items().forEach(function (pairItem) {
                            var key = pairItem[0];
                            setAttr(this, jsStr(key), pairItem[1]);
                        }.bind(this));
                    }
                    if (kwargs) {
                        for (var i = 0; i < kwargs.length; i += 2) setAttr(this, kwargs[i], kwargs[i + 1]);
                    }
                },
                $r: function () { return pyStr("<Event(" + this._type + ")>"); },
            },
        });

        function allows(type) {
            if (host.allowOnly) return !!host.allowOnly[type];
            return !host.blocked[type];
        }

        function convertRaw(ev) {
            var key;
            if (ev.kind === "posted") return ev.event;
            if (ev.kind === "userevent") return makeEvent(ev.type, {});
            if (ev.kind === "keydown" || ev.kind === "keyup") {
                key = ev.keyCode || mapCode(ev.code, ev.key);
                if (!key) return null;
                var unicode = ev.key && ev.key.length === 1 ? ev.key : "";
                return makeEvent(ev.kind === "keydown" ? C.KEYDOWN : C.KEYUP, {
                    key: pyInt(key),
                    unicode: pyStr(unicode),
                    mod: pyInt(modsOf(ev)),
                    scancode: pyInt(key),
                });
            }
            if (ev.kind === "mousemove") {
                var buttons = ev.buttons || host.mouseButtons;
                return makeEvent(C.MOUSEMOTION, {
                    pos: pyPair(ev.x, ev.y),
                    rel: pyPair(ev.relX || 0, ev.relY || 0),
                    buttons: new Sk.builtin.tuple([pyBool(buttons[0]), pyBool(buttons[1]), pyBool(buttons[2])]),
                });
            }
            if (ev.kind === "mousedown" || ev.kind === "mouseup") {
                return makeEvent(ev.kind === "mousedown" ? C.MOUSEBUTTONDOWN : C.MOUSEBUTTONUP, {
                    pos: pyPair(ev.x, ev.y),
                    button: pyInt(ev.button || 1),
                });
            }
            if (ev.kind === "wheel") {
                var wheelY = ev.dy > 0 ? -1 : 1;
                return makeEvent(C.MOUSEWHEEL, {
                    pos: pyPair(ev.x, ev.y),
                    x: pyInt(0),
                    y: pyInt(wheelY),
                    button: pyInt(ev.dy > 0 ? 5 : 4),
                });
            }
            return null;
        }

        function drain(filterType) {
            var out = [];
            var keep = [];
            host.rawQueue.forEach(function (raw) {
                var ev = convertRaw(raw);
                if (!ev) return;
                if (!allows(ev._type)) return;
                if (filterType !== null && ev._type !== filterType) {
                    keep.push(raw);
                    return;
                }
                out.push(ev);
            });
            host.rawQueue = filterType === null ? [] : keep;
            return new Sk.builtin.list(out);
        }

        function takeOne() {
            while (host.rawQueue.length) {
                var raw = host.rawQueue.shift();
                var ev = convertRaw(raw);
                if (ev && allows(ev._type)) return ev;
            }
            return null;
        }

        api.Clock = Sk.abstr.buildNativeClass("pygame.time.Clock", {
            constructor: function Clock() {},
            slots: {
                tp$new: function () {
                    var inst = alloc(this, api.Clock);
                    inst._last = (typeof performance !== "undefined" ? performance.now() : Date.now());
                    inst._samples = [];
                    inst._dt = 0;
                    return inst;
                },
                tp$init: function () {},
            },
            methods: {
                tick: {
                    $meth: function (fps) {
                        var target = isNone(fps) ? 0 : num(fps);
                        var now = (typeof performance !== "undefined" ? performance.now() : Date.now());
                        var elapsed = now - this._last;
                        var frameMs = target > 0 ? 1000 / target : 0;
                        var wait = 0;
                        if (host.flippedSinceTick) {
                            host.flippedSinceTick = false;
                            wait = Math.max(0, frameMs - Math.max(elapsed, frameMs > 0 ? Math.min(elapsed, 1000 / 60) : elapsed));
                        } else if (frameMs > 0) {
                            wait = Math.max(0, frameMs - elapsed);
                        }
                        var selfClock = this;
                        function finish() {
                            var end = (typeof performance !== "undefined" ? performance.now() : Date.now());
                            var used = Math.max(0, end - selfClock._last);
                            selfClock._last = end;
                            selfClock._dt = used;
                            selfClock._samples.push(used);
                            if (selfClock._samples.length > 30) selfClock._samples.shift();
                            return pyInt(Math.round(used));
                        }
                        if (wait > 1) return suspend(host.sleep(wait).then(finish));
                        return finish();
                    },
                    $flags: { NamedArgs: ["fps"], Defaults: [PY_NONE] },
                },
                tick_busy_loop: {
                    $meth: function (fps) { return api.Clock.prototype.tick.tp$call ? null : null; },
                    $flags: { NamedArgs: ["fps"], Defaults: [PY_NONE] },
                },
                get_fps: {
                    $meth: function () {
                        if (!this._samples.length) return new Sk.builtin.float_(0);
                        var sum = this._samples.reduce(function (a, b) { return a + b; }, 0);
                        var avg = sum / this._samples.length;
                        return new Sk.builtin.float_(avg > 0 ? 1000 / avg : 0);
                    },
                    $flags: { NoArgs: true },
                },
                get_time: { $meth: function () { return pyInt(Math.round(this._dt || 0)); }, $flags: { NoArgs: true } },
                get_rawtime: { $meth: function () { return pyInt(Math.round(this._dt || 0)); }, $flags: { NoArgs: true } },
            },
        });

        // Point tick_busy_loop at the same implementation after the class exists.
        api.Clock.prototype.tick_busy_loop = api.Clock.prototype.tick;

        function present() {
            host.flippedSinceTick = true;
            return noneSuspend(host.sleep(0));
        }

        function setMode(size) {
            var p = pair(size);
            var w = Math.max(1, Math.floor(p[0]));
            var h = Math.max(1, Math.floor(p[1]));
            host.canvas.width = w;
            host.canvas.height = h;
            host.width = w;
            host.height = h;
            host.ctx = host.canvas.getContext("2d");
            host.ctx.imageSmoothingEnabled = true;
            host.post({ type: "resize", w: w, h: h, caption: host.caption || "pygame" });
            var surf = alloc(api.Surface.prototype, api.Surface);
            surf._isSurface = true;
            surf._isScreen = true;
            surf._w = w;
            surf._h = h;
            surf._canvas = host.canvas;
            surf._ctx = host.ctx;
            surf._alpha = null;
            surf._colorkey = null;
            surf._ckDirty = true;
            surf._clip = null;
            host.ctx.fillStyle = "#000000";
            host.ctx.fillRect(0, 0, w, h);
            host.screen = surf;
            return surf;
        }

        function exportConsts(mod) {
            Object.keys(C).forEach(function (name) {
                mod[name] = new Sk.builtin.int_(C[name]);
            });
        }

        function addSprite(group, sprite) {
            if (!sprite || sprite._sprites) return;
            if (group._single) group._sprites.slice().forEach(function (sp) { removeFrom(group, sp); });
            if (group._sprites.indexOf(sprite) !== -1) return;
            group._sprites.push(sprite);
            if (!sprite._groups) sprite._groups = [];
            if (sprite._groups.indexOf(group) === -1) sprite._groups.push(group);
            sprite._alive = true;
        }
        function removeFrom(group, sprite) {
            var i = group._sprites.indexOf(sprite);
            if (i >= 0) group._sprites.splice(i, 1);
            if (sprite && sprite._groups) {
                var j = sprite._groups.indexOf(group);
                if (j >= 0) sprite._groups.splice(j, 1);
            }
        }
        function absorb(group, obj) {
            if (!obj || isNone(obj)) return;
            if (obj._sprites && obj !== group) {
                obj._sprites.slice().forEach(function (sp) { addSprite(group, sp); });
                return;
            }
            if (obj instanceof Sk.builtin.list || obj instanceof Sk.builtin.tuple) {
                obj.v.forEach(function (item) { absorb(group, item); });
                return;
            }
            addSprite(group, obj);
        }
        function killSprite(sprite) {
            (sprite._groups || []).slice().forEach(function (g) { removeFrom(g, sprite); });
            sprite._alive = false;
        }
        function attrOf(obj, name) {
            try { return Sk.abstr.gattr(obj, pyStr(name)); } catch (err) { return null; }
        }

        var spriteMethods = {
            update: {
                $meth: function (args) {
                    this._sprites.slice().forEach(function (sp) {
                        var meth = attrOf(sp, "update");
                        if (meth) Sk.misceval.callsimArray(meth, args || []);
                    });
                    return PY_NONE;
                },
                $flags: { FastCall: true, NoKwargs: true },
            },
            draw: {
                $meth: function (surface) {
                    var rects = [];
                    this._sprites.forEach(function (sp) {
                        var image = attrOf(sp, "image");
                        var rect = attrOf(sp, "rect");
                        if (image && rect && image._isSurface && rect._isRect) rects.push(doBlit(surface, image, rect, null));
                    });
                    return new Sk.builtin.list(rects);
                },
                $flags: { OneArg: true },
            },
            add: { $meth: function (args) { var selfGroup = this; (args || []).forEach(function (a) { absorb(selfGroup, a); }); return PY_NONE; }, $flags: { FastCall: true, NoKwargs: true } },
            remove: {
                $meth: function (args) {
                    var selfGroup = this;
                    (args || []).forEach(function (a) {
                        if (a && a._sprites) a._sprites.slice().forEach(function (sp) { removeFrom(selfGroup, sp); });
                        else if (a instanceof Sk.builtin.list || a instanceof Sk.builtin.tuple) a.v.forEach(function (sp) { removeFrom(selfGroup, sp); });
                        else removeFrom(selfGroup, a);
                    });
                    return PY_NONE;
                },
                $flags: { FastCall: true, NoKwargs: true },
            },
            sprites: { $meth: function () { return new Sk.builtin.list(this._sprites.slice()); }, $flags: { NoArgs: true } },
            empty: { $meth: function () { var selfGroup = this; this._sprites.slice().forEach(function (sp) { removeFrom(selfGroup, sp); }); return PY_NONE; }, $flags: { NoArgs: true } },
            has: { $meth: function (sprite) { return pyBool(this._sprites.indexOf(sprite) !== -1); }, $flags: { OneArg: true } },
            copy: {
                $meth: function () {
                    var g = alloc(api.Group.prototype, api.Group);
                    g._sprites = []; g._single = false;
                    this._sprites.forEach(function (sp) { addSprite(g, sp); });
                    return g;
                },
                $flags: { NoArgs: true },
            },
        };

        function groupSlots(single) {
            return {
                tp$getattr: Sk.generic.getAttr,
                tp$setattr: Sk.generic.setAttr,
                tp$new: function () {
                    var inst = alloc(this, single ? api.GroupSingle : api.Group);
                    inst._sprites = [];
                    inst._single = !!single;
                    return inst;
                },
                tp$init: function (args) {
                    this._sprites = this._sprites || [];
                    this._single = !!single;
                    var selfGroup = this;
                    (args || []).forEach(function (a) { absorb(selfGroup, a); });
                },
                tp$iter: function () { return new Sk.builtin.list(this._sprites.slice()).tp$iter(); },
                tp$as_sequence_or_mapping: true,
                sq$length: function () { return this._sprites.length; },
                sq$contains: function (item) { return this._sprites.indexOf(item) !== -1; },
                nb$bool: function () { return this._sprites.length > 0; },
                $r: function () { return pyStr("<Group(" + this._sprites.length + " sprites)>"); },
            };
        }

        api.Group = Sk.abstr.buildNativeClass("pygame.sprite.Group", {
            constructor: function Group() {},
            slots: groupSlots(false),
            methods: spriteMethods,
        });
        api.GroupSingle = Sk.abstr.buildNativeClass("pygame.sprite.GroupSingle", {
            constructor: function GroupSingle() {},
            slots: groupSlots(true),
            methods: spriteMethods,
        });

        api.Sprite = Sk.abstr.buildNativeClass("pygame.sprite.Sprite", {
            constructor: function Sprite() {},
            slots: {
                tp$getattr: Sk.generic.getAttr,
                tp$setattr: Sk.generic.setAttr,
                tp$new: function () {
                    var inst = alloc(this, api.Sprite);
                    inst._groups = [];
                    inst._alive = true;
                    inst._id = host.spriteSeq++;
                    return inst;
                },
                tp$init: function (args) {
                    this._groups = [];
                    this._alive = true;
                    if (!this._id) this._id = host.spriteSeq++;
                    setAttr(this, "image", PY_NONE);
                    setAttr(this, "rect", PY_NONE);
                    (args || []).forEach(function (g) {
                        if (g && g._sprites) addSprite(g, this);
                        else if (g instanceof Sk.builtin.list || g instanceof Sk.builtin.tuple) {
                            g.v.forEach(function (group) { if (group && group._sprites) addSprite(group, this); }.bind(this));
                        }
                    }.bind(this));
                },
                tp$hash: function () { return this._id || 0; },
                $r: function () { return pyStr("<Sprite sprite>"); },
            },
            methods: {
                update: { $meth: function () { return PY_NONE; }, $flags: { FastCall: true, NoKwargs: true } },
                add: { $meth: function (args) { (args || []).forEach(function (g) { if (g && g._sprites) addSprite(g, this); }.bind(this)); return PY_NONE; }, $flags: { FastCall: true, NoKwargs: true } },
                remove: { $meth: function (args) { (args || []).forEach(function (g) { if (g && g._sprites) removeFrom(g, this); }.bind(this)); return PY_NONE; }, $flags: { FastCall: true, NoKwargs: true } },
                kill: { $meth: function () { killSprite(this); return PY_NONE; }, $flags: { NoArgs: true } },
                alive: { $meth: function () { return pyBool(!!this._alive); }, $flags: { NoArgs: true } },
                groups: { $meth: function () { return new Sk.builtin.list((this._groups || []).slice()); }, $flags: { NoArgs: true } },
            },
        });

        api.PygameError = Sk.abstr.buildNativeClass("pygame.error", {
            constructor: function error(message) {
                var text = message == null ? "" : String(message);
                this.args = new Sk.builtin.tuple([pyStr(text)]);
                this.traceback = [];
            },
            base: Sk.builtin.Exception,
            slots: {
                tp$new: function () {
                    var inst = alloc(this, api.PygameError);
                    inst.args = new Sk.builtin.tuple([]);
                    inst.traceback = [];
                    return inst;
                },
                tp$init: function (args) {
                    var msg = args && args.length ? args[0] : pyStr("");
                    this.args = new Sk.builtin.tuple([msg]);
                },
            },
        });

        function pygameError(message) {
            return new api.PygameError(message);
        }

        function transformSurface(source, width, height, draw) {
            var dst = blankSurface(Math.max(1, width | 0), Math.max(1, height | 0));
            dst._w = Math.max(0, width | 0);
            dst._h = Math.max(0, height | 0);
            draw(dst._ctx, dst);
            dst._alpha = source._alpha;
            dst._colorkey = source._colorkey ? source._colorkey.slice() : null;
            dst._ckDirty = true;
            return dst;
        }

        api.doBlit = doBlit;
        api.newRect = newRect;
        api.components = components;
        api.makeEvent = makeEvent;
        api.pygameError = pygameError;

        api.fillMain = function (mod) {
            exportConsts(mod);
            mod.Rect = api.Rect;
            mod.Surface = api.Surface;
            mod.Color = api.Color;
            mod.Vector2 = api.Vector2;
            mod.error = api.PygameError;
            mod.Clock = api.Clock;
            Sk.abstr.setUpModuleMethods("pygame", mod, {
                init: {
                    $meth: function () {
                        host.inited = true;
                        host.startTime = (typeof performance !== "undefined" ? performance.now() : Date.now());
                        return new Sk.builtin.tuple([pyInt(6), pyInt(0)]);
                    },
                    $flags: { NoArgs: true },
                },
                quit: {
                    $meth: function () { host.inited = false; host.clearTimers(); return PY_NONE; },
                    $flags: { NoArgs: true },
                },
                get_init: { $meth: function () { return pyBool(host.inited); }, $flags: { NoArgs: true } },
                get_error: { $meth: function () { return pyStr(""); }, $flags: { NoArgs: true } },
                get_sdl_version: { $meth: function () { return new Sk.builtin.tuple([pyInt(2), pyInt(28), pyInt(0)]); }, $flags: { NoArgs: true } },
            });
            return mod;
        };

        api.fillConstants = function (mod) { exportConsts(mod); return mod; };
        api.fillLocals = function (mod) {
            exportConsts(mod);
            mod.Rect = api.Rect;
            mod.Color = api.Color;
            return mod;
        };
        api.fillRect = function (mod) { mod.Rect = api.Rect; return mod; };
        api.fillColor = function (mod) { mod.Color = api.Color; return mod; };
        api.fillSurface = function (mod) { mod.Surface = api.Surface; return mod; };
        api.fillMath = function (mod) { mod.Vector2 = api.Vector2; return mod; };
        api.fillVersion = function (mod) {
            mod.ver = pyStr("2.1.0");
            mod.vernum = new Sk.builtin.tuple([pyInt(2), pyInt(1), pyInt(0)]);
            mod.rev = pyStr("web");
            return mod;
        };

        api.fillDisplay = function (mod) {
            Sk.abstr.setUpModuleMethods("pygame.display", mod, {
                init: { $meth: function () { return PY_NONE; }, $flags: { NoArgs: true } },
                quit: { $meth: function () { return PY_NONE; }, $flags: { NoArgs: true } },
                get_init: { $meth: function () { return pyBool(!!host.screen); }, $flags: { NoArgs: true } },
                set_mode: {
                    $meth: function (size) { return setMode(size); },
                    $flags: { NamedArgs: ["size", "flags", "depth", "display", "vsync"], Defaults: [PY_ZERO, PY_ZERO, PY_ZERO, PY_ZERO] },
                },
                get_surface: { $meth: function () { return host.screen || PY_NONE; }, $flags: { NoArgs: true } },
                flip: { $meth: function () { return present(); }, $flags: { NoArgs: true } },
                update: { $meth: function () { return present(); }, $flags: { FastCall: true, NoKwargs: true } },
                set_caption: {
                    $meth: function (title) {
                        host.caption = jsStr(title);
                        host.post({ type: "caption", text: host.caption });
                        return PY_NONE;
                    },
                    $flags: { MinArgs: 1, MaxArgs: 2 },
                },
                get_caption: { $meth: function () { var t = pyStr(host.caption || "pygame"); return new Sk.builtin.tuple([t, t]); }, $flags: { NoArgs: true } },
                get_window_size: { $meth: function () { return pyPair(host.width, host.height); }, $flags: { NoArgs: true } },
                get_driver: { $meth: function () { return pyStr("web"); }, $flags: { NoArgs: true } },
                get_active: { $meth: function () { return Sk.builtin.bool.true$; }, $flags: { NoArgs: true } },
                list_modes: { $meth: function () { return new Sk.builtin.list([pyPair(host.width, host.height)]); }, $flags: { FastCall: true, NoKwargs: true } },
            });
            return mod;
        };

        api.fillDraw = function (mod) {
            function paint(surface, color, draw) {
                var c = components(color);
                withCtx(surface, function (ctx) {
                    ctx.fillStyle = cssColor(c);
                    ctx.strokeStyle = cssColor(c);
                    ctx.lineCap = "round";
                    ctx.lineJoin = "round";
                    draw(ctx);
                });
            }
            Sk.abstr.setUpModuleMethods("pygame.draw", mod, {
                rect: {
                    $meth: function (surface, color, rect, width, border_radius) {
                        var b = bounds(rectOf(rect));
                        var w = isNone(width) ? 0 : num(width);
                        var radius = isNone(border_radius) ? 0 : num(border_radius);
                        paint(surface, color, function (ctx) {
                            ctx.beginPath();
                            if (w <= 0) {
                                drawRoundRect(ctx, b.x, b.y, b.w, b.h, radius);
                                ctx.fill();
                            } else {
                                var inset = w / 2;
                                drawRoundRect(ctx, b.x + inset, b.y + inset, Math.max(0, b.w - w), Math.max(0, b.h - w), radius);
                                ctx.lineWidth = w;
                                ctx.stroke();
                            }
                        });
                        return newRect(b.x, b.y, b.w, b.h);
                    },
                    $flags: { NamedArgs: ["surface", "color", "rect", "width", "border_radius"], Defaults: [PY_ZERO, PY_ZERO] },
                },
                circle: {
                    $meth: function (surface, color, center, radius, width) {
                        var p = pair(center);
                        var r = num(radius);
                        var w = isNone(width) ? 0 : num(width);
                        paint(surface, color, function (ctx) {
                            ctx.beginPath();
                            ctx.arc(p[0], p[1], Math.abs(r), 0, Math.PI * 2);
                            if (w <= 0) ctx.fill();
                            else { ctx.lineWidth = w; ctx.stroke(); }
                        });
                        return newRect(p[0] - r, p[1] - r, r * 2, r * 2);
                    },
                    $flags: { NamedArgs: ["surface", "color", "center", "radius", "width"], Defaults: [PY_ZERO] },
                },
                ellipse: {
                    $meth: function (surface, color, rect, width) {
                        var b = bounds(rectOf(rect));
                        var w = isNone(width) ? 0 : num(width);
                        paint(surface, color, function (ctx) {
                            ctx.beginPath();
                            ctx.ellipse(b.x + b.w / 2, b.y + b.h / 2, Math.max(0.01, Math.abs(b.w / 2)), Math.max(0.01, Math.abs(b.h / 2)), 0, 0, Math.PI * 2);
                            if (w <= 0) ctx.fill();
                            else { ctx.lineWidth = w; ctx.stroke(); }
                        });
                        return newRect(b.x, b.y, b.w, b.h);
                    },
                    $flags: { NamedArgs: ["surface", "color", "rect", "width"], Defaults: [PY_ZERO] },
                },
                line: {
                    $meth: function (surface, color, start, end, width) {
                        var a = pair(start), b = pair(end);
                        var w = Math.max(1, isNone(width) ? 1 : num(width));
                        paint(surface, color, function (ctx) {
                            ctx.beginPath();
                            ctx.moveTo(a[0], a[1]);
                            ctx.lineTo(b[0], b[1]);
                            ctx.lineWidth = w;
                            ctx.stroke();
                        });
                        return newRect(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
                    },
                    $flags: { NamedArgs: ["surface", "color", "start_pos", "end_pos", "width"], Defaults: [PY_ONE] },
                },
                aaline: {
                    $meth: function (surface, color, start, end) {
                        return modLine(surface, color, start, end, PY_ONE);
                    },
                    $flags: { MinArgs: 4, MaxArgs: 5 },
                },
                polygon: {
                    $meth: function (surface, color, points, width) {
                        var pts = (points.v || []).map(pair);
                        var w = isNone(width) ? 0 : num(width);
                        if (pts.length) {
                            paint(surface, color, function (ctx) {
                                ctx.beginPath();
                                ctx.moveTo(pts[0][0], pts[0][1]);
                                for (var i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i][0], pts[i][1]);
                                ctx.closePath();
                                if (w <= 0) ctx.fill();
                                else { ctx.lineWidth = w; ctx.stroke(); }
                            });
                        }
                        return newRect(0, 0, 0, 0);
                    },
                    $flags: { NamedArgs: ["surface", "color", "points", "width"], Defaults: [PY_ZERO] },
                },
                lines: {
                    $meth: function (surface, color, closed, points, width) {
                        var pts = (points.v || []).map(pair);
                        var w = Math.max(1, isNone(width) ? 1 : num(width));
                        if (pts.length > 1) {
                            paint(surface, color, function (ctx) {
                                ctx.beginPath();
                                ctx.moveTo(pts[0][0], pts[0][1]);
                                for (var i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i][0], pts[i][1]);
                                if (isTrue(closed)) ctx.closePath();
                                ctx.lineWidth = w;
                                ctx.stroke();
                            });
                        }
                        return newRect(0, 0, 0, 0);
                    },
                    $flags: { NamedArgs: ["surface", "color", "closed", "points", "width"], Defaults: [PY_ONE] },
                },
                aalines: {
                    $meth: function (surface, color, closed, points) {
                        return null;
                    },
                    $flags: { MinArgs: 4, MaxArgs: 5 },
                },
                arc: {
                    $meth: function (surface, color, rect, start_angle, stop_angle, width) {
                        var b = bounds(rectOf(rect));
                        var w = Math.max(1, isNone(width) ? 1 : num(width));
                        paint(surface, color, function (ctx) {
                            ctx.beginPath();
                            ctx.ellipse(b.x + b.w / 2, b.y + b.h / 2, Math.max(0.01, Math.abs(b.w / 2)), Math.max(0.01, Math.abs(b.h / 2)), 0, -num(start_angle), -num(stop_angle), true);
                            ctx.lineWidth = w;
                            ctx.stroke();
                        });
                        return newRect(b.x, b.y, b.w, b.h);
                    },
                    $flags: { NamedArgs: ["surface", "color", "rect", "start_angle", "stop_angle", "width"], Defaults: [PY_ONE] },
                },
            });
            function modLine(surface, color, start, end, width) {
                var fn = mod.line;
                return Sk.misceval.callsimArray(fn, [surface, color, start, end, width]);
            }
            mod.aaline = new Sk.builtin.sk_method({
                $name: "aaline",
                $flags: { MinArgs: 4, MaxArgs: 5 },
                $meth: function (surface, color, start, end) { return Sk.misceval.callsimArray(mod.line, [surface, color, start, end, PY_ONE]); },
            }, null);
            mod.aalines = new Sk.builtin.sk_method({
                $name: "aalines",
                $flags: { MinArgs: 4, MaxArgs: 5 },
                $meth: function (surface, color, closed, points) { return Sk.misceval.callsimArray(mod.lines, [surface, color, closed, points, PY_ONE]); },
            }, null);
            return mod;
        };

        api.fillEvent = function (mod) {
            mod.Event = api.Event;
            Sk.abstr.setUpModuleMethods("pygame.event", mod, {
                get: {
                    $meth: function (type) { return drain(isNone(type) ? null : num(type)); },
                    $flags: { NamedArgs: ["eventtype"], Defaults: [PY_NONE] },
                },
                poll: {
                    $meth: function () {
                        var one = takeOne();
                        return one || makeEvent(C.NOEVENT, {});
                    },
                    $flags: { NoArgs: true },
                },
                wait: {
                    $meth: function () {
                        var existing = takeOne();
                        if (existing) return existing;
                        return suspend(new Promise(function (resolve) {
                            host.eventWaiters.push(function () { resolve(takeOne() || makeEvent(C.NOEVENT, {})); });
                        }));
                    },
                    $flags: { NoArgs: true },
                },
                clear: {
                    $meth: function (type) { drain(isNone(type) ? null : num(type)); return PY_NONE; },
                    $flags: { NamedArgs: ["eventtype"], Defaults: [PY_NONE] },
                },
                post: { $meth: function (event) { host.pushRaw({ kind: "posted", event: event }); return PY_NONE; }, $flags: { OneArg: true } },
                pump: { $meth: function () { return PY_NONE; }, $flags: { NoArgs: true } },
                peek: {
                    $meth: function (type) {
                        var items = host.rawQueue.map(convertRaw).filter(function (ev) { return ev && allows(ev._type); });
                        if (isNone(type)) return pyBool(items.length > 0);
                        var n = num(type);
                        return pyBool(items.some(function (ev) { return ev._type === n; }));
                    },
                    $flags: { NamedArgs: ["eventtype"], Defaults: [PY_NONE] },
                },
                event_name: {
                    $meth: function (type) {
                        var names = {};
                        names[C.QUIT] = "Quit"; names[C.KEYDOWN] = "KeyDown"; names[C.KEYUP] = "KeyUp";
                        names[C.MOUSEMOTION] = "MouseMotion"; names[C.MOUSEBUTTONDOWN] = "MouseButtonDown";
                        names[C.MOUSEBUTTONUP] = "MouseButtonUp"; names[C.MOUSEWHEEL] = "MouseWheel";
                        return pyStr(names[num(type)] || "UserEvent");
                    },
                    $flags: { OneArg: true },
                },
                set_blocked: {
                    $meth: function (type) {
                        var values = type instanceof Sk.builtin.list || type instanceof Sk.builtin.tuple ? type.v : [type];
                        values.forEach(function (item) { host.blocked[num(item)] = true; });
                        host.allowOnly = null;
                        return PY_NONE;
                    },
                    $flags: { OneArg: true },
                },
                set_allowed: {
                    $meth: function (type) {
                        if (isNone(type)) { host.blocked = Object.create(null); host.allowOnly = null; return PY_NONE; }
                        host.allowOnly = Object.create(null);
                        var values = type instanceof Sk.builtin.list || type instanceof Sk.builtin.tuple ? type.v : [type];
                        values.forEach(function (item) { host.allowOnly[num(item)] = true; });
                        return PY_NONE;
                    },
                    $flags: { OneArg: true },
                },
                get_blocked: { $meth: function (type) { return pyBool(!allows(num(type))); }, $flags: { OneArg: true } },
                set_grab: { $meth: function () { return PY_NONE; }, $flags: { OneArg: true } },
                get_grab: { $meth: function () { return Sk.builtin.bool.true$; }, $flags: { NoArgs: true } },
            });
            return mod;
        };

        api.fillKey = function (mod) {
            var KeyState = Sk.abstr.buildNativeClass("pygame.key.ScancodeWrapper", {
                constructor: function ScancodeWrapper() {},
                slots: {
                    tp$new: function () { return alloc(this, KeyState); },
                    tp$as_sequence_or_mapping: true,
                    mp$subscript: function (key) { return pyBool(!!host.keys[num(key)]); },
                    sq$length: function () { return 512; },
                },
            });
            Sk.abstr.setUpModuleMethods("pygame.key", mod, {
                get_pressed: { $meth: function () { return alloc(KeyState.prototype, KeyState); }, $flags: { NoArgs: true } },
                get_mods: { $meth: function () { return pyInt(host.mods); }, $flags: { NoArgs: true } },
                get_focused: { $meth: function () { return Sk.builtin.bool.true$; }, $flags: { NoArgs: true } },
                name: {
                    $meth: function (key) {
                        var n = num(key);
                        if (n >= 32 && n < 127) return pyStr(String.fromCharCode(n));
                        var found = "unknown";
                        Object.keys(C).forEach(function (name) {
                            if (C[name] === n && name.indexOf("K_") === 0) found = name.slice(2).toLowerCase();
                        });
                        return pyStr(found);
                    },
                    $flags: { OneArg: true },
                },
                set_repeat: {
                    $meth: function (delay) {
                        var enabled = !(isNone(delay) || num(delay) === 0);
                        host.keyRepeat = enabled;
                        host.post({ type: "key-repeat", enabled: enabled });
                        return PY_NONE;
                    },
                    $flags: { NamedArgs: ["delay", "interval"], Defaults: [PY_ZERO, PY_ZERO] },
                },
                get_repeat: { $meth: function () { return new Sk.builtin.tuple([pyInt(host.keyRepeat ? 1 : 0), pyInt(0)]); }, $flags: { NoArgs: true } },
            });
            return mod;
        };

        api.fillMouse = function (mod) {
            Sk.abstr.setUpModuleMethods("pygame.mouse", mod, {
                get_pos: { $meth: function () { return pyPair(host.mouseX, host.mouseY); }, $flags: { NoArgs: true } },
                get_rel: {
                    $meth: function () {
                        var rel = pyPair(host.mouseRelX, host.mouseRelY);
                        host.mouseRelX = 0; host.mouseRelY = 0;
                        return rel;
                    },
                    $flags: { NoArgs: true },
                },
                get_pressed: {
                    $meth: function () {
                        return new Sk.builtin.tuple([pyBool(host.mouseButtons[0]), pyBool(host.mouseButtons[1]), pyBool(host.mouseButtons[2])]);
                    },
                    $flags: { NamedArgs: ["num_buttons"], Defaults: [new Sk.builtin.int_(3)] },
                },
                set_pos: {
                    $meth: function (pos) { var p = pair(pos); host.mouseX = p[0]; host.mouseY = p[1]; return PY_NONE; },
                    $flags: { OneArg: true },
                },
                set_visible: {
                    $meth: function (visible) {
                        host.cursorVisible = isTrue(visible);
                        host.post({ type: "cursor", visible: host.cursorVisible });
                        return pyBool(!host.cursorVisible);
                    },
                    $flags: { OneArg: true },
                },
                get_visible: { $meth: function () { return pyBool(host.cursorVisible !== false); }, $flags: { NoArgs: true } },
                get_focused: { $meth: function () { return Sk.builtin.bool.true$; }, $flags: { NoArgs: true } },
            });
            return mod;
        };

        api.fillFont = function (mod) {
            mod.Font = api.Font;
            Sk.abstr.setUpModuleMethods("pygame.font", mod, {
                init: { $meth: function () { host.fontInited = true; return PY_NONE; }, $flags: { NoArgs: true } },
                quit: { $meth: function () { host.fontInited = false; return PY_NONE; }, $flags: { NoArgs: true } },
                get_init: { $meth: function () { return pyBool(host.inited || host.fontInited); }, $flags: { NoArgs: true } },
                get_default_font: { $meth: function () { return pyStr("sans-serif"); }, $flags: { NoArgs: true } },
                get_fonts: {
                    $meth: function () {
                        return new Sk.builtin.list(Object.keys(FONT_MAP).map(pyStr));
                    },
                    $flags: { NoArgs: true },
                },
                SysFont: {
                    $meth: function (name, size, bold, italic) {
                        var font = alloc(api.Font.prototype, api.Font);
                        font._size = Math.max(1, num(size));
                        font._bold = isTrue(bold);
                        font._italic = isTrue(italic);
                        font._family = familyOf(name);
                        return font;
                    },
                    $flags: { NamedArgs: ["name", "size", "bold", "italic"], Defaults: [Sk.builtin.bool.false$, Sk.builtin.bool.false$] },
                },
            });
            return mod;
        };

        api.fillImage = function (mod) {
            Sk.abstr.setUpModuleMethods("pygame.image", mod, {
                load: {
                    $meth: function (filename) {
                        var name = jsStr(filename);
                        var bmp = host.lookupImage(name);
                        if (!bmp) throw pygameError("Couldn't open " + name);
                        var surf = blankSurface(bmp.width, bmp.height);
                        surf._ctx.drawImage(bmp, 0, 0);
                        return surf;
                    },
                    $flags: { OneArg: true },
                },
                save: {
                    $meth: function (surface, filename) {
                        var name = jsStr(filename);
                        return noneSuspend(surface._canvas.convertToBlob({ type: "image/png" }).then(function (blob) {
                            host.post({ type: "download", blob: blob, filename: name });
                        }));
                    },
                    $flags: { MinArgs: 2, MaxArgs: 2 },
                },
                get_extended: { $meth: function () { return Sk.builtin.bool.true$; }, $flags: { NoArgs: true } },
            });
            return mod;
        };

        api.fillTransform = function (mod) {
            Sk.abstr.setUpModuleMethods("pygame.transform", mod, {
                scale: {
                    $meth: function (surface, size) {
                        var p = pair(size);
                        return transformSurface(surface, p[0], p[1], function (ctx) {
                            ctx.imageSmoothingEnabled = false;
                            ctx.drawImage(surface._canvas, 0, 0, Math.max(1, p[0] | 0), Math.max(1, p[1] | 0));
                        });
                    },
                    $flags: { MinArgs: 2, MaxArgs: 2 },
                },
                smoothscale: {
                    $meth: function (surface, size) {
                        var p = pair(size);
                        return transformSurface(surface, p[0], p[1], function (ctx) {
                            ctx.imageSmoothingEnabled = true;
                            ctx.drawImage(surface._canvas, 0, 0, Math.max(1, p[0] | 0), Math.max(1, p[1] | 0));
                        });
                    },
                    $flags: { MinArgs: 2, MaxArgs: 2 },
                },
                rotate: {
                    $meth: function (surface, angle) {
                        var rad = -num(angle) * Math.PI / 180;
                        var sin = Math.abs(Math.sin(rad)), cos = Math.abs(Math.cos(rad));
                        var w = surface._w, h = surface._h;
                        var nw = Math.max(1, Math.ceil(w * cos + h * sin));
                        var nh = Math.max(1, Math.ceil(w * sin + h * cos));
                        return transformSurface(surface, nw, nh, function (ctx) {
                            ctx.translate(nw / 2, nh / 2);
                            ctx.rotate(rad);
                            ctx.drawImage(surface._canvas, -w / 2, -h / 2);
                        });
                    },
                    $flags: { MinArgs: 2, MaxArgs: 2 },
                },
                rotozoom: {
                    $meth: function (surface, angle, scale) {
                        var scaledW = Math.max(1, Math.round(surface._w * num(scale)));
                        var scaledH = Math.max(1, Math.round(surface._h * num(scale)));
                        var scaled = transformSurface(surface, scaledW, scaledH, function (ctx) {
                            ctx.imageSmoothingEnabled = true;
                            ctx.drawImage(surface._canvas, 0, 0, scaledW, scaledH);
                        });
                        return Sk.misceval.callsimArray(mod.rotate, [scaled, angle]);
                    },
                    $flags: { MinArgs: 3, MaxArgs: 3 },
                },
                flip: {
                    $meth: function (surface, flip_x, flip_y) {
                        var fx = isTrue(flip_x), fy = isTrue(flip_y);
                        return transformSurface(surface, surface._w, surface._h, function (ctx) {
                            ctx.translate(fx ? surface._w : 0, fy ? surface._h : 0);
                            ctx.scale(fx ? -1 : 1, fy ? -1 : 1);
                            ctx.drawImage(surface._canvas, 0, 0);
                        });
                    },
                    $flags: { MinArgs: 3, MaxArgs: 3 },
                },
                scale2x: {
                    $meth: function (surface) {
                        return transformSurface(surface, surface._w * 2, surface._h * 2, function (ctx) {
                            ctx.imageSmoothingEnabled = false;
                            ctx.drawImage(surface._canvas, 0, 0, surface._w * 2, surface._h * 2);
                        });
                    },
                    $flags: { OneArg: true },
                },
            });
            return mod;
        };

        api.fillTime = function (mod) {
            mod.Clock = api.Clock;
            Sk.abstr.setUpModuleMethods("pygame.time", mod, {
                get_ticks: {
                    $meth: function () {
                        var now = (typeof performance !== "undefined" ? performance.now() : Date.now());
                        return pyInt(Math.max(0, Math.round(now - host.startTime)));
                    },
                    $flags: { NoArgs: true },
                },
                delay: { $meth: function (ms) { var n = Math.max(0, num(ms)); return suspend(host.sleep(n).then(function () { return pyInt(Math.round(n)); })); }, $flags: { OneArg: true } },
                wait: { $meth: function (ms) { var n = Math.max(0, num(ms)); return suspend(host.sleep(n).then(function () { return pyInt(Math.round(n)); })); }, $flags: { OneArg: true } },
                set_timer: {
                    $meth: function (eventType, millis) {
                        var type = num(eventType);
                        if (host.timerIds[type]) { clearInterval(host.timerIds[type]); delete host.timerIds[type]; }
                        var ms = num(millis);
                        if (ms > 0) {
                            host.timerIds[type] = setInterval(function () { host.pushRaw({ kind: "userevent", type: type }); }, ms);
                        }
                        return PY_NONE;
                    },
                    $flags: { MinArgs: 2, MaxArgs: 3 },
                },
            });
            return mod;
        };

        api.fillSprite = function (mod) {
            mod.Sprite = api.Sprite;
            mod.Group = api.Group;
            mod.GroupSingle = api.GroupSingle;
            Sk.abstr.setUpModuleMethods("pygame.sprite", mod, {
                spritecollide: {
                    $meth: function (sprite, group, dokill, collided) {
                        var hits = [];
                        var kill = isTrue(dokill);
                        (group._sprites || []).slice().forEach(function (other) {
                            var hit = false;
                            if (collided && !isNone(collided)) hit = isTrue(Sk.misceval.callsimArray(collided, [sprite, other]));
                            else hit = overlaps(attrOf(sprite, "rect"), attrOf(other, "rect"));
                            if (hit) {
                                hits.push(other);
                                if (kill) killSprite(other);
                            }
                        });
                        return new Sk.builtin.list(hits);
                    },
                    $flags: { NamedArgs: ["sprite", "group", "dokill", "collided"], Defaults: [PY_NONE] },
                },
                spritecollideany: {
                    $meth: function (sprite, group) {
                        var found = null;
                        (group._sprites || []).some(function (other) {
                            if (overlaps(attrOf(sprite, "rect"), attrOf(other, "rect"))) { found = other; return true; }
                            return false;
                        });
                        return found || PY_NONE;
                    },
                    $flags: { MinArgs: 2, MaxArgs: 3 },
                },
                groupcollide: {
                    $meth: function (groupa, groupb, dokilla, dokillb) {
                        var result = new Sk.builtin.dict();
                        (groupa._sprites || []).slice().forEach(function (sprite) {
                            var hits = [];
                            (groupb._sprites || []).slice().forEach(function (other) {
                                if (groupa === groupb && sprite === other) return;
                                if (overlaps(attrOf(sprite, "rect"), attrOf(other, "rect"))) hits.push(other);
                            });
                            if (hits.length) {
                                result.mp$ass_subscript(sprite, new Sk.builtin.list(hits));
                                if (isTrue(dokillb)) hits.forEach(killSprite);
                                if (isTrue(dokilla)) killSprite(sprite);
                            }
                        });
                        return result;
                    },
                    $flags: { MinArgs: 4, MaxArgs: 5 },
                },
                collide_rect: {
                    $meth: function (a, b) { return pyBool(overlaps(attrOf(a, "rect"), attrOf(b, "rect"))); },
                    $flags: { MinArgs: 2, MaxArgs: 2 },
                },
                collide_circle: {
                    $meth: function (a, b) {
                        function center(sprite) {
                            var rect = attrOf(sprite, "rect");
                            var box = bounds(rect);
                            return [box.x + box.w / 2, box.y + box.h / 2];
                        }
                        function radius(sprite) {
                            var given = attrOf(sprite, "radius");
                            if (given && Sk.builtin.checkNumber(given)) return num(given);
                            var box = bounds(attrOf(sprite, "rect"));
                            return Math.hypot(box.w, box.h) / 2;
                        }
                        var ca = center(a), cb = center(b);
                        var reach = radius(a) + radius(b);
                        var dx = ca[0] - cb[0], dy = ca[1] - cb[1];
                        return pyBool(dx * dx + dy * dy <= reach * reach);
                    },
                    $flags: { MinArgs: 2, MaxArgs: 2 },
                },
            });
            return mod;
        };

        api.Channel = Sk.abstr.buildNativeClass("pygame.mixer.Channel", {
            constructor: function Channel() {},
            slots: {
                tp$new: function () { return alloc(this, api.Channel); },
                tp$init: function (args) { this._id = args && args.length ? num(args[0]) : 0; },
            },
            methods: {
                stop: { $meth: function () { delete host.channels[this._id]; host.post({ type: "audio", cmd: "stop", id: this._id }); return PY_NONE; }, $flags: { NoArgs: true } },
                pause: { $meth: function () { host.post({ type: "audio", cmd: "pause", id: this._id }); return PY_NONE; }, $flags: { NoArgs: true } },
                unpause: { $meth: function () { host.post({ type: "audio", cmd: "unpause", id: this._id }); return PY_NONE; }, $flags: { NoArgs: true } },
                set_volume: { $meth: function (volume) { host.post({ type: "audio", cmd: "volume", id: this._id, volume: num(volume) }); return PY_NONE; }, $flags: { OneArg: true } },
                get_busy: { $meth: function () { return pyBool(!!host.channels[this._id]); }, $flags: { NoArgs: true } },
                fadeout: { $meth: function () { delete host.channels[this._id]; host.post({ type: "audio", cmd: "stop", id: this._id }); return PY_NONE; }, $flags: { OneArg: true } },
            },
        });

        api.Sound = Sk.abstr.buildNativeClass("pygame.mixer.Sound", {
            constructor: function Sound() {},
            slots: {
                tp$getattr: Sk.generic.getAttr,
                tp$setattr: Sk.generic.setAttr,
                tp$new: function () {
                    var inst = alloc(this, api.Sound);
                    inst._volume = 1; inst._name = ""; inst._duration = 0;
                    return inst;
                },
                tp$init: function (args) {
                    var name = jsStr(args[0]);
                    var duration = host.lookupAudio(name);
                    if (duration === null || duration === undefined) throw pygameError("Unable to open file '" + name + "'");
                    this._name = name;
                    this._duration = duration;
                },
            },
            methods: {
                play: {
                    $meth: function (loops) {
                        var nloops = isNone(loops) ? 0 : num(loops);
                        var id = host.audioSeq++;
                        host.channels[id] = true;
                        host.post({ type: "audio", cmd: "play", id: id, name: this._name, volume: this._volume, loops: nloops });
                        var channel = alloc(api.Channel.prototype, api.Channel);
                        channel._id = id;
                        return channel;
                    },
                    $flags: { NamedArgs: ["loops", "maxtime", "fade_ms"], Defaults: [PY_ZERO, PY_ZERO, PY_ZERO] },
                },
                stop: { $meth: function () { host.post({ type: "audio", cmd: "stop-name", name: this._name }); return PY_NONE; }, $flags: { NoArgs: true } },
                set_volume: { $meth: function (volume) { this._volume = num(volume); return PY_NONE; }, $flags: { OneArg: true } },
                get_volume: { $meth: function () { return new Sk.builtin.float_(this._volume); }, $flags: { NoArgs: true } },
                get_length: { $meth: function () { return new Sk.builtin.float_(this._duration || 0); }, $flags: { NoArgs: true } },
            },
        });

        api.fillMixer = function (mod) {
            mod.Sound = api.Sound;
            mod.Channel = api.Channel;
            Sk.abstr.setUpModuleMethods("pygame.mixer", mod, {
                init: { $meth: function () { host.mixerInited = true; return PY_NONE; }, $flags: { FastCall: true, NoKwargs: true } },
                pre_init: { $meth: function () { return PY_NONE; }, $flags: { FastCall: true, NoKwargs: true } },
                quit: { $meth: function () { host.mixerInited = false; host.post({ type: "audio", cmd: "stop-all" }); return PY_NONE; }, $flags: { NoArgs: true } },
                get_init: { $meth: function () { return host.mixerInited || host.inited ? new Sk.builtin.tuple([pyInt(44100), pyInt(-16), pyInt(2)]) : PY_NONE; }, $flags: { NoArgs: true } },
                set_num_channels: { $meth: function () { return PY_NONE; }, $flags: { OneArg: true } },
                get_num_channels: { $meth: function () { return pyInt(8); }, $flags: { NoArgs: true } },
                stop: { $meth: function () { host.channels = Object.create(null); host.post({ type: "audio", cmd: "stop-all" }); return PY_NONE; }, $flags: { NoArgs: true } },
                pause: { $meth: function () { host.post({ type: "audio", cmd: "pause-all" }); return PY_NONE; }, $flags: { NoArgs: true } },
                unpause: { $meth: function () { host.post({ type: "audio", cmd: "unpause-all" }); return PY_NONE; }, $flags: { NoArgs: true } },
            });
            var music = new Sk.builtin.module();
            Sk.abstr.setUpModuleMethods("pygame.mixer.music", music.$d, {
                load: {
                    $meth: function (filename) {
                        var name = jsStr(filename);
                        if (host.lookupAudio(name) === null || host.lookupAudio(name) === undefined) throw pygameError("Couldn't open " + name);
                        host.musicName = name;
                        return PY_NONE;
                    },
                    $flags: { OneArg: true },
                },
                play: {
                    $meth: function (loops) {
                        if (!host.musicName) throw pygameError("music not loaded");
                        host.musicBusy = true;
                        host.post({ type: "audio", cmd: "music-play", name: host.musicName, loops: isNone(loops) ? -1 : num(loops), volume: host.musicVolume });
                        return PY_NONE;
                    },
                    $flags: { NamedArgs: ["loops", "start"], Defaults: [new Sk.builtin.int_(-1), PY_ZERO] },
                },
                stop: { $meth: function () { host.musicBusy = false; host.post({ type: "audio", cmd: "music-stop" }); return PY_NONE; }, $flags: { NoArgs: true } },
                pause: { $meth: function () { host.post({ type: "audio", cmd: "music-pause" }); return PY_NONE; }, $flags: { NoArgs: true } },
                unpause: { $meth: function () { host.post({ type: "audio", cmd: "music-unpause" }); return PY_NONE; }, $flags: { NoArgs: true } },
                set_volume: { $meth: function (volume) { host.musicVolume = num(volume); host.post({ type: "audio", cmd: "music-volume", volume: host.musicVolume }); return PY_NONE; }, $flags: { OneArg: true } },
                get_volume: { $meth: function () { return new Sk.builtin.float_(host.musicVolume); }, $flags: { NoArgs: true } },
                get_busy: { $meth: function () { return pyBool(host.musicBusy); }, $flags: { NoArgs: true } },
                fadeout: { $meth: function () { host.musicBusy = false; host.post({ type: "audio", cmd: "music-stop" }); return PY_NONE; }, $flags: { OneArg: true } },
                rewind: { $meth: function () { return PY_NONE; }, $flags: { NoArgs: true } },
            });
            music.$d.__name__ = pyStr("pygame.mixer.music");
            mod.music = music;
            return mod;
        };

        api.noteAudioEnded = function (id, isMusic) {
            if (isMusic) host.musicBusy = false;
            if (id !== undefined && id !== null) delete host.channels[id];
        };

        return api;
    }

    var apiSingleton = null;
    function api() {
        if (!apiSingleton) apiSingleton = createApi(global.__pygameHost);
        return apiSingleton;
    }

    var MODULES = ["display", "draw", "event", "font", "image", "key", "mouse", "time", "transform", "sprite", "mixer", "locals", "rect", "color", "math", "version", "surface", "constants"];

    var PygameModules = {
        main: function (mod) {
            api().fillMain(mod);
            MODULES.forEach(function (name) { Sk.importModule("pygame." + name, false, false); });
            return mod;
        },
        display: function (mod) { return api().fillDisplay(mod); },
        draw: function (mod) { return api().fillDraw(mod); },
        event: function (mod) { return api().fillEvent(mod); },
        font: function (mod) { return api().fillFont(mod); },
        image: function (mod) { return api().fillImage(mod); },
        key: function (mod) { return api().fillKey(mod); },
        mouse: function (mod) { return api().fillMouse(mod); },
        time: function (mod) { return api().fillTime(mod); },
        transform: function (mod) { return api().fillTransform(mod); },
        sprite: function (mod) { return api().fillSprite(mod); },
        mixer: function (mod) { return api().fillMixer(mod); },
        locals: function (mod) { return api().fillLocals(mod); },
        rect: function (mod) { return api().fillRect(mod); },
        color: function (mod) { return api().fillColor(mod); },
        math: function (mod) { return api().fillMath(mod); },
        version: function (mod) { return api().fillVersion(mod); },
        surface: function (mod) { return api().fillSurface(mod); },
        constants: function (mod) { return api().fillConstants(mod); },
    };

    function installPygame() {
        var files = Sk.builtinFiles.files;
        files["src/lib/pygame/__init__.js"] = "var $builtinmodule=function(mod){return self.PygameModules.main(mod);};";
        MODULES.forEach(function (name) {
            files["src/lib/pygame/" + name + ".js"] = "var $builtinmodule=function(mod){return self.PygameModules." + name + "(mod);};";
        });
    }

    global.PygameModules = PygameModules;
    global.createPygameHost = createPygameHost;
    global.installPygame = installPygame;
    global.__pygameNoteAudio = function (id, isMusic) {
        if (apiSingleton) apiSingleton.noteAudioEnded(id, isMusic);
    };
}(self));
