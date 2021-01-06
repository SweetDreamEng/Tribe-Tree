const { Nuxt, Builder } = require("nuxt");
const app = require("express")();
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const consola = require("consola");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const api = require("./api");

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = !(process.env.NODE_ENV === "production");

async function start() {
  // Body parser, to access `req.body`
  app.use(bodyParser.json({ limit: "50mb" }));

  // Sessions to create `req.session`
  app.use(
    session({
      secret: "super-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: api.db }),
      cookie: { maxAge: 600000000 },
    })
  );

  //Process api requests
  app.post("/api", (req, res) => {
    if (api[req.body.call]) {
      //if api call exists in api.js
      //call api func with payload and user if in request
      api[req.body.call](
        req.body.payload ? req.body.payload : null,
        res,
        req.session.authUser ? req.session.authUser : null,
        req
      );
    }
  });

  //Process file upload
  app.post("/upload", upload.single("file"), function(req, res, next) {
    return res.status(200).send(req.file);
  });

  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}
start();
