/* global beforeEach, afterEach, _, $, it, describe, chai, A11yAccordeon */

(function (expect) {
  describe('a11yAccordeon tests', function() {

    this.timeout(1500);

    var testAccordeonId = '#accordeon1',
        hiddenLinkDescription = 'Hidden Link Description',
        ms = 1000;

    var testOptions = {
      parentSelector: testAccordeonId,
      accordeonItemSelector: '.a11yAccordeonItem',
      headerSelector: '.a11yAccordeonItemHeader',
      hiddenAreaSelector: '.a11yAccordeonHideArea',
      visibleAreaClass: 'visibleA11yAccordeonItem',
      hiddenLinkDescription: hiddenLinkDescription
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

      });
    });

    it('Search field tests', function() {
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

    // Public

    describe('uncollapseRow() and _uncollapse()', function() {
      it('regular functionality', function() {
        var a11yAccordeon = new A11yAccordeon(testOptions);

        checkVisibility(a11yAccordeon, 2, false);

        a11yAccordeon.uncollapseRow(2);

        checkVisibility(a11yAccordeon, 2, true);
      });

      it('showOne is set to true', function(done) {
        var a11yAccordeon = new A11yAccordeon(testOptions);

        checkVisibility(a11yAccordeon, 2, false);

        a11yAccordeon.uncollapseRow(2);

        checkVisibility(a11yAccordeon, 2, true);

        a11yAccordeon.uncollapseRow(3);

        setTimeout(function() {
          checkVisibility(a11yAccordeon, 2, false);
          checkVisibility(a11yAccordeon, 3, true);
          done();
        }, ms);
      });

      it('showOne is set to false', function() {
        var customOptions = _.clone(testOptions, true);
        customOptions.showOne = false;

        var a11yAccordeon = new A11yAccordeon(customOptions);

        checkVisibility(a11yAccordeon, 2, false);

        a11yAccordeon.uncollapseRow(2);

        checkVisibility(a11yAccordeon, 2, true);

        a11yAccordeon.uncollapseRow(3);

        checkVisibility(a11yAccordeon, 2, true);
        checkVisibility(a11yAccordeon, 3, true);
      });
    });

    it('collapseRow() and _collapse()', function(done) {
      var a11yAccordeon = new A11yAccordeon(testOptions);

      a11yAccordeon.uncollapseRow(2);

      checkVisibility(a11yAccordeon, 2, true);

      a11yAccordeon.collapseRow(2);

      setTimeout(function() {
        checkVisibility(a11yAccordeon, 2, false);
        done();
      }, ms);
    });

    it('toggleRow()', function(done) {
      var a11yAccordeon = new A11yAccordeon(testOptions);

      checkVisibility(a11yAccordeon, 2, false);

      a11yAccordeon.toggleRow(2);
      checkVisibility(a11yAccordeon, 2, true);

      a11yAccordeon.toggleRow(2);
      setTimeout(function() {
        checkVisibility(a11yAccordeon, 2, false);
        done();
      }, ms);
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
      var customOptions = _.clone(testOptions, true);
      customOptions.showOne = false;

      var a11yAccordeon = new A11yAccordeon(customOptions);

      checkVisibility(a11yAccordeon, 2, false);
      checkVisibility(a11yAccordeon, 3, false);

      a11yAccordeon.uncollapseRow(2);
      a11yAccordeon.uncollapseRow(3);

      checkVisibility(a11yAccordeon, 2, true);
      checkVisibility(a11yAccordeon, 3, true);

      a11yAccordeon._collapseAll();

      setTimeout(function() {
        checkVisibility(a11yAccordeon, 2, false);
        checkVisibility(a11yAccordeon, 3, false);
        done();
      }, ms);
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