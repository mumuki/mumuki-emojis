(function (window) {

  // Emoji icons provided free by [EmojiOne](https://www.emojione.com)

  window.muEmojis = window.muEmojis || {};

  var availableLanguages = ['en', 'es', 'pt'];

  function currentLanguage() {
    var _language = window.navigator.languages && window.navigator.languages[0] ||
                    window.navigator.language ||
                    window.navigator.browserLanguage ||
                    window.navigator.systemLanguage ||
                    window.navigator.userLanguage;

    var language = _language.split("-")[0];

    return availableLanguages.indexOf(language) >= 0 ? language : "en";
  }

  window.muEmojis._inputPlaceholder_ = {
    en: "Search emojis",
    es: "Buscar emoticón",
    pt: "Emoticon de busca",
  }

  window.muEmojis._categories_ = [
    {
      name: "mumoji",
      icon_class: "da da-mumuki-circle",
      caption: {
        en: "Mumoji",
        es: "Mumoji",
        pt: "Mumoji",
      }
    },
    {
      name: "people",
      icon_class: "fa fa-fw fa-smile-o",
      caption: {
        en: "Smileys & People",
        es: "Sonrisas y gente",
        pt: "Sorrisos e pessoas",
      }
    },
    {
      name: "nature",
      icon_class: "fa fa-fw fa-leaf",
      caption: {
        en: "Animals & Nature",
        es: "Animales y naturaleza",
        pt: "Animais e natureza",
      }
    },
    {
      name: "food",
      icon_class: "fa fa-fw fa-cutlery",
      caption: {
        en: "Food & Drink",
        es: "Comida y bebida",
        pt: "Comida e bebida",
      }
    },
    {
      name: "activity",
      icon_class: "fa fa-fw fa-futbol-o",
      caption: {
        en: "Activity",
        es: "Actividad",
        pt: "Atividade",
      }
    },
    {
      name: "travel",
      icon_class: "fa fa-fw fa-plane",
      caption: {
        en: "Travel & Places",
        es: "Viajes y lugares",
        pt: "Viagens e lugares",
      }
    },
    {
      name: "objects",
      icon_class: "fa fa-fw fa-wrench",
      caption: {
        en: "Objects",
        es: "Objetos",
        pt: "Objetos",
      }
    },
    {
      name: "symbols",
      icon_class: "fa fa-fw fa-hashtag",
      caption: {
        en: "Symbols",
        es: "Símbolos",
        pt: "Símbolos",
      }
    },
    {
      name: "flags",
      icon_class: "fa fa-fw fa-flag-o",
      caption: {
        en: "Flags",
        es: "Banderas",
        pt: "Bandeiras",
      }
    }
  ]

  window._emojiOneLegend = {
    en: 'Emoji icons provided free by',
    es: 'Los emojis son proporcionados gratuitamente por',
    pt: 'Emoji ícones fornecidos gratuitamente pelo',
  }

  window._searchEmojiPlaceholder = {
    en: 'Search emoji',
    es: 'Buscar emoticón',
    pt: 'Pesquisar emoji',
  }

  function compareEmojis(a, b) {
    return a.order < b.order ? -1 : (a.order == b.order ? 0 : 1);
  }

  function fromCategory(category, jsCriteria, emoji) {
    return emoji.category === category.name && jsCriteria(emoji);
  }

  function filterEmojisBy(category, jsCriteria) {
    return window.muEmojis.list.filter(fromCategory.bind(window.muEmojis, category, jsCriteria));
  }

  function alwaysTrue(_emoji) {
    return true;
  }

  window.muEmojis.filterEmojisBy = filterEmojisBy;

  window.muEmojis.categories = window.muEmojis._categories_.map(function (category, index) {
    return {
      name: category.name,
      icon_class: category.icon_class,
      order: index + 1,
      caption: category.caption[currentLanguage()],
      list: filterEmojisBy(category, alwaysTrue),
    };
  })

  window.muEmojis.inputPlaceholder = window.muEmojis._inputPlaceholder_[currentLanguage()];
  window.emojiOneLegend = window._emojiOneLegend[currentLanguage()];
  window.searchEmojiPlaceholder = window._searchEmojiPlaceholder[currentLanguage()];

})(window);