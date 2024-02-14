import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { base_url } from "../../../../../../service/service";

function ModalAdd(props) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [finalProducts, setFinalProducts] = useState([]);

  useEffect(() => {
      const getCategories = async () => {
        console.log("id", props?.companyID)
      await axios
        .get(`${base_url}/admin/company/categories/${props?.companyID}`)
        .then((res) => {
          setCategories(res.data.data);
          console.log("Categoriesss", res.data.data);
        })
        .catch((err) => console.log(err));
    };

    getCategories();
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
          {/* category & product & final */}
          <Row>
            {/* category */}
            <Col xs={4}>
              <InputLabel id="demo-simple-select-label">
                {t("Category")}{" "}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="category_id"
                value={props.newDiscountFinalProduct?.category_id}
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
            <Col xs={4}>
              <InputLabel id="demo-simple-select-label">
                {t("Product")}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="product_id"
                value={props.newDiscountFinalProduct?.product_id}
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
            <Col xs={4}>
              <InputLabel id="demo-simple-select-label">
                {t("FinalProduct")}{" "}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="final_product_id"
                value={props.newDiscountFinalProduct?.final_product_id}
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
