/*global $*/

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
    this.el = null;
    this.showOne = null;

    this._hideEffectStyle = 'linear';
    this._showHeaderLabelSelector = '.a11yAccordionItemHeaderLinkShowLabel';
    this._hideHeaderLabelSelector = '.a11yAccordionItemHeaderLinkHideLabel';
    this._headerSelector = null;
    this._accordionItems = null;
    this._visibleAreaClass = null;
    this._accordionHideAreas = null;
    this._speed = null;
    this._onAreaShow = null;
    this._onAreaHide = null;

    this.collapseRow = this.collapseRow.bind(this);
    this.uncollapseRow = this.uncollapseRow.bind(this);
    this.toggleRow = this.toggleRow.bind(this);
    this.getRowEl = this.getRowEl.bind(this);

    this._render = this._render.bind(this);
    this._collapseWork = this._collapseWork.bind(this);
    this._collapseAll = this._collapseAll.bind(this);
    this._collapse = this._collapse.bind(this);
    this._uncollapse = this._uncollapse.bind(this);
    this._getHiddenArea = this._getHiddenArea.bind(this);

    // options which will be passed into the components with their default values
    const defaults = {
      parentSelector: undefined,
      accordionItemSelector: '.a11yAccordionItem',
      headerSelector: '.a11yAccordionItemHeader',
      hiddenAreaSelector: '.a11yAccordionHideArea',
      visibleAreaClass: 'visiblea11yAccordionItem',
      colorScheme: 'light',
      speed: 300,
      hiddenLinkDescription: '',
      showSearch: true,
      showOne: true,
      overallSearch: false,
      onAreaShow: undefined,
      onAreaHide: undefined
    };

    options = {
      ...defaults,
      ...options
    };

    this._render(options);
  }

  /// Public functions and variables


  /// Function which will hide hidden area in the row with index = rowIndex
  // params:
  //  rowIndex - integer index of the row
  //
  collapseRow(rowIndex) {
    const {
      _collapse,
      _getHiddenArea
    } = this;

    _collapse(_getHiddenArea(rowIndex));
  }

  /// Function which will show hidden area in the row with index = rowIndex
  // params:
  //  rowIndex - integer index of the row
  //
  uncollapseRow(rowIndex) {
    const {
      _uncollapse,
      _getHiddenArea
    } = this;

    _uncollapse(_getHiddenArea(rowIndex));
  }

  /// Function which will hide or show hidden area in the row with index = rowIndex depending on its previous state
  // params:
  //  rowIndex - integer index of the row
  //
  toggleRow(rowIndex) {
    const {
      _collapseWork,
      _getHiddenArea
    } = this;

    _collapseWork(_getHiddenArea(rowIndex));
  }

  /// Function which will return a jQuery row element with index = rowIndex
  // params:
  //  rowIndex - integer index of the row
  //
  getRowEl(rowIndex) {
    const {
      _accordionHideAreas,
      _accordionItems
    } = this;

    return (rowIndex >= 0 && rowIndex < _accordionHideAreas.length)
      ? $(_accordionItems[rowIndex])
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


  /// Starting point
  //
  _render(options = {}) {
    var parentDiv = $(options.parentSelector),
        parentPrefix = options.parentSelector ? options.parentSelector.substring(1) : undefined,
        accordionItemSelector = options.accordionItemSelector,
        hiddenAreaSelector = options.hiddenAreaSelector,
        headerSelector = options.headerSelector,
        headerLinkClass = 'a11yAccordionItemHeaderLink',
        headerTextClass = 'a11yAccordionItemHeaderText',
        hiddenHeaderLabelDescriptionClass = 'a11yAccordionItemHeaderLinkHiddenLabel',
        noResultsDivID = parentPrefix + '-noResultsItem',
        noResultsDivClass = 'a11yAccordionNoResultsItem',
        searchDivID = parentPrefix + '-searchPanel',
        searchDivClass = 'a11yAccordionSearchDiv',
        rowIdString = parentPrefix + '-row-',
        colorScheme = options.colorScheme,
        accordionHeaderClass = colorScheme + '-a11yAccordion-header',
        accordionHideAreaClass = colorScheme + '-a11yAccordion-area',
        showHeaderLabelText = 'Show',
        hideHeaderLabelText = 'Hide';

    this._onAreaShow = options.onAreaShow ? options.onAreaShow : () => {};
    this._onAreaHide = options.onAreaHide ? options.onAreaHide : () => {};
    this._headerSelector = headerSelector;
    this._speed = options.speed;
    this._visibleAreaClass = options.visibleAreaClass;
    this._accordionItems = parentDiv.find(accordionItemSelector);
    this.showOne = options.showOne;

    var headers = this._accordionItems.find(headerSelector);
    this._accordionHideAreas = this._accordionItems.find(hiddenAreaSelector);

    // check that our initialization is proper
    if (!parentDiv.length) {
      throw 'a11yAccordion - no element(s) with parentSelector was found';
    } else if (!this._accordionItems.length) {
      throw 'a11yAccordion - no element(s) with accordionItemSelector was found';
    } else if (!headers.length) {
      throw 'a11yAccordion - no element(s) with headerSelector was found';
    } else if (!this._accordionHideAreas.length) {
      throw 'a11yAccordion - no element(s) with hiddenAreaSelector was found';
    }

    // store component's DOM element
    this.el = parentDiv;

    // hide all areas by default
    this._accordionHideAreas.hide();

    // apply color scheme
    headers.addClass(accordionHeaderClass);
    this._accordionHideAreas.addClass(accordionHideAreaClass);

    // function for show/hide link clicks. We predefine the function not to define it in the loop
    var linkClick = function(event) {
      event.preventDefault();
      event.stopPropagation();
      var accordionItem = $(event.target).parents(accordionItemSelector);
      this._collapseWork(accordionItem.find(hiddenAreaSelector));
      accordionItem.find('.' + headerLinkClass).focus();
    }.bind(this);

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
        'class': this._showHeaderLabelSelector.substring(1)
      }));

      spans.push($('<span>', {
        text: hideHeaderLabelText,
        style: 'display: none;',
        'class': this._hideHeaderLabelSelector.substring(1)
      }));

      spans.push($('<span>', {
        text: options.hiddenLinkDescription,
        'class': hiddenHeaderLabelDescriptionClass
      }));

      // bulk DOM insert for spans
      $(header).wrapInner(`<span class="${headerTextClass}"></span>`);
      link.prepend(spans).appendTo(header);
    }.bind(this));

    // if there is NO search option then return component right away
    if (!options.showSearch) {
      return;
    }

    var searchPlaceholder = 'Search',
        searchClass = 'a11yAccordionSearch',
        noResultsText = 'No Results Found',
        titleText = 'Type your query to search',
        resultsMessage = 'Number of results found: ',
        leaveBlankMessage = ' Please leave blank to see all the results.',
        wrapperDiv, wrapperLi, searchInput, searchString, results;

    wrapperDiv = $('<div />', {
      id: searchDivID,
      'class': searchDivClass
    });

    searchInput = $('<input />', {
      type: 'text',
      placeholder: searchPlaceholder,
      'class': searchClass,
      title: titleText
    }).appendTo(wrapperDiv);

    wrapperLi = $('<li />', {
      'class': noResultsDivClass,
      id: noResultsDivID,
      style: 'display:none;'
    }).appendTo(parentDiv);

    $('<div />', {
      'class': headerSelector.substring(1) + ' ' + accordionHeaderClass,
      text: noResultsText
    }).appendTo(wrapperLi);

    // Set an id to each row
    this._accordionItems.each(function initaccordionItemsEach(index, item) {
      item.setAttribute('id', rowIdString + index);
    });

    wrapperDiv.prependTo(parentDiv);

    // Bind search function to input field
    searchInput.keyup(function searchInputKeyup() {
      wrapperLi.hide();

      searchString = searchInput.val().toLowerCase();
      const regex = new RegExp(searchInput.val(), 'ig');

      headers.each(function searchInputKeyupEach(index, data) {
        var action = ((data.children[0].textContent.toLowerCase().indexOf(searchString) !== -1) ||
                      (options.overallSearch && this._accordionHideAreas[index].textContent.toLowerCase().indexOf(searchString) !== -1)) ? 'show' : 'hide';

        debugger;
        //data.firstChild.innerHTML = data.firstChild.innerHTML
        //  .replace(regex, '<mark>$&</mark>');

        traverseChildNodes(data, regex);
        // data.children[0].textContent = data.children[0]
        //   .textContent.replace(regex, '<mark>$&</mark>');

        $(this._accordionItems[index])[action]();
      }.bind(this));

      results = parentDiv.find(`${headerSelector}:visible`).length;
      searchInput.attr('title', resultsMessage + results.toString() + leaveBlankMessage);

      if (!results) {
        wrapperLi.show();
      }
    }.bind(this));
  }

  /// Function which is executed upon the link click. It will either hide the related area OR show the area and hide all other ones
  // params:
  //  element - accordion hidden area DOM element which will become hidden or visible depending on its previous state
  //
  _collapseWork(element) {
    const { _visibleAreaClass } = this;

    if (!element) {
      return;
    }

    this[element.hasClass(_visibleAreaClass)
      ? '_collapse'
      : '_uncollapse'
    ](element);
  }

  /// Function which will collapse all areas
  //
  _collapseAll() {
    const {
      _accordionHideAreas,
      _visibleAreaClass,
      _collapse
    } = this;

    const visibleAreas = _accordionHideAreas.filter(`.${_visibleAreaClass}`);

    $.each(visibleAreas, (index, element) => _collapse(element));
  }

  /// Function which will collapses one element
  // params:
  //  element - accordion hidden area DOM element which will become hidden
  //
  _collapse(element) {
    const {
      _visibleAreaClass,
      _headerSelector,
      _showHeaderLabelSelector,
      _hideHeaderLabelSelector,
      _speed,
      _hideEffectStyle,
      _onAreaHide
    } = this;

    element = $(element);

    if (!element.length || !element.hasClass(_visibleAreaClass)) {
      return;
    }

    const topRow = element.siblings(_headerSelector);
    topRow.find(_showHeaderLabelSelector).show();
    topRow.find(_hideHeaderLabelSelector).hide();

    element.slideUp(_speed, _hideEffectStyle, () => {
      element.removeClass(_visibleAreaClass);
      element.hide();

      _onAreaHide(element);
    });
  }

  /// Function which will show the area and convert from collapsed to be displayed one
  // params:
  //  element - accordion hidden area DOM element which will become visible
  //
  _uncollapse(element) {
    const {
      _visibleAreaClass,
      _headerSelector,
      _showHeaderLabelSelector,
      _hideHeaderLabelSelector,
      _speed,
      _hideEffectStyle,
      _onAreaShow
    } = this;

    element = $(element);

    if (!element.length || element.hasClass(_visibleAreaClass)) {
      return;
    }

    if (this.showOne) {
      this._collapseAll(element);
    }

    const topRow = element.siblings(_headerSelector);
    topRow.find(_showHeaderLabelSelector).hide();
    topRow.find(_hideHeaderLabelSelector).show();

    element.addClass(_visibleAreaClass);
    element.slideDown(_speed, _hideEffectStyle, () => {
      element.show();

      _onAreaShow(element);
    });
  }

  /// Function which returns a jQuery element which represent a hidden area
  // params:
  //  rowIndex - integer index of the row of the hidden area
  //
  _getHiddenArea(rowIndex) {
    const { _accordionHideAreas } = this;

    return (rowIndex >= 0 && rowIndex < _accordionHideAreas.length)
      ? $(_accordionHideAreas[rowIndex])
      : undefined;
  }
}

