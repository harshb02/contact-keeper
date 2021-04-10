const express = require('express');
const router = express.Router();
const User = require('../modals/User'); 
const Contact = require('../modals/Contact'); 
const { check, validationResult } = require('express-validator/check');
const auth = require('../middleware/auth');
const { findByIdAndUpdate } = require('../modals/User');

//@route     GET api/contacts
//@desc      Get all users conatcts
//@access    Private
router.get('/', auth, async (req, res) => {
   try {
       const contacts = await Contact.find({user: req.user.id}).sort({date: -1});
       res.json(contacts);
   } catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error');
   }
});

//@route     POST api/contacts
//@desc      Add new conatcts
//@access    Private
router.post('/',[auth, [
    check('name', 'Name is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }


    const { name, email, phone, type} = req.body;

    try {
        const newContact = new Contact({
            name, email, phone, type, user: req.user.id
        });

        const contact = await newContact.save();
        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }
});

//@route     PUT api/contacts/:id
//@desc      Update conatcts
//@access    Private
router.put('/:id',auth, async (req, res) => {
   
const { name, email, phone, type} = req.body;

//Build contact object
const contactFeilds = {};
if(name) contactFeilds.name = name;
if(email) contactFeilds.email = email;
if(phone) contactFeilds.phone = phone;
if(type) contactFeilds.type = type;


try {
    let contact = await Contact.findById(req.params.id);

    if(!contact) return res.status(404).json({msg: "Contact not found"});

    // Make sure user owns the contact

    if(contact.user.toString () !== req.user.id) {
        return res.status(401).json({msg: 'Not authorized'})
    }

    contact = await Contact.findByIdAndUpdate(req.params.id, 
        {$set: contactFeilds},
        { new: true})

        res.json(contact);
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
}
});

//@route     DELETE api/contacts/:id
//@desc      Delete conatcts
//@access    Private
router.put('/:id', auth, async(req, res) => {

    try {
        let contact = await Contact.findById(req.params.id);
    
        if(!contact) return res.status(404).json({msg: "Contact not found"});
    
        // Make sure user owns the contact
    
        if(contact.user.toString () !== req.user.id) {
            return res.status(401).json({msg: 'Not authorized'})
        }
    
        await Contact.findByIdAndRemove(req.params.id);
    
        res.json({msg:'Contact Removed'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;