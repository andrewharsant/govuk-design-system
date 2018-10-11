import 'govuk-frontend/vendor/polyfills/Function/prototype/bind'
import 'govuk-frontend/vendor/polyfills/Element'
import 'govuk-frontend/vendor/polyfills/Element/prototype/classList'
import 'govuk-frontend/vendor/polyfills/Event'
import common from 'govuk-frontend/common'

var nodeListForEach = common.nodeListForEach

var tabsItemClass = 'app-tabs__item'
var tabsItemCurrentClass = tabsItemClass + '--current'
var tabsItemJsClass = 'js-tabs__item'
var headingItemClass = 'app-tabs__heading'
var headingItemCurrentClass = headingItemClass + '--current'
var headingItemJsClass = 'js-tabs__heading'
var tabContainerHiddenClass = 'app-tabs__container--hidden'
var tabContainerJsClass = '.js-tabs__container'
var tabContainerNoTabsJsClass = 'js-tabs__container--no-tabs'
var tabContainerWithCloseBtnClass = 'app-tabs__container--with-close-button'
var allTabTogglers = '.' + tabsItemJsClass + ' a, ' + '.' + headingItemJsClass + ' a'
var tabTogglersMarkedOpenClass = '.js-tabs__item--open a'
var closeButtonClass = 'js-tabs__close'

function AppTabs ($module) {
  this.$module = $module
  this.$allTabsContainers = this.$module.querySelectorAll(tabContainerJsClass)
  this.$tabTriggers = this.$module.querySelectorAll(allTabTogglers)
  this.$tabContainerCollection = this.$module.querySelectorAll(tabContainerJsClass)
  this.$tabsTogglersMarkedOpen = this.$module.querySelectorAll(tabTogglersMarkedOpenClass)
}

AppTabs.prototype.init = function () {
  if (!this.$module) {
    return
  }
  // reset all tabs
  this.resetTabs()
  // add close buttons to each tab
  this.addCloseBtn()
  this.$module.addEventListener('click', this.handleClick.bind(this))

  nodeListForEach(this.$tabsTogglersMarkedOpen, function ($tabToggler) {
    $tabToggler.click()
  })
}

AppTabs.prototype.addCloseBtn = function () {
  // add close button to each tab container except open one with no tab items
  nodeListForEach(this.$tabContainerCollection, function ($tabContainer) {
    if (!($tabContainer.classList.contains(tabContainerNoTabsJsClass))) {
      var $button = document.createElement('button')
      $button.className = 'app-tabs__close ' + closeButtonClass
      $button.innerText = 'Close'
      $tabContainer.appendChild($button)
      $tabContainer.classList.add(tabContainerWithCloseBtnClass)
    }
  })
}
// expand and collapse functionality
AppTabs.prototype.activateAndToggle = function (event) {
  event.preventDefault()
  var $currentTarget = event.target
  var $currentTargetSiblings = this.$module.querySelectorAll('[href="' + $currentTarget.hash + '"]')
  var $tabContent = this.$module.querySelector($currentTarget.hash)
  var isTargetOpen = $currentTarget.getAttribute('aria-expanded') === 'true'

  if (isTargetOpen) {
    $tabContent.classList.add(tabContainerHiddenClass)
    $tabContent.setAttribute('aria-hidden', 'true')
    nodeListForEach($currentTargetSiblings, function ($tabTrigger) {
      $tabTrigger.setAttribute('aria-expanded', 'false')
      if ($tabTrigger.parentNode.classList.contains(tabsItemCurrentClass)) {
        $tabTrigger.parentNode.classList.remove(tabsItemCurrentClass)
      } else if ($tabTrigger.parentNode.classList.contains(headingItemCurrentClass)) {
        $tabTrigger.parentNode.classList.remove(headingItemCurrentClass)
      }
    })
  } else {
    // Reset tabs
    this.resetTabs()
    // make current active
    $tabContent.classList.remove(tabContainerHiddenClass)
    $tabContent.setAttribute('aria-hidden', 'false')

    nodeListForEach($currentTargetSiblings, function ($tabTrigger) {
      $tabTrigger.setAttribute('aria-expanded', 'true')
      if ($tabTrigger.parentNode.classList.contains(tabsItemClass)) {
        $tabTrigger.parentNode.classList.add(tabsItemCurrentClass)
      } else if ($tabTrigger.parentNode.classList.contains(headingItemClass)) {
        $tabTrigger.parentNode.classList.add(headingItemCurrentClass)
      }
    })
  }
}
// reset aria attributes to default and close the tab content container
AppTabs.prototype.resetTabs = function () {
  nodeListForEach(this.$allTabsContainers, function ($tabContainer) {
    if (!$tabContainer.classList.contains(tabContainerNoTabsJsClass)) {
      $tabContainer.classList.add(tabContainerHiddenClass)
      $tabContainer.setAttribute('aria-hidden', 'true')
    }
  })

  nodeListForEach(this.$tabTriggers, function ($tabTrigger) {
    $tabTrigger.setAttribute('aria-expanded', 'false')
    if ($tabTrigger.parentNode.classList.contains(tabsItemCurrentClass)) {
      $tabTrigger.parentNode.classList.remove(tabsItemCurrentClass)
    } else if ($tabTrigger.parentNode.classList.contains(headingItemCurrentClass)) {
      $tabTrigger.parentNode.classList.remove(headingItemCurrentClass)
    }
  })
}

// Close current container on click
AppTabs.prototype.clickCloseContainer = function (event) {
  event.preventDefault()
  this.resetTabs()
}

AppTabs.prototype.handleClick = function (event) {
  // toggle and active selected tab and heading (on mobile)
  if (event.target.parentNode.classList.contains(tabsItemJsClass) ||
    event.target.parentNode.classList.contains(headingItemJsClass)) {
    this.activateAndToggle(event)
  }

  // close button behavior
  if (event.target.classList.contains(closeButtonClass)) {
    this.clickCloseContainer(event)
  }
}

export default AppTabs
