'use strict';

var express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
	db = require('../models'),
	router = express.Router(),
	candidatecontroller = require('../controllers/candidates')(db),
	candidatepayrollcontroller = require('../controllers/candidates-payroll')(db),
	historycontroller = require('../controllers/history')(),
	pendingonboardingcontroller = require('../controllers/pendingonboarding')(db),
	expressJwt = require('express-jwt'),
	restMiddleware=require('../middlewares/restmiddleware'),
	taskcontroller = require('../controllers/task')(db),
	routeskipper=require('../middlewares/route-skipper')
;

module.exports = function(app){
  app.use('/api/candidates', routeskipper(expressJwt({secret:process.env.JWT_SECRET}),[{method:'POST',path:['/api/candidates/','/api/candidates']},
  	{path:/\/api\/candidates\/activation\/\w+/}]), router);
};

router.get('/loggedinuser',candidatecontroller.getLoggedInUser);

router.get('/',restMiddleware(db),candidatecontroller.getAllCandidate);

router.get('/:id',candidatecontroller.getCandidate);

router.post('/', candidatecontroller.postCandidate );

router.get('/:id/contactdetail',candidatecontroller.getContactDetail);

//TODO: should be authenticated
router.patch('/:id/contactdetail', candidatecontroller.updateContactDetail);

router.get('/:id/bankdetail', candidatecontroller.getBankDetail);

router.patch('/:id/bankdetail', candidatecontroller.updateBankDetails);


router.post('/:id/avatar',candidatecontroller.postAvatar);

router.get('/:id/avatar/:avatarfilename',candidatecontroller.getAvatar);

router.get('/:candidateId/payrolltax', candidatepayrollcontroller.getPayrollTax);
router.patch('/:candidateId/payrolltax', candidatepayrollcontroller.postPayrollTax );

router.get('/:candidateId/payrollproduct', candidatepayrollcontroller.getPayrollProducts);
router.post('/:candidateId/payrollproduct', candidatepayrollcontroller.postPayrollProduct);
router.get('/:candidateId/payrollproduct/:productId', candidatepayrollcontroller.getPayrollProduct);
router.patch('/:candidateId/payrollproduct/:productId', candidatepayrollcontroller.patchPayrollProduct);
router.delete('/:candidateId/payrollproduct/:productId', candidatepayrollcontroller.deletePayrollProduct);

router.get('/:candidateId/payrollproduct/:productId/marginexception', candidatepayrollcontroller.getMarginException);
router.post('/:candidateId/payrollproduct/:productId/marginexception', candidatepayrollcontroller.postMarginException);
router.patch('/:candidateId/payrollproduct/:productId/marginexception/:marginExceptionId', candidatepayrollcontroller.patchMarginException);
router.delete('/:candidateId/payrollproduct/:productId/marginexception/:marginExceptionId', candidatepayrollcontroller.deleteMarginException);

router.patch('/:id/dpa', historycontroller.patchDpa);

router.get('/:id/onboarding', pendingonboardingcontroller.getPendingOnboardingDetails);
router.patch('/:id/onboarding', pendingonboardingcontroller.patchPendingOnboardingDetails);

router.get('/:id/task', taskcontroller.getTaskDetails);
router.post('/:id/task', taskcontroller.postTaskDetails);

router.get('/:id/calllog', taskcontroller.getCalllogDetails);
router.post('/:id/calllog', taskcontroller.postCalllogDetails);

router.get('/:id/agencies', candidatecontroller.getAgencies);
router.post('/:id/document',candidatecontroller.uploadDocuments);
// router.get('/:id/document/signuploadurl',candidatecontroller.getUploadDocumentSignedUrl);
// router.get('/:id/document/signgeturl',candidatecontroller.getDownloadDocumentSignedUrl);
// router.get('/:id/document/:generated_name',candidatecontroller.getDocument);
