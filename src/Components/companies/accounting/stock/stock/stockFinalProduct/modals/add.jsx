import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { TextField } from "@mui/material";
import axios from "axios";
import { base_url } from "../../../../../../service/service";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Col, Row } from "react-bootstrap";

function ModalAdd(props) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [measurementUnit, setMeasurementUnit] = useState([]);
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
    const getMeasurementUnits = async () => {
      await axios
        .get(`${base_url}/admin/company/measurement-units/${props.companyID}`)
        .then((res) => {
          setMeasurementUnit(res.data.data);
          console.log("Categories", res.data.data);
        })
        .catch((err) => console.log(err));
    };

    getCategories();
    getMeasurementUnits();
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
        <Modal.Title> {t("AddNewStocksFinalProducts")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="post">
          {/* category & product & final product */}
          <Row>
            {/* category */}
            <Col xs={3}>
              <InputLabel id="demo-simple-select-label">
                {t("Category")}{" "}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="category_id"
                value={props.newStockFinalProducts?.category_id}
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
            <Col xs={3}>
              <InputLabel id="demo-simple-select-label">
                {t("Product")}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="product_id"
                value={props.newStockFinalProducts?.product_id}
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
            {/* finalProduct */}
            <Col xs={3}>
              <InputLabel id="demo-simple-select-label">
                {t("FinalProduct")}{" "}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="final_product_id"
                value={props.newStockFinalProducts?.final_product_id}
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
          </Row>
          {/*  measurement_unit_id*/}
          <InputLabel id="demo-simple-select-label">
            {t("MeasurementUnit")}
          </InputLabel>
          <Select
            className="input"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="measurement_unit_id"
            value={props.newStockFinalProducts?.measurement_unit_id}
            label={t("MeasurementUnit")}
            onChange={props.handleChange}
          >
            {measurementUnit?.map((el) => (
              <MenuItem key={el.id} value={el.id}>
                {t(el.name)}
              </MenuItem>
            ))}
          </Select>
          {/* unit_price */}
          <TextField
            autoFocus
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("UnitPrice")}
            name="unit_price"
            value={props.newStockFinalProducts?.unit_price}
            onChange={props.handleChange}
          />
          {/* count */}
          <TextField
            autoFocus
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("count")}
            name="count"
            value={props.newStockFinalProducts?.count}
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
          onClick={props.handleSubmitAdd}
        >
          {t("Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAdd;
