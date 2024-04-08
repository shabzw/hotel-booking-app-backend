import express from "express";
const app = express();
const router = express.Router();
import cors from "cors";
import axios from "axios";
import multer from "multer";
import Booking from '../models/Booking';
import fetchuser from '../middleware/fetchuser'; // Assumes 'fetchuser' is default export


app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

import Place from '../models/Place';


router.get("/bookings", fetchuser, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "place"
    );
    res.json(bookings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error occured");
  }
});

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/upload-from-url", async (req, res) => {
  const { link } = req.body;

  try {
    // Download the image from the provided URL using axios
    const response = await axios.get(link, { responseType: "arraybuffer" });

    // Upload the downloaded image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(link, {
      folder: "uploaded-images", // Optional folder in Cloudinary
      public_id: "my-image", // Optional public ID for the uploaded image
    });

    // Return the Cloudinary URL of the uploaded image
    res.json({ success: true, imageUrl: uploadResult.secure_url });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    res
      .status(500)
      .json({ success: false, error: "Error uploading image to Cloudinary" });
  }
});

// Multer configuration for handling file uploads
// const upload = multer({ dest: 'uploads/' });
const upload = multer({
  dest: "uploads/", // Destination directory for uploaded files
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit (in bytes)
  },
});

// Route for handling file uploads
router.post("/upload", upload.array("photos", 10), (req, res) => {
  const files = req.files;
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path,
        { folder: "uploaded-images" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
    });
  });

  Promise.all(uploadPromises)
    .then((uploadedUrls) => {
      // Send an array of uploaded URLs back to the client
      res.json({ success: true, filenames: uploadedUrls }); // Modify to match frontend expectations
    })
    .catch((error) => {
      console.error("Error uploading images to Cloudinary:", error);
      res
        .status(500)
        .json({
          success: false,
          error: "Error uploading images to Cloudinary",
        });
    });
});

router.put("/places", fetchuser, async (req, res) => {
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    checkIn,
    checkOut,
    maxGuests,
    price,
    extraInfo,
  } = req.body;
  const placeDoc = await Place.findById(id);
  if (req.user.id.toString() === placeDoc.owner.toString()) {
    placeDoc.set({
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      checkIn,
      checkOut,
      maxGuests,
      price,
      extraInfo,
    });

    await placeDoc.save();
    res.json("ok");
  } else {
    res.json("notok");
  }
});

router.post("/places", fetchuser, async (req, res) => {
  const {
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    checkIn,
    checkOut,
    maxGuests,
    extraInfo,
  } = req.body;
  const placeDoc = await Place.create({
    owner: req.user.id,
    price,
    title,
    address,
    photos: addedPhotos,
    description,
    perks,
    checkIn,
    checkOut,
    maxGuests,
    extraInfo,
  });
  res.json(placeDoc);
});

router.get("/places/:id", fetchuser, async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

router.get("/user-places", fetchuser, async (req, res) => {
  res.json(await Place.find({ owner: req.user.id }));
});

router.post("/bookings", fetchuser, async (req, res) => {
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;

  const doc = await Booking.create({
    user: req.user.id,
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
  });

  res.json(doc);
});

router.get("/places", async (req, res) => {
  res.json(await Place.find());
});

router.get("/places/:id", fetchuser, async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

export default {router}