const express = require('express');
const router = express.Router();
const usersControll =require("../../../control/Admin/AdminUsersCon/users_con");
const authenticate = require("../../../middleware/auth/authenticate")
const attachUser = require("../../../middleware/auth/atachUser")
const auhtorize = require("../../../middleware/auth/authorize")

router.get('/' ,authenticate,attachUser,auhtorize("admin","Super Admin") , usersControll.getUsers);
router.patch('/:id/role' ,authenticate,attachUser,auhtorize("Super Admin"), usersControll.SetRole);
router.patch('/:id/active' ,authenticate,attachUser,  auhtorize("admin","Super Admin"), usersControll.SetActive);
router.delete('/:id' ,authenticate,attachUser,auhtorize("Super Admin"), usersControll.deleteUsers)

module.exports = router;
