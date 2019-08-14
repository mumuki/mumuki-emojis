var mumuki = {
  load: function (callback) {
    return callback();
  }
}

mumuki.load(function () {

  var ESCAPE_KEY = 27;

  var OPEN_CLASS = 'open';
  var ACTIVE_CLASS = 'active';
  var DISABLED_CLASS = 'disabled';

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

  MuEmoji.DROPDOWN_MENU_FOOTER = 'mu-emojis-footer';

  function hideAllDropdownMenues() {
    $($class(MuEmoji.DROPDOWN_MENU)).removeClass(OPEN_CLASS);
  }

  $(document).keydown(function (e) {
    if (e.keyCode === ESCAPE_KEY) hideAllDropdownMenues();
  });

  $(document).click(function (e) {
    var clazz = $class(MuEmoji.DROPDOWN_MENU);
    if (!$(e.target).is(clazz + ', ' + clazz + ' *')) hideAllDropdownMenues();
  });

  function MuEmoji($element, index) {
    this.$element = $element;
    this.index = index;
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
      this.menu.open();
    },

    closeDropdown: function () {
      this.menu.close();
    },

    toggleDropdown: function (event) {
      this.menu.toggleDropdown(event);
    },

    clickedOnEmoji: function (emoji) {
      eval(this.$element.data('on-emoji-click'))(emoji);
      this.closeDropdown();
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
        click: this.parent.toggleDropdown.bind(this.parent)
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
    this.categories = JSON.parse(JSON.stringify(window.window.muEmojis.categories));
  }

  MuEmojiDropdownMenu.prototype = {

    create: function () {
      this.$element = $('<div>', {
        class: [MuEmoji.DROPDOWN_MENU, this.alignmentClass()].join(' '),
      });
      this.createTabs();
      this.createSearch();
      this.createEmojis();
      this.createFooter();
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

    open: function () {
      this.$element.addClass(OPEN_CLASS);
      this.search.$input.focus();
    },

    isOpen: function () {
      return this.$element.hasClass(OPEN_CLASS);
    },

    close: function () {
      this.$element.removeClass(OPEN_CLASS);
    },

    isClosed: function () {
      return !this.isOpen();
    },

    toggleDropdown: function (event) {
      hideAllDropdownMenues();
      if (this.isClosed()) {
        this.open();
        event.stopPropagation();
      }
    },

    clickedOnEmoji: function (emoji) {
      this.parent.clickedOnEmoji(emoji);
    },

    scrollToCategory(category) {
      this.emojis.scrollToCategory(category);
    },

    updateEmojis: function () {
      this.emojis.createEmojis();
    },

    updateActiveTabs: function () {
      this.tabs.updateActiveTabs();
    }
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
      this.parent.categories.forEach(function (category, index) {
        var tab = new MuEmojiDropdownMenuTab(self, category, index);
        self.tabs.push(tab);
        self.$element.append(tab.create());
      });
    },

    clickedOnTab: function (clickedTab) {
      this.tabs.forEach(function (tab) {
        tab.deactivate();
      });
      this.parent.scrollToCategory(clickedTab.category);
    },

    updateActiveTabs: function () {
      var self = this;
      self.tabs.forEach(function (tab, i) {
        self.parent.categories[i].list.length === 0 ?
          tab.disable() : tab.enable();
      });
      var tab = self.tabs.find(function (tab) { return tab.isEnable() });
      self.tabs.forEach(function (tab) {
        tab.deactivate();
      });
      tab && tab.activate();
    },

  }


  function MuEmojiDropdownMenuTab(parent, category, index) {
    this.parent = parent;
    this.category = category;
    this.index = index;
  }

  MuEmojiDropdownMenuTab.prototype = {

    create: function () {
      var self = this
      return self.$element = $('<li>', {
        class: [MuEmoji.DROPDOWN_MENU_TAB, self.index === 0 && 'active'].filter(id).join(' '),
        title: self.category.description,
        html: self.icon(),
        click: function (event) {
          self.parent.clickedOnTab(self);
          self.activate();
          event.stopPropagation();
        }
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

    enable: function () {
      this.$element.removeClass(DISABLED_CLASS);
    },

    isEnable: function () {
      return !this.$element.hasClass(DISABLED_CLASS);
    },

    disable: function () {
      this.$element.addClass(DISABLED_CLASS);
    }

  }


  function MuEmojiDropdownMenuSearch(parent) {
    this.parent = parent;
    this.searchTimeout = setTimeout(noop);
  }

  MuEmojiDropdownMenuSearch.prototype = {

    create: function () {
      this.$element = $('<div>', {
        class: MuEmoji.DROPDOWN_MENU_SEARCH
      });
      this.createIcon();
      this.createInput();
      return this.$element;
    },

    createIcon: function () {
      this.$icon = $('<i>', {
        class: [MuEmoji.DROPDOWN_MENU_SEARCH_ICON, 'fa fa-fw fa-search'].join(' '),
      });
      this.$element.append(this.$icon);
    },

    createInput: function () {
      var self = this;
      this.$input = $('<input>', {
        class: MuEmoji.DROPDOWN_MENU_SEARCH_INPUT,
        placeholder: window.searchEmojiPlaceholder,
        keyup: function (event) {
          self.search();
        }
      });
      this.$element.append(this.$input);
    },

    search: function () {
      var self = this;
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(function () {
        self._doSearch(self.$input.val().trim());
      }, 500);
    },

    _doSearch: function (query) {
      this.parent.categories.forEach(function (category) {
        category.list = window.muEmojis.filterEmojisBy(category, function (emoji) {
          return !query ? true :
            [emoji.name, emoji.shortname].concat(emoji.shortname_alternates).concat(emoji.keywords).some(function (s) {
              return s && s.toLowerCase().indexOf(query.toLowerCase()) >= 0;
            });
        });
      });
      this.parent.updateEmojis();
    },

  }


  function MuEmojiDropdownMenuEmojis(parent) {
    this.parent = parent;
    this.categories = [];
  }

  MuEmojiDropdownMenuEmojis.prototype = {

    create: function () {
      this.$element = $('<ul>', {
        class: MuEmoji.DROPDOWN_MENU_EMOJIS
      });
      this.createEmojis();
      return this.$element;
    },

    createEmojis: function () {
      var self = this
      self.$element.empty();
      self.categories = [];
      self.parent.updateActiveTabs();
      this.parent.categories.forEach(function (cat) {
        if (cat.list.length === 0) return;
        var category = new MuEmojiDropdownMenuEmojisCategory(self, cat);
        self.categories.push(category);
        self.$element.append(category.create());
      });
    },

    scrollToCategory(category) {
      var firstCategory = this.categories[0];
      var categoryToScroll = this.categories.find(function (cat) {
        return cat.category.name === category.name;
      });
      var scrollTop = categoryToScroll.$element.position().top - firstCategory.$element.position().top;
      this.$element.scrollTop(scrollTop);
    },

    clickedOnEmoji: function (emoji) {
      this.parent.clickedOnEmoji(emoji)
    },

  }


  function MuEmojiDropdownMenuEmojisCategory(parent, category) {
    this.parent = parent;
    this.category = category;
  }

  MuEmojiDropdownMenuEmojisCategory.prototype = {

    create: function () {
      this.$element = $('<li>', {
        class: MuEmoji.DROPDOWN_MENU_EMOJIS_CATEGORIES,
      });
      this.createTitle();
      this.createEmojis();
      return this.$element;
    },

    createTitle: function () {
      this.$title = $('<h4>', {
        text: this.category.caption
      });
      this.$element.append(this.$title);
    },

    createEmojis: function () {
      this.$emojis = $('<ul>', {
        class: MuEmoji.DROPDOWN_MENU_EMOJIS_CATEGORY
      });
      this.populate();
      this.$element.append(this.$emojis);
    },

    populate: function () {
      var self = this
      self.category.list.forEach(function (emoji) {
        if (emoji.diversity) return;
        var $emoji = $('<li>', {
          class: MuEmoji.DROPDOWN_MENU_EMOJI,
          html: self.icon(emoji.category, emoji),
          click: function () {
            self.parent.clickedOnEmoji(emoji);
          }
        });
        self.$emojis.append($emoji);
      });
    },

    icon: function (categoryName, emoji) {
      return $('<i>', {
        class: ['mu-emoji', 'px24', categoryName,  '_' + emoji.code_points.base].join(' '),
        title: emoji.name,
        data: {
          code: emoji.shortname
        }
      });
    },

  }


  function MuEmojiDropdownMenuFooter(parent) {
    this.parent = parent;
  }

  MuEmojiDropdownMenuFooter.prototype = {

    create: function () {
      this.$element = $('<div>', {
        class: MuEmoji.DROPDOWN_MENU_FOOTER,
      });
      return this.$element;
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