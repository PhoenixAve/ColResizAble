(function () {
  $.fn.extend({
    colResizAble: function (options) {
      var settings = {
        liveDrag: true,
        minWidth: 36,
        headerOnly: true,
        disabledColumns: [],
        onResizing: null,
        onResized: null
      }

      var $document = $(document) || $(document.body)
      var $table = $(this)
      var $tableLine = $('.table-line')
      var $resizeLine = $('.resize-line')
      var tableWidth = $table.outerWidth()
      var minWidth = 36
      var maxWidth = 0
      var changeTable = true

      $('th').css('min-width', minWidth)

      if (changeTable) {
        // 当表格可以改变时，最大宽度没有限制
        maxWidth = Infinity
      }
      $resizeLine.on('mousedown', function (event) {
        var $parentTh = $(this).parent('th')

        if (!changeTable) maxWidth = tableWidth - $parentTh.nextAll('th').length * minWidth

        var thWidth = $parentTh.outerWidth()

        var startX = event.clientX // 鼠标开始的水平距离
        var moveDis = 0 // 鼠标移动的水平距离
        var lineLeft = 0 // 示意线的定位距离
        var thRightToTableLeftDis = 0 // 鼠标拖拽的单元格的右侧到table的左边框的距离

        thRightToTableLeftDis += thWidth
        $parentTh.prevAll('th').each(function () {
          thRightToTableLeftDis += $(this).outerWidth()
        })

        lineLeft = thRightToTableLeftDis
        $tableLine.css('left', lineLeft)
        $tableLine.show()
        // 鼠标移动时计算移动的距离
        $document.on('mousemove.colResizAble', function (event) {
          moveDis = event.clientX - startX
          if (thWidth + moveDis >= minWidth && thWidth + moveDis <= maxWidth) {
            // 当表格拖拽在合理范围内时，即大于 minWidth 并且小于 maxWidth时
            $tableLine.css('left', lineLeft + moveDis)
          }
        })
        $document.on('mouseup.colResizAble', function () {
          var newWidth = $parentTh.outerWidth() + moveDis
          $parentTh.outerWidth(newWidth)
          if (newWidth < minWidth) {
            // 当表格的宽度被限制的时候，如果最终计算的表格不符合实际宽度，则设置为实际宽度
            $parentTh.outerWidth(minWidth)
          } else if (changeTable && newWidth > maxWidth) {
            $parentTh.outerWidth(maxWidth)
          }
          // if (newWidth < $parentTh.outerWidth() || newWidth > $parentTh.outerWidth()) {
          //   // 当表格的宽度被限制的时候，如果最终计算的表格不符合实际宽度，则设置为实际宽度   $parentTh.outerWidth(minWidth)
          // }
          if (changeTable) {
            $table.outerWidth(function (index, width) {
              var newTableWidth = width + moveDis
              return newTableWidth < tableWidth ? tableWidth : newTableWidth
            })
          }
          $tableLine.css('left', 0).hide()
          // 删除documetn上绑定的事件
          $document.off('.colResizAble')
        })
      })
    }
  })
})()