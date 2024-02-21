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

function ModalEdit(props) {
  const { t } = useTranslation();
  const [warehouse, setWarehouse] = useState([]);

  useEffect(() => {
    const getWareHouse = async () => {
      await axios
        .get(`${base_url}/admin/company/branch/warehouses/${props.companyID}`)
        .then((res) => {
          setWarehouse(res.data.data);

          console.log("res", res);
        })
        .catch((err) => console.log(err));
    };
    getWareHouse();
  }, []);

  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title>{t("EditTransport")}</Modal.Title>
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
            value={props.editItem?.name}
            onChange={props.handleChange}
          />

          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Details")}
            name="details"
            value={props.editItem?.details}
            onChange={props.handleChange}
          />
          {/* from */}
          <InputLabel id="demo-simple-select-label">{t("from warehouse")} </InputLabel>
          <Select
            className="input"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="from_warehouse_id"
            value={props.editItem?.from_warehouse_id}
            label={t("from warehouse")}
            onChange={props.handleChange}
          >
            {warehouse?.map((el) => (
              <MenuItem key={el.id} value={el.id}>
                {t(el.name)}
              </MenuItem>
            ))}
          </Select>
          {/* to */}
          <InputLabel id="demo-simple-select-label">{t("to warehouse")} </InputLabel>
          <Select
            className="input"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="to_warehouse_id"
            value={props.editItem?.to_warehouse_id}
            label={t("to warehouse")}
            onChange={props.handleChange}
          >
            {warehouse?.map((el) => (
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
          onClick={() => props.handleSubmitEdit(props.editItem?.id)}
        >
          {t("Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalEdit;
