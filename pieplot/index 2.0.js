window.onload = function () {
    var color = ['#c23632', '#304553', '#60a0a8', '#d48265', '#91c7af'];
    //数据源
    const dataSet = [
      {value: 335, name: '舞蹈区'},
      {value: 310, name: '生活区'},
      {value: 114, name: '美食区'},
      {value: 335, name: '学习区'},
      {value: 948, name: '游戏区'},
    ];
  
    //处理数据
    var data = dataSet.map ((item, i) => ({
      ...item,
      visible: true,
      color: color[i],
    }));
    //图表绘制参数
    var width = 1800;
    var height = 880;
    var R = 150;
    let svg, g, tips;
    //绘制饼图所需要的
    //pie计算扇形起始角度等参数
    let pie = d3.pie ().sort (null).value (d => d.value);
    //绘制扇形所需，innerRadius为内径，设置为0，则为饼图，设置数值则会形成环图
    let arc = d3.arc ().innerRadius (0).outerRadius (R);
    let arc1 = d3.arc ().innerRadius (0).outerRadius (R + 10);
    function init () {
      svg = d3
        .select ('#pies')
        .append ('svg')
        .attr ('width', width)
        .attr ('height', height);
      initTitle ();
      initLegend ();
      initTips ();
      //饼图是绘制在中心的，所以需要定位
      g = svg
        .append ('g')
        .attr ('class', 'pies')
        .attr ('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    }
  
    function initTitle () {
      //绘制标题
      svg
        .append ('text')
        .text ('b站访问占比')
        .attr ('x', 900)
        .attr ('y', 280)
        .style ('font-size', '30px')
        .style ('text-anchor', 'middle');
    }
    function initTips () {
      tips = d3
        .select ('#pies')
        .append ('div')
        .attr ('class', 'tips')
        .style ('display', 'none');
      tips.append ('p').attr ('class', 'tips_title');
      tips.append ('p').attr ('class', 'tips_value');
    }
    function initLegend () {
      //先绘制创建图例group绑定数据，并定位
      legends = svg
        .append ('g')
        .attr ('class', 'legends')
        .selectAll ('g.legend')
        .data (data)
        .enter ()
        .append ('g')
        .attr ('class', 'legend')
        .attr ('transform', (d, i) => `translate(0,${(i + 1) * 16})`);
      //绘制矩形
      legends
        .append ('rect')
        .attr ('rx', 2)
        .attr ('ry', 2)
        .attr ('x', 650)
        .attr ('y', 380)
        .attr ('width', 20)
        .attr ('height', 12)
        .attr ('fill', (d, i) => d.color)
        .on ('click', function (d, i) {
          //更新数据是否可见，先更新legends颜色，然后重绘饼图
          data[i].visible = !data[i].visible;
          d3.select (this).attr ('fill', data[i].visible ? d.color : '#ccc');
          updateShape ();
        });
      //绘制图例标题
      legends
        .append ('text')
        .attr ('x', 680)
        .attr ('y', 390)
        .style ('font-size', '14px')
        .text (d => d.name);
    }
    function updateShape () {
      //更新与数据相关联的扇形
      //绑定数据
      //dataVisible=[true,true,true,true,true]
      var pies = g
        .selectAll ('g.pie')
        .data (pie (data.filter (item => item.visible)));
  
      //更新新数据后，如果数据有新增，则需要添加dom
      var enters = pies.enter ().append ('g').attr ('class', 'pie');
      enters.append ('path');
      //更新新数据后，如果数据有减少，则需要删除多余
      pies.exit ().remove ();
      //合并数据，将新增的dom和原有的dom合并
      pies = pies.merge (enters);
  
      //更新扇形
      pies
        .select ('path')
        .attr ('fill', d => d.data.color)
        .attr ('d', arc)
        .call (addEvent); //加入交互
    }
    function addEvent (selection) {
      //对扇形添加鼠标事件
      selection
        .on ('mouseover', function (d) {
          //鼠标移入，增大扇形半径，修改tips内容
  
          tips.style ('display', 'block');
          d3.select (this).attr ('d', arc1);
          tips.select ('p.tips_title').text (d.data.name);
          tips.select ('p.tips_value').text (d.data.value);
        })
        .on ('mousemove', function () {
          //鼠标移动，修改tips位置
          const mouseXY = d3.mouse (d3.select ('#pies').node ());
          tips
            .style ('left', mouseXY[0] + 20 + 'px')
            .style ('top', mouseXY[1] + 20 + 'px');
        })
        .on ('mouseout', function () {
          //鼠标移出重置扇形，隐藏tips
          d3.select (this).attr ('d', arc);
          tips.style ('display', 'none');
        });
    }
    init ();
    initTips ();
    updateShape ();
};