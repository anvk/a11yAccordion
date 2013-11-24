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
var a11yAccordeon = function(options) {
  options = options || {};

  // private variables
  var that = {},
      showHeaderLabelSelector = '.showLabel',
      hideHeaderLabelSelector = '.hideLabel',
      hideEffectStyle = 'linear',
      showHeaderLabelText = 'Show',
      hideHeaderLabelText = 'Hide',
      speed, visibleAreaClass, accordeonItems, accordeonHideAreas;

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
    showSearch: true
  };

  var init = function(options) {
    options = $.extend(true, {}, defaults, options);

    var parentDiv = $(options.parentSelector),
        accordeonItemSelector = options.accordeonItemSelector,
        headerSelector = options.headerSelector,
        headerLinkClass = 'a11yAccordeonItemHeaderLink',
        hiddenHeaderLabelDescriptionClass = 'hiddenLabel',
        noResultsIDString = 'no-results-found',
        searchDivIDString = 'a11yAccordeonSearchDiv',
        rowIdString = 'accordeon-row-',
        colorScheme = options.colorScheme;

    speed = options.speed;
    visibleAreaClass = options.visibleAreaClass;
    accordeonItems = parentDiv.find(accordeonItemSelector);

    var headers = accordeonItems.find(options.headerSelector);
    accordeonHideAreas = accordeonItems.find(options.hiddenAreaSelector);

    // check that our initialization is proper
    if (!options.headerSelector) {
      console.log('a11yAccordeon - no headerSelector was specified');
      return;
    } else if (!visibleAreaClass) {
      console.log('a11yAccordeon - no visibleAreaClass was specified');
      return;
    } else if (!parentDiv.length) {
      console.log('a11yAccordeon - no element(s) with parentSelector was found');
      return;
    } else if (!accordeonHideAreas.length) {
      console.log('a11yAccordeon - no element(s) with hiddenAreaSelector was found');
      return;
    }

    // store component's DOM element
    that.el = parentDiv;

    // hide all areas by default
    accordeonHideAreas.hide();

    // apply color scheme
    headers.addClass(colorScheme + '-a11yAccordeon-header');
    accordeonHideAreas.addClass(colorScheme + '-a11yAccordeon-area');

    // function for show/hide link clicks. We predefine the function not to define it in the loop
    var linkClick = function(event) {
      var link = (event.currentTarget) ? $(event.currentTarget) : $(event.srcElement),
          elementHideArea = link.parent().siblings(options.hiddenAreaSelector);

      collapseWork(elementHideArea);

      link.focus();
    };

    // generate links
    $.each(headers, function(index, header) {
      var link = $('<a>', {
            href: '#',
            'class': headerLinkClass
          }),
          spans = [];

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
        text: options.hiddenLinkDescription,
        'class': hiddenHeaderLabelDescriptionClass
      }));

      // bulk DOM insert for spans
      link.prepend(spans).appendTo(header);
    });

    // if there is NO search option then return component right away
    if (!options.showSearch) {
      return that;
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
    }).insertBefore(parentDiv);

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
      'class': headerSelector.substring(1),
      text: noResultsText
    }).appendTo(wrapperLi);

    // Set an id to each row
    accordeonItems.each(function(index, item) {
      $(item).attr('id', rowIdString + (++index));
    });

    // Bind search function to input field
    searchInput.keyup(function() {
      wrapperLi.hide();

      searchString = searchInput.val().toLowerCase();

      headers.each(function(index, data) {
        var action = data.children[0].textContent.toLowerCase().indexOf(searchString) !== -1 ? 'show' : 'hide';
        $(accordeonItems[index])[action]();
      });

      results = parentDiv.find(headerSelector + ':visible').length;
      searchInput.attr('title', resultsMessage + results.toString() + leaveBlankMessage);

      if (!results) {
        wrapperLi.show();
      }
    });

    return that;
  };



  /// Private functions



  /// Function which is executed upon the link click. It will either hide the related area OR show the area and hide all other ones
  // params:
  //  element - element which relates to the link being clicked
  //
  var collapseWork = function(element) {
    if (!element) {
      return;
    }

    if (element.hasClass(visibleAreaClass)) {
      collapse(element);
    } else {
      collapseAll();
      uncollapse(element);
    }
  };

  /// Function which will collapse all areas
  //
  var collapseAll = function() {
    $.each(accordeonHideAreas.filter('.' + visibleAreaClass), function(index, element) {
      collapse($(element));
    });
  };

  /// Function which will collapses one element
  // params:
  //  element - element which relates to the link being clicked
  //
  var collapse = function(element) {
    if (!element || !element.hasClass(visibleAreaClass)) {
      return;
    }

    var topRow = element.siblings(options.headerSelector);
    topRow.find(showHeaderLabelSelector).show();
    topRow.find(hideHeaderLabelSelector).hide();

    element.slideUp(speed, hideEffectStyle, function() {
      element.removeClass(visibleAreaClass);
      element.hide();
    });
  };

  /// Function which will show the area and convert from collapsed to be displayed one
  // params:
  //  element - element which will be shown
  //
  var uncollapse = function(element) {
    if (!element || element.hasClass(visibleAreaClass)) {
      return;
    }

    var topRow = element.siblings(options.headerSelector);
    topRow.find(showHeaderLabelSelector).hide();
    topRow.find(hideHeaderLabelSelector).show();

    element.addClass(visibleAreaClass);
    element.slideDown(speed, hideEffectStyle, function() {
      element.show();
    });
  };

  var checkIfIndexCorrect = function(rowIndex) {
    return (rowIndex > 0 && rowIndex <= accordeonHideAreas.length);
  };

  var getHiddenArea = function(rowIndex) {
    return (checkIfIndexCorrect(rowIndex)) ? $(accordeonHideAreas[rowIndex - 1]) : undefined;
  };



  /// Public functions



  that.collapseRow = function(rowIndex) {
    collapse(getHiddenArea(rowIndex));
  };

  that.uncollapseRow = function(rowIndex) {
    uncollapse(getHiddenArea(rowIndex));
  };

  that.toggleRow = function(rowIndex) {
    collapseWork(getHiddenArea(rowIndex));
  };

  that.getRowEl = function(rowIndex) {
    return (checkIfIndexCorrect(rowIndex)) ? $(accordeonItems[rowIndex - 1]) : undefined;
  };

  // that.enableRow = function(rowIndex) {

  // };

  // that.disableRow = function(rowIndex) {

  // };

  return init(options);
};