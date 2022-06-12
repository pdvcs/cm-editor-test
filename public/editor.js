const THEME_DARK = "dark"
const THEME_LIGHT = "light"

const cmEditor = CodeMirror.fromTextArea(document.getElementById("ed"), {
    lineNumbers: true,
    theme: "mdn-like",
    mode: "toml",
})
if (getCookie("appearance") === THEME_DARK) {
    document.getElementById("edmDark").checked = true
    changeEditorAppearance(THEME_DARK)
} else {
    document.getElementById("edmLight").checked = true
    changeEditorAppearance(THEME_LIGHT)
}

function clearStatus() {
    document.getElementById("status").innerText = ""
}

function setStatus(message) {
    document.getElementById("status").innerText = message
    setTimeout(clearStatus, 5000)
}

function getCookie(cookieName) {
    let r
    try {
        r = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${cookieName}=`))
            .split("=")[1]
    } catch (err) {
        console.log(`not found: cookie ${cookieName}`)
        r = ""
    }
    return r
}

function setCookie(cookieName, cookieValue) {
    document.cookie = `${cookieName}=${cookieValue}; SameSite=Strict`
}

function changeEditorAppearance(style) {
    if (style === THEME_DARK) {
        cmEditor.setOption("theme", "darcula")
        document.body.style.backgroundColor = "#111"
        document.body.style.color = "#fff"
        setCookie("appearance", THEME_DARK)
    } else {
        cmEditor.setOption("theme", "mdn-like")
        document.body.style.backgroundColor = "#fff"
        document.body.style.color = "#000"
        setCookie("appearance", THEME_LIGHT)
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
            } else {
                throw new Error(`could not load: ${identifier}`)
            }
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
