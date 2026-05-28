const otherSongs = [
  { id: "x", title: "海与雨", englishTitle: "La Mer et la pluie", duration: "3:42", audio: "music/海与雨.mp3" },
  { id: "x", title: "惊鸿一瞥", englishTitle: "Un coup d'oeil", duration: "4:08", audio: "music/惊鸿一瞥.mp3" },
  { id: "x", title: "环绕地球的小桌", englishTitle: "Petites tables autour de la terre", duration: "3:35", audio: "music/环绕地球的小桌.mp3" },
  { id: "x", title: "霜花披肩与墨西哥湾暖流", englishTitle: "Le Châle à fleurs givre", duration: "5:12", audio: "music/霜花披肩与墨西哥湾暖流.mp3" },
  { id: "x", title: "地震", englishTitle: "Le Tremblement de terre", duration: "3:18", audio: "music/地震.mp3" },
  { id: "x", title: "潘帕斯草原", englishTitle: "Les Pampas", duration: "4:26", audio: "music/潘帕斯草原.mp3" },
  { id: "x", title: "他将在远方坠落", englishTitle: "Il tombera loin d'ici", duration: "4:44", audio: "music/他将在远方坠落.mp3" },
  { id: "x", title: "虚位", englishTitle: "Les Fausses positions", duration: "2:58", audio: "music/虚位.mp3" },
  { id: "x", title: "心声", englishTitle: "Les Confidences", duration: "3:51", audio: "music/心声.mp3" },
  { id: "x", title: "她保守着秘密", englishTitle: "Elle garde son secret", duration: "4:05", audio: "music/她保守着秘密.mp3" },
  { id: "x", title: "鞭痕或熔岩丝", englishTitle: "Coups de fouet ou ficelles de lave", duration: "3:47", audio: "music/鞭痕或熔岩丝.mp3" },
  { id: "x", title: "荣誉之地、洪水与地震植物", englishTitle: "Les Champs d'honneur, les inondations, les plantes sismiques", duration: "5:33", audio: "music/荣誉之地、洪水与地震植物.mp3" },
  { id: "x", title: "稻草人", englishTitle: "Les Épouvantails", duration: "3:29", audio: "music/稻草人.mp3" },
  { id: "x", title: "起飞的栗树", englishTitle: "Le Start du châtaignier", duration: "4:19", audio: "music/起飞的栗树.mp3" },
  { id: "x", title: "伤痕", englishTitle: "Le Start du châtaignier", duration: "3:56", audio: "music/伤痕.mp3" },
  { id: "x", title: "温顺的椴树", englishTitle: "Le Tilleul est docile", duration: "4:11", audio: "music/温顺的椴树.mp3" },
  { id: "x", title: "迷人的柏树", englishTitle: "Le Fascinant cyprès", duration: "3:40", audio: "music/迷人的柏树.mp3" },
  { id: "x", title: "叶片的习性", englishTitle: "Les Moeurs des feuilles", duration: "4:02", audio: "music/叶片的习性.mp3" },
  { id: "x", title: "偶像", englishTitle: "L'Idole", duration: "3:24", audio: "music/偶像.mp3" },
  { id: "x", title: "凯撒的调色板", englishTitle: "La Palette de César", duration: "4:37", audio: "music/凯撒的调色板.mp3" },
  { id: "x", title: "刮墙", englishTitle: "Rasant les murs", duration: "2:49", audio: "music/刮墙.mp3" },
  { id: "x", title: "踏入诸大陆", englishTitle: "Entre dans les continents", duration: "4:22", audio: "music/踏入诸大陆.mp3" },
  { id: "x", title: "接种疫苗的面包", englishTitle: "Le Pain vacciné", duration: "3:33", audio: "music/接种疫苗的面包.mp3" },
  { id: "x", title: "少年闪电", englishTitle: "Les Éclairs au-dessous de quatorze ans", duration: "3:59", audio: "music/少年闪电.mp3" },
  { id: "x", title: "钻石婚约", englishTitle: "Les Diamants conjugaux", duration: "4:46", audio: "music/钻石婚约.mp3" },
  { id: "x", title: "时钟的起源", englishTitle: "L'Origine de la pendule", duration: "4:14", audio: "music/时钟的起源.mp3" },
  { id: "x", title: "狮身人面像的马厩", englishTitle: "Dans l'écurie du sphinx", duration: "5:01", audio: "music/狮身人面像的马厩.mp3" },
  { id: "x", title: "死亡的盛宴", englishTitle: "Le Repas du mort", duration: "4:52", audio: "music/死亡的盛宴.mp3" },
  { id: "x", title: "光轮", englishTitle: "La Roue de la lumière", duration: "3:31", audio: "music/光轮.mp3" },
  { id: "x", title: "逃亡者", englishTitle: "L'Évadé", duration: "4:06", audio: "music/逃亡者.mp3" },
  { id: "x", title: "太阳货币体系", englishTitle: "Système de monnaie solaire", duration: "5:18", audio: "music/太阳货币体系.mp3" },
  { id: "x", title: "忘却一切", englishTitle: "A tout oublier", duration: "3:45", audio: "music/忘却一切.mp3" },
  { id: "x", title: "种马与风的新娘", englishTitle: "L'Étalon et la fiancée du vent", duration: "4:28", audio: "music/种马与风的新娘.mp3" },
  { id: "x", title: "夏娃，被独留于此", englishTitle: "Éve la seule qui nous reste", duration: "5:06", audio: "music/夏娃，被独留于此.mp3" },
  { id: "x", title: "诗｜我听说你在流浪", englishTitle: "Poem | I Heard You Were Wandering", duration: "3:38", audio: "music/诗｜我听说你在流浪.mp3" },
  { id: "x", title: "乐｜我向着最亮的音符游去", englishTitle: "Music | I Swim Toward the Brightest Note", duration: "4:16", audio: "music/乐｜我向着最亮的音符游去.mp3" },
  { id: "x", title: "诗｜永别了2020", englishTitle: "Poem | Farewell 2020", duration: "3:20", audio: "music/诗｜永别了2020.mp3" },
  { id: "x", title: "如期归来", englishTitle: "Return as Promised", duration: "4:01", audio: "music/如期归来.mp3" },
  { id: "x", title: "请回答1998", englishTitle: "Reply 1998", duration: "3:57", audio: "music/请回答1998.mp3" },
  { id: "x", title: "四月", englishTitle: "April", duration: "3:36", audio: "music/四月.mp3" },
  { id: "x", title: "夏", englishTitle: "Summer", duration: "3:54", audio: "music/夏.mp3" },
  { id: "x", title: "秋", englishTitle: "Autumn", duration: "3:41", audio: "music/秋.mp3" },
  { id: "x", title: "冬", englishTitle: "Winter", duration: "4:09", audio: "music/冬.mp3" },
  { id: "x", title: "青铜水影", englishTitle: "Bronze Water Shadow", duration: "3:52", audio: "music/青铜水影.mp3" },
  { id: "x", title: "神眷之樱花", englishTitle: "Cherry Blossoms of Divine Favor", duration: "4:23", audio: "music/神眷之樱花.mp3" },
  { id: "x", title: "永燃的瞳术师", englishTitle: "The Ever-Burning Eye Mage", duration: "4:35", audio: "music/永燃的瞳术师.mp3" },
  { id: "x", title: "跋扈的贵公子", englishTitle: "The Arrogant Young Lord", duration: "3:49", audio: "music/跋扈的贵公子.mp3" },
  { id: "x", title: "剑桥折刀", englishTitle: "Cambridge Folding Knife", duration: "4:12", audio: "music/剑桥折刀.mp3" },
  { id: "x", title: "末代影皇", englishTitle: "The Last Shadow Emperor", duration: "4:47", audio: "music/末代影皇.mp3" },
  { id: "x", title: "炎之龙斩者", englishTitle: "Flame Dragon Slayer", duration: "5:04", audio: "music/炎之龙斩者.mp3" },
  { id: "x", title: "诺诺", englishTitle: "Nono", duration: "3:34", audio: "music/诺诺.mp3" },
  { id: "x", title: "小怪兽", englishTitle: "Little Monster", duration: "3:58", audio: "music/小怪兽.mp3" },
  { id: "x", title: "生如夏花，开到荼靡", englishTitle: "Born Like Summer Flowers, Blooming to the End", duration: "4:51", audio: "music/生如夏花，开到荼靡.mp3" },
  { id: "x", title: "幽灵公主", englishTitle: "Ghost Princess", duration: "4:18", audio: "music/幽灵公主.mp3" },
  { id: "x", title: "那些消失在风里的女孩", englishTitle: "Girls Lost in the Wind", duration: "4:39", audio: "music/那些消失在风里的女孩.mp3" }
];

otherSongs.forEach(
  song => {
    if (!("release" in song)) song.release = "";
    if (!("style" in song)) song.style = "";
    if (!("year" in song)) song.year = "";
    if (!("age" in song)) song.age = "";
    if (!("note" in song)) song.note = "";
    if (!("cover" in song)) song.cover = "占位符";
  }
);

window.otherSongs = otherSongs;

