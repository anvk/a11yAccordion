/*global $*/

/// This function would create an accordeon based on the markup and provided options
// params:
//  options which consist of:
//    parentSelector - selector for HTML element to which a11y accordeon markup and functionality will be applied
//    hiddenAreaSelector - HTML element which will be hidden/shown
//    headerSelector - jQuery selector for the header of each a11yAccordeonItem
//    visibleAreaClass - Class which will be applied to every uncollapsed accordeon element
//    speed - speed of collapsing animation
//    hiddenLinkDescription - some string which will be played by AT once user has a keyboard focus on Show/Hide link
//
var A11yAccordeon = function(options) {

  this.collapseRow = this.collapseRow.bind(this);
  this.uncollapseRow = this.uncollapseRow.bind(this);
  this.toggleRow = this.toggleRow.bind(this);
  this.getRowEl = this.getRowEl.bind(this);

  this._init = this._init.bind(this);
  this._collapseWork = this._collapseWork.bind(this);
  this._collapseAll = this._collapseAll.bind(this);
  this._collapse = this._collapse.bind(this);
  this._uncollapse = this._uncollapse.bind(this);
  this._checkIfIndexCorrect = this._checkIfIndexCorrect.bind(this);
  this._getHiddenArea = this._getHiddenArea.bind(this);

  // options which will be passed into the components with their default values
  var defaults = {
    parentSelector: undefined,
    accordeonItemSelector: '.a11yAccordeonItem',
    headerSelector: '.a11yAccordeonItemHeader',
    hiddenAreaSelector: '.a11yAccordeonHideArea',
    visibleAreaClass: 'visibleA11yAccordeonItem',
    colorScheme: 'light',
    speed: 300,
    hiddenLinkDescription: '',
    showSearch: true,
    showOne: true,
    overallSearch: false
  };

  options = $.extend({}, defaults, options);
  this._init(options);
};

