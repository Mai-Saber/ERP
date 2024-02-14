import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import Login from "./Components/login/login";
import NavBar from "./Components/navBar/navBar";
import SideBar from "./Components/sideBar/sideBar";
import Countries from "./Components/countries/countries";
import User from "./Components/user/user";
import Clients from "./Components/clients/clients";
import Companies from "./Components/companies/companies/companies";
import NotFound from "./Components/notFound/notFound";
import Branches from "./Components/companies/branches/branches";
import Variants from "./Components/companies/variants/variants/variants";
import Governorate from "./Components/Governorates/Governorates";
import Categories from "./Components/companies/categories/categories";
import Contact from "./Components/companies/contact/contact";
import WareHouse from "./Components/companies/branches/wareHouse/wareHouse";
import FinalProductVariantValues from "./Components/companies/categories/product/finalProduct/variantValue/variantValues";
import FinalProductImages from "./Components/companies/categories/product/finalProduct/images/images";
import VariantValue from "./Components/companies/variants/variantsValue/variantsValue";
import BankAccount from "./Components/companies/accounting/bankAccount/bankAccount";
import Tax from "./Components/companies/accounting/tax/tax";
import CashBox from "./Components/companies/accounting/cashBox/cashBox";
import AdditionalCost from "./Components/companies/accounting/additionalCost/additionalCost";
import FinalProduct from "./Components/companies/categories/product/finalProduct/finalProduct";
import Product from "./Components/companies/categories/product/product";
import PriceList from "./Components/companies/priceList/priceList/priceList";
import { PriceListProduct } from "./Components/companies/priceList/priceListProduct/priceListProduct";
import MeasurementUnit from "./Components/companies/accounting/measuremnetUnit/measurementUnit";
import Discount from "./Components/companies/accounting/discount/discount";
import DiscountFinalProduct from "./Components/companies/accounting/discount/discountFinalProduct/discountFinalProduct";
import DiscountBranch from "./Components/companies/accounting/discount/discountBranch/discountBranch";
import Employee from "./Components/companies/employee/employee";
import "./common/language/language.css";
import i18n from "./common/language/i18n";
import AllRoutes from "./common/routes/allRoutes";
import "animate.css";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "toastify-js/src/toastify.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
// /////////////////////////////////////////
const token = sessionStorage.getItem("token");

axios.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("interceptor request error :(", error);
  }
);
/*///////////*/
axios.interceptors.response.use(null, (error) => {
  if (error.message === "Request failed with status code 401") {
    Toastify({
      text: `Error الحقوناااااي `,
      style: {
        background: "red",
        color: "white",
      },

      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      draggablePercent: 0,
    }).showToast();

    // setTimeout(function () {
    //   window.location = "/login";
    // }, 8000);
  }
  return Promise.reject(error);
});

////////////////////////////////////////////

