/* global $ */

/// This function would create an accordion based on the markup and provided options
// params:
//  options which consist of:
//    parentSelector - selector for HTML element to which a11y accordion markup and functionality will be applied
//    hiddenAreaSelector - HTML element which will be hidden/shown
//    headerSelector - jQuery selector for the header of each a11yAccordionItem
//    visibleAreaClass - Class which will be applied to every uncollapsed accordion element
//    speed - speed of collapsing animation
//    hiddenLinkDescription - some string which will be played by AT once user has a keyboard focus on Show/Hide link
//    showSearch - boolean option which will tell accordion to render search options
//    showOne - boolean option which represents if accordion can uncollapse only 1 row to the user
//    overallSearch - boolean option which will tell search to look not only in headers but within collapsed areas as well
//    onAreaShow - custom callback which will be called after making visible an accordion's area. Argument is jQuery DOM element for an area to become hidden
//    onAreaHide - user defined callback which will be called after hiding an accordion's area. Argument is jQuery DOM element for an area to become shown
//
class A11yAccordion {

  constructor(options = {}) {
    this._constants = {
      SEARCH_ACTION_TYPE_HIDE: 'hide',
      SEARCH_ACTION_TYPE_COLLAPSE: 'collapse',
    };

    this.collapseRow = this.collapseRow.bind(this);
    this.uncollapseRow = this.uncollapseRow.bind(this);
    this.toggleRow = this.toggleRow.bind(this);
    this.getRowEl = this.getRowEl.bind(this);

    this._render = this._render.bind(this);
    this._renderSearch = this._renderSearch.bind(this);
    this._collapseWork = this._collapseWork.bind(this);
    this._collapseAll = this._collapseAll.bind(this);
    this._collapse = this._collapse.bind(this);
    this._uncollapse = this._uncollapse.bind(this);
    this._getHiddenArea = this._getHiddenArea.bind(this);
    this._traverseChildNodes = this._traverseChildNodes.bind(this);

    // options which will be passed into the components with their default values
    const defaults = {
      parentSelector: undefined,
      colorScheme: 'light',
      hideEffectStyle: 'linear',
      speed: 300,
      hiddenLinkDescription: '',
      showSearch: true,
      showOne: true,
      searchActionType: this._constants.SEARCH_ACTION_TYPE_HIDE,
      overallSearch: false,
      onAreaShow: () => {},
      onAreaHide: () => {},
      classes: {
        markedTextClass: 'a11yAccordion-markedText',
        visibleAreaClass: 'visiblea11yAccordionItem',
        noResultsDivClass: 'a11yAccordionNoResultsItem',
        searchDivClass: 'a11yAccordionSearchDiv',
        headerLinkClass: 'a11yAccordionItemHeaderLink',
        headerTextClass: 'a11yAccordionItemHeaderText',
        hiddenHeaderLabelDescriptionClass: 'a11yAccordionItemHeaderLinkHiddenLabel',
        toggleClass: 'toggle',
        triangleClass: 'a11yAccordion-triangle',
        searchClass: 'a11yAccordionSearch'
      },
      labels: {
        showHeaderLabelText: 'Show',
        hideHeaderLabelText: 'Hide',
        searchPlaceholder: 'Search',
        noResultsText: 'No Results Found',
        titleText: 'Type your query to search',
        resultsMessage: 'Number of results found: ',
        leaveBlankMessage: ' Please leave blank to see all the results.'
      },
      selectors: {
        headerSelector: '.a11yAccordionItemHeader',
        accordionItemSelector: '.a11yAccordionItem',
        hiddenAreaSelector: '.a11yAccordionHideArea',
        showHeaderLabelSelector: '.a11yAccordionItemHeaderLinkShowLabel',
        hideHeaderLabelSelector: '.a11yAccordionItemHeaderLinkHideLabel'
      }
    };

    options = {
      ...defaults,
      ...options
    };

    const { colorScheme, parentSelector } = options;
    const parentPrefix = parentSelector
      ? parentSelector.substring(1)
      : undefined;

    options = {
      ...options,
      classes: {
        ...options.classes,
        accordionHeaderClass: `${colorScheme}-a11yAccordion-header`,
        accordionHideAreaClass: `${colorScheme}-a11yAccordion-area`
      },
      ids: {
        noResultsDivID: `${parentPrefix}-noResultsItem`,
        searchDivID: `${parentPrefix}-searchPanel`,
        rowIdStringPrefix: `${parentPrefix}-row-`
      }
    };

    this.props = options;

    this._render();
  }

