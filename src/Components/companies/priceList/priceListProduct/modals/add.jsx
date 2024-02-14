import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { TextField } from "@mui/material";
import { base_url } from "../../../../../service/service";
import axios from "axios";

function ModalAdd(props) {
  const { t } = useTranslation();

 
   
  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title> {t("AddNewPriceListProduct")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="post">
          <TextField
            autoFocus
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("final_product_id")}
            name="final_product_id"
            value={props.newPriceListProduct?.final_product_id}
            onChange={props.handleChange}
          />
          <TextField
            autoFocus
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Price")}
            name="price"
            value={props.newPriceListProduct?.price}
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
          onClick={props.handleSubmitAddPriceListProduct}
        >
          {t("Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAdd;
