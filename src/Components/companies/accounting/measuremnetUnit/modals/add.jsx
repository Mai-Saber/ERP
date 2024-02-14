import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { TextField } from "@mui/material";
import { base_url } from "../../../../../service/service";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function ModalAdd(props) {
    const { t } = useTranslation();
     const [units, setUnits] = useState([]);

     useEffect(() => {
       const getCLients = async () => {
         await axios
           .get(
             `${base_url}/admin/company/measurement-units/${props.companyID}`
           )
           .then((res) => {
             setUnits(res.data.data);

             console.log("res", res);
           })
           .catch((err) => console.log(err));
       };

       getCLients();
     }, []);

  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title> {t("AddNewMeasurementUnit")}</Modal.Title>
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
            value={props.newMeasurementUnit?.name}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="number"
            label={t("Equals")}
            name="equals"
            value={props.newMeasurementUnit?.equals}
            onChange={props.handleChange}
          />
          <InputLabel id="demo-simple-select-label">
            {t("Minimize measurement Unit")}{" "}
          </InputLabel>
          <Select
            className="input"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="minimize_measurement_unit_id"
            value={props.newMeasurementUnit?.minimize_measurement_unit_id}
            label={t("Minimize measurement Unit")}
            onChange={props.handleChange}
          >
            {units?.map((el) => (
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
