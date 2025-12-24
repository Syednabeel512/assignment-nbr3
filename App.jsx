import React, { useState, useEffect } from "react"
import axios from "axios"

function App() {

  const [model, setModel] = useState("")
  const [price, setPrice] = useState("")
  const [cover, setCover] = useState(null)
  const [images, setImages] = useState([])
  const [mobiles, setMobiles] = useState([])

  useEffect(() => {
    axios.get("http://localhost:4321/api/mobiles")
    .then(res => setMobiles(res.data))
  }, [])

  function addMobile() {

    const form = new FormData()
    form.append("model", model)
    form.append("price", price)
    form.append("cover", cover)

    for (let i = 0; i < images.length; i++) {
      form.append("images", images[i])
    }

    axios.post(
      "http://localhost:4321/api/mobiles",
      form
    )
  }

  function deleteMobile(id) {
    axios.delete(
      "http://localhost:4321/api/mobiles/" + id
    )
  }

  return (
    <div>

      <input
        placeholder="Model"
        onChange={e => setModel(e.target.value)}
      />

      <input
        placeholder="Price"
        onChange={e => setPrice(e.target.value)}
      />

      <input
        type="file"
        onChange={e => setCover(e.target.files[0])}
      />

      <input
        type="file"
        multiple
        onChange={e => setImages(e.target.files)}
      />

      <button onClick={addMobile}>
        Add Mobile
      </button>

    </div>
  )
}

export default App