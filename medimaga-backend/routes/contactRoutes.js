const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
// const nodemailer = require('nodemailer'); // Commented out for 


// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, subject, message, priority, department } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    // Create new contact entry
    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      priority,
      department
    });

    // Save to database
    await newContact.save();

    // MOCK EMAIL LOGGING (No actual emails sent)
    console.log('=== CONTACT FORM SUBMITTED ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone || 'Not provided');
    console.log('Subject:', subject);
    console.log('Department:', department || 'General');
    console.log('Priority:', priority || 'Medium');
    console.log('Message:', message);
    console.log('');
    console.log('📧 MOCK EMAILS THAT WOULD BE SENT:');
    console.log('1. Confirmation email to:', email);
    console.log('2. Notification email to: support@medimaga.com');
    console.log('==============================');

    // Return success immediately
    res.status(201).json({
      success: true,
      message: 'Form submitted successfully! We will contact you within 2-4 hours during business hours.'
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// GET route to view all contacts in browser
router.get('/view', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      total: contacts.length,
      contacts: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts'
    });
  }
});

// DELETE route to delete a specific contact by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);
    
    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully',
      deletedContact: deletedContact
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact'
    });
  }
});

// DELETE route to delete ALL contacts (use carefully!)
router.delete('/delete-all', async (req, res) => {
  try {
    const result = await Contact.deleteMany({});
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} contacts successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting all contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contacts'
    });
  }
});

module.exports = router;