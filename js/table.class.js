(function () {
  export default class ColResizAble {
    static settings = {
      liveDrag: true, // 拖拽立即见效果
      minWidth: 36,
      headerOnly: true,
      disabledColumns: [],
      onResizing: null,
      onResized: null
    }
    constructor (domTable, options) {
      $.extend(options, ColResizAble.settings)
      this.init(domTable)
    }
    init (domTable) {
      this.$document = $(document) || $(document.body)
      this.$table = $(domTable)
      this.$tableLine = $('.table-line')
      this.$resizeLine = $('.resize-line')
      this.tableWidth = this.$table.outerWidth()

      this.$parentTh = null
      this.thWidth = 0

      this.minWidth = 36
      this.maxWidth = 0
      this.changeTable = true

      this.startX = 0 // 鼠标开始的水平距离
      this.moveDis = 0 // 鼠标移动的水平距离
      this.lineLeft = 0 // 示意线的定位距离

      $('th').css('min-width', this.minWidth)

      if (this.changeTable) {
        // 当表格可以改变时，最大宽度没有限制
        this.maxWidth = Infinity
      }
      var self = this
      this.$resizeLine.on('mousedown', function (event) {
        self.$parentTh = $(this).parent('th')
        self.onMouseDown(event)
      })
    }
    onMouseDown (event) {
      if (!this.changeTable) {
        this.maxWidth = this.tableWidth - this.$parentTh.nextAll('th').length * this.minWidth
      }

      this.thWidth = this.$parentTh.outerWidth()

      this.startX = event.clientX // 鼠标开始的水平距离
      
      this.setTableLineStartPosition()

      this.$document.on('mousemove.colResizAble', (event) => {
        this.onMouseMove(event)
      })
      this.$document.on('mouseup.colResizAble', (event) => {
        this.onMouseUp(event)
        this.$document.off('.colResizAble')
      })
    }
    setTableLineStartPosition () {
      var thRightToTableLeftDis = 0 // 鼠标拖拽的单元格的右侧到table的左边框的距离

      thRightToTableLeftDis += this.thWidth
      this.$parentTh.prevAll('th').each(function () {
        thRightToTableLeftDis += $(this).outerWidth()
      })

      this.lineLeft = thRightToTableLeftDis
      this.$tableLine.css('left', this.lineLeft)
      this.$tableLine.show()
    }
    onMouseMove (event) {
      // 鼠标移动时计算移动的距离
      this.moveDis = event.clientX - this.startX
      if (this.thWidth + this.moveDis >= this.minWidth && this.thWidth + this.moveDis <= this.maxWidth) {
        // 当表格拖拽在合理范围内时，即大于 minWidth 并且小于 maxWidth时
        this.$tableLine.css('left', this.lineLeft + this.moveDis)
      }
    }
    onMouseUp () {
      this.setThWidth()
      this.setTableWidth()
      this.$tableLine.css('left', 0).hide()
    }
    setThWidth (newWidth) {
      var newWidth = this.$parentTh.outerWidth() + this.moveDis
      this.$parentTh.outerWidth(newWidth)
      if (newWidth < this.minWidth) {
        // 当表格的宽度被限制的时候，如果最终计算的表格不符合实际宽度，则设置为实际宽度
        this.$parentTh.outerWidth(this.minWidth)
      } else if (this.changeTable && newWidth > this.maxWidth) {
        this.$parentTh.outerWidth(this.maxWidth)
      }
      // if (newWidth < this.$parentTh.outerWidth() || newWidth > this.$parentTh.outerWidth()) {
      //   // 当表格的宽度被限制的时候，如果最终计算的表格不符合实际宽度，则设置为实际宽度   
      //  this.$parentTh.outerWidth(minWidth)
      // }
    }
    setTableWidth () {
      if (this.changeTable) {
        this.$table.outerWidth((index, width) => {
          var newTableWidth = width + this.moveDis
          return newTableWidth < this.tableWidth ? this.tableWidth : newTableWidth
        })
      }
    }
  }
})()