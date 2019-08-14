(function (window) {

  window.muEmojis = window.muEmojis || {};

  window.muEmojis.object = {};

  function compareEmojis(a, b) {
    return a.order < b.order ? -1 : (a.order == b.order ? 0 : 1);
  }

  function fullEmoji(emoji) {
    return {
      name: emoji.n,
      category: emoji.ca,
      sprite_category: emoji.sc,
      order: emoji.o,
      shortname: emoji.s,
      shortname_alternates: emoji.ss,
      diversity: emoji.d,
      diversities: emoji.ds,
      keywords: emoji.k,
      code_points: {
        base: emoji.co
      }
    }
  }

  window.muEmojis.fullEmoji = fullEmoji;
  window.muEmojis.list = Object.values(window.muEmojis.object).map(fullEmoji).sort(compareEmojis);

})(window);
