const { Context } = require("bottender");
const { text } = require("bottender/router");

exports.routes = [
  text(
    /^160\s(?<sum>(15|12))\s(?<room1>.)(?<number1>[1-9])\s(?<room2>.)(?<number2>[1-9])$/,
    ForestMatrix
  ),
];

/**
 * 九宮格解謎
 * @param {Context} Message
 * @param {Object} props
 */
function ForestMatrix(context, props) {
  const { room1, room2, number1, number2, sum } = props.match.groups;

  let matrix = calculate(sum, [
    { name: room1, value: parseInt(number1) },
    { name: room2, value: parseInt(number2) },
  ]);

  context.sendText(matrix.map(data => `${data.name}${data.value}`).join(" "));
}

function calculate(sum, rooms) {
  if (sum != 15 && sum != 12) throw "總和輸入錯誤";

  var roomName = ["魁", "晶", "阜", "寶", "帝", "彤", "牡", "蒼", "岡"];
  let matrix = [
    {
      name: "魁",
      value: -1,
      check: [
        [1, 2],
        [3, 6],
        [4, 8],
      ],
    },
    {
      name: "晶",
      value: -1,
      check: [
        [0, 2],
        [4, 7],
      ],
    },
    {
      name: "阜",
      value: -1,
      check: [
        [0, 1],
        [4, 6],
        [5, 8],
      ],
    },
    {
      name: "寶",
      value: -1,
      check: [
        [0, 6],
        [4, 5],
      ],
    },
    { name: "帝", value: -1, check: [] },
    {
      name: "彤",
      value: -1,
      check: [
        [3, 4],
        [2, 8],
      ],
    },
    {
      name: "牡",
      value: -1,
      check: [
        [0, 3],
        [2, 4],
        [7, 8],
      ],
    },
    {
      name: "蒼",
      value: -1,
      check: [
        [1, 4],
        [6, 8],
      ],
    },
    {
      name: "岡",
      value: -1,
      check: [
        [2, 5],
        [0, 4],
        [6, 7],
      ],
    },
  ];

  matrix[4].value = sum / 3;

  // 無腦題處理
  if (matrix[4].value == rooms[0].value && matrix[4].value == rooms[1].value) {
    matrix.forEach(data => {
      data.value = sum / 3;
    });
    return matrix;
  }

  rooms.forEach(room => {
    room.order = roomName.indexOf(room.name);
    if (room.order == -1) throw "房間名填寫錯誤，請檢查是否錯字";
    if (room.value > 9 || room.value <= 0) throw room.name + "水晶數填寫錯誤";

    matrix[room.order].value = room.value;
  });

  if (rooms[0].order + rooms[1].order == 8) throw "確定房間名是這樣嗎..? 這組無法計算出結果!!";

  let count = 0;

  do {
    matrix.forEach(data => {
      if (data.value != -1) return;

      data.check.forEach(rooms => {
        if (matrix[rooms[0]].value == -1 || matrix[rooms[1]].value == -1) return;

        data.value = sum - (matrix[rooms[0]].value + matrix[rooms[1]].value);
      });
    });

    count++;
  } while (isFinish(matrix) == false && count < 5);

  return matrix;
}

function isFinish(matrix) {
  let result = matrix.find(data => data.value === -1);
  return result === undefined ? true : false;
}
