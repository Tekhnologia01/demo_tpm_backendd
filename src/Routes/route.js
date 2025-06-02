import express from 'express';
import PortalController from '../Controllers/PortalController.js';
import ProductController  from '../Controllers/ProductController.js';
import PackageController from '../Controllers/PackageController.js';
import EnquiryController from '../Controllers/EnquiryController.js';
import ClientController from '../Controllers/ClientController.js';
import GraphsController from '../Controllers/GraphsController.js';
import { authMiddleware } from '../Middlewares/Authentication.js';
import SMTPController from '../Controllers/SMTPController.js';
import CategoryController from '../Controllers/CategoryController.js';
// import PaymentController from '../Controllers/PaymentController.js';
import servicesController from '../Controllers/servicesController.js';
import enquirymailController from '../Controllers/enquirymailController.js';

const router = express.Router();


// Tekhno Portal  API'S


// User API's

router.post('/userRegistration', PortalController.registerUser);
router.post('/userlogin', PortalController.userLogins);
router.put('/updatemyprofile',authMiddleware, PortalController.updatemyprofile);
router.get('/fetchuserprofile',authMiddleware, PortalController.fetchmyprofile);
router.put('/updatemypassword', authMiddleware,PortalController.updatemypassword);


//  Dashboard Graphs API's

router.get('/dashboardmetrics',authMiddleware,GraphsController.getDashboardMetrics);
router.get('/getMonthalyRevenue',authMiddleware,GraphsController.getMonthlyRevenue);
router.get('/getMonthalyEnquiry',authMiddleware,GraphsController.getMonthlyEnquiries);
router.get('/getActiveInactiveClientsPer',authMiddleware,GraphsController.getClientStatusPercentage);


// SMTP API's

router.post('/sendOTP', SMTPController.sendOtp);
router.post('/verifyOTP', SMTPController.verifyOtp);
router.put('/forgetPassword', SMTPController.forgetPassword);

// router.post('/sendPaymentlink',authMiddleware, SMTPController.sendPaymentLink);


// Client API's

router.post('/createclients',authMiddleware,ClientController.createClientSp);
router.get('/fetchClient',authMiddleware,ClientController.getClientsSp);
router.put('/updateclient',authMiddleware,ClientController.updateClientDataSp);
router.delete('/deleteclient',authMiddleware,ClientController.deleteClientData);


// Enquiry API's

router.post('/addenquiry',EnquiryController.createEnquiry);
router.get('/fetchEnquiry',authMiddleware,EnquiryController.fetchEnquiryData);
router.put('/updatdeenquiry',authMiddleware, EnquiryController.updatdeEnquiryData);
router.delete('/deleteenquiry',authMiddleware, EnquiryController.deleteEnquiryData);


router.post('/convertenquiryToclient/:enquiry_Id',authMiddleware,EnquiryController.convertEnquirytoClient);

// enquiry for tekhnologia webiste

router.post('/tekh_enquiry',enquirymailController.createTekhEnquiry)

// Product API's

router.post('/createproducts',authMiddleware,ProductController.createProduct);
router.get('/fetchproducts',authMiddleware,ProductController.getProducts);
router.put('/updateproducts',authMiddleware,ProductController.updateProductSp);
router.delete('/deleteproduct',authMiddleware,ProductController.deleteProductData);


// Package API's

router.post('/createpackage',authMiddleware, PackageController.createPackageSp);
router.get('/fetchpackage/:product_Id',PackageController.getPackage);
router.put('/updatepackage',authMiddleware, PackageController.updatePackage);
router.delete('/deletepackage',authMiddleware,PackageController.deletePackageData);
router.post('/createbasicpackage',authMiddleware, PackageController.createBasicPackage);



// Category Type API's

router.get('/productcategory', authMiddleware,CategoryController.getProductList);
router.get('/packagecategory',authMiddleware,CategoryController.getPackageList);
router.get('/platformcategory',authMiddleware,CategoryController.getPlatFormList);
router.get('/packagevaliditycategory',authMiddleware,CategoryController.getPackageValidityList);


// Payment API's

// router.post('/createreceiptId',authMiddleware,PaymentController.initiatePayment);

// service
router.post('/createservice', servicesController.createService);




export default router;





