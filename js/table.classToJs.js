'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ColResizAble = function () {
  function ColResizAble(domTable, options) {
    _classCallCheck(this, ColResizAble);

    $.extend(options, ColResizAble.settings);
    this.init(domTable);
  }

  _createClass(ColResizAble, [{
    key: 'init',
    value: function init(domTable) {
      this.$document = $(document) || $(document.body);
      this.$table = $(domTable);
      this.$tableLine = $('.table-line');
      this.$resizeLine = $('.resize-line');
      this.tableWidth = this.$table.outerWidth();

      this.$parentTh = null;
      this.$thNext = null;
      this.thWidth = 0;

      this.minWidth = 36;
      this.maxWidth = 0;
      this.changeTable = true;

      this.startX = 0; // 鼠标开始的水平距离
      this.moveDis = 0; // 鼠标移动的水平距离
      this.lineLeft = 0; // 示意线的定位距离

      $('th').css('min-width', this.minWidth);

      if (this.changeTable) {
        // 当表格可以改变时，最大宽度没有限制
        this.maxWidth = Infinity;
      }
      var self = this;
      this.$resizeLine.on('mousedown', function (event) {
        self.$parentTh = $(this).parent('th');
        self.$thNext = self.$parentTh.next('th');
        self.onMouseDown(event);
      });
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(event) {
      var _this = this;

      if (!this.changeTable) {
        this.maxWidth = this.tableWidth - this.$parentTh.nextAll('th').length * this.minWidth;
      }

      this.thWidth = this.$parentTh.outerWidth();

      this.startX = event.clientX; // 鼠标开始的水平距离

      this.setTableLineStartPosition();

      this.$document.on('mousemove.colResizAble', function (event) {
        _this.onMouseMove(event);
      });
      this.$document.on('mouseup.colResizAble', function (event) {
        _this.onMouseUp(event);
        _this.$document.off('.colResizAble');
      });
    }
  }, {
    key: 'setTableLineStartPosition',
    value: function setTableLineStartPosition() {
      var thRightToTableLeftDis = 0; // 鼠标拖拽的单元格的右侧到table的左边框的距离

      thRightToTableLeftDis += this.thWidth;
      this.$parentTh.prevAll('th').each(function () {
        thRightToTableLeftDis += $(this).outerWidth();
      });

      this.lineLeft = thRightToTableLeftDis;
      this.$tableLine.css('left', this.lineLeft);
      this.$tableLine.show();
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(event) {
      // 鼠标移动时计算移动的距离
      this.moveDis = event.clientX - this.startX;
      if (this.thWidth + this.moveDis <= this.minWidth) {
        this.moveDis = this.minWidth - this.thWidth;
      } else if (this.thWidth + this.moveDis >= this.maxWidth) {
        this.moveDis = this.maxWidth - this.thWidth;
      }
      this.$tableLine.css('left', this.lineLeft + this.moveDis);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp() {
      this.setThWidth();
      this.setTableWidth();
      this.$tableLine.css('left', 0).hide();
    }
  }, {
    key: 'setThWidth',
    value: function setThWidth(newWidth) {
      var newWidth = this.$parentTh.outerWidth() + this.moveDis;
      this.$parentTh.outerWidth(newWidth);
      if (newWidth < this.minWidth) {
        // 当表格的宽度被限制的时候，如果最终计算的表格不符合实际宽度，则设置为实际宽度
        this.$parentTh.outerWidth(this.minWidth);
      } else if (this.changeTable && newWidth > this.maxWidth) {
        this.$parentTh.outerWidth(this.maxWidth);
      }
      // if (newWidth < this.$parentTh.outerWidth() || newWidth > this.$parentTh.outerWidth()) {
      //   // 当表格的宽度被限制的时候，如果最终计算的表格不符合实际宽度，则设置为实际宽度   
      //  this.$parentTh.outerWidth(minWidth)
      // }
    }
  }, {
    key: 'setTableWidth',
    value: function setTableWidth() {
      var _this2 = this;

      if (this.changeTable) {
        this.$table.outerWidth(function (index, width) {
          var newTableWidth = width + _this2.moveDis;
          return newTableWidth < _this2.tableWidth ? _this2.tableWidth : newTableWidth;
        });
      }
    }
  }]);

  return ColResizAble;
}();

ColResizAble.settings = {
  liveDrag: true, // 拖拽立即见效果
  minWidth: 36,
  headerOnly: true,
  disabledColumns: [],
  onResizing: null,
  onResized: null
};