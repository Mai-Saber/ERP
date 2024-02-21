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

function RefundFinalProducts(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [refundID, setRefundID] = useState(props.refundIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [refundFinalProducts, setRefundFinalProducts] = useState([]);
  const [totalRefundsLength, setTotalRefundsLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [newRefundFinalProducts, setNewRefundFinalProducts] = useState({
    client_id: clientID,
    company_id: companyID,
    refund_id: refundID,

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
    // getRefundFinalProducts
    const getRefundFinalProducts = async () => {
      try {
        const url = `${base_url}/admin/company/accounting/refund-final-products/${refundID}`;
        await axios
          .get(url)
          .then((res) => {
            setLoading(false);
            console.log("res", res.data.data);
            setColumnsHeader(["Id", "Invoice Name", "Invoice Tax"]);
            setRefundFinalProducts(res.data.data);
            setTotalRefundsLength(res.data.meta?.total);
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
    getRefundFinalProducts();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newRefundFinalProducts,
      [e.target.name]: e.target.value,
    };
    setNewRefundFinalProducts(newData);
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
        `${base_url}/admin/company/accounting/refund-final-products/search/${refundID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setRefundFinalProducts(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async ({ id, value }) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/accounting/refund-final-product/${id}`,
        config
      );
      const newRow = refundFinalProducts.filter((item) => item.id !== id);
      setRefundFinalProducts(newRow); // setRow(filterItems);
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
      client_id: newRefundFinalProducts.clientID,
      company_id: newRefundFinalProducts.companyID,
     refund_id:newRefundFinalProducts.refund_id,
      final_products: [
        {
          category_id: newRefundFinalProducts.category_id,
          product_id: newRefundFinalProducts.product_id,
          final_product_id: newRefundFinalProducts.final_product_id,
          measurement_unit_id: newRefundFinalProducts.measurement_unit_id,
          unit_price: newRefundFinalProducts.unit_price,
          count: newRefundFinalProducts.count,
        },
      ],
    };


    await axios
      .post(`${base_url}/admin/company/accounting/refund-final-product`, data)
      .then((res) => {
        Toastify({
          text: `refund created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        refundFinalProducts.unshift(res.data.data);
        setNewRefundFinalProducts({
          client_id: clientID,
          company_id: companyID,
          refund_id: refundID,

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
      `${base_url}/admin/company/accounting/refund-final-product/${id}`,
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
        <div className="refundFinalProducts">
          {/* header */}
          <h1 className="header">{t("RefundFinalProducts")}</h1>
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
          {refundFinalProducts.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalRefundsLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {refundFinalProducts?.map((item, i) => (
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
            <NoData data="Refund Final products" />
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
            newRefundFinalProducts={newRefundFinalProducts}
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

export default RefundFinalProducts;
