/*global describe, afterEach, it, chai, a11yAccordeon*/

(function (expect) {
  describe('a11yAccordeon tests', function() {

    var accordeonCleanUp = function() {
      $('#accordeon1').empty();
    };

    var generateAccordeonMarkup = function() {
      accordeonCleanUp();
      var markup = $('#accordeon1'),
          rows = [];

      for (var i=0; i < 5; ++i) {
        var row = $('<li>', {
          'class': 'a11yAccordeonItem'
        });

        $('<div>', {
          'class': 'a11yAccordeonItemHeader',
          test: 'Header ' + i
        }).appendTo(row);

        $('<div>', {
          'class': 'a11yAccordeonHideArea',
          test: 'Item ' + i
        }).appendTo(row);

        rows.push(row);
      }

      markup.prepend(rows);
    };

    afterEach(function () {
      accordeonCleanUp();
    });

    it('a11yAccordeon fail creation tests', function() {
      generateAccordeonMarkup();

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
        expect(a11yAccordeon(options)).to.be.undefined;
        testIndex = testIndex + 1;
      });

      expect(testIndex).to.equal(testCases.length);
    });

    it('a11yAccordeon proper creation tests', function() {
      var testIndex = 0;

      var testCases = [
        {
          parentSelector: '#accordeon1',
          accordeonItemSelector: undefined,
          headerSelector: undefined,
          hiddenAreaSelector: undefined,
          visibleAreaClass: undefined
        }
      ];

      _.each(testCases, function(options) {
        generateAccordeonMarkup();
        expect(a11yAccordeon(options)).to.not.be.undefined;
        testIndex = testIndex + 1;
      });

      expect(testIndex).to.equal(testCases.length);
    });

    it('collapseRow() tests', function() {
      expect(true).to.be.ok;
    });

    it('uncollapseRow() tests', function() {
      expect(true).to.be.ok;
    });

    it('toggleRow() tests', function() {
      expect(true).to.be.ok;
    });

    it('getRowEl() tests', function() {
      expect(true).to.be.ok;
    });

  });
})(chai.expect);