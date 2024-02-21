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
  const [contacts, setContacts] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const getContacts = async () => {
      await axios
        .get(`${base_url}/admin/company/contacts/${props.companyID}`)
        .then((res) => {
          setContacts(res.data.data);

          console.log("res", res);
        })
        .catch((err) => console.log(err));
    };

    const getTypes = async () => {
      await axios
        .get(`${base_url}/admin/company/contacts/${props.companyID}`)
        .then((res) => {
          setTypes(res.data.data);

          console.log("res", res);
        })
        .catch((err) => console.log(err));
    };

    getContacts();
    getTypes();
  }, []);

  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title>{t("EditInvoice")}</Modal.Title>
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
          {/* contact */}
          <InputLabel id="demo-simple-select-label">{t("contact")} </InputLabel>
          <Select
            className="input"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="contact_id"
            value={props.editItem?.contact_id}
            label={t("contact")}
            onChange={props.handleChange}
          >
            {contacts?.map((el) => (
              <MenuItem key={el.id} value={el.id}>
                {t(el.name)}
              </MenuItem>
            ))}
          </Select>

          {/* type_id */}
          <InputLabel id="demo-simple-select-label">{t("type_id")} </InputLabel>
          <Select
            className="input"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="type_id"
            value={props.editItem?.type_id}
            label={t("type")}
            onChange={props.handleChange}
          >
            {types?.map((el) => (
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
