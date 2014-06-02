/* global beforeEach, afterEach, _, $, it, describe, chai, A11yAccordeon */

(function (expect) {
  describe('a11yAccordeon tests', function() {

    var testAccordeonId = '#accordeon1',
        hiddenLinkDescription = 'Hidden Link Description',
        ms = 700;

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

    beforeEach(generateAccordeonMarkup);
    afterEach(accordeonCleanUp);

    it('a11yAccordeon fail creation tests', function() {
      var testIndex = 0;

      var testCases = [
        {
          parentSelector: undefined,
          accordeonItemSelector: '.a11yAccordeonItem',
          headerSelector: '.a11yAccordeonItemHeader',
          hiddenAreaSelector: '.a11yAccordeonHideArea',
          visibleAreaClass: 'visibleA11yAccordeonItem'
        },
        {
          parentSelector: '#accordeon1',
          accordeonItemSelector: 'does not exist',
          headerSelector: '.a11yAccordeonItemHeader',
          hiddenAreaSelector: '.a11yAccordeonHideArea',
          visibleAreaClass: 'visibleA11yAccordeonItem'
        },
        {
          parentSelector: '#accordeon1',
          accordeonItemSelector: '.a11yAccordeonItem',
          headerSelector: 'does not exist',
          hiddenAreaSelector: '.a11yAccordeonHideArea',
          visibleAreaClass: 'visibleA11yAccordeonItem'
        },
        {
          parentSelector: '#accordeon1',
          accordeonItemSelector: '.a11yAccordeonItem',
          headerSelector: '.a11yAccordeonItemHeader',
          hiddenAreaSelector: 'does not exist',
          visibleAreaClass: 'visibleA11yAccordeonItem'
        }
      ];

      _.each(testCases, function(options) {
        expect(new A11yAccordeon(options)).to.be.undefined;
        testIndex = testIndex + 1;
      });

      expect(testIndex).to.equal(testCases.length);
    });

    describe('a11yAccordeon proper creation', function() {

    });

    // Public

    describe('uncollapseRow() and _uncollapse()', function() {
      it('regular functionality', function() {
        var a11yAccordeon = new A11yAccordeon(testOptions);

        expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.false;

        a11yAccordeon.uncollapseRow(2);

        expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.true;
      });

      it('showOne is set to true', function(done) {
        var a11yAccordeon = new A11yAccordeon(testOptions);

        expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.false;

        a11yAccordeon.uncollapseRow(2);

        expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.true;

        a11yAccordeon.uncollapseRow(3);

        setTimeout(function() {
          expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.false;
          expect(a11yAccordeon._getHiddenArea(3).is(":visible")).to.be.true;
          done();
        }, ms);
      });

      it('showOne is set to false', function() {
        var customOptions = _.clone(testOptions, true);
        customOptions.showOne = false;

        var a11yAccordeon = new A11yAccordeon(customOptions);

        expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.false;

        a11yAccordeon.uncollapseRow(2);

        expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.true;

        a11yAccordeon.uncollapseRow(3);

        expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.true;
        expect(a11yAccordeon._getHiddenArea(3).is(":visible")).to.be.true;
      });
    });

    it('collapseRow() and _collapse()', function(done) {
      var a11yAccordeon = new A11yAccordeon(testOptions);

      a11yAccordeon.uncollapseRow(2);

      expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.true;

      a11yAccordeon.collapseRow(2);

      setTimeout(function() {
        expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.false;
        done();
      }, ms);
    });

    it('toggleRow()', function(done) {
      var a11yAccordeon = new A11yAccordeon(testOptions);

      expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.false;

      a11yAccordeon.toggleRow(2);
      expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.true;

      a11yAccordeon.toggleRow(2);
      setTimeout(function() {
        expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.false;
        done();
      }, ms);
    });

    it('getRowEl()', function() {
      var a11yAccordeon = new A11yAccordeon(testOptions),
          row;

      row = a11yAccordeon.getRowEl(-1);
      expect(row).to.be.undefined;

      row = a11yAccordeon.getRowEl(2);
      expect(row[0].id).to.equal('accordeon-row-2');
    });

    // Private

    it('_collapseAll()', function(done) {
      var customOptions = _.clone(testOptions, true);
      customOptions.showOne = false;

      var a11yAccordeon = new A11yAccordeon(customOptions);

      expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.false;
      expect(a11yAccordeon._getHiddenArea(3).is(":visible")).to.be.false;

      a11yAccordeon.uncollapseRow(2);
      a11yAccordeon.uncollapseRow(3);

      expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.true;
      expect(a11yAccordeon._getHiddenArea(3).is(":visible")).to.be.true;

      a11yAccordeon._collapseAll();

      setTimeout(function() {
        expect(a11yAccordeon._getHiddenArea(2).is(":visible")).to.be.false;
        expect(a11yAccordeon._getHiddenArea(3).is(":visible")).to.be.false;
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