/** Minimal title/image extraction per media type — used to keep media_items current whenever a detail page is viewed. */
function extractBasicInfo(mediaType, data) {
  try {
    switch (mediaType) {
      case 'movie': return { title: data.title, image: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null };
      case 'game': return { title: data.name, image: data.background_image };
      case 'anime': case 'manga': {
        const d = data.data;
        return { title: d.title, image: d.images?.jpg?.image_url };
      }
      case 'show': return { title: data.name, image: data.image?.original || data.image?.medium };
      case 'book': return { title: data.volumeInfo?.title, image: data.volumeInfo?.imageLinks?.thumbnail };
      case 'album': return { title: data.name, image: data.images?.[0]?.url };
      default: return null;
    }
  } catch { return null; }
}
module.exports = extractBasicInfo;