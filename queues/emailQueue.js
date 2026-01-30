// queues/emailQueue.js
import { Queue } from "bullmq";
import { connection } from "../utils/redis.js";

export const emailQueue = new Queue("email-queue", { connection });