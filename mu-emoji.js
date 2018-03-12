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

  var MU_EMOJI_DROPDOWN_MENU_ALIGNMENT = MU_EMOJI_DROPDOWN_MENU + '-alignment';
  var MU_EMOJI_DROPDOWN_MENU_ALIGNMENT_LEFT = MU_EMOJI_DROPDOWN_MENU_ALIGNMENT + '-left';
  var MU_EMOJI_DROPDOWN_MENU_ALIGNMENT_RIGHT = MU_EMOJI_DROPDOWN_MENU_ALIGNMENT + '-right';
  var MU_EMOJI_DROPDOWN_MENU_ALIGNMENT_CENTER = MU_EMOJI_DROPDOWN_MENU_ALIGNMENT + '-center';

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
  var searchInterval;

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
    return $('<div class="' + MU_EMOJI_DROPDOWN_MENU + ' ' + alignmentClass($dd) + '"></div>');
  }

  function alignmentClass($dd) {
    switch ($dd.data('dropdown-alignment')) {
      case 'right': return MU_EMOJI_DROPDOWN_MENU_ALIGNMENT_RIGHT;
      case 'center': return MU_EMOJI_DROPDOWN_MENU_ALIGNMENT_CENTER;
      default: return MU_EMOJI_DROPDOWN_MENU_ALIGNMENT_LEFT;
    }
  }

  function generateTabs($ddm) {
    var $ddmt = $('<ul class="' + MU_EMOJI_DROPDOWN_MENU_TABS + '"></ul>');
    window.muEmojis.categories.forEach(function (category, index) {
      $ddmt.append(generateTabFor($ddm, category, index));
    });
    return $ddmt;
  }

  function generateTabFor($ddm, category, index) {
    var $tabCategory = $([
      '<li class="' + MU_EMOJI_DROPDOWN_MENU_CATEGORY + (index === 0 ? ' active' : ''), '" title="' + category.caption + '">',
      '  <i class="' + category.icon_class + '"></i>',
      '</li>'
    ].join(''));
    $tabCategory.click(function (e) {
      var $ddmt = $ddm.find($class(MU_EMOJI_DROPDOWN_MENU_TABS));
      var $category = $ddm.find($class(categoryClass(window.muEmojis.categories[index])));
      var $emojis = $ddm.find($class(MU_EMOJI_DROPDOWN_MENU_EMOJIS));
      $ddmt.children().removeClass(ACTIVE_CLASS);
      $tabCategory.addClass(ACTIVE_CLASS);
      scrollToAnchor($emojis, $category, $emojis.children().first());
    })
    return $tabCategory;
  }

  function generateSearch($ddm) {
    return $([
      '<div class="'+ MU_EMOJI_DROPDOWN_MENU_SEARCH +'">',
      '  <input class="'+ MU_EMOJI_DROPDOWN_MENU_SEARCH_INPUT +'" placeholder="' + window.searchEmojiPlaceholder + '">',
      '  <i class="'+ MU_EMOJI_DROPDOWN_MENU_SEARCH_ICON +' fa fa-fw fa-search"></i>',
      '</div>',
    ].join(''));
  }

  function generateEmojiList($ddm, $dd) {
    $ddm.find($class(MU_EMOJI_DROPDOWN_MENU_EMOJIS)).detach();
    var $emojis = $('<ul class="'+ MU_EMOJI_DROPDOWN_MENU_EMOJIS +'"></ul>');
    populateEmojiList($ddm, $emojis, $dd);
    return $emojis;
  }

  function populateEmojiList($ddm, $emojis, $dd) {
    window.muEmojis.categories.forEach(function (category) {
      $emojis.append(generateCategoryList($ddm, $emojis, category, $dd));
    });
  }

  function generateCategoryList($ddm, $emojis, category, $dd) {
    var $category = $('<li class="' + MU_EMOJI_DROPDOWN_MENU_EMOJIS_CATEGORIES + ' ' + categoryClass(category) + '"></li>');
    if (category.list.length > 0) {
      var $categoryItem = $('<ul class="' + MU_EMOJI_DROPDOWN_MENU_EMOJIS_CATEGORY + '"></ul>');
      $category.append('<h4>' + category.caption + '</h4>');
      $category.append($categoryItem);
      populateCategory($ddm, $emojis, $categoryItem, category, $dd);
    }
    return $category;
  }

  function populateCategory($ddm, $emojis, $categoryItem, category, $dd) {
    category.list.forEach(function (emoji) {
      if (emoji.diversity) return;
      var category = hasDiversity(emoji) ? (emoji.sprite_category || emoji.category) : 'diversity';
      emoji = hasDiversity(emoji) ? emoji : window.muEmojis.object[emoji.diversities[toneIndex()]]
      var $emoji = $([
        '<li class="' + MU_EMOJI_DROPDOWN_MENU_EMOJI + '">',
        '  <i title="' + emoji.name + '" class="mu-emoji px24 ' + category + ' _' + emoji.code_points.base + '" data-code="' + emoji.shortname + '"/>',
        '</li>'
      ].join(''));
      $emoji.click(function () {
        hideAllDropdownMenues();
        eval($dd.data('on-emoji-click'))(emoji);
      });
      $categoryItem.append($emoji);
    });
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

  function populateDropdownMenu($ddm, $dd) {
    $ddm.append(generateTabs($ddm));
    $ddm.append(generateSearch($ddm));
    $ddm.append(generateEmojiList($ddm, $dd));
  }

  function scrollToAnchor($parent, $element, $firstElement) {
    var scrollTop = $element.position().top - $firstElement.position().top;
    $parent.scrollTop(scrollTop);
  }

  function searchQuery (querytext) {
    return function (emoji) {
      return !querytext.trim() ? true :
        [emoji.name, emoji.shortname].concat(emoji.shortname_alternates).concat(emoji.keywords).some(function (s) {
          return s.toLowerCase().indexOf(querytext.toLowerCase()) >= 0;
        });
    }
  }

  function filterSearch($ddm, $input, $dd) {
    var querytext = $input.val();
    console.log(querytext);
    searchInterval && clearTimeout(searchInterval);
    searchInterval = setTimeout(function () {

      window.muEmojis.categories.forEach(function (category) {
        category.list = muEmojis.filterEmojisBy(category, searchQuery(querytext));
      })
      $ddm.append(generateEmojiList($ddm, $dd));
      $input.focus();

    }, 500);
  }

  function addEventsListeners($dd) {
    var $ddt = $dd.find($class(MU_EMOJI_DROPDOWN_TOGGLE));
    var $ddm = $dd.find($class(MU_EMOJI_DROPDOWN_MENU));
    var $ddmc = $dd.find($class(MU_EMOJI_DROPDOWN_MENU_CATEGORY));
    var $ddmes = $dd.find($class(MU_EMOJI_DROPDOWN_MENU_EMOJIS));
    var $ddminput = $dd.find($class(MU_EMOJI_DROPDOWN_MENU_SEARCH_INPUT));

    $ddt.click(function (e) {
      var isClosed = !$ddm.hasClass(OPEN_CLASS);
      hideAllDropdownMenues();
      if (isClosed) {
        $ddm.addClass(OPEN_CLASS);
        $ddm.find($class(MU_EMOJI_DROPDOWN_MENU_SEARCH_INPUT)).focus();
        e.stopPropagation();
      }
    });

    $(document).keydown(function (e) {
      if (e.keyCode === ESCAPE_KEY) hideAllDropdownMenues();
    });

    $(document).click(function (e) {
      var clazz = $class(MU_EMOJI_DROPDOWN_MENU);
      if (!$(e.target).is(clazz + ', ' + clazz + ' *')) hideAllDropdownMenues();
    });

    $ddminput.on('keyup', function () {
      filterSearch($ddm, $ddminput, $dd);
    })

  }

  $.fn.renderEmojis = function () {
    var self = this;
    self.each(function (i) {
      var $dd = $(self[i]);
      var $ddt = generateDropdownToggle($dd);
      var $ddm = generateDropdownMenu($dd);
      $dd.append($ddt);
      populateDropdownMenu($ddm, $dd);
      $dd.append($ddm);
      addEventsListeners($dd);
    });
    return self;
  }

  $($class(MU_EMOJI_DROPDOWN)).renderEmojis();

});