import React, { useState, useEffect } from "react";

import Table from "../../../../common/table/table";
import TableFilter from "../../../../common/tableFilter/tableFilter";
import "../../../../common/show modal/showModal.css";
import Loading from "../../../../common/loading/loading";
import TableIcons from "../../../../common/tableIcons/tableIcons";
import NoData from "../../../../common/noData/noData";
import WrongMessage from "../../../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";
import { Link } from "react-router-dom";

function Refund(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [totalRefundsLength, setTotalRefundsLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newRefund, setNewRefund] = useState({
    client_id: clientID,
    company_id: companyID,
    invoice_id: "",
    branch_id: "",
    contact_id: "",
    type_id: "",
    name: "",
    details: "",

    category_id: "",
    product_id: "",
    final_product_id: "",
    measurement_unit_id: "",
    unit_price: "",
    count: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    console.log("refund page");
    // get Invoices
    const getInvoices = async () => {
      const url = `${base_url}/admin/company/accounting/refunds/${companyID}`;
      await axios
        .get(url)
        .then((res) => {
          setLoading(false);
          setColumnsHeader(["Id", "Company Name", "Name"]);
          setRefunds(res.data.data);
          setTotalRefundsLength(res.data.meta?.total);
        })
        .catch((err) => {
          console.log("err", err);
          // loading
          setTimeout(function () {
            setLoading(false);
          }, 3000);

          setWrongMessage(true);
        });
    };
    // call functions
    getInvoices();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newRefund,
      [e.target.name]: e.target.value,
    };
    setNewRefund(newData);

    const newItem = {
      ...editItem,
      [e.target.name]: e.target.value,
    };
    setEditItem(newItem);
  };

  // search & filter & pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchRequestControls, setSearchRequestControls] = useState({
    queryString: "",
    filterType: "",
    pageNumber: "",
    perPage: "",
  });

  const onPageChange = (e) => {
    setRowsPerPage(e.rows);
    setPageNumber(e.page + 1);

    handleSearchReq(e, {
      perPage: e.rows,
      pageNumber: e.page + 1,
    });
  };

  const handleSearchReq = async (
    e,
    { queryString, filterType, perPage, pageNumber }
  ) => {
    try {
      setSearchRequestControls({
        queryString: queryString,
        filterType: filterType,
        pageNumber: pageNumber,
        perPage: perPage,
      });

      const res = await axios.get(
        `${base_url}/admin/company/accounting/refunds/search/${companyID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setRefunds(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/accounting/refund/${id}`,
        config
      );
      const newRow = refunds.filter((item) => item.id !== id);
      setRefunds(newRow); // setRow(filterItems);
      Toastify({
        text: `${name} deleted `,
        style: {
          background: "green",
          color: "white",
        },
      }).showToast();
    } else {
      Toastify({
        text: `${name} haven't deleted `,
        style: {
          background: "orange",
          color: "white",
        },
      }).showToast();
    }
  };

  // add
  const handleAdd = () => {
    setAddModal(true);
  };

  const handleSubmitAdd = async () => {
    const data = {
      client_id: newRefund.clientID,
      company_id: newRefund.companyID,
      branch_id: newRefund.branch_id,
      invoice_id: newRefund.invoice_id,
      contact_id: newRefund.contact_id,
      type_id: newRefund.type_id,
      name: newRefund.name,
      details: newRefund.details,
      final_products: [
        {
          category_id: newRefund.category_id,
          product_id: newRefund.product_id,
          final_product_id: newRefund.final_product_id,
          measurement_unit_id: newRefund.measurement_unit_id,
          unit_price: newRefund.unit_price,
          count: newRefund.count,
        },
      ],
    };

    await axios
      .post(`${base_url}/admin/company/accounting/refund`, data)
      .then((res) => {
        Toastify({
          text: `refund created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        refunds.unshift(res.data.data);
        setNewRefund({
          client_id: clientID,
          company_id: companyID,
          invoice_id: "",
          branch_id: "",
          contact_id: "",
          type_id: "",
          name: "",
          details: "",

          category_id: "",
          product_id: "",
          final_product_id: "",
          measurement_unit_id: "",
          unit_price: "",
          count: "",
        });
        setAddModal(false);
      })
      .catch((err) => {
        console.log("err", err.response.data.message);
        Toastify({
          text: `${err.response.data.message}`,
          style: {
            background: "red",
            color: "white",
          },
        }).showToast();
      });
  };

  // show
  const handleShow = async (id) => {
    setShowModal(true);
    const res = await axios.get(
      `${base_url}/admin/company/accounting/refund/${id}`,
      config
    );
    setSelectedItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(
      `${base_url}/admin/company/accounting/refund/${id}`
    );
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      contact_id: editItem.contact_id,
      type_id: editItem.type_id,
      name: editItem.name,
      details: editItem.details,
    };
    await axios
      .patch(`${base_url}/admin/company/accounting/refund/${id}`, data)
      .then((res) => {
        Toastify({
          text: `refund updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < refunds.length; i++) {
          if (refunds[i].id === id) {
            refunds[i] = res.data.data;
          }
        }
        setEditItem({});
        setEditModal(false);
      })
      .catch((err) => {
        Toastify({
          text: `${err.response.data.message}`,
          style: {
            background: "red",
            color: "white",
          },
        }).showToast();
      });
  };

  // close any modal
  const handleClose = () => {
    setShowModal(false);
    setAddModal(false);
    setEditModal(false);
  };
  // ////////////////////////////////////////
  return (
    <>
      {/* loading spinner*/}
      {loading && <Loading></Loading>}

      {/* branches */}
      {!loading && !wrongMessage && (
        <div className="refund">
          {/* header */}
          <h1 className="header">{t("Refunds")}</h1>
          {/* upper table */}
          <TableFilter
            handleAdd={handleAdd}
            inputName="queryString"
            inputValue={searchRequestControls.queryString}
            handleChangeSearch={(e) =>
              handleSearchReq(e, { queryString: e.target.value })
            }
          />
          {/* table */}
          {refunds.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalRefundsLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {refunds?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>

                  <td className="name">{item.company?.name}</td>
                  <td>{item.name}</td>
                  <td>{item.details}</td>

                  {/* buttons */}
                  {/* refundFinalProduct  */}
                  <td>
                    <Link
                      to="/companies/refund/refundFinalProduct"
                      className="btn btn-primary"
                      onClick={() =>
                        props.handleRefundFinalProduct(
                          item?.id,
                          item?.client_id,
                          item?.company_id
                        )
                      }
                    >
                      {t("RefundFinalProduct")}
                    </Link>
                  </td>

                  {/* icons */}
                  <TableIcons
                    item={item}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    handleShow={handleShow}
                  />
                </tr>
              ))}
            </Table>
          ) : (
            <NoData data="Refunds" />
          )}
          {/* modals */}
          {/* show modal */}
          <ModalShow
            show={showModal}
            handleClose={handleClose}
            item={selectedItem}
          />
          {/* add modal */}
          <ModalAdd
            show={addModal}
            handleClose={handleClose}
            newRefund={newRefund}
            companyID={companyID}
            handleChange={handleChange}
            handleSubmitAdd={handleSubmitAdd}
          />
          {/* edit modal */}
          <ModalEdit
            show={editModal}
            handleClose={handleClose}
            editItem={editItem}
            handleChange={handleChange}
            handleSubmitEdit={handleSubmitEdit}
          />
        </div>
      )}
      {/* wrong message */}
      {!loading && wrongMessage && <WrongMessage />}
    </>
  );
}

export default Refund;
