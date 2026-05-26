const DEFAULT_COVER = "picture/zhanweifu.png";

function getCoverPath(cover) {

  if (
      !cover ||
      cover === "占位符"
  ) {

      return DEFAULT_COVER;
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

function goAlbumDetail(title) {

  location.href =
      `album-detail.html?id=${encodeURIComponent(title)}`;
}

function escapeAttr(value) {

  return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
}

function createAlbumCard(item, compact = false) {

  const card =
      document.createElement("div");

  card.className =
      compact ?
      "album-card compact" :
      "album-card";

  card.innerHTML = `
      <img
          class="album-card-cover"
          src="${getCoverPath(item.cover)}"
          alt="${item.title || "作品封面"}"
      >

      <div class="album-card-info">
          <h3>${item.title || "-"}</h3>
          <p class="album-card-en">${item.englishTitle || ""}</p>
          <p class="album-card-time">${item.time || "未知时间"}</p>
      </div>
  `;

  card.onclick =
      () => goAlbumDetail(item.title);

  return card;
}

/* ==========================================
   页面切换
========================================== */

function switchTab(page) {

  // 所有页面隐藏
  document
      .querySelectorAll(".page")
      .forEach(el =>
          el.classList.remove("active")
      );

  // 顶部导航状态
  document
      .querySelectorAll(".nav-item")
      .forEach(el =>
          el.classList.remove("active")
      );

  // 页面显示
  const pageDom =
      document.getElementById(
          `page-${page}`
      );

  if (pageDom) {
      pageDom.classList.add(
          "active"
      );
  }

  // nav 激活
  const navs =
      document.querySelectorAll(
          ".nav-item"
      );

  const map = {
      home: 0,
      playlist: 1,
      work: 2,
      project: 3,
      private: 4,
      literature: 5
  };

  if (
      map[page] !== undefined &&
      navs[map[page]]
  ) {

      navs[
          map[page]
      ].classList.add(
          "active"
      );
  }

  // 记录 hash
  location.hash =
      `page-${page}`;
}

/* ==========================================
 hash 路由
========================================== */

window.addEventListener(
  "load",
  () => {

      const hash =
          location.hash.replace(
              "#",
              ""
          );

      if (
          hash &&
          document.getElementById(hash)
      ) {

          switchTab(
              hash.replace(
                  "page-",
                  ""
              )
          );
      }
      else {

          switchTab(
              "home"
          );
      }

      renderPlaylist();
      renderWork();
      renderSidebarWorks();
  }
);

/* ==========================================
 搜索作品 / 歌曲
========================================== */

function searchSong() {

  const keyword =
      document
      .getElementById(
          "search-input"
      )
      .value
      .trim()
      .toLowerCase();

  const result =
      document.getElementById(
          "search-result"
      );

  result.innerHTML = "";

  if (!keyword) {

      result.style.display =
          "none";

      return;
  }

  const matchedAlbums =
      (window.album || [])
      .filter(
          item =>
              item.title
              ?.toLowerCase()
              .includes(keyword)
      )
      .map(
          item => ({
              type: "album",
              title: item.title,
              subtitle: item.englishTitle || item.time || "音乐作品",
              cover: item.cover,
              url: `album-detail.html?id=${encodeURIComponent(item.title)}`
          })
      );

  const matchedSongs =
      (window.playlist || [])
      .filter(
          song =>
              song.title
              ?.toLowerCase()
              .includes(keyword)
      )
      .map(
          song => ({
              type: "song",
              title: song.title,
              subtitle: song.year || song.duration || "歌曲",
              cover: song.cover,
              url: `detail.html?title=${encodeURIComponent(song.title)}`
          })
      );

  const matched =
      [
          ...matchedAlbums,
          ...matchedSongs
      ].slice(0, 12);

  if (!matched.length) {

      const empty =
          document.createElement("div");

      empty.className =
          "search-empty";

      empty.innerText =
          "没有找到匹配结果";

      result.appendChild(empty);

      result.style.display =
          "block";

      return;
  }

  matched.forEach(item => {

      const div =
          document.createElement(
              "div"
          );

      div.className =
          "search-result-item";

      div.innerHTML = `
          <img
              src="${getCoverPath(item.cover)}"
              alt="${item.title}"
          >
          <div class="search-result-text">
              <strong>${item.title}</strong>
              <span>${item.type === "album" ? "作品" : "歌曲"} · ${item.subtitle}</span>
          </div>
      `;

      div.onclick =
          () => {

              location.href =
                  item.url;
          };

      result.appendChild(
          div
      );
  });

  result.style.display =
      "block";
}

/* ==========================================
 曲序页
========================================== */

function renderPlaylist() {

  const body =
      document.getElementById(
          "playlist-body"
      );

  if (!body)
      return;

  body.innerHTML = "";

  window.playlist.forEach(
      (song, index) => {

          const row =
              document.createElement(
                  "div"
              );

          row.className =
              "table-row";

          row.innerHTML = `
              <div class="col-num">
                  DxV-${String(song.id || index + 1).padStart(3, "0")}
              </div>

              <div class="col-title">
                  ${song.title || "-"}
              </div>

              <div class="col-en-title">
                  ${song.englishTitle || "-"}
              </div>

              <div class="col-creation">
                  ${song.year || "-"}
              </div>

              <div class="col-age">
                  ${song.age || "-"}
              </div>

              <div class="col-release">
                  ${song.release || "-"}
              </div>

              <div class="col-style">
                  ${song.style || "-"}
              </div>

              <div class="col-play">

                  <button
                      class="icon-action-btn play-btn"
                      title="播放"
                      aria-label="播放 ${escapeAttr(song.title)}"
                  >
                      ▶
                  </button>

              </div>

              <div class="col-lyrics">
                  <button
                      class="icon-action-btn lyrics-btn"
                      title="歌词详情"
                      aria-label="查看 ${escapeAttr(song.title)} 歌词详情"
                  >
                      ♫
                  </button>
              </div>
          `;

          row
              .querySelector(".play-btn")
              .onclick =
              () => playSong(song.title);

          row
              .querySelector(".lyrics-btn")
              .onclick =
              () => openLyricsSidebar(song.title);

          body.appendChild(row);
      }
  );
}

/* ==========================================
 进入 detail
========================================== */

function playSong(title) {

  location.href =
      `detail.html?title=${encodeURIComponent(title)}`;
}

function openLyricsSidebar(title) {

  const lyric =
      (window.lyricsData || [])
      .find(
          item =>
              item.title === title
      );

  document.getElementById(
      "lyrics-title"
  ).innerText =
      title;

  document.getElementById(
      "lyrics-body"
  ).innerText =
      lyric?.lyrics ||
      "暂无歌词";

  document.getElementById(
      "lyrics-sidebar"
  ).classList.add(
      "show"
  );
}

function closeLyricsSidebar() {

  document.getElementById(
      "lyrics-sidebar"
  ).classList.remove(
      "show"
  );
}

/* ==========================================
 作品页
========================================== */

function renderWork() {

  const container =
      document.getElementById(
          "work-list"
      );

  if (!container)
      return;

  container.innerHTML =
      "";

  if (
      !window.album ||
      !Array.isArray(
          window.album
      )
  ) return;

  renderAlbumList(
      window.album,
      container
  );
}

function renderAlbumList(data, container) {

  container.innerHTML =
      "";

  if (
      !data ||
      !data.length
  ) {

      const empty =
          document.createElement("div");

      empty.className =
          "empty-works";

      empty.innerText =
          "暂无作品";

      container.appendChild(empty);

      return;
  }

  data.forEach(
      item => {

          container.appendChild(
              createAlbumCard(item)
          );
      }
  );
}

function renderSidebarWorks() {

  const container =
      document.getElementById(
          "sidebar-works"
      );

  if (!container)
      return;

  container.innerHTML =
      "";

  (window.album || []).forEach(
      item => {

          container.appendChild(
              createAlbumCard(
                  item,
                  true
              )
          );
      }
  );
}

/* ==========================================
 dropdown 分类
========================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

      const filters =
          document.querySelectorAll(
              ".multi-filter"
          );

      filters.forEach(
          btn => {

              btn.onclick =
                  e => {

                      e.stopPropagation();

                      const type =
                          btn.dataset.type;

                      const list =
                          document.getElementById(
                              "work-list"
                          );

                      if (!list)
                          return;

                      let data =
                          window.album;

                      if (
                          type !==
                          "all"
                      ) {

                          data =
                              data.filter(
                                  item =>
                                      item.type ===
                                      type
                              );
                      }

                      renderAlbumList(
                          data,
                          list
                      );
                  };
          }
      );
  }
);
