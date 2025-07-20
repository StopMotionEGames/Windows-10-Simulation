import fastify, { type FastifyRequest } from "fastify";
import path, { join } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import fastifyStatic from "@fastify/static";
import middie from "@fastify/middie";
import fastifyCompress from "@fastify/compress";

let __filename: string = fileURLToPath(import.meta.url);
let __dirname: string = path.dirname(__filename);

let port: number = 8443;
let requisition: number = 0;
let useCompression: boolean = false; // Set to true if you want to use compression

const app = fastify({
  logger: false,
  http2: true,
  https: {
    allowHTTP1: true,
    key: await fs.readFile(join(__dirname, "config", "ssl", "code.key")),
    cert: await fs.readFile(join(__dirname, "config", "ssl", "code.crt")),
    ca: await fs.readFile(join(__dirname, "config", "ssl", "code.csr")),
  },
});
if (useCompression) {
  await app.register(fastifyCompress, {
    global: true,
    encodings: ["gzip", "deflate", "br"],
  });
}
await app.register(middie);
await app.register(fastifyStatic, {
  root: join(__dirname, "root"),
  prefix: "/",
  decorateReply: true,
});
await app.register(fastifyStatic, {
  root: join(__dirname, "firmware"),
  prefix: "/firmware/",
  decorateReply: false,
});
await app.register(fastifyStatic, {
  root: join(__dirname, "config", "assets"),
  prefix: "/config/",
  decorateReply: false,
});

await app.register(fastifyStatic, {
  root: join(__dirname, "testing-area"),
  prefix: "/testing-area/",
  decorateReply: false,
});
app
  .listen({ port: port, host: "::" })
  .then(() => {
    console.log("listening on:", app.server.address());
  })
  .catch((err) => {
    console.error(err);
    process.exit(512);
  });
app.ready().then(() => {
  setTimeout(() => {}, 1000);
});
app.use((request: FastifyRequest, reply, next) => {
  console.log("\nRequisição:", requisition++);
  console.log(request.ip);
  console.log(request.url);
  console.log(reply.statusCode);
  next();
});
app.get("/", async (request, reply) => {
  reply.header("content-type", "text/html");
  const html = await fs.readFile(join(__dirname, "firmware", "index.html"));
  reply.send(html);
});
