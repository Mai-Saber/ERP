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
  const [additionalCost, setAdditionalCost] = useState([]);

  useEffect(() => {
   const getAdditionalCost = async () => {
     await axios
       .get(
         `${base_url}/admin/company/accounting/additional-costs/${props.companyID}`
       )
       .then((res) => {
         setAdditionalCost(res.data.data);
         console.log("setAdditionalCost", res.data.data);
       })
       .catch((err) => console.log(err));
   };
    getAdditionalCost();
  }, []);

  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title> {t("AddNewInvoiceAdditionalCost")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="post">
          {/* AdditionalCost */}
          <InputLabel id="demo-simple-select-label">
            {t("AdditionalCost")}
          </InputLabel>
          <Select
            className="input"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="additional_cost_id"
            value={props.newInvoiceAdditionalCost?.additional_cost_id}
            label={t("AdditionalCost")}
            onChange={props.handleChange}
          >
            {additionalCost?.map((el) => (
              <MenuItem key={el.id} value={el.id}>
                {t(el.name)}
              </MenuItem>
            ))}
          </Select>
          {/* value */}
          <TextField
            autoFocus
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="number"
            label={t("value")}
            name="value"
            value={props.newInvoiceAdditionalCost?.value}
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
