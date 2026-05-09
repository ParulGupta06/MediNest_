const express = require("express");
const cors = require("cors");
const seedMedicines = require("./data/medicines");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let medicines = [...seedMedicines];

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/medicines", (_req, res) => {
  res.json(medicines);
});

app.get("/api/medicines/:id", (req, res) => {
  const medicine = medicines.find((item) => item.id === Number(req.params.id));
  if (!medicine) {
    return res.status(404).json({ message: "Medicine not found" });
  }
  return res.json(medicine);
});

app.post("/api/medicines", (req, res) => {
  const { name, brand, category, price, stock } = req.body;
  if (!name || !brand || !category || price == null || stock == null) {
    return res.status(400).json({ message: "Missing required medicine fields" });
  }

  const newMedicine = {
    id: Date.now(),
    name,
    brand,
    category,
    price: Number(price),
    stock: Number(stock),
    originalPrice: Number(price),
    rating: 4,
    reviews: 0,
    image: `https://placehold.co/280x200/dbeafe/1d4ed8?text=${encodeURIComponent(name)}`,
    prescription: false,
    substitutes: [],
    description: "",
    dosage: "",
    sideEffects: "",
    manufacturer: "Unknown",
    expiryDate: "2026-12",
  };

  medicines = [newMedicine, ...medicines];
  return res.status(201).json(newMedicine);
});

app.delete("/api/medicines/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = medicines.some((item) => item.id === id);
  if (!exists) {
    return res.status(404).json({ message: "Medicine not found" });
  }
  medicines = medicines.filter((item) => item.id !== id);
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});