A11yAccordeon.prototype = {


  /// Public functions and variables


  /// Function which will hide hidden area in the row with index = rowIndex
  // params:
  //  rowIndex - integer index of the row
  //
  collapseRow: function A11yAccordeon_collapseRow(rowIndex) {
    this._collapse(this._getHiddenArea(rowIndex));
  },

  /// Function which will show hidden area in the row with index = rowIndex
  // params:
  //  rowIndex - integer index of the row
  //
  uncollapseRow: function A11yAccordeon_uncollapseRow(rowIndex) {
    this._uncollapse(this._getHiddenArea(rowIndex));
  },

  /// Function which will hide or show hidden area in the row with index = rowIndex depending on its previous state
  // params:
  //  rowIndex - integer index of the row
  //
  toggleRow: function A11yAccordeon_toggleRow(rowIndex) {
    this._collapseWork(this._getHiddenArea(rowIndex));
  },

  /// Function which will return a jQuery row element with index = rowIndex
  // params:
  //  rowIndex - integer index of the row
  //
  getRowEl: function A11yAccordeon_getRowEl(rowIndex) {
    return (this._checkIfIndexCorrect(rowIndex)) ? $(this._accordeonItems[rowIndex - 1]) : undefined;
  },

  /// Function which will make row disabled and immune to the user clicks
  // params:
  //  rowIndex - integer index of the row
  //
  // enableRow: function A11yAccordeon_enableRow(rowIndex) {

  // };

  /// Function which will make row enabled and available for the user clicks
  // params:
  //  rowIndex - integer index of the row
  //
  // disableRow: function A11yAccordeon_disableRow(rowIndex) {

  // };

  el: null,
  showOne: null,


  /// Private functions and variables


  /// Starting point
  //
  _init: function A11yAccordeon__init(options) {
    var parentDiv = $(options.parentSelector),
        accordeonItemSelector = options.accordeonItemSelector,
        hiddenAreaSelector = options.hiddenAreaSelector,
        headerLinkClass = 'a11yAccordeonItemHeaderLink',
        hiddenHeaderLabelDescriptionClass = 'hiddenLabel',
        noResultsIDString = 'no-results-found',
        searchDivIDString = 'a11yAccordeonSearchDiv',
        rowIdString = 'accordeon-row-',
        colorScheme = options.colorScheme,
        accordeonHeaderClass = colorScheme + '-a11yAccordeon-header',
        accordeonHideAreaClass = colorScheme + '-a11yAccordeon-area',
        showHeaderLabelText = 'Show',
        hideHeaderLabelText = 'Hide';

    this._headerSelector = options.headerSelector;
    this._speed = options.speed;
    this._visibleAreaClass = options.visibleAreaClass;
    this._accordeonItems = parentDiv.find(accordeonItemSelector);
    this.showOne = options.showOne;

    var headers = this._accordeonItems.find(this._headerSelector);
    this._accordeonHideAreas = this._accordeonItems.find(hiddenAreaSelector);

    // check that our initialization is proper
    if (!headers.length) {
      throw 'a11yAccordeon - no headers were found';
    } else if (!this._accordeonItems.length) {
      throw 'a11yAccordeon - no accordeonItems were found. There are no rows in accordeon to create it';
    } else if (!this._visibleAreaClass) {
      throw 'a11yAccordeon - no visibleAreaClass was specified. This class is used to determine what is collapsed and what is not';
    } else if (!parentDiv.length) {
      throw 'a11yAccordeon - no element(s) with parentSelector was found';
    } else if (!this._accordeonHideAreas.length) {
      throw 'a11yAccordeon - no element(s) with hiddenAreaSelector was found';
    }

    // store component's DOM element
    this.el = parentDiv;

    // hide all areas by default
    this._accordeonHideAreas.hide();

    // apply color scheme
    headers.addClass(accordeonHeaderClass);
    this._accordeonHideAreas.addClass(accordeonHideAreaClass);

    // function for show/hide link clicks. We predefine the function not to define it in the loop
    var linkClick = function(event) {
      event.preventDefault();
      event.stopPropagation();
      var accordeonItem = $(event.target).parents(accordeonItemSelector);
      this._collapseWork(accordeonItem.find(hiddenAreaSelector));
      accordeonItem.find('.' + headerLinkClass).focus();
    }.bind(this);

    // bind headers to a click event
    headers.click(linkClick);

    // generate assistive links
    $.each(headers, function initHeadersEach(index, header) {
      var link = $('<a>', {
            href: '#',
            'class': headerLinkClass
          }),
          spans = [];

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
      link.prepend(spans).appendTo(header);
    }.bind(this));

    // if there is NO search option then return component right away
    if (!options.showSearch) {
      return;
    }

    var searchPlaceholder = 'Search',
        searchClass = 'a11yAccordeonSearch',
        noResultsText = 'No Results Found',
        titleText = 'Type your query to search',
        resultsMessage = 'Number of results found: ',
        leaveBlankMessage = ' Please leave blank to see all the results.',
        wrapperDiv, wrapperLi, searchInput, searchString, results;

    wrapperDiv = $('<div />', {
      id: searchDivIDString
    });

    searchInput = $('<input />', {
      type: 'text',
      placeholder: searchPlaceholder,
      'class': searchClass,
      title: titleText
    }).appendTo(wrapperDiv);

    wrapperLi = $('<li />', {
      'class': accordeonItemSelector.substring(1),
      id: noResultsIDString,
      style: 'display:none;'
    }).appendTo(parentDiv);

    $('<div />', {
      'class': this._headerSelector.substring(1) + ' ' + accordeonHeaderClass,
      text: noResultsText
    }).appendTo(wrapperLi);

    // Set an id to each row
    this._accordeonItems.each(function initAccordeonItemsEach(index, item) {
      item.setAttribute('id', rowIdString + (++index));
    });

    wrapperDiv.prependTo(parentDiv);

    // Bind search function to input field
    searchInput.keyup(function searchInputKeyup() {
      wrapperLi.hide();

      searchString = searchInput.val().toLowerCase();

      headers.each(function searchInputKeyupEach(index, data) {
        var action = ((data.children[0].textContent.toLowerCase().indexOf(searchString) !== -1) ||
                      (options.overallSearch && this._accordeonHideAreas[index].textContent.toLowerCase().indexOf(searchString) !== -1)) ? 'show' : 'hide';
        $(this._accordeonItems[index])[action]();
      }.bind(this));

      results = parentDiv.find(this._headerSelector + ':visible').length;
      searchInput.attr('title', resultsMessage + results.toString() + leaveBlankMessage);

      if (!results) {
        wrapperLi.show();
      }
    }.bind(this));
  },

  /// Function which is executed upon the link click. It will either hide the related area OR show the area and hide all other ones
  // params:
  //  element - element which relates to the link being clicked
  //
  _collapseWork: function A11yAccordeon__collapseWork(element) {
    if (!element) {
      return;
    }

    if (element.hasClass(this._visibleAreaClass)) {
      this._collapse(element);
    } else {
      if (this.showOne) {
        this._collapseAll();
      }
      this._uncollapse(element);
    }
  },

  /// Function which will collapse all areas
  //
  _collapseAll: function A11yAccordeon__collapseAll() {
    $.each(this._accordeonHideAreas.filter('.' + this._visibleAreaClass), function collapseAllEach(index, element) {
      this._collapse($(element));
    }.bind(this));
  },

  /// Function which will collapses one element
  // params:
  //  element - element which relates to the link being clicked
  //
  _collapse: function A11yAccordeon__collapse(element) {
    if (!element || !element.hasClass(this._visibleAreaClass)) {
      return;
    }

    var topRow = element.siblings(this._headerSelector);
    topRow.find(this._showHeaderLabelSelector).show();
    topRow.find(this._hideHeaderLabelSelector).hide();

    element.slideUp(this._speed, this._hideEffectStyle, function collapseSlideUp() {
      element.removeClass(this._visibleAreaClass);
      element.hide();
    }.bind(this));
  },

  /// Function which will show the area and convert from collapsed to be displayed one
  // params:
  //  element - element which will be shown
  //
  _uncollapse: function A11yAccordeon__uncollapse(element) {
    if (!element || element.hasClass(this._visibleAreaClass)) {
      return;
    }

    var topRow = element.siblings(this._headerSelector);
    topRow.find(this._showHeaderLabelSelector).hide();
    topRow.find(this._hideHeaderLabelSelector).show();

    element.addClass(this._visibleAreaClass);
    element.slideDown(this._speed, this._hideEffectStyle, function uncollapseSlideDown() {
      element.show();
    });
  },

  /// Function which returns true if rowIndex is within range of the accordeon's existing collapsible elements
  // params:
  //  rowIndex - integer index of the row
  //
  _checkIfIndexCorrect: function A11yAccordeon__checkIfIndexCorrect(rowIndex) {
    return (rowIndex > 0 && rowIndex <= this._accordeonHideAreas.length);
  },

  /// Function which returns a jQuery element which represent a hidden area
  // params:
  //  rowIndex - integer index of the row of the hidden area
  //
  _getHiddenArea: function A11yAccordeon__getHiddenArea(rowIndex) {
    return (this._checkIfIndexCorrect(rowIndex)) ? $(this._accordeonHideAreas[rowIndex - 1]) : undefined;
  },

  _hideEffectStyle: 'linear',
  _showHeaderLabelSelector: '.showLabel',
  _hideHeaderLabelSelector: '.hideLabel',
  _headerSelector: null,
  _accordeonItems: null,
  _visibleAreaClass: null,
  _accordeonHideAreas: null,
  _speed: null

};