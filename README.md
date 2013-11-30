# a11yAccordeon

> An accessible easy to use Accordeon widget.

## Prerequisites

This widget was build with help of [jQuery v1.10.0](http://code.jquery.com/jquery-1.10.0.min.js)

## Configuration

```javascript
var myAccordeon = a11yAccordeon(options);
```

### Options

**parentSelector** - selector for the parent container which has an accordeon markup  
**accordeonItemSelector** - selector for accordeon row which contains header and hidden area  
**headerSelector** - selector for a header within the row  
**hiddenAreaSelector** - selector for hidden areas within the accordeon row  
**visibleAreaClass** - class which would be added to every row which will be uncollapsed/visible to the user  
**colorScheme** - color scheme for the accordeon  
**speed** - speed of animation  
**hiddenLinkDescription** - description for every Show/Hide link for users who use AT  
**showSearch** - boolean option which will tell accordeon to render search options  
**showOne** - boolean option which represents if accordeon can uncollapse only 1 row to the user  

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
  showOne: true
};
```

#### myAccordeon.collapseRow(rowIndex);

> Function which will hide hidden area in the row with index = rowIndex

#### myAccordeon.uncollapseRow(rowIndex);

> Function which will show hidden area in the row with index = rowIndex

#### myAccordeon.toggleRow(rowIndex);

> Function which will hide or show hidden area in the row with index = rowIndex depending on its previous state

#### myAccordeon.getRowEl(rowIndex);

> Function which will return a jQuery row element with index = rowIndex

#### myAccordeon.showOne

> Boolean value which will make accordeon to show only 1 uncollapsed row at a time to the user if true

## Quick Start

Create the following HTML markup:

```html
<ul class="a11yAccordeon" id="accordeon1">
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
var myAccordeon = a11yAccordeon({
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
.light-a11yAccordeon-header {
  .a11yAccordeon-theme(#F2F2EB, #261E14, #595048);
}

.light-a11yAccordeon-header {
  .a11yAccordeon-theme(#FFFEFD, #261E14, #595048);
}
```

## Release History

* 2013-11-28   v0.2.1   Added basic user click interactions and advanced accordeon to be more configurable.
* 2013-11-20   v0.2.0   Code completely refactored to be more performant and optimized. Proper web component structure.
* 2013-07-27   v0.1.0   Grunt added to the project. Proper project build scripts are created.
* 2013-06-26   v0.0.1   First working version of a standalone a11yAccordeon outside of AContent.

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
