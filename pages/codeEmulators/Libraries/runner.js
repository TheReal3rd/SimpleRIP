"use strict";

if (typeof setImmediate !== "function") {
    self.setImmediate = function (fn) { return setTimeout(fn, 0); };
}

self.onmessage = async function (event) {
    var msg = event.data;
    if (!msg || msg.type !== "run") return;

    try {
        importScripts(msg.skulptMin, msg.skulptStdlib, msg.pygameHost);
    } catch (err) {
        self.postMessage({
            type: "error",
            text: "Failed to load the Python runtime: " + (err && err.message ? err.message : err),
        });
        self.postMessage({ type: "done" });
        return;
    }

    var host = createPygameHost({
        canvas: msg.canvas,
        post: function (data) { self.postMessage(data); },
    });
    self.__pygameHost = host;
    installPygame();

    try {
        await host.prepare(msg);
    } catch (err) {
        self.postMessage({ type: "error", text: "Could not prepare files: " + (err && err.message ? err.message : err) });
    }

    var pendingInputs = {};

    self.onmessage = function (e) {
        var m = e.data;
        if (!m || !m.type) return;
        if (m.type === "input-response" && pendingInputs[m.id]) {
            pendingInputs[m.id](m.value);
            delete pendingInputs[m.id];
            return;
        }
        if (m.type === "yield-ack" && host.pendingYields[m.id]) {
            var resume = host.pendingYields[m.id];
            delete host.pendingYields[m.id];
            host.applySnapshot(m);
            resume();
            return;
        }
        if (m.type === "dom-event") {
            host.pushDomEvent(m.event);
            return;
        }
        if (m.type === "audio-ended" && self.__pygameNoteAudio) {
            self.__pygameNoteAudio(m.id, !!m.music);
            return;
        }
        if (m.type === "snapshot-request") {
            host.canvas.convertToBlob({ type: "image/png" }).then(function (blob) {
                self.postMessage({ type: "download", blob: blob, filename: "pygame.png" });
            }).catch(function () {});
            return;
        }
        if (m.type === "capture-frame") {
            try {
                if (host.canvas && host.canvas.transferToImageBitmap) {
                    var bitmap = host.canvas.transferToImageBitmap();
                    self.postMessage({ type: "final-frame", bitmap: bitmap }, [bitmap]);
                }
            } catch (err) { /* Stop still ends the run if the frame cannot be copied. */ }
        }
    };

    function builtinRead(filename) {
        if (!Sk.builtinFiles || !Sk.builtinFiles.files || Sk.builtinFiles.files[filename] === undefined) {
            throw "File not found: '" + filename + "'";
        }
        return Sk.builtinFiles.files[filename];
    }

    Sk.configure({
        output: function (text) {
            self.postMessage({ type: "output", text: text == null ? "" : String(text) });
        },
        read: builtinRead,
        inputfun: function (promptText) {
            return new Promise(function (resolve) {
                var id = Math.random().toString(36).slice(2);
                pendingInputs[id] = resolve;
                self.postMessage({
                    type: "input-request",
                    id: id,
                    prompt: promptText == null ? "" : String(promptText),
                });
            });
        },
        inputfunTakesPrompt: true,
        yieldLimit: null,
        __future__: Sk.python3,
    });

    try {
        await Sk.misceval.asyncToPromise(function () {
            return Sk.importMainWithBody("<stdin>", false, msg.code, true);
        });
    } catch (err) {
        self.postMessage({ type: "error", text: formatSkError(err) });
    } finally {
        host.clearTimers();
        try {
            if (host.canvas && host.canvas.transferToImageBitmap) {
                var bitmap = host.canvas.transferToImageBitmap();
                self.postMessage({ type: "final-frame", bitmap: bitmap }, [bitmap]);
            }
        } catch (err) { /* The last frame stays on the live canvas when this is unavailable. */ }
        self.postMessage({ type: "done" });
    }
};

function formatSkError(err) {
    if (!err) return "Error";
    if (err.tp$name || (err.args && err.args.v)) {
        var msg = "";
        try {
            if (err.args && err.args.v && err.args.v.length) {
                msg = err.args.v.map(function (part) {
                    if (part && part.v !== undefined) return String(part.v);
                    return String(part);
                }).join(", ");
            } else if (err.tp$str) {
                var text = err.tp$str();
                msg = text && text.v !== undefined ? text.v : String(text);
            }
        } catch (inner) {
            msg = err.message || String(err);
        }
        var where = "";
        if (err.traceback && err.traceback.length) {
            where = err.traceback.map(function (frame) {
                return "  File \"" + (frame.filename || "<stdin>") + "\", line " + frame.lineno;
            }).join("\n") + "\n";
        }
        return where + (err.tp$name || "Exception") + ": " + msg;
    }
    if (err.stack) return String(err.stack);
    return err.message ? String(err.message) : String(err);
}
