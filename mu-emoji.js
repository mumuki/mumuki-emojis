(function (window) {

  window.muEmojis = window.muEmojis || {};

  var searchInterval;
  var emojiTone;

  var $emojiList = $('.mu-emojis-selector');
  var $input = $('<input class="mu-emojis-search" type="text" autocomplete="off" placeholder="' + window.muEmojis.inputPlaceholder + '">');

  function updateEmojiList() {
    $emojiList.empty();

    $input.keyup(filterSearch);

    var $div = $('<div class="mu-emoji-list-area"></div>');

    tabs($emojiList, $div);
    $emojiList.append($input);

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
        $div.append('<h4 id="' + categoryId(category) + '">' + category.caption + '</h4>');
        $div.append($list);
      }

    });

    $emojiList.append($div);

  }

  function categoryId(category) {
    return 'category-' + category.name;
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

  function tabs($emojiList, $div) {
    var categories = window.muEmojis.categories;
    var maxWidth = $emojiList.width() / categories.length;
    var firstId = categoryId(categories[0]);
    var $tabs = $('<div class="mu-emojis-tabs"></div>')
    categories.forEach(function (category, i) {
      console.log(category, i);
      var id = categoryId(category);
      var $tab = $([
        '<a class="category-icon ', i === 0 ? 'active' : '', '" title="' + category.caption + '">',
        '  <i class="' + category.icon_class + '"></i>',
        '</a>'
      ].join(''));
      $tab.click(function () {
        $tab.parent().find('.category-icon').removeClass('active');
        scrollToAnchor($div, id, firstId);
        $tab.addClass('active');
      });
      $tab.width(maxWidth);
      $tabs.append($tab);
      $emojiList.append($tabs);
    });
  }

  function scrollToAnchor($div, id, firstId) {
    var $tag = $('#' + id);
    var $firstTag = $('#' + firstId);
    var scrollTop = $tag.position().top - $firstTag.position().top;
    $div.animate({ scrollTop: scrollTop }, 'fast');
  }

  updateEmojiList();

})(window);
