'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var A11yAccordion = function () {
  function A11yAccordion() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, A11yAccordion);

    var constants = {
      SEARCH_ACTION_TYPE_HIDE: 'hide',
      SEARCH_ACTION_TYPE_COLLAPSE: 'collapse'
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
    var defaults = {
      constants: constants,
      parentSelector: undefined,
      hideEffectStyle: 'linear',
      speed: 300,
      hiddenLinkDescription: '',
      showSearch: true,
      showOne: true,
      searchActionType: constants.SEARCH_ACTION_TYPE_HIDE,
      overallSearch: false,
      onAreaShow: function onAreaShow() {},
      onAreaHide: function onAreaHide() {},
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
        accordionHeaderClass: 'a11yAccordion-header',
        accordionHideAreaClass: 'a11yAccordion-area'
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
        noResultsDivID: 'a11yAccordion-noResultsItem',
        searchDivID: 'a11yAccordion-searchPanel',
        rowIdStringPrefix: 'a11yAccordion-row-'
      },
      attributes: {
        hiddenLinkDescription: 'data-a11yAccordion-hiddenLinkDescription'
      }
    };

    options = _extends({}, defaults, options);

    var _options = options;
    var classes = _options.classes;


    options = _extends({}, options, {
      selectors: {
        triangleSelector: '.' + classes.triangleClass,
        visibleAreaSelector: '.' + classes.visibleAreaClass,
        markedTextSelector: '.' + classes.markedTextClass,
        headerLinkSelector: '.' + classes.headerLinkClass,
        headerSelector: '.' + classes.headerClass,
        showHeaderLabelSelector: '.' + classes.showHeaderLabelClass,
        hideHeaderLabelSelector: '.' + classes.hideHeaderLabelClass,
        accordionItemSelector: '.' + classes.accordionItemClass,
        hiddenAreaSelector: '.' + classes.hiddenAreaClass
      }
    });

    this.props = options;

    this._render();
  }

  /// Public functions and variables

  /// Function which will hide hidden area in the row with index = rowIndex
  // params:
  //  rowIndex - integer index of the row
  //


  _createClass(A11yAccordion, [{
    key: 'collapseRow',
    value: function collapseRow(rowIndex) {
      var _collapse = this._collapse;
      var _getHiddenArea = this._getHiddenArea;


      _collapse(_getHiddenArea(rowIndex));
    }

    /// Function which will show hidden area in the row with index = rowIndex
    // params:
    //  rowIndex - integer index of the row
    //

  }, {
    key: 'uncollapseRow',
    value: function uncollapseRow(rowIndex) {
      var _uncollapse = this._uncollapse;
      var _getHiddenArea = this._getHiddenArea;


      _uncollapse(_getHiddenArea(rowIndex));
    }

    /// Function which will hide or show hidden area in the row with index = rowIndex depending on its previous state
    // params:
    //  rowIndex - integer index of the row
    //

  }, {
    key: 'toggleRow',
    value: function toggleRow(rowIndex) {
      var _collapseWork = this._collapseWork;
      var _getHiddenArea = this._getHiddenArea;


      _collapseWork(_getHiddenArea(rowIndex));
    }

    /// Function which will return a jQuery row element with index = rowIndex
    // params:
    //  rowIndex - integer index of the row
    //

  }, {
    key: 'getRowEl',
    value: function getRowEl(rowIndex) {
      var _refs = this.refs;
      var accordionHideAreas = _refs.accordionHideAreas;
      var accordionItems = _refs.accordionItems;


      return rowIndex >= 0 && rowIndex < accordionHideAreas.length ? $(accordionItems[rowIndex]) : undefined;
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

  }, {
    key: '_render',
    value: function _render() {
      var props = this.props;
      var _collapseWork = this._collapseWork;
      var parentSelector = props.parentSelector;
      var hiddenLinkDescription = props.hiddenLinkDescription;
      var onAreaShow = props.onAreaShow;
      var onAreaHide = props.onAreaHide;
      var speed = props.speed;
      var showSearch = props.showSearch;
      var searchActionType = props.searchActionType;
      var classes = props.classes;
      var labels = props.labels;
      var selectors = props.selectors;
      var attributes = props.attributes;
      var constants = props.constants;
      var visibleAreaClass = classes.visibleAreaClass;
      var headerLinkClass = classes.headerLinkClass;
      var headerTextClass = classes.headerTextClass;
      var hiddenHeaderLabelDescriptionClass = classes.hiddenHeaderLabelDescriptionClass;
      var toggleClass = classes.toggleClass;
      var triangleClass = classes.triangleClass;
      var accordionHeaderClass = classes.accordionHeaderClass;
      var accordionHideAreaClass = classes.accordionHideAreaClass;
      var showHeaderLabelClass = classes.showHeaderLabelClass;
      var hideHeaderLabelClass = classes.hideHeaderLabelClass;
      var showHeaderLabelText = labels.showHeaderLabelText;
      var hideHeaderLabelText = labels.hideHeaderLabelText;
      var showHeaderLabelSelector = selectors.showHeaderLabelSelector;
      var hideHeaderLabelSelector = selectors.hideHeaderLabelSelector;
      var headerSelector = selectors.headerSelector;
      var headerLinkSelector = selectors.headerLinkSelector;
      var accordionItemSelector = selectors.accordionItemSelector;
      var hiddenAreaSelector = selectors.hiddenAreaSelector;


      var parentDiv = $(parentSelector);
      var accordionItems = parentDiv.find('> ' + accordionItemSelector);
      var accordionHideAreas = accordionItems.find('> ' + hiddenAreaSelector);
      var headers = accordionItems.find('> ' + headerSelector);

      // store component's DOM elements
      this.refs = {
        el: parentDiv,
        accordionItems: accordionItems,
        accordionHideAreas: accordionHideAreas,
        headers: headers
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
      } else if (searchActionType !== constants.SEARCH_ACTION_TYPE_HIDE && searchActionType !== constants.SEARCH_ACTION_TYPE_COLLAPSE) {
        throw 'a11yAccordion - invalid searchActionType. It can only be: ' + constants.SEARCH_ACTION_TYPE_HIDE + ' or ' + constants.SEARCH_ACTION_TYPE_COLLAPSE;
      }

      // hide all areas by default
      accordionHideAreas.hide();

      // apply color scheme
      headers.addClass(accordionHeaderClass);
      accordionHideAreas.addClass(accordionHideAreaClass);

      // function for show/hide link clicks. We predefine the function not to define it in the loop
      var linkClick = function linkClick(event) {
        event.preventDefault();
        event.stopPropagation();
        var accordionItem = $(event.target).parents(accordionItemSelector).eq(0); // to avoid execution on nested accordions
        _collapseWork(accordionItem.find('> ' + hiddenAreaSelector).eq(0));
        accordionItem.find(headerLinkSelector).eq(0).focus();
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
          'class': showHeaderLabelClass
        }));

        spans.push($('<span>', {
          text: hideHeaderLabelText,
          style: 'display: none;',
          'class': hideHeaderLabelClass
        }));

        var assistiveLinkDescription = header.getAttribute(attributes.hiddenLinkDescription) || hiddenLinkDescription;

        spans.push($('<span>', {
          text: assistiveLinkDescription,
          'class': hiddenHeaderLabelDescriptionClass
        }));

        spans.push($('<div>', {
          'class': triangleClass
        }));

        // bulk DOM insert for spans
        $(header).wrapInner('<span class="' + headerTextClass + '"></span>');
        link.prepend(spans).appendTo(header);
      });

      // if there is NO search option then return component right away
      if (showSearch) {
        this._renderSearch();
      }
    }

    /// Rendering search DOM
    //

  }, {
    key: '_renderSearch',
    value: function _renderSearch() {
      var refs = this.refs;
      var props = this.props;
      var collapseRow = this.collapseRow;
      var uncollapseRow = this.uncollapseRow;
      var _traverseChildNodes = this._traverseChildNodes;
      var _getHiddenArea = this._getHiddenArea;
      var overallSearch = props.overallSearch;
      var classes = props.classes;
      var ids = props.ids;
      var labels = props.labels;
      var selectors = props.selectors;
      var searchActionType = props.searchActionType;
      var constants = props.constants;
      var el = refs.el;
      var accordionItems = refs.accordionItems;
      var accordionHideAreas = refs.accordionHideAreas;
      var headers = refs.headers;
      var noResultsDivID = ids.noResultsDivID;
      var searchDivID = ids.searchDivID;
      var rowIdStringPrefix = ids.rowIdStringPrefix;
      var markedTextClass = classes.markedTextClass;
      var noResultsDivClass = classes.noResultsDivClass;
      var searchDivClass = classes.searchDivClass;
      var searchClass = classes.searchClass;
      var accordionHeaderClass = classes.accordionHeaderClass;
      var headerClass = classes.headerClass;
      var searchPlaceholder = labels.searchPlaceholder;
      var noResultsText = labels.noResultsText;
      var titleText = labels.titleText;
      var resultsMessage = labels.resultsMessage;
      var leaveBlankMessage = labels.leaveBlankMessage;
      var markedTextSelector = selectors.markedTextSelector;
      var headerSelector = selectors.headerSelector;


      var wrapperDiv = $('<div>', {
        id: searchDivID,
        'class': searchDivClass
      });

      var searchInput = $('<input>', {
        type: 'text',
        placeholder: searchPlaceholder,
        'class': searchClass,
        title: titleText
      }).appendTo(wrapperDiv);

      var wrapperLi = $('<li>', {
        'class': noResultsDivClass,
        id: noResultsDivID,
        style: 'display:none;'
      }).appendTo(el);

      $('<div>', {
        'class': headerClass + ' ' + accordionHeaderClass,
        text: noResultsText
      }).appendTo(wrapperLi);

      // Set an id to each row
      accordionItems.each(function initaccordionItemsEach(index, item) {
        item.setAttribute('id', rowIdStringPrefix + index);
      });

      wrapperDiv.prependTo(el);

      var searchValue = '';

      // Bind search function to input field
      searchInput.keyup(function (event) {
        var value = event.target.value;
        // lowercase search string

        var searchString = value.toLowerCase();

        // if value did not change then nothing to do
        if (searchValue === searchString) {
          return;
        }

        searchValue = searchString;

        // hide no results found <li>
        wrapperLi.hide();

        var regex = new RegExp(searchString, 'ig');

        for (var i = 0, action; i < accordionItems.length; i++) {
          var headerTextNode = headers[i].children[0];

          // remove all markings from the DOM
          $(headerTextNode).find(markedTextSelector).each(function (index, element) {
            return $(element).contents().unwrap();
          });
          headerTextNode.normalize();

          // only if there is something in the input only then perform search
          action = searchString.length ? _traverseChildNodes(headerTextNode, regex, markedTextClass) : true;

          if (overallSearch) {
            var bodyTextNode = accordionHideAreas[i];

            // remove all markings from the DOM
            $(bodyTextNode).find(markedTextSelector).each(function (index, element) {
              return $(element).contents().unwrap();
            });
            bodyTextNode.normalize();

            // only if there is something in the input
            // and only if we could not find matching string in header
            // only then perform search
            action = searchString.length && !action ? _traverseChildNodes(bodyTextNode, regex, markedTextClass) : true;
          }

          // action on the item. Hide or Show
          if (searchActionType === constants.SEARCH_ACTION_TYPE_HIDE) {
            $(accordionItems[i])[action ? 'show' : 'hide']();
          } else if (searchActionType === constants.SEARCH_ACTION_TYPE_COLLAPSE) {
            var hiddenArea = _getHiddenArea(i);
            var hiddenAreaDisplay = hiddenArea[0].style.display;
            if (!searchString.length && hiddenAreaDisplay === 'block') {
              collapseRow(i);
            } else if (hiddenAreaDisplay === 'none' && action) {
              uncollapseRow(i);
            } else if (hiddenAreaDisplay === 'block' && !action) {
              collapseRow(i);
            }
          }
        }

        var results = accordionHideAreas.filter(':visible').length;
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

  }, {
    key: '_collapseWork',
    value: function _collapseWork(element) {
      var classes = this.props.classes;
      var visibleAreaClass = classes.visibleAreaClass;


      if (!element) {
        return;
      }

      this[element.hasClass(visibleAreaClass) ? '_collapse' : '_uncollapse'](element);
    }

    /// Function which will collapse all areas
    //

  }, {
    key: '_collapseAll',
    value: function _collapseAll() {
      var refs = this.refs;
      var props = this.props;
      var _collapse = this._collapse;
      var visibleAreaSelector = props.selectors.visibleAreaSelector;
      var accordionHideAreas = refs.accordionHideAreas;


      var visibleAreas = accordionHideAreas.filter(visibleAreaSelector);

      $.each(visibleAreas, function (index, element) {
        return _collapse(element);
      });
    }

    /// Function which will collapses one element
    // params:
    //  element - accordion hidden area DOM element which will become hidden
    //

  }, {
    key: '_collapse',
    value: function _collapse(element) {
      var props = this.props;
      var onAreaHide = props.onAreaHide;
      var speed = props.speed;
      var classes = props.classes;
      var selectors = props.selectors;
      var hideEffectStyle = props.hideEffectStyle;
      var toggleClass = classes.toggleClass;
      var visibleAreaClass = classes.visibleAreaClass;
      var headerSelector = selectors.headerSelector;
      var showHeaderLabelSelector = selectors.showHeaderLabelSelector;
      var hideHeaderLabelSelector = selectors.hideHeaderLabelSelector;
      var triangleSelector = selectors.triangleSelector;


      element = $(element);

      if (!element.length || !element.hasClass(visibleAreaClass)) {
        return;
      }

      var topRow = element.siblings(headerSelector);

      topRow.find(showHeaderLabelSelector).show();
      topRow.find(hideHeaderLabelSelector).hide();
      topRow.find(triangleSelector).toggleClass(toggleClass);

      element.slideUp(speed, hideEffectStyle, function () {
        element.removeClass(visibleAreaClass);
        element.hide();

        onAreaHide(element);
      });
    }

    /// Function which will show the area and convert from collapsed to be displayed one
    // params:
    //  element - accordion hidden area DOM element which will become visible
    //

  }, {
    key: '_uncollapse',
    value: function _uncollapse(element) {
      var props = this.props;
      var _collapseAll = this._collapseAll;
      var onAreaShow = props.onAreaShow;
      var speed = props.speed;
      var classes = props.classes;
      var selectors = props.selectors;
      var hideEffectStyle = props.hideEffectStyle;
      var showOne = props.showOne;
      var toggleClass = classes.toggleClass;
      var visibleAreaClass = classes.visibleAreaClass;
      var headerSelector = selectors.headerSelector;
      var showHeaderLabelSelector = selectors.showHeaderLabelSelector;
      var hideHeaderLabelSelector = selectors.hideHeaderLabelSelector;
      var triangleSelector = selectors.triangleSelector;


      element = $(element);

      if (!element.length || element.hasClass(visibleAreaClass)) {
        return;
      }

      if (showOne) {
        _collapseAll(element);
      }

      var topRow = element.siblings(headerSelector);

      topRow.find(showHeaderLabelSelector).hide();
      topRow.find(hideHeaderLabelSelector).show();
      topRow.find(triangleSelector).toggleClass(toggleClass);

      element.addClass(visibleAreaClass);
      element.slideDown(speed, hideEffectStyle, function () {
        element.show();

        onAreaShow(element);
      });
    }

    /// Function which returns a jQuery element which represent a hidden area
    // params:
    //  rowIndex - integer index of the row of the hidden area
    //

  }, {
    key: '_getHiddenArea',
    value: function _getHiddenArea(rowIndex) {
      var accordionHideAreas = this.refs.accordionHideAreas;


      return rowIndex >= 0 && rowIndex < accordionHideAreas.length ? $(accordionHideAreas[rowIndex]) : undefined;
    }

    // this function is based on
    // http://james.padolsey.com/javascript/replacing-text-in-the-dom-its-not-that-simple/

  }, {
    key: '_traverseChildNodes',
    value: function _traverseChildNodes(node, regex, markedTextClass) {
      var _this = this;

      // if node is a text node andstring appears in text
      if (node.nodeType === 3 && regex.test(node.data)) {
        if (node.textContent.match(regex)) {
          var temp = document.createElement('div');

          temp.innerHTML = node.data.replace(regex, '<mark class="' + markedTextClass + '">$&</mark>');
          while (temp.firstChild) {
            node.parentNode.insertBefore(temp.firstChild, node);
          }
          node.parentNode.removeChild(node);

          return true;
        }
        return;
      }

      var childNodes = node.childNodes;


      if (!childNodes.length) {
        return;
      }

      var foundMatch = void 0;

      $(childNodes).each(function (index, node) {
        foundMatch = _this._traverseChildNodes(node, regex, markedTextClass) || foundMatch;
      });

      return foundMatch;
    }
  }]);

  return A11yAccordion;
}();