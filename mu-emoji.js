(function (window) {

  window.muEmojis = window.muEmojis || {};

  var searchInterval;
  var emojiTone;

  var $emojis = $('.mu-emojis-dropdown');

  $emojis.each(function (dropdownIndex) {

    var $emojiDropdown = $($emojis[dropdownIndex]);

    var $emojiTrigger = $emojiDropdown.find('.mu-emojis-trigger');
    var $emojiList = $emojiDropdown.find('.mu-emojis-selector');
    var $input = $('<input class="mu-emojis-search" type="text" autocomplete="off" placeholder="' + window.muEmojis.inputPlaceholder + '">');

    var onEmojiClick = $emojiTrigger.data('on-emoji-click');
    $emojiTrigger.click(function (e) {
      var $emojisList = $('.mu-emojis-selector');
      var isOpen = $emojiList.hasClass('open');
      $emojisList.removeClass('open');
      if (!isOpen) {
        $emojiList.addClass('open');
        $emojiList.find('input').focus();
        e.stopPropagation();
      }
    })

    function updateEmojiList() {
      $emojiList.empty();

      $input.keyup(filterSearch);

      var $div = $('<div class="mu-emoji-list-area"></div>');

      tabs($emojiList, $div);
      $emojiList.append($input);
      $emojiList.append('<div class="emoji-one-legend">' + window.emojiOneLegend + ' <a href="https://www.emojione.com" target="_blank">EmojiOne</a></div>');

      window.muEmojis.categories.forEach(function (category) {
        var $list = $('<ul class="mu-emoji-list"></ul>');

        category.list.forEach(function (emoji) {
          if (emoji.diversity) return;
          var $emoji = $([
            '<span class="mu-emoji-list-item">',
              emojiIcon(emoji, emoji.sprite_category || emoji.category),
            '</span>'
          ].join(''));
          $emoji.click(function () {
            eval(onEmojiClick)(emoji);
            $emojiList.removeClass('open');
          })
          $list.append($emoji);
        })

        if (category.list && category.list.length > 0) {
          $div.append('<h4 id="' + categoryId(category) + '">' + category.caption + '</h4>');
          $div.append($list);
        }

      });

      $emojiList.append($div);

    }

    function categoryId(category) {
      return 'category-' + category.name + '-' + dropdownIndex;
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
      return function (emoji) {
        return !querytext.trim() ? true :
          [emoji.name, emoji.shortname].concat(emoji.shortname_alternates).concat(emoji.keywords).some(function (s) {
            return s.toLowerCase().indexOf(querytext.toLowerCase()) >= 0;
          }
        );
      }
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
          $emojiList.find('input').focus();
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
      $div.scrollTop(scrollTop);
    }

    updateEmojiList();

  });

  $(document).keydown(function (e) {
    if (e.key === "Escape") $('.mu-emojis-selector').removeClass('open');
  });

  $(document).click(function (e) {
    if (!$(e.target).is('.mu-emojis-selector, .mu-emojis-selector *')) {
      $('.mu-emojis-selector').removeClass('open');
    }
  });

})(window);


mumuki = {
  load: function (callback) {
    return callback();
  }
}

