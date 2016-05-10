'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var A11yAccordion = function () {
  function A11yAccordion() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, A11yAccordion);

    this.el = null;
    this.showOne = null;

    this._constants = {
      SEARCH_ACTION_TYPE_HIDE: 'hide',
      SEARCH_ACTION_TYPE_COLLAPSE: 'collapse'
    };
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
    var defaults = {
      parentSelector: undefined,
      accordionItemSelector: '.a11yAccordionItem',
      headerSelector: '.a11yAccordionItemHeader',
      hiddenAreaSelector: '.a11yAccordionHideArea',
      colorScheme: 'light',
      speed: 300,
      hiddenLinkDescription: '',
      showSearch: true,
      showOne: true,
      searchActionType: this._constants.SEARCH_ACTION_TYPE_HIDE,
      overallSearch: false,
      onAreaShow: function onAreaShow() {},
      onAreaHide: function onAreaHide() {},
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
      }
    };

    options = _extends({}, defaults, options);

    var _options = options;
    var colorScheme = _options.colorScheme;
    var parentSelector = _options.parentSelector;

    var parentPrefix = parentSelector ? parentSelector.substring(1) : undefined;

    options = _extends({}, options, {
      classes: _extends({}, options.classes, {
        accordionHeaderClass: colorScheme + '-a11yAccordion-header',
        accordionHideAreaClass: colorScheme + '-a11yAccordion-area'
      }),
      ids: {
        noResultsDivID: parentPrefix + '-noResultsItem',
        searchDivID: parentPrefix + '-searchPanel',
        rowIdStringPrefix: parentPrefix + '-row-'
      }
    });

    this._render(options);
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
      var _accordionHideAreas = this._accordionHideAreas;
      var _accordionItems = this._accordionItems;


      return rowIndex >= 0 && rowIndex < _accordionHideAreas.length ? $(_accordionItems[rowIndex]) : undefined;
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

  }, {
    key: '_render',
    value: function _render() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var parentSelector = options.parentSelector;
      var accordionItemSelector = options.accordionItemSelector;
      var hiddenAreaSelector = options.hiddenAreaSelector;
      var headerSelector = options.headerSelector;
      var hiddenLinkDescription = options.hiddenLinkDescription;
      var colorScheme = options.colorScheme;
      var onAreaShow = options.onAreaShow;
      var onAreaHide = options.onAreaHide;
      var speed = options.speed;
      var showOne = options.showOne;
      var showSearch = options.showSearch;
      var overallSearch = options.overallSearch;
      var searchActionType = options.searchActionType;
      var classes = options.classes;
      var ids = options.ids;
      var labels = options.labels;
      var markedTextClass = classes.markedTextClass;
      var visibleAreaClass = classes.visibleAreaClass;
      var noResultsDivClass = classes.noResultsDivClass;
      var searchDivClass = classes.searchDivClass;
      var headerLinkClass = classes.headerLinkClass;
      var headerTextClass = classes.headerTextClass;
      var hiddenHeaderLabelDescriptionClass = classes.hiddenHeaderLabelDescriptionClass;
      var toggleClass = classes.toggleClass;
      var triangleClass = classes.triangleClass;
      var searchClass = classes.searchClass;
      var accordionHeaderClass = classes.accordionHeaderClass;
      var accordionHideAreaClass = classes.accordionHideAreaClass;
      var noResultsDivID = ids.noResultsDivID;
      var searchDivID = ids.searchDivID;
      var rowIdStringPrefix = ids.rowIdStringPrefix;
      var showHeaderLabelText = labels.showHeaderLabelText;
      var hideHeaderLabelText = labels.hideHeaderLabelText;
      var searchPlaceholder = labels.searchPlaceholder;
      var noResultsText = labels.noResultsText;
      var titleText = labels.titleText;
      var resultsMessage = labels.resultsMessage;
      var leaveBlankMessage = labels.leaveBlankMessage;
      var _collapseWork = this._collapseWork;
      var _constants = this._constants;
      var _showHeaderLabelSelector = this._showHeaderLabelSelector;
      var _hideHeaderLabelSelector = this._hideHeaderLabelSelector;


      var parentDiv = $(parentSelector);

      this._onAreaShow = onAreaShow;
      this._onAreaHide = onAreaHide;
      this._headerSelector = headerSelector;
      this._speed = speed;
      this._visibleAreaClass = visibleAreaClass;
      this._triangleClass = triangleClass;
      this._toggleClass = toggleClass;
      this._accordionItems = parentDiv.find(accordionItemSelector);
      this.showOne = showOne;

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
      } else if (searchActionType !== _constants.SEARCH_ACTION_TYPE_HIDE && searchActionType !== _constants.SEARCH_ACTION_TYPE_COLLAPSE) {
        throw 'a11yAccordion - invalid searchActionType. It can only be: ' + _constants.SEARCH_ACTION_TYPE_HIDE + ' or ' + _constants.SEARCH_ACTION_TYPE_COLLAPSE;
      }

      // store component's DOM element
      this.el = parentDiv;

      // hide all areas by default
      this._accordionHideAreas.hide();

      // apply color scheme
      headers.addClass(accordionHeaderClass);
      this._accordionHideAreas.addClass(accordionHideAreaClass);

      // function for show/hide link clicks. We predefine the function not to define it in the loop
      var linkClick = function linkClick(event) {
        event.preventDefault();
        event.stopPropagation();
        var accordionItem = $(event.target).parents(accordionItemSelector);
        _collapseWork(accordionItem.find(hiddenAreaSelector));
        accordionItem.find('.' + headerLinkClass).focus();
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
          'class': _showHeaderLabelSelector.substring(1)
        }));

        spans.push($('<span>', {
          text: hideHeaderLabelText,
          style: 'display: none;',
          'class': _hideHeaderLabelSelector.substring(1)
        }));

        spans.push($('<span>', {
          text: hiddenLinkDescription,
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
      if (!showSearch) {
        return;
      }

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
      }).appendTo(parentDiv);

      $('<div>', {
        'class': headerSelector.substring(1) + ' ' + accordionHeaderClass,
        text: noResultsText
      }).appendTo(wrapperLi);

      // Set an id to each row
      this._accordionItems.each(function initaccordionItemsEach(index, item) {
        item.setAttribute('id', rowIdStringPrefix + index);
      });

      wrapperDiv.prependTo(parentDiv);

      // Bind search function to input field
      searchInput.keyup(function (event) {
        var value = event.target.value;
        // lowercase search string

        var searchString = value.toLowerCase();

        // hide no results found <li>
        wrapperLi.hide();

        var regex = new RegExp(searchString, 'ig');

        for (var i = 0, action; i < this._accordionItems.length; i++) {
          var headerTextNode = headers[i].children[0];

          // remove all markings from the DOM
          $(headerTextNode).find('.' + markedTextClass).each(function (index, element) {
            return $(element).contents().unwrap();
          });
          headerTextNode.normalize();

          // only if there is something in the input only then perform search
          action = searchString.length ? this._traverseChildNodes(headerTextNode, regex, markedTextClass) : true;

          if (overallSearch) {
            var bodyTextNode = this._accordionHideAreas[i];

            // remove all markings from the DOM
            $(bodyTextNode).find('.' + markedTextClass).each(function (index, element) {
              return $(element).contents().unwrap();
            });
            bodyTextNode.normalize();

            // only if there is something in the input only then perform search
            action = searchString.length ? this._traverseChildNodes(bodyTextNode, regex, markedTextClass) : true;
          }

          // action on the item. Hide or Show
          if (searchActionType === _constants.SEARCH_ACTION_TYPE_HIDE) {
            $(this._accordionItems[i])[action ? 'show' : 'hide']();
          } else if (searchActionType === _constants.SEARCH_ACTION_TYPE_COLLAPSE) {
            var hiddenArea = this._getHiddenArea(i);
            if (!searchString.length && hiddenArea[0].style.display === 'block') {
              this.collapseRow(i);
            } else if (hiddenArea[0].style.display === 'none' && action) {
              this.uncollapseRow(i);
            } else if (hiddenArea[0].style.display === 'block' && !action) {
              this.collapseRow(i);
            }
          }
        }

        var results = parentDiv.find(headerSelector + ':visible').length;
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

  }, {
    key: '_collapseWork',
    value: function _collapseWork(element) {
      var _visibleAreaClass = this._visibleAreaClass;


      if (!element) {
        return;
      }

      this[element.hasClass(_visibleAreaClass) ? '_collapse' : '_uncollapse'](element);
    }

    /// Function which will collapse all areas
    //

  }, {
    key: '_collapseAll',
    value: function _collapseAll() {
      var _accordionHideAreas = this._accordionHideAreas;
      var _visibleAreaClass = this._visibleAreaClass;
      var _collapse = this._collapse;


      var visibleAreas = _accordionHideAreas.filter('.' + _visibleAreaClass);

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
      var _visibleAreaClass = this._visibleAreaClass;
      var _headerSelector = this._headerSelector;
      var _showHeaderLabelSelector = this._showHeaderLabelSelector;
      var _hideHeaderLabelSelector = this._hideHeaderLabelSelector;
      var _speed = this._speed;
      var _hideEffectStyle = this._hideEffectStyle;
      var _onAreaHide = this._onAreaHide;
      var _triangleClass = this._triangleClass;
      var _toggleClass = this._toggleClass;


      element = $(element);

      if (!element.length || !element.hasClass(_visibleAreaClass)) {
        return;
      }

      var topRow = element.siblings(_headerSelector);

      topRow.find(_showHeaderLabelSelector).show();
      topRow.find(_hideHeaderLabelSelector).hide();
      topRow.find('.' + _triangleClass).toggleClass(_toggleClass);

      element.slideUp(_speed, _hideEffectStyle, function () {
        element.removeClass(_visibleAreaClass);
        element.hide();

        _onAreaHide(element);
      });
    }

    /// Function which will show the area and convert from collapsed to be displayed one
    // params:
    //  element - accordion hidden area DOM element which will become visible
    //

  }, {
    key: '_uncollapse',
    value: function _uncollapse(element) {
      var _visibleAreaClass = this._visibleAreaClass;
      var _headerSelector = this._headerSelector;
      var _showHeaderLabelSelector = this._showHeaderLabelSelector;
      var _hideHeaderLabelSelector = this._hideHeaderLabelSelector;
      var _speed = this._speed;
      var _hideEffectStyle = this._hideEffectStyle;
      var _onAreaShow = this._onAreaShow;
      var _triangleClass = this._triangleClass;
      var _toggleClass = this._toggleClass;


      element = $(element);

      if (!element.length || element.hasClass(_visibleAreaClass)) {
        return;
      }

      if (this.showOne) {
        this._collapseAll(element);
      }

      var topRow = element.siblings(_headerSelector);

      topRow.find(_showHeaderLabelSelector).hide();
      topRow.find(_hideHeaderLabelSelector).show();
      topRow.find('.' + _triangleClass).toggleClass(_toggleClass);

      element.addClass(_visibleAreaClass);
      element.slideDown(_speed, _hideEffectStyle, function () {
        element.show();

        _onAreaShow(element);
      });
    }

    /// Function which returns a jQuery element which represent a hidden area
    // params:
    //  rowIndex - integer index of the row of the hidden area
    //

  }, {
    key: '_getHiddenArea',
    value: function _getHiddenArea(rowIndex) {
      var _accordionHideAreas = this._accordionHideAreas;


      return rowIndex >= 0 && rowIndex < _accordionHideAreas.length ? $(_accordionHideAreas[rowIndex]) : undefined;
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