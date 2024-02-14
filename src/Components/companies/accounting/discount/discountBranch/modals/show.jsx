import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

function ModalShow(props) {
  const { t } = useTranslation();

  return (
    <Modal className="showModal" show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton className="header">
        <Modal.Title>{t("DiscountBranch")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          <span className="label">{t("DiscountName")} : </span>
          {props.item?.discount?.name}
        </p>
        <p>
          <span className="label">{t("DiscountID")} : </span>
          {props.item?.discount?.id}
        </p>
        <p>
          <span className="label">{t("Id")} : </span> {props.item?.id}
        </p>
        <p>
          <span className="label">{t("Details")} : </span>
          {props.item?.discount?.details}
        </p>

        <p>
          <span className="label">{t("DateFrom")} : </span>
          {props.item?.discount?.date_from}
        </p>

        <p>
          <span className="label">{t("DateTo")} : </span>
          {props.item?.discount?.date_to}
        </p>
        <p>
          <span className="label">{t("DiscountPercentage")} : </span>
          {props.item?.discount?.dicount_percentage}
        </p>

        <hr />
        <h3>{t("CompanyDetails")}</h3>
        <p>
          <span className="label">{t("CompanyName")} : </span>
          {props.item?.company?.name}
        </p>
        <p>
          <span className="label">{t("CompanyId")} : </span>
          {props.item?.company?.id}
        </p>
        <p>
          <span className="label"> {t("ClientId")} : </span>
          {props.item?.company?.client_id}
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={props.handleClose}
          className="close btn btn-danger"
        >
          {t("Close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalShow;
