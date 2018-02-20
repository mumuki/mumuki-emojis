(function (window) {

  window.muEmojis = window.muEmojis || {};

  var searchInterval;
  var emojiTone;

  var $emojiList = $('.mu-emojis-selector');
  var $input = $('<input class="mu-emojis-search" type="text" autocomplete="off" placeholder="' + window.muEmojis.inputPlaceholder + '">');

  function updateEmojiList() {
    $emojiList.empty();

    $input.keyup(filterSearch);

    $emojiList.append($input);

    var $div = $('<div class="mu-emoji-list-area"></div>');

    window.muEmojis.categories.forEach(function (category) {
      var $list = $('<ul class="mu-emoji-list"></ul>');

      category.list.forEach(function (emoji) {
        if (emoji.diversity) return;
        $list.append([
          '<span class="mu-emoji-list-item">',
            emojiIcon(emoji, emoji.sprite_category || emoji.category),
          '</span>'
        ].join(''));
      })

      if (category.list && category.list.length > 0) {
        $div.append('<h4>' + category.caption + '</h4>');
        $div.append($list);
      }

    });

    $emojiList.append($div);
  }

  function generateDiversity(emoji) {
    var original = '<li>' + emojiIcon(emoji, emoji.sprite_category || emoji.category) + '</li>';
    return [original].concat(emoji.diversities.map(function (emojiKey) {
      return '<li>' + emojiIcon(window.muEmojis.object[emojiKey], 'diversity') + '</li>';
    }))
  }

  function toneIndex() {
    return ['1f3fa', '1f3fb', '1f3fc', '1f3fd', '1f3fe', '1f3ff'].indexOf(emojiTone);
  }

  function hasDiversity(emoji) {
    return emoji.diversities.length == 0 || !emojiTone;
  }

  function emojiIcon(emoji, category_name) {
    var category = hasDiversity(emoji) ? category_name : 'diversity';
    emoji = hasDiversity(emoji) ? emoji : window.muEmojis.object[emoji.diversities[toneIndex()]]
    return '<i title="' + emoji.name + '" class="mu-emoji px24 ' + category + ' _' + emoji.code_points.base + '" data-code="' + emoji.shortname + '"/>';
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