  /// Public functions and variables


  /// Function which will hide hidden area in the row with index = rowIndex
  // params:
  //  rowIndex - integer index of the row
  //
  collapseRow(rowIndex) {
    const { _collapse, _getHiddenArea } = this;

    _collapse(_getHiddenArea(rowIndex));
  }

  /// Function which will show hidden area in the row with index = rowIndex
  // params:
  //  rowIndex - integer index of the row
  //
  uncollapseRow(rowIndex) {
    const { _uncollapse, _getHiddenArea } = this;

    _uncollapse(_getHiddenArea(rowIndex));
  }

  /// Function which will hide or show hidden area in the row with index = rowIndex depending on its previous state
  // params:
  //  rowIndex - integer index of the row
  //
  toggleRow(rowIndex) {
    const { _collapseWork, _getHiddenArea } = this;

    _collapseWork(_getHiddenArea(rowIndex));
  }

  /// Function which will return a jQuery row element with index = rowIndex
  // params:
  //  rowIndex - integer index of the row
  //
  getRowEl(rowIndex) {
    const { accordionHideAreas, accordionItems } = this.refs;

    return (rowIndex >= 0 && rowIndex < accordionHideAreas.length)
      ? $(accordionItems[rowIndex])
      : undefined;
  }

  /// Function which will make row disabled and immune to the user clicks
  // params:
  //  rowIndex - integer index of the row
  //
  // enableRow(rowIndex) {

  // };

  /// Function which will make row enabled and available for the user clicks
  // params:
  //  rowIndex - integer index of the row
  //
  // disableRow(rowIndex) {

  // };


  /// Private functions and variables


  /// Rendering accordion control
  //
  _render() {
    const {
      props,
      _collapseWork,
      _constants
    } = this;

    const {
      parentSelector,
      hiddenLinkDescription,
      colorScheme,
      onAreaShow,
      onAreaHide,
      speed,
      showSearch,
      searchActionType,

      classes,
      labels,
      selectors
    } = props;

    const {
      visibleAreaClass,
      headerLinkClass,
      headerTextClass,
      hiddenHeaderLabelDescriptionClass,
      toggleClass,
      triangleClass,
      accordionHeaderClass,
      accordionHideAreaClass
    } = classes;

    const { showHeaderLabelText, hideHeaderLabelText } = labels;

    const {
      showHeaderLabelSelector,
      hideHeaderLabelSelector,
      headerSelector,
      accordionItemSelector,
      hiddenAreaSelector
    } = selectors;

    const parentDiv = $(parentSelector);
    const accordionItems = parentDiv.find(accordionItemSelector);
    const accordionHideAreas = accordionItems.find(hiddenAreaSelector);
    const headers = accordionItems.find(headerSelector);

    // store component's DOM elements
    this.refs = {
      el: parentDiv,
      accordionItems,
      accordionHideAreas,
      headers
    };

    // check that our initialization is proper
    if (!parentDiv.length) {
      throw 'a11yAccordion - no element(s) with parentSelector was found';
    } else if (!accordionItems.length) {
      throw 'a11yAccordion - no element(s) with accordionItemSelector was found';
    } else if (!headers.length) {
      throw 'a11yAccordion - no element(s) with headerSelector was found';
    } else if (!accordionHideAreas.length) {
      throw 'a11yAccordion - no element(s) with hiddenAreaSelector was found';
    } else if (searchActionType !== _constants.SEARCH_ACTION_TYPE_HIDE &&
      searchActionType !== _constants.SEARCH_ACTION_TYPE_COLLAPSE) {
      throw 'a11yAccordion - invalid searchActionType. It can only be: ' +
        _constants.SEARCH_ACTION_TYPE_HIDE + ' or ' +
        _constants.SEARCH_ACTION_TYPE_COLLAPSE;
    }

    // hide all areas by default
    accordionHideAreas.hide();

    // apply color scheme
    headers.addClass(accordionHeaderClass);
    accordionHideAreas.addClass(accordionHideAreaClass);

    // function for show/hide link clicks. We predefine the function not to define it in the loop
    const linkClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const accordionItem = $(event.target).parents(accordionItemSelector);
      _collapseWork(accordionItem.find(hiddenAreaSelector));
      accordionItem.find(`.${headerLinkClass}`).focus();
    };

    // bind headers to a click event
    headers.click(linkClick);

