import "dotenv/config";
import { App } from "./app";
import "./cron/transaction.cron"

const main = () => {
  const app = new App();
  app.start();
};

main();
