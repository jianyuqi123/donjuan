// ========================================
// script.js 完整最终版
// ========================================

let currentOpenAlbum = null;

// ========================================
// 页面初始化
// ========================================

window.onload = function () {
  waitForData();
};

function waitForData() {

  const ready =
    window.playlist &&
    window.lyricsData &&
    window.album;

  if (!ready) {

    setTimeout(
      waitForData,
      50
    );

    return;
  }

  initPage();
}

function initPage() {

  renderPlaylist();

  renderAlbums();

  restoreTabFromHash();
}

// ========================================
// 曲序渲染
// ========================================

function renderPlaylist() {

  const body =
    document.getElementById(
      "playlist-body"
    );

  if (!body) return;

  body.innerHTML = "";

  window.playlist.forEach(song => {

    const row =
      document.createElement(
        "div"
      );

    row.className =
      "table-row";

    row.onclick =
      () =>
        openSongDetail(
          song.title
        );

    let cover =
      "picture/zhanweifu.png";

    if (
      song.cover &&
      song.cover !== "占位符"
    ) {

      cover =
        `picture/${song.cover}`;
    }

    row.innerHTML = `
      <div class="col-num">
        ${song.id || ""}
      </div>

      <div class="col-cover">
        <img
          src="${cover}"
          onerror="
            this.src='picture/zhanweifu.png'
          "
        >
      </div>

      <div class="col-title">
        ${escapeHtml(song.title)}
      </div>

      <div class="col-time">
        ${song.duration || ""}
      </div>

      <div class="col-age">
        ${song.year || ""}
      </div>

      <div class="col-note">
        ${
          escapeHtml(song.note)
          || "无"
        }
      </div>

      <div class="col-play">
        ▶
      </div>
    `;

    body.appendChild(row);
  });
}

// ========================================
// 专辑 / EP 渲染
// ========================================

function renderAlbums() {

  const albumBox =
    document.getElementById(
      "album-list"
    );

  const epBox =
    document.getElementById(
      "ep-list"
    );

  if (
    !albumBox ||
    !epBox
  ) return;

  albumBox.innerHTML = "";
  epBox.innerHTML = "";

  window.album.forEach(
    (
      item,
      index
    ) => {

      const row =
        document.createElement(
          "div"
        );

      row.className =
        "album-row";

      row.onclick =
        () =>
          openAlbum(
            index
          );

      const cover =
        item.cover ||
        "picture/zhanweifu.png";

      row.innerHTML =
        `
        <div class="album-cover-box">

          <img
            src="${cover}"
            class="album-cover-img"
            onerror="
              this.src=
              'picture/zhanweifu.png'
            "
          >

        </div>

        <div class="album-info">

          <h3>
            ${item.title}
          </h3>

          <p>
            发布时间：
            ${item.time}
          </p>

          <p>
            歌曲数：
            ${item.info}
          </p>

          <p>
            ${item.note}
          </p>

        </div>
      `;

      if (
        item.type ===
        "ep"
      ) {

        epBox.appendChild(
          row
        );
      }
      else {

        albumBox.appendChild(
          row
        );
      }
    }
  );
}

// ========================================
// 打开专辑详情
// ========================================

function openAlbum(index) {

  const data =
    window.album[index];

  if (!data) return;

  currentOpenAlbum =
    index;

  switchTab(
    "album-detail"
  );

  location.hash =
    `album-detail=${index}`;

  document.getElementById(
    "detail-album-title"
  ).innerText =
    data.title;

  document.getElementById(
    "detail-album-date"
  ).innerText =
    `发布时间：${data.time}`;

  document.getElementById(
    "detail-album-style"
  ).innerText =
    `歌曲数：${data.info}`;

  const coverEl =
    document.getElementById(
      "detail-album-cover"
    );

  if (coverEl) {

    coverEl.src =
      data.cover ||
      "picture/zhanweifu.png";
  }

  const trackBody =
    document.getElementById(
      "tracklist-body"
    );

  trackBody.innerHTML =
    "";

  if (
    Array.isArray(
      data.songs
    )
  ) {

    data.songs.forEach(
      (
        title,
        idx
      ) => {

        const song =
          window.playlist.find(
            item =>
              item.title ===
              title
          );

        if (!song)
          return;

        const row =
          document.createElement(
            "div"
          );

        row.className =
          "table-row";

        row.onclick =
          () => {

            location.href =
              "detail.html?title=" +
              encodeURIComponent(
                song.title
              ) +
              "&from=album" +
              "&album=" +
              index;
          };

        row.innerHTML =
          `
          <div class="col-num">
            ${idx + 1}
          </div>

          <div class="col-code">
            ${song.id}
          </div>

          <div class="col-title">
            ${song.title}
          </div>

          <div class="col-time">
            ${song.duration}
          </div>

          <div class="col-play">
            ▶
          </div>
        `;

        trackBody.appendChild(
          row
        );
      }
    );
  }
}

// ========================================
// detail 跳转
// ========================================

function openSongDetail(
  title
) {

  location.href =
    "detail.html?title=" +
    encodeURIComponent(
      title
    ) +
    "&from=playlist";
}

function goToDetail(
  id,
  from,
  album = ""
) {

  let url =
    `detail.html?song=${id}&from=${from}`;

  if (album) {

    url +=
      `&album=${album}`;
  }

  location.href =
    url;
}

// ========================================
// 页面切换
// ========================================

function switchTab(tab) {

  document
    .querySelectorAll(
      ".page"
    )
    .forEach(
      p =>
        p.classList.remove(
          "active"
        )
    );

  document
    .querySelectorAll(
      ".nav-item"
    )
    .forEach(
      item =>
        item.classList.remove(
          "active"
        )
    );

  const page =
    document.getElementById(
      "page-" + tab
    );

  if (page) {
    page.classList.add(
      "active"
    );
  }

  const index =
    [
      "home",
      "playlist",
      "album",
      "literature"
    ].indexOf(tab);

  if (
    index >= 0
  ) {

    document
      .querySelectorAll(
        ".nav-item"
      )[index]
      .classList.add(
        "active"
      );
  }
}

// ========================================
// 搜索
// ========================================

function searchSong() {

  const keyword =
    document
      .getElementById(
        "search-input"
      )
      .value
      .trim()
      .toLowerCase();

  const box =
    document.getElementById(
      "search-result"
    );

  box.innerHTML =
    "";

  if (!keyword) {

    box.style.display =
      "none";

    return;
  }

  const matched =
    window.playlist.filter(
      song =>
        song.title
          .toLowerCase()
          .includes(
            keyword
          )
    );

  matched.forEach(song => {

    const item =
      document.createElement(
        "div"
      );

    item.className =
      "search-result-item";

    item.onclick =
      () =>
        openSongDetail(
          song.title
        );

    item.innerHTML =
      `
      <span>
        ${song.title}
      </span>
    `;

    box.appendChild(item);
  });

  box.style.display =
    "block";
}

// ========================================
// hash恢复
// ========================================

function restoreTabFromHash() {

  const hash =
    location.hash;

  if (
    hash.includes(
      "playlist"
    )
  ) {

    switchTab(
      "playlist"
    );
  }

  else if (
    hash.includes(
      "album-detail"
    )
  ) {

    const index =
      hash.replace(
        "#album-detail=",
        ""
      );

    openAlbum(
      Number(index)
    );
  }
}

// ========================================
// XSS
// ========================================

function escapeHtml(str) {

  if (!str) return "";

  return str
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    );
}