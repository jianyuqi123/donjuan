const DONJUAN_THEME_KEY = "donjuan-theme";

function normalizeDonjuanTheme(theme) {
    return theme === "light" ? "light" : "dark";
}

function getDonjuanTheme() {
    return normalizeDonjuanTheme(
        localStorage.getItem(DONJUAN_THEME_KEY)
    );
}

function updateThemeControls(theme) {
    document
        .querySelectorAll(".theme-toggle")
        .forEach(button => {
            button.textContent =
                theme === "light" ?
                "\u263e" :
                "\u2600";

            button.title =
                theme === "light" ?
                "\u5207\u6362\u5230\u591c\u95f4\u6a21\u5f0f" :
                "\u5207\u6362\u5230\u767d\u5929\u6a21\u5f0f";
        });
}

function broadcastDonjuanTheme(theme) {
    try {
        if (
            window.parent &&
            window.parent !== window
        ) {
            window.parent.postMessage(
                {
                    type: "donjuan-theme",
                    theme
                },
                "*"
            );
        }

        document
            .querySelectorAll("iframe")
            .forEach(frame => {
                frame.contentWindow?.postMessage(
                    {
                        type: "donjuan-theme",
                        theme
                    },
                    "*"
                );
            });
    } catch (error) {}
}

function applyDonjuanTheme(theme, options = {}) {
    const normalized =
        normalizeDonjuanTheme(theme);

    const persist =
        options.persist !== false;

    const broadcast =
        options.broadcast === true;

    document.documentElement.classList.remove(
        "theme-light-preload"
    );

    document.body.classList.toggle(
        "theme-light",
        normalized === "light"
    );

    updateThemeControls(normalized);

    if (persist) {
        localStorage.setItem(
            DONJUAN_THEME_KEY,
            normalized
        );
    }

    if (broadcast) {
        broadcastDonjuanTheme(normalized);
    }
}

function setDonjuanTheme(theme) {
    applyDonjuanTheme(
        theme,
        {
            persist: true,
            broadcast: true
        }
    );
}

function initDonjuanTheme() {
    applyDonjuanTheme(
        getDonjuanTheme(),
        {
            persist: false,
            broadcast: false
        }
    );

    document
        .querySelectorAll(".theme-toggle")
        .forEach(button => {
            button.onclick =
                () => {
                    setDonjuanTheme(
                        document.body.classList.contains("theme-light") ?
                        "dark" :
                        "light"
                    );
                };
        });
}

window.addEventListener(
    "DOMContentLoaded",
    initDonjuanTheme
);

window.addEventListener(
    "storage",
    event => {
        if (event.key === DONJUAN_THEME_KEY) {
            applyDonjuanTheme(
                event.newValue || "dark",
                {
                    persist: false,
                    broadcast: false
                }
            );
        }
    }
);

window.addEventListener(
    "message",
    event => {
        if (event.data?.type === "donjuan-theme") {
            applyDonjuanTheme(
                event.data.theme,
                {
                    persist: false,
                    broadcast: false
                }
            );
        }
    }
);