function traverseChildNodes(node, regex) {

    var next;

    if (node.nodeType === 1) {

        // (Element node)

        if (node = node.firstChild) {
            do {
                // Recursively call traverseChildNodes
                // on each child node
                next = node.nextSibling;
                traverseChildNodes(node, regex);
            } while(node = next);
        }

    } else if (node.nodeType === 3) {

        // (Text node)

        if (regex.test(node.data)) {
            wrapMatchesInNode(node, regex);
        }

    }

}

function wrapMatchesInNode(textNode, regex) {
    debugger;
    return textNode.parentNode.innerHTML = textNode.parentNode.innerHTML
      .replace(regex, '<mark>$&</mark>');
    return textNode.textContent.replace(regex, '<mark>$&</mark>');

    debugger;
    var temp = document.createElement('div');
    debugger;
    temp.innerHTML = textNode.data.replace(regex, '<mark>$&</mark>');

    // temp.innerHTML is now:
    // "n    This order's reference number is <a href="/order/RF83297">RF83297</a>.n"
    // |_______________________________________|__________________________________|___|
    //                     |                                      |                 |
    //                 TEXT NODE                             ELEMENT NODE       TEXT NODE

    // Extract produced nodes and insert them
    // before original textNode:
    while (temp.firstChild) {
        console.log(temp.firstChild.nodeType);
        textNode.parentNode.insertBefore(textNode, temp.firstChild);
    }
    // Logged: 3,1,3

    // Remove original text-node:
    textNode.parentNode.removeChild(textNode);

}
