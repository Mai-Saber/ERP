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

function ModalAdd(props) {
  const { t } = useTranslation();
  const [tax, setTax] = useState([]);

  useEffect(() => {
    const getTax = async () => {
      await axios
        .get(`${base_url}/admin/company/accounting/taxes/${props.companyID}`)
        .then((res) => {
          setTax(res.data.data);
          console.log("tax", res.data.data);
        })
        .catch((err) => console.log(err));
    };
    getTax();
  }, []);

  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title> {t("AddNewInvoiceTax")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="post">
          {/* tax_ids */}
          <InputLabel id="demo-simple-select-label">{t("Tax")}</InputLabel>
          <Select
            className="input"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="tax_ids"
            value={props.newInvoiceTax?.tax_ids}
            label={t("Tax")}
            onChange={props.handleChange}
          >
            {tax?.map((el) => (
              <MenuItem key={el.id} value={el.id}>
                {t(el.name)}
              </MenuItem>
            ))}
          </Select>
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
