var mumuki = {
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

  var ESCAPE_KEY = 27;

  var OPEN_CLASS = 'open';
  var ACTIVE_CLASS = 'active';

  var emojiTone;

  function $class(clazz) { return '.' + clazz }
  function categoryClass(category) { return MU_EMOJI_DROPDOWN_MENU + '-category-' + category.name }

  function generateDropdownToggle($dd) {
    var iconClass = $dd.data('icon-class') || 'fa fa-fw fa-smile-o';
    var $ddt = $([
      '<a class="' + MU_EMOJI_DROPDOWN_TOGGLE + '">',
      '  <i class="' + iconClass + '"></i>',
      '</a>',
    ].join(''));
    return $ddt;
  }

  function generateDropdownMenu($dd) {
    return $('<div class="' + MU_EMOJI_DROPDOWN_MENU + '"></div>');
  }

  function generateTabs($ddm) {
    var $ddmt = $('<ul class="' + MU_EMOJI_DROPDOWN_MENU_TABS + '"></ul>');
    window.muEmojis.categories.forEach(function (category, index) {
      $ddmt.append(generateTabFor(category, index));
    });
    return $ddmt;
  }

  function generateTabFor(category, index) {
    return $([
      '<li class="' + MU_EMOJI_DROPDOWN_MENU_CATEGORY + (index === 0 ? ' active' : ''), '" title="' + category.caption + '">',
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
    var $category = $('<li class="' + MU_EMOJI_DROPDOWN_MENU_EMOJIS_CATEGORIES + ' ' + categoryClass(category) + '"></li>');
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

  function hideAllDropdownMenues() {
    $($class(MU_EMOJI_DROPDOWN_MENU)).removeClass(OPEN_CLASS);
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
      addEventsListeners($dd);
    });
    return self;
  }

  function scrollToAnchor($parent, $element, $firstElement) {
    var scrollTop = $element.position().top - $firstElement.position().top;
    $parent.scrollTop(scrollTop);
  }

  function addEventsListeners($dd) {
    var $ddt = $dd.find($class(MU_EMOJI_DROPDOWN_TOGGLE));
    var $ddm = $dd.find($class(MU_EMOJI_DROPDOWN_MENU));
    var $ddmc = $dd.find($class(MU_EMOJI_DROPDOWN_MENU_CATEGORY));
    var $ddmes = $dd.find($class(MU_EMOJI_DROPDOWN_MENU_EMOJIS));

    $ddt.click(function (e) {
      var isClosed = !$ddm.hasClass(OPEN_CLASS);
      hideAllDropdownMenues();
      if (isClosed) {
        $ddm.addClass(OPEN_CLASS);
        e.stopPropagation();
      }
    });

    $ddmc.each(function (index) {
      $($ddmc[index]).click(function (e) {
        var $target = $($ddmc[index]);
        var $category = $ddm.find($class(categoryClass(window.muEmojis.categories[index])));
        $ddmc.removeClass(ACTIVE_CLASS);
        $target.addClass(ACTIVE_CLASS);
        scrollToAnchor($ddmes, $category, $ddmes.children().first());
      });
    });

    $(document).keydown(function (e) {
      if (e.keyCode === ESCAPE_KEY) hideAllDropdownMenues();
    });

    $(document).click(function (e) {
      var clazz = $class(MU_EMOJI_DROPDOWN_MENU);
      if (!$(e.target).is(clazz + ', ' + clazz + ' *')) hideAllDropdownMenues();
    });

  }

  $($class(MU_EMOJI_DROPDOWN)).renderEmojis();

});