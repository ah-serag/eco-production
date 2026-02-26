const express = require('express');
const router = express.Router();
const AllsectionControll  = require("../../../control/Admin/HomeAdminCon/Allsection_con")

// add 
router.post("/admin/AddSections" , AllsectionControll.AddSections)
router.get("/admin/sections" , AllsectionControll.getSections) 

// edait
router.get("/admin/preview" , AllsectionControll.previewAdmin) 
router.patch("/admin/sections/:id/toggle" , AllsectionControll.toggleActiveSection) 
router.delete("/admin/sections/:id" , AllsectionControll.deleteSection) 
router.put("/admin/sections/reorder", AllsectionControll.updateSectionsOrderBulk);






module.exports = router;




