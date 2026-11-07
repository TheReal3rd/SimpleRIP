(function () {
    "use strict";

    var SAMPLES = [
        ["playground", "Playground"],
        ["paint", "Paint"],
        ["sprites", "Sprites"],
        ["snake", "Snake"],
        ["poster", "Poster"],
        ["image", "Images"],
        ["askname", "Ask for a name"],
    ];

    var editor = null;
    var runnerWorker = null;
    var isRunning = false;
    var screenSize = { w: 800, h: 500 };
    var heldKeys = new Set();
    var allowRepeat = false;
    var mouse = { x: 0, y: 0, lastX: 0, lastY: 0, relX: 0, relY: 0, buttons: [false, false, false], motion: false };
    var assets = new Map();
    var audioCtx = null;
    var audioBuffers = new Map();
    var audioNodes = new Map();
    var musicNode = null;
    var pendingFinal = null;
    var runGeneration = 0;

    var stageHost = document.getElementById("screenHost");
    var captionEl = document.getElementById("caption");
    var term = document.getElementById("terminal");
    var sampleSelect = document.getElementById("sampleSelect");
    var assetList = document.getElementById("assetList");

    SAMPLES.forEach(function (item) {
        var option = document.createElement("option");
        option.value = item[0];
        option.textContent = item[1];
        sampleSelect.appendChild(option);
    });

    function writeOut(text, kind) {
        var span = document.createElement("span");
        if (kind) span.className = kind;
        span.textContent = text;
        term.appendChild(span);
        while (term.childNodes.length > 800) term.removeChild(term.firstChild);
        term.scrollTop = term.scrollHeight;
    }

    function clearTerminal() {
        term.textContent = "";
    }

    function setRunning(running) {
        isRunning = running;
        document.getElementById("runBtn").disabled = running;
        document.getElementById("stopBtn").disabled = !running;
        document.getElementById("runState").textContent = running ? "Running" : "Ready";
    }

    function ensureAudio() {
        if (!audioCtx) audioCtx = new AudioContext();
        return audioCtx;
    }

    function downloadBlob(blob, filename) {
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename || "download";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(link.href); }, 1500);
    }

    function saveProject() {
        if (!editor) return;
        downloadBlob(new Blob([editor.getValue()], { type: "text/plain" }), "project.py");
    }

    function savePng() {
        if (isRunning && runnerWorker) {
            runnerWorker.postMessage({ type: "snapshot-request" });
            return;
        }
        var canvas = stageHost.querySelector("canvas");
        if (!canvas || typeof canvas.toBlob !== "function") return;
        canvas.toBlob(function (blob) {
            if (blob) downloadBlob(blob, "pygame.png");
        });
    }

    function mountCanvas(drawHint) {
        var canvas = document.createElement("canvas");
        canvas.id = "screen";
        canvas.width = screenSize.w;
        canvas.height = screenSize.h;
        canvas.tabIndex = 0;
        if (drawHint) {
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "#10141d";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#9aa8bf";
            ctx.font = "16px ui-monospace, monospace";
            ctx.fillText("Press Run to open the pygame window", 28, 48);
        }
        stageHost.replaceChildren(canvas);
        return canvas;
    }

    function showFinalFrame() {
        if (!pendingFinal) return;
        var bitmap = pendingFinal;
        pendingFinal = null;
        screenSize.w = bitmap.width;
        screenSize.h = bitmap.height;
        var canvas = document.createElement("canvas");
        canvas.id = "screen";
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        canvas.tabIndex = 0;
        canvas.getContext("2d").drawImage(bitmap, 0, 0);
        if (bitmap.close) bitmap.close();
        stageHost.replaceChildren(canvas);
    }

    function paintIdleScreen() {
        var canvas = document.createElement("canvas");
        canvas.id = "screen";
        canvas.width = screenSize.w;
        canvas.height = screenSize.h;
        canvas.tabIndex = 0;
        canvas.getContext("2d").fillStyle = "#10141d";
        canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height);
        stageHost.replaceChildren(canvas);
    }

    function destroyWorker() {
        if (runnerWorker) {
            runnerWorker.onmessage = null;
            runnerWorker.onerror = null;
            runnerWorker.terminate();
            runnerWorker = null;
        }
        heldKeys.clear();
        mouse.buttons = [false, false, false];
        stopAllAudio();
    }

    function stopCode(reason) {
        if (!isRunning && !runnerWorker) return;
        var worker = runnerWorker;
        var generation = runGeneration;
        runnerWorker = null;
        setRunning(false);
        heldKeys.clear();
        mouse.buttons = [false, false, false];
        stopAllAudio();
        if (reason) writeOut(reason + "\n", "error");
        if (!worker) return;

        var settled = false;
        function finish(gotFrame) {
            if (settled) return;
            settled = true;
            worker.onmessage = null;
            worker.onerror = null;
            try { worker.terminate(); } catch (err) { /* already gone */ }
            if (!gotFrame && generation === runGeneration) paintIdleScreen();
        }

        worker.onmessage = function (event) {
            var msg = event.data;
            if (!msg || msg.type !== "final-frame" || !msg.bitmap) return;
            if (generation === runGeneration) {
                pendingFinal = msg.bitmap;
                showFinalFrame();
            } else if (msg.bitmap.close) {
                msg.bitmap.close();
            }
            finish(true);
        };
        try {
            worker.postMessage({ type: "capture-frame" });
        } catch (err) {
            finish(false);
            return;
        }
        setTimeout(function () { finish(false); }, 400);
    }

    function renderAssets() {
        assetList.textContent = "";
        assets.forEach(function (asset, name) {
            var chip = document.createElement("span");
            chip.className = "chip";
            chip.textContent = name;
            var remove = document.createElement("button");
            remove.type = "button";
            remove.textContent = "×";
            remove.title = "Remove " + name;
            remove.addEventListener("click", function () {
                assets.delete(name);
                audioBuffers.delete(name);
                audioBuffers.delete(name.toLowerCase());
                renderAssets();
            });
            chip.appendChild(remove);
            assetList.appendChild(chip);
        });
    }

    function classify(file) {
        var name = file.name.toLowerCase();
        if (/\.(png|gif|jpe?g|bmp|webp|svg)$/.test(name) || (file.type || "").indexOf("image/") === 0) return "image";
        if (/\.(wav|mp3|ogg|m4a|flac)$/.test(name) || (file.type || "").indexOf("audio/") === 0) return "audio";
        if (/\.(ttf|otf|woff2?)$/.test(name)) return "font";
        if (/\.py$/.test(name)) return "python";
        return "unknown";
    }

    async function addAsset(file) {
        var kind = classify(file);
        if (kind === "python") {
            var text = await file.text();
            if (editor) editor.setValue(text);
            return;
        }
        if (kind === "unknown") {
            writeOut("Skipped " + file.name + ". Use an image, sound, font, or .py file.\n", "error");
            return;
        }
        if (kind === "audio") {
            try {
                var ctx = ensureAudio();
                var decoded = await ctx.decodeAudioData((await file.arrayBuffer()).slice(0));
                audioBuffers.set(file.name, decoded);
                audioBuffers.set(file.name.toLowerCase(), decoded);
                assets.set(file.name, { kind: kind, file: file, duration: decoded.duration });
            } catch (err) {
                writeOut("Could not decode " + file.name + ".\n", "error");
                return;
            }
        } else {
            assets.set(file.name, { kind: kind, file: file });
        }
        renderAssets();
    }

    function lookupBuffer(name) {
        if (audioBuffers.has(name)) return audioBuffers.get(name);
        var base = String(name).split(/[/\\]/).pop();
        if (audioBuffers.has(base)) return audioBuffers.get(base);
        if (audioBuffers.has(base.toLowerCase())) return audioBuffers.get(base.toLowerCase());
        return null;
    }

    function spawnAudio(name, volume, loops, offset) {
        var buf = lookupBuffer(name);
        if (!buf) return null;
        var ctx = ensureAudio();
        var src = ctx.createBufferSource();
        var gain = ctx.createGain();
        src.buffer = buf;
        gain.gain.value = Math.max(0, Math.min(1, Number(volume) || 0));
        src.connect(gain).connect(ctx.destination);
        var startAt = offset || 0;
        if (loops < 0) {
            src.loop = true;
            src.start(0, startAt % buf.duration);
        } else if (loops > 0) {
            src.loop = true;
            src.start(0, Math.min(startAt, buf.duration));
            src.stop(ctx.currentTime + Math.max(0, buf.duration * (loops + 1) - startAt));
        } else {
            src.start(0, Math.min(startAt, buf.duration));
        }
        return { src: src, gain: gain, buf: buf, volume: gain.gain.value, loops: loops, offset: startAt, started: ctx.currentTime, paused: false, name: name };
    }

    function stopEntry(entry) {
        if (!entry) return;
        try { entry.src.stop(); } catch (err) { /* already stopped */ }
    }

    function stopAllAudio() {
        audioNodes.forEach(stopEntry);
        audioNodes.clear();
        if (musicNode) stopEntry(musicNode);
        musicNode = null;
    }

    function handleAudio(msg) {
        if (msg.cmd === "play") {
            var entry = spawnAudio(msg.name, msg.volume, msg.loops, 0);
            if (!entry) return;
            entry.src.onended = function () {
                audioNodes.delete(msg.id);
                if (runnerWorker) runnerWorker.postMessage({ type: "audio-ended", id: msg.id, music: false });
            };
            audioNodes.set(msg.id, entry);
            return;
        }
        if (msg.cmd === "stop") {
            stopEntry(audioNodes.get(msg.id));
            audioNodes.delete(msg.id);
            return;
        }
        if (msg.cmd === "stop-name") {
            audioNodes.forEach(function (entry, id) {
                if (entry.name === msg.name) {
                    stopEntry(entry);
                    audioNodes.delete(id);
                }
            });
            return;
        }
        if (msg.cmd === "stop-all") {
            stopAllAudio();
            return;
        }
        if (msg.cmd === "volume") {
            var node = audioNodes.get(msg.id);
            if (node) node.gain.gain.value = Math.max(0, Math.min(1, msg.volume));
            return;
        }
        if (msg.cmd === "pause" || msg.cmd === "pause-all") {
            audioNodes.forEach(function (entry) { entry.gain.gain.value = 0; });
            return;
        }
        if (msg.cmd === "unpause" || msg.cmd === "unpause-all") {
            audioNodes.forEach(function (entry) { entry.gain.gain.value = entry.volume; });
            return;
        }
        if (msg.cmd === "music-play") {
            if (musicNode) stopEntry(musicNode);
            musicNode = spawnAudio(msg.name, msg.volume, msg.loops, 0);
            if (!musicNode) return;
            musicNode.src.onended = function () {
                musicNode = null;
                if (runnerWorker) runnerWorker.postMessage({ type: "audio-ended", id: null, music: true });
            };
            return;
        }
        if (msg.cmd === "music-stop") {
            if (musicNode) stopEntry(musicNode);
            musicNode = null;
            return;
        }
        if (msg.cmd === "music-pause" && musicNode) musicNode.gain.gain.value = 0;
        if (msg.cmd === "music-unpause" && musicNode) musicNode.gain.gain.value = musicNode.volume;
        if (msg.cmd === "music-volume" && musicNode) {
            musicNode.volume = Math.max(0, Math.min(1, msg.volume));
            musicNode.gain.gain.value = musicNode.volume;
        }
    }

    function canvasPoint(event) {
        var canvas = stageHost.querySelector("canvas");
        if (!canvas) return { x: 0, y: 0 };
        var rect = canvas.getBoundingClientRect();
        var scaleX = rect.width ? screenSize.w / rect.width : 1;
        var scaleY = rect.height ? screenSize.h / rect.height : 1;
        return {
            x: Math.round((event.clientX - rect.left) * scaleX),
            y: Math.round((event.clientY - rect.top) * scaleY),
        };
    }

    function postToRunner(message) {
        if (runnerWorker && isRunning) runnerWorker.postMessage(message);
    }

    function gameKeyTarget(event) {
        var canvas = stageHost.querySelector("canvas");
        return canvas && (event.target === canvas || canvas.contains(event.target));
    }

    function modifiers(event) {
        return {
            shift: event.shiftKey,
            ctrl: event.ctrlKey,
            alt: event.altKey,
            meta: event.metaKey,
            caps: event.getModifierState ? event.getModifierState("CapsLock") : false,
        };
    }

    stageHost.addEventListener("pointerdown", function () {
        var canvas = stageHost.querySelector("canvas");
        if (canvas) canvas.focus();
    });

    stageHost.addEventListener("keydown", function (event) {
        if (!isRunning || !gameKeyTarget(event)) return;
        if (event.repeat && !allowRepeat) {
            event.preventDefault();
            return;
        }
        heldKeys.add(event.code);
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].indexOf(event.code) !== -1) event.preventDefault();
        var mods = modifiers(event);
        postToRunner({
            type: "dom-event",
            event: Object.assign({ kind: "keydown", code: event.code, key: event.key, repeat: event.repeat }, mods),
        });
    });

    stageHost.addEventListener("keyup", function (event) {
        if (!isRunning || !gameKeyTarget(event)) return;
        heldKeys.delete(event.code);
        var mods = modifiers(event);
        postToRunner({
            type: "dom-event",
            event: Object.assign({ kind: "keyup", code: event.code, key: event.key, repeat: false }, mods),
        });
    });

    window.addEventListener("blur", function () {
        if (!isRunning || !heldKeys.size) return;
        postToRunner({ type: "dom-event", event: { kind: "blur", codes: Array.from(heldKeys) } });
        heldKeys.clear();
        mouse.buttons = [false, false, false];
    });

    stageHost.addEventListener("mousedown", function (event) {
        if (!isRunning) return;
        var pos = canvasPoint(event);
        mouse.x = pos.x;
        mouse.y = pos.y;
        mouse.lastX = pos.x;
        mouse.lastY = pos.y;
        var button = event.button + 1;
        if (button >= 1 && button <= 3) mouse.buttons[button - 1] = true;
        postToRunner({ type: "dom-event", event: { kind: "mousedown", x: pos.x, y: pos.y, button: button } });
    });

    window.addEventListener("mouseup", function (event) {
        if (!isRunning) return;
        var button = event.button + 1;
        if (button >= 1 && button <= 3) mouse.buttons[button - 1] = false;
        var pos = canvasPoint(event);
        mouse.x = pos.x;
        mouse.y = pos.y;
        postToRunner({ type: "dom-event", event: { kind: "mouseup", x: pos.x, y: pos.y, button: button } });
    });

    window.addEventListener("mousemove", function (event) {
        if (!isRunning) return;
        var canvas = stageHost.querySelector("canvas");
        if (!canvas) return;
        var rect = canvas.getBoundingClientRect();
        var inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (!inside && mouse.buttons.every(function (down) { return !down; })) return;
        var pos = canvasPoint(event);
        mouse.relX += pos.x - mouse.lastX;
        mouse.relY += pos.y - mouse.lastY;
        mouse.lastX = pos.x;
        mouse.lastY = pos.y;
        mouse.x = pos.x;
        mouse.y = pos.y;
        mouse.motion = true;
    });

    stageHost.addEventListener("wheel", function (event) {
        if (!isRunning) return;
        event.preventDefault();
        var pos = canvasPoint(event);
        postToRunner({ type: "dom-event", event: { kind: "wheel", x: pos.x, y: pos.y, dy: event.deltaY } });
    }, { passive: false });

    stageHost.addEventListener("contextmenu", function (event) { event.preventDefault(); });

    function snapshot() {
        var caps = false;
        var snap = {
            codes: Array.from(heldKeys),
            caps: caps,
            mouse: {
                x: mouse.x,
                y: mouse.y,
                buttons: mouse.buttons.slice(),
                relX: mouse.relX,
                relY: mouse.relY,
                motion: mouse.motion,
            },
        };
        mouse.relX = 0;
        mouse.relY = 0;
        mouse.motion = false;
        return snap;
    }

    function inputTerminal(promptText) {
        return new Promise(function (resolve) {
            var line = document.createElement("div");
            line.className = "line";
            var prompt = document.createElement("span");
            prompt.className = "prompt";
            prompt.textContent = promptText;
            var input = document.createElement("input");
            input.className = "terminal-input";
            line.appendChild(prompt);
            line.appendChild(input);
            term.appendChild(line);
            input.focus();
            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    var value = input.value;
                    input.disabled = true;
                    resolve(value);
                }
            });
            term.scrollTop = term.scrollHeight;
        });
    }

    function handleWorkerMessage(event) {
        var msg = event.data;
        if (!msg || !msg.type) return;
        if (msg.type === "output") {
            writeOut(msg.text);
            return;
        }
        if (msg.type === "error") {
            writeOut(msg.text + (msg.text.endsWith("\n") ? "" : "\n"), "error");
            return;
        }
        if (msg.type === "input-request") {
            inputTerminal(msg.prompt).then(function (value) {
                if (runnerWorker) runnerWorker.postMessage({ type: "input-response", id: msg.id, value: value });
            });
            return;
        }
        if (msg.type === "yield") {
            var delay = Math.max(0, msg.delay || 0);
            window.setTimeout(function () {
                window.requestAnimationFrame(function () {
                    if (!runnerWorker) return;
                    runnerWorker.postMessage(Object.assign({ type: "yield-ack", id: msg.id }, snapshot()));
                });
            }, delay);
            return;
        }
        if (msg.type === "resize") {
            screenSize.w = msg.w;
            screenSize.h = msg.h;
            if (msg.caption) captionEl.textContent = msg.caption;
            return;
        }
        if (msg.type === "caption") {
            captionEl.textContent = msg.text || "pygame";
            return;
        }
        if (msg.type === "cursor") {
            var canvas = stageHost.querySelector("canvas");
            if (canvas) canvas.style.cursor = msg.visible ? "default" : "none";
            return;
        }
        if (msg.type === "key-repeat") {
            allowRepeat = !!msg.enabled;
            return;
        }
        if (msg.type === "audio") {
            handleAudio(msg);
            return;
        }
        if (msg.type === "download" && msg.blob) {
            downloadBlob(msg.blob, msg.filename || "pygame.png");
            return;
        }
        if (msg.type === "final-frame") {
            pendingFinal = msg.bitmap;
            return;
        }
        if (msg.type === "done") {
            setRunning(false);
            showFinalFrame();
            destroyWorker();
        }
    }

    async function collectRunPayload() {
        var images = [];
        var fonts = [];
        var audio = [];
        var transfers = [];
        var entries = Array.from(assets.entries());
        for (var i = 0; i < entries.length; i += 1) {
            var name = entries[i][0];
            var asset = entries[i][1];
            if (asset.kind === "image") {
                var bitmap = await createImageBitmap(asset.file);
                images.push({ name: name, bitmap: bitmap });
                transfers.push(bitmap);
            } else if (asset.kind === "font") {
                var buffer = await asset.file.arrayBuffer();
                fonts.push({ name: name, buffer: buffer });
                transfers.push(buffer);
            } else if (asset.kind === "audio") {
                audio.push({ name: name, duration: asset.duration || 0 });
            }
        }
        return { images: images, fonts: fonts, audio: audio, transfers: transfers };
    }

    async function runCode() {
        if (!editor) return;
        if (isRunning) stopCode();
        runGeneration += 1;
        clearTerminal();
        pendingFinal = null;
        allowRepeat = false;
        heldKeys.clear();
        mouse.buttons = [false, false, false];
        mouse.relX = 0;
        mouse.relY = 0;
        try { ensureAudio().resume(); } catch (err) { /* audio starts after the next gesture */ }

        var canvas = mountCanvas(false);
        var offscreen;
        try {
            offscreen = canvas.transferControlToOffscreen();
        } catch (err) {
            writeOut("This browser cannot hand the pygame window to the local runner.\n", "error");
            return;
        }

        var payload;
        try {
            payload = await collectRunPayload();
        } catch (err) {
            writeOut("Could not read an uploaded file: " + err.message + "\n", "error");
            return;
        }

        var libBase = new URL("/pages/codeEmulators/Libraries/", window.location.origin).href;
        runnerWorker = new Worker(new URL("runner.js", libBase).href);
        runnerWorker.onmessage = handleWorkerMessage;
        runnerWorker.onerror = function (err) {
            writeOut((err.message || "The pygame runner stopped.") + "\n", "error");
            setRunning(false);
            destroyWorker();
        };
        setRunning(true);
        canvas.focus();
        var message = {
            type: "run",
            code: editor.getValue(),
            canvas: offscreen,
            images: payload.images,
            fonts: payload.fonts,
            audio: payload.audio,
            skulptMin: libBase + "skulpt.min.js",
            skulptStdlib: libBase + "skulpt-stdlib.js",
            pygameHost: libBase + "pygame_host.js",
        };
        runnerWorker.postMessage(message, [offscreen].concat(payload.transfers));
    }

    async function loadSample(name) {
        var response = await fetch("PyGameSamples/"+ name + ".py");
        if (!response.ok) throw new Error("Sample not found");
        return response.text();
    }

    function selectSample(name, pushHash) {
        var known = SAMPLES.some(function (item) { return item[0] === name; });
        var chosen = known ? name : "playground";
        sampleSelect.value = chosen;
        if (pushHash) history.replaceState(null, "", "#" + chosen);
        loadSample(chosen).then(function (code) {
            if (editor) editor.setValue(code);
            else window.__pendingCode = code;
        }).catch(function () {
            writeOut("Could not load the " + chosen + " sample.\n", "error");
        });
    }

    sampleSelect.addEventListener("change", function () {
        selectSample(sampleSelect.value, true);
    });

    window.addEventListener("hashchange", function () {
        selectSample(window.location.hash.replace(/^#/, ""), false);
    });

    document.getElementById("textFileInput").addEventListener("change", function (event) {
        var file = event.target.files && event.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (loadEvent) {
            if (editor) editor.setValue(String(loadEvent.target.result || ""));
        };
        reader.readAsText(file);
        event.target.value = "";
    });

    document.getElementById("assetInput").addEventListener("change", function (event) {
        var files = Array.from(event.target.files || []);
        files.forEach(function (file) { addAsset(file); });
        event.target.value = "";
    });

    window.addEventListener("dragover", function (event) {
        event.preventDefault();
    });
    window.addEventListener("drop", function (event) {
        event.preventDefault();
        Array.from(event.dataTransfer.files || []).forEach(function (file) { addAsset(file); });
    });

    document.getElementById("saveBtn").addEventListener("click", saveProject);
    document.getElementById("pngBtn").addEventListener("click", savePng);
    document.getElementById("clearBtn").addEventListener("click", clearTerminal);
    document.getElementById("stopBtn").addEventListener("click", function () { stopCode("Execution stopped."); });
    document.getElementById("runBtn").addEventListener("click", runCode);

    window.addEventListener("keydown", function (event) {
        var meta = event.ctrlKey || event.metaKey;
        if (meta && event.key === "Enter") {
            event.preventDefault();
            runCode();
        } else if (meta && event.key === "Escape") {
            event.preventDefault();
            stopCode("Execution stopped.");
        } else if (meta && (event.key === "s" || event.key === "S")) {
            event.preventDefault();
            saveProject();
        }
    });

    var monacoRoot = new URL("/pages/codeEmulators/Libraries/monaco/", window.location.origin).href;
    var monacoVs = new URL("/pages/codeEmulators/Libraries/monaco/vs/", window.location.origin).href;
    window.MonacoEnvironment = {
        getWorkerUrl: function () {
            var source = "self.MonacoEnvironment={baseUrl:" + JSON.stringify(monacoRoot) + "};importScripts(" + JSON.stringify(monacoVs + "base/worker/workerMain.js") + ");";
            return "data:text/javascript;charset=utf-8," + encodeURIComponent(source);
        },
    };
    require.config({ paths: { vs: "/pages/codeEmulators/Libraries/monaco/vs" } });

    var initial = window.location.hash.replace(/^#/, "") || "playground";
    loadSample(initial).then(function (code) {
        window.__pendingCode = code;
        sampleSelect.value = SAMPLES.some(function (item) { return item[0] === initial; }) ? initial : "playground";
        startEditor(code);
    }).catch(function () {
        startEditor("import pygame\npygame.init()\nscreen = pygame.display.set_mode((640, 400))\nprint('pygame is ready')\n");
    });

    function startEditor(code) {
        require(["vs/editor/editor.main"], function () {
            editor = monaco.editor.create(document.getElementById("editor"), {
                value: window.__pendingCode || code,
                language: "python",
                theme: "vs-dark",
                fontSize: 14,
                tabSize: 4,
                insertSpaces: true,
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
            });
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, runCode);
            writeOut("Pygame runs locally in this browser. Ctrl+Enter runs, Ctrl+Esc stops, Ctrl+S saves the script.\n", "info");
        });
    }

    mountCanvas(true);
    setRunning(false);
}());
