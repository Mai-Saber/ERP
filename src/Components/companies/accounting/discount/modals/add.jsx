import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { TextField } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { base_url } from "../../../../../service/service";

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
        <Modal.Title> {t("AddNewDiscount")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="post">
          <TextField
            autoFocus
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Name")}
            name="name"
            value={props.newDiscount?.name}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Details")}
            name="details"
            value={props.newDiscount?.details}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="date"
            label={t("DateFrom")}
            name="date_from"
            value={props.newDiscount?.date_from}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="date"
            label={t("DateTo")}
            name="date_to"
            value={props.newDiscount?.date_to}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="number"
            label={t("DiscountPercentage")}
            name="dicount_percentage"
            value={props.newDiscount?.dicount_percentage}
            onChange={props.handleChange}
          />
          {/* category & product */}
          <Row>
            {/* category */}
            <Col xs={6}>
              <InputLabel id="demo-simple-select-label">
                {t("CategoryId")}{" "}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="category_id"
                value={props.newDiscount?.category_id}
                label={t("Category")}
                onChange={(e) => {
                  getProducts(e);
                  props.handleChange(e);
                }}
              >
                {categories?.map((el) => (
                  <MenuItem key={el.data.id} value={el.data.id}>
                    {t(el.data.name)}
                  </MenuItem>
                ))}
              </Select>
            </Col>
            {/* product */}
            <Col xs={6}>
              <InputLabel id="demo-simple-select-label">
                {t("Product")}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="product_id"
                value={props.newDiscount?.product_id}
                label={t("Product")}
                onChange={(e) => {
                  getFinalProducts(e);
                  props.handleChange(e);
                }}
              >
                {products?.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {t(el.name)}
                  </MenuItem>
                ))}
              </Select>
            </Col>
          </Row>

          {/* finalProduct & branch */}
          <Row>
            {/* finalProduct */}
            <Col xs={6}>
              <InputLabel id="demo-simple-select-label">
                {t("FinalProduct")}{" "}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="final_product_id"
                value={props.newDiscount?.final_product_id}
                label={t("FinalProduct")}
                onChange={props.handleChange}
              >
                {finalProducts?.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {t(el.details)}
                  </MenuItem>
                ))}
              </Select>
            </Col>

            {/* branch */}
            <Col xs={6}>
              <InputLabel id="demo-simple-select-label">
                {t("Branch")}
              </InputLabel>
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
            </Col>
          </Row>
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
          onClick={props.handleSubmitAdd}
        >
          {t("Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAdd;
