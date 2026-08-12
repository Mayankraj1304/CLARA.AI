import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

const port = Number(process.env.PORT) || 3000;

connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize MongoDB:", error);
  });
