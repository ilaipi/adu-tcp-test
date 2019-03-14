const net = require('net');

const server = net.createServer();

const conns = [];

const handleData = (self, other, sig) => {
  self.on('end', () => {
    // 事实证明 end事件往往和close事件一起触发
    console.log(`${sig} end`);
  });
  self.on('data', data => {
    const msg = data.toString();
    if (msg === 'restart') {
      console.log('=====restart======');
      conns.length = 0;
      return;
    }
    console.log(`======data of ${sig}`, msg)
    other.write(msg);
  });
  self.on('error', error => {
    console.log(`=====error of ${sig}`);
    console.log(error.stack);
    other.write(error.stack);
  });
  self.on('close', () => {
    console.log(`${sig} socket closed`);
  });
};

const register = () => {
  const [conn1, conn2] = conns;
  handleData(conn1, conn2, 1);
  handleData(conn2, conn1, 2);
};

server.on('connection', (socket) => {
  console.log(`connected ${conns.length}`);
  conns.push(socket);
  // for (let sock of conns) {
    // sock.write(`conns: ${conns.length}`)
  // }
  if (conns.length >= 2) {
    register();
  }
});

server.on('close', () => {
  console.log('server closed');
});

server.listen('1500');
