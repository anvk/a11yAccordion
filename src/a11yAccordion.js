/* global $ */

/// This function would create an accordion based on the markup and provided options
// params:
//  options which consist of:
//    parentSelector - selector for HTML element to which a11y accordion markup and functionality will be applied
//    speed - speed of collapsing animation
//    hiddenLinkDescription - some string which will be played by AT once user has a keyboard focus on Show/Hide link
//    showSearch - boolean option which will tell accordion to render search options
//    showOne - boolean option which represents if accordion can uncollapse only 1 row to the user
//    overallSearch - boolean option which will tell search to look not only in headers but within collapsed areas as well
//    onAreaShow - custom callback which will be called after making visible an accordion's area. Argument is jQuery DOM element for an area to become hidden
//    onAreaHide - user defined callback which will be called after hiding an accordion's area. Argument is jQuery DOM element for an area to become shown
//    searchActionType - could be "hide" or "collapse". First option will hide/show accordion rows upon matches, while the second option will collapse/uncollapse them
//
class A11yAccordion {

  constructor(options = {}) {
    const constants = {
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
      constants,
      parentSelector: undefined,
      hideEffectStyle: 'linear',
      speed: 300,
      hiddenLinkDescription: '',
      showSearch: true,
      showOne: true,
      searchActionType: constants.SEARCH_ACTION_TYPE_HIDE,
      overallSearch: false,
      onAreaShow: () => {},
      onAreaHide: () => {},
      classes: {
        headerClass: 'a11yAccordionItemHeader',
        accordionItemClass: 'a11yAccordionItem',
        hiddenAreaClass: 'a11yAccordionHideArea',
        showHeaderLabelClass: 'a11yAccordionItemHeaderLinkShowLabel',
        hideHeaderLabelClass: 'a11yAccordionItemHeaderLinkHideLabel',
        markedTextClass: 'a11yAccordion-markedText',
        visibleAreaClass: 'visiblea11yAccordionItem',
        noResultsDivClass: 'a11yAccordionNoResultsItem',
        searchDivClass: 'a11yAccordionSearchDiv',
        headerLinkClass: 'a11yAccordionItemHeaderLink',
        headerTextClass: 'a11yAccordionItemHeaderText',
        hiddenHeaderLabelDescriptionClass: 'a11yAccordionItemHeaderLinkHiddenLabel',
        toggleClass: 'toggle',
        triangleClass: 'a11yAccordion-triangle',
        searchClass: 'a11yAccordionSearch',
        accordionHeaderClass: `a11yAccordion-header`,
        accordionHideAreaClass: `a11yAccordion-area`
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
      ids: {
        noResultsDivID: `a11yAccordion-noResultsItem`,
        searchDivID: `a11yAccordion-searchPanel`,
        rowIdStringPrefix: `a11yAccordion-row-`
      },
      attributes: {
        hiddenLinkDescription: 'data-a11yAccordion-hiddenLinkDescription',
      },
    };

    options = {
      ...defaults,
      ...options
    };

    const { classes } = options;

    options = {
      ...options,
      selectors: {
        triangleSelector: `.${classes.triangleClass}`,
        visibleAreaSelector: `.${classes.visibleAreaClass}`,
        markedTextSelector: `.${classes.markedTextClass}`,
        headerLinkSelector: `.${classes.headerLinkClass}`,
        headerSelector: `.${classes.headerClass}`,
        showHeaderLabelSelector: `.${classes.showHeaderLabelClass}`,
        hideHeaderLabelSelector: `.${classes.hideHeaderLabelClass}`,
        accordionItemSelector: `.${classes.accordionItemClass}`,
        hiddenAreaSelector: `.${classes.hiddenAreaClass}`
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
    const { props, _collapseWork } = this;

    const {
      parentSelector,
      hiddenLinkDescription,
      onAreaShow,
      onAreaHide,
      speed,
      showSearch,
      searchActionType,

      classes,
      labels,
      selectors,
      attributes,
      constants
    } = props;

    const {
      visibleAreaClass,
      headerLinkClass,
      headerTextClass,
      hiddenHeaderLabelDescriptionClass,
      toggleClass,
      triangleClass,
      accordionHeaderClass,
      accordionHideAreaClass,
      showHeaderLabelClass,
      hideHeaderLabelClass
    } = classes;

    const { showHeaderLabelText, hideHeaderLabelText } = labels;

    const {
      showHeaderLabelSelector,
      hideHeaderLabelSelector,
      headerSelector,
      headerLinkSelector,
      accordionItemSelector,
      hiddenAreaSelector
    } = selectors;

    const parentDiv = $(parentSelector);
    const accordionItems = parentDiv.find(`> ${accordionItemSelector}`);
    const accordionHideAreas = accordionItems.find(`> ${hiddenAreaSelector}`);
    const headers = accordionItems.find(`> ${headerSelector}`);

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
    } else if (searchActionType !== constants.SEARCH_ACTION_TYPE_HIDE &&
      searchActionType !== constants.SEARCH_ACTION_TYPE_COLLAPSE) {
      throw 'a11yAccordion - invalid searchActionType. It can only be: ' +
        constants.SEARCH_ACTION_TYPE_HIDE + ' or ' +
        constants.SEARCH_ACTION_TYPE_COLLAPSE;
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
      const accordionItem = $(event.target)
        .parents(accordionItemSelector)
        .eq(0); // to avoid execution on nested accordions
      _collapseWork(accordionItem.find(`> ${hiddenAreaSelector}`).eq(0));
      accordionItem.find(headerLinkSelector).eq(0).focus();
    };

    // bind headers to a click event
    headers.click(linkClick);

    // generate assistive links
    $.each(headers, function initHeadersEach(index, header) {
      let spans = [];

      var link = $('<a>', {
        href: '#',
        'class': headerLinkClass
      });

      // Bind the click event to the link
      link.click(linkClick);

      spans.push($('<span>', {
        text: showHeaderLabelText,
        'class': showHeaderLabelClass
      }));

      spans.push($('<span>', {
        text: hideHeaderLabelText,
        style: 'display: none;',
        'class': hideHeaderLabelClass
      }));

      const assistiveLinkDescription = header
        .getAttribute(attributes.hiddenLinkDescription)
      || hiddenLinkDescription;

      spans.push($('<span>', {
        text: assistiveLinkDescription,
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
      _getHiddenArea
    } = this;

    const {
      overallSearch,
      classes,
      ids,
      labels,
      selectors,
      searchActionType,
      constants
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
      accordionHeaderClass,
      headerClass
    } = classes;

    const {
      searchPlaceholder,
      noResultsText,
      titleText,
      resultsMessage,
      leaveBlankMessage
    } = labels;

    const { markedTextSelector, headerSelector } = selectors;

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
      'class': `${headerClass} ${accordionHeaderClass}`,
      text: noResultsText
    }).appendTo(wrapperLi);

    // Set an id to each row
    accordionItems.each(function initaccordionItemsEach(index, item) {
      item.setAttribute('id', rowIdStringPrefix + index);
    });

    wrapperDiv.prependTo(el);

    let searchValue = '';

    // Bind search function to input field
    searchInput.keyup(function(event) {
      const { value } = event.target;
      // lowercase search string
      const searchString = value.toLowerCase();

      // if value did not change then nothing to do
      if (searchValue === searchString) {
        return;
      }

      searchValue = searchString;

      // hide no results found <li>
      wrapperLi.hide();

      const regex = new RegExp(searchString, 'ig');

      for (let i=0, action; i < accordionItems.length; i++) {
        const headerTextNode = headers[i].children[0];

        // remove all markings from the DOM
        $(headerTextNode).find(markedTextSelector)
          .each((index, element) => $(element).contents().unwrap());
        headerTextNode.normalize();

        // only if there is something in the input only then perform search
        action = searchString.length
          ? _traverseChildNodes(headerTextNode, regex, markedTextClass)
          : true;

        if (overallSearch) {
          const bodyTextNode = accordionHideAreas[i];

          // remove all markings from the DOM
          $(bodyTextNode).find(markedTextSelector)
            .each((index, element) => $(element).contents().unwrap());
          bodyTextNode.normalize();

          // only if there is something in the input
          // and only if we could not find matching string in header
          // only then perform search
          action = searchString.length && !action
            ? _traverseChildNodes(bodyTextNode, regex, markedTextClass)
            : true;
        }

        // action on the item. Hide or Show
        if (searchActionType === constants.SEARCH_ACTION_TYPE_HIDE) {
          $(accordionItems[i])[action ? 'show' : 'hide']();
        } else if (searchActionType === constants.SEARCH_ACTION_TYPE_COLLAPSE) {
          const hiddenArea = _getHiddenArea(i);
          const hiddenAreaDisplay = hiddenArea[0].style.display;
          if (!searchString.length && hiddenAreaDisplay === 'block') {
            collapseRow(i);
          } else if (hiddenAreaDisplay === 'none' && action) {
            uncollapseRow(i);
          } else if (hiddenAreaDisplay === 'block' && !action) {
            collapseRow(i);
          }
        }
      }

      const results = accordionHideAreas.filter(':visible').length;
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
    const { visibleAreaSelector } = props.selectors;
    const { accordionHideAreas } = refs;

    const visibleAreas = accordionHideAreas.filter(visibleAreaSelector);

    $.each(visibleAreas, (index, element) => _collapse(element));
  }

  /// Function which will collapses one element
  // params:
  //  element - accordion hidden area DOM element which will become hidden
  //
  _collapse(element) {
    const { props } = this;

    const {
      onAreaHide,
      speed,
      classes,
      selectors,
      hideEffectStyle
    } = props;

    const {
      toggleClass,
      visibleAreaClass
    } = classes;

    const {
      headerSelector,
      showHeaderLabelSelector,
      hideHeaderLabelSelector,
      triangleSelector
    } = selectors;

    element = $(element);

    if (!element.length || !element.hasClass(visibleAreaClass)) {
      return;
    }

    const topRow = element.siblings(headerSelector);

    topRow.find(showHeaderLabelSelector).show();
    topRow.find(hideHeaderLabelSelector).hide();
    topRow.find(triangleSelector).toggleClass(toggleClass);

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
    const { props, _collapseAll } = this;

    const {
      onAreaShow,
      speed,
      classes,
      selectors,
      hideEffectStyle,
      showOne
    } = props;

    const {
      toggleClass,
      visibleAreaClass
    } = classes;

    const {
      headerSelector,
      showHeaderLabelSelector,
      hideHeaderLabelSelector,
      triangleSelector
    } = selectors;

    element = $(element);

    if (!element.length || element.hasClass(visibleAreaClass)) {
      return;
    }

    if (showOne) {
      _collapseAll(element);
    }

    const topRow = element.siblings(headerSelector);

    topRow.find(showHeaderLabelSelector).hide();
    topRow.find(hideHeaderLabelSelector).show();
    topRow.find(triangleSelector).toggleClass(toggleClass);

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
