/*global jQuery*/

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
      showHeaderLabelClass = "showLabel",
      hideHeaderLabelClass = "hideLabel",
      hideEffectStyle = "linear";

  // options which will be passed into the components with their default values
  var defaults = {
    parentSelector: undefined,
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
        accordeonHideAreas = parentDiv.find(options.hiddenAreaSelector),
        headers = parentDiv.find(options.headerSelector),
        headerLinkSelector = "a11yAccordeonItemHeaderLink",
        showHeaderLabelText = "Show",
        hideHeaderLabelText = "Hide",
        hiddenHeaderLabelDescriptionClss = "hiddenLabel",
        noResults = "no-results-found",
        searchDiv = "a11yAccordeonSearchDiv",
        accordeonItem = "a11yAccordeonItem",
        accordeonItemHeader = "a11yAccordeonItemHeader",
        rowId = "accordeon-row-",
        colorScheme = options.colorScheme,
        speed = options.speed,
        a11yAccordeonData = [];

    if (!options.headerSelector) {
      console.log('a11yAccordeon - no headerSelector was specified');
      return;
    } else if (!options.visibleAreaClass) {
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
    if (colorScheme) {
      headers.addClass(colorScheme + "-a11yAccordeon-header");
      accordeonHideAreas.addClass(colorScheme + "-a11yAccordeon-area");
    }

    var linkClick = function(event) {
      var link = (event.currentTarget) ? $(event.currentTarget) : $(event.srcElement),
          accordeonHideArea = link.parent().siblings(options.hiddenAreaSelector);

      collapseWork(accordeonHideAreas, accordeonHideArea, options.visibleAreaClass, speed);

      link.focus();
    };

    // generate links
    $.each(headers, function(index, header) {
      var link = $("<a>", {
            href: "#",
            "class": headerLinkSelector
          }),
          spans = [];

      // Bind the click event to the link
      link.click(linkClick);

      spans.push($("<span>", {
        text: showHeaderLabelText,
        "class": showHeaderLabelClass
      }));

      spans.push($("<span>", {
        text: hideHeaderLabelText,
        style: "display: none;",
        "class": hideHeaderLabelClass
      }));

      spans.push($("<span>", {
        text: options.hiddenLinkDescription,
        "class": hiddenHeaderLabelDescriptionClss
      }));

      // bulk DOM insert for spans
      link.prepend(spans);

      link.appendTo(header);
    });

    // If search bar is required, text box and no results found div are added
    if (options.showSearch) {
      var searchPlaceholder = "Search",
          searchClass = "a11yAccordeonSearch",
          noResultsText = "No Results Found",
          titleText = "Type your query to search",
          wrapperDiv, wrapperLi, searchInput, searchString;

      wrapperDiv = $("<div />", {
        id: searchDiv
      }).insertBefore(parentDiv);

      searchInput = $("<input />", {
        type: "text",
        placeholder: searchPlaceholder,
        "class": searchClass,
        title: titleText
      }).appendTo(wrapperDiv);

      wrapperLi = $("<li />", {
        "class": accordeonItem,
        id: noResults,
        style: "display:none;"
      }).appendTo(parentDiv);

      $("<div />", {
        "class": accordeonItemHeader,
        text: noResultsText
      }).appendTo(wrapperLi);

      // Set an id to each row
      $("." + accordeonItem).each( function (index, item) {
        $(item).attr("id", rowId + index);
      });

      // Bind search function to input field
      searchInput.keyup( function () {
        wrapperLi.hide();

        if (!a11yAccordeonData.length) {
          populateAccordeonData();
        }

        searchString = searchInput.val().toLowerCase();

        $(a11yAccordeonData).each( function(index, data) {
          var action = data.text.indexOf(searchString) !== -1 ? "show" : "hide";
          $("#" + data.id)[action]();
        });

        updateTitleText(searchInput);

        if (! $("." + accordeonItem + ":visible").length) {
          wrapperLi.show();
        }
      });
    }

    return that;
  };


  /// Private functions


  /// Function which is executed upon the link click. It will either hide the related area OR show the area and hide all other ones
  // params:
  //  accordeonHideAreas - all areas which could be collapsed
  //  element - element which relates to the link being clicked
  //  visibleAreaClass - class which will be added or removed depending on the situation
  //  speed - animation speed
  //
  var collapseWork = function (accordeonHideAreas, element, visibleAreaClass, speed) {
    if (element.hasClass(visibleAreaClass)) {
      collapse(element, visibleAreaClass, speed);
    } else {
      collapseAll(accordeonHideAreas, visibleAreaClass, speed);
      uncollapse(element, visibleAreaClass, speed);
    }
  };

  /// Function which will collapse all areas
  // params:
  //  accordeonHideAreas - array of jQuery elements which will be collapsed
  //  visibleAreaClass - class which will be removed from those areas
  //  speed - animation speed
  //
  var collapseAll = function(accordeonHideAreas, visibleAreaClass, speed) {
    $.each(accordeonHideAreas.filter("." + visibleAreaClass), function(index, element) {
      collapse($(element), visibleAreaClass, speed);
    });
  };

  /// Function which will collapses one element
  // params:
  //  accordeonHideAreas - array of jQuery elements which will be collapsed
  //  visibleAreaClass - class which will be removed from those areas
  //  speed - animation speed
  //
  var collapse = function(element, visibleAreaClass, speed) {
    if (!element.hasClass(visibleAreaClass)) {
      return;
    }

    var topRow = element.siblings(options.headerSelector);
    topRow.find("." + showHeaderLabelClass).show();
    topRow.find("." + hideHeaderLabelClass).hide();

    element.slideUp(speed, hideEffectStyle, function () {
      element.removeClass(visibleAreaClass);
      element.hide();
    });
  };

  /// Function which will show the area and convert from collapsed to be displayed one
  // params:
  //  element - element which will be shown
  //  visibleAreaClass - class which will be removed from those areas
  //  speed - animation speed
  //
  var uncollapse = function (element, visibleAreaClass, speed) {
    if (element.hasClass(visibleAreaClass)) {
      return;
    }

    var topRow = element.siblings(options.headerSelector);
    topRow.find("." + showHeaderLabelClass).hide();
    topRow.find("." + hideHeaderLabelClass).show();

    element.addClass(visibleAreaClass);
    element.slideDown(speed, hideEffectStyle, function () {
      element.show();
    });
  };

  // Function to read Accordeon Rows and fill in data in a variable, it is done just once
  var populateAccordeonData = function () {
    var items = $("." + accordeonItem),
        item;

    // One less iteration because the last one is for "no results found" rows
    for (var i=0, length=items.length-1; i<length; ++i) {
      item = items[i];
      a11yAccordeonData.push({
        id: item.id,
        text: $(item).text().replace(showHeaderLabelText +
          hideHeaderLabelText + options.hiddenLinkDescription, "").toLowerCase()
      });
    }
  };

  var updateTitleText = function (searchInput) {
    var results = $("." + accordeonItemHeader + ":visible").length,
        resultsMessage = "Number of results found: ",
        leaveBlankMessage = " Please leave blank to see all the results.";

    searchInput.attr("title", resultsMessage + results.toString() + leaveBlankMessage);
  };



  /// Public functions


  // that.collapseRow = function(rowIndex) {

  // };

  // that.uncollapseRow = function(rowIndex) {

  // };

  // that.enableRow = function(rowIndex) {

  // };

  // that.disableRow = function(rowIndex) {

  // };

  // that.toggleRow = function(rowIndex) {

  // };

  // that.getRowEl = function(rowIndex) {

  // };

  return init(options);
};
