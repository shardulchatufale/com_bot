const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose')
const validator = require("../validator/validation")
const UserModel = require("../module/UserModule")
const fieldModule = require("../module/FieldModule");
const { title } = require("process");


const CreatteField = async (req, res) => {
  try {
    let data = req.body
    let { name, caption, display_location, slug, type, default_, ...rest } = data
    data.user = req.UserId;

    if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `you can't provide ${Object.keys(rest)} key` })


    if (!name) return res.status(400).send({ status: false, msg: ' name in name field is required' });
    if (!validator.isValid(name)) return res.status(400).send({ status: false, message: 'Please enter  name in right formate' })

    if (!caption) return res.status(400).send({ status: false, msg: ' caption in caption field is required' });
    if (!validator.isValid(caption)) return res.status(400).send({ status: false, message: 'Please enter  caption in right formate' })

    let DupNameCaption = await fieldModule.findOne({ name: name, caption: caption })
    if (DupNameCaption) return res.status(400).send({ status: false, message: 'this caption have already this name.use different name for this caption' })

    if (!slug) return res.status(400).send({ status: false, msg: ' slug in slug field is required' });
    if (!validator.isValid(slug)) return res.status(400).send({ status: false, message: 'Please enter  slug in right formate' })
    let DupSlug = await fieldModule.findOne({ slug: slug })
    if (DupSlug) return res.status(400).send({ status: false, message: 'slug is already used before' })

    const isvalidtype = function (title) {
      return ["string", "number", "date", "date-time"].indexOf(title) === -1
    }

    if (!type) return res.status(400).send({ status: false, msg: ' type in type field is required' });
    if (isvalidtype(type)) return res.status(400).send({ status: false, message: "type must be string or number or date,date-time" })


    if (!default_) return res.status(400).send({ status: false, msg: ' dfault in dfault field is required' });


    if (req.UserId !== data.user.toString()) return res.status(403).send({ status: false, message: "you cannot create other users books please provide your user ID" });
    let CreaatedField = await fieldModule.create(data)

    let response = await fieldModule.findById({ _id: CreaatedField._id }).select({ _id: 0, user: 0 })

    console.log("response", response);
    res.status(201).send({ status: true, message: "Success", data: response })


  } catch (exc) {
    console.log(exc)
    res.status(500).json({ message: 'Server error' });
  }
}

//..........................................................................................................

const AllField = async function (req, res) {
  try {
  
    let data = await fieldModule.find({ user: req.UserId }).limit(20)///***************************************8 */

    if (Object.keys(data).length == 0) return res.status(404).send({ status: false, message: 'field not found' })

    res.status(200).send({ status: true, message: 'Field list', data: data })

  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}
//..........................................................................................................

const GetSingelField = async function (req, res) {
  try {
    let FieldId = req.params

    let { Id } = FieldId
 
    if (!mongoose.Types.ObjectId.isValid(Id)) return res.status(400).send({ status: false, message: 'Invalid UserId Format' })

    let CheckField = await fieldModule.findOne({ _id: Id })
    if (!CheckField) return res.status(404).send({ status: false, message: "Field Not Found" });

    res.status(200).send({ status: true, message: 'Book list', data: CheckField })

  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}
//...........................................................................................................

const UpdateField = async function (req, res) {
  try {



  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}
//........................................................................................................
const deleteField = async function (req, res) {
  try {

    let FieldId = req.params.Id


    if (!mongoose.Types.ObjectId.isValid(FieldId)) return res.status(400).send({ status: false, message: 'Invalid FieldId Format' })


    let CheckField = await fieldModule.findOne({ _id: FieldId });
    if (!CheckField) return res.status(404).send({ status: false, message: "Field Not Found" });


    const token = req.UserId
    if (token !== CheckField.user.toString()) res.status(403).send({ status: false, message: "you cannot delete other users book" });


    await fieldModule.findOneAndDelete({ _id: CheckField._id });

    res.status(200).send({ status: true, message: 'This field is deleted successfully' })


  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

//.................................................................................................................


//..............................................................................................
module.exports = { CreatteField, GetSingelField, AllField, UpdateField, deleteField }
