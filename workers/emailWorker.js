// workers/emailWorker.js
import { Worker } from "bullmq";
import { connection } from "../utils/redis.js";
import {
  sendApplicationNotification,
  sendAdminNotification,
} from "../utils/mailer.js";

new Worker(
  "email-queue",
  async (job) => {
    const { type, payload } = job.data;

    if (type === "USER_EMAIL") {
      await sendApplicationNotification(payload);
    }

    if (type === "ADMIN_EMAIL") {
      await sendAdminNotification(payload);
    }
  },
  { connection }
);