/** Minimal title/image extraction per media type — used to keep media_items current whenever a detail page is viewed. */
function extractBasicInfo(mediaType, data) {
  const safe = (fn, fallback = null) => { try { return fn(); } catch { return fallback; } };

  switch (mediaType) {
    case 'movie':
      return {
        title: safe(() => data.title),
        image: safe(() => data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null),
      };
    case 'game':
      return { title: safe(() => data.name), image: safe(() => data.background_image) };
    case 'anime': case 'manga':
      return {
        title: safe(() => data.data.title),
        image: safe(() => data.data.images?.jpg?.image_url),
      };
    case 'show':
      return { title: safe(() => data.name), image: safe(() => data.image?.original || data.image?.medium) };
    case 'book':
      return { title: safe(() => data.volumeInfo?.title), image: safe(() => data.volumeInfo?.imageLinks?.thumbnail) };
    case 'album':
      return { title: safe(() => data.name), image: safe(() => data.images?.[0]?.url) };
    default:
      return { title: null, image: null };
  }
}
module.exports = extractBasicInfo;