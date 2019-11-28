const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../controller/index");
let upload = multer({ dest: "./public/uploads/" });

router.get("/products", controller.getProduct);

router.post("/productByGroup", controller.getByGroupProduct);

router.post("/try", upload.single("image"), controller.addProduct);

router.post("/delete", controller.deleteProduct);

router.post("/update", controller.updateProduct);

router.post("/account", controller.signIn);

router.post("/signup", controller.signUp);

router.post("/testpdf", controller.pdfTemplate);

router.post("/checkout", controller.checkOut);

router.post("/receipt", controller.receipt);

router.post("/detailReceipt", controller.detailReceipt);

router.post("/log", controller.addLog);

router.get("/logInfo", controller.logInfo);

router.post("/deleteLog", controller.deleteLog);

router.post("/deleteAllLog", controller.deleteAllLogs);

router.post("/search", controller.search);

router.get("/groupId", controller.getGroupId);

module.exports = router;
