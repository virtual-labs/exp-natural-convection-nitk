var _$_349c = [
  "top",
  "center",
  "bold",
  "calibri",
  "dimGrey",
  "spline",
  "Float",
  "Chart",
  "render",
];
function drawgraph2(
  _0x6EEF,
  _0x6E69,
  _0x6EAC,
  _0x6FB8,
  _0x6FFB,
  _0x6E26,
  _0x6F32,
  _0x6F75
) {
  var _0x6DE3 = new CanvasJS[_$_349c[7]](_0x6EEF, {
    backgroundColor: "transparent",
    zoomEnabled: true,
    title: { text: _0x6E26 },
    toolTip: { shared: false },
    legend: {
      verticalAlign: _$_349c[0],
      horizontalAlign: _$_349c[1],
      fontSize: 14,
      fontWeight: _$_349c[2],
      fontFamily: _$_349c[3],
      fontColor: _$_349c[4],
    },
    axisX: { title: _0x6FB8 },
    axisY: { title: _0x6FFB, includeZero: false },
    data: [
      {
        type: _$_349c[5],
        xValueType: _$_349c[6],
        showInLegend: true,
        name: _0x6F32,
        markerSize: 1,
        dataPoints: _0x6E69,
      },
      {
        type: _$_349c[5],
        xValueType: _$_349c[6],
        showInLegend: true,
        name: _0x6F75,
        markerSize: 1,
        dataPoints: _0x6EAC,
      },
    ],
  });
  _0x6DE3[_$_349c[8]]();
}
