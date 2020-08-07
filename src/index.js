import React, { useEffect, useState, useRef } from "react";
import { render } from "react-dom";
import { ResponsiveNetwork } from "@nivo/network";
import { ResponsiveLine } from "@nivo/line";
import { simulation } from "./simulation";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";

//ネットワーク図
const NetworkChart = (props) => {
  const step = props.step;
  const newNodes = props.newNodes;
  const newLinks = props.newLinks;
  return (
    <div style={{ width: "1000px", height: "1000px" }}>
      <ResponsiveNetwork
        nodes={newNodes}
        links={newLinks}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        repulsivity={3}
        iterations={50}
        nodeColor={(node) => {
          if (node.values[step] === 1) {
            return "red";
          } else if (node.values[step] === 0) {
            return "gray";
          } else if (node.values[step] === -1) {
            return "blue";
          }
        }}
        linkColor={(link) => {
          return "gray";
        }}
        nodeBorderWidth={1}
        nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
        linkThickness={(link) => {
          return 2;
        }}
        motionStiffness={160}
        motionDamping={12}
      />
    </div>
  );
};

//折れ線グラフ
const LineChart = (props) => {
  const step = 50;
  const newNodes = props.newNodes;

  const LineNodes = newNodes;
  //各ステップごとの-1,0,1の数を数えるcountの作成し０で初期化
  var count = { Negative: {}, Neutral: {}, Positive: {} };
  for (var d = 0; d < step; d++) {
    count.Negative[d] = 0;
    count.Neutral[d] = 0;
    count.Positive[d] = 0;
  }
  //countに対して、実際に-1,0,1の数を数えて代入
  const valueset = Array.from(new Set(LineNodes.map(({ values }) => values)));
  for (var v = 0; v < step; v++) {
    for (const j of valueset) {
      if (j[v] === -1) {
        count.Negative[v] += 1;
      } else if (j[v] === 0) {
        count.Neutral[v] += 1;
      } else if (j[v] === 1) {
        count.Positive[v] += 1;
      }
    }
  }

  //数えられたcountに対して、それを割合に変換する
  var num = 1.0;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < step; j++) {
      num = 1.0;
      if (i === 0) {
        num = (count.Negative[j] / LineNodes.length) * 100;
        count.Negative[j] = Math.round(num * 10) / 10;
      } else if (i === 1) {
        num = (count.Neutral[j] / LineNodes.length) * 100;
        count.Neutral[j] = Math.round(num * 10) / 10;
      } else {
        num = (count.Positive[j] / LineNodes.length) * 100;
        count.Positive[j] = Math.round(num * 10) / 10;
      }
    }
  }

  //欲しいデータの形に作った配列等を代入する
  const alldata = [];
  function dataset() {
    return Object.entries(count).map(([key, values]) => {
      var stepcount = 0;
      return {
        id: key,
        data: Object.values(values).map((d) => {
          return {
            x: stepcount++,
            y: d,
          };
        }),
      };
    });
  }
  const result = dataset(alldata);

  return (
    <div style={{ width: "1000px", height: "500px" }}>
      <ResponsiveLine
        data={result}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: 100,
          stacked: false,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "TimeStep",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "ratio",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        colors={(data) => {
          if (data.id === "Negative") {
            return "blue";
          } else if (data.id === "Neutral") {
            return "gray";
          } else {
            return "red";
          }
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="y"
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

//次数の分布
const MyResponsiveScatterPlot = (props) => {
  const step = props.step;
  const newNodes = props.newNodes;
  const LineNodes = newNodes;
  //各ステップごとの-1,0,1の数を数えるcountの作成し０で初期化
  var count = { Negative: {}, Neutral: {}, Positive: {} };
  for (var d = 0; d < step; d++) {
    count.Negative[d] = 0;
    count.Neutral[d] = 0;
    count.Positive[d] = 0;
  }
  //countに対して、実際に-1,0,1の数を数えて代入
  const valueset = Array.from(new Set(LineNodes.map(({ values }) => values)));
  for (var v = 0; v < step; v++) {
    for (const j of valueset) {
      if (j[v] === -1) {
        count.Negative[v] += 1;
      } else if (j[v] === 0) {
        count.Neutral[v] += 1;
      } else if (j[v] === 1) {
        count.Positive[v] += 1;
      }
    }
  }

  //数えられたcountに対して、それを割合に変換する
  var num = 1.0;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < step; j++) {
      num = 1.0;
      if (i === 0) {
        num = (count.Negative[j] / LineNodes.length) * 100;
        count.Negative[j] = Math.round(num * 10) / 10;
      } else if (i === 1) {
        num = (count.Neutral[j] / LineNodes.length) * 100;
        count.Neutral[j] = Math.round(num * 10) / 10;
      } else {
        num = (count.Positive[j] / LineNodes.length) * 100;
        count.Positive[j] = Math.round(num * 10) / 10;
      }
    }
  }

  //欲しいデータの形に作った配列等を代入する
  const alldata = [];
  function dataset() {
    return Object.entries(count).map(([key, values]) => {
      var stepcount = 0;
      return {
        id: key,
        data: Object.values(values).map((d) => {
          return {
            x: stepcount++,
            y: d,
          };
        }),
      };
    });
  }
  const result = dataset(alldata);
  console.log(result);

  return (
    <div style={{ width: "1000px", height: "500px" }}>
      <ResponsiveScatterPlot
        data={result}
        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
        xScale={{ type: "linear", min: 0, max: "auto" }}
        xFormat={function (e) {
          return e + " kg";
        }}
        yScale={{ type: "linear", min: 0, max: "auto" }}
        yFormat={function (e) {
          return e + " cm";
        }}
        blendMode="multiply"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "weight",
          legendPosition: "middle",
          legendOffset: 46,
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "size",
          legendPosition: "middle",
          legendOffset: -60,
        }}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 130,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 12,
            itemsSpacing: 5,
            itemDirection: "left-to-right",
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

//左側コンポーネント
const App = () => {
  let positiveEl = useRef(null);
  let negativeEl = useRef(null);
  let percentEl = useRef(null);
  const [step, setStep] = useState(50);

  const handleSubmit = (event) => {
    event.preventDefault();
    setStep(+event.target.elements.step.value);
  };

  //data set
  const [data, setData] = useState({ nodes: [], links: [] });
  useEffect(() => {
    window
      .fetch("all.json")
      .then((response) => response.json())
      .then((data) => {
        for (const node of data.nodes) {
          node.id = node.id.toString();
          node.radius = 5;
        }
        for (const link of data.links) {
          link.color = "gray";
          link.source = link.source.toString();
          link.target = link.target.toString();
          link.distance = 20;
        }
        setData(data);
      });
  }, []);

  const newLinks = data.links.filter(function (item, index) {
    if (item.weight >= 5) {
      return true;
    } else {
      return false;
    }
  });

  function check(value) {
    for (const links of newLinks) {
      if (value.id === links.source || value.id === links.target) {
        return value;
      }
    }
  }

  const newNodes = data.nodes.filter(check);

  //次数について
  function Degcount(value) {
    var Degc = 0;
    for (const links of newLinks) {
      if (value.id === links.source || value.id === links.target) {
        Degc++;
      }
    }
    if (Degc > 1) {
      value.Degree = Degc;
      return value;
    }
  }
  var DegNodes = [];
  DegNodes = data.nodes.filter(Degcount);
  DegNodes.sort(function (a, b) {
    return a.Degree > b.Degree ? -1 : 1;
  });
  DegNodes.slice(0, 99);

  const options = DegNodes.map((value) => {
    return <option value={value.id}>{value.name}</option>;
  });
  const percents = [0, 25, 50, 75, 100];
  const perOptions = percents.map((value) => {
    return <option value={value}>{value}</option>;
  });

  //onClick時　選択されたidを取得

  const clickButton = () => {
    handleClickEvent(data.nodes);
  };

  const handleClickEvent = () => {
    var percent;
    for (const option of percentEl.current.options) {
      if (option.selected === true) {
        percent = option.value;
      }
    }
    console.log(percent);
    var positiveIds = [];

    for (const option of positiveEl.current.options) {
      if (option.selected === true) {
        positiveIds.push(option.value);
      }
    }
    var negativeIds = [];
    for (const option of negativeEl.current.options) {
      if (option.selected === true) {
        negativeIds.push(option.value);
      }
    }
    const newData = simulation(data, positiveIds, negativeIds, percent, 50);
    setData(newData);
  };

  return (
    <div>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css"
        ></link>
      </head>

      {/*配置*/}
      <div className="tile is-ancestor">
        <div className="tile is-vertical is-3">
          <div className="tile">
            <div className="tile is-parent is-vertical">
              <article className="tile is-child box">
                <p className="title">Positive</p>
                <p className="subtitle">Ctrlで複数選択可能</p>

                <div className="control">
                  <div className="select is-multiple">
                    <select multiple ref={positiveEl}>
                      {options}
                    </select>
                  </div>
                </div>
              </article>

              <article className="tile is-child box">
                <p className="title">Negative</p>
                <p className="subtitle">Ctrlで複数選択可能</p>

                <div className="control">
                  <div className="select is-multiple">
                    <select multiple ref={negativeEl}>
                      {options}
                    </select>
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/*シミュレーションstep作成*/}
          <div className="tile">
            <div className="tile is-parent is-vertical">
              <article className="tile is-child box">
                <p className="title">Step</p>
                <p className="subtitle">step設定</p>
                <form>
                  <input name="step" type="number" defaultValue={step} />
                </form>
                <p>{step}stepまでシミュレーションを行う</p>
              </article>

              <article className="tile is-child box">
                {/*選択肢ボタン作成*/}
                <p className="title">ルール１：投票Model</p>
                <p className="subtitle">自分の意思を0~100%の割合で反映します</p>
                <select ref={percentEl}>{perOptions}</select>
              </article>
            </div>
          </div>

          {/*スタートボタン*/}
          <div className="tile">
            <div className="tile is-parent is-vertical">
              <article className="tile is-child box">
                <p className="title">Start</p>
                <p className="subtitle">
                  Startボタンを押すとシミュレーションを開始します
                </p>
                <button
                  className="button is-danger is-active"
                  onClick={clickButton}
                >
                  Start
                </button>
              </article>
            </div>
          </div>
        </div>

        <div className="tile is-parent">
          <div className="tile">
            <article className="tile is-parent is-vertical">
              <p className="title">ネットワーク</p>
              <p className="subtitle">コメント</p>
              {/*ステップ数更新作成*/}
              <form onSubmit={handleSubmit}>
                <input name="step" type="number" defaultValue={step} />
                <button type="submit">ステップ数を変更する！</button>
              </form>
              <p>現在のステップ数　{step}</p>
              <NetworkChart
                step={step}
                newNodes={newNodes}
                newLinks={newLinks}
              />
            </article>
            <article className="tile is-child is-vertical">
              <p className="title">折れ線グラフ</p>
              <p className="subtitle">コメント</p>
              <LineChart step={step} newNodes={newNodes} newLinks={newLinks} />
              <p className="title">次数の分布</p>

              <MyResponsiveScatterPlot
                step={step}
                newNodes={newNodes}
                newLinks={newLinks}
              />
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};
render(<App />, document.querySelector("#content"));
