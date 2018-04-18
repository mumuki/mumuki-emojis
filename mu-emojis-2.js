var mumuki = {
  load: function (callback) {
    return callback();
  }
}

mumuki.load(function () {

  var ESCAPE_KEY = 27;

  var OPEN_CLASS = 'open';
  var ACTIVE_CLASS = 'active';

  var TONE_0 = '1f3fa';
  var TONE_1 = '1f3fb';
  var TONE_2 = '1f3fc';
  var TONE_3 = '1f3fd';
  var TONE_4 = '1f3fe';
  var TONE_5 = '1f3ff';

  var TONES = [TONE_1, TONE_2, TONE_3, TONE_4, TONE_5];

  function noop() {}
  function id(x) { return x }
  function $class(clazz) { return '.' + clazz }

  function $$(array) {
    return $(array.join('\n'));
  }

  MuEmoji.DROPDOWN = 'mu-emoji-dropdown';

  MuEmoji.DROPDOWN_MENU = MuEmoji.DROPDOWN + '-menu';

  MuEmoji.DROPDOWN_TOGGLE = MuEmoji.DROPDOWN + '-toggle';

  MuEmoji.DROPDOWN_MENU_ALIGNMENT = MuEmoji.DROPDOWN_MENU + '-alignment';
  MuEmoji.DROPDOWN_MENU_ALIGNMENT_LEFT = MuEmoji.DROPDOWN_MENU_ALIGNMENT + '-left';
  MuEmoji.DROPDOWN_MENU_ALIGNMENT_RIGHT = MuEmoji.DROPDOWN_MENU_ALIGNMENT + '-right';
  MuEmoji.DROPDOWN_MENU_ALIGNMENT_CENTER = MuEmoji.DROPDOWN_MENU_ALIGNMENT + '-center';

  MuEmoji.DROPDOWN_MENU_TABS = MuEmoji.DROPDOWN_MENU + '-tabs';
  MuEmoji.DROPDOWN_MENU_TAB = MuEmoji.DROPDOWN_MENU_TABS + '-item';

  MuEmoji.DROPDOWN_MENU_SEARCH = MuEmoji.DROPDOWN_MENU + '-search';
  MuEmoji.DROPDOWN_MENU_SEARCH_ICON = MuEmoji.DROPDOWN_MENU_SEARCH + '-icon';
  MuEmoji.DROPDOWN_MENU_SEARCH_INPUT = MuEmoji.DROPDOWN_MENU_SEARCH + '-input';

  MuEmoji.DROPDOWN_MENU_EMOJIS = MuEmoji.DROPDOWN_MENU + '-emojis';
  MuEmoji.DROPDOWN_MENU_EMOJIS_CATEGORIES = MuEmoji.DROPDOWN_MENU_EMOJIS + '-categories';
  MuEmoji.DROPDOWN_MENU_EMOJIS_CATEGORY = MuEmoji.DROPDOWN_MENU_EMOJIS_CATEGORIES + '-item';

  MuEmoji.DROPDOWN_MENU_EMOJI = MuEmoji.DROPDOWN_MENU_EMOJIS + '-item';

  function MuEmoji($element, index) {
    this.$element = $element;
    this.index = index;
    this.emojiTone = TONE_0;
    this.searchTimeout = setTimeout(noop);
  }

  MuEmoji.prototype = {

    create: function () {
      this.$element.empty();
      this.createDropdownToggle();
      this.createDropdownMenu();
    },

    createDropdownToggle: function () {
      this.toggle = new MuEmojiDropdownToggle(this);
      this.$element.append(this.toggle.create());
    },

    createDropdownMenu: function () {
      this.menu = new MuEmojiDropdownMenu(this);
      this.$element.append(this.menu.create());
    },

    dropdownToggleIconClass: function () {
      return this.$element.data('icon-class') || 'fa fa-fw fa-smile-o';
    },

    dropdownMenuAlignmentClass: function () {
      switch (this.$element.data('dropdown-alignment')) {
        case 'right': return MuEmoji.DROPDOWN_MENU_ALIGNMENT_RIGHT;
        case 'center': return MuEmoji.DROPDOWN_MENU_ALIGNMENT_CENTER;
        default: return MuEmoji.DROPDOWN_MENU_ALIGNMENT_LEFT;
      }
    },

    openDropdown: function () {
      this.$element.addClass(OPEN_CLASS);
      this.$element.find($class(MuEmoji.DROPDOWN_MENU_SEARCH_INPUT)).focus();
    },

    openDropdownIfClosed: function (event) {
      if (!this.$element.hasClass(OPEN_CLASS)) {
        this.openDropdown();
        event.stopPropagation();
      }
    },
  }



  function MuEmojiDropdownToggle(parent) {
    this.parent = parent;
  }

  MuEmojiDropdownToggle.prototype = {

    create: function () {
      return this.$element = $('<a>', {
        class: MuEmoji.DROPDOWN_TOGGLE,
        html: this.icon(),
        click: this.parent.openDropdownIfClosed.bind(this.parent)
      });
    },

    icon: function () {
      return $('<i>', {
        class: this.parent.dropdownToggleIconClass()
      });
    }

  }



  function MuEmojiDropdownMenu(parent) {
    this.parent = parent;
  }

  MuEmojiDropdownMenu.prototype = {

    create: function () {
      this.$element = $('<div>', {
        class: [MuEmoji.DROPDOWN_MENU, this.alignmentClass()].join(' '),
      });
      this.createTabs();
      this.createSearch();
      this.createEmojis();
      return this.$element;
    },

    alignmentClass: function () {
      return this.parent.dropdownMenuAlignmentClass();
    },

    createTabs: function () {
      this.tabs = new MuEmojiDropdownMenuTabs(this);
      this.$element.append(this.tabs.create());
    },

    createSearch: function () {
      this.search = new MuEmojiDropdownMenuSearch(this);
      this.$element.append(this.search.create());
    },

    createEmojis: function () {
      this.emojis = new MuEmojiDropdownMenuEmojis(this);
      this.$element.append(this.emojis.create());
    },

    createFooter: function () {
      this.footer = new MuEmojiDropdownMenuFooter(this);
      this.$element.append(this.footer.create());
    },

  }


  function MuEmojiDropdownMenuTabs(parent) {
    this.parent = parent;
    this.tabs = [];
  }

  MuEmojiDropdownMenuTabs.prototype = {

    create: function () {
      this.$element = $('<ul>', {
        class: MuEmoji.DROPDOWN_MENU_TABS
      });
      this.createCategories();
      return this.$element;
    },

    createCategories: function () {
      var self = this;
      window.muEmojis.categories.forEach(function (category, index) {
        var tab = new MuEmojiDropdownMenuTab(self, category, index);
        self.tabs.push(tab);
        self.$element.append(tab.create());
      });
    },

    clickedOnTab: function (clickedTab) {
      this.tabs.forEach(function (tab) {
        tab.deactivate();
      });
    },

  }


  function MuEmojiDropdownMenuTab(parent, category, index) {
    this.parent = parent;
    this.category = category;
    this.index = index;
  }

  MuEmojiDropdownMenuTab.prototype = {

    create: function () {
      return this.$element = $('<li>', {
        class: [MuEmoji.DROPDOWN_MENU_TAB, this.index === 0 && 'active'].filter(id).join(' '),
        title: this.category.description,
        html: this.icon(),
        click: function (event) {
          this.parent.clickedOnTab(this);
          this.activate();
          event.stopPropagation();
        }.bind(this)
      });
    },

    icon: function () {
      return $('<i>', {
        class: this.category.icon_class
      });
    },

    deactivate: function () {
      this.$element.removeClass(ACTIVE_CLASS);
    },

    activate: function () {
      this.$element.addClass(ACTIVE_CLASS);
    },

  }


  function MuEmojiDropdownMenuSearch(parent) {
    this.parent = parent;
  }

  MuEmojiDropdownMenuSearch.prototype = {

    create: function () {
      return '';
    },

  }


  function MuEmojiDropdownMenuEmojis(parent) {
    this.parent = parent;
  }

  MuEmojiDropdownMenuEmojis.prototype = {

    create: function () {
      return '';
    },

  }


  function MuEmojiDropdownMenuFooter(parent) {
    this.parent = parent;
  }

  MuEmojiDropdownMenuFooter.prototype = {

    create: function () {
      return '';
    },

  }



  $.fn.renderEmojis = function () {
    var self = this;
    self.each(function (i) {
      var $element = $(self[i]);
      $element.empty();
      new MuEmoji($element, i).create();
    });
    return self;
  }

  $($class(MuEmoji.DROPDOWN)).renderEmojis();

});