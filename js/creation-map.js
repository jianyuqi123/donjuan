const CREATION_STAGE_CONFIG = {
    adolescence: {
        title: "青春期",
        range: [1, 30],
        desc: "DxV-001 至 DxV-030",
        albums: [
            "昨日遗书",
            "今日卡司"
        ],
        placeholders: [
            "需要展现封面"
        ]
    },
    college: {
        title: "大学",
        range: [31, 70],
        desc: "DxV-031 至 DxV-070",
        albums: [
            "卡塞尔回忆录·壹",
            "卡塞尔回忆录·贰",
            "卡塞尔回忆录·叁",
            "卡塞尔回忆录·肆",
            "明日物候",
            "一个陌生女人的来信"
        ]
    },
    work: {
        title: "工作",
        range: [71, Infinity],
        desc: "DxV-071 之后",
        albums: [
            "自然历史",
            "2号线|绿日长夏",
            "7号线|不听摇滚的你",
            "出加沙记"
        ]
    }
};

const CREATION_STAGE_ORDER = [
    "adolescence",
    "college",
    "work"
];

function getCreationAlbumSongs(albumItem) {
    if (!albumItem) return [];

    if (
        Array.isArray(albumItem.discs) &&
        albumItem.discs.length
    ) {
        return albumItem.discs
            .flatMap(disc => disc.songs || []);
    }

    return albumItem.songs || [];
}

function findCreationAlbum(title) {
    return (window.album || [])
        .find(item => item.title === title);
}

function getCreationSong(title) {
    return (window.playlist || [])
        .find(song => song.title === title);
}

function getCreationStageSongs(stageKey) {
    const config =
        CREATION_STAGE_CONFIG[stageKey];

    if (!config) return [];

    const [from, to] =
        config.range;

    return (window.playlist || [])
        .filter(song => (
            song.id >= from &&
            song.id <= to
        ));
}

function getCreationCover(cover) {
    if (
        !cover ||
        cover === "占位符"
    ) {
        return "picture/zhanweifu.png";
    }

    if (
        cover.startsWith("picture/") ||
        cover.startsWith("http://") ||
        cover.startsWith("https://")
    ) {
        return cover;
    }

    return `picture/${cover}`;
}

