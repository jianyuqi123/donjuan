const releasedWorks = [
  {
    title: "出加沙记",
    accent: "red"
  },
  {
    title: "一个陌生女人的来信",
    accent: "gold"
  },
  {
    title: "2号线|绿日长夏",
    accent: "green"
  }
];

window.releasedWorks = releasedWorks;

function getReleasedWork(title) {
  return (window.releasedWorks || [])
      .find(item => item.title === title);
}

function isReleasedTitle(title) {
  return Boolean(
      getReleasedWork(title)
  );
}

function getReleasedSongTitles() {
  const albums =
      window.album || [];

  const titles =
      new Set();

  (window.releasedWorks || [])
      .forEach(item => {
          const album =
              albums.find(work => work.title === item.title);

          if (!album)
              return;

          if (
              Array.isArray(album.discs) &&
              album.discs.length
          ) {
              album.discs.forEach(disc => {
                  (disc.songs || [])
                      .forEach(songTitle => titles.add(songTitle));
              });
          }

          (album.songs || [])
              .forEach(songTitle => titles.add(songTitle));
      });

  return [...titles];
}

function getSongReleaseInfo(title) {
  const releasedSongTitles =
      getReleasedSongTitles();

  if (!releasedSongTitles.includes(title))
      return null;

  const albums =
      window.album || [];

  const work =
      (window.releasedWorks || [])
          .find(item => {
              const album =
                  albums.find(albumItem => albumItem.title === item.title);

              if (!album)
                  return false;

              const songs =
                  [
                      ...(album.songs || []),
                      ...(album.discs || [])
                          .flatMap(disc => disc.songs || [])
                  ];

              return songs.includes(title);
          });

  return work || {
      title,
      accent: "green"
  };
}
