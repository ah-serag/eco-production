
const express = require("express");
const corsOption = require("./config/controllCors")
const cors = require("cors")
const cookieParser  = require("cookie-parser")

const app = express();
app.use(cookieParser())
app.use(express.json())


app.use(cors(corsOption))


// [Auth]

app.use("/auth" ,require("./routes/AuthRoute/authroute") )

//  [Admin route] 
app.use("/products" , require("./routes/Admin/AdminProducts/products_route"))
app.use("/users" ,require("./routes/Admin/AdminUsers/usersRoute") )
app.use("/vendors" ,require("./routes/Admin/AdminVendors/vendors_route") )
app.use("/upload" ,require("./routes/Admin/AdminImage/uploadRoute") )
app.use("/products" , require("./routes/Admin/AdminCategory/categoryRoute"))
app.use("/admin" , require("./routes/Admin/orders/ordersRoute"))
app.use("/admin/videos" ,  require("./routes/Admin/AdminVideos/AdminVideosRoute"))




// home
app.use("/home" ,require("./routes/Admin/HomeAdmin/AllSectionRoute") )
app.use("/home" ,require("./routes/Admin/HomeAdmin/herroBannerRoute") )
app.use("/homeCategory" ,require("./routes/Admin/HomeAdmin/HomeCategoryRoute") )
app.use("/homeProducts" ,require("./routes/Admin/HomeAdmin/products_homeRoute") )
app.use("/home" ,require("./routes/Admin/HomeAdmin/limitedOfferRoute") )
app.use("/home" ,require("./routes/Admin/HomeAdmin/subCategoryBannerRoute") )

// [Home] 
app.use("/homeClient" ,require("./routes/HomeRoute/homeClientroute") )

app.use("/product" ,require("./routes/PreviewProduct/previewPro") )

app.use("/api/payment", require("./modules/payment/paymob.routes"));

//orders clients 
app.use("/clientOrders", require("./routes/orders_client/ordersClientRoute"));

//checkout data
app.use("/api/checkoutdData", require("./routes/checkoutdataRoute/checkdataRoute"));









app.get("/", (req, res) => {
  res.send("Hello Ahmed! Your Express server is running!");
});





const PORT = 3000;
app.listen(PORT,"0.0.0.0" , () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



