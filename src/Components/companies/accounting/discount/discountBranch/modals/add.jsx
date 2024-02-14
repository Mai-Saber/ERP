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
  const [branches, setBranches] = useState([]);

  useEffect(() => {
     const getBranches = async () => {
       await axios
         .get(`${base_url}/admin/company/branches/${props.companyID}`)
         .then((res) => {
           setBranches(res.data.data);

           console.log("res", res);
         })
         .catch((err) => console.log(err));
     };

    getBranches();
  }, []);



  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title> {t("AddNewDiscount")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="post">
          <Row>
            {/* branch */}
            <Col xs={12}>
              <InputLabel id="demo-simple-select-label">
                {t("Branch")}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="branch_ids"
                value={props.newDiscountBranch?.branch_ids}
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
