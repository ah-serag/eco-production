
const hosts = ["http://localhost:3001", "http://localhost:5001"]; 


module.exports = {

  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const env = "production";

    if (hosts.includes(origin) || env === "production") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true, 
};

