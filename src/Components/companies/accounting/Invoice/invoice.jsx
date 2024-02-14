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

function Invoice(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [totalInvoicesLength, setTotalInvoicesLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newInvoices, setNewInvoices] = useState({
    client_id: clientID,
    company_id: companyID,
    branch_id: "",
    employee_id: "",
    contact_id: "",
    type_id: "",
    payment_type_id: "",
    payment_method_id: "",
    name: "",
    details: "",

    category_id: "",
    product_id: "",
    final_product_id: "",
    measurement_unit_id: "",
    unit_price: "",
    count: "",
    tax_ids: [],

    additional_cost_id: "",
    value: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    console.log("Invoices page");
    // get Invoices
    const getInvoices = async () => {
      const url = `${base_url}/admin/company/accounting/invoices/${companyID}`;
      await axios
        .get(url)
        .then((res) => {
          setLoading(false);
          setColumnsHeader(["Id", "Company Name", "Name"]);
          setInvoices(res.data.data);
          setTotalInvoicesLength(res.data.meta?.total);
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
      ...newInvoices,
      [e.target.name]: e.target.value,
    };
    setNewInvoices(newData);

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
        `${base_url}/admin/company/accounting/invoices/search/${companyID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setInvoices(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/accounting/invoice/${id}`,
        config
      );
      const newRow = invoices.filter((item) => item.id !== id);
      setInvoices(newRow); // setRow(filterItems);
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
      client_id: newInvoices.clientID,
      company_id: newInvoices.companyID,
      branch_id: newInvoices.branch_id,
      employee_id: newInvoices.employee_id,
      contact_id: newInvoices.contact_id,
      type_id: newInvoices.type_id,
      payment_type_id: newInvoices.payment_type_id,
      payment_method_id: newInvoices.payment_method_id,
      name: newInvoices.name,
      details: newInvoices.details,
      final_products: [
        {
          category_id: newInvoices.category_id,
          product_id: newInvoices.product_id,
          final_product_id: newInvoices.final_product_id,
          measurement_unit_id: newInvoices.measurement_unit_id,
          unit_price: newInvoices.unit_price,
          count: newInvoices.count,
        },
      ],
      tax_ids: newInvoices.tax_ids,
      additional_costs: [
        {
          additional_cost_id: newInvoices.additional_cost_id,
          value: newInvoices.value,
        },
      ],
    };

    await axios
      .post(`${base_url}/admin/company/accounting/invoice`, data)
      .then((res) => {
        Toastify({
          text: `invoice created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        invoices.unshift(res.data.data);
        setNewInvoices({
          client_id: clientID,
          company_id: companyID,
          branch_id: "",
          employee_id: "",
          contact_id: "",
          type_id: "",
          payment_type_id: "",
          payment_method_id: "",
          name: "",
          details: "",
          final_products: [
            {
              category_id: "",
              product_id: "",
              final_product_id: "",
              measurement_unit_id: "",
              unit_price: 10,
              count: 100,
            },
          ],
          tax_ids: [],
          additional_costs: [
            {
              additional_cost_id: "",
              value: "",
            },
          ],
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
      `${base_url}/admin/company/accounting/invoice/${id}`,
      config
    );
    setSelectedItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(
      `${base_url}/admin/company/accounting/invoice/${id}`
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
      .patch(`${base_url}/admin/company/accounting/invoice/${id}`, data)
      .then((res) => {
        Toastify({
          text: `invoices updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < invoices.length; i++) {
          if (invoices[i].id === id) {
            invoices[i] = res.data.data;
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
        <div className="invoices">
          {/* header */}
          <h1 className="header">{t("Invoices")}</h1>
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
          {invoices.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalInvoicesLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {invoices?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>

                  <td className="name">{item.company?.name}</td>
                  <td>{item.name}</td>
                  <td>{item.details}</td>

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
            <NoData data="Invoices" />
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
            newInvoices={newInvoices}
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

export default Invoice;