function App() {
  const [countryId, setCountryId] = useState("");
  const [companyID, setCompanyId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [clientId, setClientId] = useState("");
  const [productId, setProductId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [finalProductId, setFinalProductId] = useState("");
  const [priceListId, setPriceListId] = useState("");
  const [discountId, setDiscountId] = useState("");

  useEffect(() => {
    const dir = i18n.dir(i18n.lng);
    document.getElementsByTagName("html")[0].setAttribute("dir", dir);
  }, [i18n, i18n.lng]);

  const handleGovernorate = (id) => {
    setCountryId(id);
  };

  const handleBranches = (id, clientId) => {
    setCompanyId(id);
    setClientId(clientId);
  };
  const handleEmployee = (id, clientId) => {
    setCompanyId(id);
    setClientId(clientId);
  };
  const handleBankAccount = (id, clientId) => {
    setCompanyId(id);
    setClientId(clientId);
  };
  const handleTax = (id, clientId) => {
    setCompanyId(id);
    setClientId(clientId);
  };
  const handleAdditionalBox = (id, clientId) => {
    setCompanyId(id);
    setClientId(clientId);
  };
  const handleCashBox = (id, clientId) => {
    setCompanyId(id);
    setClientId(clientId);
  };
  const handleMeasurementUnit = (id, clientId) => {
    setCompanyId(id);
    setClientId(clientId);
  };

  const handlePriceList = (id, clientId) => {
    setCompanyId(id);
    setClientId(clientId);
  };

  const handleVariant = (id, clientId) => {
    setCompanyId(id);
    setClientId(clientId);
  };

  const handleVariantsValue = (id, clientId, companyID) => {
    console.log(id, clientId, companyID);
    setVariantId(id);
    setClientId(clientId);
    setCompanyId(companyID);
  };

  const handlePriceListProduct = (id, clientId, companyID) => {
    setPriceListId(id);
    setClientId(clientId);
    setCompanyId(companyID);
  };

  const handleWareHouse = (id, companyID, clientId) => {
    console.log("handleWareHouse", `id:${id}`, `client:${clientId}`, companyID);
    setBranchId(id);
    setClientId(clientId);
    setCompanyId(companyID);
  };

  const handleProducts = (id, clientId, companyID) => {
    console.log(id, clientId, companyID);
    setCategoryId(id);
    setClientId(clientId);
    setCompanyId(companyID);
  };

  const handleFinalProducts = (id, categoryId, clientId, companyID) => {
    console.log(id, categoryId, clientId, companyID);
    setProductId(id);
    setCategoryId(categoryId);
    setClientId(clientId);
    setCompanyId(companyID);
  };

  const handleFinalProductsVariantValue = (id, companyID) => {
    setFinalProductId(id);
    setCompanyId(companyID);
  };
  const handleFinalProductImage = (id) => {
    setFinalProductId(id);
  };

  const handleCategories = (id, clientId) => {
    setCompanyId(id);
    setClientId(clientId);
  };

  const handleContacts = (id, clientId) => {
    console.log(`id:${id}`, `client:${clientId}`);
    setCompanyId(id);
    setClientId(clientId);
  };

  const handleSideBar = () => {
    if (window.innerWidth < 900) {
      document.getElementById("side").classList.toggle("disable");
    }
  };
  // discount
  const handleDiscount = (id, clientId) => {
    setCompanyId(id);
    setClientId(clientId);
  };
  const handleDiscountFinalProduct = (id, clientId, companyID) => {
    console.log(id, clientId, companyID);
    setDiscountId(id);
    setClientId(clientId);
    setCompanyId(companyID);
  };
  const handleDiscountBranch = (id, clientId, companyID) => {
    console.log(id, clientId, companyID);
    setDiscountId(id);
    setClientId(clientId);
    setCompanyId(companyID);
  };

  //////////////////////////////////////////////////
  return (
    <div className="app">
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" exact element={<Login />} />
        </Routes>
        {/* ///////////////*/}
        {sessionStorage.getItem("token") && (
          <div className="appContent">
            {window.location.pathname.trim() === "/" || (
              <NavBar handleSideBar={handleSideBar} />
            )}
            <div className="layout">
              <SideBar id="side" handleSideBar={handleSideBar} />

              <main className="main">
                <PrimeReactProvider>
                  <AllRoutes
                    countriesEle={
                      <Countries handleGovernorate={handleGovernorate} />
                    }
                    ///
                    companiesEle={
                      <Companies
                        handleVariant={handleVariant}
                        handleBranches={handleBranches}
                        handleEmployee={handleEmployee}
                        handleCategories={handleCategories}
                        handlePriceList={handlePriceList}
                        handleContacts={handleContacts}
                        handleBankAccount={handleBankAccount}
                        handleTax={handleTax}
                        handleAdditionalBox={handleAdditionalBox}
                        handleCashBox={handleCashBox}
                        handleMeasurementUnit={handleMeasurementUnit}
                        handleDiscount={handleDiscount}
                        // handleInvoices={handleInvoices}
                      />
                    }
                    ///
                    // variant & value
                    variantsEle={
                      <Variants
                        handleVariantValue={handleVariantsValue}
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    variantsValueEle={
                      <VariantValue
                        variantIdInApp={variantId}
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    ///
                    // price list & 's product
                    priceListEle={
                      <PriceList
                        handlePriceListProduct={handlePriceListProduct}
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    priceListProductEle={
                      <PriceListProduct
                        priceListIdInApp={priceListId}
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    ///
                    contactsEle={
                      <Contact
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    ///
                    bankAccountEle={
                      <BankAccount
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    ///
                    ///
                    taxEle={
                      <Tax
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    ///
                    ///
                    cashBoxEle={
                      <CashBox
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    ///
                    additionalBoxEle={
                      <AdditionalCost
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    ///
                    measurementUnitEle={
                      <MeasurementUnit
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    ///
                    // discount& invoice
                    discountEle={
                      <Discount
                        handleDiscountFinalProduct={handleDiscountFinalProduct}
                        handleDiscountBranch={handleDiscountBranch}
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    discountFinalProductEle={
                      <DiscountFinalProduct
                        discountIDInApp={discountId}
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    discountBranchEle={
                      <DiscountBranch
                        discountIDInApp={discountId}
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    // /
                    employeeEle={
                      <Employee
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    ///
                    // branch & ware house
                    branchesEle={
                      <Branches
                        handleWareHouse={handleWareHouse}
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    wareHouseEle={
                      <WareHouse
                        branchIdInApp={branchId}
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    ///
                    // categories & product & final product
                    categoriesEle={
                      <Categories
                        handleProducts={handleProducts}
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    productEle={
                      <Product
                        handleFinalProducts={handleFinalProducts}
                        categoryIdInApp={categoryId}
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    finalProductEle={
                      <FinalProduct
                        handleFinalProductsVariantValue={
                          handleFinalProductsVariantValue
                        }
                        handleFinalProductImage={handleFinalProductImage}
                        productIdInApp={productId}
                        categoryIdInApp={categoryId}
                        companyIDInApp={companyID}
                        clientIdInApp={clientId}
                      />
                    }
                    finalProductVariantValueEle={
                      <FinalProductVariantValues
                        finalProductIDInApp={finalProductId}
                        companyIDInApp={companyID}
                      />
                    }
                    finalProductImages={
                      <FinalProductImages
                        finalProductIDInApp={finalProductId}
                      />
                    }
                    ///
                    governorateEle={<Governorate countryInApp={countryId} />}
                    userEle={<User />}
                    clientsEle={<Clients />}
                    notFoundEle={<NotFound />}
                  />
                </PrimeReactProvider>
              </main>
            </div>
          </div>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
