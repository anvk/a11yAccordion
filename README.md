# a11yAccordion v0.3.1

> An accessible and easy to use Accordion widget.

## Prerequisites

This widget requires jQuery v1.10.0+

## Live Demo

http://anvk.github.io/a11yAccordion/example.html

## Configuration

```javascript
var myAccordion = new A11yAccordion(options);
```

### Options

**parentSelector** - selector for the parent container which has an Accordion markup  
**AccordionItemSelector** - selector for Accordion row which contains header and hidden area  
**headerSelector** - selector for a header within the row  
**hiddenAreaSelector** - selector for hidden areas within the Accordion row  
**visibleAreaClass** - class which would be added to every row which will be uncollapsed/visible to the user  
**colorScheme** - color scheme for the Accordion  
**speed** - speed of animation  
**hiddenLinkDescription** - description for every Show/Hide link for users who use Assistive technology (AT)  
**showSearch** - boolean option which will tell Accordion to render search options  
**showOne** - boolean option which represents if Accordion can uncollapse only 1 row to the user  
**overallSearch** - boolean option which will tell search to look not only in headers but within collapsed areas as well
(WARNING! **overallSearch** option can slow down performance in cases when there is lots of data or HTML markup present in the hidden areas.)  
**onAreaShow** - custom callback which will be called after making visible an Accordion's area. Argument is jQuery DOM element for an area to become shown  
**onAreaHide** - user defined callback which will be called after hiding an Accordion's area. Argument is jQuery DOM element for an area to become hidden  

### Widget default options

```javascript
var defaults = {
  parentSelector: undefined,
  AccordionItemSelector: '.a11yAccordionItem',
  headerSelector: '.a11yAccordionItemHeader',
  hiddenAreaSelector: '.a11yAccordionHideArea',
  visibleAreaClass: 'visibleA11yAccordionItem',
  colorScheme: 'light',
  speed: 300,
  hiddenLinkDescription: '',
  showSearch: true,
  showOne: true,
  overallSearch: false,
  onAreaShow: undefined,
  onAreaHide: undefined
};
```

### API

#### collapseRow(rowIndex);

> Function which will hide hidden area in the row with index = rowIndex

#### uncollapseRow(rowIndex);

> Function which will show hidden area in the row with index = rowIndex

#### toggleRow(rowIndex);

> Function which will hide or show hidden area in the row with index = rowIndex depending on its previous state

#### getRowEl(rowIndex);

> Function which will return a jQuery row element with index = rowIndex

#### showOne

> Boolean value which will make Accordion to show only 1 uncollapsed row at a time to the user if true

#### el

> JQuery element which contains DOM markup of the A11yAccordion

## Quick Start

Create the following HTML markup:

```html
<ul id="accordion1" class="a11yAccordion">
  <li class="a11yAccordionItem">
    <div class="a11yAccordionItemHeader">
      Header #1
    </div>
    <div class="a11yAccordionHideArea">
      First row content
    </div>
  </li>

  <li class="a11yAccordionItem">
    <div class="a11yAccordionItemHeader">
      Header #2
    </div>
    <div class="a11yAccordionHideArea">
      Second row content
    </div>
  </li>

  <li class="a11yAccordionItem">
    <div class="a11yAccordionItemHeader">
      Header #3
    </div>
    <div class="a11yAccordionHideArea">
      Third row content
    </div>
  </li>
</ul>
```

Then execute in JavaScript

```javascript
var myAccordion = new A11yAccordion({
  parentSelector: '#accordion1'
});
```

## For Developers

To build your own a11yAccordion you will require Node and NPM

To install all required dependencies run the followign command:

```
npm install
```

To rebuild a11yAccordion run Grunt command

Production version

```
npm run build:prod
```

Development version

```
npm run build:dev
```

Build result could be found in **dist** folder

## For Designers

You can quickly create new color schemes by using an existing LESS function

```less
.a11yAccordion-theme(@background, @text, @link)
```

You just need to prefix your CSS class.

```
.<color-scheme-name>-a11yAccordion-header {}
.<color-scheme-name>-a11yAccordion-header {}
```

An example on how to use it could be found for a default **light** color-scheme.

```less
/* light schema */

@light-headerBackground: #F2F2EB;
@light-areaBackground: #FFFEFD;
@light-textColor: #261E14;
@light-linkColor: #595048;

.light-a11yAccordion-header {
  .a11yAccordion-theme(@light-headerBackground, @light-textColor, @light-linkColor);
}

.light-a11yAccordion-area {
  .a11yAccordion-theme(@light-areaBackground, @light-textColor, @light-linkColor);
}
```

```
npm run build:css
```

Command will recreate CSS based on LESS file and place it into dist folder

## Release History

* 2016-05-03   v0.4.0   Using ES6 instead of ES5. Some code refactoring and cleanup.  
* 2014-06-10   v0.3.1   Moving away from the french word "accordeon" and using "accordion" instead.  
* 2014-06-03   v0.3.0   Refactored the whole component using ideas from the existing Gaia and FireFox components. Created the full Mocha+Chai test suit. Added new Grunt task for recreating CSS file in dist folder. Refactored and fixed issues in style sheets. Significantly improved example.html page. Hosted an example of the widget on my personal github page. Fixed couple of major bugs.  
* 2013-12-02   v0.2.2   Added few tests to the project. More tests coming. Changed markup for Search Div to be within the Accordion markup.  
* 2013-11-28   v0.2.1   Added basic user click interactions and advanced Accordion to be more configurable.  
* 2013-11-20   v0.2.0   Code completely refactored to be more performant and optimized. Proper web component structure.  
* 2013-07-27   v0.1.0   Grunt added to the project. Proper project build scripts are created.  
* 2013-06-26   v0.0.1   First working version of a standalone a11yAccordion outside of AContent.  

## License

MIT license; see [LICENSE](./LICENSE).
