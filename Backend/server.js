import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";
import http from "http"
import { initSocket } from "./src/sockets/server.socket.js";

const port = Number(process.env.PORT);

const httpServer=http.createServer(app)
initSocket(httpServer)


connectToDB()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
