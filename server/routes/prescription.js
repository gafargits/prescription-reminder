const express = require('express');
const router = express.Router();

const {addPrescription, getPrescription, deletePrescription, updatePrescription} = require('../controllers/prescriptionControllers');

router
  .route('/add-prescription')
  .post(addPrescription)
router
  .route('/all-prescriptions')
  .get(getPrescription)
router
  .route('/delete-prescription/:id')
  .delete(deletePrescription)
router
  .route('/update-prescription/:id')
  .patch(updatePrescription)
module.exports = router;