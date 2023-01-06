const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../../../middlewares/authentication')
const passport = require('passport')
router.use(passport.initialize())
router.use(passport.session())
const { PDFDocument } = require('pdf-lib')
const { readFile, writeFile } = require('fs/promises')
const path = require('path');

router.get('/',
  checkAuthenticated,
  async (req, res) => {
    try {
      const pdfDoc = await PDFDocument.load(await readFile('public/forms/barangay_id.pdf'))
    
      // // Get the form containing all the fields
      const form = pdfDoc.getForm()

      // Get all fields in the PDF by their names
      const fname = form.getTextField('First Name')
      const lname = form.getTextField('Last Name')
      const mname = form.getTextField('Middle Name')
      const address_curr = form.getTextField('Address Cembo')
      const address_province = form.getTextField('Address Provincial')
      const contactNo = form.getTextField('Contact Number')
      const lengthStay = form.getTextField('Length Stay Years')
      const dob = form.getTextField('Date of Birth')
      const gender = form.getTextField('Gender')
      const cStatus = form.getTextField('Civil Status')

      // Fill in the basic info fields
      fname.setText(`${req.user.first_name}`)
      lname.setText(`${req.user.last_name}`)
      mname.setText(`${req.user.middle_name}`)
      address_curr.setText(`${req.user.physical_address}`)
      address_province.setText(`${req.user.provincial_address}`)
      contactNo.setText(`${req.user.contact_number}`)
      lengthStay.setText(`${req.user.len_stay_cembo}`)
      dob.setText(`${req.user.dob}`)
      gender.setText(`${req.user.gender}`)
      cStatus.setText(`${req.user.civil_status}`)

      const pdfBytes = await pdfDoc.save()

      // Set the appropriate content type
      res.setHeader('Content-Type', 'application/pdf')
  
      const fileName = `BARANGAY ID.pdf - ${req.user.first_name} ${req.user.last_name}`
      await writeFile(`public/filledForms/${fileName}`, pdfBytes);

      const filePath = path.join(__dirname, '..', '..', '..', `/public/filledForms/${fileName}`)
      res.sendFile(filePath)

    }
    catch (err){
      console.log(err)
    }
  })

module.exports = router