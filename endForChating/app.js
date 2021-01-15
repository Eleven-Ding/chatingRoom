const ws = require("nodejs-websocket");
const moment = require("moment");

console.log("开始建立连接...");

let users = [];
//时间格式化
function getDate() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

// 向所有连接的客户端广播
function boardcast(obj) {
  obj.len = users.length;
  server.connections.forEach(function (conn) {
    // 给每个客户端都发送消息
    conn.sendText(JSON.stringify(obj));
  });
}

const server = ws
  .createServer(function (conn) {
    conn.on("text", function (obj) {
      obj = JSON.parse(obj);
      const { uid, type, username } = obj;
      let index = users.indexOf(uid);
      if (index === -1) {
        users.push(uid);
      }
      obj.time = getDate();

      switch (type) {
        case 1:
          obj.message = obj.username + "加入聊天室";
          break;
        case 3:
          obj.message = obj.username + "离开聊天室";
      }
      boardcast(obj);
    });
    conn.on("close", function (code, reason) {
      console.log("关闭连接");
    });
    conn.on("error", function (code, reason) {
      console.log("异常关闭");
    });
  })
  .listen(8765);
console.log("WebSocket建立完毕");