mumuki.load(function () {

  var MU_EMOJI_DROPDOWN = 'mu-emoji-dropdown';
  var MU_EMOJI_DROPDOWN_TOGGLE = MU_EMOJI_DROPDOWN + '-toggle';
  var MU_EMOJI_DROPDOWN_MENU = MU_EMOJI_DROPDOWN + '-menu';
  var MU_EMOJI_DROPDOWN_MENU_TABS = MU_EMOJI_DROPDOWN_MENU + '-tabs';
  var MU_EMOJI_DROPDOWN_MENU_CATEGORY = MU_EMOJI_DROPDOWN_MENU_TABS + '-item';
  var MU_EMOJI_DROPDOWN_MENU_SEARCH = MU_EMOJI_DROPDOWN_MENU + '-search';
  var MU_EMOJI_DROPDOWN_MENU_SEARCH_INPUT = MU_EMOJI_DROPDOWN_MENU_SEARCH + '-input';
  var MU_EMOJI_DROPDOWN_MENU_SEARCH_ICON = MU_EMOJI_DROPDOWN_MENU_SEARCH + '-icon';
  var MU_EMOJI_DROPDOWN_MENU_EMOJIS = MU_EMOJI_DROPDOWN_MENU + '-emojis';
  var MU_EMOJI_DROPDOWN_MENU_EMOJIS_CATEGORIES = MU_EMOJI_DROPDOWN_MENU_EMOJIS + '-categories';
  var MU_EMOJI_DROPDOWN_MENU_EMOJIS_CATEGORY = MU_EMOJI_DROPDOWN_MENU_EMOJIS_CATEGORIES + '-item';
  var MU_EMOJI_DROPDOWN_MENU_EMOJI = MU_EMOJI_DROPDOWN_MENU_EMOJIS + '-item';

  var emojiTone;

  function $id(id) { return '#' + id }
  function $class(clazz) { return '.' + clazz }
  function categoryClass(category) { return MU_EMOJI_DROPDOWN_MENU + '-category-' + category.name }

  function generateDropdownToggle($dd) {
    var iconClass = $dd.data('icon-class') || 'fa fa-fw fa-smile-o';
    return $([
      '<a class="' + MU_EMOJI_DROPDOWN_TOGGLE + '">',
      '  <i class="' + iconClass + '"></i>',
      '</a>',
    ].join(''));
  }

  function generateDropdownMenu($dd) {
    return $('<div class="' + MU_EMOJI_DROPDOWN_MENU + '"></div>');
  }

  function generateTabs($ddm) {
    var $ddmt = $('<ul class="' + MU_EMOJI_DROPDOWN_MENU_TABS + '"></ul>');
    window.muEmojis.categories.forEach(function (category, i) {
      $ddmt.append(generateTabFor(category, i === 0));
    });
    return $ddmt;
  }

  function generateTabFor(category, isFirstCategory) {
    return $([
      '<li class="' + MU_EMOJI_DROPDOWN_MENU_CATEGORY + (isFirstCategory ? ' active' : ''), '" title="' + category.caption + '">',
      '  <i class="' + category.icon_class + '"></i>',
      '</li>'
    ].join(''));
  }

  function generateSearch($ddm) {
    return $([
      '<div class="'+ MU_EMOJI_DROPDOWN_MENU_SEARCH +'">',
      '  <input class="'+ MU_EMOJI_DROPDOWN_MENU_SEARCH_INPUT +'" placeholder="' + window.searchEmojiPlaceholder + '">',
      '  <i class="'+ MU_EMOJI_DROPDOWN_MENU_SEARCH_ICON +' fa fa-fw fa-search"></i>',
      '</div>',
    ].join(''));
  }

  function generateEmojiList($ddm) {
    var $emojis = $('<ul class="'+ MU_EMOJI_DROPDOWN_MENU_EMOJIS +'"></ul>');
    populateEmojiList($ddm, $emojis);
    return $emojis;
  }

  function populateEmojiList($ddm, $emojis) {
    window.muEmojis.categories.forEach(function (category) {
      $emojis.append(generateCategoryList($ddm, $emojis, category));
    });
  }

  function generateCategoryList($ddm, $emojis, category) {
    var $category = $('<li class="' + MU_EMOJI_DROPDOWN_MENU_EMOJIS_CATEGORIES + '"></li>');
    var $categoryItem = $('<ul class="' + MU_EMOJI_DROPDOWN_MENU_EMOJIS_CATEGORY + '"></ul>');
    $category.append('<h4>' + category.caption + '</h4>');
    $category.append($categoryItem);
    populateCategory($ddm, $emojis, $categoryItem, category);
    return $category;
  }

  function populateCategory($ddm, $emojis, $categoryItem, category) {
    category.list.forEach(function (emoji) {
      if (emoji.diversity) return;
      var $emoji = $([
        '<li class="' + MU_EMOJI_DROPDOWN_MENU_EMOJI + '">',
          emojiIcon(emoji, emoji.sprite_category || emoji.category),
        '</li>'
      ].join(''));
      $categoryItem.append($emoji);
    });
  }

  function emojiIcon(emoji, category_name) {
    var category = hasDiversity(emoji) ? category_name : 'diversity';
    emoji = hasDiversity(emoji) ? emoji : window.muEmojis.object[emoji.diversities[toneIndex()]]
    return '<i title="' + emoji.name + '" class="mu-emoji px24 ' + category + ' _' + emoji.code_points.base + '" data-code="' + emoji.shortname + '"/>';
  }

  function toneIndex() {
    return ['1f3fb', '1f3fc', '1f3fd', '1f3fe', '1f3ff'].indexOf(emojiTone);
  }

  function hasDiversity(emoji) {
    return emoji.diversities.length == 0 || !emojiTone;
  }

  function populateDropdownMenu($ddm) {
    $ddm.append(generateTabs($ddm));
    $ddm.append(generateSearch($ddm));
    $ddm.append(generateEmojiList($ddm));
  }

  $.fn.renderEmojis = function () {
    var self = this;
    self.each(function (i) {
      var $dd = $(self[i]);
      var $ddt = generateDropdownToggle($dd);
      var $ddm = generateDropdownMenu($dd);
      $dd.append($ddt);
      populateDropdownMenu($ddm);
      $dd.append($ddm);
    });
    return self;
  }

  $('.mu-emoji-dropdown').renderEmojis();

});