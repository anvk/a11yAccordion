# a11yAccordeon v0.3.0

> An accessible easy to use Accordeon widget.

## Prerequisites

This widget was build with help of [jQuery v1.10.0](http://code.jquery.com/jquery-1.10.0.min.js)

## Live Demo

http://anvk.github.io/a11yAccordeon/example.html

## Configuration

```javascript
var myAccordeon = new A11yAccordeon(options);
```

### Options

**parentSelector** - selector for the parent container which has an accordeon markup  
**accordeonItemSelector** - selector for accordeon row which contains header and hidden area  
**headerSelector** - selector for a header within the row  
**hiddenAreaSelector** - selector for hidden areas within the accordeon row  
**visibleAreaClass** - class which would be added to every row which will be uncollapsed/visible to the user  
**colorScheme** - color scheme for the accordeon  
**speed** - speed of animation  
**hiddenLinkDescription** - description for every Show/Hide link for users who use Assistive technology (AT)  
**showSearch** - boolean option which will tell accordeon to render search options  
**showOne** - boolean option which represents if accordeon can uncollapse only 1 row to the user  
**overallSearch** - boolean option which will tell search to look not only in headers but within collapsed areas as well
(WARNING! **overallSearch** option can slow down performance in cases when there is lots of data or HTML markup present in the hidden areas.)  
**onAreaShow** - custom callback which will be called after making visible an accordeon's area. Argument is jQuery DOM element for an area to become shown  
**onAreaHide** - user defined callback which will be called after hiding an accordeon's area. Argument is jQuery DOM element for an area to become hidden  

### Widget default options

```javascript
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

> Boolean value which will make accordeon to show only 1 uncollapsed row at a time to the user if true

#### el

> JQuery element which contains DOM markup of the A11yAccordeon

## Quick Start

Create the following HTML markup:

```html
<ul id="accordeon1" class="a11yAccordeon">
  <li class="a11yAccordeonItem">
    <div class="a11yAccordeonItemHeader">
      Header #1
    </div>
    <div class="a11yAccordeonHideArea">
      First row content
    </div>
  </li>

  <li class="a11yAccordeonItem">
    <div class="a11yAccordeonItemHeader">
      Header #2
    </div>
    <div class="a11yAccordeonHideArea">
      Second row content
    </div>
  </li>

  <li class="a11yAccordeonItem">
    <div class="a11yAccordeonItemHeader">
      Header #3
    </div>
    <div class="a11yAccordeonHideArea">
      Third row content
    </div>
  </li>
</ul>
```

Then execute in JavaScript

```javascript
var myAccordeon = new A11yAccordeon({
  parentSelector: '#accordeon1'
});
```

## For Developers

To build your own a11yAccordeon you will require Node and NPM

To install all required dependencies run the followign command:

```
npm install
```

To rebuild a11yAccordeon run Grunt command

```
grunt
```

Build result could be found in **dist** folder

## For Designers

You can quickly create new color schemes by using an existing LESS function

```less
.a11yAccordeon-theme(@background, @text, @link)
```

You just need to prefix your CSS class.

```
.<color-scheme-name>-a11yAccordeon-header {}
.<color-scheme-name>-a11yAccordeon-header {}
```

An example on how to use it could be found for a default **light** color-scheme.

```less
/* light schema */

@light-headerBackground: #F2F2EB;
@light-areaBackground: #FFFEFD;
@light-textColor: #261E14;
@light-linkColor: #595048;

.light-a11yAccordeon-header {
  .a11yAccordeon-theme(@light-headerBackground, @light-textColor, @light-linkColor);
}

.light-a11yAccordeon-area {
  .a11yAccordeon-theme(@light-areaBackground, @light-textColor, @light-linkColor);
}
```

```
grunt css
```

css option for the grunt command will recreate CSS based on LESS file and place it into dist folder

## Release History

* 2014-06-03   v0.3.0   Refactored the whole component using ideas from the existing Gaia and FireFox components. Created the full Mocha+Chai test suit. Added new Grunt task for recreating CSS file in dist folder. Refactored and fixed issues in style sheets. Significantly improved example.html page. Hosted an example of the widget on my personal github page. Fixed couple of major bugs.  
* 2013-12-02   v0.2.2   Added few tests to the project. More tests coming. Changed markup for Search Div to be within the accordeon markup.  
* 2013-11-28   v0.2.1   Added basic user click interactions and advanced accordeon to be more configurable.  
* 2013-11-20   v0.2.0   Code completely refactored to be more performant and optimized. Proper web component structure.  
* 2013-07-27   v0.1.0   Grunt added to the project. Proper project build scripts are created.  
* 2013-06-26   v0.0.1   First working version of a standalone a11yAccordeon outside of AContent.  

## License
The MIT License (MIT)

Copyright (c) 2013 Alexey Novak

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
