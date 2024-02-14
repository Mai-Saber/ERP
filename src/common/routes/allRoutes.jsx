import React from "react";
import { Route, Routes } from "react-router-dom";

function AllRoutes(props) {
  return (
    <Routes>
      <Route path="/countries" element={props.countriesEle} />
      ,
      <Route path="/governorate" element={props.governorateEle} />
      ,
      <Route path="/companies" element={props.companiesEle} />
      ,
      <Route path="/users" element={props.userEle} />
      ,
      <Route path="/clients" element={props.clientsEle} />
      ,
      <Route path="/companies/contacts" element={props.contactsEle} />,
      {/* variant */}
      <Route path="/companies/variants" element={props.variantsEle} />
      ,
      <Route
        path="/companies/variants/values"
        element={props.variantsValueEle}
      />
      {/* price list */}
      ,
      <Route path="/companies/priceList" element={props.priceListEle} />
      ,
      <Route
        path="/companies/priceList/priceListProduct"
        element={props.priceListProductEle}
      />,
      <Route path="/companies/employee" element={props.employeeEle} />
      ,{/* branches & ware house */}
      <Route path="/companies/branches" element={props.branchesEle} />
      ,
      <Route
        path="/companies/branches/wareHouse"
        element={props.wareHouseEle}
      />
      ,{/* accounting */}
      <Route path="/companies/bankAccount" element={props.bankAccountEle} />
      ,
      <Route path="/companies/tax" element={props.taxEle} />
      ,
      <Route path="/companies/cashBox" element={props.cashBoxEle} />
      ,
      <Route path="/companies/additionalBox" element={props.additionalBoxEle} />
      ,
      <Route
        path="/companies/measurementUnit"
        element={props.measurementUnitEle}
      />
      ,{/* discount */}
      <Route path="/companies/discount" element={props.discountEle} />
      ,
      <Route
        path="/companies/discount/discountFinalProduct"
        element={props.discountFinalProductEle}
      />
      ,
      <Route
        path="/companies/discount/discountBranch"
        element={props.discountBranchEle}
      />
      ,{/* invoice */}
      <Route path="/companies/invoices" element={props.InvoiceEle} />,
      {/* categories & product& final product */}
      <Route path="/companies/categories" element={props.categoriesEle} />
      ,
      <Route path="/companies/category/product" element={props.productEle} />,
      {/* final product & value & img */}
      <Route
        path="/companies/category/product/finalProduct"
        element={props.finalProductEle}
      />
      ,
      <Route
        path="/companies/category/product/finalProduct/variantValue"
        element={props.finalProductVariantValueEle}
      />
      ,
      <Route
        path="/companies/category/product/finalProduct/images"
        element={props.finalProductImages}
      />
      {/* not found */}
      ,
      <Route path="*" element={props.notFoundEle} />
    </Routes>
  );
}

export default AllRoutes;
