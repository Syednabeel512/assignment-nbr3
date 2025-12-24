const express = require("express")
const multer = require("multer")
const cors = require("cors")
const fs = require("fs")

const app = express()
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

let mobiles = []

if (fs.existsSync("mobiles.json")) {
  mobiles = JSON.parse(fs.readFileSync("mobiles.json"))
}

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    if (file.fieldname == "cover")
      cb(null, "uploads/cover")
    else
      cb(null, "uploads/images")
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }

})

const upload = multer({ storage: storage })

app.post("/api/mobiles",

upload.fields([
 { name: "cover", maxCount: 1 },
 { name: "images", maxCount: 5 }
]),

(req, res) => {

  const mobile = {
    id: Date.now(),
    model: req.body.model,
    price: req.body.price,
    cover: req.files.cover[0].path,
    images: req.files.images.map(f => f.path)
  }

  mobiles.push(mobile)

  fs.writeFileSync(
    "mobiles.json",
    JSON.stringify(mobiles)
  )

  res.send("Mobile Added")
})

app.get("/api/mobiles", (req, res) => {
  res.json(mobiles)
})

app.put("/api/mobiles/:id",

upload.fields([
 { name: "cover", maxCount: 1 },
 { name: "images", maxCount: 5 }
]),

(req, res) => {

  const id = parseInt(req.params.id)
  const mobile = mobiles.find(m => m.id == id)

  mobile.model = req.body.model
  mobile.price = req.body.price

  if (req.files.cover) {
    fs.unlinkSync(mobile.cover)
    mobile.cover = req.files.cover[0].path
  }

  if (req.files.images) {
    mobile.images.forEach(img => fs.unlinkSync(img))
    mobile.images = req.files.images.map(f => f.path)
  }

  fs.writeFileSync(
    "mobiles.json",
    JSON.stringify(mobiles)
  )

  res.send("Mobile Updated")
})

app.delete("/api/mobiles/:id", (req, res) => {

  const id = parseInt(req.params.id)
  const mobile = mobiles.find(m => m.id == id)

  fs.unlinkSync(mobile.cover)
  mobile.images.forEach(img => fs.unlinkSync(img))

  mobiles = mobiles.filter(m => m.id != id)

  fs.writeFileSync(
    "mobiles.json",
    JSON.stringify(mobiles)
  )

  res.send("Mobile Deleted")
})

app.listen(4321, () => {
  console.log("Server Running")
})