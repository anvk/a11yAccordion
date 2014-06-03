/* global beforeEach, afterEach, _, $, it, describe, chai, A11yAccordeon */

(function (expect) {
  describe('a11yAccordeon tests', function() {

    this.timeout(1500);

    var testAccordeonId = '#accordeon1',
        hiddenLinkDescription = 'Hidden Link Description';

    var testOptions = {
      parentSelector: testAccordeonId,
      accordeonItemSelector: '.a11yAccordeonItem',
      headerSelector: '.a11yAccordeonItemHeader',
      hiddenAreaSelector: '.a11yAccordeonHideArea',
      visibleAreaClass: 'visibleA11yAccordeonItem',
      hiddenLinkDescription: hiddenLinkDescription,
      speed: 1
    };

    var accordeonCleanUp = function() {
      $(testAccordeonId).empty();
    };

    var generateAccordeonMarkup = function() {
      accordeonCleanUp();
      var markup = $(testAccordeonId),
          rows = [];

      for (var i=0; i < 5; ++i) {
        var row = $('<li>', {
          'class': 'a11yAccordeonItem'
        });

        $('<div>', {
          'class': 'a11yAccordeonItemHeader',
          text: 'Header ' + i
        }).appendTo(row);

        $('<div>', {
          'class': 'a11yAccordeonHideArea',
          text: 'Item ' + i
        }).appendTo(row);

        rows.push(row);
      }

      markup.prepend(rows);
    };

    var checkVisibility = function(a11yAccordeon, rowIndex, isVisible) {
      var row = a11yAccordeon.getRowEl(rowIndex),
          hiddenArea = a11yAccordeon._getHiddenArea(rowIndex),
          hiddenAreaIsVisible = isVisible ? 'true' : 'false';
      expect(row.find(a11yAccordeon._showHeaderLabelSelector).is(":visible")).to.be[!isVisible ? 'true' : 'false'];
      expect(row.find(a11yAccordeon._hideHeaderLabelSelector).is(":visible")).to.be[isVisible ? 'true' : 'false'];
      expect(hiddenArea.is(":visible")).to.be[hiddenAreaIsVisible];
      expect(hiddenArea.hasClass(a11yAccordeon._visibleAreaClass)).to.be[hiddenAreaIsVisible];
    };

    beforeEach(generateAccordeonMarkup);
    afterEach(accordeonCleanUp);

    describe('a11yAccordeon creation', function() {
      it('bad options. failed to create', function() {
        var testIndex = 0;

        var testCases = [
          {
            throwMessage: 'a11yAccordeon - no element(s) with parentSelector was found',
            options: {
              parentSelector: undefined,
              accordeonItemSelector: '.a11yAccordeonItem',
              headerSelector: '.a11yAccordeonItemHeader',
              hiddenAreaSelector: '.a11yAccordeonHideArea',
              visibleAreaClass: 'visibleA11yAccordeonItem'
            }
          },
          {
            throwMessage: 'a11yAccordeon - no element(s) with accordeonItemSelector was found',
            options: {
              parentSelector: '#accordeon1',
              accordeonItemSelector: 'does not exist',
              headerSelector: '.a11yAccordeonItemHeader',
              hiddenAreaSelector: '.a11yAccordeonHideArea',
              visibleAreaClass: 'visibleA11yAccordeonItem'
            }
          },
          {
            throwMessage: 'a11yAccordeon - no element(s) with headerSelector was found',
            options: {
              parentSelector: '#accordeon1',
              accordeonItemSelector: '.a11yAccordeonItem',
              headerSelector: 'does not exist',
              hiddenAreaSelector: '.a11yAccordeonHideArea',
              visibleAreaClass: 'visibleA11yAccordeonItem'
            }
          },
          {
            throwMessage: 'a11yAccordeon - no element(s) with hiddenAreaSelector was found',
            options: {
              parentSelector: '#accordeon1',
              accordeonItemSelector: '.a11yAccordeonItem',
              headerSelector: '.a11yAccordeonItemHeader',
              hiddenAreaSelector: 'does not exist',
              visibleAreaClass: 'visibleA11yAccordeonItem'
            }
          }
        ];

        _.each(testCases, function(testCase) {
          try {
            new A11yAccordeon(testCase.options);
          } catch (exception) {
            testIndex = testIndex + 1;
            expect(exception).to.equal(testCase.throwMessage);
          }
        });

        expect(testIndex).to.equal(testCases.length);
      });

      describe('good options. succeeded to create', function() {
        var hasSearchDiv = function(a11yAccordeon) {
          return !!a11yAccordeon.el.find('.a11yAccordeonSearch').length;
        };

        it('Default creation', function() {
          var a11yAccordeon = new A11yAccordeon(testOptions),
              headerLinkHiddenEl, headerTextEl, row;

          expect(a11yAccordeon.el.attr('id')).to.equal('accordeon1');
          expect(a11yAccordeon._accordeonHideAreas.length).to.equal(5);
          hasSearchDiv(a11yAccordeon, true);
          expect(a11yAccordeon.el.find(a11yAccordeon._visibleAreaClass).filter(":visible").length).to.equal(0);

          row = a11yAccordeon.getRowEl(1);
          expect(row.find(a11yAccordeon._visibleAreaClass).filter(":visible").length).to.equal(0);

          checkVisibility(a11yAccordeon, 1, false);

          headerTextEl = row.find('.a11yAccordeonItemHeaderText');
          headerLinkHiddenEl = row.find('.a11yAccordeonItemHeaderLinkHiddenLabel');

          expect(headerTextEl.length).to.equal(1);
          expect(headerTextEl.text()).to.equal('Header 1');

          expect(headerLinkHiddenEl.length).to.equal(1);
          expect(headerLinkHiddenEl.text()).to.equal('Hidden Link Description');
        });

        it('Custom theme', function() {
          var customOptions = _.clone(testOptions, true);
          customOptions.colorScheme = 'myColorScheme';

          var a11yAccordeon = new A11yAccordeon(customOptions),
              row = a11yAccordeon.getRowEl(1);

          expect(row.find('.a11yAccordeonItemHeader').hasClass('myColorScheme-a11yAccordeon-header')).to.be.true;
          expect(row.find('.a11yAccordeonHideArea').hasClass('myColorScheme-a11yAccordeon-area')).to.be.true;
        });

        it('Without search', function() {
          var customOptions = _.clone(testOptions, true);
          customOptions.showSearch = false;

          var a11yAccordeon = new A11yAccordeon(customOptions);

          hasSearchDiv(a11yAccordeon, false);
        });
      });
    });

    describe('Search functionality', function() {
      it('Regular search', function() {
        var a11yAccordeon = new A11yAccordeon(testOptions),
            el = a11yAccordeon.el,
            searchInput = el.find('.a11yAccordeonSearch');

        var triggerKeyUp = function(text, expectedNumberOfRows) {
          searchInput.val(text);
          searchInput.keyup();

          expect(el.find('.a11yAccordeonItem').filter(':visible').length).to.equal(expectedNumberOfRows);

          if (!expectedNumberOfRows) {
            expect(!!el.find('#accordeon1-noResultsItem').length).to.be.true;
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

        var a11yAccordeon = new A11yAccordeon(customOptions),
            el = a11yAccordeon.el,
            searchInput = el.find('.a11yAccordeonSearch');

        var triggerKeyUp = function(text, expectedNumberOfRows) {
          searchInput.val(text);
          searchInput.keyup();

          expect(el.find('.a11yAccordeonItem').filter(':visible').length).to.equal(expectedNumberOfRows);

          if (!expectedNumberOfRows) {
            expect(!!el.find('#accordeon1-noResultsItem').length).to.be.true;
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
          checkVisibility(a11yAccordeon, 2, true);
          done();
        };

        var a11yAccordeon = new A11yAccordeon(customOptions);

        checkVisibility(a11yAccordeon, 2, false);

        a11yAccordeon.uncollapseRow(2);
      });

      it('showOne is set to true', function(done) {
        var a11yAccordeon = new A11yAccordeon(testOptions);

        checkVisibility(a11yAccordeon, 2, false);

        a11yAccordeon._onAreaShow = function() {
          var index = 0;

          a11yAccordeon._onAreaShow = function() {
            end(++index);
          };
          a11yAccordeon._onAreaHide = function() {
            end(++index);
          };

          var end = function(index) {
            if (index !== 2) {
              return;
            }

            checkVisibility(a11yAccordeon, 2, false);
            checkVisibility(a11yAccordeon, 3, true);
            done();
          };

          checkVisibility(a11yAccordeon, 2, true);
          a11yAccordeon.uncollapseRow(3);
        };

        a11yAccordeon.uncollapseRow(2);
      });

      it('showOne is set to false', function(done) {
        var customOptions = _.clone(testOptions, true);
        customOptions.showOne = false;

        var a11yAccordeon = new A11yAccordeon(customOptions);

        checkVisibility(a11yAccordeon, 2, false);

        a11yAccordeon._onAreaShow = function() {
          a11yAccordeon._onAreaShow = function() {
            checkVisibility(a11yAccordeon, 2, true);
            checkVisibility(a11yAccordeon, 3, true);
            done();
          };

          checkVisibility(a11yAccordeon, 2, true);
          a11yAccordeon.uncollapseRow(3);
        };

        a11yAccordeon.uncollapseRow(2);
      });
    });

    it('collapseRow() and _collapse()', function(done) {
      var customOptions = _.clone(testOptions, true);
      customOptions.onAreaHide = function(element) {
        expect(element.length).to.equal(1);
        checkVisibility(a11yAccordeon, 2, false);
        done();
      };

      var a11yAccordeon = new A11yAccordeon(customOptions);

      a11yAccordeon._onAreaShow = function() {
        checkVisibility(a11yAccordeon, 2, true);

        a11yAccordeon.collapseRow(2);
      };

      a11yAccordeon.uncollapseRow(2);
    });

    it('toggleRow()', function(done) {
      var customOptions = _.clone(testOptions, true);
      customOptions.onAreaHide = function(element) {
        checkVisibility(a11yAccordeon, 2, false);
        done();
      };
      customOptions.onAreaShow = function(element) {
        checkVisibility(a11yAccordeon, 2, true);
        a11yAccordeon.toggleRow(2);
      };

      var a11yAccordeon = new A11yAccordeon(customOptions);
      checkVisibility(a11yAccordeon, 2, false);

      a11yAccordeon.toggleRow(2);
    });

    it('getRowEl()', function() {
      var a11yAccordeon = new A11yAccordeon(testOptions),
          row;

      row = a11yAccordeon.getRowEl(-1);
      expect(row).to.be.undefined;

      row = a11yAccordeon.getRowEl(2);
      expect(row[0].id).to.equal('accordeon1-row-2');
    });

    // Private

    it('_collapseAll()', function(done) {
      var customOptions = _.clone(testOptions, true),
          index = 0;

      customOptions.showOne = false;
      customOptions.onAreaHide = function(element) {
        index ++;

        if (index === 2) {
          checkVisibility(a11yAccordeon, 2, false);
          checkVisibility(a11yAccordeon, 3, false);
          done();
        }
      };
      customOptions.onAreaShow = function(element) {
        index++;

        if (index === 2) {
          index = 0;

          checkVisibility(a11yAccordeon, 2, true);
          checkVisibility(a11yAccordeon, 3, true);

          a11yAccordeon._collapseAll();
        }
      };

      var a11yAccordeon = new A11yAccordeon(customOptions);

      checkVisibility(a11yAccordeon, 2, false);
      checkVisibility(a11yAccordeon, 3, false);

      a11yAccordeon.uncollapseRow(2);
      a11yAccordeon.uncollapseRow(3);
    });

    it('_getHiddenArea()', function() {
      var a11yAccordeon = new A11yAccordeon(testOptions),
          hiddenArea;

      hiddenArea = a11yAccordeon._getHiddenArea(-1);

      expect(hiddenArea).to.be.undefined;

      hiddenArea = a11yAccordeon._getHiddenArea(1);
      expect(hiddenArea).not.to.be.undefined;
      expect(hiddenArea.is(":visible")).to.be.false;
    });

  });
})(chai.expect);