    // generate assistive links
    $.each(headers, function initHeadersEach(index, header) {
      var spans = [];

      var link = $('<a>', {
        href: '#',
        'class': headerLinkClass
      });

      // Bind the click event to the link
      link.click(linkClick);

      spans.push($('<span>', {
        text: showHeaderLabelText,
        'class': showHeaderLabelSelector.substring(1)
      }));

      spans.push($('<span>', {
        text: hideHeaderLabelText,
        style: 'display: none;',
        'class': hideHeaderLabelSelector.substring(1)
      }));

      spans.push($('<span>', {
        text: hiddenLinkDescription,
        'class': hiddenHeaderLabelDescriptionClass
      }));

      spans.push($('<div>', {
        'class': triangleClass
      }));

      // bulk DOM insert for spans
      $(header).wrapInner(`<span class="${headerTextClass}"></span>`);
      link.prepend(spans).appendTo(header);
    });

    // if there is NO search option then return component right away
    if (showSearch) {
      this._renderSearch();
    }
  }

  /// Rendering search DOM
  //
  _renderSearch() {
    const {
      refs,
      props,
      collapseRow,
      uncollapseRow,
      _traverseChildNodes,
      _getHiddenArea,
      _constants
    } = this;

    const {
      overallSearch,
      classes,
      ids,
      labels,
      selectors,
      searchActionType
    } = props;

    const {
      el,
      accordionItems,
      accordionHideAreas,
      headers
    } = refs;

    const {
      noResultsDivID,
      searchDivID,
      rowIdStringPrefix
    } = ids;

    const {
      markedTextClass,
      noResultsDivClass,
      searchDivClass,
      searchClass,
      accordionHeaderClass
    } = classes;

    const {
      searchPlaceholder,
      noResultsText,
      titleText,
      resultsMessage,
      leaveBlankMessage
    } = labels;

    const { headerSelector } = selectors;

    const wrapperDiv = $('<div>', {
      id: searchDivID,
      'class': searchDivClass
    });

    const searchInput = $('<input>', {
      type: 'text',
      placeholder: searchPlaceholder,
      'class': searchClass,
      title: titleText
    }).appendTo(wrapperDiv);

    const wrapperLi = $('<li>', {
      'class': noResultsDivClass,
      id: noResultsDivID,
      style: 'display:none;'
    }).appendTo(el);

    $('<div>', {
      'class': headerSelector.substring(1) + ' ' + accordionHeaderClass,
      text: noResultsText
    }).appendTo(wrapperLi);

    // Set an id to each row
    accordionItems.each(function initaccordionItemsEach(index, item) {
      item.setAttribute('id', rowIdStringPrefix + index);
    });

    wrapperDiv.prependTo(el);

    // Bind search function to input field
    searchInput.keyup(function(event) {
      const { value } = event.target;
      // lowercase search string
      const searchString = value.toLowerCase();

      // hide no results found <li>
      wrapperLi.hide();

      const regex = new RegExp(searchString, 'ig');

      for (let i=0, action; i < accordionItems.length; i++) {
        const headerTextNode = headers[i].children[0];

        // remove all markings from the DOM
        $(headerTextNode).find(`.${markedTextClass}`)
          .each((index, element) => $(element).contents().unwrap());
        headerTextNode.normalize();

        // only if there is something in the input only then perform search
        action = searchString.length
          ? _traverseChildNodes(headerTextNode, regex, markedTextClass)
          : true;

        if (overallSearch) {
          const bodyTextNode = accordionHideAreas[i];

          // remove all markings from the DOM
          $(bodyTextNode).find(`.${markedTextClass}`)
            .each((index, element) => $(element).contents().unwrap());
          bodyTextNode.normalize();

          // only if there is something in the input only then perform search
          action = searchString.length
            ? _traverseChildNodes(bodyTextNode, regex, markedTextClass)
            : true;
        }

        // action on the item. Hide or Show
        if (searchActionType === _constants.SEARCH_ACTION_TYPE_HIDE) {
          $(accordionItems[i])[action ? 'show' : 'hide']();
        } else if (searchActionType === _constants.SEARCH_ACTION_TYPE_COLLAPSE) {
          const hiddenArea = _getHiddenArea(i);
          if (!searchString.length && hiddenArea[0].style.display === 'block') {
            collapseRow(i);
          } else if (hiddenArea[0].style.display === 'none' && action) {
            uncollapseRow(i);
          } else if (hiddenArea[0].style.display === 'block' && !action) {
            collapseRow(i);
          }
        }
      }

      const results = el.find(`${headerSelector}:visible`).length;
      searchInput.attr('title', resultsMessage + results.toString() + leaveBlankMessage);

      if (!results) {
        wrapperLi.show();
      }
    });
  }

  /// Function which is executed upon the link click. It will either hide the related area OR show the area and hide all other ones
  // params:
  //  element - accordion hidden area DOM element which will become hidden or visible depending on its previous state
  //
  _collapseWork(element) {
    const { classes } = this.props;
    const { visibleAreaClass } = classes;

    if (!element) {
      return;
    }

    this[element.hasClass(visibleAreaClass)
      ? '_collapse'
      : '_uncollapse'
    ](element);
  }

  /// Function which will collapse all areas
  //
  _collapseAll() {
    const { refs, props, _collapse } = this;
    const { visibleAreaClass } = props.classes;
    const { accordionHideAreas } = refs;

    const visibleAreas = accordionHideAreas.filter(`.${visibleAreaClass}`);

    $.each(visibleAreas, (index, element) => _collapse(element));
  }

  /// Function which will collapses one element
  // params:
  //  element - accordion hidden area DOM element which will become hidden
  //
  _collapse(element) {
    const {
      onAreaHide,
      speed,
      classes,
      selectors,
      hideEffectStyle
    } = this.props;

    const {
      toggleClass,
      triangleClass,
      visibleAreaClass
    } = classes;

    const {
      headerSelector,
      showHeaderLabelSelector,
      hideHeaderLabelSelector,
    } = selectors;

    element = $(element);

    if (!element.length || !element.hasClass(visibleAreaClass)) {
      return;
    }

    const topRow = element.siblings(headerSelector);

    topRow.find(showHeaderLabelSelector).show();
    topRow.find(hideHeaderLabelSelector).hide();
    topRow.find(`.${triangleClass}`).toggleClass(toggleClass);

    element.slideUp(speed, hideEffectStyle, () => {
      element.removeClass(visibleAreaClass);
      element.hide();

      onAreaHide(element);
    });
  }

  /// Function which will show the area and convert from collapsed to be displayed one
  // params:
  //  element - accordion hidden area DOM element which will become visible
  //
  _uncollapse(element) {
    const {
      onAreaShow,
      speed,
      classes,
      selectors,
      hideEffectStyle,
      showOne
    } = this.props;

    const {
      toggleClass,
      triangleClass,
      visibleAreaClass
    } = classes;

    const {
      headerSelector,
      showHeaderLabelSelector,
      hideHeaderLabelSelector,
    } = selectors;

    element = $(element);

    if (!element.length || element.hasClass(visibleAreaClass)) {
      return;
    }

    if (showOne) {
      this._collapseAll(element);
    }

    const topRow = element.siblings(headerSelector);

    topRow.find(showHeaderLabelSelector).hide();
    topRow.find(hideHeaderLabelSelector).show();
    topRow.find(`.${triangleClass}`).toggleClass(toggleClass);

    element.addClass(visibleAreaClass);
    element.slideDown(speed, hideEffectStyle, () => {
      element.show();

      onAreaShow(element);
    });
  }

  /// Function which returns a jQuery element which represent a hidden area
  // params:
  //  rowIndex - integer index of the row of the hidden area
  //
  _getHiddenArea(rowIndex) {
    const { accordionHideAreas } = this.refs;

    return (rowIndex >= 0 && rowIndex < accordionHideAreas.length)
      ? $(accordionHideAreas[rowIndex])
      : undefined;
  }

  // this function is based on
  // http://james.padolsey.com/javascript/replacing-text-in-the-dom-its-not-that-simple/
  _traverseChildNodes(node, regex, markedTextClass) {
    // if node is a text node andstring appears in text
    if (node.nodeType === 3 && regex.test(node.data)) {
      if (node.textContent.match(regex)) {
        let temp = document.createElement('div');

        temp.innerHTML = node.data.replace(regex,
          `<mark class="${markedTextClass}">$&</mark>`);
        while (temp.firstChild) {
          node.parentNode.insertBefore(temp.firstChild, node);
        }
        node.parentNode.removeChild(node);

        return true;
      }
      return;
    }

    const { childNodes } = node;

    if (!childNodes.length) {
      return;
    }

    let foundMatch;

    $(childNodes).each((index, node) => {
      foundMatch = this._traverseChildNodes(node, regex, markedTextClass)
        || foundMatch;
    });

    return foundMatch;
  }
}
