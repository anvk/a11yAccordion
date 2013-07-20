/**
 * @author Alexey Novak
 */

/*global jQuery*/

/// This function would create an accordeon based on the markup and provided options
// params:
//  options which consist of:
//    container - HTML element to which a11y accordeon markup and functionality will be applied
//    hiddenAreaSelector - HTML element which will be hidden/shown
//    headerSelector - jQuery selector for the header of each a11yAccordeonItem
//    visibleAreaClass - Class which will be applied to every uncollapsed accordeon element
//    speed - speed of collapsing animation
//    hiddenLinkDescription - some string which will be played by AT once user has a keyboard focus on Show/Hide link
//
var a11yAccordeon = function (options) {
  options = options || {};

  options.headerSelector = options.headerSelector || ".a11yAccordeonItemHeader";
  options.visibleAreaClass = options.visibleAreaClass || "visibleA11yAccordeonItem";
  options.hiddenAreaSelector = options.hiddenAreaSelector || ".accordeonA11yHideArea";

  var container = $(options.container),
      accordeonHideAreas = $(options.hiddenAreaSelector),
      headers = $(options.headerSelector),
      headerLinkSelector = "a11yAccordeonItemHeaderLink",
      showHeaderLabelText = "Show",
      showHeaderLabelClass = "showLabel",
      hideHeaderLabelText = "Hide",
      hideHeaderLabelClass = "hideLabel",
      hiddenHeaderLabelDescriptionClss = "hiddenLabel",
      hideEffectStyle = "linear",
      noResults = "no-results-found",
      searchDiv = "a11yAccordeonSearchDiv",
      accordeonItem = "a11yAccordeonItem",
      accordeonItemHeader = "a11yAccordeonItemHeader",
      rowId = "accordeon-row-",
      a11yAccordeonData = new Array();

  if (!options.headerSelector || !options.visibleAreaClass || container.length === 0 || accordeonHideAreas.length === 0) {
    return;
  }

  // hide all areas by default
  accordeonHideAreas.hide();

  options.speed = options.speed || 300;
  options.hiddenLinkDescription = options.hiddenLinkDescription || "";

  // generate links
  $.each(headers, function(index, header) {
    var link = $("<a>", {
        href: "#",
        "class": headerLinkSelector
    });

    $("<span>", {
      text: showHeaderLabelText,
      "class": showHeaderLabelClass
    }).appendTo(link);

    $("<span>", {
      text: hideHeaderLabelText,
      style: "display: none;",
      "class": hideHeaderLabelClass
    }).appendTo(link);

    $("<span>", {
      text: options.hiddenLinkDescription,
      "class": hiddenHeaderLabelDescriptionClss
    }).appendTo(link);

    link.appendTo(header);
  });

  // Bind the click event to the links
  var links = $("." + headerLinkSelector);
  links.click(function (event) {
    var link = (event.currentTarget) ? $(event.currentTarget) : $(event.srcElement),
        accordeonHideArea = link.parent().siblings(options.hiddenAreaSelector);

    collapseWork(accordeonHideAreas, accordeonHideArea, options.visibleAreaClass, options.speed);

    link.focus();
    return false;
  });

  // If search bar is required, text box and no results found div are added
  if (options.showSearch) {
    var wrapperDiv, wrapperLi, searchInputi, searchString;

    wrapperDiv = $("<div />", {
      id: searchDiv,
    }).insertBefore(container);

    searchInput = $("<input />", {
      type: "text",
      placeholder: "Search",
      "class": "a11yAccordeonSearch"
    }).appendTo(wrapperDiv);

    wrapperLi = $("<li />", {
      "class": accordeonItem,
      id: noResults,
      style: "display:none;"
    }).appendTo(container);

    $("<div />", {
      "class": accordeonItemHeader,
      text: "No Results Found"
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
          data.text.indexOf(searchString) !== -1 ? $("#" + data.id).show() : $("#" + data.id).hide();
      });

      if (! $("." + accordeonItem + ":visible").length) {
        wrapperLi.show();
      }
    });
  }

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
    var items = $("." + accordeonItem);

    // One less iteration because the last one is for "no results found" rows
    for (var i=0, length=items.length-1; i<length; i++) {
      a11yAccordeonData.push({
        id: items[i].id,
        text: $(items[i]).text().replace(showHeaderLabelText +
          hideHeaderLabelText + options.hiddenLinkDescription, "").toLowerCase()
      });
    }
  };
};
