const cmEditor = CodeMirror.fromTextArea(document.getElementById("ed"), {
    lineNumbers: true,
    theme: "mdn-like",
    mode: "toml",
})
document.getElementById("edmLight").checked = true

function clearStatus() {
    document.getElementById("status").innerText = ""
}

function setStatus(message) {
    document.getElementById("status").innerText = message
    setTimeout(clearStatus, 5000)
}

function changeEditorAppearance(style) {
    if (style === "dark") {
        cmEditor.setOption("theme", "darcula")
    } else {
        cmEditor.setOption("theme", "mdn-like")
    }
}

function loadContents(identifier) {
    fetch(`/rw/load/${identifier}`)
        .then((resp) => {
            if (resp.ok) {
                resp.text().then((toml) => {
                    cmEditor.setValue(toml)
                    setStatus(`loaded: identifier "${identifier}"`)
                })
            }
            throw new Error(`could not load: ${identifier}`)
        })
        .catch((err) => {
            setStatus(err)
        })
}

function saveContents(content) {
    let respBody = []
    respBody.push("ed=" + encodeURIComponent(cmEditor.getValue()))
    fetch(`/rw/save/${content}`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: respBody,
    })
        .then((response) => {
            response.text().then((status) => {
                setStatus(status)
            })
        })
        .catch((err) => {
            setStatus(err)
        })
}
