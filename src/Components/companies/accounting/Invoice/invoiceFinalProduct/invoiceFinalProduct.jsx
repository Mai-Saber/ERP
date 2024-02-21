import React, { useState, useEffect } from "react";

import NoData from "../../../../../common/noData/noData";
import Table from "../../../../../common/table/table";
import "../../../../../common/show modal/showModal.css";
import TableFilter from "../../../../../common/tableFilter/tableFilter";
import Loading from "../../../../../common/loading/loading";
import WrongMessage from "../../../../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../../../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import { Link } from "react-router-dom";

function InvoiceFinalProducts(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [invoiceID, setInvoiceID] = useState(props.invoiceIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [invoiceFinalProduct, setInvoiceFinalProduct] = useState([]);
  const [totalInvoicesLength, setTotalInvoicesLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [newInvoiceFinalProduct, setNewInvoiceFinalProduct] = useState({
    client_id: clientID,
    company_id: companyID,
    invoice_id: invoiceID,
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
    // getInvoiceFinalProducts
    const getInvoiceFinalProducts = async () => {
      try {
        const url = `${base_url}/admin/company/accounting/invoice-final-products/${invoiceID}`;
        await axios
          .get(url)
          .then((res) => {
            setLoading(false);
            console.log("res", res.data.data);
            setColumnsHeader(["Id", "Invoice Name", "Invoice Tax"]);
            setInvoiceFinalProduct(res.data.data);
            setTotalInvoicesLength(res.data.meta?.total);
          })
          .catch((err) => {
            // loading
            setTimeout(function () {
              setLoading(false);
            }, 3000);

            setWrongMessage(true);
          });
      } catch (err) {
        console.log(err);
      }
    };
    // call functions
    getInvoiceFinalProducts();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newInvoiceFinalProduct,
      [e.target.name]: e.target.value,
    };
    setNewInvoiceFinalProduct(newData);
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
        `${base_url}/admin/company/accounting/invoice-final-products/${invoiceID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setInvoiceFinalProduct(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async ({ id, value }) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/accounting/invoice-final-product/${id}`,
        config
      );
      const newRow = invoiceFinalProduct.filter((item) => item.id !== id);
      setInvoiceFinalProduct(newRow); // setRow(filterItems);
      Toastify({
        text: `${value} deleted `,
        style: {
          background: "green",
          color: "white",
        },
      }).showToast();
    } else {
      Toastify({
        text: `${value} haven't deleted `,
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
      client_id: newInvoiceFinalProduct.client_id,
      company_id: newInvoiceFinalProduct.company_id,
      invoice_id: newInvoiceFinalProduct.invoice_id,
      final_products: [
        {
          category_id: newInvoiceFinalProduct.category_id,
          product_id: newInvoiceFinalProduct.product_id,
          final_product_id: newInvoiceFinalProduct.final_product_id,
          measurement_unit_id: newInvoiceFinalProduct.measurement_unit_id,
          unit_price: newInvoiceFinalProduct.unit_price,
          count: newInvoiceFinalProduct.count,
        },
      ],
    };

    await axios
      .post(`${base_url}/admin/company/accounting/invoice-final-product`, data)
      .then((res) => {
        Toastify({
          text: `Invoice created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        invoiceFinalProduct.unshift(res.data.data);
        setNewInvoiceFinalProduct({
          client_id: clientID,
          company_id: companyID,
          invoice_id: invoiceID,
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
      `${base_url}/admin/company/accounting/invoice-final-product/${id}`,
      config
    );
    setSelectedItem(res.data.data);
  };

  // close any modal
  const handleClose = () => {
    setShowModal(false);
    setAddModal(false);
  };
  // ////////////////////////////////////////
  return (
    <>
      {/* loading spinner*/}
      {loading && <Loading></Loading>}

      {/* variants */}
      {!loading && !wrongMessage && (
        <div className="invoiceFinalProducts">
          {/* header */}
          <h1 className="header">{t("invoiceFinalProducts")}</h1>
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
          {invoiceFinalProduct.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalInvoicesLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {invoiceFinalProduct?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.value}</td>

                  {/* icons */}
                  <td className="icons">
                    {/* delete */}
                    <Link
                      className="delete"
                      to=""
                      onClick={() => handleDelete(item?.id, item?.name)}
                    >
                      <i className="ri-delete-bin-2-fill"></i>
                    </Link>
                    {/* show */}
                    <Link
                      className="show"
                      to=""
                      onClick={() => handleShow(item?.id)}
                    >
                      <i className="ri-eye-line"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <NoData data="Invoice Final Products" />
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
            newInvoiceFinalProduct={newInvoiceFinalProduct}
            companyID={companyID}
            handleClose={handleClose}
            handleChange={handleChange}
            handleSubmitAdd={handleSubmitAdd}
          />
        </div>
      )}
      {/* wrong message */}
      {!loading && wrongMessage && <WrongMessage />}
    </>
  );
}

export default InvoiceFinalProducts;
