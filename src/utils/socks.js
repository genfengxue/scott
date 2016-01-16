import sockjs from 'sockjs';
import RedisCache from '../redis/RedisCache';

const connPool = [];

const echo = sockjs.createServer({
  sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js',
  jsessionid: true,
});

echo.on('connection', async (conn) => {
  connPool.push(conn);
  await RedisCache.set(conn.id, {});

  conn.write(
    JSON.stringify({type: 'connect', data: conn.id})
  );

  conn.on('data', (message) => {
    console.log(message);
    conn.write(message);
  });

  conn.on('close', async () =>{
    await RedisCache.set(conn.id, null);
    connPool.splice(connPool.indexOf(conn), 1);
    console.log('closed');
  });
});

export default echo;
