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
//    showSearch - boolean option which will tell accordeon to render search options
//    showOne - boolean option which represents if accordeon can uncollapse only 1 row to the user
//    overallSearch - boolean option which will tell search to look not only in headers but within collapsed areas as well
//    onAreaShow - custom callback which will be called after making visible an accordeon's area
//    onAreaHide - user defined callback which will be called after hiding an accordeon's area
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
    overallSearch: false,
    onAreaShow: undefined,
    onAreaHide: undefined
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
    return (rowIndex >= 0 && rowIndex < this._accordeonHideAreas.length) ? $(this._accordeonItems[rowIndex]) : undefined;
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
        parentPrefix = options.parentSelector ? options.parentSelector.substring(1) : undefined,
        accordeonItemSelector = options.accordeonItemSelector,
        hiddenAreaSelector = options.hiddenAreaSelector,
        headerSelector = options.headerSelector,
        headerLinkClass = 'a11yAccordeonItemHeaderLink',
        headerTextClass = 'a11yAccordeonItemHeaderText',
        hiddenHeaderLabelDescriptionClass = 'a11yAccordeonItemHeaderLinkHiddenLabel',
        noResultsDivID = parentPrefix + '-noResultsItem',
        noResultsDivClass = 'a11yAccordeonNoResultsItem',
        searchDivID = parentPrefix + '-searchPanel',
        searchDivClass = 'a11yAccordeonSearchDiv',
        rowIdString = parentPrefix + '-row-',
        colorScheme = options.colorScheme,
        accordeonHeaderClass = colorScheme + '-a11yAccordeon-header',
        accordeonHideAreaClass = colorScheme + '-a11yAccordeon-area',
        showHeaderLabelText = 'Show',
        hideHeaderLabelText = 'Hide';

    this._onAreaShow = options.onAreaShow ? options.onAreaShow : function() {};
    this._onAreaHide = options.onAreaHide ? options.onAreaHide : function() {};
    this._headerSelector = headerSelector;
    this._speed = options.speed;
    this._visibleAreaClass = options.visibleAreaClass;
    this._accordeonItems = parentDiv.find(accordeonItemSelector);
    this.showOne = options.showOne;

    var headers = this._accordeonItems.find(headerSelector);
    this._accordeonHideAreas = this._accordeonItems.find(hiddenAreaSelector);

    // check that our initialization is proper
    if (!parentDiv.length) {
      throw 'a11yAccordeon - no element(s) with parentSelector was found';
    } else if (!this._accordeonItems.length) {
      throw 'a11yAccordeon - no element(s) with accordeonItemSelector was found';
    } else if (!headers.length) {
      throw 'a11yAccordeon - no element(s) with headerSelector was found';
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
      $(header).wrapInner('<span class="' + headerTextClass + '"></span>');
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
      'class': headerSelector.substring(1) + ' ' + accordeonHeaderClass,
      text: noResultsText
    }).appendTo(wrapperLi);

    // Set an id to each row
    this._accordeonItems.each(function initAccordeonItemsEach(index, item) {
      item.setAttribute('id', rowIdString + index);
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

      results = parentDiv.find(headerSelector + ':visible').length;
      searchInput.attr('title', resultsMessage + results.toString() + leaveBlankMessage);

      if (!results) {
        wrapperLi.show();
      }
    }.bind(this));
  },

  /// Function which is executed upon the link click. It will either hide the related area OR show the area and hide all other ones
  // params:
  //  element - accordeon hidden area DOM element which will become hidden or visible depending on its previous state
  //
  _collapseWork: function A11yAccordeon__collapseWork(element) {
    element = $(element);

    if (!element) {
      return;
    }

    this[element.hasClass(this._visibleAreaClass)? '_collapse' : '_uncollapse'](element);
  },

  /// Function which will collapse all areas
  //
  _collapseAll: function A11yAccordeon__collapseAll() {
    var a11yAccordeon = this;

    $.each(this._accordeonHideAreas.filter('.' + this._visibleAreaClass), function collapseAllEach(index, element) {
      a11yAccordeon._collapse(element);
    });
  },

  /// Function which will collapses one element
  // params:
  //  element - accordeon hidden area DOM element which will become hidden
  //
  _collapse: function A11yAccordeon__collapse(element) {
    var visibleAreaClass = this._visibleAreaClass;

    element = $(element);

    if (!element.length || !element.hasClass(visibleAreaClass)) {
      return;
    }

    var topRow = element.siblings(this._headerSelector);
    topRow.find(this._showHeaderLabelSelector).show();
    topRow.find(this._hideHeaderLabelSelector).hide();

    element.slideUp(this._speed, this._hideEffectStyle, function collapseSlideUp() {
      element.removeClass(visibleAreaClass);
      element.hide();

      this._onAreaHide(element);
    }.bind(this));
  },

  /// Function which will show the area and convert from collapsed to be displayed one
  // params:
  //  element - accordeon hidden area DOM element which will become visible
  //
  _uncollapse: function A11yAccordeon__uncollapse(element) {
    var visibleAreaClass = this._visibleAreaClass;

    element = $(element);

    if (!element.length || element.hasClass(visibleAreaClass)) {
      return;
    }

    if (this.showOne) {
      this._collapseAll(element);
    }

    var topRow = element.siblings(this._headerSelector);
    topRow.find(this._showHeaderLabelSelector).hide();
    topRow.find(this._hideHeaderLabelSelector).show();

    element.addClass(visibleAreaClass);
    element.slideDown(this._speed, this._hideEffectStyle, function collapseSlideUp() {
      element.show();

      this._onAreaShow(element);
    }.bind(this));
  },

  /// Function which returns a jQuery element which represent a hidden area
  // params:
  //  rowIndex - integer index of the row of the hidden area
  //
  _getHiddenArea: function A11yAccordeon__getHiddenArea(rowIndex) {
    return (rowIndex >= 0 && rowIndex < this._accordeonHideAreas.length) ? $(this._accordeonHideAreas[rowIndex]) : undefined;
  },

  _hideEffectStyle: 'linear',
  _showHeaderLabelSelector: '.a11yAccordeonItemHeaderLinkShowLabel',
  _hideHeaderLabelSelector: '.a11yAccordeonItemHeaderLinkHideLabel',
  _headerSelector: null,
  _accordeonItems: null,
  _visibleAreaClass: null,
  _accordeonHideAreas: null,
  _speed: null,
  _onAreaShow: null,
  _onAreaHide: null

};