function escapeCreationAttr(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function creationAlbumHref(title) {
    return `album-detail.html?id=${encodeURIComponent(title)}`;
}

function creationSongHref(title) {
    return `detail.html?title=${encodeURIComponent(title)}`;
}

function renderCreationOverview(showAll = false) {
    const container =
        document.getElementById("creation-overview-map");

    if (!container) return;

    container.className =
        showAll ?
        "creation-overview-map is-expanded" :
        "creation-overview-map";

    container.innerHTML = `
        <svg class="creation-lines" aria-hidden="true"></svg>
        <div class="creation-overview-grid"></div>
    `;

    const grid =
        container.querySelector(".creation-overview-grid");

    CREATION_STAGE_ORDER.forEach(stageKey => {
        grid.appendChild(
            createCreationOverviewStage(
                stageKey,
                showAll
            )
        );
    });

    const button =
        document.getElementById("creation-show-all");

    if (button) {
        button.innerText =
            showAll ?
            "收起" :
            "显示全部";

        button.onclick =
            () => renderCreationOverview(!showAll);
    }

    requestAnimationFrame(
        () => drawCreationLines(container)
    );
}

function createCreationOverviewStage(stageKey, showAll) {
    const config =
        CREATION_STAGE_CONFIG[stageKey];

    const section =
        document.createElement("section");

    section.className =
        "creation-stage-column";

    section.innerHTML = `
        <a
            class="creation-stage-node"
            data-node="${stageKey}-stage"
            href="creation-map.html?stage=${stageKey}"
        >
            <span>${config.title}</span>
            <small>${config.desc}</small>
        </a>
        <div class="creation-album-cluster"></div>
        ${showAll ? '<div class="creation-song-cloud"></div>' : ''}
    `;

    const albumCluster =
        section.querySelector(".creation-album-cluster");

    const songCloud =
        section.querySelector(".creation-song-cloud");

    config.albums.forEach(title => {
        albumCluster.appendChild(
            createCreationAlbumNode(
                title,
                `${stageKey}-album-${title}`,
                false
            )
        );
    });

    (config.placeholders || []).forEach(title => {
        albumCluster.appendChild(
            createCreationAlbumNode(
                title,
                `${stageKey}-album-${title}`,
                true
            )
        );
    });

    if (showAll && songCloud) {
        getCreationStageSongs(stageKey)
            .forEach(song => {
                songCloud.appendChild(
                    createCreationSongNode(
                        song,
                        `${stageKey}-song-${song.title}`
                    )
                );
            });

        const extraSongs =
            getCreationExtraSongsForStage(stageKey);

        if (extraSongs.length) {
            const edge =
                document.createElement("div");

            edge.className =
                "creation-edge-song-group";

            extraSongs.forEach(song => {
                edge.appendChild(
                    createCreationSongNode(
                        song,
                        `${stageKey}-extra-${song.title}`
                    )
                );
            });

            songCloud.appendChild(edge);
        }
    }

    return section;
}

function createCreationAlbumNode(title, nodeId, isPlaceholder) {
    const item =
        findCreationAlbum(title);

    const tag =
        item && !isPlaceholder ?
        "a" :
        "div";

    const node =
        document.createElement(tag);

    node.className =
        isPlaceholder || !item ?
        "creation-album-node is-placeholder" :
        "creation-album-node";

    node.dataset.node =
        nodeId;

    if (tag === "a") {
        node.href =
            creationAlbumHref(item.title);
    }

    node.innerHTML = `
        <div class="creation-folder-tab"></div>
        <img
            src="${getCreationCover(item?.cover)}"
            alt="${escapeCreationAttr(item?.title || title)}"
        >
        <div>
            <strong>${item?.title || title}</strong>
            <span>${item?.englishTitle || "占位档案"}</span>
        </div>
    `;

    return node;
}

function createCreationSongNode(song, nodeId) {
    const node =
        document.createElement("a");

    node.className =
        "creation-song-node";

    node.dataset.node =
        nodeId;

    node.href =
        creationSongHref(song.title);

    node.innerHTML = `
        <img
            src="${getCreationCover(song.cover)}"
            alt="${escapeCreationAttr(song.title)}"
        >
        <span>${song.title}</span>
        <small>DxV-${String(song.id).padStart(3, "0")}</small>
    `;

    return node;
}

function getCreationExtraSongsForStage(stageKey) {
    const config =
        CREATION_STAGE_CONFIG[stageKey];

    if (!config) return [];

    const [from, to] =
        config.range;

    const seen =
        new Set();

    const songs =
        [];

    config.albums.forEach(title => {
        const item =
            findCreationAlbum(title);

        getCreationAlbumSongs(item)
            .forEach(songTitle => {
                const song =
                    getCreationSong(songTitle);

                if (
                    !song ||
                    seen.has(song.title)
                ) {
                    return;
                }

                const inRange =
                    song.id >= from &&
                    song.id <= to;

                if (!inRange) {
                    seen.add(song.title);
                    songs.push(song);
                }
            });
    });

    return songs;
}

function getCreationAlbumMatches(stageKey) {
    const config =
        CREATION_STAGE_CONFIG[stageKey];

    if (!config) return [];

    const matches =
        [];

    config.albums.forEach(title => {
        const item =
            findCreationAlbum(title);

        if (!item) return;

        getCreationAlbumSongs(item)
            .forEach(songTitle => {
                const song =
                    getCreationSong(songTitle);

                if (!song) return;

                matches.push({
                    album: title,
                    song
                });
            });
    });

    return matches;
}

function drawCreationLines(root) {
    const svg =
        root.querySelector(".creation-lines");

    if (!svg) return;

    const rootRect =
        root.getBoundingClientRect();

    svg.setAttribute("viewBox", `0 0 ${rootRect.width} ${rootRect.height}`);
    svg.innerHTML = "";

    const addLine =
        (from, to) => {
            const fromEl =
                root.querySelector(`[data-node="${CSS.escape(from)}"]`);

            const toEl =
                root.querySelector(`[data-node="${CSS.escape(to)}"]`);

            if (!fromEl || !toEl) return;

            const a =
                getCreationNodeCenter(fromEl, rootRect);

            const b =
                getCreationNodeCenter(toEl, rootRect);

            const line =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );

            line.setAttribute("x1", a.x);
            line.setAttribute("y1", a.y);
            line.setAttribute("x2", b.x);
            line.setAttribute("y2", b.y);
            line.setAttribute("class", "creation-red-line");

            svg.appendChild(line);
        };

    CREATION_STAGE_ORDER.forEach(stageKey => {
        const config =
            CREATION_STAGE_CONFIG[stageKey];

        config.albums.forEach(title => {
            addLine(
                `${stageKey}-stage`,
                `${stageKey}-album-${title}`
            );
        });

        (config.placeholders || []).forEach(title => {
            addLine(
                `${stageKey}-stage`,
                `${stageKey}-album-${title}`
            );
        });

        getCreationAlbumMatches(stageKey)
            .forEach(({ album, song }) => {
                addLine(
                    `${stageKey}-album-${album}`,
                    `${stageKey}-song-${song.title}`
                );

                addLine(
                    `${stageKey}-album-${album}`,
                    `${stageKey}-extra-${song.title}`
                );
            });
    });
}

