/* global beforeEach, afterEach, _, $, it, describe, chai, a11yAccordion */

(function (expect) {
  describe('a11yAccordion tests', function() {

    this.timeout(1500);

    var testaccordionId = '#accordion1',
        hiddenLinkDescription = 'Hidden Link Description';

    var testOptions = {
      parentSelector: testaccordionId,
      accordionItemSelector: '.a11yAccordionItem',
      headerSelector: '.a11yAccordionItemHeader',
      hiddenAreaSelector: '.a11yAccordionHideArea',
      visibleAreaClass: 'visiblea11yAccordionItem',
      hiddenLinkDescription: hiddenLinkDescription,
      speed: 1
    };

    var accordionCleanUp = function() {
      $(testaccordionId).empty();
    };

    var generateaccordionMarkup = function() {
      accordionCleanUp();
      var markup = $(testaccordionId),
          rows = [];

      for (var i=0; i < 5; ++i) {
        var row = $('<li>', {
          'class': 'a11yAccordionItem'
        });

        $('<div>', {
          'class': 'a11yAccordionItemHeader',
          text: 'Header ' + i
        }).appendTo(row);

        $('<div>', {
          'class': 'a11yAccordionHideArea',
          text: 'Item ' + i
        }).appendTo(row);

        rows.push(row);
      }

      markup.prepend(rows);
    };

    var checkVisibility = function(a11yAccordion, rowIndex, isVisible) {
      var row = a11yAccordion.getRowEl(rowIndex),
          hiddenArea = a11yAccordion._getHiddenArea(rowIndex),
          hiddenAreaIsVisible = isVisible ? 'true' : 'false';
      expect(row.find(a11yAccordion._showHeaderLabelSelector).is(":visible")).to.be[!isVisible ? 'true' : 'false'];
      expect(row.find(a11yAccordion._hideHeaderLabelSelector).is(":visible")).to.be[isVisible ? 'true' : 'false'];
      expect(hiddenArea.is(":visible")).to.be[hiddenAreaIsVisible];
      expect(hiddenArea.hasClass(a11yAccordion._visibleAreaClass)).to.be[hiddenAreaIsVisible];
    };

    beforeEach(generateaccordionMarkup);
    afterEach(accordionCleanUp);

    describe('a11yAccordion creation', function() {
      it('bad options. failed to create', function() {
        var testIndex = 0;

        var testCases = [
          {
            throwMessage: 'a11yAccordion - no element(s) with parentSelector was found',
            options: {
              parentSelector: undefined,
              accordionItemSelector: '.a11yAccordionItem',
              headerSelector: '.a11yAccordionItemHeader',
              hiddenAreaSelector: '.a11yAccordionHideArea',
              visibleAreaClass: 'visiblea11yAccordionItem'
            }
          },
          {
            throwMessage: 'a11yAccordion - no element(s) with accordionItemSelector was found',
            options: {
              parentSelector: '#accordion1',
              accordionItemSelector: 'does not exist',
              headerSelector: '.a11yAccordionItemHeader',
              hiddenAreaSelector: '.a11yAccordionHideArea',
              visibleAreaClass: 'visiblea11yAccordionItem'
            }
          },
          {
            throwMessage: 'a11yAccordion - no element(s) with headerSelector was found',
            options: {
              parentSelector: '#accordion1',
              accordionItemSelector: '.a11yAccordionItem',
              headerSelector: 'does not exist',
              hiddenAreaSelector: '.a11yAccordionHideArea',
              visibleAreaClass: 'visiblea11yAccordionItem'
            }
          },
          {
            throwMessage: 'a11yAccordion - no element(s) with hiddenAreaSelector was found',
            options: {
              parentSelector: '#accordion1',
              accordionItemSelector: '.a11yAccordionItem',
              headerSelector: '.a11yAccordionItemHeader',
              hiddenAreaSelector: 'does not exist',
              visibleAreaClass: 'visiblea11yAccordionItem'
            }
          }
        ];

        _.each(testCases, function(testCase) {
          try {
            new A11yAccordion(testCase.options);
          } catch (exception) {
            testIndex = testIndex + 1;
            expect(exception).to.equal(testCase.throwMessage);
          }
        });

        expect(testIndex).to.equal(testCases.length);
      });

      describe('good options. succeeded to create', function() {
        var hasSearchDiv = function(a11yAccordion) {
          return !!a11yAccordion.el.find('.a11yAccordionSearch').length;
        };

        it('Default creation', function() {
          var a11yAccordion = new A11yAccordion(testOptions),
              headerLinkHiddenEl, headerTextEl, row;

          expect(a11yAccordion.el.attr('id')).to.equal('accordion1');
          expect(a11yAccordion._accordionHideAreas.length).to.equal(5);
          hasSearchDiv(a11yAccordion, true);
          expect(a11yAccordion.el.find(a11yAccordion._visibleAreaClass).filter(":visible").length).to.equal(0);

          row = a11yAccordion.getRowEl(1);
          expect(row.find(a11yAccordion._visibleAreaClass).filter(":visible").length).to.equal(0);

          checkVisibility(a11yAccordion, 1, false);

          headerTextEl = row.find('.a11yAccordionItemHeaderText');
          headerLinkHiddenEl = row.find('.a11yAccordionItemHeaderLinkHiddenLabel');

          expect(headerTextEl.length).to.equal(1);
          expect(headerTextEl.text()).to.equal('Header 1');

          expect(headerLinkHiddenEl.length).to.equal(1);
          expect(headerLinkHiddenEl.text()).to.equal('Hidden Link Description');
        });

        it('Custom theme', function() {
          var customOptions = _.clone(testOptions, true);
          customOptions.colorScheme = 'myColorScheme';

          var a11yAccordion = new A11yAccordion(customOptions),
              row = a11yAccordion.getRowEl(1);

          expect(row.find('.a11yAccordionItemHeader').hasClass('myColorScheme-a11yAccordion-header')).to.be.true;
          expect(row.find('.a11yAccordionHideArea').hasClass('myColorScheme-a11yAccordion-area')).to.be.true;
        });

        it('Without search', function() {
          var customOptions = _.clone(testOptions, true);
          customOptions.showSearch = false;

          var a11yAccordion = new A11yAccordion(customOptions);

          hasSearchDiv(a11yAccordion, false);
        });
      });
    });

    describe('Search functionality', function() {
      it('Regular search', function() {
        var a11yAccordion = new A11yAccordion(testOptions),
            el = a11yAccordion.el,
            searchInput = el.find('.a11yAccordionSearch');

        var triggerKeyUp = function(text, expectedNumberOfRows) {
          searchInput.val(text);
          searchInput.keyup();

          expect(el.find('.a11yAccordionItem').filter(':visible').length).to.equal(expectedNumberOfRows);

          if (!expectedNumberOfRows) {
            expect(!!el.find('#accordion1-noResultsItem').length).to.be.true;
          }
        };

        expect(!!searchInput.length).to.be.true;

        triggerKeyUp('Do not exist', 0);

        triggerKeyUp('Header 3', 1);

        triggerKeyUp('', 5);
      });

      it('Overall search', function() {
        var customOptions = _.clone(testOptions, true);
        customOptions.overallSearch = true;

        var a11yAccordion = new A11yAccordion(customOptions),
            el = a11yAccordion.el,
            searchInput = el.find('.a11yAccordionSearch');

        var triggerKeyUp = function(text, expectedNumberOfRows) {
          searchInput.val(text);
          searchInput.keyup();

          expect(el.find('.a11yAccordionItem').filter(':visible').length).to.equal(expectedNumberOfRows);

          if (!expectedNumberOfRows) {
            expect(!!el.find('#accordion1-noResultsItem').length).to.be.true;
          }
        };

        expect(!!searchInput.length).to.be.true;

        triggerKeyUp('Do not exist', 0);

        triggerKeyUp('Item 3', 1);

        triggerKeyUp('', 5);
      });
    });

    // Public

    describe('uncollapseRow() and _uncollapse()', function() {
      it('regular functionality', function(done) {
        var customOptions = _.clone(testOptions, true);
        customOptions.onAreaShow = function(element) {
          expect(element.length).to.equal(1);
          checkVisibility(a11yAccordion, 2, true);
          done();
        };

        var a11yAccordion = new A11yAccordion(customOptions);

        checkVisibility(a11yAccordion, 2, false);

        a11yAccordion.uncollapseRow(2);
      });

      it('showOne is set to true', function(done) {
        var a11yAccordion = new A11yAccordion(testOptions);

        checkVisibility(a11yAccordion, 2, false);

        a11yAccordion._onAreaShow = function() {
          var index = 0;

          a11yAccordion._onAreaShow = function() {
            end(++index);
          };
          a11yAccordion._onAreaHide = function() {
            end(++index);
          };

          var end = function(index) {
            if (index !== 2) {
              return;
            }

            checkVisibility(a11yAccordion, 2, false);
            checkVisibility(a11yAccordion, 3, true);
            done();
          };

          checkVisibility(a11yAccordion, 2, true);
          a11yAccordion.uncollapseRow(3);
        };

        a11yAccordion.uncollapseRow(2);
      });

      it('showOne is set to false', function(done) {
        var customOptions = _.clone(testOptions, true);
        customOptions.showOne = false;

        var a11yAccordion = new A11yAccordion(customOptions);

        checkVisibility(a11yAccordion, 2, false);

        a11yAccordion._onAreaShow = function() {
          a11yAccordion._onAreaShow = function() {
            checkVisibility(a11yAccordion, 2, true);
            checkVisibility(a11yAccordion, 3, true);
            done();
          };

          checkVisibility(a11yAccordion, 2, true);
          a11yAccordion.uncollapseRow(3);
        };

        a11yAccordion.uncollapseRow(2);
      });
    });

    it('collapseRow() and _collapse()', function(done) {
      var customOptions = _.clone(testOptions, true);
      customOptions.onAreaHide = function(element) {
        expect(element.length).to.equal(1);
        checkVisibility(a11yAccordion, 2, false);
        done();
      };

      var a11yAccordion = new A11yAccordion(customOptions);

      a11yAccordion._onAreaShow = function() {
        checkVisibility(a11yAccordion, 2, true);

        a11yAccordion.collapseRow(2);
      };

      a11yAccordion.uncollapseRow(2);
    });

    it('toggleRow()', function(done) {
      var customOptions = _.clone(testOptions, true);
      customOptions.onAreaHide = function(element) {
        checkVisibility(a11yAccordion, 2, false);
        done();
      };
      customOptions.onAreaShow = function(element) {
        checkVisibility(a11yAccordion, 2, true);
        a11yAccordion.toggleRow(2);
      };

      var a11yAccordion = new A11yAccordion(customOptions);
      checkVisibility(a11yAccordion, 2, false);

      a11yAccordion.toggleRow(2);
    });

    it('getRowEl()', function() {
      var a11yAccordion = new A11yAccordion(testOptions),
          row;

      row = a11yAccordion.getRowEl(-1);
      expect(row).to.be.undefined;

      row = a11yAccordion.getRowEl(2);
      expect(row[0].id).to.equal('accordion1-row-2');
    });

    // Private

    it('_collapseAll()', function(done) {
      var customOptions = _.clone(testOptions, true),
          index = 0;

      customOptions.showOne = false;
      customOptions.onAreaHide = function(element) {
        index ++;

        if (index === 2) {
          checkVisibility(a11yAccordion, 2, false);
          checkVisibility(a11yAccordion, 3, false);
          done();
        }
      };
      customOptions.onAreaShow = function(element) {
        index++;

        if (index === 2) {
          index = 0;

          checkVisibility(a11yAccordion, 2, true);
          checkVisibility(a11yAccordion, 3, true);

          a11yAccordion._collapseAll();
        }
      };

      var a11yAccordion = new A11yAccordion(customOptions);

      checkVisibility(a11yAccordion, 2, false);
      checkVisibility(a11yAccordion, 3, false);

      a11yAccordion.uncollapseRow(2);
      a11yAccordion.uncollapseRow(3);
    });

    it('_getHiddenArea()', function() {
      var a11yAccordion = new A11yAccordion(testOptions),
          hiddenArea;

      hiddenArea = a11yAccordion._getHiddenArea(-1);

      expect(hiddenArea).to.be.undefined;

      hiddenArea = a11yAccordion._getHiddenArea(1);
      expect(hiddenArea).not.to.be.undefined;
      expect(hiddenArea.is(":visible")).to.be.false;
    });

  });
})(chai.expect);