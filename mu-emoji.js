(function (window) {

  window.muEmojis = window.muEmojis || {};

  var searchInterval;

  var $emojiList = $('.mu-emojis-selector');
  var $input = $('<input class="mu-emojis-search" type="text" autocomplete="off" placeholder="' + window.muEmojis.inputPlaceholder + '">');

  function updateEmojiList() {
    $emojiList.empty();

    $input.keyup(filterSearch);

    $emojiList.append($input);

    window.muEmojis.categories.forEach(function (category) {
      var $list = $('<ul class="mu-emoji-list"></ul>');

      category.list.forEach(function (emoji) {
        if (emoji.diversity) return;
        $list.append([
          '<span class="mu-emoji-list-item">',
            emojiIcon(emoji, emoji.sprite_category || emoji.category),
            diversitySelector(emoji),
          '</span>'
        ].join(''));
      })

      if (category.list && category.list.length > 0) {
        $emojiList.append('<h3>' + category.caption + '</h3>');
        $emojiList.append($list);
      }

    });

  }

  function diversitySelector(emoji) {
    return emoji.diversity ? [
      '<span class="mu-emojis-diversity-selector">h',
      '</span>',
    ].join('') : '';
  }

  function emojiIcon(emoji, category_name) {
    return '<i title="' + emoji.name + '" class="mu-emoji px24 ' + category_name + ' _' + emoji.code_points.base + '" data-code="' + emoji.shortname + '"/>';
  }

  function searchQuery (querytext) {
    return !querytext.trim() ? "true" :
      "[emoji.name, emoji.shortname].concat(emoji.shortname_alternates).concat(emoji.keywords).some(function (s) { return s.indexOf('" + querytext + "') >= 0 })";
  }

  function filterSearch() {
    var querytext = $input.val();
    searchInterval && clearTimeout(searchInterval);
    searchInterval = setTimeout(function () {

      window.muEmojis.categories.forEach(function (category) {
        category.list = muEmojis.filterEmojisBy(category, searchQuery(querytext));
      })
      updateEmojiList();
      $input.focus();

    }, 500);
  }

  updateEmojiList();

})(window);
