var OptionsTable = {
  init: function () {
    OptionsTable.expandMacroOptions()
  },
  // Open Nunjucks tab and expand macro options details when URL hash is 'nunjucks-options-[example]'
  expandMacroOptions: function () {
    var hash = window.location.hash

    if (hash.match('^#options-')) {
      var exampleName = hash.split('#options-')[1]

      if (exampleName) {
        var tabLink = document.querySelector('a[href="#' + exampleName + '-nunjucks"]')
        var tabHeading = tabLink ? tabLink.parentNode : null
        var optionsDetailsElement = document.getElementById(hash.substring(1) + '-details')

        if (tabHeading && optionsDetailsElement) {
          var tabsElement = optionsDetailsElement.parentNode

          tabLink.setAttribute('aria-expanded', true)
          tabHeading.className += ' app-tabs__item--current'
          tabsElement.style.display = 'block'
          tabsElement.setAttribute('aria-hidden', false)
          optionsDetailsElement.open = true
          window.setTimeout(function () {
            tabLink.focus()
          }, 0)
        }
      }
    }
  }
}

export default OptionsTable
