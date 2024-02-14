import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function Buttons(props) {
  const { t } = useTranslation();

  return (
    <td>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Go to</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Go to"
        >
          <MenuItem value="contacts">
            <Link
              to="/companies/contacts"
              className="btn"
              onClick={() =>
                props.handleContacts(props.item.id, props.item?.client_id)
              }
            >
              {t("Contacts")}
            </Link>
          </MenuItem>
          {/* /// */}
          <MenuItem value="PriceList">
            <Link
              to="/companies/priceList"
              className="btn"
              onClick={() =>
                props.handlePriceList(props.item.id, props.item?.client_id)
              }
            >
              {t("PriceList")}
            </Link>
          </MenuItem>
          {/* /// */}
          <MenuItem value="variants">
            <Link
              to="/companies/variants"
              className="btn"
              onClick={() =>
                props.handleVariant(props.item.id, props.item?.client_id)
              }
            >
              {t("Variants")}
            </Link>
          </MenuItem>
          {/* //// */}
          <MenuItem value="branches">
            <Link
              to="/companies/branches"
              className="btn"
              onClick={() =>
                props.handleBranches(props.item?.id, props.item?.client_id)
              }
            >
              {t("Branches")}
            </Link>
          </MenuItem>
          {/* //// */}
          <MenuItem value="employee">
            <Link
              to="/companies/employee"
              className="btn"
              onClick={() =>
                props.handleEmployee(props.item?.id, props.item?.client_id)
              }
            >
              {t("Employee")}
            </Link>
          </MenuItem>
          {/* /// */}
          <MenuItem value="categories">
            <Link
              to="/companies/categories"
              className="btn"
              onClick={() =>
                props.handleCategories(props.item?.id, props.item?.client_id)
              }
            >
              {t("Categories")}
            </Link>
          </MenuItem>
          {/* /// */}
          <MenuItem value="bankAccount">
            <Link
              to="/companies/bankAccount"
              className="btn"
              onClick={() =>
                props.handleBankAccount(props.item?.id, props.item?.client_id)
              }
            >
              {t("BankAccount")}
            </Link>
          </MenuItem>
          {/* /// */}
          <MenuItem value="cashBox">
            <Link
              to="/companies/cashBox"
              className="btn"
              onClick={() =>
                props.handleCashBox(props.item?.id, props.item?.client_id)
              }
            >
              {t("CashBox")}
            </Link>
          </MenuItem>
          {/* /// */}
          <MenuItem value="tax">
            <Link
              to="/companies/tax"
              className="btn"
              onClick={() =>
                props.handleTax(props.item?.id, props.item?.client_id)
              }
            >
              {t("Tax")}
            </Link>
          </MenuItem>
          {/* /// */}
          <MenuItem value="additionalBox">
            <Link
              to="/companies/additionalBox"
              className="btn"
              onClick={() =>
                props.handleAdditionalBox(props.item?.id, props.item?.client_id)
              }
            >
              {t("AdditionalBox")}
            </Link>
          </MenuItem>
          {/* /// */}
          <MenuItem value="measurementUnit">
            <Link
              to="/companies/measurementUnit"
              className="btn"
              onClick={() =>
                props.handleMeasurementUnit(
                  props.item?.id,
                  props.item?.client_id
                )
              }
            >
              {t("MeasurementUnit")}
            </Link>
          </MenuItem>
          {/* /// */}
          <MenuItem value="discount">
            <Link
              to="/companies/discount"
              className="btn"
              onClick={() =>
                props.handleDiscount(props.item?.id, props.item?.client_id)
              }
            >
              {t("Discount")}
            </Link>
          </MenuItem>
          {/* /// */}
          <MenuItem value="invoices">
            <Link
              to="/companies/invoices"
              className="btn"
              onClick={() =>
                props.handleInvoices(props.item?.id, props.item?.client_id)
              }
            >
              {t("Invoices")}
            </Link>
          </MenuItem>
        </Select>
      </FormControl>
    </td>
  );
}

export default Buttons;
