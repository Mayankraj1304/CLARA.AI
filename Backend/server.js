import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

const port = Number(process.env.PORT);

connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