function getCreationNodeCenter(node, rootRect) {
    const rect =
        node.getBoundingClientRect();

    return {
        x: rect.left - rootRect.left + rect.width / 2,
        y: rect.top - rootRect.top + rect.height / 2
    };
}

function renderCreationStagePage() {
    const root =
        document.getElementById("creation-stage-map");

    if (!root) return;

    const params =
        new URLSearchParams(location.search);

    const requested =
        params.get("stage") || "adolescence";

    const stageKey =
        CREATION_STAGE_CONFIG[requested] ?
        requested :
        "adolescence";

    renderCreationStage(stageKey);
}

function renderCreationStage(stageKey) {
    const config =
        CREATION_STAGE_CONFIG[stageKey];

    const root =
        document.getElementById("creation-stage-map");

    if (!config || !root) return;

    document.getElementById("creation-stage-kicker").innerText =
        "创作地图内页";

    document.getElementById("creation-stage-title").innerText =
        config.title;

    document.getElementById("creation-stage-desc").innerText =
        `${config.desc}，专辑档案与曲序用红线连接。`;

    document
        .querySelectorAll(".creation-stage-nav button")
        .forEach(button => {
            const isActive =
                button.dataset.stage === stageKey;

            button.classList.toggle("active", isActive);

            button.onclick =
                () => {
                    history.replaceState(
                        null,
                        "",
                        `creation-map.html?stage=${button.dataset.stage}`
                    );

                    renderCreationStage(button.dataset.stage);
                };
        });

    root.innerHTML = `
        <svg class="creation-lines" aria-hidden="true"></svg>
        <div class="creation-inner-layout">
            <aside class="creation-inner-albums"></aside>
            <section class="creation-inner-songs"></section>
            <aside class="creation-inner-extra">
                <h2>边缘曲目</h2>
                <div></div>
            </aside>
        </div>
    `;

    const albumArea =
        root.querySelector(".creation-inner-albums");

    const songArea =
        root.querySelector(".creation-inner-songs");

    const extraArea =
        root.querySelector(".creation-inner-extra div");

    config.albums.forEach(title => {
        albumArea.appendChild(
            createCreationAlbumNode(
                title,
                `${stageKey}-album-${title}`,
                false
            )
        );
    });

    (config.placeholders || []).forEach(title => {
        albumArea.appendChild(
            createCreationAlbumNode(
                title,
                `${stageKey}-album-${title}`,
                true
            )
        );
    });

    getCreationStageSongs(stageKey)
        .forEach((song, index) => {
            const node =
                createCreationSongNode(
                    song,
                    `${stageKey}-song-${song.title}`
                );

            if (index % 2) {
                node.classList.add("is-offset");
            }

            songArea.appendChild(node);
        });

    const extraSongs =
        getCreationExtraSongsForStage(stageKey);

    extraSongs.forEach(song => {
        extraArea.appendChild(
            createCreationSongNode(
                song,
                `${stageKey}-extra-${song.title}`
            )
        );
    });

    if (!extraSongs.length) {
        root
            .querySelector(".creation-inner-extra")
            .classList.add("is-empty");
    }

    requestAnimationFrame(
        () => drawCreationLines(root)
    );
}

window.addEventListener("resize", () => {
    document
        .querySelectorAll(".creation-overview-map, .creation-stage-map")
        .forEach(root => drawCreationLines(root));
});
