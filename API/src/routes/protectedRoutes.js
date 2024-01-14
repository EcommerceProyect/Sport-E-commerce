/* eslint-disable no-undef */
const { Router } = require("express");
const router = Router();
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const { postUser } = require("../handlers/Users/postUser");
const { getUser_Token } = require("../handlers/Users/getUser_Token");
const { getAllUsers } = require("../handlers/Users/getAllUsers");
const { createProduct } = require("../handlers/createProduct");
const { updateUserHandler } = require("../handlers/Users/updateUserHandler");
const { deleteUserHandler } = require("../handlers/Users/deleteUser");
const { activeUserHandler } = require("../handlers/Users/activeUserHandler");
const { updateProductHandler } = require("../handlers/updateProduct");
const {
  getOrderByUserIdHandler
} = require("../handlers/Orders/getOrderByUserIdHandler");
const {
  asingRoleToUserHandler
} = require("../handlers/Users/asingRoleToUserHandler");
const {
  getUserBuyedProductHandler
} = require("../handlers/Reviews/getUserBuyedProductHandler");
const { getAllReviewsHandler } = require("../handlers/Reviews/getReviews");
const { createProductReview } = require("../handlers/Reviews/createReviews");
const { updateReviewHandler } = require("../handlers/Reviews/updateReviews");
const { deleteReviewHandler } = require("../handlers/Reviews/deleteReviews");
const {
  getProductReviewsAverageRatingHandler
} = require("../handlers/Reviews/getReviewsAverage");
const { restoreProduct } = require("../handlers/restoreProduct");
const { deleteProduct } = require("../handlers/deleteProduct");
const {
  getDandNoDProductsHandler
} = require("../handlers/Products/getDandNoDProductsHandler");
const {
  updateGenreHandler
} = require("../handlers/UpdateInfoHandler/updateGenreHandler");
const {
  updateAuthorHandler
} = require("../handlers/UpdateInfoHandler/updateAuthorHandler");
const {
  updateEditorialHandler
} = require("../handlers/UpdateInfoHandler/updateEditorialHandler");
const {
  updateReleasedDateHandler
} = require("../handlers/UpdateInfoHandler/updateReleasedDateHandler");
const {
  updateISBNHandler
} = require("../handlers/UpdateInfoHandler/updateISBNHandler");
const { deleteAuthorHandler } = require("../handlers/SoftDelete/deleteAuthor");
const {
  deleteEditorialHandler
} = require("../handlers/SoftDelete/deleteEditorial");
const { deleteGenreHandler } = require("../handlers/SoftDelete/deleteGenre");

router.use(cors());

const jwtCheck = auth({
  audience: "https://www.protectAPI.com",
  issuerBaseURL: "https://dev-s3pcs1ovog464bay.us.auth0.com/",
  tokenSigningAlg: "RS256"
});

//middleware
const checkPermissions = (requiredPermissions) => (req, res, next) => {
  const userPermissions = req.auth.payload.permissions || [];

  if (
    userPermissions.some((permission) =>
      requiredPermissions.includes(permission)
    )
  ) {
    // El usuario tiene al menos uno de los permisos requeridos
    console.log("es admin");
    next();
  } else {
    // El usuario no tiene los permisos necesarios
    res
      .status(403)
      .json({ error: "Forbidden", message: "Insufficient permissions" });
  }
};

router.use(jwtCheck);

//rutas del admin

//Users
router.get("/authorized", checkPermissions(["user:edit"]), async (req, res) => {
  console.log(req.auth);

  try {
    // const emailExist = await

    const response = await postUser(req, res);

    console.log(response, "soyyyy el protect");

    res.status(200).json({
      id_user: req.auth.payload.sub
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      // es 404 para que en la api intermedia pase que el usuario ya existia
      error: error,
      message: "Something went wrong"
    });
  }
});

router.get("/authorized/check", (req, res) => {
  res.status(200).json({ message: "El usuario esta autenticado" });
});
router.get(
  "/authorized/profile",
  checkPermissions(["user:edit"]),
  getUser_Token
);
router.get("/authorized/users", checkPermissions(["admin:edit"]), getAllUsers);

router.put(
  "/authorized/admin/:id",
  checkPermissions(["admin:edit"]),
  asingRoleToUserHandler
);

//update user by user
router.put(
  "/authorized/users",
  checkPermissions(["user:edit"]),
  updateUserHandler
);

//activar usuario si esta desactivado.  Solo admin
router.put(
  "/authorized/activeuser/:id",
  checkPermissions(["admin:edit"]),
  activeUserHandler
);

router.delete(
  "/authorized/users/:id",
  checkPermissions(["admin:edit"]),
  deleteUserHandler
);

//Products
router.post(
  "/authorized/products",
  checkPermissions(["admin:edit"]),
  createProduct
);

router.put(
  "/authorized/products/:id",
  checkPermissions(["admin:edit"]),
  updateProductHandler
);

router.delete(
  "/authorized/products/:id",
  checkPermissions(["admin:edit"]),
  deleteProduct
);

router.patch(
  "/authorized/products/:id",
  checkPermissions(["admin:edit"]),
  restoreProduct
);

router.get(
  "/authorized/allProducts",
  checkPermissions(["admin:edit"]),
  getDandNoDProductsHandler
);

//Orders

router.get(
  "/authorized/orders/:id?",
  checkPermissions(["user:edit"]),
  getOrderByUserIdHandler
);

//Reviews

router.get(
  "/authorized/userBuyedProduct",
  checkPermissions(["user:edit"]),
  getUserBuyedProductHandler
);
router.get(
  "/authorized/reviews",
  checkPermissions(["user:edit"]),
  getAllReviewsHandler
);
router.post(
  "/authorized/reviews",
  checkPermissions(["user:edit"]),
  createProductReview
);
router.put(
  "/authorized/reviews/:id",
  checkPermissions(["user:edit"]),
  updateReviewHandler
);
router.delete(
  "/authorized/reviews/:id",
  checkPermissions(["admin:edit"]),
  deleteReviewHandler
);
router.get(
  "/authorized/reviews/average/:productId",
  checkPermissions(["user:edit"]),
  getProductReviewsAverageRatingHandler
);

// entidades

router.put(
  "/authorized/genre/:id",
  checkPermissions(["admin:edit"]),
  updateGenreHandler
);
router.put(
  "/authorized/author/:id",
  checkPermissions(["admin:edit"]),
  updateAuthorHandler
);
router.put(
  "/authorized/editorial/:id",
  checkPermissions(["admin:edit"]),
  updateEditorialHandler
);
router.put(
  "/authorized/releasedDate/:id",
  checkPermissions(["admin:edit"]),
  updateReleasedDateHandler
);
router.put(
  "/authorized/ISBN/:id",
  checkPermissions(["admin:edit"]),
  updateISBNHandler
);

router.delete(
  "/authorized/authorDelete/:id",
  checkPermissions(["admin:edit"]),
  deleteAuthorHandler
);
router.delete(
  "/authorized/editorialDelete/:id",
  checkPermissions(["admin:edit"]),
  deleteEditorialHandler
);
router.delete(
  "/authorized/genreDelete/:id",
  checkPermissions(["admin:edit"]),
  deleteGenreHandler
);

module.exports = router;
