/**
 * Created Using AI.
 * Shared JSCPP heap / string extensions for the C Web IDE.
 * Used by cEditor.html.
 *
 * Stock JSCPP limits this layer works around:
 * - strcpy/strncpy write non-left values (breaks later a[i] = 0)
 * - strcat/strncat crash
 * - strcpy rejects malloc pointers (not isArrayType)
 * - sprintf is unusable
 * - void-to-int pointer casts and pointer truthiness are unreliable
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CIdeRuntime = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    function charPtrType(rt) {
        return rt.normalPointerType(rt.charTypeLiteral);
    }

    function sizeType(rt) {
        return rt.primitiveType('unsigned int');
    }

    function isBuffer(ptr) {
        return !!(ptr && ptr.v && Array.isArray(ptr.v.target));
    }

    function requireBuffer(rt, ptr, label) {
        if (!isBuffer(ptr)) {
            rt.raiseException(label + ' is not a valid char buffer/pointer');
        }
        return ptr;
    }

    function writeChar(rt, arr, index, code) {
        arr[index] = rt.val(rt.charTypeLiteral, code & 0xff, true);
    }

    function readCode(arr, index) {
        return arr[index].v & 0xff;
    }

    function strlenOf(rt, ptr) {
        const p = requireBuffer(rt, ptr, 'strlen');
        let i = p.v.position;
        const arr = p.v.target;
        while (i < arr.length && readCode(arr, i) !== 0) {
            i++;
        }
        return i - p.v.position;
    }

    function overrideGlobal(rt, name, argTypes, impl) {
        const pchar = charPtrType(rt);
        const mapped = argTypes.map(function (t) {
            return t === 'pchar' ? pchar : t;
        });
        // Ensure lookup table exists
        if (!rt.types.global[name]) {
            rt.types.global[name] = { reg: [] };
        }
        const key = mapped.map(function (t) {
            return rt.getTypeSignature(t);
        }).join(',');
        rt.types.global[name][key] = function () {
            return impl.apply(null, arguments);
        };
        if (!rt.types.global[name].reg.some(function (r) {
            return r.args && r.args.length === mapped.length;
        })) {
            rt.types.global[name].reg.push({ args: mapped, optionalArgs: [] });
        }
        rt.scope[0][name] = {
            t: rt.functionType(mapped[0] && false, mapped), // placeholder overwritten below
            v: {
                target: rt.types.global[name][key],
                name: name,
                defineType: 'global',
                args: mapped,
                retType: pchar
            },
            left: true
        };
    }

    function installStringOverrides(rt) {
        if (rt.__ideStringOverrides) {
            return;
        }
        rt.__ideStringOverrides = true;

        const pchar = charPtrType(rt);
        const sizet = sizeType(rt);

        function strcpy(rt2, _this, dest, src) {
            const d = requireBuffer(rt2, dest, 'dest');
            const s = requireBuffer(rt2, src, 'src');
            let di = d.v.position;
            let si = s.v.position;
            const darr = d.v.target;
            const sarr = s.v.target;
            while (si < sarr.length) {
                const ch = readCode(sarr, si);
                if (di >= darr.length) {
                    rt2.raiseException('strcpy destination too small');
                }
                writeChar(rt2, darr, di, ch);
                di++;
                si++;
                if (ch === 0) {
                    return dest;
                }
            }
            rt2.raiseException('source string is not null-terminated');
            return dest;
        }

        function strncpy(rt2, _this, dest, src, num) {
            const d = requireBuffer(rt2, dest, 'dest');
            const s = requireBuffer(rt2, src, 'src');
            let n = num.v | 0;
            let di = d.v.position;
            let si = s.v.position;
            const darr = d.v.target;
            const sarr = s.v.target;
            let sawNull = false;
            while (n > 0) {
                if (di >= darr.length) {
                    rt2.raiseException('strncpy destination too small');
                }
                let ch = 0;
                if (!sawNull && si < sarr.length) {
                    ch = readCode(sarr, si);
                    si++;
                    if (ch === 0) {
                        sawNull = true;
                    }
                } else {
                    ch = 0;
                }
                writeChar(rt2, darr, di, ch);
                di++;
                n--;
            }
            return dest;
        }

        function strcat(rt2, _this, dest, src) {
            const d = requireBuffer(rt2, dest, 'dest');
            const len = strlenOf(rt2, dest);
            const pos = d.v.position + len;
            const remain = Math.max(1, d.v.target.length - pos);
            const atEnd = rt2.val(
                rt2.arrayPointerType(rt2.charTypeLiteral, remain),
                rt2.makeArrayPointerValue(d.v.target, pos)
            );
            strcpy(rt2, null, atEnd, src);
            return dest;
        }

        function strncat(rt2, _this, dest, src, num) {
            const d = requireBuffer(rt2, dest, 'dest');
            const s = requireBuffer(rt2, src, 'src');
            let n = num.v | 0;
            let di = d.v.position + strlenOf(rt2, dest);
            let si = s.v.position;
            const darr = d.v.target;
            const sarr = s.v.target;
            while (n > 0 && si < sarr.length && readCode(sarr, si) !== 0) {
                if (di >= darr.length - 1) {
                    rt2.raiseException('strncat destination too small');
                }
                writeChar(rt2, darr, di, readCode(sarr, si));
                di++;
                si++;
                n--;
            }
            if (di >= darr.length) {
                rt2.raiseException('strncat destination too small');
            }
            writeChar(rt2, darr, di, 0);
            return dest;
        }

        function strlen(rt2, _this, str) {
            return rt2.val(sizet, strlenOf(rt2, str));
        }

        function strcmp(rt2, _this, a, b) {
            const pa = requireBuffer(rt2, a, 'a');
            const pb = requireBuffer(rt2, b, 'b');
            let ai = pa.v.position;
            let bi = pb.v.position;
            const aa = pa.v.target;
            const bb = pb.v.target;
            while (true) {
                const ca = ai < aa.length ? readCode(aa, ai) : 0;
                const cb = bi < bb.length ? readCode(bb, bi) : 0;
                if (ca !== cb) {
                    return rt2.val(rt2.intTypeLiteral, ca - cb);
                }
                if (ca === 0) {
                    return rt2.val(rt2.intTypeLiteral, 0);
                }
                ai++;
                bi++;
            }
        }

        function strncmp(rt2, _this, a, b, num) {
            const pa = requireBuffer(rt2, a, 'a');
            const pb = requireBuffer(rt2, b, 'b');
            let n = num.v | 0;
            let ai = pa.v.position;
            let bi = pb.v.position;
            const aa = pa.v.target;
            const bb = pb.v.target;
            while (n > 0) {
                const ca = ai < aa.length ? readCode(aa, ai) : 0;
                const cb = bi < bb.length ? readCode(bb, bi) : 0;
                if (ca !== cb) {
                    return rt2.val(rt2.intTypeLiteral, ca - cb);
                }
                if (ca === 0) {
                    return rt2.val(rt2.intTypeLiteral, 0);
                }
                ai++;
                bi++;
                n--;
            }
            return rt2.val(rt2.intTypeLiteral, 0);
        }

        function strchr(rt2, _this, str, ch) {
            const p = requireBuffer(rt2, str, 'str');
            const want = ch.v & 0xff;
            let i = p.v.position;
            const arr = p.v.target;
            while (i < arr.length) {
                const ca = readCode(arr, i);
                if (ca === want) {
                    const remain = arr.length - i;
                    const at = rt2.arrayPointerType(rt2.charTypeLiteral, remain);
                    return rt2.val(at, rt2.makeArrayPointerValue(arr, i));
                }
                if (ca === 0) {
                    break;
                }
                i++;
            }
            return rt2.nullPointer;
        }

        function strstr(rt2, _this, hay, needle) {
            const h = requireBuffer(rt2, hay, 'haystack');
            const n = requireBuffer(rt2, needle, 'needle');
            const nlen = strlenOf(rt2, needle);
            if (nlen === 0) {
                return hay;
            }
            const harr = h.v.target;
            const narr = n.v.target;
            for (let i = h.v.position; i < harr.length; i++) {
                if (readCode(harr, i) === 0) {
                    break;
                }
                let ok = true;
                for (let j = 0; j < nlen; j++) {
                    if (readCode(harr, i + j) !== readCode(narr, n.v.position + j)) {
                        ok = false;
                        break;
                    }
                }
                if (ok) {
                    const remain = harr.length - i;
                    const at = rt2.arrayPointerType(rt2.charTypeLiteral, remain);
                    return rt2.val(at, rt2.makeArrayPointerValue(harr, i));
                }
            }
            return rt2.nullPointer;
        }

        function replaceFn(name, args, ret, fn) {
            if (!rt.types.global[name]) {
                rt.types.global[name] = { reg: [] };
            }
            const key = args.map(function (t) {
                return rt.getTypeSignature(t);
            }).join(',');
            rt.types.global[name][key] = function () {
                return fn.apply(null, arguments);
            };
            rt.scope[0][name] = {
                t: {
                    type: 'function',
                    retType: ret,
                    signature: args
                },
                v: {
                    target: rt.types.global[name][key],
                    name: name,
                    defineType: 'global',
                    args: args,
                    retType: ret
                },
                left: true
            };
        }

        replaceFn('strcpy', [pchar, pchar], pchar, strcpy);
        replaceFn('strncpy', [pchar, pchar, sizet], pchar, strncpy);
        replaceFn('strcat', [pchar, pchar], pchar, strcat);
        replaceFn('strncat', [pchar, pchar, sizet], pchar, strncat);
        replaceFn('strlen', [pchar], sizet, strlen);
        replaceFn('strcmp', [pchar, pchar], rt.intTypeLiteral, strcmp);
        replaceFn('strncmp', [pchar, pchar, sizet], rt.intTypeLiteral, strncmp);
        replaceFn('strchr', [pchar, rt.charTypeLiteral], pchar, strchr);
        replaceFn('strstr', [pchar, pchar], pchar, strstr);
    }

    function installHeap(rt) {
        if (rt.__ideHeapInstalled) {
            return;
        }
        rt.__ideHeapInstalled = true;

        const sizet = sizeType(rt);
        const pchar = charPtrType(rt);
        const blockSizes = new WeakMap();

        function asArrayPointer(ptr) {
            if (!ptr || ptr === rt.nullPointer) {
                return null;
            }
            if (!isBuffer(ptr)) {
                return null;
            }
            return ptr;
        }

        function allocBytes(n) {
            const arr = [];
            for (let i = 0; i < n; i++) {
                writeChar(rt, arr, i, 0);
            }
            blockSizes.set(arr, n);
            /* array pointer type so %s / indexing / strcpy agree with JSCPP */
            const at = rt.arrayPointerType(rt.charTypeLiteral, n);
            return rt.val(at, rt.makeArrayPointerValue(arr, 0));
        }

        function knownSize(ptr) {
            const ap = asArrayPointer(ptr);
            if (!ap) {
                return 0;
            }
            const tracked = blockSizes.get(ap.v.target);
            if (typeof tracked === 'number') {
                return tracked;
            }
            return Math.max(0, ap.v.target.length - ap.v.position);
        }

        function malloc(rt2, _this, size) {
            const n = size.v | 0;
            if (n <= 0) {
                return rt2.nullPointer;
            }
            return allocBytes(n);
        }

        function calloc(rt2, _this, nmemb, size) {
            const n = (nmemb.v | 0) * (size.v | 0);
            if (n <= 0) {
                return rt2.nullPointer;
            }
            return allocBytes(n);
        }

        function realloc(rt2, _this, ptr, size) {
            const n = size.v | 0;
            if (ptr === rt2.nullPointer || !asArrayPointer(ptr)) {
                return n <= 0 ? rt2.nullPointer : allocBytes(n);
            }
            if (n <= 0) {
                return rt2.nullPointer;
            }
            const old = asArrayPointer(ptr);
            const oldSize = knownSize(old);
            const copy = Math.min(oldSize, n);
            const fresh = allocBytes(n);
            for (let i = 0; i < copy; i++) {
                writeChar(rt2, fresh.v.target, i, readCode(old.v.target, old.v.position + i));
            }
            return fresh;
        }

        function free(rt2) {
            return rt2.val(rt2.voidTypeLiteral, 0);
        }

        // Use regFunc only if absent; otherwise overwrite like strings
        function setFn(name, args, ret, fn) {
            try {
                rt.regFunc(fn, 'global', name, args, ret);
            } catch (err) {
                const key = args.map(function (t) {
                    return rt.getTypeSignature(t);
                }).join(',');
                if (!rt.types.global[name]) {
                    rt.types.global[name] = { reg: [] };
                }
                rt.types.global[name][key] = function () {
                    return fn.apply(null, arguments);
                };
                rt.scope[0][name] = {
                    t: { type: 'function', retType: ret, signature: args },
                    v: {
                        target: rt.types.global[name][key],
                        name: name,
                        defineType: 'global',
                        args: args,
                        retType: ret
                    },
                    left: true
                };
            }
        }

        setFn('malloc', [sizet], pchar, malloc);
        setFn('calloc', [sizet, sizet], pchar, calloc);
        setFn('realloc', [pchar, sizet], pchar, realloc);
        setFn('free', [pchar], rt.voidTypeLiteral, free);
    }

    function installMemory(rt) {
        if (rt.__ideMemoryInstalled) {
            return;
        }
        rt.__ideMemoryInstalled = true;

        const sizet = sizeType(rt);
        const pchar = charPtrType(rt);

        function memcpy(rt2, _this, dest, src, num) {
            const d = requireBuffer(rt2, dest, 'dest');
            const s = requireBuffer(rt2, src, 'src');
            let n = num.v | 0;
            let di = d.v.position;
            let si = s.v.position;
            while (n > 0) {
                writeChar(rt2, d.v.target, di, readCode(s.v.target, si));
                di++;
                si++;
                n--;
            }
            return dest;
        }

        function memmove(rt2, _this, dest, src, num) {
            const d = requireBuffer(rt2, dest, 'dest');
            const s = requireBuffer(rt2, src, 'src');
            const n = num.v | 0;
            const tmp = [];
            for (let i = 0; i < n; i++) {
                tmp.push(readCode(s.v.target, s.v.position + i));
            }
            for (let i = 0; i < n; i++) {
                writeChar(rt2, d.v.target, d.v.position + i, tmp[i]);
            }
            return dest;
        }

        function memset(rt2, _this, dest, ch, num) {
            const d = requireBuffer(rt2, dest, 'dest');
            let n = num.v | 0;
            let di = d.v.position;
            const byte = ch.v & 0xff;
            while (n > 0) {
                writeChar(rt2, d.v.target, di, byte);
                di++;
                n--;
            }
            return dest;
        }

        function memcmp(rt2, _this, a, b, num) {
            const pa = requireBuffer(rt2, a, 'ptr1');
            const pb = requireBuffer(rt2, b, 'ptr2');
            let n = num.v | 0;
            let ai = pa.v.position;
            let bi = pb.v.position;
            while (n > 0) {
                const av = readCode(pa.v.target, ai);
                const bv = readCode(pb.v.target, bi);
                if (av !== bv) {
                    return rt2.val(rt2.intTypeLiteral, av - bv);
                }
                ai++;
                bi++;
                n--;
            }
            return rt2.val(rt2.intTypeLiteral, 0);
        }

        function setFn(name, args, ret, fn) {
            try {
                rt.regFunc(fn, 'global', name, args, ret);
            } catch (err) {
                const key = args.map(function (t) {
                    return rt.getTypeSignature(t);
                }).join(',');
                if (!rt.types.global[name]) {
                    rt.types.global[name] = { reg: [] };
                }
                rt.types.global[name][key] = function () {
                    return fn.apply(null, arguments);
                };
            }
        }

        setFn('memcpy', [pchar, pchar, sizet], pchar, memcpy);
        setFn('memmove', [pchar, pchar, sizet], pchar, memmove);
        setFn('memset', [pchar, rt.intTypeLiteral, sizet], pchar, memset);
        setFn('memcmp', [pchar, pchar, sizet], rt.intTypeLiteral, memcmp);

        installStringOverrides(rt);
    }

    function wrapLoad(lib, installer) {
        if (!lib || typeof lib.load !== 'function' || lib.__ideWrapped) {
            return;
        }
        const original = lib.load.bind(lib);
        lib.load = function (rt) {
            original(rt);
            installer(rt);
        };
        lib.__ideWrapped = true;
    }

    function stripComments(src) {
        return String(src)
            .replace(/\/\*[\s\S]*?\*\//g, ' ')
            .replace(/\/\/.*$/gm, ' ');
    }

    function resolveFieldType(rt, typeStr) {
        let t = String(typeStr).trim().replace(/\s+/g, ' ');
        if (!t) {
            return rt.intTypeLiteral;
        }
        if (rt.typedefs && rt.typedefs[t]) {
            return rt.typedefs[t];
        }
        if (/\*$/.test(t)) {
            const base = t.replace(/\s*\*$/, '').trim();
            return rt.normalPointerType(resolveFieldType(rt, base));
        }
        if (t.indexOf('struct ') === 0) {
            const clsType = { type: 'class', name: t };
            if (rt.getTypeSignature(clsType) in rt.types) {
                return clsType;
            }
        }
        try {
            return rt.simpleType(t.split(' '));
        } catch (err) {
            const primitives = {
                char: rt.charTypeLiteral,
                int: rt.intTypeLiteral,
                long: rt.longTypeLiteral,
                float: rt.floatTypeLiteral,
                double: rt.doubleTypeLiteral,
                bool: rt.boolTypeLiteral,
                'unsigned int': rt.unsignedintTypeLiteral,
                'unsigned char': rt.unsignedcharTypeLiteral
            };
            if (primitives[t]) {
                return primitives[t];
            }
            rt.raiseException('unsupported struct field type: ' + t);
        }
    }

    function makeClassDefault(rt, type, left) {
        const sig = rt.getTypeSignature(type);
        const info = rt.types[sig];
        if (!info || !info['#members']) {
            rt.raiseException('no default value for object');
        }
        const members = {};
        const list = info['#members'];
        for (let i = 0; i < list.length; i++) {
            members[list[i].name] = makeDefaultMember(rt, list[i].type);
        }
        return {
            t: type,
            v: { members: members },
            left: !!left
        };
    }

    function makeDefaultMember(rt, type) {
        if (!type) {
            return rt.val(rt.intTypeLiteral, 0, true);
        }
        if (type.type === 'class') {
            return makeClassDefault(rt, type, true);
        }
        if (type.type === 'pointer') {
            if (type.ptrType === 'array') {
                return rt.defaultValue(type, true);
            }
            return rt.val(type, rt.nullPointerValue, true);
        }
        if (type.type === 'primitive') {
            if (rt.isNumericType(type) || type.name === 'bool' || type.name.indexOf('char') >= 0) {
                return rt.val(type, 0, true);
            }
        }
        try {
            return rt.defaultValue(type, true);
        } catch (err) {
            return rt.val(rt.intTypeLiteral, 0, true);
        }
    }

    function patchDefaultValue(rt) {
        if (rt.__ideDefaultValuePatched) {
            return;
        }
        const original = rt.defaultValue.bind(rt);
        rt.defaultValue = function (type, left) {
            if (type && type.type === 'class') {
                return makeClassDefault(this, type, left);
            }
            return original(type, left);
        };
        rt.__ideDefaultValuePatched = true;
    }

    function registerStruct(rt, def) {
        /* JSCPP looks up class name "struct Point" (makeTypeString adds a leading $ in errors). */
        const className = 'struct ' + def.name;
        const clsType = { type: 'class', name: className };
        const sig = rt.getTypeSignature(clsType);
        const members = def.fields.map(function (f) {
            return {
                name: f.name,
                type: resolveFieldType(rt, f.type)
            };
        });

        if (!(sig in rt.types)) {
            rt.types[sig] = {
                '#members': members,
                '#constructor': function (rt2, _this, initMembers) {
                    _this.v.members = {};
                    for (let i = 0; i < members.length; i++) {
                        const m = members[i];
                        if (initMembers && initMembers[m.name] != null) {
                            _this.v.members[m.name] = initMembers[m.name];
                        } else {
                            _this.v.members[m.name] = makeDefaultMember(rt2, m.type);
                        }
                    }
                },
                'o(&)': {
                    '#default': function (rt2, l, r) {
                        if (r === void 0) {
                            const t = rt2.normalPointerType(l.t);
                            return rt2.val(t, rt2.makeNormalPointerValue(l));
                        }
                        rt2.raiseException('bitwise and is not supported on structs');
                    }
                }
            };
        } else if (!rt.types[sig]['#members']) {
            rt.types[sig]['#members'] = members;
        }

        if (def.alias) {
            try {
                rt.registerTypedef(clsType, def.alias);
            } catch (err) {
                /* already typedef'd */
            }
            const aliasType = { type: 'class', name: def.alias };
            const aliasSig = rt.getTypeSignature(aliasType);
            if (!(aliasSig in rt.types)) {
                rt.types[aliasSig] = rt.types[sig];
            }
        }
    }

    function parseStructFields(body) {
        const fields = [];
        const parts = body.split(';');
        for (let i = 0; i < parts.length; i++) {
            const line = parts[i].trim();
            if (!line) {
                continue;
            }
            const m = line.match(/^(.+?)\s+([A-Za-z_][A-Za-z0-9_]*)\s*$/);
            if (!m) {
                continue;
            }
            fields.push({ type: m[1].trim(), name: m[2].trim() });
        }
        return fields;
    }

    function prepareStructs(src) {
        let code = stripComments(src);

        // typedef struct { ... } Alias;  -> typedef struct Alias { ... } Alias;
        code = code.replace(
            /typedef\s+struct\s*\{([\s\S]*?)\}\s*([A-Za-z_][A-Za-z0-9_]*)\s*;/g,
            function (_all, body, alias) {
                return 'typedef struct ' + alias + ' {' + body + '} ' + alias + ';';
            }
        );

        // struct Name { ... };  -> typedef struct Name { ... } Name;
        // (bare struct defs have null InitDeclaratorList and crash stock JSCPP)
        code = code.replace(
            /(^|[\s;{}])struct\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{([\s\S]*?)\}\s*;/g,
            function (all, lead, name, body) {
                if (/typedef\s+$/.test(lead)) {
                    return all;
                }
                // Avoid rewriting if already "typedef struct Name"
                return lead + 'typedef struct ' + name + ' {' + body + '} ' + name + ';';
            }
        );

        const structs = [];
        const re = /typedef\s+struct\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{([\s\S]*?)\}\s*([A-Za-z_][A-Za-z0-9_]*)\s*;/g;
        let match;
        while ((match = re.exec(code)) !== null) {
            structs.push({
                name: match[1],
                alias: match[3] || match[1],
                fields: parseStructFields(match[2])
            });
        }

        return { code: code, structs: structs };
    }

    function patchSimpleType(rt) {
        if (rt.__ideSimpleTypePatched) {
            return;
        }
        const original = rt.simpleType.bind(rt);
        rt.simpleType = function (type) {
            if (typeof type === 'string') {
                if (this.typedefs[type]) {
                    return this.typedefs[type];
                }
                if (type === 'signed') {
                    return this.intTypeLiteral;
                }
                if (type === '_Bool') {
                    return this.boolTypeLiteral;
                }
            }
            if (Array.isArray(type)) {
                if (type.length === 1) {
                    if (this.typedefs[type[0]]) {
                        return this.typedefs[type[0]];
                    }
                    if (type[0] === 'signed') {
                        return this.intTypeLiteral;
                    }
                    if (type[0] === '_Bool') {
                        return this.boolTypeLiteral;
                    }
                }
                // "signed int" / "unsigned long" already handled by original filter path
            }
            return original(type);
        };
        rt.__ideSimpleTypePatched = true;
    }

    function installStandardTypedefs(rt) {
        if (rt.__ideStdTypedefsInstalled) {
            return;
        }
        patchSimpleType(rt);

        const alias = function (name, type) {
            try {
                rt.registerTypedef(type, name);
            } catch (err) {
                rt.typedefs[name] = type;
            }
        };

        // Fixed-width + pointer-sized types (emulated on JSCPP's integer model)
        alias('int8_t', rt.primitiveType('signed char'));
        alias('uint8_t', rt.unsignedcharTypeLiteral || rt.primitiveType('unsigned char'));
        alias('int16_t', rt.primitiveType('short'));
        alias('uint16_t', rt.primitiveType('unsigned short'));
        alias('int32_t', rt.intTypeLiteral);
        alias('uint32_t', rt.unsignedintTypeLiteral);
        alias('int64_t', rt.primitiveType('long long'));
        alias('uint64_t', rt.primitiveType('unsigned long long'));

        alias('size_t', rt.unsignedintTypeLiteral);
        alias('ssize_t', rt.intTypeLiteral);
        alias('ptrdiff_t', rt.intTypeLiteral);
        alias('intptr_t', rt.intTypeLiteral);
        alias('uintptr_t', rt.unsignedintTypeLiteral);

        alias('_Bool', rt.boolTypeLiteral);
        alias('time_t', rt.longTypeLiteral);
        alias('clock_t', rt.longTypeLiteral);
        alias('off_t', rt.longTypeLiteral);
        alias('wchar_t', rt.primitiveType('wchar_t'));

        // Common convenience aliases
        alias('byte', rt.unsignedcharTypeLiteral || rt.primitiveType('unsigned char'));
        alias('uchar', rt.unsignedcharTypeLiteral || rt.primitiveType('unsigned char'));
        alias('ushort', rt.primitiveType('unsigned short'));
        alias('uint', rt.unsignedintTypeLiteral);
        alias('ulong', rt.primitiveType('unsigned long'));

        rt.__ideStdTypedefsInstalled = true;
    }

    function installStructSupport(JSCPP) {
        if (JSCPP.__ideStructPatched) {
            return;
        }

        const originalRun = JSCPP.run.bind(JSCPP);
        JSCPP.run = function (code, input, config) {
            const prepared = prepareStructs(String(code));
            const structs = prepared.structs;

            function loadIdeTypes(rt) {
                installStandardTypedefs(rt);
            }

            function loadIdeStructs(rt) {
                patchDefaultValue(rt);
                for (let i = 0; i < structs.length; i++) {
                    if (structs[i].fields.length) {
                        registerStruct(rt, structs[i]);
                    }
                }
            }

            JSCPP.includes['__ide_types'] = { load: loadIdeTypes };
            JSCPP.includes['__ide_structs'] = { load: loadIdeStructs };
            JSCPP.includes['stddef.h'] = { load: loadIdeTypes };
            JSCPP.includes['stdint.h'] = { load: loadIdeTypes };
            JSCPP.includes['stdbool.h'] = { load: loadIdeTypes };
            JSCPP.includes.stddef = JSCPP.includes['stddef.h'];
            JSCPP.includes.stdint = JSCPP.includes['stdint.h'];
            JSCPP.includes.stdbool = JSCPP.includes['stdbool.h'];

            const injected =
                '#include <__ide_types>\n' +
                '#include <__ide_structs>\n' +
                '#define true 1\n' +
                '#define false 0\n' +
                prepared.code;
            return originalRun(injected, input, config);
        };

        JSCPP.__ideStructPatched = true;
    }

    function ensureHeapExtensions(JSCPP) {
        if (!JSCPP || !JSCPP.includes) {
            return false;
        }
        if (JSCPP.__ideHeapPatched) {
            installStructSupport(JSCPP);
            return true;
        }

        const includes = JSCPP.includes;
        wrapLoad(includes.cstdlib, installHeap);
        wrapLoad(includes['stdlib.h'], installHeap);
        wrapLoad(includes.cstring, installMemory);
        wrapLoad(includes['string.h'], installMemory);

        installStructSupport(JSCPP);

        JSCPP.__ideHeapPatched = true;
        return true;
    }

    function runC(JSCPP, code, stdin) {
        ensureHeapExtensions(JSCPP);
        let buffer = '';
        const exitCode = JSCPP.run(code, stdin == null ? '' : String(stdin), {
            stdio: {
                write: function (s) {
                    buffer += s;
                }
            },
            maxTimeout: 5000
        });
        return { exitCode: exitCode, stdout: buffer };
    }

    return {
        ensureHeapExtensions: ensureHeapExtensions,
        runC: runC,
        prepareStructs: prepareStructs
    };
});