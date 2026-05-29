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

  const release =
      typeof getReleasedWork === "function" ?
      getReleasedWork(item.title) :
      null;

  if (release) {
      card.classList.add(
          "has-release-accent",
          release.accent || "green"
      );
  }

  card.innerHTML = `
      ${release ? `<span class="release-badge ${release.accent || ""}" aria-label="发行标记"></span>` : ""}
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
      creation: 2,
      work: 3,
      project: 4,
      private: 5,
      literature: 6
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

  // 记录当前页，不触发浏览器锚点滚动。
  history.replaceState(
      null,
      "",
      `#page-${page}`
  );
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
      bindWorkFilters();
      renderProjects();
      renderFriends();
      renderSidebarWorks();
      renderWorldview();
      renderCreationOverview();
      renderLiterature();

      if (
          sessionStorage.getItem("donjuan-restore-scroll") === "1"
      ) {
          sessionStorage.removeItem("donjuan-restore-scroll");

          const y =
              Number(
                  sessionStorage.getItem("donjuan-return-scroll") ||
                  0
              );

          requestAnimationFrame(
              () => window.scrollTo(0, y)
          );
      }
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

  const titleMatches =
      value =>
          String(value || "")
              .toLowerCase()
              .includes(keyword);

  const matchedAlbums =
      (window.album || [])
      .filter(
          item =>
              titleMatches(item.title)
      )
      .map(
          item => ({
              title: item.title,
              subtitle: item.englishTitle || item.time || "音乐作品",
              cover: item.cover,
              url: `album-detail.html?id=${encodeURIComponent(item.title)}`
          })
      );

  const matchedSongs =
      [
          ...(window.playlist || []),
          ...(window.otherSongs || [])
      ]
      .filter(
          song =>
              titleMatches(song.title)
      )
      .map(
          song => ({
              title: song.title,
              subtitle: song.year || song.duration || "歌曲",
              cover: song.cover,
              url: `detail.html?title=${encodeURIComponent(song.title)}`
          })
      );

  const matchedProjects =
      (window.projects || [])
      .filter(
          project =>
              titleMatches(project.title)
      )
      .map(
          project => ({
              title: project.title,
              subtitle: project.englishTitle || project.info || "音乐企划",
              cover: "picture/zhanweifu.png",
              url: `project-detail.html?id=${encodeURIComponent(project.title)}`
          })
      );

  const matchedLiterature =
      (window.literatureWorks || [])
      .filter(
          item =>
              titleMatches(item.title)
      )
      .map(
          item => ({
              title: item.title,
              subtitle: `${item.category || "文学"} · ${item.time || ""}`,
              cover: "picture/zhanweifu.png",
              url: "index.html#page-literature"
          })
      );

  const groups =
      [
          {
              title: "曲目",
              items: matchedSongs.slice(0, 8)
          },
          {
              title: "专辑 / EP",
              items: matchedAlbums.slice(0, 8)
          },
          {
              title: "企划",
              items: matchedProjects.slice(0, 6)
          },
          {
              title: "文学作品",
              items: matchedLiterature.slice(0, 6)
          }
      ].filter(group => group.items.length);

  if (!groups.length) {

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

  groups.forEach(group => {

      const title =
          document.createElement("div");

      title.className =
          "search-group-title";

      title.innerText =
          group.title;

      result.appendChild(title);

      group.items.forEach(item => {

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
              <span>${item.subtitle}</span>
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

          const release =
              typeof getSongReleaseInfo === "function" ?
              getSongReleaseInfo(song.title) :
              null;

          const row =
              document.createElement(
                  "div"
              );

          row.className =
              release ?
              `table-row is-released ${release.accent || ""}` :
              "table-row";

          row.dataset.title =
              song.title || "";

          row.innerHTML = `
              <div class="col-num">
                  DxV-${String(song.id || index + 1).padStart(3, "0")}
              </div>

              <div class="col-title">
                  ${release ? `<span class="release-badge inline ${release.accent || ""}" aria-label="发行标记"></span>` : ""}
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
                      data-title="${escapeAttr(song.title)}"
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

  if (
      window.parent &&
      window.parent !== window
  ) {
      try {
          if (
              typeof window.parent.handleEmbeddedPlaySong === "function"
          ) {
              window.parent.handleEmbeddedPlaySong(title);
              return;
          }
      } catch (error) {}

      try {
          window.parent.postMessage(
              {
                  type: "donjuan-play-song",
                  title
              },
              "*"
          );
      } catch (error) {}

      return;
  }

  sessionStorage.setItem(
      "donjuan-return-page",
      location.hash || "#page-playlist"
  );

  sessionStorage.setItem(
      "donjuan-return-scroll",
      String(window.scrollY || 0)
  );

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
  ).innerHTML = `
      <section class="lyrics-drawer-section">
          <h4>歌词</h4>
          <p>${escapeHtml(lyric?.lyrics || "暂无歌词")}</p>
      </section>
      <section class="lyrics-drawer-section">
          <h4>credits</h4>
          <p>${escapeHtml(lyric?.info || "暂无 credits")}</p>
      </section>
      <section class="lyrics-drawer-section">
          <h4>创作手记</h4>
          <p>${escapeHtml(lyric?.note || "暂无创作手记")}</p>
      </section>
  `;

  document.getElementById(
      "lyrics-sidebar"
  ).classList.add(
      "show"
  );
}

function escapeHtml(value) {

  return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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
      getSortedAlbums(window.album),
      container
  );
}

function getAlbumTimeValue(item) {

  const raw =
      String(item?.time || "")
          .replace(/\./g, "-")
          .replace(/\//g, "-");

  const value =
      Date.parse(raw);

  return Number.isNaN(value) ?
      0 :
      value;
}

function getSortedAlbums(data) {

  return [...(data || [])].sort(
      (a, b) =>
          getAlbumTimeValue(b) -
          getAlbumTimeValue(a)
  );
}

function typeIncludes(item, type) {

  return String(item?.type || "")
      .toLowerCase()
      .includes(type);
}

function applyWorkFilters() {

  const container =
      document.getElementById("work-list");

  if (!container)
      return;

  const selected =
      [
          ...document.querySelectorAll(
              ".work-type-filter:checked"
          )
      ].map(input => input.value);

  let data =
      window.album || [];

  if (selected.length) {

      data =
          data.filter(
              item =>
                  selected.some(
                      type =>
                          typeIncludes(item, type)
                  )
          );
  }

  renderAlbumList(
      getSortedAlbums(data),
      container
  );
}

function bindWorkFilters() {

  document
      .querySelectorAll(".work-type-filter")
      .forEach(
          input => {

              input.onchange =
                  applyWorkFilters;
          }
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

  (window.releasedWorks || [])
      .slice(0, 4)
      .map(
          work =>
              (window.album || [])
                  .find(item => item.title === work.title)
      )
      .filter(Boolean)
      .forEach(
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


/* ==========================================
 企划页
========================================== */

function getProjectAlbums(project) {

  const titles =
      project.albumTitles || [];

  return titles
      .map(
          title =>
              (window.album || [])
                  .find(
                      item =>
                          item.title === title
                  )
      )
      .filter(Boolean);
}

function createProjectSummary(project) {

  const card =
      document.createElement("article");

  card.className =
      "project-summary-card";

  card.innerHTML = `
      <h3>${project.title}</h3>
      <p class="project-en">${project.englishTitle || ""}</p>
      <p class="project-info">${project.info || ""}</p>
  `;

  card.onclick =
      () => {
          location.href =
              `project-detail.html?id=${encodeURIComponent(project.title)}`;
      };

  return card;
}

function renderProjectContent(selectedTitles) {

  const container =
      document.getElementById("project-content");

  if (!container)
      return;

  container.innerHTML =
      "";

  const projects =
      window.projects || [];

  const selectedProjects =
      selectedTitles.length ?
      projects.filter(
          item =>
              selectedTitles.includes(item.title)
      ) :
      projects;

  if (!selectedTitles.length) {

      const grid =
          document.createElement("div");

      grid.className =
          "project-summary-grid";

      selectedProjects.forEach(
          project =>
              grid.appendChild(
                  createProjectSummary(project)
              )
      );

      container.appendChild(grid);
      return;
  }

  selectedProjects.forEach(
      project => {

          const section =
              document.createElement("section");

          section.className =
              "project-detail-block";

          const albums =
              getProjectAlbums(project);

          section.innerHTML = `
              <div class="project-detail-head">
                  <h3>${project.title}</h3>
                  <p class="project-en">${project.englishTitle || ""}</p>
                  <p class="project-info">${project.info || ""}</p>
                  <button class="project-open-btn" type="button">进入企划页</button>
              </div>
              <div class="project-album-list"></div>
          `;

          section
              .querySelector(".project-open-btn")
              .onclick =
              () => {
                  location.href =
                      `project-detail.html?id=${encodeURIComponent(project.title)}`;
              };

          const list =
              section.querySelector(".project-album-list");

          albums.forEach(
              item =>
                  list.appendChild(
                      createProjectAlbumRow(item)
                  )
          );

          container.appendChild(section);
      }
  );
}

function createProjectAlbumRow(item) {

  const row =
      document.createElement("div");

  row.className =
      "project-album-row";

  row.innerHTML = `
      <img src="${getCoverPath(item.cover)}" alt="${item.title || "作品封面"}">
      <div>
          <h4>${item.title || "-"}</h4>
          <p>${item.englishTitle || ""}</p>
          <span>${item.type || ""} · ${item.time || ""}</span>
      </div>
  `;

  row.onclick =
      () => goAlbumDetail(item.title);

  return row;
}

function applyProjectFilters() {

  const selected =
      [
          ...document.querySelectorAll(
              ".project-filter:checked"
          )
      ].map(input => input.value);

  renderProjectContent(selected);
}

function renderProjects() {

  const filter =
      document.getElementById("project-filter");

  if (!filter)
      return;

  filter.innerHTML =
      "";

  (window.projects || []).forEach(
      project => {

          const label =
              document.createElement("label");

          label.className =
              "side-check";

          label.innerHTML = `
              <input type="checkbox" class="project-filter" value="${escapeAttr(project.title)}">
              <span>${project.title}</span>
          `;

          label.ondblclick =
              () => {
                  location.href =
                      `project-detail.html?id=${encodeURIComponent(project.title)}`;
              };

          filter.appendChild(label);
      }
  );

  filter
      .querySelectorAll(".project-filter")
      .forEach(
          input => {

              input.onchange =
                  applyProjectFilters;
          }
      );

  renderProjectContent([]);
}

/* ==========================================
 私人空间
========================================== */

let activeFriendDate =
    "";

function getFriendDate(item) {

  return String(item.time || "")
      .slice(0, 10);
}

function getSortedFriends() {

  return [...(window.friends || [])].sort(
      (a, b) =>
          Date.parse(b.time) -
          Date.parse(a.time)
  );
}

function renderFriends(date = activeFriendDate) {

  activeFriendDate =
      date || "";

  renderFriendCalendar();
  renderFriendFeed();
}

function renderFriendFeed() {

  const feed =
      document.getElementById("friend-feed");

  if (!feed)
      return;

  feed.innerHTML =
      "";

  let data =
      getSortedFriends();

  if (activeFriendDate) {

      data =
          data.filter(
              item =>
                  getFriendDate(item) ===
                  activeFriendDate
          );
  }

  if (!data.length) {

      const empty =
          document.createElement("div");

      empty.className =
          "empty-works";

      empty.innerText =
          "这一天暂无动态";

      feed.appendChild(empty);
      return;
  }

  data.forEach(
      item =>
          feed.appendChild(
              createFriendItem(item)
          )
  );
}

function createFriendItem(item) {

  const article =
      document.createElement("article");

  article.className =
      "friend-item";

  const images =
      (item.images || []).slice(0, 9);

  article.innerHTML = `
      <div class="friend-time">${item.time || ""}</div>
      <h3>${item.title || "-"}</h3>
      <p class="friend-excerpt">${item.content || ""}</p>
      <div class="friend-image-grid ${images.length === 1 ? "single" : ""}"></div>
  `;

  const grid =
      article.querySelector(".friend-image-grid");

  images.forEach(
      src => {

          const img =
              document.createElement("img");

          img.src =
              src || "picture/zhanweifu.png";

          img.alt =
              item.title || "动态图片";

          grid.appendChild(img);
      }
  );

  if (!images.length) {
      grid.remove();
  }

  article.onclick =
      () => openFriendDetail(item);

  return article;
}

function renderFriendCalendar() {

  const calendar =
      document.getElementById("friend-calendar");

  if (!calendar)
      return;

  const dates =
      [...new Set(
          getSortedFriends()
              .map(getFriendDate)
      )];

  calendar.innerHTML = `
      <div class="calendar-head">
          <h3>日历</h3>
          <button class="calendar-clear" type="button">全部</button>
      </div>
      <div class="calendar-date-list"></div>
  `;

  calendar
      .querySelector(".calendar-clear")
      .onclick =
      () => renderFriends("");

  const list =
      calendar.querySelector(".calendar-date-list");

  dates.forEach(
      date => {

          const button =
              document.createElement("button");

          button.type =
              "button";

          button.className =
              date === activeFriendDate ?
              "calendar-date active" :
              "calendar-date";

          button.innerText =
              date;

          button.onclick =
              () => renderFriends(date);

          list.appendChild(button);
      }
  );
}

function openFriendDetail(item) {

  const panel =
      document.getElementById("friend-detail-panel");

  const title =
      document.getElementById("friend-detail-title");

  const body =
      document.getElementById("friend-detail-body");

  if (!panel || !title || !body)
      return;

  title.innerText =
      item.title || "动态";

  const images =
      (item.images || []).slice(0, 9);

  body.innerHTML = `
      <div class="friend-detail-time">${item.time || ""}</div>
      <p>${item.content || ""}</p>
      <div class="friend-detail-images"></div>
  `;

  const imageWrap =
      body.querySelector(".friend-detail-images");

  images.forEach(
      src => {

          const img =
              document.createElement("img");

          img.src =
              src || "picture/zhanweifu.png";

          img.alt =
              item.title || "动态图片";

          imageWrap.appendChild(img);
      }
  );

  if (!images.length) {
      imageWrap.remove();
  }

  panel.classList.add("show");
}

function closeFriendDetail() {

  const panel =
      document.getElementById("friend-detail-panel");

  if (panel) {
      panel.classList.remove("show");
  }
}

/* ==========================================
 首页世界观
========================================== */

function renderWorldview() {

  const container =
      document.getElementById("worldview-list");

  if (!container)
      return;

  container.innerHTML =
      "";

  (window.worldview || []).forEach(
      item => {

          const section =
              document.createElement("section");

          section.className =
              "worldview-item";

          section.innerHTML = `
              <h2 class="worldview-title">关于${item.title || ""}</h2>
              <p class="worldview-en">${item.englishTitle || ""}</p>
              <p class="worldview-desc">${item.desc || ""}</p>
          `;

          container.appendChild(section);
      }
  );
}

/* ==========================================
 文学作品
========================================== */

function renderLiterature() {

  const container =
      document.getElementById("literature-list");

  if (!container)
      return;

  const categories =
      ["诗歌", "散文", "小说"];

  container.innerHTML =
      '<div class="literature-grid"></div>';

  const grid =
      container.querySelector(".literature-grid");

  categories.forEach(category => {

      const column =
          document.createElement("section");

      column.className =
          "literature-column";

      column.innerHTML = `
          <h2>${category}</h2>
          <div class="literature-card-list"></div>
      `;

      const list =
          column.querySelector(".literature-card-list");

      (window.literatureWorks || [])
          .filter(item => item.category === category)
          .forEach(item => {

              const card =
                  document.createElement("article");

              card.className =
                  "literature-card";

              card.innerHTML = `
                  <div class="literature-card-time">${item.time || ""}</div>
                  <h3>${item.title || "-"}</h3>
                  <p>${item.content || ""}</p>
              `;

              list.appendChild(card);
          });

      grid.appendChild(column);
  });
}
