import { Server } from 'socket.io';
import { getSystemInfo, getRealtimeInfo } from './systemFunctions.js';

export default async (httpServer) => {
  const io = new Server(httpServer);
  const systemInfo = await getSystemInfo();

  let realtimeInfo = {};
  let intervalUpdate = null;

  io.on('connect', socket => {
    // Connect socket
    socket.emit('systemInfo', systemInfo);

    // Set emit interval
    if(!intervalUpdate){
      intervalUpdate = setInterval(async () => {
        realtimeInfo = await getRealtimeInfo();
        io.emit('realtimeInfo', realtimeInfo);
      }, 2000);
    }

    // Disconnect socket
    socket.on('disconnect', async () => {
      const sockets = await io.fetchSockets();
      if(sockets.length <= 0){
        clearInterval(intervalUpdate);
        intervalUpdate = null;
      }
    });
  });
}