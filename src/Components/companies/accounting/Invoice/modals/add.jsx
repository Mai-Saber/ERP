import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { TextField } from "@mui/material";
import { base_url } from "../../../../../service/service";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function ModalAdd(props) {
  const { t } = useTranslation();
   const [categories, setCategories] = useState([]);
   const [branches, setBranches] = useState([]);
   const [products, setProducts] = useState([]);
   const [finalProducts, setFinalProducts] = useState([]);

   useEffect(() => {
     const getCategories = async () => {
       await axios
         .get(`${base_url}/admin/company/categories/${props.companyID}`)
         .then((res) => {
           setCategories(res.data.data);
           console.log("Categories", res.data.data);
         })
         .catch((err) => console.log(err));
     };

     const getBranches = async () => {
       await axios
         .get(`${base_url}/admin/company/branches/${props.companyID}`)
         .then((res) => {
           setBranches(res.data.data);

           console.log("res", res);
         })
         .catch((err) => console.log(err));
     };

     getCategories();
     getBranches();
   }, []);
 const getProducts = async (e) => {
   console.log("mmm", e?.target.value);
   await axios
     .get(`${base_url}/admin/company/category/products/${e?.target.value}`)
     .then((res) => {
       setProducts(res?.data.data);
     })
     .catch((err) => console.log(err));
 };

 const getFinalProducts = async (e) => {
   console.log("mmm", e?.target.value);
   await axios
     .get(
       `${base_url}/admin/company/category/product/final-products/${e?.target.value}`
     )
     .then((res) => {
       setFinalProducts(res?.data.data);
       console.log("FinalProducts", res.data.data);
     })
     .catch((err) => console.log(err));
 };

  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title> {t("AddNewBankAccount")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="post">
          {/* branch */}
            <InputLabel id="demo-simple-select-label">{t("Branch")}</InputLabel>
            <Select
              className="input"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="branch_ids"
              value={props.newDiscount?.branch_ids}
              label={t("Branch")}
              onChange={props.handleChange}
            >
              {branches?.map((el) => (
                <MenuItem key={el.id} value={el.id}>
                  {t(el.name)}
                </MenuItem>
              ))}
            </Select>
{/*  */}
          <TextField
            autoFocus
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Name")}
            name="name"
            value={props.newBankAccount?.name}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Details")}
            name="details"
            value={props.newBankAccount?.details}
            onChange={props.handleChange}
          />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="close btn btn-danger"
          variant="secondary"
          onClick={props.handleClose}
        >
          {t("Close")}
        </Button>
        <Button
          className="btn btn-primary"
          variant="primary"
          onClick={props.handleSubmitAddBankAccount}
        >
          {t("Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAdd;
