const Prescription = require('../Models/Prescription');
const sendMail = require('../sendEmail/sendgrid');

exports.addPrescription = async (req, res, next) => {
  try {
    const { sub } = req.user;
    const prescription = Object.assign({}, req.body, {
      user: sub
    });
    const newPrescription = new Prescription(prescription);
    await newPrescription.save();

    res.status(201).json({
      message: 'Prescription Added',
      newPrescription
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: 'Prescription could not be added at this time, try again later'
    })
  }
}

exports.getPrescription = async (req, res, next) => {
  try {
    const { sub } = req.user;
    const prescriptions = await Prescription.find({
      user: sub
    })
    res.json(prescriptions)
  } catch (err) {
    return res.status(400).json({ error: err })
  }
}

exports.deletePrescription = async (req, res, next) => {
  try {
    const { sub } = req.user;
    const deletedItem = await Prescription.findOneAndDelete({
      _id: req.params.id,
      user: sub
    });
    res.status(201).json({
      message: 'Prescription Deleted',
      deletedItem
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Prescription could not be deleted at this time, try again later'
    })
  }
}

exports.updatePrescription = async (req, res, next) => {
  try {
    const { sub, email, firstName } = req.user;
    const { usageFormular, duration, send_at } = req.body;
    const timeToSendEmail = Math.floor(new Date(send_at).getTime()/1000);
    const checkValidTime = () => {
      const date = Math.round(new Date().getTime() / 1000);
      console.log(date, timeToSendEmail)
      return date < timeToSendEmail ? timeToSendEmail : 'Invalid Date'
    }
    
    const updatedPrescription = await Prescription.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        duration,
        usageFormular,
        send_at: checkValidTime()
      },
      {new: true}
    );
    sendMail('gyfe@gyfe.com', 
              email, 
              'Prescription Reminder', 
              `Dear ${firstName}, this is to remind you that you need to take your medication now`, 
              checkValidTime())
    res.json({
      message: 'Prescription Details updated',
      duration: updatedPrescription.duration,
      usageFormular: updatedPrescription.usageFormular,
      send_at: Date(updatedPrescription.send_at),
      email
    })
  } catch (err) {
    return res.status(400).json({
      message: 'There was a problem updating your prescription'
    });
  }
}